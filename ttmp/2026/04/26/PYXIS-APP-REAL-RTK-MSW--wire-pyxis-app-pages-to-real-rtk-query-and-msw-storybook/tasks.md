# Tasks

## Phase 1: Vite proxy and API base URL

- [ ] Add Vite dev proxy to `web/packages/pyxis-app/vite.config.ts` for `/api`, `/auth`, and `/flyers`.
- [ ] Add Vite dev proxy to `web/packages/pyxis-user-site/vite.config.ts` for `/api`, `/auth`, and `/flyers` if needed.
- [ ] Change `API_BASE_URL` default in `web/packages/pyxis-app/src/api/appApi.ts` from `http://localhost:8080` to `''`.
- [ ] Change `API_BASE_URL` default in `web/packages/pyxis-user-site/src/api/publicApi.ts` from `http://localhost:8080` to `''`.
- [ ] Verify browser requests hit Vite origin (`localhost:3008/api/...`) and proxy to Go.

## Phase 2: Staff RTK Query mutations

- [ ] Extend `web/packages/pyxis-app/src/api/endpoints.ts` with mutation paths: show cancel/archive/announce/flyer, booking approve/decline, calendar hold/blocked CRUD, attendance show endpoint.
- [ ] Add `createShow` mutation.
- [ ] Add `updateShow` mutation.
- [ ] Add `cancelShow` mutation.
- [ ] Add `archiveShow` mutation.
- [ ] Add `announceShow` mutation.
- [ ] Add `uploadShowFlyer` mutation.
- [ ] Add `deleteShowFlyer` mutation.
- [ ] Add `approveBooking` mutation.
- [ ] Add `declineBooking` mutation.
- [ ] Add `updateArtist` mutation.
- [ ] Add `createCalendarHold` mutation.
- [ ] Add `deleteCalendarHold` mutation.
- [ ] Add `createCalendarBlocked` mutation.
- [ ] Add `deleteCalendarBlocked` mutation.
- [ ] Add `updateAttendance` mutation.
- [ ] Add `updateSettings` mutation.
- [ ] Ensure each mutation decodes the correct proto response with `fromJson`.
- [ ] Ensure each mutation invalidates relevant RTK Query tags.

## Phase 3: Staff page state cleanup

- [ ] Add reusable page loading/error/empty helpers or components.
- [ ] Remove `seedShows` fallback from `DashboardPage` and add loading/error handling.
- [ ] Remove `seedShows` fallback from `ShowsPage` and add loading/error handling.
- [ ] Remove `seedEvents` fallback from `CalendarPage` and add loading/error handling.
- [ ] Remove `seedBookings` fallback from `BookingsPage` and add loading/error handling.
- [ ] Remove `seedArtists` fallback from `ArtistsPage` and add loading/error handling.
- [ ] Remove `seedAttendance` fallback from `AttendancePage` and add loading/error handling.
- [ ] Remove `seedLog` fallback from `AuditLogPage` and add loading/error handling.
- [ ] Remove `seedSettings` fallback from `SettingsPage` and add loading/error handling.
- [ ] Keep `mockData.ts` only for MSW and Storybook fixture construction.

## Phase 4: Detail route wiring

- [ ] Update `ShowDetailPage` to read `id` via `useParams()`.
- [ ] Update `ShowDetailPage` to call `useGetShowQuery(id)`.
- [ ] Add loading and not-found states to `ShowDetailPage`.
- [ ] Update `BookingReviewPage` to read `id` via `useParams()`.
- [ ] Wire `BookingReviewPage` to real query data by selecting from `useGetBookingsQuery()`.
- [ ] Add loading and not-found states to `BookingReviewPage`.
- [ ] Optional backend follow-up: add `GET /api/app/bookings/{id}` and `useGetBookingQuery(id)`.

## Phase 5: Wire mutations to UI callbacks

- [ ] Wire `BookingsInboxPanel` `onApprove` to `approveBooking`.
- [ ] Wire `BookingsInboxPanel` `onDecline` to `declineBooking`.
- [ ] Decide whether `onHold` is supported now or deferred.
- [ ] Wire show cancel button in `ShowDetailPage` to `cancelShow`.
- [ ] Wire show archive action where appropriate.
- [ ] Wire announce action to `announceShow`.
- [ ] Wire settings form/toggles to `updateSettings`.
- [ ] Wire attendance panel edits to `updateAttendance`.
- [ ] Wire calendar add/delete hold and blocked actions when the UI is ready.
- [ ] Use `.unwrap()` for mutations that need page-level success/error handling.

## Phase 6: MSW Storybook hardening

- [ ] Expand `web/packages/pyxis-app/src/api/mockHandlers.ts` to cover every staff GET endpoint.
- [ ] Add MSW handlers for every mutation added in Phase 2.
- [ ] Make MSW handlers return protobuf-shaped wrappers (`{ shows }`, `{ submissions }`, `{ error: { code, message } }`, etc.).
- [ ] Add in-memory mutable fixture state with `resetMockState()`.
- [ ] Add story-level handlers for loading/error/empty states.
- [ ] Add page-level stories that render actual pages using RTK Query hooks.
- [ ] Add route-param Storybook wrappers for `/shows/:id` and `/bookings/review/:id`.
- [ ] Confirm Storybook works without Go backend running.

## Phase 7: Fixture scraping automation

- [x] Add initial scraper script to ticket workspace: `scripts/scrape-msw-seed.mjs`.
- [ ] Run scraper against seeded local Go server with a valid staff session cookie.
- [ ] Store generated fixture JSON under ticket `sources/` for review.
- [ ] Decide whether to copy scraper into repo (`web/scripts/` or `scripts/`) after review.
- [ ] Decide whether generated fixtures should live in `pyxis-app/src/api/fixtures/`.
- [ ] Document fixture refresh workflow in README or playbook.

## Phase 8: Optional CalendarEvent proto cleanup

- [ ] Add `CalendarEvent` and `CalendarEventList` proto messages.
- [ ] Update backend `GET /api/app/calendar` to return unified confirmed-show/hold/blocked events.
- [ ] Regenerate Go and TypeScript protobuf code.
- [ ] Remove hand-written `CalendarEvent` from `pyxis-types/src/app.ts`.
- [ ] Update `appApi.ts` to use `CalendarEventListSchema`.
- [ ] Update `CalendarEventChip` to use enum status with `StatusDot status={event.status}`.

## Phase 9: Validation and handoff

- [ ] `go build ./...` passes.
- [ ] `cd web/packages/pyxis-types && pnpm build` passes.
- [ ] `cd web/packages/pyxis-app && pnpm build` passes.
- [ ] `cd web/packages/pyxis-components && pnpm build` passes.
- [ ] `cd web/packages/pyxis-user-site && pnpm build` passes.
- [ ] `cd web && pnpm build` passes.
- [ ] Manual app test via Vite proxy passes.
- [ ] Storybook page stories render with MSW and no backend.
- [ ] Diary updated with commands, failures, and validation results.
- [ ] Changelog updated.
