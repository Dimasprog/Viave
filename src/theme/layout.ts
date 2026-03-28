import { spacing } from './spacing';

/** Extra horizontal padding when width > height (phones in landscape). */
export function landscapeSideExtra(isLandscape: boolean): number {
  return isLandscape ? spacing.xxl : 0;
}
