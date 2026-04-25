---
Title: css-visual-diff maintainer feature requests
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
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md
      Note: Companion implementation plan showing which features remain userland
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
      Note: Source research notes for maintainer wishlist and primitive classification
ExternalSources:
    - ../PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
Summary: Feature requests for css-visual-diff maintainers based on Pyxis JavaScript workflow experiments.
LastUpdated: 2026-04-25T08:15:00-04:00
WhatFor: Share concrete upstream feature requests with css-visual-diff maintainers, including rationale and usage examples.
WhenToUse: When filing upstream issues, discussing API design, or deciding which userland workarounds should become core features.
---


# css-visual-diff Maintainer Feature Requests

## Context

Pyxis is using `css-visual-diff` to compare standalone prototype pages/components against React/Storybook implementations. The workflow started with YAML configs and now explores the new JavaScript scripting support.

The JavaScript API is already useful for:

- repository-scanned verbs,
- browser/page/locator inspection,
- probes and snapshots,
- structural diffs,
- inspect artifacts,
- catalogs,
- loading YAML configs.

The remaining pain points are mostly workflow orchestration. We can build many of them in userland. This document lists the few features that would be especially valuable if supported directly by `css-visual-diff`, plus smaller convenience helpers that could be considered later.

## Request priority summary

| Priority | Request | Why it matters |
| --- | --- | --- |
| P0 | JS-callable pixel/region comparison API | Avoid shelling out to built-in verbs from custom JS workflows. |
| P1 | Config/job bridge for YAML runner parity | Let JS scripts wrap existing YAML configs safely during migration. |
| P1 | Stable compare artifact/result schema | Make downstream summaries, CI, and docs robust. |
| P2 | Multi-section compare helper | Useful if built on top of pixel compare API. |
| P2 | Tolerances and normalization hooks | Improve semantic snapshot/style diffs. |
| P3 | Storybook URL and style-preset conveniences | Nice ergonomics, but can be userland. |

## P0: JS-callable pixel/region comparison API

### Problem

The built-in command works well:

```bash
css-visual-diff verbs script compare region \
  --leftUrl http://localhost:7070/standalone/public/archive.html \
  --rightUrl 'http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story' \
  --leftSelector '#root > *' \
  --rightSelector "[data-page='archive']" \
  --width 920 \
  --height 1460 \
  --outDir /tmp/archive-content \
  --writeJson \
  --writeMarkdown \
  --writePngs \
  --output json
```

In Pyxis this reproduced an existing YAML comparison exactly enough for workflow use:

```text
Archive content YAML diff:      7.1281%
Archive content JS region diff: 7.128146453089244%
```

However, custom JavaScript verbs do not appear to have a documented direct equivalent like `cvd.comparePixels(...)`. That means a project-specific JS workflow has to shell out to the CLI or duplicate behavior that already exists internally.

### Requested API

Expose a JS-callable pixel/region comparison primitive.

Example shape:

```js
const cvd = require('css-visual-diff')

async function compareArchiveContent(outDir) {
  const browser = await cvd.browser()
  try {
    const leftPage = await browser.page('http://localhost:7070/standalone/public/archive.html', {
      viewport: { width: 920, height: 1460 },
      waitMs: 1000,
      name: 'archive-prototype',
    })

    const rightPage = await browser.page('http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story', {
      viewport: { width: 920, height: 1460 },
      waitMs: 1000,
      name: 'archive-storybook',
    })

    return await cvd.comparePixels({
      left: { page: leftPage, selector: '#root > *' },
      right: { page: rightPage, selector: "[data-page='archive']" },
      threshold: 30,
      outDir,
      writeJson: true,
      writeMarkdown: true,
      writePngs: true,
    })
  } finally {
    await browser.close()
  }
}
```

Alternative namespace:

```js
await cvd.compare.region({ ... })
await cvd.pixelDiff.region({ ... })
```

### Desired result shape

A stable JSON object similar to the built-in command's useful fields:

```ts
type PixelCompareResult = {
  equal?: boolean;
  threshold: number;
  changedPercent: number;
  changedPixels: number;
  totalPixels: number;
  normalizedWidth: number;
  normalizedHeight: number;
  artifacts: {
    leftFull?: string;
    rightFull?: string;
    leftElement?: string;
    rightElement?: string;
    diffComparison?: string;
    diffOnly?: string;
    json?: string;
    markdown?: string;
  };
  left: {
    url: string;
    selector: string;
    bounds?: { x: number; y: number; width: number; height: number };
  };
  right: {
    url: string;
    selector: string;
    bounds?: { x: number; y: number; width: number; height: number };
  };
  computedDiffs?: Array<unknown>;
  winnerDiffs?: Array<unknown>;
};
```

