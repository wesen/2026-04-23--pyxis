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

- [ ] Keep a detailed diary in `reference/01-diary.md` for every meaningful step.
- [ ] Commit at coherent milestones, not after every tiny edit.
- [ ] Use live Storybook in tmux, not static Storybook builds, for the normal edit/compare loop.
- [ ] Keep generated runtime artifacts out of active source paths.
- [ ] Preserve useful intermediate visual artifacts under numbered ticket folders such as `various/02-first-dashboard-run/`.
- [ ] Put one-off scripts in this ticket's `scripts/` or `experiments/` folders; promote only stable reusable scripts.
- [ ] Do not create new active native `*.css-visual-diff.yml` configs.
- [ ] Use JS/YAML visual suite specs and `css-visual-diff` JS userland.
- [ ] Prefer one page/component implementation that responds to viewport size over parallel `Mobile*Page` implementations.

---

## Phase 0 — Orientation and environment

Goal: understand the existing system before writing new code.

### Read first

- [ ] Read `design/01-pyxis-app-react-end-to-end-workflow-guide.md`.
- [ ] Read `playbooks/01-pyxis-app-react-intern-playbook.md`.
- [ ] Read `various/01-source-inventory.md`.
- [ ] Read `docs/component-system-and-public-site-components.md`.
- [ ] Read `docs/playbooks/05-bottom-up-component-visual-parity.md`.
- [ ] Read `prototype-design/visual-diff/userland/README.md`.

### Confirm tools and servers

- [ ] Confirm repo root:

  ```bash
  pwd
  # /home/manuel/code/wesen/2026-04-23--pyxis
  ```

- [ ] Confirm package manager from `web/`:

  ```bash
  cd web
  pnpm --version
  ```

- [ ] Confirm `css-visual-diff` works:

  ```bash
  css-visual-diff --help >/tmp/cssvd-help.txt
  ```

- [ ] Confirm `remarquee` works if you need to upload docs:

  ```bash
  remarquee status
  ```

### Start or confirm prototype server

- [ ] Start prototype server if it is not already running:

  ```bash
  python3 -m http.server 7070 --directory prototype-design
  ```

- [ ] Open/check:

  ```text
  http://localhost:7070/standalone/full-app/index.html
  http://localhost:7070/standalone/mobile/index.html
  ```

### Deliverable

- [ ] Diary entry: what you read, what servers/tools are available, and any setup problems.

---

## Phase 1 — Prototype route and section inventory

Goal: map the desktop and mobile prototype baselines to one responsive route model.

### Desktop prototype pages

Inventory these pages:

- [ ] `prototype-design/standalone/full-app/login.html`
- [ ] `prototype-design/standalone/full-app/setup.html`
- [ ] `prototype-design/standalone/full-app/dashboard.html`
- [ ] `prototype-design/standalone/full-app/shows.html`
- [ ] `prototype-design/standalone/full-app/calendar.html`
- [ ] `prototype-design/standalone/full-app/bookings.html`
- [ ] `prototype-design/standalone/full-app/modal.html`
- [ ] `prototype-design/standalone/full-app/artists.html`
- [ ] `prototype-design/standalone/full-app/attendance.html`
- [ ] `prototype-design/standalone/full-app/log.html`
- [ ] `prototype-design/standalone/full-app/discord.html`
- [ ] `prototype-design/standalone/full-app/settings.html`

### Mobile prototype baselines

Map these to the same app routes/pages where possible:

- [ ] `prototype-design/standalone/mobile/login.html` → `LoginPage`
- [ ] `prototype-design/standalone/mobile/home.html` → `DashboardPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/shows.html` → `ShowsPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/show-detail.html` → `ShowDetailPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/calendar.html` → `CalendarPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/bookings.html` → `BookingsPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/booking-review.html` → `BookingReviewPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/artists.html` → `ArtistsPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/artist-detail.html` → `ArtistDetailPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/post-show.html` → `PostShowPage` mobile viewport
- [ ] `prototype-design/standalone/mobile/settings.html` → `SettingsPage` mobile viewport

### Section inventory

For each route/page:

- [ ] Identify root page selector candidate, e.g. `data-page="dashboard"`.
- [ ] Identify important sections, e.g. `dashboard-summary`, `dashboard-activity`, `dashboard-upcoming`.
- [ ] Identify repeated UI shapes that should become components.
- [ ] Note desktop/mobile layout differences.
- [ ] Decide whether a mobile difference is CSS/responsive layout or a true mobile-only interaction.

