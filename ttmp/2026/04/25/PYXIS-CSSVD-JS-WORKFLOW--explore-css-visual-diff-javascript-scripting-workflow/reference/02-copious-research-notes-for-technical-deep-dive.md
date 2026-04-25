---
Title: Copious research notes for technical deep dive
Ticket: PYXIS-CSSVD-JS-WORKFLOW
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
RelatedFiles: []
ExternalSources:
    - css-visual-diff help pixel-accuracy-scripting-guide
    - css-visual-diff help javascript-api
    - css-visual-diff help javascript-verbs
    - css-visual-diff help inspect-workflow
Summary: "Detailed research notes, narrative hooks, quotes, observations, and evidence for a future technical deep dive on css-visual-diff JavaScript scripting in Pyxis."
LastUpdated: 2026-04-25T07:35:00-04:00
WhatFor: "Use as raw material for a technical deep dive blog post and for resuming experiments with full context."
WhenToUse: "When writing the blog post, designing follow-up scripts, or explaining why Pyxis moved from YAML-only visual diffs toward JS-scripted workflows."
---

# Copious Research Notes for Technical Deep Dive

## Goal

Preserve raw, detailed research notes for a future technical deep dive blog post about applying `css-visual-diff` JavaScript scripting to the Pyxis prototype-to-React visual parity workflow.

This is intentionally more verbose than a normal implementation note. The point is to save the “thinking trail”: what hurt in the previous workflow, what the new API enables, which experiments proved something, where we failed, and what story we can tell later.

## Context

Before this ticket, Pyxis had already built a bottom-up visual parity workflow:

1. Prototype atoms/molecules/organisms were compared against `pyxis-components` Storybook on port `6006`.
2. Public site components were extracted into reusable, tokenized CSS modules with `data-pyxis-component` / `data-pyxis-part` selectors.
3. `pyxis-user-site` migrated to RTK Query and shared `pyxis-types`.
4. Public pages were rebuilt from canonical components and compared against standalone prototype pages:
   - Shows,
   - ShowDetail,
   - Archive,
   - Book/BookSuccess,
   - About.
5. Page-level YAML configs were added under:

```text
prototype-design/visual-diff/comparisons/public-pages/
```

6. Phase 7 manually summarized page-level pixel diffs into:

```text
ttmp/2026/04/24/PYXIS-PUBLIC-PAGES--build-public-site-pages-from-component-system/reference/02-page-level-visual-diff-report.md
```

The workflow works, but it is configuration-heavy and report-heavy. JavaScript scripting might let us keep the reliable pieces while reducing repetition.

## Main tutorial thesis

The `pixel-accuracy-scripting-guide` says pixel accuracy is a loop:

```text
render -> locate -> extract -> compare -> report -> adjust
```

That is the right abstraction for the blog post.

A static screenshot is only one artifact inside the loop. The powerful shift is making each step programmable.

### Blog-post phrasing candidate

> Screenshots tell you that something changed. Scripts can tell you whether you were looking at the right thing, which CSS facts changed, which changes are expected, and where the human should look next.

## The key conceptual split: locators vs probes

The tutorial makes a crucial distinction:

- A **locator** is bound to a live page. It asks: “On this rendered page, find this selector and tell me what is there?”
- A **probe** is a reusable recipe. It asks: “Whenever I inspect a page, call this thing by this name, use this selector, and extract these facts.”

This maps beautifully to frontend tuning:

- While debugging: use locators.
- Once a contract stabilizes: use probes.

### Pyxis example

Locator-level question:

```text
Does `[data-section='shows-list']` exist in the Storybook iframe right now, and what are its bounds?
```

Probe-level contract:

```text
For the Shows page header, extract title text, bounds, font family, font size, line height, color, and margin/padding.
```

### Blog-post phrasing candidate

> The first mistake in visual testing is comparing pixels before proving the selector. A pixel-perfect screenshot of the wrong element is worse than no screenshot: it is confidently misleading.

## Why YAML got us far

Important: the blog post should not dunk on YAML. YAML was the right first tool.

YAML gave us:

- reviewable declarative configs,
- stable output directories,
- reproducible full runs,
- a shared language for original/react targets,
- a way to grow coverage quickly.

The issue is that once we had many configs, repeated patterns became workflow tax:

- same viewport repeated,
- same Storybook iframe URL patterns repeated,
- same prepare snippets repeated,
- same output conventions repeated,
- same report copy/paste repeated,
- same selector policies repeated.

### Blog-post phrasing candidate

> YAML was excellent for declaring comparisons. It was less excellent at answering the next question: “Given forty comparisons, which one should I tune first and why?”

