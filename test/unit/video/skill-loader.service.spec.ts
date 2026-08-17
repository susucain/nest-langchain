import { SkillLoaderService } from '../../../src/video/skill-loader.service';

describe('SkillLoaderService', () => {
  const loader = new SkillLoaderService();

  it('loads the storyboard skill by default', async () => {
    const meta = await loader.loadMeta();

    expect(meta.name).toBe('life-service-storyboard-generator');
  });

  it('loads the Seedance prompt optimizer by name', async () => {
    const [meta, content] = await Promise.all([
      loader.loadMeta('sd2-pe'),
      loader.loadFullContent('sd2-pe'),
    ]);

    expect(meta.name).toBe('sd2-pe');
    expect(content).toContain('Seedance 2.0 Prompt Optimizer');
  });

  it('rejects an unknown skill name', async () => {
    await expect(loader.loadFullContent('missing-skill' as any)).rejects.toThrow('未知 video skill');
  });
});
