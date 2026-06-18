import { AiService } from './ai.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UIMessage } from 'ai';
export declare class AiController {
    private readonly aiService;
    private readonly eventEmitter;
    constructor(aiService: AiService, eventEmitter: EventEmitter2);
    chat(query: string): Promise<{
        answer: string;
    }>;
    streamChat(query: string, ttsSessionId?: string): Promise<import("rxjs").Observable<{
        data: any;
    }>>;
    chatWithTool(query: string): Promise<{
        answer: string;
    }>;
    streamChatWithTool(query: string): Promise<import("rxjs").Observable<{
        data: string | (import("langchain").ContentBlock | import("langchain").ContentBlock.Text)[];
    }>>;
    agentChat(body: {
        messages: UIMessage[];
    }, res: Response): Promise<void>;
}
