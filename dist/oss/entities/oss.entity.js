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
exports.OssFile = void 0;
const typeorm_1 = require("typeorm");
let OssFile = class OssFile {
    id;
    fileName;
    url;
    fileType;
    createdBy;
    createdAt;
};
exports.OssFile = OssFile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OssFile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_name', type: 'varchar', length: 500, comment: '原始文件名' }),
    __metadata("design:type", String)
], OssFile.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 1000, comment: 'OSS 访问链接' }),
    __metadata("design:type", String)
], OssFile.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_type', type: 'varchar', length: 100, comment: '文件 MIME 类型' }),
    __metadata("design:type", String)
], OssFile.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', type: 'varchar', length: 100, default: 'system', comment: '创建人' }),
    __metadata("design:type", String)
], OssFile.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', comment: '创建时间' }),
    __metadata("design:type", Date)
], OssFile.prototype, "createdAt", void 0);
exports.OssFile = OssFile = __decorate([
    (0, typeorm_1.Entity)('oss_files')
], OssFile);
//# sourceMappingURL=oss.entity.js.map