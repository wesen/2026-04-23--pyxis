---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: pkg/db/queries/artists.sql
      Note: Current artist list/get/create/update query coverage and missing stats/detail queries.
    - Path: pkg/db/queries/shows.sql
      Note: Current show and lineup read/write query coverage.
    - Path: pkg/db/queries/submissions.sql
      Note: Current booking submission query coverage and missing detail/review updates.
    - Path: pkg/server/app.go
      Note: Current staff API handlers and missing endpoint/handler extension points.
    - Path: proto/pyxis/v1/show.proto
      Note: Defines current Show
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: Current RTK Query surface for staff reads/mutations.
    - Path: web/packages/pyxis-app/src/components/organisms/ArtistRoster/ArtistRoster.tsx
      Note: Current read-only artist roster to extend with create/edit/detail workflows.
    - Path: web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx
      Note: Current minimal attendance action UI to replace with an edit form.
    - Path: web/packages/pyxis-app/src/components/organisms/BookingReviewNotePanel/BookingReviewNotePanel.tsx
      Note: Current read-only booking note presentation; review note persistence gap.
    - Path: web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
      Note: Existing static show modal to replace with a real editor.
    - Path: web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx
      Note: Current settings toggle UI; target scope is core space name/address/capacity.
    - Path: web/packages/pyxis-app/src/pages/Pages.tsx
      Note: Current staff page wiring and visible missing workflow affordances.
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Staff operations workflows design and implementation guide

## Executive summary

Pyxis now has the foundations of a real staff application: Go HTTP handlers, PostgreSQL repositories, protobuf-defined transport payloads, RTK Query hooks, MSW Storybook, deterministic seed data, and a Vite-proxied staff frontend. The remaining gap is that several day-to-day staff operations are still only partially wired: staff can view shows, bookings, artists, attendance, and settings, but many edit/create flows either do not exist visually, do not persist all fields, or use placeholder interactions.

This ticket should turn the staff app from “real data viewer with a few actions” into a usable operations console for the core venue workflows requested here:

- create and edit shows,
- edit show lineups,
- upload/delete flyers,
- edit booking details,
- persist review notes,
- complete artist functionality,
- edit attendance logs with real form controls,
- edit only the core space settings: space name, address, and capacity.

The safest implementation path is schema-first: add the missing database fields and protobuf messages, regenerate Go/TypeScript code, then wire backend services and frontend pages through RTK Query. Components should remain presentational. Pages should own data fetching, mutations, routing, loading/error/empty states, and success/error messages.

## Problem statement

The current staff app has real backend connectivity but still exposes prototype-era affordances. Examples:

- The Shows page renders a visible `New show` button but no real create form is wired. Evidence: `Pages.tsx` renders the button in the topbar at source line 152, captured in `sources/01-evidence-line-references.md:156`.
- `NewShowModal` exists, but it is a static default-value modal with uncontrolled fields and callback-only submit actions. Evidence: `NewShowModal.tsx` is captured in `sources/01-evidence-line-references.md` and shows hard-coded default values and no field state.
- Show create/update backend handlers exist, but lineups are not persisted by the normal `CreateShow` / `UpdateShow` path. Evidence: `handleCreateShow` and `handleUpdateShow` are at `sources/01-evidence-line-references.md:623` and `:656`; SQL has `GetShowWithLineup`, `CreateShow`, and `UpdateShow` at `:2032`, `:2051`, and `:2058`, but no replace-lineup command.
- Flyer upload/delete backend and RTK mutations exist, but visible show UI does not expose flyer upload/delete. Evidence: RTK mutations are at `sources/01-evidence-line-references.md:347` and `:357`; backend handlers are at `:1539` and `:1575`.
- Booking review can approve/decline, but booking edits and staff review notes are not persisted. Evidence: `BookingReviewNotePanel` renders only `booking.message` or fallback text and has no editable review-note state; captured in `BookingReviewNotePanel.tsx` and imported in `Pages.tsx` at `sources/01-evidence-line-references.md:43`.
- Artist list/update primitives exist, but the visible artist page is read-only. Evidence: RTK has `updateArtist` at `sources/01-evidence-line-references.md:398`; backend has `handleUpdateArtist` at `:1464`; `ArtistRoster` renders table rows without action callbacks at `:561`.
- Attendance has a minimal `Mark logged` / `Save note` action, but no real draw/notes/incident form. Evidence: `AttendancePanel` props and rendering are captured at `sources/01-evidence-line-references.md:515-521`; backend upsert exists at `:1811`.
- Settings update backend accepts many settings, and the current UI toggles three booleans. The requested scope is narrower: only space name, address, and capacity should be editable in this ticket. Evidence: `SettingsPanel` currently supports toggle callbacks at `sources/01-evidence-line-references.md:535-543`; backend settings update accepts broad fields at `:1872`.

## Non-goals

This ticket should not attempt to solve everything in the staff app. Keep these out of scope unless explicitly split into follow-up tasks:

- real production auth/OIDC,
- full Discord posting and Discord settings,
- public booking anti-spam/rate limiting,
- advanced calendar UX,
- staff invite/role management,
- analytics dashboards,
- public site visual changes,
- unrelated refactors of component taxonomy.

## Current architecture primer for a new intern

