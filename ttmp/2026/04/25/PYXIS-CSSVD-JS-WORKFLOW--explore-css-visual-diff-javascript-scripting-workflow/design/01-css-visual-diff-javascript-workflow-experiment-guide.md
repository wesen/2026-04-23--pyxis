---
Title: css-visual-diff JavaScript workflow experiment guide
Ticket: PYXIS-CSSVD-JS-WORKFLOW
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
    - Path: prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml
      Note: Existing YAML comparison reproduced by built-in JS compare-region smoke
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/01-capture-cssvd-js-help.sh
      Note: Captures css-visual-diff help pages used as research sources
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/02-smoke-cssvd-js-verb.js
      Note: First ticket-local repository-scanned JS verb smoke test
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/03-run-built-in-compare-region-smoke.sh
      Note: YAML-free Archive region comparison smoke test
ExternalSources:
    - css-visual-diff help pixel-accuracy-scripting-guide
    - css-visual-diff help javascript-api
    - css-visual-diff help javascript-verbs
    - css-visual-diff help inspect-workflow
Summary: Plan for exploring css-visual-diff JavaScript verbs as a simpler, more programmable replacement for repeated YAML plus ad-hoc .mjs visual parity workflows.
LastUpdated: 2026-04-25T07:18:56.89845529-04:00
WhatFor: Use this to guide experiments that turn the Pyxis visual parity workflow into reusable JavaScript css-visual-diff commands.
WhenToUse: When extending the page/component visual-diff workflow, writing blog-post research notes, or deciding which YAML configs can be replaced by JS scripts.
---


# css-visual-diff JavaScript Workflow Experiment Guide

## Goal

Explore the new `css-visual-diff` JavaScript scripting support and determine how it can simplify the Pyxis component/page parity loop we just used for public pages.

The immediate pain point is that our current workflow sprawls across:

- YAML configs in `prototype-design/visual-diff/comparisons/**`.
- Separate fixture/prepare JavaScript files.
- Storybook IDs and prototype URLs duplicated across configs and docs.
- Generated output directories that are useful but not always easy to compare programmatically.
- A manual diary/report loop where we read `pixeldiff.md`, copy numbers, and then decide what to tune.

The new scripting model gives us an opportunity to move from static configuration to executable visual questions: load a page, locate a section, preflight selectors, capture snapshots, diff facts, write artifacts, and return structured rows for CI, docs, and future blog-post evidence.

## What the tutorial changes in our mental model

The `pixel-accuracy-scripting-guide` frames pixel accuracy as a loop, not a screenshot:

```text
render -> locate -> extract -> compare -> report -> adjust
```

That maps directly onto the work we just did:

1. **Render**: standalone prototype pages on `localhost:7070`, Storybook iframe pages on `localhost:6007`.
2. **Locate**: `[data-page]`, `[data-section]`, and component `data-pyxis-*` selectors.
3. **Extract**: text, bounds, computed styles, attributes, screenshots.
4. **Compare**: pixel diffs plus structural diffs for computed CSS and DOM facts.
5. **Report**: markdown reports and structured JSON artifacts.
6. **Adjust**: tune page CSS and component composition, then rerun.

The tutorial's most useful distinction is:

| Concept | Use in Pyxis |
| --- | --- |
| Locator | Ad-hoc debugging during tuning: “does `[data-section='shows-list']` exist in this Storybook iframe?” |
| Probe | Repeatable checks: “for every public page, capture header text, content bounds, background, typography, and spacing tokens.” |
| Snapshot | Compact JSON facts for page sections before/after a CSS edit. |
| Inspect artifact | Durable evidence bundle: screenshots, HTML, CSS JSON/Markdown, inspect JSON. |
| Catalog | A browsable manifest for multiple page/component artifacts. |

## Current YAML-based workflow pain points

The YAML configs are valuable because they are declarative and already drive `css-visual-diff run`, but several patterns are repeated enough to deserve a JavaScript abstraction:

### 1. Repeated target setup

Every public page config repeats:

- prototype URL,
- Storybook iframe URL,
- viewport,
- root selectors,
- wait time,
- body/document background cleanup,
- output directory,
- modes.

A JavaScript target registry can express this once:

```js
const pageTargets = {
  archive: {
    prototype: "/standalone/public/archive.html",
    storyId: "public-site-pages--archive-desktop",
    selectors: {
      prototypeContent: "#root > *",
      reactContent: "[data-page='archive']",
    },
  },
}
```

### 2. YAML is awkward for conditional authoring policy

During authoring we often want selector misses to be recorded but not fatal. In CI/review, selector misses should fail fast. JavaScript gives us a clean flag:

```js
if (values.failOnMissing && status.some((s) => !s.exists || !s.visible)) {
  throw new cvd.SelectorError("required page selector missing")
}
```

