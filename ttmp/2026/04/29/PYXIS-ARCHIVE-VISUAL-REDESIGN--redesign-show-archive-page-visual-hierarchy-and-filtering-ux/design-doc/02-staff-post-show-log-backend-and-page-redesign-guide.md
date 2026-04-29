---
Title: Staff post-show log backend and page redesign guide
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
    - frontend
    - staff-app
    - backend
    - storybook
    - design-system
DocType: design-doc
Intent: long-term
Owners: []
RelatedFiles:
    - web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
    - web/packages/pyxis-app/src/pages/AttendancePage/Page.stories.tsx
    - web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.tsx
    - web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/AttendancePanel.css
    - web/packages/pyxis-app/src/api/appApi.ts
    - web/packages/pyxis-app/src/api/endpoints.ts
    - pkg/server/app.go
    - pkg/service/attendance_service.go
    - pkg/repository/postgres/attendance_repo.go
    - pkg/db/queries/attendance.sql
    - pkg/db/migrations/000001_init.up.sql
ExternalSources: []
Summary: "Backend-first implementation guide for redesigning the staff Post-show log around a richer show-log model, then using that model to drive a cleaner React/Storybook page."
LastUpdated: 2026-04-29T13:05:00-04:00
WhatFor: "Use this as the starting point for improving the staff Post-show log page by first tightening the backend/API model, then redesigning the page UI around that model."
WhenToUse: "Read before changing attendance logs, post-show notes, show archive workflow, attendance API endpoints, or the staff Attendance/Post-show log page."
---

# Staff post-show log backend and page redesign guide

## Executive summary

The public archive redesign should not start only with the public `/archive` page. The public archive is the visible end of a longer operational workflow: a show happens, staff record post-show facts, those facts become internal history, and some of that history may later become a public archive recap. If the internal post-show log is weak, the public archive can only ever be a styled list of old shows.

The current staff page exists and works. It is routed as:

```text
/attendance
```

The UI title is:

```text
Post-show log
```

However, its backend model is still essentially an `attendance_logs` table with a few fields: draw, notes, incident, incident notes, and logged-by. That model supports basic door count and incident capture, but it does not yet express the richer concept of a “show log” or “post-show report.” The page also has a visual issue similar to the public archive: repeated cards with multiple inputs stacked inside each card. It works as a form, but it does not yet feel like an operational logbook.

This guide proposes starting with the backend/API shape, then redesigning the page around that shape. The first implementation slice should create a clearer **post-show log API contract** that joins show context and log fields into one response. Then the React page can render a cleaner logbook experience:

- a summary header for what needs logging;
- segmented views for “Needs log,” “Logged,” and “Incident”;
- compact show context cards;
- progressive disclosure for editing;
- read-only show notes separated from editable post-show notes;
- Storybook states that demonstrate the full operational workflow.

The important design principle is: **model the workflow first, then style the page**. If the backend still returns only minimal attendance rows, the frontend must keep stitching context together from separate queries. That is fragile and visually awkward. A backend-aware show-log endpoint gives the UI a stable conceptual object to render.

## Why this document exists

The previous archive redesign guide focused on the public archive page. The operator clarified that the staff/backend show log page is the right starting point. That is correct. The public archive asks, “What happened here over time?” The staff post-show log is where “what happened” is recorded.

A useful mental model:

```text
Booking / show setup
      ↓
Confirmed show
      ↓
Show happens
      ↓
Staff post-show log records what happened
      ↓
Internal archive/history
      ↓
Optional public archive recap
```

If we begin at the public archive, we can improve layout. If we begin at the post-show log, we can improve the data that makes the archive meaningful.

## Current system map

### Staff route

The staff page is implemented here:

```text
web/packages/pyxis-app/src/pages/AttendancePage/Page.tsx
```

It is displayed in the app shell with:

```tsx
<AppShell page="attendance" title="Post-show log" eyebrow="Home / Post-show log">
```

The component currently fetches two things:

```ts
const { data: entries, isLoading, isError } = useGetAttendanceQuery();
const { data: shows } = useGetShowsQuery();
```

The first query returns attendance log records. The second query returns shows. The page then builds a client-side map so it can display staff show notes next to attendance entries:

```ts
const showNotesById = useMemo(
  () => Object.fromEntries(
    (shows ?? [])
      .map((show) => [show.id, show.notes])
      .filter(([, notes]) => Boolean(notes))
  ),
  [shows]
);
```