## What JavaScript changes

JavaScript verbs can encode:

- registries,
- loops,
- authoring vs CI policy,
- filtered reports,
- conditional failure behavior,
- generated target matrices,
- compact semantic snapshots,
- catalog manifests.

The key improvement is not “JS instead of YAML”. It is “executable visual workflow instead of static visual declarations”.

### Potential final position

Use both:

- YAML remains official where stable and valuable.
- JS wraps/summarizes YAML and handles authoring workflows.
- JS-first comparisons replace YAML where the YAML is mostly boilerplate.

## Pyxis selector strategy was the prerequisite

The JS workflow is only viable because Pyxis now has stable selectors:

```text
data-page
data-section
data-pyxis-component
data-pyxis-part
```

Without these selectors, JS scripts would be brittle and would reach into incidental class names or DOM structures.

### Blog-post phrasing candidate

> The real automation boundary was not the test runner; it was the selector contract. Once pages and components exposed stable visual semantics, the scripts became small.

## Current public page diff baseline

From the public pages Phase 7 report:

| Page | Section | Changed % | Interpretation |
| --- | --- | ---: | --- |
| Shows | shows-list | 66.8566% | Major mismatch, tune first. |
| Shows | mailing-list | 51.2191% | Major layout/position delta. |
| Shows | header | 51.0775% | Header exists but not tuned. |
| Shows | page | 50.5245% | First composition pass only. |
| Shows | content | 49.0940% | First composition pass only. |
| Show detail | content | 24.4647% | Moderate residual. |
| Show detail | page | 18.5282% | Needs detail spacing/aside tuning. |
| Archive | content | 7.1281% | Closest to acceptance. |
| Archive | page | 6.6511% | Strong first pass. |
| Book | content | 14.5896% | Moderate residual. |
| Book | page | 12.1006% | Moderate residual. |
| About | content | 20.4334% | Moderate residual. |
| About | page | 18.2795% | Moderate residual. |

These numbers are useful for threshold-policy experiments.

## Experiment evidence collected so far

### Docs capture

Script:

```text
scripts/01-capture-cssvd-js-help.sh
```

Captured files:

```text
sources/css-visual-diff-help/pixel-accuracy-scripting-guide.txt
sources/css-visual-diff-help/javascript-api.txt
sources/css-visual-diff-help/javascript-verbs.txt
sources/css-visual-diff-help/inspect-workflow.txt
```

Line counts:

```text
130 inspect-workflow.txt
563 javascript-api.txt
336 javascript-verbs.txt
388 pixel-accuracy-scripting-guide.txt
1417 total
```

Interpretation:

- The docs are extensive enough to support a tutorial-style post.
- The API is designed around repository-scanned verbs, not one-off Node scripts.

### JS verb discovery smoke

Script:

```text
scripts/02-smoke-cssvd-js-verb.js
```

Command:

```bash
css-visual-diff verbs \
  --repository ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/scripts \
  pyxis workflow summarize-targets \
  --output json
```

Result:

- Succeeded.
- Proved ticket-local script repository works.
- Output contains current public page targets and priorities.

Lesson:

- We can safely experiment in a docmgr ticket without changing permanent repo tooling.

### Built-in compare-region smoke

Script:

```text
scripts/03-run-built-in-compare-region-smoke.sh
```

Command compares:

```text
leftUrl:  http://localhost:7070/standalone/public/archive.html
rightUrl: http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story
leftSelector:  #root > *
rightSelector: [data-page='archive']
viewport: 920 x 1460
```

Output files:

```text
various/03-built-in-compare-region/archive-content/compare.json
various/03-built-in-compare-region/archive-content/01-compare-report.md
various/03-built-in-compare-region/archive-content/diff_comparison.png
various/03-built-in-compare-region/archive-content/diff_only.png
various/03-built-in-compare-region/archive-content/run-output.json
various/03-built-in-compare-region/archive-content/url1_full.png
various/03-built-in-compare-region/archive-content/url1_screenshot.png
various/03-built-in-compare-region/archive-content/url2_full.png
various/03-built-in-compare-region/archive-content/url2_screenshot.png
```

Pixel result:

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

Comparison to YAML:

- Existing YAML Archive `content` diff: `7.1281%`.
- JS built-in compare-region diff: `7.128146453089244%`.
- This proves at least one YAML section can be reproduced by the JS verb path.

Lesson:

- Direct JS verbs are viable for simple one-section page comparisons.
- The built-in output is rich but verbose; Pyxis-specific wrappers should provide concise summaries.

Failure captured:

The first invocation redirected stdout into a file under a directory the script would create. Shell redirection happens before script execution, so it failed:

