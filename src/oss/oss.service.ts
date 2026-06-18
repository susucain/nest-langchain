import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import OSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';
import { OssFile } from './entities/oss.entity';

@Injectable()
export class OssService {
  private client: OSS;

  constructor(
    configService: ConfigService,
    @InjectRepository(OssFile)
    private ossFileRepo: Repository<OssFile>,
  ) {
    this.client = new OSS({
      region: configService.get<string>('OSS_REGION'),
      accessKeyId: configService.get<string>('OSS_ACCESS_KEY_ID'),
      accessKeySecret: configService.get<string>('OSS_ACCESS_KEY_SECRET'),
      bucket: configService.get<string>('OSS_BUCKET_NAME'),
    });
  }

  /** 上传文件到 OSS，并将文件信息存入 MySQL */
  async uploadFile(
    originalName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ) {
    // 生成唯一文件名，保留原始扩展名
    const ext = originalName.split('.').pop() || '';
    const ossKey = `uploads/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const result = await this.client.put(ossKey, fileBuffer, {
      mime: mimeType,
    });

    // 将文件信息存入数据库
    const ossFile = this.ossFileRepo.create({
      fileName: originalName,
      url: result.url,
      fileType: mimeType,
      createdBy: 'system',
    });
    await this.ossFileRepo.save(ossFile);

    return {
      id: ossFile.id,
      fileName: ossFile.fileName,
      url: ossFile.url,
      fileType: ossFile.fileType,
      createdAt: ossFile.createdAt,
    };
  }

  /** 分页查询文件记录 */
  async findAll(page: number = 1, pageSize: number = 10) {
    const [list, total] = await this.ossFileRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return {
      list,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /** 查询单条记录 */
  findOne(id: number) {
    return this.ossFileRepo.findOneBy({ id });
  }

  /** 删除记录（仅删除数据库记录，不删除 OSS 文件） */
  async remove(id: number) {
    const file = await this.ossFileRepo.findOneBy({ id });
    if (!file) return null;
    await this.ossFileRepo.delete(id);
    return file;
  }
}
