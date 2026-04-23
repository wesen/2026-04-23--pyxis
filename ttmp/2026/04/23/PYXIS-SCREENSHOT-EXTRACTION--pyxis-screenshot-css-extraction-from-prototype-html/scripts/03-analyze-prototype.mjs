/**
 * DOM analysis script — dumps meaningful elements with bounding rectangles
 * from the Pyxis prototype HTML. Use this to find element positions for
 * targeted component screenshots.
 *
 * Usage:
 *   cd web/
 *   node ../ttmp/.../scripts/analyze-prototype.mjs
 */

import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:7070/Pyxis%20Public%20Site.html');
await page.waitForTimeout(8000); // Babel compilation

// Scroll to first desktop artboard (d-shows)
await page.setViewportSize({ width: 920, height: 1460 });
await page.evaluate(() => window.scrollTo(60, 182));
await page.waitForTimeout(500);

console.log('=== Desktop Shows — key elements ===\n');
const elements = await page.evaluate(() => {
  const canvas = document.querySelector('.design-canvas');
  if (!canvas) return 'no canvas';

  const results = [];

  // All buttons
  for (const b of document.querySelectorAll('button')) {
    const r = b.getBoundingClientRect();
    results.push({ tag: 'BUTTON', text: (b.textContent||'').trim().substring(0,40), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
  }

  // All headings
  for (const h of document.querySelectorAll('h1,h2,h3')) {
    const r = h.getBoundingClientRect();
    results.push({ tag: h.tagName, text: (h.textContent||'').trim().substring(0,60), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
  }

  // All semantic sections
  for (const el of ['HEADER','NAV','MAIN','FOOTER','SECTION','ARTICLE']) {
    for (const e of document.querySelectorAll(el)) {
      const r = e.getBoundingClientRect();
      if (r.width > 10 && r.height > 10) {
        results.push({ tag: el, text: (e.textContent||'').trim().substring(0,50), x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
      }
    }
  }

  return results.sort((a, b) => a.y - b.y);
});

console.table(elements);

await browser.close();
