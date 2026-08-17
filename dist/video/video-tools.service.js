"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoToolsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ai_1 = require("ai");
const v4_1 = require("zod/v4");
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
const video_asset_entity_1 = require("./entities/video-asset.entity");
const video_script_entity_1 = require("./entities/video-script.entity");
const video_session_entity_1 = require("./entities/video-session.entity");
const video_task_entity_1 = require("./entities/video-task.entity");
const storyboard_parser_service_1 = require("./storyboard-parser.service");
const video_task_service_1 = require("./video-task.service");
const preset_avatars_1 = require("./preset-avatars");
const seedance_prompt_validator_service_1 = require("./seedance-prompt-validator.service");
let VideoToolsService = class VideoToolsService {
    assetRepo;
    scriptRepo;
    sessionRepo;
    taskRepo;
    storyboardParser;
    taskService;
    seedancePromptValidator;
    skillsDir = process.env.SKILLS_DIR
        ? path.resolve(process.env.SKILLS_DIR)
        : path.resolve(process.cwd(), 'src/video/skills');
    constructor(assetRepo, scriptRepo, sessionRepo, taskRepo, storyboardParser, taskService, seedancePromptValidator) {
        this.assetRepo = assetRepo;
        this.scriptRepo = scriptRepo;
        this.sessionRepo = sessionRepo;
        this.taskRepo = taskRepo;
        this.storyboardParser = storyboardParser;
        this.taskService = taskService;
        this.seedancePromptValidator = seedancePromptValidator;
    }
    buildTools(ctx) {
        return {
            start_script_creation: this.buildStartScriptCreationTool(),
            read_file: this.buildReadFileTool(),
            write_file: this.buildWriteFileTool(),
            parse_asset: this.buildParseAssetTool(ctx),
            update_product_profile: this.buildUpdateProductProfileTool(ctx),
            generate_script: this.buildGenerateScriptTool(ctx),
            complete_without_script_change: this.buildCompleteWithoutScriptChangeTool(ctx),
            request_user_confirmation: this.buildRequestUserConfirmationTool(ctx),
            create_video_task: this.buildCreateVideoTaskTool(ctx),
            get_script: this.buildGetScriptTool(ctx),
            list_scripts: this.buildListScriptsTool(ctx),
            get_video_task_status: this.buildGetVideoTaskStatusTool(ctx),
            get_session_state: this.buildGetSessionStateTool(ctx),
        };
    }
    buildStartScriptCreationTool() {
        return (0, ai_1.tool)({
            description: '开始一次分镜脚本创作流程。仅当用户明确要求生成、创作、重写或修改视频分镜脚本时调用，并且必须在解析创作素材、读取创作规范或生成脚本之前调用。普通问候、素材分析、商品画像更新、知识问答和视频生成任务不得调用。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({})),
            execute: async () => ({
                success: true,
                message: '已开始分镜脚本创作流程',
            }),
        });
    }
    buildRequestUserConfirmationTool(ctx) {
        return (0, ai_1.tool)({
            description: '当生成脚本或完整视频编辑任务缺少关键参数、存在不可自行推断的冲突，且必须等待用户确认后才能继续时调用。调用后停止本轮创作，不得调用 generate_script 或 create_video_task。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                title: v4_1.z.string().min(1).describe('过程面板中的确认事项标题'),
                description: v4_1.z.string().min(1).describe('需要确认的原因和已知约束'),
                questions: v4_1.z.array(v4_1.z.object({
                    field: v4_1.z.string().min(1).describe('待确认字段名'),
                    question: v4_1.z.string().min(1).describe('向用户提出的具体问题'),
                })).min(1).describe('需要用户回答的问题列表'),
            })),
            execute: async ({ title, description, questions }) => {
                ctx.waitingForUser = true;
                return {
                    success: true,
                    status: 'waiting_for_user',
                    title,
                    description,
                    questions,
                };
            },
        });
    }
    buildCompleteWithoutScriptChangeTool(ctx) {
        return (0, ai_1.tool)({
            description: '当用户要求修改已有脚本，但目标脚本的实际内容已经满足该要求时调用。调用后停止本轮脚本创作，不得调用 generate_script。必须先调用 get_script 读取目标脚本后才能调用。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                script_id: v4_1.z.number().int().positive().describe('已核对的现有脚本 ID'),
                description: v4_1.z.string().min(1).describe('说明哪一个镜头或内容已经满足用户要求'),
            })),
            execute: async ({ script_id, description }) => {
                const script = await this.scriptRepo.findOne({
                    where: { id: script_id, sessionId: ctx.sessionId, userId: ctx.userId },
                });
                if (!script) {
                    return { success: false, message: '目标脚本不存在或无权访问' };
                }
                ctx.scriptUnchanged = true;
                return {
                    success: true,
                    status: 'unchanged',
                    script_id: script.id,
                    version: script.version,
                    description,
                };
            },
        });
    }
    resolveSkillPath(relativePath) {
        const normalized = path.normalize(relativePath);
        const resolved = path.resolve(this.skillsDir, normalized);
        if (!resolved.startsWith(this.skillsDir + path.sep) && resolved !== this.skillsDir) {
            throw new Error(`路径越界：${relativePath} 不在 skills 目录内`);
        }
        return resolved;
    }
    buildReadFileTool() {
        return (0, ai_1.tool)({
            description: '读取 skills 目录下的文件内容。路径相对于 skills 目录，例如 "life-service-storyboard-generator/references/shot-duration.md" 或 "sd2-pe/SKILL.md"。支持 .md / .json / .txt 等文本文件。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                path: v4_1.z.string().describe('相对于 skills 目录的文件路径，例如 life-service-storyboard-generator/references/shot-duration.md'),
            })),
            execute: async ({ path: relativePath }) => {
                try {
                    const fullPath = this.resolveSkillPath(relativePath);
                    const content = await fs.readFile(fullPath, 'utf-8');
                    return { path: relativePath, content };
                }
                catch (err) {
                    return { path: relativePath, error: err.message ?? '文件读取失败' };
                }
            },
        });
    }
    buildWriteFileTool() {
        return (0, ai_1.tool)({
            description: '将内容写入 skills 目录下的文件。路径相对于 skills 目录，例如 "life-service-storyboard-generator/docs/storyboards/商家名/2026-01-01_12-00-00/storyboard.md"。如果父目录不存在会自动创建。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                path: v4_1.z.string().describe('相对于 skills 目录的文件路径'),
                content: v4_1.z.string().describe('要写入的文件内容'),
            })),
            execute: async ({ path: relativePath, content }) => {
                try {
                    const fullPath = this.resolveSkillPath(relativePath);
                    await fs.mkdir(path.dirname(fullPath), { recursive: true });
                    await fs.writeFile(fullPath, content, 'utf-8');
                    return { path: relativePath, bytes: Buffer.byteLength(content, 'utf-8'), success: true };
                }
                catch (err) {
                    return { path: relativePath, error: err.message ?? '文件写入失败', success: false };
                }
            },
        });
    }
    buildUpdateProductProfileTool(ctx) {
        return (0, ai_1.tool)({
            description: '当从对话中了解到商品信息（名称、卖点、目标人群、时长、平台、风格基调）后，更新会话的商品画像，供后续轮次作为结构化上下文使用',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                product_name: v4_1.z.string().optional().describe('商品名称'),
                selling_points: v4_1.z.array(v4_1.z.string()).optional().describe('核心卖点列表'),
                target_audience: v4_1.z.string().optional().describe('目标人群'),
                duration: v4_1.z.number().optional().describe('目标视频时长（秒）'),
                platform: v4_1.z.string().optional().describe('投放平台'),
                tone: v4_1.z.string().optional().describe('风格基调'),
            })),
            execute: async (profile) => {
                const session = await this.sessionRepo.findOne({ where: { sessionId: ctx.sessionId } });
                const incoming = Object.fromEntries(Object.entries(profile).filter(([, v]) => v !== undefined));
                const merged = { ...(session?.productProfile || {}), ...incoming };
                await this.sessionRepo.update({ sessionId: ctx.sessionId }, { productProfile: merged });
                return { success: true, profile: merged };
            },
        });
    }
    buildParseAssetTool(ctx) {
        return (0, ai_1.tool)({
            description: '解析用户上传的素材（图片/视频），将视觉信息摘要持久化用于跨轮上下文。仅用于 asset_purpose=analysis 的素材，asset_id 取自 system prompt 关联素材区的 # 编号。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                asset_id: v4_1.z.number().describe('素材 ID，来自关联素材区的 # 编号'),
                summary: v4_1.z.string().describe('素材内容摘要：画面描述、商品卖点、关键视觉特征'),
            })),
            execute: async ({ asset_id, summary }) => {
                await this.assetRepo.update({ id: asset_id, sessionId: ctx.sessionId, assetPurpose: 'analysis' }, { parsedContent: { summary }, status: 'parsed' });
                return { asset_id, summary, status: 'parsed' };
            },
        });
    }
    buildGenerateScriptTool(ctx) {
        const editSchema = v4_1.z.object({
            mode: v4_1.z.literal('full_video_edit'),
            sourceAssetId: v4_1.z.number().int().positive(),
            sourceDurationSec: v4_1.z.number().positive(),
            targetStartSec: v4_1.z.number().min(0),
            targetEndSec: v4_1.z.number().positive(),
            preserveAudio: v4_1.z.boolean(),
        });
        const editField = ctx.fullVideoEdit ? editSchema : editSchema.optional();
        return (0, ai_1.tool)({
            description: ctx.fullVideoEdit
                ? '当前请求已锁定为引用视频的完整视频编辑任务。meta.edit 为必填项，必须使用当前原视频素材和完整时长；用户未给出修改时间范围时应先追问，禁止保存普通分镜脚本。storyboard_markdown 必须包含可解析的任务镜头，格式为“### 镜头 1：视频局部编辑 (开始s - 结束s)”，并包含“画面描述”和“旁白”字段。调用前必须阅读 sd2-pe/SKILL.md 审查 seedance_prompt。'
                : '保存最终的分镜脚本，或保存基于已有视频的完整视频编辑任务。调用前必须阅读 sd2-pe/SKILL.md 审查 seedance_prompt。脚本重写时保存完整新脚本；完整视频编辑时 storyboard_markdown 仅包含可解析的视频编辑任务，seedance_prompt 必须要求输出原视频完整时长且仅修改目标时间段，meta.edit 必须提供原视频素材和时间范围。不得只在对话中输出提示词。工具会接收 storyboard_markdown、seedance_prompt 和 meta，自动解析为结构化数据并写入数据库。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                title: v4_1.z.string(),
                storyboard_markdown: v4_1.z.string(),
                seedance_prompt: v4_1.z.string(),
                meta: v4_1.z.object({
                    description: v4_1.z.string(),
                    hashtags: v4_1.z.array(v4_1.z.string()),
                    character: v4_1.z.object({
                        mode: v4_1.z.enum(['user_portrait', 'preset_avatar', 'none']),
                        roleName: v4_1.z.string().optional(),
                        rolePrompt: v4_1.z.string().optional(),
                        primaryAssetId: v4_1.z.number().int().positive().optional(),
                        presetAvatarId: v4_1.z.string().optional(),
                        presetAlias: v4_1.z.string().optional(),
                        selectionSource: v4_1.z.enum(['user_explicit', 'auto_selected', 'inherited']),
                    }),
                    edit: editField,
                }),
            })),
            execute: async ({ title, storyboard_markdown, seedance_prompt, meta }) => {
                if (ctx.waitingForUser || ctx.scriptUnchanged) {
                    return {
                        success: false,
                        message: ctx.waitingForUser
                            ? '本轮已等待用户确认，收到用户回复前不得保存脚本'
                            : '本轮已确认目标脚本无需修改，不得保存重复版本',
                    };
                }
                if (ctx.fullVideoEdit) {
                    if (!meta.edit || meta.edit.mode !== 'full_video_edit') {
                        return {
                            success: false,
                            message: '当前请求是引用视频修改，必须保存完整视频编辑任务并填写 meta.edit',
                        };
                    }
                    if (meta.edit.sourceAssetId !== ctx.fullVideoEdit.sourceAssetId
                        || meta.edit.sourceDurationSec !== ctx.fullVideoEdit.sourceDurationSec) {
                        return {
                            success: false,
                            message: '视频编辑任务必须使用当前引用的原视频和完整时长',
                        };
                    }
                }
                const validation = this.seedancePromptValidator.validate(seedance_prompt);
                if (validation.errors.length > 0) {
                    return {
                        success: false,
                        message: `Seedance 提示词未通过校验：${validation.errors.join('；')}`,
                        warnings: validation.warnings,
                    };
                }
                if (meta.character.mode === 'user_portrait') {
                    if (!meta.character.primaryAssetId || meta.character.presetAvatarId) {
                        return { success: false, message: '上传人像角色必须且只能绑定 primaryAssetId' };
                    }
                    const portraitAsset = await this.assetRepo.findOne({
                        where: {
                            id: meta.character.primaryAssetId,
                            sessionId: ctx.sessionId,
                            userId: ctx.userId,
                            assetType: 'image',
                        },
                    });
                    if (!portraitAsset) {
                        return { success: false, message: '主角色人像素材不存在或无权访问' };
                    }
                }
                else if (meta.character.mode === 'preset_avatar') {
                    if (!meta.character.presetAvatarId || meta.character.primaryAssetId
                        || !(0, preset_avatars_1.isPresetAvatarId)(meta.character.presetAvatarId)) {
                        return { success: false, message: '虚拟人像必须使用允许的预置人像 ID' };
                    }
                    if (meta.character.presetAlias !== (0, preset_avatars_1.getPresetAvatar)(meta.character.presetAvatarId).alias) {
                        return { success: false, message: '虚拟人像简称与预置人像 ID 不匹配' };
                    }
                }
                else if (meta.character.primaryAssetId || meta.character.presetAvatarId) {
                    return { success: false, message: '无人物脚本不能绑定人像素材' };
                }
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
                if (meta.edit && parsed.shots.length === 0) {
                    const time = `${meta.edit.targetStartSec}-${meta.edit.targetEndSec}s`;
                    const scene = '视频局部编辑';
                    parsed.shots = [{
                            shot: 1,
                            time,
                            scene,
                            visual: meta.description || `仅修改 ${time} 时间段，其余画面保持原视频不变`,
                            audio: meta.edit.preserveAudio ? '保留原视频音频' : '',
                        }];
                    parsed.hook = scene;
                    parsed.meta.duration = meta.edit.sourceDurationSec;
                }
                if (parsed.shots.length === 0) {
                    return {
                        success: false,
                        message: '脚本未包含可解析的镜头。请使用“### 镜头 1：名称 (0s - 3s)”及画面描述、旁白字段重新生成。',
                    };
                }
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
                    warnings: validation.warnings,
                };
            },
        });
    }
    buildCreateVideoTaskTool(ctx) {
        return (0, ai_1.tool)({
            description: '用户确认使用某个脚本生成视频时，提交视频生成任务到火山引擎 Seedance。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                script_id: v4_1.z.number(),
            })),
            execute: async ({ script_id }) => {
                if (ctx.waitingForUser) {
                    return {
                        success: false,
                        message: '本轮已等待用户确认，收到用户回复前不得提交视频生成任务',
                    };
                }
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
    buildGetScriptTool(ctx) {
        return (0, ai_1.tool)({
            description: '查询当前会话中已保存的脚本。用户询问某个脚本、历史版本、分镜内容或 Seedance 2.0 提示词时调用。未指定脚本时查询最新版本；查询已保存的完整 Seedance 2.0 提示词时，include 必须使用 seedance_prompt 或 full。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                script_id: v4_1.z.number().int().positive().optional().describe('脚本 ID；未提供时可按 version 或最新版本查询'),
                version: v4_1.z.number().int().positive().optional().describe('脚本版本号'),
                include: v4_1.z.enum(['summary', 'storyboard', 'seedance_prompt', 'full'])
                    .default('summary')
                    .describe('返回内容范围；用户明确要求提示词时使用 seedance_prompt 或 full'),
            })),
            execute: async ({ script_id, version, include }) => {
                let script;
                if (script_id) {
                    script = await this.scriptRepo.findOne({
                        where: { id: script_id, sessionId: ctx.sessionId, userId: ctx.userId },
                    });
                }
                else if (version) {
                    script = await this.scriptRepo.findOne({
                        where: { version, sessionId: ctx.sessionId, userId: ctx.userId },
                    });
                }
                else {
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
    buildListScriptsTool(ctx) {
        return (0, ai_1.tool)({
            description: '列出当前会话已保存的脚本版本。用户提到“上一版”“历史脚本”或需要在多个脚本中选择时调用；需要完整内容时再调用 get_script。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                limit: v4_1.z.number().int().min(1).max(20).default(10).describe('最多返回的脚本数量'),
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
    buildGetVideoTaskStatusTool(ctx) {
        return (0, ai_1.tool)({
            description: '查询当前会话的视频生成任务状态。用户询问视频是否生成完成、任务进度、结果视频或失败原因时调用。未指定 task_id 时优先返回最近的进行中任务，否则返回最近任务。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                task_id: v4_1.z.string().optional().describe('视频生成任务 ID；未提供时查询最近任务'),
            })),
            execute: async ({ task_id }) => {
                let task;
                if (task_id) {
                    task = await this.taskRepo.findOne({
                        where: { taskId: task_id, sessionId: ctx.sessionId, userId: ctx.userId },
                    });
                }
                else {
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
    buildGetSessionStateTool(ctx) {
        return (0, ai_1.tool)({
            description: '查询当前会话的持久化状态摘要，包括商品画像、最新脚本、最近视频任务和素材数量。用户询问“当前做到哪一步”“会话状态”或需要确认当前上下文时调用。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({})),
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
    async getNextVersion(sessionId) {
        const latest = await this.scriptRepo.findOne({
            where: { sessionId },
            order: { version: 'DESC' },
        });
        return (latest?.version ?? 0) + 1;
    }
    toISOString(value) {
        return value ? value.toISOString() : null;
    }
};
exports.VideoToolsService = VideoToolsService;
exports.VideoToolsService = VideoToolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_asset_entity_1.VideoAsset)),
    __param(1, (0, typeorm_1.InjectRepository)(video_script_entity_1.VideoScript)),
    __param(2, (0, typeorm_1.InjectRepository)(video_session_entity_1.VideoSession)),
    __param(3, (0, typeorm_1.InjectRepository)(video_task_entity_1.VideoTask)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        storyboard_parser_service_1.StoryboardParserService,
        video_task_service_1.VideoTaskService,
        seedance_prompt_validator_service_1.SeedancePromptValidatorService])
], VideoToolsService);
//# sourceMappingURL=video-tools.service.js.map