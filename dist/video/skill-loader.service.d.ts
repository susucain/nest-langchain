export interface SkillMeta {
    name: string;
    description: string;
    trigger: string;
}
export declare const VIDEO_SKILLS: {
    readonly 'life-service-storyboard-generator': "life-service-storyboard-generator/SKILL.md";
    readonly 'sd2-pe': "sd2-pe/SKILL.md";
};
export type VideoSkillName = keyof typeof VIDEO_SKILLS;
export declare class SkillLoaderService {
    private readonly skillsDir;
    loadMeta(skillName?: VideoSkillName): Promise<SkillMeta>;
    loadFullContent(skillName?: VideoSkillName): Promise<string>;
    private getSkillPath;
    private readSkillFile;
    private extractField;
}
