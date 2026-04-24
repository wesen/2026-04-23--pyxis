---
Title: "Continuation Playbook: Building the Extensive Pyxis Visual Catalog"
Ticket: "PYXIS-STORYBOOK-CATALOG"
Status: "active"
Topics: [frontend, storybook, css-visual-diff, prototype, visual-regression, design-system]
DocType: "playbook"
Intent: "handoff"
Owners: []
RelatedFiles:
  - Path: prototype-design/screens/ppxis.jsx
    Note: Public prototype components, pages, and catalog fixture globals
  - Path: prototype-design/standalone/public/shows.html
    Note: Example standalone public page baseline entrypoint
  - Path: prototype-design/standalone/foundations/system.html
    Note: Standalone Foundations/SystemPage baseline entrypoint
  - Path: scripts/08-run-prototype-public-component-sample.sh
    Note: Sample-first public component baseline runner
  - Path: scripts/09-generate-standalone-public-html.mjs
    Note: Regenerates public standalone page HTML files
  - Path: scripts/10-generate-standalone-foundations-html.mjs
    Note: Regenerates Foundations standalone HTML
Summary: "Continuation guide for extending the Pyxis prototype and Storybook visual catalog toward full baseline coverage."
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: "Use this when taking over the catalog work and extending baseline/Storybook coverage."
WhenToUse: "Before adding new prototype configs, new Storybook configs, new catalog index pages, or page/component comparisons."
---

# Continuation Playbook: Building the Extensive Pyxis Visual Catalog

This playbook is for the next colleague who continues the Pyxis visual catalog work. It assumes you are starting from the current ticket state, not from chat history. The goal is to build an extensive catalog of baseline prototype elements and Storybook implementation elements so the public site can be repaired toward pixel-perfect parity.

The short version is this:

> First catalog the prototype baseline. Then catalog the Storybook implementation. Then compare the two. Do not repair Storybook from vague page screenshots; repair it from named baseline elements with PNG, computed CSS, prepared HTML, and inspect JSON.

## 1. Start here: current mental model

There are two catalogs.

| Catalog | Source | Purpose |
|---|---|---|
| Prototype baseline catalog | `prototype-design/*.html`, `screens/ppxis.jsx`, `screens/system.jsx` | Defines what the design intends. |
| Storybook implementation catalog | `web/packages/pyxis-components` stories | Defines what React currently renders. |

The prototype catalog is the source of truth. Storybook is the implementation to repair.

The main mistake to avoid is starting with full-page pixel diffs before the component baseline is stable. Work from smaller to larger:

```text
prototype fixture baseline
  ↓
Storybook fixture catalog
  ↓
component-level comparison
  ↓
page-section comparison
  ↓
full-page comparison
```

## 2. Important repo and ticket paths

Repo root:

```text
/home/manuel/code/wesen/2026-04-23--pyxis
```

Catalog ticket:

```text
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/
```

Prototype sources:

```text
prototype-design/Pyxis Public Site.html
prototype-design/Pyxis Full App.html
prototype-design/screens/ppxis.jsx
prototype-design/screens/system.jsx
prototype-design/lib/components.jsx
prototype-design/lib/tokens.js
```

Standalone generated HTML:

```text
prototype-design/standalone/index.html
prototype-design/standalone/public/*.html
prototype-design/standalone/foundations/system.html
```

`css-visual-diff` source:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
```

Use the installed verb:

```bash
css-visual-diff ...
```

If you change `css-visual-diff` itself:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
make install
```

## 3. Read these docs first

Before coding, read:

```text
playbooks/02-html-prototype-baseline-extraction-playbook.md
playbooks/03-continuation-playbook-extensive-catalog.md
reference/01-diary.md
design/01-storybook-catalog-extraction-plan.md
```

Also useful:

```bash
css-visual-diff help story-config-authoring
css-visual-diff help inspect-workflow
css-visual-diff help artifact-commands
css-visual-diff help config-selectors
```

The most important command pattern is:

```bash
css-visual-diff inspect --config CONFIG.yml --side original --all-styles --out OUT_DIR
```

for prototype baselines, and:

```bash
css-visual-diff inspect --config CONFIG.yml --side react --all-styles --out OUT_DIR
```

