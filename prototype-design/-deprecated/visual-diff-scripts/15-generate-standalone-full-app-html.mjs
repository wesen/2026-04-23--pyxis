#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = process.env.PYXIS_REPO_ROOT || path.resolve(scriptDir, '../../..');
const standaloneRoot = path.join(repoRoot, 'prototype-design/standalone');
const outDir = path.join(standaloneRoot, 'full-app');
fs.mkdirSync(outDir, { recursive: true });

const screens = [
  { slug: 'login', component: 'LoginScreen', label: 'Login · Sign-in', group: 'Entry & onboarding' },
  { slug: 'setup', component: 'SetupScreen', label: 'Setup · Wizard step 3', group: 'Entry & onboarding' },
  { slug: 'dashboard', component: 'DashboardScreen', label: 'Dashboard · Home', group: 'Program' },
  { slug: 'shows', component: 'ShowsScreen', label: 'Shows · Index', group: 'Program' },
  { slug: 'calendar', component: 'CalendarScreen', label: 'Calendar · May 2025', group: 'Program' },
  { slug: 'bookings', component: 'BookingsScreen', label: 'Bookings · Queue', group: 'Program' },
  { slug: 'modal', component: 'ModalShowcase', label: 'Shows · New show modal', group: 'Program' },
  { slug: 'artists', component: 'ArtistsScreen', label: 'Artists · Roster', group: 'Roster & history' },
  { slug: 'attendance', component: 'AttendanceScreen', label: 'Post-show log', group: 'Roster & history' },
  { slug: 'log', component: 'AuditLogScreen', label: 'Audit log', group: 'Operate' },
  { slug: 'discord', component: 'DiscordScreen', label: 'Discord · Channel mapping', group: 'Operate' },
  { slug: 'settings', component: 'SettingsScreen', label: 'Settings · Space', group: 'Operate' },
];

function html({ component, label }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Pyxis Full App · ${label}</title>
<meta name="viewport" content="width=1240" />
<style>
  html, body { margin: 0; padding: 0; background: #F3F1EB; font-family: "Inter", -apple-system, sans-serif; }
  #root { width: 1240px; min-height: 760px; background: #F3F1EB; overflow: visible; }
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
<script type="text/babel" src="../../screens/system.jsx"></script>
<script type="text/babel" src="../../screens/auth-dash.jsx"></script>
<script type="text/babel" src="../../screens/shows-bookings.jsx"></script>
<script type="text/babel" src="../../screens/roster.jsx"></script>
<script type="text/babel" src="../../screens/settings-discord.jsx"></script>

<script type="text/babel" data-presets="react">
  function StandaloneFullAppScreen() {
    return <${component} />;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<StandaloneFullAppScreen />);
</script>
</body>
</html>
`;
}

for (const screen of screens) {
  fs.writeFileSync(path.join(outDir, `${screen.slug}.html`), html(screen));
}

const grouped = screens.reduce((acc, screen) => {
  acc[screen.group] ||= [];
  acc[screen.group].push(screen);
  return acc;
}, {});

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Pyxis standalone Full App prototype screens</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; padding: 32px; background: #F3F1EB; color: #1F1E1C; font: 14px/1.5 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  h1 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 32px; }
  p { margin: 0 0 24px; color: #8E887E; }
  h2 { margin: 26px 0 12px; font-family: Georgia, serif; font-size: 22px; }
  ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; padding: 0; margin: 0; list-style: none; }
  li { background: #fff; border: 1px solid #EAE7E0; border-radius: 10px; padding: 14px 16px; }
  a { color: #C8270D; text-decoration: none; font-weight: 600; }
  a:hover { text-decoration: underline; }
  .label { display: block; margin-top: 4px; font-size: 12px; color: #8E887E; }
</style>
</head>
<body>
<h1>Pyxis standalone Full App prototype screens</h1>
<p>Clean standalone HTML entrypoints generated from <code>Pyxis Full App.html</code> screen modules. These bypass DesignCanvas. Foundations/SystemPage is intentionally excluded because it already has an existing baseline.</p>
${Object.entries(grouped).map(([group, entries]) => `<h2>${group}</h2>\n<ul>\n${entries.map((s) => `  <li><a href="${s.slug}.html">${s.label}</a><span class="label">Full App screen · 1240 × 760 · ${s.component}</span></li>`).join('\n')}\n</ul>`).join('\n')}
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, 'index.html'), index);

console.log(`Generated ${screens.length + 1} standalone Full App HTML files under ${outDir}`);
