---
Title: Pyxis CSS Visual Diff Userland - Architecture and Internals
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
  - css-visual-diff
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
  - Path: prototype-design/visual-diff/userland/lib/index.js
    Note: Module exports index
  - Path: prototype-design/visual-diff/userland/lib/compare-region.js
    Note: Main comparison logic
  - Path: prototype-design/visual-diff/userland/lib/registry.js
    Note: Target registry and spec loading
  - Path: prototype-design/visual-diff/userland/verbs/pyxis-pages.js
    Note: Registered css-visual-diff verbs
  - Path: prototype-design/visual-diff/userland/lib/inspect.js
    Note: Element inspection for debugging
  - Path: prototype-design/visual-diff/userland/lib/policies.js
    Note: Policy classification and CI gate
  - Path: prototype-design/visual-diff/userland/lib/snapshot.js
    Note: Semantic snapshot and diff
  - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
    Note: Canonical public-pages spec
  - Path: prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
    Note: App pages spec (extensible)
ExternalSources: []
Summary: Deep dive into the Pyxis css-visual-diff userland architecture, explaining how the spec system, registry, comparison library, verbs, and policies work together. Includes extension patterns and examples.
LastUpdated: 2026-04-27T00:00:00-04:00
WhatFor: Understand and extend the Pyxis visual comparison workflow for new components, pages, and pages.
WhenToUse: When adding new visual diff targets, extending verbs, or modifying policy bands.
---

# Pyxis CSS Visual Diff Userland - Architecture and Internals

This document is a detailed reference for the Pyxis `css-visual-diff` JavaScript userland. It explains the architecture, module responsibilities, data flows, verb system, policy bands, and patterns for extension.

---

## 1. Architecture Overview

