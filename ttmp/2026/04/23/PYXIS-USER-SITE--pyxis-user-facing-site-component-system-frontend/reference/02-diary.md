---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: prototype-design
      Note: Full prototype source directory
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Investigation Diary — Pyxis User Site

## Session Start

**Goal:** Create a detailed design/implementation guide for the pyxis user-facing website with component system + frontend setup.

## Work Done — 2026-04-23

### 1. Created Ticket
- **ID:** PYXIS-USER-SITE
- **Title:** Pyxis user-facing site: component system + frontend
- **Topics:** component-library, storybook, react, frontend, pnpm-workspace, pyxis

### 2. Created Design/Implementation Guide
- **File:** `design/01-user-facing-site-design-implementation-guide.md`
- **Size:** ~64KB, comprehensive for new developers

### 3. Guide Contents

The guide covers:

#### Part 1: What Is Pyxis?
- Venue overview and mission
- Website purpose and audiences
- Design philosophy (warm paper aesthetic, Fraunces serif, crimson accent)

#### Part 2: System Architecture
- High-level architecture diagram
- Repository structure (web/ as pnpm workspace)
- Package interdependencies

#### Part 3: Package Structure (pnpm workspace)
- Why pnpm (performance, disk efficiency, strict mode)
- `pnpm-workspace.yaml` configuration
- Root `package.json` scripts
- Package interdependency diagram
- Key commands reference table

#### Part 4: Component System (`pyxis-components`)
- Design principles (token-driven, composition-first, accessible, themeable, documented)
- Atomic Design levels (atoms → molecules → organisms → templates → pages)
- Component file structure
- Package entry point exports
- Component API patterns

#### Part 5: User Site (`pyxis-user-site`)
- Technology stack (React 18, React Router, TanStack Query, Vite)
- File structure
- Routing setup with React Router
- Page component pattern

#### Part 6: Design Tokens
- Color tokens (canvas, surface, border, text, accent, semantic)
- Typography tokens (fonts, sizes, line heights, letter spacing)
- Spacing tokens (1-12 scale)
- Radius tokens (xs to full)
- Shadow tokens (xs to xl)
- TypeScript constants
- Using tokens in CSS and React

#### Part 7: Component Inventory
- **Atoms:** Button, Badge, Tag, Input, Select, Textarea, Avatar, Icon (with props tables)
- **Molecules:** Card, CardHead, Stat, Field, Table, Empty, LogRow
- **Organisms:** TopBar, Modal, NavItem, Sidebar
- **Public:** PubNav, PubHero, PubShowRow, TicketStub, VenueCard, BookingForm, BookingSuccess, MailingListCTA, ArchiveStats, YearGroup, SpaceInfo, BookingRules, AboutHero, EthosStrip

#### Part 8: Page Designs
- **Shows Page:** Layout diagram, hero section, show rows, mailing list CTA
- **Show Detail Page:** Layout diagram, ticket stub, lineup, venue card
- **Archive Page:** Stats strip, year groups, search
- **Book Page:** Form layout, space info sidebar
- **About Page:** Hero, ethos strip, venue info

#### Part 9: API Integration
- API client setup
- TypeScript types
- Endpoints constants
- React Query hooks pattern
- Using hooks in components examples

#### Part 10: Storybook Setup
- Why Storybook
- Configuration (`main.ts` and `preview.tsx`)
- Global decorators and parameters
- Story template
- Running Storybook

#### Part 11: Implementation Checklist
- Phase 1: Project Setup (10 tasks)
- Phase 2: Design Tokens (5 tasks)
- Phase 3: Atoms (9 tasks)
- Phase 4: Molecules (7 tasks)
- Phase 5: Organisms (5 tasks)
- Phase 6: Public Site Components (16 tasks)
- Phase 7: API Integration (5 tasks)
- Phase 8: Pages (8 tasks)
- Phase 9: Polish (9 tasks)
- Phase 10: Deployment (5 tasks)

#### Appendices
- A: Environment Variables
- B: File Naming Conventions
- C: Import Aliases
- D: Git Branch Strategy
- E: Testing Strategy

