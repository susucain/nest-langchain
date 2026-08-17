import { Repository } from 'typeorm';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoSession } from './entities/video-session.entity';
import { VideoTask } from './entities/video-task.entity';
import { StoryboardParserService } from './storyboard-parser.service';
import { VideoTaskService } from './video-task.service';
import { SeedancePromptValidatorService } from './seedance-prompt-validator.service';
interface ToolContext {
    sessionId: string;
    userId: number;
    currentMessageId?: number;
    referencedVersion?: number;
    waitingForUser?: boolean;
    scriptUnchanged?: boolean;
    fullVideoEdit?: {
        sourceAssetId: number;
        sourceDurationSec: number;
    };
}
export declare class VideoToolsService {
    private assetRepo;
    private scriptRepo;
    private sessionRepo;
    private taskRepo;
    private storyboardParser;
    private taskService;
    private seedancePromptValidator;
    private readonly skillsDir;
    constructor(assetRepo: Repository<VideoAsset>, scriptRepo: Repository<VideoScript>, sessionRepo: Repository<VideoSession>, taskRepo: Repository<VideoTask>, storyboardParser: StoryboardParserService, taskService: VideoTaskService, seedancePromptValidator: SeedancePromptValidatorService);
    buildTools(ctx: ToolContext): {
        start_script_creation: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<Record<string, never>>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<Record<string, never>>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        read_file: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                };
                output: NoInfer<{
                    path: any;
                    content: string;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    content?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    path: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                };
                output: NoInfer<{
                    path: any;
                    content: string;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    content?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    path: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                };
                output: NoInfer<{
                    path: any;
                    content: string;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    content?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                };
                output: NoInfer<{
                    path: any;
                    content: string;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    content?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
            }, {
                path: any;
                content: string;
                error?: undefined;
            } | {
                path: any;
                error: any;
                content?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        write_file: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
                content: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                    content: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                    content: any;
                };
                output: NoInfer<{
                    path: any;
                    bytes: number;
                    success: boolean;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    success: boolean;
                    bytes?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    path: any;
                    content: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
                content: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                    content: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                    content: any;
                };
                output: NoInfer<{
                    path: any;
                    bytes: number;
                    success: boolean;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    success: boolean;
                    bytes?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    path: any;
                    content: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
                content: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                    content: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                    content: any;
                };
                output: NoInfer<{
                    path: any;
                    bytes: number;
                    success: boolean;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    success: boolean;
                    bytes?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                content: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                path: any;
                content: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    path: any;
                    content: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    path: any;
                    content: any;
                };
                output: NoInfer<{
                    path: any;
                    bytes: number;
                    success: boolean;
                    error?: undefined;
                } | {
                    path: any;
                    error: any;
                    success: boolean;
                    bytes?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                path: any;
                content: any;
            }, {
                path: any;
                bytes: number;
                success: boolean;
                error?: undefined;
            } | {
                path: any;
                error: any;
                success: boolean;
                bytes?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        parse_asset: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                asset_id: any;
                summary: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    asset_id: any;
                    summary: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    asset_id: any;
                    summary: any;
                };
                output: NoInfer<{
                    asset_id: any;
                    summary: any;
                    status: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
                status: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    asset_id: any;
                    summary: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                asset_id: any;
                summary: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    asset_id: any;
                    summary: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    asset_id: any;
                    summary: any;
                };
                output: NoInfer<{
                    asset_id: any;
                    summary: any;
                    status: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
                status: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    asset_id: any;
                    summary: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                asset_id: any;
                summary: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    asset_id: any;
                    summary: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    asset_id: any;
                    summary: any;
                };
                output: NoInfer<{
                    asset_id: any;
                    summary: any;
                    status: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
                status: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                asset_id: any;
                summary: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    asset_id: any;
                    summary: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    asset_id: any;
                    summary: any;
                };
                output: NoInfer<{
                    asset_id: any;
                    summary: any;
                    status: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                asset_id: any;
                summary: any;
                status: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                asset_id: any;
                summary: any;
            }, {
                asset_id: any;
                summary: any;
                status: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        update_product_profile: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<any>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<any, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: any;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: any;
                output: NoInfer<{
                    success: boolean;
                    profile: {
                        [x: string]: any;
                    };
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: any;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<any>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<any, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: any;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: any;
                output: NoInfer<{
                    success: boolean;
                    profile: {
                        [x: string]: any;
                    };
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: any;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<any>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<any, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: any;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: any;
                output: NoInfer<{
                    success: boolean;
                    profile: {
                        [x: string]: any;
                    };
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<any>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<any, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: any;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: any;
                output: NoInfer<{
                    success: boolean;
                    profile: {
                        [x: string]: any;
                    };
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<any, {
                success: boolean;
                profile: {
                    [x: string]: any;
                };
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        generate_script: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    warnings?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    success: boolean;
                    message: string;
                    warnings: string[];
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                    warnings: string[];
                    success?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    warnings?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    success: boolean;
                    message: string;
                    warnings: string[];
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                    warnings: string[];
                    success?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    warnings?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    success: boolean;
                    message: string;
                    warnings: string[];
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                    warnings: string[];
                    success?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    storyboard_markdown: any;
                    seedance_prompt: any;
                    meta: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    warnings?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    success: boolean;
                    message: string;
                    warnings: string[];
                    script_id?: undefined;
                    version?: undefined;
                    title?: undefined;
                    shot_count?: undefined;
                } | {
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                    warnings: string[];
                    success?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                success: boolean;
                message: string;
                warnings?: undefined;
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                success: boolean;
                message: string;
                warnings: string[];
                script_id?: undefined;
                version?: undefined;
                title?: undefined;
                shot_count?: undefined;
            } | {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
                warnings: string[];
                success?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        complete_without_script_change: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
                description: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
                description: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                    description: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                    description: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    status?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    description?: undefined;
                } | {
                    success: boolean;
                    status: string;
                    script_id: number;
                    version: number;
                    description: any;
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    script_id: any;
                    description: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
                description: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
                description: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                    description: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                    description: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    status?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    description?: undefined;
                } | {
                    success: boolean;
                    status: string;
                    script_id: number;
                    version: number;
                    description: any;
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    script_id: any;
                    description: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
                description: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
                description: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                    description: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                    description: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    status?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    description?: undefined;
                } | {
                    success: boolean;
                    status: string;
                    script_id: number;
                    version: number;
                    description: any;
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
                description: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
                description: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                    description: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                    description: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    status?: undefined;
                    script_id?: undefined;
                    version?: undefined;
                    description?: undefined;
                } | {
                    success: boolean;
                    status: string;
                    script_id: number;
                    version: number;
                    description: any;
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
                description: any;
            }, {
                success: boolean;
                message: string;
                status?: undefined;
                script_id?: undefined;
                version?: undefined;
                description?: undefined;
            } | {
                success: boolean;
                status: string;
                script_id: number;
                version: number;
                description: any;
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        request_user_confirmation: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                description: any;
                questions: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
                output: NoInfer<{
                    success: boolean;
                    status: string;
                    title: any;
                    description: any;
                    questions: any;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    title: any;
                    description: any;
                    questions: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                description: any;
                questions: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
                output: NoInfer<{
                    success: boolean;
                    status: string;
                    title: any;
                    description: any;
                    questions: any;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    title: any;
                    description: any;
                    questions: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                description: any;
                questions: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
                output: NoInfer<{
                    success: boolean;
                    status: string;
                    title: any;
                    description: any;
                    questions: any;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                title: any;
                description: any;
                questions: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    title: any;
                    description: any;
                    questions: any;
                };
                output: NoInfer<{
                    success: boolean;
                    status: string;
                    title: any;
                    description: any;
                    questions: any;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                description: any;
                questions: any;
            }, {
                success: boolean;
                status: string;
                title: any;
                description: any;
                questions: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        create_video_task: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task_id?: undefined;
                    script_id?: undefined;
                    status?: undefined;
                } | {
                    success: boolean;
                    task_id: string;
                    script_id: number;
                    status: string;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    script_id: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task_id?: undefined;
                    script_id?: undefined;
                    status?: undefined;
                } | {
                    success: boolean;
                    task_id: string;
                    script_id: number;
                    status: string;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    script_id: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task_id?: undefined;
                    script_id?: undefined;
                    status?: undefined;
                } | {
                    success: boolean;
                    task_id: string;
                    script_id: number;
                    status: string;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                script_id: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    script_id: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    script_id: any;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task_id?: undefined;
                    script_id?: undefined;
                    status?: undefined;
                } | {
                    success: boolean;
                    task_id: string;
                    script_id: number;
                    status: string;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                script_id: any;
            }, {
                success: boolean;
                message: string;
                task_id?: undefined;
                script_id?: undefined;
                status?: undefined;
            } | {
                success: boolean;
                task_id: string;
                script_id: number;
                status: string;
                message: string;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        get_script: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    script?: undefined;
                } | {
                    success: boolean;
                    script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        seedance_prompt: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        seedance_prompt: string;
                        meta: Record<string, any>;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    script?: undefined;
                } | {
                    success: boolean;
                    script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        seedance_prompt: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        seedance_prompt: string;
                        meta: Record<string, any>;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    script?: undefined;
                } | {
                    success: boolean;
                    script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        seedance_prompt: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        seedance_prompt: string;
                        meta: Record<string, any>;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    include: "seedance_prompt" | "summary" | "storyboard" | "full";
                    script_id?: number | undefined;
                    version?: number | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    script?: undefined;
                } | {
                    success: boolean;
                    script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        seedance_prompt: string;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                } | {
                    success: boolean;
                    script: {
                        storyboard_markdown: string;
                        seedance_prompt: string;
                        meta: Record<string, any>;
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                include: "seedance_prompt" | "summary" | "storyboard" | "full";
                script_id?: number | undefined;
                version?: number | undefined;
            }, {
                success: boolean;
                message: string;
                script?: undefined;
            } | {
                success: boolean;
                script: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    seedance_prompt: string;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            } | {
                success: boolean;
                script: {
                    storyboard_markdown: string;
                    seedance_prompt: string;
                    meta: Record<string, any>;
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        list_scripts: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                limit: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                limit: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    limit: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    limit: any;
                };
                output: NoInfer<{
                    success: boolean;
                    scripts: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    }[];
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    limit: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                limit: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                limit: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    limit: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    limit: any;
                };
                output: NoInfer<{
                    success: boolean;
                    scripts: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    }[];
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    limit: any;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                limit: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                limit: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    limit: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    limit: any;
                };
                output: NoInfer<{
                    success: boolean;
                    scripts: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    }[];
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                limit: any;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                limit: any;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    limit: any;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    limit: any;
                };
                output: NoInfer<{
                    success: boolean;
                    scripts: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                        shot_count: number;
                        created_at: string | null;
                    }[];
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                limit: any;
            }, {
                success: boolean;
                scripts: {
                    script_id: number;
                    version: number;
                    title: string;
                    status: string;
                    shot_count: number;
                    created_at: string | null;
                }[];
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        get_video_task_status: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                task_id?: string | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                task_id?: string | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    task_id?: string | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    task_id?: string | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task?: undefined;
                } | {
                    success: boolean;
                    task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        script_version: number | undefined;
                        script_title: string | undefined;
                        model: string;
                        duration: number;
                        resolution: string;
                        ratio: string;
                        generated_video_url: string;
                        last_frame_url: string;
                        error_code: string;
                        error_message: string;
                        created_at: string | null;
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    task_id?: string | undefined;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                task_id?: string | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                task_id?: string | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    task_id?: string | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    task_id?: string | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task?: undefined;
                } | {
                    success: boolean;
                    task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        script_version: number | undefined;
                        script_title: string | undefined;
                        model: string;
                        duration: number;
                        resolution: string;
                        ratio: string;
                        generated_video_url: string;
                        last_frame_url: string;
                        error_code: string;
                        error_message: string;
                        created_at: string | null;
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<{
                    task_id?: string | undefined;
                }>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                task_id?: string | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                task_id?: string | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    task_id?: string | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    task_id?: string | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task?: undefined;
                } | {
                    success: boolean;
                    task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        script_version: number | undefined;
                        script_title: string | undefined;
                        model: string;
                        duration: number;
                        resolution: string;
                        ratio: string;
                        generated_video_url: string;
                        last_frame_url: string;
                        error_code: string;
                        error_message: string;
                        created_at: string | null;
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                task_id?: string | undefined;
            }>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<{
                task_id?: string | undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: {
                    task_id?: string | undefined;
                };
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: {
                    task_id?: string | undefined;
                };
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    task?: undefined;
                } | {
                    success: boolean;
                    task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        script_version: number | undefined;
                        script_title: string | undefined;
                        model: string;
                        duration: number;
                        resolution: string;
                        ratio: string;
                        generated_video_url: string;
                        last_frame_url: string;
                        error_code: string;
                        error_message: string;
                        created_at: string | null;
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                task_id?: string | undefined;
            }, {
                success: boolean;
                message: string;
                task?: undefined;
            } | {
                success: boolean;
                task: {
                    task_id: string;
                    status: string;
                    script_id: number;
                    script_version: number | undefined;
                    script_title: string | undefined;
                    model: string;
                    duration: number;
                    resolution: string;
                    ratio: string;
                    generated_video_url: string;
                    last_frame_url: string;
                    error_code: string;
                    error_message: string;
                    created_at: string | null;
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
        get_session_state: ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    session?: undefined;
                } | {
                    success: boolean;
                    session: {
                        session_id: string;
                        status: string;
                        topic: string;
                        product_profile: Record<string, any>;
                        latest_script: {
                            script_id: number;
                            version: number;
                            title: string;
                            status: string;
                        } | null;
                        video_task: {
                            task_id: string;
                            status: string;
                            script_id: number;
                            generated_video_url: string;
                            error_message: string;
                            updated_at: string | null;
                        } | null;
                        assets: {
                            total: number;
                            analysis: number;
                            reference: number;
                        };
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<Record<string, never>>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type?: undefined | "function";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    session?: undefined;
                } | {
                    success: boolean;
                    session: {
                        session_id: string;
                        status: string;
                        topic: string;
                        product_profile: Record<string, any>;
                        latest_script: {
                            script_id: number;
                            version: number;
                            title: string;
                            status: string;
                        } | null;
                        video_task: {
                            task_id: string;
                            status: string;
                            script_id: number;
                            generated_video_url: string;
                            error_message: string;
                            updated_at: string | null;
                        } | null;
                        assets: {
                            total: number;
                            analysis: number;
                            reference: number;
                        };
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            description?: string | ((options: {
                context: NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>;
                experimental_sandbox?: import("ai", { with: { "resolution-mode": "import" } }).Experimental_SandboxSession;
            }) => string) | undefined;
            strict?: boolean;
            inputExamples?: {
                input: NoInfer<Record<string, never>>;
            }[] | undefined;
            id?: never;
            isProviderExecuted?: never;
            args?: never;
            supportsDeferredResults?: never;
        } & {
            type: "dynamic";
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    session?: undefined;
                } | {
                    success: boolean;
                    session: {
                        session_id: string;
                        status: string;
                        topic: string;
                        product_profile: Record<string, any>;
                        latest_script: {
                            script_id: number;
                            version: number;
                            title: string;
                            status: string;
                        } | null;
                        video_task: {
                            task_id: string;
                            status: string;
                            script_id: number;
                            generated_video_url: string;
                            error_message: string;
                            updated_at: string | null;
                        } | null;
                        assets: {
                            total: number;
                            analysis: number;
                            reference: number;
                        };
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: false;
            supportsDeferredResults?: never;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        }) | ({
            title?: string;
            providerOptions?: import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ProviderOptions;
            metadata?: import(".pnpm/@ai-sdk+provider@4.0.4/node_modules/@ai-sdk/provider", { with: { "resolution-mode": "import" } }).JSONObject;
            inputSchema: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<Record<string, never>>;
            contextSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context> | undefined;
            needsApproval?: boolean | import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolNeedsApprovalFunction<Record<string, never>, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>> | undefined;
            onInputStart?: ((options: import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputDelta?: ((options: {
                inputTextDelta: string;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            onInputAvailable?: ((options: {
                input: Record<string, never>;
            } & import("ai", { with: { "resolution-mode": "import" } }).ToolExecutionOptions<NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>) => void | PromiseLike<void>) | undefined;
            toModelOutput?: ((options: {
                toolCallId: string;
                input: Record<string, never>;
                output: NoInfer<{
                    success: boolean;
                    message: string;
                    session?: undefined;
                } | {
                    success: boolean;
                    session: {
                        session_id: string;
                        status: string;
                        topic: string;
                        product_profile: Record<string, any>;
                        latest_script: {
                            script_id: number;
                            version: number;
                            title: string;
                            status: string;
                        } | null;
                        video_task: {
                            task_id: string;
                            status: string;
                            script_id: number;
                            generated_video_url: string;
                            error_message: string;
                            updated_at: string | null;
                        } | null;
                        assets: {
                            total: number;
                            analysis: number;
                            reference: number;
                        };
                        updated_at: string | null;
                    };
                    message?: undefined;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        } & {
            type: "provider";
            id: `${string}.${string}`;
            args: Record<string, unknown>;
            description?: never;
            strict?: never;
            inputExamples?: never;
        } & {
            isProviderExecuted: true;
            supportsDeferredResults?: boolean;
        } & {
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<Record<string, never>, {
                success: boolean;
                message: string;
                session?: undefined;
            } | {
                success: boolean;
                session: {
                    session_id: string;
                    status: string;
                    topic: string;
                    product_profile: Record<string, any>;
                    latest_script: {
                        script_id: number;
                        version: number;
                        title: string;
                        status: string;
                    } | null;
                    video_task: {
                        task_id: string;
                        status: string;
                        script_id: number;
                        generated_video_url: string;
                        error_message: string;
                        updated_at: string | null;
                    } | null;
                    assets: {
                        total: number;
                        analysis: number;
                        reference: number;
                    };
                    updated_at: string | null;
                };
                message?: undefined;
            }, NoInfer<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).Context>>;
        });
    };
    private buildStartScriptCreationTool;
    private buildRequestUserConfirmationTool;
    private buildCompleteWithoutScriptChangeTool;
    private resolveSkillPath;
    private buildReadFileTool;
    private buildWriteFileTool;
    private buildUpdateProductProfileTool;
    private buildParseAssetTool;
    private buildGenerateScriptTool;
    private buildCreateVideoTaskTool;
    private buildGetScriptTool;
    private buildListScriptsTool;
    private buildGetVideoTaskStatusTool;
    private buildGetSessionStateTool;
    private getNextVersion;
    private toISOString;
}
export {};
