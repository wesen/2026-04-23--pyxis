#!/usr/bin/env node
/**
 * Visible Chromium smoke for Shows/NewShowModal validation and Show Detail Discord controls.
 *
 * Usage:
 *   node scripts/07-shows-modal-discord-visible-smoke.js [output-json]
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
let playwright;
try { playwright = require('playwright'); } catch { playwright = createRequire(path.resolve(process.cwd(), 'web/packages/pyxis-app/package.json'))('playwright'); }
const { chromium } = playwright;
const ticketRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(process.argv[2] || path.join(ticketRoot, 'sources/13-shows-modal-discord-visible-chromium.json'));
const staffBaseURL = process.env.PYXIS_STAFF_URL || 'http://localhost:3008';

(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const evidence = { method: 'Visible Chromium Shows/NewShowModal/Discord smoke.', staffBaseURL, errors: [] };
  const browser = await chromium.launch({ headless: false, slowMo: Number(process.env.PYXIS_SMOKE_SLOWMO || 250) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('pageerror', (err) => evidence.errors.push({ type: 'pageerror', message: err.message }));
  page.on('console', (msg) => { const text = msg.text(); if (msg.type() === 'error' && !/404/.test(text)) evidence.errors.push({ type: 'console', message: text }); });
  await page.goto(`${staffBaseURL}/auth/dev-login?username=manuel&role=admin`, { waitUntil: 'networkidle' });

  await page.goto(`${staffBaseURL}/shows`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /New show/i }).click();
  await page.getByRole('button', { name: /^Save show$/i }).click();
  evidence.newShowValidation = await page.getByRole('alert').filter({ hasText: /required/i }).innerText({ timeout: 10000 });
  await page.getByRole('button', { name: /^Cancel$/i }).click();

  await page.getByLabel(/Search shows/i).click();
  await page.getByPlaceholder(/Search artist/i).fill('zz-no-show-visible-smoke');
  evidence.searchNoResults = await page.getByText(/No shows match/i).innerText({ timeout: 10000 });
  await page.goto(`${staffBaseURL}/shows`, { waitUntil: 'networkidle' });

  const editButton = page.getByRole('button', { name: /^Edit /i }).first();
  await editButton.click();
  await page.waitForURL(/\/shows\/\d+/, { timeout: 10000 });
  evidence.showDetailUrl = page.url();
  evidence.discordPanel = await page.locator('[data-section="show-detail-discord"]').innerText({ timeout: 10000 });
  evidence.openPostDisabled = await page.getByRole('button', { name: /Open post/i }).isDisabled();
  await page.getByRole('button', { name: /Announce/i }).click();
  evidence.announceFeedback = await page.getByRole('status').filter({ hasText: /Announcement requested/i }).innerText({ timeout: 10000 });

  await browser.close();
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(outputPath);
  if (evidence.errors.length) process.exitCode = 1;
})().catch((err) => { fs.mkdirSync(path.dirname(outputPath), { recursive: true }); fs.writeFileSync(outputPath, `${JSON.stringify({ fatal: String(err && err.stack || err) }, null, 2)}\n`); console.error(err); process.exit(1); });
