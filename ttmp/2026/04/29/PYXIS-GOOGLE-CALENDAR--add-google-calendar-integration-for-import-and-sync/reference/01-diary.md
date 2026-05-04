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

## Step 1: Backend code — pkg/gcal, migrations, domain types, sync hooks, routes, CLI flags

### Prompt Context

**User prompt (verbatim):** "Let's work on docmgr ticket @ttmp/2026/04/29/PYXIS-GOOGLE-CALENDAR--add-google-calendar-integration-for-import-and-sync/ Read the the diary / docmgr skills, read the design doc, and start working on the tasks. Use playwright and loop me in when creating the gcal service account."

**Assistant interpretation:** Read the full design doc (2048 lines), understand the codebase architecture, and implement the backend code for Google Calendar integration. Defer the interactive Google Cloud Console steps for when the user is available.

**Inferred user intent:** Get the Google Calendar integration built end-to-end, starting with infrastructure/auth and working through the phases.

### What I did

- Read the full 2048-line design doc, all existing code (config, domain, server, services, repos, migrations, sqlc queries, serve command)
- Added `google.golang.org/api/calendar/v3` dependency (`go get`, `go mod tidy`)
- Created `pkg/gcal/client.go` — service account auth via `google.JWTConfigFromJSON`, CRUD methods (CreateEvent, UpdateEvent, DeleteEvent), ListExternalEvents for import, ShowToEvent conversion
- Created `pkg/gcal/types.go` — ExternalEvent, SyncResult types
- Created DB migrations 000007 (shows: google_cal_event_id, google_cal_synced_at) and 000008 (settings: google_cal_enabled, google_cal_id, external_calendars JSONB)
- Updated domain types: Show got GoogleCalEventID/GoogleCalSyncedAt, Settings got GoogleCalEnabled/GoogleCalID/ExternalCalendars/ExternalCalendarConfig
- Updated sqlc queries (shows.sql: UpdateShowGoogleCalSync; settings.sql: 3 new COALESCE columns) and regenerated
- Updated postgres repos: show_repo got UpdateGoogleCalSync + updated rowToShow/rowWithLineupToShow; settings_repo got dbSettingsToDomain with JSON unmarshal for ExternalCalendars + Update with JSON marshal
- Added sync hooks to ShowService: syncShowToGCal (fire-and-forget goroutine) after Create/Update, deleteGCalEvent after Cancel; added SetGoogleCalClient and SetSettingsRepo methods
- Added `GET /api/public/external-events` handler with in-memory cache (5 min TTL) in public.go
- Wired gcal client initialization in server.go New() (reads credentials from file or env var)
- Added CLI flags to serve.go: --google-cal-enabled, --google-cal-id, --google-cal-credentials, --google-cal-credentials-file
- Updated ShowRepository interface with UpdateGoogleCalSync
- Updated show_service_test.go fakeShowRepo with UpdateGoogleCalSync
- All tests pass, all code compiles
- Committed as 3765fed

### Why

All backend infrastructure needs to exist before we can test with real Google credentials. The design doc was thorough enough to implement everything in one pass.

### What worked

- Codebase follows clean patterns: domain → repo → service → server layers, sqlc for DB access
- Glazed CLI framework with env var flags in serve.go — straightforward to add new flags
- sqlc auto-detected the new migrations and regenerated models.go cleanly
- The design doc's pseudocode mapped almost 1:1 to real Go code

### What didn't work

- Had a minor issue with `edit` replacing the `respondError` function header when appending the external events handler — fixed by re-inserting the function declaration
- Had an unused `sync` import in server.go after refactoring the cache type into public.go — fixed by removing it

### What I learned

- Config uses Glazed `fields.New()` pattern with `envOr()` helpers — clean pattern for adding new env-backed flags
- Domain types are plain Go structs; repos convert between sqlc pgtype-wrapped types and domain types; each conversion function needs to handle new columns
- ShowService accepts a `discord.Client` — used the same setter pattern (SetGoogleCalClient, SetSettingsRepo) instead of modifying the constructor
- sqlc treats JSONB columns as `[]byte` in generated Go code — need explicit json.Marshal/Unmarshal in the repo layer

### What was tricky to build

- The `edit` tool's `oldText` matching: replacing `func respondError` accidentally consumed the function header when I tried to append code before it. Fixed by matching more precisely.
- Keeping the `rowToShow`, `rowWithLineupToShow`, and `upcomingRowToShow` conversion functions in sync — each needed the new GoogleCalEventID/GoogleCalSyncedAt fields handled. The `upcomingRowToShow` didn't get the fields because `ListUpcomingShowsRow` is a separate sqlc type that doesn't include `google_cal_event_id` (the query only selects specific columns).
- Deciding where ExternalCalendarConfig lives: initially tried importing gcal from domain (circular dependency), moved it to domain/settings.go instead

