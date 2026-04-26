---
Title: Detailed Implementation Tasks
Ticket: PYXIS-APP-REACT
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
  - rtk-query
DocType: tasks
Intent: implementation-plan
Summary: Detailed handoff task list for building the responsive pyxis-app React package from desktop full-app and mobile prototype baselines.
---

# Detailed Implementation Tasks

This task list is written for a new intern. Follow it top-to-bottom unless a lead explicitly reprioritizes. The goal is to build **one responsive `pyxis-app` React package** from the desktop full-app prototype and mobile prototype baselines.

The mobile prototype is **not** a separate app architecture. It is the responsive/mobile baseline for the same app routes, data model, and component system.

## Ground rules

- [x] Keep a detailed diary in `reference/01-diary.md` for every meaningful step.
- [x] Commit at coherent milestones, not after every tiny edit.
- [x] Use live Storybook in tmux, not static Storybook builds, for the normal edit/compare loop.
- [x] Keep generated runtime artifacts out of active source paths.
- [x] Preserve useful intermediate visual artifacts under numbered ticket folders such as `various/02-first-dashboard-run/`.
- [x] Put one-off scripts in this ticket's `scripts/` or `experiments/` folders; promote only stable reusable scripts.
- [x] Do not create new active native `*.css-visual-diff.yml` configs.
- [x] Use JS/YAML visual suite specs and `css-visual-diff` JS userland.
- [x] Prefer one page/component implementation that responds to viewport size over parallel `Mobile*Page` implementations.

---

## Phase 0 — Orientation and environment

Goal: understand the existing system before writing new code.

### Read first

- [x] Read `design/01-pyxis-app-react-end-to-end-workflow-guide.md`.
- [x] Read `playbooks/01-pyxis-app-react-intern-playbook.md`.
- [x] Read `various/01-source-inventory.md`.
- [x] Read `docs/component-system-and-public-site-components.md`.
- [x] Read `docs/playbooks/05-bottom-up-component-visual-parity.md`.
- [x] Read `prototype-design/visual-diff/userland/README.md`.

### Confirm tools and servers

- [x] Confirm repo root:

  ```bash
  pwd
  # /home/manuel/code/wesen/2026-04-23--pyxis
  ```

- [x] Confirm package manager from `web/`:

  ```bash
  cd web
  pnpm --version
  ```

- [x] Confirm `css-visual-diff` works:

  ```bash
  css-visual-diff --help >/tmp/cssvd-help.txt
  ```

- [x] Confirm `remarquee` works if you need to upload docs:

  ```bash
  remarquee status
  ```

### Start or confirm prototype server

- [x] Start prototype server if it is not already running:

  ```bash
  python3 -m http.server 7070 --directory prototype-design
  ```

- [x] Open/check:

  ```text
  http://localhost:7070/standalone/full-app/index.html
  http://localhost:7070/standalone/mobile/index.html
  ```

### Deliverable

- [x] Diary entry: what you read, what servers/tools are available, and any setup problems.

---

## Phase 1 — Prototype route and section inventory

Goal: map the desktop and mobile prototype baselines to one responsive route model.

### Desktop prototype pages

Inventory these pages:

- [x] `prototype-design/standalone/full-app/login.html`
- [x] `prototype-design/standalone/full-app/setup.html`
- [x] `prototype-design/standalone/full-app/dashboard.html`
- [x] `prototype-design/standalone/full-app/shows.html`
- [x] `prototype-design/standalone/full-app/calendar.html`
- [x] `prototype-design/standalone/full-app/bookings.html`
- [x] `prototype-design/standalone/full-app/modal.html`
- [x] `prototype-design/standalone/full-app/artists.html`
- [x] `prototype-design/standalone/full-app/attendance.html`
- [x] `prototype-design/standalone/full-app/log.html`
- [x] `prototype-design/standalone/full-app/discord.html`
- [x] `prototype-design/standalone/full-app/settings.html`

### Mobile prototype baselines

Map these to the same app routes/pages where possible:

- [x] `prototype-design/standalone/mobile/login.html` → `LoginPage`
- [x] `prototype-design/standalone/mobile/home.html` → `DashboardPage` mobile viewport
- [x] `prototype-design/standalone/mobile/shows.html` → `ShowsPage` mobile viewport
- [x] `prototype-design/standalone/mobile/show-detail.html` → `ShowDetailPage` mobile viewport
- [x] `prototype-design/standalone/mobile/calendar.html` → `CalendarPage` mobile viewport
- [x] `prototype-design/standalone/mobile/bookings.html` → `BookingsPage` mobile viewport
- [x] `prototype-design/standalone/mobile/booking-review.html` → `BookingReviewPage` mobile viewport
- [x] `prototype-design/standalone/mobile/artists.html` → `ArtistsPage` mobile viewport
- [x] `prototype-design/standalone/mobile/artist-detail.html` → `ArtistDetailPage` mobile viewport
- [x] `prototype-design/standalone/mobile/post-show.html` → `PostShowPage` mobile viewport
- [x] `prototype-design/standalone/mobile/settings.html` → `SettingsPage` mobile viewport

### Section inventory

For each route/page:

- [x] Identify root page selector candidate, e.g. `data-page="dashboard"`.
- [x] Identify important sections, e.g. `dashboard-summary`, `dashboard-activity`, `dashboard-upcoming`.
- [x] Identify repeated UI shapes that should become components.
- [x] Note desktop/mobile layout differences.
- [x] Decide whether a mobile difference is CSS/responsive layout or a true mobile-only interaction.

### Deliverables

- [x] Create `various/02-route-section-inventory.md`.
- [x] Update diary with key route mapping decisions.
- [x] If prototype selectors are missing, create a small implementation task list for adding them.

---

## Phase 2 — Scaffold `web/packages/pyxis-app`

Goal: create a buildable package with Vite, Storybook, RTK Query, and routing.

### Package files