```text
No such file or directory
```

Lesson:

- Either create output directories before redirecting stdout, use command `--output-file`, or have JS scripts write structured artifacts directly.

## Specific API notes from `javascript-api`

### `cvd.browser()`

Creates a Chromium-backed browser service. Always close in `finally`.

Blog-post teaching point:

> Browser lifecycle bugs are boring but expensive. Close the browser in `finally` before doing anything clever.

### `browser.page(url, options)`

Useful options:

```js
{
  viewport: { width: 920, height: 1460 },
  waitMs: 1000,
  name: "archive-prototype",
}
```

### `page.prepare(spec)`

Important because our YAML configs currently use prepare snippets. JS can express equivalent behavior.

Two interesting prepare types:

- `script`
- `directReactGlobal`

`directReactGlobal` may matter for future component fixture rendering without Storybook if prototype pages expose global React components.

### `page.preflight(probes)`

Critical for authoring vs CI policy.

Authoring mode:

- record missing selectors,
- continue,
- generate a report.

CI mode:

- fail on required missing selectors.

### `page.inspectAll(probes, options)`

Writes artifacts for multiple probes against one prepared page.

Potential Pyxis use:

- inspect every major section of a page,
- write HTML/CSS/PNG bundles,
- add results to a catalog.

### `page.locator(selector)`

Best for quick troubleshooting. Locator methods:

```text
status()
exists()
visible()
text()
bounds()
computedStyle(props)
attributes(names)
```

Potential Pyxis command:

```bash
css-visual-diff verbs --repository ... pyxis pages inspect-section shows header --output yaml
```

### `cvd.probe(name)`

Best for reusable visual contracts.

Potential Pyxis probe categories:

- page shell,
- public page header,
- section wrapper,
- component root,
- component part.

### `cvd.snapshot(page, probes)`

Good for compact JSON facts. Does not write artifacts unless told through other APIs.

This is ideal for fast loops between CSS edits.

### `cvd.diff(before, after, options)`

Currently deterministic structural JSON diff. It supports `ignorePaths`.

Important caveat:

- CSS-aware normalization and numeric tolerances may need to be layered later.

### `cvd.catalog(options)`

Promising for review workflows.

Potential Pyxis catalog title:

```text
Pyxis Public Page Visual Parity Catalog
```

Potential outputs:

```text
manifest.json
index.md
artifacts/<page-section>/...
```

### `cvd.loadConfig(path)`

Important for migration safety.

This lets scripts load existing YAML configs and derive targets/probes rather than duplicating everything.

## Specific API notes from `javascript-verbs`

### Scripts are scanned statically

Supported sentinels:

```text
__package__({...})
__section__("slug", {...})
__verb__("functionName", {...})
doc`...`
```

Metadata must be static literal JS.

Implication:

- CLI schema cannot be generated dynamically.
- Dynamic target registries belong inside function bodies or imported helpers.

### Commands live under `verbs`

This is the supported shape:

```bash
css-visual-diff verbs --repository ./scripts pyxis pages compare archive
```

not:

```bash
css-visual-diff pyxis pages compare archive
```

### Binding modes

Useful binding modes:

- positional/default binding,
- `bind: "all"`,
- `bind: "context"`,
- section binding.

For Pyxis scripts, `bind: "all"` is probably best for commands with policy flags like `failOnMissing`, `artifactFormat`, and `viewport`.

### Built-in catalog commands

Important built-ins:

```bash
css-visual-diff verbs catalog inspect-page ...
css-visual-diff verbs catalog inspect-config ...
```

`inspect-config` can load existing YAML and inspect original or React sides into a catalog.

This may be a low-effort bridge before custom scripts.

## Specific API notes from `inspect-workflow`

The recommended debugging order:

1. Capture prepared root HTML.
2. Capture screenshot crop.
3. Capture computed CSS Markdown/JSON.
4. Run full comparison.

This exactly matches the hard lessons from earlier visual parity work: selector problems must be fixed before pixel tuning.

### Blog-post phrasing candidate

> The workflow became reliable when we stopped treating a failed diff as a visual problem. Most failed diffs begin as target, prepare, or selector problems.

## Proposed blog post outline

Working title options:

1. **From YAML Screenshots to Programmable Visual Debugging**
2. **Pixel Accuracy Is a Feedback Loop**
3. **Building a Visual Parity Workflow with Storybook, Stable Selectors, and css-visual-diff JavaScript Verbs**
4. **When Screenshot Diffs Need a Programming Language**

### Outline

1. **The problem**
   - Prototype and React implementation drift.
   - Screenshots alone are not enough.
   - Pyxis had components and pages moving at the same time.

