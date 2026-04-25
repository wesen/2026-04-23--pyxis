---
Title: Clean css-visual-diff maintainer follow-up requests after flexible JS API
Ticket: PYXIS-CSSVD-JS-LIB
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - automation
    - pyxis
DocType: design
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/reference/02-flexible-javascript-api-evaluation-report.md
      Note: Source evaluation showing cvd.compare.region satisfies the original core primitive request
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/lib/compare-region.js
      Note: Integration code that revealed remaining selector wait and artifact schema ergonomics
ExternalSources:
    - css-visual-diff help javascript-api
    - css-visual-diff help javascript-verbs
Summary: Clean maintainer-facing request document containing only the remaining desired css-visual-diff features after cvd.compare.region and the flexible JavaScript API satisfied the original core pixel-compare request.
LastUpdated: 2026-04-25T09:10:00-04:00
WhatFor: Use this as the current concise upstream request list for css-visual-diff maintainers.
WhenToUse: Share this instead of the older request document when discussing follow-up improvements after the flexible JS API landed.
---


# Clean css-visual-diff Maintainer Follow-up Requests

## Context

Pyxis uses `css-visual-diff` to compare standalone prototype pages/components against React/Storybook implementations. We originally asked for a JS-callable pixel comparison primitive because our project-local JS verbs could only plan calls to the built-in CLI command:

```bash
css-visual-diff verbs script compare region ...
```

The newer flexible JavaScript API now satisfies that core request with:

```js
cvd.compare.region(...)
cvd.compare.selections(...)
cvd.image.diff(...)
```

We validated `cvd.compare.region(...)` in the Pyxis userland library against Archive content and reproduced the existing baselines exactly:

```text
YAML Archive content:                 7.1281%
Built-in script compare region smoke: 7.128146453089244%
New cvd.compare.region userland verb: 7.128146453089244%
Changed pixels:                       102172
```

This document intentionally **does not repeat** the old request for a JS-callable pixel compare primitive. That request is satisfied. The remaining requests are smaller follow-up improvements discovered while using the new API in a real project workflow.

## Priority summary

| Priority | Request | Why it matters |
| --- | --- | --- |
| P0 | Selector wait helper for JS scripts | Prevent Storybook/app readiness races before `cvd.compare.region`. |
| P0 | Clarify artifact write/report schema | Make generated JSON/Markdown artifacts easier to consume reliably. |
| P1 | Multi-section comparison/catalog example | Help projects implement page-level workflows with catalogs correctly. |
| P1 | Comparison artifact metadata for JSON/Markdown writes | Let scripts return paths to all written artifacts without guessing. |
| P2 | Tolerances for structural/bounds diffs | Reduce noise from tiny expected layout deltas. |
| P2 | CSS/style normalization hooks | Reduce noise from equivalent CSS representations. |
| P3 | Built-in style property presets | Improve script readability and reduce verbose computed-style dumps. |

## P0: Selector wait helper for JS scripts

### Problem

When we first switched `pyxis pages compare-section` to `cvd.compare.region(...)`, the comparison sometimes saw the Storybook-side selector as missing:

```json
"right": {
  "exists": false,
  "visible": false,
  "selector": "[data-page='archive']"
}
```

The page had loaded, but the meaningful React/MSW/RTK-rendered selector was not ready yet.

We fixed this with `page.prepare(...)`:

```js
await page.prepare({
  type: 'script',
  waitFor: 'document.querySelector("[data-page=\\"archive\\"]")',
  waitForTimeoutMs: 30000,
  script: 'void 0',
  afterWaitMs: 500,
})
```

This works, but it is awkward for the common case “wait until this selector exists”. It also required discovering that an empty `script` is invalid and that `script: 'void 0'` is a valid no-op.

### Request

Add a dedicated selector wait helper, for example:

```js
await page.waitForSelector('[data-page="archive"]', {
  timeoutMs: 30000,
  visible: false,
  afterWaitMs: 500,
})
```

or locator-based:

```js
await page.locator('[data-page="archive"]').waitFor({
  timeoutMs: 30000,
  visible: true,
  afterWaitMs: 500,
})
```

### Why it matters

Most real app comparisons need a page-readiness check before visual comparison. This is especially true for:

- Storybook iframe stories,
- MSW-backed stories,
- RTK Query / async data loading,
- routes that lazy-load components,
- pages where the root loads before the target section exists.

A selector wait helper would make project scripts shorter and less error-prone.

## P0: Clarify artifact write/report schema

### Problem

