/**
 * Screenshot individual sub-components / sections from the Pyxis prototype.
 * Edit the `SHOTS` array below to add/remove targets.
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

// ── Shot definitions ────────────────────────────────────────────────────────
// Each shot: { page: 0-9, name, vp:{w,h}, scroll:{x,y}, clip:{x,y,w,h} }
// page index: 0=d-shows, 1=d-detail, 2=d-archive, 3=d-book, 4=d-about
//              5=m-shows, 6=m-detail, 7=m-archive, 8=m-book, 9=m-about

const DESKTOP_PAGES = [
  { sx: 60,   sy: 182, vp: { w: 1100, h: 1600 } },
  { sx: 1028, sy: 182, vp: { w: 1100, h: 1600 } },
  { sx: 1996, sy: 182, vp: { w: 1100, h: 1600 } },
  { sx: 2964, sy: 182, vp: { w: 1100, h: 1600 } },
  { sx: 3932, sy: 182, vp: { w: 1100, h: 1600 } },
];
const MOBILE_PAGES = [
  { sx: 60, sy: 1844, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 3624, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 5124, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 6824, vp: { w: 500, h: 1800 } },
  { sx: 60, sy: 8524, vp: { w: 500, h: 1800 } },
];
const allPages = [...DESKTOP_PAGES, ...MOBILE_PAGES];

// Clips are viewport-relative (canvas scrolled so artboard starts at 0,0)
const SHOTS = [
  // ── d-shows ──────────────────────────────────────────────────────────────
  { page: 0, name: '01-desktop-shows-full',    clip: { x: 0,   y: 0,   w: 920, h: 1460 } },
  { page: 0, name: '02-desktop-shows-nav',     clip: { x: 0,   y: 0,   w: 920, h: 62   } },
  { page: 0, name: '03-desktop-shows-heading', clip: { x: 32,  y: 101, w: 856, h: 78   } },
  { page: 0, name: '04-desktop-shows-hero',   clip: { x: 32,  y: 230, w: 856, h: 520  } },
  { page: 0, name: '05-desktop-shows-list',   clip: { x: 32,  y: 760, w: 856, h: 560  } },
  { page: 0, name: '06-desktop-shows-footer', clip: { x: 0,   y: 1340,w: 920, h: 120  } },
  // ── d-detail ────────────────────────────────────────────────────────────
  { page: 1, name: '07-desktop-detail-full',   clip: { x: 0,   y: 0,   w: 920, h: 1100 } },
  { page: 1, name: '08-desktop-detail-hero',  clip: { x: 0,   y: 0,   w: 920, h: 320  } },
  { page: 1, name: '09-desktop-detail-body',  clip: { x: 32,  y: 340, w: 856, h: 600  } },
  // ── d-archive ───────────────────────────────────────────────────────────
  { page: 2, name: '10-desktop-archive-full',   clip: { x: 0,   y: 0,   w: 920, h: 1400 } },
  { page: 2, name: '11-desktop-archive-header',clip:{ x: 32,  y: 101, w: 856, h: 120  } },
  { page: 2, name: '12-desktop-archive-stats', clip: { x: 32,  y: 250, w: 856, h: 140  } },
  { page: 2, name: '13-desktop-archive-years', clip: { x: 32,  y: 420, w: 856, h: 700  } },
  // ── d-book ─────────────────────────────────────────────────────────────
  { page: 3, name: '14-desktop-book-full',     clip: { x: 0,   y: 0,   w: 920, h: 1200 } },
  { page: 3, name: '15-desktop-book-form',    clip: { x: 32,  y: 180, w: 480, h: 800  } },
  { page: 3, name: '16-desktop-book-sidebar',  clip: { x: 540, y: 180, w: 348, h: 800  } },
  // ── d-about ────────────────────────────────────────────────────────────
  { page: 4, name: '17-desktop-about-full',   clip: { x: 0,   y: 0,   w: 920, h: 1200 } },
  { page: 4, name: '18-desktop-about-hero',  clip: { x: 32,  y: 120, w: 856, h: 180  } },
  // ── mobile ─────────────────────────────────────────────────────────────
  { page: 5, name: '19-mobile-shows-full',    clip: { x: 0,   y: 0,   w: 390, h: 896  } },
  { page: 5, name: '20-mobile-shows-nav',     clip: { x: 0,   y: 12,  w: 390, h: 40   } },
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
  console.log(`  ✓ ${shot.name}`);
}

await browser.close();
console.log(`\n${SHOTS.length} component screenshots saved to ${OUTPUT_BASE}`);
