"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VideoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_1 = require("@opentelemetry/api");
const ai_1 = require("ai");
const video_session_entity_1 = require("./entities/video-session.entity");
const video_message_entity_1 = require("./entities/video-message.entity");
const video_asset_entity_1 = require("./entities/video-asset.entity");
const video_script_entity_1 = require("./entities/video-script.entity");
const video_llm_service_1 = require("./video-llm.service");
const skill_loader_service_1 = require("./skill-loader.service");
const storyboard_parser_service_1 = require("./storyboard-parser.service");
const video_tools_service_1 = require("./video-tools.service");
const video_task_service_1 = require("./video-task.service");
const process_tracker_1 = require("./process-tracker");
const RECENT_MESSAGE_LIMIT = 6;
const FALLBACK_USER_ID = 1;
let VideoService = VideoService_1 = class VideoService {
    sessionRepo;
    messageRepo;
    assetRepo;
    scriptRepo;
    llmService;
    skillLoader;
    storyboardParser;
    toolsService;
    taskService;
    logger = new common_1.Logger(VideoService_1.name);
    constructor(sessionRepo, messageRepo, assetRepo, scriptRepo, llmService, skillLoader, storyboardParser, toolsService, taskService) {
        this.sessionRepo = sessionRepo;
        this.messageRepo = messageRepo;
        this.assetRepo = assetRepo;
        this.scriptRepo = scriptRepo;
        this.llmService = llmService;
        this.skillLoader = skillLoader;
        this.storyboardParser = storyboardParser;
        this.toolsService = toolsService;
        this.taskService = taskService;
    }
    async ensureSession(sessionId, userId) {
        let session = await this.sessionRepo.findOne({ where: { sessionId } });
        if (!session) {
            session = this.sessionRepo.create({
                sessionId,
                userId: userId ?? FALLBACK_USER_ID,
                productProfile: {},
                status: 'active',
            });
            await this.sessionRepo.save(session);
        }
        return session;
    }
    async streamChat(sessionId, messages, options) {
        const session = await this.ensureSession(sessionId, options?.userId);
        const userId = session.userId;
        let currentMessageId;
        const lastUserMsg = messages.filter((m) => m.role === 'user').pop();
        if (lastUserMsg) {
            const saved = await this.saveUserMessage(sessionId, userId, lastUserMsg);
            currentMessageId = saved.id;
            if (!session.topic && saved.content) {
                const topic = saved.content.replace(/\s+/g, ' ').trim().slice(0, 30);
                await this.sessionRepo.update({ sessionId }, { topic });
                session.topic = topic;
            }
            else {
                await this.touchSession(sessionId);
            }
            const fileParts = (lastUserMsg.parts ?? []).filter((p) => p.type === 'file');
            if (fileParts.length > 0) {
                await Promise.all(fileParts.map((part) => {
                    const mediaType = part.mediaType ?? '';
                    return this.createAsset({
                        session_id: sessionId,
                        user_id: userId,
                        asset_type: mediaType.startsWith('video/')
                            ? 'video'
                            : mediaType.startsWith('image/')
                                ? 'image'
                                : 'url',
                        asset_purpose: part.purpose === 'reference' ? 'reference' : 'analysis',
                        name: part.filename ?? '附件素材',
                        url: part.url,
                    });
                }));
            }
        }
        const recentMessages = await this.getRecentUIMessages(sessionId, RECENT_MESSAGE_LIMIT);
        const allUiMessages = [...recentMessages];
        const modelMessages = await (0, ai_1.convertToModelMessages)(allUiMessages);
        const referencedScript = options?.referencedScriptId
            ? await this.scriptRepo.findOne({ where: { id: options.referencedScriptId, sessionId } })
            : null;
        const system = await this.buildSystemPrompt(session, referencedScript);
        const tools = this.toolsService.buildTools({
            sessionId,
            userId,
            currentMessageId,
            referencedVersion: referencedScript?.version,
        });
        const analysisAssets = await this.assetRepo.find({
            where: { sessionId, assetPurpose: 'analysis' },
            order: { createdAt: 'ASC' },
        });
        return (0, ai_1.createUIMessageStream)({
            originalMessages: allUiMessages,
            execute: async ({ writer }) => {
                const tracker = new process_tracker_1.ProcessTracker({
                    writer,
                    analysisAssets,
                    productProfile: session.productProfile,
                    isModification: !!referencedScript,
                });
                tracker.start();
                const tracer = api_1.trace.getTracer('langfuse-sdk');
                const rootSpan = tracer.startSpan('video-storyboard-chat');
                rootSpan.setAttribute('langfuse.trace.name', 'video-storyboard-chat');
                rootSpan.setAttribute('user.id', String(userId));
                rootSpan.setAttribute('session.id', sessionId);
                rootSpan.setAttribute('langfuse.trace.tags', JSON.stringify(['video-storyboard']));
                rootSpan.setAttribute('langfuse.trace.input', JSON.stringify({ sessionId, messages: modelMessages }));
                try {
                    this.logger.log(`当前会话消息: ${JSON.stringify(modelMessages)}`);
                    await api_1.context.with(api_1.trace.setSpan(api_1.context.active(), rootSpan), async () => {
                        const agent = new ai_1.ToolLoopAgent({
                            instructions: system,
                            model: this.llmService.getProvider()(this.llmService.getModel()),
                            tools,
                            stopWhen: (0, ai_1.isStepCount)(10),
                            telemetry: {
                                isEnabled: true,
                                functionId: 'video-storyboard-chat',
                                recordInputs: true,
                                recordOutputs: true,
                            },
                        });
                        const result = await agent.stream({ messages: modelMessages });
                        const toolCallMap = new Map();
                        const watchedStream = result.toUIMessageStream().pipeThrough(new TransformStream({
                            transform: (chunk, controller) => {
                                this.handleProcessChunk(chunk, tracker, toolCallMap);
                                controller.enqueue(chunk);
                            },
                        }));
                        const replyText = [];
                        for await (const chunk of watchedStream) {
                            if (chunk?.type === 'text-delta') {
                                const t = chunk.delta ?? chunk.text;
                                if (typeof t === 'string')
                                    replyText.push(t);
                            }
                            writer.write(chunk);
                        }
                        rootSpan.setAttribute('langfuse.trace.output', JSON.stringify({ reply: replyText.join('') }));
                        tracker.finish();
                    });
                }
                catch (err) {
                    this.logger.error(`创作过程流异常: ${err.message}`, err.stack);
                    rootSpan.recordException(err);
                    tracker.error();
                    throw err;
                }
                finally {
                    rootSpan.end();
                }
            },
            onEnd: async ({ messages: finalMessages }) => {
                const assistant = finalMessages.filter((m) => m.role === 'assistant').pop();
                if (assistant) {
                    await this.saveAssistantUIMessage(sessionId, userId, assistant);
                }
            },
        });
    }
    handleProcessChunk(chunk, tracker, toolCallMap) {
        if (chunk.type === 'tool-input-available') {
            const { toolCallId, toolName, input } = chunk;
            if (toolCallId && toolName) {
                toolCallMap.set(toolCallId, toolName);
            }
            if (!process_tracker_1.ProcessTracker.isGenerationTool(toolName))
                return;
            if (toolName === 'parse_asset' && input?.asset_id != null) {
                tracker.markAssetRunning(Number(input.asset_id));
            }
            else if (toolName === 'update_product_profile') {
                tracker.markProfileRunning();
            }
            else if (toolName === 'generate_script') {
                tracker.markGenerating();
            }
            else {
                tracker.recordActivity();
            }
            return;
        }
        if (chunk.type === 'tool-output-available') {
            const { toolCallId, output } = chunk;
            const toolName = toolCallMap.get(toolCallId);
            if (!toolName)
                return;
            if (toolName === 'parse_asset' && output?.asset_id != null) {
                tracker.markAssetParsed(Number(output.asset_id), output.summary ?? '已解析');
            }
            else if (toolName === 'update_product_profile') {
                tracker.markProfileUpdated(output?.profile);
            }
            else if (toolName === 'generate_script' && output) {
                tracker.markScriptGenerated({
                    title: output.title ?? '分镜脚本',
                    shot_count: output.shot_count ?? 0,
                    version: output.version ?? 1,
                });
            }
            else if (process_tracker_1.ProcessTracker.isGenerationTool(toolName)) {
                tracker.recordActivity();
            }
        }
    }
    async findHistoryBySessionId(sessionId) {
        const messages = await this.messageRepo.find({
            where: { sessionId },
            order: { createdAt: 'ASC' },
            take: 200,
        });
        return messages.map((m) => ({
            id: String(m.id),
            role: m.role,
            content: m.content || '',
            parts: (m.parts?.length ? m.parts : [{ type: 'text', text: m.content || '' }]),
            createdAt: m.createdAt,
            metadata: m.metadata ?? undefined,
        }));
    }
    async getRecentUIMessages(sessionId, limit) {
        const messages = await this.messageRepo.find({
            where: { sessionId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
        return messages
            .reverse()
            .map((m) => ({
            id: String(m.id),
            role: m.role,
            content: m.content || '',
            parts: (m.parts?.length ? m.parts : [{ type: 'text', text: m.content || '' }]),
            createdAt: m.createdAt,
            metadata: m.metadata ?? undefined,
        }));
    }
    async buildSystemPrompt(session, referencedScript) {
        const [skillMeta, assets] = await Promise.all([
            this.skillLoader.loadMeta(),
            this.assetRepo.find({ where: { sessionId: session.sessionId }, order: { createdAt: 'ASC' } }),
        ]);
        let prompt = `你是映语 AI 达人带货视频工作台。帮助用户为商品生成带货视频分镜脚本，并支持一键生成视频。\n`;
        prompt += `当前会话 ID：${session.sessionId}\n`;
        if (session.productProfile && Object.keys(session.productProfile).length > 0) {
            prompt += `\n## 商品画像\n${JSON.stringify(session.productProfile, null, 2)}\n`;
        }
        if (assets.length > 0) {
            prompt += `\n## 关联素材\n`;
            for (const asset of assets) {
                const summary = asset.assetPurpose === 'analysis'
                    ? (asset.parsedContent?.summary || '待解析（可调用 parse_asset 解析，asset_id 见 # 编号）')
                    : asset.url;
                prompt += `[${asset.assetPurpose}] #${asset.id} ${asset.assetType} - ${asset.name}: ${summary}\n`;
            }
        }
        if (referencedScript) {
            prompt += `\n## 待修改脚本（V${referencedScript.version}）\n${referencedScript.scriptMarkdown}\n`;
            prompt += `\n请基于以上脚本生成新版本 V${referencedScript.version + 1}，仅输出修改后的完整内容，不要 diff。\n`;
        }
        const skillContent = await this.skillLoader.loadFullContent();
        prompt += `\n## Skill: ${skillMeta.name}\n${skillContent}\n`;
        prompt += `\n## 📂 参考文件读取\n`;
        prompt += `Skill 中提到的参考文件位于 skills 目录下，你可以使用 **read_file** 工具按需读取。\n`;
        prompt += `路径格式：life-service-storyboard-generator/references/<文件名>，例如 \`life-service-storyboard-generator/references/shot-duration.md\`。\n`;
        prompt += `**按需读取**：只读取当前任务真正需要的文件，不要一次性读取所有文件。\n`;
        prompt += `\n## 输出约定（必须严格遵守）\n`;
        prompt += `1. Skill 中提到的「写入 storyboard.md / seedance_prompts.md / meta.md 文件」操作，请使用 **write_file** 工具写入到 \`life-service-storyboard-generator/docs/storyboards/{商家名}/{时间戳}/\` 目录下。同时仍需调用 generate_script 工具将结构化数据写入数据库。\n`;
        prompt += `2. 当你分析完素材并准备好分镜脚本后，**必须**调用 generate_script 工具保存结果。工具参数包括：title、storyboard_markdown、seedance_prompt、meta。禁止在对话文本中输出完整的分镜脚本或 Seedance 提示词。\n`;
        prompt += `3. storyboard_markdown 必须严格遵循 Skill 中的分镜脚本格式，每个镜头使用如下格式（示例）：\n`;
        prompt += `### 镜头 1：福利钩子 (0s - 3s)\n- **画面描述**：手持红色手牌，镜头从手牌快速拉远露出店内环境。\n- **旁白**：今天这家火锅套餐，人均不到五十！\n`;
        prompt += `4. seedance_prompt 必须严格遵循 Skill 中的 Seedance 2.0 提示词格式。\n`;
        prompt += `5. 当用户提供了商品名称、卖点、目标人群、时长、平台、风格等信息时，及时调用 update_product_profile 工具更新商品画像。\n`;
        prompt += `6. 最终回复保持简洁，只给用户一个自然的中文确认即可，例如"脚本已生成，你可以查看下方的分镜卡片"。\n`;
        return prompt;
    }
    async saveUserMessage(sessionId, userId, message) {
        const textPart = message.parts?.find((p) => p.type === 'text');
        const content = textPart ? textPart.text : '';
        const parts = message.parts?.filter((part) => part.type === 'text' || part.type === 'file');
        return this.messageRepo.save({
            sessionId,
            userId,
            role: 'user',
            content,
            parts,
        });
    }
    async touchSession(sessionId) {
        await this.sessionRepo
            .createQueryBuilder()
            .update(video_session_entity_1.VideoSession)
            .set({ updatedAt: () => 'CURRENT_TIMESTAMP' })
            .where('session_id = :sessionId', { sessionId })
            .execute();
    }
    async saveAssistantUIMessage(sessionId, userId, message) {
        const text = message.parts
            ?.filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('') || '';
        const toolCalls = message.parts
            ?.filter((p) => (0, ai_1.isToolUIPart)(p))
            .map((p) => {
            const output = 'output' in p ? p.output : undefined;
            const outputStr = output !== undefined ? JSON.stringify(output) : undefined;
            return {
                tool: (0, ai_1.getToolName)(p),
                outputSummary: outputStr && outputStr.length > 500 ? outputStr.slice(0, 500) + '…' : output,
            };
        }) || [];
        const generatedScriptId = message.parts
            ?.filter((p) => (0, ai_1.isToolUIPart)(p))
            .map((p) => {
            if ((0, ai_1.getToolName)(p) !== 'generate_script')
                return null;
            const output = 'output' in p ? p.output : undefined;
            return output && typeof output === 'object' ? output.script_id : null;
        })
            .find((id) => typeof id === 'number');
        await this.messageRepo.save({
            sessionId,
            userId,
            role: 'assistant',
            content: text,
            toolCalls,
            metadata: generatedScriptId ? { scriptId: generatedScriptId } : undefined,
        });
    }
    async updateProductProfile(sessionId, profile) {
        await this.sessionRepo.update({ sessionId }, { productProfile: profile });
    }
    async updateSessionStatus(sessionId, status) {
        await this.sessionRepo.update({ sessionId }, { status });
    }
    async createAsset(body) {
        const session = await this.ensureSession(body.session_id, body.user_id);
        const existing = await this.assetRepo.findOne({
            where: { sessionId: body.session_id, userId: session.userId, url: body.url },
        });
        if (existing) {
            return existing;
        }
        const asset = this.assetRepo.create({
            sessionId: body.session_id,
            userId: session.userId,
            assetType: body.asset_type,
            assetPurpose: body.asset_purpose,
            name: body.name,
            url: body.url,
            thumbnailUrl: body.thumbnail_url,
            status: body.asset_purpose === 'reference' ? 'parsed' : 'pending',
        });
        return this.assetRepo.save(asset);
    }
    async findAssetsBySessionId(sessionId) {
        return this.assetRepo.find({
            where: { sessionId },
            order: { createdAt: 'DESC' },
        });
    }
    async deleteAsset(assetId) {
        await this.assetRepo.delete(assetId);
        return { success: true };
    }
    async findScriptsBySessionId(sessionId) {
        return this.scriptRepo.find({
            where: { sessionId },
            order: { version: 'DESC' },
        });
    }
    async findScriptById(scriptId) {
        return this.scriptRepo.findOne({ where: { id: scriptId } });
    }
    async findSessionsByUserId(userId, options) {
        const page = options?.page ?? 1;
        const pageSize = options?.pageSize ?? 7;
        const [items, total] = await this.sessionRepo.findAndCount({
            where: { userId },
            order: { updatedAt: 'DESC' },
            select: { id: true, sessionId: true, topic: true, status: true, productProfile: true, createdAt: true, updatedAt: true },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            items,
            total,
            page,
            pageSize,
            hasMore: page * pageSize < total,
        };
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = VideoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_session_entity_1.VideoSession)),
    __param(1, (0, typeorm_1.InjectRepository)(video_message_entity_1.VideoMessage)),
    __param(2, (0, typeorm_1.InjectRepository)(video_asset_entity_1.VideoAsset)),
    __param(3, (0, typeorm_1.InjectRepository)(video_script_entity_1.VideoScript)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        video_llm_service_1.VideoLLMService,
        skill_loader_service_1.SkillLoaderService,
        storyboard_parser_service_1.StoryboardParserService,
        video_tools_service_1.VideoToolsService,
        video_task_service_1.VideoTaskService])
], VideoService);
//# sourceMappingURL=video.service.js.map