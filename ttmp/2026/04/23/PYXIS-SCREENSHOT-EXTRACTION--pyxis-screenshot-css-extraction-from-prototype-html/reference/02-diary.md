# Investigation Diary — PYXIS-SCREENSHOT-EXTRACTION

## Context

The CSS implementation for the public-facing pages is broken. Need to compare the
current React implementation against the prototype HTML to identify what went wrong.

This ticket captures the workflow for extracting pixel-accurate screenshots from
the prototype HTML files so we can do before/after comparisons and fix the CSS
methodically.

## Prototype file

`prototype-design/Pyxis Public Site.html` — a React+Babel in-browser prototype
hosted at `http://localhost:7070/` (served via `python3 -m http.server 7070`).

Contains 10 artboards rendered via `DesignCanvas` (from `design-canvas.jsx`):

| ID | Label | Viewport | Canvas offset |
|----|-------|----------|---------------|
| d-shows | Shows | 920×1460 | x=60, y=182 |
| d-detail | Show detail | 920×1100 | x=1028, y=182 |
| d-archive | Archive | 920×1400 | x=1996, y=182 |
| d-book | Book us | 920×1200 | x=2964, y=182 |
| d-about | About | 920×1200 | x=3932, y=182 |
| m-shows | Shows (mobile) | 390×1780 | x=60, y=1844 |
| m-detail | Show detail (mobile) | 390×1500 | x=60, y=~3600 |
| m-archive | Archive (mobile) | 390×1700 | x=60, y=~5120 |
| m-book | Book us (mobile) | 390×1700 | x=60, y=~6840 |
| m-about | About (mobile) | 390×1600 | x=60, y=~8560 |

## Key findings from DOM analysis

### Navigation (all desktop pages)
- `<HEADER>` at `y=182`, `h=61` — contains logo "ppxis" + `<NAV>` with 4 links
- Logo button: `x=92`, `width=61`, `height=29`
- Nav links: `y=198`, `height=28` — Shows, Archive, Book us, About

### Shows page (d-shows)
- `<MAIN>` starts at `y=243`, `height=1555`
- "Upcoming shows" h1 at `y=307` in artboard coords
- Location "Providence, RI" above the h1
- Hero featured show: ~y=412 (inside main), height ~1386
- Show list rows: each ~90px tall
- Footer: bottom of artboard (~y=1340–1460)

### DOM element structure
```
HEADER (nav)
  BUTTON.pxis  → logo
  NAV          → Shows, Archive, Book us, About links
MAIN (content)
  DIV (location + h1)
  DIV (hero event — Dusknight residency)
  DIV (show list rows)
FOOTER
```

## Scripts created

### 1. `screenshot-prototype.mjs`
Full-page screenshots of all 10 artboards. Uses `window.scrollTo(sx, sy)` to
position each artboard at top-left of viewport, then clips to artboard size.

Usage:
```bash
cd web/
pnpm add -w -D playwright
npx playwright install chromium
node screenshot-prototype.mjs
```

### 2. `screenshot-components.mjs`
Individual component screenshots (nav, hero, show rows, etc.) with precise
viewport-relative clips. Requires knowing element positions from DOM analysis.

### 3. `analyze-prototype.mjs`
DOM inspection script — dumps all meaningful elements with their text content
and bounding rectangles. Use to find element positions for targeted screenshots.

## Screenshots captured

**Full artboards** (10):
```
prototype-design/01-desktop-shows.png    — 920×1460
prototype-design/02-desktop-detail.png   — 920×1100
prototype-design/03-desktop-archive.png  — 920×1400
prototype-design/04-desktop-book.png     — 920×1200
prototype-design/05-desktop-about.png    — 920×1200
prototype-design/06-mobile-shows.png     — 390×1780
prototype-design/07-mobile-detail.png   — 390×1500
prototype-design/08-mobile-archive.png  — 390×1700
prototype-design/09-mobile-book.png     — 390×1700
prototype-design/10-mobile-about.png     — 390×1600
```

**Component clips** (21):
```
prototype-design/comp/01-desktop-shows-full.png
prototype-design/comp/02-desktop-shows-nav.png
prototype-design/comp/03-desktop-shows-heading.png
prototype-design/comp/04-desktop-shows-hero.png
prototype-design/comp/05-desktop-shows-list.png
prototype-design/comp/06-desktop-shows-footer.png
prototype-design/comp/07-desktop-show-row.png
prototype-design/comp/08-desktop-detail-full.png
prototype-design/comp/09-desktop-detail-hero.png
prototype-design/comp/10-desktop-detail-content.png
prototype-design/comp/11-desktop-archive-full.png
prototype-design/comp/12-desktop-archive-header.png
prototype-design/comp/13-desktop-archive-stats.png
prototype-design/comp/14-desktop-archive-years.png
prototype-design/comp/15-desktop-book-full.png
prototype-design/comp/16-desktop-book-form.png
prototype-design/comp/17-desktop-book-sidebar.png
prototype-design/comp/18-desktop-about-full.png
prototype-design/comp/19-desktop-about-hero.png
prototype-design/comp/20-mobile-shows-full.png
prototype-design/comp/21-mobile-shows-nav.png
```

## Next steps

- [ ] Compare screenshots against current implementation
- [ ] Identify CSS regressions (typography, spacing, colors, layout)
- [ ] Fix each component's CSS one by one
- [ ] Re-screenshot after each fix for verification

## Gotchas

- Babel standalone takes ~8 seconds to compile on first load — wait before screenshotting
- Artboard positions are in canvas (page) coordinates — subtract scroll offset when clipping
- Mobile artboards stack vertically below desktop ones on the canvas
- The prototype uses `ppxis` not `pyxis` — some text differs from current implementation
- Prototype nav has `<HEADER>` + `<NAV>` + `<MAIN>` + `<FOOTER>` semantic structure
