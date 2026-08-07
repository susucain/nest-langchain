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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bull_1 = require("@nestjs/bull");
const rxjs_1 = require("rxjs");
const ioredis_1 = __importDefault(require("ioredis"));
const video_task_entity_1 = require("./entities/video-task.entity");
const video_script_entity_1 = require("./entities/video-script.entity");
const video_asset_entity_1 = require("./entities/video-asset.entity");
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
        if (params.callbackUrl) {
            requestBody.callback_url = params.callbackUrl;
        }
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
    async createTaskByScriptId(scriptId, callbackUrl) {
        const script = await this.scriptRepo.findOne({ where: { id: scriptId } });
        if (!script) {
            throw new Error(`脚本不存在: ${scriptId}`);
        }
        const referenceAssets = await this.assetRepo.find({
            where: { sessionId: script.sessionId, assetPurpose: 'reference' },
        });
        const imageUrls = referenceAssets
            .filter((a) => a.assetType === 'image')
            .map((a) => a.url);
        const videoUrls = referenceAssets
            .filter((a) => a.assetType === 'video')
            .map((a) => a.url);
        const defaultCallback = this.configService.get('APP_BASE_URL')
            ? `${this.configService.get('APP_BASE_URL')}/video/callback`
            : undefined;
        return this.createTask({
            sessionId: script.sessionId,
            userId: script.userId,
            scriptId: script.id,
            prompt: script.seedancePrompt,
            imageUrls,
            videoUrls,
            callbackUrl: callbackUrl || defaultCallback,
        });
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
        const taskId = body.id;
        if (!taskId) {
            throw new Error('回调缺少 task id');
        }
        await this.applyTaskUpdate(taskId, body);
        const payload = {
            taskId,
            status: body.status,
            generatedVideoUrl: body.content?.video_url,
            errorMessage: body.error?.message,
        };
        await this.redis.publish('video-task-updates', JSON.stringify(payload));
        return { received: true };
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
    async applyTaskUpdate(taskId, data) {
        const task = await this.videoTaskRepo.findOne({ where: { taskId } });
        if (!task) {
            this.logger.warn(`回调任务不存在: ${taskId}`);
            return;
        }
        task.status = data.status;
        task.volcResponse = JSON.stringify(data);
        if (data.status === 'succeeded' && data.content) {
            task.generatedVideoUrl = data.content.video_url;
            task.lastFrameUrl = data.content.last_frame_url;
            task.duration = data.duration;
            task.resolution = data.resolution;
            task.ratio = data.ratio;
        }
        if (data.status === 'failed' && data.error) {
            task.errorCode = data.error.code;
            task.errorMessage = data.error.message;
        }
        await this.videoTaskRepo.save(task);
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