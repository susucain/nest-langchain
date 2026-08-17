export type PresetAvatarId =
  | 'asset-20260720212547-j4tns'
  | 'asset-20260720213034-z8rzr'
  | 'asset-20260720210605-r4fdc'
  | 'asset-20260720212016-qfsgq'
  | 'asset-20260804202300-dfnsm'
  | 'asset-20260720211601-76nqw'
  | 'asset-20260804202404-mzn8z';

export interface PresetAvatar {
  id: PresetAvatarId;
  alias: string;
  displayName: string;
  style: 'modern' | 'hanfu';
  description: string;
  keywords: string[];
}

export const PRESET_AVATARS: readonly PresetAvatar[] = [
  {
    id: 'asset-20260720212547-j4tns',
    alias: '小叶',
    displayName: '小叶·软萌插画师',
    style: 'modern',
    description: '软萌可爱的现代插画师风格虚拟人像',
    keywords: ['创意', '美术', '文创', '设计', '年轻女性'],
  },
  {
    id: 'asset-20260720213034-z8rzr',
    alias: '程曦',
    displayName: '程曦·互联网实习生',
    style: 'modern',
    description: '干练亲和的互联网大厂实习生风格虚拟人像',
    keywords: ['科技', '职场', '商务', '互联网', '通勤'],
  },
  {
    id: 'asset-20260720210605-r4fdc',
    alias: '青黛',
    displayName: '青黛·国风插画师',
    style: 'modern',
    description: '现代国风插画师风格虚拟人像',
    keywords: ['国风', '文旅', '传统文化', '非遗', '茶文化'],
  },
  {
    id: 'asset-20260720212016-qfsgq',
    alias: '小岚',
    displayName: '小岚·新媒体运营',
    style: 'modern',
    description: '自然口播的新媒体运营风格虚拟人像',
    keywords: ['探店', '餐饮', '本地生活', '带货', '口播'],
  },
  {
    id: 'asset-20260804202300-dfnsm',
    alias: '瑶琴',
    displayName: '瑶琴·先秦名伶',
    style: 'hanfu',
    description: '先秦名伶风格虚拟人像',
    keywords: ['先秦', '历史', '古典', '文化演绎'],
  },
  {
    id: 'asset-20260720211601-76nqw',
    alias: '云游',
    displayName: '云游·玄幻散修',
    style: 'hanfu',
    description: '玄幻散修风格虚拟人像',
    keywords: ['玄幻', '仙侠', '奇幻', '修仙'],
  },
  {
    id: 'asset-20260804202404-mzn8z',
    alias: '凌霜',
    displayName: '凌霜·武林女侠',
    style: 'hanfu',
    description: '武林女侠客风格虚拟人像',
    keywords: ['武侠', '江湖', '古风', '女侠'],
  },
] as const;

export function isPresetAvatarId(value: string): value is PresetAvatarId {
  return PRESET_AVATARS.some((avatar) => avatar.id === value);
}

export function getPresetAvatar(id: PresetAvatarId): PresetAvatar {
  return PRESET_AVATARS.find((avatar) => avatar.id === id)!;
}
