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
exports.VideoAsset = void 0;
const typeorm_1 = require("typeorm");
let VideoAsset = class VideoAsset {
    id;
    sessionId;
    userId;
    assetType;
    assetPurpose;
    contentCategory;
    name;
    url;
    thumbnailUrl;
    parsedContent;
    status;
    createdAt;
    updatedAt;
};
exports.VideoAsset = VideoAsset;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '主键ID' }),
    __metadata("design:type", Number)
], VideoAsset.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 64, comment: '关联会话ID' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', comment: '关联用户ID' }),
    __metadata("design:type", Number)
], VideoAsset.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_type', length: 32, comment: '素材类型：image / video / url' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'asset_purpose', length: 32, default: 'analysis', comment: '素材用途：analysis / reference' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "assetPurpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_category', length: 32, nullable: true, comment: '素材内容分类：portrait / product / food / store / environment / other' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "contentCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'name', length: 256, comment: '素材名称' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'url', type: 'text', comment: '素材访问URL' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', type: 'text', nullable: true, comment: '缩略图URL' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parsed_content', type: 'json', nullable: true, comment: '解析结果' }),
    __metadata("design:type", Object)
], VideoAsset.prototype, "parsedContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 32, default: 'pending', comment: '状态：pending / parsed / failed' }),
    __metadata("design:type", String)
], VideoAsset.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], VideoAsset.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', comment: '更新时间' }),
    __metadata("design:type", Date)
], VideoAsset.prototype, "updatedAt", void 0);
exports.VideoAsset = VideoAsset = __decorate([
    (0, typeorm_1.Entity)('video_assets'),
    (0, typeorm_1.Index)(['sessionId'])
], VideoAsset);
//# sourceMappingURL=video-asset.entity.js.map