export type AssetType = 'image' | 'video' | 'url';
export type AssetPurpose = 'analysis' | 'reference';
export declare class VideoAsset {
    id: number;
    sessionId: string;
    userId: number;
    assetType: AssetType;
    assetPurpose: AssetPurpose;
    name: string;
    url: string;
    thumbnailUrl: string;
    parsedContent: Record<string, any>;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
