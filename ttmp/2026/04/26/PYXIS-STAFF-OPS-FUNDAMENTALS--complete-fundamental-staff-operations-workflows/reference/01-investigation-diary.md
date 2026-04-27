---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/design-doc/01-staff-operations-workflows-design-and-implementation-guide.md
      Note: Primary design output created during Step 1.
    - Path: ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/scripts/01-audit-staff-ops-gaps.sh
      Note: Ticket-local audit helper script.
    - Path: ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/sources/01-evidence-line-references.md
      Note: Evidence bundle gathered before writing conclusions.
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Diary

## Goal

This diary records the research and design work for the Pyxis staff operations fundamentals ticket: show creation/editing, lineup editing, flyer upload, booking edit/review notes, artist functionality, attendance editing, and narrow core settings editing.

## Step 1: Create ticket and map the missing staff operations

I created a new docmgr ticket for the missing fundamental staff workflows and gathered source evidence before writing the design. The intent was to make the ticket self-contained enough for a new intern to understand the existing architecture, the gaps, and the implementation sequence without reading the whole previous conversation.

The research confirmed that many backend and RTK primitives already exist, but the visible staff UI is still incomplete for the requested workflows. The resulting design therefore focuses on adding missing schema/API contracts where needed, then building page-owned mutation flows with presentational components and Storybook/MSW coverage.

### Prompt Context

**User prompt (verbatim):** "ok, let's create a detailed new ticket to address some fundamental missing functionality.

- new/edit show, line up edit, flyer upload
- edit booking details, review notes persistence
- all the artist functionality
- attendance editing
- settings: only space name + address + capacity

---

Some of these need visual design, so make ascii screenshots and use the existing component system to design them (as YAML shortform for the react markup in the design doc). Some need probably DB changes or API changes, so write those out too, including new protobuf / protobuf changes.

reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet  
point sand pseudocode and diagrams and api references and file                                                                                                                                              
  references.                                                                                                                                                                                               
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable.                                                                                                                  
                                                                                                                                                                                                            
You can write scripts and all kinds of other things in the scripts/ folder of the ticket."

**Assistant interpretation:** Create a new docmgr ticket and produce a detailed design/implementation guide for completing core staff operations, including visual sketches, component markup sketches, DB/API/protobuf planning, evidence, diary, scripts, and reMarkable delivery.

**Inferred user intent:** The user wants to move from architecture foundations to a practical implementation plan that an intern can execute safely and incrementally.

**Commit (code):** N/A — documentation and ticket assets only in this step.

### What I did

- Created ticket `PYXIS-STAFF-OPS-FUNDAMENTALS`.
- Created the primary design doc:
  - `design-doc/01-staff-operations-workflows-design-and-implementation-guide.md`
- Created this diary:
  - `reference/01-investigation-diary.md`
- Captured evidence into:
  - `sources/01-evidence-line-references.md`
- Added an audit helper script:
  - `scripts/01-audit-staff-ops-gaps.sh`
- Ran the helper script and stored output in:
  - `sources/02-staff-ops-gap-audit-output.md`
- Wrote a detailed implementation guide with:
  - architecture primer,
  - current-state evidence,
  - gap analysis,
  - ASCII screenshots,
  - YAML shortform React markup,
  - DB changes,
  - protobuf changes,
  - API references,
  - backend/frontend/MSW implementation phases,
  - testing strategy,
  - risks and open questions.

### Why

The requested workflows cross frontend pages, presentational components, RTK Query, MSW, Go handlers, services, repositories, sqlc queries, migrations, protobuf schemas, and deterministic seed data. A design-only ticket is useful here because implementing everything directly without a written map would be high-risk and difficult for a new contributor to review.

### What worked

- `docmgr ticket create-ticket` and `docmgr doc add` created the workspace and documents successfully.
- Repository search showed existing primitives for many workflows:
  - show create/update,
  - flyer upload/delete,
  - artist update,
  - attendance update,
  - settings update.
