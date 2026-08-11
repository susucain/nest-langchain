import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { tool, zodSchema } from 'ai';
import { z } from 'zod/v4';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoSession } from './entities/video-session.entity';
import { VideoTask } from './entities/video-task.entity';
import { StoryboardParserService } from './storyboard-parser.service';
import { VideoTaskService } from './video-task.service';

interface ToolContext {
  sessionId: string;
  userId: number;
  currentMessageId?: number;
  referencedVersion?: number;
}

@Injectable()
export class VideoToolsService {
  /** skills 目录绝对路径，作为 read_file / write_file 的沙箱根 */
  private readonly skillsDir = process.env.SKILLS_DIR
    ? path.resolve(process.env.SKILLS_DIR)
    : path.resolve(process.cwd(), 'src/video/skills');

  constructor(
    @InjectRepository(VideoAsset)
    private assetRepo: Repository<VideoAsset>,
    @InjectRepository(VideoScript)
    private scriptRepo: Repository<VideoScript>,
    @InjectRepository(VideoSession)
    private sessionRepo: Repository<VideoSession>,
    @InjectRepository(VideoTask)
    private taskRepo: Repository<VideoTask>,
    private storyboardParser: StoryboardParserService,
    private taskService: VideoTaskService,
  ) {}

  buildTools(ctx: ToolContext) {
    return {
      start_script_creation: this.buildStartScriptCreationTool(),
      read_file: this.buildReadFileTool(),
      write_file: this.buildWriteFileTool(),
      parse_asset: this.buildParseAssetTool(ctx),
      update_product_profile: this.buildUpdateProductProfileTool(ctx),
      generate_script: this.buildGenerateScriptTool(ctx),
      create_video_task: this.buildCreateVideoTaskTool(ctx),
      get_script: this.buildGetScriptTool(ctx),
      list_scripts: this.buildListScriptsTool(ctx),
      get_video_task_status: this.buildGetVideoTaskStatusTool(ctx),
      get_session_state: this.buildGetSessionStateTool(ctx),
    };
  }

  private buildStartScriptCreationTool() {
    return tool({
      description:
        '开始一次分镜脚本创作流程。仅当用户明确要求生成、创作、重写或修改视频分镜脚本时调用，并且必须在解析创作素材、读取创作规范或生成脚本之前调用。普通问候、素材分析、商品画像更新、知识问答和视频生成任务不得调用。',
      inputSchema: zodSchema(z.object({})),
      execute: async () => ({
        success: true,
        message: '已开始分镜脚本创作流程',
      }),
    });
  }

  /** 将用户传入的相对路径解析为 skills 目录内的绝对路径，防止路径穿越 */
  private resolveSkillPath(relativePath: string): string {
    const normalized = path.normalize(relativePath);
    const resolved = path.resolve(this.skillsDir, normalized);
    if (!resolved.startsWith(this.skillsDir + path.sep) && resolved !== this.skillsDir) {
      throw new Error(`路径越界：${relativePath} 不在 skills 目录内`);
    }
    return resolved;
  }

  private buildReadFileTool() {
    return tool({
      description:
        '读取 skills 目录下的文件内容。路径相对于 skills 目录，例如 "life-service-storyboard-generator/references/shot-duration.md"。支持 .md / .json / .txt 等文本文件。',
      inputSchema: zodSchema(
        z.object({
          path: z.string().describe('相对于 skills 目录的文件路径，例如 life-service-storyboard-generator/references/shot-duration.md'),
        }),
      ),
      execute: async ({ path: relativePath }) => {
        try {
          const fullPath = this.resolveSkillPath(relativePath);
          const content = await fs.readFile(fullPath, 'utf-8');
          return { path: relativePath, content };
        } catch (err: any) {
          return { path: relativePath, error: err.message ?? '文件读取失败' };
        }
      },
    });
  }

  private buildWriteFileTool() {
    return tool({
      description:
        '将内容写入 skills 目录下的文件。路径相对于 skills 目录，例如 "life-service-storyboard-generator/docs/storyboards/商家名/2026-01-01_12-00-00/storyboard.md"。如果父目录不存在会自动创建。',
      inputSchema: zodSchema(
        z.object({
          path: z.string().describe('相对于 skills 目录的文件路径'),
          content: z.string().describe('要写入的文件内容'),
        }),
      ),
      execute: async ({ path: relativePath, content }) => {
        try {
          const fullPath = this.resolveSkillPath(relativePath);
          await fs.mkdir(path.dirname(fullPath), { recursive: true });
          await fs.writeFile(fullPath, content, 'utf-8');
          return { path: relativePath, bytes: Buffer.byteLength(content, 'utf-8'), success: true };
        } catch (err: any) {
          return { path: relativePath, error: err.message ?? '文件写入失败', success: false };
        }
      },
    });
  }