The userland is a **three-layer system** that bridges visual suite specs (YAML) to css-visual-diff CLI verbs:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SPEC LAYER     YAML visual suite specs                                   │
│                 public-pages.desktop.visual.yml                          │
│                 app.pages.desktop.visual.yml                              │
│                 app.components.visual.yml                                │
│                          ↓ targetsFromSpec()                             │
├──────────────────────────────────────────────────────────────────────────┤
│  REGISTRY LAYER  In-memory target registry                               │
│                  registry.js (targetsFromSpec, listTargets, findPage)  │
│                  Serves as the queryable source of truth during runtime │
├──────────────────────────────────────────────────────────────────────────┤
│  LIBRARY LAYER   Reusable JS modules                                     │
│                  compare-region.js  (cvd.compare.region wrapper)       │
│                  inspect.js       (element inspection)                   │
│                  snapshot.js      (semantic snapshots + diffs)           │
│                  policies.js      (CI classification + gating)         │
│                  styles.js       (CSS property presets)                  │
│                  normalizers.js  (value normalization for diffs)        │
│                  tolerances.js   (bounds + style tolerance comparison)   │
│                          ↑ called by                                     │
├──────────────────────────────────────────────────────────────────────────┤
│  VERB LAYER      css-visual-diff registered verbs                        │
│                  pyxis-pages.js  (listTargets, compareSection, etc.)   │
│                          ↑ invoked by                                     │
├──────────────────────────────────────────────────────────────────────────┤
│  CSS-VISUAL-DIFF CORE   Go binary with JavaScript scripting support     │
│                         cvd.browser(), cvd.compare.region(), etc.       │
└──────────────────────────────────────────────────────────────────────────┘
```

The separation of concerns matters:

- **Spec** = static configuration (YAML, reviewed, committed)
- **Registry** = runtime lookup (from YAML mirror)
- **Library** = pure functions, testable without a browser
- **Verb** = CLI entrypoint, orchestrates library calls
- **Core** = cross-platform Go binary, wraps Playwright

---

## 2. Module Map

### `lib/index.js` — Module Exports

All library modules are re-exported from a single entry point:

```javascript
module.exports = {
  slug: require('./slug.js'),
  storybook: require('./storybook.js'),
  artifacts: require('./artifacts.js'),
  registry: require('./registry.js'),
  policies: require('./policies.js'),
  markdown: require('./markdown.js'),
  styles: require('./styles.js'),
  inspect: require('./inspect.js'),
  compareRegion: require('./compare-region.js'),
  normalizers: require('./normalizers.js'),
  tolerances: require('./tolerances.js'),
  snapshot: require('./snapshot.js'),
}
```

Verbs `require('../lib/index.js')` and access modules as `lib.compareRegion`, `lib.inspect`, etc.

### `lib/registry.js` — Target Registry

The registry is the central lookup for all comparison targets.

**Key responsibilities:**
1. Load specs (YAML mirrors as CommonJS)
2. Build target records with resolved URLs
3. Filter targets by page/variant/priority
4. Flatten targets → sections for listing

**Default spec:**
```javascript
var defaultSpec = require('../specs/public-pages.desktop.visual.js')
```

⚠️ **Critical invariant:** The default spec is always `public-pages.desktop.visual.js`. The app specs (`app.*.visual.yml`) are **not** loaded by default. They are only loaded when explicitly passed via `compareSpec`.

**Key functions:**

| Function | Returns | Notes |
|---|---|---|
| `targetsFromSpec(spec)` | `Target[]` | Converts YAML spec → target records with resolved URLs |
| `defaultTargets()` | `Target[]` | Uses `defaultSpec` |
| `listTargets(filters)` | `Target[]` | Filtered by page/variant/priority |
| `findPage(page, variant)` | `Target` | First match or null |
| `findSection(page, section, variant)` | `Section` | Looks up section within a target |
| `flattenTargets(filters)` | `FlatRow[]` | One row per section for listing |

**Target record shape:**
```javascript
{
  page: string,           // e.g. "dashboard"
  variant: string,        // e.g. "desktop"
  priority: string,       // e.g. "tune-first"
  prototypeUrl: string,   // e.g. "http://localhost:7070/standalone/full-app/dashboard.html"
  storyId: string,        // e.g. "pyxis-app-components-shell-appshell--top-bar-dashboard"
  storybookUrl: string,   // Resolved iframe URL
  viewport: { width, height },
  waitMs: number,
  sections: Section[],
  baselineDiffs: { [sectionName]: number },
  acceptedDifferences: { [sectionName]: string[] },
}
```

**Section record shape:**
```javascript
{
  name: string,           // e.g. "topbar"
  original: string,       // Prototype CSS selector
  react: string,          // Storybook selector
  acceptedDifferences: string[],
}
```

### `lib/compare-region.js` — Comparison Engine

The comparison engine orchestrates browser pages and calls `cvd.compare.region`.

**Key exports:**

| Function | Purpose |
|---|---|
| `compareSection(page, section, options)` | Compare one section (uses registry lookup) |
| `compareTarget(target, options)` | Compare all sections of a pre-resolved target |
| `comparePage(page, options)` | Compare all sections of a page (uses registry) |
| `compareAll(options)` | Compare all pages (uses registry) |
| `compareSpec(spec, options)` | Compare from an explicit YAML spec |

**Comparison flow for `compareSection`:**

```
1. findTargetAndSection(pageName, sectionName, options)
   └─ registry.findPage() → throws "unknown page" if not found
   └─ registry.findSection() → throws if section not found

2. Open two browser pages:
   ├─ leftPage  = browser.page(prototypeUrl, { viewport, waitMs })
   └─ rightPage = browser.page(storybookUrl, { viewport, waitMs })

3. Wait for selectors:
   ├─ waitForLocator(leftPage, section.original)
   └─ waitForLocator(rightPage, section.react)

4. cvd.compare.region({
     name: page-section,
     left: leftPage.locator(section.original),
     right: rightPage.locator(section.react),
     threshold: 30,
     inspect: 'rich',
     outDir: outputPath,
     styleProps: [...],     // DEFAULT_STYLE_PROPS
     attributes: [...],     // DEFAULT_ATTRIBUTES
   })

5. Write artifacts:
   ├─ comparison.artifacts.write(outDir, ['json', 'markdown'])
   └─ ensureDocmgrMarkdown(markdownPath, title)