- The gap audit script produced a compact summary of the existing frontend/backend/query coverage.

### What didn't work

- The first version of the gap audit script used:

```bash
rg -n "-- name:" "$file"
```

`rg` interpreted `-- name:` as an option and printed:

```text
rg: unrecognized flag -- name:
```

I fixed the script by adding `--` before the pattern:

```bash
rg -n -- "-- name:" "$file"
```

### What I learned

- The project already has more backend support than the visible UI exposes.
- Show lineups are the main show-related persistence gap: `GetShowWithLineup` exists, but create/update paths do not replace lineup rows.
- Booking review notes should not be stored in `submissions.message`, because that field is artist-provided. They need a separate `booking_reviews` table.
- Settings should be narrowed for this ticket to avoid accidental clearing of unrelated Discord/contact fields through the broad settings update shape.

### What was tricky to build

The tricky part was separating “missing UI wiring” from “missing backend contract.” Flyer upload, attendance update, and artist update already have backend or RTK primitives, so those are mostly UI and story work. Booking review notes and show lineup editing need database and API changes. Core settings sits in between: the data already exists, but the broad update endpoint is too easy to misuse, so the design recommends a narrow core settings endpoint.

### What warrants a second pair of eyes

- The proposed `booking_reviews` table and review-note lifecycle.
- The transaction plan for replacing show lineups.
- Whether show creation from booking approval should consume edited booking details and review notes.
- Whether `UpdateCoreSettingsRequest` should be a new endpoint or server-side narrow handling inside the existing settings PATCH endpoint.

### What should be done in the future

- Implement Phase 1 schema/protobuf first.
- Keep implementation commits phase-scoped.
- Refresh the reMarkable bundle if implementation changes the design materially.

### Code review instructions

Start review with:

```text
design-doc/01-staff-operations-workflows-design-and-implementation-guide.md
sources/01-evidence-line-references.md
scripts/01-audit-staff-ops-gaps.sh
```

Validate docs with:

```bash
docmgr doctor --ticket PYXIS-STAFF-OPS-FUNDAMENTALS --stale-after 30
```

### Technical details

The design references these major source paths:

```text
proto/pyxis/v1/show.proto
pkg/server/app.go
pkg/db/queries/shows.sql
pkg/db/queries/submissions.sql
pkg/db/queries/artists.sql
web/packages/pyxis-app/src/pages/Pages.tsx
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
web/packages/pyxis-app/src/components/organisms/BookingReviewNotePanel/BookingReviewNotePanel.tsx
web/packages/pyxis-app/src/components/organisms/ArtistRoster/ArtistRoster.tsx
web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx
web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx
```

## Step 2: Validate and upload design bundle to reMarkable

I validated the ticket documentation and uploaded the design package to reMarkable as a bundled PDF. The dry-run succeeded first, then the real upload completed and the remote listing confirmed the file exists.

This makes the design reviewable away from the terminal and preserves the implementation guide, diary, tasks, and changelog as one ToC-enabled document.

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** Deliver the completed ticket design package to reMarkable after doc validation.

**Inferred user intent:** The user wants the long-form implementation plan available for reading/review on the reMarkable device.

**Commit (code):** 7e064b9 — "Design staff operations fundamentals"

### What I did

- Ran doc validation:

```bash
docmgr doctor --ticket PYXIS-STAFF-OPS-FUNDAMENTALS --stale-after 30
```

- Added the missing `staff-app` vocabulary entry required by docmgr validation.
- Ran reMarkable status/account checks:

```bash
remarquee status
remarquee cloud account --non-interactive
```

- Ran dry-run upload:

```bash
remarquee upload bundle --dry-run ... \
  --name "PYXIS-STAFF-OPS-FUNDAMENTALS design bundle" \
  --remote-dir "/ai/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS" \
  --toc-depth 2
```

