import { productMoment } from './workMoments/product';
import { designMoment } from './workMoments/design';
import { workMomentsOthers } from './workMoments/others';
import type { WorkMoment } from './workMomentTypes';

export type {
  WorkMoment,
  JargonItem,
  TermItem,
  ToolItem,
  DayFlowItem,
  MomentStep,
  WorkMomentSummary,
  StepVisual,
  StepVisualId,
} from './workMomentTypes';

export const workMoments: Record<string, WorkMoment> = {
  product: productMoment,
  design: designMoment,
  ...workMomentsOthers,
};

export function getWorkMoment(deptId: string): WorkMoment | undefined {
  return workMoments[deptId];
}
