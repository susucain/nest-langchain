export declare class VideoScript {
    id: number;
    sessionId: string;
    userId: number;
    version: number;
    title: string;
    hook: string;
    shots: any[];
    scriptMarkdown: string;
    seedancePrompt: string;
    meta: Record<string, any>;
    sourceMessageId: number;
    basedOnVersion: number;
    status: string;
    createdAt: Date;
}
