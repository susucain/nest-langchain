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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OssService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ali_oss_1 = __importDefault(require("ali-oss"));
const config_1 = require("@nestjs/config");
const oss_entity_1 = require("./entities/oss.entity");
let OssService = class OssService {
    ossFileRepo;
    client;
    constructor(configService, ossFileRepo) {
        this.ossFileRepo = ossFileRepo;
        this.client = new ali_oss_1.default({
            region: configService.get('OSS_REGION'),
            accessKeyId: configService.get('OSS_ACCESS_KEY_ID'),
            accessKeySecret: configService.get('OSS_ACCESS_KEY_SECRET'),
            bucket: configService.get('OSS_BUCKET_NAME'),
        });
    }
    async uploadFile(originalName, fileBuffer, mimeType) {
        const ext = originalName.split('.').pop() || '';
        const ossKey = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const result = await this.client.put(ossKey, fileBuffer, {
            mime: mimeType,
        });
        const ossFile = this.ossFileRepo.create({
            fileName: originalName,
            url: result.url,
            fileType: mimeType,
            createdBy: 'system',
        });
        await this.ossFileRepo.save(ossFile);
        return {
            id: ossFile.id,
            fileName: ossFile.fileName,
            url: ossFile.url,
            fileType: ossFile.fileType,
            createdAt: ossFile.createdAt,
        };
    }
    async findAll(page = 1, pageSize = 10) {
        const [list, total] = await this.ossFileRepo.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
        return {
            list,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }
    findOne(id) {
        return this.ossFileRepo.findOneBy({ id });
    }
    async remove(id) {
        const file = await this.ossFileRepo.findOneBy({ id });
        if (!file)
            return null;
        await this.ossFileRepo.delete(id);
        return file;
    }
};
exports.OssService = OssService;
exports.OssService = OssService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(oss_entity_1.OssFile)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository])
], OssService);
//# sourceMappingURL=oss.service.js.map