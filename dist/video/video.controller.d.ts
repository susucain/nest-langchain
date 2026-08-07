import { VideoService } from './video.service';
import { VideoTaskService } from './video-task.service';
import { UIMessage } from 'ai';
import type { Response } from 'express';
import { Observable } from 'rxjs';
export declare class VideoController {
    private readonly videoService;
    private readonly videoTaskService;
    constructor(videoService: VideoService, videoTaskService: VideoTaskService);
    chat(body: {
        messages: UIMessage[];
        session_id?: string;
        referenced_script_id?: number;
        user_id?: number;
    }, res: Response): Promise<void>;
    getHistory(sessionId: string): Promise<UIMessage<unknown, import("ai", { with: { "resolution-mode": "import" } }).UIDataTypes, import("ai", { with: { "resolution-mode": "import" } }).UITools>[]>;
    createAsset(body: {
        session_id: string;
        user_id?: number;
        asset_type: 'image' | 'video' | 'url';
        asset_purpose: 'analysis' | 'reference';
        name: string;
        url: string;
        thumbnail_url?: string;
    }): Promise<import("./entities/video-asset.entity").VideoAsset>;
    getAssets(sessionId: string): Promise<import("./entities/video-asset.entity").VideoAsset[]>;
    deleteAsset(assetId: number): Promise<{
        success: boolean;
    }>;
    getScripts(sessionId: string): Promise<import("./entities/video-script.entity").VideoScript[]>;
    getScriptDetail(scriptId: number): Promise<import("./entities/video-script.entity").VideoScript | null>;
    generateVideo(body: {
        script_id: number;
        callback_url?: string;
    }): Promise<import("./entities/video-task.entity").VideoTask>;
    getVideoTask(taskId: string): Promise<import("./entities/video-task.entity").VideoTask | null>;
    streamTaskStatus(taskId: string): Observable<any>;
    cancelOrDeleteVideoTask(taskId: string): Promise<{
        success: boolean;
    }>;
    getVideoTaskList(sessionId: string): Promise<import("./entities/video-task.entity").VideoTask[]>;
    handleCallback(body: any): Promise<{
        received: boolean;
    }>;
    getSessions(userId?: number): Promise<import("./entities/video-session.entity").VideoSession[]>;
    getRemoteTaskList(pageNum?: number, pageSize?: number, status?: string, model?: string): Promise<any>;
}
