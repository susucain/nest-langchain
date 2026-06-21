import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class LLMService {
    constructor(private readonly configService: ConfigService) {
    }

    getModel() {
        return new ChatOpenAI({
            temperature: 0,
            modelName: this.configService.get<string>('MODEL_NAME'),
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
            configuration: {
                baseURL: this.configService.get<string>('OPENAI_BASE_URL'),
            },
        });
    }

}
