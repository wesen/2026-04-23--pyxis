---
Title: Prototype-design visual diff cleanup analysis, design, and implementation guide
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
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
    - Path: prototype-design/screens/ppxis.jsx
      Note: Prototype public-page implementation where stable data-page/data-section selectors should be added
    - Path: prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
      Note: Representative native css-visual-diff config to classify as compatibility or generated from spec
    - Path: prototype-design/visual-diff/userland/README.md
      Note: Promoted userland workflow overview that the cleanup should preserve and refine
    - Path: prototype-design/visual-diff/userland/lib/compare-region.js
      Note: Core compare-section/page/all/spec orchestration implementation
    - Path: prototype-design/visual-diff/userland/lib/registry.js
      Note: Current duplicated target registry that should become a loader or compatibility adapter
    - Path: prototype-design/visual-diff/userland/lib/snapshot.js
      Note: Phase 6 semantic snapshot and snapshot-diff implementation
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Current working visual suite spec and likely future source of truth
ExternalSources: []
Summary: Intern-facing guide for consolidating Pyxis prototype-design visual comparison workflows around the promoted css-visual-diff JavaScript userland layer and suite specs.
LastUpdated: 2026-04-25T18:20:00-04:00
WhatFor: Use this as the implementation plan for a full cleanup of prototype-design, visual-diff scripts, specs, legacy configs, generated artifacts, and documentation.
WhenToUse: Read before editing prototype-design/visual-diff, promoted CSSVD JS userland scripts, public prototype selectors, or page-level visual parity workflows.
---


# Prototype-design Visual Diff Cleanup: Analysis, Design, and Implementation Guide

## 0. Purpose of this document

This document is for a new intern joining the Pyxis visual parity work. The goal is not only to say which files to move. The goal is to build a mental model of the system: what `prototype-design` is, why `css-visual-diff` is used, what Storybook is doing in the loop, what the promoted JavaScript userland layer provides, and how to clean the folder structure without breaking the visual comparison workflow.

The cleanup should leave the repo with solid foundations for future visual tuning. At the moment, the project has several generations of visual-diff work living side by side. That is expected after a prototype-to-production migration: first we collected screenshots, then we wrote native `css-visual-diff` YAML configs, then we added Storybook fixtures, then we promoted a JavaScript workflow layer that can compare sections, pages, suites, and semantic snapshots. Each layer solved a real problem. The cleanup task is to preserve the useful parts, make the current architecture explicit, and remove or quarantine the paths that would confuse the next developer.

The target result is simple to describe:

> Pyxis visual parity should have one canonical visual-suite source of truth, one promoted JavaScript execution layer, one clear generated-artifact policy, stable selectors in prototypes and React pages, and documentation that lets a new developer run the workflow without reading the entire historical ticket trail.

This guide explains how to get there.

## 1. The system in one picture

The current visual workflow compares two renderings of the same UI:

1. The **prototype side**, served from `prototype-design/standalone/...` on port `7070`.
2. The **React side**, rendered through Storybook, usually on port `6007` for the public site and `6006` for component-level stories.

`css-visual-diff` opens both pages in a browser, waits for selectors, captures regions, compares pixels, optionally inspects CSS/DOM state, and writes artifacts. Pyxis adds project-specific organization on top: page inventories, policy bands, accepted differences, catalogs, suite summaries, and semantic snapshots.

```text
                          ┌─────────────────────────────────────┐
                          │ prototype-design/standalone/public  │
                          │ HTML + prototype React scripts      │
                          │ served at http://localhost:7070     │
                          └─────────────────┬───────────────────┘
                                            │ original selectors
                                            │
┌─────────────────────┐       ┌─────────────▼──────────────┐       ┌──────────────────────────┐
│ visual suite spec   │       │ css-visual-diff JS userland │       │ user-site Storybook      │
│ *.visual.yml        │──────▶│ compare/spec/snapshot verbs │◀──────│ iframe on localhost:6007 │
│ page/section data   │       │ policy + catalogs + reports │       │ React page stories       │
└─────────────────────┘       └─────────────┬──────────────┘       └──────────────────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────────┐
                          │ prototype-design/visual-comparisons │
                          │ generated PNG/JSON/Markdown outputs │
                          │ ignored unless explicitly requested │
                          └─────────────────────────────────────┘
```

