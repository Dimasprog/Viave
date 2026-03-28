/**
 * Verifică: 250 linii per fișier, fără duplicate după câmpul `ro`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, 'bulk');

function check(name, expected = 250) {
  const file = path.join(root, `${name}.txt`);
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
      throw new Error(`${name}: linie fără |: ${t}`);
    }
    const ro = t.slice(0, pipe).trim();
    const ru = t.slice(pipe + 1).trim();
    if (!ro || !ru) {
      throw new Error(`${name}: gol: ${t}`);
    }
    if (seen.has(ro)) {
      dupes.push(ro);
    }
    seen.add(ro);
    rows.push({ ro, ru });
  }
  if (rows.length !== expected) {
    throw new Error(`${name}: așteptat ${expected} intrări, am ${rows.length}`);
  }
  if (dupes.length) {
    throw new Error(`${name}: duplicate ro: ${dupes.slice(0, 15).join(', ')}`);
  }
  console.error(`OK ${name}: ${rows.length} unice`);
}

for (const n of ['names', 'places', 'life', 'nature']) {
  check(n, 250);
}
