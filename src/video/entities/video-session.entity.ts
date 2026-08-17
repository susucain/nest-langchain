import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('video_sessions')
@Index(['sessionId'], { unique: true })
@Index('idx_video_sessions_user_updated_id', ['userId', 'updatedAt', 'id'])
export class VideoSession {
  @PrimaryGeneratedColumn({ comment: '主键ID' })
  id: number;

  @Column({ name: 'session_id', length: 64, unique: true, comment: '会话ID（UUID）' })
  sessionId: string;

  @Column({ name: 'user_id', comment: '关联用户ID' })
  userId: number;

  @Column({ name: 'topic', length: 128, nullable: true, comment: '会话主题' })
  topic: string;

  @Column({ name: 'product_profile', type: 'json', nullable: true, comment: '结构化商品画像' })
  productProfile: Record<string, any>;

  @Column({ name: 'status', length: 32, default: 'active', comment: '会话状态' })
  status: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;
}