The cleanup should strengthen this picture. If a file does not fit into one of these boxes, we should classify it carefully: source, compatibility fixture, historical evidence, or generated output.

## 2. Vocabulary and concepts

### 2.1 Prototype

A prototype is a standalone rendering of the original design. In this repo, public-site prototypes live under:

```text
prototype-design/standalone/public/
  shows.html
  detail.html
  archive.html
  book.html
  about.html
```

These pages load prototype scripts such as:

```text
prototype-design/lib/components.jsx
prototype-design/screens/ppxis.jsx
prototype-design/lib/tokens.js
prototype-design/lib/data.js
```

The prototype is not the production React implementation. It is the baseline design that React should visually match. It may use inline styles, different component names, and simplified data. That is fine. What matters is that visual comparisons select equivalent regions on both sides.

### 2.2 React/Storybook side

The production/public React implementation is rendered through Storybook. For public pages, the relevant Storybook is usually:

```text
http://localhost:6007
```

The public page stories live at:

```text
web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
```

The React pages being compared include:

```text
web/packages/pyxis-user-site/src/pages/Shows.tsx
web/packages/pyxis-user-site/src/pages/ShowDetail.tsx
web/packages/pyxis-user-site/src/pages/Archive.tsx
web/packages/pyxis-user-site/src/pages/Book.tsx
web/packages/pyxis-user-site/src/pages/About.tsx
```

The React component package lives at:

```text
web/packages/pyxis-components/src/public/
```

### 2.3 Stable selectors

Stable selectors are the contract between design/prototype, React, and the visual-diff tool. We use:

```text
data-page="shows"
data-section="shows-header"
data-section="shows-list"
data-section="mailing-list"
data-pyxis-component="show-grid"
data-pyxis-part="root"
```

Use stable data attributes for comparisons. Avoid brittle selectors such as:

```text
#root > *
main > div:nth-child(2)
```

A brittle selector may work today, but it stops describing intent as soon as the DOM changes. A stable selector says what the region means.

### 2.4 Native css-visual-diff config

Native configs are YAML files consumed by:

```bash
css-visual-diff run --config path/to/file.css-visual-diff.yml
```

Example:

```text
prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
```

These files are low-level runner configs. They describe URLs, selectors, output paths, and modes for `css-visual-diff run`.

### 2.5 Pyxis visual suite spec

The new suite spec is consumed by the promoted JavaScript userland verbs through `objectFromFile`:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

This spec is higher-level. It describes pages, story IDs, prototype paths, section selectors, priorities, baseline diffs, and eventually accepted differences and policy.

### 2.6 Generated artifacts

Generated artifacts are comparison outputs: PNGs, JSON reports, Markdown summaries, catalogs, prepared HTML, etc. They should generally live under:

```text
prototype-design/visual-comparisons/
```

This path is ignored by `.gitignore`. Do not commit generated artifacts unless the reviewer explicitly asks for them. Generated outputs are evidence, not source.

## 3. Current important files and directories

### 3.1 `prototype-design/standalone/public`

Purpose: public-page prototype entry points.

```text
prototype-design/standalone/public/shows.html
prototype-design/standalone/public/detail.html
prototype-design/standalone/public/archive.html
prototype-design/standalone/public/book.html
prototype-design/standalone/public/about.html
```

Each HTML page creates a root element and renders a prototype React component. For example, `shows.html` renders:

```jsx
function StandalonePage() {
  return <PPXDesktop page="shows" />;
}
```

