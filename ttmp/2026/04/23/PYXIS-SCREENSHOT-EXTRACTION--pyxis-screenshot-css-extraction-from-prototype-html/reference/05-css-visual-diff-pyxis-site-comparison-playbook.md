---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/examples/pyxis-atoms-prototype-vs-storybook.yaml
      Note: Atom-level prototype-vs-Storybook comparison config
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/examples/pyxis-prototype-only.yaml
      Note: Prototype-only extraction validation config
    - Path: ../../../../../../../../../workspaces/2026-04-21/hair-v2/css-visual-diff/examples/pyxis-prototype-vs-app.yaml
      Note: Full Shows page prototype-vs-app comparison config
    - Path: ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/README.md
      Note: Numbered script workflow referenced by the playbook
    - Path: web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
      Note: Storybook atom fixture used by the atom diff workflow
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Playbook: Using css-visual-diff for Pyxis Site Comparisons

## 1. Purpose

This playbook explains how to use `css-visual-diff` to compare the Pyxis prototype against the current React/Storybook implementation. It is written for someone new to the Pyxis project who needs to answer a practical question:

> Does the React implementation look like the prototype, and if not, exactly where and why does it differ?

The tool does not replace human judgment. It gives you a repeatable way to capture screenshots, extract computed CSS, inspect DOM/layout data, and generate pixel-diff images. The human still decides which differences are intentional and which should be fixed.

The most important habit is to work from small to large:

```text
prototype-only sanity check
  ↓
atom-level component diffs
  ↓
page-section diffs
  ↓
full-page comparison
  ↓
CSS/component fixes
  ↓
repeat
```

Do not start by trying to repair an entire page from a single huge screenshot. First make sure the prototype capture is correct. Then fix shared atoms like buttons, badges, tags, inputs, selects, icons, and avatars. Only after those are close should you use the full-page diff to repair layout and page-specific styling.

---

## 2. Repository map

There are two repositories involved.

### Pyxis repo

```text
/home/manuel/code/wesen/2026-04-23--pyxis
```

Important paths:

```text
prototype-design/
  Pyxis Public Site.html
  lib/components.jsx
  lib/tokens.js
  screens/ppxis.jsx

web/
  packages/pyxis-components/
  packages/pyxis-user-site/

ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/
  scripts/
  reference/
  design/
```

### css-visual-diff repo

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
```

Important paths:

```text
examples/
  pyxis-prototype-only.yaml
  pyxis-prototype-vs-app.yaml
  pyxis-atoms-prototype-vs-storybook.yaml

examples/out/
  pyxis-prototype-only/
  pyxis-prototype-vs-app/
  pyxis-atoms-prototype-vs-storybook/
```

The `examples/out/` directory is generated and ignored by git.

---

## 3. The mental model

`css-visual-diff` is a two-target comparison tool. A config normally has:

```yaml
original:
  url: ...

react:
  url: ...
```

For Pyxis, the `original` target is the prototype HTML. The problem is that the prototype HTML does not directly show the clean public site. It first renders a pan/zoom `DesignCanvas` containing many artboards. Capturing that directly gives the wrong screenshot: canvas chrome, artboard labels, and cutoff content.

The fix is the `prepare` hook. A prepare hook runs after the browser loads the URL but before screenshots/CSS extraction. For the Pyxis prototype, prepare does this:

```text
load Pyxis Public Site.html
  ↓
wait for React, ReactDOM, PPXDesktop
  ↓
clear the DesignCanvas DOM
  ↓
render PPXDesktop({ page: "shows" }) into #capture-root
  ↓
