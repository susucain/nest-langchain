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
const storyboard_parser_service_1 = require("./storyboard-parser.service");
const video_task_service_1 = require("./video-task.service");
const config_1 = require("@nestjs/config");
let VideoToolsService = class VideoToolsService {
    assetRepo;
    scriptRepo;
    sessionRepo;
    storyboardParser;
    taskService;
    configService;
    skillsDir = process.env.SKILLS_DIR
        ? path.resolve(process.env.SKILLS_DIR)
        : path.resolve(process.cwd(), 'src/video/skills');
    constructor(assetRepo, scriptRepo, sessionRepo, storyboardParser, taskService, configService) {
        this.assetRepo = assetRepo;
        this.scriptRepo = scriptRepo;
        this.sessionRepo = sessionRepo;
        this.storyboardParser = storyboardParser;
        this.taskService = taskService;
        this.configService = configService;
    }
    buildTools(ctx) {
        return {
            read_file: this.buildReadFileTool(),
            write_file: this.buildWriteFileTool(),
            parse_asset: this.buildParseAssetTool(ctx),
            update_product_profile: this.buildUpdateProductProfileTool(ctx),
            generate_script: this.buildGenerateScriptTool(ctx),
            create_video_task: this.buildCreateVideoTaskTool(ctx),
        };
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
            description: '读取 skills 目录下的文件内容。路径相对于 skills 目录，例如 "life-service-storyboard-generator/references/shot-duration.md"。支持 .md / .json / .txt 等文本文件。',
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
        return (0, ai_1.tool)({
            description: '保存最终的分镜脚本。当你完成素材分析、确定视频类型和结构后，必须调用此工具（而不是在对话中输出 markdown）。工具会接收 storyboard_markdown、seedance_prompt 和 meta，自动解析为结构化数据并写入数据库。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                title: v4_1.z.string(),
                storyboard_markdown: v4_1.z.string(),
                seedance_prompt: v4_1.z.string(),
                meta: v4_1.z.object({
                    description: v4_1.z.string(),
                    hashtags: v4_1.z.array(v4_1.z.string()),
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
    buildCreateVideoTaskTool(ctx) {
        return (0, ai_1.tool)({
            description: '用户确认使用某个脚本生成视频时，提交视频生成任务到火山引擎 Seedance。',
            inputSchema: (0, ai_1.zodSchema)(v4_1.z.object({
                script_id: v4_1.z.number(),
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
                const callbackUrl = this.configService.get('APP_BASE_URL')
                    ? `${this.configService.get('APP_BASE_URL')}/video/callback`
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
    async getNextVersion(sessionId) {
        const latest = await this.scriptRepo.findOne({
            where: { sessionId },
            order: { version: 'DESC' },
        });
        return (latest?.version ?? 0) + 1;
    }
};
exports.VideoToolsService = VideoToolsService;
exports.VideoToolsService = VideoToolsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_asset_entity_1.VideoAsset)),
    __param(1, (0, typeorm_1.InjectRepository)(video_script_entity_1.VideoScript)),
    __param(2, (0, typeorm_1.InjectRepository)(video_session_entity_1.VideoSession)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        storyboard_parser_service_1.StoryboardParserService,
        video_task_service_1.VideoTaskService,
        config_1.ConfigService])
], VideoToolsService);
//# sourceMappingURL=video-tools.service.js.map