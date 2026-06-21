import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoTaskService } from './video-task.service';
import { VideoController } from './video.controller';
import { ToolModule } from '../tool/tool.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoSession } from './entities/video-session.entity';
import { VideoTask } from './entities/video-task.entity';


@Module({
  controllers: [VideoController],
  providers: [VideoService, VideoTaskService],
  imports: [
    ToolModule,
    TypeOrmModule.forFeature([VideoSession, VideoTask]),
  ],
})
export class VideoModule {}
