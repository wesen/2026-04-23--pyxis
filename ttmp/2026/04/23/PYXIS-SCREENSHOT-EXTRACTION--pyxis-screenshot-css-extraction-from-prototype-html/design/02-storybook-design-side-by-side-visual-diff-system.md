---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/README.md
      Note: High-level css-visual-diff goals and current shape
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/cmd/css-visual-diff/main.go
      Note: CLI command wiring and run/compare commands
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/config/config.go
      Note: YAML config model for original/react targets
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/driver/chrome.go
      Note: chromedp browser abstraction for screenshots/evaluate
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/capture.go
      Note: Multi-section original/react capture mode
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/compare.go
      Note: Single-element screenshot/CSS/pixel diff pipeline
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/cssdiff.go
      Note: Computed CSS diff extraction
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/matched_styles.go
      Note: CDP matched-style/cascade inspection
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/pixeldiff.go
      Note: Pixel diff artifacts and changed-percent reports
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/stories.go
      Note: Storybook index.json discovery
    - Path: ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
      Note: Pyxis direct-render original baseline extractor
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Design: Storybook + Original Prototype Side-by-Side Pixel-Perfect Workflow

## 1. Executive summary

We want a tool-assisted workflow for porting an original design/prototype into a React + Storybook component system until the port is visually pixel-perfect. The desired loop is:

1. Extract a clean baseline from the original prototype.
2. Render the corresponding React/Storybook implementation.
3. Capture the same component or page region on both sides.
4. Compare screenshots, DOM structure, box metrics, computed CSS, and matched CSS cascade rules.
5. Use those artifacts to decide exactly what to change in React/CSS.
6. Repeat until visual drift is acceptably low.

There are two existing bodies of work:

- **Pyxis direct-render prototype extraction** in this ticket.
- **`css-visual-diff`** under `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff`.

They overlap but solve different parts of the problem.

The Pyxis extraction work solved the hard problem of getting **clean original-design baselines** out of a `DesignCanvas`-wrapped prototype HTML. It discovered that screenshots taken through the design canvas were invalid because the canvas is transform/pan based, not document-scroll based. The successful approach was to bypass `DesignCanvas` and directly render `PPXDesktop({ page: "shows" })` into a clean `#capture-root`, producing PNG, HTML, and computed-style JSON.

The `css-visual-diff` tool solves the next-stage comparison problem. It compares two browser targets with selectors, captures element screenshots, extracts computed styles, reads matched/cascade CSS rules through Chrome DevTools Protocol, generates pixel diffs, and can produce an AI/agent review.

The recommended system combines them:

```text
Original prototype extraction             Visual comparison engine
---------------------------------         -----------------------------------
Pyxis direct-render exporter        --->  css-visual-diff compare/run modes
(clean PNG + HTML + inspect JSON)         (screenshots + CSS + pixel diff)
```

For a polished workflow, we should generalize the Pyxis direct-render exporter into a reusable **prototype adapter** and wire it into `css-visual-diff` as either:

- a pre-step that produces reference HTML pages/assets; or
- a first-class `target.prepare` hook that mutates the browser page before capture.

The final product should allow an intern to run one command like:

```bash
prototype-visual-workbench run pyxis-shows.yaml
```

and receive:

```text
out/pyxis-shows/
  original/
    full.png
    header.png
    nav.png
    html.html
    inspect.json
  storybook/
    full.png
    header.png
    nav.png
    html.html
    inspect.json
  diff/
    header-comparison.png
    header-diff-only.png
    full-comparison.png
    full-diff-only.png
  reports/
    summary.md
    cssdiff.md
    matched-styles.md
    agent-brief.md
```

---

## 2. Vocabulary and mental model

Before reading code, understand these terms.

### Original design

The source of truth we are porting from. For Pyxis, this is:

```text
prototype-design/Pyxis Public Site.html
```

It is not plain static HTML. It is a React+Babel prototype that loads:

```text
prototype-design/lib/tokens.js
prototype-design/lib/data.js
prototype-design/lib/components.jsx
prototype-design/design-canvas.jsx
prototype-design/screens/ppxis.jsx
```

After the browser loads and Babel compiles those files, the page exposes functions such as:

```js
window.PPXDesktop
window.PPXMobile
```

Those functions can render public-site pages.

### DesignCanvas

`DesignCanvas` is the visual board wrapper used by the prototype. It arranges multiple artboards in a Figma-like pan/zoom viewport.

Important file:

```text
prototype-design/design-canvas.jsx
```

Important detail: `DesignCanvas` is **not** a document-scroll page. It creates a viewport with:

```jsx
style={{
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  position: 'relative',
}}
```

and moves its inner world using:

```js
el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
```

Therefore this does **not** work reliably:

```js
window.scrollTo(60, 182)
```

The browser document is not the scroll surface. The canvas has its own internal transform state.

### Direct render

The successful extraction strategy.

Instead of screenshotting the DesignCanvas board, we load the prototype HTML just long enough to obtain `PPXDesktop`/`PPXMobile`, then clear the DOM and render the target page directly:

```js
document.body.innerHTML = '<div id="capture-root"></div>';
ReactDOM.createRoot(document.getElementById('capture-root')).render(
  React.createElement(PPXDesktop, { page: 'shows' })
);
```

Now the screenshot starts at y=0 with the actual website UI.

Important script:

```text
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

### Storybook target

The React port we want to match. It should render in Storybook in a stable, deterministic viewport.

For Pyxis, the Storybook package is:

```text
web/packages/pyxis-components/
```

and the user-site package is:

```text
web/packages/pyxis-user-site/
```

A Storybook comparison target is typically a URL like:

```text
http://localhost:6006/iframe.html?id=public-pubnav--default
```

or a page-level story such as:

```text
http://localhost:6006/iframe.html?id=pages-shows--prototype-width
```

### Visual diff

A pixel-level comparison of two screenshots. Useful for detecting layout drift but not always enough to explain why drift exists.

### Computed CSS diff

A comparison of `getComputedStyle(element)` values across original and React. Useful for direct CSS diagnosis:

- wrong `font-size`
- wrong `padding`
- wrong `grid-template-columns`
- wrong `border-radius`
- wrong `line-height`

### Matched styles / cascade inspection

A deeper CSS explanation using Chrome DevTools Protocol to inspect which CSS rules matched an element and which rule won a property. This answers:

> “Which selector is currently controlling `font-size`, and how does that differ between original and React?”

`css-visual-diff` already supports this via `internal/cssvisualdiff/modes/matched_styles.go`.

---

## 3. Existing system A: Pyxis direct-render extraction

### 3.1 Purpose

The Pyxis direct-render script extracts the original prototype in a way that is suitable for Storybook reconstruction.

It emits:

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

### 3.2 Why this was necessary

The first screenshots were wrong. They had plausible dimensions but started with design-board chrome:

```text
01 · Desktop
Poster-grid shell · 920px · five pages
Shows
```

A correct home-page baseline must start with:

```text
ppxis    Shows    Archive    Book us    About
```

The comparison sheet proves the difference:

```text
prototype-design/direct/review/home-old-vs-direct.png
```

### 3.3 How the script works

File:

```text
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

Key steps:

```js
const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 2200 } });

await page.goto(PROTO_URL);
await page.waitForFunction(
  () => window.React && window.ReactDOM && window.PPXDesktop && window.PPXMobile,
  null,
  { timeout: 30000 },
);

await page.evaluate(() => {
  document.body.innerHTML = '<div id="capture-root"></div>';
  const root = document.getElementById('capture-root');
  root.style.width = '920px';
  ReactDOM.createRoot(root).render(
    React.createElement(PPXDesktop, { page: 'shows' })
  );
});

await page.locator('#capture-root').screenshot({ path: 'desktop-shows-full.png' });
```

### 3.4 What it extracts besides PNGs

The script also exports HTML:

```js
const html = await page.locator('#capture-root').evaluate((el) => el.outerHTML);
writeFileSync(`${OUT_DIR}/desktop-shows.html`, html);
```

and a recursive inspection tree:

```js
function nodeToJSON(el) {
  const r = el.getBoundingClientRect();
  const children = Array.from(el.children).map(nodeToJSON);
  return {
    tag: el.tagName.toLowerCase(),
    text: children.length ? null : (el.textContent || '').trim(),
    rect: {
      x: Math.round(r.x),
      y: Math.round(r.y),
      width: Math.round(r.width),
      height: Math.round(r.height),
    },
    style: styleObject(el),
    children,
  };
}
```

This is crucial because PNG alone says *what* is different, but DOM + CSS inspection helps explain *why*.

### 3.5 Strengths

- Avoids DesignCanvas pan/zoom complexity.
- Captures the real prototype UI, not the design board.
- Gives full-page and region screenshots.
- Produces HTML and computed-style JSON.
- Easy to generalize to all `PPXDesktop`/`PPXMobile` pages.

### 3.6 Weaknesses

- Currently hard-coded to `PPXDesktop({ page: 'shows' })`.
- Region selectors are still ad hoc.
- It does not compare against Storybook yet.
- It does not generate pixel diff images.
- It does not inspect matched CSS cascade rules.
- It is JavaScript/Playwright while `css-visual-diff` is Go/chromedp, so integration needs a boundary decision.

---

## 4. Existing system B: `css-visual-diff`

Repository:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
```

### 4.1 Purpose

`css-visual-diff` is a Go CLI for comparing rendered HTML/CSS across two browser targets.

README summary:

```text
browser-driven capture via chromedp
element-level compare workflows
computed CSS diffs
matched-style / cascade inspection
pixel diff artifacts
```

This aligns strongly with the desired Storybook-porting workflow.

### 4.2 Repository shape

Important files:

```text
README.md
AGENT.md
cmd/css-visual-diff/main.go
internal/cssvisualdiff/config/config.go
internal/cssvisualdiff/driver/chrome.go
internal/cssvisualdiff/modes/capture.go
internal/cssvisualdiff/modes/compare.go
internal/cssvisualdiff/modes/cssdiff.go
internal/cssvisualdiff/modes/matched_styles.go
internal/cssvisualdiff/modes/pixeldiff.go
internal/cssvisualdiff/modes/stories.go
internal/cssvisualdiff/services/agent_brief.go
legacy/python-prototype/README.md
```

### 4.3 CLI commands

`go run ./cmd/css-visual-diff --help` reports:

```text
css-visual-diff [command]

Available Commands:
  chromedp-probe
  compare
  llm-review
  run
  script
```

The two most relevant commands are:

#### `compare`

Single-element comparison:

```bash
GOWORK=off go run ./cmd/css-visual-diff compare \
  --url1 http://localhost:7070/original.html \
  --selector1 header \
  --url2 http://localhost:6006/iframe.html?id=pages-shows--prototype-width \
  --selector2 header \
  --viewport-w 920 \
  --viewport-h 1800 \
  --out ./out/header \
  --write-pngs \
  --write-json \
  --write-markdown
