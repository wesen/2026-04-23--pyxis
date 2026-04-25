---
Title: Clean css-visual-diff maintainer follow-up requests after beta ergonomics update
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
RelatedFiles: []
ExternalSources:
  - css-visual-diff help javascript-api
  - css-visual-diff help javascript-verbs
Summary: "Current maintainer-facing follow-up request list after selector wait helpers, stable artifact write paths, multi-section catalog examples, and collection profile docs landed in css-visual-diff beta."
LastUpdated: 2026-04-25T09:25:00-04:00
WhatFor: "Use this as the current concise upstream request list for css-visual-diff maintainers after the beta ergonomics follow-up."
WhenToUse: "Share this instead of older request documents when discussing remaining css-visual-diff JavaScript workflow improvements."
---

# Clean css-visual-diff Maintainer Follow-up Requests After Beta Ergonomics Update

## Context

Pyxis uses `css-visual-diff` to compare standalone prototype pages/components against React/Storybook implementations. The flexible JavaScript API already satisfied our original core request for JS-callable region comparison through:

```js
cvd.compare.region(...)
cvd.compare.selections(...)
cvd.image.diff(...)
```

A subsequent beta ergonomics follow-up also landed several of our high-priority requests:

1. `locator.waitFor(options)` and `page.waitForSelector(selector, options)`.
2. Stable keyed paths returned from `comparison.artifacts.write(...)`.
3. `examples/verbs/compare-page-catalog.js` multi-section catalog example.
4. Documentation for `minimal`, `rich`, and `debug` collection profiles, including clarification that `styleProps` and `attributes` are collection-time filters.

We validated the first two directly in the Pyxis userland library by updating `pyxis pages compare-section archive content` to use `locator.waitFor(...)` and the stable artifact write result.

Validated output:

```text
changedPercent: 7.128146453089244
changedPixels: 102172
artifactJson: .../compare.json
artifactMarkdown: .../compare.md
leftRegionPath: .../left_region.png
rightRegionPath: .../right_region.png
diffOnlyPath: .../diff_only.png
diffComparisonPath: .../diff_comparison.png
```

Therefore this document only contains **remaining** follow-up requests. It intentionally does not request the already-landed features above.

## Priority summary

| Priority | Request | Status | Why it matters |
| --- | --- | --- | --- |
| P1 | Bounds tolerance API | Deferred upstream; still useful after beta usage patterns emerge | Helps classify tiny layout jitter vs meaningful drift. |
| P1 | CSS/style normalization hooks | Deferred upstream; still useful after repeated patterns emerge | Reduces noise from equivalent CSS representations. |
| P2 | Built-in style property presets | Deferred upstream; policy-ish but may become common | Improves script readability and shared vocabulary. |
| P2 | Document recommended artifact/frontmatter integration pattern | New smaller docs request | Helps doc-managed workflows avoid generated Markdown validation issues. |
| P3 | Optional compare-page policy example | New smaller example request | Shows how to layer project policy over the new catalog example. |

## Landed; no longer requested

These should not be filed as new requests:

### JS-callable pixel comparison primitive

Satisfied by:

```js
cvd.compare.region(...)
cvd.compare.selections(...)
cvd.image.diff(...)
```

### Selector readiness helper

Satisfied by:

```js
await locator.waitFor({
  timeoutMs: 30000,
  pollIntervalMs: 100,
  visible: true,
  afterWaitMs: 500,
})
```

and:

```js
await page.waitForSelector('[data-page="archive"]', {
  timeoutMs: 30000,
  visible: true,
})
```

### Stable artifact write paths

Satisfied by:

```js
const written = await comparison.artifacts.write(outDir, ['json', 'markdown'])
```

which now returns keys such as:

```text
json
markdown
leftRegion
rightRegion
diffOnly
diffComparison
written
```

### Multi-section catalog example

Satisfied by:

```text
examples/verbs/compare-page-catalog.js
```

### Collection profile documentation

Satisfied for:

```text
minimal
rich
debug
```

including the important clarification that `styleProps` and `attributes` are collection-time filters, not just report filters.