  private buildUpdateProductProfileTool(ctx: ToolContext) {
    return tool({
      description: '当从对话中了解到商品信息（名称、卖点、目标人群、时长、平台、风格基调）后，更新会话的商品画像，供后续轮次作为结构化上下文使用',
      inputSchema: zodSchema(z.object({
        product_name: z.string().optional().describe('商品名称'),
        selling_points: z.array(z.string()).optional().describe('核心卖点列表'),
        target_audience: z.string().optional().describe('目标人群'),
        duration: z.number().optional().describe('目标视频时长（秒）'),
        platform: z.string().optional().describe('投放平台'),
        tone: z.string().optional().describe('风格基调'),
      })),
      execute: async (profile) => {
        const session = await this.sessionRepo.findOne({ where: { sessionId: ctx.sessionId } });
        const incoming = Object.fromEntries(
          Object.entries(profile).filter(([, v]) => v !== undefined),
        );
        const merged = { ...(session?.productProfile || {}), ...incoming };
        await this.sessionRepo.update({ sessionId: ctx.sessionId }, { productProfile: merged });
        return { success: true, profile: merged };
      },
    });
  }

  private buildParseAssetTool(ctx: ToolContext) {
    return tool({
      description: '解析用户上传的素材（图片/视频），将视觉信息摘要持久化用于跨轮上下文。仅用于 asset_purpose=analysis 的素材，asset_id 取自 system prompt 关联素材区的 # 编号。',
      inputSchema: zodSchema(z.object({
        asset_id: z.number().describe('素材 ID，来自关联素材区的 # 编号'),
        summary: z.string().describe('素材内容摘要：画面描述、商品卖点、关键视觉特征'),
      })),
      execute: async ({ asset_id, summary }) => {
        await this.assetRepo.update(
          { id: asset_id, sessionId: ctx.sessionId, assetPurpose: 'analysis' },
          { parsedContent: { summary }, status: 'parsed' },
        );
        return { asset_id, summary, status: 'parsed' };
      },
    });
  }

  private buildGenerateScriptTool(ctx: ToolContext) {
    return tool({
      description: '保存最终的分镜脚本，或保存基于已有视频的完整视频编辑任务。脚本重写时保存完整新脚本；完整视频编辑时 storyboard_markdown 仅包含可解析的视频编辑任务，seedance_prompt 必须要求输出原视频完整时长且仅修改目标时间段，meta.edit 必须提供原视频素材和时间范围。不得只在对话中输出提示词。工具会接收 storyboard_markdown、seedance_prompt 和 meta，自动解析为结构化数据并写入数据库。',
      inputSchema: zodSchema(z.object({
        title: z.string(),
        storyboard_markdown: z.string(),
        seedance_prompt: z.string(),
        meta: z.object({
          description: z.string(),
          hashtags: z.array(z.string()),
          edit: z.object({
            mode: z.literal('full_video_edit'),
            sourceAssetId: z.number().int().positive(),
            sourceDurationSec: z.number().positive(),
            targetStartSec: z.number().min(0),
            targetEndSec: z.number().positive(),
            preserveAudio: z.boolean(),
          }).optional(),
        }),
      })),
      execute: async ({ title, storyboard_markdown, seedance_prompt, meta }) => {
        if (meta.edit) {
          if (meta.edit.targetStartSec >= meta.edit.targetEndSec
            || meta.edit.targetEndSec > meta.edit.sourceDurationSec) {
            return { success: false, message: '视频编辑时间范围无效' };
          }

          const sourceAsset = await this.assetRepo.findOne({
            where: {
              id: meta.edit.sourceAssetId,
              sessionId: ctx.sessionId,
              userId: ctx.userId,
              assetType: 'video',
            },
          });
          if (!sourceAsset) {
            return { success: false, message: '原视频素材不存在或无权访问' };
          }
        }

        const parsed = this.storyboardParser.parse(storyboard_markdown);
        const nextVersion = await this.getNextVersion(ctx.sessionId);

        const script = this.scriptRepo.create({
          sessionId: ctx.sessionId,
          userId: ctx.userId,
          version: nextVersion,
          title,
          hook: parsed.hook,
          shots: parsed.shots,
          scriptMarkdown: storyboard_markdown,
          seedancePrompt: seedance_prompt,
          meta: {
            ...parsed.meta,
            ...meta,
          },
          sourceMessageId: ctx.currentMessageId,
          basedOnVersion: ctx.referencedVersion,
          status: 'draft',
        });

        const saved = await this.scriptRepo.save(script);
        await this.sessionRepo.update({ sessionId: ctx.sessionId }, { status: 'script_generated' });

        return {
          script_id: saved.id,
          version: saved.version,
          title: saved.title,
          shot_count: parsed.shots.length,
          message: `脚本 V${saved.version} 已保存。`,
        };
      },
    });
  }

