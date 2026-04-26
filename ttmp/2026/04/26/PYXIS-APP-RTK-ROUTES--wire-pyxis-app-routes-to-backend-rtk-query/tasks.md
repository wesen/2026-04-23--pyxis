---
Title: RTK Routes Implementation Tasks
Ticket: PYXIS-APP-RTK-ROUTES
Status: active
Topics:
  - frontend
  - backend
  - rtk-query
  - pyxis
  - storybook
  - visual-diff
DocType: tasks
Intent: implementation-plan
Summary: Task list for wiring pyxis-app routes to backend response contracts, RTK Query route state, mutations, and visual validation.
---

# RTK Routes Implementation Tasks

## Ground rules

- [ ] Read `design/01-route-and-rtk-query-backend-freshening-guide.md` before coding.
- [ ] Keep `reference/01-diary.md` updated with commands, failures, and decisions.
- [ ] Commit at focused route/API clusters.
- [ ] Keep organisms presentational; pages own data fetching and route state.
- [ ] Keep visual changes separate from API/normalization changes unless unavoidable.
- [ ] Do not use prototype seed data as a live-route fallback.
- [ ] Keep unrelated backend/generated changes out of frontend commits unless the cluster explicitly changes backend contracts.

## Phase 0 — Contract inventory

- [ ] Run `scripts/01-inventory-app-api.py` and paste/record important drift in the diary.
- [ ] Read backend routes in `pkg/server/server.go`.
- [ ] Read staff handlers in `pkg/server/app.go` and auth in `pkg/server/auth.go`.
- [ ] Read current frontend API files:
  - [ ] `web/packages/pyxis-app/src/api/endpoints.ts`
  - [ ] `web/packages/pyxis-app/src/api/appApi.ts`
  - [ ] `web/packages/pyxis-app/src/api/mockHandlers.ts`
  - [ ] `web/packages/pyxis-types/src/app.ts`
- [ ] Decide whether Discord mappings are derived from settings or receive a backend endpoint. Default: derive from settings.

## Phase 1 — API normalization layer

- [ ] Add `web/packages/pyxis-app/src/api/backendTypes.ts`.
- [ ] Add `web/packages/pyxis-app/src/api/normalizers.ts`.
- [ ] Normalize `GET /api/app/shows` `{ shows: Show[] }` into `AppShow[]`.
- [ ] Normalize `GET /api/app/bookings` `{ submissions: Submission[] }` into `BookingRequest[]`.
- [ ] Normalize `GET /api/app/artists` `{ artists: ... }` into `ArtistProfile[]`.
- [ ] Normalize `GET /api/app/calendar` `{ holds, blocked }` into `CalendarEvent[]`.
- [ ] Normalize `GET /api/app/attendance` `{ logs }` into `AttendanceEntry[]`.
- [ ] Normalize `GET /api/app/audit-log` `{ entries }` into `AuditLogEntry[]`.
- [ ] Normalize `GET /api/app/settings` into `SpaceSettings`.
- [ ] Add `settingsToDiscordMappings(settings)` helper if no `/api/app/discord` endpoint is added.
- [ ] Update `appApi.ts` queries with `transformResponse`.
- [ ] Set `credentials: 'include'` in `fetchBaseQuery` if backend runs on a separate origin.
- [ ] Update MSW handlers to return backend-shaped wrappers, not normalized arrays.
- [ ] Run `cd web && pnpm --filter pyxis-app typecheck`.
- [ ] Commit: `Normalize pyxis app backend responses`.

## Phase 2 — Route state helpers

- [ ] Add lightweight route-state components or helpers:
  - [ ] loading,
  - [ ] error with retry,
  - [ ] empty.
- [ ] Add or reuse `AppEmptyState` for empty/error sections.
- [ ] Add `formatRtkError` helper if needed.
- [ ] Add Storybook stories for route-state helpers if they become visible/reusable.
- [ ] Run typecheck.
- [ ] Commit: `Add pyxis app route state helpers`.

## Phase 3 — Query route wiring

Refactor pages one at a time. Each route should stop using seed fallback data in live code.

- [ ] Dashboard:
  - [ ] handle shows/bookings/audit loading/error,
  - [ ] render empty states deliberately,
  - [ ] preserve dashboard visual fixture story behavior.