```

Flags include:

```text
--url1
--selector1
--url2
--selector2
--viewport-w
--viewport-h
--props
--attrs
--threshold
--out
--wait-ms1
--wait-ms2
```

#### `run`

YAML-config-driven multi-mode run:

```bash
GOWORK=off go run ./cmd/css-visual-diff run \
  --config pyxis-shows.yaml \
  --modes capture,cssdiff,matched-styles,pixeldiff
```

This is better for repeated Storybook design-porting work because a YAML config can define many sections and CSS style probes.

### 4.4 Config model

File:

```text
internal/cssvisualdiff/config/config.go
```

Core YAML structure:

```go
type Config struct {
  Metadata Metadata      `yaml:"metadata"`
  Original Target        `yaml:"original"`
  React    Target        `yaml:"react"`
  Sections []SectionSpec `yaml:"sections"`
  Styles   []StyleSpec   `yaml:"styles"`
  Output   OutputSpec    `yaml:"output"`
  Modes    []string      `yaml:"modes"`
}
```

Targets:

```go
type Target struct {
  Name     string   `yaml:"name"`
  URL      string   `yaml:"url"`
  WaitMS   int      `yaml:"wait_ms"`
  Viewport Viewport `yaml:"viewport"`
}
```

Sections are screenshot targets:

```go
type SectionSpec struct {
  Name             string `yaml:"name"`
  Selector         string `yaml:"selector"`
  SelectorOriginal string `yaml:"selector_original"`
  SelectorReact    string `yaml:"selector_react"`
  OCRQuestion      string `yaml:"ocr_question"`
}
```

Styles are CSS probes:

```go
type StyleSpec struct {
  Name             string   `yaml:"name"`
  Selector         string   `yaml:"selector"`
  SelectorOriginal string   `yaml:"selector_original"`
  SelectorReact    string   `yaml:"selector_react"`
  Props            []string `yaml:"props"`
  IncludeBounds    bool     `yaml:"include_bounds"`
  Attributes       []string `yaml:"attributes"`
  Report           []string `yaml:"report"`
}
```

This maps almost perfectly to our desired workflow:

- `sections` = screenshot targets for comparison.
- `styles` = CSS facts we need to diagnose differences.
- `original` = direct-render prototype URL.
- `react` = Storybook iframe URL.

### 4.5 Browser driver

File:

```text
internal/cssvisualdiff/driver/chrome.go
```

Uses `chromedp`:

```go
func (p *Page) SetViewport(width, height int) error {
  return chromedp.Run(p.ctx,
    emulation.SetDeviceMetricsOverride(int64(width), int64(height), 1, false),
  )
}

func (p *Page) FullScreenshot(path string) error {
  var buf []byte
  err := chromedp.Run(p.ctx, chromedp.FullScreenshot(&buf, 90))
  return os.WriteFile(path, buf, 0o644)
}

func (p *Page) Screenshot(selector, path string) error {
  var buf []byte
  err := chromedp.Run(p.ctx, chromedp.Screenshot(selector, &buf, chromedp.ByQuery))
  return os.WriteFile(path, buf, 0o644)
}
```

This is a solid foundation for Storybook comparison.

### 4.6 Capture mode

File:

```text
internal/cssvisualdiff/modes/capture.go
```

Capture mode:

1. opens original page
2. opens React page
3. captures full screenshots
4. captures section screenshots by selector
5. writes `capture.json` and `capture.md`
6. computes coverage summary

Important code:

```go
for _, section := range sections {
  selector := section.Selector
  if selector == "" {
    if prefix == "original" { selector = section.SelectorOriginal }
    if prefix == "react" { selector = section.SelectorReact }
  }

  check := domCheck{}
  evaluateDOMCheck(page, selector, &check)

  if check.Exists {
    screenshotPath := filepath.Join(outDir, fmt.Sprintf("%s-%s.png", prefix, section.Name))
    page.Screenshot(selector, screenshotPath)
  }
}
```

This already handles the reality that original prototype selectors and React Storybook selectors may differ.

### 4.7 Compare mode

File:

```text
internal/cssvisualdiff/modes/compare.go
```

`compare` is the one-shot version of the workflow. It produces:

- URL1 full screenshot
- URL2 full screenshot
- URL1 element screenshot
- URL2 element screenshot
- computed CSS snapshot
- matched CSS snapshot
- pixel diff image
- markdown report
- JSON report

Important result type:

```go
type CompareResult struct {
  Inputs CompareInputs `json:"inputs"`
  URL1 CompareSideResult `json:"url1"`
  URL2 CompareSideResult `json:"url2"`
  ComputedDiffs []StyleDiff  `json:"computed_diffs"`
  WinnerDiffs   []WinnerDiff `json:"winner_diffs"`
  PixelDiff PixelDiffStats `json:"pixel_diff"`
}
```

This is very close to what an intern needs when fixing a component.

### 4.8 CSS diff mode

File:

```text
internal/cssvisualdiff/modes/cssdiff.go
```

This mode extracts `getComputedStyle` values for configured props:

```go
const props = [...]
const el = document.querySelector(selector)
const style = window.getComputedStyle(el)
computed[p] = style.getPropertyValue(p) || style[p] || ""
```

It can also capture:

- bounds (`getBoundingClientRect`)
- attributes (`id`, `class`, etc.)

This overlaps with Pyxis `desktop-shows.inspect.json`, but in a narrower, targeted way.

### 4.9 Matched styles mode

File:

```text
internal/cssvisualdiff/modes/matched_styles.go
```

This mode uses Chrome DevTools Protocol CSS APIs:

```go
css.GetMatchedStylesForNode(nodeID)
css.GetComputedStyleForNode(nodeID)
```

It captures:

- matched rules
- selectors
- origins (`inline`, `author`, `user-agent`)
- specificity
- properties
- winning rule diffs

This is not present in the Pyxis direct-render script and should be reused rather than reinvented.

### 4.10 Pixel diff mode

File:

```text
internal/cssvisualdiff/modes/pixeldiff.go
```

This reads screenshots from `capture.json`, pads images to the same size, computes changed pixel percentage, and writes:

```text
pixeldiff_<section>_diff_only.png
pixeldiff_<section>_diff_comparison.png
pixeldiff.json
pixeldiff.md
```

This is exactly what we need after generating original and Storybook screenshots.

### 4.11 Storybook discovery

File:

```text
internal/cssvisualdiff/modes/stories.go
```

This mode fetches:

```text
/index.json
```

from a Storybook URL and emits discovered story IDs/titles/names.

This is useful for building a UX where the tool can say:

> “Here are all stories available; choose the one matching the original artboard.”

or automatically map a component inventory to stories by naming convention.

---

## 5. Overlap between Pyxis extraction and `css-visual-diff`

### 5.1 Shared goals

Both systems want:

- browser-rendered screenshots
- stable selectors / regions
- computed CSS data
- layout/bounding-box data
- artifacts that help humans fix CSS
- eventual pixel-perfect matching

### 5.2 Shared artifacts

| Artifact | Pyxis direct-render | css-visual-diff |
|---|---|---|
| Full screenshot | yes | yes |
| Element/region screenshot | yes | yes |
| HTML snapshot | yes | partial (`element_html` in legacy; not prominent in current Go compare) |
| Computed style JSON | yes, recursive tree | yes, targeted props |
| Bounds | yes, recursive tree | yes, optional per style spec |
| Pixel diff | no | yes |
| Matched CSS rules | no | yes |
| Storybook discovery | no | yes |
| AI/agent review | no | yes |

### 5.3 Shared implementation patterns

Both use real browser rendering:

- Pyxis script: Playwright/Chromium.
- css-visual-diff: chromedp/Chromium.

Both rely on selectors for meaningful regions:

```js
page.locator('header').screenshot(...)
```

or:

```yaml
sections:
  - name: header
    selector_original: header
    selector_react: '[data-part="header"]'