  private buildCreateVideoTaskTool(ctx: ToolContext) {
    return tool({
      description: '用户确认使用某个脚本生成视频时，提交视频生成任务到火山引擎 Seedance。',
      inputSchema: zodSchema(z.object({
        script_id: z.number(),
      })),
      execute: async ({ script_id }) => {
        const script = await this.scriptRepo.findOne({
          where: { id: script_id, sessionId: ctx.sessionId, userId: ctx.userId },
        });
        if (!script) {
          return { success: false, message: '脚本不存在或无权访问' };
        }

        const task = await this.taskService.createTaskByScriptId(script.id, {
          sessionId: ctx.sessionId,
          userId: ctx.userId,
        });

        await this.scriptRepo.update({ id: script.id }, { status: 'used_for_video' });
        await this.sessionRepo.update({ sessionId: ctx.sessionId }, { status: 'video_generating' });

        return {
          success: true,
          task_id: task.taskId,
          script_id: script.id,
          status: task.status,
          message: '视频生成任务已提交，正在排队处理。',
        };
      },
    });
  }

  private buildGetScriptTool(ctx: ToolContext) {
    return tool({
      description: '查询当前会话中已保存的脚本。用户询问某个脚本、历史版本、分镜内容或 Seedance 2.0 提示词时调用。未指定脚本时查询最新版本；查询已保存的完整 Seedance 2.0 提示词时，include 必须使用 seedance_prompt 或 full。',
      inputSchema: zodSchema(z.object({
        script_id: z.number().int().positive().optional().describe('脚本 ID；未提供时可按 version 或最新版本查询'),
        version: z.number().int().positive().optional().describe('脚本版本号'),
        include: z.enum(['summary', 'storyboard', 'seedance_prompt', 'full'])
          .default('summary')
          .describe('返回内容范围；用户明确要求提示词时使用 seedance_prompt 或 full'),
      })),
      execute: async ({ script_id, version, include }) => {
        let script: VideoScript | null;
        if (script_id) {
          script = await this.scriptRepo.findOne({
            where: { id: script_id, sessionId: ctx.sessionId, userId: ctx.userId },
          });
        } else if (version) {
          script = await this.scriptRepo.findOne({
            where: { version, sessionId: ctx.sessionId, userId: ctx.userId },
          });
        } else {
          script = await this.scriptRepo.findOne({
            where: { sessionId: ctx.sessionId, userId: ctx.userId },
            order: { version: 'DESC' },
          });
        }

        if (!script) {
          return { success: false, message: '未找到当前会话中的对应脚本。' };
        }

        const summary = {
          script_id: script.id,
          version: script.version,
          title: script.title,
          status: script.status,
          shot_count: script.shots.length,
          created_at: this.toISOString(script.createdAt),
        };

        if (include === 'summary') {
          return { success: true, script: summary };
        }
        if (include === 'storyboard') {
          return { success: true, script: { ...summary, storyboard_markdown: script.scriptMarkdown } };
        }
        if (include === 'seedance_prompt') {
          return { success: true, script: { ...summary, seedance_prompt: script.seedancePrompt } };
        }
        return {
          success: true,
          script: {
            ...summary,
            storyboard_markdown: script.scriptMarkdown,
            seedance_prompt: script.seedancePrompt,
            meta: script.meta,
          },
        };
      },
    });
  }

  private buildListScriptsTool(ctx: ToolContext) {
    return tool({
      description: '列出当前会话已保存的脚本版本。用户提到“上一版”“历史脚本”或需要在多个脚本中选择时调用；需要完整内容时再调用 get_script。',
      inputSchema: zodSchema(z.object({
        limit: z.number().int().min(1).max(20).default(10).describe('最多返回的脚本数量'),
      })),
      execute: async ({ limit }) => {
        const scripts = await this.scriptRepo.find({
          where: { sessionId: ctx.sessionId, userId: ctx.userId },
          order: { version: 'DESC' },
          take: limit,
        });

        return {
          success: true,
          scripts: scripts.map((script) => ({
            script_id: script.id,
            version: script.version,
            title: script.title,
            status: script.status,
            shot_count: script.shots.length,
            created_at: this.toISOString(script.createdAt),
          })),
        };
      },
    });
  }

