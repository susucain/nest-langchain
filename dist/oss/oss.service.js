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
const promises_1 = require("node:dns/promises");
const node_net_1 = require("node:net");
const node_stream_1 = require("node:stream");
const DEFAULT_TRANSFER_MAX_BYTES = 1024 * 1024 * 1024;
function isPrivateAddress(address) {
    if (address === '::1' || address === '0.0.0.0')
        return true;
    if (address.startsWith('fe80:') || address.startsWith('fc') || address.startsWith('fd'))
        return true;
    if ((0, node_net_1.isIP)(address) !== 4)
        return false;
    const [first, second] = address.split('.').map(Number);
    return first === 10
        || first === 127
        || first === 0
        || (first === 169 && second === 254)
        || (first === 172 && second >= 16 && second <= 31)
        || (first === 192 && second === 168);
}
let OssService = class OssService {
    ossFileRepo;
    client;
    transferMaxBytes;
    constructor(configService, ossFileRepo) {
        this.ossFileRepo = ossFileRepo;
        this.client = new ali_oss_1.default({
            region: configService.get('OSS_REGION'),
            accessKeyId: configService.get('OSS_ACCESS_KEY_ID'),
            accessKeySecret: configService.get('OSS_ACCESS_KEY_SECRET'),
            bucket: configService.get('OSS_BUCKET_NAME'),
        });
        this.transferMaxBytes = Number(configService.get('OSS_TRANSFER_MAX_BYTES') || DEFAULT_TRANSFER_MAX_BYTES);
    }
    async transferFromUrl(sourceUrl, options) {
        const url = await this.validateTransferUrl(sourceUrl);
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120_000);
        try {
            const response = await fetch(url, {
                redirect: 'error',
                signal: controller.signal,
            });
            if (!response.ok || !response.body) {
                throw new common_1.BadRequestException(`下载生成文件失败: HTTP ${response.status}`);
            }
            const mimeType = (response.headers.get('content-type') || '')
                .split(';', 1)[0]
                .toLowerCase();
            if (!options.allowedMimeTypes.includes(mimeType)) {
                throw new common_1.BadRequestException(`不支持的生成文件类型: ${mimeType || 'unknown'}`);
            }
            const contentLength = Number(response.headers.get('content-length') || 0);
            if (contentLength > this.transferMaxBytes) {
                throw new common_1.BadRequestException('生成文件超过允许的转存大小');
            }
            const result = await this.client.put(options.ossKey, node_stream_1.Readable.fromWeb(response.body), { mime: mimeType });
            const ossFile = this.ossFileRepo.create({
                fileName: options.fileName,
                url: result.url,
                fileType: mimeType,
                createdBy: 'video_generation',
            });
            await this.ossFileRepo.save(ossFile);
            return { url: result.url, fileType: mimeType, ossKey: options.ossKey };
        }
        finally {
            clearTimeout(timeout);
        }
    }
    async validateTransferUrl(sourceUrl) {
        let url;
        try {
            url = new URL(sourceUrl);
        }
        catch {
            throw new common_1.BadRequestException('生成文件地址无效');
        }
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
            throw new common_1.BadRequestException('生成文件地址协议无效');
        }
        if (url.hostname === 'localhost') {
            throw new common_1.BadRequestException('生成文件地址不允许访问本机');
        }
        const addresses = await (0, promises_1.lookup)(url.hostname, { all: true });
        if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
            throw new common_1.BadRequestException('生成文件地址不允许访问内网');
        }
        return url;
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