#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.PYXIS_REPO_ROOT || '/home/manuel/code/wesen/2026-04-23--pyxis';
const outDir = path.join(repoRoot, 'prototype-design/standalone/public');

const pages = [
  { page: 'shows', label: 'Shows', desktopHeight: 1460, mobileHeight: 1780 },
  { page: 'detail', label: 'Show detail', desktopHeight: 1100, mobileHeight: 1500 },
  { page: 'archive', label: 'Archive', desktopHeight: 1400, mobileHeight: 1700 },
  { page: 'book', label: 'Book us', desktopHeight: 1200, mobileHeight: 1700 },
  { page: 'about', label: 'About', desktopHeight: 1200, mobileHeight: 1600 },
];

function html({ page, label, compact = false, minHeight }) {
  const component = compact ? 'PPXMobile' : 'PPXDesktop';
  const width = compact ? 390 : 920;
  const title = `ppxis · ${label}${compact ? ' · Mobile' : ''}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="viewport" content="width=${width}" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: #fff;
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  #root {
    width: ${width}px;
    min-height: ${minHeight}px;
    background: #fff;
    overflow: visible;
  }
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
<script type="text/babel" src="../../screens/ppxis.jsx"></script>

<script type="text/babel" data-presets="react">
  function StandalonePage() {
    return <${component} page="${page}" />;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<StandalonePage />);
</script>
</body>
</html>
`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const page of pages) {
  const desktopPath = path.join(outDir, `${page.page}.html`);
  const mobilePath = path.join(outDir, `${page.page}-mobile.html`);
  fs.writeFileSync(desktopPath, html({ ...page, compact: false, minHeight: page.desktopHeight }));
  fs.writeFileSync(mobilePath, html({ ...page, compact: true, minHeight: page.mobileHeight }));
}

const index = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>ppxis · Standalone public prototype pages</title>
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
<h1>ppxis standalone public prototype pages</h1>
<p>Clean direct-render HTML pages generated from <code>screens/ppxis.jsx</code>. These bypass DesignCanvas and are intended for screenshot/CSS baseline extraction.</p>
<ul>
${pages.map((p) => `  <li><a href="${p.page}.html">${p.label}</a><span class="label">Desktop · 920px</span></li>\n  <li><a href="${p.page}-mobile.html">${p.label}</a><span class="label">Mobile · 390px</span></li>`).join('\n')}
</ul>
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, 'index.html'), index);

console.log(`Generated ${pages.length * 2 + 1} standalone public HTML files under ${outDir}`);
