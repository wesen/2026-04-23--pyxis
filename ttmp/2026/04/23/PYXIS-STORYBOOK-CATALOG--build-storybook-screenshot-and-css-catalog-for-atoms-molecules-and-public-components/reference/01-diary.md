---
Title: Diary
Ticket: PYXIS-STORYBOOK-CATALOG
Status: active
Topics:
    - frontend
    - storybook
    - css-visual-diff
    - design-system
DocType: reference
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: ""
LastUpdated: 2026-04-23T22:48:55.940608831-04:00
WhatFor: ""
WhenToUse: ""
---

# Diary

## Goal

<!-- What is the purpose of this reference document? -->

## Context

<!-- Provide background context needed to use this reference -->

## Quick Reference

<!-- Provide copy/paste-ready content, API contracts, or quick-look tables -->

## Usage Examples

<!-- Show how to use this reference in practice -->

## Related

<!-- Link to related documents or resources -->

## Step 1: Establish Storybook-side catalog extraction, then pivot baseline to prototype

The first implementation pass created a Storybook-side extraction catalog from the built `pyxis-components` Storybook `index.json`. That proved the new standalone `css-visual-diff inspect` artifact commands can produce PNG, computed CSS Markdown/JSON, prepared HTML, and inspect JSON for each story. After a full initial run, the runner was optimized to use `--all-styles` so each story loads once and emits both `story-root` and `component-focus` bundles.

The user then clarified the more important ordering: the catalog should start from the prototype baseline, especially `prototype-design/Pyxis Public Site.html`, and also include only the Foundations section of `prototype-design/Pyxis Full App.html`. I inspected the prototype files and confirmed that we did not yet have a complete baseline catalog for all public-site atoms/molecules/organisms; we had page-level direct-render captures and the atom diff fixture, but not a systematic baseline catalog.

### Prompt Context

**User prompt (verbatim):** "ok, we updated css-visual-diff to be able to directly take screenshots and css and as such work out a proper .yml file .

Read `css-visual-diff help story-config-authoring` to learn how to do that. I want you to extract every atom and molecule and such as png and css . 

Prefer read_image tool instead of understand_image .

Create a docmgr ticket about creating the best catalog of atom, molecules, etc... to get pixel perfect covert. Keep a detailed  diary as you go. You can store scripts in the scripts/ folder of the ticket."

**Assistant interpretation:** Create a repeatable catalog workflow using the new css-visual-diff inspect/config authoring features, with ticket-local docs and scripts.

**Inferred user intent:** Build a durable visual baseline catalog so Storybook components can be repaired toward pixel-perfect parity instead of working from ad hoc screenshots.

### What I did

- Created ticket `PYXIS-STORYBOOK-CATALOG`.
- Read `css-visual-diff help story-config-authoring`.
- Built `pyxis-components` Storybook and inspected `storybook-static/index.json`.
- Generated 72 Storybook story configs under `sources/story-configs/`.
- Wrote scripts:
  - `scripts/01-generate-story-catalog-configs.mjs`
  - `scripts/02-run-story-catalog-inspect.sh`
  - `scripts/03-build-story-catalog-index.mjs`
  - `scripts/04-serve-story-catalog.sh`
  - `scripts/05-run-full-story-catalog.sh`
- Ran a full Storybook extraction once: 72 stories, 144 probe bundles, no failures.
- Optimized the runner to use `css-visual-diff inspect --all-styles` and validated with `LIMIT=3`, completing three stories in about 5 seconds.
- Inspected sample PNGs using the `read` image tool.
- Added prototype baseline configs:
  - `sources/prototype-configs/prototype-foundations-system.css-visual-diff.yml`
  - `sources/prototype-configs/prototype-public-shows.css-visual-diff.yml`
- Added prototype baseline runner scripts:
  - `scripts/06-run-prototype-baseline-sample.sh`
  - `scripts/07-run-prototype-baseline-full.sh`
- Ran sample prototype baseline extraction for Full App foundations and Public Site Shows.

### Why

The Storybook catalog is useful, but the prototype must be treated as the visual source of truth. The baseline catalog should therefore be extracted from `Pyxis Public Site.html` and the `SystemPage` Foundations section of `Pyxis Full App.html` before using Storybook output as a repair target.

### What worked

- `css-visual-diff inspect --all-styles` is much faster than invoking `inspect` once per probe.
- `direct-react-global` works for `SystemPage` and `PPXDesktop` once the prototype is served locally.
- Sample prototype captures were visually correct:
  - foundations primary button,
  - foundations form fields card,
  - public nav,
  - public first show tile,
  - public first poster.

### What didn't work

