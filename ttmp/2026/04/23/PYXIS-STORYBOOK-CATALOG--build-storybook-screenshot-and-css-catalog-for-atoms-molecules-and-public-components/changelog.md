# Changelog

## 2026-04-23

- Initial workspace created


## 2026-04-24 — Add prototype baseline catalog configs

### Added
- Added `sources/prototype-configs/prototype-foundations-system.css-visual-diff.yml` for `Pyxis Full App.html` Foundations / `SystemPage` only.
- Added `sources/prototype-configs/prototype-public-shows.css-visual-diff.yml` for `Pyxis Public Site.html` poster-grid Shows page.
- Added `scripts/06-run-prototype-baseline-sample.sh` to validate a small baseline sample before full extraction.
- Added `scripts/07-run-prototype-baseline-full.sh` to extract all configured prototype baseline probes.

### Validated
- Ran the prototype baseline sample successfully.
- Visually inspected sample PNG outputs with the `read` image tool.

### Notes
- We do not yet have a complete baseline catalog for all public pages/components; this is the first structured baseline layer.
- `Pyxis Full App.html` should contribute only the Foundations/SystemPage section to this ticket, not backend/admin workflow screens.

## 2026-04-24 — Track component Storybook preview config

### Added
- Force-added `web/packages/pyxis-components/.storybook/preview.tsx` so visual catalog CSS imports are reproducible.
- Force-added `web/packages/pyxis-components/.storybook/main.ts` as the companion Storybook config needed by a clean checkout.

### Changed
- Removed an unused `withTests` import from `preview.tsx`.

### Why
- The Storybook catalog depends on preview-level CSS imports, including `Card.css`; leaving preview ignored makes catalog screenshots machine-local and non-reproducible.

## 2026-04-24 — Add public prototype component catalog globals

### Added
- Added catalog-only public-site wrappers in `prototype-design/screens/ppxis.jsx`:
  - `PPXCatalogPoster`
  - `PPXCatalogShowTile`
  - `PPXCatalogNav`
  - `PPXCatalogFooter`
  - `PPXCatalogPageHeader`
  - `PPXCatalogShowGrid`
- Exported raw public-site components and catalog wrappers to `window` for `direct-react-global` rendering.
- Added sample component baseline configs for poster, show tile, and nav.
- Added `scripts/08-run-prototype-public-component-sample.sh`.

### Validated
- Ran the public component sample successfully after correcting ShowTile selectors.
- Inspected sample PNGs with the `read` image tool.

### Fixed while authoring
- Corrected `show-tile-redroom` nested selectors after the first sample run hung on a missing title selector.
- Added a `timeout 90s` guard to the sample runner to avoid long waits while authoring selectors.

## 2026-04-24 — Add HTML prototype baseline extraction playbook

### Added
- Added `playbooks/02-html-prototype-baseline-extraction-playbook.md`.

### Contents
- How to serve prototype `.html` files.
- Why to bypass DesignCanvas and use prepared render roots.
- How to use `direct-react-global` for page and component baselines.
- How to author YAML configs and inspect artifacts.
- How to debug selectors via `prepared.html`.
- How to avoid long hangs with `timeout` while authoring configs.
- How to store generated artifacts and what not to commit.
- Checklist for adding new baseline configs.

## 2026-04-24 — Add standalone prototype HTML pages

### Added
- Added generated standalone public prototype pages under `prototype-design/standalone/public/`.
- Added desktop and mobile standalone HTML for shows, detail, archive, book, and about.
- Added standalone Foundations/SystemPage HTML under `prototype-design/standalone/foundations/system.html`.
- Added scripts:
  - `scripts/09-generate-standalone-public-html.mjs`
  - `scripts/10-generate-standalone-foundations-html.mjs`

### Validated
- Used `css-visual-diff inspect --all-styles` against `standalone/public/shows.html`.
- Used `css-visual-diff inspect --all-styles` against `standalone/foundations/system.html`.
- Inspected sample PNGs with the `read` image tool.

## 2026-04-24 — Expand prototype baseline catalog and fail fast on missing selectors

### Added
- Added `scripts/11-generate-prototype-baseline-configs.mjs` to generate the extensive prototype baseline config matrix.
- Added `scripts/12-build-prototype-baseline-index.mjs` to build a browsable prototype baseline manifest.
- Added `scripts/13-serve-prototype-baseline-index.sh` to serve the generated prototype baseline index.
- Added generated prototype configs for all public standalone pages, public component variants, poster variants, nav/footer variants, show grids, and show tiles.

### Changed
- Updated Foundations/SystemPage baseline generation to use card-level probes instead of individual `badge`, `tag`, button, and form-control selectors.
- Updated the prototype baseline sample runner to exercise a broader representative catalog sample.
- Updated the full prototype baseline runner to recurse through subdirectories and report failures.
- Updated page selectors to account for `PageHeader` rendering a heading block plus divider before page content.

### Validated
- Regenerated 29 prototype baseline configs.
- Ran the expanded prototype baseline sample successfully.
- Built the prototype baseline index.
- Inspected representative PNGs with the `read` image tool.