- Ran real upload and verified remote listing:

```bash
remarquee upload bundle ...
remarquee cloud ls /ai/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS --long --non-interactive
```

### Why

The user explicitly requested upload to reMarkable. The dry-run first follows the reMarkable delivery workflow and catches pandoc/upload shape issues before writing to the remote folder.

### What worked

The upload succeeded:

```text
OK: uploaded PYXIS-STAFF-OPS-FUNDAMENTALS design bundle.pdf -> /ai/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS
```

The remote listing confirmed:

```text
[f] PYXIS-STAFF-OPS-FUNDAMENTALS design bundle
```

### What didn't work

`docmgr doctor` initially warned about an unknown `staff-app` topic and reported missing frontmatter for generated source files. I fixed this by adding the vocabulary entry and prepending frontmatter to the two generated source Markdown files.

### What I learned

Generated evidence/source Markdown still needs frontmatter if it lives inside the ticket workspace and should pass `docmgr doctor`.

### What was tricky to build

The only tricky part was validation hygiene: the design content was ready, but generated source files without frontmatter failed docmgr validation. The fix was documentation metadata, not content changes.

### What warrants a second pair of eyes

- Whether the bundle should include the full evidence source file. I left the reMarkable bundle focused on index/design/diary/tasks/changelog to keep it readable.
- Whether the uncommitted vocabulary changes from another ticket should be separated before final cleanup.

### What should be done in the future

If implementation changes the proposed API/schema materially, refresh the reMarkable bundle after updating the design guide.

### Code review instructions

Review the uploaded bundle path:

```text
/ai/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS/PYXIS-STAFF-OPS-FUNDAMENTALS design bundle
```

Local validation:

```bash
docmgr doctor --ticket PYXIS-STAFF-OPS-FUNDAMENTALS --stale-after 30
```

### Technical details

The uploaded bundle included:

```text
index.md
design-doc/01-staff-operations-workflows-design-and-implementation-guide.md
reference/01-investigation-diary.md
tasks.md
changelog.md
```

## Step 3: Build workflows A/B and split page modules

I started implementation for workflows A and B: show creation and show editing with lineup persistence. I also split the monolithic `Pages.tsx` into per-route page modules so future workflow wiring can happen inside focused folders instead of one very large file.

This step intentionally focused on the show workflow path first. Backend show create/update now persists submitted lineup rows transactionally. The staff Shows page opens a real show editor modal for create, and Show Detail opens the same editor in edit mode.

### Prompt Context

**User prompt (verbatim):** "alright, add tasks to the ticket in phases, then work on them task by task, committing at appropriate intervals, keeping a diary.

build workflow A and B"

**Assistant interpretation:** Update the new ticket task plan as needed, then begin implementing the first workflows: new show and edit show, including lineup editing. Keep diary entries and commit at phase boundaries.

**Inferred user intent:** The user wants implementation to proceed from the design ticket, starting with concrete staff show workflows rather than more planning.

**Commit (code):** 1adc78d — "Persist show lineups"

### What I did

- Added SQL queries for replacing show lineup rows:
  - `DeleteShowLineup`
  - `CreateShowLineupEntry`
- Regenerated sqlc output.
- Updated `ShowRepo` so create/update persists lineup rows and `GetByID` reads `GetShowWithLineup`.
- Added `GET /api/app/shows/{id}` so the staff app detail route can fetch the real staff show detail instead of falling through to SPA handling.
- Fixed proto status conversion in `protoToDomainShow`; it now maps enum values to DB status strings instead of storing raw enum names like `SHOW_STATUS_CONFIRMED`.
- Reworked `NewShowModal` into a real controlled show editor with:
  - create/edit mode,
  - show fields,
  - status selection,
  - lineup rows add/remove/edit,
  - optional flyer file selection.