- The initial Storybook runner loaded each story twice. It worked but was unnecessarily slow.
- Storybook preview CSS coverage is incomplete/tricky because `web/packages/pyxis-components/.storybook/` is currently ignored globally. Card styles were missing until the local ignored preview imported `Card.css`; that should not be silently relied upon as the final state.

### What I learned

- The prototype contains two relevant sources of catalog truth:
  - `screens/ppxis.jsx` for the public poster-grid site,
  - `screens/system.jsx` for Full App Foundations.
- `Pyxis Full App.html` includes many backend/admin/staff workflow artboards, but the user only wants the Foundations part for this catalog.
- The public poster-grid prototype is separate from the older `screens/public.jsx` public site; the current baseline should use `screens/ppxis.jsx` via `PPXDesktop`/`PPXMobile`.

### What was tricky to build

The prototype code is mostly inline styles and lacks stable `data-part` selectors. For `SystemPage`, selectors currently use structural `nth-child` paths. That is acceptable for a first catalog, but it is brittle. A better future step is to use a prepare script that annotates sections after render or to add stable prototype-side catalog attributes if we decide to modify prototype files.

### What warrants a second pair of eyes

- Whether the structural selectors in `prototype-foundations-system.css-visual-diff.yml` are stable enough for long-term baseline work.
- Whether to force-add component Storybook `.storybook/preview.tsx` so Storybook CSS imports are tracked.
- Whether the Storybook-side catalog should be regenerated only after the prototype baseline is made comprehensive.

### What should be done in the future

- Expand prototype public baseline configs beyond Shows to detail, archive, book, about, and mobile variants.
- Add a browsable prototype baseline index, similar to the Storybook catalog index.
- Decide whether prototype functions like `ShowTile`, `PPXNav`, and `Poster` should be exported to `window` for cleaner direct component cataloging.

### Code review instructions

Start with:

```text
sources/prototype-configs/prototype-foundations-system.css-visual-diff.yml
sources/prototype-configs/prototype-public-shows.css-visual-diff.yml
scripts/06-run-prototype-baseline-sample.sh
scripts/07-run-prototype-baseline-full.sh
```

