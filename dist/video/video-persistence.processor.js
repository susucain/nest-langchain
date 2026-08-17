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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPersistenceProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const video_task_service_1 = require("./video-task.service");
let VideoPersistenceProcessor = class VideoPersistenceProcessor {
    videoTaskService;
    constructor(videoTaskService) {
        this.videoTaskService = videoTaskService;
    }
    async persistGeneratedVideo(job) {
        try {
            await this.videoTaskService.persistGeneratedVideo(job.data.taskId);
        }
        catch (error) {
            const attempts = job.opts.attempts ?? 1;
            if (job.attemptsMade + 1 >= attempts) {
                await this.videoTaskService.markVideoPersistenceFailed(job.data.taskId, error);
            }
            throw error;
        }
    }
};
exports.VideoPersistenceProcessor = VideoPersistenceProcessor;
__decorate([
    (0, bull_1.Process)('persist-generated-video'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VideoPersistenceProcessor.prototype, "persistGeneratedVideo", null);
exports.VideoPersistenceProcessor = VideoPersistenceProcessor = __decorate([
    (0, bull_1.Processor)('video-tasks'),
    __metadata("design:paramtypes", [video_task_service_1.VideoTaskService])
], VideoPersistenceProcessor);
//# sourceMappingURL=video-persistence.processor.js.map