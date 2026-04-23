# Scripts — PYXIS-SCREENSHOT-EXTRACTION

## Setup

```bash
# 1. Install playwright in the web workspace
cd ../../../web/
pnpm add -w -D playwright
npx playwright install chromium

# 2. Start a local server from prototype-design/
cd ../prototype-design/
python3 -m http.server 7070 &
# Prototype will be available at http://localhost:7070/Pyxis%20Public%20Site.html
```

## Numbered workflow

Numbered scripts are the traceable workflow used during this ticket. The original
unnumbered scripts are preserved for compatibility; numbered copies/wrappers show
the sequence of the investigation and follow-up comparison runs.

- `01-screenshot-prototype.mjs` — first DesignCanvas screenshot attempt.
- `02-screenshot-components.mjs` — first component clipping attempt.
- `03-analyze-prototype.mjs` — prototype DOM/artboard analysis helper.
- `04-capture-direct-render.mjs` — direct-render prototype extractor that bypasses DesignCanvas.
- `05-serve-pyxis-prototype.sh` — serve `prototype-design/` on port 7070.
- `06-run-pyxis-prototype-only.sh` — run css-visual-diff against the prepared prototype mirrored into both targets; use this to validate extraction only.
- `07-pyxis-app-server.mjs` — static/API server for the built `pyxis-user-site` app with local SVG flyer data URLs to avoid external image hangs.
- `08-run-pyxis-prototype-vs-app.sh` — build the app, serve it, and run the real prepared-prototype-vs-current-app comparison.
- `09-serve-css-visual-diff-report.sh` — serve a generated report directory and expose `test.html` in the browser.
- `10-atom-original-prepare.js` — prototype-side atom fixture renderer used by css-visual-diff `prepare.script_file`.
- `11-run-pyxis-atom-diff.sh` — restart Storybook, then compare prototype atoms vs Storybook atoms.
- `12-serve-atom-diff-report.sh` — serve the atom diff report at `test.html`.
- `13-serve-user-site-storybook-static.sh` — serve the built `pyxis-user-site` Storybook static bundle on port `6007`.
- `14-run-pyxis-storybook-shows-desktop.sh` — compare prototype Shows desktop against the user-site Storybook Shows Desktop story.

## Scripts

### `analyze-prototype.mjs`
Dumps a table of key DOM elements (buttons, headings, semantic sections) with their
bounding rectangles. Use to find coordinates before writing targeted component screenshots.

```bash
cd ../../../web/
node ../ttmp/.../scripts/analyze-prototype.mjs
```

### `screenshot-prototype.mjs`
Screenshots all 10 full artboards (5 desktop + 5 mobile) to `prototype-design/*.png`.

```bash
cd ../../../web/
node ../ttmp/.../scripts/screenshot-prototype.mjs
```

### `screenshot-components.mjs`
Screenshots individual sub-components from the DesignCanvas. This was the first approach and is now considered fragile because DesignCanvas is transform/pan based, not page-scroll based. Prefer `capture-direct-render.mjs` for public-site pages.

```bash
cd ../../../web/
node ../ttmp/.../scripts/screenshot-components.mjs
```

### `capture-direct-render.mjs` — recommended
Loads the prototype HTML, waits for `PPXDesktop`/`PPXMobile` globals, discards the DesignCanvas DOM, directly renders `PPXDesktop({ page: 'shows' })` into `#capture-root`, then exports PNG, HTML, and computed-style JSON.

```bash
cd ../../../web/
node ../ttmp/.../scripts/capture-direct-render.mjs
```

Outputs:

```text
prototype-design/direct/home/desktop-shows-full.png
prototype-design/direct/home/header.png
prototype-design/direct/home/nav.png
prototype-design/direct/home/main.png
prototype-design/direct/home/heading-block.png
prototype-design/direct/home/shows-grid.png
prototype-design/direct/home/footer.png
prototype-design/direct/home/desktop-shows.html
prototype-design/direct/home/desktop-shows.inspect.json
```

## Artboard canvas positions

From DOM analysis (`window.scrollTo(sx, sy)` to position artboard at top-left):

| Artboard | Scroll X | Scroll Y | Artboard size |
|---|---|---|---|
| d-shows | 60 | 182 | 920×1460 |
| d-detail | 1028 | 182 | 920×1100 |
| d-archive | 1996 | 182 | 920×1400 |
| d-book | 2964 | 182 | 920×1200 |
| d-about | 3932 | 182 | 920×1200 |
| m-shows | 60 | 1844 | 390×1780 |
| m-detail | 60 | 3624 | 390×1500 |
| m-archive | 60 | 5124 | 390×1700 |
| m-book | 60 | 6824 | 390×1700 |
| m-about | 60 | 8524 | 390×1600 |

## Adding a new component shot

1. Run `analyze-prototype.mjs` to find element coordinates
2. Add entry to `SHOTS` array in `screenshot-components.mjs`:
   ```js
   { page: 0, name: 'XX-my-component', clip: { x, y, w, h } }
   ```
3. Run `node screenshot-components.mjs`
