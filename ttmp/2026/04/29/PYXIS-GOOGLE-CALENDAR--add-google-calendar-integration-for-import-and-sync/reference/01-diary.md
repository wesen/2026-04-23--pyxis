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

**User prompt (verbatim):** (see session summary)

**Assistant interpretation:** Read the full design doc (2048 lines), understand the codebase architecture, and implement the backend code for Google Calendar integration.

**Inferred user intent:** Get the Google Calendar integration built end-to-end, starting with infrastructure/auth and working through the phases.

*(Full details recorded in prior session — Step 1 through Step 4 documented previously.)*

---

## Step 5: Unit tests for ShowToEvent and firstNonEmpty

### Prompt Context

**User prompt (verbatim):** "Continue with the next phases, keep a diary (read skills), catch up by reading the diary so far. Commit at appropriate intervals"

**Assistant interpretation:** Continue implementation from where we left off (Phase 3.4 unit tests → proto → frontend). Read diary skill first, then catch up on diary state before proceeding.

**Inferred user intent:** Autonomously push through the remaining phases with proper documentation.

**Commit (code):** `3298d03` — "test(gcal): add ShowToEvent, description, and firstNonEmpty unit tests"

### What I did

- Read diary skill, caught up on existing diary (Steps 1-4)
- Created `pkg/gcal/client_test.go` with 3 test functions:
  - `TestShowToEvent` — 5 cases: basic show, doors time preference, no space name, default 19:00 start, lineup in description
  - `TestShowToEventDescription` — 3 cases: description+price+age+genre, lineup entries, minimal empty show
  - `TestFirstNonEmpty` — 5 cases covering empty strings, fallbacks, default value
- Fixed test cases where empty `want*` fields were being checked against actual values (added explicit expected values for End, Location, Summary)

### Why

Phase 3.4 — prove ShowToEvent converts shows correctly before wiring the full sync chain.

### What worked

- Test structure matches existing patterns in `show_service_test.go` (table-driven tests)
- All 13 test cases pass on first real run after fixing the empty-expectation bug

### What didn't work

- Initial test had empty `wantEnd`, `wantLocation`, `wantSummary` fields that the test logic checked against actual values — failing on cases where those fields are expected to be non-empty. Fixed by providing explicit expected values.

### What I learned

- The `firstNonEmpty` helper defaults to `"19:00"` when all options are empty — tested that edge case explicitly

### What was tricky to build

- Deciding which ShowToEvent fields to assert per test case — using empty-string to mean "skip check" was error-prone, switched to always providing explicit expectations

### What warrants a second pair of eyes

- The description test uses a simple `contains` helper instead of exact match — description formatting could drift without test failure

### What should be done in the future

- Add sync hook integration tests (mocking gcal.Client) — currently only ShowToEvent is unit-tested
- Test the `externalEventToProto` converter (added in Step 6)

---

## Step 6: Proto-first external events — add ExternalEvent to proto, convert handler to respondProtoJSON

### Prompt Context

**User prompt (verbatim):** (see Step 5)

**Assistant interpretation:** User confirmed the proto-first approach (from prior discussion about keeping all API responses protobuf). Implement the proto schema changes, regenerate, and convert the handler.

**Inferred user intent:** Make the external-events endpoint consistent with all other public endpoints by using protobuf serialization.

**Commit (code):** `fedd482` — "feat(gcal): proto-first external events — add ExternalEvent to proto, convert handler to respondProtoJSON"

### What I did

- Added `ExternalEvent` and `ExternalEventList` messages to `proto/pyxis/v1/show.proto`
- Ran `buf generate` — regenerated Go (`show.pb.go`) and TypeScript (`show_pb.ts`)
- Re-exported `ExternalEvent`, `ExternalEventSchema`, `ExternalEventList`, `ExternalEventListSchema` from `pyxis-types/src/index.ts`
- Added `externalEventToProto()` converter function in `pkg/server/public.go`
- Converted `handleListExternalEvents` from 4x `respondJSON` calls to `respondProtoJSON` with `ExternalEventList`
- Cache hit path also converts via `externalEventToProto` before responding

### Why

User correctly pointed out that skipping protobuf for this endpoint would be inconsistent with every other public endpoint. The proto-first approach means the frontend uses the same `fromJson(ExternalEventListSchema, ...)` pattern as shows/archive.

### What worked

- `buf generate` ran cleanly — no conflicts with existing proto messages
- Go build and all tests pass after conversion
- The `externalEventToProto` function is straightforward — one-to-one field mapping

### What didn't work

- Nothing — all steps completed without errors

### What I learned

- The codebase convention is to use `string` for timestamps (RFC 3339) in proto, not `google.protobuf.Timestamp` — consistent with how `created_at`/`updated_at` are handled elsewhere
- The design doc originally had `google.protobuf.Timestamp` for `google_cal_synced_at` — corrected to `string` to match convention

### What was tricky to build

- The cache hit path needed its own proto conversion — couldn't just return cached `[]gcal.ExternalEvent` anymore, had to convert to `[]*pyxisv1.ExternalEvent` inline

### What warrants a second pair of eyes

- The `externalEventToProto` function converts `time.Time` to RFC 3339 string — verify this matches what the frontend `fromJson` expects

### What should be done in the future

- The show log endpoints also use raw `respondJSON` — documented as deferred cleanup (Section 12.6 in design doc)

