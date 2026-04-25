---
Title: HTML Prototype Baseline Extraction Playbook
Ticket: PYXIS-STORYBOOK-CATALOG
Status: active
Topics:
    - frontend
    - storybook
    - css-visual-diff
    - prototype
    - visual-regression
DocType: playbook
Intent: implementation-guide
Owners: []
RelatedFiles:
    - Path: prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html
      Note: Full App prototype entrypoint; Foundations/SystemPage only for this catalog
    - Path: prototype-design/-deprecated/screenshots-and-imports/Pyxis Public Site.html
      Note: Primary public prototype HTML baseline entrypoint
    - Path: prototype-design/-deprecated/screenshots-and-imports/Pyxis Mobile.html
      Note: Primary mobile prototype HTML baseline entrypoint
    - Path: prototype-design/screens/ppxis.jsx
      Note: Public prototype globals and catalog fixture wrappers used by direct-react-global
    - Path: prototype-design/screens/mobile.jsx
      Note: Mobile prototype globals exported for standalone mobile screen rendering
    - Path: prototype-design/standalone/foundations/system.html
      Note: Standalone Full App Foundations/SystemPage entrypoint
    - Path: prototype-design/standalone/public/shows.html
      Note: Standalone public Shows page entrypoint for direct baseline extraction
    - Path: prototype-design/standalone/mobile/home.html
      Note: Standalone mobile dashboard entrypoint for direct baseline extraction
    - Path: prototype-design/-deprecated/visual-diff-scripts/06-run-prototype-baseline-sample.sh
      Note: Sample-first validation runner referenced by the playbook
    - Path: prototype-design/-deprecated/visual-diff-scripts/08-run-prototype-public-component-sample.sh
      Note: Public component sample runner referenced by the playbook
    - Path: prototype-design/-deprecated/visual-diff-scripts/11-generate-prototype-baseline-configs.mjs
      Note: Generates the canonical prototype baseline configs
    - Path: prototype-design/-deprecated/visual-diff-scripts/14-generate-standalone-mobile-html.mjs
      Note: Regenerates standalone mobile screen HTML files
    - Path: prototype-design/-deprecated/visual-diff-native-configs/prototype-public-shows.css-visual-diff.yml
      Note: Page-level public Shows baseline config
    - Path: prototype-design/-deprecated/visual-diff-native-configs/public-components/show-tile-redroom.css-visual-diff.yml
      Note: Detailed component fixture baseline config example
ExternalSources: []
Summary: How to extract trusted PNG, CSS, prepared HTML, and inspect JSON baselines from prototype HTML files with css-visual-diff.
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: Use this before comparing Storybook implementation components to the prototype baseline.
WhenToUse: When adding or updating prototype baseline configs from Pyxis HTML prototype files.
---



# HTML Prototype Baseline Extraction Playbook

> [!warning] Deprecated workflow
> This playbook documents the historical prototype baseline extraction workflow. Its configs, generated outputs, old scripts, and imported HTML now live under `prototype-design/-deprecated/`. For active Pyxis public-page visual validation, use `prototype-design/visual-diff/userland/` and `*.visual.yml` specs.

This playbook explains how to extract a reliable visual/CSS baseline from a prototype `.html` file using `css-visual-diff`. It is written for the Pyxis catalog workflow, but the method applies to any React prototype HTML that exposes components through browser globals.

The central idea is simple:

> Do not screenshot the whole design canvas. Load the HTML, prepare the page into a clean render root, then extract targeted PNG/CSS/HTML/inspect artifacts from that root.

For Pyxis, the two important prototype files are:

```text
prototype-design/-deprecated/screenshots-and-imports/Pyxis Public Site.html
prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html
```

Their roles are different:

| File | Use for catalog? | Scope |
|---|---:|---|
| `Pyxis Public Site.html` | Yes | Public poster-grid site, pages, public-site parts |
| `Pyxis Full App.html` | Yes, limited | Foundations/SystemPage only |
| `Pyxis Mobile.html` | Yes | Mobile app screens |
| `Pyxis Full App.html` backend/staff screens | No for this ticket | Out of scope |

## 0. Canonical layout and helpful built-in docs

The current canonical repo-root layout is:

```text
prototype-design/visual-diff/
prototype-design/visual-diff/scripts/
prototype-design/-deprecated/generated-output/baseline/
prototype-design/standalone/
```

If you need a refresher on the `css-visual-diff` authoring/debugging loop, use the built-in help pages directly from the CLI:

