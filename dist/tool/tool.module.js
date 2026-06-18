"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolModule = void 0;
const common_1 = require("@nestjs/common");
const tool_service_1 = require("./tool.service");
const tool_controller_1 = require("./tool.controller");
const llm_service_1 = require("./llm.service");
const send_mail_service_1 = require("./send-mail.service");
const web_search_service_1 = require("./web-search.service");
const db_users_crud_service_1 = require("./db-users-crud.service");
const cron_job_service_1 = require("./cron-job.service");
const users_module_1 = require("../users/users.module");
const job_module_1 = require("../job/job.module");
const time_now_tool_service_1 = require("./time-now-tool.service");
let ToolModule = class ToolModule {
};
exports.ToolModule = ToolModule;
exports.ToolModule = ToolModule = __decorate([
    (0, common_1.Module)({
        controllers: [tool_controller_1.ToolController],
        imports: [users_module_1.UsersModule, (0, common_1.forwardRef)(() => job_module_1.JobModule)],
        providers: [
            tool_service_1.ToolService,
            llm_service_1.LLMService,
            send_mail_service_1.SendMailService,
            web_search_service_1.WebSearchService,
            db_users_crud_service_1.DbUsersCrudService,
            cron_job_service_1.CronJobService,
            time_now_tool_service_1.TimeNowToolService,
            {
                provide: 'CHAT_MODEL',
                useFactory: (llmService) => llmService.getModel(),
                inject: [llm_service_1.LLMService],
            },
            {
                provide: 'SEND_MAIL_TOOL',
                useFactory: (sendMailService) => sendMailService.tool,
                inject: [send_mail_service_1.SendMailService],
            },
            {
                provide: 'WEB_SEARCH_TOOL',
                useFactory: (webSearchService) => webSearchService.tool,
                inject: [web_search_service_1.WebSearchService],
            },
            {
                provide: 'DB_USERS_CRUD_TOOL',
                useFactory: (dbUsersCrudService) => dbUsersCrudService.tool,
                inject: [db_users_crud_service_1.DbUsersCrudService],
            },
            {
                provide: 'CRON_JOB_TOOL',
                useFactory: (cronJobService) => cronJobService.tool,
                inject: [cron_job_service_1.CronJobService],
            },
            {
                provide: 'TIME_NOW_TOOL',
                useFactory: (timeNowToolService) => timeNowToolService.tool,
                inject: [time_now_tool_service_1.TimeNowToolService],
            },
        ],
        exports: ['CHAT_MODEL', 'SEND_MAIL_TOOL', 'WEB_SEARCH_TOOL', 'DB_USERS_CRUD_TOOL', 'CRON_JOB_TOOL', 'TIME_NOW_TOOL'],
    })
], ToolModule);
//# sourceMappingURL=tool.module.js.map