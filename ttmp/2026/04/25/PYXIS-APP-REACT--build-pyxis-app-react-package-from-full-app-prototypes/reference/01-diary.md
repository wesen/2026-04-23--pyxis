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
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
      Note: Initial pyxis-app component visual suite
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/02-inventory-prototype-routes.mjs
      Note: Ticket-local route inventory script
    - Path: web/packages/pyxis-app/src/App.tsx
      Note: New responsive app route package scaffold (commit 05b60dad9ef797b0ca29045e14c6218fc9955353)
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query app API slice and hooks
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.tsx
      Note: Initial Phase 5-6 staff app organisms and page composition components
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
