#!/usr/bin/env node
/**
 * Visible Chromium smoke for post-show log page/story presence and show notes display.
 *
 * Usage:
 *   node scripts/08-post-show-log-show-notes-visible-smoke.js [output-json]
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
let playwright;
try { playwright = require('playwright'); } catch { playwright = createRequire(path.resolve(process.cwd(), 'web/packages/pyxis-app/package.json'))('playwright'); }
const { chromium } = playwright;
const ticketRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(process.argv[2] || path.join(ticketRoot, 'sources/14-post-show-log-show-notes-visible-chromium.json'));
const staffBaseURL = process.env.PYXIS_STAFF_URL || 'http://localhost:3008';

(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const evidence = { method: 'Visible Chromium post-show log show-notes smoke.', staffBaseURL, errors: [] };
  const browser = await chromium.launch({ headless: false, slowMo: Number(process.env.PYXIS_SMOKE_SLOWMO || 250) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('pageerror', (err) => evidence.errors.push({ type: 'pageerror', message: err.message }));
  page.on('console', (msg) => { const text = msg.text(); if (msg.type() === 'error' && !/404/.test(text)) evidence.errors.push({ type: 'console', message: text }); });
  await page.goto(`${staffBaseURL}/auth/dev-login?username=manuel&role=admin`, { waitUntil: 'networkidle' });

  const createResponse = await page.request.post(`${staffBaseURL}/api/app/shows`, { data: { artist: `Post Log Notes ${Date.now()}`, date: '2026-01-01', genre: 'notes-test', status: 'SHOW_STATUS_CONFIRMED', notes: 'Smoke show note visible in post-show log.', capacity: 150 } });
  const show = await createResponse.json();
  evidence.createdShow = { status: createResponse.status(), show };
  await page.request.patch(`${staffBaseURL}/api/app/attendance/${show.id}`, { data: { draw: 44, notes: 'Post-show attendance note.', incident: false, incidentNotes: '' } });

  await page.goto(`${staffBaseURL}/attendance`, { waitUntil: 'networkidle' });
  evidence.pageHeading = await page.locator('main').locator('h1').innerText();
  evidence.showNotesVisible = await page.getByText('Smoke show note visible in post-show log.').isVisible({ timeout: 10000 });
  evidence.attendanceNotesVisible = await page.getByText('Post-show attendance note.').isVisible({ timeout: 10000 }).catch(() => false);
  evidence.pageExcerpt = (await page.locator('main').innerText()).slice(0, 800);
  await browser.close();
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(outputPath);
  if (evidence.errors.length || !evidence.showNotesVisible) process.exitCode = 1;
})().catch((err) => { fs.mkdirSync(path.dirname(outputPath), { recursive: true }); fs.writeFileSync(outputPath, `${JSON.stringify({ fatal: String(err && err.stack || err) }, null, 2)}\n`); console.error(err); process.exit(1); });
