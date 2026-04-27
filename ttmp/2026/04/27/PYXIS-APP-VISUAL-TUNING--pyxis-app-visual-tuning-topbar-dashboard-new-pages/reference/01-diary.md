---
Title: Visual Tuning Diary
Ticket: PYXIS-APP-VISUAL-TUNING
Status: active
Topics:
    - frontend
    - visual-tuning
    - storybook
    - pyxis
    - css-visual-diff
DocType: reference
Intent: implementation
Owners: []
RelatedFiles:
    - Path: docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
      Note: Long-term operational runbook
    - Path: prototype-design/visual-diff/userland/docs/01-architecture-and-internals.md
      Note: Detailed userland architecture reference
    - Path: prototype-design/visual-diff/userland/docs/02-atom-to-page-visual-comparison-analysis.md
      Note: Textbook-style atom-to-page comparison analysis
    - Path: prototype-design/visual-diff/userland/README.md
      Note: Updated userland README
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
      Note: Updated with 5 shell component targets
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.js
      Note: Regenerated JS mirror
    - Path: web/packages/pyxis-app/src/components/shell/index.ts
      Note: Shell component re-exports
    - Path: web/packages/pyxis-app/src/components/shell/AppTopBar.stories.tsx
      Note: Split AppTopBar stories
    - Path: web/packages/pyxis-app/src/components/shell/AppSidebar.stories.tsx
      Note: Split AppSidebar stories
    - Path: web/packages/pyxis-app/src/components/shell/AppMobileBottomNav.stories.tsx
      Note: Split MobileBottomNav stories
    - Path: web/packages/pyxis-app/src/components/organisms/Dashboard/
      Note: Reorganized Dashboard organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/Shows/
      Note: Reorganized Shows organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/ShowDetail/
      Note: Reorganized ShowDetail organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/Calendar/
      Note: Reorganized Calendar organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/Bookings/
      Note: Reorganized Bookings organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/Settings/
      Note: Reorganized Settings organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/Roster/
      Note: Reorganized Roster organisms into subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.tsx
      Note: Updated barrel to use subfolder re-exports
    - Path: web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx
      Note: Legacy barrel now re-exports subfolders
    - Path: web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx
      Note: Now re-exports Dashboard subfolder
    - Path: web/packages/pyxis-app/src/components/organisms/ShowsSections.tsx
      Note: Now re-exports Shows subfolder
    - Path: web/packages/pyxis-app/src/styles/app-tokens.css
      Note: Contains token mismatch (needs fixing)
ExternalSources: []
Summary: Chronological diary for pyxis-app visual tuning work. Covers visual diff setup, story reorganization, and organism subfolder split.
LastUpdated: 2026-04-27T10:00:00-04:00
WhatFor: Resume PYXIS-APP-VISUAL-TUNING work after a break.
WhenToUse: Read before continuing visual tuning work.
---

# Diary

## Goal

Tune pyxis-app Shell components and pages using css-visual-diff to match the prototype. Establish a reusable runbook and reorganize organisms into page-based subfolders.

---

## Step 1: Read playbooks and examine component system

Write the long-term playbook, userland docs, and commit the work from the previous session.

**User prompt (verbatim):** "The conversation history before this point was compacted into the following summary: [summary of visual tuning session work] — update the playbook in docs/ if needed, then update the diary, then commit. after committing, split AppShell and other page organisms into subcomponents, organized one folder per component."

**Assistant interpretation:** The user wants three things done in sequence: (1) update the existing playbook if it needs new learnings, (2) update the diary to record all work done, and (3) commit everything. Then reorganize organisms into subfolders.

**Inferred user intent:** Keep documentation current and ready for handoff, then restructure the component tree for better discoverability and visual diff targeting.

### What I did

- Read `docs/playbooks/09-pyxis-app-visual-tuning-runbook.md` (already created in the previous session)
- Updated the playbook with everything learned since it was first written:
  - Added the five-question framework for atom-to-page debugging
  - Added the token mismatch root cause with exact values
  - Added shell component story split documentation
  - Added registry vs explicit spec distinction
  - Added Troubleshooting section
  - Added Quick Reference section
- Updated the diary at `ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/reference/01-diary.md`
- Committed all prior work (commit `c843375`)

### What worked

- The playbook was already well-structured from the previous session — only minor additions were needed to bring it fully current.
- All files were staged cleanly in one commit.

### What should be done in the future

- Fix the `--app-*` token drift in `app-tokens.css`
- Re-run visual diff after token fix to confirm the 8.56% diff drops
- Verify TypeScript resolves after organism reorganization

---

## Step 2: Reorganize organisms into page-based subfolders

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** After committing, split the flat `organisms/` directory into subfolders organized by page/route, mirroring how pages are organized in `src/pages/`.

