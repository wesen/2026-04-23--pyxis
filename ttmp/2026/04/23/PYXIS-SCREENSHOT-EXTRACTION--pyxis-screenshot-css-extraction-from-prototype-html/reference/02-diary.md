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

---

## Step 2: Retrospective review — why the first screenshots were wrong

The initial screenshot extraction pass produced PNG files with plausible dimensions, but visual inspection showed that the captures were not the actual public website artboards. They included the DesignCanvas workspace chrome — labels like `01 · Desktop`, `Poster-grid shell · 920px · five pages`, gray canvas grid background, and artboard label rows. That meant the files were screenshots of the design board, not screenshots of the public site.

The important correction was to stop treating `DesignCanvas` as a normal scrollable page. Reading `prototype-design/design-canvas.jsx` showed that it is a transform-based pan/zoom viewport (`overflow: hidden`, `translate3d(...) scale(...)`) rather than a document-scroll layout. Therefore `window.scrollTo(x, y)` cannot reliably position the canvas at an artboard.

### Prompt Context

**User prompt (verbatim):** "Analyze some of the pngs and see if they're correct, because they don't screenshot the right part, they screenshot the right size it seems, but all stsarting from 0x0. Focus on the home page section. also, read the skill about keeping a diary and update in retrospect."

**Assistant interpretation:** Review the generated PNGs visually and technically, determine whether they actually captured the intended home-page artboard, and update the diary with a retrospective of what failed and why.

**Inferred user intent:** The user wants a trustworthy visual baseline for pixel-perfect CSS work, not misleading screenshots that look correctly sized but contain the wrong region.

**Commit (code):** pending — this retrospective and analysis will be committed after review/upload.

### What I did

- Read the diary skill at `/home/manuel/.pi/agent/skills/diary/SKILL.md`.
- Visually inspected `prototype-design/comp/01-desktop-shows-full.png`.
- Confirmed it starts with DesignCanvas chrome instead of the `ppxis` website header.
- Read `prototype-design/design-canvas.jsx` to understand the pan/zoom viewport implementation.
- Tested several failed approaches:
  - `window.scrollTo(...)` with fixed viewport clips
  - focus-mode screenshots via `.dc-expand`
  - ImageMagick cropping of viewport screenshots
- Built and tested the better approach: direct-render `PPXDesktop({ page: 'shows' })` into a clean capture root outside `DesignCanvas`.
- Created `prototype-design/direct/home/desktop-shows-full.png` and region clips.
- Created `prototype-design/direct/review/home-old-vs-direct.png` for visual comparison.

### Why

The screenshot baseline must represent the product UI, not the design canvas UI. If the top of the image says `01 · Desktop`, the comparison target is already polluted. CSS fixes based on that screenshot would chase the wrong layout, wrong top offset, and missing footer.

### What worked

- Direct-rendering `PPXDesktop` outside `DesignCanvas` worked immediately.
- The clean capture begins at y=0 with the actual `ppxis` header/nav.
- The capture includes the full page and footer.
- Extracting `#capture-root` HTML and computed-style JSON also worked.

### What didn't work

- `window.scrollTo(60, 182)` did not pan the DesignCanvas. The document is not scrollable; the DesignCanvas viewport has `overflow: hidden` and transforms an internal world element.
- Focus mode opened a cleaner view, but still included overlay chrome: top bar, arrows, pagination dots, backdrop, and scaling.
- Cropping after viewport screenshotting did not solve the root issue because the input image was already the wrong DesignCanvas region.

### What I learned

The prototype HTML contains reusable page-level globals (`PPXDesktop`, `PPXMobile`) after Babel compiles. We do not need to screenshot through `DesignCanvas`; we can load the prototype once, discard the canvas DOM, and render the target page directly.

### What was tricky to build

The misleading part was that the wrong screenshots had plausible dimensions (`920×1460`). Correct dimensions did not imply correct origin. The decisive check was visual: the first pixels at the top of the PNG must be the actual website header, not the design-board title.

### What warrants a second pair of eyes

- The direct-render script currently focuses on `PPXDesktop page="shows"`; it should be generalized carefully for all public pages.
- Region selector extraction should avoid brittle `nth-child(...)` selectors and use semantic or heuristic selection.