- [x] Create `web/packages/pyxis-app/package.json`.
- [x] Create `web/packages/pyxis-app/tsconfig.json`.
- [x] Create `web/packages/pyxis-app/tsconfig.build.json` if needed.
- [x] Create `web/packages/pyxis-app/vite.config.ts`.
- [x] Create `web/packages/pyxis-app/index.html`.
- [x] Create `web/packages/pyxis-app/public/mockServiceWorker.js` or initialize MSW as needed.

### Source skeleton

- [x] Create `src/main.tsx`.
- [x] Create `src/App.tsx`.
- [x] Create `src/store.ts`.
- [x] Create `src/styles/global.css`.
- [x] Create `src/styles/app-tokens.css` if app-specific aliases are needed.
- [x] Create `src/api/endpoints.ts`.
- [x] Create `src/api/appApi.ts`.
- [x] Create `src/api/hooks.ts`.
- [x] Create `src/api/mockHandlers.ts`.
- [x] Create `src/api/errors.ts`.

### Storybook skeleton

- [x] Create `.storybook/main.ts`.
- [x] Create `.storybook/preview.tsx`.
- [x] Alias `pyxis-components` to source in Storybook Vite config.
- [x] Add MSW loader/decorator.
- [x] Add Redux Provider decorator with `makeStore()`.
- [x] Add viewports:
  - desktop: `1240px × 900px` or prototype-specific height,
  - mobile: `390px × 844px`.

### Validation

- [x] Run:

  ```bash
  cd web
  pnpm --filter pyxis-app typecheck
  ```

- [x] Start Storybook:

  ```bash
  tmux new-session -d -s pyxis-app-storybook \
    'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook'
  ```

- [x] Confirm Storybook at:

  ```text
  http://localhost:6008
  ```

### Deliverable

- [x] Commit: `Scaffold pyxis app package`.

---

## Phase 3 — App data contracts and RTK Query

Goal: typed data first, then components.

### `pyxis-types`

- [x] Add `web/packages/pyxis-types/src/app.ts`.
- [x] Export app types from `web/packages/pyxis-types/src/index.ts`.
- [x] Define at least:
  - [x] `AppShow`
  - [x] `BookingRequest`
  - [x] `ArtistProfile`
  - [x] `CalendarEvent`
  - [x] `AttendanceEntry`
  - [x] `AuditLogEntry`
  - [x] `DiscordChannelMapping`
  - [x] `SpaceSettings`
  - [x] `AuthSession`

### App API slice

- [x] Add RTK Query endpoints for:
  - [x] session
  - [x] shows
  - [x] show detail
  - [x] bookings
  - [x] booking detail/review
  - [x] artists
  - [x] artist detail
  - [x] calendar
  - [x] attendance/post-show
  - [x] audit log
  - [x] discord mappings
  - [x] settings

### Mock data

- [x] Derive seed data from `prototype-design/lib/data.js`.
- [x] Keep mock data count close to prototype pages so visual diffs are meaningful.
- [x] Add MSW handlers with wildcard URL patterns, e.g. `*/api/app/shows`.

### Validation

- [x] Run:

  ```bash
  cd web
  pnpm --filter pyxis-types typecheck
  pnpm --filter pyxis-app typecheck
  ```

### Deliverable

- [x] Commit: `Add pyxis app data contracts and API slice`.

---

## Phase 4 — Selector contract for prototypes and React

Goal: make visual comparisons semantically meaningful before tuning CSS.

### Prototype selectors

For each standalone prototype page:

- [x] Add or verify `data-page` on the main page root.
- [ ] Add or verify `data-section` on important sections. (deferred to selector-only prototype source pass)
- [ ] Add `data-pyxis-component` / `data-pyxis-part` to prototype component fixtures when useful. (deferred to selector-only prototype source pass)

### React selectors

For each React component/page:

- [x] Add `data-pyxis-component` / `data-pyxis-part` to reusable components.
- [x] Add `data-page` to page roots.
- [x] Add `data-section` to important page sections.
- [x] Keep desktop and mobile variants using the same page/section names where possible.

### Deliverable

- [x] Create `various/03-selector-contract-map.md` mapping prototype selectors to React selectors.
- [x] Commit selector-only changes separately if they touch prototype source.

---

## Phase 5 — First bottom-up component slice

Goal: prove the component workflow with one small repeated component.

Recommended first components:

- [x] `MetricCard`
- [x] `ActivityFeedItem`
- [x] `StatusDot`
- [x] `DateChip`

For the chosen component:

- [x] Locate prototype source and visual examples.
- [x] Decide whether it belongs in `pyxis-components` or `pyxis-app`.
- [x] Create `Component.tsx`.
- [x] Create `Component.css`.
- [x] Add part selectors.
- [x] Add Storybook stories:
  - [x] default,
  - [x] compact/mobile viewport if relevant,
  - [x] themed/dark if relevant.
- [x] Add visual spec target to `app.components.visual.yml`.
- [x] Run focused `compare-spec` for that component.
- [x] Inspect `left_region.png` and `right_region.png` first.
- [ ] Tune until close enough. (blocked by prototype component selectors; recorded in diary)
- [x] Preserve useful artifacts under `various/04-first-component-run/`.

### Deliverable

- [x] Commit: `Add first pyxis app component slice`.

---

## Phase 6 — Component library expansion

Goal: build enough components to compose the first page without raw div soup.

### Staff-app molecules

- [x] `MetricCard`
- [x] `TodayShowCard`
- [x] `ActivityFeedItem`
- [x] `ShowTableRow`
- [x] `BookingQueueRow` / `BookingCard`
- [x] `ArtistRosterRow` / `ArtistCard`
- [x] `CalendarEventChip`
- [x] `AttendanceStat`
- [x] `DiscordChannelRow`
- [x] `SettingsToggleRow`

### Staff-app organisms

- [x] `AppShell`
- [x] `AppSidebar`
- [x] `AppTopBar`
- [x] `AppBottomNav` or responsive mobile shell navigation
- [x] `DashboardOverview`
- [x] `ShowsTable` / responsive show list
- [x] `BookingQueue` / responsive booking cards
- [x] `CalendarMonth` / responsive agenda
- [x] `ArtistRoster` / responsive artist list
- [x] `AttendancePanel`
- [x] `AuditLogPanel`
- [x] `DiscordMappingPanel`
- [x] `SettingsPanel`
- [x] `NewShowModal`