The actual page structure comes from `prototype-design/screens/ppxis.jsx`.

### 3.2 `prototype-design/screens/ppxis.jsx`

Purpose: public-site prototype screen/component definitions.

Important functions:

```text
PPXShell
PPXDesktop
PPXMobile
ShowsPage
ShowDetail
ArchivePage
BookUsPage
AboutPage
PageHeader
ShowTile
```

This file is the right place to add stable prototype selectors such as `data-page` and `data-section`, as long as the selectors do not distort the visual design.

### 3.3 `prototype-design/visual-diff/userland`

Purpose: promoted Pyxis JavaScript workflow layer around `css-visual-diff`.

Important files:

```text
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
prototype-design/visual-diff/userland/lib/registry.js
prototype-design/visual-diff/userland/lib/compare-region.js
prototype-design/visual-diff/userland/lib/snapshot.js
prototype-design/visual-diff/userland/lib/normalizers.js
prototype-design/visual-diff/userland/lib/tolerances.js
```

Run userland verbs with:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages list-targets \
  --output json
```

Optional local direnv discovery is documented in:

```text
.envrc.example
```

### 3.4 `prototype-design/visual-diff/comparisons`

Purpose: older/native `css-visual-diff run` YAML configs.

Important paths:

```text
prototype-design/visual-diff/comparisons/component-system/
prototype-design/visual-diff/comparisons/public-pages/
```

These configs are still useful for native-run compatibility and historical evidence. The cleanup should decide whether they remain hand-maintained, get generated from the new suite spec, or move under a clearly named compatibility folder.

### 3.5 `prototype-design/visual-comparisons`

Purpose: generated artifacts. This path is ignored. It may contain outputs such as:

```text
prototype-design/visual-comparisons/public-pages/shows-desktop/pixeldiff.md
prototype-design/visual-comparisons/cssvd-js/compare-all/public-pages-desktop/01-suite-summary.md
prototype-design/visual-comparisons/cssvd-js/snapshot-section/archive-content/snapshot.json
```

Do not treat this directory as source.

## 4. What is currently confusing

The system works, but it carries historical layers. A new developer could reasonably ask: which file do I edit when a selector is wrong?

At the moment, page/selector data appears in at least three places:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/lib/registry.js
prototype-design/visual-diff/comparisons/public-pages/*.css-visual-diff.yml
```

That is the core cleanup problem.

The current promoted YAML and the JS registry have been proven equivalent for the public page suite. That means the hard-coded registry no longer needs to be a source of truth. It can become a loader/adapter.

The older native `*.css-visual-diff.yml` configs should not be deleted blindly. They still document the previous runner workflow and may be useful for `css-visual-diff run`. But they should not compete with the new suite spec as the canonical page inventory.

## 5. Target architecture after cleanup

The cleanup should create this model:

```text
prototype-design/visual-diff/userland/specs/*.visual.yml
        │
        │ objectFromFile / loader
        ▼
prototype-design/visual-diff/userland/lib/registry.js
        │ normalize targets, pages, sections, policies
        ▼
prototype-design/visual-diff/userland/lib/compare-region.js
        │ compare-section / compare-page / compare-all / compare-spec
        ▼
css-visual-diff JavaScript API
        │ cvd.browser, page.locator, locator.waitFor,
        │ cvd.compare.region, cvd.catalog.create, artifacts.write
        ▼
prototype-design/visual-comparisons/cssvd-js/*
```

The original native configs then become compatibility inputs/outputs:

```text
Pyxis visual suite spec
        │
        ├── JS userland workflow: compare-spec, snapshot-section, diff-snapshots
        │
        └── optional future emitter: generate native *.css-visual-diff.yml configs
```

The key point is that the suite spec owns intent. Native configs can remain as compatibility, but they should not be the primary source of truth for Pyxis orchestration.

## 6. Proposed canonical spec schema

