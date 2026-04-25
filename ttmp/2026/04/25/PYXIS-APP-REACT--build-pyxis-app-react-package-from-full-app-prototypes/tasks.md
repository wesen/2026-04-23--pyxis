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

## Phase 7 — First responsive page: Dashboard

Goal: compose the first full page once the core components exist.

### Desktop Dashboard

- [x] Create/extend Dashboard page composition in `Pages.tsx` / `DashboardOverview`.
- [x] Compose from `AppShell`, `DashboardOverview`, metric cards, hero, quick actions, attention, upcoming, and activity panels.
- [x] Add `data-page="dashboard"`.
- [ ] Add sections:
  - [x] `dashboard-summary`
  - [x] `dashboard-metrics`
  - [x] `dashboard-upcoming`
  - [x] `dashboard-activity`

### Mobile Dashboard viewport

- [x] Same Dashboard composition responds to 390px viewport.
- [x] Use CSS/layout variants, not `MobileDashboard.tsx`.
- [x] Use `prototype-design/standalone/mobile/home.html` as the mobile baseline; final checkpoint is tune-required, not accepted.

### Storybook

- [x] Add `DashboardDesktop` story.
- [x] Add `DashboardMobile` story using the same page route/component.

### Visual specs

- [x] Add dashboard target to `app.pages.desktop.visual.yml`.
- [x] Add dashboard target to `app.pages.mobile.visual.yml`.
- [x] Run both focused comparisons (desktop and mobile full-page checkpoints).
- [x] Preserve artifacts under numbered folders.

### Deliverable

- [ ] Commit: `Compose responsive dashboard page`.

---

## Phase 8 — Remaining responsive pages

Repeat the Dashboard pattern for:

- [ ] Login / mobile login
- [ ] Setup
- [ ] Shows / mobile shows
- [ ] Show detail / mobile show detail
- [ ] Calendar / mobile calendar
- [ ] Bookings / mobile bookings
- [ ] Booking review mobile route/section
- [ ] Artists / mobile artists
- [ ] Artist detail mobile route/section
- [ ] Attendance / post-show mobile route/section
- [ ] Audit log
- [ ] Discord
- [ ] Settings / mobile settings
- [ ] New show modal

For each page:

- [ ] desktop story,
- [ ] mobile story if mobile baseline exists,
- [ ] desktop visual spec target,
- [ ] mobile visual spec target if mobile baseline exists,
- [ ] focused visual run,
- [ ] raw crop inspection,
- [ ] diary entry,
- [ ] artifact history folder,
- [ ] commit when coherent.

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
