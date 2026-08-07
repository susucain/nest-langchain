import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bull';
import { Observable } from 'rxjs';
import { VideoTask } from './entities/video-task.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoAsset } from './entities/video-asset.entity';
export declare class VideoTaskService {
    private videoTaskRepo;
    private scriptRepo;
    private assetRepo;
    private taskQueue;
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    private readonly apiModel;
    private readonly redis;
    private readonly subscribers;
    constructor(videoTaskRepo: Repository<VideoTask>, scriptRepo: Repository<VideoScript>, assetRepo: Repository<VideoAsset>, taskQueue: Queue, configService: ConfigService);
    private startRedisSubscriber;
    private broadcast;
    createTask(params: {
        sessionId: string;
        userId: number;
        scriptId: number;
        prompt: string;
        imageUrls?: string[];
        videoUrls?: string[];
        callbackUrl?: string;
        duration?: number;
        ratio?: string;
    }): Promise<VideoTask>;
    createTaskByScriptId(scriptId: number, callbackUrl?: string): Promise<VideoTask>;
    queryTask(taskId: string): Promise<VideoTask | null>;
    cancelOrDeleteTask(taskId: string): Promise<{
        success: boolean;
    }>;
    findBySessionId(sessionId: string): Promise<VideoTask[]>;
    handleCallback(body: any): Promise<{
        received: boolean;
    }>;
    subscribeTaskStatus(taskId: string): Observable<any>;
    private applyTaskUpdate;
    listRemoteTasks(params?: {
        pageNum?: number;
        pageSize?: number;
        status?: string;
        taskIds?: string[];
        model?: string;
    }): Promise<any>;
}