## P1: Bounds tolerance API

### Problem

`SelectionComparison` exposes bounds deltas directly, which is excellent:

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

Project workflows often need to distinguish acceptable tiny layout jitter from meaningful structural drift:

```text
x/y changed by <= 2px: acceptable
height changed by > 20px: needs review
```

Pyxis can implement this in userland, so this is not a blocker. But if multiple beta users repeat this pattern, an official tolerance option would be useful.

### Possible API

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

or at comparison time:

```js
const comparison = await cvd.compare.region({
  left,
  right,
  boundsTolerance: { x: 1, y: 4, width: 2, height: 8 },
})
```

### Why it matters

It allows reports to distinguish:

- harmless layout jitter,
- expected responsive offsets,
- major composition drift.

## P1: CSS/style normalization hooks

### Problem

Computed style diffs often include representation differences or expected implementation differences:

```text
#fff vs rgb(255, 255, 255)
0 vs 0px
Inter vs Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
normal line-height vs resolved line-height
prototype inline styles vs tokenized React CSS
```

This is especially common when comparing prototypes against productionized component CSS.

### Possible API

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

It keeps reports focused on meaningful visual differences rather than equivalent CSS formatting.

### Why it can remain deferred

Normalization encodes policy. Different projects will disagree about whether font fallback differences, token equivalence, or line-height resolution should be accepted. Pyxis can gather userland evidence first.

## P2: Built-in style property presets

### Problem

Every project tends to redefine common style groups:

```js
const typography = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color']
const surface = ['background-color', 'border-color', 'border-radius', 'box-shadow']
const spacing = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left']
```

### Possible API

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

This improves readability and creates shared vocabulary across scripts and docs.

### Why it can remain deferred

Like normalization, presets can encode policy. It is reasonable to wait until beta users repeat the same lists.

## P2: Document artifact/frontmatter integration pattern

### Problem

`comparison.artifacts.write(...)` writes Markdown reports. In doc-managed repos like Pyxis, Markdown files under ticket workspaces may be validated by tools that expect frontmatter. We currently wrap generated `compare.md` with docmgr frontmatter in userland.

This is not a css-visual-diff bug. It is an integration pattern.

### Request

Add a small note/example showing that projects can post-process generated Markdown reports when their documentation system requires frontmatter:

```js
const written = await comparison.artifacts.write(outDir, ['json', 'markdown'])
await addFrontmatterIfNeeded(written.markdown, {
  title: 'Archive content visual comparison',
  ticket: 'PYXIS-CSSVD-JS-LIB',
})
```

### Why it matters

It prevents users from treating documentation validation failures as css-visual-diff failures. It also shows the right boundary: css-visual-diff writes report Markdown; project documentation systems can wrap it.

## P3: Optional compare-page policy example

### Problem

The new multi-section catalog example demonstrates comparison and artifact generation. Many users will also want to layer policy on top:

```text
changedPercent <= 1%: accepted
changedPercent <= 10%: review
changedPercent <= 25%: tune-required
changedPercent > 25%: major-mismatch
```

### Request

Optionally add a small example section showing policy classification as userland code, not as core css-visual-diff policy:

```js
function classify(comparison) {
  const changed = comparison.pixel.summary().changedPercent
  if (changed <= 1) return 'accepted'
  if (changed <= 10) return 'review'
  if (changed <= 25) return 'tune-required'
  return 'major-mismatch'
}
```

### Why it matters

It teaches the right layering: css-visual-diff provides measurements and artifacts; projects decide policy.

## Minimal current ask

The current short list for maintainers is:

1. Keep bounds tolerances, CSS normalization, and style presets deferred until beta usage confirms repeated patterns.
2. Consider a small docs note for documentation/frontmatter integration around generated Markdown artifacts.
3. Consider a small docs example for project-local policy classification layered on top of `comparison.summary()`.

## Closing note

The beta ergonomics update landed the highest-value workflow pieces for Pyxis. The remaining items are no longer blockers. They are potential shared abstractions if enough projects independently implement the same userland patterns.