### Repository layout

The codebase is a Go + PostgreSQL backend with a pnpm workspace frontend.

Important paths:

```text
cmd/pyxis/main.go                         CLI entrypoint
cmd/pyxis/cmds/                           Glazed subcommands: serve, migrate, seed
pkg/server/                               HTTP handlers and route wiring
pkg/service/                              business logic
pkg/repository/postgres/                  repository adapters over sqlc queries
pkg/db/queries/                           sqlc SQL query definitions
pkg/db/migrations/                        database schema migrations
proto/pyxis/v1/show.proto                 protobuf API schema
web/packages/pyxis-types/                 generated TS protobuf exports + shared UI types
web/packages/pyxis-app/                   staff React app
web/packages/pyxis-components/            reusable component library
fixtures/dev.sql                          deterministic local seed data
```

### Runtime flow

The runtime path for a staff mutation looks like this:

```text
React page
  -> RTK Query mutation in web/packages/pyxis-app/src/api/appApi.ts
  -> Vite proxy or same-origin Go server
  -> pkg/server/app.go HTTP handler
  -> pkg/service/* service
  -> pkg/repository/postgres/* repo
  -> pkg/db/queries/*.sql generated by sqlc
  -> PostgreSQL
  -> protojson response
  -> RTK transformResponse fromJson(...)
  -> typed component props
```

### Protobuf JSON principle

Existing decisions require API responses crossing the wire to be backed by protobuf messages and marshaled via `protojson.Marshal`. The TypeScript flow is:

```text
.proto -> Go protojson.Marshal -> camelCase JSON -> fromJson(Schema, response as any) -> typed RTK Query cache
```

MSW responses consumed by `fromJson(...)` must use `toJson(...)`, never raw Buf message instances containing `$typeName`.

### Frontend ownership rule

Pages own data and mutations. Components own rendering. This means:

- `ShowsPage` should call `useCreateShowMutation`, not `ShowForm`.
- `ShowForm` should receive `initialValue`, `isSaving`, and `onSubmit` props.
- `ArtistRoster` should receive `onEditArtist`, not call RTK Query directly.
- Storybook component stories use typed fixtures; page stories use MSW and RTK hooks.

## Current-state evidence map

| Area | Evidence | Current implication |
|---|---|---|
| Shows page | `sources/01-evidence-line-references.md:156` | `New show` is visible but not wired to a real form. |
| Show create/update handlers | `sources/01-evidence-line-references.md:623`, `:656` | Backend can create/update base show records. |
| Show SQL | `sources/01-evidence-line-references.md:2032`, `:2051`, `:2058` | SQL can read lineups in one query but create/update does not replace lineup rows. |
| Flyer mutations | `sources/01-evidence-line-references.md:347`, `:357`, `:1539`, `:1575` | Upload/delete backend and frontend mutation surface exist but need UI. |
| Booking review | `Pages.tsx` imports/rendering plus `BookingReviewNotePanel.tsx` | Approval/decline exists, edit/review note persistence does not. |
| Artist update | `sources/01-evidence-line-references.md:398`, `:1464`, `:561` | Update path exists, visible UI is read-only. |
| Attendance | `sources/01-evidence-line-references.md:515-521`, `:1811` | Upsert path exists, visible edit form is too shallow. |
| Settings | `sources/01-evidence-line-references.md:535-543`, `:1872` | Current UI toggles booleans; requested ticket should focus on name/address/capacity. |
| Seed | `sources/01-evidence-line-references.md:1206` | Dev seed is deterministic and safe to rerun locally. |

## Proposed user-facing workflows

### Workflow A: New show

A staff user clicks `New show`, fills a modal or route-level form, optionally edits lineup rows, optionally uploads a flyer after save, and saves as either draft/hold/confirmed.

Recommended first implementation:

1. `New show` opens `ShowEditorModal`.
2. Form saves a `Show` proto through `createShow`.
3. The backend persists base show and lineup rows atomically.
4. After successful create, page navigates or links to `/shows/:id`.
5. Flyer upload is available after show ID exists.

### Workflow B: Edit show and lineup

A staff user opens `/shows/:id`, clicks `Edit`, modifies show fields and lineup rows, and saves. The backend replaces the full lineup list with the submitted lineup list inside one transaction.

### Workflow C: Flyer upload/delete

A staff user opens show detail, sees flyer state, uploads a new flyer, and can delete the existing flyer. The upload API already exists; the missing part is visible UI and show refresh behavior.

### Workflow D: Booking details and review notes

A staff user opens `/bookings/review/:id`, corrects booking fields if needed, writes an internal review note, and then approves or declines. The booking edit and note must persist independently from approve/decline.

### Workflow E: Artists

A staff user can:

- view all artists,
- search/filter artists,
- create a new artist,
- edit name/genre/links/notes,
- open an artist detail drawer/page showing recent shows, submissions, average draw, and notes.

### Workflow F: Attendance

A staff user can edit:

- draw,
- notes,
- incident flag,
- incident notes.

This should be a form, not a blind `Mark logged` button.

### Workflow G: Core settings

A staff user can edit only:

- space name,
- address,
- capacity.

Do not include Discord channels, booleans, timezone, or contact settings in this ticket unless separately requested.

## Visual design: ASCII screenshots

