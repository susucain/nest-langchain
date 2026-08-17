export declare class VideoMessage {
    id: number;
    sessionId: string;
    userId: number;
    role: string;
    content: string;
    parts: Record<string, any>[];
    toolCalls: Record<string, any>;
    metadata: Record<string, any>;
    taskId: string;
    eventType: string;
    createdAt: Date;
}