6. Return comparisonRow() with policy classification
```

**Default style properties captured:**
```javascript
var DEFAULT_STYLE_PROPS = [
  'font-family', 'font-size', 'font-weight', 'line-height',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-radius', 'color', 'background-color', 'box-shadow',
]
```

**Default attributes captured:**
```javascript
var DEFAULT_ATTRIBUTES = [
  'id', 'class', 'data-page', 'data-section',
  'data-pyxis-component', 'data-pyxis-part',
]
```

**Catalog support in `compareTarget`:**
When comparing multiple sections, `compareTarget` creates a `cvd.catalog` that aggregates artifacts and writes an index. This is used by `comparePage` and `compareAll`.

**Output artifacts per comparison:**
```
compare.json          — Full JSON result from cvd.compare.region
compare.md           — Markdown summary
left_region.png      — Screenshot of left selector region
right_region.png     — Screenshot of right selector region
diff_comparison.png — Side-by-side diff
diff_only.png        — Diff pixels only (changed regions)
```

### `lib/inspect.js` — Element Inspection

Inspects selectors on prototype and/or Storybook without comparing. Used for debugging and pre-flight checks.

**Key function:**
```javascript
async function inspectSection(page, section, options)
```

**Options:**
```javascript
{
  variant: 'desktop',           // Required: variant
  side: 'both',                 // 'both' | 'original' | 'react'
  stylePreset: 'pageShell',     // CSS property preset
  failOnMissing: false,         // Throw on missing/hidden selector
}
```

**Style presets (from `lib/styles.js`):**
```javascript
var presets = {
  typography:  ['font-family', 'font-size', 'font-weight', ...],
  layout:      ['display', 'position', 'width', 'height', ...],
  surface:     ['background-color', 'border-color', 'border-radius', ...],
  spacing:     ['margin-top', 'margin-right', ...],
  pageShell:   ['box-sizing', 'width', 'height', 'padding', ...],
}
```

**Returns per side:**
```javascript
{
  exists: boolean,
  visible: boolean,
  bounds: { x, y, width, height },
  textStart: string,           // Truncated to 180 chars
  styles: { [prop]: value },
  attributes: { [attr]: value },
  error: string,
}
```

### `lib/snapshot.js` — Semantic Snapshots

Creates portable JSON snapshots of page sections that can be diffed later.

**Key functions:**

| Function | Purpose |
|---|---|
| `snapshotSection(page, section, options)` | Capture both-sides snapshot |
| `diffSnapshots(beforePath, afterPath, options)` | Compare two snapshot files |

**Snapshot output shape:**
```javascript
{
  page: string,
  section: string,
  variant: string,
  stylePreset: string,
  original: { styles: {...}, bounds: {...}, textStart: string, ... },
  react: { styles: {...}, bounds: {...}, textStart: string, ... },
  diff: {
    changed: boolean,
    bounds: { changed, diffs: [...], byField: {...} },
    styles: { changed, count, diffs: [...] },
    text: { changed, original, react },
  },
}
```

The diff uses `tolerances.js` for numeric comparisons with configurable tolerance per field.

### `lib/policies.js` — CI Policy Bands

Classifies comparison results and gates CI pipelines.

**Classification bands:**
```javascript
var POLICY_ORDER = ['accepted', 'review', 'tune-required', 'major-mismatch', 'unknown']

function classifyChangedPercent(percent) {
  if (n <= 1)    return 'accepted'
  if (n <= 10)   return 'review'
  if (n <= 25)   return 'tune-required'
  return 'major-mismatch'
}
```

**CI gate function:**
```javascript
passesPolicy(rows, {
  maxChangedPercent: 10,       // Hard pixel threshold
  maxPolicyBand: 'review',    // Worst allowed band
})
// Returns { ok: boolean, failures: [...], maxChangedPercent, worstClassification }
```

When `--mode ci` is set and `!policy.ok`, `compare-all` throws an error.

**Key idea:** The policy band is a semantic layer over raw pixel percentages. A section can be "review" (10% diff) but still pass if the text matches and styles are explained by known accepted differences.

### `lib/normalizers.js` — Value Normalization

Normalizes CSS values before comparison to reduce false positives from:

- `0px` vs `0` (unit normalization)
- `rgba()` vs `#rrggbb` (color normalization)
- `"font name"` vs `font name` (quote stripping)
- `#rgb` vs `#rrggbb` (short hex expansion)