### Deliverables

- [ ] Create `various/02-route-section-inventory.md`.
- [ ] Update diary with key route mapping decisions.
- [ ] If prototype selectors are missing, create a small implementation task list for adding them.

---

## Phase 2 — Scaffold `web/packages/pyxis-app`

Goal: create a buildable package with Vite, Storybook, RTK Query, and routing.

### Package files

- [ ] Create `web/packages/pyxis-app/package.json`.
- [ ] Create `web/packages/pyxis-app/tsconfig.json`.
- [ ] Create `web/packages/pyxis-app/tsconfig.build.json` if needed.
- [ ] Create `web/packages/pyxis-app/vite.config.ts`.
- [ ] Create `web/packages/pyxis-app/index.html`.
- [ ] Create `web/packages/pyxis-app/public/mockServiceWorker.js` or initialize MSW as needed.

### Source skeleton

- [ ] Create `src/main.tsx`.
- [ ] Create `src/App.tsx`.
- [ ] Create `src/store.ts`.
- [ ] Create `src/styles/global.css`.
- [ ] Create `src/styles/app-tokens.css` if app-specific aliases are needed.
- [ ] Create `src/api/endpoints.ts`.
- [ ] Create `src/api/appApi.ts`.
- [ ] Create `src/api/hooks.ts`.
- [ ] Create `src/api/mockHandlers.ts`.
- [ ] Create `src/api/errors.ts`.

### Storybook skeleton

- [ ] Create `.storybook/main.ts`.
- [ ] Create `.storybook/preview.tsx`.
- [ ] Alias `pyxis-components` to source in Storybook Vite config.
- [ ] Add MSW loader/decorator.
- [ ] Add Redux Provider decorator with `makeStore()`.
- [ ] Add viewports:
  - desktop: `1240px × 900px` or prototype-specific height,
  - mobile: `390px × 844px`.

### Validation

- [ ] Run:

  ```bash
  cd web
  pnpm --filter pyxis-app typecheck
  ```

- [ ] Start Storybook:

  ```bash
  tmux new-session -d -s pyxis-app-storybook \
    'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook'
  ```

- [ ] Confirm Storybook at:

  ```text
  http://localhost:6008
  ```

### Deliverable

- [ ] Commit: `Scaffold pyxis app package`.

---

## Phase 3 — App data contracts and RTK Query

Goal: typed data first, then components.

### `pyxis-types`

- [ ] Add `web/packages/pyxis-types/src/app.ts`.
- [ ] Export app types from `web/packages/pyxis-types/src/index.ts`.
- [ ] Define at least:
  - [ ] `AppShow`
  - [ ] `BookingRequest`
  - [ ] `ArtistProfile`
  - [ ] `CalendarEvent`
  - [ ] `AttendanceEntry`
  - [ ] `AuditLogEntry`
  - [ ] `DiscordChannelMapping`
  - [ ] `SpaceSettings`
  - [ ] `AuthSession`

### App API slice

- [ ] Add RTK Query endpoints for:
  - [ ] session
  - [ ] shows
  - [ ] show detail
  - [ ] bookings
  - [ ] booking detail/review
  - [ ] artists
  - [ ] artist detail
  - [ ] calendar
  - [ ] attendance/post-show
  - [ ] audit log
  - [ ] discord mappings
  - [ ] settings

### Mock data

- [ ] Derive seed data from `prototype-design/lib/data.js`.
- [ ] Keep mock data count close to prototype pages so visual diffs are meaningful.
- [ ] Add MSW handlers with wildcard URL patterns, e.g. `*/api/app/shows`.

### Validation

- [ ] Run:

  ```bash
  cd web
  pnpm --filter pyxis-types typecheck
  pnpm --filter pyxis-app typecheck
  ```

### Deliverable

- [ ] Commit: `Add pyxis app data contracts and API slice`.

---

## Phase 4 — Selector contract for prototypes and React

Goal: make visual comparisons semantically meaningful before tuning CSS.

### Prototype selectors

For each standalone prototype page:

- [ ] Add or verify `data-page` on the main page root.
- [ ] Add or verify `data-section` on important sections.
- [ ] Add `data-pyxis-component` / `data-pyxis-part` to prototype component fixtures when useful.

### React selectors