  private buildGetVideoTaskStatusTool(ctx: ToolContext) {
    return tool({
      description: '查询当前会话的视频生成任务状态。用户询问视频是否生成完成、任务进度、结果视频或失败原因时调用。未指定 task_id 时优先返回最近的进行中任务，否则返回最近任务。',
      inputSchema: zodSchema(z.object({
        task_id: z.string().optional().describe('视频生成任务 ID；未提供时查询最近任务'),
      })),
      execute: async ({ task_id }) => {
        let task: VideoTask | null;
        if (task_id) {
          task = await this.taskRepo.findOne({
            where: { taskId: task_id, sessionId: ctx.sessionId, userId: ctx.userId },
          });
        } else {
          task = await this.taskRepo.findOne({
            where: { sessionId: ctx.sessionId, userId: ctx.userId, status: 'running' },
            order: { updatedAt: 'DESC' },
          }) ?? await this.taskRepo.findOne({
            where: { sessionId: ctx.sessionId, userId: ctx.userId, status: 'queued' },
            order: { updatedAt: 'DESC' },
          }) ?? await this.taskRepo.findOne({
            where: { sessionId: ctx.sessionId, userId: ctx.userId },
            order: { updatedAt: 'DESC' },
          });
        }

        if (!task) {
          return { success: false, message: '当前会话没有可查询的视频生成任务。' };
        }

        const script = task.scriptId
          ? await this.scriptRepo.findOne({
            where: { id: task.scriptId, sessionId: ctx.sessionId, userId: ctx.userId },
          })
          : null;

        return {
          success: true,
          task: {
            task_id: task.taskId,
            status: task.status,
            script_id: task.scriptId,
            script_version: script?.version,
            script_title: script?.title,
            model: task.model,
            duration: task.duration,
            resolution: task.resolution,
            ratio: task.ratio,
            generated_video_url: task.generatedVideoUrl,
            last_frame_url: task.lastFrameUrl,
            error_code: task.errorCode,
            error_message: task.errorMessage,
            created_at: this.toISOString(task.createdAt),
            updated_at: this.toISOString(task.updatedAt),
          },
        };
      },
    });
  }

  private buildGetSessionStateTool(ctx: ToolContext) {
    return tool({
      description: '查询当前会话的持久化状态摘要，包括商品画像、最新脚本、最近视频任务和素材数量。用户询问“当前做到哪一步”“会话状态”或需要确认当前上下文时调用。',
      inputSchema: zodSchema(z.object({})),
      execute: async () => {
        const [session, latestScript, activeTask, assets] = await Promise.all([
          this.sessionRepo.findOne({ where: { sessionId: ctx.sessionId, userId: ctx.userId } }),
          this.scriptRepo.findOne({
            where: { sessionId: ctx.sessionId, userId: ctx.userId },
            order: { version: 'DESC' },
          }),
          this.taskRepo.findOne({
            where: { sessionId: ctx.sessionId, userId: ctx.userId, status: 'running' },
            order: { updatedAt: 'DESC' },
          }),
          this.assetRepo.find({ where: { sessionId: ctx.sessionId, userId: ctx.userId } }),
        ]);
        const recentTask = activeTask ?? await this.taskRepo.findOne({
          where: { sessionId: ctx.sessionId, userId: ctx.userId },
          order: { updatedAt: 'DESC' },
        });

        if (!session) {
          return { success: false, message: '当前会话不存在或无权访问。' };
        }

        return {
          success: true,
          session: {
            session_id: session.sessionId,
            status: session.status,
            topic: session.topic,
            product_profile: session.productProfile,
            latest_script: latestScript ? {
              script_id: latestScript.id,
              version: latestScript.version,
              title: latestScript.title,
              status: latestScript.status,
            } : null,
            video_task: recentTask ? {
              task_id: recentTask.taskId,
              status: recentTask.status,
              script_id: recentTask.scriptId,
              generated_video_url: recentTask.generatedVideoUrl,
              error_message: recentTask.errorMessage,
              updated_at: this.toISOString(recentTask.updatedAt),
            } : null,
            assets: {
              total: assets.length,
              analysis: assets.filter((asset) => asset.assetPurpose === 'analysis').length,
              reference: assets.filter((asset) => asset.assetPurpose === 'reference').length,
            },
            updated_at: this.toISOString(session.updatedAt),
          },
        };
      },
    });
  }

  private async getNextVersion(sessionId: string): Promise<number> {
    const latest = await this.scriptRepo.findOne({
      where: { sessionId },
      order: { version: 'DESC' },
    });
    return (latest?.version ?? 0) + 1;
  }

  private toISOString(value: Date | null | undefined): string | null {
    return value ? value.toISOString() : null;
  }
}