- Wired `ShowsPage` to `createShow` and optional `uploadShowFlyer`, then navigate to `/shows/:id`.
- Wired `ShowDetailPage` to `updateShow` and optional `uploadShowFlyer`.
- Split route pages into per-folder `Page.tsx` modules and converted `Pages.tsx` into a barrel export:
  - `pages/ShowsPage/Page.tsx`
  - `pages/ShowDetailPage/Page.tsx`
  - `pages/CalendarPage/Page.tsx`
  - `pages/BookingsPage/Page.tsx`
  - `pages/BookingReviewPage/Page.tsx`
  - `pages/ArtistsPage/Page.tsx`
  - `pages/AttendancePage/Page.tsx`
  - `pages/AuditLogPage/Page.tsx`
  - `pages/DiscordPage/Page.tsx`
  - `pages/SettingsPage/Page.tsx`
  - `pages/LoginPage/Page.tsx`
  - `pages/SetupPage/Page.tsx`
  - `pages/ModalShowcasePage/Page.tsx`
- Added per-folder `Page.css` files that import shared `pages.css` for now.
- Added `pages/shared.tsx` for common page state helpers.

### Why

Workflows A/B need focused page modules and reusable form components. Keeping all page code in `Pages.tsx` would make each additional workflow harder to wire and review. The split also matches the existing story folder layout.

### What worked

Backend smoke worked for create/update with lineups:

```text
POST /api/app/shows -> created id 8, SHOW_STATUS_CONFIRMED, lineup 2
GET  /api/app/shows/8 -> lineup 2
PATCH /api/app/shows/8 -> edited title/status, lineup replaced to 1
GET  /api/app/shows/8 -> SHOW_STATUS_HOLD, lineup 1
```

Validation passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
go test ./...
```

### What didn't work

- The first backend smoke hit a stale server process and returned `405` for the current route shape. Restarting the backend on `:8080` fixed that.
- `go test ./...` initially failed because `NewShowRepo` now needed the DB pool for transactions and two callsites still used the old constructor signature. I updated `pkg/server/server.go`, `pkg/service/submission_service.go`, and `cmd/pyxis/cmds/export.go`.
- `NewShowModal.stories.tsx` still passed old `title`/`description` args after the component API changed. I replaced that story with an edit-mode story.

### What I learned

Show lineups were already represented in the domain/protobuf model and read SQL, so the smallest backend change was to add replace-lineup write queries and make create/update transactional. No protobuf schema change was required for workflows A/B.

### What was tricky to build

The tricky part was transaction boundaries. `SubmissionService.Approve` already opens a transaction and creates a transaction-scoped `ShowRepo`, so `ShowRepo` now supports both pool-backed transactions for normal create/update and query-backed operation inside an existing transaction. When `pool` is nil, it uses the existing transaction-bound queries and still replaces lineup rows.

### What warrants a second pair of eyes

- `ShowRepo` transaction behavior, especially the `pool == nil` path used inside submission approval.
- Whether `NewShowModal` should require validation before submit rather than relying on backend/database errors.
- Whether flyer upload should be split into a separate detail-panel UI instead of sharing the show editor modal.

### What should be done in the future

- Add explicit validation messages to `NewShowModal`.
- Add MSW mutation stories specifically for create/edit show with lineup.
- Replace the CSS bridge `Page.css -> ../pages.css` with page-local CSS as page-specific styling emerges.

### Code review instructions

Start with backend persistence:

```text
pkg/db/queries/shows.sql
pkg/repository/postgres/show_repo.go
pkg/server/app.go
pkg/server/server.go
```

Then review frontend wiring:

```text
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
web/packages/pyxis-app/src/pages/ShowsPage/Page.tsx
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
web/packages/pyxis-app/src/pages/Pages.tsx
```

Validate with:

```bash
go test ./...
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

### Technical details

Backend smoke payload used:

```json
{
  "artist": "Workflow A Smoke",
  "date": "2026-09-01",
  "doorsTime": "8:00 PM",
  "startTime": "9:00 PM",
  "age": "21+",
  "price": "$10",
  "genre": "Noise",
  "description": "Created from smoke",
  "notes": "staff note",
  "capacity": 150,
  "status": "SHOW_STATUS_CONFIRMED",
  "lineup": [
    { "artist": "Workflow A Smoke", "role": "headline", "startTime": "9:00 PM", "endTime": "10:00 PM" },
    { "artist": "Support Smoke", "role": "support", "startTime": "8:30 PM", "endTime": "9:00 PM" }
  ]
}
```

## Step 4: Add MSW stories and standalone flyer UI

I added deterministic MSW support and Storybook interaction stories for the show create/edit workflows, then added a standalone flyer upload/delete panel to the show detail page. This keeps flyer management visible after a show already exists, instead of only allowing optional upload during the show editor save path.

This step finishes the requested “MSW/page stories + flyer upload/delete UI” slice before moving to booking notes.

### Prompt Context

**User prompt (verbatim):** "msw/page stories, flyer upload/delete UI, then notes"

**Assistant interpretation:** Before moving to booking notes, add MSW/page story coverage for the show create/edit workflows and expose a standalone flyer upload/delete UI on show detail.

**Inferred user intent:** The user wants the new show workflows to be demonstrable and testable in Storybook, and wants flyer management to be a first-class show detail affordance.

**Commit (code):** pending at time of diary entry.

### What I did

- Added `FlyerField`:
  - `web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx`
  - `web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.css`
  - `web/packages/pyxis-app/src/components/organisms/FlyerField/index.ts`
- Exported it from `Panels.tsx`.
- Wired `ShowDetailPage` to:
  - `useUploadShowFlyerMutation`,
  - `useDeleteShowFlyerMutation`,
  - standalone `FlyerField` below the show detail panels.
- Expanded staff MSW handlers for:
  - `POST /api/app/shows`,
  - `PATCH /api/app/shows/:id`,
  - `POST /api/app/shows/:id/flyer`,
  - `DELETE /api/app/shows/:id/flyer`.
- Added page interaction stories:
  - `ShowsPage/CreateShowMutation`,
  - `ShowDetailPage/EditShowMutation`.

### Why

Storybook should prove that page-level RTK flows work through MSW and that the UI updates after mutations. Flyer upload/delete is operationally separate from editing show metadata, so staff need a visible detail-page panel after a show has already been created.

### What worked