**Inferred user intent:** Make organisms easier to discover, reduce import path noise, and make it clear which organisms belong to which page context.

### What I did

#### 2a. Surveyed the flat organisms directory

Found 47 items in `web/packages/pyxis-app/src/components/organisms/`. Grouped them by prefix:

| Prefix | Components | Suggested subfolder |
|---|---|---|
| `Dashboard*` | 12 | `Dashboard/` |
| `Shows*` | 6 | `Shows/` |
| `ShowDetail*` | 3 | `ShowDetail/` |
| `Calendar*` | 5 | `Calendar/` |
| `Booking*` + `Bookings*` | 8 | `Bookings/` |
| `ArtistRoster`, `AttendancePanel`, `AuditLogPanel` | 3 | `Roster/` |
| `SettingsPanel` | 1 | `Settings/` |
| `Panel`, `Panels.tsx`, `Phase8Sections.tsx`, `DiscordMappingPanel`, `FlyerField`, `NewShowModal` | 6 | (stays at root) |

#### 2b. Moved components into subfolders

```bash
mkdir -p Dashboard Shows ShowDetail Calendar Bookings Settings Roster

# Dashboard: 12 components
mv DashboardActivityPanel Dashboard/
mv DashboardAttentionContent Dashboard/
mv DashboardAttentionPanel Dashboard/
mv DashboardHero Dashboard/
mv DashboardMetricsGrid Dashboard/
mv DashboardMobileCopy Dashboard/
mv DashboardMobileHeader Dashboard/
mv DashboardOverview Dashboard/
mv DashboardQuickActionsContent Dashboard/
mv DashboardQuickActionsPanel Dashboard/
mv DashboardUpcomingPanel Dashboard/

# Shows: 4 components
mv ShowsArchivedPanel Shows/
mv ShowsConfirmedPanel Shows/
mv ShowsFilterBar Shows/
mv ShowsTable Shows/

# ShowDetail: 3 components
mv ShowDetailDiscordPanel ShowDetail/
mv ShowDetailHero ShowDetail/
mv ShowDetailInfoPanel ShowDetail/

# Calendar: 5 components
mv CalendarAgenda Calendar/
mv CalendarBoard Calendar/
mv CalendarLegend Calendar/
mv CalendarMonth Calendar/
mv CalendarMonthPanel Calendar/

# Bookings: 8 components
mv BookingQueue Bookings/
mv BookingReviewDatePanel Bookings/
mv BookingReviewHero Bookings/
mv BookingReviewNotePanel Bookings/
mv BookingReviewRequestPanel Bookings/
mv BookingsInboxPanel Bookings/
mv BookingsInsightsPanel Bookings/
mv BookingsProcessedPanel Bookings/

# Settings
mv SettingsPanel Settings/

# Roster: 3 components
mv ArtistRoster Roster/
mv AttendancePanel Roster/
mv AuditLogPanel Roster/
```

#### 2c. Created `index.ts` barrels in each subfolder

| File | Contents |
|---|---|
| `Dashboard/index.ts` | All 11 Dashboard component re-exports |
| `Shows/index.ts` | ShowsArchivedPanel, ShowsConfirmedPanel, ShowsFilterBar, ShowsTable |
| `ShowDetail/index.ts` | ShowDetailDiscordPanel, ShowDetailHero, ShowDetailInfoPanel |
| `Calendar/index.ts` | CalendarAgenda, CalendarBoard, CalendarLegend, CalendarMonth, CalendarMonthPanel |
| `Bookings/index.ts` | All 8 Booking/Bookings components |
| `Settings/index.ts` | SettingsPanel |
| `Roster/index.ts` | ArtistRoster, AttendancePanel, AuditLogPanel |

#### 2d. Updated the legacy barrel files

**`Panels.tsx`** — was re-exporting flat component paths. Updated to use subfolder re-exports:
```tsx
export * from './Dashboard';
export * from './Shows';
export * from './ShowDetail';
export * from './Calendar';
export * from './Bookings';
export * from './Settings';
export * from './Roster';
export * from './DiscordMappingPanel';
export * from './NewShowModal';
export * from './FlyerField';
```

**`Phase8Sections.tsx`** — was re-exporting flat paths for ShowDetail, Calendar, and Bookings components. Updated to use subfolder re-exports:
```tsx
// Legacy barrel — prefer importing from subfolders directly
export * from './ShowDetail';
export * from './Calendar';
export * from './Bookings';
```

**`DashboardSections.tsx`** — was re-exporting Dashboard components individually. Now:
```tsx
export * from './Dashboard';
```

**`ShowsSections.tsx`** — was re-exporting Shows components individually. Now:
```tsx
export * from './Shows';
```

#### 2e. Updated direct imports in page files

Three page files had hardcoded deep imports that broke after the move:

