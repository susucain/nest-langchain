export interface SeedancePromptValidationResult {
    errors: string[];
    warnings: string[];
}
export declare class SeedancePromptValidatorService {
    validate(prompt: string): SeedancePromptValidationResult;
}