screenshot #capture-root and selected subregions
```

For React/Storybook, the target is already closer to a clean render. It may be:

- the built app served locally, or
- a Storybook iframe story.

The tool then captures matching selectors from both sides:

```text
#capture-root header      ↔  #root header
#capture-root main        ↔  #root main
[data-comp='button']      ↔  [data-comp='button']
```

The output is not just PNGs. A good run should produce:

```text
capture.json              selector existence, bounds, screenshots, validation
capture.md                human-readable capture summary
cssdiff.json              computed CSS property diffs
cssdiff.md                human-readable CSS diff summary
matched-styles.json       cascade/matched-style details when enabled
pixeldiff.json            pixel statistics
pixeldiff_*.png           visual diff images
test.html                 browsable artifact report
original-prepared.html    prepared prototype HTML
original-inspect.json     recursive DOM/layout/style inspection
react-inspect.json        recursive DOM/layout/style inspection
```

---

## 4. Numbered ticket scripts

All repeatable scripts for this workflow live in:

```text
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/
```

Current scripts:

| Script | Purpose |
|---|---|
| `01-screenshot-prototype.mjs` | Historical first DesignCanvas screenshot attempt. Kept for traceability. |
| `02-screenshot-components.mjs` | Historical first component clipping attempt. Kept for traceability. |
| `03-analyze-prototype.mjs` | Prototype DOM/artboard analysis helper. |
| `04-capture-direct-render.mjs` | Direct-render prototype extractor that bypasses DesignCanvas. |
| `05-serve-pyxis-prototype.sh` | Serve `prototype-design/` on port `7070`. |
| `06-run-pyxis-prototype-only.sh` | Run prototype-only extraction using mirrored targets. |
| `07-pyxis-app-server.mjs` | Serve the built React app and mock API on port `8790`. |
| `08-run-pyxis-prototype-vs-app.sh` | Run full prototype-vs-current-app comparison. |
| `09-serve-css-visual-diff-report.sh` | Serve any generated report directory. |
| `10-atom-original-prepare.js` | Browser-side prototype atom fixture renderer. |
| `11-run-pyxis-atom-diff.sh` | Run prototype atoms vs Storybook atoms. |
| `12-serve-atom-diff-report.sh` | Serve the atom diff report. |

Prefer using these scripts instead of one-off shell commands. If you create a new helper, add it here with the next numeric prefix.

---

## 5. Prerequisites

### 5.1 Check dependencies

You need:

```bash
node --version
pnpm --version
go version
python3 --version
```

The Pyxis web workspace expects pnpm:

```text
/home/manuel/code/wesen/2026-04-23--pyxis/web/package.json
```

The comparison tool is Go-based:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
```

### 5.2 Start from clean repos

Before running comparisons, check both repos:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
git status --short

cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
git status --short
```

Generated reports under `css-visual-diff/examples/out/` are ignored and do not need to be committed.

### 5.3 Run tests if you changed tooling

If you changed `css-visual-diff`, run:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
go test ./...
```

If you changed Pyxis components or stories, run:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components typecheck
pnpm --filter pyxis-user-site build
```

---

## 6. Step 1 — Validate prototype extraction only

Before comparing against React, prove that the prototype side is correct.

Run:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/06-run-pyxis-prototype-only.sh
```

This uses:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/pyxis-prototype-only.yaml
```

It points both targets at the same prototype URL. This is intentional. `css-visual-diff` currently expects two targets, so prototype-only inspection mirrors the prototype into both slots.

Do not interpret pixel diffs from this run. Use it to answer:

- Does the screenshot start with the real `ppxis` header?
- Is the DesignCanvas chrome absent?
- Is the footer present?
- Are `original-prepared.html` and `original-inspect.json` generated?
- Are all validation statuses `ok`?

Serve the report:

```bash
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/09-serve-css-visual-diff-report.sh \
  /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-only
```

Open:

```text
http://localhost:8789/test.html
```

If the report shows DesignCanvas labels such as `01 · Desktop` or `Poster-grid shell`, stop. The prepare hook failed or the wrong URL/config was used.

---

## 7. Step 2 — Run atom-level diffs

Atom diffs compare small primitives in isolation:

- avatar
- button
- badge
- icon
- input
- select
- tag

This is the best place to start fixing design drift. Many page-level differences come from atom token mismatches.

Run:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/11-run-pyxis-atom-diff.sh
```

This script:

1. serves the prototype,
2. restarts Storybook on port `6006`,
3. waits for the story `atoms-atom-diff-fixture--default`,
4. runs `css-visual-diff`,
5. writes the report to:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-atoms-prototype-vs-storybook/test.html
```

Serve it:

```bash
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/12-serve-atom-diff-report.sh
```

Open:

```text
http://localhost:8792/test.html
```

### 7.1 What to look for

Start with the `CSS diff` section, not the pixel percentages. Pixel percentages are useful for sorting, but CSS diffs explain why components differ.

Typical atom-level findings from the first run:

```text
button-primary:
  height: 33.5938px → 40px
  font-size: 13px → 14px
  line-height: 15.6px → 16.8px

badge-confirmed:
  font-size: 11px → 12px
  line-height: 17.6px → 19.2px

tag-default:
  display: inline → inline-block
  font-size: 11px → 12px

input-search:
  padding-left: 32px → 36px
  font-size: 13px → 14px
