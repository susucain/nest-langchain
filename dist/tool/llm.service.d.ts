import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
export declare class LLMService {
    private readonly configService;
    constructor(configService: ConfigService);
    getModel(): ChatOpenAI<import("@langchain/openai").ChatOpenAICallOptions>;
}