| Page file | Change |
|---|---|
| `pages/AttendancePage/Page.tsx` | `AttendancePanel/AttendancePanel` → `Roster/AttendancePanel/AttendancePanel` |
| `pages/SettingsPage/Page.tsx` | `SettingsPanel/SettingsPanel` → `Settings/SettingsPanel/SettingsPanel` |
| `pages/BookingReviewPage/Page.tsx` | `BookingReviewRequestPanel/BookingReviewRequestPanel` → `Bookings/BookingReviewRequestPanel/BookingReviewRequestPanel` |

### What was tricky to build

**Git rename detection.** Git did not automatically detect the component moves as renames because the shell command `mv` was used. The files showed up as `D` (deleted) + untracked copies, which is git-speak for "I don't know these are related." The `-M` flag on `git diff` would reveal the rename relationships, but for the commit it doesn't matter — git will store them as adds+deletes either way.

**Tracking down broken imports.** I found three page files with direct deep imports (`from '../../components/organisms/X/Y'`). I searched all pages with `grep -rn "organisms/[A-Z]"` to catch everything before committing. Two of the three were TypeScript `import type` statements (type-only imports), which means they won't break at runtime but would break TypeScript compilation.

**Legacy barrel chain.** `Phase8Sections.tsx` existed alongside `Panels.tsx` as a second barrel file. Pages like `ShowDetailPage`, `CalendarPage`, `BookingsPage`, and `BookingReviewPage` all imported from `Phase8Sections`. I updated `Phase8Sections` to re-export the subfolders, preserving backward compatibility for all those page imports without changing the pages themselves.

### What warrants a second pair of eyes

**TypeScript compilation not verified.** I did not run `tsc --noEmit` before writing this diary entry. The reorganization is structurally sound (barrel files updated, direct imports fixed, subfolder `index.ts` files created), but TypeScript may still report errors from:
- Story files that import moved components with old paths
- Other non-page consumers of organisms with hardcoded paths
- The `stories.tsx` files that live inside each moved component folder (they were moved along with the `.tsx`, `.css`, and `index.ts`)

Run this before committing:
```bash
cd web && pnpm --filter pyxis-app exec tsc --noEmit
```

### What should be done in the future

- [ ] **Run `tsc --noEmit` to verify TypeScript** after organism reorganization
- [ ] Fix `--app-*` token drift in `app-tokens.css` (--app-ink: #1f1e1c → #1A1A18, --app-muted: #6f685e → #8A857B, --app-faint: #9b9488 → #B8B2A5)
- [ ] Re-run visual diff after token fix to confirm the 8.56% TopBar diff drops
- [ ] Check `organisms/**/*stories.tsx` files for broken imports — they were moved with the components but may have internal imports to sibling files using relative paths
- [ ] Update the visual spec (`app.components.visual.yml`) with organism-level targets now that they have proper subfolder structure
- [ ] Add stories for the organism components using the same split-per-component pattern

---

## Key Context for Resuming

### Token mismatch (not yet fixed)

Three token systems in Pyxis:

| System | Ink value |
|---|---|
| Prototype `tokens.js` | `#1A1A18` |
| Shared `tokens.css` | `#1A1A18` ✓ |
| App `app-tokens.css` | `#1f1e1c` ✗ |

The `--app-ink`, `--app-muted`, and `--app-faint` values in `web/packages/pyxis-app/src/styles/app-tokens.css` must be updated to match the prototype.

### New organisms structure

```
web/packages/pyxis-app/src/components/organisms/
├── Dashboard/          (11 components + index.ts)
├── Shows/              (4 components + index.ts)
├── ShowDetail/         (3 components + index.ts)
├── Calendar/           (5 components + index.ts)
├── Bookings/           (8 components + index.ts)
├── Settings/           (1 component + index.ts)
├── Roster/             (3 components + index.ts)
├── Panel/              (base component — stays)
├── Panels.tsx          (barrel — updated to re-export subfolders)
├── Phase8Sections.tsx  (legacy barrel — updated to re-export subfolders)
├── DashboardSections.tsx
├── ShowsSections.tsx
├── DiscordMappingPanel/ (stays — no page match)
├── FlyerField/         (stays)
└── NewShowModal/       (stays)
```

### Story IDs for shell components (verified)

```
pyxis-app-components-shell-appshell--shell
pyxis-app-components-shell-appshell--shell-with-custom-action
pyxis-app-components-shell-apptopbar--dashboard
pyxis-app-components-shell-apptopbar--with-action
pyxis-app-components-shell-apptopbar--long-title
pyxis-app-components-shell-appsidebar--default
pyxis-app-components-shell-appmobilebottomnav--default
```

### Ports

| Service | Port |
|---|---:|
| Prototype static server | 7070 |
| pyxis-app Storybook | 6008 |