```

Both need stable viewport widths:

- Original desktop Pyxis width: `920px`.
- Mobile Pyxis width: `390px`.
- Storybook stories should be rendered in matching container widths.

---

## 6. Differences between Pyxis extraction and `css-visual-diff`

### 6.1 Pyxis extraction is source-preparation; css-visual-diff is comparison

Pyxis direct-render answers:

> “How do I get a clean original design baseline out of this weird prototype HTML?”

`css-visual-diff` answers:

> “Given two clean browser targets, how do I compare them?”

This is the most important distinction.

### 6.2 Pyxis extraction understands prototype globals

`capture-direct-render.mjs` knows this Pyxis-specific fact:

```js
window.PPXDesktop
window.PPXMobile
```

`css-visual-diff` currently treats both sides as ordinary URLs and selectors. It does not know how to prepare a prototype by clearing the DOM and directly rendering a component.

### 6.3 css-visual-diff has stronger diff/report machinery

Pyxis extraction does not yet include:

- side-by-side diff images
- changed pixel percentages
- cascade rule winners
- Storybook story discovery
- agent briefs
- multi-section YAML runs

`css-visual-diff` already has those pieces.

### 6.4 css-visual-diff currently lacks a “prepare page” hook

To compare Pyxis correctly, the original side cannot just be:

```text
http://localhost:7070/Pyxis%20Public%20Site.html
```

because that renders DesignCanvas, not the product page.

We need either:

1. Pre-generate clean original HTML files via direct render and point `css-visual-diff` to them; or
2. Extend `css-visual-diff` config with a `prepare_script` hook that runs before capture.

### 6.5 Pyxis extraction emits recursive DOM tree; css-visual-diff emits targeted snapshots

`desktop-shows.inspect.json` is a full recursive tree:

```json
{
  "tag": "div",
  "rect": { "x": 0, "y": 0, "width": 920, "height": 1800 },
  "style": { ... },
  "children": [...]
}
```

`css-visual-diff` emits per-selector style snapshots:

```json
{
  "name": "header",
  "original": {
    "computed": {
      "font-size": "16px",
      "padding": "..."
    },
    "bounds": { ... }
  },
  "react": { ... },
  "diffs": [...]
}
```

Both are useful. The full tree helps initial reconstruction; targeted snapshots help iteration after components exist.

---

## 7. The desired combined tool

### 7.1 Name ideas

Possible names:

- `storybook-visual-workbench`
- `prototype-port-lab`
- `pixel-port`
- `design-port-diff`
- `storybook-pixelmatch`

For now this document calls it:

```text
Design Port Workbench
```

### 7.2 Core promise

The tool should let a developer run:

```bash
design-port-workbench run pyxis-public-shows.yaml
```

and then open a report that shows:

```text
Original prototype             React Storybook
------------------             ---------------
header.png             <-->    header.png
nav.png                <-->    nav.png
shows-grid.png         <-->    shows-grid.png
footer.png             <-->    footer.png

pixel diff: 12.4%
computed CSS drift:
  header.height: original 61px, react 72px
  h1.font-size: original 42px, react 36px
  grid.gap: original 24px, react 16px
