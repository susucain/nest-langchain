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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const video_task_service_1 = require("./video-task.service");
const ai_1 = require("ai");
const crypto_1 = require("crypto");
const rxjs_1 = require("rxjs");
let VideoController = class VideoController {
    videoService;
    videoTaskService;
    constructor(videoService, videoTaskService) {
        this.videoService = videoService;
        this.videoTaskService = videoTaskService;
    }
    async chat(body, res) {
        if (!body.messages || !Array.isArray(body.messages)) {
            throw new Error('Invalid messages format');
        }
        for (const msg of body.messages) {
            if (!msg.parts || !Array.isArray(msg.parts)) {
                throw new Error(`Invalid message format: message must have 'parts' array. Got: ${JSON.stringify(msg)}`);
            }
        }
        const sessionId = body.session_id ?? (0, crypto_1.randomUUID)();
        const latestMessage = body.messages[body.messages.length - 1];
        const stream = await this.videoService.streamChat(sessionId, latestMessage ? [latestMessage] : [], {
            referencedScriptId: body.referenced_script_id,
            userId: body.user_id,
        });
        (0, ai_1.pipeUIMessageStreamToResponse)({ response: res, stream });
    }
    async getHistory(sessionId) {
        return this.videoService.findHistoryBySessionId(sessionId);
    }
    async createAsset(body) {
        return this.videoService.createAsset(body);
    }
    async getAssets(sessionId) {
        return this.videoService.findAssetsBySessionId(sessionId);
    }
    async deleteAsset(assetId) {
        return this.videoService.deleteAsset(assetId);
    }
    async getScripts(sessionId) {
        return this.videoService.findScriptsBySessionId(sessionId);
    }
    async getScriptDetail(scriptId) {
        return this.videoService.findScriptById(scriptId);
    }
    async generateVideo(body) {
        return this.videoTaskService.createTaskByScriptId(body.script_id, body.callback_url);
    }
    async getVideoTask(taskId) {
        return this.videoTaskService.queryTask(taskId);
    }
    streamTaskStatus(taskId) {
        return this.videoTaskService.subscribeTaskStatus(taskId);
    }
    async cancelOrDeleteVideoTask(taskId) {
        return this.videoTaskService.cancelOrDeleteTask(taskId);
    }
    async getVideoTaskList(sessionId) {
        return this.videoTaskService.findBySessionId(sessionId);
    }
    async handleCallback(body) {
        return this.videoTaskService.handleCallback(body);
    }
    async getSessions(userId) {
        return this.videoService.findSessionsByUserId(userId ? Number(userId) : 1);
    }
    async getRemoteTaskList(pageNum, pageSize, status, model) {
        return this.videoTaskService.listRemoteTasks({
            pageNum: pageNum ? Number(pageNum) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
            status,
            model,
        });
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Post)('chat'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "chat", null);
__decorate([
    (0, common_1.Get)('history/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('assets'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "createAsset", null);
__decorate([
    (0, common_1.Get)('assets/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getAssets", null);
__decorate([
    (0, common_1.Delete)('assets/:assetId'),
    __param(0, (0, common_1.Param)('assetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "deleteAsset", null);
__decorate([
    (0, common_1.Get)('scripts/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getScripts", null);
__decorate([
    (0, common_1.Get)('scripts/:scriptId/detail'),
    __param(0, (0, common_1.Param)('scriptId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getScriptDetail", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "generateVideo", null);
__decorate([
    (0, common_1.Get)('generate/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getVideoTask", null);
__decorate([
    (0, common_1.Get)('generate/:taskId/stream'),
    (0, common_1.Sse)(),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], VideoController.prototype, "streamTaskStatus", null);
__decorate([
    (0, common_1.Delete)('generate/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "cancelOrDeleteVideoTask", null);
__decorate([
    (0, common_1.Get)('generate/list/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getVideoTaskList", null);
__decorate([
    (0, common_1.Post)('callback'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "handleCallback", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('tasks/remote'),
    __param(0, (0, common_1.Query)('page_num')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('model')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getRemoteTaskList", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        video_task_service_1.VideoTaskService])
], VideoController);
//# sourceMappingURL=video.controller.js.map