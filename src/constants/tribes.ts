import type { TranslationKey } from '../i18n/translations';

export type TeamCount = 2 | 3 | 4 | 5;

/** Tribe keys aligned with i18n `tribe_*` translation keys (without prefix). */
export type TribeKey =
  | 'ruben'
  | 'simeon'
  | 'levi'
  | 'iuda'
  | 'dan'
  | 'neftali'
  | 'gad'
  | 'aser'
  | 'isahar'
  | 'zabulon'
  | 'iosif'
  | 'beniamin';

export function tribeTranslationKey(k: TribeKey): TranslationKey {
  return `tribe_${k}` as TranslationKey;
}

/**
 * Fixed subsets for Alias rounds (plan): 2 → Iuda vs Beniamin; 3 → Iuda, Levi,
 * Beniamin; 4 → Ruben, Simeon, Levi, Iuda.
 */
export function getTribeKeysForTeamCount(count: TeamCount): readonly TribeKey[] {
  switch (count) {
    case 2:
      return ['iuda', 'beniamin'];
    case 3:
      return ['iuda', 'levi', 'beniamin'];
    case 4:
      return ['ruben', 'simeon', 'levi', 'iuda'];
    case 5:
      return ['ruben', 'simeon', 'levi', 'iuda', 'beniamin'];
    default: {
      return count;
    }
  }
}