## Next Steps
1. Create `web/` directory structure
2. Initialize pnpm workspace
3. Create `packages/pyxis-components/` package
4. Create `packages/pyxis-user-site/` package
5. Set up design tokens
6. Build atoms with Storybook stories
7. Build molecules with Storybook stories
8. Build organisms with Storybook stories
9. Build public site components with Storybook stories
10. Build actual pages in user site

---
*Last updated: 2026-04-23*

---

## Session (afternoon) — Phase 6: Public Site Components + React Query

### What happened

Committed the big Phase 1-5 chunk as `9e52d1a`. Now continuing into Phase 6: public site components.

**Committed files (92 files, 12,552 lines):**
- `web/` — full pnpm workspace scaffold
- `packages/pyxis-components/src/atoms/` — Icon, Button, Badge, Tag, Input, Select, Textarea, Avatar
- `packages/pyxis-components/src/molecules/` — Card, CardHead, Stat, Field, Table, Empty, LogRow
- `packages/pyxis-components/src/organisms/` — TopBar, Modal
- `packages/pyxis-components/src/tokens/` — tokens.css + tokens.ts
- `packages/pyxis-components/mocks/` — handlers, types, browser/server
- `packages/pyxis-components/.storybook/` — main.ts, preview.tsx
- `.storybook/` config + CI workflow

### Build issues encountered
1. `Icon/index.ts` needed to be `.tsx` (had JSX in the IconButton component)
2. Missing `/>` closing on `play` icon path → JSX parse error cascading through file
3. `PyxisMark`/`PyxisLogo` had duplicated `forwardRef` signatures from bad edit
4. `buttonVariants` and `buttonSizes` missing from `tokens.ts` — BadgeStatus was defined as union then used to type `badgeColors`, making `BadgeStatus = keyof typeof badgeColors` circular
5. `allowImportingTsExtensions` in root tsconfig conflicting with `tsc -b` build
6. `Empty.tsx` couldn't resolve `../atoms/Icon/Icon` — TypeScript Bundler resolution requires exact `.tsx` extension (but vite build resolved it fine)
7. `Icon.stories.tsx` had `tokens.color.text-tertiary` (dot-access on hyphen key) → `tokens.color.textTertiary`

### Next: Phase 6
- Public site components: PubNav, PubFooter, PubHero, PubShowRow, TicketStub, LineupRow, VenueCard, BookingForm, etc.
- React Query hooks (TanStack Query) with MSW
- Stories with MSW mocks for each page

---

## Session (Phase 7) — API integration + pages

### What happened

Committed Phase 7 as `536c7b1`.

**API layer:**
- `api/client.ts` — fetch wrapper with ApiException class
- `api/types.ts` — Show, ArchivedShow, LineupEntry, ArchiveStats, BookingFormData, BookingConfirmation
- `api/endpoints.ts` — endpoint constants
- `api/hooks.ts` — React Query hooks: useUpcomingShows, useShow, useArchive, useArchiveStats, useSubmitBooking

**Pages:**
- Shows — hero + list + mailing list CTA
- ShowDetail — dark hero, ticket stub, lineup, venue card, capacity warning
- Archive — search input, ArchiveStats, year-grouped list
- Book — BookingForm + SpaceInfo + BookingRules
- BookSuccess — confirmation
- About — AboutHero, ethos strip, venue info
- NotFound — 404

**Stories with MSW:**
- Shows.stories — default (6 shows), empty
- ShowDetail.stories — default, loading, not found
- Archive.stories — default, with search, empty
- Book.stories — default, submitting, success
- About.stories — default

### Build issues encountered
1. `../../../atoms/Icon` wrong path from `src/public/PubNav/` — sed added one extra `../` when fixing
2. `mocks/` moved to `src/mocks/` to fix TypeScript rootDir resolution
3. TypeScript declaration generation: `../../../mocks/types` paths in dist/ don't resolve correctly → moved mocks inside src/
4. Vite CSS bundling: `import './PubNav.css'` in dist'd PubNav.js can't resolve → removed CSS import, all CSS goes into dist/style.css

