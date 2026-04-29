#!/usr/bin/env node
/*
Smoke the Phase 1 show-detail fidelity surfaces against a devctl-up Pyxis stack.

Usage:
  node ttmp/2026/04/29/PYXIS-STAFF-SHOW-EDITING-POLISH--staff-show-editing-calendar-artists-audit-bookings-polish/scripts/01-phase1-show-detail-smoke.js

Environment:
  PYXIS_APP_URL=http://localhost:3008
  PYXIS_BACKEND_URL=http://localhost:8080
  PYXIS_SMOKE_ROLE=admin
*/

const { createRequire } = require('module');
const fs = require('fs');
const os = require('os');
const path = require('path');
const workspaceRequire = createRequire(path.join(process.cwd(), 'web', 'package.json'));
const { chromium } = workspaceRequire('playwright');

const appUrl = process.env.PYXIS_APP_URL || 'http://localhost:3008';
const backendUrl = process.env.PYXIS_BACKEND_URL || 'http://localhost:8080';
const role = process.env.PYXIS_SMOKE_ROLE || 'admin';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await page.goto(`${backendUrl}/auth/dev-login?username=phase1-smoke&role=${encodeURIComponent(role)}`, { waitUntil: 'networkidle' });
  await page.goto(`${appUrl}/shows`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /new show/i }).click();
  await page.getByLabel(/artist \/ act name/i).fill(`Phase 1 Smoke ${Date.now()}`);
  await page.getByLabel(/date/i).fill('2026-06-15');
  await page.getByLabel(/^genre$/i).fill('Smoke');
  await page.getByLabel(/staff notes/i).fill('Phase 1 staff notes are visible.');
  await page.getByLabel(/^artist$/i).first().fill('Phase 1 Headliner');
  await page.getByLabel(/^role$/i).first().fill('headline');
  const flyerPath = path.join(os.tmpdir(), `pyxis-phase1-smoke-${Date.now()}.svg`);
  fs.writeFileSync(flyerPath, '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" fill="#fff" font-size="42" text-anchor="middle">Phase 1 Smoke</text></svg>');
  await page.locator('input[type="file"][accept="image/*,.pdf"]').setInputFiles(flyerPath);
  await page.getByRole('button', { name: /^save show$/i }).click();
  await page.waitForURL(/\/shows\/\d+/, { timeout: 15000 });

  await page.getByText('Lineup', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByText('Phase 1 Headliner').waitFor({ timeout: 10000 });
  await page.getByText('Staff notes', { exact: true }).waitFor({ timeout: 10000 });
  await page.getByText('Phase 1 staff notes are visible.').waitFor({ timeout: 10000 });
  await page.getByAltText(/current show flyer/i).waitFor({ timeout: 10000 });

  if (errors.length) {
    throw new Error(`browser console errors:\n${errors.join('\n')}`);
  }

  console.log(JSON.stringify({ ok: true, url: page.url() }, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
