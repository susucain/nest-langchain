import { ChatOpenAI } from '@langchain/openai';
import { StructuredTool } from '@langchain/core/tools';
export declare class JobAgentService {
    private readonly sendMailTool;
    private readonly webSearchTool;
    private readonly dbUsersCrudTool;
    private readonly timeNowTool;
    private readonly logger;
    private readonly modelWithTools;
    private readonly tools;
    constructor(model: ChatOpenAI, sendMailTool: StructuredTool, webSearchTool: StructuredTool, dbUsersCrudTool: StructuredTool, timeNowTool: StructuredTool);
    runJob(instruction: string): Promise<string>;
}
