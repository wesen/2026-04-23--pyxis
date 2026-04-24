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
