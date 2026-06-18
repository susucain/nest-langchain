import { OssService } from './oss.service';
export declare class OssController {
    private readonly ossService;
    constructor(ossService: OssService);
    upload(file: any): Promise<{
        id: number;
        fileName: string;
        url: string;
        fileType: string;
        createdAt: Date;
    }>;
    findAll(page?: string, pageSize?: string): Promise<{
        list: import("./entities/oss.entity").OssFile[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<import("./entities/oss.entity").OssFile | null>;
    remove(id: number): Promise<import("./entities/oss.entity").OssFile | null>;
}
