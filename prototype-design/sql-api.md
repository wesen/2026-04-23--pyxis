## API Endpoints

### Auth
- `POST /auth/discord/callback` — exchange Discord OAuth code for session token
- `GET /auth/me` — return current user (role, Discord username, avatar)
- `POST /auth/logout`

---

### Setup
- `GET /setup/status` — returns `{ complete: bool }`, checked on first load
- `POST /setup` — save space info + channel mapping, mark setup complete

---

### Shows
- `GET /shows` — all shows, accepts `?status=confirmed|archived|cancelled`
- `GET /shows/:id`
- `POST /shows` — create show
- `PATCH /shows/:id` — edit any field
- `PATCH /shows/:id/cancel` — cancel + trigger Discord unpin + notice
- `PATCH /shows/:id/archive` — archive + trigger Discord unpin
- `POST /shows/:id/announce` — (re)post + pin to Discord manually

---

### Submissions
- `GET /submissions` — all submissions, accepts `?status=pending|approved|declined`
- `GET /submissions/:id`
- `POST /submissions` — **public, no auth** — artist booking form
- `PATCH /submissions/:id/approve` — approve + auto-create show + DM artist
- `PATCH /submissions/:id/decline` — decline + DM artist

---

### Artists
- `GET /artists` — accepts `?search=`
- `GET /artists/:id` — includes show history
- `PATCH /artists/:id` — edit notes only (all other fields are derived)

---

### Calendar
- `GET /calendar?month=YYYY-MM` — returns shows, holds, and blocked dates for that month
- `POST /calendar/holds` — create a hold on a date
- `DELETE /calendar/holds/:id`
- `POST /calendar/blocked` — block a date
- `DELETE /calendar/blocked/:id`

---

### Attendance (post-show log)
- `GET /attendance` — all past shows, flagged with whether they've been logged
- `GET /attendance/:showId`
- `POST /attendance/:showId` — create log (draw, notes, incident flag, incident notes)
- `PATCH /attendance/:showId` — edit existing log

---

### Flyers
- `POST /shows/:id/flyer` — upload flyer image (multipart)
- `DELETE /shows/:id/flyer`
- `GET /shows/:id/flyer` — returns URL (or 404 if none) — **public, no auth**

---

### Settings
- `GET /settings` — space info + channel mapping
- `PATCH /settings` — update space info or channel mapping
- `GET /settings/discord/status` — bot online status, server name, member count
- `DELETE /settings/discord` — disconnect bot
- `GET /settings/export` — stream CSV of all data

---

### Audit Log
- `GET /audit-log` — accepts `?limit=&offset=` for pagination

---

### Public endpoints (no auth)
- `GET /public/shows` — upcoming confirmed shows only
- `GET /public/shows/:id` — single show detail
- `GET /public/shows/:id/flyer` — flyer image
- `GET /public/archive` — past archived shows, accepts `?search=`
- `POST /public/submissions` — same as `POST /submissions` above, aliased for clarity

---
---

## RTK Query — State & Actions

### `authApi`
```
useGetMeQuery()
useLogoutMutation()
```
**Local state (authSlice)**
- `currentUser` — `{ id, discordUsername, avatar, role }`
- `isAuthenticated`

---

### `setupApi`
```
useGetSetupStatusQuery()
useCompleteSetupMutation()
```
**Local state (setupSlice)**
- `setupComplete: bool` — gate that decides whether to show wizard or app

---

### `showsApi`
```
useGetShowsQuery({ status })
useGetShowQuery(id)
useCreateShowMutation()
useUpdateShowMutation()
useCancelShowMutation()
useArchiveShowMutation()
useAnnounceShowMutation()
useUploadFlyerMutation()
useDeleteFlyerMutation()
```
**Cache tags:** `Show`, `Show-{id}`
Invalidates `Show` list on create/cancel/archive. Invalidates `Show-{id}` on update.

---

