export declare class VideoTask {
    id: number;
    sessionRecordId: number;
    taskId: string;
    model: string;
    status: string;
    prompt: string;
    imageUrls: string;
    videoUrls: string;
    generatedVideoUrl: string;
    lastFrameUrl: string;
    duration: number;
    resolution: string;
    ratio: string;
    errorCode: string;
    errorMessage: string;
    volcResponse: string;
    createdAt: Date;
    updatedAt: Date;
}
