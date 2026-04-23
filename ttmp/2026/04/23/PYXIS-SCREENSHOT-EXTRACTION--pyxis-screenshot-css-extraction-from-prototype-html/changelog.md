# Changelog — PYXIS-SCREENSHOT-EXTRACTION

## 2026-04-23

### Initial setup
- Created ticket via `docmgr ticket create-ticket --ticket PYXIS-SCREENSHOT-EXTRACTION`
- Set up ticket directory structure: design/, reference/, scripts/, sources/, playbooks/

### Screenshots captured
All 10 artboards captured at full artboard dimensions with wider viewport (no cutoff):

```
prototype-design/01-desktop-shows.png    — 920×1460 ✓
prototype-design/02-desktop-detail.png   — 920×1100 ✓
prototype-design/03-desktop-archive.png  — 920×1400 ✓
prototype-design/04-desktop-book.png     — 920×1200 ✓
prototype-design/05-desktop-about.png   — 920×1200 ✓
prototype-design/06-mobile-shows.png    — 390×1780 ✓
prototype-design/07-mobile-detail.png   — 390×1500 ✓
prototype-design/08-mobile-archive.png  — 390×1700 ✓
prototype-design/09-mobile-book.png     — 390×1700 ✓
prototype-design/10-mobile-about.png   — 390×1600 ✓
```

Also: `prototype-design/prototype-overview.png` — overview of full canvas (not useful for comparison, but kept for reference).

### Component screenshots captured (21 clips)
```
prototype-design/comp/01–06  — desktop shows: full, nav, heading, hero, list, footer
prototype-design/comp/07–09  — desktop detail: full, hero, body
prototype-design/comp/10–13  — desktop archive: full, header, stats, years
prototype-design/comp/14–16  — desktop book: full, form, sidebar
prototype-design/comp/17–18  — desktop about: full, hero
prototype-design/comp/19–20  — mobile shows: full, nav
```

### Scripts created
All scripts live in `scripts/` and are run from `web/` workspace:

| Script | Purpose |
|---|---|
| `scripts/analyze-prototype.mjs` | DOM inspection — element positions + bounding rects |
| `scripts/screenshot-prototype.mjs` | All 10 full artboard screenshots |
| `scripts/screenshot-components.mjs` | Individual component clips (editable `SHOTS` array) |
| `scripts/README.md` | Setup + usage instructions |

### Key artboard canvas positions (for script configuration)
- Desktop artboards: x offsets 60, 1028, 1996, 2964, 3932 (all at y=182)
- Mobile artboards: all at x=60, stacked vertically (y: 1844, 3624, 5124, 6824, 8524)

### Lessons learned
- Babel standalone takes ~8s to compile on first load — must wait before interacting
- Viewport must be wider than artboard width (e.g. 1100px for 920px artboard) to avoid edge cutoff
- Artboard positions are canvas/page coordinates — subtract scroll offset when computing clip coords

## 2026-04-23 — Big-brother review + corrected direct-render strategy

### Visual review
- Inspected old home-page screenshots and confirmed they are not valid baselines.
- Old `prototype-design/comp/01-desktop-shows-full.png` starts with DesignCanvas chrome and cuts off before the footer.
- Created comparison evidence: `prototype-design/direct/review/home-old-vs-direct.png`.

### Corrected capture approach
- Added `scripts/capture-direct-render.mjs`.
- This script loads the prototype HTML only to compile globals, then directly renders `PPXDesktop({ page: 'shows' })` into a clean `#capture-root`.
- Generated clean home-page baseline under `prototype-design/direct/home/`.

### New extraction outputs
- `prototype-design/direct/home/desktop-shows-full.png` — validated clean page baseline.
- `prototype-design/direct/home/{header,nav,main,heading-block,shows-grid,footer}.png` — stable region clips.
- `prototype-design/direct/home/desktop-shows.html` — extracted DOM.
- `prototype-design/direct/home/desktop-shows.inspect.json` — recursive computed style + layout tree.

### Analysis document
- Added `design/01-review-and-recommended-capture-approach.md` explaining the failure mode and proposed reusable extraction tool.

## 2026-04-23 — css-visual-diff comparison + Storybook workbench design

### Analysis document
- Added `design/02-storybook-design-side-by-side-visual-diff-system.md`.
- Compared the Pyxis direct-render extraction approach with `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff`.
- Documented overlap, differences, and a combined architecture for Storybook-vs-original pixel-perfect workflows.
- Included intern-oriented prose, diagrams, pseudocode, config examples, CLI examples, implementation phases, and file/API references.

### Key conclusion
- Pyxis direct-render extraction solves clean original baseline generation.
- `css-visual-diff` solves comparison, CSS diffing, matched cascade inspection, pixel diff artifacts, Storybook discovery, and reports.
- The correct combined system should direct-render original prototypes, render Storybook iframe stories at matching widths, then run capture/cssdiff/matched-styles/pixeldiff across stable selectors.

## 2026-04-23 — Prepare hook + robust PNG export implementation guide

### Added
- Added `design/03-css-visual-diff-prepare-and-png-export-implementation-guide.md`.
- Added detailed implementation tasks to `tasks.md` covering config schema, driver helpers, prepare hooks, root PNG export, prepared HTML/inspect JSON export, DOM validation, PNG validation, visual review, Pyxis example config, Storybook readiness, and report UX.

### Validation guidance
- Clarified that image correctness should not be judged by dimensions alone.
- Recommended validation order: DOM text checks, PNG structural checks, visual inspection/`understand_image`, and only then optional OCR/Tesseract if deterministic offline OCR is ever needed.
- Explicitly documented that Tesseract should not be the first-line tool for detecting screenshot cutoff or canvas chrome.