- [ ] Shows:
  - [ ] handle list loading/error/empty,
  - [ ] keep confirmed/archived sorting stable.
- [ ] Bookings:
  - [ ] handle booking list loading/error/empty,
  - [ ] split pending/processed from normalized data.
- [ ] Booking review:
  - [ ] use `getBooking` or select from list with route param fallback,
  - [ ] handle missing booking.
- [ ] Calendar:
  - [ ] render normalized hold/blocked events,
  - [ ] handle empty calendar.
- [ ] Artists:
  - [ ] handle wrapped artist response,
  - [ ] add error/empty route state.
- [ ] Attendance:
  - [ ] handle attendance log list,
  - [ ] prepare for per-show upsert.
- [ ] Audit log:
  - [ ] handle wrapped entries response,
  - [ ] handle admin-only errors.
- [ ] Discord:
  - [ ] derive mapping from settings or use new endpoint,
  - [ ] remove dead `/api/app/discord` query if deriving.
- [ ] Settings:
  - [ ] handle settings loading/error,
  - [ ] pass settings to panels.
- [ ] Login/setup:
  - [ ] use session state where appropriate,
  - [ ] do not overbuild auth flow if backend OAuth UX is still pending.
- [ ] Run typecheck after each route cluster.

## Phase 4 — Mutations

- [ ] Shows mutations:
  - [ ] create show,
  - [ ] update show,
  - [ ] cancel show,
  - [ ] archive show,
  - [ ] invalidate `Show`, `Calendar`, and `AuditLog` tags as appropriate.
- [ ] Booking mutations:
  - [ ] approve booking,
  - [ ] decline booking,
  - [ ] wire `BookingsInboxPanel` callbacks,
  - [ ] wire `BookingReviewPage` actions.
- [ ] Calendar mutations:
  - [ ] create hold,
  - [ ] delete hold,
  - [ ] create blocked date,
  - [ ] delete blocked date.
- [ ] Attendance mutations:
  - [ ] get attendance for show,
  - [ ] upsert attendance,
  - [ ] wire post-show log route state.
- [ ] Artist mutation:
  - [ ] update artist.
- [ ] Settings mutation:
  - [ ] update settings,
  - [ ] update Discord channel fields through settings if no Discord endpoint exists.
- [ ] Auth mutations/actions:
  - [ ] logout,
  - [ ] session invalidation.
- [ ] Run typecheck.
- [ ] Commit by domain cluster, not all at once.

## Phase 5 — Form and page cleanup moved from prior ticket

- [ ] Extract `NewShowForm` from `NewShowModal`.
- [ ] Wire `NewShowModal` submit to `createShow` mutation.
- [ ] Add validation/submitting/error stories for new show form/modal.
- [ ] Audit form controls against `Field`, `Input`, `Select`, and `Textarea`.
- [ ] Extract Login/Setup inline page sections into widgets if still needed.
- [ ] Split/relocate route-level `pages.css` into page/widget-owned CSS.
- [ ] Audit `AppTopBar -> TopBar` after route state is stable.

## Phase 6 — Visual and Storybook validation

- [ ] Restart Storybook after large refactors.
- [ ] Run focused visual guards for changed targets:
  - [ ] shows confirmed,
  - [ ] bookings queue,
  - [ ] bookings processed,
  - [ ] calendar month/agenda,
  - [ ] new-show-modal,
  - [ ] dashboard metrics if Stat/metric data changes.
- [ ] Add missing visual spec targets for secondary routes if they become acceptance-critical:
  - [ ] artists,
  - [ ] attendance,
  - [ ] audit log,
  - [ ] Discord,
  - [ ] settings.
- [ ] Preserve Storybook fixture data for visual parity even if live routes use real backend data.
- [ ] Document accepted differences in the diary.

## Phase 7 — Final hardening and handoff

- [ ] Run final frontend typecheck.
- [ ] Run backend tests if backend contracts changed.
- [ ] Run API inventory script and confirm no accidental frontend/backend drift remains.
- [ ] Update design guide with final decisions.
- [ ] Update diary and changelog.
- [ ] Upload final guide bundle to reMarkable if requested.
- [ ] Close ticket.
