---
Title: Archive redesign investigation diary
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
  - frontend
  - storybook
  - design-system
  - public-site
DocType: reference
Intent: short-term
Owners: []
RelatedFiles:
  - web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
  - web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
  - web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
Summary: "Chronological notes for the public show archive visual redesign planning work."
LastUpdated: 2026-04-29T12:40:00-04:00
---

# Archive redesign investigation diary

## Step 1: Created focused ticket

Created docmgr ticket:

```text
PYXIS-ARCHIVE-VISUAL-REDESIGN
```

Goal: analyze and plan a redesign of the public show archive page because its current vertical stack of utility controls and lists feels too form-like and does not match the stronger editorial/conceptual approach used elsewhere in the public site.

## Step 2: Inspected current archive page and component system

Read:

```text
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.css
web/packages/pyxis-user-site/src/pages/ArchivePage/Page.stories.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters/ArchiveSearchFilters.css
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveStats/ArchiveStats.css
web/packages/pyxis-components/src/public/molecules/ArchiveShowList/ArchiveShowList.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.tsx
web/packages/pyxis-components/src/public/molecules/ArchiveShowRow/ArchiveShowRow.css
web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.tsx
web/packages/pyxis-components/src/public/molecules/YearGroup/YearGroup.css
```

Finding: the existing components are mostly good reusable pieces. The problem is not a broken component; it is the absence of an organism-level composition that makes the archive feel like a public archive instead of controls stacked above rows.

## Step 3: Inspected public API path

Read:

```text
web/packages/pyxis-user-site/src/api/endpoints.ts
web/packages/pyxis-user-site/src/api/hooks.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
pkg/server/public.go
```

Finding: the first redesign slice does not need backend changes. Existing endpoints are sufficient:

```text
GET /api/public/archive?search=<query>
GET /api/public/archive/stats
```

## Step 4: Wrote implementation guide

Created:

```text
design-doc/01-show-archive-page-visual-redesign-implementation-guide.md
```

The guide proposes:

- `ArchiveExplorer` organism;
- `ArchiveCommandBar` molecule;
- reuse of `PublicPageHeader`, `ArchiveStats`, `YearGroup`, `ArchiveShowList`, and `ArchiveShowRow`;
- Storybook-first implementation;
- visual-diff follow-up targets;
- token-backed CSS using `pyxisPart()` selectors;
- an intern checklist and acceptance criteria.

## Step 5: Uploaded to reMarkable

Uploaded the design guide bundle to the ticket folder on reMarkable after a dry run.

## Step 6: Added backend-first post-show log guide and corrected visual workflow

The operator clarified that the staff post-show log page/backend is the right starting point before the public archive visual redesign, and that this is a new component with no standalone prototype HTML to compare against.

Created:

```text
design-doc/02-staff-post-show-log-backend-and-page-redesign-guide.md
```

The second guide now explicitly says not to force the new PostShowLog component family into the prototype-to-Storybook visual-diff workflow. Instead, Storybook states define the intended design, and approved Storybook screenshots become the baseline evidence for future regression checks.

## Step 7: Split componentization and deferred unification plans

Updated the Post-show log backend/page guide to make the first implementation slice explicit:

- add frontend `ShowLogEntry` RTK Query/MSW support;
- build only the small primitives needed immediately (`AppCard`, `StatusBadge`, `MetadataStrip`, `NoteBlock`, `FieldError`);
- build the PostShowLog component family in Storybook;
- defer broader staff UI unification until after the page is approved.

Created a third document:

```text
design-doc/03-staff-ui-unification-plan.md
```

That document captures the later migration plan for shared staff primitives such as `RouteListToolbar`, `MetricsGrid`, status badges, metadata rows, cards, and note blocks across Shows, Bookings, Audit Log, Settings, Discord, and Post-show log.

## Step 8: Started first component slice and RTK/MSW scaffolding

Began implementation after planning. Created the first low-risk molecule primitives for the Post-show log component family:

```text
web/packages/pyxis-app/src/components/molecules/AppCard/
web/packages/pyxis-app/src/components/molecules/StatusBadge/
web/packages/pyxis-app/src/components/molecules/MetadataStrip/
web/packages/pyxis-app/src/components/molecules/NoteBlock/
web/packages/pyxis-app/src/components/molecules/FieldError/
```

Storybook titles were corrected to live under the existing pyxis-app hierarchy:

```text
Pyxis App/Components/Molecules/...
```

Also added temporary frontend `ShowLogEntry` types and RTK Query endpoints for the planned backend API:

```text
GET /api/app/show-log
PATCH /api/app/show-log/{showId}
```

Added MSW handlers that derive show-log entries from mock shows plus attendance logs. This is intentionally frontend/MSW scaffolding before the real backend endpoint exists.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

## Step 9: Built first PostShowLog components

Built the first organism components on top of the molecule primitives:

```text
web/packages/pyxis-app/src/components/organisms/PostShowLog/PostShowLogEntryCard/
web/packages/pyxis-app/src/components/organisms/PostShowLog/PostShowLogPanel/
```

`PostShowLogEntryCard` now supports:

- needs-log, logged, and incident tones;
- collapsed scan-first state;
- expanded editor state;
- draw validation;
- incident-notes validation;
- show notes vs post-show notes separation;
- Storybook stories for collapsed, expanded, validation, and saving states.

`PostShowLogPanel` now supports:

- summary metrics;
- search;
- status chips;
- filtered list;
- empty state;
- Storybook stories for mixed, needs-log, empty, search no-results, and mobile states.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

## Step 10: Pivoted PostShowLog panel to table/modal and moved under ShowLog

The operator clarified that the Post-show log should visually follow the `ShowsConfirmedPanel` model: an elegant concise table in a panel, with rows that expand for read-only details and an edit/log button that opens a modal. Updated the design guide accordingly.

Implementation changes:

- Reworked `PostShowLogPanel` from a card list to a table-first view.
- Added expandable detail rows for show notes, post-show notes, incident notes, and metadata.
- Added `PostShowLogEditorModal` for focused editing.
- Kept the first `PostShowLogEntryCard` as a reference/prototype story for now.
- Moved the component family under a `ShowLog/` folder to mirror the existing `Shows/` organism folder structure.

Current structure:

```text
web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogPanel/
web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEntryCard/
web/packages/pyxis-app/src/components/organisms/ShowLog/index.ts
```

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

## Step 11: Captured ShowsConfirmedPanel reference and simplified ShowLog panel

The operator asked to use `ShowsConfirmedPanel` as the visual reference because the current ShowLog panel was doing too much and felt like a full page.

Captured the reference screenshot using `css-visual-diff` against the Storybook story:

```text
sources/15-shows-confirmed-reference/shows-confirmed-panel.story.css-visual-diff.yml
sources/15-shows-confirmed-reference/shows-confirmed-panel.png
```

Also captured a before/after for the ShowLog story:

```text
sources/15-shows-confirmed-reference/show-log-panel-before-simplify.png
sources/15-shows-confirmed-reference/show-log-panel-after-simplify.png
```

Implementation change:

- Removed the large metric grid and heavy search/filter toolbar from the default `PostShowLogPanel` rendering.
- Wrapped the table in the standard `Panel` component, with the same overall rhythm as `ShowsConfirmedPanel`.
- Kept the right-side panel note concise: `Needs log N · Incidents N`.
- Kept row details and modal editing, but made the default state a compact ledger table.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

## Step 12: Split ShowLog editor modal and tuned form with screenshot feedback

Separated the editor modal out of `PostShowLogPanel` into its own organism folder:

```text
web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/
```

Added a dedicated Storybook story at:

```text
Pyxis App/Components/Organisms/ShowLog/PostShowLogEditorModal
```

Used `css-visual-diff screenshot` to capture the modal from Storybook and reviewed the PNG with image understanding feedback. Artifacts:

```text
sources/16-show-log-modal-form/post-show-log-editor-modal.png
sources/16-show-log-modal-form/post-show-log-editor-modal-after-tune.png
sources/16-show-log-modal-form/post-show-log-editor-modal-final.png
sources/16-show-log-modal-form/post-show-log-editor-modal.css-visual-diff.yml
```

Tuning performed from screenshot feedback:

- clarified context vs form sections;
- removed the nested box feeling for show notes inside the context area;
- made the incident control more compact;
- hid incident notes unless Incident is checked;
- shortened the action copy to `Save report`;
- tightened draw input width and vertical alignment;
- normalized field label spacing.

Validation:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
```

## Step 13: Wrote reusable Storybook-first component runbook

Created a reusable runbook for future component work:

```text
playbooks/01-storybook-first-component-runbook.md
```

The runbook documents the workflow used for the ShowLog panel/modal work:

- create component folders with `.tsx`, `.css`, `.stories.tsx`, and `index.ts`;
- use `Pyxis App/Components/...` Storybook title conventions;
- add stable `data-pyxis-component` selectors with `appPart()`;
- capture screenshots with `css-visual-diff` from Storybook;
- inspect screenshots with either `understand_image` or the `read` tool directly on PNG files;
- save evidence under ticket `sources/`;
- update diary/tasks and commit at logical boundaries.

## Step 14: Wired first backend ShowLog API and route integration

Added first backend handlers for the planned ShowLog API:

```text
GET /api/app/show-log
PATCH /api/app/show-log/{showId}
```

Implementation notes:

- The list endpoint combines `showService.ListAll()` with existing `attendanceService.List()` data.
- It starts from shows, so past shows without an attendance log can appear as `needs-log` work items.
- It filters to past confirmed/archived/cancelled shows.
- It supports `status`, `search`, `limit`, and `offset` query parameters.
- The patch endpoint validates draw bounds and incident-note requirements, then writes through the existing attendance upsert path.

Updated the staff Post-show log route:

```text
web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
```

The page now uses:

```text
useGetShowLogQuery()
useUpdateShowLogMutation()
PostShowLogPanel
```

This removes the previous frontend stitching of attendance rows plus `useGetShowsQuery()` just to display show notes.

Validation:

```bash
go test ./pkg/server ./pkg/service ./internal/web -count=1
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

Note: `go test ./...` still requests `go mod tidy` because of unrelated/untracked repo state outside this focused change; targeted backend packages passed.