The current spec works, but the cleanup should formalize it. The next version should be explicit about version, defaults, targets, sections, policy, and accepted differences.

Recommended schema shape:

```yaml
schemaVersion: pyxis.visual-suite.v1
name: public-pages
kind: page-suite

defaults:
  variant: desktop
  prototypeBase: http://localhost:7070
  storybookBase: http://localhost:6007
  viewport:
    width: 920
    height: 1460
  waitMs: 1000
  threshold: 30
  inspect: rich
  policy:
    maxChangedPercent: 0
    maxPolicyBand: ""

targets:
  - id: shows
    page: shows
    kind: public-page
    priority: tune-first
    prototype:
      path: /standalone/public/shows.html
      waitFor: "[data-page='shows']"
    storybook:
      storyId: public-site-pages--shows-desktop
      waitFor: "[data-page='shows']"
    sections:
      - id: page
        original: "#root"
        react: "[data-story-frame='pyxis-page-shell']"
        role: page-shell
        stylePreset: pageShell
      - id: content
        original: "[data-page='shows']"
        react: "[data-page='shows']"
        role: content
        stylePreset: pageShell
      - id: header
        original: "[data-section='shows-header']"
        react: "[data-section='shows-header']"
        role: section
        stylePreset: pageShell
    acceptedDifferences:
      - section: content
        kind: css-box-model
        summary: "Prototype uses content-box wrapper while React shell uses border-box."
        expires: null
```

The current `pages:` array can be supported during migration, but the final schema should use `targets:`. The word `target` is broader than page and will work later for component suites, mobile variants, or isolated fixtures.

## 7. API references for the promoted userland layer

### 7.1 Verbs

The public verb file is:

```text
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
```

Important verbs:

```text
pyxis pages list-targets
pyxis pages import-smoke
pyxis pages summarize-results
pyxis pages inspect-section
pyxis pages compare-section-command
pyxis pages compare-section
pyxis pages compare-page
pyxis pages compare-all
pyxis pages compare-spec
pyxis pages snapshot-section
pyxis pages diff-snapshots
```

The cleanup should preserve ergonomic verbs. The change should be where they get data from: the YAML suite spec, not hard-coded registry arrays.

### 7.2 `compare-section`

Intent: compare one section.

Example:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-section archive content \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-section/archive-content \
  --output json
```

Pseudo-flow:

```text
load default spec
find target page=archive variant=desktop
find section name=content
open prototype URL
open Storybook URL
wait for original selector
wait for React selector
run cvd.compare.region
write artifacts
return compact JSON row
```

### 7.3 `compare-page`

Intent: compare all sections for one page and write a catalog.

Pseudo-flow:

```text
target = findPage(page)
catalog = cvd.catalog.create(...)
leftPage = browser.page(target.prototypeUrl)
rightPage = browser.page(target.storybookUrl)
for section in target.sections:
    wait for original selector
    wait for react selector
    comparison = cvd.compare.region(...)
    comparison.artifacts.write(...)
    catalog.record(comparison)
catalog.writeManifest()
catalog.writeIndex()
return page summary
```

### 7.4 `compare-all`

Intent: compare every target in the default suite.

Pseudo-flow:

```text
spec = load default visual suite spec
targets = normalize(spec.targets)
for target in targets:
    run compare-page target
collect all section rows
classify changedPercent into policy bands
write compare-all-output.json
write 01-suite-summary.md
if mode == ci and policy failed:
    throw after writing reports
```

Policy bands currently are:

```text
accepted       <= 1%
review         <= 10%
tune-required  <= 25%
major-mismatch > 25%
```

### 7.5 `compare-spec`

Intent: compare targets from an explicit JSON/YAML spec.

This verb uses `objectFromFile`, so the JS function receives a parsed object:

```js
spec: {
  argument: true,
  type: 'objectFromFile',
  required: true,
  help: 'JSON/YAML visual spec with pages and sections',
}
```

Example:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page archive \
  --output json
```

