import type { Job } from 'bull';
import { VideoTaskService } from './video-task.service';
export declare class VideoPersistenceProcessor {
    private readonly videoTaskService;
    constructor(videoTaskService: VideoTaskService);
    persistGeneratedVideo(job: Job<{
        taskId: string;
    }>): Promise<void>;
}
