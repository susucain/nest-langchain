import { Injectable } from '@nestjs/common';

export interface Shot {
  shot: number;
  time: string;
  scene: string;
  visual: string;
  audio: string;
}

export interface ParsedStoryboard {
  title: string;
  hook: string;
  meta: {
    duration: number;
    ratio: string;
    style: string;
    platform: string;
  };
  shots: Shot[];
}

@Injectable()
export class StoryboardParserService {
  parse(markdown: string): ParsedStoryboard {
    const lines = markdown.split('\n');
    const title = this.extractTitle(lines);
    const meta = this.extractMeta(lines);
    const shots = this.extractShots(markdown);
    const hook = shots[0]?.scene ?? '';

    return {
      title,
      hook,
      meta,
      shots,
    };
  }

  private extractTitle(lines: string[]): string {
    const firstHeading = lines.find((line) => line.startsWith('# '));
    return firstHeading ? firstHeading.replace('# ', '').trim() : '';
  }

  private extractMeta(lines: string[]): ParsedStoryboard['meta'] {
    const meta: ParsedStoryboard['meta'] = {
      duration: 15,
      ratio: '9:16',
      style: '',
      platform: '抖音/小红书',
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('**总时长**') || trimmed.startsWith('> **总时长**')) {
        const match = trimmed.match(/(\d+)\s*秒/);
        if (match) meta.duration = Number(match[1]);
      }
      if (trimmed.startsWith('**画幅**') || trimmed.startsWith('> **画幅**')) {
        if (trimmed.includes('9:16')) meta.ratio = '9:16';
        else if (trimmed.includes('16:9')) meta.ratio = '16:9';
        else if (trimmed.includes('1:1')) meta.ratio = '1:1';
      }
      if (trimmed.startsWith('**视觉风格**') || trimmed.startsWith('> **视觉风格**')) {
        meta.style = trimmed.split('**视觉风格**')[1]?.replace('：', '').replace(':', '').trim() || '';
      }
      if (trimmed.startsWith('**视频类型**') || trimmed.startsWith('> **视频类型**')) {
        const typeText = trimmed.split('**视频类型**')[1]?.replace('：', '').replace(':', '').trim() || '';
        if (typeText.includes('抖音')) meta.platform = '抖音';
        else if (typeText.includes('小红书')) meta.platform = '小红书';
      }
    }

    return meta;
  }

  private extractShots(markdown: string): Shot[] {
    const shots: Shot[] = [];
    const shotBlocks = markdown
      .split(/(?=###\s+镜头\s*\d+)/)
      .filter((block) => /###\s+镜头\s*\d+/.test(block.trim()));

    for (const block of shotBlocks) {
      const shotMatch = block.match(/###\s+镜头\s*(\d+)\s*[:：]\s*(.+?)\s*(?:\(|$)/m);
      const timeMatch = block.match(/\((\d+(?:\.\d+)?)\s*(?:s|秒)?\s*[-~]\s*(\d+(?:\.\d+)?)\s*(?:s|秒)?\s*\)/);
      const visualMatch = block.match(/-\s*\*\*画面描述\*\*\s*[:：]\s*([\s\S]*?)(?=\n-\s*\*\*|\n---|$)/);
      const audioMatch = block.match(/-\s*\*\*旁白\*\*\s*[:：]\s*([\s\S]*?)(?=\n-\s*\*\*|\n---|$)/);

      if (shotMatch && timeMatch) {
        const scene = shotMatch[2].trim();
        shots.push({
          shot: Number(shotMatch[1]),
          time: `${timeMatch[1]}-${timeMatch[2]}s`,
          scene,
          visual: visualMatch ? visualMatch[1].trim() : scene,
          audio: audioMatch ? audioMatch[1].trim() : '',
        });
      }
    }

    return shots;
  }
}