These are intentionally low-fidelity. They define layout and interaction structure before implementation.

### Shows page with create affordance

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Shows                                                        [Filter] [+ New] │
│ Home / Shows                                                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Confirmed 5] [Draft 1] [Hold 2] [Archived 2]              Search shows...    │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ Date        Artist             Genre       Status       Actions          │ │
│ │ May 02      Burial Hex         Darkwave    Confirmed    Open  Edit       │ │
│ │ May 09      Moor Mother        Experim.    Confirmed    Open  Edit       │ │
│ │ Jun 01      Hold — TBD         —           Hold         Open  Edit       │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Show editor modal

```text
┌──────────────────────────────────────────────────────────────┐
│ Add new show                                             [x] │
│ Create a show record, lineup, and optional flyer.            │
├──────────────────────────────────────────────────────────────┤
│ Artist / act name                                            │
│ [ Burial Hex                                            ]    │
│                                                              │
│ Date              Doors            Start           Status     │
│ [2026-05-02]      [8:00 PM]        [9:00 PM]       [Confirmed]
│                                                              │
│ Age               Price            Genre           Capacity   │
│ [21+]             [$12 / $15]      [Darkwave]      [150]      │
│                                                              │
│ Public description                                           │
│ [ An evening of dark electronics and noise...            ]   │
│                                                              │
│ Staff notes                                                  │
│ [ Confirm projector needs...                             ]   │
│                                                              │
│ Lineup                                                       │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Artist             Role        Start       End      [x]  │ │
│ │ Burial Hex         headline    9:00 PM     11:00 PM [x]  │ │
│ │ Support Act        support     8:30 PM     9:00 PM  [x]  │ │
│ └──────────────────────────────────────────────────────────┘ │
│ [+ Add lineup row]                                           │
│                                                              │
│ Flyer                                                        │
│ [ Choose file... ]  current: burial-hex.png  [Delete flyer]  │
├──────────────────────────────────────────────────────────────┤
│ [Cancel]                         [Save draft] [Save show]    │
└──────────────────────────────────────────────────────────────┘
```