### Why this is the highest-priority request

Nearly every project-level comparison workflow can be built in userland if this primitive exists:

- compare one section,
- compare all sections,
- compare all pages,
- apply policy bands,
- generate reports,
- build a catalog,
- write CI summaries.

Without it, project scripts need to invoke the CLI as a subprocess. In the current css-visual-diff Goja runtime, `require('child_process')` fails with `Invalid module`, so even subprocess invocation is not available inside repository-scanned JS verbs. That makes a JS-callable pixel comparison primitive the cleaner path.

## P1: YAML config/job bridge for JS

### Problem

Existing projects already have YAML configs. Pyxis has many configs under:

```text
prototype-design/visual-diff/comparisons/**
```

The current `cvd.loadConfig(path)` helper is valuable, but it loads data rather than exposing the same runnable job semantics as `css-visual-diff run --config`.

For safe migration, JavaScript scripts should be able to wrap or inspect current YAML configs without reimplementing the Go runner's behavior.

### Requested API

Expose one of these shapes:

```js
const job = await cvd.jobFromConfig('prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml')

await job.preflight({ side: 'react' })
await job.inspect({ side: 'original', artifacts: 'css-json', outDir })
await job.compareAll({ outDir })
```

or:

```js
const result = await cvd.runConfig({
  configPath: 'prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml',
  modes: ['capture', 'cssdiff', 'pixeldiff', 'html-report'],
  outDir,
})
```

### Why it matters

This lets teams improve reporting and orchestration without throwing away existing declarative configs. It also prevents a JS wrapper from drifting away from official YAML behavior.

## P1: Stable compare artifact/result schema

### Problem

The built-in compare-region output is rich and useful, but downstream scripts need a stable contract to parse it safely.

Current useful fields include:

```text
pixel_diff.changed_percent
pixel_diff.changed_pixels
pixel_diff.total_pixels
pixel_diff.diff_comparison_path
pixel_diff.diff_only_path
computed_diffs
winner_diffs
url1
url2
inputs
```

A project can parse this today, but without a documented schema it is unclear how stable the shape is.

### Requested API/documentation

Document schemas for:

- `compare.json`,
- built-in compare-region structured output,
- pixel diff result object,
- coverage/missing-selector status rows,
- artifact paths.

Optionally expose readers:

```js
const result = await cvd.read.compareResult('/tmp/archive-content/compare.json')
const rows = await cvd.read.pixelDiffDirectory('prototype-design/visual-comparisons/public-pages')
```

### Why it matters

Stable schemas make it safe to build:

- CI summaries,
- Markdown reports,
- trend dashboards,
- blog-post artifact tables,
- accepted-difference tracking.

## P2: Multi-section compare helper

### Problem

Most page comparisons have more than one important section:

```text
page
content
header
list
form
cta
```

YAML handles this well. JS can handle it in userland if `comparePixels` exists, but a helper would reduce repeated boilerplate.

### Requested API

```js
const result = await cvd.compareSections({
  leftPage,
  rightPage,
  sections: [
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
  ],
  threshold: 30,
  outDir,
  writePngs: true,
  writeJson: true,
  writeMarkdown: true,
})
```

### Desired result shape

```ts
type MultiSectionCompareResult = {
  sections: PixelCompareResult[];
  summary: {
    total: number;
    missing: number;
    maxChangedPercent: number;
    averageChangedPercent: number;
  };
  artifacts: {
    json?: string;
    markdown?: string;
    index?: string;
  };
};
```

### Why it matters

This would let project scripts stay concise while preserving the multi-section reporting style of YAML configs.

## P2: Tolerances for structural snapshot diffs

### Problem

`cvd.diff` currently provides deterministic structural JSON diffs with `ignorePaths`. That is useful, but layout comparisons often need tolerances rather than full ignores.

Example: a 1px `bounds.y` change should often be treated differently from an 80px change.

### Requested API

```js
const diff = cvd.diff(before, after, {
  tolerances: {
    'results[*].snapshot.bounds.x': 1,
    'results[*].snapshot.bounds.y': 4,
    'results[*].snapshot.bounds.width': 2,
    'results[*].snapshot.bounds.height': 2,
  },
})
```

Alternative callback form:

