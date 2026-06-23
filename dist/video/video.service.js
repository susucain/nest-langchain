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
const projectDir = node_path_1.default.resolve(__dirname, "../..");
let VideoService = class VideoService {
    videoSessionRepo;
    agent;
    constructor(model, videoSessionRepo) {
        this.videoSessionRepo = videoSessionRepo;
        const backend = new deepagents_1.FilesystemBackend({
            rootDir: projectDir,
            virtualMode: true,
        });
        const storyboardAgent = {
            name: 'storyboard-generator',
            description: '生活服务视频分镜生成专家。支持本地生活（团购/探店/低价营销）、广告场景和顾客对话对比 3 大场景、5 种视频类型。当用户需要生成视频分镜脚本、Seedance 提示词，或提到"做分镜"、"团购视频"、"探店视频"、"广告"、"宣传片"、"对话对比"等关键词时，委派此子agent处理。',
            systemPrompt: '你是一位专注于"生活服务"领域的视频分镜生成专家。在开始工作前，你必须先用 read_file 工具读取 src/video/skills/life-service-storyboard-generator/SKILL.md 获取完整指令，然后严格按该技能输出 Seedance 2.0 提示词。\n\n重要：调用文件操作工具时务必使用正确的参数名：\n- read_file 和 write_file 使用 file_path 参数（不是 path）\n- ls 使用 path 参数\n- edit_file 使用 file_path 参数提示词。\n\n注意：read_file 和 write_file 的参数名是 file_path（不是 path），ls 的参数名是 path。调用时务必使用正确的参数名。',
            skills: ['src/video/skills/'],
        };
        this.agent = (0, deepagents_1.createDeepAgent)({
            model: model,
            systemPrompt: `你是视频制作团队的总协调人（Coordinator）。你的职责是理解用户需求，并将合适的任务委派给专业子agent执行。

## 可用子agent

### storyboard-generator
- **职责**：生活服务领域的视频分镜脚本与 Seedance 2.0 提示词生成
- **适用场景**：用户需要生成视频分镜、脚本、Seedance 提示词
- **触发关键词**：做分镜、团购视频、探店视频、广告、宣传片、对话对比、视频脚本、Seedance 提示词，或上传了店铺/产品图片要求生成视频内容

## 工作规则

1. **意图识别**：分析用户输入，判断是否需要生成视频分镜/提示词
2. **委派执行**：如果用户需求匹配 storyboard-generator 的能力范围，立即将任务委派给它
3. **结果输出**：子agent完成后，会生成seedance_prompts.md文件，将该文件内容输出，不要做任何修改、总结、提炼或重新格式化
4. **非视频任务**：如果用户的请求与视频分镜生成无关，你可以直接回复，无需委派

## 严格禁止
- **禁止**自行生成视频分镜或 Seedance 提示词，这完全由子agent负责
- **禁止**读取任何 SKILL.md 文件或尝试执行子agent的专业工作
`,
            backend,
            subagents: [storyboardAgent],
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
    __param(1, (0, typeorm_1.InjectRepository)(video_session_entity_1.VideoSession)),
    __metadata("design:paramtypes", [openai_1.ChatOpenAI,
        typeorm_2.Repository])
], VideoService);
//# sourceMappingURL=video.service.js.map