### 3. Pixel diff numbers need post-processing

Phase 7 required reading multiple `pixeldiff.md` files and hand-copying numbers into a report. JavaScript commands can return structured rows:

```json
{ "page": "archive", "section": "content", "changedPercent": 7.1281 }
```

That is easier to sort, threshold, turn into a Markdown table, or embed in a blog post.

### 4. Section selectors should be generated from one source of truth

We now have stable public page selectors (`data-page`, `data-section`). A JS DSL can prevent config drift:

```js
page("archive")
  .prototype("/standalone/public/archive.html")
  .story("public-site-pages--archive-desktop")
  .section("content", "#root > *", "[data-page='archive']")
```

### 5. We need both pixel artifacts and semantic facts

The YAML run is strong for pixel screenshots. The JS API adds fast semantic snapshots:

- text normalization,
- computed typography,
- bounds,
- attributes,
- structural diffs with `ignorePaths`.

For tuning, this means we can distinguish “the screenshot moved because y changed” from “the actual font size/color/spacing is wrong”.

## Key API capabilities to test

From the tutorial and related help pages:

### Browser/page/locator layer

Useful for rapid exploration:

```js
const cvd = require("css-visual-diff")
const browser = await cvd.browser()
const page = await browser.page(url, { viewport: { width: 920, height: 1460 }, waitMs: 1000 })
const section = page.locator("[data-page='archive']")
const status = await section.status()
const styles = await section.computedStyle(["display", "padding-bottom", "font-size"])
```

### Probe/snapshot layer

Useful for repeatable checks:

```js
const probes = [
  cvd.probe("content")
    .selector("[data-page='archive']")
    .required()
    .text()
    .bounds()
    .styles(["width", "height", "padding-bottom", "font-size", "font-family"]),
]
const snapshot = await cvd.snapshot(page, probes)
```

### Diff/report layer

Useful for before/after tuning reports:

```js
const diff = cvd.diff(before, after, {
  ignorePaths: ["results[0].snapshot.bounds.y"],
})
await cvd.report(diff).writeMarkdown(`${outDir}/diff.md`)
```

### Catalog/artifact layer

Useful for review and blog-post evidence:

```js
const catalog = cvd.catalog({ title: "Pyxis Public Pages", outDir, artifactRoot: "artifacts" })
const result = await page.inspectAll(probes, { outDir: catalog.artifactDir("archive"), artifacts: "bundle" })
catalog.addResult(target, result)
await catalog.writeManifest()
await catalog.writeIndex()
```

### YAML interop

Critical for gradual migration:

```js
const cfg = await cvd.loadConfig("prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml")
```

This means we do **not** have to rewrite every YAML config at once. We can first load existing configs, inspect targets, derive probes, and write better reports.

## Experiment plan

All scripts for this ticket live under:

```text
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/
```

All generated experiment outputs should live under:

```text
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/
```

Do not write exploratory outputs into `prototype-design/visual-comparisons/` unless intentionally comparing against the current official YAML outputs.

### Experiment 0 — Capture docs and establish citations

Script:

```text
scripts/01-capture-cssvd-js-help.sh
```

Purpose:

- Capture the exact `css-visual-diff help ...` text used for this research.
- Preserve tutorial/source material for the eventual technical deep dive blog post.

Commands:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/01-capture-cssvd-js-help.sh
```

Expected outputs:

```text
sources/css-visual-diff-help/pixel-accuracy-scripting-guide.txt
sources/css-visual-diff-help/javascript-api.txt
sources/css-visual-diff-help/javascript-verbs.txt
sources/css-visual-diff-help/inspect-workflow.txt
```

Initial result:

- Captured 1,417 lines of help text.
- This gives us stable references for the blog-post narrative.

### Experiment 1 — Prove repository-scanned JS verbs work from the ticket scripts folder

Script:

```text
scripts/02-smoke-cssvd-js-verb.js
```

Purpose:

- Prove a ticket-local JS file can define a `css-visual-diff verbs` command.
- Return a structured target registry for the five current public pages.
- Validate command naming and `--repository` usage.

Command:

```bash
css-visual-diff verbs \
  --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts \
  pyxis workflow summarize-targets \
  --output json
```

Initial result:

- Succeeded.
- Wrote structured JSON target list to `sources/css-visual-diff-help/02-smoke-summarize-targets.json`.

What this tells us:

- We can keep experimental JS verbs inside the docmgr ticket.
- We can later move stable scripts into a permanent repository folder only after the API shape settles.

### Experiment 2 — Use a built-in JS compare verb instead of YAML for one region

Script:

```text
scripts/03-run-built-in-compare-region-smoke.sh
```

Purpose:

- Test the built-in JavaScript `verbs script compare region` command as a YAML-free path for simple page section comparisons.
- Compare Archive `#root > *` against Storybook `[data-page='archive']`.
- Confirm it writes screenshots, pixel diff images, JSON, and Markdown from direct CLI flags.