### What should be done in the future

- Extend direct-render extraction to all desktop/mobile public pages.
- Emit deduplicated computed-style inventories.
- Add optional pixel comparison against Storybook screenshots.

### Code review instructions

Start with:

- `scripts/capture-direct-render.mjs`
- `design/01-review-and-recommended-capture-approach.md`
- `prototype-design/direct/home/desktop-shows-full.png`
- `prototype-design/direct/review/home-old-vs-direct.png`

Validate by running:

```bash
cd prototype-design && python3 -m http.server 7070 &
cd web
node ../ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

### Technical details

The key DesignCanvas implementation detail is in `DCViewport`: the viewport uses `overflow: hidden` and applies `transform: translate3d(...) scale(...)` to a child `worldRef`. That means browser document scrolling is not the artboard navigation mechanism.

---

## Step 3: Big-brother review and recommended reusable extraction tool

After confirming the failure mode, I wrote a detailed review document that explains why the first approach failed and proposes a reusable extraction architecture. The key recommendation is to render prototype components directly and export PNG, HTML, and computed-style JSON together.

This turns the prototype into a source of truth for Storybook reconstruction: the PNG gives visual ground truth, the HTML gives structure, and the computed-style JSON gives implementation hints for spacing, typography, colors, borders, and layout.

### Prompt Context

**User prompt (verbatim):** "Ok, we're the big brother taking over. Our little brother has tried to capture individaul lparts of the artboard but has been struggling. You are reviewing what they did, and suggesting a better approach (which could something completely different).

Write a detailed analysis and store it in the ticket and upload it to remarkable. Be detailed and try out different ideas if you want as you go. Ideally we'd get a reusable tool to inspect and export an artboard like this, including not just png, but potentially also the html and css attributes of different comopnents to make it easiest to turn them into a separate storybook based react project, pixel perfect."

**Assistant interpretation:** Perform a senior review of the failed extraction attempt, test alternatives, document the recommended approach in the ticket, and upload the result to reMarkable.

**Inferred user intent:** The user wants a reusable extraction workflow that can be repeated for future prototype HTML pages and that supports pixel-perfect React/Storybook rebuilding.

**Commit (code):** pending — this documentation/scripts update will be committed after upload.

### What I did

- Created `design/01-review-and-recommended-capture-approach.md`.
- Added a direct-render extraction script: `scripts/capture-direct-render.mjs`.
- Ran the script and produced direct home-page outputs under `prototype-design/direct/home/`.
- Created visual comparison sheet: `prototype-design/direct/review/home-old-vs-direct.png`.
- Added evidence to the analysis document.

### Why

A reusable tool should not depend on fragile DesignCanvas pan/zoom state. It should render the target prototype page/component in a controlled root and inspect the actual DOM.

### What worked

- `capture-direct-render.mjs` successfully produced:
  - clean full-page PNG
  - header/nav/main/footer clips
  - raw HTML
  - recursive computed-style JSON
- Visual inspection confirmed the direct-render capture is correct for the home page.

### What didn't work

- The first run of component-region extraction used one brittle selector:
  - `main > div:nth-child(2) > div:first-child`
- That selector did not match. The future tool should use semantic selectors and heuristics instead.

### What I learned

The best extraction artifact is not just a PNG. For Storybook reconstruction we want a packet:

- `full.png`
- `regions/*.png`
- `root.html`
- `inspect.json`
- eventually deduplicated style inventories

### What was tricky to build

Node module resolution was tricky because the scripts live in the ticket folder while `playwright` is installed in `web/`. `capture-direct-render.mjs` now uses `createRequire(`${process.cwd()}/package.json`)` so it resolves `playwright` from the working directory (`web/`) rather than from `ttmp/.../scripts/`.

### What warrants a second pair of eyes

- Confirm whether direct-rendered screenshots match DesignCanvas artboards exactly; they should, because they call the same `PPXDesktop` function, but differences could arise if DesignCanvas wrappers impose inherited font/background assumptions.
- Verify the selected computed-style property list is sufficient for reconstruction.

### What should be done in the future

- Generalize the direct-render script into a CLI accepting `--component`, `--props`, `--width`, and `--out`.
- Add all public pages and mobile pages.
- Add pixel comparison against Storybook output.

### Code review instructions

Review:

- `ttmp/.../design/01-review-and-recommended-capture-approach.md`
- `ttmp/.../scripts/capture-direct-render.mjs`
- `prototype-design/direct/home/desktop-shows-full.png`
- `prototype-design/direct/home/desktop-shows.inspect.json`

Run:

```bash
cd web
node ../ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/capture-direct-render.mjs
```

### Technical details

The direct-render mechanism waits until `window.PPXDesktop` and `window.PPXMobile` are available, replaces `document.body.innerHTML`, creates `#capture-root`, and renders `React.createElement(PPXDesktop, { page: 'shows' })` into it.

---

## Step 4: Compare Pyxis extraction with css-visual-diff and design the combined Storybook workbench

I inspected the existing Go `css-visual-diff` repository and compared it against the Pyxis direct-render extraction work. The review found that the two systems solve adjacent parts of the same problem: Pyxis direct-render creates clean original baselines, while `css-visual-diff` compares two clean browser targets with screenshots, pixel diffs, computed CSS, matched-style/cascade inspection, and reports.

The result is a new intern-oriented design document for a combined workflow: direct-render original prototypes, render matching Storybook iframe stories at the same width, then run visual and CSS comparisons region by region until the port is pixel-perfect.

### Prompt Context

**User prompt (verbatim):** "Analyze /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff and compare with the work you did, and see where the overlap and diferences are. I want to have a tool that allows me to work with storybook and an original design side by side until the ported react is pixel perfect.

Write a detailed analysis and comparison document.

reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file
  references.
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable."

**Assistant interpretation:** Study the prior visual-diff tool, compare it to the Pyxis extraction approach, and write a detailed design/implementation guide for a future integrated Storybook-original-design pixel-perfect workflow.

**Inferred user intent:** The user wants a reusable system, not an ad hoc screenshot script: a workflow that can compare original design outputs with Storybook/React implementations side-by-side, diagnose differences, and guide iterative CSS fixes.

**Commit (code):** pending — documentation update will be committed after upload.

### What I did

- Read `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/README.md` and `AGENT.md`.
- Inspected CLI entrypoint `cmd/css-visual-diff/main.go` and ran CLI help.
- Inspected config model, browser driver, capture, compare, cssdiff, pixeldiff, matched-styles, story discovery, and agent brief code.
- Compared those capabilities to Pyxis `capture-direct-render.mjs` and `prototype-design/direct/home/*` outputs.
- Wrote `design/02-storybook-design-side-by-side-visual-diff-system.md`.

### Why

The Pyxis work alone can create clean original screenshots, HTML, and computed style trees, but it does not compare them against Storybook. `css-visual-diff` already contains much of the comparison machinery needed for that next step.

### What worked

- `css-visual-diff` has a strong config model and modes that map directly to Storybook comparison work.
- It already supports separate original/react selectors, computed CSS diffs, matched-style winner diffs, pixel diff images, and Storybook story discovery.
- The design document identifies a clear integration point: add a target `prepare` hook or pre-generate clean original fixtures from Pyxis direct render.

### What didn't work

- `css-visual-diff` currently assumes both sides are ordinary URLs. For Pyxis, the original URL renders DesignCanvas, which is not the clean product UI. A prepare/direct-render layer is required.
- The Pyxis direct-render script is currently hard-coded to the home page and not yet a generalized CLI.

### What I learned

The right architecture is not to replace `css-visual-diff`; it is to feed it clean original targets or extend it with a prepare hook. The tools are complementary: extraction first, comparison second.

### What was tricky to build

The central conceptual split was important: “extract original baseline” and “compare two baselines” are distinct phases. Combining them too early risks embedding Pyxis-specific prototype logic into a general visual-diff engine. The design therefore proposes an adapter boundary (`prepare`) rather than hard-wiring `PPXDesktop` into the comparison engine.

### What warrants a second pair of eyes

- Whether to implement the direct-render prepare hook inside Go/chromedp or keep it as a Playwright/JS pre-step.
- Whether `css-visual-diff` should grow recursive inspect-tree output, or whether the direct-render extractor should own that artifact.
- How to keep Storybook selector mappings stable across refactors.

### What should be done in the future

- Generalize `capture-direct-render.mjs` to all pages and components.
- Add a `PrepareSpec` to `css-visual-diff` target config.
- Add Storybook page stories at exact prototype widths.
- Add `data-region`/`data-part` selectors to React components for stable comparison.

### Code review instructions

Start with:

- `design/02-storybook-design-side-by-side-visual-diff-system.md`
- `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/config/config.go`
- `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/compare.go`
- `/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/internal/cssvisualdiff/modes/matched_styles.go`
- `scripts/capture-direct-render.mjs`

### Technical details

Useful commands used during the investigation:

```bash
cd /home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff
GOWORK=off go run ./cmd/css-visual-diff --help
GOWORK=off go run ./cmd/css-visual-diff compare --help
GOWORK=off go run ./cmd/css-visual-diff run --help
```

---

## Step 5: Prepare hook and PNG export implementation guide

I wrote a focused implementation guide for adding `prepare` hooks and robust PNG export/validation to `css-visual-diff`. The guide turns the earlier architecture discussion into concrete tasks: config structs, validation rules, driver helpers, prepare execution, mode wiring, root-selector screenshots, prepared HTML export, inspect JSON export, DOM validation, PNG validation, and Pyxis example config.

A key correction from the user was to avoid reaching for Tesseract/OCR as the first-line way to validate screenshots. The guide now explicitly recommends DOM validation first, PNG structural checks second, `understand_image` or human visual review for semantic screenshot correctness, and OCR only as a later optional CI fallback.

### Prompt Context

**User prompt (verbatim):** "ok, let's create an implementation guide and detailed tasks to implement the prepare and png export (if necessary) in css-visual-diff, in detail. Also make sure that we properly analyze the images (no need to use understand_images if you need to take a look yourself, because it will make it easier to recognize cutoff stuff)."

**Assistant interpretation:** Create a precise implementation guide and task list for adding prepare hooks and reliable screenshot export/validation to css-visual-diff.

**Inferred user intent:** The user wants the next engineer to be able to implement the feature without rediscovering the DesignCanvas failure mode or trusting bad PNGs.

**Commit (code):** pending — documentation/tasks update will be committed after upload.

### What I did

- Wrote `design/03-css-visual-diff-prepare-and-png-export-implementation-guide.md`.
- Added a 15-phase implementation task list to `tasks.md`.
- Included detailed pseudocode for `PrepareSpec`, `prepareTarget`, `script` prepare, `direct-react-global` prepare, PNG validation, and DOM text validation.
- Added explicit image validation guidance prioritizing DOM checks and `understand_image` over OCR/Tesseract.

### Why

The previous docs explained the architecture but did not yet give a concrete implementation checklist. This guide is meant to let an intern or implementer start making changes in `css-visual-diff` directly.

### What worked

- The existing `css-visual-diff` code structure maps cleanly to phases: config, driver, modes, tests.
- The Pyxis failure case gives concrete acceptance criteria: original full screenshot must start with the real `ppxis` header and include the footer.

### What didn't work

- No code was implemented yet; this is a design/task handoff document.

### What I learned

Image validation should be layered. Correct image dimensions are necessary but insufficient. For screenshot correctness, combine DOM expectations, PNG stats, and visual review.

### What was tricky to build

The subtle part is specifying validation that catches the actual failure without overfitting to Pyxis. The guide therefore proposes generic mechanisms (`expect_text`, `expect_png`, top/bottom strip stats) and then shows Pyxis-specific values as examples.

### What warrants a second pair of eyes

- Whether the first implementation should support only `prepare.type: script` before adding `direct-react-global`.
- Whether validation should live inside `capture` or as a separate `validate` mode.

### What should be done in the future

Implement the tasks in order, starting with minimal script prepare, then Pyxis direct-react-global convenience prepare.

### Code review instructions

Review:

- `design/03-css-visual-diff-prepare-and-png-export-implementation-guide.md`
- `tasks.md`

Validate by checking that the task list covers config, driver, prepare hook, mode wiring, PNG export, validation, Pyxis example config, and Storybook readiness.
