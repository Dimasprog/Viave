import type { LanguageCode } from '../i18n/types';
import type { WordCategoryId } from './categories';
import {
  BULK_ANIMALS,
  BULK_FOOD,
  BULK_LIFE,
  BULK_NAMES,
  BULK_NATURE,
  BULK_OBJECTS,
  BULK_PLACES,
  BULK_ROLES,
  BULK_SUNDAY,
} from './words_bulk';

export type WordEntry = {
  ro: string;
  ru: string;
};

function label(entry: WordEntry, lang: LanguageCode): string {
  return lang === 'ru' ? entry.ru : entry.ro;
}

const NAMES_CORE: WordEntry[] = [
  { ro: 'Adam', ru: 'Адам' },
  { ro: 'Eva', ru: 'Ева' },
  { ro: 'Noe', ru: 'Ной' },
  { ro: 'Avraam', ru: 'Авраам' },
  { ro: 'Isaac', ru: 'Исаак' },
  { ro: 'Iacov', ru: 'Иаков' },
  { ro: 'Iosif', ru: 'Иосиф' },
  { ro: 'Moise', ru: 'Моисей' },
  { ro: 'Aaron', ru: 'Аарон' },
  { ro: 'Iosua', ru: 'Иисус Навин' },
  { ro: 'David', ru: 'Давид' },
  { ro: 'Solomon', ru: 'Соломон' },
  { ro: 'Ilie', ru: 'Илия' },
  { ro: 'Isaia', ru: 'Исаия' },
  { ro: 'Ieremia', ru: 'Иеремия' },
  { ro: 'Daniel', ru: 'Даниил' },
  { ro: 'Estera', ru: 'Есфирь' },
  { ro: 'Rut', ru: 'Руфь' },
  { ro: 'Maria', ru: 'Мария' },
  { ro: 'Ioan', ru: 'Иоанн' },
  { ro: 'Petru', ru: 'Пётр' },
  { ro: 'Pavel', ru: 'Павел' },
  { ro: 'Timotei', ru: 'Тимофей' },
  { ro: 'Toma', ru: 'Фома' },
];

const PLACES_CORE: WordEntry[] = [
  { ro: 'Ierusalim', ru: 'Иерусалим' },
  { ro: 'Betleem', ru: 'Вифлеем' },
  { ro: 'Nazaret', ru: 'Назарет' },
  { ro: 'Galileea', ru: 'Галилея' },
  { ro: 'Iordan', ru: 'Иордан' },
  { ro: 'Sinai', ru: 'Синай' },
  { ro: 'Egipt', ru: 'Египет' },
  { ro: 'Babilon', ru: 'Вавилон' },
  { ro: 'Ninive', ru: 'Ниневия' },
  { ro: 'Damasc', ru: 'Дамаск' },
  { ro: 'Antiohia', ru: 'Антиохия' },
  { ro: 'Efes', ru: 'Эфес' },
  { ro: 'Corint', ru: 'Коринф' },
  { ro: 'Roma', ru: 'Рим' },
  { ro: 'Canaan', ru: 'Ханаан' },
  { ro: 'Betel', ru: 'Вефиль' },
  { ro: 'Sihem', ru: 'Сихем' },
  { ro: 'Gherico', ru: 'Иерихон' },
  { ro: 'Beer-Șeba', ru: 'Вирсавия' },
  { ro: 'Capernaum', ru: 'Капернаум' },
  { ro: 'Samaria', ru: 'Самария' },
  { ro: 'Tars', ru: 'Тарс' },
  { ro: 'Filipi', ru: 'Филиппы' },
];

const LIFE_CORE: WordEntry[] = [
  { ro: 'rugăciune', ru: 'молитва' },
  { ro: 'post', ru: 'пост' },
  { ro: 'legământ', ru: 'завет' },
  { ro: 'credință', ru: 'вера' },
  { ro: 'nădejde', ru: 'надежда' },
  { ro: 'dragoste', ru: 'любовь' },
  { ro: 'milă', ru: 'милость' },
  { ro: 'iertare', ru: 'прощение' },
  { ro: 'pocăință', ru: 'покаяние' },
  { ro: 'botez', ru: 'крещение' },
  { ro: 'Cina', ru: 'вечеря' },
  { ro: 'Sabat', ru: 'суббота' },
  { ro: 'înviere', ru: 'воскресение' },
  { ro: 'judecată', ru: 'суд' },
  { ro: 'har', ru: 'благодать' },
  { ro: 'slujire', ru: 'служение' },
  { ro: 'ascultare', ru: 'послушание' },
  { ro: 'laudă', ru: 'хвала' },
  { ro: 'mulțumire', ru: 'благодарение' },
  { ro: 'închinare', ru: 'поклонение' },
  { ro: 'sfințenie', ru: 'святость' },
  { ro: 'pace', ru: 'мир' },
  { ro: 'adevăr', ru: 'истина' },
  { ro: 'lumină', ru: 'свет' },
];