Validate with:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/06-run-prototype-baseline-sample.sh
```

Then inspect the generated sample PNGs under:

```text
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/various/prototype-baseline/sample/
```

### Technical details

Prototype sources inspected:

```text
prototype-design/Pyxis Public Site.html
prototype-design/Pyxis Full App.html
prototype-design/screens/ppxis.jsx
prototype-design/screens/system.jsx
prototype-design/lib/components.jsx
```

Important prototype exports:

```text
SystemPage
PPXDesktop
PPXMobile
PPXShell
P_SHOWS
```

## Step 2: Force-add the component Storybook preview config

The catalog work exposed a reproducibility problem: `web/.gitignore` ignores all `.storybook/` directories, but the component Storybook preview controls the CSS imports used by the catalog screenshots. In particular, Card styling only appeared after importing `Card.css` in the local preview file. If that file remains ignored, future catalog output can silently differ from this machine.

I therefore force-added the component Storybook config. Although the user specifically asked for `preview.tsx`, I also staged `main.ts` because Storybook needs both files to be reproducible from a clean checkout. I removed an unused `withTests` import from `preview.tsx` before staging.

### Prompt Context

**User prompt (verbatim):** "force add the .storybook preview.tsx"

**Assistant interpretation:** Track the ignored component Storybook preview file so the catalog's CSS import environment is reproducible.

**Inferred user intent:** Ensure the Storybook-side catalog is not dependent on local ignored files, especially the preview CSS imports needed for accurate component screenshots.

### What I did

- Read `web/packages/pyxis-components/.storybook/preview.tsx`.
- Read `web/packages/pyxis-components/.storybook/main.ts`.
- Removed the unused `withTests` import from `preview.tsx`.
- Force-added both `.storybook/preview.tsx` and `.storybook/main.ts` to git.

### Why

The Storybook catalog screenshots depend on preview-level CSS imports:

```text
../src/tokens/tokens.css
../src/atoms/Button/Button.css
../src/atoms/Icon/Icon.css
../src/atoms/Input/Input.css
../src/atoms/Select/Select.css
../src/atoms/Textarea/Textarea.css
../src/molecules/Card/Card.css
../src/public/PubNav/PubNav.css
```

Without tracking the preview file, Card and other stylesheet-dependent components can render differently for the next developer.

### What worked

The files were force-added despite the global `.storybook/` ignore rule.

### What didn't work

N/A.

### What I learned

The catalog work made Storybook preview imports part of the visual testing surface. Ignored Storybook config is not acceptable once screenshots become a baseline artifact.

### What was tricky to build

The tricky part is repository hygiene: `web/.gitignore` ignores `.storybook/` globally, which probably made sense early on, but it hides config that is now essential for visual catalog reproducibility.

### What warrants a second pair of eyes

Confirm that `main.ts` should be tracked alongside `preview.tsx`. I included it because a tracked preview without a tracked main config is incomplete for a clean checkout.

### What should be done in the future

Consider narrowing `web/.gitignore` so package `.storybook/` directories are no longer ignored, or add explicit negation rules for package-level Storybook config.

### Code review instructions

Start with:

```text
web/packages/pyxis-components/.storybook/main.ts
web/packages/pyxis-components/.storybook/preview.tsx
```

Check that the preview imports every CSS file needed for catalog rendering.

## Step 3: Export prototype public-site catalog globals

I added catalog-only wrapper globals to the poster-grid public-site prototype so `css-visual-diff` can render individual public components directly, rather than always cropping them out of a whole page. This keeps the existing `PPXDesktop` and `PPXMobile` render paths unchanged while giving the catalog stable `data-catalog` selectors.

The first sample run caught a selector issue: `poster-redroom` succeeded, but `show-tile-redroom` hung during `--all-styles` because the `title` selector did not match the actual nested ShowTile DOM. I stopped the loop, narrowed the failure to `show-tile-redroom`, fixed the selectors, added a timeout guard to the sample runner, and then reran the three-component sample successfully.

### Prompt Context

**User prompt (verbatim):** "1. yes do the window global thing"

**Assistant interpretation:** Implement the proposed `window` exports/catalog wrappers in the prototype so individual public-site parts can be rendered by `css-visual-diff`.

**Inferred user intent:** Make the prototype baseline catalog cleaner and less brittle by replacing page-crop selectors with direct component fixture renders.

### What I did

- Edited `prototype-design/screens/ppxis.jsx`.
- Added catalog-only wrappers:
  - `PPXCatalogFrame`
  - `PPXCatalogPoster`
  - `PPXCatalogShowTile`
  - `PPXCatalogNav`
  - `PPXCatalogFooter`
  - `PPXCatalogPageHeader`
  - `PPXCatalogShowGrid`
- Exported existing raw public components to `window`:
  - `Poster`
  - `PPXNav`
  - `PPXFooter`
  - `ShowTile`
  - `PageHeader`
- Exported the new catalog wrappers to `window`.
- Added sample component configs under `sources/prototype-configs/public-components/`:
  - `poster-redroom.css-visual-diff.yml`
  - `show-tile-redroom.css-visual-diff.yml`
  - `nav-desktop.css-visual-diff.yml`
- Added `scripts/08-run-prototype-public-component-sample.sh`.
- Ran the component sample and inspected PNGs with the `read` image tool.

### Why

The earlier prototype baseline config used whole-page selectors such as:

```css
#capture-root main div[style*='grid-template-columns'] > div:first-child button
```

Those selectors work, but they are brittle. The new wrappers allow selectors like:

```css
[data-catalog='show-tile'] > div
[data-catalog='nav'] header
[data-catalog='poster'] > div
```

That is safer and clearer for a long-lived baseline catalog.

### What worked

- `PPXCatalogPoster` rendered directly via `direct-react-global`.
- `PPXCatalogShowTile` rendered directly after correcting nested selectors.
- `PPXCatalogNav` rendered directly.
- The sample produced PNG and CSS bundles for poster, show tile, and nav.

### What didn't work

The first `show-tile-redroom` run hung on a missing selector. The bad selectors assumed that `[data-catalog='show-tile']` directly contained the poster/title/button structure. In reality, the catalog wrapper contains the existing ShowTile root div, so selectors need one additional `> div` hop.

Bad example:

```css
[data-catalog='show-tile'] > div:nth-child(2) > div:first-child
```

Fixed example:

```css
[data-catalog='show-tile'] > div > div:nth-child(2) > div:first-child
```

### What I learned

- `css-visual-diff inspect --all-styles` currently can hang for a long time when a selector does not match during artifact generation, so sample runners should use `timeout` while configs are being authored.
- Direct prototype component fixtures are much easier to reason about than page-crop selectors, but wrapper depth still matters.

### What was tricky to build

The wrappers must not change the existing prototype pages. To keep that invariant, I added new fixture components at the bottom of `ppxis.jsx` and only extended `Object.assign(window, ...)`. Existing `Poster`, `ShowTile`, `PPXNav`, `PPXFooter`, and page logic were not modified.

### What warrants a second pair of eyes

- Whether the wrapper widths (`270`, `920`, `390`, `856`) are the right canonical catalog widths.
- Whether additional `data-catalog` attributes should be inserted deeper into fixture wrappers to reduce selectors further.
- Whether `css-visual-diff inspect` should get a selector timeout to avoid long hangs on missing selectors.

### What should be done in the future

- Add configs for footer, page header, show grid, mobile nav, mobile show tile, and each poster variant.
- Add a generated prototype component catalog index like the Storybook catalog index.
- Consider improving `css-visual-diff` so missing selectors fail fast in artifact mode.

### Code review instructions

Start with:

```text
prototype-design/screens/ppxis.jsx
sources/prototype-configs/public-components/show-tile-redroom.css-visual-diff.yml
scripts/08-run-prototype-public-component-sample.sh
```

Validate with:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/08-run-prototype-public-component-sample.sh
```

