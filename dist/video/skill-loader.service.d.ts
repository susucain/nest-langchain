export interface SkillMeta {
    name: string;
    description: string;
    trigger: string;
}
export declare const VIDEO_SKILLS: {
    readonly 'life-service-storyboard-generator': "src/video/skills/life-service-storyboard-generator/SKILL.md";
    readonly 'sd2-pe': "src/video/skills/sd2-pe/SKILL.md";
};
export type VideoSkillName = keyof typeof VIDEO_SKILLS;
export declare class SkillLoaderService {
    private readonly projectDir;
    loadMeta(skillName?: VideoSkillName): Promise<SkillMeta>;
    loadFullContent(skillName?: VideoSkillName): Promise<string>;
    private getSkillPath;
    private readSkillFile;
    private extractField;
}
