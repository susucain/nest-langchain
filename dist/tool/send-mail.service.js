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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_1 = require("@nestjs-modules/mailer");
const zod_1 = require("zod");
const tools_1 = require("@langchain/core/tools");
let SendMailService = class SendMailService {
    tool;
    constructor(configService, mailerService) {
        const sendMailArgsSchema = zod_1.z.object({
            to: zod_1.z.string().describe('收件人邮箱，例如: user@example.com'),
            subject: zod_1.z.string().describe('邮件主题，例如: 你好'),
            text: zod_1.z.string().describe('邮件内容，例如: 你好'),
            html: zod_1.z.string().describe('邮件内容，例如: <h1>你好</h1>'),
        });
        this.tool = (0, tools_1.tool)(async ({ to, subject, text, html }) => {
            const fallbackFrom = configService.get('MAIL_FROM');
            try {
                await mailerService.sendMail({
                    to,
                    subject,
                    text: text ?? '（无文本内容）',
                    html: html ?? `<p>${text ?? '（无 HTML 内容）'}</p>`,
                    from: fallbackFrom,
                });
            }
            catch (error) {
                return `发送邮件失败: ${error.message}`;
            }
            return `邮件已发送到 ${to}, 主题为「${subject}」`;
        }, {
            name: 'send_mail',
            description: '发送邮件。输入收件人邮箱、主题和 HTML 内容，发送邮件。',
            schema: sendMailArgsSchema,
        });
    }
};
exports.SendMailService = SendMailService;
exports.SendMailService = SendMailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, mailer_1.MailerService])
], SendMailService);
//# sourceMappingURL=send-mail.service.js.map