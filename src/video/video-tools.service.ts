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
import { StoryboardParserService } from './storyboard-parser.service';
import { VideoTaskService } from './video-task.service';
import { ConfigService } from '@nestjs/config';

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
    private storyboardParser: StoryboardParserService,
    private taskService: VideoTaskService,
    private configService: ConfigService,
  ) {}

  buildTools(ctx: ToolContext) {
    return {
      read_file: this.buildReadFileTool(),
      write_file: this.buildWriteFileTool(),
      parse_asset: this.buildParseAssetTool(ctx),
      update_product_profile: this.buildUpdateProductProfileTool(ctx),
      generate_script: this.buildGenerateScriptTool(ctx),
      create_video_task: this.buildCreateVideoTaskTool(ctx),
    };
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
      description: '保存最终的分镜脚本。当你完成素材分析、确定视频类型和结构后，必须调用此工具（而不是在对话中输出 markdown）。工具会接收 storyboard_markdown、seedance_prompt 和 meta，自动解析为结构化数据并写入数据库。',
      inputSchema: zodSchema(z.object({
        title: z.string(),
        storyboard_markdown: z.string(),
        seedance_prompt: z.string(),
        meta: z.object({
          description: z.string(),
          hashtags: z.array(z.string()),
        }),
      })),
      execute: async ({ title, storyboard_markdown, seedance_prompt, meta }) => {
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

        const referenceAssets = await this.assetRepo.find({
          where: { sessionId: ctx.sessionId, assetPurpose: 'reference', status: 'parsed' },
        });

        const imageUrls = referenceAssets
          .filter((a) => a.assetType === 'image')
          .map((a) => a.url);
        const videoUrls = referenceAssets
          .filter((a) => a.assetType === 'video')
          .map((a) => a.url);

        const callbackUrl = this.configService.get<string>('APP_BASE_URL')
          ? `${this.configService.get<string>('APP_BASE_URL')}/video/callback`
          : undefined;

        const task = await this.taskService.createTask({
          sessionId: ctx.sessionId,
          userId: ctx.userId,
          scriptId: script.id,
          prompt: script.seedancePrompt,
          imageUrls,
          videoUrls,
          callbackUrl,
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

  private async getNextVersion(sessionId: string): Promise<number> {
    const latest = await this.scriptRepo.findOne({
      where: { sessionId },
      order: { version: 'DESC' },
    });
    return (latest?.version ?? 0) + 1;
  }
}
