#!/usr/bin/env node
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'web', 'package.json'));
const { chromium } = require('playwright');

const outDir = path.join(process.cwd(), 'ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/11-show-edit-storybook-captures');
const baseUrl = process.env.STORYBOOK_URL || 'http://127.0.0.1:6008';

const stories = [
  { id: 'pyxis-app-components-organisms-showedit-showeditheader--default', file: 'show-edit-header-default.png', width: 1180, height: 360, selector: '[data-pyxis-component="show-edit-header"]' },
  { id: 'pyxis-app-components-organisms-showedit-showflyercard--ready', file: 'show-flyer-card-ready.png', width: 430, height: 700, selector: '[data-pyxis-component="show-flyer-card"]' },
  { id: 'pyxis-app-components-organisms-showedit-showeditrail--ready', file: 'show-edit-rail-ready.png', width: 470, height: 1120, selector: '[data-pyxis-component="show-edit-rail"]' },
  { id: 'pyxis-app-components-organisms-showedit-showeditmain--full-show', file: 'show-edit-main-full-show.png', width: 860, height: 1120, selector: '[data-pyxis-component="show-edit-main"]' },
  { id: 'pyxis-app-components-organisms-showedit-showeditmain--narrow', file: 'show-edit-main-narrow.png', width: 420, height: 1320, selector: '[data-pyxis-component="show-edit-main"]' },
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const story of stories) {
    const page = await browser.newPage({ viewport: { width: story.width, height: story.height }, deviceScaleFactor: 1 });
    const url = `${baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
    await page.goto(url, { waitUntil: 'networkidle' });
    const target = page.locator(story.selector).first();
    await target.waitFor({ timeout: 15000 });
    const output = path.join(outDir, story.file);
    await page.screenshot({ path: output, fullPage: true });
    const bounds = await target.boundingBox();
    results.push({ ...story, url, output, bounds });
    await page.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, 'captures.json'), JSON.stringify({ baseUrl, stories: results }, null, 2));
console.log(JSON.stringify({ ok: true, outDir, count: results.length }, null, 2));
