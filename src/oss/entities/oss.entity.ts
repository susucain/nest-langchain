import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('oss_files')
export class OssFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'file_name', type: 'varchar', length: 500, comment: '原始文件名' })
  fileName: string;

  @Column({ type: 'varchar', length: 1000, comment: 'OSS 访问链接' })
  url: string;

  @Column({ name: 'file_type', type: 'varchar', length: 100, comment: '文件 MIME 类型' })
  fileType: string;

  @Column({ name: 'created_by', type: 'varchar', length: 100, default: 'system', comment: '创建人' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
