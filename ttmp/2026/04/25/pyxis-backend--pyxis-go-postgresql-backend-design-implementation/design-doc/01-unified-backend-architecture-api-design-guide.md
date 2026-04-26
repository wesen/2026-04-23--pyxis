---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: prototype-design/sql-api.md
      Note: Original SQL schema and API endpoint specification
    - Path: user-stories.md
      Note: MVP implementation plan and user stories
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: Staff app RTK Query slice defining expected endpoints
    - Path: web/packages/pyxis-types/src/app.ts
      Note: Staff app TypeScript type definitions
    - Path: web/packages/pyxis-types/src/public.ts
      Note: Public API TypeScript type definitions
    - Path: web/packages/pyxis-user-site/src/api/publicApi.ts
      Note: Public RTK Query slice defining expected endpoints
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---





# Pyxis Backend — Unified Architecture & API Design Guide

> **Audience:** New engineering intern joining the Pyxis project.  
> **Goal:** Explain what Pyxis is, how the frontend talks to the backend today, what the backend must provide, and exactly how we will build it in Go with PostgreSQL.  
> **Scope:** Design and planning only — no implementation code yet.  
> **Package:** `github.com/go-go-golems/pyxis`

---

## 1. Executive Summary

**Pyxis** is a web application for an independent music/arts venue. It has two faces:

1. **Public site** (`pyxis-user-site`) — visitors see upcoming shows, browse an archive of past shows, view show details, and submit booking inquiries. No login required.
2. **Staff app** (`pyxis-app`) — authenticated staff manage shows, review booking submissions, maintain an artist directory, view a calendar, log post-show attendance, and configure space settings.

Both apps are React/TypeScript SPAs. They communicate with a backend via HTTP JSON APIs. Today those APIs are mocked (MSW handlers). **This ticket designs the real backend:** a single Go binary using PostgreSQL, serving both apps from one process, built with the **Glazed command framework** so we get a structured CLI, consistent flags, and reusable command patterns for free.

The backend lives in a new Go module at `github.com/go-go-golems/pyxis`. It uses `cmd/` for CLI entrypoints and `pkg/` for library code. The HTTP server serves the public API at `/api/public/*`, the staff API at `/api/app/*`, and eventually the built frontend SPAs at `/` (public) and `/app` (staff).

---

## 2. What Is Pyxis? A Domain Primer

Before we talk about code, understand the domain. Pyxis is software for a small venue that hosts live shows. The lifecycle looks like this:

```
Artist submits booking inquiry
        │
        ▼
Staff review submission (approve / decline)
        │
        ▼ (approved)
Show is created on the calendar
        │
        ▼
Show happens → staff log attendance + notes
        │
        ▼
Show is archived → appears in public archive
```

**Key entities:**

- **Show** — a scheduled event with an artist, date, time, price, genre, age restriction, and status (`confirmed`, `cancelled`, `archived`, `draft`, `hold`, `blocked`).
- **Submission** — an artist's booking inquiry (artist name, preferred date, genre, expected draw, links, notes). Status: `pending`, `approved`, `declined`, `hold`, `cancelled`.
- **Artist** — a person or group who has submitted or performed. Derived from submissions and shows. Staff keep internal notes.
- **Attendance Log** — post-show record (headcount, notes, incident flag).
- **Audit Log** — append-only record of every staff action (who did what, when).
- **Settings** — single-row configuration (space name, address, capacity, Discord channel mappings, staff list).
- **User** — staff member authenticated via Discord OAuth.

**Two audiences, one database.** The public site needs read-only access to upcoming shows and the archive. The staff app needs full CRUD over everything, plus auth.

---

## 3. Current Frontend Architecture (Evidence)

We have two frontend packages that consume APIs. Let's map exactly what they expect.

### 3.1 Public Site (`packages/pyxis-user-site`)

**File:** `web/packages/pyxis-user-site/src/api/publicApi.ts`

This app uses **RTK Query** with a single `publicApi` slice. It expects:

| Endpoint | Method | Purpose | Response Type |
|---|---|---|---|
| `/api/public/shows` | GET | List upcoming confirmed shows | `Show[]` |
| `/api/public/shows/:id` | GET | Single show detail | `Show` |
| `/api/public/archive` | GET | Past archived shows, optional `?search=` | `ArchivedShow[]` |
| `/api/public/archive/stats` | GET | Aggregate stats (total shows, attendance, years, artists) | `ArchiveStats` |
| `/api/public/submissions` | POST | Submit booking inquiry | `BookingConfirmation` |

**Type definitions** live in `web/packages/pyxis-types/src/public.ts`. Key shapes:

```typescript
// Show (public view)
interface Show {
  id: number;
  artist: string;
  date: string;          // ISO date, e.g. "2025-05-02"
  doors_time: string;    // e.g. "8:00 PM"
  start_time?: string;
  age: '21+' | '18+' | 'All Ages';
  price: string;
  genre: string;
  description?: string;
  lineup?: LineupEntry[];
  flyer_url?: string;
  status: 'confirmed' | 'cancelled' | 'archived';
  submission_id?: number;
  artist_id?: number;
  created_at: string;
  updated_at: string;
}

// Booking form (public write)
interface BookingFormData {
  artist_name: string;
  genre?: string;
  preferred_date?: string;
  expected_draw?: number;
  links: string;
  tech_rider?: string;
  message?: string;
}
```

**RTK Query tag invalidation:** `Show` tags are per-ID plus a `LIST` tag. `Archive` has `LIST` and `STATS` tags. `Submission` has `LIST`. This means our Go backend should return cache-friendly headers and stable IDs, but the invalidation logic is purely client-side — the server just needs to respond correctly to the requests.

### 3.2 Staff App (`packages/pyxis-app`)

**File:** `web/packages/pyxis-app/src/api/appApi.ts`

This app also uses RTK Query, but with a separate `appApi` slice. It expects:

| Endpoint | Method | Purpose | Response Type |
|---|---|---|---|
| `/api/app/session` | GET | Current auth session | `AuthSession` |
| `/api/app/shows` | GET | All shows (all statuses) | `AppShow[]` |
| `/api/app/shows/:id` | GET | Single show (staff view) | `AppShow` |
| `/api/app/bookings` | GET | All submissions/booking requests | `BookingRequest[]` |
| `/api/app/bookings/:id` | GET | Single booking request | `BookingRequest` |
| `/api/app/artists` | GET | Artist directory | `ArtistProfile[]` |
| `/api/app/artists/:id` | GET | Single artist + history | `ArtistProfile` |
| `/api/app/calendar` | GET | Month view events | `CalendarEvent[]` |
| `/api/app/attendance` | GET | Past shows + log status | `AttendanceEntry[]` |
| `/api/app/audit-log` | GET | Staff activity log | `AuditLogEntry[]` |
| `/api/app/discord` | GET | Discord channel mappings | `DiscordChannelMapping[]` |
| `/api/app/settings` | GET | Space settings | `SpaceSettings` |

**Type definitions** live in `web/packages/pyxis-types/src/app.ts`. Key shapes:

```typescript
// Staff show view (simpler than public, no description/lineup)
interface AppShow {
  id: number;
  artist: string;
  date: string;
  doors: string;
  age: string;
  price: string;
  status: 'confirmed' | 'hold' | 'blocked' | 'archived' | 'draft';
  genre: string;
  draw: number;
  capacity: number;
  pinned?: boolean;
  notes?: string;
}

interface BookingRequest {
  id: number;
  artist: string;
  date: string;
  genre: string;
  draw: number;
  links: string;
  status: 'pending' | 'approved' | 'declined';
  submitted: string;
  notes?: string;
}

interface SpaceSettings {
  name: string;
  address: string;
  capacity: number;
  timezone: string;
  bookingEmail: string;
  autoArchive: boolean;
  discordPosting: boolean;
  safeSpaceRequired: boolean;
  staff: StaffMember[];
}
```

**Important:** The staff app currently only implements *read* endpoints in RTK Query. Mutations (create show, update show, approve booking, etc.) are documented in `prototype-design/sql-api.md` but not yet wired in the frontend. The backend must design for the full mutation surface anyway, because the frontend will grow into it.

### 3.3 The Complete API Surface (Target)

From `prototype-design/sql-api.md`, the full REST API we need to support is:

**Auth:**
- `POST /auth/discord/callback` — OAuth exchange
- `GET /auth/me` — current user
- `POST /auth/logout`

**Public (no auth):**
- `GET /api/public/shows`
- `GET /api/public/shows/:id`
- `GET /api/public/shows/:id/flyer` — redirect or stream flyer image
- `GET /api/public/archive?search=`
- `GET /api/public/archive/stats`
- `POST /api/public/submissions`

**Staff (auth required):**
- `GET /api/app/session` (same as `/auth/me` but prefixed for app)
- `GET /api/app/shows`
- `GET /api/app/shows/:id`
- `POST /api/app/shows` — create
- `PATCH /api/app/shows/:id` — edit
- `PATCH /api/app/shows/:id/cancel`
- `PATCH /api/app/shows/:id/archive`
- `POST /api/app/shows/:id/announce` — manual Discord post
- `POST /api/app/shows/:id/flyer` — multipart upload
- `DELETE /api/app/shows/:id/flyer`
- `GET /api/app/bookings`
- `GET /api/app/bookings/:id`
- `PATCH /api/app/bookings/:id/approve`
- `PATCH /api/app/bookings/:id/decline`
- `GET /api/app/artists`
- `GET /api/app/artists/:id`
- `PATCH /api/app/artists/:id` — edit notes only
- `GET /api/app/calendar?month=YYYY-MM`
- `POST /api/app/calendar/holds`
- `DELETE /api/app/calendar/holds/:id`
- `POST /api/app/calendar/blocked`
- `DELETE /api/app/calendar/blocked/:id`
- `GET /api/app/attendance`
- `GET /api/app/attendance/:showId`
- `POST /api/app/attendance/:showId`
- `PATCH /api/app/attendance/:showId`
- `GET /api/app/audit-log?limit=&offset=`
- `GET /api/app/settings`
- `PATCH /api/app/settings`
- `GET /api/app/settings/discord/status`
- `DELETE /api/app/settings/discord`
- `GET /api/app/settings/export` — CSV stream

---

## 4. Gap Analysis: What Is Missing Today?

| What exists | What is missing |
|---|---|
| Frontend React apps with mocked APIs | Real HTTP server |
| MSW mock handlers returning static data | Database with real persistence |
| Two separate API slices (public + app) | Unified backend serving both |
| TypeScript type definitions | Go struct definitions + JSON serialization |
| Static mock data | Query logic (filtering, search, pagination) |
| No auth implementation | Discord OAuth session management |
| No file handling | Flyer image upload/storage (S3/R2) |
| No server-side events | Audit log append-only writes |
| No setup wizard | Database migrations + seeding |

The biggest gap is that **every API call today returns static JSON**. We need to replace that with a real database, business logic, and proper HTTP handlers.

---

## 5. Proposed Backend Architecture

### 5.1 High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                     Pyxis Backend (Go)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Public    │  │    App      │  │       Auth          │  │
│  │   Router    │  │   Router    │  │     Middleware      │  │
│  │ /api/public │  │  /api/app   │  │  (Discord OAuth)    │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
│         │                │                                   │
│         └────────────────┼─────────────────┐                 │
│                          ▼                 ▼                 │
│              ┌─────────────────┐   ┌──────────────┐         │
│              │  Domain Service │   │   Storage    │         │
│              │    Layer        │   │   Layer      │         │
│              │  (shows,        │   │ (PostgreSQL) │         │
│              │   bookings,     │   └──────────────┘         │
│              │   artists...)   │                            │
│              └─────────────────┘                            │
│                          │                                  │
│                          ▼                                  │
│              ┌─────────────────┐                            │
│              │  Repository     │                            │
│              │  (sqlc / pgx)   │                            │
│              └─────────────────┘                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

**Key principle:** One binary, one database, two API prefixes. The public router needs no auth. The app router requires a valid session. Both share the same domain services and repositories.

### 5.2 Package Layout

Because our module is `github.com/go-go-golems/pyxis`, we follow standard Go conventions:

```
pyxis/
├── cmd/
│   └── pyxis/
│       ├── main.go              # Entrypoint — wires root Glazed command
│       └── cmds/
│           ├── serve.go         # "serve" subcommand
│           ├── migrate.go       # "migrate" subcommand
│           ├── seed.go          # "seed" subcommand
│           ├── user.go          # "user" subcommand
│           └── export.go        # "export" subcommand
├── pkg/
│   ├── server/
│   │   ├── server.go            # HTTP server setup, middleware, router mounting
│   │   ├── public.go            # Public API handlers
│   │   ├── app.go               # Staff API handlers
│   │   ├── auth.go              # Auth handlers + middleware
│   │   └── middleware.go        # CORS, logging, recovery
│   ├── domain/
│   │   ├── show.go              # Show entity + validation
│   │   ├── submission.go        # Submission entity + validation
│   │   ├── artist.go            # Artist entity
│   │   ├── attendance.go        # Attendance log entity
│   │   ├── audit.go             # Audit log entity
│   │   ├── calendar.go          # Calendar hold/block entities
│   │   ├── settings.go          # Settings entity
│   │   └── user.go              # User entity
│   ├── service/
│   │   ├── show_service.go
│   │   ├── submission_service.go
│   │   ├── artist_service.go
│   │   ├── calendar_service.go
│   │   ├── attendance_service.go
│   │   ├── audit_service.go
│   │   ├── settings_service.go
│   │   └── auth_service.go
│   ├── repository/
│   │   ├── repository.go        # Repository interface definitions
│   │   └── postgres/
│   │       ├── show_repo.go
│   │       ├── submission_repo.go
│   │       ├── artist_repo.go
│   │       ├── calendar_repo.go
│   │       ├── attendance_repo.go
│   │       ├── audit_repo.go
│   │       ├── settings_repo.go
│   │       └── user_repo.go
│   ├── db/
│   │   ├── migrations/          # golang-migrate SQL files
│   │   ├── queries/             # sqlc query definitions
│   │   └── db.go                # Connection pool + sqlc generated code wrapper
│   ├── discord/
│   │   └── client.go            # Discord client skeleton (interface + no-op impl)
│   ├── storage/
│   │   └── flyer.go             # Flyer image upload (S3/R2 abstraction)
│   ├── config/
│   │   └── config.go            # App configuration struct (env + flags)
│   └── cmdtools/                # CLI command implementations (Glazed) — wired from cmd/pyxis/cmds/
├── internal/
│   └── testutil/                # Test helpers
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

**Why `pkg/` and `cmd/`?**

- `cmd/pyxis/` contains one `main` package. The `cmds/` subpackage holds Glazed command implementations. We produce a single binary `pyxis` with subcommands (`serve`, `migrate`, `seed`, ...). Glazed makes this natural.
- `pkg/` contains importable library code. Other Go projects could theoretically import `github.com/go-go-golems/pyxis/pkg/domain` if needed.
- `internal/` contains code we never want external importers to use, like test fixtures.

### 5.3 Why Glazed?

The **Glazed command framework** (from `go-go-golems`) gives us:

1. **Structured CLI commands** with declarative flags, arguments, and layers.
2. **Automatic help generation** with consistent formatting.
3. **Command groups** so `pyxis serve`, `pyxis migrate up`, `pyxis seed`, etc. feel natural.
4. **JSON/YAML output** for free — every command can emit structured data.
5. **Middleware patterns** for logging, config loading, and database connection setup.

Instead of hand-rolling `flag.Parse()` in every tool, we define a `GlazedCommand` struct. The framework handles the rest.

**Example pseudocode for a Glazed command:**

```go
package cmdtools

