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
var VideoTaskService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoTaskService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const video_task_entity_1 = require("./entities/video-task.entity");
let VideoTaskService = VideoTaskService_1 = class VideoTaskService {
    videoTaskRepo;
    configService;
    logger = new common_1.Logger(VideoTaskService_1.name);
    apiKey;
    apiUrl;
    apiModel;
    constructor(videoTaskRepo, configService) {
        this.videoTaskRepo = videoTaskRepo;
        this.configService = configService;
        this.apiKey = this.configService.get('YUNFEI_API_KEY') || '';
        this.apiUrl = this.configService.get('YUNFEI_API_URL') || '';
        this.apiModel = this.configService.get('YUNFEI_API_MODEL') || '';
    }
    async createTask(params) {
        const content = [
            {
                type: 'text',
                text: params.prompt,
            },
        ];
        if (params.imageUrls && params.imageUrls.length > 0) {
            for (const url of params.imageUrls) {
                content.push({
                    type: 'image_url',
                    image_url: { url },
                    role: 'reference_image',
                });
            }
        }
        if (params.videoUrls && params.videoUrls.length > 0) {
            for (const url of params.videoUrls) {
                content.push({
                    type: 'video_url',
                    video_url: { url },
                    role: 'reference_video',
                });
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
        this.logger.log(`创建视频生成任务: ${JSON.stringify(requestBody)}`);
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`火山引擎API调用失败: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        this.logger.log(`火山引擎响应: ${JSON.stringify(data)}`);
        const task = this.videoTaskRepo.create({
            sessionRecordId: params.sessionRecordId,
            taskId: data.id,
            model: data.model || this.apiModel,
            status: data.status || 'queued',
            prompt: params.prompt,
            imageUrls: params.imageUrls ? JSON.stringify(params.imageUrls) : undefined,
            videoUrls: params.videoUrls ? JSON.stringify(params.videoUrls) : undefined,
            volcResponse: JSON.stringify(data),
        });
        await this.videoTaskRepo.save(task);
        return {
            id: task.id,
            taskId: task.taskId,
            status: task.status,
        };
    }
    async queryTask(taskId) {
        const url = `${this.apiUrl}/${taskId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`查询任务失败: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        const task = await this.videoTaskRepo.findOne({ where: { taskId } });
        if (task) {
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
        return data;
    }
    async cancelOrDeleteTask(taskId) {
        const task = await this.videoTaskRepo.findOne({ where: { taskId } });
        if (!task) {
            throw new Error(`任务不存在: ${taskId}`);
        }
        if (task.status === 'running' || task.status === 'cancelled') {
            throw new Error(`任务状态为 ${task.status}，不支持取消/删除操作`);
        }
        const url = `${this.apiUrl}/${taskId}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
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
    async findBySessionRecordId(sessionRecordId) {
        return this.videoTaskRepo.find({
            where: { sessionRecordId },
            order: { createdAt: 'ASC' },
        });
    }
    async findByTaskId(taskId) {
        return this.videoTaskRepo.findOne({ where: { taskId } });
    }
    async listRemoteTasks(params) {
        const { pageNum = 1, pageSize = 20, status, taskIds, model } = params || {};
        const queryParts = [
            `page_num=${pageNum}`,
            `page_size=${pageSize}`,
        ];
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
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`查询远程任务列表失败: ${response.status} ${errorText}`);
        }
        return response.json();
    }
    async findPaginated(params) {
        const { pageNum = 1, pageSize = 20, status, sessionRecordId } = params || {};
        const where = {};
        if (status)
            where.status = status;
        if (sessionRecordId)
            where.sessionRecordId = sessionRecordId;
        const [items, total] = await this.videoTaskRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
        });
        return { items, total };
    }
};
exports.VideoTaskService = VideoTaskService;
exports.VideoTaskService = VideoTaskService = VideoTaskService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_task_entity_1.VideoTask)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], VideoTaskService);
//# sourceMappingURL=video-task.service.js.map