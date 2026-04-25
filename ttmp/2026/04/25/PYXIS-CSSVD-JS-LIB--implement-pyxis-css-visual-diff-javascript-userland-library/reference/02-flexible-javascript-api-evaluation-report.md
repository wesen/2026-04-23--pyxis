---
Title: Flexible JavaScript API evaluation report
Ticket: PYXIS-CSSVD-JS-LIB
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - automation
    - pyxis
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/07-capture-new-flexible-js-api-docs.sh
      Note: Captures updated css-visual-diff JavaScript API docs used by the report
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/08-smoke-new-api-compare-section.sh
      Note: Runs the new cvd.compare.region-based Archive content smoke test
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/lib/compare-region.js
      Note: Updated userland comparison implementation using cvd.compare.region
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/verbs/pyxis-pages.js
      Note: Exposes pyxis pages compare-section verb
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/05-new-api-compare-section/archive-content/compare-section-output.json
      Note: Structured smoke output proving Archive content comparison parity
ExternalSources:
    - css-visual-diff help javascript-api
    - css-visual-diff help javascript-verbs
    - css-visual-diff help pixel-accuracy-scripting-guide
Summary: Technical evaluation of the newer flexible css-visual-diff JavaScript API, including how it changes the Pyxis userland library and upstream feature-request conclusions.
LastUpdated: 2026-04-25T08:55:00-04:00
WhatFor: Use this report to understand how the new cvd.compare.region / collect / SelectionComparison API affects the Pyxis visual workflow.
WhenToUse: Read before continuing PYXIS-CSSVD-JS-LIB implementation or revising upstream css-visual-diff feature requests.
---


# Flexible JavaScript API Evaluation Report

## Goal

Evaluate the newer, more flexible `css-visual-diff` JavaScript API and update the Pyxis userland scripts/workflow accordingly.

The specific question was whether the new API changes the previous conclusion that Pyxis needed an upstream JS-callable pixel comparison primitive. The answer is: **yes, substantially**. The newly documented `cvd.compare.region(...)`, collected-selection model, `cvd.compare.selections(...)`, `cvd.image.diff(...)`, and catalog comparison support remove the biggest blocker from the previous userland implementation plan.

## Context

Before this evaluation, the `PYXIS-CSSVD-JS-LIB` implementation had reached a command-planner boundary:

- We could generate a command for the built-in `css-visual-diff verbs script compare region`.
- We could not execute that command from a repository-scanned JS verb because `child_process` is not available in the Goja runtime.
- The maintainer-request document therefore asked for a JS-callable pixel comparison primitive.

The new docs now explicitly expose this primitive through:

```js
await cvd.compare.region({ left, right, outDir, ... })
```

and explain that the built-in `script compare region` verb itself dogfoods this public API.

## Documentation read and captured

Captured via:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/07-capture-new-flexible-js-api-docs.sh
```

Captured files:

```text
sources/css-visual-diff-help-2026-04-25-flexible-js-api/root-help.txt
sources/css-visual-diff-help-2026-04-25-flexible-js-api/javascript-api.txt
sources/css-visual-diff-help-2026-04-25-flexible-js-api/javascript-verbs.txt
sources/css-visual-diff-help-2026-04-25-flexible-js-api/pixel-accuracy-scripting-guide.txt
sources/css-visual-diff-help-2026-04-25-flexible-js-api/00-capture-output.txt
```

Line counts from the capture:

```text
76 root-help.txt
893 javascript-api.txt
464 javascript-verbs.txt
612 pixel-accuracy-scripting-guide.txt
2045 total
```

## New API capabilities that matter most

### 1. `cvd.compare.region(...)`

This is the major unlock.

Documented usage:

```js
const comparison = await cvd.compare.region({
  name: "cta",
  left: leftPage.locator("#cta"),
  right: rightPage.locator("#cta"),
  threshold: 30,
  inspect: "rich",
  outDir: "artifacts/cta",
  styleProps: ["font-size", "line-height", "color"],
  attributes: ["class"],
})