import (
    "github.com/go-go-golems/glazed/pkg/cmds"
    "github.com/go-go-golems/glazed/pkg/cmds/layers"
)

type ServeCommand struct {
    *cmds.CommandDescription
}

func NewServeCommand() (*ServeCommand, error) {
    return &ServeCommand{
        CommandDescription: cmds.NewCommandDescription(
            "serve",
            cmds.WithShort("Start the Pyxis HTTP server"),
            cmds.WithFlags(
                parameters.NewParameterDefinition(
                    "bind",
                    parameters.ParameterTypeString,
                    parameters.WithDefault("0.0.0.0:8080"),
                    parameters.WithHelp("Address to bind the HTTP server"),
                ),
                parameters.NewParameterDefinition(
                    "db-url",
                    parameters.ParameterTypeString,
                    parameters.WithDefault("postgres://localhost/pyxis"),
                    parameters.WithHelp("PostgreSQL connection string"),
                ),
            ),
        ),
    }, nil
}

func (c *ServeCommand) Run(
    ctx context.Context,
    parsedLayers *layers.ParsedLayers,
    gp *cmds.GlazeProcessor,
) error {
    bind, _ := parsedLayers.GetParameter("bind")
    dbURL, _ := parsedLayers.GetParameter("db-url")

    db, err := db.Connect(ctx, dbURL)
    if err != nil { return err }

    srv := server.New(db)
    return srv.Start(ctx, bind)
}
```

This looks like more code than a simple `flag` script, but it scales: every command has the same structure, automatic `--help`, and support for config files via Glazed's parameter layers.

---

## 6. Database Schema

We adopt the schema from `prototype-design/sql-api.md` with minor refinements for Go compatibility. Every table gets an `id SERIAL PRIMARY KEY` (or `BIGSERIAL` if we expect massive scale). We use `TIMESTAMPTZ` for all timestamps. We add `BEFORE UPDATE` triggers for `updated_at` columns.

### 6.1 Core Tables

```sql
-- users (staff, authenticated via Discord)
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    discord_id       TEXT NOT NULL UNIQUE,
    discord_username TEXT NOT NULL,
    avatar_url       TEXT,
    role             TEXT NOT NULL DEFAULT 'staff',
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    last_login_at    TIMESTAMPTZ
);