```bash
css-visual-diff help inspect-workflow
css-visual-diff help story-config-authoring
```

Those two help pages are the fastest way to remember the correct order of operations:

```text
prepared HTML first
→ screenshot crop second
→ computed CSS third
→ full extraction/comparison last
```

Use this playbook for the Pyxis-specific repo layout and baseline conventions; use the built-in `help` topics for the low-level inspect/config-authoring loop.

## 1. What a baseline extraction should produce

For every baseline target, try to produce:

```text
screenshot.png
computed-css.md
computed-css.json
prepared.html
inspect.json
metadata.json
```

These files are generated by:

```bash
css-visual-diff inspect --config CONFIG.yml --side original --all-styles --out OUT_DIR
```

The most important artifacts are:

| Artifact | Purpose |
|---|---|
| `screenshot.png` | The visual baseline crop. Inspect this manually with the `read` image tool. |
| `computed-css.md` | Human-readable computed CSS values. Use this for repair work. |
| `computed-css.json` | Machine-readable computed CSS values. Useful for automation and diffing. |
| `prepared.html` | The DOM after prepare hooks. Use this to debug selectors. |
| `inspect.json` | Structured DOM/layout/style evidence. Useful for exact bounds and child structure. |
| `metadata.json` | Records selector, target URL, viewport, and run metadata. |

A baseline is not trusted until both the PNG and the CSS probe are credible.

## 2. Serve the prototype HTML

`css-visual-diff` loads browser URLs, so serve `prototype-design/` locally:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
python3 -m http.server 7070 --directory prototype-design
```

Check both prototype entrypoints:

```bash
curl -I 'http://localhost:7070/Pyxis%20Public%20Site.html'
curl -I 'http://localhost:7070/Pyxis%20Full%20App.html'
```

The canonical repo-root scripts start this server automatically if needed:

```bash
prototype-design/-deprecated/visual-diff-scripts/06-run-prototype-baseline-sample.sh
```

and:

```bash
prototype-design/-deprecated/visual-diff-scripts/08-run-prototype-public-component-sample.sh
```

## 3. Standalone HTML entrypoints

For convenience, the prototype now has clean standalone HTML pages that bypass `DesignCanvas` entirely:

```text
prototype-design/standalone/index.html
prototype-design/standalone/public/index.html
prototype-design/standalone/public/shows.html
prototype-design/standalone/public/detail.html
prototype-design/standalone/public/archive.html
prototype-design/standalone/public/book.html
prototype-design/standalone/public/about.html
prototype-design/standalone/public/shows-mobile.html
prototype-design/standalone/public/detail-mobile.html
prototype-design/standalone/public/archive-mobile.html
prototype-design/standalone/public/book-mobile.html
prototype-design/standalone/public/about-mobile.html
prototype-design/standalone/foundations/system.html
prototype-design/standalone/mobile/index.html
prototype-design/standalone/mobile/login.html
prototype-design/standalone/mobile/home.html
prototype-design/standalone/mobile/shows.html
prototype-design/standalone/mobile/show-detail.html
prototype-design/standalone/mobile/calendar.html
prototype-design/standalone/mobile/bookings.html
prototype-design/standalone/mobile/booking-review.html
prototype-design/standalone/mobile/artists.html
prototype-design/standalone/mobile/artist-detail.html
prototype-design/standalone/mobile/post-show.html
prototype-design/standalone/mobile/settings.html
```

Generate or refresh them with:

```bash
node prototype-design/-deprecated/visual-diff-scripts/14-generate-standalone-mobile-html.mjs
```

The public/foundations standalone generators still exist in the ticket workspace today, but the baseline/config workflow is now canonical under `prototype-design/`.

These pages still load the shared prototype scripts (`lib/tokens.js`, `lib/components.jsx`, `screens/ppxis.jsx`, or `screens/system.jsx`), but they render only one page/root. They are useful when you want a clean URL for capture without a `prepare` hook.

Example standalone capture URL:

```text
http://localhost:7070/standalone/public/shows.html
```

A direct HTML standalone page can be inspected with a simple config:

```yaml
original:
  url: "http://localhost:7070/standalone/public/shows.html"
  wait_ms: 1000
  viewport: { width: 1000, height: 1600 }
  root_selector: "#root"