matched CSS:
  h1 font-size winner changed from inline style to .pyxis-heading
```

### 7.3 High-level architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Config YAML                              │
│                                                                 │
│ original: prototype html + adapter                              │
│ storybook: iframe URL / story ID                                │
│ regions: header, nav, grid, footer                              │
│ styles: props to compare                                        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Capture Orchestrator                          │
│                                                                 │
│ 1. Start browser(s)                                             │
│ 2. Prepare original target                                      │
│ 3. Prepare Storybook target                                     │
│ 4. Capture screenshots + DOM/CSS                                │
└──────────────┬──────────────────────────────────┬───────────────┘
               │                                  │
               ▼                                  ▼
┌─────────────────────────────┐      ┌────────────────────────────┐
│ Original Adapter             │      │ Storybook Adapter           │
│                             │      │                            │
│ - load prototype HTML        │      │ - load iframe.html          │
│ - wait for globals           │      │ - wait for Storybook render │
│ - direct render component    │      │ - set viewport/container    │
│ - expose #capture-root       │      │ - expose #storybook-root    │
└──────────────┬──────────────┘      └─────────────┬──────────────┘
               │                                   │
               ▼                                   ▼
┌─────────────────────────────┐      ┌────────────────────────────┐
│ Original Artifacts           │      │ Storybook Artifacts         │
│                             │      │                            │
│ full.png                     │      │ full.png                    │
│ regions/*.png                │      │ regions/*.png               │
│ html.html                    │      │ html.html                   │
│ inspect.json                 │      │ inspect.json                │
└──────────────┬──────────────┘      └─────────────┬──────────────┘
               │                                   │
               └──────────────┬────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Diff Engine                              │
│                                                                 │
│ - pixel diff                                                     │
│ - computed style diff                                            │
│ - matched cascade diff                                           │
│ - report generation                                              │
│ - optional LLM/agent review                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Data flow

```text
Prototype HTML ──┐
                 │ direct render adapter
                 ▼
          original clean DOM ── screenshots/html/styles ──┐
                                                           │
Storybook iframe ───────── render story ─ screenshots/html/styles ──► diff/report
```

---

## 8. Proposed YAML config

A future config should combine `css-visual-diff`’s existing model with a preparation hook.

Example:

```yaml
metadata:
  slug: pyxis-public-shows
  title: Pyxis public Shows page
  description: Compare original PPXDesktop shows page to Storybook React port
  goal: Make React/Storybook version pixel-perfect against prototype baseline

original:
  name: prototype-direct
  url: http://localhost:7070/Pyxis%20Public%20Site.html
  viewport:
    width: 1200
    height: 2200
  wait_ms: 1000
  prepare:
    type: direct-react-global
    root_selector: "#capture-root"
    component: PPXDesktop
    props:
      page: shows
    width: 920

react:
  name: storybook
  url: http://localhost:6006/iframe.html?id=pages-shows--prototype-width
  viewport:
    width: 1200
    height: 2200
  wait_ms: 1000
  root_selector: "#storybook-root"

sections:
  - name: full
    selector_original: "#capture-root"
    selector_react: "#storybook-root [data-page='shows']"

  - name: header
    selector_original: "header"
    selector_react: "header"

  - name: nav
    selector_original: "nav"
    selector_react: "nav"

  - name: heading
    selector_original: "main h1"
    selector_react: "main h1"

  - name: shows-grid
    selector_original: "main [data-region='shows-grid']"
    selector_react: "[data-region='shows-grid']"

  - name: footer
    selector_original: "footer"
    selector_react: "footer"

styles:
  - name: header
    selector_original: "header"
    selector_react: "header"
    include_bounds: true
    props:
      - height
      - padding
      - background-color
      - border-bottom-color
      - position

  - name: h1
    selector_original: "main h1"
    selector_react: "main h1"
    include_bounds: true
    props:
      - font-family
      - font-size
      - font-weight
      - line-height
      - letter-spacing
      - margin
      - color

  - name: shows-grid
    selector_original: "main [data-region='shows-grid']"
    selector_react: "[data-region='shows-grid']"
    include_bounds: true
    props:
      - display
      - grid-template-columns
      - gap
      - margin
      - padding

output:
  dir: ./out/pyxis-public-shows
  write_json: true
  write_markdown: true
  write_pngs: true

modes:
  - capture
  - cssdiff
  - matched-styles
  - pixeldiff
```

### Why `prepare` matters

Without `prepare`, `original.url` renders the DesignCanvas board. With `prepare`, the original page becomes a clean direct render.

Pseudocode:

```go
func prepareTarget(page *driver.Page, target Target) error {
  switch target.Prepare.Type {
  case "none":
    return nil
  case "direct-react-global":
    return page.Evaluate(renderGlobalComponentScript(target.Prepare), nil)
  case "script":
    return page.Evaluate(target.Prepare.Script, nil)
  default:
    return fmt.Errorf("unknown prepare type")
  }
}
```

---

## 9. Implementation guide for a new intern

This section explains the parts of the system you need to understand before implementing the combined workflow.

### 9.1 Start with the problem, not the tool

We are not trying to take screenshots for their own sake. We are trying to answer:

> “What exact changes do I make to my React/Storybook component so it matches the original design?”

Therefore every artifact should support one of these jobs:

| Job | Artifact |
|---|---|
| See the visual drift | side-by-side screenshot, diff image |
| Locate the changed region | region screenshots |
| Understand layout drift | bounding boxes, dimensions, grid/flex values |
| Understand typography drift | computed font family, size, weight, line-height |
| Understand color drift | computed color/background/border values |
| Understand cascade source | matched styles and winning selectors |
| Rebuild component structure | extracted HTML tree |

### 9.2 The original side must be clean first

Before comparing to Storybook, validate the original capture by looking at the first pixels.

Correct:

```text
ppxis | Shows | Archive | Book us | About
```

Incorrect:

```text
01 · Desktop
Poster-grid shell · 920px · five pages
```

If the screenshot starts with `01 · Desktop`, you captured the design board, not the website.

### 9.3 Run the direct-render script

Start the prototype server:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design
python3 -m http.server 7070
```