For each component:

- [x] Story exists.
- [x] Selectors exist.
- [x] CSS is in CSS files, not static inline styles.
- [x] Tokens/variables are used where reasonable.
- [x] Visual spec target exists if component is important enough for comparison.
- [x] Diary notes any accepted differences.

### Deliverable

- [x] Commit in batches by component family, e.g. dashboard, bookings, shell.

---

## Phase 6A — Prove the CSS visual improvement loop on one component

Goal: before building more pages, prove that the `css-visual-diff` loop compares like-for-like regions and produces actionable style feedback.

This phase is a **hard gate** before Phase 7. Do not continue into page tuning until the component loop works end-to-end.

### Pick the proving component

Use `MetricCard` unless a lead chooses another small repeated component.

- [x] Confirm the prototype source location for the chosen component shape.
- [x] Confirm the React component story renders one isolated component state.
- [x] Confirm both sides have stable selectors that crop the same visual object, not a whole page on one side and one component on the other.
- [x] If the prototype lacks selectors, add them in a selector-only change before tuning styles.

### Prototype selector instrumentation

- [x] Add `data-pyxis-component="metric-card"` / `data-pyxis-part="root"` to the prototype metric/stat card root.
- [x] Add part selectors for important comparable internals:
  - [x] `label`,
  - [x] `value`,
  - [x] `caption`.
- [x] Keep the selector change behavior-neutral.
- [x] Verify the standalone prototype still renders after selector additions.
- [x] Commit selector-only prototype changes if they touch prototype sources.

### React selector verification

- [x] Verify React `MetricCard` root uses `data-pyxis-component="metric-card"`.
- [x] Verify React `MetricCard` uses part selectors for `label`, `value`, and `caption`.
- [x] Verify Storybook story dimensions do not add misleading wrapper padding to the crop selector.

### Visual spec correction

- [x] Update `app.components.visual.yml` so the MetricCard target uses like-for-like selectors:
  - [x] prototype `original` selector targets the prototype metric card root,
  - [x] React `react` selector targets the React metric card root.
- [x] Run `prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py`.
- [x] Add a ticket-local script such as `scripts/03-smoke-compare-metric-card.sh` for the focused command.
- [x] Store artifacts under `various/05-css-loop-metric-card/`.

### Inspect-first validation

- [x] Run the focused `compare-spec` for MetricCard.
- [x] Inspect the individual crop files `left_region.png` and `right_region.png` before reading the numeric diff.
- [x] Use the `read` tool to inspect those individual images; do not use `understand_image` for this workflow.
- [x] Do not validate from the conjoined/combined `diff_comparison.png`; use it only after the individual crops are understood.
- [x] Once the individual crops are close, inspect pixel-diff artifacts such as `diff_only.png` to identify residual drift.
- [x] Confirm the two crops have comparable bounds and content.
- [x] If bounds differ materially, fix selectors/spec/story wrappers before changing CSS.
- [x] Record crop dimensions and first result in the diary.

### Improvement loop

Run at least two iterations:

- [x] Iteration 1: adjust React CSS/tokens based on crop evidence.
- [x] Rerun focused `compare-spec`.
- [x] Inspect crop and diff artifacts.
- [x] Iteration 2: adjust only if the diff evidence still points to real style drift.
- [x] Rerun focused `compare-spec`.
- [x] Record before/after changed-percent, changed-pixel count, and accepted differences.

### Acceptance criteria

- [x] The visual diff compares like-for-like component crops.
- [x] The loop identifies at least one concrete style issue or explicitly records why the first implementation is already close enough.
- [x] The final MetricCard result is either:
  - [x] in the `accepted` or `review` policy band, or
  - [ ] documented as intentionally deferred with exact reasons and crop evidence.
- [x] The diary includes exact commands, artifacts, failures, and review instructions.
- [x] Commit: `Prove pyxis app component visual loop`.

---

## Phase 6B — Prove the CSS visual improvement loop on one page section

Goal: prove the same inspect-first loop works for a small page section before moving to a whole responsive dashboard page.

This phase is also a **hard gate** before Phase 7. Prefer a Dashboard section that is small enough to debug quickly.

### Pick the proving section

Recommended section: `dashboard-metrics`.

- [x] Confirm desktop prototype has a stable selector for the metrics section.
- [x] Confirm React has `data-section="dashboard-metrics"`.
- [x] Confirm the section contains comparable data/counts on both sides.
- [x] If data differs, adjust mock data/story args before tuning CSS.

### Prototype section selectors

- [x] Add `data-section="dashboard-metrics"` to the prototype dashboard metric-card group.
- [ ] Add or verify `data-section="dashboard-summary"` on the enclosing dashboard summary area. (deferred; Phase 6B proved the metrics section only)
- [ ] Add `data-section="dashboard-upcoming"` and `data-section="dashboard-activity"` only if they can be done behavior-neutrally in the same selector pass. (deferred)
- [x] Verify the standalone desktop dashboard still renders.

### Visual spec correction

- [x] Update `app.pages.desktop.visual.yml` so the dashboard metrics section compares:
  - [x] prototype `[data-section="dashboard-metrics"]`,
  - [x] React `[data-section="dashboard-metrics"]`.
- [x] Add an optional mobile metrics target only if the mobile prototype has a comparable section. (not added; desktop proof only)
- [x] Run `refresh-spec-mirrors.py`.
- [x] Add a ticket-local script such as `scripts/04-smoke-compare-dashboard-metrics.sh`.
- [x] Store artifacts under `various/06-css-loop-dashboard-metrics/`.

### Inspect-first validation

