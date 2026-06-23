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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
const common_2 = require("@nestjs/common");
const deepagents_1 = require("deepagents");
const node_path_1 = __importDefault(require("node:path"));
const langchain_1 = require("@ai-sdk/langchain");
const ai_1 = require("ai");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const video_session_entity_1 = require("./entities/video-session.entity");
const tools_1 = require("@langchain/core/tools");
const projectDir = node_path_1.default.resolve(__dirname, "../..");
let VideoService = class VideoService {
    timeNowTool;
    videoSessionRepo;
    agent;
    constructor(model, timeNowTool, videoSessionRepo) {
        this.timeNowTool = timeNowTool;
        this.videoSessionRepo = videoSessionRepo;
        const backend = new deepagents_1.FilesystemBackend({
            rootDir: projectDir,
            virtualMode: true,
        });
        this.agent = (0, deepagents_1.createDeepAgent)({
            model: model,
            systemPrompt: `你是一位专注于"生活服务"领域的视频分镜生成专家。在开始工作前，你必须先用 read_file 工具读取 src/video/skills/life-service-storyboard-generator/SKILL.md 获取完整指令，然后严格按该技能执行。

**最终输出要求**：所有文件生成完毕后，你只需要在对话中输出 seedance_prompts.md 文件的内容（即 Seedance 2.0 提示词），不要输出分镜脚本（storyboard.md）和元数据（meta.md）的内容。

重要：调用文件操作工具时务必使用正确的参数名：
- read_file 和 write_file 使用 file_path 参数（不是 path）
- ls 使用 path 参数
- edit_file 使用 file_path 参数。

注意：read_file 和 write_file 的参数名是 file_path（不是 path），ls 的参数名是 path。调用时务必使用正确的参数名。`,
            backend,
            skills: ['src/video/skills/'],
            tools: [this.timeNowTool],
        });
    }
    async streamChat(sessionId, messages) {
        const lastUserMsg = messages.filter((m) => m.role === 'user').pop();
        const lcMessages = await (0, langchain_1.toBaseMessages)(messages);
        const lgStream = await this.agent.stream({ messages: lcMessages }, {
            streamMode: ['values', 'messages'],
        });
        const originalStream = (0, langchain_1.toUIMessageStream)(lgStream);
        const saveSession = this.saveSession.bind(this);
        const [clientStream, saveStream] = originalStream.tee();
        (async () => {
            const collectedMessages = [];
            for await (const msg of (0, ai_1.readUIMessageStream)({ stream: saveStream })) {
                console.log(msg);
                collectedMessages.push(msg);
            }
            const doneMsgs = collectedMessages.slice(-1);
            const newMsgs = [];
            if (lastUserMsg)
                newMsgs.push(lastUserMsg);
            newMsgs.push(...doneMsgs);
        })();
        return clientStream;
    }
    async saveSession(sessionId, messages) {
        const session = this.videoSessionRepo.create({
            sessionId,
            messages: JSON.stringify(messages),
            createdBy: 'system',
        });
        await this.videoSessionRepo.save(session);
    }
    findAll() {
        return `This action returns all video`;
    }
    async findBySessionId(sessionId) {
        const res = await this.videoSessionRepo.find({
            where: { sessionId },
            order: { createdAt: 'ASC' },
            take: 100,
        });
        return res.map((item) => JSON.parse(item.messages)).flat();
    }
    findOne(id) {
        return `This action returns a #${id} video`;
    }
    remove(id) {
        return `This action removes a #${id} video`;
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)('CHAT_MODEL')),
    __param(1, (0, common_2.Inject)('TIME_NOW_TOOL')),
    __param(2, (0, typeorm_1.InjectRepository)(video_session_entity_1.VideoSession)),
    __metadata("design:paramtypes", [openai_1.ChatOpenAI,
        tools_1.StructuredTool,
        typeorm_2.Repository])
], VideoService);
//# sourceMappingURL=video.service.js.map