For each React component/page:

- [ ] Add `data-pyxis-component` / `data-pyxis-part` to reusable components.
- [ ] Add `data-page` to page roots.
- [ ] Add `data-section` to important page sections.
- [ ] Keep desktop and mobile variants using the same page/section names where possible.

### Deliverable

- [ ] Create `various/03-selector-contract-map.md` mapping prototype selectors to React selectors.
- [ ] Commit selector-only changes separately if they touch prototype source.

---

## Phase 5 — First bottom-up component slice

Goal: prove the component workflow with one small repeated component.

Recommended first components:

- [ ] `MetricCard`
- [ ] `ActivityFeedItem`
- [ ] `StatusDot`
- [ ] `DateChip`

For the chosen component:

- [ ] Locate prototype source and visual examples.
- [ ] Decide whether it belongs in `pyxis-components` or `pyxis-app`.
- [ ] Create `Component.tsx`.
- [ ] Create `Component.css`.
- [ ] Add part selectors.
- [ ] Add Storybook stories:
  - [ ] default,
  - [ ] compact/mobile viewport if relevant,
  - [ ] themed/dark if relevant.
- [ ] Add visual spec target to `app.components.visual.yml`.
- [ ] Run focused `compare-spec` for that component.
- [ ] Inspect `left_region.png` and `right_region.png` first.
- [ ] Tune until close enough.
- [ ] Preserve useful artifacts under `various/04-first-component-run/`.

### Deliverable

- [ ] Commit: `Add first pyxis app component slice`.

---

## Phase 6 — Component library expansion

Goal: build enough components to compose the first page without raw div soup.

### Staff-app molecules

- [ ] `MetricCard`
- [ ] `TodayShowCard`
- [ ] `ActivityFeedItem`
- [ ] `ShowTableRow`
- [ ] `BookingQueueRow` / `BookingCard`
- [ ] `ArtistRosterRow` / `ArtistCard`
- [ ] `CalendarEventChip`
- [ ] `AttendanceStat`
- [ ] `DiscordChannelRow`
- [ ] `SettingsToggleRow`

### Staff-app organisms

- [ ] `AppShell`
- [ ] `AppSidebar`
- [ ] `AppTopBar`
- [ ] `AppBottomNav` or responsive mobile shell navigation
- [ ] `DashboardOverview`
- [ ] `ShowsTable` / responsive show list
- [ ] `BookingQueue` / responsive booking cards
- [ ] `CalendarMonth` / responsive agenda
- [ ] `ArtistRoster` / responsive artist list
- [ ] `AttendancePanel`
- [ ] `AuditLogPanel`
- [ ] `DiscordMappingPanel`
- [ ] `SettingsPanel`
- [ ] `NewShowModal`

For each component:

- [ ] Story exists.
- [ ] Selectors exist.
- [ ] CSS is in CSS files, not static inline styles.
- [ ] Tokens/variables are used where reasonable.
- [ ] Visual spec target exists if component is important enough for comparison.
- [ ] Diary notes any accepted differences.

### Deliverable

- [ ] Commit in batches by component family, e.g. dashboard, bookings, shell.

---

## Phase 7 — First responsive page: Dashboard

Goal: compose the first full page once the core components exist.

### Desktop Dashboard

- [ ] Create `Dashboard.tsx` page.
- [ ] Compose from `AppShell`, `DashboardOverview`, metric cards, activity panels.
- [ ] Add `data-page="dashboard"`.
- [ ] Add sections:
  - [ ] `dashboard-summary`
  - [ ] `dashboard-metrics`
  - [ ] `dashboard-upcoming`
  - [ ] `dashboard-activity`

### Mobile Dashboard viewport

- [ ] Same `Dashboard.tsx` page responds to 390px viewport.
- [ ] Use CSS/layout variants, not `MobileDashboard.tsx`, unless unavoidable.
- [ ] Match `prototype-design/standalone/mobile/home.html` as the mobile baseline.

### Storybook

- [ ] Add `DashboardDesktop` story.
- [ ] Add `DashboardMobile` story using the same page route/component.

### Visual specs

- [ ] Add dashboard target to `app.pages.desktop.visual.yml`.
- [ ] Add dashboard target to `app.pages.mobile.visual.yml`.
- [ ] Run both focused comparisons.
- [ ] Preserve artifacts under numbered folders.

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
- [ ] Updated docs committed.