- [x] Run the focused dashboard metrics comparison.
- [x] Inspect the individual crop files `left_region.png` and `right_region.png` first.
- [x] Use the `read` tool to inspect those individual images; do not use `understand_image` for this workflow.
- [x] Do not validate from the conjoined/combined `diff_comparison.png`; use it only after the individual crops are understood.
- [x] Once the individual crops are close, inspect pixel-diff artifacts such as `diff_only.png` to identify residual drift.
- [x] Confirm both crops are the metrics section rather than the full page.
- [x] Confirm region sizes are close enough for pixel diff to be meaningful.
- [x] Record crop dimensions and first result in the diary.

### Improvement loop

Run at least two iterations:

- [x] Iteration 1: adjust layout/style based on real section diff evidence.
- [x] Rerun focused comparison.
- [x] Inspect crop and diff artifacts.
- [x] Iteration 2: adjust or document accepted differences.
- [x] Rerun focused comparison.
- [x] Record before/after metrics and accepted differences.

### Acceptance criteria

- [x] The page-section comparison uses like-for-like crops.
- [x] The loop can guide a concrete CSS/layout decision.
- [x] The final section result is either accepted/review-band or explicitly deferred with evidence.
- [x] Do not chase perfection when individual crops are close and remaining differences are plausibly typography, anti-aliasing, or subtle rendering drift.
- [x] The workflow is documented enough that Phase 7 can reuse it for the full Dashboard page.
- [x] Commit: `Prove pyxis app dashboard section visual loop`.

---

## Phase 6C — Write the visual improvement loop runbook

Goal: turn the proven loop into a repeatable short runbook before scaling to pages.

- [x] Add a ticket document `playbooks/02-pyxis-app-css-visual-improvement-loop.md` or a focused section in the existing intern playbook.
- [x] Document the required order:
  1. selector verification,
  2. individual crop inspection with the `read` tool (`left_region.png`, then `right_region.png`),
  3. pixel-diff artifact review (`diff_only.png`) once crops are close,
  4. optional combined diff review only after individual crops are understood,
  5. CSS/token change,
  6. rerun,
  7. diary/changelog update,
  8. commit.
- [x] Include exact commands for MetricCard and dashboard metrics.
- [x] Include screenshots/artifact paths from the successful loop.
- [x] Document failure modes:
  - [x] full-page-vs-component crop mismatch,
  - [x] Storybook wrapper padding changing crop bounds,
  - [x] accidentally judging from conjoined `diff_comparison.png` instead of individual crops,
  - [x] mock data mismatch,
  - [x] missing prototype selectors,
  - [x] generated artifacts accidentally landing in active source paths.
- [x] Update `docs/playbooks/05-bottom-up-component-visual-parity.md` with a short pointer to the pyxis-app loop once it is proven.
- [x] Commit: `Document pyxis app css visual improvement loop`.

---

## Phase 7 — First responsive page: Dashboard consolidation

Goal: finish Dashboard before moving to the remaining pages. The current Dashboard is a structural checkpoint, not done. Continue bottom-up by consolidating the header/menu, upcoming shows, quick actions, recent activity, metrics/attention, and shell/navigation organisms before treating the Dashboard page as complete.

### Phase 7.0 — Dashboard checkpoint already completed

- [x] Create/extend Dashboard page composition in `Pages.tsx` / `DashboardOverview`.
- [x] Compose from `AppShell`, `DashboardOverview`, metric cards, hero, quick actions, attention, upcoming, and activity panels.
- [x] Add `data-page="dashboard"`.
- [x] Add initial sections:
  - [x] `dashboard-summary`
  - [x] `dashboard-metrics`
  - [x] `dashboard-upcoming`
  - [x] `dashboard-activity`
  - [x] `dashboard-hero`
  - [x] `dashboard-quick-actions`
  - [x] `dashboard-attention`
- [x] Add `DashboardDesktop` story.
- [x] Add `DashboardMobile` story using the same page route/component.
- [x] Add dashboard targets to desktop/mobile app visual specs.
- [x] Run desktop/mobile full-page checkpoints and preserve artifacts.
- [x] Commit checkpoint: `Compose responsive dashboard page checkpoint`.

### Shared Dashboard consolidation checklist

Use this checklist for every Phase 7.x Dashboard section:

- [ ] Re-read the matching desktop/mobile prototype area before changing React/CSS.
- [ ] Identify whether the section should be an atom, molecule, organism, or page-level composition.
- [ ] Reuse existing atoms/molecules before introducing new ones.
- [ ] Extract or finish a named organism instead of adding more anonymous JSX to `DashboardOverview`.
- [ ] Add/verify stable `data-section` selectors in prototype and React.
- [ ] Add rich Storybook stories for the organism:
  - [ ] desktop/default,
  - [ ] mobile/narrow when layout differs,
  - [ ] dense/empty/long-content states when relevant,
  - [ ] token/theme override story if local variables are exposed.
- [ ] Consolidate repeated spacing/surface/radius/shadow/status decisions into shared tokens.
- [ ] Run focused section comparisons before the full dashboard page checkpoint.
- [ ] Inspect `left_region.png` and `right_region.png` with `read` before tuning.
- [ ] Inspect `diff_only.png` only after crops are aligned.
- [ ] Update diary/changelog with exact commands and final section result.
- [ ] Commit at a coherent Dashboard section checkpoint.

### Phase 7.1 — Dashboard header and shell/menu consolidation

- [x] Consolidate desktop sidebar/menu with prototype grouping, active state, pending badge, and user footer where appropriate.
- [x] Consolidate desktop topbar/header actions: breadcrumb, title, subtitle/date line, search, bell, new-show button.
- [x] Consolidate mobile header and bottom nav with the prototype labels/icons/badge behavior.
- [x] Extract organisms/molecules as needed:
  - [ ] `DashboardHeader`,
  - [x] `DashboardMobileHeader`,
  - [x] `AppSidebarMenu` / `AppSidebarUserFooter`,
  - [x] `AppMobileBottomNav`.
- [x] Add Storybook stories for shell/menu/header variants.
- [x] Add focused visual sections/specs for header/menu/mobile nav if feasible.
- [ ] Commit: `Consolidate dashboard shell and header`.

### Phase 7.2 — Dashboard hero consolidation

