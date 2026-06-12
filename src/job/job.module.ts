import { Module, forwardRef } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { JobAgentService } from '../ai/job-agent.service';
import { ToolModule } from '../tool/tool.module';

@Module({
  imports: [forwardRef(() => ToolModule)],
  providers: [JobService, JobAgentService],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
