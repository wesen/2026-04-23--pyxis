#!/usr/bin/env node
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'web', 'package.json'));
const { chromium } = require('playwright');

const baseUrl = process.env.STORYBOOK_URL || 'http://127.0.0.1:6008';
const url = `${baseUrl}/iframe.html?id=pyxis-app-components-organisms-newshowmodal--create-default&viewMode=story`;

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1120, height: 1720 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.locator('[data-pyxis-component="new-show-modal"][data-pyxis-part="root"]').waitFor({ timeout: 15000 });
  await page.getByRole('button', { name: /^create show$/i }).click();
  await page.getByText(/Artist \/ act name is required/i).waitFor({ timeout: 5000 });
  await page.getByLabel(/artist \/ act name/i).fill('Smoke Test Draft');
  await page.getByRole('button', { name: /save draft/i }).click();
  console.log(JSON.stringify({ ok: true, url }, null, 2));
} finally {
  await browser.close();
}
