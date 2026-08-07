import { Module, Global } from '@nestjs/common';
import { LangfuseService } from './langfuse.service';

/**
 * Langfuse 全局模块
 *
 * 在应用启动时初始化 OpenTelemetry + Langfuse Exporter，供整个应用使用。
 * 标记为 Global 以便任何模块都能注入 LangfuseService（如需要手动操作）。
 */
@Global()
@Module({
  providers: [LangfuseService],
  exports: [LangfuseService],
})
export class LangfuseModule {}