### 7.6 `snapshot-section`

Intent: collect a semantic report for one section: bounds, selected computed styles, normalized style diffs, and text start.

Useful for diagnosing why a pixel diff exists before tuning CSS.

Example:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section shows header \
  --stylePreset pageShell \
  --output json
```

### 7.7 `diff-snapshots`

Intent: compare two semantic snapshot JSON files across runs.

Example:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages diff-snapshots \
  before/snapshot.json \
  after/snapshot.json \
  --outDir prototype-design/visual-comparisons/cssvd-js/diff-snapshots/shows-header \
  --output json
```

Use this after a tuning change to answer: did the semantic drift improve or worsen?

## 8. Cleanup implementation plan

The cleanup should be done in safe commits. Do not combine schema migration, selector changes, script renames, and legacy deletion in one giant commit. Each commit should have its own validation.

### Phase A: Inventory and classification

Create a reference document listing each major path and its role.

Commands:

```bash
find prototype-design -maxdepth 4 -type f | sort
find prototype-design/visual-diff/userland -maxdepth 3 -type f | sort
find prototype-design/visual-diff/comparisons -type f | sort
git ls-files prototype-design/visual-comparisons | sort
rg "css-visual-diff|visual-diff/userland|visual-comparisons|compare-spec|compare-all" docs prototype-design ttmp -g'*.md' -g'*.sh' -g'*.js' -g'*.yml'
```

Classify files as:

| Class | Meaning | Action |
| --- | --- | --- |
| canonical-source | Future source of truth. | Keep and document. |
| compatibility | Still useful for old/native workflows. | Keep but label clearly. |
| generated | Produced by tools. | Ignore/remove from commits. |
| historical | Useful as ticket evidence. | Keep in ticket/reference/archive, not active paths. |
| obsolete | Superseded and not useful. | Delete after validation. |

Expected classification:

```text
prototype-design/visual-diff/userland/specs/*.visual.yml      canonical-source
prototype-design/visual-diff/userland/lib/*                   canonical-source
prototype-design/visual-diff/userland/verbs/*                 canonical-source
prototype-design/visual-diff/comparisons/**/*.yml             compatibility
prototype-design/visual-comparisons/**                        generated
prototype-design/baseline/sample*/**                          generated/historical, needs review
```

### Phase B: Make the YAML spec canonical

Goal: remove hard-coded selector truth from `lib/registry.js`.

Implementation sketch:

```js
// registry.js
var fs = require('fs')
var yaml = maybeNotAvailable // avoid if css-visual-diff objectFromFile can load for verbs

var DEFAULT_SPEC_PATH = 'prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml'

async function loadDefaultSpec() {
  // If direct YAML parsing is not available in Goja, use JSON sidecar or keep
  // objectFromFile for explicit spec verbs and generate a JS module from spec.
}

function targetsFromSpec(spec) {
  var defaults = spec.defaults || spec
  var rawTargets = spec.targets || spec.pages || []
  return rawTargets.map(function (target) {
    return normalizeTarget(defaults, target)
  })
}
```

There is one practical constraint: `objectFromFile` parses YAML for verb arguments. A plain library function cannot automatically receive a parsed YAML file unless it has a YAML parser or the verb passes the object. There are three ways to solve this:

1. Keep `compare-spec` as the canonical command and deprecate registry-backed shortcuts.
2. Add a generated JSON file next to the YAML and let `registry.js` read JSON with `fs.readFile`.
3. Add a small `defaultSpec.js` module exporting the spec object, generated from YAML or maintained manually.

Recommended short-term path:

- Keep `compare-spec` as canonical for suite runs.
- Keep ergonomic registry-backed verbs until the loader strategy is decided.
- Add deprecation notes if a verb uses hard-coded registry data.

Recommended medium-term path:

