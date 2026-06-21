import { ChatOpenAI } from '@langchain/openai';
import { createDeepAgent } from 'deepagents';
import { UIMessage, UIMessageChunk } from 'ai';
import { Repository } from 'typeorm';
import { VideoSession } from './entities/video-session.entity';
export declare class VideoService {
    private videoSessionRepo;
    agent: ReturnType<typeof createDeepAgent>;
    constructor(model: ChatOpenAI, videoSessionRepo: Repository<VideoSession>);
    streamChat(sessionId: string, messages: UIMessage[]): Promise<ReadableStream<UIMessageChunk>>;
    private saveSession;
    findAll(): string;
    findBySessionId(sessionId: string): Promise<UIMessage[]>;
    findOne(id: number): string;
    remove(id: number): string;
}