2. **The first working system: YAML visual diffs**
   - Standalone prototype pages.
   - Storybook iframes.
   - `data-page` / `data-section` selectors.
   - Pixel diff reports.

3. **The scaling pain**
   - Repeated configs.
   - Manual summaries.
   - Hard to ask semantic questions.
   - Authoring vs CI policy mixed together.

4. **The new mental model**
   - render, locate, extract, compare, report, adjust.
   - locators vs probes.
   - snapshots vs inspect artifacts.

5. **First experiment: ticket-local JS verbs**
   - Show `__package__`, `__verb__`.
   - Show `summarize-targets` output.

6. **Second experiment: Archive without YAML**
   - Built-in compare-region command.
   - Same `7.1281%` result as YAML.
   - Artifact list.
   - What this proves and does not prove.

7. **Designing a Pyxis registry**
   - One source of truth for pages/story IDs/selectors/viewports.
   - Desktop/mobile target generation.

8. **Semantic probes for better tuning**
   - Why changed percent is insufficient.
   - Probes for typography, spacing, bounds, text.
   - Snapshot diffs.

9. **Catalogs for review**
   - Durable artifacts.
   - Human-friendly index.
   - CI and design-review evidence.

10. **Migration strategy**
    - Keep YAML where stable.
    - Wrap/summarize YAML first.
    - JS-first for authoring and generated matrix checks.

11. **Conclusion**
    - Pixel accuracy as an engineering loop.
    - Stable selectors as the foundation.
    - JS scripting as workflow glue.

## Quotable conclusions so far

- “Screenshots tell you that something changed; probes tell you what changed.”
- “A visual-diff config is a map. A visual-diff script is a route planner.”
- “The biggest win was not replacing YAML with JavaScript. It was making our visual questions executable.”
- “Stable selectors are the API between design intent and automated visual inspection.”
- “The Archive page was our proof point: one JavaScript command reproduced the YAML diff, wrote artifacts, and returned structured data.”

## Risks and caveats

### Risk: JS scripts become another source of truth

Mitigation:

- Start with `cvd.loadConfig` interop.
- Use one page registry only after shape stabilizes.
- Keep docs clear about official vs exploratory outputs.

### Risk: computed CSS output is too noisy

Mitigation:

- Use narrow property allowlists for project probes.
- Keep full computed artifacts only in catalog/bundle mode.

### Risk: pixel-diff primitives may not cover full YAML run shape yet

Mitigation:

- Use built-in verbs for single regions.
- Use YAML `run` for official multi-section configs until custom JS can match it.

### Risk: output directories become polluted

Mitigation:

- Keep ticket experiment outputs under `ttmp/.../various/`.
- Do not commit generated `prototype-design/visual-comparisons/` outputs unless explicitly requested.

## Follow-up questions for future experiments

1. Can a custom JS verb call the same pixel comparison primitive as `verbs script compare region`, or is that only available through built-in scripts?
2. How well does `cvd.loadConfig` represent prepare scripts and output dirs from our current YAML?
3. Can `inspect-config` replace our manual CSS/HTML debugging loop immediately?
4. Should the page registry know about component-level configs too?
5. How should accepted differences be stored when JS scripts generate the checks?
6. Can we make report generation deterministic enough for CI snapshots?
7. What artifact set is right for blog screenshots: full page, cropped section, diff comparison, or inspect CSS Markdown?

## Artifact paths worth preserving

Docs:

```text
sources/css-visual-diff-help/pixel-accuracy-scripting-guide.txt
sources/css-visual-diff-help/javascript-api.txt
sources/css-visual-diff-help/javascript-verbs.txt
sources/css-visual-diff-help/inspect-workflow.txt
```

Scripts:

```text
scripts/01-capture-cssvd-js-help.sh
scripts/02-smoke-cssvd-js-verb.js
scripts/03-run-built-in-compare-region-smoke.sh
```

First meaningful artifact bundle:

```text
various/03-built-in-compare-region/archive-content/
```

Design guide:

```text
design/01-css-visual-diff-javascript-workflow-experiment-guide.md
```

Diary:

```text
reference/01-exploration-diary.md
```

## Immediate next experiment recommendation

Implement:

```text
scripts/04-report-public-page-yaml-results.js
```

Reason:

- It directly improves the work we just did by replacing manual Phase 7 report generation.
- It uses YAML interop, which is the safest migration bridge.
- It creates blog-post material showing the transition from static configs to scripted summaries.

Second priority:

```text
scripts/06-inspect-public-page-section.js
```

Reason:

- It will support Shows tuning, which is the biggest remaining visual mismatch.
