#!/usr/bin/env node
/**
 * Visible Chromium smoke for booking refinements T31-T35.
 *
 * Purpose:
 * - Seed public booking submissions through the unauthenticated public API.
 * - Log into the staff app via dev-login.
 * - Exercise booking Hold, decline reason/template UI, approve confirmation + navigation,
 *   and View archive routing.
 * - Write structured evidence for the ticket sources directory.
 *
 * Usage:
 *   node scripts/04-booking-refinements-visible-smoke.js [output-json]
 *
 * Defaults:
 *   output-json = sources/10-booking-refinements-visible-chromium.json
 */
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
let playwright;
try {
  playwright = require('playwright');
} catch {
  playwright = createRequire(path.resolve(process.cwd(), 'web/packages/pyxis-app/package.json'))('playwright');
}
const { chromium, request } = playwright;

const ticketRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(process.argv[2] || path.join(ticketRoot, 'sources/10-booking-refinements-visible-chromium.json'));
const backendBaseURL = process.env.PYXIS_BACKEND_URL || 'http://127.0.0.1:8080';
const staffBaseURL = process.env.PYXIS_STAFF_URL || 'http://localhost:3008';

async function seedSubmission(api, artistName, index) {
  const response = await api.post('/api/public/submissions', {
    data: {
      artistName,
      preferredDate: `2026-08-${String(index + 1).padStart(2, '0')}`,
      genre: 'noise',
      expectedDraw: 42,
      links: `https://example.test/${artistName.toLowerCase().replaceAll(' ', '-')}`,
      message: 'Visible Chromium booking refinement smoke seed.',
    },
  });
  return { artistName, status: response.status(), body: await response.text() };
}

async function clickCardButton(page, artistName, buttonName) {
  const card = page.locator('[data-pyxis-component="booking-card"]', { hasText: artistName }).first();
  await card.getByRole('button', { name: buttonName }).click();
  return card;
}

(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const evidence = {
    method: 'Visible Chromium Playwright JS script launched with chromium.launch({ headless: false, slowMo: 250 }).',
    backendBaseURL,
    staffBaseURL,
    seeded: [],
    bookings: {},
    errors: [],
  };

  const api = await request.newContext({ baseURL: backendBaseURL, extraHTTPHeaders: { 'content-type': 'application/json' } });
  const seedPrefix = `Smoke ${Date.now()}`;
  const seed = {
    hold: `${seedPrefix} Hold`,
    decline: `${seedPrefix} Decline`,
    approve: `${seedPrefix} Approve`,
  };
  for (const [index, artistName] of Object.values(seed).entries()) {
    evidence.seeded.push(await seedSubmission(api, artistName, index));
  }
  await api.dispose();

  const browser = await chromium.launch({ headless: false, slowMo: Number(process.env.PYXIS_SMOKE_SLOWMO || 250) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('pageerror', (err) => evidence.errors.push({ type: 'pageerror', message: err.message }));
  page.on('console', (msg) => {
    const text = msg.text();
    // Ignore harmless missing favicon/static misses in local Vite/dev-server runs.
    if (msg.type() === 'error' && !/Failed to load resource: the server responded with a status of 404/.test(text)) {
      evidence.errors.push({ type: 'console', message: text });
    }
  });

  await page.goto(`${staffBaseURL}/auth/dev-login?username=manuel&role=admin`, { waitUntil: 'networkidle' });
  await page.goto(`${staffBaseURL}/bookings`, { waitUntil: 'networkidle' });
  evidence.bookings.url = page.url();
  evidence.bookings.buttonsBefore = await page.locator('button').evaluateAll((buttons) => buttons.map((button) => ({ text: button.textContent?.trim() || '', disabled: button.disabled })));

  await clickCardButton(page, seed.hold, 'Hold');
  evidence.bookings.holdMessage = await page.getByRole('status').filter({ hasText: /moved to hold/i }).innerText({ timeout: 10000 });

  await clickCardButton(page, seed.decline, 'Decline');
  let dialog = page.locator('section[role="dialog"]');
  await dialog.getByRole('button', { name: /Need more info/i }).click();
  evidence.bookings.declineReason = await dialog.locator('textarea').inputValue();
  await dialog.getByRole('button', { name: /^Decline booking$/ }).click();
  evidence.bookings.declineMessage = await page.getByRole('status').filter({ hasText: /declined/i }).innerText({ timeout: 10000 });

  await clickCardButton(page, seed.approve, 'Approve');
  dialog = page.locator('section[role="dialog"]');
  evidence.bookings.approveDialog = await dialog.innerText({ timeout: 10000 });
  await dialog.getByRole('button', { name: /^Approve and open show$/ }).click();
  await page.waitForURL(/\/shows\/\d+/, { timeout: 15000 });
  evidence.bookings.approveNavigationUrl = page.url();

  await page.goto(`${staffBaseURL}/bookings`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /View archive/i }).click();
  await page.waitForURL(/\/log\?entity=submission&action=submission/, { timeout: 10000 });
  evidence.bookings.archiveUrl = page.url();
  evidence.bookings.archiveFilterCopy = await page.getByText(/Showing \d+ of \d+/).innerText({ timeout: 10000 });

  await page.waitForTimeout(1500);
  await browser.close();
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(outputPath);
  if (evidence.errors.length) {
    console.error(JSON.stringify(evidence.errors, null, 2));
    process.exitCode = 1;
  }
})().catch((err) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify({ fatal: String(err && err.stack || err) }, null, 2)}\n`);
  console.error(err);
  process.exit(1);
});
