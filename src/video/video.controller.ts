import { Controller, Post, Get, Delete, Body, Res, Param, Query } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoTaskService } from './video-task.service';
import { pipeUIMessageStreamToResponse } from 'ai';
import { UIMessage } from 'ai';
import type { Response } from 'express';
import { randomUUID } from 'crypto';

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly videoTaskService: VideoTaskService,
  ) { }

  @Post('chat')
  async chat(
    @Body() body: { messages: UIMessage[], session_id?: string },
    @Res() res: Response,
  ) {
    if (!body.messages || !Array.isArray(body.messages)) {
      throw new Error('Invalid messages format');
    }

    // 验证消息格式（AI SDK v6 要求 parts 数组）
    for (const msg of body.messages) {
      if (!msg.parts || !Array.isArray(msg.parts)) {
        throw new Error(`Invalid message format: message must have 'parts' array. Got: ${JSON.stringify(msg)}`);
      }
    }

    // 生成会话ID
    const sessionId = body.session_id ?? randomUUID();

    // 只取最新消息，历史从数据库加载
    const latestMessage = body.messages[body.messages.length - 1];
    const stream = await this.videoService.streamChat(sessionId, latestMessage ? [latestMessage] : []);
    pipeUIMessageStreamToResponse({ response: res as any, stream });
  }

  @Get('history/:sessionId')
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.videoService.findBySessionId(sessionId);
  }

  @Post('generate')
  async generateVideo(
    @Body() body: {
      session_record_id: number;
      prompt: string;
      image_urls?: string[];
      video_urls?: string[];
      duration?: number;
      ratio?: string;
    },
  ) {
    return this.videoTaskService.createTask({
      sessionRecordId: body.session_record_id,
      prompt: body.prompt,
      imageUrls: body.image_urls,
      videoUrls: body.video_urls,
      duration: body.duration,
      ratio: body.ratio,
    });
  }

  @Get('generate/:taskId')
  async getVideoTask(@Param('taskId') taskId: string) {
    return this.videoTaskService.queryTask(taskId);
  }

  @Delete('generate/:taskId')
  async cancelOrDeleteVideoTask(@Param('taskId') taskId: string) {
    return this.videoTaskService.cancelOrDeleteTask(taskId);
  }

  @Get('generate/list/:sessionRecordId')
  async getVideoTaskList(@Param('sessionRecordId') sessionRecordId: number) {
    return this.videoTaskService.findBySessionRecordId(sessionRecordId);
  }

  @Get('tasks/remote')
  async getRemoteTaskList(
    @Query('page_num') pageNum?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
    @Query('model') model?: string,
  ) {
    return this.videoTaskService.listRemoteTasks({
      pageNum: pageNum ? Number(pageNum) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      status,
      model,
    });
  }

  @Get('tasks/list')
  async getTaskList(
    @Query('page_num') pageNum?: number,
    @Query('page_size') pageSize?: number,
    @Query('status') status?: string,
    @Query('session_record_id') sessionRecordId?: number,
  ) {
    return this.videoTaskService.findPaginated({
      pageNum: pageNum ? Number(pageNum) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      status,
      sessionRecordId: sessionRecordId ? Number(sessionRecordId) : undefined,
    });
  }
}
