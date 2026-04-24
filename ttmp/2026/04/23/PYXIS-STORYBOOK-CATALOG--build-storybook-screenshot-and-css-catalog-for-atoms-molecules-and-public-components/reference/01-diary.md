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