```

Use standalone HTML when the full page is the target. Use `direct-react-global` fixture rendering when you need a smaller component baseline such as a poster, show tile, nav, or footer.

## 4. Never trust the DesignCanvas screenshot directly

Both Pyxis prototype HTML files render a design canvas with multiple artboards. For example, `Pyxis Public Site.html` contains desktop and mobile artboards. `Pyxis Full App.html` contains sections like Foundations, Entry, Program, Roster, and Operate.

Naively screenshotting the loaded page can capture:

- canvas chrome,
- artboard labels,
- transformed/panned content,
- clipped sections,
- wrong background,
- more than one artboard.

Instead, use `prepare.type: direct-react-global` or `prepare.type: script` to replace the page with a clean `#capture-root`.

## 4. Prefer direct React global rendering

If the prototype exposes a component on `window`, use:

```yaml
prepare:
  type: direct-react-global
  wait_for: "window.React && window.ReactDOM && window.PPXDesktop"
  component: PPXDesktop
  root_selector: "#capture-root"
  props: { page: "shows" }
  width: 920
  min_height: 1460
  background: "#FFFFFF"
  after_wait_ms: 500
```

This means:

1. Load the original HTML file.
2. Wait for React, ReactDOM, and the named component global.
3. Replace `document.body` with `#capture-root`.
4. Render the component into that root.
5. Screenshot and inspect selectors inside the clean root.

### Current useful globals

From `prototype-design/screens/ppxis.jsx`:

```text
PPXDesktop
PPXMobile
PPXShell
P_SHOWS
Poster
PPXNav
PPXFooter
ShowTile
PageHeader
PPXCatalogFrame
PPXCatalogPoster
PPXCatalogShowTile
PPXCatalogNav
PPXCatalogFooter
PPXCatalogPageHeader
PPXCatalogShowGrid
```

From `prototype-design/screens/system.jsx`:

```text
SystemPage
```

## 5. Page-level baseline example

Use page-level baselines to capture full public pages or major page regions.

Example source config:

```text
prototype-design/-deprecated/visual-diff-native-configs/prototype-public-shows.css-visual-diff.yml
```

It renders:

```js
PPXDesktop({ page: "shows" })
```

and probes:

- `full-page`
- `nav`
- `nav-wordmark`
- `nav-active-pill`
- `main`
- `page-header`
- `show-grid`
- `first-show-tile`
- `first-poster`
- `first-show-title`
- `first-ticket-pill`
- `footer`

Run all probes from the config:

```bash
css-visual-diff inspect \
  --config prototype-design/-deprecated/visual-diff-native-configs/prototype-public-shows.css-visual-diff.yml \
  --side original \
  --all-styles \
  --out /tmp/pyxis-public-shows-baseline
```

Then inspect a PNG:

```text
/tmp/pyxis-public-shows-baseline/first-show-tile/screenshot.png
```

Use the `read` image tool to inspect the PNG. Do not rely only on dimensions.

## 6. Foundations baseline example

`Pyxis Full App.html` should only contribute its Foundations/SystemPage section to this ticket.

Example config:

```text
prototype-design/-deprecated/visual-diff-native-configs/prototype-foundations-system.css-visual-diff.yml
```

It renders:

```js
SystemPage()
```

and probes foundations areas such as:

- full system page,
- color card,
- typography card,
- badges/tags card,
- buttons card,
- primary button,
- form fields card,
- stat tiles,
- icon grid,
- radii/elevation,
- navigation preview,
- log rows,
- empty state,
- principles.

Sample command:

```bash
css-visual-diff inspect \
  --config prototype-design/-deprecated/visual-diff-native-configs/prototype-foundations-system.css-visual-diff.yml \
  --side original \
  --all-styles \
  --out /tmp/pyxis-foundations-baseline
```

Inspect key PNGs:

```text
/tmp/pyxis-foundations-baseline/primary-button/screenshot.png
/tmp/pyxis-foundations-baseline/form-fields-card/screenshot.png
```

## 7. Component-level fixture baseline example

Prefer direct component fixture baselines for reusable public-site parts.

Example config:

```text
prototype-design/-deprecated/visual-diff-native-configs/public-components/show-tile-redroom.css-visual-diff.yml
```

It renders:

```js
PPXCatalogShowTile({ index: 0, compact: false, width: 270 })
```

and uses stable selectors:

```css
[data-catalog='show-tile'] > div
[data-catalog='show-tile'] > div > div:first-child
[data-catalog='show-tile'] > div > div:nth-child(2) > div:first-child
[data-catalog='show-tile'] > div button
```

Run it:

```bash
css-visual-diff inspect \
  --config prototype-design/-deprecated/visual-diff-native-configs/public-components/show-tile-redroom.css-visual-diff.yml \
  --side original \
  --all-styles \
  --out /tmp/show-tile-redroom-baseline
```

Inspect:

```text
/tmp/show-tile-redroom-baseline/show-tile/screenshot.png
/tmp/show-tile-redroom-baseline/ticket-pill/computed-css.md
```

## 8. YAML authoring pattern

A minimal prototype baseline config looks like this:

```yaml
metadata:
  slug: prototype-public-component-show-tile-redroom
  title: Prototype public component / ShowTile Redroom

original:
  name: prototype-public-component
  url: "http://localhost:7070/Pyxis%20Public%20Site.html"
  wait_ms: 0
  viewport: { width: 380, height: 620 }
  root_selector: "#capture-root"
  prepare:
    type: direct-react-global
    wait_for: "window.React && window.ReactDOM && window.PPXCatalogShowTile"
    component: PPXCatalogShowTile
    root_selector: "#capture-root"
    props: { index: 0, compact: false, width: 270 }
    width: 270
    background: "#FFFFFF"
    after_wait_ms: 250

react:
  name: prototype-public-component
  url: "http://localhost:7070/Pyxis%20Public%20Site.html"
  wait_ms: 0
  viewport: { width: 380, height: 620 }
  root_selector: "#capture-root"
  prepare:
    type: direct-react-global
    wait_for: "window.React && window.ReactDOM && window.PPXCatalogShowTile"
    component: PPXCatalogShowTile
    root_selector: "#capture-root"
    props: { index: 0, compact: false, width: 270 }
    width: 270
    background: "#FFFFFF"
    after_wait_ms: 250

styles:
  - name: show-tile
    selector: "[data-catalog='show-tile'] > div"
    include_bounds: true
    props: [display,width,height,margin,padding,font-family,font-size,color,background-color,border,border-radius,cursor]

output:
  dir: "/absolute/path/to/generated/artifacts"
  write_json: true
  write_markdown: true
  write_pngs: true
  write_prepared_html: true
  write_inspect_json: true
  validate_pngs: true

modes: [capture]
```

Important notes:

- `original` and `react` may be identical for extraction-only configs because the schema is still comparison-shaped.
- The extraction command uses `--side original`.
- Prefer `wait_ms: 0` plus explicit `prepare.wait_for`.
- Use `after_wait_ms` for a short post-render settle.
- Use absolute `output.dir` in committed configs to avoid ambiguity.

## 9. Sample-first loop

Never start with the full catalog after changing selectors or prepare hooks.

Use small scripts first:

```bash
scripts/06-run-prototype-baseline-sample.sh
prototype-design/-deprecated/visual-diff-scripts/08-run-prototype-public-component-sample.sh
```

The public component sample currently extracts:

- poster redroom,
- show tile redroom,
- nav desktop.

Only after those are visually correct should you expand the matrix.

## 10. Manual visual inspection

The user preference for this ticket is:

> Prefer the `read` image tool over `understand_image` for this workflow.

Use `read` on sample PNGs, for example:

```text
prototype-design/-deprecated/generated-output/baseline/sample-public-components/show-tile-redroom/show-tile/screenshot.png
```

Check:

- is the crop tight?
- is the expected component visible?
- does it include accidental whitespace?
- did it capture a wrapper instead of the component?
- is the background expected?
- are fonts visibly loaded?
- does the component match the prototype page rendering?

Only after this inspection should you trust the CSS values.

## 11. Debug prepared HTML before tuning screenshots

If a selector fails or a screenshot looks wrong, open the generated `prepared.html` first.

For example:

```text
/tmp/show-tile-redroom-baseline/show-tile/prepared.html
```

Search for:

```text
data-catalog="show-tile"
```

Then count the actual DOM depth before changing the selector.

A real issue encountered in this ticket:

Bad selector:

```css
[data-catalog='show-tile'] > div:nth-child(2) > div:first-child
```

Correct selector:

```css
[data-catalog='show-tile'] > div > div:nth-child(2) > div:first-child
```

The extra `> div` exists because `PPXCatalogShowTile` wraps the original `ShowTile` root.

## 12. Avoid long hangs while authoring

While authoring configs, wrap sample runs in `timeout`:

```bash
timeout 90s css-visual-diff inspect \
  --config CONFIG.yml \
  --side original \
  --all-styles \
  --out OUT_DIR
```

