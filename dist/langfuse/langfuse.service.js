"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var LangfuseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LangfuseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_node_1 = require("@opentelemetry/sdk-node");
const ai_1 = require("ai");
const otel_1 = require("@langfuse/otel");
const vercel_ai_sdk_1 = require("@langfuse/vercel-ai-sdk");
let LangfuseService = LangfuseService_1 = class LangfuseService {
    configService;
    logger = new common_1.Logger(LangfuseService_1.name);
    sdk;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const publicKey = this.configService.get('LANGFUSE_PUBLIC_KEY');
        const secretKey = this.configService.get('LANGFUSE_SECRET_KEY');
        const baseUrl = this.configService.get('LANGFUSE_BASE_URL');
        const enabled = this.configService.get('LANGFUSE_ENABLED') !== 'false';
        if (!enabled) {
            this.logger.log('Langfuse tracing is disabled via LANGFUSE_ENABLED=false');
            return;
        }
        if (!publicKey || !secretKey) {
            this.logger.warn('Langfuse credentials not configured (LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY). Tracing will not be sent.');
            return;
        }
        const spanProcessor = new otel_1.LangfuseSpanProcessor({
            publicKey,
            secretKey,
            baseUrl,
        });
        this.sdk = new sdk_node_1.NodeSDK({
            spanProcessors: [spanProcessor],
            serviceName: 'nest-langchain',
        });
        this.sdk.start();
        (0, ai_1.registerTelemetry)(new vercel_ai_sdk_1.LangfuseVercelAiSdkIntegration());
        this.logger.log('Langfuse OpenTelemetry SDK started (AI SDK v7 integration)');
    }
    async onModuleDestroy() {
        if (this.sdk) {
            try {
                await this.sdk.shutdown();
                this.logger.log('Langfuse OpenTelemetry SDK shut down');
            }
            catch (err) {
                this.logger.error('Failed to shut down Langfuse SDK', err);
            }
        }
    }
};
exports.LangfuseService = LangfuseService;
exports.LangfuseService = LangfuseService = LangfuseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LangfuseService);
//# sourceMappingURL=langfuse.service.js.map