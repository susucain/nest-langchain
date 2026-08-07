import { ConfigService } from '@nestjs/config';
export declare class VideoLLMService {
    private readonly configService;
    constructor(configService: ConfigService);
    getProvider(): import("@ai-sdk/openai-compatible", { with: { "resolution-mode": "import" } }).OpenAICompatibleProvider<string, string, string, string>;
    getModel(): string;
    getVideoModel(): string;
}
