import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

@Injectable()
export class VideoLLMService {
  constructor(private readonly configService: ConfigService) {}

  getProvider() {
    return createOpenAICompatible({
      name: 'qwen',
      baseURL: this.configService.get<string>('OPENAI_BASE_URL') || '',
      apiKey: this.configService.get<string>('OPENAI_API_KEY') || '',
      // Qwen3 系列模型默认开启思考模式（输出 <think> 推理内容），
      // 这里在 provider 层统一关闭，避免每次请求都产生额外推理开销。
      transformRequestBody: (body) => ({
        ...body,
        enable_thinking: false,
      }),
    });
  }

  getModel() {
    return this.configService.get<string>('MODEL_NAME') || 'qwen3.7-plus';
  }

  getVideoModel() {
    return this.configService.get<string>('YUNFEI_API_MODEL') || 'doubao-seedance-2-0-fast-260128';
  }
}
