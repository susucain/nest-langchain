import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';
import { AiModule } from './ai/ai.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { JobModule } from './job/job.module';
import { Job } from './job/entities/job.entity';
import { ToolModule } from './tool/tool.module';
import { SpeechModule } from './speech/speech.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OssModule } from './oss/oss.module';
import { OssFile } from './oss/entities/oss.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    BookModule,
    AiModule,
    // 依赖configService，需异步配置
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get<string>('MAIL_PORT')),
          secure: configService.get<string>('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          // 默认发件人显示名称
          from:
            configService.get<string>('MAIL_FROM')
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Job, OssFile],
      }),
    }),
    EventEmitterModule.forRoot({
      maxListeners: 200,
    }),
    UsersModule,
    ScheduleModule.forRoot(),
    JobModule,
    ToolModule,
    SpeechModule,
    OssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
