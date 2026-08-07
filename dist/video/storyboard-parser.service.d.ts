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
export declare class StoryboardParserService {
    parse(markdown: string): ParsedStoryboard;
    private extractTitle;
    private extractMeta;
    private extractShots;
}
