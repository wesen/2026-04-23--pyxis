---
Title: Pyxis css-visual-diff JavaScript userland library implementation guide
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
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/00-README.md
      Note: Placeholder and planned layout for future scripts
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/tasks.md
      Note: Phased task breakdown derived from the guide
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md
      Note: Predecessor experiment guide that motivates the userland library
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
      Note: Predecessor research notes containing userland-vs-core classification
ExternalSources:
    - ../PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md
    - ../PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md
Summary: Implementation guide for a Pyxis-specific JavaScript userland library layered on top of css-visual-diff verbs/API.
LastUpdated: 2026-04-25T08:10:00-04:00
WhatFor: Use this later to implement reusable JS helpers and verbs for Pyxis visual comparisons without waiting for css-visual-diff core API changes.
WhenToUse: When starting implementation of the Pyxis css-visual-diff JS userland library or reviewing its planned architecture.
---


# Pyxis css-visual-diff JavaScript Userland Library Implementation Guide

## Executive summary

This ticket is for implementing a Pyxis-specific JavaScript userland library around `css-visual-diff`. The goal is **not** to wait for upstream changes. Most of the workflow improvements we want can be layered in JavaScript now:

- page and component target registries,
- Storybook iframe URL helpers,
- artifact path helpers,
- style property presets,
- selector preflight policy,
- result summarization,
- threshold classification,
- accepted-difference annotations,
- Markdown/JSON report generation,
- shell-backed wrappers around existing `css-visual-diff verbs script compare region` for pixel comparisons.

The only major missing core primitive is a clean JS-callable pixel comparison function. Until that exists, this library can call the built-in `css-visual-diff verbs script compare region` command as a bridge.

## Background

The previous exploration ticket proved three important points:

1. `css-visual-diff` repository-scanned JavaScript verbs work from a ticket-local `scripts/` folder.
2. The built-in JavaScript `verbs script compare region` command can reproduce an existing YAML page-section diff.
3. Most requested workflow improvements are userland orchestration rather than fundamental new primitives.

Proof point from the exploration:

```text
Archive content YAML diff:      7.1281%
Archive content JS region diff: 7.128146453089244%
```

The userland library should turn that proof point into a reusable project workflow.

## Non-goals

This ticket should **not**:

- replace all YAML configs immediately,
- move exploratory generated artifacts into `prototype-design/visual-comparisons/` by default,
- require changes to `css-visual-diff` core before being useful,
- rewrite public page/component implementation code,
- make current first-pass page diffs look accepted.

The library is workflow tooling. It should help us inspect, compare, summarize, and prioritize visual work.

## Proposed implementation location

Start ticket-local, then graduate.

### Phase A — ticket-local prototype

Implement in this ticket first:

```text
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/
```

Suggested structure:

```text
scripts/
  lib/
    artifacts.js
    compare-region.js
    markdown.js
    policies.js
    registry.js
    results.js
    slug.js
    storybook.js
    styles.js
    tolerances.js
  verbs/
    pyxis-pages.js
    pyxis-components.js
  01-smoke-list-targets.sh
  02-smoke-summarize-existing-page-results.sh
  03-smoke-inspect-section.sh
  04-smoke-compare-section.sh
```

Run with:

```bash
css-visual-diff verbs \
  --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/verbs \
  pyxis pages list-targets \
  --output json
```

### Phase B — project-level promotion

If the scripts prove useful, move stable code to a permanent repo location, for example:

```text
prototype-design/visual-diff/js-lib/
prototype-design/visual-diff/verbs/
```

or:

```text
tools/cssvd-pyxis/
```

Do not choose the permanent location until the ticket-local prototype clarifies API shape.

## Architecture overview

The library should have five layers.

```text
┌────────────────────────────────────────────────────────────┐
│ JS verbs / CLI command layer                               │
│ pyxis pages list-targets, inspect-section, compare-section │
├────────────────────────────────────────────────────────────┤
│ Workflow orchestration layer                               │
│ page registry, run matrix, authoring/CI policy             │
├────────────────────────────────────────────────────────────┤
│ Result/report layer                                        │
│ parse outputs, summarize, threshold, accepted differences  │
├────────────────────────────────────────────────────────────┤
│ css-visual-diff adapter layer                              │
│ cvd locators/probes/snapshots + shell bridge for pixels    │
├────────────────────────────────────────────────────────────┤
│ Utilities                                                  │
│ slugify, paths, Storybook URLs, style presets, normalizers │
└────────────────────────────────────────────────────────────┘
```

