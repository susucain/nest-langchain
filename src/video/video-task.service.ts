import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Observable, Subscriber } from 'rxjs';
import Redis from 'ioredis';
import { VideoTask } from './entities/video-task.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoAsset } from './entities/video-asset.entity';

interface TaskUpdatePayload {
  taskId: string;
  status: string;
  generatedVideoUrl?: string;
  errorMessage?: string;
}

interface GenerationAsset {
  type: 'image' | 'video';
  url: string;
  name?: string;
}

interface CreateTaskByScriptOptions {
  sessionId?: string;
  userId?: number;
  userPrompt?: string;
  assets?: GenerationAsset[];
}

const TASK_STATUSES = ['queued', 'running', 'succeeded', 'failed', 'expired', 'cancelled'] as const;
const TERMINAL_TASK_STATUSES = new Set<string>(['succeeded', 'failed', 'expired', 'cancelled']);
const TASK_STATUS_ORDER: Record<string, number> = {
  queued: 0,
  running: 1,
  succeeded: 2,
  failed: 2,
  expired: 2,
  cancelled: 2,
};

@Injectable()
export class VideoTaskService {
  private readonly logger = new Logger(VideoTaskService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly apiModel: string;
  private readonly redis: Redis;
  private readonly subscribers = new Map<string, Set<Subscriber<any>>>();

  constructor(
    @InjectRepository(VideoTask)
    private videoTaskRepo: Repository<VideoTask>,
    @InjectRepository(VideoScript)
    private scriptRepo: Repository<VideoScript>,
    @InjectRepository(VideoAsset)
    private assetRepo: Repository<VideoAsset>,
    @InjectQueue('video-tasks')
    private taskQueue: Queue,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YUNFEI_API_KEY') || '';
    this.apiUrl = this.configService.get<string>('YUNFEI_API_URL') || '';
    this.apiModel = this.configService.get<string>('YUNFEI_API_MODEL') || '';

    const redisUrl = this.configService.get<string>('REDIS_URL');
    this.redis = redisUrl ? new Redis(redisUrl) : new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: Number(this.configService.get<string>('REDIS_PORT') || 6379),
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    });

