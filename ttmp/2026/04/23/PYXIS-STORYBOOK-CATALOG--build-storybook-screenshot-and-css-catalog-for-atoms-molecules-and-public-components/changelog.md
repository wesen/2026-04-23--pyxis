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
