---
Title: Bottom-up prototype-to-Storybook visual parity implementation guide
Ticket: PYXIS-COMPONENT-VISUAL-PARITY
Status: active
Topics:
    - frontend
    - storybook
    - css-visual-diff
    - visual-regression
    - prototype
DocType: analysis
Intent: implementation-guide
Owners: []
RelatedFiles:
    - Path: ../../../../../../../corporate-headquarters/css-visual-diff/examples/pyxis-atoms-prototype-vs-storybook.yaml
      Note: Historical atom-level prototype-vs-Storybook comparison example
    - Path: ../../../../../../../corporate-headquarters/css-visual-diff/internal/cssvisualdiff/doc/tutorials/inspect-workflow.md
      Note: Single-side inspection and selector debugging loop
    - Path: ../../../../../../../corporate-headquarters/css-visual-diff/internal/cssvisualdiff/doc/tutorials/story-config-authoring.md
      Note: css-visual-diff YAML comparison authoring loop
    - Path: docs/playbooks/02-html-prototype-baseline-extraction-playbook.md
      Note: Prototype baseline extraction and inspect-before-compare workflow
    - Path: docs/playbooks/04-storybook-component-capture-playbook.md
      Note: Storybook capture target contract and catalog workflow
    - Path: prototype-design/baseline/manifest.json
      Note: Prototype-side baseline manifest used to find candidate original targets
    - Path: prototype-design/storybook-catalog/manifest.json
      Note: Storybook-side implementation manifest used to find matching React stories
ExternalSources: []
Summary: Concrete plan for extracting component-level prototype baselines, creating matching Storybook stories, running css-visual-diff visual/CSS/LLM review comparisons, and iterating React components toward pixel parity from atoms upward.
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Bottom-up prototype-to-Storybook visual parity implementation guide

## 1. Goal

We want to stop treating screenshots as passive documentation and start using `css-visual-diff` as a repair loop:

```text
prototype component baseline
  ↔ matching Storybook story
  ↔ visual diff + CSS diff + optional LLM review
  ↔ React/Storybook implementation fixes
  ↔ rerun until the component is visually close enough
```

The important discipline is bottom-up comparison. We should not begin by comparing finished pages. A page-level diff mixes together typography, spacing, cards, rows, navigation, data mismatches, responsiveness, and layout composition. Instead, we work upward:

```text
atoms → molecules → organisms → public-domain components → sections → pages
```

For each level, the artifact must represent the same visual element on both sides. If the prototype baseline is a primary button, the Storybook side must be the primary button in the same state, with the same label and icon, not a button gallery, not a wrapper, and not the whole page.

## 2. Source documents and why they matter

### Pyxis repo docs

- `docs/playbooks/02-html-prototype-baseline-extraction-playbook.md`
  - Canonical guide for extracting trusted prototype PNG/CSS/HTML/inspect artifacts.
  - Establishes `prototype-design/baseline/` and the inspect-before-compare rule.
- `docs/playbooks/04-storybook-component-capture-playbook.md`
  - Canonical guide for focused Storybook captures.
  - Defines `data-pyxis-component`, `data-pyxis-part`, `StoryFrame`, `story-root`, and `capture-target`.
- `docs/component-system-and-public-site-components.md`
  - Explains the taxonomy: atoms, molecules, organisms, public components, and pages.
  - Prevents mismatching a domain component with a generic primitive.
- `prototype-design/baseline/manifest.json`
  - Current prototype-side baseline index. Contains 52 baseline configs with outputs under `prototype-design/baseline/artifacts/`.
- `prototype-design/storybook-catalog/manifest.json`
  - Current implementation-side Storybook catalog index. Contains 89 stories across atoms/molecules/organisms/public components with outputs under `prototype-design/storybook-catalog/artifacts/`.

### css-visual-diff docs in corporate headquarters

- `/home/manuel/code/wesen/corporate-headquarters/css-visual-diff/README.md`
  - Summarizes current CLI shape: browser capture, element-level compare, CSS diffs, matched styles, pixel diffs.
  - Shows prepared-target patterns and `run --modes capture,cssdiff,matched-styles,pixeldiff,html-report`.
