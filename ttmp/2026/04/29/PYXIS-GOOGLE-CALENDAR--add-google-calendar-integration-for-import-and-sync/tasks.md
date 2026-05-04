---
DocType: tasks
Ticket: PYXIS-GOOGLE-CALENDAR
LastUpdated: 2026-05-04
---

# Tasks

## Phase 1: Infrastructure & Authentication

- [x] 1.1 Create Google Cloud project and enable Calendar API
- [x] 1.2 Create service account and download credentials JSON
- [x] 1.3 Share venue's Google Calendar with the service account email
- [x] 1.4 Add `google.golang.org/api/calendar/v3` dependency
- [x] 1.5 Create `pkg/gcal/client.go` with service account auth
- [x] 1.6 Test authentication (call calendarList.List)

## Phase 2: Database Migrations

- [x] 2.1 Migration: add `google_cal_event_id`, `google_cal_synced_at` to `shows`
- [x] 2.2 Migration: add `google_cal_enabled`, `google_cal_id`, `external_calendars` to `settings`
- [x] 2.3 Update domain types (`show.go`, `settings.go`)
- [x] 2.4 Update sqlc queries and regenerate

## Phase 3: Push — Export Shows to Google Calendar

- [x] 3.1 Create `pkg/gcal/client.go` (CreateEvent, UpdateEvent, DeleteEvent)
- [x] 3.2 Create `pkg/gcal/show_to_event.go` (Show → calendar.Event conversion)
- [x] 3.3 Add sync hooks to ShowService (Create, Update, Cancel)
- [x] 3.4 Add unit tests for ShowToEvent and sync hooks
- [x] 3.5 Manual test: create show → verify GCal event appears

## Phase 4: Pull — Import External Calendars

- [x] 4.1 Add `ListExternalEvents` to gcal client
- [x] 4.2 Add `GET /api/public/external-events` route and handler
- [x] 4.3 Implement in-memory caching (5 min TTL)
- [x] 4.4 Add config parsing for external_calendars JSON
- [x] 4.5 Add `ExternalEvent` and `ExternalEventList` to `proto/pyxis/v1/show.proto`
- [x] 4.6 Run `buf generate` to regenerate Go + TS types
- [x] 4.7 Convert handler from `respondJSON` to `respondProtoJSON` using proto types
- [ ] 4.8 Unit and integration tests (including proto serialization round-trip)
- [ ] 4.9 Manual test: configure external calendar → verify events appear

## Phase 5: Frontend

- [x] 5.1 Re-export `ExternalEvent` / `ExternalEventList` schemas from `pyxis-types`
- [x] 5.2 Add `externalEvents` endpoint to `endpoints.ts`
- [x] 5.3 Add `getExternalEvents` RTK Query endpoint in `publicApi.ts` (with `fromJson(ExternalEventListSchema, ...)`)
- [x] 5.4 Add `useExternalEvents()` wrapper hook in `api/hooks.ts`
- [x] 5.5 Create `ExternalEventCard` molecule in `pyxis-components`
- [x] 5.6 Create `ExternalEventList` organism in `pyxis-components`
- [x] 5.7 Add external events section to `ShowsPage/Page.tsx`
- [x] 5.8 Storybook stories for `ExternalEventCard` and `ExternalEventList`
- [x] 5.9 Responsive styling and CSS

## Phase 4.5-4.6 note: Proto-first for external events

The external-events endpoint must use protobuf like every other public API endpoint.
This means adding messages to `show.proto`, running `buf generate`, and converting
the handler from raw JSON to `respondProtoJSON`. The frontend then uses the
generated `ExternalEventListSchema` with `fromJson`, same pattern as shows/archive.

### Also noted: non-proto staff endpoints (deferred)

The show log endpoints (`handleListShowLog`, `handleGetShowLog`, `handleUpsertShowLog`)
also use raw `respondJSON` with ad-hoc structs. These are staff-only internal
endpoints — converting them to proto is a separate cleanup task, not part of
this ticket.

## Phase 6: Staff UI — Widgets, Stories, MSW

- [ ] 6.1 Create `GCalSettingsSection` organism (toggle, calendar ID input, external calendars list)
- [ ] 6.2 Create `ShowGCalSyncStatus` molecule (sync status badge + manual sync button)
- [ ] 6.3 Storybook stories for both components
- [ ] 6.4 MSW mock data updates (settings with gcal fields, shows with sync status)
- [ ] 6.5 Wire `GCalSettingsSection` into `SettingsPanel`
- [ ] 6.6 Wire `ShowGCalSyncStatus` into `ShowDetailInfoPanel`
- [ ] 6.7 RTK Query mutation for manual sync trigger

## Phase 7: Deploy & Polish

- [ ] 7.1 Add GCal credentials as Kubernetes secret
- [ ] 7.2 Set env vars in production
- [ ] 7.3 Deploy to staging, verify end-to-end
- [ ] 7.4 Monitor logs for sync errors
- [ ] 7.5 Update ticket changelog
