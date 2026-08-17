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
exports.VideoSession = void 0;
const typeorm_1 = require("typeorm");
let VideoSession = class VideoSession {
    id;
    sessionId;
    userId;
    topic;
    productProfile;
    status;
    createdAt;
    updatedAt;
};
exports.VideoSession = VideoSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '主键ID' }),
    __metadata("design:type", Number)
], VideoSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 64, unique: true, comment: '会话ID（UUID）' }),
    __metadata("design:type", String)
], VideoSession.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', comment: '关联用户ID' }),
    __metadata("design:type", Number)
], VideoSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'topic', length: 128, nullable: true, comment: '会话主题' }),
    __metadata("design:type", String)
], VideoSession.prototype, "topic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_profile', type: 'json', nullable: true, comment: '结构化商品画像' }),
    __metadata("design:type", Object)
], VideoSession.prototype, "productProfile", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 32, default: 'active', comment: '会话状态' }),
    __metadata("design:type", String)
], VideoSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], VideoSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], VideoSession.prototype, "updatedAt", void 0);
exports.VideoSession = VideoSession = __decorate([
    (0, typeorm_1.Entity)('video_sessions'),
    (0, typeorm_1.Index)(['sessionId'], { unique: true }),
    (0, typeorm_1.Index)('idx_video_sessions_user_updated_id', ['userId', 'updatedAt', 'id'])
], VideoSession);
//# sourceMappingURL=video-session.entity.js.map