That was a useful quick fix, but it reveals the model problem. A post-show log row should not need a second query just to know the show notes or show context it belongs to.

### Current frontend page structure

The current page flow is:

```text
AttendancePage
  ├─ useGetAttendanceQuery()
  ├─ useGetShowsQuery()
  ├─ search state
  ├─ validation and update handler
  └─ Panel title="Past shows"
       ├─ Search attendance input
       └─ AttendancePanel
            ├─ metrics: Logged / Needs log / Average draw
            └─ AttendanceEditorCard repeated for each entry
```

Each repeated card renders:

```text
Artist
Date · draw summary
Show notes (read-only, if available)
Draw input
Incident checkbox
Notes textarea
Incident notes textarea
Save attendance button
```

This is functionally correct, but conceptually it makes the page feel like a sequence of independent forms. A logbook should make it easy to scan status first and edit only when needed.

### Current API endpoints

Endpoint constants live in:

```text
web/packages/pyxis-app/src/api/endpoints.ts
```

Current attendance endpoints:

```ts
attendance: '/api/app/attendance',
attendanceShow: (showId: number) => `/api/app/attendance/${showId}`,
```

RTK Query wiring lives in:

```text
web/packages/pyxis-app/src/api/appApi.ts
```

Current queries/mutations:

```ts
getAttendance: builder.query<AttendanceLog[], void>({
  query: () => endpoints.attendance,
  transformResponse: (response) => {
    const list = fromJson(AttendanceLogListSchema, response as any);
    return list.logs;
  },
  providesTags: ['Attendance'],
});

updateAttendance: builder.mutation<AttendanceLog, AttendanceUpdateInput>({
  query: ({ showId, ...body }) => ({
    url: endpoints.attendanceShow(showId),
    method: 'PATCH',
    body,
  }),
  transformResponse: (response) => fromJson(AttendanceLogSchema, response as any),
  invalidatesTags: ['Attendance', 'AuditLog'],
});
```

### Current backend handlers

The handlers are in:

```text
pkg/server/app.go
```

Relevant handlers:

```go
func (s *Server) handleListAttendance(w http.ResponseWriter, r *http.Request)
func (s *Server) handleGetAttendance(w http.ResponseWriter, r *http.Request)
func (s *Server) handleUpsertAttendance(w http.ResponseWriter, r *http.Request)
```

`handleListAttendance` supports `limit` and `offset` query params:

```go
limit := 50
offset := 0
if l := r.URL.Query().Get("limit"); l != "" {
    if v, err := strconv.Atoi(l); err == nil && v > 0 {
        limit = v
    }
}
if o := r.URL.Query().Get("offset"); o != "" {
    if v, err := strconv.Atoi(o); err == nil && v >= 0 {
        offset = v
    }
}
```

Then it calls:

```go
logs, err := s.attendanceService.List(ctx, limit, offset)
```

`handleUpsertAttendance` reads a JSON body:

```go
var req struct {
    Draw          *int   `json:"draw"`
    Notes         string `json:"notes"`
    Incident      bool   `json:"incident"`
    IncidentNotes string `json:"incidentNotes"`
}
```

Then it creates a domain log:

```go
updated, err := s.attendanceService.Upsert(ctx, &domain.AttendanceLog{
    ShowID:        showID,
    Draw:          req.Draw,
    Notes:         req.Notes,
    Incident:      req.Incident,
    IncidentNotes: req.IncidentNotes,
    LoggedBy:      &actorID,
})
```

### Current database model

The migration defines:

```sql
CREATE TABLE attendance_logs (
    id             SERIAL PRIMARY KEY,
    show_id        INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    draw           INT,
    notes          TEXT,
    incident       BOOLEAN DEFAULT FALSE,
    incident_notes TEXT,
    logged_by      INT REFERENCES users(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (show_id)
);
```

The show table defines the context that the post-show log wants:

```sql
CREATE TABLE shows (
    id                 SERIAL PRIMARY KEY,
    artist             TEXT NOT NULL,
    date               DATE NOT NULL,
    doors_time         TEXT,
    start_time         TEXT,
    age                TEXT,
    price              TEXT,
    genre              TEXT,
    description        TEXT,
    notes              TEXT,
    status             TEXT NOT NULL DEFAULT 'confirmed',
    flyer_url          TEXT,
    discord_message_id TEXT,
    discord_channel_id TEXT,
    submission_id      INT REFERENCES submissions(id) ON DELETE SET NULL,
    artist_id          INT REFERENCES artists(id) ON DELETE SET NULL,
    created_by         INT REFERENCES users(id) ON DELETE SET NULL,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at         TIMESTAMPTZ DEFAULT NOW()
);
```