- `/home/manuel/code/wesen/corporate-headquarters/css-visual-diff/internal/cssvisualdiff/doc/tutorials/inspect-workflow.md`
  - The core debugging loop: prepared HTML first, screenshot crop second, computed CSS third, full comparison last.
- `/home/manuel/code/wesen/corporate-headquarters/css-visual-diff/internal/cssvisualdiff/doc/tutorials/story-config-authoring.md`
  - The best practical guide for authoring comparison YAML configs.
  - Important because it explains `sections[]`, `styles[]`, side-specific selectors, and batch `run --config-dir`.
- `/home/manuel/code/wesen/corporate-headquarters/css-visual-diff/examples/pyxis-atoms-prototype-vs-storybook.yaml`
  - A historical example of comparing prototype atoms against Storybook atoms.
  - It is not the final desired architecture, but it proves the expected YAML concepts: original target, react target, sections, styles, output, and modes.

## 3. Tooling reality: `compare` vs YAML `run`

There are two possible comparison paths.

### `css-visual-diff compare`

The `compare` command compares one element between two URLs:

```bash
css-visual-diff compare \
  --url1 http://localhost:7070/... \
  --selector1 '...' \
  --url2 http://localhost:6006/iframe.html?id=... \
  --selector2 '...' \
  --out /tmp/compare
```

It is useful for quick alpha-test smoke runs and for testing the janky direct compare path. Limitations:

- It is flag-heavy and not manifest-driven.
- It has no rich prepare hooks in the help output.
- It is awkward for prototype pages that require React-global direct rendering.
- It is not ideal for repeatable component parity work.

Use `compare` as a tactical probe and alpha-test feedback source, not the canonical Pyxis workflow.

### `css-visual-diff run --config ...`

The YAML `run` path is the canonical workflow for Pyxis because it supports:

- `original` and `react` targets,
- per-side `prepare` hooks,
- `sections[]` for screenshot regions,
- `styles[]` for CSS probes,
- side-specific selectors,
- output directories,
- repeatable `capture`, `cssdiff`, `matched-styles`, `pixeldiff`, `ai-review`, and `html-report` modes.

Canonical component comparison command:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Optional AI/LLM review, only after the deterministic artifacts are sane:

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml \
  --modes capture,cssdiff,pixeldiff,ai-review,html-report \
  --profile <working-vision-profile>
```

Because previous LLM review hit provider/balance limits, LLM review should be optional and never block the deterministic comparison loop.

## 4. Repository layout for parity comparisons

Keep three artifact layers separate:

```text
prototype-design/baseline/                  # source-of-truth prototype baseline artifacts
prototype-design/storybook-catalog/         # implementation-side Storybook capture artifacts
prototype-design/visual-diff/comparisons/   # runnable comparison configs
prototype-design/visual-comparisons/        # generated comparison outputs
```

Recommended comparison config layout:

```text
prototype-design/visual-diff/comparisons/
  component-system/
    atoms/
      button-primary.css-visual-diff.yml
      badge-confirmed.css-visual-diff.yml
      input-default.css-visual-diff.yml
    molecules/
      card-default.css-visual-diff.yml
      field-error.css-visual-diff.yml
      stat-default.css-visual-diff.yml
    organisms/
      top-bar-default.css-visual-diff.yml
      modal-default.css-visual-diff.yml
  public-components/
    pub-nav-default.css-visual-diff.yml
    venue-card-default.css-visual-diff.yml
    booking-form-default.css-visual-diff.yml
```

Recommended output layout:

```text
prototype-design/visual-comparisons/
  component-system/
    atoms/button-primary/
      capture.json
      cssdiff.md
      pixeldiff.md
      index.html
    molecules/card-default/
    organisms/top-bar-default/
  public-components/pub-nav-default/