Command:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts/03-run-built-in-compare-region-smoke.sh
```

Initial result:

- Succeeded after fixing a shell redirection mistake in the way I invoked the script.
- Wrote:
  - `compare.json`,
  - `01-compare-report.md`,
  - `diff_comparison.png`,
  - `diff_only.png`,
  - `url1_full.png`,
  - `url1_screenshot.png`,
  - `url2_full.png`,
  - `url2_screenshot.png`,
  - `run-output.json`.
- Pixel result matched the YAML Archive content section exactly:

```json
{
  "changed_percent": 7.128146453089244,
  "changed_pixels": 102172,
  "normalized_height": 1558,
  "normalized_width": 920,
  "threshold": 30,
  "total_pixels": 1433360
}
```

Why this matters:

- The built-in JS verb can reproduce a YAML page-section result without writing a YAML config.
- This is the first strong evidence that we can simplify simple page/section comparisons into script calls.
- It also returns richer structured data than manually scraping `pixeldiff.md`.

Caveat:

- The default computed-style output is broad/noisy. For reusable Pyxis workflows, we should write project-specific probes with narrow property lists.

### Experiment 3 — Load existing YAML and build a better report

Planned script:

```text
scripts/04-report-public-page-yaml-results.js
```

Purpose:

- Use `cvd.loadConfig(path)` to load all current public page YAML configs.
- Derive targets/sections/styles.
- Read existing generated `pixeldiff.md` or rerun/inspect config artifacts.
- Emit one structured report sorted by changed percentage.

Questions:

- Does `loadConfig` expose enough lowerCamel fields for all current page configs?
- Can we derive target URLs, viewport, selectors, and output directories without hand-maintaining a second registry?
- Should this command call `css-visual-diff run` indirectly, use built-in compare verbs, or only summarize existing artifacts?

Expected output:

```text
various/04-page-yaml-report/page-diffs.json
various/04-page-yaml-report/page-diffs.md
```

Success criteria:

- One command produces the Phase 7 table without manual copy/paste.
- The report includes missing/hidden coverage counts, changed percent, changed pixels, and artifact paths.

### Experiment 4 — Author a Pyxis page registry DSL

Planned script:

```text
scripts/05-pyxis-public-page-registry.js
```

Purpose:

- Replace repeated YAML boilerplate with one JS registry that knows:
  - prototype base URL,
  - Storybook base URL,
  - viewport presets,
  - page story IDs,
  - page/section selectors,
  - output directory conventions.

Sketch:

```js
const pages = [
  page("archive")
    .prototype("/standalone/public/archive.html")
    .story("public-site-pages--archive-desktop")
    .section("content", "#root > *", "[data-page='archive']")
    .priority("closest-to-acceptance"),
]
```

Success criteria:

- A command can list targets, preflight selectors, and run one or all sections.
- Adding a mobile config means adding a viewport/story variant, not duplicating a whole YAML file.

### Experiment 5 — Locator-first authoring checks for page tuning

Planned script:

```text
scripts/06-inspect-public-page-section.js
```

Purpose:

- Build the fastest possible “what am I looking at?” command for tuning.
- Given a page name and section name, print existence, visibility, bounds, normalized text start, key computed styles, and attributes for both prototype and Storybook.

Example command shape:

```bash
css-visual-diff verbs --repository ... pyxis pages inspect-section archive content --output yaml
```

Expected result:

```yaml
page: archive
section: content
prototype:
  exists: true
  visible: true
  bounds: { x: 0, y: 0, width: 920, height: 1558 }
react:
  exists: true
  visible: true
  bounds: { x: 0, y: 21, width: 920, height: 1439 }
```

Why this matters:

- It shortens the loop before screenshot comparison.
- It catches “wrong selector” and “stale Storybook iframe” issues immediately.

### Experiment 6 — Probe/snapshot semantic diffs for tuning

Planned script:

```text
scripts/07-snapshot-public-page-contracts.js
```

Purpose:

- Define narrow probes for page-level visual contracts:
  - page shell bounds/background,
  - header title text/typography,
  - content section width/gap/padding,
  - canonical component part styles.
- Diff prototype vs React snapshots with selected ignore paths for expected layout offsets.

Potential probes for Shows:

```js
cvd.probe("shows-title")
  .selector("[data-section='shows-header'] h1")
  .text()
  .bounds()
  .styles(["font-family", "font-size", "line-height", "font-weight", "color"])
