# Tasks — PYXIS-STAFF-OPS-FUNDAMENTALS

## Phase 0: Research/design package

- [x] Create ticket workspace.
- [x] Gather source evidence with line references.
- [x] Write detailed implementation guide for new intern.
- [x] Include ASCII screenshots and YAML shortform component designs.
- [x] Include DB/API/protobuf change plan.
- [x] Add audit helper script under ticket `scripts/`.
- [x] Keep investigation diary.
- [x] Upload design bundle to reMarkable.

## Phase 1: Schema and protobuf

- [x] Add `booking_reviews` migration.
- [x] Add show lineup replace SQL queries.
- [x] Add submission detail update SQL query.
- [ ] Add artist stats/detail SQL queries.
- [x] Add protobuf message for booking reviews.
- [ ] Add protobuf messages for artist detail and core settings update.
- [x] Regenerate sqlc and protobuf code for booking reviews.
- [x] Update deterministic fixture with review notes.

## Phase 2: Backend services and API

- [x] Persist `Show.lineup` in create/update flows.
- [x] Return lineup from show detail.
- [ ] Add booking details update endpoint.
- [x] Add booking review get/update endpoints.
- [x] Add create artist endpoint.
- [x] Keep artist detail endpoint wired to page detail/editor UI.
- [ ] Add core settings update endpoint limited to space name/address/capacity.
- [ ] Add validation and audit log entries for new mutations.

## Phase 3: RTK Query and MSW

- [x] Add RTK endpoints/mutations for booking review notes.
- [x] Add RTK endpoints/mutations for booking detail edit and artist create/edit.
- [x] Add remaining RTK endpoints/mutations for core settings APIs.
- [x] Update MSW mutable state and handlers for show create/update and flyer upload/delete.
- [x] Ensure show/flyer protobuf-backed MSW responses use `toJson(...)`.
- [x] Add mutation interaction stories for show create/edit workflows.

## Phase 4: UI components

- [x] Build `ShowEditorModal`.
- [x] Build `LineupEditor` behavior inside `ShowEditorModal`.
- [x] Build standalone `FlyerField`.
- [x] Build booking request/detail editor inside Booking Review page.
- [x] Build artist create/edit/detail form inside Artists page.
- [x] Build attendance editing form inside Attendance page.
- [x] Build core settings form for space name/address/capacity.

## Phase 5: Page wiring

- [x] Wire show create flow from Shows page.
- [x] Wire show edit and lineup edit from Show Detail page.
- [x] Wire standalone flyer upload/delete from Show Detail page.
- [x] Wire booking review-note persistence from Booking Review page.
- [x] Wire booking detail edit from Booking Review page.
- [x] Wire artist create/edit/detail functionality from Artists page.
- [x] Wire attendance editing from Attendance page.
- [x] Replace settings toggles with core settings form for space name/address/capacity.

## Phase 6: Validation and handoff

- [x] `go test ./...` passes.
- [x] `cd web/packages/pyxis-types && pnpm build` passes.
- [x] `cd web/packages/pyxis-app && pnpm build` passes.
- [x] `cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook` passes.
- [x] `cd web && pnpm build` passes.
- [x] Manual backend smoke for workflow A/B show create/update lineups passes.
- [x] Manual backend smoke for booking review notes passes.
- [x] Manual Storybook staff workflow smoke passes for booking, artist, attendance, and settings mutation stories.
- [x] Diary and changelog are updated.
- [ ] reMarkable bundle is refreshed if implementation materially changes the design.
