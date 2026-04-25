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
    - Path: prototype-design/visual-diff/userland/lib/compare-region.js
      Note: Threaded section filter through compare-spec target execution
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
      Note: Initial pyxis-app component visual suite
    - Path: prototype-design/visual-diff/userland/verbs/pyxis-pages.js
      Note: Added compare-spec --section and --summary operator output (commit 666db83420d99c6d38b5425187af0763e0c8ede9)
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
    - Path: web/packages/pyxis-app/src/App.tsx
      Note: New responsive app route package scaffold (commit 05b60dad9ef797b0ca29045e14c6218fc9955353)
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query app API slice and hooks
    - Path: web/packages/pyxis-app/src/components/atoms/StatusDot.css
      Note: Centralized status colors/rings through CSS variables
    - Path: web/packages/pyxis-app/src/components/molecules/MetricCard.css
      Note: React MetricCard CSS tuned through Phase 6A visual loop (commit 39468164c2611f748a2b2cdfdad34dd567d6beee)
    - Path: web/packages/pyxis-app/src/components/molecules/Rows.css
      Note: Replaced local surface/status values with app tokens
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.css
      Note: Responsive dashboard layout and mobile-specific ordering
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.tsx
      Note: |-
        Initial Phase 5-6 staff app organisms and page composition components
        Dashboard hero
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.css
      Note: |-
        Replaced local dark-surface colors/shadows/radii with app tokens
        Light desktop sidebar and static mobile bottom nav
    - Path: web/packages/pyxis-app/src/styles/app-tokens.css
      Note: Expanded cohesive app theme variables before Phase 7 (commit fba5369)
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