`comparison.artifacts.write(outDir, ['json', 'markdown'])` successfully writes:

```text
compare.json
compare.md
```

But in our compact wrapper, `comparison.toJSON().artifacts` clearly contained PNG artifact entries such as:

```text
diffOnly
diffComparison
```

while the JSON/Markdown artifact paths were not exposed in the same way. Our wrapper therefore had reliable paths for diff PNGs from `pixel`, but blank fields for:

```text
artifactJson
artifactMarkdown
```

This is manageable in userland because the filenames are predictable, but it would be cleaner if written artifacts were represented consistently.

### Request

Document and/or expose a stable artifact write result. For example:

```js
const written = await comparison.artifacts.write(outDir, ['json', 'markdown', 'diffComparison'])

// suggested shape
{
  json: '.../compare.json',
  markdown: '.../compare.md',
  diffComparison: '.../diff_comparison.png',
  diffOnly: '.../diff_only.png',
  leftRegion: '.../left_region.png',
  rightRegion: '.../right_region.png'
}
```

Alternatively, ensure `comparison.toJSON().artifacts` includes all generated artifacts after `artifacts.write(...)`.

### Why it matters

Project-local verbs often need to return compact JSON rows containing artifact paths:

```json
{
  "changedPercent": 7.1281,
  "compareJson": ".../compare.json",
  "compareMarkdown": ".../compare.md",
  "diffComparison": ".../diff_comparison.png"
}
```

Stable artifact metadata avoids filename guessing and makes CI/report integration safer.

## P1: Multi-section comparison and catalog example

### Problem

The new docs include a helpful homepage validation sketch using a loop and `catalog.record(comparison, ...)`. That is the right direction. Projects doing page-level parity need a complete recommended pattern for:

- loading two pages once,
- comparing multiple sections,
- writing per-section artifacts,
- recording comparisons into a catalog,
- writing `manifest.json` and `index.md`,
- returning compact stdout JSON for CI/agents.

### Request

Add a complete example/tutorial section that looks like:

```js
async function comparePage(leftUrl, rightUrl, outDir) {
  const cvd = require('css-visual-diff')
  const browser = await cvd.browser()
  const catalog = cvd.catalog.create({
    title: 'Public page comparison',
    outDir,
    artifactRoot: 'artifacts',
  })

  const sections = [
    {
      name: 'page',
      leftSelector: '#root',
      rightSelector: "[data-story-frame='pyxis-page-shell']",
    },
    {
      name: 'content',
      leftSelector: '#root > *',
      rightSelector: "[data-page='archive']",
    },
  ]

  let leftPage, rightPage
  try {
    leftPage = await browser.page(leftUrl, { viewport: { width: 920, height: 1460 }, waitMs: 1000 })
    rightPage = await browser.page(rightUrl, { viewport: { width: 920, height: 1460 }, waitMs: 1000 })

    const summaries = []
    for (const section of sections) {
      await leftPage.locator(section.leftSelector).waitFor({ timeoutMs: 30000 })
      await rightPage.locator(section.rightSelector).waitFor({ timeoutMs: 30000 })

      const artifactDir = catalog.artifactDir(section.name)
      const comparison = await cvd.compare.region({
        name: section.name,
        left: leftPage.locator(section.leftSelector),
        right: rightPage.locator(section.rightSelector),
        outDir: artifactDir,
        threshold: 30,
        inspect: 'rich',
      })

      const written = await comparison.artifacts.write(artifactDir, ['json', 'markdown'])
      catalog.record(comparison, {
        slug: section.name,
        name: section.name,
        url: leftUrl,
        selector: section.leftSelector,
      })

      summaries.push({
        section: section.name,
        pixel: comparison.pixel.summary(),
        artifacts: written,
      })
    }

    return {
      summaries,
      manifestPath: await catalog.writeManifest(),
      indexPath: await catalog.writeIndex(),
      catalog: catalog.summary(),
    }
  } finally {
    if (leftPage) await leftPage.close()
    if (rightPage) await rightPage.close()
    await browser.close()
  }
}
```

### Why it matters

This is the workflow most design-system and page-level users will need after the single-section example works.

## P1: Document collection profiles and recommended defaults

### Problem

The new docs list collection profiles:

```text
minimal
rich
debug
```

For real workflows, users need guidance on when each is appropriate and what artifact/performance tradeoffs to expect.

### Request

Add a small decision table:

| Profile | Use when | Avoid when |
| --- | --- | --- |
| `minimal` | CI only needs existence/bounds/pixels | You need text/style diagnosis |
| `rich` | default authoring/review mode | very large suites where style extraction is too expensive |
| `debug` | deep one-off diagnosis | routine CI/page-suite runs |

Also document what style/attribute sets `rich` collects by default, and whether passing `styleProps` / `attributes` narrows collection, comparison, or both.

### Why it matters

Project-local wrappers need to choose defaults. Pyxis currently uses `inspect: 'rich'` for `compare-section`, but may prefer `minimal` for large `compare-all` runs unless a section fails.

## P2: Tolerances for structural/bounds diffs

### Problem

`SelectionComparison` exposes bounds deltas directly, for example:

```json
{
  "delta": {
    "height": -118.9375,
    "width": 0,
    "x": 0,
    "y": 61
  }
}
```

This is excellent. The next useful layer is tolerance-aware evaluation:

```text
x/y changed by <= 2px: acceptable
height changed by > 20px: needs review
```

Userland can implement this, but an official option would make reports and policy checks more consistent.

### Request

Add tolerance support to structural comparison methods, for example:

```js
const bounds = comparison.bounds.diff({
  tolerances: {
    x: 1,
    y: 4,
    width: 2,
    height: 8,
  },
})
```

or at compare time:

```js
const comparison = await cvd.compare.region({
  left,
  right,
  boundsTolerance: { x: 1, y: 4, width: 2, height: 8 },
})
```

### Why it matters

Pixel diffs are sensitive; bounds tolerances help classify harmless layout jitter separately from real structural drift.

## P2: CSS/style normalization hooks

### Problem

Computed style diffs often include representation differences or expected implementation differences:

```text
#fff vs rgb(255, 255, 255)
0 vs 0px
Inter vs Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
normal line-height vs resolved line-height
prototype inline styles vs tokenized React CSS
```

Userland can normalize these, but official hooks would make comparison reports cleaner and reusable.

### Request

Expose normalization options such as:

```js
const comparison = await cvd.compare.region({
  left,
  right,
  styleProps,
  normalizeStyles: {
    colors: true,
    zeroUnits: true,
    fontFamilies: 'primary-family-only',
  },
})
```

or:

```js
const normalized = cvd.normalize.styles(styleMap, {
  colors: true,
  zeroUnits: true,
})
```

### Why it matters

This keeps reports focused on meaningful visual differences rather than equivalent CSS formatting.

## P3: Built-in style property presets

### Problem

Every project redefines common style groups:

```js
const typography = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color']
const surface = ['background-color', 'border-color', 'border-radius', 'box-shadow']
const spacing = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']
```

### Request

Expose documented presets:

```js
cvd.styles.presets.typography
cvd.styles.presets.layout
cvd.styles.presets.spacing
cvd.styles.presets.surface
cvd.styles.presets.interaction
```

Usage:

```js
await cvd.compare.region({
  left,
  right,
  styleProps: cvd.styles.presets.typography,
})
```

### Why it matters

This is not a core primitive, but it improves readability and creates shared vocabulary across scripts and docs.

## P3: Explicit no-op prepare / wait documentation

### Problem

We used this pattern successfully:

```js
await page.prepare({
  type: 'script',
  waitFor: 'document.querySelector("[data-page=\\"archive\\"]")',
  waitForTimeoutMs: 30000,
  script: 'void 0',
  afterWaitMs: 500,
})
```

But this was discovered by trial and error after an empty `script` failed.

### Request

If `page.prepare` remains the recommended wait helper, document the no-op pattern explicitly:

```js
script: 'void 0'
```

Better yet, provide the selector wait helper requested above.

## What is no longer requested

The following old request is obsolete and should not be filed as a new upstream issue:

```text
Expose a JS-callable pixel comparison primitive.
```

That is now satisfied by:

```js
cvd.compare.region(...)
cvd.compare.selections(...)
cvd.image.diff(...)
```

## Minimal actionable maintainer list

If maintainers only want a short issue list, file these:

1. Add `locator.waitFor(...)` / `page.waitForSelector(...)` helper.
2. Return/document artifact paths from `comparison.artifacts.write(...)`.
3. Add a complete multi-section comparison + catalog example.
4. Clarify collection profile defaults and `styleProps` / `attributes` semantics.
5. Consider tolerance and normalization hooks after the core workflow settles.

## Closing note

The flexible JS API is a large improvement. It solved the most important Pyxis blocker. These requests are now about making the API easier to use correctly in larger project-local visual workflows, not about missing fundamental comparison capability.
