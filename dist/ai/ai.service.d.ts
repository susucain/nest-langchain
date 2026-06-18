import { ChatOpenAI } from '@langchain/openai';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UIMessage } from 'ai';
export declare class AiService {
    private readonly queryUserTool;
    private readonly sendMailTool;
    private readonly webSearchTool;
    private readonly dbUsersCrudTool;
    private readonly cronJobTool;
    private readonly eventEmitter;
    private readonly chain;
    private readonly modelWithTool;
    private readonly tools;
    private readonly agent;
    constructor(model: ChatOpenAI, queryUserTool: any, sendMailTool: any, webSearchTool: any, dbUsersCrudTool: any, cronJobTool: any, eventEmitter: EventEmitter2);
    runChain(query: string): Promise<string>;
    streamChain(query: string, ttsSessionId?: string): AsyncGenerator<any, void, unknown>;
    runChainWithTool(query: string): Promise<string>;
    runChainWithToolStream(query: string): AsyncGenerator<string | (import("langchain").ContentBlock | import("langchain").ContentBlock.Text)[], void, unknown>;
    agentStream(messages: UIMessage[]): Promise<ReadableStream<import("ai").UIMessageChunk>>;
}