```

Read those as:

```text
prototype value → React/Storybook value
```

If the goal is pixel-perfect parity with the prototype, React should move toward the left value. If the design-system implementation intentionally chose a different token, document that decision and do not chase the pixel diff blindly.

### 7.2 Where to fix atom differences

Common files:

```text
web/packages/pyxis-components/src/tokens/tokens.ts
web/packages/pyxis-components/src/tokens/tokens.css
web/packages/pyxis-components/src/atoms/Button/Button.tsx
web/packages/pyxis-components/src/atoms/Badge/Badge.tsx
web/packages/pyxis-components/src/atoms/Tag/Tag.tsx
web/packages/pyxis-components/src/atoms/Avatar/Avatar.tsx
web/packages/pyxis-components/src/atoms/Icon/Icon.tsx
web/packages/pyxis-components/src/atoms/Input/Input.tsx
web/packages/pyxis-components/src/atoms/Input/Input.css
web/packages/pyxis-components/src/atoms/Select/Select.tsx
web/packages/pyxis-components/src/atoms/Select/Select.css
```

The atom comparison fixture itself is:

```text
web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
```

Do not confuse fixture changes with style fixes. The fixture should only create stable examples for comparison. Actual visual fixes belong in tokens/components/CSS.

---

## 8. Step 3 — Run full prototype-vs-app comparison

Once atom-level drift is understood, run the full page comparison.

Run:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/08-run-pyxis-prototype-vs-app.sh
```

This script:

1. serves the prototype on `7070`,
2. builds `pyxis-user-site`,
3. starts a deterministic app/API fixture on `8790`,
4. runs `capture`, `cssdiff`, `pixeldiff`, and `html-report`,
5. writes:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-vs-app/test.html
```

Serve it:

```bash
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/09-serve-css-visual-diff-report.sh \
  /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-vs-app
```

Open:

```text
http://localhost:8789/test.html
```

### 8.1 What this comparison means

This is the real page comparison:

```text
prepared prototype page ↔ current built React app
```

The current config compares:

```text
full
header
nav
main
footer
```

The first successful full-page run showed:

```text
main    34.4200%
full    31.8982%
nav      8.1399%
header   7.6107%
footer   4.3483%
```

The large `main` and `full` diffs are expected at this stage because the current React Shows page uses a different structure than the prototype poster-grid page.

---

## 9. Reading `test.html`

Every report has the same high-level sections.

### 9.1 Screenshots and pixel diffs

This section shows side-by-side screenshots:

```text
Original        React        Pixel diff comparison
```

Use it to answer visual questions:

- Is one side cut off?
- Are the regions comparable?
- Are we looking at the correct selector?
- Is the mismatch mostly size, spacing, color, or completely different structure?

Click any image to open the raw PNG.

### 9.2 Validation

Validation catches bad captures before they become misleading diffs.

Good validation:

```text
status: ok
```

Example failure:

```text
react main: failed — missing expected text "Upcoming"
```

A validation failure does not always mean the run failed. It means a configured expectation was not met. Decide whether to fix the target or relax/update the expectation.

### 9.3 Computed CSS diff

This is often the most useful section for component repair. It compares configured computed properties for matching selectors.

Example:

```text
height: 33.5938px → 40px
font-size: 13px → 14px
```

Interpretation:

```text
prototype computed value → React computed value
```

### 9.4 Matched styles

When enabled, matched styles show which CSS rule won in the browser cascade. Use this when you know a property differs but do not know which selector is responsible.

Matched styles are more detailed and noisier than computed CSS. Use them after computed CSS tells you what property is wrong.

### 9.5 Files

The files section links every generated artifact. Useful raw files include:

```text
capture.json
cssdiff.json
pixeldiff.json
original-inspect.json
react-inspect.json
original-prepared.html
react-prepared.html
```

If the HTML report is too summarized, open the JSON directly.

---

## 10. The repair loop

Use this loop for any visual fix.

```text
1. Pick one small target.
2. Read test.html.
3. Identify the highest-value CSS diffs.
4. Edit the React component/tokens/CSS.
5. Run typecheck/build.
6. Re-run the relevant diff script.
7. Compare the new report.
8. Commit the focused fix.
```

For atoms:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components typecheck

cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/.../scripts/11-run-pyxis-atom-diff.sh
```

For full page:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-user-site build

cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/.../scripts/08-run-pyxis-prototype-vs-app.sh
```

Commit only related changes. Do not mix component fixes, script changes, and report docs unless the change truly spans those areas.

---

## 11. Choosing what to fix first

### Recommended order

1. **Fonts and tokens.** If the base font size or line height is wrong, many components will differ.
2. **Buttons.** Buttons appear in navigation, hero CTAs, booking flows, and cards.
3. **Badges and tags.** These are small but common, and their font-size/line-height drift is easy to fix.
4. **Inputs and selects.** Fix padding, font-size, and icon offsets before tackling forms.
5. **Icons and icon buttons.** SVG antialiasing can inflate pixel diffs; use CSS/bounds diffs more than pixel percentages.
6. **Avatars.** Usually limited to dashboard/staff surfaces, but easy to align.
7. **Page layout.** Once atoms are close, page-level diffs become easier to read.

### What not to do first

Do not start by rewriting the full Shows page layout because `full` is 30% different. That number includes atom drift, data differences, image differences, and structural differences. Fixing atoms first reduces noise.

---

## 12. Updating comparison configs

Configs live in `css-visual-diff/examples/`.

Current Pyxis configs:

```text
pyxis-prototype-only.yaml
pyxis-prototype-vs-app.yaml
pyxis-atoms-prototype-vs-storybook.yaml
```

A section entry looks like:

```yaml
sections:
  - name: button-primary
    selector: "[data-comp='button-primary']"
