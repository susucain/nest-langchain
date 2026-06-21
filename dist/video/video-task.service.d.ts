import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VideoTask } from './entities/video-task.entity';
export declare class VideoTaskService {
    private videoTaskRepo;
    private configService;
    private readonly logger;
    private readonly apiKey;
    private readonly apiUrl;
    private readonly apiModel;
    constructor(videoTaskRepo: Repository<VideoTask>, configService: ConfigService);
    createTask(params: {
        sessionRecordId: number;
        prompt: string;
        imageUrls?: string[];
        videoUrls?: string[];
        duration?: number;
        ratio?: string;
    }): Promise<{
        id: number;
        taskId: string;
        status: string;
    }>;
    queryTask(taskId: string): Promise<any>;
    cancelOrDeleteTask(taskId: string): Promise<{
        success: boolean;
    }>;
    findBySessionRecordId(sessionRecordId: number): Promise<VideoTask[]>;
    findByTaskId(taskId: string): Promise<VideoTask | null>;
    listRemoteTasks(params?: {
        pageNum?: number;
        pageSize?: number;
        status?: string;
        taskIds?: string[];
        model?: string;
    }): Promise<any>;
    findPaginated(params?: {
        pageNum?: number;
        pageSize?: number;
        status?: string;
        sessionRecordId?: number;
    }): Promise<{
        items: VideoTask[];
        total: number;
    }>;
}
