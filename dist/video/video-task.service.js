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
var VideoTaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoTaskService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const rxjs_1 = require("rxjs");
const ioredis_1 = __importDefault(require("ioredis"));
const video_task_entity_1 = require("./entities/video-task.entity");
const video_script_entity_1 = require("./entities/video-script.entity");
const video_asset_entity_1 = require("./entities/video-asset.entity");
const TASK_STATUSES = ['queued', 'running', 'succeeded', 'failed', 'expired', 'cancelled'];
const TERMINAL_TASK_STATUSES = new Set(['succeeded', 'failed', 'expired', 'cancelled']);
const TASK_STATUS_ORDER = {
    queued: 0,
    running: 1,
    succeeded: 2,
    failed: 2,
    expired: 2,
    cancelled: 2,
};
let VideoTaskService = VideoTaskService_1 = class VideoTaskService {
    videoTaskRepo;
    scriptRepo;
    assetRepo;
    taskQueue;
    configService;
    logger = new common_1.Logger(VideoTaskService_1.name);
    apiKey;
    apiUrl;
    apiModel;
    redis;
    subscribers = new Map();
    constructor(videoTaskRepo, scriptRepo, assetRepo, taskQueue, configService) {
        this.videoTaskRepo = videoTaskRepo;
        this.scriptRepo = scriptRepo;
        this.assetRepo = assetRepo;
        this.taskQueue = taskQueue;
        this.configService = configService;
        this.apiKey = this.configService.get('YUNFEI_API_KEY') || '';
        this.apiUrl = this.configService.get('YUNFEI_API_URL') || '';
        this.apiModel = this.configService.get('YUNFEI_API_MODEL') || '';
        const redisUrl = this.configService.get('REDIS_URL');
        this.redis = redisUrl ? new ioredis_1.default(redisUrl) : new ioredis_1.default({
            host: this.configService.get('REDIS_HOST') || 'localhost',
            port: Number(this.configService.get('REDIS_PORT') || 6379),
            password: this.configService.get('REDIS_PASSWORD') || undefined,
        });
        this.startRedisSubscriber();
    }
    startRedisSubscriber() {
        const subscriber = new ioredis_1.default(this.redis.options);
        subscriber.subscribe('video-task-updates', (err) => {
            if (err) {
                this.logger.error('Redis subscribe failed', err);
            }
        });
        subscriber.on('message', (channel, message) => {
            if (channel !== 'video-task-updates')
                return;
            try {
                const payload = JSON.parse(message);
                this.broadcast(payload);
            }
            catch (e) {
                this.logger.error('Failed to parse redis message', e);
            }
        });
    }
    broadcast(payload) {
        const subs = this.subscribers.get(payload.taskId);
        if (!subs)
            return;
        for (const sub of subs) {
            sub.next({ data: payload });
            if (['succeeded', 'failed', 'expired', 'cancelled'].includes(payload.status)) {
                sub.complete();
            }
        }
    }
    async createTask(params) {
        const content = [{ type: 'text', text: params.prompt }];
        if (params.imageUrls && params.imageUrls.length > 0) {
            for (const url of params.imageUrls) {
                content.push({ type: 'image_url', image_url: { url }, role: 'reference_image' });
            }
        }
        if (params.videoUrls && params.videoUrls.length > 0) {
            for (const url of params.videoUrls) {
                content.push({ type: 'video_url', video_url: { url }, role: 'reference_video' });
            }
        }
        const { duration = 15, ratio = '9:16' } = params;
        const requestBody = {
            model: this.apiModel,
            content,
            duration,
            ratio,
            return_last_frame: true,
            resolution: '720p',
        };
        requestBody.callback_url = this.getCallbackUrl();
        this.logger.log(`创建视频生成任务: ${JSON.stringify(requestBody)}`);
        const response = await fetch('', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`火山引擎API调用失败: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        this.logger.log(`火山引擎响应: ${JSON.stringify(data)}`);
        const task = this.videoTaskRepo.create({
            sessionId: params.sessionId,
            userId: params.userId,
            scriptId: params.scriptId,
            taskId: data.id,
            model: data.model || this.apiModel,
            status: data.status || 'queued',
            prompt: params.prompt,
            imageUrls: params.imageUrls ? JSON.stringify(params.imageUrls) : undefined,
            videoUrls: params.videoUrls ? JSON.stringify(params.videoUrls) : undefined,
            duration,
            ratio,
            resolution: '720p',
            volcResponse: JSON.stringify(data),
        });
        await this.videoTaskRepo.save(task);
        return task;
    }
    async createTaskByScriptId(scriptId, options = {}) {
        const script = await this.scriptRepo.findOne({ where: { id: scriptId } });
        if (!script) {
            throw new Error(`脚本不存在: ${scriptId}`);
        }
        if (options.sessionId && options.sessionId !== script.sessionId) {
            throw new Error('脚本不属于当前会话');
        }
        if (options.userId && options.userId !== script.userId) {
            throw new Error('无权使用该脚本生成视频');
        }
        const suppliedAssets = options.assets ?? [];
        for (const asset of suppliedAssets) {
            const existing = await this.assetRepo.findOne({
                where: { sessionId: script.sessionId, userId: script.userId, url: asset.url },
            });
            if (existing) {
                if (existing.assetPurpose !== 'reference') {
                    existing.assetPurpose = 'reference';
                    existing.status = 'parsed';
                    await this.assetRepo.save(existing);
                }
                continue;
            }
            await this.assetRepo.save(this.assetRepo.create({
                sessionId: script.sessionId,
                userId: script.userId,
                assetType: asset.type,
                assetPurpose: 'reference',
                name: asset.name || '视频生成参考素材',
                url: asset.url,
                status: 'parsed',
            }));
        }
        const fullVideoEdit = await this.resolveFullVideoEdit(script);
        const referenceAssets = await this.assetRepo.find({
            where: { sessionId: script.sessionId, assetPurpose: 'reference' },
        });
        const imageUrls = fullVideoEdit
            ? []
            : referenceAssets
                .filter((a) => a.assetType === 'image')
                .map((a) => a.url);
        const videoUrls = fullVideoEdit
            ? [fullVideoEdit.sourceUrl]
            : referenceAssets
                .filter((a) => a.assetType === 'video')
                .map((a) => a.url);
        const userPrompt = options.userPrompt?.trim();
        const prompt = userPrompt
            ? `${script.seedancePrompt}\n\n## 本次生成补充要求\n${userPrompt}`
            : script.seedancePrompt;
        return this.createTask({
            sessionId: script.sessionId,
            userId: script.userId,
            scriptId: script.id,
            prompt,
            imageUrls: [...new Set(imageUrls)],
            videoUrls: [...new Set(videoUrls)],
            duration: fullVideoEdit?.sourceDurationSec,
            ratio: fullVideoEdit?.ratio,
        });
    }
    async resolveFullVideoEdit(script) {
        const edit = script.meta?.edit;
        if (!edit || edit.mode !== 'full_video_edit') {
            return null;
        }
        if (!Number.isInteger(edit.sourceAssetId)
            || !Number.isFinite(edit.sourceDurationSec)
            || edit.sourceDurationSec <= 0
            || !Number.isFinite(edit.targetStartSec)
            || !Number.isFinite(edit.targetEndSec)
            || edit.targetStartSec < 0
            || edit.targetStartSec >= edit.targetEndSec
            || edit.targetEndSec > edit.sourceDurationSec) {
            throw new common_1.BadRequestException('完整视频编辑脚本的编辑参数无效');
        }
        const sourceAsset = await this.assetRepo.findOne({
            where: {
                id: edit.sourceAssetId,
                sessionId: script.sessionId,
                userId: script.userId,
                assetType: 'video',
            },
        });
        if (!sourceAsset) {
            throw new common_1.BadRequestException('完整视频编辑的原视频素材不存在或无权访问');
        }
        return {
            sourceUrl: sourceAsset.url,
            sourceDurationSec: edit.sourceDurationSec,
            ratio: typeof script.meta?.ratio === 'string' ? script.meta.ratio : '9:16',
        };
    }
    async queryTask(taskId) {
        return this.videoTaskRepo.findOne({ where: { taskId } });
    }
    async cancelOrDeleteTask(taskId) {
        const task = await this.videoTaskRepo.findOne({ where: { taskId } });
        if (!task) {
            throw new Error(`任务不存在: ${taskId}`);
        }
        if (task.status === 'running' || task.status === 'cancelled') {
            throw new Error(`任务状态为 ${task.status}，不支持取消/删除操作`);
        }
        const response = await fetch(`${this.apiUrl}/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`取消/删除任务失败: ${response.status} ${errorText}`);
        }
        if (task.status === 'queued') {
            task.status = 'cancelled';
            await this.videoTaskRepo.save(task);
        }
        else {
            await this.videoTaskRepo.remove(task);
        }
        return { success: true };
    }
    async findBySessionId(sessionId) {
        return this.videoTaskRepo.find({
            where: { sessionId },
            order: { createdAt: 'ASC' },
        });
    }
    async handleCallback(body) {
        if (!body || typeof body !== 'object') {
            throw new common_1.BadRequestException('回调内容必须是对象');
        }
        const data = body;
        const taskId = data.id;
        if (typeof taskId !== 'string' || taskId.length === 0) {
            throw new common_1.BadRequestException('回调缺少 task id');
        }
        if (typeof data.status !== 'string' || !TASK_STATUSES.includes(data.status)) {
            throw new common_1.BadRequestException('回调任务状态无效');
        }
        const update = await this.applyTaskUpdate(taskId, data);
        if (!update.changed) {
            return { received: true, applied: false };
        }
        const payload = {
            taskId,
            status: data.status,
            generatedVideoUrl: data.content?.video_url,
            errorMessage: data.error?.message,
        };
        await this.redis.publish('video-task-updates', JSON.stringify(payload));
        return { received: true, applied: true };
    }
    isValidCallbackToken(token) {
        const expectedToken = this.configService.get('VIDEO_CALLBACK_TOKEN');
        if (!token || !expectedToken) {
            return false;
        }
        const tokenBuffer = Buffer.from(token);
        const expectedBuffer = Buffer.from(expectedToken);
        return tokenBuffer.length === expectedBuffer.length
            && (0, crypto_1.timingSafeEqual)(tokenBuffer, expectedBuffer);
    }
    subscribeTaskStatus(taskId) {
        return new rxjs_1.Observable((subscriber) => {
            if (!this.subscribers.has(taskId)) {
                this.subscribers.set(taskId, new Set());
            }
            this.subscribers.get(taskId).add(subscriber);
            this.videoTaskRepo.findOne({ where: { taskId } }).then((task) => {
                if (task) {
                    subscriber.next({
                        data: {
                            taskId,
                            status: task.status,
                            generatedVideoUrl: task.generatedVideoUrl,
                            errorMessage: task.errorMessage,
                        },
                    });
                    if (['succeeded', 'failed', 'expired', 'cancelled'].includes(task.status)) {
                        subscriber.complete();
                    }
                }
            });
            return () => {
                this.subscribers.get(taskId)?.delete(subscriber);
            };
        });
    }
    getCallbackUrl() {
        const appBaseUrl = this.configService.get('APP_BASE_URL')?.replace(/\/+$/, '');
        const callbackToken = this.configService.get('VIDEO_CALLBACK_TOKEN');
        if (!appBaseUrl || !callbackToken) {
            throw new Error('APP_BASE_URL 和 VIDEO_CALLBACK_TOKEN 必须配置，才能创建视频任务');
        }
        return `${appBaseUrl}/video/callback?token=${encodeURIComponent(callbackToken)}`;
    }
    async applyTaskUpdate(taskId, data) {
        const task = await this.videoTaskRepo.findOne({ where: { taskId } });
        if (!task) {
            this.logger.warn(`回调任务不存在: ${taskId}`);
            return { changed: false };
        }
        const incomingStatus = data.status;
        if (TERMINAL_TASK_STATUSES.has(task.status) && task.status !== incomingStatus) {
            this.logger.warn(`忽略终态任务的回调: ${taskId}, ${task.status} -> ${incomingStatus}`);
            return { changed: false };
        }
        const currentOrder = TASK_STATUS_ORDER[task.status] ?? 0;
        const incomingOrder = TASK_STATUS_ORDER[incomingStatus];
        if (incomingOrder < currentOrder) {
            this.logger.warn(`忽略乱序回调: ${taskId}, ${task.status} -> ${incomingStatus}`);
            return { changed: false };
        }
        const response = JSON.stringify(data);
        if (task.status === incomingStatus && task.volcResponse === response) {
            return { changed: false };
        }
        task.status = incomingStatus;
        task.volcResponse = response;
        if (incomingStatus === 'succeeded' && data.content) {
            task.generatedVideoUrl = data.content.video_url;
            task.lastFrameUrl = data.content.last_frame_url;
            task.duration = data.duration;
            task.resolution = data.resolution;
            task.ratio = data.ratio;
        }
        if (incomingStatus === 'failed' && data.error) {
            task.errorCode = data.error.code;
            task.errorMessage = data.error.message;
        }
        await this.videoTaskRepo.save(task);
        return { changed: true };
    }
    async listRemoteTasks(params) {
        const { pageNum = 1, pageSize = 20, status, taskIds, model } = params || {};
        const queryParts = [`page_num=${pageNum}`, `page_size=${pageSize}`];
        if (status)
            queryParts.push(`filter.status=${status}`);
        if (taskIds) {
            for (const id of taskIds) {
                queryParts.push(`filter.task_ids=${id}`);
            }
        }
        if (model)
            queryParts.push(`filter.model=${model}`);
        const url = `${this.apiUrl}?${queryParts.join('&')}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`查询远程任务列表失败: ${response.status} ${errorText}`);
        }
        return response.json();
    }
};
exports.VideoTaskService = VideoTaskService;
exports.VideoTaskService = VideoTaskService = VideoTaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_task_entity_1.VideoTask)),
    __param(1, (0, typeorm_1.InjectRepository)(video_script_entity_1.VideoScript)),
    __param(2, (0, typeorm_1.InjectRepository)(video_asset_entity_1.VideoAsset)),
    __param(3, (0, bull_1.InjectQueue)('video-tasks')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, Object, config_1.ConfigService])
], VideoTaskService);
//# sourceMappingURL=video-task.service.js.map