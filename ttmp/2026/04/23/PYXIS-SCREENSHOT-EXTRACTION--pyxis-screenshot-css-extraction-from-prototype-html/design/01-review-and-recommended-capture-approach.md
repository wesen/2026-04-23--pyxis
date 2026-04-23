---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: prototype-design/Pyxis Public Site.html
      Note: Prototype entrypoint that loads PPXDesktop/PPXMobile globals
    - Path: prototype-design/design-canvas.jsx
      Note: Explains why window.scrollTo failed; DesignCanvas is transform/pan based
    - Path: prototype-design/direct/home/desktop-shows-full.png
      Note: Validated clean home-page PNG baseline
    - Path: prototype-design/direct/home/desktop-shows.inspect.json
      Note: Computed style and layout inspection output
    - Path: ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
      Note: Recommended direct-render extraction script
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Review: Prototype Artboard Screenshot Extraction

## Executive summary

The first screenshot extraction approach was flawed. It produced images of the correct nominal size, but the captured region was not the intended artboard region. The root cause was a misunderstanding of `DesignCanvas`: it is not a normal scrollable page. It is a pan/zoom viewport with `overflow: hidden`, and its content is moved via internal `transform: translate3d(...) scale(...)` state, not via `window.scrollTo`. As a result, all attempts to use `window.scrollTo(x, y)` and viewport clips were effectively capturing from the same visible canvas viewport origin.

The better approach is to bypass `DesignCanvas` entirely for extraction. The prototype HTML loads all useful globals (`React`, `ReactDOM`, `PPXDesktop`, `PPXMobile`, tokens, data, components). Once those globals exist, we can replace the document body with a clean `<div id="capture-root">`, render the desired prototype page directly via `ReactDOM.createRoot(...).render(React.createElement(PPXDesktop, { page: 'shows' }))`, and then screenshot `#capture-root` or its children. This produces clean, pixel-meaningful screenshots with no canvas chrome, no overlay chrome, no panning math, and no accidental 0x0 captures.

A prototype implementation of this better approach now exists as:

```text
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

It currently exports the home page (`PPXDesktop page="shows"`) to:

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

The direct-render full screenshot was validated visually: it starts at y=0 with the real `ppxis` website header, includes the full home page, and reaches the footer. This should replace the earlier DesignCanvas-based artboard screenshots for pixel comparison work.

A comparison sheet was created at:

```text
prototype-design/direct/review/home-old-vs-direct.png
```

Visual inspection of that sheet confirms:

- **Old DesignCanvas capture:** begins with gray grid/canvas chrome (`01 · Desktop`, `Poster-grid shell`, artboard label row), is cut off before the bottom row and footer, and therefore is unsuitable for pixel-perfect reconstruction.
- **Direct-render capture:** begins immediately with the actual `ppxis` navigation bar, includes all home-page show cards, and reaches the full footer. This is the correct baseline.

---

## What little brother tried

The initial extraction strategy treated the DesignCanvas as if it were a normal large web page:

1. Serve `prototype-design/` with `python3 -m http.server 7070`.
2. Navigate Playwright to `Pyxis Public Site.html`.
3. Wait for Babel standalone compilation.
4. Call `window.scrollTo(sx, sy)` for each artboard coordinate.
5. Take a screenshot with a fixed clip, e.g. `920×1460`.

This produced files like:

```text
prototype-design/01-desktop-shows.png
prototype-design/comp/01-desktop-shows-full.png
```

The files had plausible dimensions, but visual inspection showed they included `DesignCanvas` presentation chrome such as:

- `01 · Desktop`
- `Poster-grid shell · 920px · five pages`
- the artboard label row such as `Shows`
- canvas grid background

That is not useful for pixel-perfect comparison against the React/Storybook implementation because the target screenshot should start directly at the app’s rendered content — the white `ppxis` navigation bar at y=0.

---

## Why the initial approach failed

### 1. `DesignCanvas` is not page-scroll based

Reading `prototype-design/design-canvas.jsx` revealed the core architecture:

```jsx
function DCViewport({ children, minScale = 0.1, maxScale = 8, style = {} }) {
  const vpRef = React.useRef(null);
  const worldRef = React.useRef(null);
  const tf = React.useRef({ x: 0, y: 0, scale: 1 });

  const apply = React.useCallback(() => {
    const { x, y, scale } = tf.current;
    const el = worldRef.current;
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  return (
    <div
      ref={vpRef}
      className="design-canvas"
      style={{
        height: '100vh', width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        ...
      }}
    >
      <div ref={worldRef} style={{ position: 'absolute', top: 0, left: 0, ... }}>
        {children}
      </div>
    </div>
  );
}
```

There is no meaningful `document` scroll. `document.documentElement.scrollWidth` and `scrollHeight` match the viewport. The actual large canvas is a transformed child inside an `overflow: hidden` viewport.

That means:

```js
window.scrollTo(60, 182)
```

is the wrong tool. It cannot pan the canvas world. It does not reveal a different artboard. It does not reposition the content the way it would in a normal long page.

### 2. The artboard coordinates are world coordinates, not page scroll coordinates

The DOM did report locations such as:

```json
{ "x": 60, "y": 182, "w": 920, "h": 1460 }
```

for the desktop Shows artboard. But those coordinates are within the transformed DesignCanvas world, not the browser document scroll space.

A script that treats them as `window.scrollTo(x, y)` targets will appear to work superficially, because it emits PNGs, but it does not capture the intended portion of the world.

### 3. Focus mode is cleaner, but still not ideal

`DesignCanvas` has a focus mode (`DCFocusOverlay`) that can open one artboard in a modal overlay. Clicking `.dc-expand` on an artboard works and produces a centered preview. However, focus mode still includes extraction-unfriendly chrome:

- a dark overlay backdrop
- a top bar with the section title (`01 · Desktop`)
- a close button
- left/right navigation arrows
- pagination dots
- scaling to fit viewport rather than preserving the original artboard dimensions

So focus mode is useful for manual visual inspection, but not as the canonical pixel extraction route.

### 4. Cropping screenshots after the fact is brittle

We also tested cropping with ImageMagick:

```bash
convert input.png -crop +0+60 +repage output.png
```

This is brittle for two reasons:

1. It assumes the DesignCanvas chrome position and height are stable.
2. It still depends on the wrong input image region if the canvas was not actually panned.

Cropping can help remove browser or overlay chrome, but it should not be the primary mechanism for finding artboards.

---

## The better approach: direct render the prototype page

The prototype HTML is not just a static artboard. It loads the source functions we need:

```html
<script src="lib/tokens.js"></script>
<script src="lib/data.js"></script>
<script type="text/babel" src="lib/components.jsx"></script>
<script type="text/babel" src="design-canvas.jsx"></script>
<script type="text/babel" src="screens/ppxis.jsx"></script>
```

After Babel compiles, the browser has globals such as:

```js
window.React
window.ReactDOM
window.PPXDesktop
window.PPXMobile
```

Therefore, rather than screenshotting the DesignCanvas wrapper, we can render the component we care about directly:

```js
await page.evaluate(() => {
  document.body.innerHTML = '<div id="capture-root"></div>';
  document.body.style.margin = '0';
  document.body.style.background = '#fff';

  const root = document.getElementById('capture-root');
  root.style.width = '920px';
  root.style.minHeight = '1460px';
  root.style.background = '#fff';

  ReactDOM.createRoot(root).render(
    React.createElement(PPXDesktop, { page: 'shows' })
  );
});

await page.locator('#capture-root').screenshot({
  path: '../prototype-design/direct/home/desktop-shows-full.png',
});
```

This gives the exact page shell without the design-canvas scaffold.

### Validation result

The generated screenshot:

```text
prototype-design/direct/home/desktop-shows-full.png
```

was validated visually. It:

- starts at y=0 with the real `ppxis` header/navigation bar
- contains no `DesignCanvas` chrome
- contains no focus overlay chrome
- includes the full home page through the footer
- has a final element tree height of approximately `1800px`
- is suitable as the baseline reference for public Shows page work

---

## Why direct render is superior

### 1. It captures the product, not the design tooling

The original screenshot captured the prototype design board. The direct-render screenshot captures the prototype product page.

For pixel-perfect implementation work, we need:

```text
prototype page output ↔ Storybook component output
```

not:

```text
DesignCanvas workspace ↔ Storybook component output
```

### 2. It preserves actual DOM and CSS

Because the rendered page is live DOM, we can extract:

- HTML structure
- bounding rectangles
- computed styles
- typography
- spacing
- color values
- grid layout values
- sticky/fixed behavior

The new script already emits:

```text
prototype-design/direct/home/desktop-shows.html
prototype-design/direct/home/desktop-shows.inspect.json
```

The JSON contains a recursive tree like:

```json
{
  "tag": "header",
  "rect": { "x": 0, "y": 0, "width": 920, "height": 61 },
  "style": {
    "display": "block",
    "position": "sticky",
    "fontFamily": "Inter, sans-serif",
    "backgroundColor": "rgb(255, 255, 255)",
    "border": "0px none rgb(31, 30, 28)"
  },
  "children": [...]
}
```

That is much more useful for converting prototype pieces into Storybook-ready React components.

### 3. It makes component-level clips stable

Once `PPXDesktop(page="shows")` is direct-rendered, region screenshots become straightforward:

```js
await page.locator('header').screenshot({ path: 'header.png' });
await page.locator('nav').screenshot({ path: 'nav.png' });
await page.locator('main').screenshot({ path: 'main.png' });
await page.locator('footer').screenshot({ path: 'footer.png' });
```

No world coordinates. No pan transform. No chrome removal. No guessing.

---

## Current home-page extraction outputs

The direct-render prototype capture produced:

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

One selector failed in the first script run:

```text
main > div:nth-child(2) > div:first-child
```

This is expected early iteration noise. The script should stop relying on brittle `nth-child(...)` chains and instead use semantic or heuristic selectors:

- `header`
- `nav`
- `main`
- `footer`
- `h1`
- first large grid container by computed `display: grid`
- first poster card by bounding box size (`~269×441`) and/or text content (`Redroom Inferno`)

---

## Recommended reusable extraction tool design

The reusable tool should be called something like:

```text
extract-prototype-artboard.mjs
```

or generalized as:

```text
prototype-extract.mjs
```

### CLI proposal

```bash
node prototype-extract.mjs \
  --url http://localhost:7070/Pyxis%20Public%20Site.html \
  --component PPXDesktop \
  --props '{"page":"shows"}' \
  --width 920 \
  --out prototype-design/direct/home
```

For mobile:

```bash
node prototype-extract.mjs \
  --url http://localhost:7070/Pyxis%20Public%20Site.html \
  --component PPXMobile \
  --props '{"page":"shows"}' \
  --width 390 \
  --out prototype-design/direct/mobile-shows
```

### Outputs

Each run should emit:

```text
full.png                       # full root screenshot
root.html                      # raw DOM HTML of rendered prototype
inspect.json                   # recursive DOM tree with rects + computed styles
styles.css.json                # deduplicated CSS declaration inventory
regions/
  header.png
  nav.png
  main.png
  footer.png
  ...custom region clips
```

### Optional component-region config

A JSON config could map stable names to selectors:

```json
{
  "regions": {
    "header": "header",
    "nav": "nav",
    "heading": "main h1",
    "grid": "main [style*='grid']",
    "footer": "footer"
  }
}
```

For less semantic prototypes, include heuristics:

```json
{
  "regions": {
    "first-poster-card": {
      "textIncludes": "Redroom Inferno",
      "minWidth": 250,
      "minHeight": 300
    }
  }
}
```

### Computed style extraction

The tool should collect a style subset tuned for UI reconstruction:

```js
const interestingStyleProps = [
  'display', 'position', 'boxSizing',
  'width', 'height', 'minHeight', 'padding', 'margin',
  'gap', 'gridTemplateColumns', 'gridAutoRows', 'alignItems', 'justifyContent',
  'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing',
  'color', 'backgroundColor', 'border', 'borderRadius', 'boxShadow',
  'textTransform', 'textAlign', 'overflow', 'zIndex',
];
```

This helps map prototype output back into React components and CSS tokens.

### Style deduplication

The next iteration should deduplicate style declarations. For every element, generate a stable fingerprint of its computed style subset:

```js
const styleKey = JSON.stringify(styleObject(el));
```

Then emit:

```json
{
  "styleClasses": {
    "s001": { "display": "flex", "gap": "..." },
    "s002": { "fontFamily": "Fraunces, serif", "fontSize": "42px" }
  },
  "tree": {
    "tag": "h1",
    "styleClass": "s002",
    "text": "Upcoming shows"
  }
}
```

This makes the JSON smaller and helps humans see repeated UI patterns.

---

## Proposed extraction pipeline for pixel-perfect Storybook rebuild

### Step 1: Direct-render pages

For each public prototype route:

| Page | Component call | Width |
|---|---|---:|
| desktop shows | `PPXDesktop({ page: 'shows' })` | 920 |
| desktop detail | `PPXDesktop({ page: 'detail' })` | 920 |
| desktop archive | `PPXDesktop({ page: 'archive' })` | 920 |
| desktop book | `PPXDesktop({ page: 'book' })` | 920 |
| desktop about | `PPXDesktop({ page: 'about' })` | 920 |
| mobile shows | `PPXMobile({ page: 'shows' })` | 390 |
| mobile detail | `PPXMobile({ page: 'detail' })` | 390 |
| mobile archive | `PPXMobile({ page: 'archive' })` | 390 |
| mobile book | `PPXMobile({ page: 'book' })` | 390 |
| mobile about | `PPXMobile({ page: 'about' })` | 390 |

### Step 2: Export baseline PNGs

Use `#capture-root` element screenshots, not page clips.

### Step 3: Export DOM and computed style JSON

Save both:

- `root.html` for structural reference
- `inspect.json` for box metrics + computed styles

### Step 4: Generate Storybook comparison fixtures

Copy the PNGs into a stable baseline folder, e.g.

```text
web/packages/pyxis-components/.storybook/baselines/ppxis/desktop-shows.png
```

or keep them under `prototype-design/direct/` and reference them in docs/stories.

### Step 5: Build React component stories with the same width constraints

For example:

```tsx
export const PrototypeWidth = {
  render: () => (
    <div style={{ width: 920 }}>
      <ShowsPage />
    </div>
  ),
};
```

### Step 6: Compare visually

Short term:

- manual side-by-side screenshots
- `pixelmatch` script later

Long term:

- Playwright screenshot tests with baseline PNGs
- Storybook visual regression with Chromatic or local `pixelmatch`

---

## What to do next

1. Treat existing `prototype-design/01-*.png` and `prototype-design/comp/*.png` as suspect unless re-generated by a corrected method.
2. Use `prototype-design/direct/home/desktop-shows-full.png` as the first trustworthy home-page baseline.
3. Extend `capture-direct-render.mjs` from home-only to all public pages.
4. Replace brittle `nth-child` region selectors with semantic/heuristic region detection.
5. Add style deduplication to `desktop-shows.inspect.json` output.
6. Begin CSS repair by comparing:

```text
prototype-design/direct/home/desktop-shows-full.png
```

against the current `pyxis-user-site` Shows route at the same `920px` width.

---

## Review-critical lessons

- Do not use `window.scrollTo` on `DesignCanvas` pages. It is a transform-driven pan/zoom canvas, not a scroll page.
- Do not trust screenshots only because their dimensions are correct.
- The first visible pixels matter. If y=0 is `01 · Desktop`, the screenshot is the design board, not the product.
- Direct render is the canonical extraction strategy when prototype components are available as browser globals.
- Element screenshots (`locator(...).screenshot`) are much safer than viewport screenshots with manual clips.
- Always export HTML and computed styles alongside PNGs; screenshots alone are insufficient for pixel-perfect React/Storybook reconstruction.