In another shell:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
node ../ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

Inspect:

```text
prototype-design/direct/home/desktop-shows-full.png
```

Expected:

- image starts with real page header at y=0
- no gray DesignCanvas background
- no section label
- full footer visible

### 9.4 Start Storybook

For the React side:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components storybook
```

Open:

```text
http://localhost:6006
```

For stable automated capture, use Storybook iframe URLs:

```text
http://localhost:6006/iframe.html?id=<story-id>
```

The iframe URL avoids the Storybook manager UI. You only get the rendered story canvas.

### 9.5 Create a prototype-width story

A pixel comparison is only meaningful if both sides use the same width.

For the home page, original width is `920px`.

Story example:

```tsx
export const PrototypeWidth = {
  render: () => (
    <div style={{ width: 920, background: '#fff' }} data-page="shows">
      <ShowsPage />
    </div>
  ),
};
```

Do not compare a full responsive browser layout at `1440px` against a fixed `920px` prototype artboard. That will produce meaningless diffs.

### 9.6 Use `css-visual-diff compare` for one region

Example, after direct-render original is available as a clean local page or after adding a prepare hook:

```bash
GOWORK=off go run ./cmd/css-visual-diff compare \
  --url1 http://localhost:7070/direct-home.html \
  --selector1 header \
  --url2 'http://localhost:6006/iframe.html?id=pages-shows--prototype-width' \
  --selector2 header \
  --viewport-w 1200 \
  --viewport-h 2200 \
  --props 'height,padding,background-color,border-bottom-color,font-family,font-size,color' \
  --threshold 30 \
  --out ./out/pyxis-header
```

This should emit:

```text
out/pyxis-header/url1_screenshot.png
out/pyxis-header/url2_screenshot.png
out/pyxis-header/diff_comparison.png
out/pyxis-header/diff_only.png
out/pyxis-header/compare.json
out/pyxis-header/compare.md
```

### 9.7 Use YAML for repeated full-page work

Once selectors are stable, prefer config-driven runs:

```bash
GOWORK=off go run ./cmd/css-visual-diff run \
  --config pyxis-public-shows.yaml \
  --modes capture,cssdiff,matched-styles,pixeldiff
```

This lets you compare many regions at once.

### 9.8 Fix CSS iteratively

The loop should be:

```text
1. Run compare.
2. Open diff_comparison.png.
3. Read compare.md / cssdiff.md.
4. Adjust React CSS.
5. Re-run compare.
6. Repeat.
```

Do not try to fix everything from the full-page diff first. Start with stable regions:

1. header
2. nav
3. heading block
4. first show card
5. shows grid
6. footer

Full-page diff becomes useful after the major regions are close.

---

## 10. Proposed technical implementation plan

### Phase 1: Make direct-render extraction generic

Current script is hard-coded:

```js
React.createElement(PPXDesktop, { page: 'shows' })
```

Turn it into CLI arguments:

```bash
node prototype-direct-render.mjs \
  --url http://localhost:7070/Pyxis%20Public%20Site.html \
  --component PPXDesktop \
  --props '{"page":"shows"}' \
  --width 920 \
  --out ../prototype-design/direct/desktop-shows
```

Pseudocode:

```js
const args = parseArgs(process.argv);
await page.goto(args.url);
await page.waitForFunction((name) => Boolean(window[name]), args.component);
await page.evaluate(({ component, props, width }) => {
  document.body.innerHTML = '<div id="capture-root"></div>';
  const root = document.getElementById('capture-root');
  root.style.width = `${width}px`;
  ReactDOM.createRoot(root).render(
    React.createElement(window[component], props)
  );
}, args);
await page.locator('#capture-root').screenshot({ path: `${args.out}/full.png` });
```

### Phase 2: Export clean original HTML fixtures

`css-visual-diff` works best with URLs. So direct-render should optionally save a self-contained fixture HTML file:

```text
prototype-design/direct/home/fixture.html
```

That file should contain:

- the extracted root HTML
- required styles
- inline CSS variables or copied style tags
- no DesignCanvas scripts

Then `css-visual-diff` can compare:

```text
url1 = http://localhost:7070/direct/home/fixture.html
url2 = http://localhost:6006/iframe.html?id=pages-shows--prototype-width
```

### Phase 3: Add `prepare` hook to css-visual-diff

Longer-term, avoid pre-generated fixture HTML by adding a prepare hook.

Config addition:

```go
type Target struct {
  Name     string   `yaml:"name"`
  URL      string   `yaml:"url"`
  WaitMS   int      `yaml:"wait_ms"`
  Viewport Viewport `yaml:"viewport"`
  Prepare  *PrepareSpec `yaml:"prepare"`
}

