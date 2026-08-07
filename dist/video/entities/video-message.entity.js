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
exports.VideoMessage = void 0;
const typeorm_1 = require("typeorm");
let VideoMessage = class VideoMessage {
    id;
    sessionId;
    userId;
    role;
    content;
    parts;
    toolCalls;
    metadata;
    createdAt;
};
exports.VideoMessage = VideoMessage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '主键ID' }),
    __metadata("design:type", Number)
], VideoMessage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 64, comment: '关联会话ID' }),
    __metadata("design:type", String)
], VideoMessage.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', comment: '关联用户ID' }),
    __metadata("design:type", Number)
], VideoMessage.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role', length: 32, comment: '消息角色：user / assistant' }),
    __metadata("design:type", String)
], VideoMessage.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content', type: 'text', nullable: true, comment: '消息文本内容' }),
    __metadata("design:type", String)
], VideoMessage.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parts', type: 'json', nullable: true, comment: '用户消息内容块（含附件）' }),
    __metadata("design:type", Array)
], VideoMessage.prototype, "parts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tool_calls', type: 'json', nullable: true, comment: '工具调用元数据摘要' }),
    __metadata("design:type", Object)
], VideoMessage.prototype, "toolCalls", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'metadata', type: 'json', nullable: true, comment: '消息元数据（如生成脚本的 script_id）' }),
    __metadata("design:type", Object)
], VideoMessage.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], VideoMessage.prototype, "createdAt", void 0);
exports.VideoMessage = VideoMessage = __decorate([
    (0, typeorm_1.Entity)('video_message'),
    (0, typeorm_1.Index)(['sessionId', 'createdAt'])
], VideoMessage);
//# sourceMappingURL=video-message.entity.js.map