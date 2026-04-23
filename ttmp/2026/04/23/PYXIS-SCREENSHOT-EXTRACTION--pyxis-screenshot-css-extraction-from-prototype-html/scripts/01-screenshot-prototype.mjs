/**
 * Screenshot all 10 artboards from the Pyxis prototype HTML.
 *
 * APPROACH: The DesignCanvas has a "focus mode" (DCFocusOverlay) — clicking an
 * artboard's expand button (⤢) opens a clean fullscreen overlay with just that
 * artboard rendered, no chrome. We programmatically trigger focus mode for each
 * artboard, screenshot the overlay, close it, and repeat.
 *
 * Setup:
 *   cd web/ && pnpm add -w -D playwright && npx playwright install chromium
 *   cd prototype-design/ && python3 -m http.server 7070 &
 *
 * Usage:
 *   cd web/
 *   node ../ttmp/.../scripts/screenshot-prototype.mjs
 */

import { chromium } from 'playwright';

const PROTO_URL = 'http://localhost:7070/Pyxis%20Public%20Site.html';
// Screenshots go to the repo root's prototype-design/ (script is run from web/)
const OUTPUT_DIR = '../prototype-design/';

// Artboard names in DOM order (all desktop first, then mobile)
const ARTBOARDS = [
  'd-shows', 'd-detail', 'd-archive', 'd-book', 'd-about',
  'm-shows', 'm-detail', 'm-archive', 'm-book', 'm-about',
];

const OUTPUT_NAMES = [
  '01-desktop-shows', '02-desktop-detail', '03-desktop-archive',
  '04-desktop-book', '05-desktop-about',
  '06-mobile-shows', '07-mobile-detail', '08-mobile-archive',
  '09-mobile-book', '10-mobile-about',
];

async function screenshotArtboard(page, selector, outputPath) {
  // Click the expand button (⤢) on this artboard's slot
  const btn = page.locator(`[data-dc-slot="${selector}"] .dc-expand`);
  await btn.click();
  await page.waitForTimeout(600); // Overlay transition

  // Screenshot the overlay (it's a position:fixed portal on document.body)
  await page.screenshot({ path: outputPath });

  // Close with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400); // Overlay close transition
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1400, height: 900 });

console.log(`Loading prototype from ${PROTO_URL}…`);
await page.goto(PROTO_URL);
await page.waitForTimeout(8000); // Babel in-browser compilation
console.log('Rendered.\n');

for (let i = 0; i < ARTBOARDS.length; i++) {
  const name = ARTBOARDS[i];
  const out = `${OUTPUT_DIR}${OUTPUT_NAMES[i]}.png`;
  try {
    await screenshotArtboard(page, name, out);
    console.log(`  ✓ ${OUTPUT_NAMES[i]}`);
  } catch (e) {
    console.error(`  ✗ ${OUTPUT_NAMES[i]}: ${e.message}`);
  }
}

await browser.close();
console.log('\nAll artboards saved via focus mode.');