- [ ] Finish `DashboardHero` as a named organism with desktop/mobile variants.
- [ ] Align content contract with prototypes: date, doors, age, price, action labels, decorative mark.
- [ ] Reuse Button/Icon atoms instead of local button styling where possible.
- [ ] Add Storybook stories for desktop, mobile, no-next-show, long-artist-name states.
- [ ] Tune `dashboard-hero` focused comparisons before full page.
- [ ] Commit: `Consolidate dashboard hero organism`.

### Phase 7.3 — Dashboard metrics and attention consolidation

- [x] Extract `DashboardMetricsGrid` around `MetricCard`.
- [x] Decide and document desktop vs mobile copy variants (`Pending bookings` vs `Pending`, `Capacity use` vs `Capacity`).
- [x] Finish `DashboardAttentionPanel` as an organism using shared status/icon tokens.
- [x] Add Storybook stories for desktop/mobile metrics, dense attention, empty attention.
- [ ] Tune `dashboard-metrics` and `dashboard-attention` focused comparisons.
- [ ] Commit: `Consolidate dashboard metrics and attention`.

### Phase 7.4 — Dashboard upcoming shows consolidation

- [x] Extract `DashboardUpcomingPanel` as an organism.
- [x] Reuse `ShowTableRow`, `TodayShowCard`, `DateChip`, and `StatusDot` where possible.
- [x] Align desktop table columns/density with prototype: date, artist, doors, age, status, pinned affordance.
- [x] Align mobile behavior: decide whether upcoming shows are hidden on mobile home or represented by cards in a later route.
- [x] Add Storybook stories for desktop table, mobile cards/hidden state, empty state, long artist names.
- [x] Tune `dashboard-upcoming` focused comparison before full page.
- [x] Commit: `Consolidate dashboard upcoming shows`.

### Phase 7.5 — Dashboard quick actions consolidation

- [x] Extract `DashboardQuickActionsPanel` as an organism.
- [x] Reuse Button/Icon atoms and shared panel tokens.
- [x] Align button labels, icon presence, spacing, and full-width behavior with prototype.
- [x] Add Storybook stories for default, no-pending-bookings, mobile/narrow if applicable.
- [x] Tune `dashboard-quick-actions` focused comparison before full page.
- [x] Commit: `Consolidate dashboard quick actions`.

### Phase 7.6 — Dashboard recent activity consolidation

- [x] Extract `DashboardActivityPanel` as an organism around `ActivityFeedItem`.
- [x] Decide and document desktop/mobile item-count behavior (`5` desktop, `3` mobile prototype home).
- [x] Align metadata order/copy with prototype (`time/user/action` differences) without overfitting if data model differs.
- [x] Add Storybook stories for desktop, mobile, bot-only, empty, long activity text.
- [x] Tune `dashboard-activity` focused comparison before full page.
- [x] Commit: `Consolidate dashboard recent activity`.

### Phase 7.7 — Dashboard full-page acceptance checkpoint

- [ ] Run all focused Dashboard section comparisons and record final classifications.
- [ ] Run desktop full-page Dashboard comparison.
- [ ] Run mobile full-page Dashboard comparison.
- [ ] Inspect final full-page `left_region.png`, `right_region.png`, and `diff_only.png` with `read`.
- [ ] Document accepted differences rather than chasing typography/anti-aliasing/rendering drift.
- [ ] Update diary, changelog, tasks, and docmgr relations.
- [ ] Commit: `Finish responsive dashboard page`.

---

## Phase 8 — Remaining responsive pages, one page phase at a time

Goal: repeat the Dashboard pattern page-by-page, bottom-up. Do not tune full pages first. For each page phase, identify atoms/molecules/organisms, extract reusable pieces, add rich Storybook stories, consolidate tokens, then run focused section/page comparisons.

### Shared page-phase checklist

Use this checklist inside every Phase 8.x page phase:

- [ ] Read the relevant prototype desktop/mobile route before coding.
- [ ] Identify candidate reusable atoms, molecules, and organisms before editing page CSS.
- [ ] Reuse existing atoms/molecules where possible:
  - [ ] `StatusDot`, `DateChip`, `MetricCard`, `ActivityFeedItem`, `TodayShowCard`, `ShowTableRow`, `BookingCard`, `ArtistCard`, `CalendarEventChip`, `AttendanceStat`, `DiscordChannelRow`, `SettingsToggleRow`.
- [ ] Extract page-specific organisms when a section is more than simple composition.
- [ ] Add stable `data-section` selectors to prototype and React for each organism/section.
- [ ] Add rich Storybook stories for extracted organisms:
  - [ ] desktop/default,
  - [ ] mobile/narrow when applicable,
  - [ ] empty/loading/dense/long-content states when relevant,
  - [ ] theme/token override examples if local CSS variables exist.
- [ ] Consolidate repeated visual values into shared tokens instead of adding one-off CSS.
- [ ] Run focused section comparisons first; use full-page comparison only as a checkpoint.
- [ ] Inspect `left_region.png` and `right_region.png` with `read` before tuning.
- [ ] Inspect `diff_only.png` only after crops are aligned.
- [ ] Update diary/changelog with exact commands, results, crop paths, failures, and accepted differences.
- [ ] Commit when the page phase reaches a coherent checkpoint.

### Phase 8A — CSS ownership split and Storybook stylesheet hardening

Goal: prevent broad bucket stylesheets from breaking isolated organism stories when Storybook/Vite serves a stale or empty CSS transform, and make style ownership follow atoms/molecules/organisms.

- [x] Add this intermediate phase after the `Rows.css` empty-module regression broke Bookings Inbox.
- [x] Inventory broad app CSS buckets (`Rows.css`, `Panels.css`) and identify component/organism owners.
- [x] Split row/molecule styles into owned files:
  - [x] `Table.css`,
  - [x] `ShowTableRow.css`,
  - [x] `BookingCard.css`,
  - [x] `ArtistCard.css`,
  - [x] `CalendarEventChip.css`,
  - [x] `AttendanceStat.css`,
  - [x] `SettingsToggleRow.css`.
