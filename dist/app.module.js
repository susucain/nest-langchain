"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const book_module_1 = require("./book/book.module");
const ai_module_1 = require("./ai/ai.module");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const user_entity_1 = require("./users/entities/user.entity");
const schedule_1 = require("@nestjs/schedule");
const job_module_1 = require("./job/job.module");
const job_entity_1 = require("./job/entities/job.entity");
const tool_module_1 = require("./tool/tool.module");
const speech_module_1 = require("./speech/speech.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const oss_module_1 = require("./oss/oss.module");
const bull_1 = require("@nestjs/bull");
const ioredis_1 = __importDefault(require("ioredis"));
const oss_entity_1 = require("./oss/entities/oss.entity");
const video_module_1 = require("./video/video.module");
const video_session_entity_1 = require("./video/entities/video-session.entity");
const video_task_entity_1 = require("./video/entities/video-task.entity");
const video_message_entity_1 = require("./video/entities/video-message.entity");
const video_asset_entity_1 = require("./video/entities/video-asset.entity");
const video_script_entity_1 = require("./video/entities/video-script.entity");
const langfuse_module_1 = require("./langfuse/langfuse.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            langfuse_module_1.LangfuseModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            book_module_1.BookModule,
            ai_module_1.AiModule,
            mailer_1.MailerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('MAIL_HOST'),
                        port: Number(configService.get('MAIL_PORT')),
                        secure: configService.get('MAIL_SECURE') === 'true',
                        auth: {
                            user: configService.get('MAIL_USER'),
                            pass: configService.get('MAIL_PASS'),
                        },
                    },
                    defaults: {
                        from: configService.get('MAIL_FROM')
                    },
                }),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: Number(configService.get('DB_PORT')),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASS'),
                    database: configService.get('DB_NAME'),
                    connectorPackage: 'mysql2',
                    entities: [user_entity_1.User, job_entity_1.Job, oss_entity_1.OssFile, video_session_entity_1.VideoSession, video_task_entity_1.VideoTask, video_message_entity_1.VideoMessage, video_asset_entity_1.VideoAsset, video_script_entity_1.VideoScript],
                    synchronize: true,
                    logging: true,
                }),
            }),
            event_emitter_1.EventEmitterModule.forRoot({
                maxListeners: 200,
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const redisUrl = configService.get('REDIS_URL');
                    const redis = redisUrl
                        ? new ioredis_1.default(redisUrl)
                        : new ioredis_1.default({
                            host: configService.get('REDIS_HOST') || 'localhost',
                            port: Number(configService.get('REDIS_PORT') || 6379),
                            password: configService.get('REDIS_PASSWORD') || undefined,
                        });
                    return { redis: redis.options };
                },
            }),
            users_module_1.UsersModule,
            schedule_1.ScheduleModule.forRoot(),
            job_module_1.JobModule,
            tool_module_1.ToolModule,
            speech_module_1.SpeechModule,
            oss_module_1.OssModule,
            video_module_1.VideoModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map