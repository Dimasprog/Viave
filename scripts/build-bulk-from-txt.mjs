/**
 * Generează src/data/words_bulk.ts din scripts/bulk/*.txt (câte o linie: ro|ru).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'bulk');

function parse(name) {
  const file = path.join(root, `${name}.txt`);
  const text = fs.readFileSync(file, 'utf8');
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) {
      continue;
    }
    const pipe = t.indexOf('|');
    if (pipe === -1) {
      continue;
    }
    const ro = t.slice(0, pipe).trim();
    const ru = t.slice(pipe + 1).trim();
    if (ro && ru) {
      rows.push({ ro, ru });
    }
  }
  return rows;
}

function emitTs(constName, rows) {
  const lines = rows.map(
    r =>
      `  { ro: ${JSON.stringify(r.ro)}, ru: ${JSON.stringify(r.ru)} },`,
  );
  return `export const ${constName}: { ro: string; ru: string }[] = [\n${lines.join('\n')}\n];\n`;
}

const names = parse('names');
const places = parse('places');
const life = parse('life');
const nature = parse('nature');

const header = `/**
 * Generat de scripts/build-bulk-from-txt.mjs — nu edita manual array-urile mari.
 * Surse: scripts/bulk/*.txt
 */
`;

const body = [
  emitTs('BULK_NAMES', names),
  emitTs('BULK_PLACES', places),
  emitTs('BULK_LIFE', life),
  emitTs('BULK_NATURE', nature),
].join('\n');

const outPath = path.join(__dirname, '../src/data/words_bulk.ts');
fs.writeFileSync(outPath, header + body, 'utf8');

console.error(
  `Wrote ${outPath}: names=${names.length} places=${places.length} life=${life.length} nature=${nature.length} total=${names.length + places.length + life.length + nature.length}`,
);
