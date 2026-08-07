import { Repository } from 'typeorm';
import { VideoAsset } from './entities/video-asset.entity';
import { VideoScript } from './entities/video-script.entity';
import { VideoSession } from './entities/video-session.entity';
import { StoryboardParserService } from './storyboard-parser.service';
import { VideoTaskService } from './video-task.service';
import { ConfigService } from '@nestjs/config';
interface ToolContext {
    sessionId: string;
    userId: number;
    currentMessageId?: number;
    referencedVersion?: number;
}
export declare class VideoToolsService {
    private assetRepo;
    private scriptRepo;
    private sessionRepo;
    private storyboardParser;
    private taskService;
    private configService;
    private readonly skillsDir;
    constructor(assetRepo: Repository<VideoAsset>, scriptRepo: Repository<VideoScript>, sessionRepo: Repository<VideoSession>, storyboardParser: StoryboardParserService, taskService: VideoTaskService, configService: ConfigService);
    buildTools(ctx: ToolContext): {
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
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
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
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
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
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
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
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
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
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
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
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
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
                    script_id: number;
                    version: number;
                    title: string;
                    shot_count: number;
                    message: string;
                }>;
            }) => import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput | PromiseLike<import(".pnpm/@ai-sdk+provider-utils@5.0.15_zod@4.4.3/node_modules/@ai-sdk/provider-utils", { with: { "resolution-mode": "import" } }).ToolResultOutput>) | undefined;
        } & {
            outputSchema?: import("ai", { with: { "resolution-mode": "import" } }).FlexibleSchema<{
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
            }> | undefined;
            execute: import("ai", { with: { "resolution-mode": "import" } }).ToolExecuteFunction<{
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
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
                title: any;
                storyboard_markdown: any;
                seedance_prompt: any;
                meta: any;
            }, {
                script_id: number;
                version: number;
                title: string;
                shot_count: number;
                message: string;
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
    };
    private resolveSkillPath;
    private buildReadFileTool;
    private buildWriteFileTool;
    private buildUpdateProductProfileTool;
    private buildParseAssetTool;
    private buildGenerateScriptTool;
    private buildCreateVideoTaskTool;
    private getNextVersion;
}
export {};