---

## Step 7: Frontend — API layer, ExternalEventCard, ExternalEventList, ShowsPage integration, stories

### Prompt Context

**User prompt (verbatim):** (see Step 5)

**Assistant interpretation:** Continue with Phase 5 frontend implementation using the proto-generated types.

**Inferred user intent:** Complete the full frontend stack: API hook → components → page integration → stories.

**Commit (code):** `1da1ab0` — "feat(gcal): add frontend — ExternalEventCard, ExternalEventList, API hook, ShowsPage section, stories"

### What I did

**API layer (3 files):**
- `endpoints.ts` — added `externalEvents: '/api/public/external-events'`
- `publicApi.ts` — added `getExternalEvents` RTK Query endpoint with `fromJson(ExternalEventListSchema, ...)`, added `ExternalEvent` tag type, exported `useGetExternalEventsQuery`
- `hooks.ts` — added `useExternalEvents()` compatibility wrapper, imported `useGetExternalEventsQuery` in top import block

**Components (4 files):**
- `ExternalEventCard.tsx` — molecule with date block, summary, location, calendar badge, external link. Responsive grid layout (3-column on desktop, stacked on mobile).
- `ExternalEventCard.css` — styled with CSS variables for theming, responsive breakpoint at 600px
- `ExternalEventList.tsx` — organism that maps over events array
- `ExternalEventList.css` — simple flex column layout

**Page integration:**
- `ShowsPage/Page.tsx` — added `useExternalEvents()` hook, added "Events Nearby" section below MailingListCTA (only renders when events exist)

**Barrel exports:**
- `pyxis-components/src/index.ts` — exported `ExternalEventCard` and `ExternalEventList`

**Stories:**
- `ExternalEventCard.stories.tsx` — 6 stories: Default, AllDay, WithLocation, WithoutCalendarBadge, WithoutLink, LongSummary
- `ExternalEventList.stories.tsx` — 4 stories: FewEvents, ManyEvents, MixedCalendars, Empty

### Why

Complete the full frontend stack so external calendar events appear on the public shows page.

### What worked

- All components compile and build clean (`pnpm run build` succeeds)
- Proto-generated types flow through the entire chain: Go handler → `respondProtoJSON` → RTK Query → `fromJson(ExternalEventListSchema)` → React components
- Storybook stories use `create()` from `@bufbuild/protobuf` to make mock data, matching existing patterns
- The CSS uses `pyxisPart()` data attributes for component identification

### What didn't work

- First build attempt failed: `pyxis-types` needed to be rebuilt (`pnpm --filter pyxis-types build`) before `pyxis-user-site` could see the new exports
- `ExternalEventList` was imported as a value in `publicApi.ts` but only used as a type — TS flagged it as unused. Removed the value import, kept only `ExternalEventListSchema` (which is used in `fromJson`)
- The `useGetExternalEventsQuery` export was missing from both the `publicApi.ts` destructured export AND the `hooks.ts` top import block — had to add it in both places

### What I learned

- In this monorepo, `pyxis-types` must be rebuilt before downstream packages can see new exports — `pnpm run build` only builds the user-site, not the types package
- RTK Query auto-generates hook names from endpoint names: `getExternalEvents` → `useGetExternalEventsQuery`
- The `pyxisPart()` utility adds `data-part` attributes for component styling hooks — consistent with existing components

### What was tricky to build

- The pnpm workspace dependency chain: `pyxis-types` → `pyxis-components` → `pyxis-user-site`. Changes to proto-generated types require rebuilding each layer. Had to rebuild `pyxis-types` explicitly.
- The import chain for RTK Query hooks: the generated hook must be exported from `publicApi.ts` AND imported in `hooks.ts` AND re-exported from the bottom of `hooks.ts`

### What warrants a second pair of eyes

- The `ExternalEventCard` CSS uses fallback values for all CSS variables (`var(--pyxis-color-border, #e8e4de)`) — verify these match the actual theme tokens
- The ShowsPage renders external events below the mailing list CTA — verify this placement makes sense UX-wise (could also be above the CTA or between shows and CTA)

### What should be done in the future

- Move the "Events Nearby" section above the mailing list CTA (or make it configurable)
- Add a "View all events" link that opens the external calendar
- Consider filtering out events that overlap with Pyxis shows (avoid showing the same event twice)
- Add loading skeleton for external events section

### Code review instructions

- Start with `web/packages/pyxis-types/src/index.ts` — verify the re-exports
- Then `web/packages/pyxis-user-site/src/api/publicApi.ts` — verify the RTK Query endpoint
- Then `web/packages/pyxis-components/src/public/molecules/ExternalEventCard/ExternalEventCard.tsx` — verify the component
- Then `web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx` — verify the integration
- Verify with: `cd web && pnpm run build`

### Technical details

- Commit: `1da1ab0` — 17 files changed, 469 insertions, 7 deletions
- Key new files: `ExternalEventCard.tsx`, `ExternalEventCard.css`, `ExternalEventCard.stories.tsx`, `ExternalEventList.tsx`, `ExternalEventList.css`, `ExternalEventList.stories.tsx`
- Key modified files: `publicApi.ts`, `hooks.ts`, `endpoints.ts`, `ShowsPage/Page.tsx`, `pyxis-components/src/index.ts`, `pyxis-types/src/index.ts`

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