type PrepareSpec struct {
  Type         string         `yaml:"type"`
  Component    string         `yaml:"component"`
  Props        map[string]any `yaml:"props"`
  RootSelector string         `yaml:"root_selector"`
  Width        int            `yaml:"width"`
  Script       string         `yaml:"script"`
}
```

Driver hook:

```go
func captureTarget(browser *driver.Browser, target config.Target, ...) {
  page.Goto(target.URL)
  if target.WaitMS > 0 { page.Wait(...) }
  prepareTarget(page, target.Prepare)
  // now screenshot selectors
}
```

Direct React-global prepare script:

```js
(() => {
  document.body.innerHTML = '<div id="capture-root"></div>';
  const root = document.getElementById('capture-root');
  root.style.width = '920px';
  root.style.background = '#fff';
  ReactDOM.createRoot(root).render(
    React.createElement(window.PPXDesktop, { page: 'shows' })
  );
})()
```

### Phase 4: Add recursive inspect mode to css-visual-diff

Current `cssdiff` is targeted. Add a mode:

```text
inspect-tree
```

Output:

```text
original-inspect.json
react-inspect.json
inspect-diff.json
```

Pseudocode:

```go
func RunInspectTree(ctx context.Context, cfg *config.Config) error {
  for each target:
    page.goto(target.url)
    prepareTarget(page, target.prepare)
    tree := evaluateRecursiveDOMTree(page, rootSelector)
    writeJSON(targetName + "-inspect.json", tree)
}
```

JavaScript evaluator:

```js
function nodeToJSON(el) {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    tag: el.tagName.toLowerCase(),
    text: el.children.length ? null : el.textContent.trim(),
    rect: { x: r.x, y: r.y, width: r.width, height: r.height },
    style: pickComputedProps(cs),
    children: [...el.children].map(nodeToJSON),
  };
}
```

### Phase 5: Build side-by-side HTML report

Markdown reports are useful, but for pixel-perfect work we want an HTML workbench:

```text
out/pyxis-shows/report.html
```

Features:

- left original screenshot
- right Storybook screenshot
- diff overlay
- CSS diff table
- click a region to see computed and matched styles
- copy suggested CSS values

Simplified layout:

```html
<div class="workbench">
  <aside class="regions">
    <button>header</button>
    <button>nav</button>
    <button>shows-grid</button>
  </aside>
  <main>
    <section class="comparison">
      <img src="original-header.png">
      <img src="react-header.png">
      <img src="diff-header.png">
    </section>
    <section class="css-diff">
      <table>...</table>
    </section>
  </main>
</div>
```

### Phase 6: Add Storybook story discovery/mapping

`css-visual-diff` already has `StoryDiscovery`:

```go
/index.json
```

Use it to discover stories and map them to prototype pages.

Mapping config:

```yaml
storybook:
  url: http://localhost:6006
  mappings:
    pyxis-public-shows: pages-shows--prototype-width
    pyxis-header: public-pubnav--default
```

---

## 11. Recommended local workflow for Pyxis now

### 11.1 Generate original home baseline

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design
python3 -m http.server 7070
```

In another shell:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
node ../ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

Check:

```text
prototype-design/direct/home/desktop-shows-full.png
```

### 11.2 Start Storybook

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components storybook
```

### 11.3 Create a page-level story if missing

We need a Storybook story that renders the current Shows page at width 920.

If no story exists, add one like:

```tsx
// packages/pyxis-components/stories/Pages/ShowsPage.stories.tsx
import { ShowsPage } from '...';

export default {
  title: 'Pages/Public/ShowsPage',
};

export const PrototypeWidth = {
  render: () => (
    <div style={{ width: 920, background: '#fff' }} data-page="shows">
      <ShowsPage />
    </div>
  ),
};
```

### 11.4 Run css-visual-diff compare on header first

Once the original fixture and Storybook story are both URL-addressable:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
GOWORK=off go run ./cmd/css-visual-diff compare \
  --url1 http://localhost:7070/direct/home/fixture.html \
  --selector1 header \
  --url2 'http://localhost:6006/iframe.html?id=pages-public-showspage--prototype-width' \
  --selector2 header \
  --viewport-w 1200 \
  --viewport-h 2200 \
  --props 'height,padding,background-color,border-bottom-color,font-family,font-size,color' \
  --out /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/diff/home/header
```

### 11.5 Fix one region at a time

Start with:

1. `header`
2. `nav`
3. `main h1`
4. `shows-grid`
5. `first show card`
6. `footer`

For each region:

- inspect `diff_comparison.png`
- inspect `compare.md`
- adjust React CSS
- rerun

---

## 12. API references and file references

### Pyxis files

```text
prototype-design/Pyxis Public Site.html
```

Prototype entrypoint. Loads React, Babel, tokens, data, components, DesignCanvas, and `screens/ppxis.jsx`.

```text
prototype-design/design-canvas.jsx
```

Explains why native page scrolling failed. Uses transform-based pan/zoom.

```text
prototype-design/screens/ppxis.jsx
```

Defines `PPXDesktop` / `PPXMobile` public-site prototype renderers.

```text
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

Current working direct-render extraction script.

```text
prototype-design/direct/home/desktop-shows-full.png
```

Validated clean home-page screenshot baseline.

```text
prototype-design/direct/home/desktop-shows.inspect.json
```

Recursive DOM/style/box inspection output.

### css-visual-diff files

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/README.md
```

High-level overview.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/cmd/css-visual-diff/main.go
```

CLI entrypoint and command wiring.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/config/config.go
```

YAML config structs and validation.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/driver/chrome.go
```

Chromedp browser abstraction.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/capture.go
```

Multi-section screenshot capture.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/compare.go
```

Single-element compare pipeline.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/cssdiff.go
```

Computed CSS diff.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/matched_styles.go
```

Chrome DevTools matched-style/cascade extraction.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/pixeldiff.go
```