- Add `specs/public-pages.desktop.visual.json` generated from YAML or manually kept equivalent.
- Make `registry.js` load JSON for default ergonomic commands.

### Phase C: Stabilize prototype selectors

Goal: every canonical comparison section should have stable selectors on both prototype and React sides.

For public pages, add attributes in:

```text
prototype-design/screens/ppxis.jsx
```

Example for Shows:

```jsx
function ShowsPage({ onOpen, compact }) {
  const shows = compact ? P_SHOWS.slice(0, 6) : P_SHOWS;
  return (
    <>
      <header data-section="shows-header">
        <PageHeader kicker="Providence, RI" title="Upcoming shows" compact={compact} />
      </header>
      <section data-section="shows-list">
        <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(3, 1fr)", gap: compact ? 24 : "32px 24px" }}>
          {shows.map(s => <ShowTile key={s.id} show={s} compact={compact} onClick={() => onOpen && onOpen(s)} />)}
        </div>
      </section>
    </>
  );
}
```

Add `data-page` at the prototype shell's `main` element:

```jsx
<main data-page={cur === "detail" ? "show-detail" : cur} ...>
  {content}
</main>
```

Then update the spec:

```yaml
sections:
  - id: content
    original: "[data-page='shows']"
    react: "[data-page='shows']"
  - id: header
    original: "[data-section='shows-header']"
    react: "[data-section='shows-header']"
  - id: shows-list
    original: "[data-section='shows-list']"
    react: "[data-section='shows-list']"
```

Do not keep comparing `#root` against section-level React selectors. That inflates diffs and makes CSS tuning misleading.

### Phase D: Rename and organize scripts

The promoted scripts currently have ticket-era numeric names:

```text
01-smoke-list-targets.sh
02-smoke-import-mechanism.sh
...
17-snapshot-shows-sections.sh
```

These names are useful historically but not ideal long-term. Move them under a `scripts/` subdirectory with descriptive names:

```text
prototype-design/visual-diff/userland/scripts/
  smoke-list-targets.sh
  smoke-imports.sh
  smoke-compare-section-archive.sh
  smoke-compare-page-archive.sh
  smoke-compare-all-archive.sh
  run-compare-all-public-pages.sh
  smoke-ci-policy-failure.sh
  smoke-compare-spec-archive.sh
  run-compare-spec-public-pages.sh
  smoke-snapshot-section-archive.sh
  smoke-diff-snapshots-archive.sh
  diagnose-shows-sections.sh
```

Update `README.md` accordingly.

### Phase E: Decide legacy config handling

Do not delete native configs immediately. First add a note, either in a README or in the cleanup report:

```text
prototype-design/visual-diff/comparisons/** contains native css-visual-diff run configs.
The canonical Pyxis visual suite source is userland/specs/*.visual.yml.
Native configs are retained for compatibility and historical reproducibility.
```

Potential later step: implement an emitter:

```bash
pyxis pages emit-native-configs public-pages.desktop.visual.yml \
  --outDir prototype-design/visual-diff/comparisons/generated/public-pages
```

Pseudo-code:

```js
function emitNativeConfig(target, sectionSet) {
  return {
    metadata: { slug, title, domain, level, component, state },
    original: {
      name: target.page + '-prototype',
      url: target.prototypeUrl,
      wait_ms: target.waitMs,
      viewport: target.viewport,
      root_selector: target.prototype.rootSelector || '#root',
      prepare: { wait_for: target.prototype.waitFor }
    },
    react: {
      name: target.page + '-storybook',
      url: target.storybookUrl,
      wait_ms: target.waitMs,
      viewport: target.viewport,
      root_selector: target.storybook.rootSelector || "[data-story-frame='pyxis-page-shell']",
      prepare: { wait_for: target.storybook.waitFor }
    },
    sections: target.sections.map(section => ({
      name: section.id,
      selector_original: section.original,
      selector_react: section.react
    })),
    output: { dir: computedOutputDir },
    modes: ['capture', 'cssdiff', 'matched-styles', 'pixeldiff', 'html-report']
  }
}
```

