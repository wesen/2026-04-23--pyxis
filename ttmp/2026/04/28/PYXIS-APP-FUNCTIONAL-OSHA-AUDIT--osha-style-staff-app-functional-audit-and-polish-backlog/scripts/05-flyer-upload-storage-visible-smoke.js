#!/usr/bin/env node
/**
 * Visible Chromium smoke for poster/flyer upload and local storage.
 *
 * Purpose:
 * - Log into the staff app through dev-login.
 * - Create a throwaway draft show through the staff API.
 * - Upload a tiny PNG flyer through the Show Detail UI.
 * - Verify the UI reports success, the API returns a flyer URL, the local file exists,
 *   and the public /flyers/... route serves the file.
 *
 * Usage:
 *   node scripts/05-flyer-upload-storage-visible-smoke.js [output-json]
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
const { chromium } = playwright;

const ticketRoot = path.resolve(__dirname, '..');
const outputPath = path.resolve(process.argv[2] || path.join(ticketRoot, 'sources/11-flyer-upload-storage-visible-chromium.json'));
const staffBaseURL = process.env.PYXIS_STAFF_URL || 'http://localhost:3008';
const repoRoot = path.resolve(ticketRoot, '../../../../..');
const tmpDir = path.join(ticketRoot, 'sources/tmp');
const flyerPath = path.join(tmpDir, 'smoke-flyer.png');

function writeTinyPng(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  // 1x1 transparent PNG.
  fs.writeFileSync(filePath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lN3gWQAAAABJRU5ErkJggg==', 'base64'));
}

(async () => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  writeTinyPng(flyerPath);
  const evidence = { method: 'Visible Chromium flyer upload/storage smoke.', staffBaseURL, flyerPath, errors: [] };

  const browser = await chromium.launch({ headless: false, slowMo: Number(process.env.PYXIS_SMOKE_SLOWMO || 250) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('pageerror', (err) => evidence.errors.push({ type: 'pageerror', message: err.message }));
  page.on('console', (msg) => {
    const text = msg.text();
    if (msg.type() === 'error' && !/Failed to load resource: the server responded with a status of 404/.test(text)) {
      evidence.errors.push({ type: 'console', message: text });
    }
  });

  await page.goto(`${staffBaseURL}/auth/dev-login?username=manuel&role=admin`, { waitUntil: 'networkidle' });
  const artist = `Flyer Smoke ${Date.now()}`;
  const createResponse = await page.request.post(`${staffBaseURL}/api/app/shows`, {
    data: {
      artist,
      date: '2026-09-09',
      genre: 'poster-test',
      status: 'SHOW_STATUS_DRAFT',
      draw: 0,
      capacity: 150,
    },
  });
  evidence.createStatus = createResponse.status();
  evidence.createdShow = await createResponse.json();
  if (!createResponse.ok()) throw new Error(`create show failed: ${createResponse.status()} ${JSON.stringify(evidence.createdShow)}`);

  await page.goto(`${staffBaseURL}/shows/${evidence.createdShow.id}`, { waitUntil: 'networkidle' });
  await page.getByLabel(/choose flyer file/i).setInputFiles(flyerPath);
  await page.getByRole('button', { name: /upload flyer/i }).click();
  evidence.uploadMessage = await page.getByRole('status').filter({ hasText: /flyer uploaded/i }).innerText({ timeout: 15000 });

  const showResponse = await page.request.get(`${staffBaseURL}/api/app/shows/${evidence.createdShow.id}`);
  evidence.showAfterUpload = await showResponse.json();
  evidence.flyerUrl = evidence.showAfterUpload.flyerUrl;
  if (!evidence.flyerUrl) throw new Error('show response did not include flyerUrl after upload');

  const servedResponse = await page.request.get(`${staffBaseURL}${evidence.flyerUrl}`);
  evidence.servedStatus = servedResponse.status();
  evidence.servedContentType = servedResponse.headers()['content-type'] || '';
  const relativePath = evidence.flyerUrl.replace(/^\/flyers\//, '');
  evidence.storagePath = path.join(repoRoot, 'data/flyers', relativePath);
  evidence.storageExists = fs.existsSync(evidence.storagePath);
  evidence.storageSize = evidence.storageExists ? fs.statSync(evidence.storagePath).size : 0;

  await page.waitForTimeout(1500);
  await browser.close();
  fs.writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(outputPath);
  if (evidence.errors.length || evidence.servedStatus !== 200 || !evidence.storageExists || evidence.storageSize <= 0) {
    console.error(JSON.stringify(evidence.errors, null, 2));
    process.exitCode = 1;
  }
})().catch((err) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify({ fatal: String(err && err.stack || err) }, null, 2)}\n`);
  console.error(err);
  process.exit(1);
});