Current SQL queries live in:

```text
pkg/db/queries/attendance.sql
```

They are:

```sql
-- name: GetAttendanceLog :one
SELECT * FROM attendance_logs WHERE show_id = $1;

-- name: UpsertAttendanceLog :one
INSERT INTO attendance_logs (show_id, draw, notes, incident, incident_notes, logged_by)
VALUES ($1, $2, $3, $4, $5, $6)
ON CONFLICT (show_id) DO UPDATE SET
    draw = EXCLUDED.draw,
    notes = EXCLUDED.notes,
    incident = EXCLUDED.incident,
    incident_notes = EXCLUDED.incident_notes,
    logged_by = EXCLUDED.logged_by,
    updated_at = NOW()
RETURNING *;

-- name: ListAttendanceLogs :many
SELECT al.*, s.artist, s.date
FROM attendance_logs al
JOIN shows s ON s.id = al.show_id
ORDER BY s.date DESC
LIMIT $1 OFFSET $2;
```

The list query only returns shows that already have an attendance log. This is important. It means the current page cannot naturally show “this show needs a log” unless attendance rows have already been created elsewhere. The UI has a “Needs log” metric, but the backend list is not truly a list of past shows requiring logs. It is a list of existing attendance logs.

## Problem statement

The staff post-show log has three architectural problems.

### Problem 1: The API returns attendance rows, not show-log work items

A staff member does not think, “I need to edit attendance row 17.” They think, “The show from last night needs its post-show log.” The backend should return work items shaped around shows, not around the presence of an existing attendance row.

The current API misses shows without logs because it starts from `attendance_logs` and joins to `shows`. A better show-log list starts from relevant past shows and left-joins attendance logs.

### Problem 2: The frontend has to stitch context from multiple queries

The page currently calls `useGetAttendanceQuery()` and `useGetShowsQuery()` so it can display show notes. This is a smell. The post-show log endpoint should return the context needed to render the post-show log page:

- show id;
- artist;
- date;
- genre;
- show status;
- staff show notes;
- existing attendance/post-show log fields;
- whether the log is complete;
- whether there was an incident;
- who logged it and when.

### Problem 3: The visual layout exposes editing before status

The current UI repeats full forms. This makes scanning difficult. A logbook should first show status and important facts, then allow editing. The default view should answer:

- Which past shows still need logs?
- Which logs have incidents?
- What was the draw?
- What staff notes are attached to the show?
- When was the log last updated?

Editing can be inline, but it should be secondary.

## Proposed backend concept: `ShowLogEntry`

Add a new application-level API model. It can be backed by the existing `attendance_logs` table at first, but the API should represent a show-log work item.

Conceptual TypeScript shape:

```ts
type ShowLogEntry = {
  showId: number;
  attendanceLogId?: number;
  artist: string;
  date: string;
  genre?: string;
  showStatus: ShowStatus;
  showNotes?: string;
  draw?: number;
  postShowNotes?: string;
  incident: boolean;
  incidentNotes?: string;
  loggedBy?: number;
  loggedByName?: string;
  loggedAt?: string;
  updatedAt?: string;
  logStatus: 'needs-log' | 'logged' | 'incident';
};
```

Equivalent protobuf concept:

```proto
message ShowLogEntry {
  int32  show_id           = 1;
  int32  attendance_log_id = 2;
  string artist            = 3;
  string date              = 4;
  string genre             = 5;
  ShowStatus show_status   = 6;
  string show_notes        = 7;
  int32  draw              = 8;
  string post_show_notes   = 9;
  bool   incident          = 10;
  string incident_notes    = 11;
  int32  logged_by         = 12;
  string logged_by_name    = 13;
  string logged_at         = 14;
  string updated_at        = 15;
  string log_status        = 16;
}

message ShowLogEntryList {
  repeated ShowLogEntry entries = 1;
}
```

The exact field names can be adjusted, but the important separation is:

- `show_notes` means staff notes stored on the show record before or during the show;
- `post_show_notes` means notes written after the show as part of the log.

That distinction matters because they answer different questions.

## Proposed endpoint design

Keep the existing attendance endpoints temporarily for compatibility, but add clearer show-log endpoints.

```text
GET   /api/app/show-log
GET   /api/app/show-log/{showId}
PATCH /api/app/show-log/{showId}
```

