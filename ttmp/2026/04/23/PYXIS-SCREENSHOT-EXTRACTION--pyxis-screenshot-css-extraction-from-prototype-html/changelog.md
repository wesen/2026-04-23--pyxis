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
