#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.PYXIS_REPO_ROOT || '/home/manuel/code/wesen/2026-04-23--pyxis';
const ticketRoot = process.env.PYXIS_STORYBOOK_CATALOG_TICKET || path.join(
  repoRoot,
  'ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components'
);
const catalogRoot = path.join(ticketRoot, 'various/story-catalog');
const manifestPath = path.join(catalogRoot, 'manifest.json');
const statusPath = path.join(catalogRoot, 'status.tsv');
const outHtml = path.join(catalogRoot, 'index.html');
const outMd = path.join(catalogRoot, 'index.md');

function rel(from, to) {
  return path.relative(path.dirname(from), to).split(path.sep).join('/');
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Missing manifest: ${manifestPath}`);
  process.exit(2);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const status = new Map();
if (fs.existsSync(statusPath)) {
  const lines = fs.readFileSync(statusPath, 'utf8').trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    if (!line.trim()) continue;
    const [storyId, probe, st, output] = line.split('\t');
    status.set(`${storyId}\t${probe}`, { status: st, output });
  }
}

const byTop = new Map();
for (const story of manifest.stories) {
  if (!byTop.has(story.top)) byTop.set(story.top, new Map());
  const byComponent = byTop.get(story.top);
  if (!byComponent.has(story.component)) byComponent.set(story.component, []);
  byComponent.get(story.component).push(story);
}

let ok = 0;
let fail = 0;
for (const story of manifest.stories) {
  for (const probe of ['story-root', 'component-focus']) {
    const st = status.get(`${story.id}\t${probe}`)?.status;
    if (st === 'ok') ok++;
    else if (st === 'fail') fail++;
  }
}

let html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pyxis Storybook Visual Catalog</title>
<style>
  :root { color-scheme: light; --paper: #f3f1eb; --ink: #1a1a18; --muted: #6b6459; --accent: #c8270d; --line: #ded8cc; --card: #fff; }
  body { margin: 0; font: 14px/1.5 Inter, system-ui, sans-serif; color: var(--ink); background: var(--paper); }
  header { position: sticky; top: 0; z-index: 10; background: rgba(243,241,235,.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); padding: 18px 28px; }
  h1 { margin: 0; font-family: Georgia, serif; font-size: 30px; }
  h2 { margin: 38px 28px 12px; font-family: Georgia, serif; font-size: 24px; }
  h3 { margin: 24px 0 12px; font-size: 15px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
  .meta { color: var(--muted); margin-top: 6px; }
  .wrap { padding: 0 28px 48px; }
  .component { margin: 0 0 26px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 16px; }
  .story { background: var(--card); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(26,24,22,.04); }
  .story-head { padding: 12px 14px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; gap: 10px; }
  .story-name { font-weight: 700; }
  .story-id { color: var(--muted); font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px; word-break: break-all; }
  .shots { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--line); }
  figure { margin: 0; background: #faf8f2; min-height: 120px; display: flex; flex-direction: column; }
  figcaption { padding: 7px 9px; font-size: 11px; color: var(--muted); background: #fff; border-bottom: 1px solid var(--line); }
  img { display: block; width: 100%; height: auto; object-fit: contain; background: #f3f1eb; }
  .links { padding: 10px 14px 14px; display: flex; flex-wrap: wrap; gap: 8px; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .pill { border: 1px solid var(--line); border-radius: 999px; padding: 3px 8px; font-size: 12px; background: #fff; }
  .ok { color: #3c7a4f; }
  .fail { color: #c8270d; }
</style>
</head>
<body>
<header>
  <h1>Pyxis Storybook Visual Catalog</h1>
  <div class="meta">${manifest.count} stories · ${ok} probe bundles ok · ${fail} failures · generated ${esc(new Date().toISOString())}</div>
</header>
<div class="wrap">
`;

let md = `# Pyxis Storybook Visual Catalog\n\nGenerated: ${new Date().toISOString()}\n\nStories: ${manifest.count}\n\nProbe bundles OK: ${ok}\n\nProbe failures: ${fail}\n\n`;

for (const [top, components] of byTop) {
  html += `<h2>${esc(top)}</h2>\n`;
  md += `## ${top}\n\n`;
  for (const [component, stories] of components) {
    html += `<section class="component"><h3>${esc(component)}</h3><div class="grid">\n`;
    md += `### ${component}\n\n`;
    for (const story of stories) {
      const rootStatus = status.get(`${story.id}\tstory-root`)?.status || 'missing';
      const focusStatus = status.get(`${story.id}\tcomponent-focus`)?.status || 'missing';
      const rootDir = path.join(catalogRoot, 'artifacts', story.relDir, 'story-root');
      const focusDir = path.join(catalogRoot, 'artifacts', story.relDir, 'component-focus');
      const rootShot = path.join(rootDir, 'screenshot.png');
      const focusShot = path.join(focusDir, 'screenshot.png');
      const rootShotRel = fs.existsSync(rootShot) ? rel(outHtml, rootShot) : '';
      const focusShotRel = fs.existsSync(focusShot) ? rel(outHtml, focusShot) : '';
      const rootCssRel = fs.existsSync(path.join(rootDir, 'computed-css.md')) ? rel(outHtml, path.join(rootDir, 'computed-css.md')) : '';
      const focusCssRel = fs.existsSync(path.join(focusDir, 'computed-css.md')) ? rel(outHtml, path.join(focusDir, 'computed-css.md')) : '';
      const rootInspectRel = fs.existsSync(path.join(rootDir, 'inspect.json')) ? rel(outHtml, path.join(rootDir, 'inspect.json')) : '';
      const focusInspectRel = fs.existsSync(path.join(focusDir, 'inspect.json')) ? rel(outHtml, path.join(focusDir, 'inspect.json')) : '';
      html += `<article class="story">
  <div class="story-head"><div><div class="story-name">${esc(story.name)}</div><div class="story-id">${esc(story.id)}</div></div><div><span class="pill ${rootStatus}">root ${esc(rootStatus)}</span> <span class="pill ${focusStatus}">focus ${esc(focusStatus)}</span></div></div>
  <div class="shots">
    <figure><figcaption>story-root</figcaption>${rootShotRel ? `<a href="${rootShotRel}"><img src="${rootShotRel}" loading="lazy" /></a>` : ''}</figure>
    <figure><figcaption>component-focus</figcaption>${focusShotRel ? `<a href="${focusShotRel}"><img src="${focusShotRel}" loading="lazy" /></a>` : ''}</figure>
  </div>
  <div class="links">
    <a href="${esc(story.url)}">Storybook iframe</a>
    ${rootCssRel ? `<a href="${rootCssRel}">root CSS</a>` : ''}
    ${focusCssRel ? `<a href="${focusCssRel}">focus CSS</a>` : ''}
    ${rootInspectRel ? `<a href="${rootInspectRel}">root inspect</a>` : ''}
    ${focusInspectRel ? `<a href="${focusInspectRel}">focus inspect</a>` : ''}
  </div>
</article>\n`;
      md += `- **${story.name}** (${story.id}) — root: ${rootStatus}, focus: ${focusStatus}\n`;
    }
    html += `</div></section>\n`;
    md += `\n`;
  }
}
html += `</div></body></html>\n`;
fs.writeFileSync(outHtml, html);
fs.writeFileSync(outMd, md);
console.log(`Wrote ${outHtml}`);
console.log(`Wrote ${outMd}`);
