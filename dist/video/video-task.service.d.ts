import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import type { Queue } from 'bull';
import { Observable } from 'rxjs';
import { VideoTask } from './entities/video-task.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoSession } from './entities/video-session.entity';
import { VideoMessage } from './entities/video-message.entity';
import { OssService } from '../oss/oss.service';
interface GenerationAsset {
    type: 'image' | 'video';
    url: string;
    name?: string;
}
interface CreateTaskByScriptOptions {
    sessionId?: string;
    userId?: number;
    userPrompt?: string;
    assets?: GenerationAsset[];
}
export declare class VideoTaskService {
    private videoTaskRepo;
    private scriptRepo;
    private assetRepo;
    private sessionRepo;
    private messageRepo;
    private taskQueue;
    private configService;
    private ossService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    private readonly apiModel;
    private readonly redis;
    private readonly subscribers;
    constructor(videoTaskRepo: Repository<VideoTask>, scriptRepo: Repository<VideoScript>, assetRepo: Repository<VideoAsset>, sessionRepo: Repository<VideoSession>, messageRepo: Repository<VideoMessage>, taskQueue: Queue, configService: ConfigService, ossService: OssService);
    private startRedisSubscriber;
    private broadcast;
    createTask(params: {
        sessionId: string;
        userId: number;
        scriptId: number;
        prompt: string;
        imageUrls?: string[];
        videoUrls?: string[];
        duration?: number;
        ratio?: string;
    }): Promise<VideoTask>;
    createTaskByScriptId(scriptId: number, options?: CreateTaskByScriptOptions): Promise<VideoTask>;
    private resolveCharacterImageUrl;
    private resolveFullVideoEdit;
    queryTask(taskId: string): Promise<VideoTask | null>;
    cancelOrDeleteTask(taskId: string): Promise<{
        success: boolean;
    }>;
    findBySessionId(sessionId: string): Promise<VideoTask[]>;
    handleCallback(body: unknown): Promise<{
        received: boolean;
        applied: boolean;
    }>;
    isValidCallbackToken(token?: string): boolean;
    subscribeTaskStatus(taskId: string): Observable<any>;
    private getCallbackUrl;
    private markVideoGenerationStarted;
    private saveTaskEventMessage;
    private reconcileSessionStatus;
    private applyTaskUpdate;
    persistGeneratedVideo(taskId: string): Promise<void>;
    markVideoPersistenceFailed(taskId: string, error: unknown): Promise<void>;
    listRemoteTasks(params?: {
        pageNum?: number;
        pageSize?: number;
        status?: string;
        taskIds?: string[];
        model?: string;
    }): Promise<any>;
}
export {};
