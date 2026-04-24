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
