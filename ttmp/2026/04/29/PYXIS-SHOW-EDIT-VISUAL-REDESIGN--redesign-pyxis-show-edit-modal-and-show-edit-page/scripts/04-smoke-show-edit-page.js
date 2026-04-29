#!/usr/bin/env node
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';

const require = createRequire(path.join(process.cwd(), 'web', 'package.json'));
const { chromium } = require('playwright');

const outDir = path.join(process.cwd(), 'ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/12-show-edit-route-smoke');
const baseUrl = process.env.PYXIS_APP_URL || 'http://localhost:3008';
const showId = process.env.PYXIS_SHOW_ID || '31';
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 1 });
  const loginUrl = `${baseUrl}/auth/dev-login?username=show-edit-smoke&role=admin`;
  await page.goto(loginUrl, { waitUntil: 'networkidle' });
  const url = `${baseUrl}/shows/${showId}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  const title = await page.title();
  const bodyText = await page.locator('body').innerText();
  const loggedInRoute = bodyText.includes('Edit show') || bodyText.includes('Loading show detail');
  const loginRoute = /sign in|continue with discord|login/i.test(bodyText);
  if (!loggedInRoute && !loginRoute) {
    throw new Error(`Unexpected route content: ${bodyText.slice(0, 240)}`);
  }
  if (loggedInRoute) {
    await page.getByText('Edit show').first().waitFor({ timeout: 15000 });
    await page.getByText('Basics').first().waitFor({ timeout: 15000 });
    await page.getByText('Flyer').first().waitFor({ timeout: 15000 });
    await page.getByRole('button', { name: /save changes/i }).click();
    await page.getByRole('dialog').waitFor({ timeout: 15000 });
    await page.getByRole('button', { name: /^cancel$/i }).click();
  }
  const screenshot = path.join(outDir, `show-${showId}-page.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await fs.writeFile(path.join(outDir, 'smoke.json'), JSON.stringify({ ok: true, url, title, loggedInRoute, loginRoute, screenshot }, null, 2));
  console.log(JSON.stringify({ ok: true, url, loggedInRoute, loginRoute, screenshot }, null, 2));
} finally {
  await browser.close();
}