Alternative: keep URLs under attendance:

```text
GET   /api/app/attendance/show-log
GET   /api/app/attendance/{showId}
PATCH /api/app/attendance/{showId}
```

Recommendation: use `/api/app/show-log` because the page and workflow are called “Post-show log,” not “Attendance.” Attendance is one field inside the log.

### Query parameters

`GET /api/app/show-log` should support:

```text
status=needs-log|logged|incident|all
search=<artist/date/notes text>
limit=50
offset=0
```

Optional later:

```text
from=YYYY-MM-DD
to=YYYY-MM-DD
```

Start with `status`, `search`, `limit`, and `offset`.

### Response example

```json
{
  "entries": [
    {
      "showId": 42,
      "attendanceLogId": 17,
      "artist": "Planning for Burial",
      "date": "2026-04-26",
      "genre": "Noise / ambient",
      "showStatus": "SHOW_STATUS_ARCHIVED",
      "showNotes": "Ask artist about merch table before doors.",
      "draw": 84,
      "postShowNotes": "Strong turnout. Door split settled after close.",
      "incident": false,
      "incidentNotes": "",
      "loggedBy": 3,
      "loggedByName": "manuel",
      "loggedAt": "2026-04-27T01:20:00-04:00",
      "updatedAt": "2026-04-27T01:20:00-04:00",
      "logStatus": "logged"
    }
  ]
}
```

## SQL design

The new list query should start from shows and left join attendance logs.

Pseudocode SQL:

```sql
-- name: ListShowLogEntries :many
SELECT
  s.id AS show_id,
  al.id AS attendance_log_id,
  s.artist,
  s.date,
  s.genre,
  s.status AS show_status,
  s.notes AS show_notes,
  al.draw,
  al.notes AS post_show_notes,
  COALESCE(al.incident, false) AS incident,
  al.incident_notes,
  al.logged_by,
  u.username AS logged_by_name,
  al.created_at AS logged_at,
  al.updated_at,
  CASE
    WHEN COALESCE(al.incident, false) THEN 'incident'
    WHEN al.id IS NULL OR al.draw IS NULL THEN 'needs-log'
    ELSE 'logged'
  END AS log_status
FROM shows s
LEFT JOIN attendance_logs al ON al.show_id = s.id
LEFT JOIN users u ON u.id = al.logged_by
WHERE s.date <= CURRENT_DATE
  AND s.status IN ('confirmed', 'archived', 'cancelled')
  AND (
    sqlc.narg('search')::text IS NULL
    OR s.artist ILIKE '%' || sqlc.narg('search') || '%'
    OR s.genre ILIKE '%' || sqlc.narg('search') || '%'
    OR s.notes ILIKE '%' || sqlc.narg('search') || '%'
    OR al.notes ILIKE '%' || sqlc.narg('search') || '%'
    OR al.incident_notes ILIKE '%' || sqlc.narg('search') || '%'
  )
  AND (
    sqlc.narg('status')::text IS NULL
    OR sqlc.narg('status') = 'all'
    OR CASE
      WHEN COALESCE(al.incident, false) THEN 'incident'
      WHEN al.id IS NULL OR al.draw IS NULL THEN 'needs-log'
      ELSE 'logged'
    END = sqlc.narg('status')
  )
ORDER BY s.date DESC
LIMIT $1 OFFSET $2;
```

If sqlc named nullable args are too cumbersome in this repo's current SQL style, implement a simpler first pass with separate queries or build filtering in Go after bounded selection. Prefer SQL filtering for scale, but do not let perfect query ergonomics block the first model improvement.

### Count query

For pagination and tabs, add a count query later:

```sql
-- name: CountShowLogEntries :one
SELECT COUNT(*)
FROM shows s
LEFT JOIN attendance_logs al ON al.show_id = s.id
WHERE ...same filters...
```

For the first slice, a `hasMore` flag can be derived by fetching `limit + 1`, but sqlc query shape may make an explicit count cleaner.

## Backend implementation plan

### Phase 1: Domain model

Add a domain type:

```text
pkg/domain/show_log.go
```

Pseudocode:

```go
type ShowLogStatus string

const (
    ShowLogStatusNeedsLog ShowLogStatus = "needs-log"
    ShowLogStatusLogged   ShowLogStatus = "logged"
    ShowLogStatusIncident ShowLogStatus = "incident"
)

type ShowLogEntry struct {
    ShowID          int
    AttendanceLogID *int
    Artist          string
    Date            time.Time
    Genre           string
    ShowStatus      string
    ShowNotes       string
    Draw            *int
    PostShowNotes   string
    Incident        bool
    IncidentNotes   string
    LoggedBy        *int
    LoggedByName    string
    LoggedAt        *time.Time
    UpdatedAt       *time.Time
    LogStatus       ShowLogStatus
}
```

### Phase 2: Repository query

Add repository method:

```go
type AttendanceRepository interface {
    ...existing methods...
    ListShowLogEntries(ctx context.Context, filter ShowLogFilter) ([]domain.ShowLogEntry, error)
}
```

Or create a dedicated repository:

```go
type ShowLogRepository interface {
    List(ctx context.Context, filter ShowLogFilter) ([]domain.ShowLogEntry, error)
    GetByShowID(ctx context.Context, showID int) (*domain.ShowLogEntry, error)
    Upsert(ctx context.Context, showID int, input ShowLogUpdate) (*domain.ShowLogEntry, error)
}
```

Recommendation: if the codebase is small, extend `AttendanceRepository` first. If show-log grows to include settlement, payout, recap publishing, or attachments, split it into its own repository later.

### Phase 3: Service layer

Add service methods:

```go
type ShowLogService struct {
    repo repository.ShowLogRepository
    audit *AuditService
}

func (s *ShowLogService) List(ctx context.Context, filter domain.ShowLogFilter) ([]domain.ShowLogEntry, error)
func (s *ShowLogService) Upsert(ctx context.Context, showID int, update domain.ShowLogUpdate, actor *domain.User) (*domain.ShowLogEntry, error)
```

Validation belongs here:

```go
if update.Draw != nil && *update.Draw < 0 { return validation error }
if update.Draw != nil && *update.Draw > 10000 { return validation error }
if update.Incident && strings.TrimSpace(update.IncidentNotes) == "" { return validation error }
```

The frontend already validates these, but backend validation is still required.

### Phase 4: Server handlers

Add handlers in:

```text
pkg/server/app.go
```

Pseudocode:

```go
func (s *Server) handleListShowLog(w http.ResponseWriter, r *http.Request) {
    filter := domain.ShowLogFilter{
        Status: strings.TrimSpace(r.URL.Query().Get("status")),
        Search: strings.TrimSpace(r.URL.Query().Get("search")),
        Limit: parseLimit(r, 50),
        Offset: parseOffset(r),
    }

    entries, err := s.showLogService.List(r.Context(), filter)
    if err != nil { respondError(w, err); return }

    respondProtoJSON(w, http.StatusOK, showLogEntryListToProto(entries))
}
```

Add route registration wherever app routes are configured in `pkg/server/server.go` or related server setup.

### Phase 5: Proto/types

Add protobuf messages in:

```text
proto/pyxis/v1/show.proto
```

Then regenerate Go and TS types using the repo's existing generation workflow. Check `Makefile` or existing scripts before guessing the command. If generation is manual in this repo, document the exact command in the diary.

Potential messages:

```proto
message ShowLogEntry { ... }
message ShowLogEntryList { repeated ShowLogEntry entries = 1; }
```

The frontend should import generated schemas from `pyxis-types` just like `AttendanceLogSchema` today.

## Frontend redesign and componentization plan

Once the API returns `ShowLogEntry[]`, the page should become simpler and more expressive. The first implementation slice should build the Post-show log as a small component family, while only extracting the tiny primitives that are immediately needed. Broader staff UI unification is documented separately in [03 Staff UI unification plan](./03-staff-ui-unification-plan.md) and should be tackled later.

### New page flow

```text
PostShowLogPage
  ├─ useGetShowLogQuery({ status, search, limit, offset })
  ├─ useUpdateShowLogMutation()
  ├─ local UI state: activeStatus, search, expandedShowId
  └─ PostShowLogPanel
       ├─ PostShowLogSummary
       ├─ PostShowLogToolbar
       └─ PostShowLogEntryList
            └─ PostShowLogEntryCard
                 ├─ collapsed summary
                 └─ expanded editor
```

### Proposed components

Create a new component folder rather than continuing to overload `Roster/AttendancePanel`:

```text
web/packages/pyxis-app/src/components/organisms/PostShowLog/PostShowLogPanel/PostShowLogPanel.tsx
web/packages/pyxis-app/src/components/organisms/PostShowLog/PostShowLogToolbar/PostShowLogToolbar.tsx
web/packages/pyxis-app/src/components/organisms/PostShowLog/PostShowLogEntryCard/PostShowLogEntryCard.tsx
web/packages/pyxis-app/src/components/organisms/PostShowLog/PostShowLogSummary/PostShowLogSummary.tsx
```

