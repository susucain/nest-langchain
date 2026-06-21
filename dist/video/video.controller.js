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
        const stream = await this.videoService.streamChat(sessionId, latestMessage ? [latestMessage] : []);
        (0, ai_1.pipeUIMessageStreamToResponse)({ response: res, stream });
    }
    async getHistory(sessionId) {
        return this.videoService.findBySessionId(sessionId);
    }
    async generateVideo(body) {
        return this.videoTaskService.createTask({
            sessionRecordId: body.session_record_id,
            prompt: body.prompt,
            imageUrls: body.image_urls,
            videoUrls: body.video_urls,
            duration: body.duration,
            ratio: body.ratio,
        });
    }
    async getVideoTask(taskId) {
        return this.videoTaskService.queryTask(taskId);
    }
    async cancelOrDeleteVideoTask(taskId) {
        return this.videoTaskService.cancelOrDeleteTask(taskId);
    }
    async getVideoTaskList(sessionRecordId) {
        return this.videoTaskService.findBySessionRecordId(sessionRecordId);
    }
    async getRemoteTaskList(pageNum, pageSize, status, model) {
        return this.videoTaskService.listRemoteTasks({
            pageNum: pageNum ? Number(pageNum) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
            status,
            model,
        });
    }
    async getTaskList(pageNum, pageSize, status, sessionRecordId) {
        return this.videoTaskService.findPaginated({
            pageNum: pageNum ? Number(pageNum) : undefined,
            pageSize: pageSize ? Number(pageSize) : undefined,
            status,
            sessionRecordId: sessionRecordId ? Number(sessionRecordId) : undefined,
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
    (0, common_1.Delete)('generate/:taskId'),
    __param(0, (0, common_1.Param)('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "cancelOrDeleteVideoTask", null);
__decorate([
    (0, common_1.Get)('generate/list/:sessionRecordId'),
    __param(0, (0, common_1.Param)('sessionRecordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getVideoTaskList", null);
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
__decorate([
    (0, common_1.Get)('tasks/list'),
    __param(0, (0, common_1.Query)('page_num')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('session_record_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getTaskList", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        video_task_service_1.VideoTaskService])
], VideoController);
//# sourceMappingURL=video.controller.js.map