### Phase F: Documentation cleanup

Update:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/specs/README.md
```

The playbook should say:

- Use live Storybook in tmux.
- Use `prototype-design/visual-diff/userland` as the promoted verb repository.
- Use `compare-spec` for canonical suite runs.
- Use `snapshot-section` before tuning CSS when pixel diffs are large.
- Use the `read` tool for PNG/image inspection, not general image-understanding tools.
- Do not commit generated outputs under `prototype-design/visual-comparisons` unless explicitly requested.

## 9. Validation checklist

After each cleanup step, run a small suite. Do not wait until the end.

### Basic verb/import validation

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages list-targets \
  --output json
```

Expected: 13 public-page desktop section rows until the spec changes.

### Archive section smoke

```bash
prototype-design/visual-diff/userland/08-smoke-new-api-compare-section.sh
```

Expected Archive content:

```text
changedPercent: 7.128146453089244
changedPixels: 102172
```

### Archive page catalog

```bash
prototype-design/visual-diff/userland/09-smoke-compare-page-archive.sh
```

Expected:

```text
sectionCount: 2
catalog.comparisonCount: 2
```

### Full spec suite

```bash
prototype-design/visual-diff/userland/14-run-compare-spec-public-pages.sh
```

Expected before selector changes:

```text
pageCount: 5
sectionCount: 13
classificationCounts:
  major-mismatch: 5
  tune-required: 6
  review: 2
```

After selector stabilization, these numbers may change. If they change, record why in the cleanup diary.

### Semantic snapshot smoke

```bash
prototype-design/visual-diff/userland/15-smoke-snapshot-section-archive-content.sh
```

Expected: writes `snapshot.json` and `01-snapshot.md` under generated output path.

### Snapshot diff smoke

```bash
prototype-design/visual-diff/userland/16-smoke-diff-snapshots-archive-content.sh
```

Expected:

```text
changed: false
all metric deltas: 0
```

### Shows diagnostics

```bash
prototype-design/visual-diff/userland/17-snapshot-shows-sections.sh
```

Use the result to check whether selector stabilization improved section bounds. Large `yDelta` and `heightDelta` values usually mean the selected regions are not equivalent or page composition differs substantially.

## 10. How to reason about Shows cleanup

Shows currently has the largest residual diffs. Before changing CSS, verify that the comparison regions are fair.

Bad comparison:

```text
prototype #root
vs
React [data-section='shows-header']
```

Good comparison:

```text
prototype [data-section='shows-header']
vs
React [data-section='shows-header']
```

Why this matters: if the prototype selector captures an entire page and the React selector captures only a header, the diff will be enormous no matter how accurate the header CSS is.

Use semantic snapshots to diagnose this:

```bash
pyxis pages snapshot-section shows header
pyxis pages snapshot-section shows shows-list
```

Look at:

```text
bounds.y delta
bounds.height delta
styleDiffCount
textChanged
```

If `heightDelta` is hundreds or thousands of pixels, do not start by changing font sizes. First ask whether the selectors are equivalent.

## 11. Suggested commit plan

### Commit 1: Inventory and schema docs

Files:

```text
ttmp/.../reference/01-inventory.md
prototype-design/visual-diff/userland/specs/README.md
prototype-design/visual-diff/userland/README.md
```

Validation:

```bash
pyxis pages list-targets
```

Commit message:

```text
Document visual diff cleanup inventory
```

### Commit 2: Spec canonicalization

