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
exports.VideoTask = void 0;
const typeorm_1 = require("typeorm");
let VideoTask = class VideoTask {
    id;
    sessionId;
    userId;
    scriptId;
    taskId;
    model;
    status;
    prompt;
    imageUrls;
    videoUrls;
    generatedVideoUrl;
    lastFrameUrl;
    duration;
    resolution;
    ratio;
    errorCode;
    errorMessage;
    volcResponse;
    createdAt;
    updatedAt;
};
exports.VideoTask = VideoTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '主键ID' }),
    __metadata("design:type", Number)
], VideoTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 64, comment: '关联会话ID' }),
    __metadata("design:type", String)
], VideoTask.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', comment: '关联用户ID' }),
    __metadata("design:type", Number)
], VideoTask.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'script_id', nullable: true, comment: '关联脚本版本ID' }),
    __metadata("design:type", Number)
], VideoTask.prototype, "scriptId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'task_id', length: 128, unique: true, comment: '火山引擎任务ID' }),
    __metadata("design:type", String)
], VideoTask.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'model', length: 128, comment: '使用的模型' }),
    __metadata("design:type", String)
], VideoTask.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 32, default: 'queued', comment: '任务状态: queued/running/persisting/succeeded/failed/expired/cancelled' }),
    __metadata("design:type", String)
], VideoTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'prompt', type: 'text', nullable: true, comment: '提示词' }),
    __metadata("design:type", String)
], VideoTask.prototype, "prompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_urls', type: 'text', nullable: true, comment: '参考图片URL列表（JSON数组）' }),
    __metadata("design:type", String)
], VideoTask.prototype, "imageUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'video_urls', type: 'text', nullable: true, comment: '参考视频URL列表（JSON数组）' }),
    __metadata("design:type", String)
], VideoTask.prototype, "videoUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'generated_video_url', type: 'text', nullable: true, comment: '生成的视频URL' }),
    __metadata("design:type", String)
], VideoTask.prototype, "generatedVideoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_frame_url', type: 'text', nullable: true, comment: '尾帧图片URL' }),
    __metadata("design:type", String)
], VideoTask.prototype, "lastFrameUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration', nullable: true, comment: '视频时长（秒）' }),
    __metadata("design:type", Number)
], VideoTask.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolution', length: 32, nullable: true, comment: '分辨率' }),
    __metadata("design:type", String)
], VideoTask.prototype, "resolution", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ratio', length: 32, nullable: true, comment: '宽高比' }),
    __metadata("design:type", String)
], VideoTask.prototype, "ratio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_code', length: 128, nullable: true, comment: '错误码' }),
    __metadata("design:type", String)
], VideoTask.prototype, "errorCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', type: 'text', nullable: true, comment: '错误信息' }),
    __metadata("design:type", String)
], VideoTask.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'volc_response', type: 'longtext', nullable: true, comment: '火山引擎完整响应（JSON）' }),
    __metadata("design:type", String)
], VideoTask.prototype, "volcResponse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], VideoTask.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], VideoTask.prototype, "updatedAt", void 0);
exports.VideoTask = VideoTask = __decorate([
    (0, typeorm_1.Entity)('video_tasks'),
    (0, typeorm_1.Index)(['sessionId'])
], VideoTask);
//# sourceMappingURL=video-task.entity.js.map