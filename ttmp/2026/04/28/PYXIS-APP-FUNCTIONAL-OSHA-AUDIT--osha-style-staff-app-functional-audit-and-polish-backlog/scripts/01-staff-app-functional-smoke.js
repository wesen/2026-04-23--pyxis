#!/usr/bin/env node
/**
 * Purpose: OSHA-style browser smoke for pyxis-app staff pages.
 *
 * This script logs in through /auth/dev-login (if enabled), visits every staff
 * route, records visible controls/links/forms/status text, tries known safe
 * interactions, and writes JSON evidence for the ticket report.
 *
 * It avoids destructive show cancellation/archive/booking approval by default.
 * Use this as an evidence collector, not as the full manual audit substitute.
 */

const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const requireFromCwd = createRequire(path.join(process.cwd(), 'package.json'));
const { chromium } = requireFromCwd('playwright');

const baseURL = process.env.PYXIS_APP_URL || 'http://localhost:3008';
const outPath = process.argv[2] || '/tmp/pyxis-staff-app-functional-smoke.json';

const routes = [
  ['dashboard', '/'],
  ['shows', '/shows'],
  ['calendar', '/calendar'],
  ['bookings', '/bookings'],
  ['artists', '/artists'],
  ['attendance', '/attendance'],
  ['audit-log', '/log'],
  ['discord', '/discord'],
  ['settings', '/settings'],
  ['setup', '/setup'],
  ['modal-showcase', '/modal'],
];

async function textOrNull(locator) {
  try { return (await locator.innerText({ timeout: 1500 })).trim(); } catch { return null; }
}

async function attrOrNull(locator, name) {
  try { return await locator.getAttribute(name, { timeout: 1500 }); } catch { return null; }
}

async function snapshotPage(page, name, route) {
  const buttons = await page.locator('button').evaluateAll(nodes => nodes.map((n, i) => ({
    index: i,
    text: (n.textContent || '').trim(),
    ariaLabel: n.getAttribute('aria-label'),
    disabled: n.disabled,
    type: n.getAttribute('type'),
    classes: n.getAttribute('class'),
  })));
  const links = await page.locator('a').evaluateAll(nodes => nodes.map((n, i) => ({
    index: i,
    text: (n.textContent || '').trim(),
    href: n.getAttribute('href'),
    ariaCurrent: n.getAttribute('aria-current'),
    classes: n.getAttribute('class'),
  })));
  const inputs = await page.locator('input, textarea, select').evaluateAll(nodes => nodes.map((n, i) => ({
    index: i,
    tag: n.tagName.toLowerCase(),
    type: n.getAttribute('type'),
    label: n.closest('label')?.innerText?.trim()?.split('\n')?.[0] || null,
    placeholder: n.getAttribute('placeholder'),
    disabled: n.disabled,
    readOnly: n.readOnly,
    value: n.value,
  })));
  const sections = await page.locator('[data-section]').evaluateAll(nodes => nodes.map(n => ({
    section: n.getAttribute('data-section'),
    text: (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 220),
  })));
  const statusText = await page.locator('[role="alert"], [role="status"], .app-action-error, .app-action-success').evaluateAll(nodes => nodes.map(n => (n.textContent || '').trim()));
  return { name, route, url: page.url(), title: await page.title(), buttons, links, inputs, sections, statusText };
}

async function clickIfVisible(page, selector, note, result) {
  const loc = typeof selector === 'string' ? page.locator(selector).first() : selector;
  try {
    if (await loc.isVisible({ timeout: 1500 })) {
      await loc.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      result.interactions.push({ note, ok: true, url: page.url(), statusText: await page.locator('[role="alert"], [role="status"], .app-action-error, .app-action-success').evaluateAll(nodes => nodes.map(n => (n.textContent || '').trim())) });
      return true;
    }
  } catch (error) {
    result.interactions.push({ note, ok: false, error: String(error).slice(0, 500), url: page.url() });
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const evidence = { baseURL, startedAt: new Date().toISOString(), login: {}, pages: [], console: [], requests: [] };

  page.on('console', msg => evidence.console.push({ type: msg.type(), text: msg.text() }));
  page.on('requestfailed', req => evidence.requests.push({ url: req.url(), method: req.method(), failure: req.failure()?.errorText }));
  page.on('response', async resp => {
    if (resp.url().includes('/api/') || resp.url().includes('/auth/')) {
      if (resp.status() >= 400) evidence.requests.push({ url: resp.url(), status: resp.status(), method: resp.request().method() });
    }
  });

  // Dev login shortcut. If disabled, record the failure and continue to /login.
  const loginURL = `${baseURL}/auth/dev-login?username=osha-auditor&role=admin`;
  const loginResp = await page.goto(loginURL, { waitUntil: 'networkidle' }).catch(e => null);
  evidence.login = { url: loginURL, status: loginResp && loginResp.status(), body: (await textOrNull(page.locator('body')))?.slice(0, 500) };

  for (const [name, route] of routes) {
    const result = { name, route, interactions: [] };
    await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    result.before = await snapshotPage(page, name, route);

    // Safe/diagnostic interactions per page.
    if (name === 'shows') {
      await clickIfVisible(page, page.getByRole('button', { name: /filter shows/i }), 'shows: click filter icon', result);
      await clickIfVisible(page, page.getByRole('button', { name: /search shows/i }), 'shows: click search icon', result);
      await clickIfVisible(page, page.getByRole('button', { name: /new show/i }), 'shows: open new show modal', result);
      result.afterNewShowModal = await snapshotPage(page, name + '-modal-open', route);
      await clickIfVisible(page, page.getByRole('button', { name: /^cancel$/i }), 'shows: cancel new show modal', result);
    }
    if (name === 'calendar') {
      await clickIfVisible(page, page.getByRole('button', { name: /add hold/i }), 'calendar: click Add hold', result);
      await clickIfVisible(page, page.getByRole('button', { name: /block date/i }), 'calendar: click Block date', result);
    }
    if (name === 'bookings') {
      await clickIfVisible(page, page.getByRole('button', { name: /open form/i }), 'bookings: click Open form', result);
      await clickIfVisible(page, page.getByRole('button', { name: /auto-review/i }), 'bookings: click Auto-review', result);
    }
    if (name === 'artists') {
      await clickIfVisible(page, page.getByRole('button', { name: /new artist/i }), 'artists: click New artist', result);
      // Fill only local draft and clear; do not create test artist by default.
      const nameInput = page.locator('label:has-text("Name") input').first();
      try { if (await nameInput.isVisible({ timeout: 1000 })) { await nameInput.fill('OSHA Audit Artist Draft'); result.interactions.push({ note: 'artists: fill draft artist name', ok: true }); } } catch {}
      await clickIfVisible(page, page.getByRole('button', { name: /clear/i }), 'artists: click Clear', result);
    }
    if (name === 'settings') {
      const inputs = page.locator('input, textarea').first();
      result.settingsFirstInputValue = await attrOrNull(inputs, 'value');
    }
    if (name === 'setup') {
      await clickIfVisible(page, page.getByRole('button', { name: /^back$/i }), 'setup: click Back', result);
      await clickIfVisible(page, page.getByRole('button', { name: /skip/i }), 'setup: click Skip for now', result);
      await clickIfVisible(page, page.getByRole('button', { name: /continue/i }), 'setup: click Continue', result);
    }
    result.after = await snapshotPage(page, name, route);
    evidence.pages.push(result);
  }

  evidence.endedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(evidence, null, 2));
  console.log(outPath);
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
