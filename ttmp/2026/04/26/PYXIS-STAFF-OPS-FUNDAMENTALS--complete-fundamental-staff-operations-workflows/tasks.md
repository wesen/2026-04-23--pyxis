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

- [ ] Add `booking_reviews` migration.
- [ ] Add show lineup replace SQL queries.
- [ ] Add submission detail update SQL query.
- [ ] Add artist stats/detail SQL queries.
- [ ] Add protobuf messages for booking reviews, artist detail, and core settings update.
- [ ] Regenerate sqlc and protobuf code.
- [ ] Update deterministic fixture with review notes.

## Phase 2: Backend services and API

- [ ] Persist `Show.lineup` in create/update flows.
- [ ] Return lineup from show detail.
- [ ] Add booking details update endpoint.
- [ ] Add booking review get/update endpoints.
- [ ] Add create artist endpoint.
- [ ] Add artist detail endpoint.
- [ ] Add core settings update endpoint limited to space name/address/capacity.
- [ ] Add validation and audit log entries for new mutations.

## Phase 3: RTK Query and MSW

- [ ] Add RTK endpoints/mutations for new backend APIs.
- [ ] Update MSW mutable state and handlers.
- [ ] Ensure every protobuf-backed MSW response uses `toJson(...)`.
- [ ] Add mutation interaction stories for new workflows.

## Phase 4: UI components

- [ ] Build `ShowEditorModal`.
- [ ] Build `LineupEditor`.
- [ ] Build `FlyerField`.
- [ ] Build `BookingReviewEditor`.
- [ ] Build `ArtistEditorDrawer`.
- [ ] Build `ArtistDetailPanel`.
- [ ] Build `AttendanceEditorModal`.
- [ ] Build `CoreSettingsForm`.

## Phase 5: Page wiring

- [ ] Wire show create flow from Shows page.
- [ ] Wire show edit, lineup edit, flyer upload/delete from Show Detail page.
- [ ] Wire booking detail edit and review-note persistence from Booking Review page.
- [ ] Wire artist create/edit/detail functionality from Artists page.
- [ ] Wire attendance edit modal from Attendance page.
- [ ] Replace settings toggles with core settings form for space name/address/capacity.

## Phase 6: Validation and handoff

- [ ] `go test ./...` passes.
- [ ] `cd web/packages/pyxis-types && pnpm build` passes.
- [ ] `cd web/packages/pyxis-app && pnpm build` passes.
- [ ] `cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook` passes.
- [ ] `cd web && pnpm build` passes.
- [ ] Manual backend smoke for new APIs passes.
- [ ] Manual Vite staff workflow smoke passes.
- [ ] Diary and changelog are updated.
- [ ] reMarkable bundle is refreshed if implementation materially changes the design.