### `submissionsApi`
```
useGetSubmissionsQuery({ status })
useGetSubmissionQuery(id)
useApproveSubmissionMutation()    // invalidates Show list + Submission list
useDeclineSubmissionMutation()
```
**Public (no auth wrapper needed)**
```
useCreateSubmissionMutation()
```
**Cache tags:** `Submission`, `Submission-{id}`

---

### `artistsApi`
```
useGetArtistsQuery({ search })
useGetArtistQuery(id)             // includes show history
useUpdateArtistNotesMutation()
```
**Cache tags:** `Artist`, `Artist-{id}`

---

### `calendarApi`
```
useGetCalendarQuery({ month })    // YYYY-MM string
useCreateHoldMutation()
useDeleteHoldMutation()
useCreateBlockMutation()
useDeleteBlockMutation()
```
**Cache tags:** `Calendar-{month}`
All mutations invalidate the relevant `Calendar-{month}` tag.

---

### `attendanceApi`
```
useGetAttendanceListQuery()
useGetAttendanceQuery(showId)
useCreateAttendanceLogMutation()
useUpdateAttendanceLogMutation()
```
**Cache tags:** `Attendance`, `Attendance-{showId}`

---

### `settingsApi`
```
useGetSettingsQuery()
useUpdateSettingsMutation()
useGetDiscordStatusQuery()        // polled every 60s
useDisconnectDiscordMutation()
useExportDataQuery({ skip: true }) // lazy — triggered manually
```
**Cache tags:** `Settings`, `DiscordStatus`

---

### `auditLogApi`
```
useGetAuditLogQuery({ limit, offset })
```
**Cache tags:** `AuditLog`
No mutations — log is append-only, written server-side.

---

## Local UI State (non-server)

These live in Redux slices or local component state — no API involvement.

| Slice / location | What it holds |
|---|---|
| `uiSlice` | Active modal (`editShow`, `addShow`, `confirmCancel`, etc.), active page/route |
| `flyerSlice` | Which show's flyer is currently open in the lightbox |
| `calendarSlice` | Currently viewed month (`YYYY-MM`) |
| `submissionsSlice` | Active status filter tab (`pending` / `approved` / `declined`) |
| `artistsSlice` | Search query string |
| `attendanceSlice` | Which show is open in the log modal |
| Component-local | Form field values (controlled inputs inside modals — no need to lift these to Redux) |

---

## A few implementation notes

- **Optimistic updates** are worth it on `cancelShow` and `archiveShow` — the status badge should flip immediately before the server responds
- **`useGetDiscordStatusQuery`** should use RTK Query's `pollingInterval: 60000` so the green/red dot in Discord Settings stays live without a manual refresh
- **`useGetCalendarQuery`** should prefetch the next and previous month on mount so navigation feels instant
- **Auth headers** — all staff endpoints expect `Authorization: Bearer <token>` from the Discord OAuth session; the public endpoints need nothing
- **`useExportDataQuery`** should be triggered lazily with `refetch()` on button click rather than running on mount

---

## Database Schema

### `users`
```sql
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  discord_id      TEXT NOT NULL UNIQUE,
  discord_username TEXT NOT NULL,
  avatar_url      TEXT,
  role            TEXT NOT NULL DEFAULT 'staff', -- 'admin' | 'booker' | 'staff'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ
);
```

---

### `shows`
```sql
CREATE TABLE shows (
  id                  SERIAL PRIMARY KEY,
  artist              TEXT NOT NULL,
  date                DATE NOT NULL,
  doors_time          TEXT,
  age                 TEXT,                        -- '21+' | '18+' | 'All Ages'
  price               TEXT,
  genre               TEXT,
  notes               TEXT,
  status              TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'cancelled' | 'archived'
  flyer_url           TEXT,
  discord_message_id  TEXT,
  discord_channel_id  TEXT,
  submission_id       INT REFERENCES submissions(id) ON DELETE SET NULL,
  artist_id           INT REFERENCES artists(id) ON DELETE SET NULL,
  created_by          INT REFERENCES users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shows_status  ON shows(status);
CREATE INDEX idx_shows_date    ON shows(date);
```

---