```

A style entry looks like:

```yaml
styles:
  - name: button-primary
    selector: "[data-comp='button-primary'] button"
    include_bounds: true
    props:
      - height
      - padding
      - background-color
      - color
      - border
      - border-radius
      - font-size
      - font-weight
      - line-height
```

Add more selectors when you need more detail. Keep selectors stable and intentional. Prefer `data-comp`, `data-region`, or `data-part` over brittle `nth-child(...)` selectors.

---

## 13. Adding a new page comparison

To add a new page, copy an existing config and change:

```yaml
metadata.slug
original.prepare.props.page
react.url
sections
styles
output.dir
```

Example for archive:

```yaml
metadata:
  slug: pyxis-archive-prototype-vs-app

original:
  prepare:
    props:
      page: archive

react:
  url: http://localhost:8790/archive

output:
  dir: ./out/pyxis-archive-prototype-vs-app
```

Then add a numbered run script if the workflow is repeatable:

```text
13-run-pyxis-archive-vs-app.sh
```

Do not leave important commands only in shell history.

---

## 14. Common failure modes

### 14.1 `--config is required` even though `--config` was passed

This was fixed by using current Glazed tags:

```go
Config string `glazed:"config"`
```

If it reappears, check `RunSettings` tags in:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/cmd/css-visual-diff/main.go
```

### 14.2 Screenshot shows DesignCanvas chrome

Symptoms:

```text
01 · Desktop
Poster-grid shell
```

Cause: you captured the DesignCanvas instead of the prepared root.

Fix:

- use a config with `prepare`,
- capture `#capture-root`,
- verify prototype-only report first.

### 14.3 Browser hangs or run times out

Common causes:

- remote images are loading slowly,
- Storybook is stale or missing the story,
- app fixture server is stale,
- a port is occupied by an old process.

The numbered scripts restart key servers where necessary. The app fixture uses local SVG data URLs to avoid remote flyer image hangs.

### 14.4 `attrs.forEach` JavaScript error

This was fixed in `cssdiff.go` by normalizing nil slices to empty arrays before JSON marshaling. If a similar error appears, inspect any Go value injected into browser JavaScript.

### 14.5 Storybook story missing

Check:

```bash
curl -fsS http://localhost:6006/index.json | grep atoms-atom-diff-fixture
```

If missing, restart Storybook or check the story file:

```text
web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx
```

---

## 15. When to use `understand_image`

Use `understand_image` or human visual review for semantic screenshot questions:

- Does the screenshot include the footer?
- Does the capture show design-canvas chrome?
- Is one side obviously cut off?
- Are the two sections visually comparable?

Do not use OCR/Tesseract as the first-line tool for these questions. DOM validation and `understand_image` are better for this workflow.

---

## 16. What to commit

Commit source changes, configs, scripts, and docs. Do not commit generated reports.

Commit these when changed:

```text
web/packages/pyxis-components/src/...
web/packages/pyxis-user-site/src/...
ttmp/.../scripts/...
ttmp/.../reference/...
ttmp/.../changelog.md
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/*.yaml
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/...
```

Do not commit:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/
```

That directory is generated and ignored.

---

## 17. Quick command reference

### Prototype only

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/06-run-pyxis-prototype-only.sh
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/09-serve-css-visual-diff-report.sh \
  /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-only
```

Open:

```text
http://localhost:8789/test.html
```

### Atom diff

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/11-run-pyxis-atom-diff.sh
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/12-serve-atom-diff-report.sh
```

Open:

```text
http://localhost:8792/test.html
```

### Full Shows page diff

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/08-run-pyxis-prototype-vs-app.sh
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/09-serve-css-visual-diff-report.sh \
  /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-vs-app
```

Open:

```text
http://localhost:8789/test.html
```

---

## 18. Closing checklist before fixing CSS

Before editing components, confirm:

- [ ] Prototype-only report is clean and does not show DesignCanvas chrome.
- [ ] Atom diff report loads and all selectors are present.
- [ ] Full-page report loads and sections are comparable.
- [ ] You know which component or token you are fixing first.
- [ ] You have a baseline report open in the browser.
- [ ] You will rerun the same script after the fix.

The goal is not to make every number zero immediately. The goal is to make the comparison loop trustworthy, then use it to reduce differences in a deliberate order.