    this.startRedisSubscriber();
  }

  private startRedisSubscriber() {
    const subscriber = new Redis(this.redis.options);
    subscriber.subscribe('video-task-updates', (err) => {
      if (err) {
        this.logger.error('Redis subscribe failed', err);
      }
    });
    subscriber.on('message', (channel, message) => {
      if (channel !== 'video-task-updates') return;
      try {
        const payload: TaskUpdatePayload = JSON.parse(message);
        this.broadcast(payload);
      } catch (e) {
        this.logger.error('Failed to parse redis message', e);
      }
    });
  }

  private broadcast(payload: TaskUpdatePayload) {
    const subs = this.subscribers.get(payload.taskId);
    if (!subs) return;
    for (const sub of subs) {
      sub.next({ data: payload });
      if (['succeeded', 'failed', 'expired', 'cancelled'].includes(payload.status)) {
        sub.complete();
      }
    }
  }

  /**
   * 创建视频生成任务（内部工具调用）
   */
  async createTask(params: {
    sessionId: string;
    userId: number;
    scriptId: number;
    prompt: string;
    imageUrls?: string[];
    videoUrls?: string[];
    duration?: number;
    ratio?: string;
  }) {
    const content: any[] = [{ type: 'text', text: params.prompt }];

    if (params.imageUrls && params.imageUrls.length > 0) {
      for (const url of params.imageUrls) {
        content.push({ type: 'image_url', image_url: { url }, role: 'reference_image' });
      }
    }

    if (params.videoUrls && params.videoUrls.length > 0) {
      for (const url of params.videoUrls) {
        content.push({ type: 'video_url', video_url: { url }, role: 'reference_video' });
      }
    }

    const { duration = 15, ratio = '9:16' } = params;

    const requestBody: any = {
      model: this.apiModel,
      content,
      duration,
      ratio,
      return_last_frame: true,
      resolution: '720p',
    };

    requestBody.callback_url = this.getCallbackUrl();

    this.logger.log(`创建视频生成任务: ${JSON.stringify(requestBody)}`);

    // const response = await fetch(this.apiUrl, {
    const response = await fetch('', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`火山引擎API调用失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    this.logger.log(`火山引擎响应: ${JSON.stringify(data)}`);

    const task = this.videoTaskRepo.create({
      sessionId: params.sessionId,
      userId: params.userId,
      scriptId: params.scriptId,
      taskId: data.id,
      model: data.model || this.apiModel,
      status: data.status || 'queued',
      prompt: params.prompt,
      imageUrls: params.imageUrls ? JSON.stringify(params.imageUrls) : undefined,
      videoUrls: params.videoUrls ? JSON.stringify(params.videoUrls) : undefined,
      duration,
      ratio,
      resolution: '720p',
      volcResponse: JSON.stringify(data),
    });

    await this.videoTaskRepo.save(task);

    return task;
  }

  /**
   * 通过脚本 ID 创建任务（Controller 调用）
   */
  async createTaskByScriptId(scriptId: number, options: CreateTaskByScriptOptions = {}) {
    const script = await this.scriptRepo.findOne({ where: { id: scriptId } });
    if (!script) {
      throw new Error(`脚本不存在: ${scriptId}`);
    }

    if (options.sessionId && options.sessionId !== script.sessionId) {
      throw new Error('脚本不属于当前会话');
    }
    if (options.userId && options.userId !== script.userId) {
      throw new Error('无权使用该脚本生成视频');
    }

    const suppliedAssets = options.assets ?? [];
    for (const asset of suppliedAssets) {
      const existing = await this.assetRepo.findOne({
        where: { sessionId: script.sessionId, userId: script.userId, url: asset.url },
      });
      if (existing) {
        if (existing.assetPurpose !== 'reference') {
          existing.assetPurpose = 'reference';
          existing.status = 'parsed';
          await this.assetRepo.save(existing);
        }
        continue;
      }

      await this.assetRepo.save(this.assetRepo.create({
        sessionId: script.sessionId,
        userId: script.userId,
        assetType: asset.type,
        assetPurpose: 'reference',
        name: asset.name || '视频生成参考素材',
        url: asset.url,
        status: 'parsed',
      }));
    }

    // 查询该会话下 reference 类型素材（达人形象照、环境照片、参考视频等）
    const referenceAssets = await this.assetRepo.find({
      where: { sessionId: script.sessionId, assetPurpose: 'reference' },
    });
    const imageUrls = referenceAssets
      .filter((a) => a.assetType === 'image')
      .map((a) => a.url);
    const videoUrls = referenceAssets
      .filter((a) => a.assetType === 'video')
      .map((a) => a.url);

    const userPrompt = options.userPrompt?.trim();
    const prompt = userPrompt
      ? `${script.seedancePrompt}\n\n## 本次生成补充要求\n${userPrompt}`
      : script.seedancePrompt;

    return this.createTask({
      sessionId: script.sessionId,
      userId: script.userId,
      scriptId: script.id,
      prompt,
      imageUrls: [...new Set(imageUrls)],
      videoUrls: [...new Set(videoUrls)],
    });
  }

  /**
   * 查询任务状态（主动查询，兼容旧接口）
   */
  async queryTask(taskId: string) {
    return this.videoTaskRepo.findOne({ where: { taskId } });
  }

  /**
   * 取消或删除视频生成任务
   */
  async cancelOrDeleteTask(taskId: string) {
    const task = await this.videoTaskRepo.findOne({ where: { taskId } });
    if (!task) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    if (task.status === 'running' || task.status === 'cancelled') {
      throw new Error(`任务状态为 ${task.status}，不支持取消/删除操作`);
    }

    const response = await fetch(`${this.apiUrl}/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`取消/删除任务失败: ${response.status} ${errorText}`);
    }

    if (task.status === 'queued') {
      task.status = 'cancelled';
      await this.videoTaskRepo.save(task);
    } else {
      await this.videoTaskRepo.remove(task);
    }

    return { success: true };
  }

  /**
   * 根据 sessionId 查询所有任务
   */
  async findBySessionId(sessionId: string) {
    return this.videoTaskRepo.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * 火山引擎回调
   */
  async handleCallback(body: unknown) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('回调内容必须是对象');
    }

    const data = body as Record<string, any>;
    const taskId = data.id;
    if (typeof taskId !== 'string' || taskId.length === 0) {
      throw new BadRequestException('回调缺少 task id');
    }
    if (typeof data.status !== 'string' || !TASK_STATUSES.includes(data.status as typeof TASK_STATUSES[number])) {
      throw new BadRequestException('回调任务状态无效');
    }

    const update = await this.applyTaskUpdate(taskId, data);
    if (!update.changed) {
      return { received: true, applied: false };
    }

    const payload: TaskUpdatePayload = {
      taskId,
      status: data.status,
      generatedVideoUrl: data.content?.video_url,
      errorMessage: data.error?.message,
    };

    await this.redis.publish('video-task-updates', JSON.stringify(payload));

    return { received: true, applied: true };
  }

  isValidCallbackToken(token?: string): boolean {
    const expectedToken = this.configService.get<string>('VIDEO_CALLBACK_TOKEN');
    if (!token || !expectedToken) {
      return false;
    }

    const tokenBuffer = Buffer.from(token);
    const expectedBuffer = Buffer.from(expectedToken);
    return tokenBuffer.length === expectedBuffer.length
      && timingSafeEqual(tokenBuffer, expectedBuffer);
  }

  /**
   * SSE 订阅任务状态
   */
  subscribeTaskStatus(taskId: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.subscribers.has(taskId)) {
        this.subscribers.set(taskId, new Set());
      }
      this.subscribers.get(taskId)!.add(subscriber);

      this.videoTaskRepo.findOne({ where: { taskId } }).then((task) => {
        if (task) {
          subscriber.next({
            data: {
              taskId,
              status: task.status,
              generatedVideoUrl: task.generatedVideoUrl,
              errorMessage: task.errorMessage,
            },
          });
          if (['succeeded', 'failed', 'expired', 'cancelled'].includes(task.status)) {
            subscriber.complete();
          }
        }
      });

      return () => {
        this.subscribers.get(taskId)?.delete(subscriber);
      };
    });
  }

  private getCallbackUrl(): string {
    const appBaseUrl = this.configService.get<string>('APP_BASE_URL')?.replace(/\/+$/, '');
    const callbackToken = this.configService.get<string>('VIDEO_CALLBACK_TOKEN');
    if (!appBaseUrl || !callbackToken) {
      throw new Error('APP_BASE_URL 和 VIDEO_CALLBACK_TOKEN 必须配置，才能创建视频任务');
    }

    return `${appBaseUrl}/video/callback?token=${encodeURIComponent(callbackToken)}`;
  }

  private async applyTaskUpdate(taskId: string, data: Record<string, any>): Promise<{ changed: boolean }> {
    const task = await this.videoTaskRepo.findOne({ where: { taskId } });
    if (!task) {
      this.logger.warn(`回调任务不存在: ${taskId}`);
      return { changed: false };
    }

    const incomingStatus = data.status;
    if (TERMINAL_TASK_STATUSES.has(task.status) && task.status !== incomingStatus) {
      this.logger.warn(`忽略终态任务的回调: ${taskId}, ${task.status} -> ${incomingStatus}`);
      return { changed: false };
    }

    const currentOrder = TASK_STATUS_ORDER[task.status] ?? 0;
    const incomingOrder = TASK_STATUS_ORDER[incomingStatus];
    if (incomingOrder < currentOrder) {
      this.logger.warn(`忽略乱序回调: ${taskId}, ${task.status} -> ${incomingStatus}`);
      return { changed: false };
    }

    const response = JSON.stringify(data);
    if (task.status === incomingStatus && task.volcResponse === response) {
      return { changed: false };
    }

    task.status = incomingStatus;
    task.volcResponse = response;

    if (incomingStatus === 'succeeded' && data.content) {
      task.generatedVideoUrl = data.content.video_url;
      task.lastFrameUrl = data.content.last_frame_url;
      task.duration = data.duration;
      task.resolution = data.resolution;
      task.ratio = data.ratio;
    }

    if (incomingStatus === 'failed' && data.error) {
      task.errorCode = data.error.code;
      task.errorMessage = data.error.message;
    }

    await this.videoTaskRepo.save(task);
    return { changed: true };
  }

  /**
   * 查询火山引擎视频生成任务列表（远程）
   */
  async listRemoteTasks(params?: {
    pageNum?: number;
    pageSize?: number;
    status?: string;
    taskIds?: string[];
    model?: string;
  }) {
    const { pageNum = 1, pageSize = 20, status, taskIds, model } = params || {};

    const queryParts: string[] = [`page_num=${pageNum}`, `page_size=${pageSize}`];
    if (status) queryParts.push(`filter.status=${status}`);
    if (taskIds) {
      for (const id of taskIds) {
        queryParts.push(`filter.task_ids=${id}`);
      }
    }
    if (model) queryParts.push(`filter.model=${model}`);

    const url = `${this.apiUrl}?${queryParts.join('&')}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`查询远程任务列表失败: ${response.status} ${errorText}`);
    }

    return response.json();
  }
}