Validation passed:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
go test ./...
```

### What didn't work

No blocking failures in this slice. The MSW file upload handler required using `await request.formData()` rather than JSON parsing, which matches the real RTK `FormData` path.

### What I learned

The previous removal of blanket JSON `Content-Type` on `fetchBaseQuery` continues to matter: flyer upload works because the browser can set multipart boundaries for `FormData`.

### What was tricky to build

The only subtle part was keeping MSW state coherent. The upload handler now updates the in-memory show's `flyerUrl`, and delete clears it, so a refetch after tag invalidation has the same semantics as the real backend.

### What warrants a second pair of eyes

- The filename extraction for delete currently uses the last URL segment. This matches the current backend API but may need adjustment if flyer URLs later include signed URLs or query strings.
- The Storybook interactions cover create/edit metadata. File upload interaction stories are still not added because browser file input testing needs explicit `File` objects and can be added separately.

### What should be done in the future

- Add a dedicated `FlyerField` component story with uploaded/no-flyer states.
- Add a page interaction story for flyer upload/delete if we want full coverage of the file input path.

### Code review instructions

Start with:

```text
web/packages/pyxis-app/src/api/mockHandlers.ts
web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
web/packages/pyxis-app/src/pages/ShowsPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/ShowDetailPage/Page.stories.tsx
```

Validate with:

```bash
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
go test ./...
```

## Step 5: Persist booking review notes

I implemented the first “notes” slice: persistent staff-only booking review notes. Booking review notes now have their own database table and protobuf-backed API instead of being mixed with the artist-submitted booking message.

This intentionally does not implement editable booking request details yet. It only persists internal review notes from the Booking Review page.

### Prompt Context

**User prompt (verbatim):** (same as Step 4)

**Assistant interpretation:** After MSW/story/flyer work, implement persistent notes for booking review.

**Inferred user intent:** The user wants staff review comments to survive reloads and become a real backend-backed workflow.

**Commit (code):** pending at time of diary entry.

### What I did

- Added migration:
  - `pkg/db/migrations/000003_add_booking_reviews.up.sql`
  - `pkg/db/migrations/000003_add_booking_reviews.down.sql`
- Added sqlc queries:
  - `pkg/db/queries/booking_reviews.sql`
- Added domain type:
  - `pkg/domain/booking_review.go`
- Added protobuf message:
  - `BookingReview`
- Regenerated sqlc and protobuf code with `make generate`.
- Added repository/service support:
  - `SubmissionRepo.GetReview`
  - `SubmissionRepo.UpsertReview`
  - `SubmissionService.GetReview`
  - `SubmissionService.UpsertReview`
- Added staff endpoints:
  - `GET /api/app/bookings/{id}/review`
  - `PATCH /api/app/bookings/{id}/review`
- Added TS exports and RTK endpoints:
  - `useGetBookingReviewQuery`
  - `useUpdateBookingReviewMutation`
- Added MSW handlers for booking review notes.
- Reworked `BookingReviewNotePanel` to show the artist message and edit/save an internal note.
- Wired `BookingReviewPage` to fetch and save the review note.
- Updated `fixtures/dev.sql` with sample review notes.

### Why

The artist-submitted `Submission.message` and staff-internal review notes are different concepts. Storing review notes in a separate table avoids overwriting artist-provided data and gives the staff workflow a durable audit-friendly place to keep internal context.

### What worked

Validation passed:

```bash
go test ./...
cd web/packages/pyxis-types && pnpm build
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

Real backend smoke passed:

```text
GET   /api/app/bookings/1/review  -> existing fixture note
PATCH /api/app/bookings/1/review  -> note updated
```

PATCH response:

```json
{
  "submissionId": 1,
  "note": "Smoke saved review note",
  "decision": "none",
  "updatedBy": 4,
  "updatedAt": "2026-04-26T20:54:16-04:00"
}
```

### What didn't work

No blocking implementation failures. The main ordering requirement was to run migrations before `make seed`, because the deterministic fixture now truncates and inserts into `booking_reviews`.

### What I learned

The existing proto-everywhere pattern made this straightforward: add proto message, regenerate, export schema/type, use `fromJson`/`toJson` in RTK/MSW.

### What was tricky to build

The tricky part was naming and scope. The design proposed both editable booking details and review notes, but this step only implements review notes. The tasks now separate “booking review-note persistence” from “booking detail edit” so progress is accurate.

### What warrants a second pair of eyes

- Whether `decision` should remain a string or become a protobuf enum later.
- Whether missing review rows should return an empty review instead of an error. The fixture creates review rows for sample bookings, and MSW creates defaults, but the backend currently expects a row for GET.

### What should be done in the future

- Add `GET` fallback behavior or create review rows lazily when missing.
- Add a Storybook interaction story for saving a review note.
- Implement editable booking details as the next booking workflow slice.

### Code review instructions

Review backend first:

```text
pkg/db/migrations/000003_add_booking_reviews.up.sql
pkg/db/queries/booking_reviews.sql
pkg/repository/postgres/submission_repo.go
pkg/service/submission_service.go
pkg/server/app.go
```

Then review frontend:

```text
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/mockHandlers.ts
web/packages/pyxis-app/src/components/organisms/BookingReviewNotePanel/BookingReviewNotePanel.tsx
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx
```

## Step 6: Implement booking detail edit and artist create/edit/detail, then add page stories

