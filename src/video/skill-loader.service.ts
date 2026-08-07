import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

export interface SkillMeta {
  name: string;
  description: string;
  trigger: string;
}

const SKILL_PATH = 'src/video/skills/life-service-storyboard-generator/SKILL.md';

@Injectable()
export class SkillLoaderService {
  private readonly projectDir = path.resolve(__dirname, '../..');

  async loadMeta(): Promise<SkillMeta> {
    const content = await this.readSkillFile(SKILL_PATH);
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

  async loadFullContent(): Promise<string> {
    const content = await this.readSkillFile(SKILL_PATH);
    return content.replace(/^---\n[\s\S]*?\n---/, '').trim();
  }

  private async readSkillFile(relativePath: string): Promise<string> {
    const fullPath = path.join(this.projectDir, relativePath);
    return fs.readFile(fullPath, 'utf-8');
  }

  private extractField(frontmatter: string, key: string): string {
    const regex = new RegExp(`^${key}:\\s*(.+)$`, 'm');
    const match = frontmatter.match(regex);
    return match ? match[1].trim() : '';
  }
}