**Key function:**
```javascript
normalizeStyleMap(styles, options) → { [prop]: normalizedValue }
```

### `lib/tolerances.js` — Tolerance Comparisons

Compares numeric values (bounds, styles) with configurable tolerance.

**Key functions:**

| Function | Returns |
|---|---|
| `compareBounds(left, right, tolerances)` | `{ changed, diffs[], byField{} }` |
| `compareStyleMaps(left, right)` | `{ changed, count, diffs[] }` |

**Bounds tolerance example:**
```javascript
compareBounds(
  { x: 0, y: 0, width: 1020, height: 111 },
  { x: 2, y: 0, width: 1020, height: 113 },
  { y: 1, height: 2 }  // Allow 1px Y offset, 2px height diff
)
// Result: changed=false (both within tolerance)
```

### `lib/artifacts.js` — Output Path Helpers

Generates consistent output directory paths.

```javascript
artifactDir(baseOut, ...parts)     // e.g. artifactDir('out', 'archive', 'content')
pageSectionOutDir(baseOut, page, section, variant)
```

### `lib/markdown.js` — Report Rendering

Renders structured markdown summaries.

Key exports:
- `renderPixelDiffTable(rows)` — Markdown table with classification
- `renderCompareAllSummary(suite)` — Full suite summary with policy status

---

## 3. Verb System

### `verbs/pyxis-pages.js` — Registered Verbs

The verb file uses `__package__` and `__verb__` metadata to register commands with `css-visual-diff`.

**Metadata format:**
```javascript
__package__({
  name: 'pages',
  parents: ['pyxis'],
  short: 'Pyxis public page css-visual-diff userland commands',
})

__verb__('verbName', {
  parents: ['pyxis', 'pages'],
  short: 'One-line description',
  output: 'structured',      // or 'none', 'discard'
  fields: {
    arg1: { argument: true, required: true, help: 'Description' },
    arg2: { type: 'string', default: 'desktop', help: 'Description' },
    flag: { type: 'bool', default: false, help: 'Description' },
    values: { bind: 'all' },  // Captures all remaining fields
  },
})
async function verbName(arg1, arg2, values) {
  return lib.module.function(...)
}
```

**Available verbs:**

| Verb | Parents | Purpose |
|---|---|---|
| `listTargets` | pyxis, pages | List all registered targets |
| `inspectSection` | pyxis, pages | Inspect selectors on both sides |
| `compareSection` | pyxis, pages | Compare one section |
| `comparePage` | pyxis, pages | Compare all sections of one page |
| `compareAll` | pyxis, pages | Compare all pages |
| `inspectSpec` | pyxis, pages | Inspect targets from a YAML spec |
| `compareSpec` | pyxis, pages | Run comparison from a YAML spec |
| `snapshotSection` | pyxis, pages | Semantic snapshot one section |
| `diffSnapshots` | pyxis, pages | Diff two snapshot files |

**Invocation pattern:**
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-section archive content \
  --variant desktop \
  --outDir /tmp/compare \
  --output json
```

### Adding a New Verb

1. Add the function to `verbs/pyxis-pages.js`:
```javascript
async function inspectComponent(component, values) {
  return await lib.inspect.inspectComponent(component, {
    variant: values.variant || 'component',
    props: lib.styles.propsForPreset(values.stylePreset || 'surface'),
  })
}

__verb__('inspectComponent', {
  parents: ['pyxis', 'pages'],
  short: 'Inspect a registered component on prototype and/or Storybook side',
  output: 'structured',
  fields: {
    component: { argument: true, required: true, help: 'Registered component slug' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'component' },
    stylePreset: { type: 'choice', choices: ['typography', 'layout', 'surface', 'spacing', 'pageShell'], default: 'surface' },
    side: { type: 'choice', choices: ['both', 'original', 'react'], default: 'both' },
  },
})
```

2. If the verb needs a new library function, add it to `lib/` and export from `lib/index.js`.

---

## 4. Spec System

### Spec File Structure

```yaml
schemaVersion: pyxis.visual-suite.v1
name: app-components
defaults:
  prototypeBase: http://localhost:7070
  storybookBase: http://localhost:6008   # Note: app uses 6008, public uses 6007
  viewport:
    width: 520
    height: 420
  waitMs: 1000
  threshold: 30
  inspect: rich
  variant: component
