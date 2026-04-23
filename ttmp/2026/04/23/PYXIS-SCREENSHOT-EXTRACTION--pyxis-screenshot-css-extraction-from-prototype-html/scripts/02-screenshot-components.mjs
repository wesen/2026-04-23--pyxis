/**
 * Screenshot individual sub-components / sections from the Pyxis prototype.
 * Edit the `SHOTS` array below to add/remove targets.
 *
 * IMPORTANT: The DesignCanvas has a 60px fixed chrome header at viewport y=0.
 * All clip y values are adjusted by +CHROME_H so they capture the actual
 * artboard content, not the chrome bar.
 *
 * Usage:
 *   cd web/
 *   node ../ttmp/.../scripts/screenshot-components.mjs
 *
 * Screenshots saved to prototype-design/comp/XX-name.png
 */

import { chromium } from 'playwright';

const PROTO_URL = 'http://localhost:7070/Pyxis%20Public%20Site.html';
const OUTPUT_BASE = 'prototype-design/comp/';

// The DesignCanvas chrome header is always at viewport y=0 (60px tall).
// Add CHROME_H to every clip's y and height.
const CHROME_H = 60;

// ── Page definitions ────────────────────────────────────────────────────────
// page index: 0=d-shows, 1=d-detail, 2=d-archive, 3=d-book, 4=d-about
//              5=m-shows, 6=m-detail, 7=m-archive, 8=m-book, 9=m-about

const DESKTOP_PAGES = [
  { sx: 60,   sy: 0,  vp: { w: 1100, h: 1600 } },
  { sx: 1028, sy: 0,  vp: { w: 1100, h: 1600 } },
  { sx: 1996, sy: 0,  vp: { w: 1100, h: 1600 } },
  { sx: 2964, sy: 0,  vp: { w: 1100, h: 1600 } },
  { sx: 3932, sy: 0,  vp: { w: 1100, h: 1600 } },
];
const MOBILE_PAGES = [
  { sx: 60, sy: 1844, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 3624, vp: { w: 500, h: 1800 } },  // approximate — rerun analyze to confirm
  { sx: 60, sy: 5124, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 6824, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 8524, vp: { w: 500, h: 1800 } },
];
const allPages = [...DESKTOP_PAGES, ...MOBILE_PAGES];

// Clips are viewport-relative, +CHROME_H adjusted so they target artboard content
const SHOTS = [
  // ── d-shows ──────────────────────────────────────────────────────────────
  { page: 0, name: '01-desktop-shows-full',    clip: { x: 0,   y: CHROME_H, w: 920, h: 1460 + CHROME_H } },
  { page: 0, name: '02-desktop-shows-nav',     clip: { x: 0,   y: CHROME_H, w: 920, h: 62              } },
  { page: 0, name: '03-desktop-shows-heading', clip: { x: 32,  y: 101 + CHROME_H, w: 856, h: 78   } },
  { page: 0, name: '04-desktop-shows-hero',   clip: { x: 32,  y: 230 + CHROME_H, w: 856, h: 520  } },
  { page: 0, name: '05-desktop-shows-list',   clip: { x: 32,  y: 760 + CHROME_H, w: 856, h: 560  } },
  { page: 0, name: '06-desktop-shows-footer', clip: { x: 0,   y: 1340 + CHROME_H, w: 920, h: 120 } },
  { page: 0, name: '07-desktop-show-row',     clip: { x: 32,  y: 760 + CHROME_H, w: 856, h: 90   } },
  // ── d-detail ────────────────────────────────────────────────────────────
  { page: 1, name: '08-desktop-detail-full',   clip: { x: 0,   y: CHROME_H, w: 920, h: 1100 + CHROME_H } },
  { page: 1, name: '09-desktop-detail-hero',  clip: { x: 0,   y: CHROME_H, w: 920, h: 320             } },
  { page: 1, name: '10-desktop-detail-body',  clip: { x: 32,  y: 340 + CHROME_H, w: 856, h: 600  } },
  // ── d-archive ────────────────────────────────────────────────────────────
  { page: 2, name: '11-desktop-archive-full',   clip: { x: 0,   y: CHROME_H, w: 920, h: 1400 + CHROME_H } },
  { page: 2, name: '12-desktop-archive-header', clip: { x: 32,  y: 101 + CHROME_H, w: 856, h: 120 } },
  { page: 2, name: '13-desktop-archive-stats', clip: { x: 32,  y: 250 + CHROME_H, w: 856, h: 140  } },
  { page: 2, name: '14-desktop-archive-years', clip: { x: 32,  y: 420 + CHROME_H, w: 856, h: 700  } },
  // ── d-book ──────────────────────────────────────────────────────────────
  { page: 3, name: '15-desktop-book-full',    clip: { x: 0,   y: CHROME_H, w: 920, h: 1200 + CHROME_H } },
  { page: 3, name: '16-desktop-book-form',   clip: { x: 32,  y: 180 + CHROME_H, w: 480, h: 800  } },
  { page: 3, name: '17-desktop-book-sidebar', clip: { x: 540, y: 180 + CHROME_H, w: 348, h: 800  } },
  // ── d-about ─────────────────────────────────────────────────────────────
  { page: 4, name: '18-desktop-about-full',   clip: { x: 0,   y: CHROME_H, w: 920, h: 1200 + CHROME_H } },
  { page: 4, name: '19-desktop-about-hero', clip: { x: 32,  y: 120 + CHROME_H, w: 856, h: 180  } },
  // ── mobile ──────────────────────────────────────────────────────────────
  { page: 5, name: '20-mobile-shows-full',    clip: { x: 0,   y: CHROME_H, w: 390, h: 1780 + CHROME_H } },
  { page: 5, name: '21-mobile-shows-nav',     clip: { x: 0,   y: CHROME_H, w: 390, h: 40               } },
];

// ── Main ───────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(PROTO_URL);
await page.waitForTimeout(8000);
console.log('Prototype rendered.\n');

for (const shot of SHOTS) {
  const pg = allPages[shot.page];
  await page.setViewportSize(pg.vp);
  await page.evaluate(([sx, sy]) => window.scrollTo(sx, sy), [pg.sx, pg.sy]);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${OUTPUT_BASE}${shot.name}.png`,
    clip: { x: shot.clip.x, y: shot.clip.y, width: shot.clip.w, height: shot.clip.h },
  });
  console.log(`  ✓ ${shot.name} (clip: ${shot.clip.x},${shot.clip.y} ${shot.clip.w}×${shot.clip.h})`);
}

await browser.close();
console.log(`\n${SHOTS.length} component screenshots saved to ${OUTPUT_BASE}`);