Files:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/lib/registry.js
prototype-design/visual-diff/userland/lib/compare-region.js
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
```

Validation:

```bash
prototype-design/visual-diff/userland/13-smoke-compare-spec-archive-filter.sh
prototype-design/visual-diff/userland/14-run-compare-spec-public-pages.sh
```

Commit message:

```text
Use visual suite spec as comparison source
```

### Commit 3: Prototype selector stabilization

Files:

```text
prototype-design/screens/ppxis.jsx
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/comparisons/public-pages/*.css-visual-diff.yml
```

Validation:

```bash
prototype-design/visual-diff/userland/17-snapshot-shows-sections.sh
prototype-design/visual-diff/userland/14-run-compare-spec-public-pages.sh
```

Commit message:

```text
Stabilize public prototype visual selectors
```

### Commit 4: Script reorganization

Files:

```text
prototype-design/visual-diff/userland/scripts/*
prototype-design/visual-diff/userland/README.md
```

Validation: run all smoke scripts from new names.

Commit message:

```text
Organize visual diff userland scripts
```

### Commit 5: Legacy compatibility cleanup

Files depend on inventory. Do not do this until every path has a classification.

Commit message:

```text
Classify legacy visual diff configs
```

## 12. Risks and how to avoid them

### Risk: deleting historical evidence

Some generated-looking files may be historical evidence used by previous reports. Check whether a file is referenced before deleting:

```bash
rg "path/to/file" docs ttmp prototype-design
```

### Risk: changing selectors changes diff numbers

This is expected if selectors were previously too broad. Record the reason in the diary and changelog. A changed number is not automatically a regression; it may be a more truthful comparison.

### Risk: Storybook stale builds

User-site Storybook can become stale if package aliases or Vite cache misbehave. If selectors are missing on the React side, first verify Storybook is serving the expected story and restart if needed.

Known session:

```text
pyxis-user-site-storybook
cd web && pnpm --filter pyxis-user-site storybook
http://localhost:6007
```

### Risk: generated outputs accidentally committed

Before committing, run:

```bash
git status --short
find prototype-design/visual-comparisons -type f | head
```

If generated outputs appear in `git status`, remove them unless explicitly requested.

## 13. Definition of done

The cleanup ticket is done when:

- The canonical suite spec is documented and validated.
- The JS registry no longer duplicates selector truth, or is clearly marked as a compatibility adapter.
- Public prototype sections use stable `data-page` and `data-section` selectors for canonical comparisons.
- Promoted userland scripts are organized and documented.
- Native config YAMLs are classified as compatibility, generated, or deprecated.
- Generated artifacts are ignored and absent from commits unless requested.
- The playbook points developers to the promoted workflow.
- The full spec suite and smoke scripts pass.
- A final postmortem records what moved, what was deleted, what remains, and how to validate future changes.

## 14. Intern quick-start checklist

Start here when implementing:

1. Read this guide fully.
2. Read:

```text
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
prototype-design/visual-diff/userland/lib/compare-region.js
prototype-design/visual-diff/userland/lib/snapshot.js
prototype-design/screens/ppxis.jsx
```

3. Confirm servers:

```bash
curl -I http://localhost:7070/standalone/public/shows.html
curl -I http://localhost:6007/iframe.html?id=public-site-pages--shows-desktop
```

4. Run baseline smokes:

```bash
prototype-design/visual-diff/userland/13-smoke-compare-spec-archive-filter.sh
prototype-design/visual-diff/userland/14-run-compare-spec-public-pages.sh
prototype-design/visual-diff/userland/15-smoke-snapshot-section-archive-content.sh
```

5. Remove generated artifacts:

```bash
rm -rf prototype-design/visual-comparisons/cssvd-js
```

6. Make one small cleanup change.
7. Re-run the relevant smoke.
8. Update the diary.
9. Commit.

## 15. Final note

The purpose of this cleanup is not aesthetic. It is to make future visual tuning trustworthy. If selectors are vague, configs are duplicated, and generated artifacts are mixed with source, every pixel number becomes suspect. If the suite spec is canonical, selectors are stable, and generated outputs are clearly separated, visual work becomes mechanical: run the suite, inspect the diffs, tune the right layer, and record the result.
