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
