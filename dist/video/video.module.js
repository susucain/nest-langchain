"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModule = void 0;
const common_1 = require("@nestjs/common");
const video_service_1 = require("./video.service");
const video_task_service_1 = require("./video-task.service");
const video_controller_1 = require("./video.controller");
const tool_module_1 = require("../tool/tool.module");
const typeorm_1 = require("@nestjs/typeorm");
const video_session_entity_1 = require("./entities/video-session.entity");
const video_task_entity_1 = require("./entities/video-task.entity");
let VideoModule = class VideoModule {
};
exports.VideoModule = VideoModule;
exports.VideoModule = VideoModule = __decorate([
    (0, common_1.Module)({
        controllers: [video_controller_1.VideoController],
        providers: [video_service_1.VideoService, video_task_service_1.VideoTaskService],
        imports: [
            tool_module_1.ToolModule,
            typeorm_1.TypeOrmModule.forFeature([video_session_entity_1.VideoSession, video_task_entity_1.VideoTask]),
        ],
    })
], VideoModule);
//# sourceMappingURL=video.module.js.map