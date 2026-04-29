#!/usr/bin/env node
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'web', 'package.json'));
const { chromium } = require('playwright');

const outDir = path.join(process.cwd(), 'ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/08-modal-storybook-captures');
const baseUrl = process.env.STORYBOOK_URL || 'http://127.0.0.1:6008';

const stories = [
  { id: 'pyxis-app-components-organisms-newshowmodal--create-default', file: 'new-show-modal-create-default.png', width: 1120, height: 1720 },
  { id: 'pyxis-app-components-organisms-newshowmodal--edit-existing-with-flyer', file: 'new-show-modal-edit-existing-with-flyer.png', width: 1120, height: 1840 },
  { id: 'pyxis-app-components-organisms-newshowmodal--confirmed-needs-flyer', file: 'new-show-modal-confirmed-needs-flyer.png', width: 1120, height: 1720 },
  { id: 'pyxis-app-components-organisms-newshowmodal--mobile', file: 'new-show-modal-mobile.png', width: 390, height: 1840 },
];

await fs.mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const story of stories) {
    const page = await browser.newPage({ viewport: { width: story.width, height: story.height }, deviceScaleFactor: 1 });
    const url = `${baseUrl}/iframe.html?id=${story.id}&viewMode=story`;
    await page.goto(url, { waitUntil: 'networkidle' });
    const modal = page.locator('[data-pyxis-component="new-show-modal"][data-pyxis-part="root"]');
    await modal.waitFor({ timeout: 15000 });
    const output = path.join(outDir, story.file);
    await page.screenshot({ path: output, fullPage: true });
    const bounds = await modal.boundingBox();
    results.push({ ...story, url, output, bounds });
    await page.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, 'captures.json'), JSON.stringify({ baseUrl, stories: results }, null, 2));
console.log(JSON.stringify({ ok: true, outDir, count: results.length }, null, 2));
