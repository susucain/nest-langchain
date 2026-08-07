import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class LangfuseService implements OnModuleInit, OnModuleDestroy {
    private readonly configService;
    private readonly logger;
    private sdk;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
}