### Related tooling fix
- Patched `css-visual-diff inspect` so selector-backed artifact formats preflight selector existence before screenshotting.
- Verified missing selectors now fail immediately instead of waiting for the shell timeout.
- Ran `go test ./internal/cssvisualdiff/modes ./cmd/css-visual-diff` and `make install` in the css-visual-diff repo.

## 2026-04-24 — Add extensive catalog postmortem report

### Added
- Added `reference/02-postmortem-extensive-prototype-catalog-and-css-visual-diff.md`.

### Contents
- Explains the prototype baseline catalog system for a new intern.
- Documents the catalog architecture, generated config counts, artifact model, extraction pipeline, and runner workflow.
- Records encountered problems: invalid `[data-part]` prototype selectors, missing-selector screenshot hangs, and page selector shifts caused by `PageHeader` fragments.
- Documents css-visual-diff improvements made and future optimization/documentation recommendations.

### Publishing
- Prepared for upload to reMarkable under `/ai/2026/04/23/PYXIS-STORYBOOK-CATALOG/`.

## 2026-04-24 — Run full prototype baseline extraction

### Added
- Generated full prototype baseline artifacts under `various/prototype-baseline/artifacts/`.
- Rebuilt `various/prototype-baseline/index.html` and `index.md`.

### Validated
- Full extraction completed for all 29 generated configs.
- Generated 165 screenshot bundles, 165 computed CSS Markdown files, 165 prepared HTML files, and 165 inspect JSON files.
- Served the baseline index at `http://localhost:8795/index.html`.
- Inspected representative PNGs from About, Book, and poster baselines with the `read` image tool.

## 2026-04-24 — Relocate baseline to prototype-design/baseline

### Changed
- Moved the generated prototype baseline out of the ticket-local `various/prototype-baseline/` directory into `prototype-design/baseline/`.
- Updated baseline generator/index/server/sample/full-run scripts to use `prototype-design/baseline/`.
- Added a root `.gitignore` entry for `prototype-design/baseline/` so generated baseline artifacts do not dirty git status.

### Fixed
- Fixed the browsable index showing `0 screenshots` for many entries. The bug was that `scripts/07-run-prototype-baseline-full.sh` overrode config output directories with slug-based `--out` paths that did not match the manifest/index paths. The full extraction now writes to the config-defined output directories under `prototype-design/baseline/artifacts/`.

### Validated
- Regenerated the prototype baseline manifest in `prototype-design/baseline/manifest.json`.
- Re-ran the full 29-config extraction into `prototype-design/baseline/artifacts/`.
- Rebuilt `prototype-design/baseline/index.html` and confirmed the index now contains non-zero screenshot counts.
- Re-served the baseline index at `http://localhost:8795/index.html`.

## 2026-04-24 — Move prototype baseline YAMLs and script copies into prototype-design/visual-diff

### Changed
- Moved the generated prototype baseline YAML configs from the ticket-local `sources/prototype-configs/` directory into `prototype-design/visual-diff/`.
- Copied the prototype baseline helper scripts into `prototype-design/visual-diff/scripts/` so the baseline configs and execution helpers are self-contained under `prototype-design/`.
- Regenerated `prototype-design/baseline/manifest.json` and rebuilt the baseline index so config links now point at `prototype-design/visual-diff/*.css-visual-diff.yml`.

### New canonical locations
- Configs: `prototype-design/visual-diff/`
- Script copies: `prototype-design/visual-diff/scripts/`
- Artifacts/index: `prototype-design/baseline/`

## 2026-04-24 — Add Pyxis Mobile prototype baseline workflow

### Added
- Added standalone mobile screen HTML generator at `prototype-design/visual-diff/scripts/14-generate-standalone-mobile-html.mjs`.
- Generated standalone mobile entrypoints under `prototype-design/standalone/mobile/` for:
  - login
  - home
  - shows
  - show-detail
  - calendar
  - bookings
  - booking-review
  - artists
  - artist-detail
  - post-show
  - settings
- Extended `prototype-design/visual-diff/scripts/11-generate-prototype-baseline-configs.mjs` with 11 mobile-screen baseline configs sourced from `prototype-design/Pyxis Mobile.html`.
- Added a new `Mobile app screens` section to the baseline index.

### Changed
- Updated `prototype-design/standalone/index.html` to link to the new mobile standalone page index.
- Updated `prototype-design/visual-diff/scripts/06-run-prototype-baseline-sample.sh` to include representative mobile screen configs.

### Validated
- Regenerated the baseline manifest and index.
- Re-ran the full baseline extraction with mobile included.
- Current totals:
  - configs: `40`
  - screenshots: `261`
  - computed CSS Markdown: `261`
  - prepared HTML: `261`
  - inspect JSON: `261`
- Visually inspected representative mobile artifacts for Home, Login, Settings, Calendar, and Shows.

## 2026-04-24 — Add Full App non-foundations prototype baseline workflow