Then inspect:

```text
various/prototype-baseline/sample-public-components/poster-redroom/poster/screenshot.png
various/prototype-baseline/sample-public-components/show-tile-redroom/show-tile/screenshot.png
various/prototype-baseline/sample-public-components/nav-desktop/nav/screenshot.png
```

## Step 4: Write the HTML prototype baseline extraction playbook

After adding direct public prototype catalog fixtures, I wrote a ticket-local playbook that explains the end-to-end method for extracting trustworthy baselines from `.html` prototype files. The playbook focuses on the distinction between DesignCanvas screenshots and prepared component/page render roots, and it records the sample-first workflow that prevented runaway full-catalog runs while selectors were still being authored.

The document is intentionally practical: it includes command examples, YAML patterns, artifact expectations, selector debugging steps, timeout guidance, and a checklist for committing new baseline configs.

### Prompt Context

**User prompt (verbatim):** "write a detailed playbook on how to do this baseline screenshotting / extracting from a .html file. Store in ticket"

**Assistant interpretation:** Create a durable ticket-local guide for extracting prototype baseline PNG/CSS/HTML/inspect artifacts from Pyxis prototype HTML files using css-visual-diff.

**Inferred user intent:** Enable the next developer to repeat and extend the prototype baseline catalog without relying on chat history or fragile ad hoc commands.

### What I did

- Added `playbooks/02-html-prototype-baseline-extraction-playbook.md`.
- Covered:
  - serving prototype HTML,
  - why not to trust DesignCanvas screenshots,
  - `direct-react-global` prepare hooks,
  - page-level baselines,
  - Full App Foundations baseline extraction,
  - direct component fixture baselines,
  - YAML authoring patterns,
  - sample-first loop,
  - manual PNG inspection with the `read` image tool,
  - prepared HTML debugging,
  - timeout guards for selector authoring,
  - storage conventions,
  - adding new component baselines,
  - comparing baselines to Storybook later.

### Why

The prototype baseline workflow is now central to the Pyxis pixel-perfect work. It needs to be explicit and reproducible inside the ticket, especially because the workflow crosses prototype HTML, browser globals, css-visual-diff configs, generated artifacts, and Storybook repair work.

### What worked

The playbook now documents the exact lessons from the previous sample runs, including the `show-tile-redroom` selector hang and the corrected nested selectors.

### What didn't work

N/A.

### What I learned

The baseline extraction workflow is easiest to teach when framed as a three-layer process:

1. prepare the `.html` into a clean render root,
2. extract a small trusted sample,
3. only then expand to a component/page matrix.

### What was tricky to build

The playbook must be clear that extraction-only configs still duplicate `original` and `react` targets because css-visual-diff remains comparison-shaped. The actual extraction command uses one side, usually `--side original`.

### What warrants a second pair of eyes

Review whether the playbook's recommended output/storage paths match the long-term docmgr artifact policy.

### What should be done in the future

Keep the playbook current as new prototype fixture wrappers and configs are added.

### Code review instructions

Start with:

```text
playbooks/02-html-prototype-baseline-extraction-playbook.md
```

