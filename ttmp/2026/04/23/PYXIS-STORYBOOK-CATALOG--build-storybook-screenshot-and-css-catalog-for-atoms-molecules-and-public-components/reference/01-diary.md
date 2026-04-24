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