policy:
  bands:
    - name: accepted
      maxChangedPercent: 0.5
    - name: review
      maxChangedPercent: 10
    - name: tune-required
      maxChangedPercent: 30
    - name: major-mismatch
      maxChangedPercent: 100
acceptedDifferences: {}    # Suite-level accepted diffs
targets:
  - page: metric-card
    variant: component
    priority: tune-first
    prototypePath: /standalone/full-app/dashboard.html
    storyId: pyxis-app-components-molecules-metriccard--metric-card-default
    sections:
      - name: component
        original: '[data-pyxis-component="metric-card"]'
        react: '[data-pyxis-component="metric-card"]'
  - page: dashboard
    variant: desktop
    priority: tune-first
    prototypePath: /standalone/full-app/dashboard.html
    storyId: pyxis-app-pages-pages--dashboard-desktop
    sections:
      - name: sidebar
        original: 'aside'
        react: '[data-section="app-sidebar"]'
      - name: topbar
        original: 'main > div:first-child'
        react: '[data-section="app-topbar"]'
```

### YAML to JS Mirror

YAML specs are mirrored to CommonJS for synchronous access in the Goja runtime:

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

The script reads each `*.visual.yml` and writes a corresponding `*.visual.js` that exports the parsed object.

**⚠️ Important:** Do not edit the `.js` mirror files by hand. They are regenerated from YAML.

### Default Spec Limitation

The registry's `defaultSpec` is hardcoded to `public-pages.desktop.visual.js`:
```javascript
var defaultSpec = require('../specs/public-pages.desktop.visual.js')
```

This means:
- `listTargets`, `findPage`, `findSection` all operate on public-pages by default
- App specs must be loaded explicitly via `compareSpec` or `inspectSpec`

**To change the default:** Modify `registry.js` to accept a spec parameter, or introduce a separate registry for app targets.

---

## 5. Extension Patterns

### Pattern A: Adding App Component Targets

1. Edit `specs/app.components.visual.yml`:
```yaml
- page: app-topbar
  variant: component
  priority: tune-first
  prototypePath: /standalone/full-app/dashboard.html
  storyId: pyxis-app-components-shell-appshell--top-bar-dashboard
  sections:
    - name: component
      original: 'main > div:first-child'
      react: '[data-section="app-topbar"]'
```

2. Regenerate the mirror:
```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

3. Run comparison via `compareSpec`:
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar \
  --outDir /tmp/app-topbar-compare \
  --output json
```

### Pattern B: Adding a New Verb

1. **Define the function** in `verbs/pyxis-pages.js`:
```javascript
async function compareComponent(component, values) {
  return await lib.compareRegion.compareSpecComponent(component, values)
}
```

2. **Register it** with `__verb__`:
```javascript
__verb__('compareComponent', {
  parents: ['pyxis', 'pages'],
  short: 'Compare one registered component',
  output: 'structured',
  fields: {
    component: { argument: true, required: true, help: 'Registered component slug' },
    values: { bind: 'all' },
    variant: { type: 'string', default: 'component' },
    outDir: { type: 'string', default: '' },
    threshold: { type: 'int', default: 30 },
  },
})
```

3. **Implement the library function** in `lib/compare-region.js`:
```javascript
async function compareSpecComponent(componentName, options) {
  var spec = require('../specs/app.components.visual.js')
  var targets = registry.targetsFromSpec(spec)
  var target = targets.find(t => t.page === componentName)
  if (!target) throw new Error('unknown component: ' + componentName)
  return await compareTarget(target, options)
}
```

### Pattern C: Adding Accepted Differences

Accepted differences document known, explainable visual gaps that should not count against the diff percentage.

1. **At the suite level** in the YAML spec:
```yaml
acceptedDifferences:
  topbar:
    - "Subtle color difference due to prototype using #1a1a18 vs React using #1f1e1c"
    - "font-size off by 1px due to prototype font rendering"
