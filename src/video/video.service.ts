import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { Inject } from '@nestjs/common';
import { createDeepAgent, FilesystemBackend } from 'deepagents';
import path from "node:path";
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { UIMessage, UIMessageChunk, readUIMessageStream } from 'ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoSession } from './entities/video-session.entity';
import { StructuredTool } from '@langchain/core/tools';

// 使用 nest-langchain 项目目录，确保 skills 路径和文件写入正确
const projectDir = path.resolve(__dirname, "../..");

@Injectable()
export class VideoService {
  agent: ReturnType<typeof createDeepAgent>;
  constructor(
    @Inject('CHAT_MODEL') model: ChatOpenAI,
    @Inject('TIME_NOW_TOOL')
    private timeNowTool: StructuredTool,
    @InjectRepository(VideoSession)
    private videoSessionRepo: Repository<VideoSession>,
  ) {
    const backend = new FilesystemBackend({
      rootDir: projectDir,
      virtualMode: true,
    });

    // 单一主agent：直接处理视频分镜生成，接入 life-service-storyboard-generator skill
    this.agent = createDeepAgent({
      model: model as any,
      systemPrompt: `你是一位专注于"生活服务"领域的视频分镜生成专家。在开始工作前，你必须先用 read_file 工具读取 src/video/skills/life-service-storyboard-generator/SKILL.md 获取完整指令，然后严格按该技能执行。

**最终输出要求**：所有文件生成完毕后，你只需要在对话中输出 seedance_prompts.md 文件的内容（即 Seedance 2.0 提示词），不要输出分镜脚本（storyboard.md）和元数据（meta.md）的内容。

重要：调用文件操作工具时务必使用正确的参数名：
- read_file 和 write_file 使用 file_path 参数（不是 path）
- ls 使用 path 参数
- edit_file 使用 file_path 参数。

注意：read_file 和 write_file 的参数名是 file_path（不是 path），ls 的参数名是 path。调用时务必使用正确的参数名。`,
      backend,
      skills: ['src/video/skills/'],
      tools: [this.timeNowTool] as any,
    });
  }

  /**
   * 流式调用 agent，支持文本 + 图片，并在完成后保存会话
   * messages 参数现在只包含最新消息，历史从数据库加载
   */
  async streamChat(
    sessionId: string,
    messages: UIMessage[],
  ): Promise<ReadableStream<UIMessageChunk>> {
    // 从数据库加载历史消息
    // const historyMessages = await this.findBySessionId(sessionId);

    // 合并历史消息和最新消息
    // const allMessages = [...historyMessages, ...messages];

    // 提取最新消息用于保存
    const lastUserMsg = messages.filter((m) => m.role === 'user').pop();

    const lcMessages = await toBaseMessages(messages);
    const lgStream = await this.agent.stream(
      { messages: lcMessages },
      {
        streamMode: ['values', 'messages'],
      },
    );

    const originalStream = toUIMessageStream(lgStream as AsyncIterable<any>);
    const saveSession = this.saveSession.bind(this);

    // 分流：一路透传给客户端，一路收集完整消息
    const [clientStream, saveStream] = originalStream.tee();

    // 异步收集完整消息并保存
    (async () => {
      const collectedMessages: UIMessage[] = [];
      for await (const msg of readUIMessageStream({ stream: saveStream })) {
        console.log(msg);
        collectedMessages.push(msg);
      }
      // 只保留 state=done 的 assistant 消息（streaming 为中间态）
      const doneMsgs = collectedMessages.slice(-1);
      const newMsgs: UIMessage[] = [];
      if (lastUserMsg) newMsgs.push(lastUserMsg);
      newMsgs.push(...doneMsgs);
      // await saveSession(sessionId, newMsgs);
    })();

    return clientStream;
  }

  /**
   * 保存会话到数据库（以 UIMessage[] 格式存储）
   */
  private async saveSession(
    sessionId: string,
    messages: UIMessage[],
  ) {
    const session = this.videoSessionRepo.create({
      sessionId,
      messages: JSON.stringify(messages),
      createdBy: 'system',
    });
    await this.videoSessionRepo.save(session);
  }

  findAll() {
    return `This action returns all video`;
  }

  /**
   * 根据 sessionId 查询会话记录，返回 UIMessage[] 格式
   * 按时间正序拼接所有轮次的消息
   */
  async findBySessionId(sessionId: string): Promise<UIMessage[]> {
    const res = await this.videoSessionRepo.find({
      where: { sessionId },
      order: { createdAt: 'ASC' },
      take: 100,
    });

    return res.map((item) => JSON.parse(item.messages)).flat();

  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
