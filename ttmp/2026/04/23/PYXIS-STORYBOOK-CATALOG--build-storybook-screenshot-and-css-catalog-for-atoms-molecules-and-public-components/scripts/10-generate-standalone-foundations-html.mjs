#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.PYXIS_REPO_ROOT || '/home/manuel/code/wesen/2026-04-23--pyxis';
const standaloneRoot = path.join(repoRoot, 'prototype-design/standalone');
const outDir = path.join(standaloneRoot, 'foundations');
fs.mkdirSync(outDir, { recursive: true });

const content = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Pyxis · Foundations standalone</title>
<meta name="viewport" content="width=1240" />
<style>
  html, body { margin: 0; padding: 0; background: #F3F1EB; }
  #root { width: 1240px; min-height: 2650px; background: #F3F1EB; overflow: visible; }
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

<script type="text/babel" data-presets="react">
  function StandaloneFoundations() {
    return <SystemPage />;
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<StandaloneFoundations />);
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, 'system.html'), content);
fs.writeFileSync(path.join(outDir, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><title>Pyxis Foundations standalone</title></head>
<body><a href="system.html">SystemPage / Foundations</a></body></html>
`);

fs.writeFileSync(path.join(standaloneRoot, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Pyxis standalone prototype pages</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin: 0; padding: 32px; background: #F3F1EB; color: #1F1E1C; font: 14px/1.5 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  h1 { margin: 0 0 10px; font-family: Georgia, serif; font-size: 32px; }
  p { margin: 0 0 24px; color: #8E887E; }
  ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; padding: 0; margin: 0; list-style: none; }
  li { background: #fff; border: 1px solid #EAE7E0; border-radius: 10px; padding: 14px 16px; }
  a { color: #C8270D; text-decoration: none; font-weight: 700; }
  a:hover { text-decoration: underline; }
  .label { display: block; margin-top: 4px; font-size: 12px; color: #8E887E; }
</style>
</head>
<body>
<h1>Pyxis standalone prototype pages</h1>
<p>Clean standalone HTML entrypoints for baseline screenshot/CSS extraction. These bypass DesignCanvas.</p>
<ul>
  <li><a href="public/index.html">Public site pages</a><span class="label">Shows, detail, archive, book, about · desktop/mobile</span></li>
  <li><a href="foundations/system.html">Foundations / SystemPage</a><span class="label">Full App foundations only, not backend/admin screens</span></li>
</ul>
</body>
</html>
`);

console.log(`Generated standalone Foundations HTML under ${outDir}`);
