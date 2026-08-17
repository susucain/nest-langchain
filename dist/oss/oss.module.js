"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OssModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const oss_service_1 = require("./oss.service");
const oss_controller_1 = require("./oss.controller");
const oss_entity_1 = require("./entities/oss.entity");
let OssModule = class OssModule {
};
exports.OssModule = OssModule;
exports.OssModule = OssModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([oss_entity_1.OssFile])],
        controllers: [oss_controller_1.OssController],
        providers: [oss_service_1.OssService],
        exports: [oss_service_1.OssService],
    })
], OssModule);
//# sourceMappingURL=oss.module.js.map