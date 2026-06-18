import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OssService } from './oss.service';

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  /** 上传文件到 OSS 并记录到数据库 */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.ossService.uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype,
    );
  }

  /** 分页查询文件记录 */
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.ossService.findAll(
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  /** 查询单条文件记录 */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ossService.findOne(id);
  }

  /** 删除文件记录 */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ossService.remove(id);
  }
}
