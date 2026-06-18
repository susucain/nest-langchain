import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OssService } from './oss.service';
import { OssController } from './oss.controller';
import { OssFile } from './entities/oss.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OssFile])],
  controllers: [OssController],
  providers: [OssService],
})
export class OssModule {}