### What warrants a second pair of eyes

- ShowToEvent end time calculation — currently hardcoded to `23:59` of the show date. Should probably be configurable or based on start time + duration.
- Fire-and-forget goroutine in syncShowToGCal uses `context.Background()` not the request context — intentional (we don't want to cancel the GCal sync if the HTTP request ends) but worth confirming.
- The external events cache is per-server-instance with no invalidation mechanism beyond TTL — if settings change, stale data could be served for up to 5 minutes.

### What should be done in the future

- Phase 6 staff UI for managing external calendars from the admin panel
- Webhook support for bidirectional sync (GCal → Pyxis)
- Configurable end time (or per-show duration)
- Cache invalidation when settings are updated

### Code review instructions

- Start with `pkg/gcal/client.go` — the core client, check auth and error handling
- Then `pkg/service/show_service.go` — the sync hooks, check the goroutine + context usage
- Then `pkg/server/public.go` — the external-events handler and cache
- Verify with: `go build ./...` and `go test ./... -count=1 -short`

### Technical details

- Commit: `3765fed` — "feat(gcal): add Google Calendar integration - backend infrastructure"
- 25 files changed, 806 insertions, 51 deletions
- Key new files: `pkg/gcal/client.go`, `pkg/gcal/types.go`, 4 migration files
- Key modified files: `pkg/service/show_service.go`, `pkg/server/server.go`, `pkg/server/public.go`, `cmd/pyxis/cmds/serve.go`

---

## Step 2: Google Cloud Console — service account creation via Playwright

### Prompt Context

**User prompt (verbatim):** (same as Step 1)

**Assistant interpretation:** User logged into Google Cloud Console. I used Playwright to walk through the service account creation interactively, looping the user in at each decision point.

**Inferred user intent:** Create the GCP infrastructure (project, API, service account, credentials) that the backend code needs to talk to Google Calendar.

### What I did

- User already had a project `pyxis` (`pyxis-495321`) — no need to create one
- Navigated to API Library → searched for "Google Calendar API" → clicked **Enable**
- Navigated to IAM & Admin → Service Accounts → **Create service account**
  - Name: `pyxis-calendar-sync`
  - Description: "Pyxis show calendar sync - creates and updates Google Calendar events for venue shows"
  - Skipped permissions (no project-level IAM roles needed)
  - Skipped principals (no one needs to impersonate this SA)
- Navigated to the service account → **Keys** tab → **Add key → Create new key → JSON**
- Credentials downloaded automatically to `.playwright-mcp/pyxis-495321-4aae1c4e6558.json`
- Copied to `data/gcal/credentials.json`, added `data/gcal/` to `.gitignore`
- Service account email: `pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com`

### Why

The service account is the recommended auth mechanism for server-to-server Google Calendar integration (no consent screen, no token refresh, autonomous operation). The JSON key file is the private key — must be kept secret and gitignored.

### What worked

- Playwright navigation through the Google Cloud Console was smooth
- The project already existed with a clean name (`pyxis`)
- JSON key downloaded automatically via Playwright's download handler

### What didn't work

- Nothing — all steps completed without errors

### What I learned

- The Google Cloud Console has a lot of dynamic content that makes snapshot-based navigation verbose, but the accessibility tree is well-structured with clear aria-labels
- Playwright's `page.getByRole()` selectors work well for Google Cloud Console UI elements

### What was tricky to build

- Finding and clicking the service account row in the table — the table uses a grid pattern where the email is a link inside a rowheader cell. Had to use a locator filter to find and click it.

### What warrants a second pair of eyes

- The credentials file must never be committed — confirmed `.gitignore` entry is in place

### What should be done in the future

- Rotate the service account key periodically (the playbook documents how)
- Consider Workload Identity Federation for production (more secure than downloaded keys)

### Technical details

- Google Cloud project: `pyxis-495321` (project number: 9319984903)
- Service account: `pyxis-calendar-sync@pyxis-495321.iam.gserviceaccount.com`
- Service account unique ID: `103926687960628044917`
- Credentials file: `data/gcal/credentials.json` (gitignored)

---

## Step 3: Playbook + calendar sharing instructions + auth test

### Prompt Context

**User prompt (verbatim):** "Write a detailed playbook on creating the serviceaccount key, for future reference. store in ticket" then "also store it in /home/manuel/code/wesen/claw-stuff/playbooks" then "continue, how do i share the calendar?" then "I can do it by hand. how do I do it by hand?"

**Assistant interpretation:** User wants a reusable playbook for the service account setup process, stored both in the ticket and in the shared playbooks directory. Then user needs instructions for sharing the Google Calendar with the service account — decided to do it manually rather than via Playwright.

**Inferred user intent:** Document the one-time setup process for future reference (onboarding, disaster recovery, key rotation). Get the calendar shared so we can test auth end-to-end.

### What I did

- Wrote `playbooks/01-create-service-account.md` — 8-step playbook covering: enable API, create SA, create JSON key, share calendar, configure external calendars, local dev setup, verify auth, production Kubernetes setup. Includes troubleshooting, rollback, and key rotation instructions.
- Copied to `/home/manuel/code/wesen/claw-stuff/playbooks/01-create-service-account.md`
- Gave user concise manual instructions for calendar sharing (hover → three dots → Settings and sharing → Add people → paste SA email → "Make changes to events" → Send → copy Calendar ID)
- User created two test calendars: "Pyxis Fake" and "Pyxis Private Fake", shared both with the service account

### Why

The playbook captures institutional knowledge about GCP setup that's easy to forget. Storing it in the shared playbooks directory makes it discoverable across projects.

### What worked

- Playbook covers the full lifecycle including rollback and key rotation
- User successfully shared calendars manually

### What didn't work

- Playwright couldn't click the three-dot options button on the calendar entry (element not visible) — user did it manually instead

### What I learned

- Google Calendar's left sidebar options buttons are hidden until hover and sometimes not visible to Playwright — manual intervention was the pragmatic choice

### What was tricky to build

- Extracting the calendar ID from the Google Calendar URL — it's base64-encoded in the `cid` query parameter

### What warrants a second pair of eyes

- The playbook assumes the reader has owner access to the Google Cloud project and the Google Calendar

### What should be done in the future

- Add screenshots to the playbook (or link to a Loom video walkthrough)

### Technical details

- Calendar IDs:
  - Pyxis Fake: `84196aa707aae9c09527763c2773c338a98a200bd8a816cc50beeebb41ce0757@group.calendar.google.com`
  - Pyxis Private Fake: `0baf1b50436a2a60f5efd1193c1ab6762c9b4c77c88c9dae68654beb9e33b07b@group.calendar.google.com`

---

## Step 4: Auth verification — read + write CRUD test

### Prompt Context

**User prompt (verbatim):** "ok, do it" (referring to re-testing write access after user updated calendar permissions)

**Assistant interpretation:** User updated the calendar sharing permission to "Make changes to events". Re-run the write test to verify full CRUD.

**Inferred user intent:** Confirm the service account can both read and write to the shared Google Calendar, completing the auth setup.

### What I did

- Wrote a Go test program that creates a test event "🧪 Pyxis Auth Test — delete me" on Pyxis Fake calendar, then immediately deletes it
- First attempt: read access worked on both calendars, but write failed with `403: You need to have writer access to this calendar` — both calendars were shared with read-only ("See all event details") permission
- Asked user to change permission to "Make changes to events"
- Second attempt: full CRUD cycle succeeded — event created (id: `3mth06jl639gp0fkj1doth06jl639gp0fkj1dothksbo`), then deleted
- Updated docmgr tasks (checked 1.1–1.3, 1.6) and changelog
- Committed playbook + task updates

### Why

Proving end-to-end auth before moving to frontend work avoids discovering auth issues later.

### What worked

- Read access worked immediately — the calendar share was correct for reading
- Write access worked after user updated the permission level
- The test program cleanly created and deleted an event, proving the full lifecycle

### What didn't work

- Initial write test failed with 403 — the calendar sharing default was read-only, not write. User needed to explicitly change the permission dropdown to "Make changes to events".

### What I learned

- Google Calendar sharing has two relevant permission levels: "See all event details" (read-only) and "Make changes to events" (read-write). The default when adding a new person/group is "See all event details" — you must explicitly change it.
- The `google.JWTConfigFromJSON` auth flow worked perfectly with the downloaded service account JSON — no consent screen, no token management.

### What was tricky to build

- The 403 error message was clear ("You need to have writer access") — no debugging needed, just a permissions change

### What warrants a second pair of eyes

- The test only verified Pyxis Fake, not Pyxis Private Fake — worth confirming both calendars have write access if both will be used

### What should be done in the future

- Add an automated integration test that runs against a test calendar (could be a CI step with credentials as secrets)
- Verify ListExternalEvents with a calendar that has actual events in it

### Code review instructions

- Check the test programs in this step were temporary (`/tmp/test_gcal*.go`) — not committed
- Verify `data/gcal/credentials.json` is in `.gitignore`

### Technical details

- Test calendar: Pyxis Fake (`84196aa...@group.calendar.google.com`)
- Test event: "🧪 Pyxis Auth Test — delete me" — created then deleted
- Commit: `3007a48` — "docs(gcal): add service account playbook, update tasks/changelog, gitignore credentials"
