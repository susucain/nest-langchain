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
    messages;
    createdBy;
    createdAt;
    updatedAt;
};
exports.VideoSession = VideoSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '主键ID' }),
    __metadata("design:type", Number)
], VideoSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 64, comment: '会话ID（UUID）' }),
    __metadata("design:type", String)
], VideoSession.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'messages', type: 'longtext', nullable: true, comment: '完整的 UIMessage[] JSON 格式' }),
    __metadata("design:type", String)
], VideoSession.prototype, "messages", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', length: 50, default: 'system', comment: '创建人' }),
    __metadata("design:type", String)
], VideoSession.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], VideoSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], VideoSession.prototype, "updatedAt", void 0);
exports.VideoSession = VideoSession = __decorate([
    (0, typeorm_1.Entity)('video_sessions')
], VideoSession);
//# sourceMappingURL=video-session.entity.js.map