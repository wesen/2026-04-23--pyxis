---
Title: Pyxis app React diary
Ticket: PYXIS-APP-REACT
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - pyxis
    - rtk-query
DocType: reference
Intent: diary
Owners: []
RelatedFiles:
    - Path: docs/playbooks/05-bottom-up-component-visual-parity.md
      Note: Central playbook pointer to pyxis-app visual loop (commit d7f3692199b72a4933a5389c090c87230f753f89)
    - Path: prototype-design/lib/components.jsx
      Note: Prototype Stat/MetricCard selector instrumentation (commit bb41b0c4abad20af5a24a4aa16de8fc837122cda)
    - Path: prototype-design/screens/shows-bookings.jsx
      Note: Prototype Bookings section hooks for visual targeting (commit caeefa4)
    - Path: prototype-design/visual-diff/userland/lib/compare-region.js
      Note: Threaded section filter through compare-spec target execution
    - Path: prototype-design/visual-diff/userland/lib/styles.js
      Note: Expanded inspect presets for typography/layout debugging (commit ed55e40)
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
      Note: |-
        Initial pyxis-app component visual suite
        Focused component visual targets for Shows panels (commits 4020ea8
    - Path: prototype-design/visual-diff/userland/verbs/pyxis-pages.js
      Note: |-
        Added compare-spec --section and --summary operator output (commit 666db83420d99c6d38b5425187af0763e0c8ede9)
        Validated nested inspect-spec workflow (commit ed55e40)
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/playbooks/02-pyxis-app-css-visual-improvement-loop.md
      Note: |-
        Runbook for compact-output visual loop and stop-when-close rule
        Completed Phase 6C runbook with cohesive-theme guidance
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/02-inventory-prototype-routes.mjs
      Note: Ticket-local route inventory script
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh
      Note: Ticket-local focused visual comparison script
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh
      Note: Focused desktop/mobile dashboard page visual smoke script
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/left_region.png
      Note: Final prototype individual crop inspected with read
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/right_region.png
      Note: Final React individual crop inspected with read
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/06-css-loop-dashboard-metrics/run-08-final/dashboard/artifacts/metrics/left_region.png
      Note: Final dashboard metrics prototype crop inspected with read
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/06-css-loop-dashboard-metrics/run-08-final/dashboard/artifacts/metrics/right_region.png
      Note: Final dashboard metrics React crop inspected with read
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/right_region.png
      Note: Final inspected React crop for dashboard-upcoming review-band result (commit 7510483)
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/right_region.png
      Note: Final inspected React crop for dashboard-quick-actions review-band result (commit 12cc17c)
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/topbar/dashboard/artifacts/topbar/right_region.png
      Note: Final topbar crop evidence (commit 80661fc)
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/right_region.png
      Note: Final inspected Hero crop for current WIP checkpoint (commit ed55e40)
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-07-title-typography/dashboard/artifacts/hero/right_region.png
      Note: Evidence crop for title typography stop point (commit b2fd3dc)
    - Path: web/packages/pyxis-app/src/App.tsx
      Note: New responsive app route package scaffold (commit 05b60dad9ef797b0ca29045e14c6218fc9955353)
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query app API slice and hooks
    - Path: web/packages/pyxis-app/src/components/atoms/DateChip.tsx
      Note: Inline date chip variant for dashboard table rows (commit 7510483)
    - Path: web/packages/pyxis-app/src/components/atoms/StatusDot.css
      Note: Centralized status colors/rings through CSS variables
    - Path: web/packages/pyxis-app/src/components/molecules/BookingCard.tsx
      Note: Pending booking card and processed row shape tuned for Bookings organisms (commit caeefa4)
    - Path: web/packages/pyxis-app/src/components/molecules/MetricCard.css
      Note: React MetricCard CSS tuned through Phase 6A visual loop (commit 39468164c2611f748a2b2cdfdad34dd567d6beee)
    - Path: web/packages/pyxis-app/src/components/molecules/Rows.css
      Note: |-
        Replaced local surface/status values with app tokens
        Shows table typography tokens and row layout tuning (commits b1d3c0b
    - Path: web/packages/pyxis-app/src/components/molecules/ShowTableRow.tsx
      Note: |-
        Dashboard show row variant reusing DateChip and StatusDot (commit 7510483)
        Shows table row structure and archived variant matched to prototype columns (commits 4020ea8
    - Path: web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx
      Note: |-
        Dashboard quick action button icon/full-width reuse (commit 12cc17c)
        Hero subelement hooks and WIP tuning (commit ed55e40)
        Metrics and attention organism extraction (commit b1180ae)
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.css
      Note: |-
        Responsive dashboard layout and mobile-specific ordering
        Dashboard side-column and quick-actions panel layout tuning (commit 12cc17c)
        Hero title typography checkpoint (commit b2fd3dc)
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.tsx
      Note: |-
        Initial Phase 5-6 staff app organisms and page composition components
        Dashboard hero
        DashboardUpcomingPanel extraction and ShowsTable dashboard variant (commit 7510483)
        DashboardQuickActionsPanel extraction (commit 12cc17c)
        Attention panel organism wrapper and page reuse (commit b1180ae)
    - Path: web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx
      Note: Bookings queue and processed organism composition (commit caeefa4)
    - Path: web/packages/pyxis-app/src/components/organisms/ShowsSections.tsx
      Note: Shows organisms extracted and reused by the Shows page (commits 4020ea8
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.css
      Note: |-
        Replaced local dark-surface colors/shadows/radii with app tokens
        Light desktop sidebar and static mobile bottom nav
        Dashboard shell/header visual tuning (commit 80661fc)
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.tsx
      Note: Dashboard shell/header organism extraction (commit 80661fc)
    - Path: web/packages/pyxis-app/src/styles/app-tokens.css
      Note: |-
        Expanded cohesive app theme variables before Phase 7 (commit fba5369)
        Whiter app canvas tokens (commit 80661fc)
    - Path: web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx
      Note: |-
        Upcoming panel desktop/mobile/empty/long-name stories (commit 7510483)
        QuickActionsPanel and no-pending Storybook states (commit 12cc17c)
    - Path: web/packages/pyxis-app/stories/BookingsOrganisms.stories.tsx
      Note: Direct Bookings organism story widths for focused visual targets (commit caeefa4)
    - Path: web/packages/pyxis-app/stories/DashboardAttentionPanel.stories.tsx
      Note: Direct AttentionPanel organism story target (commit b1180ae)
    - Path: web/packages/pyxis-app/stories/DashboardHero.stories.tsx
      Note: Direct Hero organism story target (commit b1180ae)
    - Path: web/packages/pyxis-app/stories/DashboardMetricsGrid.stories.tsx
      Note: Direct MetricsGrid organism story target (commit b1180ae)
    - Path: web/packages/pyxis-app/stories/ShowsOrganisms.stories.tsx
      Note: Direct Storybook targets for Shows organisms (commit 4020ea8)
    - Path: web/packages/pyxis-types/src/app.ts
      Note: Shared staff app TypeScript contracts
ExternalSources: []
Summary: Chronological diary for documenting and later implementing the pyxis-app React package workflow from full-app and mobile prototypes.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---















# Pyxis App React Diary

## Step 1: Create the pyxis-app React ticket

The user asked to create a new ticket for the broader Pyxis app React effort before writing the full end-to-end workflow guide.

### Prompt Context

**User prompt (verbatim):** "create a new ticket for pyxis-app react"

**Assistant interpretation:** Open a focused docmgr ticket for transforming the full-app and mobile prototypes into a modular, themable React package with Storybook, RTK Query, and JS-canonical visual-diff feedback.

**Inferred user intent:** Separate the broader application-package workflow/design effort from the narrower public-page tuning ticket.

### Created ticket

```text
PYXIS-APP-REACT
```

Workspace:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/
```

### Scope captured

This ticket will document and later guide:

- creating `web/packages/pyxis-app`,
- decomposing `prototype-design/standalone/full-app/index.html` and `prototype-design/standalone/mobile/index.html`,
- extracting atoms/molecules/organisms for shared and app-specific component systems,
- writing Storybook stories for each component layer,
- creating visual-suite manifests/specs and JS scripting around `css-visual-diff`,
- iterating bottom-up from components to app pages,
- reusing the current Pyxis JS visual-diff userland where possible.


## Step 2: Research current workflow and write the end-to-end guide

I studied the current standalone prototype layout, web package layout, Storybook patterns, RTK Query public-site implementation, playbooks, and JS-canonical css-visual-diff userland. I then wrote the first detailed intern-facing analysis/design/implementation guide for the `pyxis-app` React workflow.

### Prompt Context

**User prompt (verbatim excerpt):** "Ok, before we get too far into the details, we actually want to document our end to end workflow to transform pages into react themable modular rtk-query..."

**Assistant interpretation:** Before implementing the app package, capture a detailed, reusable workflow that explains the system, package architecture, decomposition strategy, Storybook and RTK Query patterns, visual spec reuse, and playbook updates.

**Inferred user intent:** Create a document that a new intern can follow without needing all prior context from the cleanup/public-site work.

### What I wrote

```text
design/01-pyxis-app-react-end-to-end-workflow-guide.md
```

The guide covers:

- current repository system map,
- existing full-app/mobile standalone prototype pages,
- proposed `web/packages/pyxis-app` architecture,
- package manifest sketch,
- component taxonomy,
- selector and theming contracts,
- RTK Query and `pyxis-types` data contracts,
- Storybook architecture on port 6008,
- JS/YAML visual suite reuse,
- proposed app component/page/mobile specs,
- bottom-up implementation phases,
- artifact history rules,
- playbooks that need updates,
- intern runbook,
- diagrams and definition of done.

### Research artifact

I also added a ticket-local inventory script and generated inventory:

```text
scripts/01-inventory-pyxis-app-sources.py
various/01-source-inventory.md
```

### Important observation

The full-app and mobile standalone index pages already exist:

```text
prototype-design/standalone/full-app/index.html
prototype-design/standalone/mobile/index.html
```

So the next implementation phase should validate and enrich those pages with stable selectors rather than recreate them from scratch.

### Reuse decision

The current JS userland can be reused immediately via `compare-spec` with new app specs. A future naming cleanup from `pyxis pages compare-spec` to `pyxis suites compare-spec` would be ergonomic, but not required for implementation.


## Step 3: Upload workflow guide to reMarkable

I uploaded the guide bundle to reMarkable after a successful dry run. The upload included the main workflow guide plus the source inventory so the reviewer can see both the recommended process and the file map behind it.

### Command dry run

```bash
remarquee upload bundle --dry-run \
  design/01-pyxis-app-react-end-to-end-workflow-guide.md \
  various/01-source-inventory.md \
  --name "PYXIS App React Workflow Guide" \
  --remote-dir "/ai/2026/04/25/PYXIS-APP-REACT" \
  --toc-depth 2
```

### Upload

```bash
remarquee upload bundle \
  design/01-pyxis-app-react-end-to-end-workflow-guide.md \
  various/01-source-inventory.md \
  --name "PYXIS App React Workflow Guide" \
  --remote-dir "/ai/2026/04/25/PYXIS-APP-REACT" \
  --toc-depth 2
```

Remote destination:

```text
/ai/2026/04/25/PYXIS-APP-REACT
```

Uploaded document:

```text
PYXIS App React Workflow Guide
```

### Notes

`remarquee` printed a non-fatal remote tree refresh warning, then reported a successful upload. `remarquee cloud ls` showed the uploaded document.


## Step 4: Correct mobile architecture and write intern handoff tasks/playbook

The user clarified that the mobile app should be the responsive version of the main app, not a separate application architecture. I updated the main guide accordingly, rewrote the task list as a detailed intern handoff, wrote a practical intern playbook, related the playbook to key source files, and uploaded a new reMarkable bundle.

### Prompt Context

**User prompt 1 (verbatim):** "i think the mobile app should be the responsive version of the main app, update."

**User prompt 2 (verbatim):** "create a detailed set of tasks in the ticket, so that we can hand this off to our new intern and they don't get lost. Add a precise and detailed playbook explaining all the moving parts and where to look for help and giving clear guidance. Add to ticket and upload to remarkable."

**Assistant interpretation:** Make the responsive architecture explicit, then turn the previous design guide into a concrete intern-ready execution package.

**Inferred user intent:** Prevent the next developer from accidentally creating a parallel mobile app, and give them enough procedural detail to start implementation safely.

### What changed

Updated:

```text
design/01-pyxis-app-react-end-to-end-workflow-guide.md
tasks.md
```

Created:

```text
playbooks/01-pyxis-app-react-intern-playbook.md
```

### Key architecture correction

The guide now says:

```text
One app.
One route tree.
One data layer.
One component system.
Many responsive viewport variants.
```

Mobile prototype pages are now described as viewport baselines for the same routes, for example:

```text
DashboardPage desktop viewport -> standalone/full-app/dashboard.html
DashboardPage mobile viewport  -> standalone/mobile/home.html
```

### Task list scope

The task list now includes detailed phases for:

- orientation and environment,
- route/section inventory,
- `pyxis-app` package scaffold,
- app data contracts and RTK Query,
- selector contract,
- first component slice,
- component library expansion,
- responsive Dashboard page,
- remaining responsive pages,
- visual suite hardening,
- final playbook/handoff.

### Playbook scope

The intern playbook explains:

- repository map,
- where to look for help,
- development environment,
- implementation loop,
- component taxonomy,
- selector contract,
- CSS/theming rules,
- RTK Query rules,
- Storybook rules,
- visual-diff rules,
- diary requirements,
- first recommended implementation path,
- common mistakes,
- definition of done,
- recovery checklist if lost.

### reMarkable upload

Uploaded bundle:

```text
PYXIS App React Intern Handoff
```

Remote:

```text
/ai/2026/04/25/PYXIS-APP-REACT
```

Included:

```text
design/01-pyxis-app-react-end-to-end-workflow-guide.md
tasks.md
playbooks/01-pyxis-app-react-intern-playbook.md
various/01-source-inventory.md
```

Dry-run succeeded first. `remarquee cloud ls` shows both `PYXIS App React Intern Handoff` and the earlier `PYXIS App React Workflow Guide`.

### Validation

`docmgr doctor --ticket PYXIS-APP-REACT --stale-after 30` reports only the known topic-vocabulary warning.

### Commit

```text
60830ec Add pyxis app intern handoff playbook
```

## Step 5: Implement phases 0–6 of the pyxis-app React package

I resumed the ticket from the intern task list and worked through orientation, route inventory, package scaffolding, app data contracts, selector mapping, the first component slice, and the initial staff-app component library. The implementation now has a buildable `web/packages/pyxis-app` package with RTK Query, MSW handlers, Storybook on port 6008, responsive shell components, dashboard/list/configuration components, and initial JS/YAML visual-suite specs.

The package is intentionally responsive rather than split into a separate mobile app. Desktop uses `AppSidebar`; mobile uses `AppBottomNav`; pages and sections keep stable `data-page`, `data-section`, `data-pyxis-component`, and `data-pyxis-part` selectors so later visual parity work can tune by semantic region.

### Prompt Context

**User prompt (verbatim):** "Use docmgr, keep a diary (see sills), commit at appropriate intervals. Any scripts you write for testing should go in a dedicate scripts/ folder in the ticket, with a numerical prefix so we can trace your steps.

Read @ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/tasks.md and get to work."

**Assistant interpretation:** Continue the existing docmgr ticket, follow the task list, document the work chronologically, put investigation scripts in ticket-local numbered script files, and make coherent commits.

**Inferred user intent:** Move from planning/handoff documentation into real implementation while keeping enough trail for review and continuation.

**User prompt (verbatim):** "do phases 0-6, don't stop unless I tell you to or things go really really awry"

**Assistant interpretation:** Complete the orientation through component-library-expansion phases in one sustained pass unless blocked by a serious failure.

**Inferred user intent:** Produce a substantial working scaffold and component base, not just another planning update.

**Commit (code):** 05b60dad9ef797b0ca29045e14c6218fc9955353 — "Scaffold pyxis app package and component library"

### What I did

- Read the task list plus the ticket guide/playbook/source inventory and relevant repository docs.
- Confirmed environment:
  - `pwd` is `/home/manuel/code/wesen/2026-04-23--pyxis`.
  - `pnpm --version` from `web/` is `9.0.0`.
  - `css-visual-diff --help` succeeds.
  - `remarquee status` succeeds.
  - prototype server on `localhost:7070` served both full-app and mobile indexes.
- Added ticket-local investigation script:
  - `scripts/02-inventory-prototype-routes.mjs`
- Generated route DOM snapshot:
  - `various/02-route-section-dom-snapshot.json`
- Wrote route/section inventory:
  - `various/02-route-section-inventory.md`
- Added prototype root `data-page` wrappers to standalone full-app and mobile HTML route files.
- Wrote selector contract map:
  - `various/03-selector-contract-map.md`
- Added staff-app shared types:
  - `web/packages/pyxis-types/src/app.ts`
  - exported them from `web/packages/pyxis-types/src/index.ts`
  - added `./app` package export in `web/packages/pyxis-types/package.json`
- Created `web/packages/pyxis-app` with:
  - Vite/React package files,
  - RTK Query `appApi`, endpoints, mock data, MSW handlers, and Redux store,
  - global/app token CSS,
  - Storybook config and stories,
  - responsive page skeletons.
- Implemented Phase 5/6 component families:
  - atoms: `StatusDot`, `DateChip`,
  - molecules: `MetricCard`, `ActivityFeedItem`, `TodayShowCard`, `ShowTableRow`, `BookingQueueRow`, `BookingCard`, `ArtistRosterRow`, `ArtistCard`, `CalendarEventChip`, `AttendanceStat`, `DiscordChannelRow`, `SettingsToggleRow`,
  - organisms/shell: `AppShell`, `AppSidebar`, `AppTopBar`, `AppBottomNav`, `DashboardOverview`, `ShowsTable`, `BookingQueue`, `CalendarMonth`, `ArtistRoster`, `AttendancePanel`, `AuditLogPanel`, `DiscordMappingPanel`, `SettingsPanel`, `NewShowModal`.
- Added initial visual-suite specs:
  - `prototype-design/visual-diff/userland/specs/app.components.visual.yml`
  - `prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml`
  - `prototype-design/visual-diff/userland/specs/app.pages.mobile.visual.yml`
- Regenerated JS mirrors with `prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py`.
- Started live Storybook in tmux session `pyxis-app-storybook` and confirmed `http://localhost:6008` returns HTTP 200.
- Ran a focused first component visual comparison for `MetricCard` and preserved artifacts under:
  - `various/04-first-component-run/metric-card/`

### Why

- The task list explicitly requires phases 0–6 before page-level tuning.
- A typed data layer and shared components make later route implementations less likely to become raw div soup.
- The visual specs and selectors establish the feedback loop before pixel tuning starts.

### What worked

- `pnpm install` picked up the new workspace package and linked dependencies.
- `pnpm --filter pyxis-types typecheck` passed.
- `pnpm --filter pyxis-app typecheck` passed after dependency linking and one status-tone type fix.
- `pnpm --filter pyxis-app build` passed.
- `pnpm --filter pyxis-app build-storybook` passed.
- Live Storybook started on port 6008.
- The first `compare-spec` run completed and produced a report rather than failing.

### What didn't work

- First `pnpm --filter pyxis-app typecheck` before `pnpm install` failed because the new workspace package had not been linked yet:

```text
Cannot find module 'react-router-dom' or its corresponding type declarations.
Could not find a declaration file for module 'react/jsx-runtime'.
WARN Local package.json exists, but node_modules missing, did you mean to install?
```

- First `pnpm --filter pyxis-app build` failed because I imported a non-existent component CSS file:

```text
Unable to resolve `@import "../../../pyxis-components/src/atoms/Badge/Badge.css"`
[vite:css] [postcss] ENOENT: no such file or directory, open '../../../pyxis-components/src/atoms/Badge/Badge.css'
```

  I removed that import because `Badge` currently has no CSS file in `pyxis-components/src/atoms/Badge/`.

- The first `MetricCard` visual comparison is not meaningful enough to tune yet. It compared the full dashboard prototype root against the isolated React metric card because the prototype does not yet expose component-level selectors:

```text
changedPercent: 21.439622241086585
leftRegion: 1240x760
rightRegion: 192x116
classification: tune-required
```

### What I learned

- The generated standalone prototype pages had almost no stable selectors initially. Root `data-page` selectors are now present in standalone HTML wrappers, but section/component selectors still need a selector-only prototype source pass.
- The new app package should force-add `.storybook` files when committing because `web/.gitignore` ignores `.storybook/` directories by default.
- `tsc -b` can create package-local `tsconfig.tsbuildinfo`; I added `*.tsbuildinfo` to `web/.gitignore` and removed generated build info before staging.

### What was tricky to build

- The main sharp edge was keeping the package scaffold buildable while aliasing workspace source packages. Before `pnpm install`, TypeScript resolved some modules from outside the workspace and produced misleading missing React type errors. Running the workspace install created the expected package links.
- The visual comparison contract is only partially useful until prototype component/section selectors exist. I added root page selectors immediately because they are cheap and safe in standalone wrappers, but left section/component prototype annotation as a separate selector-only follow-up to avoid mixing source-prototype changes with the React implementation.
- Storybook config files live under `.storybook/`, which is ignored by `web/.gitignore`. They need intentional force staging.

### What warrants a second pair of eyes

- Review the initial `pyxis-types/src/app.ts` naming and field shapes before backend/API contracts harden.
- Review whether all Phase 6 components should remain in `pyxis-app` or whether any should be promoted to `pyxis-components` later.
- Review the CSS/responsive decisions before serious visual tuning; these are first-pass structures, not pixel-final implementations.
- Review the prototype root wrapper changes and decide whether selectors should move into the JSX screen sources instead of standalone wrappers.

### What should be done in the future

- Add prototype `data-section` and component selectors in a dedicated selector-only pass.
- Add focused prototype component fixture selectors so `app.components.visual.yml` compares like-for-like crops instead of whole pages.
- Expand page stories and visual specs beyond dashboard after the selector contract is more complete.
- Promote stable visual scripts from ticket-local experiments only after repeated successful runs.

### Code review instructions

- Start with `web/packages/pyxis-types/src/app.ts` for data contracts.
- Then review `web/packages/pyxis-app/src/api/appApi.ts` and `mockData.ts` for endpoint and fixture shape.
- Review components from small to large:
  - `src/components/atoms/`,
  - `src/components/molecules/`,
  - `src/components/organisms/Panels.tsx`,
  - `src/components/shell/AppShell.tsx`,
  - `src/pages/Pages.tsx`.
- Validate with:

```bash
cd web
pnpm --filter pyxis-types typecheck
pnpm --filter pyxis-app typecheck
pnpm --filter pyxis-app build
pnpm --filter pyxis-app build-storybook
```

- For live Storybook:

```bash
tmux capture-pane -pt pyxis-app-storybook -S -80
curl -s -o /tmp/pyxis-app-sb.html -w '%{http_code}\n' http://localhost:6008
```

### Technical details

- First component visual command:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page metric-card \
  --outDir ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/04-first-component-run/metric-card \
  --output json \
  > ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/04-first-component-run/metric-card.json
```

## Step 6: Add hard-gate phases for proving the CSS visual improvement loop

After the user asked whether `css-visual-diff` had already validated the style, I clarified that the existing MetricCard run was only a wiring smoke because it compared a full prototype root against one isolated React component. I then updated the task plan so the team must prove a real like-for-like CSS visual improvement loop before moving further into page work.

The new phases make selector verification and crop inspection explicit gates. They require a component-level proof (`MetricCard`), a section-level proof (`dashboard-metrics`), and a short runbook before continuing to the full Dashboard page.

### Prompt Context

**User prompt (verbatim):** "add phases for making sure our css-visual improvement loop works before moving further."

**Assistant interpretation:** Insert explicit implementation phases before Dashboard/page work to verify that css-visual-diff compares equivalent prototype/React regions and can drive actual CSS improvements.

**Inferred user intent:** Avoid scaling page implementation on top of an unproven or misleading visual-diff loop.

**Commit (docs):** this commit — "Add css visual loop proof phases"

### What I did

- Updated `tasks.md` between Phase 6 and Phase 7.
- Added `Phase 6A — Prove the CSS visual improvement loop on one component`.
- Added `Phase 6B — Prove the CSS visual improvement loop on one page section`.
- Added `Phase 6C — Write the visual improvement loop runbook`.
- Marked Phases 6A and 6B as hard gates before Phase 7.
- Specified selector instrumentation, visual spec correction, ticket-local scripts, artifact folders, inspect-first validation, two-iteration improvement loops, acceptance criteria, and milestone commits.
- Added the user’s follow-up instruction that visual validation must inspect individual `left_region.png` / `right_region.png` files with the `read` tool, not `understand_image`, and not rely on the conjoined `diff_comparison.png` image.

### Why

- The first visual comparison proved the tooling can run, but not that style parity is meaningful.
- Without like-for-like selectors, pixel numbers can be actively misleading.
- A proven component-and-section loop should reduce wasted tuning time when the team moves to the full Dashboard page.

### What worked

- The new phases fit naturally between component expansion and Dashboard page tuning.
- The plan now explicitly blocks further page work until crop selectors and visual artifacts are trustworthy.

### What didn't work

- N/A; this was a planning/task update only.

### What I learned

- The current task list needed a stronger distinction between “visual-diff command runs” and “visual-diff validates style.”
- The next implementation should prioritize selector/crop correctness over CSS changes.

### What was tricky to build

- The tricky part was making the phases concrete enough to be executable rather than adding a vague “validate visual diff” checkbox. The new tasks require exact scripts, artifact paths, crop inspection, two reruns, and acceptance criteria.
- The image-review rule is deliberately explicit because the combined diff image can hide crop mismatch problems; individual crops are the source of truth for deciding whether selectors are valid.

### What warrants a second pair of eyes

- Review whether `MetricCard` and `dashboard-metrics` are the best proof targets, or whether a simpler prototype fixture should be created first.
- Review whether Phases 6A–6C should be renumbered into full Phases 7–9 if the team wants strict sequential phase numbers.

### What should be done in the future

- Execute Phase 6A before any further page implementation.
- Keep all proof scripts under the ticket `scripts/` directory with numerical prefixes.
- Do not tune style based on numeric diffs until crop screenshots are confirmed comparable.

### Code review instructions

- Review `tasks.md` around Phase 6A–6C.
- Check that the phases block Phase 7 until a like-for-like component and section comparison has been proven.
- Confirm that the proposed artifact folders and script names match the ticket conventions.

### Technical details

New planned artifact/script locations:

```text
scripts/03-smoke-compare-metric-card.sh
scripts/04-smoke-compare-dashboard-metrics.sh
various/05-css-loop-metric-card/
various/06-css-loop-dashboard-metrics/
playbooks/02-pyxis-app-css-visual-improvement-loop.md
```

## Step 7: Prove the component-level CSS visual improvement loop with MetricCard

I executed Phase 6A for `MetricCard`. The important change was moving from a misleading full-page-vs-component comparison to a like-for-like crop: prototype `[data-pyxis-component="metric-card"][data-metric-card="upcoming"]` against React `[data-pyxis-component="metric-card"]`. I inspected the individual `left_region.png` and `right_region.png` files with the `read` tool before using pixel-diff evidence.

The loop now works: selectors crop the same visual object, the first meaningful comparison identified concrete style drift, and CSS/story adjustments reduced the diff from 9.6416% to 3.7242% while keeping the result in the `review` band.

### Prompt Context

**User prompt (verbatim):** "remember to use the read call to read images, not uderstand images, and to use the dindividual images to validate, not the conjoined large images"

**Assistant interpretation:** For css-visual-diff review, inspect generated image artifacts with the `read` tool and validate from the separate left/right crops rather than from a combined comparison image.

**Inferred user intent:** Prevent visual validation from hiding crop mismatches or hallucinating image details through an image-understanding tool.

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the CSS visual improvement loop proof phase using the clarified image-inspection rules.

**Inferred user intent:** Move beyond planning into a real proof of the visual loop.

**User prompt (verbatim):** "you can look at the pixel diff when you get close as well"

**Assistant interpretation:** After the individual crops are confirmed comparable, inspect the pixel-diff artifact to identify residual drift.

**Inferred user intent:** Use pixel diff as a secondary diagnostic once crop validity is established.

**Commit (code):** this commit — "Prove pyxis app component visual loop"

### What I did

- Added behavior-neutral selector pass in prototype code:
  - `prototype-design/lib/components.jsx`
  - `prototype-design/screens/auth-dash.jsx`
- Extended prototype `Card` to pass through rest attributes.
- Added prototype `MetricCard` / `Stat` selectors:
  - `data-pyxis-component="metric-card"`
  - `data-pyxis-part="root|accent|label|value|caption|trend"`
  - `data-metric-card="upcoming"` for the first Dashboard metric.
- Added `data-section="dashboard-metrics"` to the prototype Dashboard metrics grid.
- Updated React MetricCard story fixture to match the prototype content (`Upcoming`, `6`, `Next 60 days`) and crop width.
- Updated `app.components.visual.yml` to use like-for-like selectors.
- Regenerated spec mirrors.
- Added ticket-local script:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh
```

- Ran focused comparisons and preserved artifacts under:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/05-css-loop-metric-card/
```

### Why

- The earlier `MetricCard` run compared the full dashboard prototype root against a single React card, so the numeric diff was not useful.
- A component-level proof is required before scaling visual tuning to page sections and full pages.
- Inspecting individual crops first validates the selector contract before any CSS tuning.

### What worked

- Run 01 produced a real like-for-like crop after selector instrumentation:
  - left bounds: `231 × 135.5`,
  - right bounds: `164 × 116`,
  - changed percent: `9.6416%`,
  - changed pixels: `3029/31416`,
  - classification: `review`.
- Reading individual crops showed the React card had the right content but wrong crop width/height, background tint, border treatment, and missing prototype-style accent rule layout.
- After Storybook wrapper and CSS tuning, Run 02 produced nearly identical crop bounds:
  - left bounds: `231 × 135.5`,
  - right bounds: `231 × 136`,
  - changed percent: `3.7242%`,
  - changed pixels: `1170/31416`,
  - classification: `review`.
- I inspected `left_region.png` and `right_region.png` with `read` for Run 02, Run 03, Run 04, and Run 05-final.
- Once crops were close, I inspected `diff_only.png` with `read` to locate residual text/edge drift.
- Final chosen result is Run 05-final:
  - `3.7242%`, `1170/31416`, `review` band.

### What didn't work

- A mistaken command invocation with a trailing slash failed silently because it was guarded with `|| true` during quick shell testing:

```bash
./ttmp/.../scripts/03-smoke-compare-metric-card.sh/ 2>/dev/null || true
```

The actual script path worked when invoked normally:

```bash
ttmp/.../scripts/03-smoke-compare-metric-card.sh run-01
```

- Run 03 and Run 04 tested root color/font/radius adjustments from computed style diffs, but the pixel result got slightly worse (`4.1157%` and `4.1508%`). I reverted to the visually better Run 02/Run 05-final CSS shape except for the useful crop/size fixes.

### What I learned

- The crop inspection rule is correct: Run 01’s numeric result only became meaningful after individual left/right images showed the crop was now the same object.
- CSS computed diffs are helpful evidence, but not every computed root style difference improves pixels. Some differences came from the prototype card root versus React root measurement and should not be blindly forced.
- Pixel diff is most useful after crop sizes match; before that, it mostly reports selector/story-wrapper problems.

### What was tricky to build

- The prototype `Stat` component was nested inside a generic `Card`, so adding attributes required first allowing `Card` to spread `...rest` onto its root. Without that, the visual suite could not target the card root directly.
- Storybook wrapper padding affected crop bounds. The React story initially wrapped the card in a padded container, which was fine for viewing but wrong for crop comparison. Removing wrapper padding and setting the wrapper width made the selected React component match the prototype crop dimensions.
- The final diff remains mostly text anti-aliasing/position and edge differences. The individual crops look close; the `diff_only.png` highlights residual text and border pixels.

### What warrants a second pair of eyes

- Review whether the final `MetricCard` CSS should keep prototype-specific values or be re-tokenized after more app components are compared.
- Review whether the prototype `Stat` selectors should stay in `lib/components.jsx` or be limited to dashboard-only fixtures if future prototype comparisons need multiple metric-card variants.
- Review whether `3.7242%` in the review band is acceptable for the proof phase or whether a stricter accepted-band target is needed before Phase 6B.

### What should be done in the future

- Execute Phase 6B using the same inspect-first process for `dashboard-metrics`.
- Use `left_region.png` and `right_region.png` first, then inspect `diff_only.png` once crops are close.
- Avoid `diff_comparison.png` as the primary validation artifact.

### Code review instructions

- Start with prototype selector changes:
  - `prototype-design/lib/components.jsx`
  - `prototype-design/screens/auth-dash.jsx`
- Then review React MetricCard changes:
  - `web/packages/pyxis-app/src/components/molecules/MetricCard.css`
  - `web/packages/pyxis-app/stories/AppComponents.stories.tsx`
- Then review the spec/script:
  - `prototype-design/visual-diff/userland/specs/app.components.visual.yml`
  - `ttmp/.../scripts/03-smoke-compare-metric-card.sh`
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh run-review
```

- Inspect individual images with `read`:

```text
various/05-css-loop-metric-card/run-review/metric-card/artifacts/component/left_region.png
various/05-css-loop-metric-card/run-review/metric-card/artifacts/component/right_region.png
various/05-css-loop-metric-card/run-review/metric-card/artifacts/component/diff_only.png
```

### Technical details

Run summary:

| Run | Purpose | Changed percent | Changed pixels | Notes |
|---|---:|---:|---:|---|
| `run-01` | First like-for-like selector run | `9.6416%` | `3029/31416` | Crops same object but React crop too small/tinted. |
| `run-02` | Story width + MetricCard visual tuning | `3.7242%` | `1170/31416` | Best crop/diff shape; review band. |
| `run-03` | Computed-style color/font/radius experiment | `4.1157%` | `1293/31416` | Worse; do not keep all computed-style changes. |
| `run-04` | Border-radius experiment | `4.1508%` | `1304/31416` | Worse. |
| `run-05-final` | Reverted to best tuned shape | `3.7242%` | `1170/31416` | Final Phase 6A result. |

## Step 8: Prove the dashboard metrics section loop and compact compare-spec output

I continued into Phase 6B and also improved the JS userland output. The dashboard metrics comparison now runs as a focused section-only comparison using `pyxis pages compare-spec --section metrics --summary`, which prints a compact operator summary while preserving the full `compare-all-output.json` and per-section artifacts on disk.

The section loop is proven enough to proceed: the comparison uses like-for-like metrics section crops, individual crops were inspected with `read`, `diff_only.png` was used only after the crops were comparable, and the final section result is in the `review` band.

### Prompt Context

**User prompt (verbatim):** "can we potentially condense the json output of the tool ? or do you need all that information?"

**Assistant interpretation:** Reduce noisy terminal output from css-visual-diff while keeping full artifacts available when needed.

**Inferred user intent:** Make repeated visual-loop runs easier to scan during iterative tuning.

**User prompt (verbatim):** "we can also modify the js originally no and add a jsverb flag?"

**Assistant interpretation:** Prefer improving the JS userland verb itself, not only wrapping output with shell `jq`.

**Inferred user intent:** Make compact summaries a first-class workflow option for future runs.

**User prompt (verbatim):** "make a note going forward to adjust the JS when you think you are seeing too much useless information in the tool output. because we will be iterating on its output a lot, we want to see all the information needed, but no more. and we can always use the full information if we think we are missing something. Store that in your runbook.

continue"

**Assistant interpretation:** Record a durable rule in the runbook: tune JS verb output when it is noisy, print only the decision-critical summary, and keep full output on disk.

**Inferred user intent:** Establish a feedback loop for the tooling UX itself while continuing implementation.

**Commit (code/docs):** pending at diary write time — intended milestone: `Prove pyxis app dashboard section visual loop`

### What I did

- Added `--section` support to the JS userland `compare-spec` path:
  - `prototype-design/visual-diff/userland/verbs/pyxis-pages.js`
  - `prototype-design/visual-diff/userland/lib/compare-region.js`
- Added `--summary` support to `pyxis pages compare-spec`.
- Updated ticket scripts to use the JS summary flag instead of shell-side JSON filtering.
- Added runbook:
  - `playbooks/02-pyxis-app-css-visual-improvement-loop.md`
- Stored the user’s tooling-output rule in the runbook: if the command prints too much useless information, update the JS verb/summary output and keep full JSON artifacts on disk.
- Updated React dashboard metrics data so it matches the prototype section more closely:
  - labels: `Upcoming`, `Pending bookings`, `Avg draw`, `Capacity use`,
  - values: `6`, `3`, `84`, `56%`,
  - captions/trends aligned with the prototype.
- Added `trend` support to React `MetricCard`.
- Ran dashboard metrics comparisons and inspected individual crops.

### Why

- The raw compare-spec output was too verbose for iterative use.
- Phase 6B requires a focused page-section proof, not a full page run.
- The team will run this loop many times, so operator output needs to remain readable.

### What worked

- `--section metrics --summary` now prints only the decision-critical data:
  - `classificationCounts`,
  - `maxChangedPercent`,
  - row `changedPercent` / pixels,
  - selectors,
  - individual crop and `diff_only` paths.
- Full JSON is still available at the emitted `jsonPath`.
- Run 03/04 generated only one section row instead of page + summary + metrics noise.
- Individual crop inspection confirmed the section crops are comparable and are the metrics row, not full pages.
- Final useful section result after layout/data alignment:
  - `run-04-trends`,
  - changed percent: `7.4449%`,
  - changed pixels: `9801/131648`,
  - classification: `review`.

### What didn't work

- My first attempt to pass `--section metrics` failed because the JS verb did not support it yet:

```text
Error: unknown flag: --section
```

I fixed this by adding the flag to `compareSpec` and filtering sections in `compareTarget`.

- A pure data/trend alignment made the visible crop closer but did not reduce the pixel percentage compared to run 02 (`7.3864%` → `7.4449%`) because adding trend text also adds more comparable text pixels. I kept it because it aligns the section semantically with the prototype, which is more important for page-section proof.

### What I learned

- Tool output is part of the development surface. When it gets noisy, improving the JS verb is better than repeatedly post-processing at the shell layer.
- `--summary` is enough for the normal loop; full JSON should be opened only when investigating missing details.
- Section-level visual proof can succeed even when full-page and summary sections remain major mismatches, as long as the focused section crops are comparable.

### What was tricky to build

- `compare-spec` previously filtered by page/priority only. Adding `section` required passing the option through `verbs/pyxis-pages.js`, `compareSpec`, `compareAllTargets`, and `compareTarget` without breaking existing full-page suite behavior.
- The script should not discard full output; it now relies on the suite’s `jsonPath` plus per-section artifacts instead of printing the full object.
- The section diff still includes residual text/edge differences, but crop evidence shows the comparison is useful and bounded.

### What warrants a second pair of eyes

- Review the new `--summary` schema in `pyxis-pages.js` and decide if it should include `bounds` by default.
- Review whether `--section` should error when no section matches instead of returning an empty section suite.
- Review whether the dashboard metrics final `review` band is good enough for the proof phase before full Dashboard work.

### What should be done in the future

- Use `--summary` for normal repeated visual runs.
- Add summary fields only when a repeated decision needs them; do not let compact output grow into the full JSON again.
- Open full JSON only when the compact summary is insufficient.
- Carry the same focused-output approach into future page specs and scripts.

### Code review instructions

- Review JS userland changes first:
  - `prototype-design/visual-diff/userland/verbs/pyxis-pages.js`,
  - `prototype-design/visual-diff/userland/lib/compare-region.js`.
- Review the runbook note:
  - `ttmp/.../playbooks/02-pyxis-app-css-visual-improvement-loop.md`.
- Review dashboard metrics React changes:
  - `web/packages/pyxis-app/src/components/organisms/Panels.tsx`,
  - `web/packages/pyxis-app/src/components/molecules/MetricCard.tsx`,
  - `web/packages/pyxis-app/src/components/molecules/MetricCard.css`,
  - `web/packages/pyxis-app/src/components/shell/AppShell.css`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
cd /home/manuel/code/wesen/2026-04-23--pyxis
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/04-smoke-compare-dashboard-metrics.sh run-review
```

### Technical details

Key command now supported:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section metrics \
  --summary \
  --outDir ttmp/.../various/06-css-loop-dashboard-metrics/run-name \
  --output json
```

Run summary:

| Run | Purpose | Changed percent | Changed pixels | Notes |
|---|---:|---:|---:|---|
| `run-01` | First metrics section run, before shell width alignment | `9.3145%` | `12237/131376` | Section crop valid; width mismatch. |
| `run-02` | Shell/content width aligned | `7.3864%` | `9724/131648` | Better bounds and review-band result. |
| `run-03-summary-flag` | First JS `--summary` + `--section` proof | `7.3864%` | `9724/131648` | Compact terminal output works. |
| `run-04-trends` | Semantic data/trend alignment | `7.4449%` | `9801/131648` | Final proof result; crops semantically match. |

### Addendum: Stop when the crop is close enough

The user clarified that we do not need to chase perfect pixel parity, especially when individual crops look close and the remaining differences are likely typography, anti-aliasing, gradients, shadows, or other browser rendering details. I added this rule to the Phase 6B acceptance criteria and to the CSS visual improvement loop runbook.

For the dashboard metrics section, the final `run-08-final` crops are close enough for the proof phase: the content, layout, bounds, and data line up, and the remaining `7.4449%` review-band diff is mostly text/edge pixels visible in `diff_only.png`. This is a good point to stop and proceed rather than overfit component CSS to one screenshot.

## Step 9: Finish the CSS visual loop runbook and cohesive-theme guidance

I completed Phase 6C by turning the proven MetricCard and dashboard metrics loops into a reusable runbook and linking it from the central bottom-up visual parity playbook. I also added a theme-cohesion rule so future tuning does not make each component a one-off prototype clone.

### Prompt Context

**User prompt (verbatim):** "do 6C, we're nearing the end of the session. also try to make sure we are using a cohesive theme and should reuse variables across components instead of tuning components individually."

**Assistant interpretation:** Finish the runbook phase, add a pointer from the central visual-parity docs, and make explicit that future CSS tuning should promote shared decisions into variables/tokens rather than hard-coding per-component fixes.

**Inferred user intent:** Leave the next session with a durable process and avoid style fragmentation as the app grows.

**Commit (docs):** this commit — "Document pyxis app css visual improvement loop"

### What I did

- Added cohesive-theme guidance to `playbooks/02-pyxis-app-css-visual-improvement-loop.md`.
- Added proven artifact paths for MetricCard and dashboard metrics.
- Added a pointer from `docs/playbooks/05-bottom-up-component-visual-parity.md` to the pyxis-app runbook.
- Marked Phase 6C tasks complete except for the final commit.

### Why

- We need a repeatable visual loop before moving into larger page work.
- The app should converge on shared design tokens for surfaces, borders, shadows, radii, typography, and status colors.
- Visual diffs should guide token/theme decisions, not encourage local overfitting.

### What worked

- The runbook now captures the user’s preferences for compact output, individual image inspection, pixel-diff usage, stop-when-close policy, and cohesive theme variables.
- The central playbook now points future developers to the ticket-specific pyxis-app loop.

### What didn't work

- N/A; this was a documentation/runbook update.

### What I learned

- The visual loop needs two parallel feedback paths: UI parity feedback and tooling-output feedback.
- Theme cohesion should be treated as part of visual parity, not a later cleanup task.

### What was tricky to build

- The runbook had to balance two constraints that can conflict: preserving exact prototype evidence and avoiding component-specific hard-coded tuning. The guidance now says to fix crop/data issues first, then decide whether a difference is component-specific or theme-wide before changing CSS.

### What warrants a second pair of eyes

- Review whether current `MetricCard` hard-coded values should be promoted into `app-tokens.css` before Phase 7.
- Review whether the `--summary` output has the right amount of information or should include a smaller/larger CSS diff subset.

### What should be done in the future

- Before tuning Dashboard as a whole, consider a short token-hardening pass for app surfaces/radii/shadows/status colors.
- Apply token changes across a small component and page-section comparison to ensure the theme remains cohesive.

### Code review instructions

- Review:
  - `ttmp/.../playbooks/02-pyxis-app-css-visual-improvement-loop.md`,
  - `docs/playbooks/05-bottom-up-component-visual-parity.md`,
  - `ttmp/.../tasks.md` Phase 6C.

### Technical details

The runbook now explicitly says:

```text
Do not tune each component into a one-off clone of its current prototype crop. Use the visual loop to discover shared theme decisions, then encode those decisions in reusable tokens and variables.
```

## Step 10: Token-hardening pass before Phase 7

Before starting the full Dashboard page work, I did a short theme-cohesion pass. The intent was to make the app easier to tune as a system: shared surfaces, borders, shadows, radii, dark-surface text, and status colors should live in reusable variables rather than scattered component literals.

This pass intentionally did not chase a lower visual diff. It kept the already-proven MetricCard and dashboard-metrics crops stable while moving local CSS values into a more coherent app token vocabulary.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue from the Phase 6C handoff by doing the recommended pre-Phase-7 token-hardening pass.

**Inferred user intent:** Prepare the app for full Dashboard work with cohesive shared variables, not one-off component tweaks.

**Commit (code):** fba5369 — "Harden pyxis app visual theme tokens"

### What I did

- Expanded `web/packages/pyxis-app/src/styles/app-tokens.css` with shared tokens for:
  - login gradient colors,
  - surface variants,
  - dark-surface foregrounds,
  - RGB channel values for reusable alpha colors,
  - warm brand color,
  - radius scale including pill/modal radii,
  - card/nav/modal shadows,
  - modal backdrop,
  - status-dot ring alpha.
- Replaced hard-coded component values in:
  - `web/packages/pyxis-app/src/components/molecules/MetricCard.css`,
  - `web/packages/pyxis-app/src/components/shell/AppShell.css`,
  - `web/packages/pyxis-app/src/components/organisms/Panels.css`,
  - `web/packages/pyxis-app/src/components/atoms/StatusDot.css`,
  - `web/packages/pyxis-app/src/components/molecules/Rows.css`,
  - `web/packages/pyxis-app/src/pages/pages.css`.
- Ran typecheck and the already-proven component/metrics visual smoke scripts.
- Inspected the post-token-hardening dashboard metrics crops with `read`.
- Recorded the work in docmgr/changelog in commit `2492fed` — "Diary: record app token hardening".

### Why

- Dashboard page work would otherwise invite per-component tweaks to match each crop.
- Shared token names make it easier to decide whether a diff is component-specific or theme-wide.
- Keeping MetricCard and dashboard metrics unchanged proved the token extraction was behavior-preserving enough for Phase 7.

### What worked

- TypeScript validation passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- MetricCard visual smoke stayed unchanged in the review band:

```bash
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh run-06-token-hardening
```

```text
3.724216959511077%, 1170/31416, review
```

- Dashboard metrics visual smoke also stayed unchanged in the review band:

```bash
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/04-smoke-compare-dashboard-metrics.sh run-09-token-hardening
```

```text
7.44485294117647%, 9801/131648, review
```

- The final metrics crops remained aligned:

```text
various/06-css-loop-dashboard-metrics/run-09-token-hardening/dashboard/artifacts/metrics/left_region.png
various/06-css-loop-dashboard-metrics/run-09-token-hardening/dashboard/artifacts/metrics/right_region.png
various/06-css-loop-dashboard-metrics/run-09-token-hardening/dashboard/artifacts/metrics/diff_only.png
```

### What didn't work

- No hard failure in this step.
- The visual diff numbers did not improve; this was expected because the pass deliberately preserved the rendered values while moving them into tokens.

### What I learned

- Token-hardening is safest when it is validated against both a component-level crop and a section-level crop.
- The dashboard metrics result is a useful guardrail: if token changes drift that known section, future page tuning becomes harder to trust.

### What was tricky to build

The tricky part was avoiding accidental visual drift while renaming values. Shadows and alpha colors were the highest-risk values because moving `rgba(...)` literals into RGB-channel tokens can subtly change rendered output if the channel or alpha is mistyped.

The approach was to promote the exact existing values first, then validate MetricCard and dashboard metrics before making any new visual decisions.

### What warrants a second pair of eyes

- Review `app-tokens.css` naming to make sure the token vocabulary is understandable before more pages depend on it.
- Check whether `--app-radius-sm` / `--app-radius-xs` naming is intuitive now that old literals like `8px`, `10px`, `12px` were normalized.

### What should be done in the future

- Continue promoting repeated dashboard section values into shared tokens as organisms are extracted.
- Avoid introducing new hard-coded colors/shadows/radii in section-specific CSS unless they are explicitly temporary evidence.

### Code review instructions

- Start with `web/packages/pyxis-app/src/styles/app-tokens.css`.
- Then review the CSS consumers listed under "What I did" and confirm they reference tokens rather than duplicated literals.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

Optional visual checks:

```bash
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh run-review
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/04-smoke-compare-dashboard-metrics.sh run-review
```

### Technical details

The post-token-hardening visual artifacts are under:

```text
various/05-css-loop-metric-card/run-06-token-hardening/
various/06-css-loop-dashboard-metrics/run-09-token-hardening/
```

The key rule established by this step is: future Dashboard tuning should first ask whether a repeated value belongs in `app-tokens.css` before adding local section CSS.

## Step 11: Start Phase 7 Dashboard composition

After token-hardening, I composed the first responsive Dashboard checkpoint. The goal was structural parity, not final pixel parity: get the shell, hero, metrics, upcoming shows, quick actions, attention/activity areas, and mobile bottom navigation into the React app so focused section tuning could begin.

The full-page visual diff improved substantially on desktop after matching the shell/sidebar direction, but it stayed above review-band. That is expected for a full-page checkpoint because the prototype contains richer sidebar/topbar details, extra desktop panels, and different text contracts.

### Prompt Context

**User prompt (verbatim):** (same as Step 10)

**Assistant interpretation:** Continue from the token-hardening checkpoint into Phase 7 responsive Dashboard composition.

**Inferred user intent:** Build a working responsive Dashboard baseline that can be tuned with the proven css-visual-diff loop.

**Commit (code):** dadc31b — "Compose responsive dashboard page checkpoint"

### What I did

- Added dashboard-specific composition inside `DashboardOverview`:
  - desktop/mobile hero section for the next show,
  - mobile dashboard header and welcome copy,
  - quick actions panel,
  - needs-attention list,
  - desktop upcoming-shows table with the existing table/row components,
  - responsive mobile ordering that hides upcoming shows to match the mobile prototype more closely.
- Adjusted `AppShell`:
  - desktop sidebar now uses the light surface theme to match the full-app prototype and cohesive theme tokens,
  - mobile dashboard hides the generic topbar in favor of the mobile dashboard header,
  - mobile bottom nav is static at page bottom and labels the fifth item as `More`.
- Added ticket script:

```bash
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh desktop run-name
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh mobile run-name
```

- Ran desktop/mobile full-page visual checkpoints.
- Inspected representative final right-side crops with `read`.
- Recorded the work in docmgr/changelog in commit `50e6fb8` — "Diary: record dashboard page checkpoint".

### Why

- Phase 7 needed a page-level baseline before individual Dashboard sections could be refined.
- The React app needed the same page to respond to desktop and 390px mobile viewports, rather than creating a separate mobile page.
- A full-page checkpoint establishes what is structurally present and what still requires focused section work.

### What worked

- TypeScript validation passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Desktop full-page diff improved across the loop:
  - `run-01-baseline`: `42.4321%`, major mismatch.
  - `run-02-hero-attention`: `28.4535%`, major/tune band depending on classification label.
  - `run-03-table-mobile-trim`: `28.7209%`, major/tune band.
  - `run-04-light-sidebar`: `16.4150%`, `245069` changed pixels, `tune-required`.
- Mobile full-page checkpoints were captured:
  - `run-01-baseline`: `33.4386%`, major mismatch.
  - `run-02-hero-attention`: `27.9984%`, major/tune band.
  - `run-03-table-mobile-trim`: `29.1554%`, major/tune band.
  - `run-04-bottom-nav-static`: `25.9643%`, major/tune band.
- Representative crops inspected with `read`:

```text
various/07-dashboard-page/desktop/run-04-light-sidebar/dashboard/artifacts/page/right_region.png
various/07-dashboard-page/mobile/run-04-bottom-nav-static/dashboard/artifacts/page/right_region.png
```

### What didn't work

- Full-page parity remained too noisy to use as the main tuning loop.
- The desktop prototype contains sidebar grouping/user-footer/status panels that the React checkpoint did not yet implement.
- The mobile comparison still differed in content ordering and text contracts, especially around upcoming shows/activity visibility.

### What I learned

- Full-page comparisons are good checkpoints, but they are poor edit-loop drivers once a page has many independently moving sections.
- Matching the shell/sidebar color direction produced a large desktop improvement, which confirmed that theme-level decisions can dominate page-level diffs.

### What was tricky to build

The hard part was balancing desktop and mobile in one component tree. A change that helped desktop page parity, such as adding richer upcoming-show content, could hurt mobile height/order parity.

The solution was to treat this as a checkpoint and defer fine-grained work to extracted section comparisons rather than keep tuning the whole page crop.

### What warrants a second pair of eyes

- Review `DashboardOverview` in `Panels.tsx`; it grew too large during the checkpoint and should continue being split into named organisms.
- Review whether desktop-only bot/status/attention panels should be implemented for parity or intentionally deferred.
- Review mobile copy differences (`Pending bookings` vs `Pending`, `Capacity use` vs `Capacity`) before tuning metrics further.

### What should be done in the future

- Add focused section specs for `dashboard-hero`, `dashboard-upcoming`, `dashboard-activity`, and `dashboard-attention`.
- Extract page sections into named components/organisms and tune those before returning to the full-page crop.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/organisms/Panels.tsx`
  - `web/packages/pyxis-app/src/components/organisms/Panels.css`
  - `web/packages/pyxis-app/src/components/shell/AppShell.tsx`
  - `web/packages/pyxis-app/src/components/shell/AppShell.css`
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh desktop run-review
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh mobile run-review
```

### Technical details

The full-page visual artifacts for this checkpoint are under:

```text
various/07-dashboard-page/desktop/run-04-light-sidebar/
various/07-dashboard-page/mobile/run-04-bottom-nav-static/
```

The checkpoint should not be considered final visual acceptance; it is the baseline from which section-level Dashboard work should proceed.

## Step 12: Dashboard section extraction, Storybook enrichment, and CSS import fix

The user reminded me to extract atoms, molecules, and organisms as needed rather than tuning the full Dashboard as a monolith. I responded by adding prototype/React section selectors, extracting dashboard-specific organism pieces, and creating a richer Storybook surface for the dashboard sections.

During this same step I also diagnosed and fixed a Storybook/Vite CSS loading failure. The dashboard briefly looked completely broken because the `Panels.css` module was being served with an empty injected CSS string; adding a query suffix to the import forced a distinct Vite CSS module and restored the styles.

### Prompt Context

**User prompt (verbatim):** "remember to extract components / atoms / molecules / organisms as needed to make the job easier and a rich storybook"

**Assistant interpretation:** Do not let Phase 7 continue as one large page component; extract dashboard sections into reusable organism-level pieces and add Storybook stories for them.

**Inferred user intent:** Keep the visual feedback loop small, reviewable, and reusable by tuning section stories/specs instead of only full-page crops.

**Commit (code):** 6b4a714 — "Extract dashboard sections and enrich stories"

### What I did

- Added prototype section selectors for focused dashboard comparisons:
  - desktop `dashboard-hero`, `dashboard-upcoming`, `dashboard-quick-actions`, `dashboard-activity`, `dashboard-attention`,
  - mobile `dashboard-hero`, `dashboard-metrics`, `dashboard-attention`, `dashboard-activity`.
- Updated visual specs:
  - `prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml`,
  - `prototype-design/visual-diff/userland/specs/app.pages.mobile.visual.yml`.
- Refreshed JS mirror specs:

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

- Extracted dashboard-specific organism sections into:

```text
web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx
```

- Added rich Storybook coverage in:

```text
web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx
```

- Exported the new sections from:

```text
web/packages/pyxis-app/src/index.ts
```

- Fixed the Storybook/Vite CSS loading issue by changing the Panels CSS import in `Panels.tsx` to:

```ts
import './Panels.css?dashboard';
```

### Why

- Focused organism stories and `--section` visual specs make the feedback loop shorter than full-page tuning.
- Extracted dashboard sections are easier to review, reuse, and theme.
- Rich Storybook stories make it possible to inspect desktop/mobile section variants without running the whole page.

### What worked

- TypeScript validation passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Full page after CSS import fix:
  - desktop `run-05-css-import-fix`: `16.414974279284106%`, `245069` changed pixels, `tune-required`.
  - mobile `run-07-css-import-fix`: `27.23846973048251%`, `133000` changed pixels, `major-mismatch`.
- Focused section baseline runs were created under:

```text
various/08-dashboard-section-focus/desktop/run-01-sections/
various/08-dashboard-section-focus/mobile/run-01-sections/
various/08-dashboard-section-focus/mobile/run-02-mobile-compact/
```

- I verified in Storybook via Playwright that the CSS import fix restored styles:

```js
() => ({
  panelStyles: [...document.querySelectorAll('style')].some(s => s.textContent.includes('app-panel')),
  heroBg: getComputedStyle(document.querySelector('.app-dashboard-hero')).backgroundColor,
  metricGrid: getComputedStyle(document.querySelector('.app-metrics-grid')).gridTemplateColumns,
})
```

Result after fix:

```json
{
  "panelStyles": true,
  "heroBg": "rgb(31, 30, 28)",
  "metricGrid": "275.5px 275.5px 275.5px 275.5px"
}
```

### What didn't work

- A mobile compact CSS attempt made the dashboard look broken because Storybook/Vite served `Panels.css` as an empty injected style module.
- The failing symptom was visible in the browser and confirmed by inspecting the served CSS module:

```text
const __vite__css = ""
```

- The first attempt to validate with the full-page mobile comparison after that failure produced a much worse page result:

```text
run-05-mobile-compact: 61.91450044208665%, major-mismatch
```

- The issue was fixed by importing the CSS as `./Panels.css?dashboard`, and the user confirmed: "it's fixed."

### What I learned

- Vite/Storybook CSS HMR can fail in a way that still returns HTTP 200 for the CSS module while injecting an empty style string.
- When the UI suddenly looks unstyled, it is worth inspecting the served CSS module rather than only the source CSS file.
- Section extraction should happen before repeated full-page tuning; otherwise page-level diffs hide the source of regressions.

### What was tricky to build

The CSS failure was tricky because the source file was syntactically balanced and typecheck still passed. The browser requested `Panels.css` successfully, but the injected Vite module contained an empty `__vite__css` string, so the actual runtime page had no panel/dashboard styles.

I diagnosed it by checking computed styles in the iframe, then fetching the served CSS module and looking for whether `.app-panel` was present. The fix was to force a distinct CSS module URL with a query-suffixed import.

### What warrants a second pair of eyes

- Review whether the `?dashboard` CSS import should remain as the long-term fix or whether Storybook/Vite cache/HMR should be cleaned another way.
- Review the split between `Panels.tsx` and `DashboardSections.tsx`; more extraction is likely needed (`DashboardMetricsGrid`, `DashboardActivityPanel`, `DashboardUpcomingPanel`).
- Review the new Storybook stories to ensure they cover the states reviewers actually need.

### What should be done in the future

- Extract `DashboardMetricsGrid` as an organism around `MetricCard`, with desktop/mobile label variants if needed.
- Extract `DashboardActivityPanel` around `ActivityFeedItem`, with desktop/mobile item-count behavior.
- Extract `DashboardUpcomingPanel` so its table/mobile-card variants can be tuned independently.
- Consider a dedicated mobile bottom nav atom/molecule if route pages need richer mobile parity.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx`,
  - `web/packages/pyxis-app/src/components/organisms/Panels.tsx`,
  - `web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx`,
  - `prototype-design/screens/auth-dash.jsx`,
  - `prototype-design/screens/mobile.jsx`,
  - `prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml`,
  - `prototype-design/visual-diff/userland/specs/app.pages.mobile.visual.yml`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh desktop run-review
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/05-smoke-compare-dashboard-page.sh mobile run-review
```

- In Storybook, inspect:

```text
Pyxis App/Dashboard Sections/HeroDesktop
Pyxis App/Dashboard Sections/MobileHeaderAndCopy
Pyxis App/Dashboard Sections/MetricsGridDesktop
Pyxis App/Dashboard Sections/UpcomingPanelDesktop
Pyxis App/Dashboard Sections/QuickActionsPanel
Pyxis App/Dashboard Sections/AttentionPanelMobile
Pyxis App/Dashboard Sections/ActivityPanel
Pyxis App/Dashboard Sections/MobileDashboardStack
```

### Technical details

The CSS failure can be checked in the browser with:

```js
[...document.querySelectorAll('style')].some(s => s.textContent.includes('app-panel'))
```

The section-level visual artifacts are under:

```text
various/08-dashboard-section-focus/
```

The full-page post-fix visual artifacts are under:

```text
various/07-dashboard-page/desktop/run-05-css-import-fix/
various/07-dashboard-page/mobile/run-07-css-import-fix/
```

## Step 13: Add runbook guidance for organism extraction before full-page tuning

The user clarified that the visual loop should explicitly say to extract organisms such as `DashboardUpcomingPanel` rather than tackling full pages at once. I updated the runbook accordingly.

### What changed

- Added a new runbook section: `Extract page sections before tuning the whole page`.
- The runbook now says full-page comparisons are checkpoints, not the default tuning loop.
- It instructs future work to:
  - identify organisms/sections first,
  - add stable `data-section` selectors to prototype and React,
  - extract reusable React components/organisms,
  - add rich Storybook stories for desktop/mobile/dense/empty/theme states,
  - compare/tune one section with `--section`,
  - consolidate repeated values into shared tokens as the section work proceeds,
  - then run occasional full-page checkpoints.

### Why

This keeps the feedback loop small and prevents token drift: section stories provide faster visual evidence, while token consolidation keeps the app cohesive as Dashboard and later pages grow.

## Step 14: Split Phase 8 into one page phase per route

The user asked to make the Phase 8 backlog more explicit: instead of one broad “remaining pages” bucket, every remaining route should have its own phase and should follow the bottom-up component workflow. I updated the ticket tasks and reinforced the runbook so future work starts from reusable atoms/molecules/organisms, not full-page tuning.

This did not change application code. It changed the implementation plan so the next developer can pick one page, inventory its prototype, extract the right organisms, add Storybook coverage, consolidate tokens as patterns repeat, and only then use the full-page crop as a checkpoint.

### Prompt Context

**User prompt (verbatim):** "Split tasks phase 8 into one phase per page and to make sure to identify the proper organisms / reuse molecules / atoms, and to make sure they are consistent. working bottom up. I hope that's clear in the runbook."

**Assistant interpretation:** Replace the generic Phase 8 page checklist with explicit per-page phases and ensure the runbook makes the bottom-up organism/story/token workflow clear.

**Inferred user intent:** Prevent future work from becoming a page-by-page styling scramble; make each route follow the same reusable component extraction and cohesive-token process.

**Commit (docs):** 49f0664 — "Split remaining pyxis app page phases"

### What I did

- Replaced the old generic Phase 8 checklist in `tasks.md` with per-page phases:
  - Phase 8.1 Login and mobile login,
  - Phase 8.2 Setup,
  - Phase 8.3 Shows and mobile shows,
  - Phase 8.4 Show detail and mobile show detail,
  - Phase 8.5 Calendar and mobile calendar,
  - Phase 8.6 Bookings and mobile bookings,
  - Phase 8.7 Booking review mobile route/section,
  - Phase 8.8 Artists and mobile artists,
  - Phase 8.9 Artist detail mobile route/section,
  - Phase 8.10 Attendance / post-show mobile route/section,
  - Phase 8.11 Audit log,
  - Phase 8.12 Discord,
  - Phase 8.13 Settings and mobile settings,
  - Phase 8.14 New show modal.
- Added a shared checklist for every page phase:
  - read prototype first,
  - identify atoms/molecules/organisms before CSS edits,
  - reuse existing app atoms/molecules,
  - extract page organisms,
  - add `data-section` selectors,
  - add rich Storybook stories,
  - consolidate tokens,
  - run focused section comparisons before full-page checkpoints.
- Updated `playbooks/02-pyxis-app-css-visual-improvement-loop.md` to make the multi-page process explicit.

### Why

- A generic “remaining pages” phase is too easy to execute top-down.
- Splitting by page gives each route a clear definition of done and a natural coherent commit boundary.
- The shared checklist keeps each page consistent with the Dashboard lessons: extract reusable sections, tell Storybook what states matter, and use tokens instead of one-off styling.

### What worked

- The tasks document now gives the intern/next session an actionable route-by-route sequence.
- The runbook now explicitly says not to start with a generic “remaining pages” pass.
- The page phases name candidate organisms up front, which should make future review easier.

### What didn't work

- N/A; this was a planning/documentation update only.

### What I learned

- The Dashboard checkpoint exposed the planning pattern needed for the rest of the app: every page needs organism extraction and Storybook coverage before visual tuning.
- Naming candidate organisms in the task list reduces ambiguity before implementation starts.

### What was tricky to build

The tricky part was making the phase split detailed enough to guide work without pretending the exact component taxonomy is final. I listed likely organism names per route, but kept the checklist phrased as “extract as needed” so future implementation can adjust based on the prototype evidence.

### What warrants a second pair of eyes

- Review the proposed Phase 8.x organism names before implementation; some may collapse into shared organisms or split further after prototype inspection.
- Confirm the route order is the right priority for the intern/next implementer.

### What should be done in the future

- Start Phase 8.1 with prototype inventory and Storybook stories before changing page CSS.
- As pages are implemented, update each Phase 8.x checklist item rather than reintroducing a generic “remaining pages” bucket.

### Code review instructions

- Review:
  - `ttmp/.../tasks.md` Phase 8,
  - `ttmp/.../playbooks/02-pyxis-app-css-visual-improvement-loop.md` section “Extract page sections before tuning the whole page”.
- Validate by checking that every remaining page has its own phase, candidate organisms, Storybook expectations, section visual expectations, and coherent commit target.

### Technical details

The runbook now states the multi-page workflow as:

```text
atoms/molecules already exist or are extracted → page-specific organisms are extracted and covered in Storybook → shared values are promoted into tokens → section comparisons pass or reach review-band → full-page checkpoint
```

## Step 15: Add explicit Dashboard consolidation phases before remaining pages

The user clarified that Dashboard should not be considered done. The existing work is only a structural checkpoint; header/menu, upcoming shows, quick actions, recent activity, metrics/attention, and shell/mobile navigation still need proper consolidation before Phase 8 page work proceeds.

I updated the ticket task plan so Phase 7 is no longer a single completed Dashboard item. It now has explicit Dashboard consolidation subphases and a final acceptance checkpoint, using the same bottom-up organism/story/token workflow required for the rest of the app.

### Prompt Context

**User prompt (verbatim):** "add phase for the dashboard, because it's not done at all: upcoming shows, menu, quick actions, recent activity, header, all need to be consolidated"

**Assistant interpretation:** Reopen/expand Dashboard planning with explicit unfinished Dashboard phases before the remaining page work.

**Inferred user intent:** Prevent the team from moving on to other routes while the Dashboard is still an unconsolidated checkpoint; make the remaining Dashboard work concrete and reviewable.

**Commit (docs):** 85ab0c5 — "Add dashboard consolidation phases"

### What I did

- Replaced the old Phase 7 Dashboard section with a new `Dashboard consolidation` plan.
- Marked the previous Dashboard work as `Phase 7.0 — Dashboard checkpoint already completed`, not final completion.
- Added a shared Dashboard consolidation checklist requiring:
  - prototype re-read,
  - atom/molecule/organism identification,
  - reuse before introducing new components,
  - named organism extraction,
  - stable `data-section` selectors,
  - rich Storybook stories,
  - token consolidation,
  - focused section comparisons before full-page checkpoints,
  - diary/changelog updates.
- Added explicit Dashboard subphases:
  - Phase 7.1 Dashboard header and shell/menu consolidation,
  - Phase 7.2 Dashboard hero consolidation,
  - Phase 7.3 Dashboard metrics and attention consolidation,
  - Phase 7.4 Dashboard upcoming shows consolidation,
  - Phase 7.5 Dashboard quick actions consolidation,
  - Phase 7.6 Dashboard recent activity consolidation,
  - Phase 7.7 Dashboard full-page acceptance checkpoint.

### Why

- The Dashboard currently has a working checkpoint but not a finished component architecture.
- The sections named by the user are exactly the sections that should become focused organisms and Storybook stories before final page acceptance.
- Making these explicit prevents Phase 8 from starting on an unstable Dashboard foundation.

### What worked

- `tasks.md` now clearly distinguishes the completed Dashboard checkpoint from the unfinished Dashboard consolidation work.
- The new Phase 7 mirrors the Phase 8 page-phase discipline: bottom-up extraction, token consolidation, focused section comparisons, then page checkpoint.

### What didn't work

- N/A; this was a planning/documentation update only.

### What I learned

- A “responsive page checkpoint” is not the same as “page done.” The task plan needs to reflect that distinction or later sessions may skip necessary consolidation work.

### What was tricky to build

The tricky part was preserving the fact that real Dashboard work was already completed while still making it obvious that Dashboard is not accepted. I split that work into `Phase 7.0` and then added explicit unfinished phases for each major section.

### What warrants a second pair of eyes

- Review the order of Dashboard subphases; shell/header may need to happen before section tuning because it affects full-page crops.
- Review whether `DashboardMetricsGrid` and `DashboardAttentionPanel` should be separate phases or remain coupled.

### What should be done in the future

- Start with Phase 7.1 or Phase 7.4 rather than Phase 8.1.
- Do not mark Dashboard done until Phase 7.7 records focused section results plus desktop/mobile full-page checkpoints.

### Code review instructions

- Review `ttmp/.../tasks.md` Phase 7.
- Confirm the plan explicitly includes unfinished work for header/menu, upcoming shows, quick actions, recent activity, metrics/attention, hero, and final page acceptance.

### Technical details

The new Dashboard flow is:

```text
Phase 7.0 checkpoint already completed → 7.1 shell/header/menu → 7.2 hero → 7.3 metrics/attention → 7.4 upcoming shows → 7.5 quick actions → 7.6 recent activity → 7.7 final full-page acceptance checkpoint
```

## Step 16: Consolidate the Dashboard upcoming shows organism

I resumed the ticket by following the startup hygiene the user requested: read the diary skill, read the docmgr skill, and re-read the recent diary/task/runbook context before coding. I chose Phase 7.4 because the user accepted that the upcoming-shows section was good enough as a consolidation checkpoint and asked me to continue.

This step extracted the Dashboard upcoming shows section into a named organism and made the table reuse existing show/date/status pieces instead of staying as anonymous page JSX. The focused visual result is in the `review` band, so I stopped rather than chasing pixel perfection before the neighboring Dashboard organisms are consolidated.

### Prompt Context

**User prompt (verbatim):** "ok, fair enough, continue."

**Assistant interpretation:** Accept the review-band upcoming section assessment, commit the checkpoint, and continue the ticket workflow.

**Inferred user intent:** Keep moving through Dashboard consolidation without overfitting one section before header/menu, quick actions, and activity are handled.

**Commit (code):** 7510483 — "Consolidate dashboard upcoming shows"

### What I did

- Re-read the required skills and prior context:
  - `/home/manuel/.pi/agent/skills/diary/SKILL.md`,
  - `/home/manuel/.pi/agent/skills/docmgr/SKILL.md`,
  - recent diary Steps 10–15,
  - `tasks.md` Phase 7,
  - the CSS visual improvement runbook.
- Extracted `DashboardUpcomingPanel` in `web/packages/pyxis-app/src/components/organisms/Panels.tsx`.
- Updated `DashboardOverview` to use `DashboardUpcomingPanel` and to sort confirmed shows by date before display.
- Extended `ShowsTable` with a `variant="dashboard"` mode so Dashboard uses the prototype columns: date, artist, doors, age, status.
- Extended `ShowTableRow` with a Dashboard variant that reuses:
  - `DateChip`,
  - `StatusDot`,
  - shared row/tag styles,
  - pinned show affordance.
- Extended `DateChip` with an `inline` variant for compact table date cells.
- Added row/tag/pin/empty-state styling in shared CSS.
- Added richer Storybook stories:
  - `UpcomingPanelDesktop`,
  - `UpcomingPanelMobileCards`,
  - `UpcomingPanelLongArtistNames`,
  - `UpcomingPanelEmpty`.
- Marked Phase 7.4 checklist items complete in `tasks.md`, leaving the commit checkbox for the documentation follow-up.
- Preserved focused visual artifacts under:
  - `various/09-dashboard-upcoming-consolidation/`.
- Preserved the desktop full-page checkpoint under:
  - `various/07-dashboard-page/desktop/run-06-upcoming-consolidation/`.

### Why

- Dashboard upcoming shows was still embedded in the page composition and needed to become a reusable organism before other routes/pages copy similar show-list logic.
- Reusing `DateChip`, `ShowTableRow`, `StatusDot`, and `TodayShowCard` keeps the Dashboard aligned with the component system instead of growing one-off table markup.
- The section-level visual loop is the right validation surface; the full-page Dashboard is still too noisy because header/menu/activity/attention are not consolidated.

### What worked

- TypeScript validation passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Focused section run after correcting the section name passed in review band:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section upcoming \
  --summary \
  --outDir ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-04-date-inline \
  --output json
```

Final focused result:

```text
classification: review
changedPercent: 6.558108558108558
changedPixels: 29541
totalPixels: 450450
```

- The inspected crops were structurally close enough for a checkpoint:

```text
various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/left_region.png
various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/right_region.png
various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/diff_only.png
```

- Desktop full-page checkpoint improved from the previous known `16.414974279284106%` to:

```text
run-06-upcoming-consolidation: 12.380606824031984%, 180846 changed pixels, tune-required
```

### What didn't work

- My first focused visual command used the selector-like section name:

```bash
--section dashboard-upcoming
```

It returned no rows because the visual spec section is named `upcoming` even though its selectors are `[data-section="dashboard-upcoming"]`:

```text
sectionCount: 0
rows: []
```

- A combined command ran `css-visual-diff` from inside `web/` after typecheck, which made the relative repository path wrong:

```text
CLI repository "prototype-design/visual-diff/userland": stat /home/manuel/code/wesen/2026-04-23--pyxis/web/prototype-design/visual-diff/userland: no such file or directory
```

I reran the visual command from the repository root and removed the accidental `web/ttmp/` output directory.

### What I learned

- For `compare-spec --section`, use the spec section name (`upcoming`), not the `data-section` attribute value (`dashboard-upcoming`).
- Sorting mock shows before passing them into the Dashboard matters; otherwise the table can show `Zola Jesus` before `Basement Frequencies`, drifting from the prototype order.
- The Dashboard table date presentation is best modeled as a `DateChip` variant, not a separate local date cell.

### What was tricky to build

The tricky part was improving upcoming-shows parity without making one-off components. The prototype table has a compact date cell and limited columns, while the generic `ShowsTable` had full columns including price and draw.

The solution was to add a `dashboard` variant to `ShowsTable`/`ShowTableRow` and an `inline` variant to `DateChip`. This kept reuse explicit while allowing the Dashboard organism to match the prototype's narrower information architecture.

### What warrants a second pair of eyes

- Review whether adding `variant="dashboard"` to `ShowsTable`/`ShowTableRow` is the right abstraction or whether a future dedicated `DashboardShowRow` molecule would be cleaner.
- Review the shared `Panel` CSS change because it affects quick actions, activity, attention, and other page panels.
- Review the `DateChip` `inline` API before other tables reuse it.

### What should be done in the future

- Move on to Phase 7.1 header/menu or Phase 7.5/7.6 quick actions/recent activity.
- Re-check `dashboard-upcoming` only after neighboring Dashboard organisms are consolidated, to avoid overfitting this section in isolation.
- Consider adding a small helper for stable date formatting if more table variants need weekday/month-day combinations.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/organisms/Panels.tsx` (`DashboardUpcomingPanel`, `ShowsTable`),
  - `web/packages/pyxis-app/src/components/molecules/ShowTableRow.tsx`,
  - `web/packages/pyxis-app/src/components/atoms/DateChip.tsx`,
  - `web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Optional visual validation:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml --page dashboard --section upcoming --summary --outDir ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-review --output json
```

### Technical details

Final evidence paths:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/left_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/diff_only.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/07-dashboard-page/desktop/run-06-upcoming-consolidation/dashboard/artifacts/page/right_region.png
```

## Step 17: Consolidate the Dashboard quick actions organism

After committing the upcoming-shows checkpoint, I continued with Phase 7.5 and consolidated the Dashboard quick actions panel. This was a smaller section, but it still needed the same bottom-up treatment: extract a named organism, reuse Button/Icon atoms, add Storybook states, run a focused section comparison, and inspect the crops before accepting the checkpoint.

The final quick-actions focused comparison reached the `review` band. I stopped there because the remaining differences are mostly typography/rendering drift and the app still needs neighboring Dashboard organisms consolidated before final full-page acceptance.

### Prompt Context

**User prompt (verbatim):** (same as Step 16)

**Assistant interpretation:** Continue through the next Dashboard consolidation section after accepting the upcoming-shows checkpoint.

**Inferred user intent:** Keep moving section-by-section through Dashboard consolidation using the established visual loop.

**Commit (code):** 12cc17c — "Consolidate dashboard quick actions"

### What I did

- Added `DashboardQuickActionsPanel` as a named organism in `Panels.tsx`.
- Updated `DashboardOverview` to render `DashboardQuickActionsPanel` instead of inline `Panel` composition.
- Updated `DashboardQuickActionsContent` to reuse Button icon props and full-width behavior:
  - `iconLeft="plus"`,
  - `iconLeft="mail"`,
  - `iconLeft="log"`,
  - `fullWidth` for all three actions.
- Added section-specific quick-actions panel CSS for prototype padding/header spacing while keeping shared panel tokens intact.
- Adjusted the Dashboard desktop column layout from a fractional side column to `1fr 320px` with a `16px` gap, matching the prototype side-column width and improving both quick-actions and upcoming-shows bounds.
- Added Storybook coverage:
  - `QuickActionsPanel`,
  - `QuickActionsPanelNoPending`.
- Preserved visual artifacts under:
  - `various/10-dashboard-quick-actions-consolidation/`,
  - `various/09-dashboard-upcoming-consolidation/run-05-column-width-guard/`.

### Why

- Quick actions was still a page-local panel despite being a clear Dashboard organism.
- The prototype uses icons and full-width actions; reusing Button icon props is preferable to local spans or one-off markup.
- The side-column width was a layout-level mismatch. Fixing it as a shared Dashboard grid decision improved quick actions and guarded upcoming shows at the same time.

### What worked

- TypeScript validation passed after removing an unused Storybook import:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Baseline focused quick-actions comparison before tuning:

```text
run-01-baseline: 15.177930468669881%, 10360 changed pixels, tune-required
```

- After icons and padding:

```text
run-02-icons-padding: 12.03048112669104%, 7799 changed pixels, tune-required
```

- After matching the Dashboard side column width:

```text
run-03-column-width: 9.831349206349206%, 5946 changed pixels, review
```

- The final crops were inspected:

```text
various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/left_region.png
various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/right_region.png
various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/diff_only.png
```

- The upcoming-shows guard run stayed in review band after the shared column-width change:

```text
run-05-column-width-guard: 6.556890001260421%, 29132 changed pixels, review
```

### What didn't work

- Typecheck initially failed because `DashboardQuickActionsContent` became unused in `AppDashboardSections.stories.tsx` after switching stories to the organism:

```text
stories/AppDashboardSections.stories.tsx(11,3): error TS6133: 'DashboardQuickActionsContent' is declared but its value is never read.
```

I removed the unused import and reran typecheck successfully.

### What I learned

- Some section diffs are caused by parent grid layout, not the section internals. Quick actions looked too wide because the Dashboard side column was wider than the prototype.
- A parent layout fix can improve multiple sections; this is exactly why the runbook says to promote repeated/layout decisions instead of locally forcing one panel.

### What was tricky to build

The tricky part was deciding whether to tune button internals or the surrounding grid. The crops showed matching text and very similar button structure after adding icons, but the bounds still had a width delta. That pointed to the Dashboard column definition rather than the buttons themselves.

Changing `.app-dashboard-columns` to `minmax(0,1fr) 320px` with a `16px` gap aligned quick actions to the prototype side rail and kept upcoming shows in the review band.

### What warrants a second pair of eyes

- Review the shared `.app-dashboard-columns` change because it affects upcoming shows, quick actions, and activity layout.
- Review whether `DashboardQuickActionsPanel` belongs in `Panels.tsx` long-term or should move to a dedicated Dashboard organisms file once more sections are extracted.
- Review whether the quick action icon choices (`plus`, `mail`, `log`) match the prototype semantics closely enough.

### What should be done in the future

- Continue with Phase 7.6 recent activity or Phase 7.1 header/menu.
- Re-run quick actions only after adjacent activity/header layout work changes its bounds.
- Consider a dedicated visual spec/story for the whole right rail once quick actions and activity are both consolidated.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx`,
  - `web/packages/pyxis-app/src/components/organisms/Panels.tsx`,
  - `web/packages/pyxis-app/src/components/organisms/Panels.css`,
  - `web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Optional focused visual validation:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml --page dashboard --section quick-actions --summary --outDir ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/10-dashboard-quick-actions-consolidation/run-review --output json
```

### Technical details

Final evidence paths:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/left_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/diff_only.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-05-column-width-guard/dashboard/artifacts/upcoming/right_region.png
```

## Step 18: Park premature Phase 8 work and consolidate Dashboard shell/header

The user clarified that I should finish the still-open Phase 7 subphases before moving into Phase 8. I parked the premature Phase 8 login/setup/shows work in a named git stash, then returned to Dashboard consolidation and handled Phase 7.1 shell/header/menu.

This step also addressed the user's complaint that the app background looked too cream-colored. I lightened the shared canvas/surface tokens so Storybook and page crops read as whitish while preserving the off-white hierarchy through tokens rather than one-off page CSS.

### Prompt Context

**User prompt (verbatim):** "the cream color backgorund is weird, can you fix that ? then continue"

**Assistant interpretation:** Make the app background less cream/beige, then continue Dashboard consolidation in the correct Phase 7 order.

**Inferred user intent:** Keep visual tuning cohesive and avoid moving into Phase 8 before Dashboard shell/header and other open Dashboard phases are complete.

**Commit (code):** 80661fc — "Consolidate dashboard shell and header"

### What I did

- Parked premature Phase 8 work in a named stash:

```bash
git stash push -u -m "WIP phase 8 login setup shows premature" -- ...
```

- Consolidated shell/header organisms:
  - `AppSidebarMenu`,
  - `AppSidebarUserFooter`,
  - `AppMobileBottomNav`,
  - richer `AppTopBar` subtitle/actions.
- Updated `AppShell` to match the prototype shell structure more closely:
  - fixed 1240×760 desktop shell bounds,
  - sidebar section grouping,
  - icons,
  - bookings badge,
  - user footer,
  - search/bell/new-show topbar actions,
  - scrollable main content area.
- Added Storybook stories for shell/header surfaces:
  - `AppSidebarMenu`,
  - `AppTopBarDashboard`,
  - `AppMobileBottomNavigation`.
- Added focused visual spec sections for Dashboard shell/header:
  - `sidebar`,
  - `topbar`.
- Refreshed JS visual spec mirrors.
- Lightened shared tokens in `app-tokens.css`:
  - `--app-canvas` from warm cream to a whiter `#f8f7f3`,
  - `--app-mobile-canvas` to a lighter warm canvas,
  - `--app-surface` to white,
  - login glow/edge and muted surfaces adjusted accordingly.
- Ran typecheck and focused visual comparisons.

### Why

- Phase 7.1 was still open and Dashboard shell/header differences were a major full-page mismatch source.
- The shell is shared by every later page, so it should be an organism-level foundation before Phase 8 pages are implemented.
- The cream color issue was best fixed in tokens so all Storybook/page surfaces update consistently.

### What worked

- TypeScript validation passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Focused sidebar comparison after shell extraction and whiter canvas:

```text
run-02-whiter-canvas sidebar: 6.363036699448308%, 10611 changed pixels, review
```

- Focused topbar comparison after shell extraction and whiter canvas:

```text
run-02-whiter-canvas topbar: 8.47006141701623%, 9571 changed pixels, review
```

- Desktop full-page Dashboard checkpoint improved and had exact bounds alignment:

```text
run-07-shell-header-whiter-canvas: 11.4830220713073%, 108216 changed pixels, tune-required
bounds changed: false, 1240×760 vs 1240×760
```

- Inspected crops with `read`:

```text
various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/sidebar/dashboard/artifacts/sidebar/left_region.png
various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/sidebar/dashboard/artifacts/sidebar/right_region.png
various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/topbar/dashboard/artifacts/topbar/left_region.png
various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/topbar/dashboard/artifacts/topbar/right_region.png
various/07-dashboard-page/desktop/run-07-shell-header-whiter-canvas/dashboard/artifacts/page/right_region.png
```

### What didn't work

- I had started Phase 8 too early. That work is now parked in the stash named:

```text
WIP phase 8 login setup shows premature
```

- The first shell/header run still had the cream surface in shared tokens, so I adjusted tokens and reran the focused comparisons.

### What I learned

- The shell/header work is foundational; it changes bounds and page chrome for every later full-app page.
- The app background concern should be solved with shared tokens, not local Storybook wrappers.
- Focused shell sections are useful because full-page Dashboard still contains remaining hero/metrics/attention noise.

### What was tricky to build

The tricky part was preserving reusable shell organisms while matching prototype-specific Dashboard chrome. The sidebar and topbar are not Dashboard-only, but Dashboard is the current tuning surface. I extracted `AppSidebarMenu`, `AppSidebarUserFooter`, and `AppMobileBottomNav` as shell organisms and validated them through Dashboard-focused specs.

The background color change was also delicate because changing `--app-canvas` affects every page. I kept it token-level and verified sidebar/topbar plus a full-page Dashboard checkpoint.

### What warrants a second pair of eyes

- Review whether `AppShell` should remain fixed-height at desktop Storybook/app compare time or whether production should use a separate min-height mode later.
- Review the whiter canvas token choice before Phase 8 pages depend on it.
- Review whether `AppTopBar` actions should use icon-only buttons long-term or a dedicated `AppTopBarActions` organism.

### What should be done in the future

- Continue Phase 7.2 hero and Phase 7.3 metrics/attention before restoring Phase 8 work.
- Re-run a final Dashboard full-page checkpoint after hero/metrics/attention are consolidated.
- Keep the Phase 8 stash parked until Dashboard reaches Phase 7.7.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/shell/AppShell.tsx`,
  - `web/packages/pyxis-app/src/components/shell/AppShell.css`,
  - `web/packages/pyxis-app/src/styles/app-tokens.css`,
  - `web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx`,
  - `prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Optional visual validation:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml --page dashboard --section sidebar --summary --outDir ttmp/.../various/13-dashboard-shell-header/desktop/run-review/sidebar --output json
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages compare-spec prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml --page dashboard --section topbar --summary --outDir ttmp/.../various/13-dashboard-shell-header/desktop/run-review/topbar --output json
```

### Technical details

Final evidence paths:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/sidebar/dashboard/artifacts/sidebar/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/13-dashboard-shell-header/desktop/run-02-whiter-canvas/topbar/dashboard/artifacts/topbar/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/07-dashboard-page/desktop/run-07-shell-header-whiter-canvas/dashboard/artifacts/page/right_region.png
```

## Step 19: Validate nested visual inspection and pause Dashboard Hero tuning with evidence

The user asked me to validate the new flexible inspection workflow instead of only documenting a desired command shape. I implemented and exercised a spec-aware nested inspection verb, then used it on the Dashboard Hero to inspect the exact button and date-line typography/layout that were difficult to reason about from the section crop alone.

The Hero is not finished yet. The nested inspection proved the instructions and made the button/date typography much more diagnosable, but the final hero crop remains `tune-required`; the next session should continue from the saved evidence rather than guessing at root-level section CSS.

### Prompt Context

**User prompt (verbatim):** "ok, validate your instructions. to make sure they are correct. make the hero perfect."

**Assistant interpretation:** Turn the runbook's proposed nested inspection workflow into a working tool path, validate it against Dashboard Hero subelements, and use it to improve the Hero.

**Inferred user intent:** Avoid speculative CSS tuning by making the visual tooling expose the exact typography/layout differences for nested elements like buttons and date text.

**Commit (code):** ed55e40 — "Add nested visual inspection for dashboard hero"

### What I did

- Implemented `pyxis pages inspect-spec` in `prototype-design/visual-diff/userland/verbs/pyxis-pages.js`.
- Extended typography/layout/surface presets in `prototype-design/visual-diff/userland/lib/styles.js` so nested inspection can report properties such as:
  - `text-transform`,
  - `opacity`,
  - `visibility`,
  - `white-space`,
  - `overflow`,
  - flex/grid alignment,
  - min/max dimensions.
- Updated prototype `Btn` in `prototype-design/lib/components.jsx` to forward rest props so diagnostic `data-element` hooks can be attached.
- Added matching prototype and React `data-element` hooks for Dashboard Hero:
  - `hero-artist`,
  - `hero-date-line`,
  - `hero-date`,
  - `hero-doors`,
  - `hero-age`,
  - `hero-price`,
  - `hero-actions`,
  - `hero-discord-action`,
  - `hero-edit-action`.
- Validated the runbook command pattern against real Dashboard Hero elements using `inspect-spec`.
- Used the new inspection output to tune the Hero button typography/layout and date-line typography/layout.
- Updated the runbook to say the command shape is now validated and to explain when to use `typography` vs `layout` inspection.
- Preserved Dashboard Hero visual artifacts under:
  - `various/14-dashboard-hero-consolidation/`.

### Why

- The `compare-spec --summary` row only reports root-level section styles, so it could not explain why the `View on Discord` button label looked wrong or why the `Fri, May 2, 2025` line drifted.
- Nested inspection lets us compare the same subelement on the prototype and React side with the exact CSS properties needed for the current question.
- Stable hooks are more reliable than one-off Playwright snippets and make the diary/review evidence reproducible.

### What worked

- TypeScript validation passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- The new `inspect-spec` command worked for app specs after the earlier default-registry failure:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --elements '[data-element="hero-discord-action"],[data-element="hero-date-line"],[data-element="hero-date"]' \
  --stylePreset typography \
  --summary \
  --output json
```

- It proved the `View on Discord` typography matched after tuning:

```text
hero-discord-action typography: no styleDiffs
textChanged: false
left/right text: View on Discord
font-size: 13px both
font-weight: 500 both
line-height: 15.6px both
color: rgb(255, 255, 255) both
```

- It proved the date text content and typography mostly matched:

```text
hero-date textChanged: false
left/right text: Fri, May 2, 2025
font-size: 13px both
font-weight: 400 both
line-height: 19.5px both
letter-spacing: normal both
remaining typography diff: rgba(255,255,255,.7) vs rgba(255,255,255,.72)
```

- Layout inspection then exposed remaining positional/bounds differences for the same elements:

```text
hero-discord-action layout: display/gap/padding/width/height matched after tuning
hero-actions layout: display/gap/width/height matched after tuning
hero-date-line layout: x matched, but width differed after allowing the text column to flex
hero-artist layout: width differed and React still had margin-top 8px vs prototype 0px
```

- Final section comparison improved some element-level details but did not finish the section:

```text
run-06-button-date-inspect: 18.089362654580047%, 25862 changed pixels, tune-required
```

- Inspected final crops:

```text
various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/left_region.png
various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/right_region.png
various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/diff_only.png
```

### What didn't work

- The first attempt to use the old `inspect-section` command failed because it read the default public-page registry rather than the app visual spec:

```text
Error: unknown page: dashboard
```

- The root-level Hero comparison stayed in `tune-required` even after nested typography matched, because residual differences are now layout/mark/overall section composition rather than just button/date typography.
- A `data-pyxis-part="label"` selector is available on React buttons but not on the prototype `Btn`, so comparing the button root is more reliable unless prototype button internals also get part hooks.

### What I learned

- The new workflow is valid: use `compare-spec` to find the mismatching section, inspect individual crops, then use `inspect-spec` with `typography` and `layout` on specific subelements.
- Button and date typography were not the only remaining Hero problem. After those matched, the hero still drifted because of positioning, decorative mark geometry, and text-column/action-column proportions.
- Subelement hooks should be added to both prototype and React before repeated tuning; otherwise selectors either miss on one side or compare the wrong level.

### What was tricky to build

The tricky part was making inspection spec-aware without disrupting the existing compare flow. The old registry-based inspect path did not know about `app.pages.desktop.visual.yml`, so I added a new `inspect-spec` verb that resolves page, section, URLs, viewport, and selectors directly from the passed spec.

The other tricky part was selector scoping. The new command treats element selectors as relative to the section selector by default, supports `&` for the section root, and lets absolute-ish selectors pass through when they already include `data-section`, `html`, or `body`.

### What warrants a second pair of eyes

- Review `inspect-spec` implementation for selector scoping edge cases and whether comma-separated selectors are enough or whether it should eventually accept YAML/JSON element specs.
- Review whether prototype `Btn` should get `data-pyxis-component`/`data-pyxis-part` hooks to make shared component subpart comparisons easier.
- Review the current Dashboard Hero CSS before continuing; the section is not accepted and should not be marked complete.

### What should be done in the future

- Continue Phase 7.2 Hero tuning from the nested inspection evidence.
- Next likely Hero targets:
  - remove React `hero-artist` margin-top drift,
  - align Hero text column/action column proportions,
  - tune decorative `PyxisMark` placement/opacity/shape,
  - re-run `inspect-spec --stylePreset layout` for `hero-artist`, `hero-date-line`, and `hero-actions`,
  - then re-run the Hero section comparison.
- Consider adding a ticket script for nested inspect commands once the pattern is used more than once.

### Code review instructions

- Start with:
  - `prototype-design/visual-diff/userland/verbs/pyxis-pages.js`,
  - `prototype-design/visual-diff/userland/lib/styles.js`,
  - `prototype-design/lib/components.jsx`,
  - `prototype-design/screens/auth-dash.jsx`,
  - `web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx`,
  - `web/packages/pyxis-app/src/components/organisms/Panels.css`,
  - `ttmp/.../playbooks/02-pyxis-app-css-visual-improvement-loop.md`.
- Validate the new tool path with:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --elements '[data-element="hero-discord-action"],[data-element="hero-date-line"],[data-element="hero-date"]' \
  --stylePreset typography \
  --summary \
  --output json
```

- Validate the app with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

### Technical details

Final evidence paths:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/left_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/diff_only.png
```

## Step 20: Stop Hero work after title typography parity checkpoint

After the user clarified that the remaining Hero background/decorative mark drift was not the priority, I focused only on the left-side title typography. I used the validated `inspect-spec` workflow to compare the `hero-artist` element directly, made the smallest CSS change, and saved a focused Hero comparison as a checkpoint before moving on.

This does not complete Phase 7.2. It records an intentional stop point: the title typography is now aligned, the section diff improved materially, and the remaining drift is mostly non-title composition/mark/layout work that should not block moving to the next Dashboard section.

### Prompt Context

**User prompt (verbatim):** "\"diffOnlyPath\":                                                                               
 \"ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14 
 -dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/diff_only.png\",   
       \"leftRegionPath\":                                                                             
 \"ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14 
 -dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/left_region.png\", 
       \"leftSelector\": \"[data-section=\\\"dashboard-hero\\\"]\",                                          
       \"page\": \"dashboard\",                                                                          
       \"rightRegionPath\":                                                                            
 \"ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14 
 -dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/right_region.png\" 
 ,                                                                                                   
       \"rightSelector\": \"[data-section=\\\"dashboard-hero\\\"]\",                                         
       \"section\": \"hero\",                                                                            
       \"styleChangeCount\": 2,                                                                        
       \"styleDiffs\": [                                                                               
         {                                                                                           
           \"left\": \"13px\",                                                                           
           \"property\": \"font-size\",                                                                  
           \"right\": \"14px\"                                                                            
         },                                                                                          
         {                                                                                           
           \"left\": \"19.5px\",                                                                         
           \"property\": \"line-height\",                                                                
           \"right\": \"20.3px\"                                                                         
         }                                                                                            
       ],                                                                                            
       \"text\": {                                                                                     
         \"changed\": true,                                                                            
         \"left\": \"Next on stage · in 9 daysBurial HexFri, May 2, 2025Doors 8:00 PM21+$12 adv / $15   
 doorView on DiscordEdit show\",                                                                      
         \"right\": \"Next on stage · in 9 daysBurial HexFri, May 2, 2025Doors 8:00 PM21+$12 adv / $15  
 doorFri, May 2, 2025 · Doors 8:00 PM · 21+View on DiscordEdit show\"                                 
       },                                                                                            
       \"threshold\": 30,                                                                              
       \"totalPixels\": 142968,                                                                      
       \"variant\": \"desktop\"                                                                          
     }                                                                                               
   ],                                                                                                
   \"sectionCount\": 1                                                                                 
 }                                                                                                   
 ]                                                                                                   
                                                                                                     
 Took 5.6s                                                                                           
                                                                                                     

                                                                                                     
 read                                                                                                
 ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14- 
 dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/left_region.png    
                                                                                                     
 Read image file [image/png]                                                                         
                                                                                                     





                                                                                                     
 read                                                                                                
 ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14- 
 dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/right_region.png   
                                                                                                     
 Read image file [image/png]                                                                         
                                                                                                     





                                                                                                     
 read                                                                                                
 ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14- 
 dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/diff_only.png      
                                                                                                     
 Read image file [image/png]                                                                         
                                                                                                     





 Adjusting mark sizes                                                                                
                                                                                                     
 I see that the marks are visually close, but the left mark is too far or too large. The right       
 circle starts at x=794 but appears larger, possibly due to stroke differences. In the prototype,    
 PyxisMark size is set to 300 on the right, and I need to adjust the top from -80 to -60. The left   
 mark's opacity is .1 and the right mark's is .9. I also need to consider hero height and align the  
 content correctly. It seems I need to set height to 142, not min-height, to ensure everything lines 
 up visually.                                                                                        
                                                                                                     
 Evaluating adjustments                                                                              
                                                                                                     
 It looks like the alignment might be off by about 3 pixels, but it's generally fine. The text       
 differences include a mobile paragraph that's hidden, so I could add aria-hidden to it; it won’t    
 affect the pixel layout. For the summary, I might consider removing the mobile paragraph from the   
 text—it might not be necessary. To reduce pixel discrepancies, I may need to adjust the mark.       
 There's also a visible rectangle on the right hero at x=755 that aligns with the left, but the mark 
 appears slightly darker and larger. I should run this.      

---

This is where we stopped. Don't worry about background, focus on typography on the left for the title, then move on ."

**Assistant interpretation:** Ignore remaining decorative/background drift, verify and fix the left-side Hero title typography only, then stop chasing the Hero and continue to the next section.

**Inferred user intent:** Preserve momentum near the end of the Dashboard pass by accepting a targeted Hero typography checkpoint instead of spending more time on mark/background pixel drift.

**Commit (code):** b2fd3dc — "Tune dashboard hero title typography"

### What I did

- Ran `inspect-spec` against `[data-element="hero-artist"]` with `--stylePreset typography`.
- Found that the React Hero title matched font family, size, weight, line-height, and color, but missed prototype letter-spacing:
  - prototype: `letter-spacing: -0.8px`,
  - React: `letter-spacing: normal`.
- Updated `web/packages/pyxis-app/src/components/organisms/Panels.css` so `.app-dashboard-hero h2` uses:
  - `margin: 0 0 6px`,
  - `letter-spacing: -0.02em`.
- Re-ran typography and layout inspection for `hero-artist`.
- Re-ran the focused Hero comparison and saved artifacts in:
  - `various/14-dashboard-hero-consolidation/run-07-title-typography/`.
- Inspected `left_region.png`, `right_region.png`, and `diff_only.png` with `read`.
- Validated the app typecheck:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

### Why

The user explicitly asked not to worry about the background and to focus on the left-side title typography. The previous diff still had many red pixels around the decorative mark, but the actionable typography mismatch was the title letter-spacing and vertical offset.

### What worked

- `inspect-spec` confirmed title typography parity after the CSS change:

```text
hero-artist typography: no styleDiffs
textChanged: false
font-family: Fraunces, Georgia, "Times New Roman", serif both
font-size: 40px both
font-weight: 500 both
letter-spacing: -0.8px both
line-height: 42px both
color: rgb(255, 255, 255) both
```

- The focused Hero comparison improved:

```text
previous run-06-button-date-inspect: 18.089362654580047%, 25862 changed pixels, tune-required
run-07-title-typography: 11.25010935176275%, 15432 changed pixels, tune-required
bounds: 966 x 142 on both sides, y delta 0.75
```

- The left and right crops showed the title placement/shape is now close enough for this targeted checkpoint.

### What didn't work

- The Hero section is still not in review-band. Remaining red pixels are mostly around the decorative mark/action area and overall composition, not title typography.
- The section summary still reports root-level `font-size`/`line-height` differences because the root crop includes mixed text; subelement inspection is the reliable evidence for the title itself.

### What I learned

- Subelement inspection prevented over-tuning the whole Hero root when only the title was in scope.
- Removing the React title's top margin mattered as much as letter-spacing because the previous title y-position drift made the crop look more different than the typography properties alone suggested.

### What was tricky to build

The tricky part was not being distracted by `diff_only.png`. The diff still highlights large decorative mark and action-area differences, but the user's instruction narrowed the task to title typography. I used `inspect-spec` to keep the decision scoped to `hero-artist` and avoided unrelated background/mark adjustments.

### What warrants a second pair of eyes

- Confirm whether Phase 7.2 should remain open for a future Hero organism/storybook pass or whether this targeted typography checkpoint is enough for the current Dashboard acceptance strategy.
- Review whether `.app-dashboard-hero h2` should eventually use a shared display-title token instead of local letter-spacing.

### What should be done in the future

- Move on to Phase 7.3 Dashboard metrics/attention consolidation.
- If returning to Hero later, focus on named organism extraction/story states and the decorative mark/action-area layout, not the title typography.

### Code review instructions

- Review:
  - `web/packages/pyxis-app/src/components/organisms/Panels.css`, `.app-dashboard-hero h2`.
- Validate with:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --elements '[data-element="hero-artist"]' \
  --stylePreset typography \
  --summary \
  --output json

cd web && pnpm --filter pyxis-app typecheck
```

### Technical details

Final checkpoint artifacts:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-07-title-typography/dashboard/artifacts/hero/left_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-07-title-typography/dashboard/artifacts/hero/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-07-title-typography/dashboard/artifacts/hero/diff_only.png
```

## Step 21: Split Dashboard organisms into their own Storybook stories

The user asked to extract the Dashboard organisms into their own stories so section review and future visual comparison can happen without depending on full-page scroll position. I separated the already-extracted Dashboard sections into organism-level Storybook files and kept the aggregate Dashboard sections story as a broad showcase.

This is a Phase 7.3 setup step, not the final metrics/attention visual-tuning step. It gives each Dashboard organism a direct iframe story target, which should make focused visual specs simpler and avoid debugging offscreen page crops.

### Prompt Context

**User prompt (verbatim):** "can you extract the organisms into their own stories?"

**Assistant interpretation:** Create standalone Storybook story files for Dashboard organisms rather than relying on the large combined Dashboard sections story or full page stories.

**Inferred user intent:** Make focused review and visual-diff crops target the organism iframe directly, avoiding page scrolling/offscreen screenshot issues.

**Commit (code):** b1180ae — "Add dashboard organism Storybook coverage"

### What I did

- Extracted `DashboardMetricsGrid` around the existing `MetricCard` usage.
- Added desktop/mobile metric copy variants:
  - desktop: `Pending bookings`, `Capacity use`, fuller captions/trends,
  - mobile: `Pending`, `Capacity`, shorter captions, hidden trend lines.
- Turned the attention list data into typed `DashboardAttentionItem` records.
- Made `DashboardAttentionContent` accept custom items and support an empty state.
- Added `DashboardAttentionPanel` as a named organism wrapper.
- Added standalone organism Storybook files:
  - `DashboardHero.stories.tsx`,
  - `DashboardMetricsGrid.stories.tsx`,
  - `DashboardUpcomingPanel.stories.tsx`,
  - `DashboardQuickActionsPanel.stories.tsx`,
  - `DashboardActivityPanel.stories.tsx`,
  - `DashboardAttentionPanel.stories.tsx`.
- Updated the combined `AppDashboardSections.stories.tsx` to reuse the new organisms instead of duplicating metric/attention JSX.
- Updated Phase 7.3 task checkboxes for metrics/attention extraction and Storybook coverage.

### Why

Full dashboard/page stories are useful checkpoints, but they are too noisy for focused organism work. Separate organism stories make it possible to point reviewers and future visual specs at a direct iframe such as:

```text
pyxis-app-organisms-dashboardmetricsgrid--desktop
pyxis-app-organisms-dashboardattentionpanel--desktop
```

That avoids offscreen section capture problems and keeps tuning loops scoped to one organism.

### What worked

- Typecheck passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Story modules loaded over the live Storybook server:

```bash
curl -fsS http://localhost:6008/stories/DashboardHero.stories.tsx
curl -fsS http://localhost:6008/stories/DashboardMetricsGrid.stories.tsx
curl -fsS http://localhost:6008/stories/DashboardAttentionPanel.stories.tsx
```

- Playwright confirmed the direct organism iframe stories render without app errors:

```text
http://localhost:6008/iframe.html?id=pyxis-app-organisms-dashboardmetricsgrid--desktop&viewMode=story
selector present: [data-section="dashboard-metrics"]

http://localhost:6008/iframe.html?id=pyxis-app-organisms-dashboardattentionpanel--desktop&viewMode=story
selector present: [data-section="dashboard-attention"]

http://localhost:6008/iframe.html?id=pyxis-app-organisms-dashboardhero--desktop&viewMode=story
selector present: [data-section="dashboard-hero"]
```

### What didn't work

- I briefly tried to solve the desktop attention comparison by changing compare-region scrolling/viewport behavior and by adding page-level desktop reminder composition. I reverted those changes because the user clarified that organism stories should avoid needing scroll-based screenshots in the first place.
- The focused metrics/attention visual comparison step is not complete yet; this step only creates the organism story targets needed for the next clean comparison pass.

### What I learned

- Standalone organism stories are the right target for the next visual specs when a section sits below the fold in the full page.
- The combined Dashboard sections story is still useful as an overview, but it should not be the primary target for focused section validation.

### What was tricky to build

The tricky part was separating reusable organism data/config from page composition without accidentally changing the dashboard page behavior. The first attempt mixed in extra desktop reminder composition, which would have changed the page. I backed that out and kept the commit focused on organism extraction and Storybook targets.

### What warrants a second pair of eyes

- Confirm whether future visual specs should add dedicated organism targets for the new story IDs instead of using full-page dashboard sections.
- Review the mobile-vs-desktop metric copy decision before final visual acceptance.
- Review whether `DashboardAttentionPanel` should eventually use real icon atoms instead of the current symbolic glyphs.

### What should be done in the future

- Add focused visual spec entries that compare metrics/attention against direct organism stories rather than full-page scroll positions.
- Run visual comparisons for `DashboardMetricsGrid` and `DashboardAttentionPanel` from those story targets.
- Continue Phase 7.3 visual tuning, then proceed to Phase 7.7 dashboard acceptance.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx`,
  - `web/packages/pyxis-app/src/components/organisms/Panels.tsx`,
  - `web/packages/pyxis-app/stories/DashboardMetricsGrid.stories.tsx`,
  - `web/packages/pyxis-app/stories/DashboardAttentionPanel.stories.tsx`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Smoke direct Storybook organism iframes:

```text
http://localhost:6008/iframe.html?id=pyxis-app-organisms-dashboardhero--desktop&viewMode=story
http://localhost:6008/iframe.html?id=pyxis-app-organisms-dashboardmetricsgrid--desktop&viewMode=story
http://localhost:6008/iframe.html?id=pyxis-app-organisms-dashboardattentionpanel--desktop&viewMode=story
```

### Technical details

New organism story IDs include:

```text
pyxis-app-organisms-dashboardhero--desktop
pyxis-app-organisms-dashboardmetricsgrid--desktop
pyxis-app-organisms-dashboardmetricsgrid--mobile
pyxis-app-organisms-dashboardupcomingpanel--desktop
pyxis-app-organisms-dashboardquickactionspanel--default
pyxis-app-organisms-dashboardactivitypanel--default
pyxis-app-organisms-dashboardattentionpanel--desktop
pyxis-app-organisms-dashboardattentionpanel--dense
pyxis-app-organisms-dashboardattentionpanel--empty
```

## Step 22: Refocus Shows visual tuning around extracted table organisms

The Shows page had drifted into a page-level checkpoint that was not visually credible enough. I reset the loop around the Confirmed and Archived shows panels as focused organisms, then used the existing inspect/compare tooling to make the table rows, status pills, age badges, draw meters, icons, and archived table content match the prototype more closely.

This step is deliberately scoped to Shows rather than all Phase 8.4–8.7 pages. It extracts the right reusable pieces first, adds story targets, validates with individual crops, and records where the tool still has a weakness for below-the-fold prototype sections.

### Prompt Context

**User prompt (verbatim):** "Read the diary skill, Read the runbook. We are losing the plot a bit, 8.4 - 8.7 are not up to snuff visually, and we should focus on some of the sub elements in there. Let's start with shows. This is the starting point /tmp/pi-clipboard-70daf102-8bbd-48e7-9aea-7e600d73a1c8.png  and then this is /tmp/pi-clipboard-2b56ac72-aa8e-47a7-9ed2-cd24b40229a4.png where we are at right now. We want to tune this up visually by having our own organism story that we can t arget specifically to make sure the rows and typography colors and columns and all that matches, because this doesn't look good.

Continue keeping a diary, read up on where we are, use your javascript tools to the best of their flexibility, and commit as we go.

Start with shows"

**Assistant interpretation:** Stop broad Phase 8 page work, focus on the Shows page with direct organism stories and subelement inspection, and commit incremental visual improvements.

**Inferred user intent:** Recover the bottom-up visual parity workflow by tuning the Shows table at the row/atom/column level instead of accepting noisy full-page checkpoints.

**Commit (code):** 4020ea8 — "Tune shows confirmed organism"

**Commit (code):** b1d3c0b — "Align shows row typography atoms"

**Commit (code):** f980631 — "Align shows archived table and tokens"

### What I did

- Re-read the diary skill and the Pyxis app CSS visual improvement loop runbook before making further changes.
- Added prototype section hooks for Shows:
  - `data-section="shows-filters"`,
  - `data-section="shows-confirmed"`,
  - `data-section="shows-archived"`.
- Extracted Shows-specific organisms:
  - `ShowsFilterBar`,
  - `ShowsConfirmedPanel`,
  - `ShowsArchivedPanel`.
- Added reusable table atoms:
  - `AgeBadge`,
  - `StatusPill`,
  - `DrawProgress`.
- Added direct Shows organism stories:
  - `ConfirmedPanel`,
  - `ArchivedPanel`,
  - `Filters`,
  - `RowAtoms`.
- Updated the full Shows page to use the extracted organisms rather than inline panel/table composition.
- Reworked `ShowTableRow` so the full Shows table includes the prototype columns:
  - `#`,
  - `Date`,
  - `Artist`,
  - `Doors`,
  - `Age`,
  - `Price`,
  - `Draw`,
  - `Status`,
  - edit action.
- Matched the confirmed row content and row atom behavior:
  - status pill label case and dot placement,
  - SVG pin/edit icons instead of glyph fallbacks,
  - draw progress bar with over-capacity accent state,
  - age badge sizing/weight/color,
  - date and price typography.
- Fixed archived content so it matches the prototype columns instead of incorrectly reusing the confirmed table:
  - `Date`,
  - `Artist`,
  - `Genre`,
  - `Draw`,
  - `Status`.
- Consolidated Shows table typography into CSS variables on `.app-shows-table` / `.app-shows-archived-table` rather than continuing to scatter one-off font values.
- Added visual spec targets for `shows-confirmed-panel` and `shows-archived-panel` in `app.components.visual.yml` and regenerated JS mirrors.

### Why

The previous Shows checkpoint was visually wrong even when the page-level diff looked tolerable. The table had date chips instead of prototype inline date cells, no `#` column, no edit column, plain status text instead of a pill, no draw progress bar, and the archived table reused the confirmed table content. Those are structural mismatches, not subtle rendering differences.

Extracting the organisms and row atoms gives the visual loop stable Storybook targets and reusable building blocks for future Shows/detail pages.

### What worked

- Typecheck passed after each tuning step:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Confirmed panel visual loop moved from tune-required to review:

```text
run-01-baseline: 11.665332654199714%, tune-required
run-06-svg-icons-label: 9.78222670425462%, review
run-09-status-pill-fix: 9.564375456845118%, review
```

- `inspect-spec` confirmed that some row typography now matches directly:
  - price text: no style diffs after setting 12px / 400 / 18px,
  - age badge: no typography style diffs after setting 11px / 400 / 16.5px,
  - date cell wrapper: no typography style diffs after setting 13px / 19.5px.
- Archived table text content now matches the prototype:

```text
Archived · 2See all past showsDateArtistGenreDrawStatusFri, Mar 14, 2025Planning for BurialAmbient34 attendedArchivedFri, Feb 28, 2025ActressElectronic61 attendedArchived
```

- Archived panel page checkpoint improved to accepted-band numerically after the content and token pass:

```text
run-04-font-tokens: 0.9796495480482755%, accepted
```

### What didn't work

- I initially missed the exact date/price/status/age font weight and size differences until the user called them out.
- I first inspected `td:nth-child(8) span`, which selected the React wrapper span instead of the actual `StatusPill`; this made the status pill look like it still had the wrong font even after the pill itself was closer.
- The archived organism spec still has a prototype capture issue: because the prototype archived panel is below the fold in `shows.html`, the individual left crop can appear blank even with a tall viewport. The page checkpoint text/content evidence is still useful, but the organism spec needs a better prototype-only target or scroll support before it is a trustworthy crop source for archived.

### What I learned

- Structural table parity matters before pixel percentages. The confirmed table needed the same columns and inline row atoms before CSS tuning was meaningful.
- The global `.app-table-row span` rule can accidentally override atom layout; this caused the `StatusPill` dot to stack above the label until the pill and nested dot forced inline layout in table rows.
- `inspect-spec` is useful, but selectors must target the same semantic element on both sides; otherwise it can report diffs on wrapper elements rather than the visible atom.

### What was tricky to build

The hardest part was separating table-wide typography from atom-level overrides. Shows rows share the generic app table CSS, but the prototype table uses tighter, smaller typography than several other app pages. I introduced Shows-scoped CSS variables on `.app-shows-table` / `.app-shows-archived-table` so the confirmed and archived rows can share values without changing every app table globally.

The archived visual loop was also tricky because the prototype archived panel sits below the visible crop area. I added a direct Storybook target for the React side, but the prototype side still comes from the full Shows page. That produced good text/content comparison evidence, but the individual crop can be blank. This should be fixed with a standalone prototype section target or a deliberate scroll-aware tool improvement before doing deeper archived visual tuning.

### What warrants a second pair of eyes

- Review whether the Shows table CSS variables belong in a dedicated Shows CSS file instead of `Rows.css` once more Shows-specific organisms are added.
- Review whether the archived panel should get a standalone prototype route/fixture so its organism crop is not affected by below-the-fold capture behavior.
- Review whether `StatusPill`, `AgeBadge`, and `DrawProgress` should be exported from `web/packages/pyxis-app/src/index.ts` for reuse by future pages/stories.

### What should be done in the future

- Add a prototype-side isolated Shows confirmed/archived fixture or improve the visual tool deliberately for below-the-fold section capture.
- Continue Shows tuning with filter chips and full page checkpoint after confirmed/archived sections are stable.
- Apply the same atom/organism-first loop to the next problematic Phase 8 page instead of moving broadly through multiple routes.

### Code review instructions

- Start with:
  - `web/packages/pyxis-app/src/components/organisms/ShowsSections.tsx`,
  - `web/packages/pyxis-app/src/components/molecules/ShowTableRow.tsx`,
  - `web/packages/pyxis-app/src/components/molecules/Rows.css`,
  - `web/packages/pyxis-app/src/components/atoms/StatusPill.tsx`,
  - `web/packages/pyxis-app/src/components/atoms/AgeBadge.tsx`,
  - `web/packages/pyxis-app/src/components/atoms/DrawProgress.tsx`,
  - `web/packages/pyxis-app/stories/ShowsOrganisms.stories.tsx`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Re-run focused visual checks:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page shows-confirmed-panel \
  --section component \
  --summary \
  --outDir ttmp/.../various/17-shows-confirmed-tuning/run-N \
  --output json
```

### Technical details

Important artifact folders:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/17-shows-confirmed-tuning/
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/18-shows-archived-tuning/
```

Important final checkpoints:

```text
confirmed: run-09-status-pill-fix, 9.564375456845118%, review
archived content: run-03-action-copy, 1.3387880235706322%, review, text unchanged
archived font-token pass: run-04-font-tokens, 0.9796495480482755%, accepted numerically but crop caveat applies
```

## Step 23: Tune Bookings awaiting-review and recently-processed organisms

After the Shows pass, I applied the same bottom-up workflow to the Bookings page. The focus was only the two primary left-column organisms: `Awaiting review` and `Recently processed`, because those are the sections the user called out and they are the highest-signal areas before tuning the full page.

This step keeps the prototype and React sections targetable, reshapes the React booking cards/table to match the prototype structure, and records the remaining queue-panel difference as a visual review item instead of continuing to guess at page-level CSS.

### Prompt Context

**User prompt (verbatim):** "now do the same with tbookins page, and 

- awaiting review
- recently processed"

**Assistant interpretation:** Repeat the Shows organism-first visual parity loop for the Bookings page, specifically the awaiting-review queue and recently-processed table.

**Inferred user intent:** Improve the problematic Bookings page by extracting/tuning the main organisms and their row/card subelements rather than accepting broad page-level checkpoints.

**Commit (code):** caeefa4 — "Tune bookings queue and processed organisms"

### What I did

- Added prototype section hooks:
  - `data-section="bookings-queue"`,
  - `data-section="bookings-processed"`.
- Updated desktop visual specs to use the new prototype hooks instead of fragile `main > div:nth-child(...)` selectors.
- Added component-level visual targets:
  - `bookings-queue-panel`,
  - `bookings-processed-panel`.
- Resized `BookingsOrganisms` stories so the React panel width matches the prototype left-column panel width more closely.
- Rebuilt `BookingCard` to match the prototype pending-card structure:
  - Fraunces artist title,
  - pending status pill,
  - metadata row with calendar/music/users/external icons,
  - submitted/date-available row,
  - Hold / Decline / Approve actions.
- Rebuilt `BookingQueueRow` and `BookingsProcessedPanel` to match the prototype processed table:
  - columns: Artist, Requested, Genre, Submitted, Status,
  - no draw/link columns in processed table,
  - `View archive` action.
- Added bookings-specific table/card CSS in `Rows.css` and panel root tuning in `Panels.css`.
- Extended `StatusPill` pending/hold/declined visual states and added booking-card scoped status pill rules so pending pills render with the correct pale amber surface.

### Why

The previous Bookings React checkpoint showed generic booking cards and a processed section that mixed mobile cards with a desktop table. The prototype has a richer pending-review card and a compact processed table. Matching the section structure first makes later font/spacing tuning meaningful.

### What worked

- Typecheck passed:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Component comparisons after tuning:

```text
bookings-queue-panel run-06-booking-status-css: 11.72947581936586%, tune-required
bookings-processed-panel run-06-booking-status-css: 5.116919433308128%, review
```

- The processed panel text now matches the prototype:

```text
Recently processedView archiveArtistRequestedGenreSubmittedStatusOrphxJul 4EBMApr 18ApprovedArcaJul 12ExperimentalApr 15Declined
```

- The processed right crop now visually shows only the compact table, not the earlier accidental mobile card stack.
- The queue crop now has the correct pending-card structure, icons, buttons, status pill surface, and artist-title typography.

### What didn't work

- The first page-section selectors for bookings were wrong/noisy: `queue` initially captured the topbar area and `processed` captured too much of the page. Adding prototype `data-section` hooks fixed the target contract.
- The first processed React organism included hidden/mobile card content in the text comparison and visibly rendered the wrong card view in the organism story. Replacing the organism body with a direct processed table fixed that.
- `StatusPill.css` did not appear in the bookings card rendering until I added bookings-card scoped status pill rules in `Rows.css`; the status pill had briefly collapsed to transparent text with the dot touching the label.

### What I learned

- Root `styleDiffs` were immediately useful: they showed the panel should inherit 13px / 19.5px instead of 14px / 20.3px. Applying that to the bookings panel roots removed most root style diffs.
- The component-level story viewport matters: at the earlier viewport, responsive rules made processed render mobile cards, which made the organism comparison lie about desktop table parity.
- The processed section is now a good candidate for stopping in review band; the queue section still needs more subelement-level work if we want it below 10%.

### What was tricky to build

The tricky part was separating mobile booking-card reuse from the desktop processed table. The old `BookingQueue` organism intentionally included both mobile cards and a desktop table, but for direct desktop organism comparison that made text and crop validation noisy. I kept `BookingQueue` available in `Panels.tsx`, but made `BookingsProcessedPanel` render the exact processed table it needs.

The queue is harder because the prototype card is a dense, multi-row flex layout with action buttons on the right. The React card now has the same content, but residual drift remains from line wrapping, icon rendering, and slight row-density differences.

### What warrants a second pair of eyes

- Review whether `BookingCard` should have explicit variants (`pendingReview`, `mobileSummary`, `processedSummary`) instead of one shape serving all contexts.
- Review whether the booking-card scoped `StatusPill` CSS should be moved into a more formal shared status-pill token set.
- Review the queue panel remaining `tune-required` result and decide whether to continue subelement inspection or accept it as a structured checkpoint.

### What should be done in the future

- Continue queue tuning with explicit prototype/React `data-element` hooks on title, status pill, metadata row, submitted row, and action buttons.
- Add mobile-specific booking-card stories once desktop queue/processed parity is accepted.
- Re-run the full Bookings page checkpoint after the queue section is under review band or explicitly accepted.

### Code review instructions

- Start with:
  - `prototype-design/screens/shows-bookings.jsx`,
  - `web/packages/pyxis-app/src/components/molecules/BookingCard.tsx`,
  - `web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx`,
  - `web/packages/pyxis-app/src/components/molecules/Rows.css`,
  - `web/packages/pyxis-app/stories/BookingsOrganisms.stories.tsx`.
- Validate with:

```bash
cd web && pnpm --filter pyxis-app typecheck
```

- Re-run focused comparisons:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page bookings-queue-panel \
  --section component \
  --summary \
  --outDir ttmp/.../various/19-bookings-panels-tuning/run-N/queue \
  --output json

css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page bookings-processed-panel \
  --section component \
  --summary \
  --outDir ttmp/.../various/19-bookings-panels-tuning/run-N/processed \
  --output json
```

### Technical details

Important final artifacts:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/19-bookings-panels-tuning/run-06-booking-status-css/queue/bookings-queue-panel/artifacts/component/right_region.png
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/19-bookings-panels-tuning/run-06-booking-status-css/processed/bookings-processed-panel/artifacts/component/right_region.png
```