```js
const diff = cvd.diff(before, after, {
  compare(path, left, right) {
    if (path.endsWith('.bounds.y')) {
      return Math.abs(left - right) <= 4
    }
  },
})
```

### Why it matters

This helps distinguish harmless browser/layout jitter from actual visual regressions.

## P2: CSS normalization hooks

### Problem

Raw computed CSS can be semantically noisy:

```text
#fff vs rgb(255, 255, 255)
0 vs 0px
Inter vs Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
normal line-height vs resolved pixel line-height
token variables vs resolved values
```

Userland can normalize these, but an official hook would make reports cleaner.

### Requested API

```js
const diff = cvd.diffStyles(leftStyles, rightStyles, {
  normalize: ['colors', 'zeroUnits', 'fontFamilies'],
})
```

or:

```js
const normalized = cvd.normalize.css(styleMap, {
  colors: true,
  zeroUnits: true,
  fontFamilies: 'primary-family-only',
})
```

### Why it matters

It keeps reports focused on meaningful differences rather than representation differences.

## P2: Accepted-difference annotations in reports

### Problem

Visual parity work often has intentional differences. Pyxis already accepts some component-level CSS-only differences where screenshots match or tokenized CSS differs from prototype inline styles.

Reports should be able to carry these decisions explicitly.

### Requested API

```js
const report = cvd.report(result, {
  acceptedDifferences: [
    {
      path: 'computed.font-family',
      reason: 'Prototype uses inline Inter; React uses tokenized Inter fallback stack.',
    },
  ],
})

await report.writeMarkdown('compare.md')
```

### Why it matters

It separates:

- regressions,
- known accepted differences,
- differences needing review.

That is essential for long-running design-system parity work.

## P3: Style property presets

### Problem

For daily workflows, dumping all computed CSS is too verbose. Projects usually want focused property groups.

### Requested API

```js
cvd.styles.presets.typography
cvd.styles.presets.layout
cvd.styles.presets.spacing
cvd.styles.presets.surface
cvd.styles.presets.interaction
```

Usage:

```js
cvd.probe('page-header')
  .selector("[data-section='shows-header']")
  .styles(cvd.styles.presets.typography)
```

### Why it matters

This is convenience, not a primitive. It makes scripts more readable and less noisy.

## P3: Storybook target helper

### Problem

Storybook iframe URLs are repeated and easy to mistype:

```text
/iframe.html?id=...&viewMode=story
```

### Requested API

```js
const url = cvd.storybook('http://localhost:6007')
  .story('public-site-pages--archive-desktop')
  .url()
```

or:

```js
const url = cvd.storybookUrl('http://localhost:6007', 'public-site-pages--archive-desktop')
```

### Why it matters

This is easy to build in userland, but common enough that an official helper may be worthwhile.

## P3: Safer output-file/outDir ergonomics

### Problem

One Pyxis experiment initially failed because stdout was redirected to a file inside a directory that the script itself would create. Shell redirection happens before script execution.

This is not a `css-visual-diff` bug, but visual workflows generate many files, so safe output conventions matter.

### Requested improvements

- Encourage `--output-file` support for all structured-output verbs.
- Ensure commands create `outDir` before writing artifacts.
- Consider a standard `cvd.write.ensureParent(path)` helper.
- Document the redirection footgun in scripting workflow docs.

### Why it matters

It prevents silly failures in artifact-heavy workflows.

## What should remain userland for now

The following do **not** need to be built into `css-visual-diff` core yet:

- Pyxis-specific page registry,
- project-specific policy bands,
- project-specific accepted differences,
- project-specific Markdown report templates,
- project-specific token normalization,
- blog-post-oriented report formatting.

These should be prototyped in the Pyxis userland library first. If they generalize, they can become upstream proposals later.

## Minimal maintainer ask

If maintainers only implement one thing, implement this:

```js
await cvd.comparePixels({
  left: { page, selector },
  right: { page, selector },
  threshold,
  outDir,
  writePngs,
  writeJson,
  writeMarkdown,
})
```

Everything else can be layered in JavaScript much more cleanly once that primitive exists.

## Closing rationale

The new JavaScript scripting layer is already valuable because it lets users encode visual work as executable feedback loops. The missing piece is not a large framework. It is a small amount of API exposure around the pixel comparison machinery that already powers the built-in region compare verb and YAML runner.

With that exposed, projects like Pyxis can build their own registries, policies, reports, and migration bridges in userland while keeping `css-visual-diff` focused on reliable browser inspection and image comparison primitives.
