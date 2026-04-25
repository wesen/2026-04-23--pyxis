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
    - Path: prototype-design/lib/components.jsx
      Note: Prototype Stat/MetricCard selector instrumentation (commit bb41b0c4abad20af5a24a4aa16de8fc837122cda)
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
      Note: Initial pyxis-app component visual suite
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/02-inventory-prototype-routes.mjs
      Note: Ticket-local route inventory script
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh
      Note: Ticket-local focused visual comparison script
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/left_region.png
      Note: Final prototype individual crop inspected with read
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/right_region.png
      Note: Final React individual crop inspected with read
    - Path: web/packages/pyxis-app/src/App.tsx
      Note: New responsive app route package scaffold (commit 05b60dad9ef797b0ca29045e14c6218fc9955353)
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query app API slice and hooks
    - Path: web/packages/pyxis-app/src/components/molecules/MetricCard.css
      Note: React MetricCard CSS tuned through Phase 6A visual loop (commit 39468164c2611f748a2b2cdfdad34dd567d6beee)
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