```

Generated comparison outputs should be ignored if they are large/noisy. Configs, manifests, and documentation should be committed.

**Validated workflow correction:** when `css-visual-diff run` loads a YAML config, relative `output.dir` values are resolved relative to the config file's directory. During the first Button iteration, `output.dir: prototype-design/visual-comparisons/...` produced nested output under `prototype-design/visual-diff/comparisons/...`. For hand-authored Pyxis comparison configs, use an absolute `output.dir` during validation, or generate configs with a known repo-root-aware output path.

## 5. The unit of work: a parity pair

Every comparison starts as a parity pair:

```json
{
  "slug": "atoms-button-primary",
  "level": "atom",
  "component": "button",
  "state": "primary-with-chevron",
  "prototype": {
    "source": "prototype-design/Pyxis Full App.html or Pyxis Public Site.html",
    "baselineConfig": "...",
    "selector": "...",
    "screenshot": ".../screenshot.png"
  },
  "storybook": {
    "storyId": "atoms-button--default",
    "selector": "#storybook-root [data-pyxis-component=\"button\"][data-pyxis-part=\"root\"]",
    "screenshot": ".../capture-target/screenshot.png"
  },
  "confidence": "high",
  "notes": "Same label, icon, state, viewport, and crop."
}
```

The first implementation should be a hand-curated mapping document or JSON file, not a fully automated matcher. Automation can suggest candidates from `manifest.json`, but a human/agent should confirm that the screenshots are semantically identical before running diffs.

Suggested first mapping file:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

## 6. Concrete workflow for one component

### Step 1: pick a component and state

Start with a low-level component and one exact state.

Good first candidates:

```text
Button / primary / Get tickets / chevron-right
Badge / confirmed
Tag / genre/default
Avatar / md initials
Input / default or search
Select / status
Card / default
Field / error
Stat / default
Table / status rows
Empty / with CTA
TopBar / default
Modal / default
```

Avoid broad fixtures and page sections for the first comparison. A single component state is easier to make pixel-perfect.

### Step 2: find or create the prototype baseline

Look in:

```text
prototype-design/baseline/manifest.json
prototype-design/baseline/artifacts/
prototype-design/visual-diff/prototype-foundations-system.css-visual-diff.yml
prototype-design/visual-diff/public-components/*.css-visual-diff.yml
```

If the exact component/state already exists as a named baseline style/section, use it.

If it does not exist, add a new prototype baseline config or extend an existing one. For design-system primitives, the best source is usually `SystemPage` from `prototype-design/Pyxis Full App.html`; for public-domain widgets, the best source is `prototype-design/Pyxis Public Site.html` or a standalone public fixture.

Prototype baseline extraction command:

```bash
css-visual-diff inspect \
  --config prototype-design/visual-diff/comparisons/component-system/baselines/button-primary-prototype.css-visual-diff.yml \
  --side original \
  --all-styles \
  --out prototype-design/baseline/component-system/atoms/button-primary
```

Validation artifacts to inspect:

```text
screenshot.png
computed-css.md
prepared.html
inspect.json
```

Do not proceed until the prototype PNG is the exact intended component/state.

### Step 3: find or create the matching Storybook story

Search `prototype-design/storybook-catalog/manifest.json` for the component and state.

If a matching story exists, use its Storybook iframe URL:

```text
http://localhost:6006/iframe.html?id=atoms-button--default&viewMode=story
```

If it does not exist, add or adjust a story under:

```text
web/packages/pyxis-components/src/<level>/<Component>/<Component>.stories.tsx
```

The story must match the prototype baseline:

- same label text,
- same icon,
- same state,
- same surrounding fixture width/padding if those affect layout,
- same background when relevant,
- root marked with `data-pyxis-component` / `data-pyxis-part`,
- variant grids wrapped in `StoryFrame`.

Then rebuild and regenerate Storybook catalog configs:

```bash
cd web && pnpm --filter pyxis-components build-storybook
cd ..
node prototype-design/visual-diff/scripts/18-generate-storybook-design-system-configs.mjs
prototype-design/visual-diff/scripts/20-run-storybook-catalog-full.sh
```

### Step 4: inspect both sides independently

Before comparing, use the inspect workflow. This step is not optional. In the Button and Badge atom iterations it caught selector and output-path assumptions before scaling the workflow.

Prepared HTML:

```bash
css-visual-diff html --config <comparison.yml> --side original --root --output-file /tmp/original-root.html
css-visual-diff html --config <comparison.yml> --side react --root --output-file /tmp/react-root.html
```

Screenshot crop:

```bash
css-visual-diff screenshot --config <comparison.yml> --side original --section component --output-file /tmp/original.png
css-visual-diff screenshot --config <comparison.yml> --side react --section component --output-file /tmp/react.png
```

Computed CSS:

```bash
css-visual-diff css-md --config <comparison.yml> --side original --style root --output-file /tmp/original-css.md
css-visual-diff css-md --config <comparison.yml> --side react --style root --output-file /tmp/react-css.md
```

Then inspect the PNGs with `read`. A comparison config is not ready if either crop includes a wrapper, a layout grid, or a different state.

### Step 5: write the comparison YAML

Minimal shape:

```yaml
metadata:
  slug: atoms-button-primary
  level: atom
  component: button
  state: primary-with-chevron
  prototype_baseline: prototype-design/baseline/...
  storybook_story_id: atoms-button--default

original:
  name: prototype-button-primary
  url: http://localhost:7070/Pyxis%20Full%20App.html
  wait_ms: 1000
  viewport: { width: 1200, height: 360 }
  root_selector: "#capture-root"
  prepare:
    type: script
    wait_for: "window.React && window.ReactDOM && window.SystemPage"
    script: |
      // Render or isolate the exact prototype component/fixture.
      // If necessary, annotate the target with data-cssvd-target="component".
    after_wait_ms: 500

react:
  name: storybook-button-primary
  url: http://localhost:6006/iframe.html?id=atoms-button--default&viewMode=story
  wait_ms: 1000
  viewport: { width: 1200, height: 360 }
  root_selector: "#storybook-root"
  prepare:
    type: script
    wait_for: "document.querySelector('[data-pyxis-component=\"button\"][data-pyxis-part=\"root\"]')"
    script: |
      document.documentElement.style.background = '#f3f1eb';
      document.body.style.margin = '0';
    after_wait_ms: 250

sections:
  - name: component
    selector_original: "[data-cssvd-target='component']"
    selector_react: "#storybook-root [data-pyxis-component='button'][data-pyxis-part='root']"

styles:
  - name: root
    selector_original: "[data-cssvd-target='component']"
    selector_react: "#storybook-root [data-pyxis-component='button'][data-pyxis-part='root']"
    include_bounds: true
    props: [display, width, height, padding, gap, font-family, font-size, font-weight, line-height, color, background-color, border, border-radius, box-shadow]
  - name: label
    selector_original: "[data-cssvd-target='label']"
    selector_react: "#storybook-root [data-pyxis-component='button'][data-pyxis-part='label']"
    include_bounds: true
    props: [font-family, font-size, font-weight, line-height, letter-spacing, color]

output:
  dir: prototype-design/visual-comparisons/component-system/atoms/button-primary
  write_json: true
  write_markdown: true
  write_pngs: true
  write_prepared_html: true
  write_inspect_json: true
  validate_pngs: true

modes: [capture, cssdiff, matched-styles, pixeldiff, html-report]
```

Important pattern: when the prototype DOM is hard to select cleanly, annotate it in `prepare.script` with neutral comparison attributes such as:

```js
target.setAttribute('data-cssvd-target', 'component');
label.setAttribute('data-cssvd-target', 'label');
```

Do not force the prototype to use `data-pyxis-*`; those belong to the React implementation contract. Use `data-cssvd-target` for temporary comparison labels.

### Step 6: run deterministic comparison

```bash
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Inspect:

```text
prototype-design/visual-comparisons/component-system/atoms/button-primary/index.html
prototype-design/visual-comparisons/component-system/atoms/button-primary/cssdiff.md
prototype-design/visual-comparisons/component-system/atoms/button-primary/pixeldiff.md
prototype-design/visual-comparisons/component-system/atoms/button-primary/capture.json
```

### Step 7: optionally run LLM review

Only after deterministic artifacts are credible:

```bash
css-visual-diff run \
  --config <comparison.yml> \
  --modes capture,cssdiff,pixeldiff,ai-review,html-report \
  --profile <vision-profile>
```

LLM review should answer questions like:

- Is the diff mostly spacing, typography, color, or crop mismatch?
- Which visual differences should be fixed first?
- Is the compared element semantically equivalent?

LLM review should not override the CSS diff. Treat it as triage text, not truth.

### Step 8: fix the React/Storybook side

Use a strict decision tree:

1. If the crop is wrong, fix selectors or Storybook fixture first.
2. If the prototype/story states differ, fix the Storybook story or add a new baseline.
3. If content differs, align text/icons/data before changing CSS.
4. If layout bounds differ, inspect width/height/padding/gap/margin first.
5. If typography differs, inspect font-family/font-size/font-weight/line-height/letter-spacing.
6. If color differs, map prototype values to tokens where possible.
7. If border/radius/shadow differs, update component CSS/tokens.
8. Rerun the exact same config.

Do not tune React CSS against a bad comparison pair.

**Validated workflow correction:** CSS diff can report differences that are not visual bugs. In the Badge confirmed iteration, pixel diff was 0%, but CSS diff initially reported `box-sizing`, `width`, and `height` differences because the prototype badge used content-box computed width/height while the React badge used border-box. The visual bounds were identical. For auto-sized inline components, prefer `include_bounds: true` plus visual properties such as padding, gap, font, color, background, border, and radius; avoid treating computed `width`/`height` as mandatory parity unless fixed dimensions are part of the component contract.

### Step 9: record the result

For each component, update the mapping/status file:

```text
pending → baseline-ready → story-ready → inspected → compared → fixed → accepted
```

Record:

- config path,
- output path,
- prototype screenshot path,
- Storybook screenshot path,
- current pixel diff summary,
- CSS diff summary,
- fixes applied,
- known accepted differences.

## 7. Baseline extraction strategy by level

### Atoms

Preferred prototype source: foundations/system baseline from `Pyxis Full App.html`.

Start with:

```text
Button
Badge
Tag
Avatar
Icon/IconButton
Input
Select
Textarea
```

For each atom, prefer a new isolated prototype fixture if the existing foundations card contains too many neighboring examples. The old atom comparison example used `data-comp` wrappers around each atom; a modern version should do the same but make each state a separate comparison config.

### Molecules

Preferred prototype source: foundations/system cards or Full App component cards.

Start with:

```text
Card
CardHead
Field
Stat
Table
Empty
LogRow
```

Molecules often need two selectors:

- screenshot section: whole component root,
- CSS probes: root plus internal label/body/value/action parts.

### Organisms

Preferred prototype source: Full App screens and foundations cards.

Start with:

```text
TopBar
Modal
```

Organisms need matching viewport and container context. For `Modal`, compare panel separately from full overlay if the overlay/background creates noise:

```text
modal-panel first
full modal overlay later
```

### Public-domain components

Only after generic primitives are reasonably close, compare public components from `Pyxis Public Site.html`:

```text
PubNav
PubFooter
PubHero
PubShowRow
LineupRow
TicketStub
VenueCard
SpaceInfo
BookingForm
BookingRules
BookingSuccess
MailingListCTA
ArchiveStats
YearGroup
AboutHero
EthosStrip
```

Same bottom-up rule: compare component roots before public pages.

## 8. Suggested first implementation sequence

### Batch A: prove the loop with atoms

1. `button-primary`
2. `badge-confirmed`
3. `tag-default`
4. `input-default`
5. `select-status`

Deliverables:

```text
prototype-design/visual-diff/comparisons/component-system/atoms/*.css-visual-diff.yml
prototype-design/visual-comparisons/component-system/atoms/*/index.html
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

