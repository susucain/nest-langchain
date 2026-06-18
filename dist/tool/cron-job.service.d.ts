import { StructuredTool } from '@langchain/core/tools';
import { JobService } from '../job/job.service';
export declare class CronJobService {
    readonly tool: StructuredTool;
    constructor(jobService: JobService);
}
