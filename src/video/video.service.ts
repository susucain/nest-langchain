import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { Inject } from '@nestjs/common';
import { createDeepAgent, FilesystemBackend, SubAgent } from 'deepagents';
import path from "node:path";
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { UIMessage, UIMessageChunk, readUIMessageStream } from 'ai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoSession } from './entities/video-session.entity';

// 使用 nest-langchain 项目目录，确保 skills 路径和文件写入正确
const projectDir = path.resolve(__dirname, "../..");

@Injectable()
export class VideoService {
  agent: ReturnType<typeof createDeepAgent>;
  constructor(
    @Inject('CHAT_MODEL') model: ChatOpenAI,
    @InjectRepository(VideoSession)
    private videoSessionRepo: Repository<VideoSession>,
  ) {
    const backend = new FilesystemBackend({
      rootDir: projectDir,
      virtualMode: true,
    });

    // 子agent：视频分镜生成专家，接入 life-service-storyboard-generator skill
    const storyboardAgent: SubAgent = {
      name: 'storyboard-generator',
      description: '生活服务视频分镜生成专家。支持本地生活（团购/探店/低价营销）、广告场景和顾客对话对比 3 大场景、5 种视频类型。当用户需要生成视频分镜脚本、Seedance 提示词，或提到"做分镜"、"团购视频"、"探店视频"、"广告"、"宣传片"、"对话对比"等关键词时，委派此子agent处理。',
      systemPrompt: '你是一位专注于"生活服务"领域的视频分镜生成专家。在开始工作前，你必须先用 read_file 工具读取 src/video/skills/life-service-storyboard-generator/SKILL.md 获取完整指令，然后严格按该技能输出 Seedance 2.0 提示词。\n\n重要：调用文件操作工具时务必使用正确的参数名：\n- read_file 和 write_file 使用 file_path 参数（不是 path）\n- ls 使用 path 参数\n- edit_file 使用 file_path 参数提示词。\n\n注意：read_file 和 write_file 的参数名是 file_path（不是 path），ls 的参数名是 path。调用时务必使用正确的参数名。',
      skills: ['src/video/skills/'],
    };

    // 主agent：协调者，负责意图识别和任务委派（不加载任何skill，只做路由）
    this.agent = createDeepAgent({
      model: model as any,
      systemPrompt: `你是视频制作团队的总协调人（Coordinator）。你的职责是理解用户需求，并将合适的任务委派给专业子agent执行。

## 可用子agent

### storyboard-generator
- **职责**：生活服务领域的视频分镜脚本与 Seedance 2.0 提示词生成
- **适用场景**：用户需要生成视频分镜、脚本、Seedance 提示词
- **触发关键词**：做分镜、团购视频、探店视频、广告、宣传片、对话对比、视频脚本、Seedance 提示词，或上传了店铺/产品图片要求生成视频内容

## 工作规则

1. **意图识别**：分析用户输入，判断是否需要生成视频分镜/提示词
2. **委派执行**：如果用户需求匹配 storyboard-generator 的能力范围，立即将任务委派给它
3. **结果输出**：子agent完成后，会生成seedance_prompts.md文件，将该文件内容输出，不要做任何修改、总结、提炼或重新格式化
4. **非视频任务**：如果用户的请求与视频分镜生成无关，你可以直接回复，无需委派

## 严格禁止
- **禁止**自行生成视频分镜或 Seedance 提示词，这完全由子agent负责
- **禁止**读取任何 SKILL.md 文件或尝试执行子agent的专业工作
`,
      backend,
      subagents: [storyboardAgent],
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