I continued the staff operations workflow after review-note persistence and implemented both remaining workflow slices the user asked to continue with: editable booking request details and artist create/edit/detail functionality. I also added MSW-backed page interaction stories for the affected pages after checking that only the base Desktop/Mobile stories existed for them.

### Prompt Context

**User prompt (verbatim):** "continue, implement both"

**Follow-up user prompt (verbatim):** "did you add stories for each of the pages?"

**Assistant interpretation:** Implement both booking detail editing and artist create/edit/detail, and ensure the changed pages have MSW-backed Storybook page stories.

**Inferred user intent:** The user wants not only backend/frontend functionality, but demonstrable route-page stories for each changed workflow page.

### What I did

- Added `UpdateSubmissionDetails` sqlc query for booking request edits.
- Added repository/service support for `SubmissionRepo.UpdateDetails` and `SubmissionService.UpdateDetails`.
- Added staff endpoint:
  - `PATCH /api/app/bookings/{id}`
- Converted booking update payloads to protobuf-backed `Submission` JSON via `protojson`/`toJson`.
- Added `ArtistService.Create` and staff endpoint:
  - `POST /api/app/artists`
- Converted artist create/update to protobuf-backed `Artist` JSON.
- Reworked `BookingReviewRequestPanel` into an editable request details form.
- Reworked `ArtistsPage` into a roster plus create/edit/detail form.
- Added stateful MSW handlers for booking detail update and artist create/update.
- Added page interaction stories:
  - `Booking Review / SaveBookingDetailsMutation`
  - `Booking Review / SaveReviewNoteMutation`
  - `Artists / CreateArtistMutation`
  - `Artists / EditArtistMutation`

### Why

Booking requests often need staff cleanup before approval, and artist records need direct maintenance without relying on booking approval side effects. Page-level Storybook stories make these workflows reviewable without the live backend.

### What worked

Validation passed:

```bash
go test ./...
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
```

### What didn't work

The first app build caught a TypeScript issue in the MSW artist create handler: spreading `Partial<Artist>` carried an optional `$typeName`, which does not satisfy `MessageInit<Artist>`. I fixed it by explicitly mapping artist fields into `create(ArtistSchema, { ... })`.

### What I learned

Using explicit field mapping for protobuf messages is safer than spreading generated Buf message types, especially in MSW handlers that accept `Partial<T>` JSON payloads.

### What was tricky to build

The Booking Review page now has two independent edits: booking request details and internal review notes. Keeping those separate in RTK (`updateBooking` versus `updateBookingReview`) makes the UI and future audit semantics clearer.

### What warrants a second pair of eyes

- Artist UI is implemented inline as a page detail/editor panel, not a drawer. This satisfies create/edit/detail functionality but differs from the earlier “ArtistEditorDrawer” wording.
- Booking detail edit currently updates the submission fields directly and does not include a separate success toast beyond retaining the edited form state.

### What should be done in the future

- Add explicit success messaging for booking detail save.
- Add route-level artist detail URLs if desired; current implementation is a selected detail panel within the Artists page.
- Add runtime browser smoke through the Vite app for the two workflows.

### Code review instructions

Review backend changes first:

```text
pkg/db/queries/submissions.sql
pkg/repository/postgres/submission_repo.go
pkg/service/submission_service.go
pkg/service/artist_service.go
pkg/server/app.go
pkg/server/server.go
```

Then review frontend/MSW/stories:

```text
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/mockHandlers.ts
web/packages/pyxis-app/src/components/organisms/BookingReviewRequestPanel/BookingReviewRequestPanel.tsx
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.tsx
web/packages/pyxis-app/src/pages/BookingReviewPage/Page.stories.tsx
web/packages/pyxis-app/src/pages/ArtistsPage/Page.tsx
web/packages/pyxis-app/src/pages/ArtistsPage/Page.stories.tsx
```
