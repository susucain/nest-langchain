"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessTracker = void 0;
const GUIDELINE_CARDS = [
    {
        id: 'platform-compliance',
        icon: '🛡️',
        iconColor: '#ef4444',
        iconBg: 'rgba(239,68,68,0.1)',
        title: '平台合规要求',
        description: '规避低质营销与违规话术',
    },
    {
        id: 'shot-duration',
        icon: '⏱️',
        iconColor: '#f59e0b',
        iconBg: 'rgba(245,158,11,0.1)',
        title: '分镜时长规范',
        description: '每镜头 2-8 秒节奏控制',
    },
    {
        id: 'story-structure',
        icon: '📖',
        iconColor: '#10b981',
        iconBg: 'rgba(16,185,129,0.1)',
        title: '故事结构模板',
        description: '钩子-卖点-证明-转化框架',
    },
    {
        id: 'video-template',
        icon: '🎬',
        iconColor: '#6366f1',
        iconBg: 'rgba(99,102,241,0.1)',
        title: '视频生成模板',
        description: '适配 Seedance 2.0 格式',
    },
    {
        id: 'narrative-mode',
        icon: '💡',
        iconColor: '#ec4899',
        iconBg: 'rgba(236,72,153,0.1)',
        title: '种草叙事模式',
        description: '生活方式带货话术风格',
    },
    {
        id: 'category-config',
        icon: '⚙️',
        iconColor: '#3b82f6',
        iconBg: 'rgba(59,130,246,0.1)',
        title: '品类适配配置',
        description: '匹配当前商品类目参数',
    },
];
const GENERATION_TOOLS = new Set([
    'parse_asset',
    'read_file',
    'write_file',
    'update_product_profile',
    'generate_script',
]);
class ProcessTracker {
    state;
    writer;
    productProfile;
    hasGenerationActivity = false;
    now = () => Date.now();
    constructor(options) {
        this.writer = options.writer;
        this.productProfile = options.productProfile;
        const phases = [];
        const analysisAssets = options.analysisAssets ?? [];
        if (analysisAssets.length > 0) {
            phases.push({
                id: 'parse-materials',
                title: '解析素材',
                description: '识别商品主图、产品细节与参考视频内容',
                status: 'running',
                startTime: this.now(),
                items: analysisAssets.map((asset) => {
                    const parsed = asset.parsedContent;
                    const isParsed = asset.status === 'parsed';
                    return {
                        id: `asset-${asset.id}`,
                        title: asset.name || `${asset.assetType === 'video' ? '视频' : '图片'}素材`,
                        description: isParsed
                            ? parsed?.summary ?? '已完成解析'
                            : '等待解析',
                        status: isParsed ? 'completed' : 'pending',
                        tag: isParsed ? { text: '已解析', type: 'success' } : undefined,
                    };
                }),
            });
        }
        phases.push({
            id: 'load-guidelines',
            title: '加载创作规范',
            description: '已加载 6 份创作规范，覆盖平台规则、分镜结构与视频模板',
            status: 'running',
            startTime: this.now(),
            cards: GUIDELINE_CARDS,
        });
        const duration = options.productProfile?.duration;
        const estimatedShots = duration ? Math.max(1, Math.ceil(duration / 5)) : undefined;
        phases.push({
            id: 'generate-script',
            title: options.isModification ? '修改并生成分镜脚本' : '提炼卖点并生成分镜脚本',
            description: '结合素材与规范，输出结构化分镜脚本',
            status: 'running',
            startTime: this.now(),
            actions: [
                {
                    id: 'update-product-profile',
                    title: '更新产品画像',
                    description: '提炼核心卖点与视频参数',
                    status: 'pending',
                },
                {
                    id: 'generate-script-action',
                    title: estimatedShots ? `生成 ${estimatedShots} 镜头分镜脚本` : '生成分镜脚本',
                    description: this.buildGenerateDesc(options.productProfile),
                    status: 'pending',
                },
            ],
        });
        this.state = {
            status: 'running',
            startTime: this.now(),
            phases,
        };
    }
    buildGenerateDesc(profile) {
        const parts = [];
        if (profile?.duration)
            parts.push(`预计 ${profile.duration} 秒`);
        parts.push('9:16 竖版');
        if (profile?.tone)
            parts.push(profile.tone);
        return parts.join(' · ') || '预计 30 秒 · 9:16 竖版';
    }
    start() {
        this.emit();
        this.markPhaseDone('load-guidelines');
    }
    recordActivity() {
        this.hasGenerationActivity = true;
    }
    markAssetRunning(assetId) {
        this.hasGenerationActivity = true;
        const phase = this.state.phases.find((p) => p.id === 'parse-materials');
        if (!phase?.items)
            return;
        const item = phase.items.find((i) => i.id === `asset-${assetId}`);
        if (item)
            item.status = 'running';
        this.emit();
    }
    markAssetParsed(assetId, summary) {
        this.hasGenerationActivity = true;
        const phase = this.state.phases.find((p) => p.id === 'parse-materials');
        if (!phase?.items)
            return;
        const item = phase.items.find((i) => i.id === `asset-${assetId}`);
        if (item) {
            item.status = 'completed';
            item.description = summary;
            item.tag = { text: '已解析', type: 'success' };
        }
        if (phase.items.every((i) => i.status === 'completed')) {
            this.markPhaseDone('parse-materials');
        }
        else {
            this.emit();
        }
    }
    markProfileRunning() {
        this.hasGenerationActivity = true;
        const phase = this.state.phases.find((p) => p.id === 'generate-script');
        if (!phase?.actions)
            return;
        const action = phase.actions.find((a) => a.id === 'update-product-profile');
        if (action)
            action.status = 'running';
        this.emit();
    }
    markProfileUpdated(profile) {
        this.hasGenerationActivity = true;
        if (profile) {
            this.productProfile = { ...(this.productProfile || {}), ...profile };
        }
        const phase = this.state.phases.find((p) => p.id === 'generate-script');
        if (!phase?.actions)
            return;
        const action = phase.actions.find((a) => a.id === 'update-product-profile');
        if (action) {
            action.status = 'completed';
            const sellingPoints = this.productProfile?.selling_points;
            if (sellingPoints && sellingPoints.length > 0) {
                action.description = `提炼 ${sellingPoints.length} 个核心卖点：${sellingPoints.slice(0, 3).join('、')}`;
            }
            const genAction = phase.actions.find((a) => a.id === 'generate-script-action');
            if (genAction) {
                genAction.description = this.buildGenerateDesc(this.productProfile);
            }
        }
        this.emit();
    }
    markGenerating() {
        this.hasGenerationActivity = true;
        const phase = this.state.phases.find((p) => p.id === 'generate-script');
        if (!phase?.actions)
            return;
        const action = phase.actions.find((a) => a.id === 'generate-script-action');
        if (action)
            action.status = 'running';
        this.emit();
    }
    markScriptGenerated(result) {
        this.hasGenerationActivity = true;
        const phase = this.state.phases.find((p) => p.id === 'generate-script');
        if (!phase)
            return;
        if (phase.actions) {
            const action = phase.actions.find((a) => a.id === 'generate-script-action');
            if (action) {
                action.status = 'completed';
                action.title = `生成 ${result.shot_count} 镜头分镜脚本`;
            }
        }
        const platform = this.productProfile?.platform;
        const tags = [
            result.title,
            `${result.shot_count} 个镜头`,
            `V${result.version}`,
            platform,
        ].filter((t) => typeof t === 'string' && t.length > 0);
        phase.outputs = [
            {
                title: `${result.title} 预期产出`,
                tags,
            },
        ];
        this.markPhaseDone('generate-script');
    }
    finish() {
        if (!this.hasGenerationActivity) {
            this.state.status = 'skipped';
            this.state.endTime = this.now();
            this.emit();
            return;
        }
        this.state.phases.forEach((phase) => {
            if (phase.status === 'running') {
                phase.status = 'completed';
                phase.endTime = this.now();
            }
        });
        this.state.status = 'completed';
        this.state.endTime = this.now();
        this.emit();
    }
    error(message) {
        this.state.status = 'error';
        this.state.endTime = this.now();
        this.state.phases.forEach((phase) => {
            if (phase.status === 'running')
                phase.status = 'error';
        });
        this.emit();
    }
    static isGenerationTool(toolName) {
        return GENERATION_TOOLS.has(toolName);
    }
    markPhaseDone(phaseId) {
        const phase = this.state.phases.find((p) => p.id === phaseId);
        if (!phase || phase.status === 'completed')
            return;
        phase.status = 'completed';
        phase.endTime = this.now();
        this.emit();
    }
    emit() {
        const part = {
            type: 'data-process-state',
            data: JSON.parse(JSON.stringify(this.state)),
        };
        this.writer.write(part);
    }
}
exports.ProcessTracker = ProcessTracker;
//# sourceMappingURL=process-tracker.js.map