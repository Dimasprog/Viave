export type WordCategoryId =
  | 'names'
  | 'places'
  | 'life'
  | 'nature'
  | 'mix';

export const WORD_CATEGORY_IDS: WordCategoryId[] = [
  'names',
  'places',
  'life',
  'nature',
  'mix',
];

export const CATEGORY_I18N_KEY: Record<WordCategoryId, string> = {
  names: 'category_names',
  places: 'category_places',
  life: 'category_life',
  nature: 'category_nature',
  mix: 'category_mix',
};