This naming is important. “Attendance” is a metric. “Post-show log” is the workflow.

For the first slice, introduce these small reusable primitives because the Post-show log needs them immediately:

```text
web/packages/pyxis-app/src/components/molecules/AppCard/
web/packages/pyxis-app/src/components/molecules/StatusBadge/
web/packages/pyxis-app/src/components/molecules/MetadataStrip/
web/packages/pyxis-app/src/components/molecules/NoteBlock/
web/packages/pyxis-app/src/components/molecules/FieldError/
```

Do **not** introduce the broader `RouteListToolbar` abstraction yet. Build `PostShowLogToolbar` first, prove the shape in Storybook, then extract a generic toolbar later if Shows, Audit Log, Artists, and Bookings can all share it cleanly.

### First slice component dependency diagram

```text
PostShowLogPanel
  ├─ PostShowLogSummary
  │    └─ existing MetricCard or compact metric styling
  ├─ PostShowLogToolbar
  │    └─ Button/Input primitives
  └─ PostShowLogEntryCard
       ├─ AppCard
       ├─ StatusBadge
       ├─ MetadataStrip
       ├─ NoteBlock
       └─ FieldError
```

### Table-first visual model

After reviewing the first card-based component pass, the preferred direction is closer to `ShowsConfirmedPanel`: an elegant, concise table inside a `Panel`. The default view should be a ledger, not a stack of large cards. Each row should scan quickly, expand for read-only detail, and use an edit button to open a modal for writing the log.

Default table:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Past shows                                      Needs log 3 · Incidents 2    │
├────────────┬────────────────────┬──────────────┬──────┬──────────┬─────────┤
│ Date       │ Artist             │ Status       │ Draw │ Incident │         │
├────────────┼────────────────────┼──────────────┼──────┼──────────┼─────────┤
│ Apr 26     │ Planning for Burial│ NEEDS LOG    │ —    │ No       │ Edit ▾  │
│ Apr 18     │ Actress            │ LOGGED       │ 61   │ No       │ Edit ▾  │
│ Apr 12     │ Example Artist     │ INCIDENT     │ 48   │ Yes      │ Edit ▾  │
└────────────┴────────────────────┴──────────────┴──────┴──────────┴─────────┘
```

Expanded row detail:

```text
Apr 26  Planning for Burial  NEEDS LOG  —  No  [Edit log] [⌃]
└─ Show notes: Ask about merch table placement before doors.
   Post-show notes: No post-show notes yet.
   Incident notes: No incident notes.
