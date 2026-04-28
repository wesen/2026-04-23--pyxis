---
Title: pyxis-app visual and functional audit diary
Ticket: PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT
Status: active
Topics:
  - pyxis-app
  - css-visual-diff
  - staff-app
DocType: reference
Intent: diary
Summary: Chronological diary for the staff-app visual tuning and functional UX audit setup.
LastUpdated: 2026-04-27T23:30:00-04:00
---

# Diary

## Step 1: Create the ticket and recover prior visual-diff knowledge

Created ticket workspace:

```text
ttmp/2026/04/27/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT--tune-pyxis-app-visual-parity-and-functional-ux-coverage
```

The goal is to repeat the successful public-site visual tuning process for `pyxis-app`, but expand it into a functional UX audit. The audit must answer three questions for each staff page:

1. What visual target should be compared first: page, section, organism, or molecule?
2. Which buttons/actions are wired, partially wired, stubbed, or blocked by missing backend support?
3. Which UX designs are missing: modals, empty states, confirmation states, loading/saving states, toasts, destructive confirmations, or navigation states?

Docs read:

```text
docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
docs/playbooks/10-css-visual-diff-verb-operator-guide.md
ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/reference/04-component-organization-diary.md
ttmp/2026/04/27/PYXIS-PUBLIC-VISUAL-MOBILE-TUNING--tune-public-site-visual-parity-across-vite-storybook-prototype-and-mobile/reference/01-visual-tuning-diary.md
```

Key recovered rule: compare the smallest useful region, inspect `diff_only.png` first, then `right_region.png`, then `left_region.png`. Use broad page sweeps only after the smaller component/section target is stable.

## Step 2: Add read-only inventory script

Added:

```text
scripts/01-inventory-app-surfaces.py
```

Invocation:

```bash
python3 scripts/01-inventory-app-surfaces.py \
  --output sources/01-app-surface-inventory.json
```

Result:

```text
routes: 14
page visual spec targets: 6
component visual spec targets: 15
action lines: 61
server routes: 43
```

This script is intentionally read-only. It gathers routes, Storybook page stories, visual specs, frontend endpoint constants, server routes, and suspicious action lines so a new intern can start from a map rather than grep from scratch.

## Step 3: Add focused comparison wrapper

Added:

```text
scripts/02-compare-app-target.sh
```

Example use:

```bash
SPEC=pages PAGE=dashboard SECTION=topbar OUT=/tmp/pyxis-app-dashboard-topbar \
  scripts/02-compare-app-target.sh

SPEC=components PAGE=app-sidebar OUT=/tmp/pyxis-app-sidebar \
  scripts/02-compare-app-target.sh
```

The script delegates to `css-visual-diff verbs pyxis pages compare-spec` with an explicit app spec. This avoids the known trap where default css-visual-diff targets are public-page oriented and app targets like `dashboard` are unknown unless the app YAML spec is passed explicitly.

## Step 4: Initial code reading findings

Important source files read during the initial audit:

```text
web/packages/pyxis-app/src/App.tsx
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/endpoints.ts
web/packages/pyxis-app/src/pages/*/Page.tsx
pkg/server/server.go
prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
prototype-design/visual-diff/userland/specs/app.components.visual.yml
```

Initial findings:

- The app has more React routes than visual page-spec coverage. `app.pages.desktop.visual.yml` covers Dashboard, Login, Setup, Shows, Calendar, and Bookings, but not Show Detail, Booking Review, Artists, Attendance, Audit Log, Discord, Settings, or Modal Showcase.
- Many staff endpoints already exist in the Go backend and RTK Query layer.
- Several visible actions are still UX stubs or incomplete flows, especially filter/search buttons, duplicate show, Discord settings/mapping, setup navigation, and several topbar buttons.
- Destructive actions such as archive/cancel/decline can call the backend, but they lack explicit confirmation UX.
- Calendar create actions are wired, but currently create fixed sample dates instead of opening a hold/block-date form.

## Step 5: Upload implementation guide to reMarkable

Bundled and uploaded the initial guide, task list, and diary to reMarkable.

Dry run:

```bash
remarquee upload bundle \
  design/01-pyxis-app-visual-functional-audit-implementation-guide.md \
  tasks.md \
  reference/01-investigation-diary.md \
  --name "PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT implementation guide" \
  --remote-dir "/ai/2026/04/27/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT" \
  --toc-depth 2 \
  --dry-run
```

Upload:

```bash
remarquee upload bundle \
  design/01-pyxis-app-visual-functional-audit-implementation-guide.md \
  tasks.md \
  reference/01-investigation-diary.md \
  --name "PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT implementation guide" \
  --remote-dir "/ai/2026/04/27/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT" \
  --toc-depth 2
```

Verified remote listing:

```text
/ai/2026/04/27/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT/PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT implementation guide
```

## Step 6: Run shell baseline comparisons

Started/verified the required visual servers:

```text
prototype static: http://localhost:7070
pyxis-app Storybook: http://localhost:6008
staff Vite/backend via make dev
```

Commands used:

```bash
make dev
python3 -m http.server 7070 --directory prototype-design
cd web && pnpm --filter pyxis-app storybook --host 0.0.0.0 --port 6008
```

### Initial shell comparison problem

The first attempt found stale component-spec assumptions:

1. `app-sidebar` used a `220px` viewport. At that width the React sidebar is hidden by the mobile media query, so the selector did not become visible.
2. `app-mobile-bottom-nav` pointed at `/standalone/full-app/dashboard.html` and selected `.app-bottom-nav`, but the prototype mobile tab bar lives in the mobile prototype, not the full desktop app prototype.

Fixes:

```text
prototype-design/visual-diff/userland/specs/app.components.visual.yml
prototype-design/screens/mobile.jsx
```

Changes:

- `app-sidebar` component target now uses an `800x760` viewport while still cropping the sidebar element itself.
- `app-mobile-bottom-nav` now points to `/standalone/mobile/home.html`.
- The prototype `MTabBar` root now has `data-section="app-mobile-bottom-nav"` so css-visual-diff can select it without brittle structural selectors.

### Baseline results

Sidebar:

```bash
SPEC=components PAGE=app-sidebar OUT=/tmp/pyxis-app-audit-app-sidebar \
  scripts/02-compare-app-target.sh
```

Result:

```text
app-sidebar / component: review 6.412679425837322%
```

Artifacts:

```text
/tmp/pyxis-app-audit-app-sidebar/app-sidebar/artifacts/component/diff_only.png
/tmp/pyxis-app-audit-app-sidebar/app-sidebar/artifacts/component/right_region.png
/tmp/pyxis-app-audit-app-sidebar/app-sidebar/artifacts/component/left_region.png
/tmp/pyxis-app-audit-app-sidebar/app-sidebar/artifacts/component/compare.json
```

Observation: the React sidebar is broadly close. Remaining diffs are mostly icon glyphs/weights, active row color/bounds, duplicated text-antialias pixels, and footer/avatar details.

Topbar:

```bash
SPEC=components PAGE=app-topbar-dashboard OUT=/tmp/pyxis-app-audit-app-topbar-dashboard \
  scripts/02-compare-app-target.sh
```

Result:

```text
app-topbar-dashboard / component: accepted 0.9135472370766489%
```

Artifacts:

```text
/tmp/pyxis-app-audit-app-topbar-dashboard/app-topbar-dashboard/artifacts/component/diff_only.png
/tmp/pyxis-app-audit-app-topbar-dashboard/app-topbar-dashboard/artifacts/component/right_region.png
/tmp/pyxis-app-audit-app-topbar-dashboard/app-topbar-dashboard/artifacts/component/left_region.png
/tmp/pyxis-app-audit-app-topbar-dashboard/app-topbar-dashboard/artifacts/component/compare.json
```

Observation: this remains accepted from the earlier app tuning work.

Mobile bottom nav:

```bash
SPEC=components PAGE=app-mobile-bottom-nav OUT=/tmp/pyxis-app-audit-app-mobile-bottom-nav \
  scripts/02-compare-app-target.sh
```

Result:

```text
app-mobile-bottom-nav / component: review 8.397435897435896%
```

Artifacts:

```text
/tmp/pyxis-app-audit-app-mobile-bottom-nav/app-mobile-bottom-nav/artifacts/component/diff_only.png
/tmp/pyxis-app-audit-app-mobile-bottom-nav/app-mobile-bottom-nav/artifacts/component/right_region.png
/tmp/pyxis-app-audit-app-mobile-bottom-nav/app-mobile-bottom-nav/artifacts/component/left_region.png
/tmp/pyxis-app-audit-app-mobile-bottom-nav/app-mobile-bottom-nav/artifacts/component/compare.json
```

Observation: the React mobile bottom nav is text-only, while the prototype tab bar includes icons and a Bookings badge. This is a real design gap, not just spacing drift.

### Next visual priority

The topbar can be treated as stable. Next work should either:

1. tune sidebar details while it is still a small isolated component, or
2. decide/design whether the React mobile bottom nav should include prototype-style icons and the booking count badge.
