#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = process.env.PYXIS_REPO_ROOT || path.resolve(scriptDir, '../../..');
const baselineRoot = path.join(repoRoot, 'prototype-design/baseline');
const manifestPath = path.join(baselineRoot, 'manifest.json');
const outHtml = path.join(baselineRoot, 'index.html');
const outMd = path.join(baselineRoot, 'index.md');

function esc(value) {
  return String(value ?? '').replace(/[&<>"]|'/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

function rel(from, to) {
  return path.relative(path.dirname(from), to).split(path.sep).join('/');
}

function countScreenshots(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'screenshot.png') count += 1;
    }
  };
  walk(dir);
  return count;
}

if (!fs.existsSync(manifestPath)) {
  console.error(`Missing prototype baseline manifest: ${manifestPath}`);
  console.error('Run scripts/11-generate-prototype-baseline-configs.mjs first.');
  process.exit(2);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const groups = new Map();
for (const entry of manifest.entries || []) {
  const group = entry.kind === 'component'
    ? 'Public components'
    : entry.kind === 'mobile-screen'
      ? 'Mobile app screens'
      : 'Public pages and foundations';
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(entry);
}

let html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Pyxis Prototype Baseline Catalog</title>
<style>
  :root { color-scheme: light; --paper: #f3f1eb; --ink: #1a1a18; --muted: #6b6459; --accent: #c8270d; --line: #ded8cc; --card: #fff; }
  body { margin: 0; background: var(--paper); color: var(--ink); font: 14px/1.5 Inter, system-ui, sans-serif; }
  header { position: sticky; top: 0; z-index: 10; padding: 18px 28px; background: rgba(243,241,235,.94); backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
  h1 { margin: 0; font-family: Georgia, serif; font-size: 30px; }
  .meta { color: var(--muted); margin-top: 6px; }
  .wrap { padding: 0 28px 48px; }
  h2 { margin: 34px 0 14px; font-family: Georgia, serif; font-size: 22px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 14px; }
  article { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 2px rgba(26,24,22,.04); }
  .title { font-weight: 700; }
  .slug, .path, .output { color: var(--muted); font-size: 12px; word-break: break-word; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .pill { display: inline-block; border: 1px solid var(--line); border-radius: 999px; padding: 3px 8px; font-size: 11px; background: #fff; margin-right: 6px; }
</style>
</head>
<body>
<header>
  <h1>Pyxis Prototype Baseline Catalog</h1>
  <div class="meta">${manifest.count} configs · generated ${esc(manifest.generatedAt || new Date().toISOString())}</div>
</header>
<div class="wrap">
`;

let md = `# Pyxis Prototype Baseline Catalog\n\nGenerated: ${manifest.generatedAt || new Date().toISOString()}\n\nConfigs: ${manifest.count}\n\n`;

for (const [group, entries] of groups.entries()) {
  html += `<section><h2>${esc(group)}</h2><div class="grid">\n`;
  md += `## ${group}\n\n`;
  for (const entry of entries) {
    const configPath = path.join(repoRoot, entry.config);
    const outputPath = path.join(repoRoot, entry.output);
    const screenshotCount = countScreenshots(outputPath);
    const configHref = rel(outHtml, configPath);
    const outputHref = rel(outHtml, outputPath);
    html += `<article>
  <div class="title">${esc(entry.title)}</div>
  <div class="slug">${esc(entry.slug)}</div>
  <div style="margin-top: 8px;">
    <span class="pill">${esc(entry.kind)}</span>
    <span class="pill">${screenshotCount} screenshots</span>
  </div>
  <div class="path" style="margin-top: 10px;"><a href="${esc(configHref)}">${esc(entry.config)}</a></div>
  <div class="output" style="margin-top: 6px;"><a href="${esc(outputHref)}">${esc(entry.output)}</a></div>
</article>\n`;
    md += `- **${entry.title}** (${entry.kind}) — [config](${entry.config}), [output](${entry.output}), screenshots: ${screenshotCount}\n`;
  }
  html += `</div></section>\n`;
  md += `\n`;
}

html += `</div></body></html>\n`;
fs.writeFileSync(outHtml, html);
fs.writeFileSync(outMd, md);

console.log(`Wrote ${outHtml}`);
console.log(`Wrote ${outMd}`);