### Added
- Added standalone Full App screen generator at `prototype-design/visual-diff/scripts/15-generate-standalone-full-app-html.mjs`.
- Generated standalone Full App entrypoints under `prototype-design/standalone/full-app/` for all non-foundations screens:
  - login
  - setup
  - dashboard
  - shows
  - calendar
  - bookings
  - modal
  - artists
  - attendance
  - log
  - discord
  - settings
- Extended `prototype-design/visual-diff/scripts/11-generate-prototype-baseline-configs.mjs` with 12 `full-app-screen` configs sourced from `prototype-design/Pyxis Full App.html`.
- Added a `Full App screens` group to the baseline index builder.
- Added Full App-only runners:
  - `prototype-design/visual-diff/scripts/16-run-full-app-screen-sample.sh`
  - `prototype-design/visual-diff/scripts/17-run-full-app-baseline-full.sh`

### Changed
- Updated `prototype-design/standalone/index.html` to link to the new standalone Full App screen index.
- Regenerated `prototype-design/baseline/manifest.json` and rebuilt `prototype-design/baseline/index.html`.

### Validated
- Ran the Full App sample runner successfully after fixing selector assumptions.
- Ran the Full App-only full export successfully into `prototype-design/baseline/artifacts/full-app/` without recomputing the existing public/mobile/foundations baseline set.
- Current totals after adding Full App screens:
  - configs: `52`
  - screenshots: `354`
  - computed CSS Markdown: `354`
  - prepared HTML: `354`
  - inspect JSON: `354`
  - Full App screenshots: `93`
- Visually inspected representative Full App PNGs for login, dashboard, modal, settings, bookings, audit log, artists, and setup.

### Fixed while authoring
- Corrected app-shell selectors after discovering most Full App `main` regions have a header plus one content wrapper, rather than many direct card children.
- Corrected Bookings and Audit Log selectors after the Full App-only full runner exposed extra content-wrapper hops.

## 2026-04-24

Step 11: added the non-foundations Full App baseline export workflow and generated the Full App-only baseline artifacts under prototype-design/baseline (commit c9d0bf0).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/baseline/manifest.json — Updated manifest with full-app-screen entries
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/15-generate-standalone-full-app-html.mjs — Standalone Full App generator
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/17-run-full-app-baseline-full.sh — Full App-only extraction runner


## 2026-04-24 — Add phased Storybook catalog expansion tasks

### Added
- Added detailed multi-phase tasks for pivoting from prototype baseline extraction to Storybook-side catalog capture.
- The new plan captures the design-system component layer first: atoms, molecules, organisms, fixtures, and missing component states.
- The plan then expands public-site component stories and maps them back to `prototype-design/Pyxis Public Site.html` baseline entries.

### Sequencing
- Phase 1: audit current Storybook inventory and establish `prototype-design/storybook-catalog/` output layout.
- Phase 2: run a component-system Storybook sample and then full atoms/molecules/organisms extraction.
- Phase 3: add missing stories/states for atoms, molecules, and organisms.
- Phase 4: map component-system Storybook captures back to Full App foundations/card-level prototype baselines.
- Phase 5: expand public-site component stories.
- Phase 6: refocus on `prototype-design/Pyxis Public Site.html` for component-level and page-level comparisons.
- Phase 7: keep diary/changelog updated after each capture/story-expansion phase.

## 2026-04-24 — Add Storybook component inventory

### Added
- Added `prototype-design/storybook-catalog/inventory.json`.
- Added `prototype-design/storybook-catalog/inventory.md`.

### Inventory summary
- Parsed `web/packages/pyxis-components/storybook-static/index.json`.
- Current totals:
  - index entries: `97`
  - story entries: `72`
  - docs entries: `25`
  - story files: `26`
  - design-system stories: `52`
  - public stories: `20`
- Group breakdown:
  - atoms: `9` components, `47` stories
  - molecules: `1` component, `5` stories
  - public: `16` components, `20` stories

### Gaps identified
- Missing molecule stories for `CardHead`, `Empty`, `Field`, `LogRow`, `Stat`, and `Table`.
- Missing organism stories for `Modal` and `TopBar`.
- Public components mostly have one story each and will need prototype-equivalent variants before public-site comparison.

## 2026-04-24 — Document component taxonomy and start atom Storybook capture

### Added
- Added `docs/component-system-and-public-site-components.md` as a textbook-style reference for the Pyxis component taxonomy.
- Added `prototype-design/visual-diff/scripts/18-generate-storybook-design-system-configs.mjs`.
- Added `prototype-design/visual-diff/scripts/19-run-storybook-atoms-sample.sh`.
- Generated Storybook design-system configs under `prototype-design/visual-diff/storybook-components/`.
- Generated `prototype-design/storybook-catalog/manifest.json`.

### Validated
- Ran the first atom sample against `pyxis-components` Storybook on port 6006.
- Captured AtomDiffFixture, Button, Badge, Tag, and Input stories with `story-root` and `component-focus` probes.
- Visually inspected representative PNGs with `read`.

### Notes
- The component taxonomy uses two axes: composition level and domain.
- `VenueCard` is documented as a public-site organism, not a generic design-system organism.
- Some generic `component-focus` crops remain broad for full-width stories and may later need story-specific probes.