```

2. **At the section level** in a target:
```yaml
sections:
  - name: topbar
    original: 'main > div:first-child'
    react: '[data-section="app-topbar"]'
    acceptedDifferences:
      - "Text content matches exactly, pixel diff is from button border rendering"
```

Accepted differences are reported in the output but do **not** automatically change the pixel classification.

### Pattern D: Snapshot-Based Tuning

For iterative CSS tuning without full pixel comparisons:

1. **Capture baseline snapshot:**
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section dashboard topbar \
  --variant desktop \
  --outDir /tmp/before-tuning \
  --output json
```

2. **Make CSS changes**

3. **Capture after snapshot:**
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section dashboard topbar \
  --variant desktop \
  --outDir /tmp/after-tuning \
  --output json
```

4. **Diff the snapshots:**
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages diff-snapshots \
  /tmp/before-tuning/snapshot.json \
  /tmp/after-tuning/snapshot.json \
  --outDir /tmp/snapshot-diff \
  --output json
```

This is faster than full pixel diffs when you're iterating on CSS properties.

---

## 6. CSS Property Presets

The `lib/styles.js` presets control which CSS properties are captured during inspection and comparison:

```javascript
var presets = {
  typography: ['font-family', 'font-size', 'font-weight', 'line-height', ...],
  layout:     ['display', 'position', 'width', 'height', 'margin', ...],
  surface:    ['background-color', 'border-color', 'border-radius', 'box-shadow', ...],
  spacing:    ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', ...],
  pageShell:  ['box-sizing', 'width', 'height', 'padding', 'display', ...],
}
```

**Choosing a preset:**
- `pageShell` — Default. Good for layout containers.
- `typography` — Good for text-heavy components (headings, labels).
- `surface` — Good for buttons, badges, cards.
- `spacing` — Good for fine-tuning margins/padding.
- `layout` — Good for grid/flex containers.

Pass the preset name to verbs:
```bash
pyxis pages inspect-section dashboard topbar --stylePreset typography
```

---

## 7. Data Flow Diagrams

### Compare Section Flow

```
User command
    │
    ▼
pyxis-pages.js::compareSection(page, section, values)
    │
    ▼
registry.findPage(page, variant)
    │  (uses defaultSpec = public-pages.desktop.visual.js)
    │  ⚠️ For app targets, use compareSpec() instead
    ▼
registry.findSection(page, section, variant)
    │
    ▼
compare-region.js::compareSection(pageName, sectionName, options)
    │
    ├─► browser.page(prototypeUrl, {viewport, waitMs})
    │       └─► waitForLocator(leftPage, section.original)
    │
    ├─► browser.page(storybookUrl, {viewport, waitMs})
    │       └─► waitForLocator(rightPage, section.react)
    │
    ▼
cvd.compare.region({
  left: leftPage.locator(section.original),
  right: rightPage.locator(section.react),
  threshold: 30,
  inspect: 'rich',
  outDir: outputPath,
  styleProps: DEFAULT_STYLE_PROPS,
  attributes: DEFAULT_ATTRIBUTES,
})
    │
    ▼
comparison.artifacts.write(outDir, ['json', 'markdown'])
    │
    ▼
policies.withClassification(comparisonRow)
    │
    ▼
return comparisonRow { page, section, changedPercent, classification, ... }
```

### Inspect Section Flow (Pre-flight Check)

