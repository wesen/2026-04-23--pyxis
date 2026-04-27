---
Title: Component Organization Tasks
Ticket: PYXIS-APP-VISUAL-TUNING
Status: active
Topics:
  - frontend
  - react
  - component-organization
  - storybook
  - css
DocType: tasks
Intent: implementation
Summary: Ordered tasks for restarting pyxis-app component organization safely after rollback.
LastUpdated: 2026-04-27T11:45:00-04:00
---

# Tasks

## Phase 0: Bookkeeping and baseline

- [x] **T01 — Commit ticket guide, task list, and diary scaffold**
  - Store the detailed component organization implementation guide in the ticket.
  - Add this ordered task list.
  - Create/update the diary so future work is recoverable.
  - Commit docs/bookkeeping separately.

- [x] **T02 — Restore a useful validation baseline**
  - Fix the restored baseline's `AppTopBar.stories.tsx` Storybook typing issue by adding required default args or otherwise making the story type-correct.
  - Run `pnpm exec tsc --noEmit`.
  - Run `pnpm exec vite build`.
  - Prefer running `pnpm exec storybook build` if time permits.
  - Commit separately.

## Phase 1: Single import concept before moving files

- [x] **T03 — Add public component layer barrels and retire page use of legacy barrels**
  - Create `web/packages/pyxis-app/src/components/organisms/index.ts`.
  - Prefer existing `web/packages/pyxis-app/src/components/shell/index.ts` for page shell imports.
  - Update page imports away from:
    - `components/organisms/Panels`
    - `components/organisms/Phase8Sections`
    - `components/organisms/ShowsSections`
    - `components/shell/AppShell`
  - Use:
    - `components/organisms`
    - `components/shell`
  - Do not delete legacy barrels yet.
  - Validate and commit.

- [x] **T04 — Add/keep a relative import resolver that checks CSS imports**
  - Add a repo-local or ticket-local script that checks relative imports including `.css` side-effect imports.
  - Dry-run/check current tree.
  - Ensure it reports `unresolved: 0` before structural moves.
  - Commit separately if repo-local; otherwise include in ticket docs commit.

## Phase 2: Shell split only

- [x] **T05 — Split shell components into one component folder each**
  - Split `components/shell/AppShell.tsx` into:
    - `AppShell/`
    - `AppTopBar/`
    - `AppSidebar/`
    - `AppSidebarMenu/`
    - `AppSidebarUserFooter/`
    - `AppMobileBottomNav/`
  - Split `AppShell.css` so each component imports its own CSS.
  - Move stories into matching folders.
  - Storybook titles remain `Pyxis App/Components/Shell/<Component>`.
  - Validate with `tsc`, `vite build`, and preferably `storybook build`.
  - Commit separately.

## Phase 3: multi-export component splits

- [x] **T06 — Split `ArtistCard` and `ArtistRosterRow`**
  - Create `molecules/ArtistRosterRow/`.
  - Move row-specific code and CSS out of `ArtistCard`.
  - Add/adjust stories.
  - Update imports.
  - Validate and commit.

- [x] **T07 — Split `BookingCard` and `BookingQueueRow`**
  - Create `molecules/BookingQueueRow/`.
  - Move row-specific code and CSS out of `BookingCard`.
  - Add/adjust stories.
  - Update imports.
  - Validate and commit.

- [x] **T08 — Split `DashboardAttentionContent` and `DashboardAttentionCount`**
  - Create `organisms/DashboardAttentionCount/`.
  - Add missing `DashboardAttentionContent.stories.tsx` if needed.
  - Keep shared defaults/types colocated in an explicit helper/data file.
  - Validate and commit.

## Phase 4: optional page-grouped organisms

- [x] **T09 — Decide whether to group organisms by page**
  - Only do this after T01-T08 are stable.
  - If yes, move one page group per commit.

- [x] **T10 — Optional: move Dashboard organisms into `organisms/Dashboard/`**
  - Use `git mv`.
  - Update Storybook titles to `Pyxis App/Components/Organisms/Dashboard/<Component>`.
  - Validate with import resolver, `tsc`, `vite build`, `storybook build`.
  - Commit separately.

- [x] **T11+ — Optional: move remaining page groups one at a time**
  - [x] Shows group.
  - [x] Bookings group.
  - [x] Calendar group.
  - [x] ShowDetail group.
  - [x] Roster group.
  - [x] Settings group; shared standalone organisms intentionally left top-level.
  - One group per commit.
