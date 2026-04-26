#!/usr/bin/env node
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'web/packages/pyxis-components/src/public';

const groups = {
  atoms: [/chip/i],
  molecules: [/row/i, /tile/i, /card/i, /stub/i, /strip/i, /stats/i, /meta/i, /header/i, /filters/i, /list/i],
  organisms: [/form/i, /nav/i, /footer/i, /hero/i, /aside/i, /rules/i, /agreement/i, /block/i, /grid/i, /success/i, /info/i],
};

function classify(name) {
  for (const [level, patterns] of Object.entries(groups)) {
    if (patterns.some((pattern) => pattern.test(name))) return level;
  }
  return 'needs-review';
}

function componentDirs(dir) {
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isDirectory())
    .sort();
}

const rows = componentDirs(root).map((dir) => {
  const name = dir.split('/').pop();
  const files = readdirSync(dir);
  const tsx = files.includes(`${name}.tsx`);
  const css = files.includes(`${name}.css`);
  const story = files.includes(`${name}.stories.tsx`);
  const index = files.includes('index.ts');
  const source = existsSync(join(dir, `${name}.tsx`)) ? readFileSync(join(dir, `${name}.tsx`), 'utf8') : '';
  const importsGeneric = /from ['"]\.\.\/\.\.\/(atoms|molecules|organisms)\//.test(source) || /from ['"]\.\.\/\.\.\//.test(source);
  return { name, level: classify(name), tsx, css, story, index, importsGeneric, path: relative(process.cwd(), dir) };
});

console.log('| Component | Suggested level | TSX | CSS | Story | Index | Generic imports | Path |');
console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const row of rows) {
  console.log(`| ${row.name} | ${row.level} | ${row.tsx ? 'yes' : 'no'} | ${row.css ? 'yes' : 'no'} | ${row.story ? 'yes' : 'no'} | ${row.index ? 'yes' : 'no'} | ${row.importsGeneric ? 'yes' : 'no'} | ${row.path} |`);
}
