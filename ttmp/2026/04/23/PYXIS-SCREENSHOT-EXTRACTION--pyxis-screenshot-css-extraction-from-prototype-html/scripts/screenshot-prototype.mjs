/**
 * Screenshot all 10 artboards from the Pyxis prototype HTML.
 *
 * Usage:
 *   node screenshot-prototype.mjs
 *
 * Prerequisites:
 *   cd web/                          # run from the web workspace
 *   pnpm add -w -D playwright
 *   npx playwright install chromium
 *
 *   # Start a local server from the prototype-design/ directory:
 *   cd prototype-design/
 *   python3 -m http.server 7070 &
 *   cd ..
 *
 * The prototype must be served at http://localhost:7070/Pyxis%20Public%20Site.html
 *
 * Screenshots are saved to prototype-design/XX-*.png
 */

import { chromium } from 'playwright';

// ── Config ──────────────────────────────────────────────────────────────────

// Where to save screenshots (relative to where this script is run from)
const OUTPUT_DIR = 'prototype-design/';

// Prototyp prototype URL
const PROTO_URL = 'http://localhost:7070/Pyxis%20Public%20Site.html';

// ── Artboard definitions ───────────────────────────────────────────────────
// Canvas coordinates from DOM analysis (canvas scroll position, then clip size)

const DESKTOP_PAGES = [
  { name: '01-desktop-shows',   sx: 60,   sy: 182, w: 920, h: 1460 },
  { name: '02-desktop-detail',  sx: 1028, sy: 182, w: 920, h: 1100 },
  { name: '03-desktop-archive', sx: 1996, sy: 182, w: 920, h: 1400 },
  { name: '04-desktop-book',    sx: 2964, sy: 182, w: 920, h: 1200 },
  { name: '05-desktop-about',   sx: 3932, sy: 182, w: 920, h: 1200 },
];

const MOBILE_PAGES = [
  { name: '06-mobile-shows',   sx: 60, sy: 1844, w: 390, h: 1780 },
  { name: '07-mobile-detail',  sx: 60, sy: 3624, w: 390, h: 1500 },
  { name: '08-mobile-archive',sx: 60, sy: 5124, w: 390, h: 1700 },
  { name: '09-mobile-book',   sx: 60, sy: 6824, w: 390, h: 1700 },
  { name: '10-mobile-about',  sx: 60, sy: 8524, w: 390, h: 1600 },
];

// ── Main ───────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
const page = await browser.newPage();

console.log(`Loading prototype from ${PROTO_URL}…`);
await page.goto(PROTO_URL);
await page.waitForTimeout(8000); // Wait for Babel in-browser compilation
console.log('Rendered.');

// Desktop — wider viewport than artboard so artboard has breathing room
await page.setViewportSize({ width: 1100, height: 1600 });

for (const p of DESKTOP_PAGES) {
  await page.evaluate(([sx, sy]) => window.scrollTo(sx, sy), [p.sx, p.sy]);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${OUTPUT_DIR}${p.name}.png`,
    clip: { x: 0, y: 0, width: p.w, height: p.h },
  });
  console.log(`  ✓ ${p.name} (${p.w}×${p.h})`);
}

// Mobile
await page.setViewportSize({ width: 500, height: 1800 });

for (const p of MOBILE_PAGES) {
  await page.evaluate(([sx, sy]) => window.scrollTo(sx, sy), [p.sx, p.sy]);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${OUTPUT_DIR}${p.name}.png`,
    clip: { x: 0, y: 0, width: p.w, height: p.h },
  });
  console.log(`  ✓ ${p.name} (${p.w}×${p.h})`);
}

await browser.close();
console.log('\nAll 10 artboards saved to prototype-design/.');