## Core modules

### `slug.js`

Responsibilities:

- stable lower-kebab slug generation,
- safe path segment generation,
- dedupe helpers if needed.

API sketch:

```js
function slugify(value) {}
function joinSlug(...parts) {}

module.exports = { slugify, joinSlug }
```

### `storybook.js`

Responsibilities:

- construct Storybook iframe URLs,
- centralize `viewMode=story`,
- prevent repeated string mistakes.

API sketch:

```js
function storybookIframeUrl(baseUrl, storyId) {
  const url = new URL('/iframe.html', baseUrl)
  url.searchParams.set('id', storyId)
  url.searchParams.set('viewMode', 'story')
  return url.toString()
}
```

### `artifacts.js`

Responsibilities:

- choose stable output directories,
- keep ticket-local experiment artifacts out of official visual-comparisons paths,
- create directories before redirection/writes,
- optionally produce paths for official runs later.

API sketch:

```js
function artifactDir(baseOut, ...parts) {}
function ensureDir(path) {}
function pageSectionOutDir(baseOut, page, section, variant = 'desktop') {}
```

### `styles.js`

Responsibilities:

- expose narrow computed-style property presets,
- avoid dumping every computed CSS property unless in forensic mode.

API sketch:

```js
const presets = {
  typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color'],
  layout: ['display', 'width', 'height', 'min-height', 'margin', 'padding', 'gap'],
  surface: ['background-color', 'border-color', 'border-width', 'border-radius', 'box-shadow'],
  spacing: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  pageShell: ['box-sizing', 'width', 'min-height', 'margin', 'padding', 'display', 'background-color', 'color', 'font-family', 'font-size', 'line-height'],
}
```

### `registry.js`

Responsibilities:

- define current public page targets once,
- define prototype URL, Storybook story, viewports, sections, priority, and known baselines,
- provide helpers to select one page/section or all pages.

Initial registry should cover:

```text
shows
show-detail
archive
book
about
```

API sketch:

```js
const publicPages = createRegistry({
  prototypeBase: 'http://localhost:7070',
  storybookBase: 'http://localhost:6007',
  defaultViewport: { width: 920, height: 1460 },
})

publicPages.page('archive')
  .prototype('/standalone/public/archive.html')
  .story('public-site-pages--archive-desktop')
  .section('page', '#root', "[data-story-frame='pyxis-page-shell']")
  .section('content', '#root > *', "[data-page='archive']")
  .priority('closest-to-acceptance')
```

Initial target data should include current page diff baselines:

```text
archive content: 7.1281%
archive page: 6.6511%
book content: 14.5896%
book page: 12.1006%
about content: 20.4334%
about page: 18.2795%
show-detail content: 24.4647%
show-detail page: 18.5282%
shows content: 49.0940%
shows page: 50.5245%
```

### `policies.js`

Responsibilities:

- authoring vs CI behavior,
- selector preflight policy,
- threshold classification,
- exit-code decisions.

API sketch:

```js
const bands = [
  { name: 'accepted', max: 1 },
  { name: 'review', max: 10 },
  { name: 'tune-required', max: 25 },
  { name: 'major-mismatch', max: Infinity },
]

function classifyChangedPercent(percent) {}
function assertCiPolicy(rows, options) {}
function summarizePreflight(statuses, { failOnMissing = false }) {}
```

### `results.js`

Responsibilities:

- read existing `pixeldiff.md` tables,
- read built-in `compare.json`,
- normalize into rows,
- sort rows by changed percent,
- compare current result to baseline.

API sketch:

```js
function parsePixelDiffMarkdown(markdown) {}
function readPageVisualComparisonResults(rootDir) {}
function readCompareJson(path) {}
function normalizeCompareResult(result, metadata) {}
```