### Next: Phase 9 (Polish) + Phase 10 (Deployment)

---

## Step 12: Start prototype-parity repair with atom components

The next phase is to make the whole public site Storybook-covered and visually close to the prototype before wiring the real backend. I first added a detailed task breakdown to the user-site ticket covering Storybook infrastructure, atom parity, every public page in desktop/mobile, page-level visual-diff configs, and backend-readiness handoff.

Then I repaired the atom-level components against the prototype fixture using the atom `css-visual-diff` report. This was the right starting point because button, badge, tag, input, select, icon, and avatar differences would otherwise create noise in every page-level screenshot.

### Prompt Context

**User prompt (verbatim):** "alright, continue fixing it all. Feel free to add more stories to the storybook, for all the pages in Pyxis Public.html . We want the whole page covered in storybook before we wire it up with the real backend. Add detailed list of tasks to the ticket to cover all the pages and then work through them task by task, using the tools you built, committing at appropriate intervals, keeping a frequent diary."

**Assistant interpretation:** Create an explicit page-by-page Storybook/visual-parity task plan, then start working through it with the existing atom/page visual-diff tools.

### What changed

- Added detailed Phase 11–16 task plan to `PYXIS-USER-SITE/tasks.md`.
- Cross-linked Storybook readiness subtasks in `PYXIS-SCREENSHOT-EXTRACTION/tasks.md`.
- Repaired atom parity for:
  - `Button`
  - `Badge`
  - `Tag`
  - `Avatar`
  - `Icon`
  - `IconButton`
  - `Input`
  - `Select`
- Adjusted the atom diff fixture so the React `input-error` example matches the prototype fixture state instead of adding an unmatched error message.

### Commands run

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components typecheck

cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/11-run-pyxis-atom-diff.sh
```

### Results

The atom diff report now has all configured computed CSS diffs resolved to zero. Remaining pixel differences are very small and likely come from browser antialiasing/native input rendering:

```text
input-search 0.5260%
full         0.4769%
input-error  0.3111%
avatar-lg    0.0434%
all buttons  0.0000%
badges       0.0000%
tags         0.0000%
avatar-md    0.0000%
icons        0.0000% except residual fixture/full antialiasing
select       0.0000%
```

Coverage stayed clean:

```text
total: 22
original_missing: 0
react_missing: 0
original_hidden: 0
react_hidden: 0
```

### Notes

One important finding: the `llm-review` test that used `react-prepared.html` showed a false `border-radius: 0px`/`font-weight: 400` issue because prepared HTML does not carry the Storybook CSS variable definitions. The live atom `cssdiff.json` showed the true state. For CSS repair, the live atom report is the source of truth; standalone prepared HTML needs embedded token CSS before it can be used for accurate recapture.

### Next

Commit the atom parity repair, then move to Storybook infrastructure/page coverage for all public pages: shows, detail, archive, book, and about in desktop and mobile sizes.

---

## Step 13: Add user-site Storybook coverage for every public page

After atom parity, I added a Storybook setup for `pyxis-user-site` itself. Previously the user-site package had stories in `web/packages/pyxis-user-site/stories/`, but no active `.storybook` config under the package, so the page stories were not actually part of a runnable user-site Storybook.

### What changed

- Added `web/packages/pyxis-user-site/.storybook/main.ts`.
- Added `web/packages/pyxis-user-site/.storybook/preview.tsx`.
- Added `web/packages/pyxis-user-site/public/mockServiceWorker.js`.
- Added `web/packages/pyxis-user-site/stories/PublicPages.stories.tsx` with ten page stories:
  - Shows desktop
  - Shows mobile
  - Show detail desktop
  - Show detail mobile
  - Archive desktop
  - Archive mobile
  - Book desktop
  - Book mobile
  - About desktop
  - About mobile
- Added `storybook` and `build-storybook` scripts to `pyxis-user-site`.
- Added root workspace convenience scripts for user-site Storybook.
- Added a package export for `pyxis-components/mocks/handlers` so the user-site Storybook can import deterministic MSW handlers.
- Added stable selectors to public route surfaces:
  - `data-page-shell="public"`
  - `data-region="nav|main|footer"`
  - page roots like `data-page="shows|show-detail|archive|book|about"`
  - page sections like `data-section="shows-hero"`, `archive-years`, etc.

### Validation

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-user-site typecheck
STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter pyxis-user-site build-storybook
```

