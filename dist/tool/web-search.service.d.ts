import { ConfigService } from '@nestjs/config';
import { StructuredTool } from '@langchain/core/tools';
export declare class WebSearchService {
    readonly tool: StructuredTool;
    constructor(configService: ConfigService);
}
