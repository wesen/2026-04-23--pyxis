#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = process.env.PYXIS_REPO_ROOT || path.resolve(scriptDir, '../../..');
const catalogRoot = path.join(repoRoot, 'prototype-design/storybook-catalog');
const manifestPath = path.join(catalogRoot, 'manifest.json');
const indexPath = path.join(catalogRoot, 'index.html');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
function relFromCatalog(abs) {
  return path.relative(catalogRoot, abs).split(path.sep).join('/');
}
function existsRel(rel) {
  return fs.existsSync(path.join(repoRoot, rel));
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Missing manifest: ${manifestPath}`);
  process.exit(2);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const byGroup = new Map();
for (const entry of manifest.entries || []) {
  if (!byGroup.has(entry.group)) byGroup.set(entry.group, []);
  byGroup.get(entry.group).push(entry);
}

const groupOrder = ['atoms', 'molecules', 'organisms', 'public'];
const cards = [];
for (const group of groupOrder) {
  const entries = byGroup.get(group) || [];
  if (!entries.length) continue;
  cards.push(`<section><h2>${esc(group)} <span>${entries.length}</span></h2><div class="grid">`);
  for (const entry of entries) {
    const artifactBase = `${entry.output}/inspect/original`;
    const shotRel = `${artifactBase}/capture-target/screenshot.png`;
    const rootRel = `${artifactBase}/story-root/screenshot.png`;
    const cssRel = `${artifactBase}/capture-target/computed-css.md`;
    const inspectRel = `${artifactBase}/capture-target/inspect.json`;
    const shot = existsRel(shotRel) ? shotRel : (existsRel(rootRel) ? rootRel : '');
    cards.push(`<article class="card">
      <h3>${esc(entry.title)} / ${esc(entry.storyName)}</h3>
      <p><code>${esc(entry.storyId)}</code></p>
      ${shot ? `<a href="../../${esc(shot)}"><img src="../../${esc(shot)}" loading="lazy" alt="${esc(entry.title)} ${esc(entry.storyName)} capture" /></a>` : '<div class="missing">No capture yet</div>'}
      <nav>
        <a href="../../${esc(entry.config)}">config</a>
        ${existsRel(cssRel) ? `<a href="../../${esc(cssRel)}">css</a>` : ''}
        ${existsRel(inspectRel) ? `<a href="../../${esc(inspectRel)}">inspect</a>` : ''}
        ${existsRel(rootRel) ? `<a href="../../${esc(rootRel)}">story-root</a>` : ''}
      </nav>
    </article>`);
  }
  cards.push('</div></section>');
}

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pyxis Storybook Catalog</title>
  <style>
    :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f3f1eb; color: #1d1b18; }
    body { margin: 0; padding: 32px; }
    header { max-width: 1160px; margin: 0 auto 28px; }
    h1 { font-size: 32px; margin: 0 0 8px; letter-spacing: -0.04em; }
    header p { margin: 0; color: #6f675d; }
    section { max-width: 1160px; margin: 0 auto 34px; }
    h2 { display: flex; gap: 10px; align-items: baseline; text-transform: capitalize; border-bottom: 1px solid #d9d2c5; padding-bottom: 8px; }
    h2 span { color: #8b8173; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .card { background: #fffdf8; border: 1px solid #ded6c8; border-radius: 14px; padding: 14px; box-shadow: 0 1px 2px rgb(0 0 0 / 0.04); }
    .card h3 { margin: 0 0 4px; font-size: 15px; }
    .card p { margin: 0 0 10px; color: #746b60; font-size: 12px; }
    img { display: block; width: 100%; max-height: 220px; object-fit: contain; background: #f3f1eb; border-radius: 10px; border: 1px solid #ebe4d8; }
    .missing { display: grid; place-items: center; min-height: 140px; color: #9a9183; background: #eee8dc; border-radius: 10px; }
    nav { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; font-size: 12px; }
    a { color: #8a1f2d; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { font-size: 11px; }
  </style>
</head>
<body>
  <header>
    <h1>Pyxis Storybook Catalog</h1>
    <p>${esc(manifest.count)} stories from ${esc(manifest.sourceIndex)}. Generated ${esc(new Date().toISOString())}.</p>
  </header>
  ${cards.join('\n')}
</body>
</html>`;

fs.writeFileSync(indexPath, html);
console.log(`Wrote ${relFromCatalog(indexPath)}`);
