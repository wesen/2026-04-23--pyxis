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
Screenshots individual sub-components. Edit the `SHOTS` array in the script to add
or change targets. Saves to `prototype-design/comp/*.png`.

```bash
cd ../../../web/
node ../ttmp/.../scripts/screenshot-components.mjs
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
