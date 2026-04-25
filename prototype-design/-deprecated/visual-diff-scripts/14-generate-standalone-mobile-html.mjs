#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = process.env.PYXIS_REPO_ROOT || path.resolve(scriptDir, '../../..');
const standaloneRoot = path.join(repoRoot, 'prototype-design/standalone');
const outDir = path.join(standaloneRoot, 'mobile');
fs.mkdirSync(outDir, { recursive: true });

const screens = [
  { slug: 'login', component: 'MLogin', label: 'Login' },
  { slug: 'home', component: 'MHome', label: 'Home / Dashboard' },
  { slug: 'shows', component: 'MShows', label: 'Shows / Index' },
  { slug: 'show-detail', component: 'MShowDetail', label: 'Show / Detail' },
  { slug: 'calendar', component: 'MCalendar', label: 'Calendar / May 2025' },
  { slug: 'bookings', component: 'MBookings', label: 'Bookings / Queue' },
  { slug: 'booking-review', component: 'MBookingReview', label: 'Booking / Review' },
  { slug: 'artists', component: 'MArtists', label: 'Artists / Roster' },
  { slug: 'artist-detail', component: 'MArtistDetail', label: 'Artist / Detail' },
  { slug: 'post-show', component: 'MPostShow', label: 'Post-show / Log' },
  { slug: 'settings', component: 'MSettings', label: 'More / Settings' },
];

function html({ component, label }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Pyxis Mobile · ${label}</title>
<meta name="viewport" content="width=390" />
<style>
  html, body { margin: 0; padding: 0; background: #E8E4DA; font-family: "Inter", -apple-system, sans-serif; }
  #root { width: 390px; min-height: 844px; background: #E8E4DA; overflow: visible; }
</style>
</head>
<body>
<div id="root"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<script src="../../lib/tokens.js"></script>
<script src="../../lib/data.js"></script>
<script type="text/babel" src="../../lib/components.jsx"></script>
<script type="text/babel" src="../../ios-frame.jsx"></script>
<script type="text/babel" src="../../screens/mobile.jsx"></script>

<script type="text/babel" data-presets="react">
  function StandaloneMobileScreen() {
    return <${component} />;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<StandaloneMobileScreen />);
</script>
</body>
</html>
`;
}

for (const screen of screens) {
  fs.writeFileSync(path.join(outDir, `${screen.slug}.html`), html(screen));
}

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Pyxis standalone mobile prototype screens</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; padding: 32px; background: #F3F1EB; color: #1F1E1C; font: 14px/1.5 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  h1 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 32px; }
  p { margin: 0 0 24px; color: #8E887E; }
  ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; padding: 0; margin: 0; list-style: none; }
  li { background: #fff; border: 1px solid #EAE7E0; border-radius: 10px; padding: 14px 16px; }
  a { color: #C8270D; text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
  .label { display: block; margin-top: 4px; font-size: 12px; color: #8E887E; }
</style>
</head>
<body>
<h1>Pyxis standalone mobile prototype screens</h1>
<p>Clean standalone HTML entrypoints generated from <code>screens/mobile.jsx</code>. These bypass DesignCanvas and are intended for screenshot/CSS baseline extraction.</p>
<ul>
${screens.map((s) => `  <li><a href="${s.slug}.html">${s.label}</a><span class="label">Mobile screen · 390 × 844</span></li>`).join('\n')}
</ul>
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, 'index.html'), index);

console.log(`Generated ${screens.length + 1} standalone mobile HTML files under ${outDir}`);
