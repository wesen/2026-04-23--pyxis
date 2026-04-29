# Tasks

## Post-show log first implementation slice

- [ ] Add temporary frontend `ShowLogEntry`/query types and RTK Query endpoints for `GET/PATCH /api/app/show-log`.
- [ ] Add MSW handlers that derive show-log entries from mock shows plus attendance logs, including needs-log rows with no attendance log.
- [ ] Build reusable small primitives needed by the first slice: `AppCard`, `StatusBadge`, `MetadataStrip`, `NoteBlock`, and `FieldError`.
- [x] Build initial `PostShowLogEntryCard` card prototype with collapsed and expanded states.
- [x] Capture `ShowsConfirmedPanel` Storybook reference PNG with `css-visual-diff`.
- [x] Migrate first-pass `PostShowLogPanel` toward a ShowsConfirmedPanel-like table with expandable detail rows.
- [x] Simplify `PostShowLogPanel` so the default story is one concise panel/table, not a full-page metrics/search surface.
- [x] Add edit modal for focused post-show log entry editing from each table row.
- [x] Add Storybook stories for mixed, needs-log, logged, incident, expanded/details, edit modal, empty, validation, and mobile states.
- [ ] Decide whether to keep `PostShowLogEntryCard` as a reference/prototype story or archive it after the table/modal path is approved.
- [ ] Extract `PostShowLogSummary` and `PostShowLogToolbar` into dedicated files if the first-pass panel shape is approved.
- [ ] Switch `/attendance` page to `useGetShowLogQuery()` and remove show-note stitching via `useGetShowsQuery()`.
- [ ] Add visible Chromium smoke for post-show log create/update/validation flow.
- [ ] Add Storybook screenshot baseline capture script for the new component family.

## Public archive redesign follow-up

- [ ] Implement first public archive redesign slice: `ArchiveCommandBar`, `ArchiveExplorer`, page wiring, and CSS tuning.
- [ ] Add Storybook coverage for archive desktop, mobile, no-results, stats-unavailable, archive-error, one-year, and dense-many-years states.
- [ ] Add or update visual-diff targets for archive masthead, command bar, and year timeline regions after implementation.
- [ ] Validate `pyxis-components` typecheck, `pyxis-user-site` typecheck, and `pyxis-user-site` Vite build.
- [ ] Capture review evidence under this ticket's `sources/` directory.

## Later staff UI unification

- [ ] After Post-show log is approved, revisit `design-doc/03-staff-ui-unification-plan.md` and migrate reusable primitives across Shows, Bookings, Audit Log, Settings, and Discord.

## DONE

- [x] Create docmgr ticket for archive visual redesign.
- [x] Analyze current archive page, shared components, API flow, Storybook coverage, CSS tokens, and visual-diff targets.
- [x] Write intern-ready public archive design and implementation guide.
- [x] Upload guide bundle to reMarkable.
- [x] Add backend-first staff post-show log guide and document Storybook-baseline workflow for the new component.
- [x] Add deferred staff UI unification guide.
