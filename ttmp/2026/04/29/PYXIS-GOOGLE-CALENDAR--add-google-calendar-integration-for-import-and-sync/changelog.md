# Changelog

## 2026-04-29

- Initial workspace created


## 2026-04-29

Created detailed design doc (01-google-calendar-integration-guide.md, 80KB, 2048 lines, 17 sections). Covers: bidirectional integration (push shows to GCal, pull external calendars), Google Calendar API v3 reference, service account vs OAuth2 auth comparison, Go client implementation with google.golang.org/api, show-to-event conversion, sync hooks in ShowService, external event import with caching, frontend component design, DB schema changes (shows + settings), config/env var setup, testing strategy, security analysis, 7-phase implementation checklist, and a full service account setup walkthrough. Downloaded 3 Google Calendar API reference docs to sources/. Uploaded to reMarkable.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/29/PYXIS-GOOGLE-CALENDAR--add-google-calendar-integration-for-import-and-sync/design/01-google-calendar-integration-guide.md — Main design document


## 2026-05-04

Implemented backend infrastructure: pkg/gcal client, DB migrations (shows + settings), domain types, sqlc queries, ShowService sync hooks, external-events endpoint with cache, CLI flags (commit 3765fed)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/migrations/000007_add_google_cal_fields_to_shows.up.sql — Migration adding google_cal_event_id and google_cal_synced_at to shows
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/migrations/000008_add_google_cal_fields_to_settings.up.sql — Migration adding google_cal_enabled
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/gcal/client.go — Google Calendar API client with CRUD + ListExternalEvents
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go — Added handleListExternalEvents with in-memory caching
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/show_service.go — Added sync hooks in Create/Update/Cancel + SetGoogleCalClient + SetSettingsRepo


## 2026-05-04

Phase 1 complete: Google Calendar API enabled, service account pyxis-calendar-sync created, JSON credentials downloaded, calendar shared with write access, full CRUD verified (create+delete test passed). Playbook written in playbooks/01-create-service-account.md.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/data/gcal/credentials.json — Service account credentials (gitignored)


## 2026-05-04

Phase 3.4: Unit tests for ShowToEvent (5 cases), description, firstNonEmpty (commit 3298d03). Phase 4.5-4.7: Added ExternalEvent/ExternalEventList to proto, buf generate, converted handler to respondProtoJSON (commit fedd482). Phase 5: Full frontend — ExternalEventCard molecule, ExternalEventList organism, RTK Query endpoint, useExternalEvents hook, ShowsPage integration, Storybook stories (commit 1da1ab0).


## 2026-05-04

Step 8: Added pyxis external-calendars CLI command group (list/set/remove) using Glazed framework. Supports --db-url, --calendar id=name (repeatable), --replace, --calendar-id (commit 2f44bac).

