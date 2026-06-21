import { VideoService } from './video.service';
import { VideoTaskService } from './video-task.service';
import { UIMessage } from 'ai';
import type { Response } from 'express';
export declare class VideoController {
    private readonly videoService;
    private readonly videoTaskService;
    constructor(videoService: VideoService, videoTaskService: VideoTaskService);
    chat(body: {
        messages: UIMessage[];
        session_id?: string;
    }, res: Response): Promise<void>;
    getHistory(sessionId: string): Promise<UIMessage<unknown, import("ai").UIDataTypes, import("ai").UITools>[]>;
    generateVideo(body: {
        session_record_id: number;
        prompt: string;
        image_urls?: string[];
        video_urls?: string[];
        duration?: number;
        ratio?: string;
    }): Promise<{
        id: number;
        taskId: string;
        status: string;
    }>;
    getVideoTask(taskId: string): Promise<any>;
    cancelOrDeleteVideoTask(taskId: string): Promise<{
        success: boolean;
    }>;
    getVideoTaskList(sessionRecordId: number): Promise<import("./entities/video-task.entity").VideoTask[]>;
    getRemoteTaskList(pageNum?: number, pageSize?: number, status?: string, model?: string): Promise<any>;
    getTaskList(pageNum?: number, pageSize?: number, status?: string, sessionRecordId?: number): Promise<{
        items: import("./entities/video-task.entity").VideoTask[];
        total: number;
    }>;
}
