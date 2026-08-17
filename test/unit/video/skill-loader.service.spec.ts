import { SkillLoaderService } from '../../../src/video/skill-loader.service';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('SkillLoaderService', () => {
  const originalSkillsDir = process.env.SKILLS_DIR;

  afterEach(() => {
    if (originalSkillsDir === undefined) {
      delete process.env.SKILLS_DIR;
    } else {
      process.env.SKILLS_DIR = originalSkillsDir;
    }
  });

  it('loads the storyboard skill by default', async () => {
    const loader = new SkillLoaderService();
    const meta = await loader.loadMeta();

    expect(meta.name).toBe('life-service-storyboard-generator');
  });

  it('loads the Seedance prompt optimizer by name', async () => {
    const loader = new SkillLoaderService();
    const [meta, content] = await Promise.all([
      loader.loadMeta('sd2-pe'),
      loader.loadFullContent('sd2-pe'),
    ]);

    expect(meta.name).toBe('sd2-pe');
    expect(content).toContain('Seedance 2.0 Prompt Optimizer');
  });

  it('rejects an unknown skill name', async () => {
    const loader = new SkillLoaderService();
    await expect(loader.loadFullContent('missing-skill' as any)).rejects.toThrow('未知 video skill');
  });

  it('loads skills from SKILLS_DIR in production', async () => {
    const skillsDir = await mkdtemp(join(tmpdir(), 'video-skills-'));
    const skillDir = join(skillsDir, 'life-service-storyboard-generator');
    await mkdir(skillDir, { recursive: true });
    await writeFile(
      join(skillDir, 'SKILL.md'),
      '---\nname: production-skill\ndescription: test\ntrigger: always\n---\nContent',
    );
    process.env.SKILLS_DIR = skillsDir;

    try {
      const loader = new SkillLoaderService();
      await expect(loader.loadMeta()).resolves.toMatchObject({
        name: 'production-skill',
      });
    } finally {
      await rm(skillsDir, { recursive: true, force: true });
    }
  });
});
