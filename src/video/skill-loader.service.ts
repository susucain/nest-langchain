import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface SkillMeta {
  name: string;
  description: string;
  trigger: string;
}

export const VIDEO_SKILLS = {
  'life-service-storyboard-generator':
    'life-service-storyboard-generator/SKILL.md',
  'sd2-pe': 'sd2-pe/SKILL.md',
} as const;

export type VideoSkillName = keyof typeof VIDEO_SKILLS;

@Injectable()
export class SkillLoaderService {
  private readonly skillsDir = process.env.SKILLS_DIR
    ? path.resolve(process.env.SKILLS_DIR)
    : path.resolve(process.cwd(), 'src/video/skills');

  async loadMeta(skillName: VideoSkillName = 'life-service-storyboard-generator'): Promise<SkillMeta> {
    const content = await this.readSkillFile(this.getSkillPath(skillName));
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      return { name: '', description: '', trigger: '' };
    }
    const frontmatter = match[1];
    return {
      name: this.extractField(frontmatter, 'name'),
      description: this.extractField(frontmatter, 'description'),
      trigger: this.extractField(frontmatter, 'trigger'),
    };
  }

  async loadFullContent(skillName: VideoSkillName = 'life-service-storyboard-generator'): Promise<string> {
    const content = await this.readSkillFile(this.getSkillPath(skillName));
    return content.replace(/^---\n[\s\S]*?\n---/, '').trim();
  }

  private getSkillPath(skillName: string): string {
    const skillPath = VIDEO_SKILLS[skillName as VideoSkillName];
    if (!skillPath) {
      throw new Error(`未知 video skill：${skillName}`);
    }
    return skillPath;
  }

  private async readSkillFile(relativePath: string): Promise<string> {
    const fullPath = path.join(this.skillsDir, relativePath);
    return fs.readFile(fullPath, 'utf-8');
  }

  private extractField(frontmatter: string, key: string): string {
    const regex = new RegExp(`^${key}:\\s*(.+)$`, 'm');
    const match = frontmatter.match(regex);
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
  }
}