Pixel diff and side-by-side diff image generation.

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/stories.go
```

Storybook `index.json` discovery.

---

## 13. Key design decisions

### Decision 1: Do not screenshot DesignCanvas directly

DesignCanvas is a useful viewing environment but a bad extraction source. Use direct render.

### Decision 2: Use Storybook iframe URLs for React side

Storybook manager UI adds chrome. Compare against `iframe.html` URLs.

### Decision 3: Normalize widths

Original and Storybook must render at the same content width:

- desktop Pyxis: `920px`
- mobile Pyxis: `390px`

### Decision 4: Combine full-tree inspection and targeted diffs

Use full-tree inspection during initial porting; use targeted diffs during iteration.

### Decision 5: Prefer semantic selectors and data attributes

The React port should expose stable comparison hooks:

```tsx
<header data-region="site-header">
<nav data-region="site-nav">
<main data-page="shows">
<section data-region="shows-grid">
<footer data-region="site-footer">
```

This avoids brittle selectors like:

```css
main > div:nth-child(2) > div:first-child
```

---

## 14. Risks and pitfalls

### Pitfall: correct dimensions do not imply correct capture

The bad screenshot was `920×1460`, but it still started with DesignCanvas chrome and missed the footer.

Always visually inspect y=0.

### Pitfall: full-page screenshots can include tool UI

Storybook manager and DesignCanvas are both wrappers. Use clean roots:

- Original: direct render into `#capture-root`.
- React: Storybook `iframe.html`.

### Pitfall: CSS diff without layout context is incomplete

A property diff may say `gap` differs, but the screenshot shows whether that matters. Always use both.

### Pitfall: pixel diff alone can be noisy

Text antialiasing and font loading can create small pixel differences. Normalize:

- same browser
- same DPR
- same viewport
- same font availability
- same waits

### Pitfall: selectors drift during refactors

Use `data-region` / `data-part` selectors as a stable comparison API.

---

## 15. Recommended next implementation steps

### Immediate Pyxis steps

1. Generalize `capture-direct-render.mjs` to all pages.
2. Add clean direct-render outputs for:
   - desktop detail
   - desktop archive
   - desktop book
   - desktop about
   - mobile shows/detail/archive/book/about
3. Add page-level Storybook stories at prototype widths.
4. Add stable `data-region` attributes to React components/pages.
5. Run `css-visual-diff compare` for `header` and `nav` first.

### css-visual-diff integration steps

1. Add `PrepareSpec` to `config.Target`.
2. Add `prepareTarget(page, target)` call after navigation and wait.
3. Implement `direct-react-global` prepare mode.
4. Add `inspect-tree` mode or import Pyxis inspect logic.
5. Add HTML report generation.
6. Add docs/examples for Storybook comparison.

### Long-term workbench steps

1. Storybook story discovery + mapping UI.
2. Watch mode:
   - when CSS file changes, rerun selected region compare.
3. Optional browser UI with synchronized side-by-side panes.
4. Optional AI reviewer that receives:
   - original screenshot
   - React screenshot
   - diff image
   - computed CSS diffs
   - matched-style winner diffs

---

## 16. Suggested intern task list

### Task 1: Verify current direct-render baseline

- Open `prototype-design/direct/home/desktop-shows-full.png`.
- Confirm it starts with `ppxis` header.
- Confirm footer is visible.

### Task 2: Add direct render for all pages

Modify `capture-direct-render.mjs` to loop over:

```js
const jobs = [
  { component: 'PPXDesktop', props: { page: 'shows' }, width: 920, out: 'desktop-shows' },
  { component: 'PPXDesktop', props: { page: 'detail' }, width: 920, out: 'desktop-detail' },
  { component: 'PPXDesktop', props: { page: 'archive' }, width: 920, out: 'desktop-archive' },
  { component: 'PPXDesktop', props: { page: 'book' }, width: 920, out: 'desktop-book' },
  { component: 'PPXDesktop', props: { page: 'about' }, width: 920, out: 'desktop-about' },
  { component: 'PPXMobile', props: { page: 'shows' }, width: 390, out: 'mobile-shows' },
];
```

### Task 3: Add stable React comparison selectors

In React components, add:

```tsx
<header data-region="site-header">
<nav data-region="site-nav">
<section data-region="shows-grid">
<footer data-region="site-footer">
```

### Task 4: Create Storybook page stories

Add stories that render full pages at exact prototype widths.

### Task 5: Run first css-visual-diff compare

Start with `header`.

### Task 6: Document each mismatch

For every mismatch, write:

```text
Region: header
Observed: React header is 72px tall; original is 61px.
Evidence: cssdiff height, diff image.
Fix: adjust padding/height in PubNav.css.
Validation: rerun compare; changed % reduced from X to Y.
```

---

## 17. Conclusion

The Pyxis direct-render extraction and `css-visual-diff` are complementary.

- Pyxis direct-render extraction solves **clean original baseline generation**.
- `css-visual-diff` solves **comparison, diagnosis, and reporting**.

The combined workflow is the right path for Storybook pixel-perfect porting:

```text
Direct-render original prototype
        ↓
Render Storybook story at matching width
        ↓
Capture same regions on both sides
        ↓
Pixel diff + computed CSS diff + matched cascade diff
        ↓
Fix React/CSS
        ↓
Repeat
```

The next engineering step is to generalize the direct-render script and either feed its outputs into `css-visual-diff` or add a `prepare` hook so `css-visual-diff` can direct-render prototype components itself.