for Storybook implementation extraction.

## 4. Current status

Implemented so far:

- Ticket `PYXIS-STORYBOOK-CATALOG` exists.
- Storybook config generation exists for `pyxis-components` stories.
- 72 Storybook story configs were generated under `sources/story-configs/`.
- Prototype baseline configs exist for:
  - Full App Foundations/SystemPage,
  - public Shows page,
  - direct public components: poster redroom, show tile redroom, nav desktop.
- `prototype-design/screens/ppxis.jsx` exports catalog globals:
  - `PPXCatalogPoster`
  - `PPXCatalogShowTile`
  - `PPXCatalogNav`
  - `PPXCatalogFooter`
  - `PPXCatalogPageHeader`
  - `PPXCatalogShowGrid`
- Standalone HTML pages exist for public desktop/mobile pages and Foundations/SystemPage.
- Component Storybook `.storybook/main.ts` and `.storybook/preview.tsx` are tracked so the baseline environment is reproducible.

## 5. Finish the catalog in this order

If you are continuing this work, do not jump straight into visual repair. Finish the catalog first.

### Step A: Regenerate the prototype baseline configs

Run the generator script:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/11-generate-prototype-baseline-configs.mjs
```

This writes the complete baseline config set under `sources/prototype-configs/` and refreshes the manifest under `various/prototype-baseline/manifest.json`.

The generated surface should now include:

- Foundations/SystemPage
- public pages:
  - Shows desktop/mobile
  - Show detail desktop/mobile
  - Archive desktop/mobile
  - Book desktop/mobile
  - About desktop/mobile
- public components:
  - posters for every poster kind exposed by `PPXCatalogPoster`
  - show tile desktop/compact variants
  - nav desktop/mobile
  - footer desktop/mobile
  - page header
  - show grid desktop/mobile

### Step B: Run the sample set and inspect PNGs by eye

Use the sample runner first:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/06-run-prototype-baseline-sample.sh
```

Then inspect the sample PNGs with the `read` image tool. Do not trust dimensions alone. The sample is only useful if the PNGs are visibly the intended page or component.

### Step C: Run the full baseline catalog

Once the sample looks correct, run the full pass:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/07-run-prototype-baseline-full.sh
```

This should walk all `*.css-visual-diff.yml` files recursively, including the public component subdirectory.

### Step D: Build and serve the browsable manifest

Generate the catalog index:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/12-build-prototype-baseline-index.mjs
```

Then serve it:

```bash
ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/13-serve-prototype-baseline-index.sh
```

Open:

```text
http://localhost:8795/index.html
```

## 6. What “complete” means for this catalog

A baseline catalog is complete when all of the following are true:

1. The prototype source of truth is covered.
   - `prototype-design/Pyxis Public Site.html`
   - `prototype-design/Pyxis Full App.html` foundations only
2. The standalone public pages exist and can be re-generated.
3. The public prototype wrappers exist on `window` for direct component extraction.
4. The config set is broad enough to cover the public page shell and the key public parts individually.
5. The baseline outputs are reproducible from scripts in the ticket `scripts/` directory.
6. The output browser/report is easy to open without hunting through directories.
7. The diary and changelog record what was added and how to rerun it.

Do not declare the catalog complete until the manifest page can be opened and the sample/full runners succeed from a clean checkout.

## 7. How to extend the catalog safely

When adding a new baseline target:

1. Ask whether it belongs in the prototype baseline, the Storybook catalog, or both.
2. Prefer a direct wrapper global if it is a component-sized thing.
3. Prefer a standalone HTML page if it is a page-sized thing.
4. Add a config with a stable selector.
5. Run a sample first.
6. Inspect `prepared.html` and the PNG.
7. Only then add a broader run or comparison.

### Good selector choices

- `data-catalog` wrappers for prototype component fixtures
- `data-part` selectors for atoms and molecules in Storybook or the component system
- direct structural page selectors only when the DOM is stable enough to survive refactors

### Bad selector choices

- brittle `nth-child` paths when a stable wrapper can be added instead
- wrapper-only selectors that do not isolate the intended thing
- selectors that match the wrong element just because the dimensions look plausible

## 8. Keep the diary as you go