```

Success criteria:

- The script explains *why* a pixel diff is high: data mismatch, y-offset, typography, width, color, or section spacing.
- The output is concise enough to paste into a diary or blog post.

### Experiment 7 — Catalog bundle for human review

Planned script:

```text
scripts/08-build-public-page-catalog.js
```

Purpose:

- Use `cvd.catalog()` plus `page.inspectAll()` to write a durable artifact catalog for all public pages.
- Generate an index with preflight status, selector status, and artifact links.

Success criteria:

- A reviewer can open one `index.md` and navigate to HTML/CSS/screenshot artifacts for each page/section.
- The catalog can become the long-term replacement for hand-maintained report paths.

### Experiment 8 — Mobile variant generation

Planned script:

```text
scripts/09-generate-mobile-page-checks.js
```

Purpose:

- Test whether JS registry + viewport presets can generate mobile checks faster than duplicating desktop YAML.
- Apply mobile viewport to the current pages once desktop selectors are stable.

Success criteria:

- Mobile checks are created from the same page registry.
- Each mobile check can use different selectors only when necessary.

### Experiment 9 — CI threshold policy

Planned script:

```text
scripts/10-evaluate-page-threshold-policy.js
```

Purpose:

- Turn current page diff numbers into policy bands:
  - accepted,
  - review,
  - tune-first,
  - fail.
- Avoid pretending current first-pass pages are pixel-perfect.

Possible policy:

```text
0-1%       accepted/near-exact
1-10%      needs review, may be acceptable if semantic facts match
10-25%     tune required
>25%       major composition/data mismatch
```

Current classification:

- Archive: review/near acceptance.
- Book/About/ShowDetail: tune required.
- Shows: major mismatch, tune first.

## Proposed workflow after experiments

If the experiments succeed, the Pyxis parity loop should evolve into three tiers:

### Tier 1 — Fast authoring commands

Use locator/probe scripts while actively editing CSS:

```bash
css-visual-diff verbs --repository scripts pyxis pages inspect-section shows header --output yaml
css-visual-diff verbs --repository scripts pyxis pages snapshot shows --output json
```

### Tier 2 — Artifact-producing review commands

Use compare/catalog scripts before committing or asking for review:

```bash
css-visual-diff verbs --repository scripts pyxis pages compare archive content --outDir ttmp/.../various/archive-content
css-visual-diff verbs --repository scripts pyxis pages catalog --outDir ttmp/.../various/page-catalog
```

### Tier 3 — Legacy YAML compatibility / CI bridge

Keep YAML configs where they already work, but wrap them with JS reports:

```bash
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/public-pages
css-visual-diff verbs --repository scripts pyxis pages summarize-yaml-results --output markdown
```

This avoids a risky rewrite while improving daily ergonomics.

## Blog-post narrative angles to preserve

The eventual technical deep dive can be framed as:

> We started with static visual-diff YAML and manual reports. That worked, but as the system grew from atoms to molecules to organisms to pages, the friction moved from screenshot capture to workflow orchestration. The new JavaScript API let us express visual work as executable questions: load the same two targets, preflight selectors, extract browser-computed facts, compare only the facts that matter, and write review artifacts.

Important story beats:

1. **The false simplicity of screenshots**: screenshots are necessary but not sufficient; first prove selectors and semantic facts.
2. **The taxonomy breakthrough**: stable `data-page`, `data-section`, `data-pyxis-component`, and `data-pyxis-part` selectors are what make scripts reliable.
3. **YAML as a good starting point**: declarative configs got us to coverage; JS verbs help when repetition and conditional policy appear.
4. **The authoring vs CI split**: during development, record misses and continue; in CI, fail on missing required selectors.
5. **Pixel diff plus computed facts**: a changed percentage tells you *how much*, while probes tell you *why*.
6. **Archive as proof point**: built-in JS `compare region` reproduced the Archive YAML content diff exactly (`7.128146%`) without writing YAML.
7. **The path forward**: use JS registry/scripts for orchestration, keep YAML interop as a bridge, and generate durable catalogs for review.

## Open questions

- Does the JS API expose or wrap enough pixel-diff primitives for a complete multi-section page run without shelling to built-in verbs?
- Should stable scripts eventually live under `prototype-design/visual-diff/scripts/verbs` or another project-level directory?
- Can we write a single registry that covers both component Storybook (`6006`) and user-site Storybook (`6007`)?
- How should we store accepted differences: in JS policy objects, YAML metadata, or the existing parity map?
- Can snapshot diffs use numeric tolerances for bounds/spacing, or do we need to layer tolerance logic in userland?
- Should generated artifacts remain ticket-local during experimentation but move to `prototype-design/visual-comparisons` only for official runs?

## Immediate next steps

1. Implement Experiment 3: summarize current YAML page results into one JS-generated report.
2. Implement Experiment 5: locator-first `inspect-section` command for Shows tuning.
3. Use Shows as the first tuning case because it has the largest residual page diff.
4. Capture both success and failure modes in `reference/01-exploration-diary.md` and `reference/02-copious-research-notes-for-technical-deep-dive.md`.
