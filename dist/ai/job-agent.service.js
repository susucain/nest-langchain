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
var JobAgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobAgentService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("@langchain/openai");
const messages_1 = require("@langchain/core/messages");
const chat_history_1 = require("@langchain/core/chat_history");
const tools_1 = require("@langchain/core/tools");
let JobAgentService = JobAgentService_1 = class JobAgentService {
    sendMailTool;
    webSearchTool;
    dbUsersCrudTool;
    timeNowTool;
    logger = new common_1.Logger(JobAgentService_1.name);
    modelWithTools;
    tools;
    constructor(model, sendMailTool, webSearchTool, dbUsersCrudTool, timeNowTool) {
        this.sendMailTool = sendMailTool;
        this.webSearchTool = webSearchTool;
        this.dbUsersCrudTool = dbUsersCrudTool;
        this.timeNowTool = timeNowTool;
        this.modelWithTools = model.bindTools([
            this.sendMailTool,
            this.webSearchTool,
            this.dbUsersCrudTool,
            this.timeNowTool,
        ]);
        this.tools = [this.sendMailTool, this.webSearchTool, this.dbUsersCrudTool, this.timeNowTool];
    }
    async runJob(instruction) {
        const history = new chat_history_1.InMemoryChatMessageHistory();
        history.addMessages([
            new messages_1.SystemMessage('你是一个用于执行后台任务的智能代理。你会根据给定的任务指令，必要时调用工具（如 db_users_crud、send_mail、web_search、time_now 等）来查询或改写数据，然后给出清晰的步骤和结果说明。'),
            new messages_1.HumanMessage(instruction),
        ]);
        while (true) {
            const messages = await history.getMessages();
            const aiMessage = await this.modelWithTools.invoke(messages);
            history.addMessage(aiMessage);
            const toolCalls = aiMessage.tool_calls ?? [];
            if (!toolCalls.length) {
                return aiMessage.content;
            }
            for (const toolCall of toolCalls) {
                const tool = this.tools.find((t) => t.name === toolCall.name);
                if (!tool) {
                    this.logger.warn(`未知工具调用: ${toolCall.name}`);
                    continue;
                }
                const result = await tool.invoke(toolCall.args);
                history.addMessage(new messages_1.ToolMessage({
                    tool_call_id: toolCall.id || '',
                    name: toolCall.name,
                    content: result,
                }));
            }
        }
    }
};
exports.JobAgentService = JobAgentService;
exports.JobAgentService = JobAgentService = JobAgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CHAT_MODEL')),
    __param(1, (0, common_1.Inject)('SEND_MAIL_TOOL')),
    __param(2, (0, common_1.Inject)('WEB_SEARCH_TOOL')),
    __param(3, (0, common_1.Inject)('DB_USERS_CRUD_TOOL')),
    __param(4, (0, common_1.Inject)('TIME_NOW_TOOL')),
    __metadata("design:paramtypes", [openai_1.ChatOpenAI,
        tools_1.StructuredTool,
        tools_1.StructuredTool,
        tools_1.StructuredTool,
        tools_1.StructuredTool])
], JobAgentService);
//# sourceMappingURL=job-agent.service.js.map