await comparison.artifacts.write("artifacts/cta", ["json", "markdown"])
return comparison.summary()
```

This replaces our previous shell/subprocess bridge plan.

### 2. Collected selections

The docs define an immutable `CollectedSelectionData` model:

```js
const selected = await page.locator("#cta").collect({ inspect: "rich" })
```

Important profiles:

```text
minimal — status/existence/visibility/bounds
rich    — text, common computed styles, attributes, bounds
debug   — HTML, all computed styles, all attributes
```

This model is useful because it separates live page querying from later comparison/reporting.

### 3. `cvd.compare.selections(...)`

This compares two already-collected selections:

```js
const left = await leftPage.locator("#cta").collect({ inspect: "rich" })
const right = await rightPage.locator("#cta").collect({ inspect: "rich" })

const comparison = await cvd.compare.selections(left, right, {
  threshold: 30,
  styleProps: ["font-size", "line-height", "color"],
  attributes: ["class", "data-state"],
})
```

This is the lower-level primitive for scripts that want custom collection, filtering, or reuse.

### 4. `SelectionComparison` query/report/artifact methods

The comparison handle exposes:

```js
comparison.pixel.summary()
comparison.bounds.diff()
comparison.styles.diff(["font-size", "color"])
comparison.attributes.diff(["class"])
comparison.report.markdown()
comparison.artifacts.write(outDir, ["diffComparison", "json", "markdown"])
comparison.summary()
comparison.toJSON()
```

This is much better than parsing CLI output.

### 5. `cvd.image.diff(...)`

The image diff primitive is also public:

```js
const pixels = await cvd.image.diff({
  left: "artifacts/left.png",
  right: "artifacts/right.png",
  threshold: 30,
  diffOnlyPath: "artifacts/diff_only.png",
  diffComparisonPath: "artifacts/diff_comparison.png",
})
```

This is useful for custom screenshot pipelines, but for Pyxis page-section comparisons `cvd.compare.region(...)` is the better first API.

### 6. Catalog comparison recording

Catalogs can now record comparisons:

```js
catalog.record(comparison, {
  slug: "cta-comparison",
  name: "CTA comparison",
  url: leftUrl,
  selector: "#cta",
})
```

This means our future `compare-page` / `compare-all` commands can produce catalog manifests and indexes directly from comparison handles.

## Script changes made

### New docs capture script

Added:

```text
scripts/07-capture-new-flexible-js-api-docs.sh
```

Purpose:

- capture the current `css-visual-diff help` docs,
- make the experiment replayable,
- preserve the exact docs used for this report.

### New compare-section smoke script

Added:

```text
scripts/08-smoke-new-api-compare-section.sh
```

Purpose:

- exercise the new API through our userland verb,
- compare Archive content directly with `cvd.compare.region(...)`,
- write artifacts under:

```text
various/05-new-api-compare-section/archive-content/
```

### Updated `scripts/lib/compare-region.js`

Before:

- generated a shell command for the built-in compare-region verb,
- documented that execution was blocked by missing `child_process`.

After:

- still provides `planCompareSection(...)` for compatibility/debugging,
- adds `compareSection(...)` using `cvd.compare.region(...)`,
- waits for both selectors with `page.prepare({ waitFor })`,
- writes JSON/Markdown comparison artifacts,
- wraps generated Markdown with docmgr frontmatter,
- returns compact structured rows for automation.

### Updated `scripts/verbs/pyxis-pages.js`

Added verb:

```text
pyxis pages compare-section <page> <section>
```

Example:

```bash
css-visual-diff verbs \
  --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts \
  pyxis pages compare-section archive content \
  --outDir ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/various/05-new-api-compare-section/archive-content \
  --threshold 30 \
  --inspect rich \
  --output json
