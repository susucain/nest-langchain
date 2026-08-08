import { Repository } from 'typeorm';
import { UIMessage } from 'ai';
import { VideoSession } from './entities/video-session.entity';
import { VideoMessage } from './entities/video-message.entity';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoLLMService } from './video-llm.service';
import { SkillLoaderService } from './skill-loader.service';
import { StoryboardParserService } from './storyboard-parser.service';
import { VideoToolsService } from './video-tools.service';
import { VideoTaskService } from './video-task.service';
export declare class VideoService {
    private sessionRepo;
    private messageRepo;
    private assetRepo;
    private scriptRepo;
    private llmService;
    private skillLoader;
    private storyboardParser;
    private toolsService;
    private taskService;
    private readonly logger;
    constructor(sessionRepo: Repository<VideoSession>, messageRepo: Repository<VideoMessage>, assetRepo: Repository<VideoAsset>, scriptRepo: Repository<VideoScript>, llmService: VideoLLMService, skillLoader: SkillLoaderService, storyboardParser: StoryboardParserService, toolsService: VideoToolsService, taskService: VideoTaskService);
    ensureSession(sessionId: string, userId?: number): Promise<VideoSession>;
    streamChat(sessionId: string, messages: UIMessage[], options?: {
        referencedScriptId?: number;
        userId?: number;
    }): Promise<ReadableStream<import("ai", { with: { "resolution-mode": "import" } }).InferUIMessageChunk<UIMessage<unknown, import("ai", { with: { "resolution-mode": "import" } }).UIDataTypes, import("ai", { with: { "resolution-mode": "import" } }).UITools>>>>;
    private handleProcessChunk;
    findHistoryBySessionId(sessionId: string): Promise<UIMessage[]>;
    private getRecentUIMessages;
    private buildSystemPrompt;
    private saveUserMessage;
    private touchSession;
    private saveAssistantUIMessage;
    updateProductProfile(sessionId: string, profile: Record<string, any>): Promise<void>;
    updateSessionStatus(sessionId: string, status: string): Promise<void>;
    createAsset(body: {
        session_id: string;
        user_id?: number;
        asset_type: 'image' | 'video' | 'url';
        asset_purpose: 'analysis' | 'reference';
        name: string;
        url: string;
        thumbnail_url?: string;
    }): Promise<VideoAsset>;
    findAssetsBySessionId(sessionId: string): Promise<VideoAsset[]>;
    deleteAsset(assetId: number): Promise<{
        success: boolean;
    }>;
    findScriptsBySessionId(sessionId: string): Promise<VideoScript[]>;
    findScriptById(scriptId: number): Promise<VideoScript | null>;
    findSessionsByUserId(userId: number, options?: {
        page?: number;
        pageSize?: number;
    }): Promise<{
        items: VideoSession[];
        total: number;
        page: number;
        pageSize: number;
        hasMore: boolean;
    }>;
}