This is necessary because a missing selector can currently hang long enough to waste minutes. The sample runner already uses:

```bash
timeout 90s css-visual-diff inspect ...
```

If a timeout happens:

1. Do not keep retrying the full sample.
2. Run only the failing config.
3. Inspect partial `prepared.html` artifacts if any were written.
4. Fix one selector.
5. Rerun the failing config only.
6. Return to the sample runner once the targeted run succeeds.

## 13. Where to store configs and outputs

Prototype baseline configs now live here:

```text
prototype-design/visual-diff/
prototype-design/-deprecated/visual-diff-native-configs/public-components/
prototype-design/visual-diff/scripts/
```

Generated artifacts now live here:

```text
prototype-design/-deprecated/generated-output/baseline/artifacts/
prototype-design/-deprecated/generated-output/baseline/sample/
prototype-design/-deprecated/generated-output/baseline/sample-public-components/
prototype-design/-deprecated/generated-output/baseline/index.html
prototype-design/-deprecated/generated-output/baseline/manifest.json
```

Generated artifacts are ignored at the repo root via:

```text
.gitignore
```

with:

```text
prototype-design/-deprecated/generated-output/baseline/
```

Do commit:

- configs,
- scripts,
- playbooks,
- diary/changelog/tasks.

Do not commit:

- generated PNG bundles,
- generated `computed-css.json` bundles,
- generated sample outputs,
- local server logs.

## 14. How to add a new component baseline

Example: add a footer baseline.

### Step 1: Confirm there is a catalog wrapper

In `prototype-design/screens/ppxis.jsx`, confirm:

```js
PPXCatalogFooter
```

is exported to `window`.

### Step 2: Create a config

Create:

```text
prototype-design/-deprecated/visual-diff-native-configs/public-components/footer-desktop.css-visual-diff.yml
```

Use:

```yaml
prepare:
  type: direct-react-global
  wait_for: "window.React && window.ReactDOM && window.PPXCatalogFooter"
  component: PPXCatalogFooter
  props: { compact: false }
  width: 920
```

Use selectors:

```css
[data-catalog='footer']
[data-catalog='footer'] footer
[data-catalog='footer'] a:first-of-type
```

### Step 3: Run the single config

```bash
css-visual-diff inspect \
  --config prototype-design/-deprecated/visual-diff-native-configs/public-components/footer-desktop.css-visual-diff.yml \
  --side original \
  --all-styles \
  --out /tmp/footer-desktop-baseline
```

### Step 4: Inspect PNGs with `read`

Read:

```text
/tmp/footer-desktop-baseline/footer/screenshot.png
```

### Step 5: Add to the sample runner only if stable

Once correct, add it to:

```text
prototype-design/-deprecated/visual-diff-scripts/08-run-prototype-public-component-sample.sh
```

or create a full public component runner.

## 15. How to compare baseline to Storybook later

This playbook is about baseline extraction, but the end goal is comparison.

Once a prototype baseline fixture and Storybook fixture both exist, create a normal comparison config where:

```yaml
original:
  url: "http://localhost:7070/Pyxis%20Public%20Site.html"
  prepare:
    component: PPXCatalogShowTile

react:
  url: "http://localhost:6006/iframe.html?id=public-pubshowrow--default&viewMode=story"
```

Then run:

```bash
css-visual-diff run --config CONFIG.yml --modes capture,cssdiff,pixeldiff,html-report
```

Work atom/component-first before doing full-page repairs.

## 16. Checklist before committing a baseline config

Before committing a new baseline config, confirm:

- [ ] Prototype server runs and URL loads.
- [ ] `prepare.wait_for` names a real `window` global.
- [ ] `css-visual-diff inspect --all-styles` succeeds.
- [ ] Every style probe writes `screenshot.png` and `computed-css.md`.
- [ ] PNGs were visually inspected with `read`.
- [ ] `prepared.html` contains the intended catalog root.
- [ ] Selectors are as stable as possible.
- [ ] Generated artifacts are ignored, not committed.
- [ ] Diary and changelog mention the new baseline.

## 17. Current next baseline targets

Add configs for:

- `footer-desktop`
- `footer-mobile`
- `page-header-shows`
- `show-grid-desktop`
- `show-grid-mobile`
- `nav-mobile`
- all poster variants:
  - `poster-redroom`
  - `poster-808`
  - `poster-petals`
  - `poster-meetups`
  - `poster-basement`
  - `poster-orphx`
  - `poster-moor`
  - `poster-cygnus`
  - `poster-zola`
