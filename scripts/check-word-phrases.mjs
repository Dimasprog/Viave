/**
 * Verifică ro: din words.ts și words_bulk.ts:
 * - max 3 cuvinte (tokeni separați prin spațiu)
 * - la exact 3 cuvinte, al doilea trebuie să fie prepoziție de legătură
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const PREP = new Set([
  'de',
  'din',
  'în',
  'in',
  'la',
  'pe',
  'cu',
  'fără',
  'fara',
  'lui',
  'pentru',
  'sub',
  'spre',
  'ca',
  'prin',
  'față',
  'fata',
  'fața',
  'despre',
  'după',
  'dupa',
  'până',
  'pana',
  'între',
  'intre',
  'asupra',
  'și',
  'si',
  'sau',
  'dar',
]);

function violationsInSource(text, label, roPattern) {
  const bad = [];
  let m;
  const re = new RegExp(roPattern, 'g');
  while ((m = re.exec(text))) {
    const ro = m[1];
    const tokens = ro
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const n = tokens.length;
    if (n >= 4) {
      bad.push(`${label}: (${n} cuvinte) ${ro}`);
      continue;
    }
    if (n === 3) {
      const mid = tokens[1].toLowerCase().replace(/[.,]/g, '');
      if (!PREP.has(mid)) {
        bad.push(`${label}: (3 cuvinte, mijloc „${tokens[1]}”) ${ro}`);
      }
    }
  }
  return bad;
}

const files = [
  {
    path: path.join(root, 'src/data/words.ts'),
    label: 'words.ts',
    pattern: "ro: '([^']+)'",
  },
  {
    path: path.join(root, 'src/data/words_bulk.ts'),
    label: 'words_bulk.ts',
    pattern: 'ro: "([^"]+)"',
  },
];

let all = [];
for (const f of files) {
  const text = fs.readFileSync(f.path, 'utf8');
  all = all.concat(violationsInSource(text, f.label, f.pattern));
}

if (all.length) {
  console.error('Încălcări regulă frază (Alias):\n' + all.join('\n'));
  process.exit(1);
}
console.log('OK: toate intrările ro respectă regula (≤2 cuvinte sau 3 cu prep. la mijloc).');