Then validate the commands referenced in the playbook with:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/08-run-prototype-public-component-sample.sh
```

## Step 5: Generate standalone public and foundations HTML pages

I added generated standalone prototype HTML entrypoints so top-level pages can be opened and captured directly without the DesignCanvas wrapper. These files are useful when the baseline target is a full page rather than an individual catalog fixture.

The public standalone pages render `PPXDesktop` or `PPXMobile` directly. The foundations standalone page renders `SystemPage` directly from the Full App prototype source files.

### Prompt Context

**User prompt (verbatim):** "can you transform each top level page into its own html as standalone? like Shows and Show detail etc..."

**Assistant interpretation:** Create standalone HTML files for the prototype top-level public pages so each page has a clean URL for screenshot/CSS extraction.

**Inferred user intent:** Make baseline extraction easier by eliminating the need to prepare/bypass DesignCanvas for full-page captures.

### What I did

- Added `scripts/09-generate-standalone-public-html.mjs`.
- Generated standalone public desktop and mobile pages:
  - `prototype-design/standalone/public/shows.html`
  - `prototype-design/standalone/public/detail.html`
  - `prototype-design/standalone/public/archive.html`
  - `prototype-design/standalone/public/book.html`
  - `prototype-design/standalone/public/about.html`
  - plus `*-mobile.html` variants.
- Added `prototype-design/standalone/public/index.html`.
- Added `scripts/10-generate-standalone-foundations-html.mjs`.
- Generated `prototype-design/standalone/foundations/system.html`.
- Added `prototype-design/standalone/index.html` as a top-level standalone index.
- Validated `standalone/public/shows.html` with `css-visual-diff inspect --all-styles`.
- Validated `standalone/foundations/system.html` with `css-visual-diff inspect --all-styles`.
- Read sample PNG outputs with the `read` image tool.

### Why

Direct standalone pages give simple stable URLs like:

```text
http://localhost:7070/standalone/public/shows.html
```

This is easier to use for full-page baselines than loading the DesignCanvas page and relying on `direct-react-global` prepare hooks every time.

### What worked

- The standalone Shows page rendered correctly and produced expected nav and first show tile screenshots.
- The standalone Foundations page rendered `SystemPage` and produced the expected primary button screenshot.

### What didn't work

N/A.

### What I learned

Standalone pages and `direct-react-global` fixtures serve different purposes:

- standalone pages are best for full pages,
- catalog fixture globals are best for small component baselines.

### What was tricky to build

Relative script paths matter. Because the public pages live under `prototype-design/standalone/public/`, their shared script imports use `../../lib/...` and `../../screens/...`, which resolve to `/lib/...` and `/screens/...` when served from `prototype-design/`.

### What warrants a second pair of eyes

Confirm whether standalone pages should be committed as source artifacts or generated only on demand. I committed them because they are useful human-facing prototype entrypoints and not large binary artifacts.

### What should be done in the future

Add css-visual-diff configs that target the standalone page URLs directly for page-level baseline extraction.

### Code review instructions

Review:

```text
prototype-design/standalone/public/*.html
prototype-design/standalone/foundations/system.html
scripts/09-generate-standalone-public-html.mjs
scripts/10-generate-standalone-foundations-html.mjs
```

Validate with:

```bash
python3 -m http.server 7070 --directory prototype-design
# open http://localhost:7070/standalone/index.html
```

## Step 6: Expand prototype baseline configs and fix missing-selector hangs

I continued the extensive catalog work by adding a generated prototype baseline config matrix and a browsable prototype baseline index. During validation, the first sample run exposed a tooling and catalog-design issue: the generated Foundations config had individual `badge`/`tag` selectors using `[data-part]`, but the prototype `Badge` and `Tag` functions in `prototype-design/lib/components.jsx` do not emit `data-part` attributes. `css-visual-diff inspect --all-styles` reached the missing `badge` selector and hung inside `chromedp.Screenshot` until the shell timeout killed the run.

The fix had two parts.

First, I changed the catalog generator to use card-level Foundations probes instead of individual `badge`, `tag`, `button`, and input probes. The Foundations baseline now captures stable cards such as `badges-tags-card`, `buttons-card`, `form-fields-card`, `stats-card`, `icons-card`, `navigation-card`, and so on. This matches the user's request to use card-level probes and avoids pretending the prototype has the same selector API as the React implementation.

Second, I patched `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff` so `inspect` preflights selector existence before selector-backed artifacts such as PNG, HTML, inspect JSON, or bundle output. A missing selector now fails immediately with a clear error like:

```text
flag "selector" selector did not match: #missing
```

instead of waiting for `chromedp.Screenshot` to time out.

### Prompt Context

**User prompt (verbatim):** "use card-level probes. Also fix css-visual-diff so that it doesn't timeout if the selector is not there."

**Assistant interpretation:** Do not add prototype-side data attributes for foundation atoms right now; use broader, stable card-level extraction for Foundations. Also improve the css-visual-diff inspect implementation so bad selectors fail fast.

### What I did

- Added `scripts/11-generate-prototype-baseline-configs.mjs`.
- Added `scripts/12-build-prototype-baseline-index.mjs`.
- Added `scripts/13-serve-prototype-baseline-index.sh`.
- Updated `scripts/06-run-prototype-baseline-sample.sh` to run a broader representative sample.
- Updated `scripts/07-run-prototype-baseline-full.sh` to recurse through all prototype config subdirectories and continue collecting failures.
- Generated 29 prototype baseline configs covering:
  - Foundations/SystemPage card-level probes,
  - public pages desktop/mobile,
  - poster variants,
  - nav/footer desktop/mobile,
  - page header,
  - show grid desktop/mobile,
  - show tile desktop/compact.
- Fixed public page structural selectors after `PageHeader` introduced two sibling nodes before page content.
- Built the prototype baseline index under `various/prototype-baseline/index.html` and `index.md`.
- Patched `css-visual-diff` inspect selector preflight in `internal/cssvisualdiff/modes/inspect.go`.
- Added a small unit test in `internal/cssvisualdiff/modes/inspect_test.go` for selector-backed format classification.
- Ran `go test ./internal/cssvisualdiff/modes ./cmd/css-visual-diff` successfully.
- Ran `make install` in the css-visual-diff repo.
- Verified a missing selector now fails immediately using a temporary local HTTP page and config.
- Re-ran the expanded Pyxis prototype baseline sample successfully.
- Inspected sample PNGs with the `read` image tool:
  - Foundations badges/tags card,
  - public Shows grid,
  - show tile poster crop.

### What worked

- `inspect --all-styles` does reuse a single loaded/prepared page for all styles in one config; the original slowness was not per-style page reload.
- The new selector preflight produces immediate clear failures for missing selectors.
- Card-level Foundations probes avoid the missing `[data-part]` issue and still provide useful visual/CSS evidence for the baseline catalog.
- The expanded sample now completes and generates the expected PNG/CSS/HTML/inspect bundles.

### What didn't work

- The first generated Foundations config used individual prototype selectors such as `[data-part="badge"]`; those do not exist in the prototype.
- Several initial page selectors assumed that `PageHeader` was a single DOM child. It actually renders two siblings: a header block and a divider rule. Public page selectors had to be shifted so page content starts at `main > :nth-child(3)`.

### What I learned

- `css-visual-diff inspect --all-styles` has the correct broad shape: one navigation and prepare per config, then multiple probes on the same page.
- Missing selectors need explicit preflight before screenshotting because `chromedp.Screenshot(selector)` can wait for a selector instead of returning immediately.
- Prototype baseline selectors should not reuse React implementation selectors unless the prototype actually exposes them.

### What was tricky to build

The correct fix was split across two repos: the Pyxis catalog generator needed less brittle selectors, while css-visual-diff needed a defensive failure mode. Fixing only one side would not be enough: good configs still deserve better tool errors, and better tool errors would still expose bad configs.

### What warrants a second pair of eyes

- Whether `inspectFormatRequiresExistingSelector` should also make CSS-only formats fail on missing selectors. I left CSS JSON/Markdown able to report `exists: false`, because that can be useful for scripts.
- Whether the Foundations baseline should eventually add prototype-side `data-proto-part` selectors for atom-level probes. For now the user requested card-level probes.

### What should be done in the future

- Run the full prototype baseline extraction with `scripts/07-run-prototype-baseline-full.sh`.
- Serve and manually review `various/prototype-baseline/index.html`.
- Consider adding a comparison index mapping prototype baseline entries to Storybook entries.

### Code review instructions

Review Pyxis catalog changes first:

```text
scripts/11-generate-prototype-baseline-configs.mjs
scripts/06-run-prototype-baseline-sample.sh
scripts/07-run-prototype-baseline-full.sh
sources/prototype-configs/prototype-foundations-system.css-visual-diff.yml
```

Then review css-visual-diff changes:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/inspect.go
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/inspect_test.go
```

Validate with:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
go test ./internal/cssvisualdiff/modes ./cmd/css-visual-diff
make install

cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/06-run-prototype-baseline-sample.sh
```

## Step 7: Run the full prototype baseline extraction

After the catalog generator and missing-selector fixes were validated against the expanded sample, I ran the full prototype baseline extraction. This executed every generated prototype config, including Foundations/SystemPage, all desktop/mobile public pages, and all public component/widget baselines.

The full run completed successfully. It wrote artifacts under `various/prototype-baseline/artifacts/`, rebuilt the browsable index, and served the index locally for review. I also inspected representative PNGs from the full output with the `read` image tool to make sure the extraction produced meaningful visual crops rather than empty wrappers or wrong DOM nodes.

### Prompt Context

**User prompt (verbatim):** "run the full extraction"

**Assistant interpretation:** Execute the full 29-config prototype baseline extraction, rebuild the index, and make the artifacts inspectable.

**Inferred user intent:** Move from sample validation to a complete baseline artifact set that can be reviewed and used for future Storybook/React comparison work.

### What I did

- Ran:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/07-run-prototype-baseline-full.sh
```

- Rebuilt the prototype baseline index:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/12-build-prototype-baseline-index.mjs
```

- Counted generated artifact totals:

```text
artifact_dirs: 29
screenshots: 165
computed_css_md: 165
prepared_html: 165
inspect_json: 165
```

- Served the baseline index:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/13-serve-prototype-baseline-index.sh
```

- Index URL:

```text
http://localhost:8795/index.html
```

- Visually inspected representative full-run PNGs:
  - `artifacts/prototype-public-about/about-ethos/screenshot.png`
  - `artifacts/prototype-public-book/book-layout/screenshot.png`
  - `artifacts/poster-zola/poster/screenshot.png`

### Why

The sample run was sufficient for validating selectors, but the catalog is only useful for future comparison work once the full artifact set exists. Running the full extraction confirms that all generated configs can execute end to end with the current `css-visual-diff` behavior.

### What worked

- All 29 configs completed.
- All 165 configured style probes produced screenshot, CSS Markdown, prepared HTML, and inspect JSON bundles.
- The index was rebuilt and served at `http://localhost:8795/index.html`.
- Representative PNGs showed the intended page/component regions.

### What didn't work

N/A for this run. No selector failures occurred in the full extraction.

### What I learned

The generator, card-level Foundations probes, shifted page selectors, and css-visual-diff selector preflight fixes are now sufficient for full-catalog extraction. The artifact count matches the configured probe count, which is a useful sanity check.

### What was tricky to build

The full extraction depended on several earlier fixes: missing selectors had to fail fast, Foundations had to avoid invalid React-only `[data-part]` selectors, and page sections had to account for `PageHeader` returning two siblings. Without those fixes, the full run would either hang or stop on the first bad selector.

### What warrants a second pair of eyes

- Review the served index manually to spot any overly broad or overly narrow crops.
- Verify whether per-style `prepared.html` is still worth the artifact volume for full catalog runs.
- Consider whether a future index should show thumbnails instead of only config/output counts.

### What should be done in the future

- Use this full artifact set as the baseline for mapping prototype entries to Storybook entries.
- Add page-level prototype-vs-Storybook comparison configs using these baseline selectors and outputs.
- Consider implementing css-visual-diff batch mode or root-once prepared HTML to reduce full-run time and artifact volume.

### Code review instructions

Start with the generated index:

```text
http://localhost:8795/index.html
```

Then inspect representative artifacts under:

```text
various/prototype-baseline/artifacts/
```

Validation commands:

```bash
find ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/various/prototype-baseline/artifacts -name 'screenshot.png' | wc -l
find ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/various/prototype-baseline/artifacts -name 'computed-css.md' | wc -l
```

## Step 8: Relocate the complete baseline to prototype-design/baseline and fix the index counts

The baseline should not live only under the ticket workspace. I moved the generated baseline to `prototype-design/baseline/`, updated the generator and helper scripts to treat that directory as the canonical baseline root, and fixed the index-count bug that had been showing `0 screenshots` for many entries.

### What I changed

- Canonical baseline root is now:

```text
prototype-design/baseline/
```

- Updated scripts:
  - `scripts/11-generate-prototype-baseline-configs.mjs`
  - `scripts/12-build-prototype-baseline-index.mjs`
  - `scripts/13-serve-prototype-baseline-index.sh`
  - `scripts/06-run-prototype-baseline-sample.sh`
  - `scripts/07-run-prototype-baseline-full.sh`
  - `scripts/08-run-prototype-public-component-sample.sh`

- Added root ignore:

```text
.gitignore
```

with:

```text
prototype-design/baseline/
```

### Root cause of the bad index counts

The index builder reads screenshot counts from the manifest output paths. The manifest pointed at structured paths such as:

```text
prototype-design/baseline/artifacts/public/shows
```

but the old full-run script overrode those config-defined output paths with slug-based `--out` directories like:

```text
.../various/prototype-baseline/artifacts/prototype-public-shows
```

So the screenshots existed, but not where the manifest/index expected them. That is why the index showed `0 screenshots`.

### Validation

I regenerated the configs/manifest, reran the full extraction, rebuilt the index, and confirmed the new baseline location and counts:

```text
prototype-design/baseline/index.html
prototype-design/baseline/manifest.json
prototype-design/baseline/artifacts/
```

Served URL:

```text
http://localhost:8795/index.html
```

Sanity-check totals after rerun:

```text
screenshots: 165
computed_css_md: 165
prepared_html: 165
inspect_json: 165
```

I also confirmed the rebuilt HTML index contains non-zero screenshot labels such as `14 screenshots`, `9 screenshots`, `5 screenshots`, and `2 screenshots`.

## Step 9: Move baseline YAML configs into prototype-design/visual-diff and copy the scripts there

To make the prototype baseline workflow self-contained under `prototype-design/`, I moved the generated `css-visual-diff` YAML configs into `prototype-design/visual-diff/` and copied the baseline helper scripts into `prototype-design/visual-diff/scripts/`.

### Canonical locations

```text
prototype-design/visual-diff/
prototype-design/visual-diff/public-components/
prototype-design/visual-diff/scripts/
prototype-design/baseline/
```

### What I changed

- Ran the copied generator from:

```text
prototype-design/visual-diff/scripts/11-generate-prototype-baseline-configs.mjs
```

- This regenerated all 29 baseline YAML configs under `prototype-design/visual-diff/`.
- Copied these helper scripts into `prototype-design/visual-diff/scripts/`:
  - `06-run-prototype-baseline-sample.sh`
  - `07-run-prototype-baseline-full.sh`
  - `08-run-prototype-public-component-sample.sh`
  - `11-generate-prototype-baseline-configs.mjs`
  - `12-build-prototype-baseline-index.mjs`
  - `13-serve-prototype-baseline-index.sh`
- Adjusted the copied scripts so they resolve the repo root relative to their own location instead of depending on the ticket path.
- Removed the old ticket-local YAML directory:

```text
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/sources/prototype-configs/
```

### Result

The prototype baseline workflow is now organized like this:

- **Prototype HTML and standalone pages:** `prototype-design/`
- **Prototype visual-diff configs:** `prototype-design/visual-diff/`
- **Prototype visual-diff scripts:** `prototype-design/visual-diff/scripts/`
- **Generated baseline artifacts and index:** `prototype-design/baseline/`

The rebuilt manifest now points at config paths such as:

```text
prototype-design/visual-diff/prototype-public-shows.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-redroom.css-visual-diff.yml
```

## Step 10: Add baseline extraction for `prototype-design/Pyxis Mobile.html`

After moving the baseline/config workflow into `prototype-design/`, I extended it to cover the mobile prototype HTML. The mobile prototype is another DesignCanvas-based file, so the same lesson applies: do not capture the canvas directly. Instead, generate clean standalone HTML entrypoints for each mobile screen and run `css-visual-diff inspect --all-styles` against those standalone pages.

### What I changed

- Added a new generator:

```text
prototype-design/visual-diff/scripts/14-generate-standalone-mobile-html.mjs
```

- Generated standalone mobile pages under:

```text
prototype-design/standalone/mobile/
```

for these screens:

```text
login
home
shows
show-detail
calendar
bookings
booking-review
artists
artist-detail
post-show
settings
```

- Extended the canonical baseline config generator:

```text
prototype-design/visual-diff/scripts/11-generate-prototype-baseline-configs.mjs
```

with 11 new `mobile-screen` configs sourced from:

```text
prototype-design/Pyxis Mobile.html
```

- Added a dedicated `Mobile app screens` section to the browsable baseline index.
- Updated the sample runner to include a few representative mobile screens.

### Why this approach

The mobile file follows the same DesignCanvas pattern as the public-site prototype. That means the cleanest long-term extraction path is not a viewport screenshot of `Pyxis Mobile.html`; it is a set of generated standalone roots that render one named screen each. This keeps selectors small, the prepared DOM easy to inspect, and the baseline reproducible.

### Validation

I ran:

```bash
node prototype-design/visual-diff/scripts/14-generate-standalone-mobile-html.mjs
node prototype-design/visual-diff/scripts/11-generate-prototype-baseline-configs.mjs
prototype-design/visual-diff/scripts/06-run-prototype-baseline-sample.sh
prototype-design/visual-diff/scripts/07-run-prototype-baseline-full.sh
prototype-design/visual-diff/scripts/12-build-prototype-baseline-index.mjs
```

Current totals after adding mobile screens:

```text
configs: 40
screenshots: 261
computed_css_md: 261
prepared_html: 261
inspect_json: 261
```

I visually inspected representative mobile artifacts including:

```text
prototype-design/baseline/sample/prototype-mobile-home/full-screen/screenshot.png
prototype-design/baseline/sample/prototype-mobile-login/full-screen/screenshot.png
prototype-design/baseline/sample/prototype-mobile-shows/first-show-row/screenshot.png
prototype-design/baseline/artifacts/mobile/settings/inspect/original/full-screen/screenshot.png
prototype-design/baseline/artifacts/mobile/calendar/inspect/original/full-screen/screenshot.png
```

The captures looked correct: clean standalone mobile screens, no DesignCanvas chrome, and meaningful screen/section crops.
