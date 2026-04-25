#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = path.basename(process.cwd()) === 'web' ? path.resolve(process.cwd(), '..') : process.cwd();
const require = createRequire(import.meta.url);
const { chromium } = require(path.join(ROOT, 'web/node_modules/playwright'));
const OUT = path.join(ROOT, 'ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/02-route-section-dom-snapshot.json');

const pages = [
  ['desktop', 'LoginPage', '/standalone/full-app/login.html'],
  ['desktop', 'SetupPage', '/standalone/full-app/setup.html'],
  ['desktop', 'DashboardPage', '/standalone/full-app/dashboard.html'],
  ['desktop', 'ShowsPage', '/standalone/full-app/shows.html'],
  ['desktop', 'CalendarPage', '/standalone/full-app/calendar.html'],
  ['desktop', 'BookingsPage', '/standalone/full-app/bookings.html'],
  ['desktop', 'NewShowModal', '/standalone/full-app/modal.html'],
  ['desktop', 'ArtistsPage', '/standalone/full-app/artists.html'],
  ['desktop', 'AttendancePage', '/standalone/full-app/attendance.html'],
  ['desktop', 'AuditLogPage', '/standalone/full-app/log.html'],
  ['desktop', 'DiscordPage', '/standalone/full-app/discord.html'],
  ['desktop', 'SettingsPage', '/standalone/full-app/settings.html'],
  ['mobile', 'LoginPage', '/standalone/mobile/login.html'],
  ['mobile', 'DashboardPage', '/standalone/mobile/home.html'],
  ['mobile', 'ShowsPage', '/standalone/mobile/shows.html'],
  ['mobile', 'ShowDetailPage', '/standalone/mobile/show-detail.html'],
  ['mobile', 'CalendarPage', '/standalone/mobile/calendar.html'],
  ['mobile', 'BookingsPage', '/standalone/mobile/bookings.html'],
  ['mobile', 'BookingReviewPage', '/standalone/mobile/booking-review.html'],
  ['mobile', 'ArtistsPage', '/standalone/mobile/artists.html'],
  ['mobile', 'ArtistDetailPage', '/standalone/mobile/artist-detail.html'],
  ['mobile', 'PostShowPage', '/standalone/mobile/post-show.html'],
  ['mobile', 'SettingsPage', '/standalone/mobile/settings.html'],
];

const browser = await chromium.launch({ headless: true });
const out = [];
for (const [variant, route, prototypePath] of pages) {
  const page = await browser.newPage({ viewport: variant === 'mobile' ? { width: 390, height: 844 } : { width: 1240, height: 900 } });
  const url = `http://localhost:7070${prototypePath}`;
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => {
    const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
    };
    const nodePath = (el) => {
      const parts = [];
      for (let n = el; n && n.nodeType === 1 && parts.length < 4; n = n.parentElement) {
        let part = n.tagName.toLowerCase();
        if (n.id) part += `#${n.id}`;
        if (n.getAttribute('data-page')) part += `[data-page="${n.getAttribute('data-page')}"]`;
        if (n.getAttribute('data-section')) part += `[data-section="${n.getAttribute('data-section')}"]`;
        parts.unshift(part);
      }
      return parts.join(' > ');
    };
    const dataSelectors = [...document.querySelectorAll('[data-page],[data-section],[data-pyxis-component],[data-pyxis-part]')].filter(visible).slice(0, 80).map((el) => ({
      tag: el.tagName.toLowerCase(),
      path: nodePath(el),
      page: el.getAttribute('data-page'),
      section: el.getAttribute('data-section'),
      component: el.getAttribute('data-pyxis-component'),
      part: el.getAttribute('data-pyxis-part'),
      text: clean(el.textContent).slice(0, 140),
    }));
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')].filter(visible).slice(0, 30).map((el) => ({
      level: el.tagName.toLowerCase(),
      text: clean(el.textContent),
      path: nodePath(el),
    }));
    const landmarkish = [...document.querySelectorAll('header,nav,main,aside,section,article,form,table')].filter(visible).slice(0, 60).map((el) => ({
      tag: el.tagName.toLowerCase(),
      path: nodePath(el),
      text: clean(el.textContent).slice(0, 120),
    }));
    const buttons = [...document.querySelectorAll('button,a')].filter(visible).slice(0, 40).map((el) => clean(el.textContent).slice(0, 80)).filter(Boolean);
    return { title: document.title, dataSelectors, headings, landmarkish, buttons };
  });
  out.push({ variant, route, prototypePath, status: response?.status(), ...info });
  await page.close();
}
await browser.close();
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, `${JSON.stringify(out, null, 2)}\n`);
console.log(`wrote ${OUT}`);