- all public pages:
  - shows desktop/mobile
  - detail desktop/mobile
  - archive desktop/mobile
  - book desktop/mobile
  - about desktop/mobile

## 18. Rule of thumb

A good prototype baseline config should let a future developer answer three questions quickly:

1. What exactly did the prototype render?
2. What did the browser compute for the relevant CSS properties?
3. Is the crop specific enough to compare against Storybook without noise?

If the answer to any of those is unclear, improve the config before using it for repair work.

## 15. Current catalog scale, speed, and failure behavior

As of the expanded catalog pass, the prototype baseline generator creates:

| Category | Count | Notes |
|---|---:|---|
| Foundations configs | 1 | `SystemPage`, card-level probes only |
| Public top-level page configs | 10 | 5 pages × desktop/mobile |
| Public component/widget configs | 18 | posters, show tiles, nav, footer, page header, show grids |
| Total prototype configs | 29 | generated by `scripts/11-generate-prototype-baseline-configs.mjs` |
| Total configured style probes | 165 | across all generated prototype configs |

The five top-level public pages are:

```text
shows
detail
archive
book
about
```

Each has a desktop and mobile config.

The widget/component baseline configs are:

```text
poster-redroom
poster-pixel808
poster-petals
poster-meetups
poster-basement
poster-orphx
poster-moor
poster-cygnus
poster-zola
show-tile-redroom
show-tile-compact
nav-desktop
nav-mobile
footer-desktop
footer-mobile
page-header-shows
show-grid-desktop
show-grid-mobile
```

### Was extraction faster after the fix?

Yes, in the important sense: bad selectors no longer burn the whole shell timeout.

Previously, a missing selector such as:

```css
#capture-root [data-part="badge"]:first-of-type
```

could reach `chromedp.Screenshot(selector)` and wait until the outer shell `timeout` killed the run. Now `css-visual-diff inspect` preflights selector existence for selector-backed artifact formats and returns immediately with an actionable error:

```text
style "first-show-tile" selector did not match: #root > div > main > :nth-child(2) > div:first-child
```

That makes authoring much faster because selector mistakes fail in seconds rather than minutes.

The successful expanded sample currently runs 16 representative configs and produced 106 screenshot bundles. That is still real browser work, so it is not instantaneous, but it is no longer dominated by silent missing-selector waits.

### Does `--all-styles` reload for every style?

No. Inside a single config, `css-visual-diff inspect --all-styles` loads and prepares the page once, then iterates the style probes on the same page.

However, the shell runners still execute one `css-visual-diff inspect` process per config. Therefore the expanded sample performs 16 config loads, and the full catalog performs 29 config loads.

### Why use card-level Foundations probes?

The prototype Foundations components in `prototype-design/lib/components.jsx` do not expose the React implementation's `data-part` attributes. Therefore selectors like this are invalid in the prototype:

```css
[data-part="badge"]
[data-part="tag"]
```

For Foundations, use stable card-level probes instead:

```text
badges-tags-card
buttons-card
form-fields-card
stats-card
icons-card
radii-elevation-card
navigation-card
log-rows-card
empty-state-card
principles
```

If we later want atom-level prototype Foundations probes, add explicit prototype selectors such as `data-proto-part`, but do not mix React implementation selector contracts into prototype baseline configs.

### Optimization ideas for later

The current workflow is good enough for reliable catalog generation, but it can be made faster:

1. **Preflight all selectors once per config before writing artifacts.** Today each artifact preflights its own selector. A config-level preflight could fail all bad selectors up front and print a compact table.
2. **Add a CSS-only fast path.** Many probes only need computed CSS, not PNG + HTML + inspect JSON. A runner mode could first collect CSS quickly, then screenshot only selected targets.
3. **Avoid writing full `prepared.html` for every style.** For large catalogs, one root prepared HTML plus per-style metadata may be enough. Per-style prepared HTML is useful while authoring but expensive and repetitive.
4. **Parallelize configs.** Configs are independent. A future runner could run 4–6 configs concurrently, with care not to overload Chrome.
5. **Reuse one browser process across configs.** The Go CLI currently creates a browser per inspect invocation. A batch mode could reuse one browser and open pages per config.
6. **Reduce full-page screenshot dimensions where possible.** Tall mobile/page screenshots are expensive. Keep viewports/min-height as tight as trustworthy.
7. **Use stable fixture globals for component-sized targets.** Direct component fixtures are faster and less brittle than full-page crops.

