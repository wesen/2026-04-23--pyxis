---
Title: Storybook catalog extraction plan
Ticket: PYXIS-STORYBOOK-CATALOG
Status: active
Topics:
    - frontend
    - storybook
    - css-visual-diff
    - design-system
DocType: design
Intent: long-term
Owners: []
RelatedFiles:
    - Path: prototype-design/Pyxis Full App.html
      Note: Prototype Full App entrypoint containing Foundations/SystemPage artboard
    - Path: prototype-design/Pyxis Public Site.html
      Note: Prototype public-site HTML baseline entrypoint
    - Path: prototype-design/screens/ppxis.jsx
      Note: Poster-grid public site component/page definitions
    - Path: prototype-design/screens/system.jsx
      Note: Full App Foundations/SystemPage component system baseline
    - Path: scripts/01-generate-story-catalog-configs.mjs
      Note: Generates per-story css-visual-diff YAML configs from Storybook index.json
    - Path: scripts/02-run-story-catalog-inspect.sh
      Note: Runs standalone css-visual-diff inspect bundles for selected or all stories
    - Path: scripts/03-build-story-catalog-index.mjs
      Note: Builds browsable HTML/Markdown index over generated PNG/CSS bundles
    - Path: ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/sources/prototype-configs/prototype-foundations-system.css-visual-diff.yml
      Note: Full App Foundations prototype baseline config
    - Path: ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/sources/prototype-configs/prototype-public-shows.css-visual-diff.yml
      Note: Public Shows prototype baseline config
    - Path: web/packages/pyxis-components/storybook-static/index.json
      Note: Built Storybook story inventory consumed by the catalog generator
ExternalSources: []
Summary: Plan and current implementation notes for generating a Pyxis Storybook visual catalog.
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: Use this when continuing the Storybook screenshot/CSS catalog work.
WhenToUse: Before running the full extraction, changing selectors, or deciding whether css-visual-diff needs source changes.
---


# Storybook catalog extraction plan

## Goal

Create the best practical catalog of Pyxis prototype and Storybook-rendered atoms, molecules, organisms, foundations, and public components so the team can work toward pixel-perfect visual parity.

The ordering is important: the prototype baseline must come first. Storybook is the implementation catalog and repair target; it should be judged against the baseline extracted from:

```text
prototype-design/Pyxis Public Site.html
prototype-design/Pyxis Full App.html
```

For `Pyxis Full App.html`, only the `01 · Foundations` / `SystemPage` artboard is in scope for this catalog. Backend/admin/staff workflow artboards are explicitly out of scope here.

The catalog should contain, for each story or baseline probe:

- PNG screenshot of the story frame,
- PNG screenshot of the most relevant component focus element,
- computed CSS Markdown and JSON for both probes,
- prepared HTML,
- inspect JSON,
- and a browsable index page.

This is intentionally an extraction/catalog workflow, not a prototype-vs-React comparison workflow. It uses the new `css-visual-diff inspect`, `screenshot`, and `css-md` functionality described by:

```bash
css-visual-diff help story-config-authoring
```

## Current implementation shape

The ticket contains the reusable scripts under `scripts/`:

| Script | Purpose |
|---|---|
| `01-generate-story-catalog-configs.mjs` | Reads built component Storybook `index.json` and generates one `.css-visual-diff.yml` per story. |
| `02-run-story-catalog-inspect.sh` | Runs `css-visual-diff inspect --all-styles` for selected stories or the full manifest. |
| `03-build-story-catalog-index.mjs` | Builds `various/story-catalog/index.html` and `index.md`. |
| `04-serve-story-catalog.sh` | Serves the generated catalog at `http://localhost:8795/index.html`. |
| `05-run-full-story-catalog.sh` | Orchestrates build/serve/generate/inspect/index for the full Storybook-side run. |
| `06-run-prototype-baseline-sample.sh` | Runs a small prototype baseline sample before expensive/full runs. |
| `07-run-prototype-baseline-full.sh` | Runs all configured prototype baseline probes. |

Generated, reproducible artifacts are intentionally ignored by ticket `.gitignore`:

```text
various/story-catalog/artifacts/
various/story-catalog/index.html
various/story-catalog/index.md
various/story-catalog/status.tsv
various/story-catalog/failures.tsv
```

The manifest and YAML configs are not ignored; they are useful source-like artifacts.

## Baseline model

The baseline catalog now starts with ticket-managed prototype configs under:

```text
sources/prototype-configs/
```

Current baseline configs:

| Config | Source | Scope |
|---|---|---|
| `prototype-foundations-system.css-visual-diff.yml` | `Pyxis Full App.html` | `SystemPage` / Foundations only |
| `prototype-public-shows.css-visual-diff.yml` | `Pyxis Public Site.html` | `PPXDesktop({ page: "shows" })` poster-grid public page |

These use `direct-react-global` prepare hooks to bypass the DesignCanvas and render the actual component into `#capture-root`.

## Storybook implementation catalog model

Each generated Storybook YAML points both `original` and `react` at the same Storybook iframe URL. This is not because we are comparing two implementations, but because `css-visual-diff` still uses the two-target config schema. The extraction runner uses only the `react` side.

Each story config defines two style probes:

1. `story-root` — the padded Storybook render frame:

```yaml
selector: "#storybook-root > *:first-child"
```

2. `component-focus` — the first meaningful descendant such as `data-part`, `data-comp`, `button`, `input`, `nav`, `section`, `article`, etc.