### `submissions`
```sql
CREATE TABLE submissions (
  id              SERIAL PRIMARY KEY,
  artist_name     TEXT NOT NULL,
  preferred_date  DATE,
  genre           TEXT,
  expected_draw   INT,
  links           TEXT,
  tech_rider      TEXT,
  message         TEXT,
  contact_discord TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'declined'
  reviewed_by     INT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON submissions(status);
```

---

### `artists`
```sql
CREATE TABLE artists (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  genre       TEXT,
  links       TEXT,
  notes       TEXT,                               -- internal staff notes only
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `calendar_holds`
```sql
CREATE TABLE calendar_holds (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  label       TEXT,                               -- e.g. 'Hold — Pharmakon'
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `calendar_blocked`
```sql
CREATE TABLE calendar_blocked (
  id          SERIAL PRIMARY KEY,
  date        DATE NOT NULL,
  reason      TEXT,                               -- e.g. 'Closed', 'Private event'
  created_by  INT REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `attendance_logs`
```sql
CREATE TABLE attendance_logs (
  id               SERIAL PRIMARY KEY,
  show_id          INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  draw             INT,
  notes            TEXT,
  incident         BOOLEAN DEFAULT FALSE,
  incident_notes   TEXT,
  logged_by        INT REFERENCES users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (show_id)                                -- one log per show
);
```

---

### `audit_log`
```sql
CREATE TABLE audit_log (
  id          SERIAL PRIMARY KEY,
  actor       TEXT NOT NULL,                      -- Discord username or 'bot'
  actor_id    INT REFERENCES users(id) ON DELETE SET NULL, -- null when bot
  action      TEXT NOT NULL,                      -- human-readable description
  entity_type TEXT,                               -- 'show' | 'submission' | 'artist' | 'settings' etc.
  entity_id   INT,
  metadata    JSONB,                              -- optional extra context
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entity     ON audit_log(entity_type, entity_id);
```

---

### `settings`
```sql
CREATE TABLE settings (
  id                      INT PRIMARY KEY DEFAULT 1,  -- enforces single row
  space_name              TEXT NOT NULL DEFAULT 'ppxis',
  tagline                 TEXT,
  address                 TEXT,
  capacity                INT,
  contact_email           TEXT,
  website                 TEXT,
  discord_guild_id        TEXT,
  discord_ch_upcoming     TEXT,                       -- channel IDs
  discord_ch_announcements TEXT,
  discord_ch_staff        TEXT,
  discord_ch_bookings     TEXT,
  setup_complete          BOOLEAN DEFAULT FALSE,
  updated_at              TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO settings DEFAULT VALUES;              -- seed on first deploy
```

---

## Relationships at a glance

```
submissions ──┐
              ├──> shows ──> attendance_logs
artists    ──┘        │
                      └──> audit_log (entity_type='show')

users ──> shows (created_by)
users ──> submissions (reviewed_by)
users ──> calendar_holds / calendar_blocked (created_by)
users ──> attendance_logs (logged_by)
users ──> audit_log (actor_id)

settings  (single row, no relations)
```

---

## A few notes

- **`settings` single-row pattern** — the `CHECK (id = 1)` constraint makes it impossible to insert a second row. Always `UPDATE settings WHERE id = 1` rather than insert.
- **`audit_log` is append-only** — no updates or deletes, ever. Application code should never issue anything other than `INSERT` on this table.
- **`artist_id` on `shows`** — when a submission is approved the server creates or matches an artist record and links it. This is what powers the show history on artist profiles.
- **`submission_id` on `shows`** — optional back-reference so staff can trace any confirmed show back to its original inquiry.
- **`metadata JSONB` on `audit_log`** — useful for storing before/after values on edits without designing a full change-tracking schema. Keep it lightweight.
- **`updated_at` triggers** — worth adding a `BEFORE UPDATE` trigger on `shows`, `artists`, and `attendance_logs` to auto-set `updated_at = NOW()` rather than relying on the application layer to remember.
- **No soft deletes** — cancellation and archiving are handled via `status` on `shows`. Nothing in this schema needs a `deleted_at` column.