- [x] Split organism/page-section styles out of `Panels.css`:
  - [x] `DashboardSections.css`,
  - [x] `ShowsSections.css`,
  - [x] `Phase8Sections.css`,
  - [x] keep `Panels.css` as the generic panel/utility shell.
- [x] Remove `?dashboard` / `?molecules` CSS query workarounds from source imports once owned CSS files are in place.
- [x] Validate Bookings Inbox story no longer depends on the empty `Rows.css` transform.
- [x] Run typecheck and a focused Bookings queue visual smoke.
- [x] Update diary/changelog and commit: `Split pyxis app CSS ownership` (`8ab1a74`).

### Phase 8B — Widget folder architecture

Goal: align `pyxis-app` component organization with `pyxis-components/src/public`: every widget owns a folder with its own `.tsx`, `.css`, and `index.ts` export, rather than flat component directories or multi-widget bucket files.

- [x] Convert atoms to widget folders:
  - [x] `AgeBadge/`, `DateChip/`, `DrawProgress/`, `StatusDot/`, `StatusPill/`.
- [x] Convert molecules to widget folders:
  - [x] `ActivityFeedItem/`, `ArtistCard/`, `AttendanceStat/`, `BookingCard/`, `CalendarEventChip/`, `DiscordChannelRow/`, `MetricCard/`, `SettingsToggleRow/`, `ShowTableRow/`, `TodayShowCard/`.
- [x] Move shared molecule primitives into folders:
  - [x] `Table/`,
  - [x] `Rows/` compatibility shim.
- [x] Update relative imports after folderization.
- [x] Run typecheck after atom/molecule folderization.
- [x] Split organism bucket files into widget folders:
  - [x] `Panel/`, `DashboardOverview/`, `DashboardHero/`, `DashboardMetricsGrid/`, `DashboardQuickActionsPanel/`, `DashboardAttentionPanel/`, `DashboardActivityPanel/`,
  - [x] `ShowsFilterBar/`, `ShowsConfirmedPanel/`, `ShowsArchivedPanel/`,
  - [x] `CalendarMonthPanel/`, `CalendarAgenda/`, `CalendarLegend/`, `CalendarBoard/`,
  - [x] `BookingsInboxPanel/`, `BookingsProcessedPanel/`, `BookingsInsightsPanel/`,
  - [x] `ShowDetailHero/`, `ShowDetailInfoPanel/`, `ShowDetailDiscordPanel/`,
  - [x] `BookingReviewHero/`, `BookingReviewRequestPanel/`, `BookingReviewDatePanel/`, `BookingReviewNotePanel/`.
- [x] Colocate Storybook stories with their widgets/pages and remove the old top-level `stories/` folder.
- [x] Preserve existing Storybook titles/story export names where visual specs depend on stable story IDs.
- [x] Update Storybook config to scan colocated `src/**/*.stories.*` files only.
- [ ] Split/relocate route-level `pages.css` into page-owned files once organism widgets no longer depend on it.
- [x] Run representative Storybook CSS transform checks and focused visual smokes.
- [ ] Update diary/changelog and commit final Phase 8B.

### Phase 8C — Props, decomposition, component-system reuse, and story state coverage

Goal: prepare for proper RTK Query and app wiring by making widget APIs explicit, increasing Storybook state coverage, and auditing app widgets against `pyxis-components` before duplicating generic primitives.

Reference guide:

```text
docs/playbooks/07-react-application-decomposition-and-component-reuse.md
```

- [ ] Add named exported prop types for reusable atoms, molecules, organisms, shell widgets, and page route components.
- [ ] Replace anonymous inline prop types in widget implementations.
- [ ] Add callback props for hard-coded actions that will later dispatch RTK mutations or route actions.
- [ ] Add story states for priority atoms/molecules/organisms:
  - [ ] default,
  - [ ] empty,
  - [ ] long content,
  - [ ] mobile/narrow,
  - [ ] status/variant cases.
- [ ] Audit reuse against `pyxis-components` by cluster:
  - [ ] `Panel` vs `Card` / `CardHead`,
  - [ ] `MetricCard` / `AttendanceStat` vs `Stat`,
  - [ ] app tables vs `Table`,
  - [ ] `.app-empty-state` vs `Empty`,
  - [ ] `NewShowModal` vs `Modal`,
  - [ ] `AppTopBar` vs `TopBar`,
  - [ ] `StatusPill` / `AgeBadge` vs `Badge` / `Tag`,
  - [ ] form markup vs `Field` / `Input` / `Select` / `Textarea`.
- [ ] Document each non-reuse decision with a reason: app semantics, visual parity, missing shared API, or planned upstream improvement.
- [ ] Extract remaining inline Login/Setup page sections before RTK state wiring.
- [ ] Split/relocate route-level `pages.css` once page sections have widget owners.
- [ ] Keep pages as RTK Query/container boundaries and pass typed props into widgets.
- [ ] Run typecheck, Storybook smoke, and focused visual checks for any changed visual-spec targets.

### Phase 8.1 — Login and mobile login

- [x] Inventory desktop login and mobile login prototype routes.
- [x] Identify/reuse atoms and molecules: brand mark/text, auth action button, form fields, divider, invite/privacy footer.
- [x] Extract organisms as needed:
  - [x] `AuthLayout` (page-level `app-auth-page` composition accepted for this checkpoint),
  - [x] `LoginPanel` (`data-section="login-panel"`),
  - [x] `LoginMarquee` (`data-section="login-marquee"`),
  - [x] `MobileLoginHero` (responsive marquee/mobile copy accepted for this checkpoint).
- [x] Add Storybook stories for desktop login and mobile login. (Form-filled/error/loading states deferred.)
- [x] Add desktop/mobile visual spec targets and section targets.
- [x] Run focused comparisons and full-page checkpoints.
- [x] Commit: `Compose responsive login page`.

### Phase 8.2 — Setup