### Booking review editor

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Booking review: Pharmakon                                  [Open artist link] │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────── request ─────────────────────────────────────┐ │
│ │ Artist name       [Pharmakon                                      ]      │ │
│ │ Preferred date    [2026-06-14]    Expected draw [80]                    │ │
│ │ Genre             [Industrial]                                          │ │
│ │ Links             [pharmakon.example                              ]      │ │
│ │ Tech rider        [DI + vocal mic                                 ]      │ │
│ │ Artist message    [Touring in June...]                                  │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ┌──────────────────── internal review note ────────────────────────────────┐ │
│ │ [ Good fit. Pair with local harsh-noise opener. Check curfew.       ]    │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ [Save details]                       [Decline] [Approve + create show]       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Artist roster and edit drawer

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Artists                                                   [Search] [+ Artist] │
├──────────────────────────────────────────────────────────────────────────────┤
│ Artist             Genre        Shows   Avg draw   Last show       Actions   │
│ Burial Hex         Darkwave     3       70         2026-05-02      Edit      │
│ Moor Mother        Experim.     1       120        2026-05-09      Edit      │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────── Edit artist ────────────────────────────┐
│ Name       [Burial Hex                                      ]       │
│ Genre      [Darkwave                                        ]       │
│ Links      [https://burialhex.example                       ]       │
│ Notes      [Great draw, always professional...]                     │
│                                                                      │
│ Recent shows                                                         │
│ - 2026-05-02 Burial Hex, draw 70                                     │
│ - 2025-03-14 Planning for Burial, draw 34                            │
│                                                                      │
│ [Cancel] [Save artist]                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Attendance editor

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Post-show log                                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Show                    Date        Draw     Incident   Actions              │
│ Planning for Burial     Mar 14      34       No         Edit                 │
│ Actress                 Feb 28      61       No         Edit                 │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────── Edit attendance ────────────────────────┐
│ Show        Planning for Burial                                  │
│ Draw        [34]                                                  │
│ Notes       [Good energy, small crowd.]                           │
│ Incident    [ ] Incident occurred                                 │
│ Incident notes                                                    │
│ [                                                             ]   │
│                                                                  │
│ [Cancel] [Save attendance]                                       │
└──────────────────────────────────────────────────────────────────┘
```

### Core settings form

```text
┌──────────────────────────────────────────────────────────────┐
│ Settings                                                     │
│ Home / Settings                                              │
├──────────────────────────────────────────────────────────────┤
│ Space name                                                   │
│ [Pyxis                                                   ]   │
│                                                              │
│ Address                                                      │
│ [319 N 11th St, Philadelphia, PA                         ]   │
│                                                              │
│ Capacity                                                     │
│ [150                                                    ]     │
│                                                              │
│ [Cancel] [Save settings]                                     │
└──────────────────────────────────────────────────────────────┘
```

## YAML shortform React markup designs

The following YAML is not a machine contract; it is a compact implementation sketch for React component trees using the existing component system. It should be translated into typed React components, CSS modules/colocated CSS, and Storybook stories.

### Show editor modal

```yaml
ShowEditorModal:
  props:
    mode: "create | edit"
    initialShow: "ShowDraft"
    isOpen: boolean
    isSaving: boolean
    onSubmit: "(draft) => void"
    onUploadFlyer: "(file) => void"
    onDeleteFlyer: "() => void"
    onCancel: "() => void"
  markup:
    Modal:
      title: "mode == create ? 'Add new show' : 'Edit show'"
      subtitle: "Create or update public show information."
      body:
        form.app-show-editor:
          Field(label="Artist / act name"):
            Input(value=artist)
          div.app-form-grid.cols-4:
            Field(label="Date"):
              Input(type="date", value=date)
            Field(label="Doors"):
              Input(value=doorsTime)
            Field(label="Start"):
              Input(value=startTime)
            Field(label="Status"):
              Select(value=status, options=[draft, hold, confirmed, cancelled, archived])
          div.app-form-grid.cols-4:
            Field(label="Age"):
              Select(value=age, options=[All Ages, 18+, 21+])
            Field(label="Price"):
              Input(value=price)
            Field(label="Genre"):
              Input(value=genre)
            Field(label="Capacity"):
              Input(type="number", value=capacity)
          Field(label="Public description"):
            Textarea(value=description)
          Field(label="Staff notes"):
            Textarea(value=notes)
          LineupEditor:
            rows: lineup
            onAddRow: addLineupRow
            onUpdateRow: updateLineupRow
            onRemoveRow: removeLineupRow
          FlyerField:
            currentUrl: flyerUrl
            onUpload: onUploadFlyer
            onDelete: onDeleteFlyer
      footer:
        Button(variant="ghost", onClick=onCancel): "Cancel"
        Button(variant="outline", onClick=saveDraft): "Save draft"
        Button(onClick=saveConfirmed): "Save show"
```

### Booking review editor

```yaml
BookingReviewEditor:
  props:
    booking: Submission
    review: BookingReview
    isSaving: boolean
    onSaveDetails: "(submissionPatch) => void"
    onSaveReview: "(reviewPatch) => void"
    onApprove: "() => void"
    onDecline: "() => void"
  markup:
    AppShell(page="booking-review"):
      BookingReviewHero(booking)
      div.app-detail-grid:
        Panel(title="Request details"):
          Field(label="Artist name"): Input(value=artistName)
          Field(label="Preferred date"): Input(type="date", value=preferredDate)
          Field(label="Expected draw"): Input(type="number", value=expectedDraw)
          Field(label="Genre"): Input(value=genre)
          Field(label="Links"): Textarea(value=links)
          Field(label="Tech rider"): Textarea(value=techRider)
          Field(label="Artist message"): Textarea(value=message)
          Button(onClick=onSaveDetails): "Save details"
        Panel(title="Internal review"):
          Field(label="Review note"):
            Textarea(value=review.note)
          Select(label="Decision", value=review.decision)
          Button(onClick=onSaveReview): "Save review note"
      div.app-detail-actions:
        Button(variant="danger", onClick=onDecline): "Decline"
        Button(variant="success", onClick=onApprove): "Approve + create show"
```

### Artist workspace

```yaml
ArtistsPage:
  markup:
    AppShell(page="artists"):
      topbar:
        Input(placeholder="Search artists")
        Button(iconLeft="plus", onClick=openCreate): "New artist"
      ArtistRoster:
        artists: filteredArtists
        onEditArtist: openEdit
        onOpenArtist: openDetail
      ArtistEditorDrawer:
        artist: selectedArtist
        stats: selectedArtistStats
        isOpen: drawerOpen
        onSubmit: updateOrCreateArtist
```

### Attendance editor

```yaml
AttendancePage:
  markup:
    AppShell(page="attendance"):
      AttendancePanel:
        entries: logs
        onEditEntry: openAttendanceEditor
      AttendanceEditorModal:
        entry: selectedLog
        fields:
          draw: number
          notes: text
          incident: checkbox
          incidentNotes: text
        onSubmit: updateAttendance
```

### Core settings form

```yaml
SettingsPage:
  markup:
    AppShell(page="settings"):
      Panel(title="Space profile"):
        Field(label="Space name"):
          Input(value=spaceName)
        Field(label="Address"):
          Textarea(value=address)
        Field(label="Capacity"):
          Input(type="number", value=capacity)
        footer:
          Button(variant="ghost", onClick=reset): "Cancel"
          Button(onClick=updateSettings): "Save settings"
```

## Database changes

### Migration: show lineup write support

Current schema already has `show_lineup`. The missing piece is query/service support to replace lineups transactionally.

Add sqlc queries:

```sql
-- name: DeleteShowLineup :exec
DELETE FROM show_lineup WHERE show_id = $1;

-- name: CreateShowLineupEntry :one
INSERT INTO show_lineup (show_id, artist, role, start_time, end_time, sort_order)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
```

Repository pseudocode:

```go
func (r *ShowRepo) ReplaceLineup(ctx context.Context, tx pgx.Tx, showID int, lineup []domain.LineupEntry) error {
    q := r.queries.WithTx(tx)
    if err := q.DeleteShowLineup(ctx, int32(showID)); err != nil { return err }
    for i, row := range lineup {
        _, err := q.CreateShowLineupEntry(ctx, db.CreateShowLineupEntryParams{
            ShowID: int32(showID), Artist: row.Artist, Role: row.Role,
            StartTime: text(row.StartTime), EndTime: text(row.EndTime), SortOrder: int32(i),
        })
        if err != nil { return err }
    }
    return nil
}
```

### Migration: booking review notes

Add a durable review-note table instead of overloading `submissions.message`, because `message` is artist-provided and should not be overwritten by staff notes.

```sql
CREATE TABLE booking_reviews (
    submission_id INT PRIMARY KEY REFERENCES submissions(id) ON DELETE CASCADE,
    note          TEXT NOT NULL DEFAULT '',
    decision      TEXT NOT NULL DEFAULT 'none', -- none, approve, decline, hold
    updated_by    INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_booking_reviews_updated_at
    BEFORE UPDATE ON booking_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

Add queries:

```sql
-- name: GetBookingReview :one
SELECT * FROM booking_reviews WHERE submission_id = $1;

-- name: UpsertBookingReview :one
INSERT INTO booking_reviews (submission_id, note, decision, updated_by)
VALUES ($1, $2, $3, $4)
ON CONFLICT (submission_id) DO UPDATE
SET note = EXCLUDED.note,
    decision = EXCLUDED.decision,
    updated_by = EXCLUDED.updated_by,
    updated_at = NOW()
RETURNING *;
```

### Migration: editable booking details

The existing `submissions` table already has editable fields. Add an update query:

```sql
-- name: UpdateSubmissionDetails :one
UPDATE submissions
SET artist_name = $2,
    preferred_date = $3,
    genre = $4,
    expected_draw = $5,
    links = $6,
    tech_rider = $7,
    message = $8,
    contact_discord = $9
WHERE id = $1
RETURNING *;
```

No table migration is required for those fields.

### Artist functionality queries

Existing SQL supports list/get/create/update, but UI needs statistics. Add read-only summaries:

```sql
-- name: GetArtistStats :one
SELECT
  a.id,
  COUNT(s.id) AS show_count,
  COALESCE(AVG(al.draw), 0)::int AS avg_draw,
  MAX(s.date) AS last_show_date
FROM artists a
LEFT JOIN shows s ON s.artist_id = a.id
LEFT JOIN attendance_logs al ON al.show_id = s.id
WHERE a.id = $1
GROUP BY a.id;

-- name: ListArtistShows :many
SELECT s.*, COALESCE(al.draw, 0) AS attendance_draw
FROM shows s
LEFT JOIN attendance_logs al ON al.show_id = s.id
WHERE s.artist_id = $1
ORDER BY s.date DESC;
```

### Settings scope

No DB migration is needed for core settings because `settings` already has `space_name`, `address`, and `capacity`. Add a narrow command/payload to avoid the UI accidentally clearing unrelated fields.

## Protobuf changes

Keep the existing broad messages, but add command/response shapes where they reduce ambiguity.

### Show editor payload

`Show` already includes `lineup`, but backend `protoToDomainShow` should map it into a domain lineup. Add `sort_order` if ordering must be stable without relying on repeated field order. Preferred minimal change: repeated field order is the sort order.

Optional proto enhancement:

```proto
message Show.LineupEntry {
  string artist     = 1;
  string role       = 2;
  string start_time = 3;
  string end_time   = 4;
  int32  sort_order = 5;
}
```

### Booking review and booking detail update

Add:

```proto
message BookingReview {
  int32  submission_id = 1;
  string note          = 2;
  string decision      = 3;
  int32  updated_by    = 4;
  string updated_at    = 5;
}

message BookingReviewResponse {
  Submission    submission = 1;
  BookingReview review     = 2;
}

message UpdateSubmissionDetailsRequest {
  string artist_name     = 1;
  string preferred_date  = 2;
  string genre           = 3;
  int32  expected_draw   = 4;
  string links           = 5;
  string tech_rider      = 6;
  string message         = 7;
  string contact_discord = 8;
}
```

### Artist detail

Add:

```proto
message ArtistStats {
  int32  artist_id      = 1;
  int32  show_count     = 2;
  int32  avg_draw       = 3;
  string last_show_date = 4;
}

message ArtistDetail {
  Artist artist = 1;
  ArtistStats stats = 2;
  repeated Show shows = 3;
}
```

### Core settings update

Add narrow request:

```proto
message UpdateCoreSettingsRequest {
  string space_name = 1;
  string address    = 2;
  int32  capacity   = 3;
}
```

This prevents the frontend from sending a full `Settings` message and accidentally clearing unrelated fields like Discord channels.

## API design

### Shows

Existing:

```text
GET    /api/app/shows
GET    /api/app/shows/{id}
POST   /api/app/shows
PATCH  /api/app/shows/{id}
PATCH  /api/app/shows/{id}/cancel
PATCH  /api/app/shows/{id}/archive
POST   /api/app/shows/{id}/announce
POST   /api/app/shows/{id}/flyer
DELETE /api/app/shows/{id}/flyer?filename=...
```

Required changes:

```text
POST/PATCH show endpoints persist lineup from Show.lineup.
GET /api/app/shows/{id} returns Show.lineup.
```

### Bookings

Existing:

```text
GET   /api/app/bookings
PATCH /api/app/bookings/{id}/approve
PATCH /api/app/bookings/{id}/decline
```

Add:

```text
GET   /api/app/bookings/{id}
PATCH /api/app/bookings/{id}
GET   /api/app/bookings/{id}/review
PATCH /api/app/bookings/{id}/review
```

Response contracts:

```text
GET /api/app/bookings/{id}        -> Submission
PATCH /api/app/bookings/{id}      -> Submission
GET /api/app/bookings/{id}/review -> BookingReviewResponse
PATCH .../review                  -> BookingReview
```

### Artists

Existing:

```text
GET   /api/app/artists
GET   /api/app/artists/{id}
PATCH /api/app/artists/{id}
```

Add or expose if already service-backed:

```text
POST /api/app/artists         -> Artist
GET  /api/app/artists/{id}/detail -> ArtistDetail
```

### Attendance

Existing:

```text
GET   /api/app/attendance
GET   /api/app/attendance/{showId}
PATCH /api/app/attendance/{showId}
```

No new endpoint is required. The UI should use the existing PATCH with full editable fields.

### Settings

Existing:

```text
GET   /api/app/settings
PATCH /api/app/settings
```

Add narrow endpoint or narrow request handling:

```text
PATCH /api/app/settings/core -> Settings
```

Request body uses `UpdateCoreSettingsRequest`.

## Backend implementation plan

### Phase 1: Schema and protobuf

1. Add migration for `booking_reviews`.
2. Add sqlc queries for:
   - show lineup replacement,
   - submission details update,
   - booking review get/upsert,
   - artist stats/detail queries.
3. Add protobuf messages.
4. Run:

```bash
make generate
```

5. Update deterministic fixture with sample booking review notes.
6. Validate:

```bash
go test ./...
make seed
```

### Phase 2: Repository and service layer

Add repository interfaces to `pkg/repository/repository.go`:

```go
type ShowRepository interface {
    ...
    CreateWithLineup(ctx context.Context, show *domain.Show) (*domain.Show, error)
    UpdateWithLineup(ctx context.Context, show *domain.Show) (*domain.Show, error)
}

type SubmissionRepository interface {
    ...
    UpdateDetails(ctx context.Context, sub *domain.Submission) (*domain.Submission, error)
}

type BookingReviewRepository interface {
    Get(ctx context.Context, submissionID int) (*domain.BookingReview, error)
    Upsert(ctx context.Context, review *domain.BookingReview) (*domain.BookingReview, error)
}
```

Important transaction rule: show base record and lineup replacement must be atomic. Do not update the show and then fail halfway through lineup replacement.

Pseudocode:

```go
func (r *ShowRepo) UpdateWithLineup(ctx context.Context, show *domain.Show) (*domain.Show, error) {
    tx, err := r.pool.Begin(ctx)
    if err != nil { return nil, err }
    defer tx.Rollback(ctx)

    q := r.queries.WithTx(tx)
    updated, err := q.UpdateShow(ctx, paramsFromShow(show))
    if err != nil { return nil, err }

    if err := q.DeleteShowLineup(ctx, updated.ID); err != nil { return nil, err }
    for i, entry := range show.Lineup {
        if _, err := q.CreateShowLineupEntry(ctx, paramsFromLineup(updated.ID, i, entry)); err != nil {
            return nil, err
        }
    }

    if err := tx.Commit(ctx); err != nil { return nil, err }
    return r.GetByID(ctx, int(updated.ID))
}
```

### Phase 3: HTTP handlers

Update handlers in `pkg/server/app.go`:

- `handleCreateShow`: unmarshal `Show`, validate, pass lineup to service.
- `handleUpdateShow`: same.
- `handleGetShow`: return `Show` with lineup.
- `handleUpdateBooking`: accept `UpdateSubmissionDetailsRequest`.
- `handleGetBookingReview` / `handleUpdateBookingReview`.
- `handleCreateArtist`.
- `handleGetArtistDetail`.
- `handleUpdateCoreSettings`.

Validation rules should be explicit and friendly:

```text
show.artist required
show.date required and yyyy-mm-dd
capacity >= 0
lineup artist required if row exists
booking artistName required
attendance draw >= 0 when present
settings capacity > 0
```

### Phase 4: RTK Query

Update `web/packages/pyxis-app/src/api/appApi.ts`:

```ts
getBooking(id): Submission
updateBookingDetails({ id, patch }): Submission
getBookingReview(id): BookingReviewResponse
updateBookingReview({ id, review }): BookingReview
createArtist(artist): Artist
getArtistDetail(id): ArtistDetail
updateCoreSettings(request): Settings
```

For `updateArtist`, switch request body to protobuf JSON if the backend starts using `protojson.Unmarshal` for `Artist`.

### Phase 5: Components and pages

Create or refactor these components:

```text
components/organisms/ShowEditorModal/
components/organisms/LineupEditor/
components/organisms/FlyerField/
components/organisms/BookingReviewEditor/
components/organisms/ArtistEditorDrawer/
components/organisms/ArtistDetailPanel/
components/organisms/AttendanceEditorModal/
components/organisms/CoreSettingsForm/
```

Pages to update:

```text
pages/Pages.tsx or page-split equivalents:
  ShowsPage
  ShowDetailPage
  BookingReviewPage
  ArtistsPage
  AttendancePage
  SettingsPage
```

Each page should follow this pattern:

```tsx
const { data, isLoading, isError } = useGetThingQuery();
const [updateThing, updateState] = useUpdateThingMutation();
const [actionError, setActionError] = useState<string | undefined>();

async function handleSubmit(input) {
  setActionError(undefined);
  try {
    await updateThing(input).unwrap();
    closeModal();
  } catch {
    setActionError('Could not save. Check your session and backend logs.');
  }
}
```

### Phase 6: MSW and Storybook

Update MSW handlers with protobuf JSON:

```ts
HttpResponse.json(toJson(BookingReviewResponseSchema, response))
```

Add Storybook stories:

```text
ShowEditorModal/Create
ShowEditorModal/EditWithLineup
ShowEditorModal/WithFlyer
BookingReviewEditor/EditableDetails
BookingReviewEditor/ReviewNoteSaved
ArtistEditorDrawer/Create
ArtistEditorDrawer/Edit
AttendanceEditorModal/Default
AttendanceEditorModal/Incident
CoreSettingsForm/Default
```

Page stories:

```text
Pages/Shows/CreateShowMutation
Pages/ShowDetail/EditShowMutation
Pages/BookingReview/EditDetailsAndReviewNote
Pages/Artists/CreateAndEditArtist
Pages/Attendance/EditAttendance
Pages/Settings/EditCoreSettings
```

## Frontend implementation details

### Form state approach

Use local `useState` for these forms initially. Avoid adding a form library unless validation complexity grows.

Example:

```tsx
type ShowDraft = {
  artist: string;
  date: string;
  doorsTime: string;
  startTime: string;
  age: string;
  price: string;
  genre: string;
  description: string;
  notes: string;
  capacity: number;
  status: ShowStatus;
  lineup: Show_LineupEntry[];
};
```

Convert to protobuf message on submit:

```ts
const show = create(ShowSchema, {
  ...draft,
  lineup: draft.lineup.map((row) => create(Show_LineupEntrySchema, row)),
});
await createShow(show).unwrap();
```

### File uploads

Keep file upload separate from show create. A show needs an ID before upload.

Recommended UX:

- Create show.
- If a file is selected, call `uploadShowFlyer({ showId: created.id, file })`.
- If flyer upload fails after show create succeeds, keep the show and display a recoverable warning.

Pseudocode:

```ts
const created = await createShow(show).unwrap();
if (selectedFile) {
  try {
    await uploadShowFlyer({ showId: created.id, file: selectedFile }).unwrap();
  } catch {
    setActionWarning('Show saved, but flyer upload failed. You can upload it from show detail.');
  }
}
```

### Page split recommendation

`Pages.tsx` is now large. This ticket is a good time to move each edited page into its route folder:

```text
pages/ShowsPage/ShowsPage.tsx
pages/ShowDetailPage/ShowDetailPage.tsx
pages/BookingReviewPage/BookingReviewPage.tsx
pages/ArtistsPage/ArtistsPage.tsx
pages/AttendancePage/AttendancePage.tsx
pages/SettingsPage/SettingsPage.tsx
```

Keep `pages/Pages.tsx` as a temporary barrel only if needed.

## Testing strategy

### Backend tests

Manual API smoke after each phase:

```bash
make seed
PYXIS_DEV_AUTH=1 go run ./cmd/pyxis serve --bind :8080
curl -fsS -c /tmp/pyxis-cookie.jar 'http://localhost:8080/auth/dev-login?username=dev-admin&role=admin' >/dev/null
```

Show create/update:

```bash
curl -fsS -b /tmp/pyxis-cookie.jar \
  -X POST http://localhost:8080/api/app/shows \
  -H 'Content-Type: application/json' \
  -d '{"artist":"Test Show","date":"2026-09-01","status":"SHOW_STATUS_DRAFT","lineup":[{"artist":"Test Show","role":"headline"}]}' | jq .
```

Booking edit:

```bash
curl -fsS -b /tmp/pyxis-cookie.jar \
  -X PATCH http://localhost:8080/api/app/bookings/1 \
  -H 'Content-Type: application/json' \
  -d '{"artistName":"Pharmakon Updated","preferredDate":"2026-06-15","genre":"Industrial","expectedDraw":90,"links":"updated.example","techRider":"DI","message":"Updated","contactDiscord":"@updated"}' | jq .
```

Review note:

```bash
curl -fsS -b /tmp/pyxis-cookie.jar \
  -X PATCH http://localhost:8080/api/app/bookings/1/review \
  -H 'Content-Type: application/json' \
  -d '{"note":"Good fit for June.","decision":"approve"}' | jq .
```

Attendance:

```bash
curl -fsS -b /tmp/pyxis-cookie.jar \
  -X PATCH http://localhost:8080/api/app/attendance/5 \
  -H 'Content-Type: application/json' \
  -d '{"draw":35,"notes":"Edited from smoke test","incident":true,"incidentNotes":"Minor door issue"}' | jq .
```

Settings:

```bash
curl -fsS -b /tmp/pyxis-cookie.jar \
  -X PATCH http://localhost:8080/api/app/settings/core \
  -H 'Content-Type: application/json' \
  -d '{"spaceName":"Pyxis Test","address":"123 Test St","capacity":120}' | jq .
```

### Frontend builds

Run:

```bash
go test ./...
cd web/packages/pyxis-types && pnpm build
cd web/packages/pyxis-app && pnpm build
cd web/packages/pyxis-app && STORYBOOK_DISABLE_TELEMETRY=1 pnpm build-storybook
cd web && pnpm build
```

### Browser smoke

Use Vite:

```bash
cd web/packages/pyxis-app
pnpm dev --host 127.0.0.1 --port 3008
```

Test:

```text
/shows             create show
/shows/1           edit show, lineup, flyer
/bookings/review/1 edit details, save review note, approve/decline
/artists           create/edit/open detail
/attendance        edit draw/notes/incident
/settings          edit name/address/capacity
```

### Storybook expectations

Storybook must work without a Go backend running. Any page story using RTK Query must have MSW handlers. Mutation stories should assert visible UI updates after tag invalidation/refetch.

## Implementation task checklist

### Phase 1: Schema/proto

- [ ] Add booking review migration.
- [ ] Add sqlc queries for booking update/review, lineup replacement, artist stats/detail.
- [ ] Add protobuf messages for booking review, artist detail, core settings update.
- [ ] Regenerate Go/TS protobuf and sqlc code.
- [ ] Update `fixtures/dev.sql` with booking review sample data.

### Phase 2: Backend

- [ ] Persist show lineup in create/update flows.
- [ ] Return lineup in get show/detail flows.
- [ ] Add booking detail update endpoint.
- [ ] Add booking review get/update endpoints.
- [ ] Add create artist endpoint.
- [ ] Add artist detail endpoint.
- [ ] Add core settings update endpoint.
- [ ] Add validation and audit log entries.

### Phase 3: RTK/MSW

- [ ] Add RTK endpoints/mutations.
- [ ] Update MSW state and handlers.
- [ ] Ensure all MSW responses use `toJson(...)`.
- [ ] Add page-level mutation stories.

### Phase 4: UI components

- [ ] Build `ShowEditorModal`.
- [ ] Build `LineupEditor`.
- [ ] Build `FlyerField`.
- [ ] Build `BookingReviewEditor`.
- [ ] Build `ArtistEditorDrawer` and `ArtistDetailPanel`.
- [ ] Build `AttendanceEditorModal`.
- [ ] Build `CoreSettingsForm`.

### Phase 5: Page wiring

- [ ] Wire Shows page create flow.
- [ ] Wire Show detail edit/flyer flow.
- [ ] Wire Booking review edit/review-note flow.
- [ ] Wire Artists page create/edit/detail flow.
- [ ] Wire Attendance edit flow.
- [ ] Wire Settings core form.

### Phase 6: Validation and handoff

- [ ] Full backend smoke.
- [ ] Full frontend build.
- [ ] Staff Storybook build.
- [ ] Browser smoke via Vite.
- [ ] Update diary/changelog/tasks.
- [ ] Handoff with known follow-ups.

## Risks and review focus

### Risk: show + lineup consistency

Lineup replacement must be transactional. If the base show update succeeds and lineup insert fails, the database should not be left with a half-updated show. Review transaction boundaries carefully.

### Risk: review notes vs artist messages

Do not overwrite `submissions.message` with staff review notes. Artist-provided messages and staff-internal notes are distinct data.

### Risk: full settings PATCH clearing fields

The current settings update shape is broad. Use a narrow core settings endpoint or merge existing settings server-side before updating to avoid clearing unrelated settings.

### Risk: FormData content type

Do not manually set `Content-Type: application/json` on `fetchBaseQuery` globally. Flyer upload depends on browser-generated multipart boundaries.

### Risk: stale Storybook CSS masking

Components with colocated CSS should import their own CSS. Do not hide missing CSS by globally importing component CSS in Storybook preview files.

## Open questions

1. Should a newly created show default to `draft`, `hold`, or `confirmed` when created from the Shows page?
2. Should approving a booking use edited booking details and review note to create the show?
3. Should artists be deduplicated by exact name, case-insensitive name, or manually merged later?
4. Should flyer upload replace the existing flyer automatically, or require explicit delete first?
5. Should settings capacity be required globally, or can it be empty/null?

## References

Primary evidence file:

```text
ttmp/2026/04/26/PYXIS-STAFF-OPS-FUNDAMENTALS--complete-fundamental-staff-operations-workflows/sources/01-evidence-line-references.md
```

Key source files:

```text
proto/pyxis/v1/show.proto
pkg/server/app.go
pkg/db/migrations/000001_init.up.sql
pkg/db/queries/shows.sql
pkg/db/queries/submissions.sql
pkg/db/queries/artists.sql
pkg/repository/postgres/show_repo.go
pkg/repository/postgres/submission_repo.go
pkg/repository/postgres/artist_repo.go
pkg/service/show_service.go
web/packages/pyxis-app/src/pages/Pages.tsx
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/mockHandlers.ts
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
web/packages/pyxis-app/src/components/organisms/BookingReviewNotePanel/BookingReviewNotePanel.tsx
web/packages/pyxis-app/src/components/organisms/ArtistRoster/ArtistRoster.tsx
web/packages/pyxis-app/src/components/organisms/AttendancePanel/AttendancePanel.tsx
web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx
```