### Batch B: molecule cards and fields

1. `card-default`
2. `field-default`
3. `field-error`
4. `stat-default`
5. `empty-with-cta`

### Batch C: table/log/organisms

1. `table-default`
2. `log-row-default`
3. `top-bar-default`
4. `modal-panel-default`

### Batch D: public components

1. `pub-nav-default`
2. `pub-footer-default`
3. `venue-card-default` or `space-info-default`
4. `booking-rules-default`
5. `archive-stats-default`

### Batch E: composed public sections/pages

Only after the component-level diffs are useful:

1. shows page header/nav region,
2. show row/list section,
3. booking page form section,
4. about hero/ethos section,
5. full public pages.

## 9. When to add baselines, stories, or manifests

### Add a prototype baseline when

- no prototype artifact isolates the exact component/state,
- current baseline crop includes too much surrounding UI,
- current baseline only exists as part of a full page,
- we need an internal part probe, not just the component root.

### Add a Storybook story when

- existing story state does not match prototype text/icon/state,
- existing story is a playground with controls instead of a stable fixture,
- existing story is a variant grid but we need one state,
- component needs a specific container width/background to match prototype.

### Add/update a comparison manifest when

- a new parity pair is validated,
- a comparison config is created,
- a pair is blocked because the baseline/story is missing,
- a pair is accepted with known differences.

