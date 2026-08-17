export type PresetAvatarId = 'asset-20260720212547-j4tns' | 'asset-20260720213034-z8rzr' | 'asset-20260720210605-r4fdc' | 'asset-20260720212016-qfsgq' | 'asset-20260804202300-dfnsm' | 'asset-20260720211601-76nqw' | 'asset-20260804202404-mzn8z';
export interface PresetAvatar {
    id: PresetAvatarId;
    alias: string;
    displayName: string;
    style: 'modern' | 'hanfu';
    description: string;
    keywords: string[];
}
export declare const PRESET_AVATARS: readonly PresetAvatar[];
export declare function isPresetAvatarId(value: string): value is PresetAvatarId;
export declare function getPresetAvatar(id: PresetAvatarId): PresetAvatar;