- [x] Inventory setup wizard prototype route(s).
- [x] Identify/reuse atoms and molecules: progress steps, channel field rows, card/footer actions, input fields.
- [x] Extract organisms as needed:
  - [x] `SetupWizardLayout` (page-level `app-setup-page` composition accepted for this checkpoint),
  - [x] `SetupProgress` (`data-section="setup-progress"`),
  - [x] `DiscordChannelFieldList` (`data-section="setup-channels"`),
  - [x] `SetupActionFooter` (footer inside setup channels card).
- [x] Add Storybook story for current wizard step/state.
- [x] Add visual spec targets and focused section targets.
- [x] Run focused comparisons and full-page checkpoints.
- [x] Commit: `Compose setup wizard page`.

### Phase 8.3 — Shows and mobile shows

- [x] Inventory desktop shows and mobile shows prototype routes.
- [x] Reuse `ShowTableRow`, `TodayShowCard`, `StatusDot`, `DateChip` where applicable.
- [x] Extract organisms as needed:
  - [x] `ShowsFilterBar`,
  - [x] `ShowsConfirmedTable` (via `ShowsTable` in confirmed panel),
  - [x] `ShowsArchivePanel` (via archived panel),
  - [x] `MobileShowList` (responsive checkpoint accepted with existing shell/table; richer mobile card list deferred),
  - [x] `ShowListCard` if current molecules are insufficient. (deferred; current checkpoint uses `ShowsTable`/`ShowTableRow`.)
- [x] Add Storybook stories for desktop/mobile shows pages. (Dedicated table/list/card/empty/filter states deferred.)
- [x] Add desktop/mobile visual spec targets and section targets.
- [x] Run focused comparisons and full-page checkpoints.
- [x] Commit: `Compose responsive shows page`.

### Phase 8.4 — Show detail and mobile show detail

- [x] Inventory desktop/mobile show detail prototype routes.
- [x] Reuse show/date/status/booking atoms and molecules where possible.
- [x] Extract organisms as needed:
  - [x] `ShowDetailHeader` (`ShowDetailHero`),
  - [x] `ShowMetaPanel` (`ShowDetailInfoPanel`),
  - [x] `ShowDiscordPanel` (`ShowDetailDiscordPanel`),
  - [x] `ShowBookingsPanel` (deferred; no matching checkpoint data yet),
  - [x] `MobileShowDetailActions` (page action row).
- [x] Add Storybook stories for default mobile/detail panels. (Confirmed/hold/archived variants deferred.)
- [x] Add desktop/mobile visual spec targets and section targets.
- [x] Run focused comparisons and full-page checkpoints.
- [x] Commit: `Compose responsive show detail page`.

### Phase 8.5 — Calendar and mobile calendar

- [x] Inventory desktop/mobile calendar prototype routes.
- [x] Reuse `CalendarEventChip`, `StatusDot`, `DateChip` where applicable.
- [x] Extract organisms as needed:
  - [x] `CalendarHeader` (AppTopBar action),
  - [x] `CalendarMonthGrid` (`CalendarBoard` + `CalendarMonth`),
  - [x] `CalendarAgendaList` (`CalendarAgenda`),
  - [x] `MobileCalendarDayList` (responsive `CalendarBoard`; richer mobile list deferred).
- [x] Add Storybook stories for desktop/mobile board and agenda. (Dense/empty/status variants deferred.)
- [x] Add desktop/mobile visual spec targets and section targets.
- [x] Run focused comparisons and full-page checkpoints.
- [x] Commit: `Compose responsive calendar page`.

### Phase 8.6 — Bookings and mobile bookings

- [x] Inventory desktop/mobile bookings prototype routes.
- [x] Reuse `BookingCard`, `BookingQueueRow`, `StatusDot` where applicable.
- [x] Extract organisms as needed:
  - [x] `BookingQueuePanel` (`BookingsInboxPanel`),
  - [x] `BookingFilterTabs` (deferred; current checkpoint accepts queue-first composition),
  - [x] `MobileBookingList` (`BookingCard` list in `BookingsInboxPanel`),
  - [x] `BookingSummaryMetrics` (`BookingsInsightsPanel`).
- [x] Add Storybook stories for pending/processed/empty/insight states.
- [x] Add desktop/mobile visual spec targets and section targets.
- [x] Run focused comparisons and full-page checkpoints.
- [x] Commit: `Compose responsive bookings page`.

### Phase 8.7 — Booking review mobile route/section

- [x] Inventory mobile booking review prototype route/section.
- [x] Reuse booking molecules and shared form/action atoms.
- [x] Extract organisms as needed:
  - [x] `BookingReviewHeader` (`BookingReviewHero`),
  - [x] `BookingReviewDetails` (`BookingReviewRequestPanel` + `BookingReviewDatePanel` + `BookingReviewNotePanel`),
  - [x] `BookingReviewDecisionPanel` (`BookingReviewDatePanel` + actions),
  - [x] `MobileBookingReviewActions` (page action row).
- [x] Add Storybook stories for pending/default panels and empty queue state. (Approve/decline/submitting variants deferred.)
- [x] Add mobile visual spec target and focused section targets.
- [x] Run focused comparisons and checkpoint route/page comparison.
- [x] Commit: `Compose mobile booking review`.

### Phase 8.8 — Artists and mobile artists

- [ ] Inventory desktop/mobile artists prototype routes.
- [ ] Reuse `ArtistCard`, `ArtistRosterRow`, status/list molecules where applicable.
- [ ] Extract organisms as needed:
  - [ ] `ArtistRosterPanel`,
  - [ ] `ArtistSearchFilter`,
  - [ ] `MobileArtistList`,
  - [ ] `ArtistStatsStrip`.
- [ ] Add Storybook stories for roster/list/empty/search states.
- [ ] Add desktop/mobile visual spec targets and section targets.
- [ ] Run focused comparisons and full-page checkpoints.
- [ ] Commit: `Compose responsive artists page`.

### Phase 8.9 — Artist detail mobile route/section

- [ ] Inventory mobile artist detail prototype route/section.
- [ ] Reuse `ArtistCard`, show/date/status molecules where applicable.
- [ ] Extract organisms as needed:
  - [ ] `ArtistDetailHeader`,
  - [ ] `ArtistShowHistory`,
  - [ ] `ArtistNotesPanel`,
  - [ ] `ArtistContactLinks`.
