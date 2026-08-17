import { VideoAsset } from './entities/video-asset.entity';
export declare class ProcessTracker {
    private state;
    private writer;
    private productProfile?;
    private started;
    private finished;
    private hasGenerationActivity;
    private now;
    constructor(options: {
        writer: {
            write: (chunk: any) => void;
        };
        analysisAssets: VideoAsset[];
        productProfile?: Record<string, any> | null;
        isModification?: boolean;
    });
    private buildGenerateDesc;
    start(): void;
    recordActivity(): void;
    markAssetRunning(assetId: number): void;
    markAssetParsed(assetId: number, summary: string): void;
    markProfileRunning(): void;
    markProfileUpdated(profile?: Record<string, any>): void;
    markGenerating(): void;
    markScriptValidationFailed(): void;
    markScriptGenerated(result: {
        title: string;
        shot_count: number;
        version: number;
    }): void;
    markScriptUnchanged(description: string): void;
    waitForUser(input: {
        title?: string;
        description: string;
    }): void;
    finish(): void;
    error(message?: string): void;
    static isGenerationTool(toolName: string): boolean;
    private markPhaseDone;
    private emit;
}