## 10. Manifests to build

### `component-parity-map.json`

Hand-curated pair map:

```json
{
  "generatedAt": "...",
  "entries": [
    {
      "slug": "atoms-button-primary",
      "level": "atom",
      "component": "button",
      "state": "primary",
      "status": "compared",
      "prototype": {
        "config": "...",
        "selector": "...",
        "screenshot": "..."
      },
      "storybook": {
        "storyId": "atoms-button--default",
        "selector": "...",
        "screenshot": "..."
      },
      "comparison": {
        "config": "...",
        "output": "...",
        "report": "..."
      },
      "confidence": "high",
      "notes": "..."
    }
  ]
}
```

### `comparison-manifest.json`

Generated from comparison configs and outputs:

```text
prototype-design/visual-comparisons/manifest.json
```

This powers a browsable comparison index later.

## 11. Alpha-tester feedback for css-visual-diff

Because this project is an alpha tester, we should record tool friction separately from Pyxis component bugs.

Known or likely pain points:

- `compare` is convenient but too limited for prepared prototype targets.
- `run --config-dir` fails fast; useful for correctness, painful for batch triage.
- Comparison index/report generation may need stronger first-class support for many component pairs.
- It may be useful to add a `pair-map` or `manifest compare` mode later.
- LLM review provider configuration and billing failures must be reported as tool/environment issues, not component failures.