- [ ] Add Storybook stories for no-history/long-notes/link variants.
- [ ] Add mobile visual spec target and focused section targets.
- [ ] Run focused comparisons and checkpoint route/page comparison.
- [ ] Commit: `Compose mobile artist detail`.

### Phase 8.10 — Attendance / post-show mobile route/section

- [ ] Inventory desktop attendance and mobile post-show prototype routes/sections.
- [ ] Reuse `AttendanceStat`, show/date/status molecules where applicable.
- [ ] Extract organisms as needed:
  - [ ] `AttendanceSummaryMetrics`,
  - [ ] `AttendancePastShowsPanel`,
  - [ ] `PostShowLogList`,
  - [ ] `PostShowLogForm`.
- [ ] Add Storybook stories for logged/needs-log/empty/form states.
- [ ] Add desktop/mobile visual spec targets and section targets.
- [ ] Run focused comparisons and full-page checkpoints.
- [ ] Commit: `Compose responsive attendance page`.

### Phase 8.11 — Audit log

- [ ] Inventory audit log prototype route.
- [ ] Reuse `ActivityFeedItem`, `StatusDot`, filters/actions where applicable.
- [ ] Extract organisms as needed:
  - [ ] `AuditLogFilters`,
  - [ ] `AuditLogTimeline`,
  - [ ] `AuditLogDetailPanel` if present in prototype.
- [ ] Add Storybook stories for mixed event types, bot-only, empty, long entries.
- [ ] Add visual spec targets and focused section targets.
- [ ] Run focused comparisons and page checkpoint.
- [ ] Commit: `Compose audit log page`.

### Phase 8.12 — Discord

- [ ] Inventory Discord prototype route.
- [ ] Reuse `DiscordChannelRow`, settings/status atoms, button/input components.
- [ ] Extract organisms as needed:
  - [ ] `DiscordStatusPanel`,
  - [ ] `DiscordChannelMappingPanel`,
  - [ ] `DiscordBotHealthMetrics`,
  - [ ] `DiscordReconnectPanel`.
- [ ] Add Storybook stories for connected/disconnected/disabled channel states.
- [ ] Add visual spec targets and focused section targets.
- [ ] Run focused comparisons and page checkpoint.
- [ ] Commit: `Compose discord settings page`.

### Phase 8.13 — Settings and mobile settings

- [ ] Inventory desktop/mobile settings prototype routes.
- [ ] Reuse `SettingsToggleRow`, `DiscordChannelRow`, form fields/buttons.
- [ ] Extract organisms as needed:
  - [ ] `SettingsSpaceInfoPanel`,
  - [ ] `SettingsAutomationPanel`,
  - [ ] `SettingsStaffPanel`,
  - [ ] `MobileSettingsList`.
- [ ] Add Storybook stories for enabled/disabled/readonly/editing states.
- [ ] Add desktop/mobile visual spec targets and section targets.
- [ ] Run focused comparisons and full-page checkpoints.
- [ ] Commit: `Compose responsive settings page`.

### Phase 8.14 — New show modal

- [ ] Inventory desktop/mobile new show modal prototype state.
- [ ] Reuse form fields/buttons/date/show atoms and molecules.
- [ ] Extract organisms as needed:
  - [ ] `NewShowModal`,
  - [ ] `NewShowForm`,
  - [ ] `NewShowModalFooter`,
  - [ ] mobile sheet variant if prototype requires it.
- [ ] Add Storybook stories for empty, filled, validation error, submitting, mobile sheet.
- [ ] Add visual spec target(s) for modal panel/header/body/footer.
- [ ] Run focused modal comparisons and page/modal checkpoint.
- [ ] Commit: `Compose new show modal`.

---

## Phase 9 — Visual suite hardening

Goal: make the visual-diff workflow durable.

- [ ] Create `prototype-design/visual-diff/userland/specs/app.components.visual.yml`.
- [ ] Create `prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml`.
- [ ] Create `prototype-design/visual-diff/userland/specs/app.pages.mobile.visual.yml`.
- [ ] Run `prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py` after spec edits.
- [ ] Add scripts:
  - [ ] `run-compare-spec-app-pages-desktop.sh`
  - [ ] `run-compare-spec-app-pages-mobile.sh`
  - [ ] `smoke-compare-spec-app-dashboard.sh`
  - [ ] `diagnose-app-dashboard-sections.sh`
- [ ] Keep scripts in ticket `scripts/` until stable.
- [ ] Promote stable scripts only after at least two successful runs.
- [ ] Add/check drift prevention for YAML ↔ JS mirrors.

---

## Phase 10 — Playbook and handoff

Goal: convert implementation lessons into reusable documentation.

- [ ] Update `docs/playbooks/05-bottom-up-component-visual-parity.md` with pyxis-app workflow.
- [ ] Consider adding `docs/playbooks/06-pyxis-app-react-visual-workflow.md` after the first page is validated.
- [ ] Record all pitfalls in the diary.
- [ ] Write final postmortem/handoff.
- [ ] Upload final bundle to reMarkable.

---

## Milestone commits

Use commit messages like:

```text
Scaffold pyxis app package
Add pyxis app data contracts and API slice
Add pyxis app selector contract map
Add first pyxis app component slice
Compose responsive dashboard page
Add pyxis app visual suite specs
Document pyxis app visual workflow
```

Do not commit:

- active generated runtime output under `prototype-design/visual-comparisons/`,
- half-finished source changes without an experiment patch or diary note,
- new native `*.css-visual-diff.yml` configs.

## Current ticket status

- [x] Ticket created.
- [x] Initial end-to-end guide written.
- [x] Source inventory generated.
- [x] Guide uploaded to reMarkable once.
- [x] Guide corrected to state that mobile is the responsive version of the main app.
- [x] Detailed intern task plan written.
- [x] Detailed intern playbook written.
- [x] Updated intern handoff bundle uploaded to reMarkable.
- [x] Updated docs committed.
