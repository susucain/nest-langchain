import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('video_sessions')
export class VideoSession {
  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ name: 'session_id', length: 64, comment: '会话ID（UUID）' })
  sessionId: string;

  @Column({ name: 'messages', type: 'longtext', nullable: true, comment: '完整的 UIMessage[] JSON 格式' })
  messages: string;

  @Column({ name: 'created_by', length: 50, default: 'system', comment: '创建人' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