Normalized row shape:

```ts
type PixelDiffRow = {
  page: string;
  variant: 'desktop' | 'mobile';
  section: string;
  changedPercent: number;
  changedPixels?: number;
  totalPixels?: number;
  classification: 'accepted' | 'review' | 'tune-required' | 'major-mismatch';
  source: 'yaml-run' | 'js-compare-region';
  artifactDir?: string;
  diffComparisonPath?: string;
};
```

### `markdown.js`

Responsibilities:

- generate Markdown summary tables,
- generate report sections for commands, artifacts, failures, and next actions,
- keep output blog-post-friendly.

API sketch:

```js
function renderPixelDiffTable(rows) {}
function renderCommandBlock(command) {}
function renderArtifactLinks(artifacts) {}
function renderPolicySummary(rows) {}
```

### `compare-region.js`

Responsibilities:

- bridge to built-in `css-visual-diff verbs script compare region`,
- create output directory first,
- run command with safe quoting via `child_process.spawn`,
- read `compare.json`,
- wrap generated `compare.md` with docmgr-compatible frontmatter if output lives under a ticket.

API sketch:

```js
async function compareRegion({
  leftUrl,
  rightUrl,
  leftSelector,
  rightSelector,
  viewport,
  waitMs,
  outDir,
  threshold = 30,
}) {}
```

Implementation note:

Until `cvd.comparePixels(...)` exists, this module is the bridge. Keep it isolated so replacing it later is easy.

### `tolerances.js`

Responsibilities:

- userland numeric tolerance support for snapshots,
- path matching helpers,
- pre-normalize or post-filter structural diffs.

API sketch:

```js
function applyNumericTolerances(diff, toleranceRules) {}
function normalizeSnapshotForDiff(snapshot, rules) {}
```

### `normalizers.js`

Responsibilities:

- normalize CSS values where raw computed output is semantically noisy,
- normalize colors,
- normalize zero values,
- normalize font-family lists,
- optionally map resolved CSS values back to Pyxis design tokens.

API sketch:

```js
function normalizeColor(value) {}
function normalizeZero(value) {}
function normalizeFontFamily(value) {}
function normalizeCssValue(prop, value) {}
```

## JS verb commands to implement

### `pyxis pages list-targets`

Purpose:

- print current target registry,
- prove registry is loadable,
- support `--page`, `--variant`, `--priority` filters.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages list-targets --output table
```

### `pyxis pages summarize-results`

Purpose:

- parse existing official YAML-run outputs under `prototype-design/visual-comparisons/public-pages`,
- emit sorted JSON/Markdown/table summaries,
- replace manual Phase 7 report copy/paste.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages summarize-results \
  --resultsDir prototype-design/visual-comparisons/public-pages \
  --markdown ttmp/.../various/page-summary.md \
  --output table
```

### `pyxis pages inspect-section`

Purpose:

- locator-first authoring check for one page section,
- report existence, visibility, bounds, text start, attributes, and narrow style preset values for both sides.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages inspect-section shows header --output yaml
```

### `pyxis pages compare-section`

Purpose:

- run a pixel comparison for one registered page section,
- initially use `compare-region.js` bridge,
- produce `compare.json`, docmgr-friendly Markdown, PNG artifacts, and a concise row.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages compare-section archive content \
  --outDir ttmp/.../various/archive-content \
  --output json
```

### `pyxis pages compare-page`

Purpose:

- run all registered sections for one page,
- produce one page report,
- classify each section.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages compare-page archive \
  --outDir ttmp/.../various/archive-page \
  --output table
```

### `pyxis pages compare-all`

Purpose:

- run all registered public pages/sections,
- support authoring vs CI policy,
- emit final JSON/Markdown report.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages compare-all \
  --outDir ttmp/.../various/public-pages-run \
  --mode authoring \
  --output table
```

### `pyxis pages snapshot-section`

Purpose:

- use `cvd.browser`, locators/probes, and `cvd.snapshot` for semantic facts,
- no pixel diff required,
- useful before expensive screenshot runs.

Example:

```bash
css-visual-diff verbs --repository scripts/verbs pyxis pages snapshot-section shows header --output json
```

## Implementation phases

### Phase 1 — library skeleton and target registry

Deliverables:

- `scripts/lib/slug.js`
- `scripts/lib/storybook.js`
- `scripts/lib/artifacts.js`
- `scripts/lib/registry.js`
- `scripts/verbs/pyxis-pages.js`
- `pyxis pages list-targets`

Validation:

```bash
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages list-targets --output json
```

### Phase 2 — existing result summarizer

Deliverables:

- `scripts/lib/results.js`
- `scripts/lib/policies.js`
- `scripts/lib/markdown.js`
- `pyxis pages summarize-results`

Validation:

```bash
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages summarize-results \
  --resultsDir prototype-design/visual-comparisons/public-pages \
  --output table
```

Success criteria:

- Reproduces Phase 7 table from generated outputs without manual copy/paste.
- Sorts highest diffs first.
- Classifies rows into policy bands.

### Phase 3 — locator-first inspect command

Deliverables:

- `scripts/lib/styles.js`
- browser/locator helpers in `scripts/lib/inspect.js`
- `pyxis pages inspect-section`

Validation:

```bash
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages inspect-section shows content --output yaml
```

Success criteria:

- Immediately tells whether prototype and Storybook selectors exist/are visible.
- Prints bounds and narrow style preset values.
- Supports `--failOnMissing`.

### Phase 4 — compare-section bridge

Deliverables:

- `scripts/lib/compare-region.js`
- `pyxis pages compare-section`

Validation:

```bash
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages compare-section archive content \
  --outDir ttmp/.../various/phase-4/archive-content \
  --output json
```

Success criteria:

- Produces the same Archive content diff as the previous smoke: approximately `7.1281%`.
- Creates artifacts in a stable directory.
- Wraps Markdown artifacts with docmgr-compatible frontmatter when generated under ticket docs.

### Phase 5 — compare-page and compare-all orchestration

Deliverables:

- `pyxis pages compare-page`
- `pyxis pages compare-all`
- Markdown/JSON aggregate report generation.

Success criteria:

- One command runs all sections for Archive.
- One command runs all registered desktop pages.
- Output is concise enough to paste into a diary or PR summary.

### Phase 6 — snapshot/semantic diff tooling

Deliverables:

- `scripts/lib/normalizers.js`
- `scripts/lib/tolerances.js`
- `pyxis pages snapshot-section`
- optional `pyxis pages diff-snapshots`

Success criteria:

- Explains why a pixel diff is high: typography, spacing, bounds, text, or data mismatch.
- Supports userland tolerances for small numeric layout differences.

### Phase 7 — promotion recommendation

Deliverables:

- final ticket report,
- recommendation on whether to move stable library into permanent repo path,
- list of upstream css-visual-diff feature requests validated by implementation experience.

## Validation checklist

Run before considering this ticket complete:

```bash
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages list-targets --output json
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages summarize-results --output table
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages inspect-section archive content --output yaml
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages compare-section archive content --outDir ttmp/.../various/smoke/archive-content --output json
css-visual-diff verbs --repository ttmp/.../scripts/verbs pyxis pages compare-page archive --outDir ttmp/.../various/smoke/archive-page --output table
```

If promoted to the repo, also run:

```bash
cd web && pnpm -r typecheck
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/public-pages
```

## Open design questions

1. Should stable scripts live under `prototype-design/visual-diff/verbs` or `tools/cssvd-pyxis`?
2. Should official page comparison artifacts continue to live under `prototype-design/visual-comparisons`, or should JS userland reports use ticket-local output by default?
3. How should accepted differences be stored: in JS registry metadata, a JSON sidecar, or the existing parity map?
4. Should this library eventually cover component-system comparisons as well as public pages?
5. Should mobile checks be generated from the same registry immediately or after desktop tuning stabilizes?

## Recommended first implementation step

Start with the lowest-risk, highest-value command:

```text
pyxis pages summarize-results
```

It does not require browser work or new core primitives. It simply parses existing outputs and replaces manual report generation. That makes it the best first step when this ticket is resumed.