```

## Experiment results

### Archive content comparison

Command:

```bash
ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/08-smoke-new-api-compare-section.sh
```

Output directory:

```text
various/05-new-api-compare-section/archive-content/
```

Artifacts:

```text
01-compare-report.md
compare.json
compare-section-output.json
diff_comparison.png
diff_only.png
left_region.png
right_region.png
```

Validated pixel result:

```text
changedPercent: 7.128146453089244
changedPixels: 102172
totalPixels: 1433360
normalized size: 920 x 1558
```

This matches both previous baselines:

```text
YAML Archive content:                 7.1281%
Built-in script compare region smoke: 7.128146453089244%
New cvd.compare.region userland verb: 7.128146453089244%
```

### Bounds result

The new comparison also exposes bounds deltas directly:

```json
{
  "changed": true,
  "delta": {
    "height": -118.9375,
    "width": 0,
    "x": 0,
    "y": 61
  },
  "left": {
    "height": 1558.03125,
    "width": 920,
    "x": 0,
    "y": 0
  },
  "right": {
    "height": 1439.09375,
    "width": 920,
    "x": 0,
    "y": 61
  }
}
```

This is exactly the kind of semantic signal that was hard to extract from plain `pixeldiff.md`.

### Style and attribute changes

The generated `compare.json` includes structured changed styles and attributes. For Archive content, examples include:

```text
color: rgb(31, 30, 28) -> rgb(26, 26, 24)
font-family: Inter, sans-serif -> Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
font-size: 16px -> 14px
line-height: normal -> 21px
padding-bottom: 0px -> 72px
```

Attributes show React-specific page metadata:

```text
class: pyxis-public-page pyxis-archive-page
data-page: archive
```

## What failed / what needed adjustment

### 1. Storybook selector race without explicit wait

The first rerun occasionally produced a missing right selector:

```json
"right": {
  "exists": false,
  "visible": false,
  "selector": "[data-page='archive']"
}
```

Fix:

```js
await page.prepare({
  type: 'script',
  waitFor: 'document.querySelector("...")',
  waitForTimeoutMs: 30000,
  script: 'void 0',
  afterWaitMs: 500,
})
```

Lesson: even with a good comparison primitive, project scripts should explicitly wait for meaningful page selectors, especially with Storybook + MSW + RTK Query.

### 2. `page.prepare` requires a non-empty script

Attempting to use `page.prepare` only as a wait helper with an empty script failed:

```text
PrepareError: prepare target "archive-prototype": script prepare requires script or script_file
```

Fix:

```js
script: 'void 0'
```

### 3. Shell `tee` redirection footgun repeated

Running:

```bash
script.sh | tee "$OUT/compare-section-output.json"
```

failed if `$OUT` was created inside `script.sh`, because `tee` opens the output file before the script creates the directory.

Fix: create the directory before piping/redirecting, or let the script write files internally.

### 4. Artifact names from `comparison.artifacts.write(...)`

The output directory contains:

```text
compare.json
compare.md
diff_comparison.png
diff_only.png
left_region.png
right_region.png
```

But `comparison.toJSON().artifacts` currently listed the PNG artifacts, not separate `json` / `markdown` artifact entries. The wrapper therefore returns `diffComparisonPath` and `diffOnlyPath` reliably from pixel data, while `artifactJson` / `artifactMarkdown` are blank in the compact summary.

This is not a blocker, just a report-shape detail to account for.

## Workflow impact

### Previous workflow

Before the flexible API, Pyxis had three imperfect options:

1. run official YAML configs,
2. call the built-in compare-region CLI from shell,
3. generate command plans from JS but not execute them.

The blocker was that custom JS verbs could not spawn subprocesses and did not have a public pixel comparison primitive.

### Updated workflow

Now a custom Pyxis verb can do the whole region comparison in-process:

```text
registry lookup
  -> browser.page prototype
  -> browser.page Storybook
  -> wait for selectors
  -> cvd.compare.region
  -> comparison.artifacts.write
  -> compact JSON row
