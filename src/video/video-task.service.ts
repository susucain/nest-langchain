import { Injectable, Logger } from '@nestjs/common';
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
    callbackUrl?: string;
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

    if (params.callbackUrl) {
      requestBody.callback_url = params.callbackUrl;
    }

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
  async createTaskByScriptId(scriptId: number, callbackUrl?: string) {
    const script = await this.scriptRepo.findOne({ where: { id: scriptId } });
    if (!script) {
      throw new Error(`脚本不存在: ${scriptId}`);
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

    const defaultCallback = this.configService.get<string>('APP_BASE_URL')
      ? `${this.configService.get<string>('APP_BASE_URL')}/video/callback`
      : undefined;

    return this.createTask({
      sessionId: script.sessionId,
      userId: script.userId,
      scriptId: script.id,
      prompt: script.seedancePrompt,
      imageUrls,
      videoUrls,
      callbackUrl: callbackUrl || defaultCallback,
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
  async handleCallback(body: any) {
    const taskId = body.id;
    if (!taskId) {
      throw new Error('回调缺少 task id');
    }

    await this.applyTaskUpdate(taskId, body);

    const payload: TaskUpdatePayload = {
      taskId,
      status: body.status,
      generatedVideoUrl: body.content?.video_url,
      errorMessage: body.error?.message,
    };

    await this.redis.publish('video-task-updates', JSON.stringify(payload));

    return { received: true };
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

  private async applyTaskUpdate(taskId: string, data: any) {
    const task = await this.videoTaskRepo.findOne({ where: { taskId } });
    if (!task) {
      this.logger.warn(`回调任务不存在: ${taskId}`);
      return;
    }

    task.status = data.status;
    task.volcResponse = JSON.stringify(data);

    if (data.status === 'succeeded' && data.content) {
      task.generatedVideoUrl = data.content.video_url;
      task.lastFrameUrl = data.content.last_frame_url;
      task.duration = data.duration;
      task.resolution = data.resolution;
      task.ratio = data.ratio;
    }

    if (data.status === 'failed' && data.error) {
      task.errorCode = data.error.code;
      task.errorMessage = data.error.message;
    }

    await this.videoTaskRepo.save(task);
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
