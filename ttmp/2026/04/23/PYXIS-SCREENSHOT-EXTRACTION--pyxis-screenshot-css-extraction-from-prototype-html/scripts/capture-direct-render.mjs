/**
 * capture-direct-render.mjs
 *
 * Better prototype extraction strategy:
 *   1. Load the original prototype HTML so all prototype globals/scripts compile.
 *   2. Throw away the DesignCanvas DOM.
 *   3. Directly render PPXDesktop / PPXMobile into a clean #capture-root.
 *   4. Screenshot #capture-root and selected sub-elements.
 *   5. Export HTML and computed CSS/box metrics for Storybook reconstruction.
 *
 * This avoids the pan/zoom DesignCanvas entirely. It is the recommended path for
 * pixel extraction from these prototype HTML pages.
 *
 * Setup:
 *   cd prototype-design && python3 -m http.server 7070 &
 *   cd web && pnpm add -w -D playwright && npx playwright install chromium
 *
 * Usage:
 *   cd web
 *   node ../ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
 */

import { createRequire } from 'module';
import { mkdirSync, writeFileSync } from 'fs';

// Resolve workspace dependencies from the directory where the script is run
// (normally `web/`), not from this ticket scripts/ directory.
const require = createRequire(`${process.cwd()}/package.json`);
const { chromium } = require('playwright');

const PROTO_URL = 'http://localhost:7070/Pyxis%20Public%20Site.html';
const OUT_DIR = '../prototype-design/direct/home';

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 2200 } });

console.log(`Loading ${PROTO_URL}`);
await page.goto(PROTO_URL);
await page.waitForFunction(
  () => window.React && window.ReactDOM && window.PPXDesktop && window.PPXMobile,
  null,
  { timeout: 30000 },
);
await page.waitForTimeout(1000);

console.log('Direct-rendering PPXDesktop(page="shows") outside DesignCanvas');
await page.evaluate(() => {
  document.body.innerHTML = '<div id="capture-root"></div>';
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.background = '#fff';

  const root = document.getElementById('capture-root');
  root.style.width = '920px';
  root.style.minHeight = '1460px';
  root.style.background = '#fff';
  root.style.overflow = 'visible';

  ReactDOM.createRoot(root).render(React.createElement(PPXDesktop, { page: 'shows' }));
});
await page.waitForTimeout(1000);

// Full clean page shot.
await page.locator('#capture-root').screenshot({ path: `${OUT_DIR}/desktop-shows-full.png` });
console.log(`  ✓ ${OUT_DIR}/desktop-shows-full.png`);

// Common region screenshots.
const regions = [
  ['header', 'header'],
  ['nav', 'nav'],
  ['main', 'main'],
  ['heading-block', 'main > div:first-child'],
  ['shows-grid', 'main > div:nth-child(2)'],
  ['first-show-card', 'main > div:nth-child(2) > div:first-child'],
  ['footer', 'footer'],
];

for (const [name, selector] of regions) {
  const loc = page.locator(selector).first();
  const count = await loc.count();
  if (!count) {
    console.warn(`  ! selector not found: ${selector}`);
    continue;
  }
  await loc.screenshot({ path: `${OUT_DIR}/${name}.png` });
  console.log(`  ✓ ${OUT_DIR}/${name}.png`);
}

// Export DOM HTML for reconstruction.
const html = await page.locator('#capture-root').evaluate((el) => el.outerHTML);
writeFileSync(`${OUT_DIR}/desktop-shows.html`, html);
console.log(`  ✓ ${OUT_DIR}/desktop-shows.html`);

// Export computed style + layout tree.
const inspect = await page.evaluate(() => {
  const interestingStyleProps = [
    'display', 'position', 'boxSizing',
    'width', 'height', 'minHeight', 'padding', 'margin',
    'gap', 'gridTemplateColumns', 'gridAutoRows', 'alignItems', 'justifyContent',
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
    'color', 'backgroundColor', 'border', 'borderRadius', 'boxShadow',
    'textTransform', 'textAlign', 'overflow', 'zIndex',
  ];

  function styleObject(el) {
    const cs = getComputedStyle(el);
    return Object.fromEntries(interestingStyleProps.map((p) => [p, cs[p]]));
  }

  function nodeToJSON(el, depth = 0) {
    const r = el.getBoundingClientRect();
    const children = Array.from(el.children).map((c) => nodeToJSON(c, depth + 1));
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      className: el.className || null,
      text: children.length ? null : (el.textContent || '').trim(),
      rect: {
        x: Math.round(r.x), y: Math.round(r.y),
        width: Math.round(r.width), height: Math.round(r.height),
      },
      style: styleObject(el),
      children,
    };
  }

  return nodeToJSON(document.getElementById('capture-root'));
});
writeFileSync(`${OUT_DIR}/desktop-shows.inspect.json`, JSON.stringify(inspect, null, 2));
console.log(`  ✓ ${OUT_DIR}/desktop-shows.inspect.json`);

await browser.close();
console.log('Done.');
