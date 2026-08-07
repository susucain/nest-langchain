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
exports.VideoScript = void 0;
const typeorm_1 = require("typeorm");
let VideoScript = class VideoScript {
    id;
    sessionId;
    userId;
    version;
    title;
    hook;
    shots;
    scriptMarkdown;
    seedancePrompt;
    meta;
    sourceMessageId;
    basedOnVersion;
    status;
    createdAt;
};
exports.VideoScript = VideoScript;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ comment: '主键ID' }),
    __metadata("design:type", Number)
], VideoScript.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 64, comment: '关联会话ID' }),
    __metadata("design:type", String)
], VideoScript.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', comment: '关联用户ID' }),
    __metadata("design:type", Number)
], VideoScript.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'version', comment: '版本号' }),
    __metadata("design:type", Number)
], VideoScript.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'title', length: 256, comment: '脚本标题' }),
    __metadata("design:type", String)
], VideoScript.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hook', type: 'text', nullable: true, comment: '开头吸引点描述' }),
    __metadata("design:type", String)
], VideoScript.prototype, "hook", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shots', type: 'json', comment: '结构化分镜数组' }),
    __metadata("design:type", Array)
], VideoScript.prototype, "shots", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'script_markdown', type: 'text', comment: '易读Markdown脚本' }),
    __metadata("design:type", String)
], VideoScript.prototype, "scriptMarkdown", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seedance_prompt', type: 'text', comment: 'Seedance 2.0提示词' }),
    __metadata("design:type", String)
], VideoScript.prototype, "seedancePrompt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'meta', type: 'json', nullable: true, comment: '元信息' }),
    __metadata("design:type", Object)
], VideoScript.prototype, "meta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_message_id', nullable: true, comment: '触发生成的消息ID' }),
    __metadata("design:type", Number)
], VideoScript.prototype, "sourceMessageId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'based_on_version', nullable: true, comment: '基于哪个版本修改' }),
    __metadata("design:type", Number)
], VideoScript.prototype, "basedOnVersion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'status', length: 32, default: 'draft', comment: '状态：draft / confirmed / used_for_video' }),
    __metadata("design:type", String)
], VideoScript.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], VideoScript.prototype, "createdAt", void 0);
exports.VideoScript = VideoScript = __decorate([
    (0, typeorm_1.Entity)('video_scripts'),
    (0, typeorm_1.Index)(['sessionId', 'version'])
], VideoScript);
//# sourceMappingURL=video-script.entity.js.map