export interface SkillMeta {
    name: string;
    description: string;
    trigger: string;
}
export declare class SkillLoaderService {
    private readonly projectDir;
    loadMeta(): Promise<SkillMeta>;
    loadFullContent(): Promise<string>;
    private readSkillFile;
    private extractField;
}