```
User command
    │
    ▼
pyxis-pages.js::inspectSection(page, section, values)
    │
    ▼
registry.findPage() + findSection()
    │
    ▼
inspect.js::inspectSection(page, section, options)
    │
    ├─► browser.page(prototypeUrl)
    │       └─► inspectLocator(leftPage, section.original, {props, stylePreset})
    │           ├─► locator.status() → exists, visible, bounds
    │           ├─► locator.text() → textStart
    │           ├─► locator.bounds() → {x, y, width, height}
    │           ├─► locator.computedStyle(props) → styles
    │           └─► locator.attributes([...]) → attributes
    │
    └─► browser.page(storybookUrl)
            └─► inspectLocator(rightPage, section.react, {props, stylePreset})
                └─► (same as above)
    │
    ▼
return [
  { side: 'original', exists, visible, bounds, textStart, styles, attributes },
  { side: 'react',    exists, visible, bounds, textStart, styles, attributes },
]
```

---

## 8. Key Files Summary

| File | Lines | Purpose |
|---|---|---|
| `lib/compare-region.js` | 370 | Comparison engine (main logic) |
| `lib/registry.js` | 130 | Spec loading, target lookup |
| `lib/snapshot.js` | 280 | Semantic snapshots + diff |
| `lib/inspect.js` | 120 | Element inspection |
| `lib/policies.js` | 100 | Classification + CI gate |
| `lib/styles.js` | 25 | CSS property presets |
| `lib/normalizers.js` | 55 | Value normalization |
| `lib/tolerances.js` | 55 | Bounds + style tolerance |
| `lib/markdown.js` | 110 | Report rendering |
| `lib/artifacts.js` | 20 | Output path helpers |
| `lib/slug.js` | 10 | Slug generation |
| `lib/storybook.js` | 10 | Storybook URL builder |
| `verbs/pyxis-pages.js` | 490 | Registered verbs |
| `specs/*.visual.yml` | — | Visual suite specs (YAML) |
| `specs/*.visual.js` | — | Spec mirrors (generated) |
| `scripts/refresh-spec-mirrors.py` | — | Mirror generator |

---

## 9. Open Questions and Extension Points

### Q1: How to make app specs the default for app-related verbs?

Currently `defaultSpec` is hardcoded to `public-pages.desktop.visual.js`. Options:
- **A:** Introduce a `--suite` flag that selects the default spec
- **B:** Create a separate verb file `pyxis-app-pages.js` that uses app specs as its default
- **C:** Load both specs and filter by a `targetType` field (`public` vs `app`)

### Q2: How to extend comparison to component-level (atoms/molecules)?

The atoms/molecules visual diff was previously done with native YAML configs (`-deprecated/`). To revive it:
1. Create `app.atoms.visual.yml` targeting individual atom components
2. Use `compareSpec` with narrow viewports (520×420 for atoms)
3. Register atoms/molecules as component-type targets

### Q3: How to snapshot atoms for regression testing?

The snapshot system (`lib/snapshot.js`) can capture baseline atom states:
```bash
pyxis pages snapshot-section metric-card component --variant component
# Saves to: visual-comparisons/cssvd-js/snapshot-section/component/metric-card/component/snapshot.json
```

Use `diffSnapshots` to track atom-level visual regressions over time.

### Q4: How to handle mobile-first component inspection?

The mobile visual spec (`app.pages.mobile.visual.yml`) uses `width: 390, height: 844`. Add a `--mobile` flag:
```bash
pyxis pages inspect-section dashboard topbar --variant mobile
```

---

## 10. Running Examples

### Compare topbar from app pages spec:
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --outDir /tmp/dashboard-compare \
  --output json
```

### Inspect sidebar on prototype only:
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-section dashboard sidebar \
  --variant desktop \
  --side original \
  --stylePreset surface \
  --output json
```

### Snapshot + diff for iterative tuning:
```bash
# Capture before
css-visual-diff verbs --repository ... pyxis pages snapshot-section dashboard topbar --outDir /tmp/before --output json

# Edit CSS...

# Capture after
css-visual-diff verbs --repository ... pyxis pages snapshot-section dashboard topbar --outDir /tmp/after --output json

# Diff
css-visual-diff verbs --repository ... pyxis pages diff-snapshots /tmp/before/snapshot.json /tmp/after/snapshot.json --output json
```

### CI policy check:
```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-all \
  --mode ci \
  --maxChangedPercent 10 \
  --outDir /tmp/ci-compare \
  --output json
# Fails if any section > 10% changed
```