```

Edit modal:

```text
┌──────────────────────────────────────────────────────┐
│ Log show — Planning for Burial                       │
│ Sat Apr 26, 2026 · Noise / ambient                   │
├──────────────────────────────────────────────────────┤
│ Show notes                                           │
│ Ask about merch table placement before doors.        │
│                                                      │
│ Draw [ 84 ]        [ ] Mark incident                 │
│ Notes                                                │
│ [ textarea                                        ]  │
│ Incident notes                                       │
│ [ textarea, disabled unless incident              ]  │
├──────────────────────────────────────────────────────┤
│                              [Cancel] [Save log]     │
└──────────────────────────────────────────────────────┘
```

This table-first approach keeps the log page visually aligned with:

```text
web/packages/pyxis-app/src/components/organisms/Shows/ShowsConfirmedPanel/ShowsConfirmedPanel.tsx
web/packages/pyxis-app/src/components/organisms/Shows/ShowsTable/ShowsTable.tsx
web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx
```

### Why row expansion plus modal editing matters

The current page shows every input for every show at once. That makes the page hard to scan. The card prototype improved validation and state modeling, but it still made the page feel heavier than the Shows table. The better progression is:

- table row for scan-first operational status;
- expanded row for read-only log details;
- modal for focused editing.

This preserves progressive disclosure while keeping the page compact.

## Storybook and visual review plan

This post-show log redesign is a new staff-app component family. There is no standalone prototype HTML screen to compare against. Do **not** try to force it into the public-site prototype-to-Storybook visual-diff workflow. The right workflow is Storybook-first component design, then approved Storybook screenshots become the regression baseline.

That means the first visual source of truth is not:

```text
prototype-design/standalone/...
```

The first visual source of truth is:

```text
web/packages/pyxis-app/src/components/organisms/PostShowLog/**/*.stories.tsx
web/packages/pyxis-app/src/pages/AttendancePage/Page.stories.tsx
```

The review loop should be:

```text
1. Build the new component in Storybook with realistic fixtures.
2. Review desktop and mobile Storybook states manually.
3. Capture approved Storybook screenshots as baseline evidence.
4. Add Storybook-only visual targets if/when css-visual-diff supports same-source baseline comparisons for app stories.
5. Validate the live Vite page for data/API behavior after the visual language is approved.
```

A useful naming distinction:

- **Prototype parity** applies when a standalone HTML/React prototype already exists and the job is to match it.
- **New component visual definition** applies here: the component is being designed inside the production component system, and Storybook stories define its intended states.

Existing page stories live in:

```text
web/packages/pyxis-app/src/pages/AttendancePage/Page.stories.tsx
```

Existing stories:

```text
Desktop
EditAttendanceMutation
IncidentRequiresNotes
SearchNoResults
```

Add new stories after the API/component redesign:

```text
Pyxis App/Pages/Post-show log/Desktop
Pyxis App/Pages/Post-show log/Mobile
Pyxis App/Pages/Post-show log/NeedsLogOnly
Pyxis App/Pages/Post-show log/LoggedOnly
Pyxis App/Pages/Post-show log/IncidentOnly
Pyxis App/Pages/Post-show log/SearchNoResults
Pyxis App/Pages/Post-show log/SaveSuccess
Pyxis App/Pages/Post-show log/SaveError
```

Add component stories:

```text
Pyxis App/Organisms/PostShowLog/PostShowLogPanel/Mixed
Pyxis App/Organisms/PostShowLog/PostShowLogPanel/Empty
Pyxis App/Organisms/PostShowLog/PostShowLogEntryCard/NeedsLogCollapsed
Pyxis App/Organisms/PostShowLog/PostShowLogEntryCard/LoggedCollapsed
Pyxis App/Organisms/PostShowLog/PostShowLogEntryCard/IncidentCollapsed
Pyxis App/Organisms/PostShowLog/PostShowLogEntryCard/ExpandedEditor
Pyxis App/Organisms/PostShowLog/PostShowLogEntryCard/ValidationError
```

Storybook should demonstrate the conceptual redesign before live data testing. Use MSW to return `ShowLogEntryList` states.

## API migration strategy

Do not break the existing attendance page in one large change. Use an incremental migration.

### Step A: Add new backend endpoint beside old one

Keep:

```text
GET /api/app/attendance
PATCH /api/app/attendance/{showId}
```

Add:

```text
GET /api/app/show-log
PATCH /api/app/show-log/{showId}
```

### Step B: Add frontend RTK Query hooks

Add endpoint constants:

```ts
showLog: '/api/app/show-log',
showLogShow: (showId: number) => `/api/app/show-log/${showId}`,
```

Add RTK Query hooks:

```ts
getShowLog: builder.query<ShowLogEntry[], ShowLogQuery | void>({...})
updateShowLog: builder.mutation<ShowLogEntry, ShowLogUpdateInput>({...})
```

### Step C: Build new components with Storybook fixtures

Use generated types if available. If type generation is not ready, use a temporary local type in the component story only, but do not leave the app permanently disconnected from generated API types.

### Step D: Switch `AttendancePage` to new query

The route can remain `/attendance` and the visible title can remain “Post-show log.” Internally, the component can become a post-show log page.

### Step E: Remove old stitching query

Once `GET /api/app/show-log` includes `showNotes`, remove the extra `useGetShowsQuery()` from `AttendancePage`.

## Visual baseline plan for a new component

Because there is no original standalone input HTML, the implementation should create its own approved baseline bundle.

Suggested baseline artifacts:

```text
sources/post-show-log-storybook-baseline/desktop-mixed.png
sources/post-show-log-storybook-baseline/mobile-mixed.png
sources/post-show-log-storybook-baseline/needs-log.png
sources/post-show-log-storybook-baseline/logged.png
sources/post-show-log-storybook-baseline/incident.png
sources/post-show-log-storybook-baseline/expanded-editor.png
sources/post-show-log-storybook-baseline/validation-error.png
```

A ticket-local script can capture these from Storybook:

```text
scripts/01-capture-post-show-log-storybook-baselines.js
```

Pseudocode:

```js
const stories = [
  ['desktop-mixed', '/iframe.html?id=pyxis-app-organisms-postshowlog-postshowlogpanel--mixed'],
  ['mobile-mixed', '/iframe.html?id=pyxis-app-organisms-postshowlog-postshowlogpanel--mobile'],
  ['incident', '/iframe.html?id=pyxis-app-organisms-postshowlog-postshowlogentrycard--incident-collapsed'],
];

