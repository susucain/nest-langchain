import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { OssFile } from './entities/oss.entity';
export declare class OssService {
    private ossFileRepo;
    private client;
    constructor(configService: ConfigService, ossFileRepo: Repository<OssFile>);
    uploadFile(originalName: string, fileBuffer: Buffer, mimeType: string): Promise<{
        id: number;
        fileName: string;
        url: string;
        fileType: string;
        createdAt: Date;
    }>;
    findAll(page?: number, pageSize?: number): Promise<{
        list: OssFile[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<OssFile | null>;
    remove(id: number): Promise<OssFile | null>;
}
