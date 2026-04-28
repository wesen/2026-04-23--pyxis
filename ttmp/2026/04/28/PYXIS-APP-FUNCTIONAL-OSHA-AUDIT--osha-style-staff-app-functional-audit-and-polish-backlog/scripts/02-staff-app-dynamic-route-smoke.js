#!/usr/bin/env node
/** Purpose: Inspect dynamic staff app routes (/shows/:id and /bookings/review/:id). */
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const requireFromCwd = createRequire(path.join(process.cwd(), 'package.json'));
const { chromium } = requireFromCwd('playwright');
const baseURL = process.env.PYXIS_APP_URL || 'http://localhost:3008';
const outPath = process.argv[2] || '/tmp/pyxis-staff-app-dynamic-smoke.json';

async function snap(page, route) {
  return {
    route,
    url: page.url(),
    heading: await page.locator('h1').first().innerText().catch(() => null),
    buttons: await page.locator('button').evaluateAll(nodes => nodes.map((n, i) => ({ index: i, text: (n.textContent || '').trim(), ariaLabel: n.getAttribute('aria-label'), disabled: n.disabled }))),
    inputs: await page.locator('input,textarea,select').evaluateAll(nodes => nodes.map((n, i) => ({ index: i, tag: n.tagName.toLowerCase(), label: n.closest('label')?.innerText?.trim()?.split('\n')?.[0] || null, disabled: n.disabled, readOnly: n.readOnly, value: n.value }))),
    sections: await page.locator('[data-section]').evaluateAll(nodes => nodes.map(n => ({ section: n.getAttribute('data-section'), text: (n.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 240) }))),
    statuses: await page.locator('[role="alert"], [role="status"], .app-action-error, .app-action-success').evaluateAll(nodes => nodes.map(n => (n.textContent || '').trim())),
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const evidence = { baseURL, pages: [], requests: [] };
  page.on('response', resp => { if ((resp.url().includes('/api/') || resp.url().includes('/auth/')) && resp.status() >= 400) evidence.requests.push({ method: resp.request().method(), url: resp.url(), status: resp.status() }); });
  await page.goto(`${baseURL}/auth/dev-login?username=osha-auditor&role=admin`, { waitUntil: 'networkidle' });

  await page.goto(`${baseURL}/shows`, { waitUntil: 'networkidle' });
  const firstEdit = page.locator('button[aria-label^="Edit "]').first();
  const firstEditLabel = await firstEdit.getAttribute('aria-label').catch(() => null);
  await firstEdit.click().catch(() => {});
  await page.waitForTimeout(500);
  evidence.pages.push({ kind: 'shows-edit-button-click', firstEditLabel, afterClickURL: page.url(), afterClick: await snap(page, '/shows') });

  // Use the first show id from the table text if available, else a common seed id.
  const firstShowId = await page.locator('[data-cell="id"] .app-show-id').first().innerText().then(t => t.replace('#','')).catch(() => '1');
  await page.goto(`${baseURL}/shows/${firstShowId}`, { waitUntil: 'networkidle' });
  const showDetail = { kind: 'show-detail', id: firstShowId, before: await snap(page, `/shows/${firstShowId}`), interactions: [] };
  for (const name of ['Edit', 'Duplicate', 'Announce']) {
    const loc = page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') }).first();
    if (await loc.count()) {
      await loc.click().catch(e => showDetail.interactions.push({ name, ok: false, error: String(e).slice(0,200) }));
      await page.waitForTimeout(500);
      showDetail.interactions.push({ name, ok: true, url: page.url(), statuses: await page.locator('[role="alert"], [role="status"], .app-action-error, .app-action-success').evaluateAll(nodes => nodes.map(n => (n.textContent || '').trim())) });
      if (name === 'Edit') await page.getByRole('button', { name: /^cancel$/i }).click().catch(() => {});
    }
  }
  showDetail.after = await snap(page, `/shows/${firstShowId}`);
  evidence.pages.push(showDetail);

  await page.goto(`${baseURL}/bookings`, { waitUntil: 'networkidle' });
  const reviewHref = await page.locator('a[href^="/bookings/review/"]').first().getAttribute('href').catch(() => null);
  if (reviewHref) {
    await page.goto(`${baseURL}${reviewHref}`, { waitUntil: 'networkidle' });
  } else {
    await page.goto(`${baseURL}/bookings/review/1`, { waitUntil: 'networkidle' });
  }
  const bookingReview = { kind: 'booking-review', route: page.url(), before: await snap(page, page.url()), interactions: [] };
  for (const name of ['Open link', 'Save booking details', 'Save review note']) {
    const loc = page.getByRole('button', { name: new RegExp(name, 'i') }).first();
    if (await loc.count()) {
      const disabled = await loc.isDisabled().catch(() => false);
      bookingReview.interactions.push({ name, disabledBefore: disabled });
      if (!disabled) {
        await loc.click().catch(e => bookingReview.interactions.push({ name, ok: false, error: String(e).slice(0,200) }));
        await page.waitForTimeout(500);
        bookingReview.interactions.push({ name, ok: true, url: page.url(), statuses: await page.locator('[role="alert"], [role="status"], .app-action-error, .app-action-success').evaluateAll(nodes => nodes.map(n => (n.textContent || '').trim())) });
      }
    }
  }
  bookingReview.after = await snap(page, page.url());
  evidence.pages.push(bookingReview);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(evidence, null, 2));
  console.log(outPath);
  await browser.close();
})();
