"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillLoaderService = exports.VIDEO_SKILLS = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("node:fs/promises"));
const path = __importStar(require("node:path"));
exports.VIDEO_SKILLS = {
    'life-service-storyboard-generator': 'life-service-storyboard-generator/SKILL.md',
    'sd2-pe': 'sd2-pe/SKILL.md',
};
let SkillLoaderService = class SkillLoaderService {
    skillsDir = process.env.SKILLS_DIR
        ? path.resolve(process.env.SKILLS_DIR)
        : path.resolve(process.cwd(), 'src/video/skills');
    async loadMeta(skillName = 'life-service-storyboard-generator') {
        const content = await this.readSkillFile(this.getSkillPath(skillName));
        const match = content.match(/^---\n([\s\S]*?)\n---/);
        if (!match) {
            return { name: '', description: '', trigger: '' };
        }
        const frontmatter = match[1];
        return {
            name: this.extractField(frontmatter, 'name'),
            description: this.extractField(frontmatter, 'description'),
            trigger: this.extractField(frontmatter, 'trigger'),
        };
    }
    async loadFullContent(skillName = 'life-service-storyboard-generator') {
        const content = await this.readSkillFile(this.getSkillPath(skillName));
        return content.replace(/^---\n[\s\S]*?\n---/, '').trim();
    }
    getSkillPath(skillName) {
        const skillPath = exports.VIDEO_SKILLS[skillName];
        if (!skillPath) {
            throw new Error(`未知 video skill：${skillName}`);
        }
        return skillPath;
    }
    async readSkillFile(relativePath) {
        const fullPath = path.join(this.skillsDir, relativePath);
        return fs.readFile(fullPath, 'utf-8');
    }
    extractField(frontmatter, key) {
        const regex = new RegExp(`^${key}:\\s*(.+)$`, 'm');
        const match = frontmatter.match(regex);
        return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
    }
};
exports.SkillLoaderService = SkillLoaderService;
exports.SkillLoaderService = SkillLoaderService = __decorate([
    (0, common_1.Injectable)()
], SkillLoaderService);
//# sourceMappingURL=skill-loader.service.js.map