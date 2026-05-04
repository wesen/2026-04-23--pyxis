---
DocType: reference
Ticket: PYXIS-GOOGLE-CALENDAR
Title: Diary
Status: active
Intent: long-term
Topics:
  - google-calendar
  - go
  - backend
LastUpdated: 2026-05-04
---

# Diary

## Goal

Chronological record of implementing Google Calendar integration (push shows to GCal + pull external calendars) for Pyxis.

## Step 1: Phase 1 — Add Go dependency and scaffold pkg/gcal

### Prompt Context

**User prompt (verbatim):** "Let's work on docmgr ticket @ttmp/2026/04/29/PYXIS-GOOGLE-CALENDAR--add-google-calendar-integration-for-import-and-sync/ Read the the diary / docmgr skills, read the design doc, and start working on the tasks. Use playwright and loop me in when creating the gcal service account."

**Assistant interpretation:** Read the full design doc, understand the codebase architecture, and begin implementing the tasks in order. Use Playwright browser for Google Cloud Console steps and loop the user in for interactive decisions.

**Inferred user intent:** Get the Google Calendar integration built end-to-end, starting with infrastructure/auth and working through the phases.

### What I did

- Read the full 2048-line design doc, all existing code (config, domain, server, services, repos, migrations, sqlc queries, serve command)
- Created diary document via docmgr
- Added `google.golang.org/api` dependency
- Created `pkg/gcal/client.go` with service account auth, CreateEvent, UpdateEvent, DeleteEvent, ListExternalEvents
- Created `pkg/gcal/types.go` with ExternalEvent and SyncResult types
- Created `pkg/gcal/show_to_event.go` with ShowToEvent conversion

### What worked

- Codebase follows clean patterns: domain → repo → service → server layers, sqlc for DB access
- Glazed CLI framework with env var flags in serve.go — straightforward to add new flags

### What didn't work

- N/A yet (still in early implementation)

### What I learned

- Config uses Glazed `fields.New()` pattern with `envOr()` helpers — need to add GCal flags there
- Domain types are plain Go structs, repos convert between sqlc types and domain types
- ShowService accepts a `discord.Client` interface — similar pattern for gcal client

### What was tricky to build

- The sqlc-generated types use pgtype wrappers — need to handle new columns carefully in migrations and repo conversion functions

### What warrants a second pair of eyes

- Error handling in gcal client (fire-and-forget vs blocking)
- ShowToEvent time calculation (end time estimation)

### What should be done in the future

- Phase 6 staff UI for managing external calendars
- Webhook support for bidirectional sync