For each css-visual-diff issue, record:

```text
command
config path
error output
expected behavior
actual behavior
whether workaround exists
```

If source changes are needed, use the installed standalone source tree noted in project context and reinstall with `make install`.

## 12. Definition of done for one component

A component reaches parity-ready when:

- exact prototype baseline exists,
- exact Storybook story exists,
- both sides independently inspect correctly,
- comparison YAML is committed,
- `capture`, `cssdiff`, `matched-styles`, `pixeldiff`, and `html-report` run successfully,
- report has been reviewed,
- React/Storybook implementation has been adjusted if needed,
- remaining differences are either fixed or documented as accepted,
- component parity map is updated.

## 13. Validated atom iteration notes

Two atom iterations have now validated the basic YAML `run` workflow:

| Component | Config | Result | Lesson |
| --- | --- | --- | --- |
| Button primary | `prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml` | `0.0000%` pixel diff; no CSS diff | Workflow works for exact atom fixture states. Use absolute output paths. |
| Badge confirmed | `prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml` | `0.0000%` pixel diff; no CSS diff after pruning auto-size width/height props | CSS property lists must be component-aware; pixel parity can coexist with harmless computed CSS differences. |

Validated command sequence:

```bash
# 1. Inspect crops and styles first.
css-visual-diff screenshot --config <config.yml> --side original --section <section> --output-file /tmp/original.png
css-visual-diff screenshot --config <config.yml> --side react --section <section> --output-file /tmp/react.png
css-visual-diff css-md --config <config.yml> --side original --style root --output-file /tmp/original-css.md
css-visual-diff css-md --config <config.yml> --side react --style root --output-file /tmp/react-css.md

# 2. Run deterministic comparison modes.
css-visual-diff run --config <config.yml> --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

Next recommended atom configs:

```text
prototype-design/visual-diff/comparisons/component-system/atoms/tag-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/select-status.css-visual-diff.yml
```

## 14. Immediate next actions

1. Create comparison directory structure:

```bash
mkdir -p prototype-design/visual-diff/comparisons/component-system/atoms
mkdir -p prototype-design/visual-comparisons/component-system/atoms
```

2. Build a first `component-parity-map.json` with 5 atom candidates.
3. Author the first comparison config for `button-primary`.
4. Inspect original/react HTML, screenshot, and CSS independently.
5. Run deterministic comparison modes.
6. Fix Button CSS/story if the pair is valid and differences are real.
7. Repeat for Badge and Input before moving to molecules.