```

This is the workflow we wanted.

## Revised opinion on maintainer requests

The previous top maintainer ask was:

```text
Expose a JS-callable pixel comparison primitive.
```

That request is now essentially satisfied by:

```js
cvd.compare.region(...)
cvd.compare.selections(...)
cvd.image.diff(...)
```

The maintainer-request document should be revised if it is shared externally. The new emphasis should be:

1. Thank/confirm that the key primitive exists.
2. Ask for small ergonomic improvements and documentation clarifications rather than a missing core primitive.
3. Preserve the `child_process` finding only as context, not as a blocker.

Remaining useful requests:

- clarify artifact names returned by `comparison.toJSON().artifacts` after `artifacts.write(["json", "markdown"])`,
- provide examples of selector wait/preflight patterns before `cvd.compare.region`,
- document whether `script: 'void 0'` is the recommended no-op `page.prepare` pattern,
- expose or document a helper for waiting on selectors without requiring a prepare script,
- add convenience examples for multi-section catalog loops,
- optionally provide style property presets / normalization hooks later.

## Technical assessment

### What is good

The new API is a major improvement. It solves the exact missing primitive we had identified through implementation pressure.

Strengths:

- API shape matches the mental model: collect selections, compare selections, write artifacts.
- `cvd.compare.region` is concise and powerful.
- Pixel, bounds, text, style, and attribute differences are unified in one comparison object.
- The built-in verb dogfoods the public API, which is a strong maintainability signal.
- Artifact writing is straightforward.
- Catalog comparison recording now looks feasible for future `compare-page` / `compare-all` commands.

### What still needs userland code

Pyxis still needs its own library for:

- target registry,
- Storybook/prototype URL conventions,
- page/section selectors,
- policy bands,
- report formatting,
- accepted differences,
- stable output paths,
- task/diary integration.

The new API does not remove the need for the Pyxis userland library; it makes the library much cleaner.

### What should change in our implementation plan

The old Phase 4 blocker should be replaced with a real implementation path:

```text
pyxis pages compare-section      implemented with cvd.compare.region
pyxis pages compare-page         loop over registry sections + catalog.record
pyxis pages compare-all          loop over pages + aggregate policy
```

The shell command planner can remain as a compatibility/debug command, but it should no longer be the primary path.

## Recommendation

Adopt the new flexible JS API immediately for Pyxis userland comparison commands.

Next implementation steps:

1. Promote `pyxis pages compare-section` from smoke to normal workflow command.
2. Implement `pyxis pages compare-page` using `cvd.compare.region` for each registered section.
3. Add `cvd.catalog.create(...)` to write `manifest.json` and `index.md` for page runs.
4. Update the maintainer-request doc to mark the core primitive request as satisfied and focus on ergonomic/reporting clarifications.
5. Continue using YAML official runs as compatibility baseline until JS compare-page/compare-all has matched several page results.

## Bottom line

The new API is exactly the right direction. It turns `css-visual-diff` from a CLI with JavaScript wrappers into a scriptable visual comparison toolkit. For Pyxis, it eliminates the biggest architectural blocker and lets the userland library become what it should be: project-specific registry, policy, and reporting glue around solid core browser/image comparison primitives.


## Beta ergonomics follow-up update

After this report was first written, css-visual-diff landed the scoped beta ergonomics follow-up for JavaScript visual workflows. The changes directly address the remaining high-priority friction points from the Pyxis experiment:

- `locator.waitFor(options)` and `page.waitForSelector(selector, options)` replace the awkward `page.prepare({ waitFor, script: 'void 0' })` workaround.
- `comparison.artifacts.write(outDir, ['json', 'markdown'])` now returns stable keyed artifact paths: `json`, `markdown`, `leftRegion`, `rightRegion`, `diffOnly`, `diffComparison`, and `written`.
- The multi-section catalog example landed as `examples/verbs/compare-page-catalog.js`.
- The collection profile docs now explain `minimal`, `rich`, and `debug`, and clarify that `styleProps` and `attributes` are collection-time filters.

I updated the Pyxis userland `compare-section` implementation to use `locator.waitFor(...)` and the stable artifact write result. The Archive content smoke still reproduces the same pixel result:

```text
changedPercent: 7.128146453089244
changedPixels: 102172
```

The compact stdout row now includes direct artifact links from the write result:

```text
artifactJson
artifactMarkdown
leftRegionPath
rightRegionPath
diffOnlyPath
diffComparisonPath
writtenArtifacts
```

This changes the remaining maintainer requests again: selector readiness, artifact path metadata, collection profile docs, and multi-section catalog examples are now landed. The only remaining plausible future features are policy-ish abstractions: bounds tolerances, CSS/style normalization, style presets, and small docs examples for frontmatter/policy integration.
