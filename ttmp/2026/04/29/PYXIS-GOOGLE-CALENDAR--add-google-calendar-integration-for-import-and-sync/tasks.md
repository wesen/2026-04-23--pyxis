---
DocType: tasks
Ticket: PYXIS-GOOGLE-CALENDAR
LastUpdated: 2026-04-29
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
- [ ] 3.4 Add unit tests for ShowToEvent and sync hooks
- [ ] 3.5 Manual test: create show → verify GCal event appears

## Phase 4: Pull — Import External Calendars

- [x] 4.1 Add `ListExternalEvents` to gcal client
- [x] 4.2 Add `GET /api/public/external-events` route and handler
- [x] 4.3 Implement in-memory caching (5 min TTL)
- [x] 4.4 Add config parsing for external_calendars JSON
- [ ] 4.5 Unit and integration tests
- [ ] 4.6 Manual test: configure external calendar → verify events appear

## Phase 5: Frontend

- [ ] 5.1 Add `useExternalEvents` hook
- [ ] 5.2 Create `ExternalEventCard` component
- [ ] 5.3 Add external events section to ShowsPage
- [ ] 5.4 Storybook stories
- [ ] 5.5 Responsive styling

## Phase 6: Staff UI (Optional)

- [ ] 6.1 Google Calendar settings section in staff settings
- [ ] 6.2 Add/remove external calendars from UI
- [ ] 6.3 Show sync status on show detail page
- [ ] 6.4 Manual "Sync to Google Calendar" button

## Phase 7: Deploy & Polish

- [ ] 7.1 Add GCal credentials as Kubernetes secret
- [ ] 7.2 Set env vars in production
- [ ] 7.3 Deploy to staging, verify end-to-end
- [ ] 7.4 Monitor logs for sync errors
- [ ] 7.5 Update ticket changelog
