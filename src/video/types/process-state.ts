export type ProcessStatus = 'pending' | 'running' | 'completed' | 'error' | 'skipped';

export interface ProcessItem {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  /** 小标签，如「已解析」 */
  tag?: { text: string; type: 'success' | 'info' };
  /** 额外元信息，用于前端展示时长、平台等 */
  meta?: Record<string, string | number | undefined>;
}

export interface ProcessCard {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}

export interface ProcessAction {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface ProcessOutput {
  title: string;
  tags: string[];
}

export interface ProcessPhase {
  id: 'parse-materials' | 'load-guidelines' | 'generate-script';
  title: string;
  description: string;
  status: ProcessStatus;
  startTime?: number;
  endTime?: number;
  /** 阶段 1 使用：素材子项列表 */
  items?: ProcessItem[];
  /** 阶段 2 使用：能力规范卡片 */
  cards?: ProcessCard[];
  /** 阶段 3 使用：已完成的动作 */
  actions?: ProcessAction[];
  /** 阶段 3 使用：产出预览 */
  outputs?: ProcessOutput[];
}

export interface ProcessState {
  status: ProcessStatus;
  startTime?: number;
  endTime?: number;
  phases: ProcessPhase[];
}

export interface ProcessStateDataPart {
  type: 'data-process-state';
  data: ProcessState;
}