Both passed. Storybook IDs generated for the new full-page stories include:

```text
public-site-pages--shows-desktop
public-site-pages--shows-mobile
public-site-pages--show-detail-desktop
public-site-pages--show-detail-mobile
public-site-pages--archive-desktop
public-site-pages--archive-mobile
public-site-pages--book-desktop
public-site-pages--book-mobile
public-site-pages--about-desktop
public-site-pages--about-mobile
```

### Notes

The page stories are now covered, but the mock data still uses the existing seed API data rather than an exact clone of the prototype `P_SHOWS` data/poster visuals. That remains a task before true page-level parity.

### Next

Commit this Storybook coverage, then create page-level `css-visual-diff` configs/scripts starting with Shows desktop.

---

## Step 14: Add and run first page-level Storybook visual diff

With user-site Storybook building and all public pages represented as stories, I added the first page-level comparison config: prototype Shows desktop vs user-site Storybook Shows Desktop.

### Added

- css-visual-diff config:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/pyxis-storybook-shows-desktop.yaml
```

- Numbered ticket scripts:

```text
scripts/13-serve-user-site-storybook-static.sh
scripts/14-run-pyxis-storybook-shows-desktop.sh
```

### Command run

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/14-run-pyxis-storybook-shows-desktop.sh
```

### Results

The run completed successfully:

```text
capture: ok
cssdiff: ok
matched-styles: ok
pixeldiff: ok
html-report: ok
coverage total: 5
missing/hidden: 0
```

Report:

```text
/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-storybook-shows-desktop/test.html
```

Served for inspection at:

```text
http://localhost:8793/test.html
```

Pixel diffs:

```text
shows-content 76.1516%
main          59.2671%
full          54.5223%
nav           32.9085%
footer         6.8826%
```

### Interpretation

The page-level comparison is now technically working, but the visual gap is large because the React Shows page is still the earlier hero/list implementation, while the prototype is the poster-grid public page. This confirms the next repair target: rebuild/adjust the Shows page and its public components to match the prototype poster-grid layout and data.

### Next

Start Shows desktop repair by aligning the shell/nav/main layout and replacing the hero/list page structure with the prototype-style poster grid.

---

## Step 15: Align public nav/footer closer to prototype shell

After the first Shows desktop Storybook diff, the largest structural differences were expected in `main`, but the nav was also noisy: `nav` pixel diff was around 32.9%. I aligned the public navigation component to the prototype shell: white background, 920px inner width, 60px height, text-only `ppxis` wordmark, prototype active pill treatment, and no separate `Get tickets` CTA in the nav.

I also rewrote `PubFooter` to match the prototype footer content and spacing: `ppxis`, "a music artist space", Manton Ave address, and the three links `Instagram`, `Discord`, `Mailing list`.

### Validation

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-components typecheck
pnpm --filter pyxis-user-site typecheck
STORYBOOK_DISABLE_TELEMETRY=1 pnpm --filter pyxis-user-site build-storybook

cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html/scripts/14-run-pyxis-storybook-shows-desktop.sh
```

### Results

Page comparison still has large content diffs because Shows is still a hero/list implementation, not the prototype poster grid. But nav improved substantially:

```text
before nav diff: 32.9085%
after nav diff:   6.7418%
```

Current page-level diffs:

```text
shows-content 76.1516%
main          59.2079%
full          54.3796%
footer         6.8826%
nav            6.7418%
```

### Next

The next meaningful fix is the Shows page itself: replace the current hero/list layout with the prototype poster-grid layout and prototype-like data/poster rendering.
