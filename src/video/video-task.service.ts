import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { VideoTask } from './entities/video-task.entity';

@Injectable()
export class VideoTaskService {
  private readonly logger = new Logger(VideoTaskService.name);
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly apiModel: string;

  constructor(
    @InjectRepository(VideoTask)
    private videoTaskRepo: Repository<VideoTask>,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YUNFEI_API_KEY') || '';
    this.apiUrl = this.configService.get<string>('YUNFEI_API_URL') || '';
    this.apiModel = this.configService.get<string>('YUNFEI_API_MODEL') || '';
  }

  /**
   * 创建视频生成任务
   */
  async createTask(params: {
    sessionRecordId: number;
    prompt: string;
    imageUrls?: string[];
    videoUrls?: string[];
    duration?: number;
    ratio?: string;
  }) {
    const content: any[] = [
      {
        type: 'text',
        text: params.prompt,
      },
    ];

    // 添加参考图片
    if (params.imageUrls && params.imageUrls.length > 0) {
      for (const url of params.imageUrls) {
        content.push({
          type: 'image_url',
          image_url: { url },
          role: 'reference_image',
        });
      }
    }

    // 添加参考视频
    if (params.videoUrls && params.videoUrls.length > 0) {
      for (const url of params.videoUrls) {
        content.push({
          type: 'video_url',
          video_url: { url },
          role: 'reference_video',
        });
      }
    }

    const { duration = 15, ratio = '9:16' } = params;

    const requestBody = {
      model: this.apiModel,
      content,
      duration,
      ratio,
      // 返回尾帧
      return_last_frame: true,
      resolution: '720p',
    };

    this.logger.log(`创建视频生成任务: ${JSON.stringify(requestBody)}`);

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`火山引擎API调用失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    this.logger.log(`火山引擎响应: ${JSON.stringify(data)}`);

    // 保存到数据库
    const task = this.videoTaskRepo.create({
      sessionRecordId: params.sessionRecordId,
      taskId: data.id,
      model: data.model || this.apiModel,
      status: data.status || 'queued',
      prompt: params.prompt,
      imageUrls: params.imageUrls ? JSON.stringify(params.imageUrls) : undefined,
      videoUrls: params.videoUrls ? JSON.stringify(params.videoUrls) : undefined,
      volcResponse: JSON.stringify(data),
    });

    await this.videoTaskRepo.save(task);

    return {
      id: task.id,
      taskId: task.taskId,
      status: task.status,
    };
  }

  /**
   * 查询任务状态
   */
  async queryTask(taskId: string) {
    const url = `${this.apiUrl}/${taskId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`查询任务失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // 更新数据库
    const task = await this.videoTaskRepo.findOne({ where: { taskId } });
    if (task) {
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

    return data;
  }

  /**
   * 取消或删除视频生成任务
   * - queued 状态：取消排队，变更为 cancelled
   * - succeeded/failed/expired 状态：删除记录
   * - running/cancelled 状态：不支持操作
   */
  async cancelOrDeleteTask(taskId: string) {
    const task = await this.videoTaskRepo.findOne({ where: { taskId } });
    if (!task) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    if (task.status === 'running' || task.status === 'cancelled') {
      throw new Error(`任务状态为 ${task.status}，不支持取消/删除操作`);
    }

    const url = `${this.apiUrl}/${taskId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`取消/删除任务失败: ${response.status} ${errorText}`);
    }

    // 更新数据库状态
    if (task.status === 'queued') {
      task.status = 'cancelled';
      await this.videoTaskRepo.save(task);
    } else {
      // succeeded/failed/expired → 删除记录
      await this.videoTaskRepo.remove(task);
    }

    return { success: true };
  }

  /**
   * 根据 sessionRecordId 查询所有任务
   */
  async findBySessionRecordId(sessionRecordId: number) {
    return this.videoTaskRepo.find({
      where: { sessionRecordId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * 根据 taskId 查询任务
   */
  async findByTaskId(taskId: string) {
    return this.videoTaskRepo.findOne({ where: { taskId } });
  }

  /**
   * 查询火山引擎视频生成任务列表（远程）
   * 仅支持查询最近 7 天的任务记录
   */
  async listRemoteTasks(params?: {
    pageNum?: number;
    pageSize?: number;
    status?: string;
    taskIds?: string[];
    model?: string;
  }) {
    const { pageNum = 1, pageSize = 20, status, taskIds, model } = params || {};

    const queryParts: string[] = [
      `page_num=${pageNum}`,
      `page_size=${pageSize}`,
    ];

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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`查询远程任务列表失败: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  /**
   * 分页查询本地 video_tasks 表
   */
  async findPaginated(params?: {
    pageNum?: number;
    pageSize?: number;
    status?: string;
    sessionRecordId?: number;
  }) {
    const { pageNum = 1, pageSize = 20, status, sessionRecordId } = params || {};

    const where: any = {};
    if (status) where.status = status;
    if (sessionRecordId) where.sessionRecordId = sessionRecordId;

    const [items, total] = await this.videoTaskRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
    });

    return { items, total };
  }
}