## 2026-04-23 — Implemented css-visual-diff prepare hooks

### Added in `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff`
- `PrepareSpec` config schema and validation (`fba0b73`).
- Browser wait/eval helpers and prepare hook execution (`6bf1b62`).
- Config-driven `script` prepare and `direct-react-global` prepare (`6bf1b62`).
- Prepare wiring for capture, CSS diff, and matched-styles modes (`6bf1b62`).
- Prepared-root screenshot capture via `root_selector` (`36c9eb6`).
- Prepared HTML and inspect JSON export (`151c6eb`).
- DOM text validation and PNG dimension/color-strip validation (`86dee7b`).
- Additional helper tests (`0a36bb0`).
- README documentation and `examples/pyxis-public-shows.yaml` (`665b94f`).

### Validation
- Ran `go test ./internal/cssvisualdiff/config`.
- Ran `go test ./internal/cssvisualdiff/driver ./internal/cssvisualdiff/modes`.
- Ran `go test ./...` successfully.

### Known issue
- Attempted an end-to-end CLI smoke run, but `css-visual-diff run --config=...` currently reports `Error: --config is required` despite the flag being present. This appears tied to pre-existing uncommitted CLI/AI-review changes in the css-visual-diff repository and was not fixed in the prepare commits.

## 2026-04-23 — Fixed css-visual-diff CLI decode and completed postmortem

### Fixed in `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff`
- Fixed `run --config` decoding by changing `RunSettings` tags from `glazed.parameter:"..."` to `glazed:"..."` (`114417b`).
- Added a regression test that builds the Glazed/Cobra run command and verifies `--config` dry-run decoding (`114417b`).
- Fixed local Geppetto/Pinocchio API drift in LLM bootstrap code (`114417b`).
- Fixed CSS diff browser evaluation when optional attributes are omitted by marshaling nil slices as empty arrays (`114417b`).
- Restored and committed AI-review profile-backed image client work so the css-visual-diff repo is clean (`38df841`).

### Added
- Added textbook-style bug report/postmortem at `reference/04-bug-report-postmortem-css-visual-diff-glazed-prepare.md`.

### Validation
- Ran `go test ./...` successfully in css-visual-diff.
- Ran an end-to-end local prepare smoke test with `capture,cssdiff,pixeldiff`; validation statuses were `ok` and all expected artifacts were generated.

## 2026-04-23 — Added artifact browser and ran Pyxis prototype-only inspection

### Added in css-visual-diff
- Added `html-report` mode that writes a static artifact browser to `<output.dir>/index.html` (`623a5f1`).
- Added `examples/pyxis-prototype-only.yaml` for prototype-only inspection using mirrored targets (`623a5f1`).
- Added `examples/out/` to `.gitignore` for generated reports (`c27654e`).

### Ran
- Ran `GOWORK=off go run ./cmd/css-visual-diff run --config examples/pyxis-prototype-only.yaml --modes capture,cssdiff,matched-styles,html-report --output json`.

### Output
- Generated report: `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-only/index.html`.
- Served report: `http://localhost:8788/index.html`.
- Validation statuses: all `ok`.

## 2026-04-23 — Numbered ticket scripts and real prototype-vs-app run

### Added
- Added numbered script copies/wrappers `01` through `09` in the ticket `scripts/` folder.
- Added `07-pyxis-app-server.mjs` to serve the built React app with local API fixtures and local SVG flyer data URLs.
- Added `08-run-pyxis-prototype-vs-app.sh` to run the real comparison reproducibly.
- Added `09-serve-css-visual-diff-report.sh` to serve generated `test.html` reports.
- Updated `scripts/README.md` with the numbered workflow.

### Ran
- Ran `08-run-pyxis-prototype-vs-app.sh` successfully.
- Served the result with `09-serve-css-visual-diff-report.sh`.

### Output
- Report: `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-prototype-vs-app/test.html`.
- Served URL: `http://localhost:8789/test.html`.
- Pixel diff percentages: main 34.4200%, full 31.8982%, nav 8.1399%, header 7.6107%, footer 4.3483%.

### Notes
- The React `main` section currently fails the configured text expectation `Upcoming`; this is evidence for the next repair phase, not a blocker for the report.

## 2026-04-23 — Atom-level prototype-vs-Storybook diff

### Added
- Added `web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx`.
- Added `scripts/10-atom-original-prepare.js` for prototype-side atom rendering.
- Added `scripts/11-run-pyxis-atom-diff.sh` to run isolated atom diffs.
- Added `scripts/12-serve-atom-diff-report.sh` to serve the atom report.
- Added css-visual-diff config `examples/pyxis-atoms-prototype-vs-storybook.yaml` in the css-visual-diff repo (`155f685`).

### Ran
- Ran `pnpm --filter pyxis-components typecheck`.
- Ran `11-run-pyxis-atom-diff.sh`.
- Served `http://localhost:8792/test.html`.

### Results
- Coverage: 22/22 selectors present and visible.
- Largest pixel diffs: icons, buttons, tags, badges.
- Main CSS diffs: button height/font size, badge/tag font size/line-height, avatar font metrics, input/select padding/font size.

## 2026-04-23 — Added css-visual-diff Pyxis comparison playbook

### Added
- Added `reference/05-css-visual-diff-pyxis-site-comparison-playbook.md`.

### Contents
- Explains the comparison mental model and why Pyxis uses prepare hooks.
- Documents prototype-only, atom-level, and full-page comparison workflows.
- Explains how to read `test.html`, CSS diffs, pixel diffs, validation, and generated artifacts.
- Gives recommended repair order and common failure modes.
- Lists quick commands and a pre-fix checklist for new contributors.
