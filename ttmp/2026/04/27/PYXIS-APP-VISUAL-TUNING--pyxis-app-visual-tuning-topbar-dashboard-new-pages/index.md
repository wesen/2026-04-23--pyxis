---
Title: Pyxis App Visual Tuning — TopBar Dashboard + New Pages
Ticket: PYXIS-APP-VISUAL-TUNING
Status: active
Topics:
    - frontend
    - visual-tuning
    - storybook
    - css-visual-diff
    - pyxis-app
DocType: project
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
      Note: App component visual spec (5 shell targets added)
    - Path: prototype-design/visual-diff/userland/specs/app.components.visual.js
      Note: Regenerated JS mirror
    - Path: prototype-design/lib/tokens.js
      Note: Prototype token source of truth
    - Path: prototype-design/lib/components.jsx
      Note: Prototype component selectors
    - Path: web/packages/pyxis-app/src/styles/app-tokens.css
      Note: App tokens — CONTAINS TOKEN DRIFT, needs fixing
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.tsx
      Note: Main AppShell component
    - Path: web/packages/pyxis-app/src/components/shell/AppTopBar.stories.tsx
      Note: AppTopBar stories
    - Path: web/packages/pyxis-app/src/components/shell/AppSidebar.stories.tsx
      Note: AppSidebar stories
    - Path: web/packages/pyxis-app/src/components/shell/AppMobileBottomNav.stories.tsx
      Note: AppMobileBottomNav stories
    - Path: web/packages/pyxis-app/src/components/shell/index.ts
      Note: Shell component re-exports
    - Path: web/packages/pyxis-app/src/components/organisms/
      Note: Reorganized into page-based subfolders
    - Path: web/packages/pyxis-app/src/components/organisms/Panels.tsx
      Note: Updated barrel to use subfolder re-exports
    - Path: web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx
      Note: Legacy barrel — re-exports subfolders
    - Path: web/packages/pyxis-app/src/components/organisms/Dashboard/index.ts
      Note: Dashboard organisms barrel
    - Path: web/packages/pyxis-app/src/components/organisms/Shows/index.ts
      Note: Shows organisms barrel
    - Path: web/packages/pyxis-app/src/components/organisms/ShowDetail/index.ts
      Note: ShowDetail organisms barrel
    - Path: web/packages/pyxis-app/src/components/organisms/Calendar/index.ts
      Note: Calendar organisms barrel
    - Path: web/packages/pyxis-app/src/components/organisms/Bookings/index.ts
      Note: Bookings organisms barrel
    - Path: web/packages/pyxis-app/src/components/organisms/Settings/index.ts
      Note: Settings organisms barrel
    - Path: web/packages/pyxis-app/src/components/organisms/Roster/index.ts
      Note: Roster organisms barrel
ExternalSources: []
Summary: Visual tuning of pyxis-app shell components using css-visual-diff. Completed: playbook, userland docs, Shell story split, organism reorganization. Outstanding: token fix, TypeScript check, visual diff re-run.
LastUpdated: 2026-04-27T10:00:00-04:00
WhatFor: Track and resume pyxis-app visual tuning work.
WhenToUse: Read this first when resuming PYXIS-APP-VISUAL-TUNING.
---

# PYXIS-APP-VISUAL-TUNING

## Status: Active

Visual tuning of pyxis-app Shell components and pages using css-visual-diff.

## What's Done

- Long-term runbook at `docs/playbooks/09-pyxis-app-visual-tuning-runbook.md`
- Detailed userland architecture reference at `prototype-design/visual-diff/userland/docs/`
- Textbook-style atom-to-page analysis at `prototype-design/visual-diff/userland/docs/02-atom-to-page-visual-comparison-analysis.md`
- Shell stories split into one file per component (`AppTopBar.stories.tsx`, `AppSidebar.stories.tsx`, `AppMobileBottomNav.stories.tsx`, `AppShell.stories.tsx`)
- 5 shell component targets added to `app.components.visual.yml`
- Organisms reorganized into page-based subfolders (Dashboard/, Shows/, ShowDetail/, Calendar/, Bookings/, Settings/, Roster/)
- Legacy barrel files updated (`Panels.tsx`, `Phase8Sections.tsx`, `DashboardSections.tsx`, `ShowsSections.tsx`)

## What's Next

1. **Verify TypeScript** — `cd web && pnpm --filter pyxis-app exec tsc --noEmit`
2. **Fix token drift** in `app-tokens.css`:
   - `--app-ink: #1f1e1c` → `#1A1A18`
   - `--app-muted: #6f685e` → `#8A857B`
   - `--app-faint: #9b9488` → `#B8B2A5`
3. **Re-run visual diff** on `app-topbar-dashboard` to confirm diff drops
4. **Run full shell component comparison** suite
5. **Add atom-level targets** (Button, Avatar, Icon) to the spec

## Key Findings

- **TopBarDashboard**: 8.56% pixel diff — token mismatch is the root cause
- **Button atom**: 20.22% diff — bounding box padding capture artifact
- Three token systems exist; app tokens drifted from prototype

## Tickets

- [PYXIS-APP-VISUAL-TUNING](#) — this ticket