const NATURE_CORE: WordEntry[] = [
  { ro: 'leu', ru: 'лев' },
  { ro: 'oaie', ru: 'овца' },
  { ro: 'porumbel', ru: 'голубь' },
  { ro: 'șarpe', ru: 'змей' },
  { ro: 'pește', ru: 'рыба' },
  { ro: 'grâu', ru: 'пшеница' },
  { ro: 'smochin', ru: 'инжир' },
  { ro: 'măslin', ru: 'олива' },
  { ro: 'viță', ru: 'лоза' },
  { ro: 'stea', ru: 'звезда' },
  { ro: 'soare', ru: 'солнце' },
  { ro: 'lună', ru: 'луна' },
  { ro: 'potop', ru: 'потоп' },
  { ro: 'foc', ru: 'огонь' },
  { ro: 'ploaie', ru: 'дождь' },
  { ro: 'vânt', ru: 'ветер' },
  { ro: 'mare', ru: 'море' },
  { ro: 'munte', ru: 'гора' },
  { ro: 'râu', ru: 'река' },
  { ro: 'pustie', ru: 'пустыня' },
  { ro: 'rodie', ru: 'гранат' },
  { ro: 'cedru', ru: 'кедр' },
  { ro: 'liliac', ru: 'лилия' },
];

const ANIMALS_CORE: WordEntry[] = [
  { ro: 'leu', ru: 'лев' },
  { ro: 'măgar', ru: 'осёл' },
  { ro: 'cămilă', ru: 'верблюд' },
  { ro: 'porumbel', ru: 'голубь' },
  { ro: 'corb', ru: 'ворон' },
  { ro: 'vultur', ru: 'орёл' },
];

const OBJECTS_CORE: WordEntry[] = [
  { ro: 'arc', ru: 'лук' },
  { ro: 'sabie', ru: 'меч' },
  { ro: 'chivot', ru: 'ковчег' },
  { ro: 'menorah', ru: 'менора' },
  { ro: 'potir', ru: 'чаша' },
  { ro: 'șofar', ru: 'шофар' },
];

const FOOD_CORE: WordEntry[] = [
  { ro: 'pâine', ru: 'хлеб' },
  { ro: 'azimă', ru: 'опресноки' },
  { ro: 'miere', ru: 'мёд' },
  { ro: 'vin', ru: 'вино' },
  { ro: 'untdelemn', ru: 'елей' },
  { ro: 'sare', ru: 'соль' },
];

const ROLES_CORE: WordEntry[] = [
  { ro: 'prooroc', ru: 'пророк' },
  { ro: 'preot', ru: 'священник' },
  { ro: 'apostol', ru: 'апостол' },
  { ro: 'păstor', ru: 'пастыр' },
  { ro: 'împărat', ru: 'царь' },
  { ro: 'judecător', ru: 'судья' },
];

const SUNDAY_CORE: WordEntry[] = [
  { ro: 'Isus', ru: 'Иисус' },
  { ro: 'Dumnezeu', ru: 'Бог' },
  { ro: 'Adam', ru: 'Адам' },
  { ro: 'Eva', ru: 'Ева' },
  { ro: 'Noe', ru: 'Ной' },
  { ro: 'David', ru: 'Давид' },
  { ro: 'Moise', ru: 'Моисей' },
  { ro: 'Maria', ru: 'Мария' },
  { ro: 'dragoste', ru: 'любовь' },
  { ro: 'pace', ru: 'мир' },
  { ro: 'credință', ru: 'вера' },
  { ro: 'rugăciune', ru: 'молитва' },
  { ro: 'bucurie', ru: 'радость' },
  { ro: 'corabie', ru: 'корабль' },
  { ro: 'înger', ru: 'ангел' },
  { ro: 'stea', ru: 'звезда' },
];

function uniqueWords(entries: WordEntry[]): WordEntry[] {
  const seen = new Set<string>();
  const out: WordEntry[] = [];
  for (const e of entries) {
    const k = `${e.ro}|${e.ru}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(e);
    }
  }
  return out;
}

const NAMES: WordEntry[] = uniqueWords([...NAMES_CORE, ...BULK_NAMES]);
const PLACES: WordEntry[] = uniqueWords([...PLACES_CORE, ...BULK_PLACES]);
const LIFE: WordEntry[] = uniqueWords([...LIFE_CORE, ...BULK_LIFE]);
const NATURE: WordEntry[] = uniqueWords([...NATURE_CORE, ...BULK_NATURE]);
const ANIMALS: WordEntry[] = uniqueWords([...ANIMALS_CORE, ...BULK_ANIMALS]);
const OBJECTS: WordEntry[] = uniqueWords([...OBJECTS_CORE, ...BULK_OBJECTS]);
const FOOD: WordEntry[] = uniqueWords([...FOOD_CORE, ...BULK_FOOD]);
const ROLES: WordEntry[] = uniqueWords([...ROLES_CORE, ...BULK_ROLES]);
const SUNDAY: WordEntry[] = uniqueWords([...SUNDAY_CORE, ...BULK_SUNDAY]);

const BY_ID: Record<Exclude<WordCategoryId, 'mix'>, WordEntry[]> = {
  sunday: SUNDAY,
  names: NAMES,
  places: PLACES,
  life: LIFE,
  nature: NATURE,
  animals: ANIMALS,
  objects: OBJECTS,
  food: FOOD,
  roles: ROLES,
};

/** Fisher–Yates shuffle copy */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getWordsForCategory(categoryId: WordCategoryId): WordEntry[] {
  if (categoryId === 'mix') {
    const merged = [
      ...BY_ID.names,
      ...BY_ID.places,
      ...BY_ID.life,
      ...BY_ID.nature,
      ...BY_ID.animals,
      ...BY_ID.objects,
      ...BY_ID.food,
      ...BY_ID.roles,
    ];
    return shuffle(uniqueWords(merged));
  }
  return shuffle([...BY_ID[categoryId]]);
}

export function wordAt(
  entries: WordEntry[],
  index: number,
  lang: LanguageCode,
): string {
  const e = entries[index];
  if (!e) {
    return '';
  }
  return label(e, lang);
}