The story root is a good screenshot for composition. The component focus is better for pixel-level CSS review.

## Settling and speed

The first version loaded each Storybook iframe twice per story: once for `story-root` and once for `component-focus`. That worked, but it doubled the page navigation and wait cost.

The runner now uses:

```bash
css-visual-diff inspect --config "$config" --side react --all-styles --out "$out_base"
```

This loads the page once, waits/prepares once, and then writes both probe bundles.

The generated configs also moved from a fixed `wait_ms: 1500` to a more explicit prepare wait:

```yaml
wait_ms: 0
prepare:
  type: script
  wait_for: "document.querySelector('#storybook-root > *:first-child') && (!document.fonts || document.fonts.status === 'loaded')"
  after_wait_ms: 150
```

That is faster than a fixed sleep while still waiting for the Storybook root and fonts.

## Sample-first safety loop

Do not run all 72 stories after every script change. Use `LIMIT` and/or `STORY_GREP`:

```bash
LIMIT=3 ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/02-run-story-catalog-inspect.sh

STORY_GREP=Button LIMIT=2 ttmp/2026/04/23/PYXIS-STORYBOOK-CATALOG--build-storybook-screenshot-and-css-catalog-for-atoms-molecules-and-public-components/scripts/02-run-story-catalog-inspect.sh
```

Only run the full catalog after the sample images and CSS look credible.

## Validation done so far

A full extraction was run once before the speed changes and produced:

- 72 Storybook stories,
- 144 probe bundles,
- 144 screenshot PNGs,
- 144 computed CSS Markdown files,
- no inspect failures.

After changing the runner to `--all-styles` and changing the generated waits, a sample run was performed:

```bash
LIMIT=3 scripts/02-run-story-catalog-inspect.sh
```

It completed in approximately 5 seconds and produced OK bundles for:

- `atoms-atom-diff-fixture--default`,
- `atoms-avatar--default`,
- `atoms-avatar--playground`.

The sample screenshots were visually inspected with the `read` image tool. The avatar focus crop and atom fixture story screenshot looked correct.

## Known issue / important observation

The component Storybook preview imports only a subset of component CSS files. During testing, Card screenshots initially lacked Card styling because `Card.css` was not imported into the ignored local Storybook preview file.

Local file involved:

```text
web/packages/pyxis-components/.storybook/preview.tsx
```

This directory is currently ignored by `web/.gitignore`, so any dependency on preview imports should be handled deliberately before finalizing the catalog workflow. Options:

1. force-add the component Storybook `.storybook` config, or
2. change the catalog prep to inject/import the relevant CSS another way, or
3. move Storybook CSS imports into a tracked preview/style entry.

Do not silently trust the Card/Public catalog until this is resolved in a tracked way.

## Current answer to “do we have the baseline catalog?”

Not yet completely.

Before this ticket, the project had:

- direct-render full-page public-site captures,
- atom parity fixture captures,
- Storybook story coverage,
- and page-level comparison reports.

It did **not** have a systematic prototype baseline catalog of all atoms/molecules/organisms/public-site parts as PNG+CSS. This ticket now starts that baseline with the foundations `SystemPage` and the poster-grid Shows page.

## Prototype public-site component inventory

The public poster-grid site in `screens/ppxis.jsx` contains these reusable pieces:

- `Poster` plus poster variants:
  - `PosterRedroom`
  - `Poster808`
  - `PosterPetals`
  - `PosterMeetups`
  - `PosterBasement`
  - `PosterOrphx`
  - `PosterMoor`
  - `PosterCygnus`
  - `PosterZola`
- `PPXNav`
- `PPXFooter`
- `ShowTile`
- `PageHeader`
- pages:
  - `ShowsPage`
  - `ShowDetail`
  - `ArchivePage`
  - `BookUsPage`
  - `AboutPage`
- shell exports:
  - `PPXShell`
  - `PPXDesktop`
  - `PPXMobile`

Only `PPXDesktop`, `PPXMobile`, `PPXShell`, and `P_SHOWS` are explicitly exported to `window`. Individual atoms like `ShowTile` and `Poster` are not yet exported, so the current baseline uses direct page render plus selectors. If we want a cleaner per-component prototype catalog, we should either export those functions for cataloging or add a prepare script that renders wrapper components inside the same script scope.

## Full App Foundations inventory

The foundations artboard in `screens/system.jsx` contains:

- Color swatches
- Typography rows
- Badges
- Tags
- Buttons
- Icon buttons
- Form fields
- Stat tiles
- Icon grid
- Radii and elevation samples
- Navigation preview
- Log rows
- Empty state
- Principles cards

These are now represented in `prototype-foundations-system.css-visual-diff.yml` with structural selectors.

## Next decisions

1. Expand prototype public baseline configs to detail, archive, book, about, and mobile variants.
2. Decide whether to export `ShowTile`, `Poster`, `PPXNav`, etc. to `window` for cleaner component-level baseline configs.
3. Decide whether to force-add `web/packages/pyxis-components/.storybook/preview.tsx` so Storybook CSS imports are tracked.
4. Run a small representative Storybook sample after that decision:
   - Button default,
   - Card with header,
   - PubNav default.
5. If sample output is correct, run the full Storybook catalog with `05-run-full-story-catalog.sh`.
6. Serve the catalog with `04-serve-story-catalog.sh` and manually review the index.
