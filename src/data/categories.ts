export type WordCategoryId =
  | 'names'
  | 'places'
  | 'life'
  | 'nature'
  | 'animals'
  | 'objects'
  | 'food'
  | 'roles'
  | 'sunday'
  | 'mix';

export const WORD_CATEGORY_IDS: WordCategoryId[] = [
  'sunday',
  'names',
  'places',
  'life',
  'nature',
  'animals',
  'objects',
  'food',
  'roles',
  'mix',
];

export const CATEGORY_I18N_KEY: Record<WordCategoryId, string> = {
  sunday: 'category_sunday',
  names: 'category_names',
  places: 'category_places',
  life: 'category_life',
  nature: 'category_nature',
  animals: 'category_animals',
  objects: 'category_objects',
  food: 'category_food',
  roles: 'category_roles',
  mix: 'category_mix',
};