for (const [name, path] of stories) {
  await page.setViewportSize(name.includes('mobile') ? mobile : desktop);
  await page.goto(`${storybookBase}${path}`);
  await page.locator('[data-app-component="post-show-log-panel"]').screenshot({
    path: `${outDir}/${name}.png`,
  });
}
```

If `css-visual-diff` is later used, compare **approved Storybook baseline screenshot → current Storybook screenshot**, not standalone prototype → Storybook. If the tool expects two URLs, use two served artifact locations or two Storybook builds rather than inventing a prototype page.

Acceptance for this new-component workflow:

- Storybook stories cover all important states.
- Screenshots are reviewed and accepted by the operator.
- The baseline screenshots are saved under the ticket `sources/` directory.
- Future visual checks compare against those accepted baselines.

## Validation plan

Backend:

```bash
go test ./... -count=1
```

Frontend:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

Storybook/manual:

- Open Post-show log page stories.
- Verify status tabs/filtering.
- Verify collapsed cards scan well.
- Expand a needs-log card and save.
- Toggle incident and confirm incident notes validation.
- Search by artist, show note, post-show note, and incident note.

Visible Chromium smoke script should be added under this ticket:

```text
ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/scripts/01-post-show-log-visible-smoke.js
```

Evidence should go under:

```text
ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/sources/
```

The smoke should:

1. Login via dev auth.
2. Create or locate a past show.
3. Open `/attendance`.
4. Verify the show appears as needs-log if no attendance exists.
5. Expand the card.
6. Save draw and notes.
7. Verify it becomes logged.
8. Toggle incident without notes and verify validation.

## Acceptance criteria

Backend acceptance:

- `GET /api/app/show-log` returns past show work items whether or not an attendance log exists.
- Each entry includes show context and log fields in one response.
- `PATCH /api/app/show-log/{showId}` validates draw and incident notes server-side.
- Updates write to `attendance_logs` and audit log.
- Existing attendance endpoints either remain compatible or are intentionally migrated.

Frontend acceptance:

- The page no longer displays all fields for all shows by default.
- The default view is scan-first and edit-second.
- Needs-log, logged, and incident states are visually distinct.
- Show notes and post-show notes are clearly separate.
- Search and status filters are unified in a toolbar.
- Storybook covers desktop, mobile, empty, error, needs-log, logged, incident, expanded editor, and validation states.
- The page no longer needs `useGetShowsQuery()` just to display show notes.

## Recommended first implementation slice

Start here, before public archive visual work:

1. Add `ShowLogEntry` / `ShowLogEntryList` schema to protobuf/types.
2. Add a SQL query that starts from `shows` and left joins `attendance_logs`.
3. Add `GET /api/app/show-log` and return unified show-log entries.
4. Add RTK Query `getShowLog` hook.
5. Update `AttendancePage` to read from `getShowLog` while preserving the current UI as much as possible.
6. Only after the data model is correct, redesign the page into collapsed log cards.

This approach creates value quickly. The first visible improvement is that the page can show shows that need logs, not only logs that already exist. The second visible improvement is layout: once entries have clear `logStatus`, the UI can group and style them properly.

## Open questions

1. Should cancelled shows appear in the post-show log, or only confirmed/archived shows whose date has passed?
2. Should a show become archived automatically after its post-show log is saved?
3. Should post-show log completion require draw only, or draw plus notes?
4. Should incident logs have a separate review workflow?
5. Should public archive recaps ever expose post-show notes, or should public recaps use separate public-safe recap text?
6. Should settlement/payout fields be added now, or deferred until the basic log workflow is clean?

## Short glossary

- **Show notes**: Internal notes stored on the show record before or during the event. These may include booking/setup context.
- **Post-show notes**: Notes written after the event as part of the log. These describe what happened.
- **Attendance/draw**: Numeric count of attendees.
- **Incident**: Boolean flag that marks a show log as requiring safety/ops attention.
- **Show log entry**: The combined object the UI should render: show context plus post-show log fields.
- **Public archive recap**: Public-facing historical page. It should not automatically expose internal post-show notes without an explicit public-safe field.