For this ticket, the diary is part of the deliverable, not an optional note.

Update at least these files as you work:

- `reference/01-diary.md`
- `changelog.md`

Record:

- what you added,
- why you added it,
- what worked,
- what broke,
- exact commands you ran,
- any selector fixes or timeouts,
- what a future colleague should verify first.

If you add a new runner or generator script, mention it in the diary the same day.

## 9. Troubleshooting checklist

If a config fails, check these in order:

1. Is the prototype server running on `http://localhost:7070`?
2. Is the URL correct for the page or component?
3. Does `prepared.html` show the right root?
4. Is the selector rooted at the actual rendered element, not a wrapper one level too high or low?
5. Did the page render before capture, or did the screenshot happen too early?
6. Is the target using a font or asset that requires extra wait time?
7. Did a `timeout` hide a slow but valid render, or expose a broken selector?

If the page looks correct in the browser but the captured PNG is wrong, the first suspect is the selector, not the visual design.

## 10. Handoff advice for the next colleague

The next colleague should think of the catalog as a set of reproducible evidence bundles, not as a one-time screenshot dump.

Their job is to keep expanding the baseline surface until the public site has a clear, named visual target for every major page and public component.

The best next additions are the ones that reduce ambiguity:

- more poster variants
- more page-level page sections
- a comparison index against the Storybook stories
- page-level prototype-vs-Storybook configs once the baseline feels stable

If they keep the catalog broad, the later CSS repair work will be far easier.

## 11. Current catalog counts and performance notes

The current prototype baseline matrix is generated by:

```bash
scripts/11-generate-prototype-baseline-configs.mjs
```

It currently produces:

| Category | Count |
|---|---:|
| Foundations/SystemPage configs | 1 |
| Public top-level page configs | 10 |
| Public component/widget configs | 18 |
| Total prototype configs | 29 |
| Total configured style probes | 165 |

The 10 public page configs are the five public pages in desktop and mobile form:

```text
shows / shows-mobile
detail / detail-mobile
archive / archive-mobile
book / book-mobile
about / about-mobile
```

The 18 widget/component configs are:

```text
9 poster variants
2 show tile variants
2 nav variants
2 footer variants
1 page header
2 show grid variants
```

The expanded sample runner currently exercises 16 representative configs and produced 106 screenshot bundles in the last validation run.

### Important performance fact

`css-visual-diff inspect --all-styles` does **not** reload the browser page for every style inside one config. It loads and prepares once, then loops through the style probes.

But the shell runners invoke one CLI process per config, so the sample still performs 16 config loads and the full run performs 29 config loads.

This is expected. If you need further speed, optimize at the runner/tooling layer rather than splitting configs into even smaller files.

### Missing selectors now fail fast

`css-visual-diff` was patched so selector-backed inspect artifacts preflight selector existence before calling `chromedp.Screenshot`. Missing selectors now fail immediately with a clear error, for example:

```text
style "first-show-tile" selector did not match: #root > div > main > :nth-child(2) > div:first-child
```

This means bad selectors should no longer consume the full shell timeout.

### Foundations rule: use card-level probes

For the Foundations/SystemPage baseline, use card-level probes. Do not generate individual `badge`, `tag`, button, input, select, or textarea selectors unless the prototype is explicitly changed to expose stable prototype-side selectors.

Correct baseline probes include:

```text
badges-tags-card
buttons-card
form-fields-card
stats-card
icons-card
radii-elevation-card
navigation-card
log-rows-card
empty-state-card
principles
```

Avoid selectors like:

```css
#capture-root [data-part="badge"]
#capture-root [data-part="tag"]
```

Those are React implementation selectors. They do not exist in the prototype Foundations source.

### Optimization backlog

If catalog extraction becomes too slow, consider these improvements in order:

1. Add a true batch mode to `css-visual-diff` that reuses one browser across many configs.
2. Add config-level selector preflight so all missing selectors are reported before artifact generation starts.
3. Add a runner option for CSS-only extraction, followed by screenshot extraction for selected probes.
4. Add an option to write root-level prepared HTML once per config instead of once per style.
5. Parallelize independent configs with bounded concurrency.
6. Keep page screenshots tight; do not use overly tall viewports/min-heights unless necessary.