-- artists (derived from submissions, manually managed)
CREATE TABLE artists (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    genre      TEXT,
    links      TEXT,
    notes      TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- submissions (booking inquiries)
CREATE TABLE submissions (
    id              SERIAL PRIMARY KEY,
    artist_id       INT REFERENCES artists(id) ON DELETE SET NULL,
    artist_name     TEXT NOT NULL,
    preferred_date  DATE,
    genre           TEXT,
    expected_draw   INT,
    links           TEXT,
    tech_rider      TEXT,
    message         TEXT,
    contact_discord TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    reviewed_by     INT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_submissions_status ON submissions(status);

-- shows (the core event)
CREATE TABLE shows (
    id                 SERIAL PRIMARY KEY,
    artist             TEXT NOT NULL,
    date               DATE NOT NULL,
    doors_time         TEXT,
    start_time         TEXT,
    age                TEXT,  -- '21+' | '18+' | 'All Ages'
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
CREATE INDEX idx_shows_status ON shows(status);
CREATE INDEX idx_shows_date   ON shows(date);

-- show_lineup (normalized 1:N for lineup entries)
CREATE TABLE show_lineup (
    id         SERIAL PRIMARY KEY,
    show_id    INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
    artist     TEXT NOT NULL,
    role       TEXT NOT NULL,  -- 'headline' | 'support' | 'dj'
    start_time TEXT,
    end_time   TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

-- calendar_holds (soft holds for booking negotiations)
CREATE TABLE calendar_holds (
    id         SERIAL PRIMARY KEY,
    date       DATE NOT NULL,
    label      TEXT,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- calendar_blocked (dates the venue is unavailable)
CREATE TABLE calendar_blocked (
    id         SERIAL PRIMARY KEY,
    date       DATE NOT NULL,
    reason     TEXT,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- attendance_logs (post-show logging)
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

-- audit_log (append-only)
CREATE TABLE audit_log (
    id          SERIAL PRIMARY KEY,
    actor       TEXT NOT NULL,
    actor_id    INT REFERENCES users(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,
    entity_type TEXT,
    entity_id   INT,
    metadata    JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entity     ON audit_log(entity_type, entity_id);

-- settings (single-row configuration)
CREATE TABLE settings (
    id                       INT PRIMARY KEY DEFAULT 1,
    space_name               TEXT NOT NULL DEFAULT 'Pyxis',
    tagline                  TEXT,
    address                  TEXT,
    capacity                 INT,
    contact_email            TEXT,
    website                  TEXT,
    discord_guild_id         TEXT,
    discord_ch_upcoming      TEXT,
    discord_ch_announcements TEXT,
    discord_ch_staff         TEXT,
    discord_ch_bookings      TEXT,
    setup_complete           BOOLEAN DEFAULT FALSE,
    updated_at               TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO settings DEFAULT VALUES;
```

### 6.2 Schema Notes for Interns

- **`shows.status`** in the public API maps to `'confirmed' | 'cancelled' | 'archived'`. In the staff API, it also includes `'draft' | 'hold' | 'blocked'`. We store all six values in one column and filter appropriately.
- **`submissions.status`** has `'pending' | 'approved' | 'declined' | 'hold' | 'cancelled'`. When approved, a show is created and `shows.submission_id` is set.
- **`show_lineup`** is a separate table because a show can have multiple lineup entries. The public `Show` type includes `lineup?: LineupEntry[]`, so we join this table when building public responses.
- **`settings` uses a single-row pattern.** The `CHECK (id = 1)` constraint guarantees exactly one row. We always `UPDATE settings SET ... WHERE id = 1`.
- **`audit_log` is append-only.** Application code should only `INSERT` into it. No updates, no deletes. This is a hard invariant.
- **`updated_at` triggers:** We should add a trigger function that auto-sets `updated_at = NOW()` on every `UPDATE`. This avoids forgetting to set it in Go code.

### 6.3 Relationships Diagram (ASCII)

```
users
  │
  ├──> shows (created_by)
  ├──> submissions (reviewed_by)
  ├──> calendar_holds (created_by)
  ├──> calendar_blocked (created_by)
  ├──> attendance_logs (logged_by)
  └──> audit_log (actor_id)

artists
  │
  ├──> shows (artist_id)
  └──> submissions (artist_id, optional)

submissions
  │
  └──> shows (submission_id, optional)

shows
  │
  ├──> show_lineup (show_id)
  ├──> attendance_logs (show_id, 1:1)
  └──> audit_log (entity_type='show', entity_id)

settings (single row, isolated)
```

---

## 7. API Payload Schemas: Protobuf

We define all API payloads in **Protocol Buffers** rather than hand-written Go structs. This gives us:

1. **Single source of truth** — the `.proto` file describes what a `Show` or `BookingRequest` looks like for both Go and TypeScript.
2. **CamelCase JSON automatically** — `protojson.Marshal` converts snake_case proto fields to camelCase JSON keys (e.g. `doors_time` → `doorsTime`).
3. **Type-safe code generation** — `buf generate` produces Go structs and TypeScript classes from the same schema.
4. **Forward compatibility** — adding fields without breaking old clients is built into protobuf.

### 7.1 Repository Layout for Protos

```
pyxis/
├── proto/
│   └── pyxis/
│       └── v1/
│           ├── show.proto
│           ├── submission.proto
│           ├── artist.proto
│           ├── calendar.proto
│           ├── attendance.proto
│           ├── audit.proto
│           ├── settings.proto
│           └── user.proto
├── buf.yaml
└── buf.gen.yaml
```

### 7.2 Example Proto: Show

**File:** `proto/pyxis/v1/show.proto`

```protobuf
syntax = "proto3";

package pyxis.v1;

option go_package = "github.com/go-go-golems/pyxis/gen/proto/pyxis/v1;pyxisv1";

message Show {
  int32  id            = 1;
  string artist        = 2;
  string date          = 3;  // ISO-8601, e.g. "2025-05-02"
  string doors_time    = 4;
  string start_time    = 5;
  string age           = 6;  // "21+", "18+", "All Ages"
  string price         = 7;
  string genre         = 8;
  string description   = 9;
  repeated LineupEntry lineup = 10;
  string flyer_url     = 11;
  string status        = 12;  // "confirmed" | "cancelled" | "archived"
  int32  submission_id = 13;
  int32  artist_id     = 14;
  string created_at    = 15;
  string updated_at    = 16;

  message LineupEntry {
    string artist     = 1;
    string role       = 2;  // "headline" | "support" | "dj"
    string start_time = 3;
    string end_time   = 4;
  }
}

message AppShow {
  int32  id       = 1;
  string artist   = 2;
  string date     = 3;
  string doors    = 4;
  string age      = 5;
  string price    = 6;
  string status   = 7;  // "confirmed" | "hold" | "blocked" | "archived" | "draft"
  string genre    = 8;
  int32  draw     = 9;
  int32  capacity = 10;
  bool   pinned   = 11;
  string notes    = 12;
}

message ArchivedShow {
  int32  id     = 1;
  string artist = 2;
  string date   = 3;
  string genre  = 4;
  int32  draw   = 5;
}

message ArchiveStats {
  int32 total_shows      = 1;
  int32 total_attendance = 2;
  int32 years_running    = 3;
  int32 unique_artists   = 4;
}

message BookingFormData {
  string artist_name     = 1;
  string genre           = 2;
  string preferred_date  = 3;
  int32  expected_draw   = 4;
  string links           = 5;
  string tech_rider      = 6;
  string message         = 7;
}

message BookingConfirmation {
  bool  success      = 1;
  int32 submission_id = 2;
}
```

### 7.3 Buf Configuration

**`buf.yaml`**
```yaml
version: v2
name: buf.build/go-go-golems/pyxis

deps:
  - buf.build/googleapis/googleapis
```

**`buf.gen.yaml`**
```yaml
version: v2
plugins:
  - remote: buf.build/bufbuild/es
    out: web/src/pb
    opt:
      - target=ts
      - import_extension=none
  - remote: buf.build/protocolbuffers/go
    out: gen/proto
    opt:
      - paths=source_relative
```

### 7.4 Go: Emitting camelCase JSON with protojson

In handlers, we never use `json.Marshal` on protobuf-generated structs. We use `protojson.Marshal`:

```go
import "google.golang.org/protobuf/encoding/protojson"

func respondProtoJSON(w http.ResponseWriter, status int, msg proto.Message) {
    b, err := protojson.Marshal(msg)
    if err != nil {
        respondError(w, err)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    w.Write(b)
}
```

**`protojson` behavior:**
- `doors_time` (proto) → `"doorsTime"` (JSON) automatically
- `int64` → JSON string (safe for JavaScript)
- Omits zero-value fields by default (use `optional` or `[(google.protobuf.field_presence) = EXPLICIT]` if you need explicit nulls)

### 7.5 TypeScript: Decoding with fromJson

The frontend uses `@bufbuild/protobuf` and `fromJson`:

```typescript
import { fromJson } from "@bufbuild/protobuf";
import { ShowSchema } from "./pb/proto/pyxis/v1/show_pb";

const show = fromJson(ShowSchema, jsonData);
console.log(show.doorsTime);  // camelCase, type-safe
```

### 7.6 Mapping: Database -> Domain -> Proto

The data flow is:

```
PostgreSQL row (sqlc-generated struct)
        │
        ▼
Repository maps sqlc struct → domain struct
        │
        ▼
Service works with domain structs (validation, business rules)
        │
        ▼
Handler maps domain struct → proto message
        │
        ▼
protojson.Marshal → camelCase JSON over HTTP
```

**Why two structs?** sqlc structs match the database schema exactly (snake_case SQL columns). Proto structs match the API contract (camelCase JSON). Domain structs are plain Go structs with methods (validation, helpers) and are independent of both.

**Repository example:**

```go
func (r *PostgresShowRepo) GetByID(ctx context.Context, id int) (*domain.Show, error) {
    row, err := r.q.GetShow(ctx, int32(id))
    if err != nil { return nil, err }
    return &domain.Show{
        ID:        int(row.ID),
        Artist:    row.Artist,
        Date:      row.Date,
        DoorsTime: row.DoorsTime,
        // ...
    }, nil
}
```

**Handler example:**

```go
func (s *Server) handleGetPublicShow(w http.ResponseWriter, r *http.Request) {
    show, err := s.showService.GetByID(r.Context(), id)
    if err != nil {
        respondError(w, err)
        return
    }

    pb := &pyxisv1.Show{
        Id:        int32(show.ID),
        Artist:    show.Artist,
        Date:      show.Date.Format("2006-01-02"),
        DoorsTime: show.DoorsTime,
        // ...
    }
    respondProtoJSON(w, http.StatusOK, pb)
}
```

### 7.7 Frontend Migration Plan

Today the frontend defines types by hand in `pyxis-types`. The long-term plan:

1. **Backend defines canonical types in `.proto` files.**
2. **`buf generate` produces TypeScript classes** in `web/src/pb/` (or a shared package).
3. **Frontend imports generated types** instead of hand-written interfaces.
4. **`pyxis-types` becomes a thin re-export layer** during transition, then is removed.

For now, the backend writes `.proto` files and generates Go code. The frontend keeps its hand-written types until we are ready to cut over. Because `protojson` emits camelCase, the JSON shape matches what the frontend already expects.

---

## 8. Data Access Layer: sqlc + pgx

We use **sqlc** to generate type-safe Go code from SQL queries, and **pgx** as the PostgreSQL driver. This combination is idiomatic in modern Go:

- **sqlc** writes the boilerplate `Scan` code for us. We write SQL queries in `.sql` files; sqlc generates Go structs and methods.
- **pgx** is faster than `lib/pq`, supports more PostgreSQL features (JSONB, arrays, `COPY`), and is actively maintained.

### 8.1 Example sqlc Query File

**File:** `pkg/db/queries/shows.sql`

```sql
-- name: ListUpcomingShows :many
SELECT id, artist, date, doors_time, start_time, age, price, genre,
       description, status, flyer_url, submission_id, artist_id,
       created_at, updated_at
FROM shows
WHERE status = 'confirmed' AND date >= CURRENT_DATE
ORDER BY date ASC;

-- name: GetShow :one
SELECT * FROM shows WHERE id = $1;

-- name: CreateShow :one
INSERT INTO shows (artist, date, doors_time, start_time, age, price,
                   genre, description, status, submission_id, artist_id, created_by)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
RETURNING *;

-- name: UpdateShow :one
UPDATE shows
SET artist = $2, date = $3, doors_time = $4, start_time = $5,
    age = $6, price = $7, genre = $8, description = $9, status = $10,
    updated_at = NOW()
WHERE id = $1
RETURNING *;

-- name: ArchiveShow :one
UPDATE shows SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING *;

-- name: SearchArchive :many
SELECT id, artist, date, genre, COALESCE(al.draw, 0) as draw
FROM shows s
LEFT JOIN attendance_logs al ON al.show_id = s.id
WHERE status = 'archived'
  AND ($1::text = '' OR artist ILIKE '%' || $1 || '%' OR genre ILIKE '%' || $1 || '%')
ORDER BY date DESC;
```

sqlc will generate a `Querier` interface and a `Queries` struct with methods like:

```go
type Querier interface {
    ListUpcomingShows(ctx context.Context) ([]Show, error)
    GetShow(ctx context.Context, id int32) (Show, error)
    CreateShow(ctx context.Context, arg CreateShowParams) (Show, error)
    // ...
}
```

**Why this matters:** The intern never writes `rows.Scan(&show.ID, &show.Artist, ...)` by hand. sqlc does it. If the query or schema changes, regenerate the code and the compiler tells you what broke.

### 8.2 Repository Pattern

sqlc gives us low-level queries. We wrap them in **repositories** that encapsulate transaction logic and domain rules.

```go
// pkg/repository/repository.go
package repository

type ShowRepository interface {
    ListUpcoming(ctx context.Context) ([]domain.Show, error)
    GetByID(ctx context.Context, id int) (*domain.Show, error)
    Create(ctx context.Context, show *domain.Show) (*domain.Show, error)
    Update(ctx context.Context, show *domain.Show) (*domain.Show, error)
    Archive(ctx context.Context, id int) error
    SearchArchive(ctx context.Context, query string) ([]domain.ArchivedShow, error)
    GetStats(ctx context.Context) (*domain.ArchiveStats, error)
}
```

The PostgreSQL implementation lives in `pkg/repository/postgres/show_repo.go` and delegates to sqlc-generated code. This separation means we could swap PostgreSQL for SQLite in tests without changing service code.

---

## 9. Domain Service Layer

Services contain **business logic**. They coordinate repositories, enforce invariants, and write to the audit log.

### 9.1 Show Service Example

```go
// pkg/service/show_service.go
package service

type ShowService struct {
    shows   repository.ShowRepository
    audit   repository.AuditLogRepository
    discord discord.Client
}

func (s *ShowService) CreateShow(
    ctx context.Context,
    user *domain.User,
    req CreateShowRequest,
) (*domain.Show, error) {
    // 1. Validate
    if req.Artist == "" {
        return nil, domain.ErrInvalidInput("artist name is required")
    }
    if req.Date.Before(time.Now().AddDate(0, 0, -1)) {
        return nil, domain.ErrInvalidInput("show date cannot be in the past")
    }

    // 2. Build entity
    show := &domain.Show{
        Artist:    req.Artist,
        Date:      req.Date,
        DoorsTime: req.DoorsTime,
        Age:       req.Age,
        Price:     req.Price,
        Genre:     req.Genre,
        Status:    domain.StatusConfirmed,
        CreatedBy: user.ID,
    }

    // 3. Persist
    show, err := s.shows.Create(ctx, show)
    if err != nil {
        return nil, err
    }

    // 4. Audit log
    _ = s.audit.Log(ctx, domain.AuditEntry{
        Actor:      user.DiscordUsername,
        ActorID:    &user.ID,
        Action:     fmt.Sprintf("created show #%d · %s · %s", show.ID, show.Artist, show.Date.Format("2006-01-02")),
        EntityType: domain.EntityShow,
        EntityID:   &show.ID,
    })

    // 5. Discord notification (async, best-effort)
    go s.discord.AnnounceShow(ctx, show)

    return show, nil
}

func (s *ShowService) CancelShow(
    ctx context.Context,
    user *domain.User,
    showID int,
) (*domain.Show, error) {
    show, err := s.shows.GetByID(ctx, showID)
    if err != nil {
        return nil, err
    }
    if show.Status == domain.StatusArchived {
        return nil, domain.ErrInvalidOperation("cannot cancel an archived show")
    }

    show.Status = domain.StatusCancelled
    show, err = s.shows.Update(ctx, show)
    if err != nil {
        return nil, err
    }

    _ = s.audit.Log(ctx, domain.AuditEntry{
        Actor:      user.DiscordUsername,
        ActorID:    &user.ID,
        Action:     fmt.Sprintf("cancelled show #%d", show.ID),
        EntityType: domain.EntityShow,
        EntityID:   &show.ID,
    })

    go s.discord.UnpinAndNotifyCancellation(ctx, show)

    return show, nil
}
```

**Key patterns here:**

1. **Validation first.** Fail fast before touching the database.
2. **Audit logging is mandatory for mutating operations.** The service layer does it, not the handler layer, so we never forget.
3. **Discord is best-effort.** We fire it in a goroutine with its own timeout. If Discord is down, the show still cancels.
4. **Return domain errors.** `domain.ErrInvalidInput`, `domain.ErrNotFound`, `domain.ErrInvalidOperation` — these get translated to HTTP status codes in the handler layer.

### 9.2 Submission Approval Flow

Approving a submission is the most complex write path because it creates or links an artist, creates a show, and notifies Discord:

```
PATCH /api/app/bookings/:id/approve
        │
        ▼
┌─────────────────┐
│ SubmissionService.Approve()
└─────────────────┘
        │
        ├──> 1. Load submission
        ├──> 2. Validate status == pending
        ├──> 3. Find or create artist by name
        │       ├──> SELECT artists WHERE name ILIKE ?
        │       └──> IF not found: INSERT artists (name, genre, links)
        ├──> 4. Create show from submission
        │       ├──> INSERT shows (...)
        │       └──> UPDATE submissions SET status='approved', reviewed_by=?, reviewed_at=NOW()
        ├──> 5. Audit log: "approved submission · Artist · Date"
        └──> 6. Discord DM artist (best-effort)
                └──> POST /channels/@me/messages (Discord API)
```

This should run in a **database transaction** so steps 3 and 4 are atomic. If show creation fails, the artist should not be orphaned and the submission should not be marked approved.

---

## 10. HTTP Handler Layer

Handlers translate HTTP requests to service calls and service responses to JSON. We use the standard library `net/http` with `http.ServeMux` (Go 1.22+ path patterns).

### 10.1 Router Setup

```go
// pkg/server/server.go
package server

func New(db *db.DB, cfg *config.Config) *Server {
    s := &Server{db: db, cfg: cfg}

    // Public router — no auth
    public := http.NewServeMux()
    public.HandleFunc("GET /api/public/shows", s.handleListPublicShows)
    public.HandleFunc("GET /api/public/shows/{id}", s.handleGetPublicShow)
    public.HandleFunc("GET /api/public/archive", s.handleGetArchive)
    public.HandleFunc("GET /api/public/archive/stats", s.handleGetArchiveStats)
    public.HandleFunc("POST /api/public/submissions", s.handleCreateSubmission)

    // Staff router — requires auth
    app := http.NewServeMux()
    app.HandleFunc("GET /api/app/session", s.handleGetSession)
    app.HandleFunc("GET /api/app/shows", s.handleListShows)
    app.HandleFunc("GET /api/app/shows/{id}", s.handleGetShow)
    app.HandleFunc("POST /api/app/shows", s.handleCreateShow)
    app.HandleFunc("PATCH /api/app/shows/{id}", s.handleUpdateShow)
    app.HandleFunc("PATCH /api/app/shows/{id}/cancel", s.handleCancelShow)
    app.HandleFunc("PATCH /api/app/shows/{id}/archive", s.handleArchiveShow)
    // ... etc

    // Auth router
    auth := http.NewServeMux()
    auth.HandleFunc("GET /auth/discord/callback", s.handleDiscordCallback)
    auth.HandleFunc("GET /auth/me", s.handleGetMe)
    auth.HandleFunc("POST /auth/logout", s.handleLogout)

    // Root mux
    mux := http.NewServeMux()
    mux.Handle("/api/public/", http.StripPrefix("/api/public", public))
    mux.Handle("/api/app/", s.requireAuth(http.StripPrefix("/api/app", app)))
    mux.Handle("/auth/", auth)

    // Static SPA serving (future)
    // mux.Handle("/", s.servePublicSPA())
    // mux.Handle("/app/", s.serveStaffSPA())

    s.handler = middleware.Chain(
        mux,
        middleware.Recover,
        middleware.Logger,
        middleware.CORS(cfg.AllowedOrigins),
    )
    return s
}
```

### 10.2 Auth Middleware

```go
// pkg/server/middleware.go
func (s *Server) requireAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        cookie, err := r.Cookie("session")
        if err != nil {
            http.Error(w, `{"error":{"code":"UNAUTHORIZED","message":"Login required"}}`, http.StatusUnauthorized)
            return
        }

        session, err := s.authService.ValidateSession(r.Context(), cookie.Value)
        if err != nil {
            http.Error(w, `{"error":{"code":"UNAUTHORIZED","message":"Invalid session"}}`, http.StatusUnauthorized)
            return
        }

        ctx := context.WithValue(r.Context(), userContextKey, session.User)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### 10.3 Handler Pattern

Every handler follows the same structure:

```go
func (s *Server) handleListPublicShows(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()

    shows, err := s.showService.ListUpcoming(ctx)
    if err != nil {
        respondError(w, err)
        return
    }

    respondJSON(w, http.StatusOK, shows)
}
```

**`respondJSON`** and **`respondError`** are helpers that set `Content-Type: application/json` and marshal the response. `respondError` inspects the error type to choose the status code:

| Domain error | HTTP status |
|---|---|
| `ErrNotFound` | 404 |
| `ErrInvalidInput` | 400 |
| `ErrInvalidOperation` | 409 |
| `ErrUnauthorized` | 401 |
| `ErrForbidden` | 403 |
| everything else | 500 |

---

## 11. Authentication: Discord OAuth

Staff log in via Discord OAuth2. The flow:

```
1. User clicks "Log in with Discord" in the staff app
2. Frontend redirects to Discord's OAuth authorize URL
3. Discord redirects back to /auth/discord/callback?code=...
4. Backend exchanges code for access token (POST Discord API)
5. Backend fetches user profile from Discord
6. Backend creates/updates user in DB
7. Backend creates session (signed JWT or random token)
8. Backend sets session cookie
9. Frontend calls GET /auth/me (or /api/app/session) to get user info
```

**Session storage:** We can use signed JWTs in cookies (stateless) or random session tokens stored in PostgreSQL (stateful). For simplicity and revocation, **stateful sessions** are better:

```sql
CREATE TABLE sessions (
    id         TEXT PRIMARY KEY,  -- random 32-byte hex
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

A nightly job deletes expired sessions, or we add a `WHERE expires_at > NOW()` check on every validation.

**Role-based access control (RBAC):**

| Role | Permissions |
|---|---|
| `Admin` | Everything + settings + user management |
| `Booker` | CRUD shows, submissions, artists, calendar, attendance |
| `Door` | Read shows, write attendance logs |
| `Bot` | System actions, no login |

The `requireAuth` middleware only checks authentication. Individual handlers check authorization:

```go
func requireRole(minRole domain.UserRole) func(http.Handler) http.Handler {
    // returns middleware that rejects if user's role < minRole
}
```

---

## 12. CLI Tools Design (Glazed Commands)

The `pyxis-cli` binary (or `pyxis` subcommands) provides operational tools:

### 12.1 Command Inventory

| Command | Purpose | Example |
|---|---|---|
| `pyxis serve` | Start HTTP server | `pyxis serve --bind :8080 --db-url $DATABASE_URL` |
| `pyxis migrate up` | Run DB migrations | `pyxis migrate up --db-url $DATABASE_URL` |
| `pyxis migrate down` | Rollback one migration | `pyxis migrate down` |
| `pyxis migrate create` | Create new migration file | `pyxis migrate create add_flyer_column` |
| `pyxis seed` | Seed DB with initial data | `pyxis seed --fixtures fixtures/seed.yaml` |
| `pyxis user add` | Create staff user manually | `pyxis user add --discord-id 123 --name Ada --role admin` |
| `pyxis user list` | List staff users | `pyxis user list` |
| `pyxis export` | Export data to CSV/JSON | `pyxis export --format csv --table shows` |
| `pyxis discord post` | Post a show to Discord manually | `pyxis discord post --show-id 42` |

### 12.2 Glazed Command Structure

All commands share a **database layer** parameter group so `--db-url` is consistent:

```go
// pkg/cmdtools/root.go
package cmdtools

import "github.com/go-go-golems/glazed/pkg/cmds"

func BuildRootCommand() (*cmds.CommandDescription, error) {
    root := cmds.NewCommandDescription(
        "pyxis",
        cmds.WithShort("Pyxis venue management backend"),
        cmds.WithSubcommands(
            NewServeCommand(),
            NewMigrateCommand(),
            NewSeedCommand(),
            NewUserCommand(),
            NewExportCommand(),
        ),
    )
    return root, nil
}
```

The Glazed framework automatically generates help:

```bash
$ pyxis --help
Pyxis venue management backend

Usage:
  pyxis [command]

Available Commands:
  serve       Start the HTTP server
  migrate     Database migrations
  seed        Seed the database
  user        Manage staff users
  export      Export data

Flags:
  --db-url string   PostgreSQL connection string (default "postgres://localhost/pyxis")
  -h, --help        help for pyxis
```

---

## 13. Flyer Storage

Flyers are images (PNG, JPG, WebP). We store them in **S3-compatible object storage** (Cloudflare R2, AWS S3, or MinIO for local dev). The database only stores the URL.

```go
// pkg/storage/flyer.go
package storage

type FlyerStore interface {
    Upload(ctx context.Context, showID int, r io.Reader, contentType string) (url string, err error)
    Delete(ctx context.Context, showID int) error
    URL(showID int) string
}
```

**Upload flow:**

1. Handler parses multipart form (`r.MultipartForm`)
2. Validates file type (image/*) and size (< 5MB)
3. Calls `FlyerStore.Upload(ctx, showID, file, contentType)`
4. Store uploads to R2 with key `flyers/{showID}/{uuid}.ext`
5. Returns public CDN URL
6. Handler updates `shows.flyer_url` in DB

**Public flyer endpoint:** `GET /api/public/shows/:id/flyer` can either redirect to the CDN URL or proxy the image. Redirect is cheaper.

---

## 14. Discord Integration (Skeleton Only)

**Scope:** We define the interface now but do **not** implement a full Discord bot in the initial backend. The skeleton lets services call Discord methods without blocking; a no-op implementation keeps the backend working while Discord integration is deferred.

The backend will eventually talk to Discord in two ways:

1. **Bot API** — post messages, pin messages, send DMs. Requires a Discord bot token.
2. **OAuth2** — authenticate users. Requires OAuth client ID/secret.

**File:** `pkg/discord/client.go`

```go
package discord

type Client interface {
    AnnounceShow(ctx context.Context, show *domain.Show) error
    UnpinAndNotifyCancellation(ctx context.Context, show *domain.Show) error
    NotifyArtist(ctx context.Context, discordID string, message string) error
    PostToChannel(ctx context.Context, channelID string, content string) error
}

// NoOpClient satisfies the interface without doing anything.
type NoOpClient struct{}
func (n *NoOpClient) AnnounceShow(ctx context.Context, show *domain.Show) error { return nil }
func (n *NoOpClient) UnpinAndNotifyCancellation(ctx context.Context, show *domain.Show) error { return nil }
func (n *NoOpClient) NotifyArtist(ctx context.Context, discordID string, message string) error { return nil }
func (n *NoOpClient) PostToChannel(ctx context.Context, channelID string, content string) error { return nil }
```

**Why a skeleton?** Discord bot development is a parallel workstream (bot token setup, guild permissions, rate-limit handling). By defining the `Client` interface early, services can call `s.discord.AnnounceShow(...)` today and the no-op client means nothing breaks. When the real implementation is ready, we swap a single constructor call.

**Configuration:** Channel IDs come from the `settings` table. If `settings.discord_ch_upcoming` is empty, Discord features are silently skipped even with the real client.

---

## 15. Implementation Phases

We build the backend in **small, reviewable phases**. Each phase produces a working increment.

### Phase 0: Scaffold & Tooling

- Initialize Go module `github.com/go-go-golems/pyxis`
- Set up `Makefile` with targets: `build`, `test`, `lint`, `migrate`, `seed`
- Add `docker-compose.yml` for PostgreSQL in dev
- Add `golangci-lint` config
- Create package skeleton (`pkg/server`, `pkg/domain`, `pkg/service`, `pkg/repository`, `pkg/db`, `pkg/cmdtools`)
- Add first Glazed command: `pyxis serve` (returns "not yet implemented")

**Validation:** `go build ./cmd/pyxis` succeeds. `docker-compose up` starts PostgreSQL.

### Phase 1: Database & Migrations

- Write all SQL migration files (up + down)
- Integrate `golang-migrate` as a library in `pyxis migrate` command
- Run migrations in CI
- Add sqlc configuration and generate first queries
- Add `db.Connect()` wrapper around pgxpool

**Validation:** `pyxis migrate up` creates all tables. `pyxis migrate down` removes them. sqlc generates Go code without errors.

### Phase 2: Domain Models & Public API (Read-Only)

- Define domain structs in `pkg/domain/`
- Implement `ShowRepository` with `ListUpcoming`, `GetByID`, `SearchArchive`, `GetStats`
- Implement `ShowService` with read-only methods
- Wire public HTTP handlers: `GET /api/public/shows`, `GET /api/public/shows/:id`, `GET /api/public/archive`, `GET /api/public/archive/stats`
- Seed database with realistic show data

**Validation:** The public site frontend can run against the real backend and display shows, archive, and stats correctly.

### Phase 3: Public API Write + Submissions

- Implement `SubmissionRepository` and `SubmissionService`
- Add `POST /api/public/submissions`
- Add validation for booking form data
- Store submissions in DB

**Validation:** The booking form on the public site successfully submits and data appears in the database.

### Phase 4: Auth + Session

- Implement Discord OAuth callback handler
- Create `users` and `sessions` tables
- Add `GET /auth/me`, `POST /auth/logout`
- Add `requireAuth` middleware
- Add `GET /api/app/session`

**Validation:** A user can log in via Discord. Unauthenticated requests to `/api/app/*` return 401. Authenticated requests return user data.

### Phase 5: Staff API — Shows CRUD

- Implement all show mutations: create, update, cancel, archive
- Add audit logging for every mutation
- Wire `POST /api/app/shows`, `PATCH /api/app/shows/:id`, etc.
- Add role checks (only Admin/Booker can cancel)

**Validation:** Staff app can create, edit, cancel, and archive shows. Audit log entries appear. Unauth requests are rejected.

### Phase 6: Staff API — Submissions + Artists

- Implement submission approval/decline
- Implement artist creation on approval
- Add `GET /api/app/bookings`, `PATCH /api/app/bookings/:id/approve`
- Add `GET /api/app/artists`, `GET /api/app/artists/:id`, `PATCH /api/app/artists/:id`

**Validation:** Approving a submission creates a show and an artist. Declining updates status. Artists are searchable.

### Phase 7: Calendar + Attendance

- Implement `calendar_holds` and `calendar_blocked` repositories
- Add calendar endpoints
- Implement `attendance_logs` repository
- Add attendance endpoints

**Validation:** Calendar page displays shows, holds, and blocked dates. Attendance logs can be created and updated.

### Phase 8: Settings + Audit Log

- Implement settings repository (single-row)
- Add `GET /api/app/settings`, `PATCH /api/app/settings`
- Implement audit log repository
- Add `GET /api/app/audit-log` with pagination

**Validation:** Settings page loads and saves. Audit log displays with correct pagination.

### Phase 9: Flyers + Discord

- Add `FlyerStore` implementation (R2/S3)
- Add flyer upload/delete handlers
- Integrate Discord client for announcements
- Add `POST /api/app/shows/:id/announce`

**Validation:** Flyers upload and display. Discord announcements post to the configured channel.

### Phase 10: CLI Polish + Export

- Finalize all CLI commands
- Add CSV export
- Add `pyxis seed` with rich fixtures
- Write integration tests

**Validation:** `make test` passes. `pyxis export --format csv --table shows` produces valid CSV.

---

## 16. Testing Strategy

### 16.1 Unit Tests

- **Domain logic:** Test validation rules, business invariants in `pkg/service/`.
- **Repository layer:** Use `testcontainers-go` to spin up a real PostgreSQL instance per test suite. sqlc makes this practical because queries are just SQL.
- **Mock external deps:** Use `mockery` or hand-written fakes for `discord.Client` and `storage.FlyerStore`.

### 16.2 Integration Tests

- **HTTP handlers:** Start the server on a random port, make real HTTP requests, assert on responses.
- **Auth flow:** Mock Discord's OAuth endpoints using `httptest.Server`.
- **Database migrations:** Test up/down migrations apply cleanly.

### 16.3 Test Directory Structure

```
pkg/
├── service/
│   └── show_service_test.go
├── repository/
│   └── postgres/
│       └── show_repo_test.go   // uses testcontainers
├── server/
│   └── server_test.go          // HTTP integration tests
└── db/
    └── migration_test.go
```

### 16.4 CI

GitHub Actions runs:
1. `golangci-lint`
2. `go test ./...` (unit + integration)
3. `pyxis migrate up` against a temporary PostgreSQL service
4. `go build ./cmd/...`

---

## 17. Risks, Alternatives, and Open Questions

### 17.1 Risks

| Risk | Mitigation |
|---|---|
| Discord OAuth is complex and rate-limited | Implement early (Phase 4). Cache user profiles. Handle token refresh. |
| File uploads open attack surface | Strict content-type validation, size limits (< 5MB), store outside webroot. |
| Audit log table grows unbounded | Add pagination in API. Consider partition by month if > 1M rows. |
| Single binary becomes monolithic | Package boundary is clean (service/repository). Easy to split later. |

### 17.2 Alternatives Considered

| Alternative | Why we didn't choose it |
|---|---|
| Separate microservices for public vs staff | Too much operational overhead for a small team. One binary is simpler. |
| GraphQL instead of REST | Frontend already expects REST. Migration cost is high. |
| MongoDB instead of PostgreSQL | Relational data with strong consistency needs (transactions). SQL is correct. |
| JWT instead of stateful sessions | Revocation is hard. Stateful sessions are simple and secure enough. |
| Fiber/Echo/Gin instead of stdlib | `net/http` with Go 1.22 patterns is sufficient. Fewer dependencies. |

### 17.3 Open Questions

1. **Hosting:** Fly.io? Railway? VPS? This affects how we handle file uploads (need S3/R2 anyway).
2. **Discord bot hosting:** Same process or separate? Starting same-process is simpler.
3. **Email:** Do we need SMTP for booking confirmations, or is Discord DM enough?
4. **Search:** Is PostgreSQL `ILIKE` sufficient for archive search, or do we need `pg_trgm`?
5. **Rate limiting:** Do we rate-limit public submissions to prevent spam?

---

## 18. File References

### Frontend API Contracts (canonical types)

- `web/packages/pyxis-types/src/public.ts` — Public API TypeScript types
- `web/packages/pyxis-types/src/app.ts` — Staff app TypeScript types
- `web/packages/pyxis-user-site/src/api/publicApi.ts` — Public RTK Query slice
- `web/packages/pyxis-app/src/api/appApi.ts` — Staff RTK Query slice
- `web/packages/pyxis-app/src/api/mockHandlers.ts` — MSW mock handlers (documents expected routes)

### Design References

- `prototype-design/sql-api.md` — Original SQL schema and API endpoint design
- `user-stories.md` — MVP phase implementation plan and user stories

### Backend Files (to be created)

- `cmd/pyxis/main.go` — Entrypoint (wires Glazed root command)
- `cmd/pyxis/cmds/*.go` — Subcommand implementations (`serve`, `migrate`, `seed`, ...)
- `pkg/server/server.go` — HTTP router and middleware
- `pkg/domain/*.go` — Domain entities (plain Go structs for business logic)
- `pkg/service/*.go` — Business logic services
- `pkg/repository/postgres/*.go` — PostgreSQL repositories
- `pkg/db/migrations/*.sql` — Database migrations
- `pkg/db/queries/*.sql` — sqlc query definitions
- `pkg/cmdtools/*.go` — Glazed command descriptions (wired by `cmd/pyxis/cmds/`)
- `pkg/discord/client.go` — Discord client skeleton (interface + no-op)
- `pkg/storage/flyer.go` — Flyer image storage
- `proto/pyxis/v1/*.proto` — Canonical API payload schemas
- `buf.yaml` / `buf.gen.yaml` — Buf codegen configuration
- `gen/proto/pyxis/v1/*.pb.go` — Generated Go protobuf code (committed or generated)

---

## 19. Quick-Start Cheat Sheet for Interns

```bash
# 1. Start dependencies
docker-compose up -d db

# 2. Run migrations
go run ./cmd/pyxis migrate up

# 3. Seed data
go run ./cmd/pyxis seed --fixtures fixtures/dev.yaml

# 4. Start server
go run ./cmd/pyxis serve --bind :8080

# 5. Run tests
go test ./...

# 6. Regenerate sqlc after query changes
sqlc generate

# 7. Create a new migration
pyxis migrate create add_new_column
```

---

*End of design document. This is a living document — update it as decisions change during implementation.*
