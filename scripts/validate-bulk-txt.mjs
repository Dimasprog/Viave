/**
 * Verifică fișierele scripts/bulk/*.txt: format ro|ru, fără duplicate după `ro`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'bulk');

function checkFile(baseName) {
  const file = path.join(root, `${baseName}.txt`);
  if (!fs.existsSync(file)) {
    throw new Error(`Lipsește ${file}`);
  }
  const text = fs.readFileSync(file, 'utf8');
  const rows = [];
  const seen = new Set();
  const dupes = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) {
      continue;
    }
    const pipe = t.indexOf('|');
    if (pipe === -1) {
      throw new Error(`${baseName}: linie fără |: ${t}`);
    }
    const ro = t.slice(0, pipe).trim();
    const ru = t.slice(pipe + 1).trim();
    if (!ro || !ru) {
      throw new Error(`${baseName}: gol: ${t}`);
    }
    const k = ro.toLowerCase();
    if (seen.has(k)) {
      dupes.push(ro);
    }
    seen.add(k);
    rows.push({ ro, ru });
  }
  if (dupes.length) {
    throw new Error(
      `${baseName}: duplicate ro: ${dupes.slice(0, 15).join(', ')}`,
    );
  }
  console.error(`OK ${baseName}: ${rows.length} unice`);
}

const FILES = [
  'names',
  'places',
  'life',
  'nature',
  'animals',
  'objects',
  'food',
  'roles',
];

for (const n of FILES) {
  checkFile(n);
}
