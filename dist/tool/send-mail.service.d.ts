import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { StructuredTool } from '@langchain/core/tools';
export declare class SendMailService {
    readonly tool: StructuredTool;
    constructor(configService: ConfigService, mailerService: MailerService);
}
