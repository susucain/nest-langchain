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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const common_2 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const stream_events_1 = require("../common/stream-events");
const event_emitter_1 = require("@nestjs/event-emitter");
const ai_1 = require("ai");
let AiController = class AiController {
    aiService;
    eventEmitter;
    constructor(aiService, eventEmitter) {
        this.aiService = aiService;
        this.eventEmitter = eventEmitter;
    }
    async chat(query) {
        const answer = await this.aiService.runChain(query);
        return { answer };
    }
    async streamChat(query, ttsSessionId) {
        const sessionId = ttsSessionId?.trim?.();
        if (sessionId) {
            const startEvent = { type: 'start', sessionId, query };
            this.eventEmitter.emit(stream_events_1.AI_TTS_STREAM_EVENT, startEvent);
        }
        return (0, rxjs_1.from)(this.aiService.streamChain(query, sessionId)).pipe((0, rxjs_1.map)((chunk) => ({ data: chunk })));
    }
    async chatWithTool(query) {
        const answer = await this.aiService.runChainWithTool(query);
        return { answer };
    }
    async streamChatWithTool(query) {
        return (0, rxjs_1.from)(this.aiService.runChainWithToolStream(query)).pipe((0, rxjs_1.map)((chunk) => ({ data: chunk })));
    }
    async agentChat(body, res) {
        if (!body.messages || !Array.isArray(body.messages)) {
            throw new Error('Invalid JSON');
        }
        const stream = await this.aiService.agentStream(body.messages);
        (0, ai_1.pipeUIMessageStreamToResponse)({ response: res, stream });
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('chat'),
    __param(0, (0, common_2.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chat", null);
__decorate([
    (0, common_1.Sse)('chat/stream'),
    __param(0, (0, common_2.Query)('query')),
    __param(1, (0, common_2.Query)('ttsSessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "streamChat", null);
__decorate([
    (0, common_1.Get)('chat/tool'),
    __param(0, (0, common_2.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "chatWithTool", null);
__decorate([
    (0, common_1.Sse)('chat/tool/stream'),
    __param(0, (0, common_2.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "streamChatWithTool", null);
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Response]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "agentChat", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService, event_emitter_1.EventEmitter2])
], AiController);
//# sourceMappingURL=ai.controller.js.map