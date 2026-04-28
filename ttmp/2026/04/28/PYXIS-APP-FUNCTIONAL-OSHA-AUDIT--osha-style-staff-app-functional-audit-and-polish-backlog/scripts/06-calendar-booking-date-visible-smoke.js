#!/usr/bin/env node
/**
 * Visible Chromium smoke for booking date selection and calendar navigation/actions.
 *
 * Usage:
 *   node scripts/06-calendar-booking-date-visible-smoke.js [output-json]
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
let playwright;
try { playwright = require('playwright'); } catch { playwright = createRequire(path.resolve(process.cwd(), 'web/packages/pyxis-app/package.json'))('playwright'); }
const { chromium, request } = playwright;
const ticketRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(process.argv[2] || path.join(ticketRoot, 'sources/12-calendar-booking-date-visible-chromium.json'));
const backendBaseURL = process.env.PYXIS_BACKEND_URL || 'http://127.0.0.1:8080';
const staffBaseURL = process.env.PYXIS_STAFF_URL || 'http://localhost:3008';

(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const evidence = { method: 'Visible Chromium booking-date/calendar smoke.', backendBaseURL, staffBaseURL, errors: [] };
  const api = await request.newContext({ baseURL: backendBaseURL, extraHTTPHeaders: { 'content-type': 'application/json' } });
  const artistName = `Date Smoke ${Date.now()}`;
  const seed = await api.post('/api/public/submissions', { data: { artistName, preferredDate: '2026-10-10', genre: 'ambient', expectedDraw: 35, links: 'https://example.test/date-smoke', message: 'Date selection smoke.' } });
  evidence.seed = { status: seed.status(), body: await seed.json() };
  await api.dispose();

  const browser = await chromium.launch({ headless: false, slowMo: Number(process.env.PYXIS_SMOKE_SLOWMO || 250) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('pageerror', (err) => evidence.errors.push({ type: 'pageerror', message: err.message }));
  page.on('console', (msg) => { const text = msg.text(); if (msg.type() === 'error' && !/404/.test(text)) evidence.errors.push({ type: 'console', message: text }); });
  await page.goto(`${staffBaseURL}/auth/dev-login?username=manuel&role=admin`, { waitUntil: 'networkidle' });

  await page.goto(`${staffBaseURL}/bookings/review/${evidence.seed.body.submissionId}`, { waitUntil: 'networkidle' });
  evidence.bookingReviewInitial = await page.locator('[data-section="booking-review-date"]').innerText();
  await page.locator('[data-section="booking-review-date"] input[type="date"]').fill('2026-10-11');
  await page.getByRole('button', { name: /Save selected date/i }).click();
  evidence.bookingDateSaved = await page.getByRole('status').filter({ hasText: /Booking details saved/i }).innerText({ timeout: 10000 });

  await page.goto(`${staffBaseURL}/calendar`, { waitUntil: 'networkidle' });
  evidence.calendarInitialHeading = await page.locator('[data-section="calendar-month"] h2').innerText();
  await page.getByRole('button', { name: /Next month/i }).click();
  evidence.calendarNextHeading = await page.locator('[data-section="calendar-month"] h2').innerText();
  await page.getByRole('button', { name: /Previous month/i }).click();
  evidence.calendarPreviousHeading = await page.locator('[data-section="calendar-month"] h2').innerText();
  await page.getByRole('button', { name: /^Today$/ }).click();
  evidence.calendarTodayHeading = await page.locator('[data-section="calendar-month"] h2').innerText();

  await page.getByText('Open night').first().click();
  evidence.selectedDayPanel = await page.locator('[data-section="calendar-selected-day"]').innerText();
  await page.getByRole('button', { name: /Create show on this day/i }).click();
  evidence.newShowModalTitle = await page.getByRole('dialog').locator('h2, h1').first().innerText().catch(async () => await page.getByRole('dialog').innerText());
  await page.keyboard.press('Escape');

  await browser.close();
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(outputPath);
  if (evidence.errors.length) process.exitCode = 1;
})().catch((err) => { fs.mkdirSync(path.dirname(outputPath), { recursive: true }); fs.writeFileSync(outputPath, `${JSON.stringify({ fatal: String(err && err.stack || err) }, null, 2)}\n`); console.error(err); process.exit(1); });
