# Google Calendar Integration — Full Analysis & Implementation Guide

**Ticket:** PYXIS-GOOGLE-CALENDAR
**Date:** 2026-04-29
**Audience:** A new intern joining the team — this document explains every part of the system you need to understand.

***

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [What Is Pyxis? — The App You're Working On](#2-what-is-pyxis--the-app-youre-working-on)
3. [What Is Google Calendar API? — The Service We're Integrating](#3-what-is-google-calendar-api--the-service-were-integrating)
4. [Two Directions of Integration](#4-two-directions-of-integration)
5. [Architecture Overview](#5-architecture-overview)
6. [Authentication — Service Account vs. OAuth2](#6-authentication--service-account-vs-oauth2)
7. [Backend Implementation — Google Calendar Client](#7-backend-implementation--google-calendar-client)
8. [Backend Implementation — Sync Show → Google Calendar](#8-backend-implementation--sync-show--google-calendar)
9. [Backend Implementation — Import External Calendars](#9-backend-implementation--import-external-calendars)
10. [Frontend Implementation — External Calendar Display](#10-frontend-implementation--external-calendar-display)
11. [Configuration & Environment Variables](#11-configuration--environment-variables)
12. [Database Schema Changes](#12-database-schema-changes)
13. [Testing Strategy](#13-testing-strategy)
14. [Security Considerations](#14-security-considerations)
15. [Step-by-Step Implementation Checklist](#15-step-by-step-implementation-checklist)
16. [Appendix: Google Calendar API Reference](#16-appendix-google-calendar-api-reference)
17. [Appendix: Service Account Setup Walkthrough](#17-appendix-service-account-setup-walkthrough)

***

## 1. What Is This Project?

The goal is to integrate Google Calendar with Pyxis in **two directions**:

**Direction 1 — Push (Export):** When a show is created, confirmed, updated, or cancelled in Pyxis, the same event should automatically appear on a Google Calendar. Fans who subscribe to that Google Calendar (or who find it via Google search) see the venue's show schedule alongside their personal calendar — no extra effort from staff.

**Direction 2 — Pull (Import):** The venue might want to display events from other calendars on the Pyxis public website. For example, a neighboring venue's event calendar, or a city-wide arts calendar. We should be able to configure multiple external Google Calendar IDs and display their events alongside our own shows.

This is a significant feature because:

- **Google Calendar is the lingua franca of events.** Many people check Google Calendar daily. Having your shows there means fans don't have to visit your website to know what's coming up.
- **Cross-promotion via imported calendars.** If the venue next door lists their shows on your site too, fans benefit from seeing everything in one place.
- **SEO and discoverability.** Public Google Calendar events can appear in Google search results and Google Maps.

### Key Requirements

- Shows created in Pyxis automatically appear on a Google Calendar (and stay in sync when updated or cancelled)
- Multiple external Google Calendars can be configured for import
- External calendar events are displayed on the public website, clearly distinguished from Pyxis shows
- All Google credentials are stored securely (never in frontend code)
- The integration can be enabled/disabled via configuration

---

## 2. What Is Pyxis? — The App You're Working On

### 2.1 The Big Picture

Pyxis is a **show management platform for a music venue** (a physical space called "ppxis" in Providence, RI). Think of it as the venue's operating system:

- **Staff** (bookers, admins, door people) use a **staff app** (the "app" at `/api/app/...`) to manage shows, artists, bookings, calendars, and post-show reports.
- **The public** (fans, concert-goers) visit a **public website** (the "user site") to see upcoming shows, browse the archive, and submit booking requests.
- A **Discord bot** lets staff do quick actions from Discord without opening the app.

### 2.2 The Tech Stack

Pyxis is a **monorepo** with these parts:

| Part | Technology | Location | Purpose |
|------|-----------|----------|---------|
| Backend API | Go 1.22+ (`net/http`) | `pkg/server/`, `pkg/service/`, `pkg/repository/` | REST-ish JSON API, serves both public and staff routes |
| Database | PostgreSQL | `pkg/db/` (sqlc-generated queries) | All persistent data: shows, artists, bookings, settings |
| Public website | React + Vite + TypeScript | `web/packages/pyxis-user-site/` | Fan-facing website (shows, archive, about, book) |
| Staff app | React + Vite + TypeScript | `web/packages/pyxis-app/` | Internal management dashboard |
| Shared components | React | `web/packages/pyxis-components/` | Reusable UI components |
| Shared types | TypeScript | `web/packages/pyxis-types/` | Protobuf-generated type definitions |
| Protobuf schemas | Protocol Buffers | `proto/`, `gen/proto/` | API request/response definitions |
| Discord bot | JavaScript | `bot/`, `pkg/discordbot/` | Discord slash commands for staff |
| Deployment | Docker + ArgoCD + k3s | `deploy/`, `Dockerfile` | Production on Kubernetes |

### 2.3 How the Backend Is Structured

```
pkg/
├── config/           # Configuration (env vars, flags)
│   └── config.go     # ← We'll add Google Calendar fields here
├── domain/           # Business entities (pure Go structs)
│   ├── show.go       # Show, LineupEntry, ArchivedShow
│   ├── calendar.go   # CalendarHold, CalendarBlocked
│   └── settings.go   # Single-row venue settings
├── repository/       # Database access layer
│   └── postgres/     # PostgreSQL implementations
├── service/          # Business logic layer
│   ├── show_service.go      # ← We'll add Google Calendar sync hooks here
│   └── calendar_service.go  # Calendar hold/blocked operations
├── server/           # HTTP handlers + routing
│   ├── server.go     # ← Main router (add import/sync API routes)
│   ├── public.go     # Public API handlers
│   └── app.go        # Staff API handlers
└── db/               # sqlc-generated database queries
```

### 2.4 The Existing Calendar System

Pyxis already has a calendar system, but it's **internal** — it manages holds (tentative date reservations) and blocked dates (unavailable dates). It does NOT talk to Google Calendar at all. Here's what exists:

**Domain types** (`pkg/domain/calendar.go`):
- `CalendarHold` — a tentative date reservation (e.g., "Band X might play on March 15")
- `CalendarBlocked` — an unavailable date (e.g., "Venue closed for renovations on March 20")

**Calendar events in the UI** are composed from multiple sources:
- Shows (confirmed, hold, draft, cancelled, blocked status)
- Calendar holds
- Calendar blocked dates

The staff app renders all of these on a calendar board (`CalendarBoard` component) that shows a month grid with an agenda sidebar.

**The key insight:** The existing calendar system is about *internal* date management. The new Google Calendar integration adds *external* synchronization and display — a completely different concern.

### 2.5 How Shows Work

A `Show` in Pyxis has these key fields:

```go
type Show struct {
    ID           int
    Artist       string       // "DJ Shadow"
    Date         time.Time    // 2026-05-15
    DoorsTime    string       // "19:00"
    StartTime    string       // "20:00"
    Age          string       // "21+"
    Price        string       // "$15"
    Genre        string       // "Electronic"
    Description  string       // Full show description
    Lineup       []LineupEntry
    Status       string       // confirmed, cancelled, draft, hold, archived
    // ... other fields
}
```

When a show transitions through statuses, we need to sync with Google Calendar:

| Pyxis Show Status | Google Calendar Action |
|-------------------|----------------------|
| `confirmed` | Create/update the Google Calendar event |
| `cancelled` | Delete the Google Calendar event |
| `draft` | Do nothing (not public yet) |
| `hold` | Optionally create a tentative event |
| `archived` | Optionally delete the event (show is past) |

***
## 3. What Is Google Calendar API? — The Service We're Integrating

### 3.1 The Elevator Pitch

Google Calendar is a **cloud-based calendar service** that lets users create, manage, and share calendars and events. The Google Calendar API (v3) lets you programmatically do everything you can do in the Google Calendar web UI:

- Create, read, update, and delete calendar events
- Manage multiple calendars (primary, secondary, shared)
- Control who can see or edit a calendar (ACL)
- Query free/busy information
- Set up push notifications when events change

### 3.2 Key Google Calendar Concepts

- **Calendar**: A named collection of events. Every Google account has a "primary" calendar and can create unlimited secondary calendars. Calendars are identified by their **calendar ID** (usually an email address like `ppxis.space@gmail.com`, or a generated ID like `abc123@group.calendar.google.com`).

- **Event**: A single occurrence on a calendar. Has a title (`summary`), start/end times, location, description, attendees, reminders, and many other fields. Events are identified by an opaque string `id`.

- **Calendar List**: A user's personal list of calendars (their own + calendars they've subscribed to). This is separate from the calendar itself — think of it as a "bookmarks" list.

- **ACL (Access Control List)**: Who can see or edit a calendar. A calendar can be:
  - `private` — only the owner
  - `shared` — specific people
  - `public` — anyone can see it (read-only or read-write)

- **Service Account**: A special type of Google account that belongs to an application (not a person). Service accounts can be given access to calendars via domain-wide delegation or direct ACL sharing. This is how server-to-server integrations work without requiring a human to log in.

- **OAuth2 Client**: An alternative auth method where a human authorizes the app to access their Google Calendar. Requires a consent screen and token management. More complex but sometimes necessary.

### 3.3 How the API Works

The Google Calendar API v3 is a REST API:

```
Base URL: https://www.googleapis.com/calendar/v3/
```

**Key endpoints we'll use:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/calendars/{calendarId}` | GET | Get calendar metadata |
| `/calendars/{calendarId}/events` | POST | Create an event |
| `/calendars/{calendarId}/events/{eventId}` | GET | Get a specific event |
| `/calendars/{calendarId}/events/{eventId}` | PUT | Update an event |
| `/calendars/{calendarId}/events/{eventId}` | DELETE | Delete an event |
| `/calendars/{calendarId}/events` | GET | List events (with filters) |

**Common query parameters for listing events:**
- `timeMin` — Lower bound (inclusive) for event end time (RFC3339 timestamp)
- `timeMax` — Upper bound (exclusive) for event start time (RFC3339 timestamp)
- `singleEvents` — If `true`, expand recurring events into individual instances
- `orderBy` — `startTime` or `updated`
- `maxResults` — Maximum number of events to return (default 250, max 2500)

### 3.4 Event Resource Structure

A Google Calendar event (in JSON) looks like this:

```json
{
  "id": "abc123def456",
  "status": "confirmed",
  "summary": "DJ Shadow at ppxis",
  "description": "An evening of electronic music...",
  "location": "25 Manton Ave, Providence RI 02909",
  "start": {
    "dateTime": "2026-05-15T20:00:00-04:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2026-05-15T23:00:00-04:00",
    "timeZone": "America/New_York"
  },
  "source": {
    "title": "Pyxis",
    "url": "https://pyxis.yolo.scapegoat.dev/shows/42"
  },
  "extendedProperties": {
    "private": {
      "pyxisShowId": "42"
    }
  }
}
```

**Fields we care about:**

| Field | What It Is | How We Use It |
|-------|-----------|---------------|
| `summary` | Event title | `"{Artist} at {SpaceName}"` |
| `description` | Event body | Show description + lineup + price + age |
| `location` | Venue address | From `settings.address` |
| `start.dateTime` | Start time | Show date + doors_time or start_time |
| `end.dateTime` | End time | Show date + estimated end (e.g., start + 3 hours) |
| `source` | Link back to Pyxis | `{"title": "Pyxis", "url": "https://.../shows/{id}"}` |
| `extendedProperties.private.pyxisShowId` | Our internal ID | Used to find & update existing events |
| `status` | Event status | `confirmed` or `cancelled` |

### 3.5 Quota Limits

Google Calendar API has daily quotas:

- **1,000,000 requests per day** per project (generous)
- Rate limiting: ~10 requests per second per user
- Each event operation (create/update/delete) counts as 1 request
- Listing events counts as 1 request regardless of result count

For our use case (a single venue creating maybe 1-2 shows per day), we will never come close to these limits.

---

## 4. Two Directions of Integration

This feature has two distinct directions. They're separate but complementary.

### 4.1 Direction 1: Push — Pyxis → Google Calendar (Export)

**What:** When a show is created or updated in Pyxis, automatically create or update a corresponding event on a Google Calendar.

**Why:** So fans can subscribe to the venue's Google Calendar and see shows in their own calendar app. Also for SEO — Google indexes public calendar events.

**How it works:**

```
┌─────────────────────────────────┐
│  Staff creates a show in Pyxis  │
│  (POST /api/app/shows)          │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  ShowService.Create()           │
│  1. Save show to PostgreSQL     │
│  2. Log audit entry             │
│  3. ★ NEW: Sync to Google Cal  │ ◄── we add this step
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  GoogleCalendarClient           │
│  .CreateOrUpdateEvent(show)     │
│                                 │
│  POST /calendars/{id}/events    │
│  {summary, start, end, ...}     │
└─────────────────────────────────┘
```

**Events to sync:**

| Trigger | Google Calendar Action |
|---------|----------------------|
| Show status → `confirmed` | Create event (or update if already exists) |
| Show updated (artist, date, time, etc.) | Update existing event |
| Show status → `cancelled` | Delete event (or mark cancelled) |
| Show status → `archived` | Optionally delete event |
| Show status → `hold` | Optionally create tentative event |

**Key design decision:** We need to store the Google Calendar event ID on the Pyxis show record so we can update/delete it later. This means a database migration to add a `google_calendar_event_id` column to the `shows` table.

### 4.2 Direction 2: Pull — Google Calendar → Pyxis (Import)

**What:** Configure multiple external Google Calendar IDs. Periodically fetch events from those calendars and display them on the Pyxis public website.

**Why:** Cross-promotion with neighboring venues, city arts calendars, or shared community calendars. Fans see everything in one place.

**How it works:**

```
┌────────────────────────────────────────────────────┐
│  External Google Calendars (configured in settings) │
│                                                    │
│  • neighbor-venue@group.calendar.google.com         │
│  • providence-arts@group.calendar.google.com        │
│  • community-events@gmail.com                       │
└──────────┬─────────────────┬───────────────────────┘
           │                 │
           ▼                 ▼
┌────────────────────────────────────────────────────┐
│  Pyxis Backend (scheduled job or on-demand)         │
│                                                    │
│  For each external calendar:                        │
│    GET /calendars/{id}/events?timeMin=...&timeMax=  │
│    Transform events → ExternalEvent structs         │
│    Return merged list                               │
└──────────┬─────────────────────────────────────────┘
           │
           ▼
┌────────────────────────────────────────────────────┐
│  Public Website                                     │
│                                                    │
│  Shows Page:     Pyxis shows (from our DB)          │
│  Calendar View:  Pyxis shows + External events      │
│  (External events have a distinct visual style)     │
└────────────────────────────────────────────────────┘
```

**Key design decisions for import:**

1. **Do we store imported events in our database?**
   - **Option A (Recommended):** Fetch on-demand from Google Calendar API and cache briefly (5-15 minutes). Simpler, always up-to-date, no sync issues.
   - **Option B:** Store imported events in a local table and sync periodically. More complex but faster queries and works offline.

   For the MVP, **Option A** (fetch on-demand with short caching) is better. The external calendars are just for display — we don't need to query them with complex filters.

2. **How are external calendars configured?**
   - Store their Google Calendar IDs in the `settings` table (as a JSON array or a separate `external_calendars` table)
   - Manage via the staff settings page or via environment variables

3. **How do we authenticate for reading public calendars?**
   - If the external calendars are public, a service account with domain-wide delegation can read them
   - If they're private, the owner needs to share the calendar with the service account email

***
## 5. Architecture Overview

### 5.1 System Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        Google Calendar API (external)                    │
│                                                                          │
│  ┌─────────────────────┐    ┌──────────────┐    ┌─────────────────────┐ │
│  │  Venue Calendar     │    │  Neighbor    │    │  Providence Arts    │ │
│  │  (ppxis@gmail.com)  │    │  Calendar    │    │  Calendar           │ │
│  │  Push: Create/Update│    │  (import)    │    │  (import)           │ │
│  └──────────┬──────────┘    └──────┬───────┘    └──────────┬──────────┘ │
└─────────────┼──────────────────────┼───────────────────────┼───────────┘
              │                      │                       │
              │  HTTPS/REST          │  HTTPS/REST           │
              │                      │                       │
┌─────────────┼──────────────────────┼───────────────────────┼───────────┐
│             ▼                      ▼                       ▼           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  pkg/gcal/client.go — Google Calendar Client                   │   │
│  │                                                                 │   │
│  │  • CreateEvent(calendarID, event) → eventID                    │   │
│  │  • UpdateEvent(calendarID, eventID, event) → error             │   │
│  │  • DeleteEvent(calendarID, eventID) → error                    │   │
│  │  • ListEvents(calendarID, timeMin, timeMax) → []Event          │   │
│  │  • Uses Service Account credentials                            │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│             │                      │                                    │
│             ▼                      ▼                                    │
│  ┌──────────────────┐   ┌──────────────────────┐                       │
│  │ ShowService      │   │ GET /api/public/     │                       │
│  │ (sync hooks)     │   │ external-events      │                       │
│  │                  │   │                      │                       │
│  │ After Create():  │   │ Fetches from external│                       │
│  │  → SyncToGCal()  │   │ calendars, merges,   │                       │
│  │ After Update():  │   │ returns JSON          │                       │
│  │  → SyncToGCal()  │   │                      │                       │
│  │ After Cancel():  │   └──────────────────────┘                       │
│  │  → DeleteGCal()  │                                                │
│  └──────────────────┘                                                 │
│                                                                        │
│                     Go Backend (pkg/server/)                           │
└────────────────────────────────────────────────────────────────────────┘
              │                                       │
              ▼                                       ▼
┌──────────────────────────────┐     ┌────────────────────────────────────┐
│     PostgreSQL (pkg/db/)     │     │    Frontend (React)                │
│                              │     │                                    │
│  shows                       │     │  pyxis-user-site:                  │
│  ├── google_cal_event_id     │◄───▶│    ShowsPage (Pyxis shows only)    │
│  └── google_cal_synced_at    │     │    ShowsPage could show external   │
│                              │     │                                    │
│  settings                    │     │  pyxis-app (staff):                │
│  ├── google_cal_enabled      │     │    Settings → Google Calendar tab  │
│  ├── google_cal_id           │     │                                    │
│  └── external_calendars JSON │     │                                    │
└──────────────────────────────┘     └────────────────────────────────────┘
```

### 5.2 New Files to Create

| File | Purpose |
|------|---------|
| `pkg/gcal/client.go` | Google Calendar API client (CRUD operations on events) |
| `pkg/gcal/client_test.go` | Unit tests with mock HTTP server |
| `pkg/gcal/types.go` | Go types for Google Calendar event resources |

### 5.3 Existing Files to Modify

| File | Change |
|------|--------|
| `pkg/config/config.go` | Add `GoogleCalEnabled`, `GoogleCalCredentialsJSON`, `GoogleCalID`, `ExternalCalendars` |
| `pkg/domain/show.go` | Add `GoogleCalEventID`, `GoogleCalSyncedAt` fields |
| `pkg/domain/settings.go` | Add Google Calendar fields to Settings |
| `pkg/service/show_service.go` | Add sync hooks after Create, Update, Cancel |
| `pkg/server/server.go` | Initialize gcal client, add routes |
| `pkg/server/public.go` | Add `GET /api/public/external-events` handler |
| `pkg/server/app.go` | Add staff settings routes for Google Calendar config |
| SQL migration | Add `google_cal_event_id` and `google_cal_synced_at` columns to `shows`, add Google Calendar fields to `settings` |
| `web/packages/pyxis-user-site/src/api/hooks.ts` | Add `useExternalEvents` hook |
| `web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx` | Optionally display external events |
| `proto/pyxis/v1/show.proto` | Add Google Calendar fields to Show message |

---

## 6. Authentication — Service Account vs. OAuth2

This is one of the most important design decisions. Google Calendar API requires authentication for all operations.

### 6.1 Option A: Service Account (Recommended)

A **service account** is a robot account that belongs to your application. It has its own email address (like `pyxis@pyxis-project.iam.gserviceaccount.com`) and can be granted access to calendars.

**How it works:**

1. You create a service account in Google Cloud Console
2. You download a JSON key file (contains a private key)
3. Your Go app uses this key file to authenticate automatically — no human consent needed
4. You share the venue's Google Calendar with the service account email (just like sharing with a person)
5. For reading external calendars, those calendar owners also share with the service account email

**Pros:**
- No consent screen, no token refresh, no user interaction
- Works perfectly for server-to-server communication
- The app can run autonomously forever
- Simple to set up (one JSON file)

**Cons:**
- Requires someone with Google Cloud Console access to create the service account
- For reading private external calendars, each owner must share with the service account

**What the credentials JSON looks like:**

```json
{
  "type": "service_account",
  "project_id": "pyxis-calendar-123",
  "private_key_id": "abc123",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "pyxis@pyxis-calendar-123.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
}
```

**How Go uses it:**

```go
import (
    "google.golang.org/api/calendar/v3"
    "google.golang.org/api/option"
    "golang.org/x/oauth2/google"
)

func NewClient(ctx context.Context, credentialsJSON []byte) (*calendar.Service, error) {
    config, err := google.JWTConfigFromJSON(credentialsJSON, calendar.CalendarScope)
    if err != nil {
        return nil, fmt.Errorf("parse credentials: %w", err)
    }
    client := config.Client(ctx)
    svc, err := calendar.NewService(ctx, option.WithHTTPClient(client))
    if err != nil {
        return nil, fmt.Errorf("create calendar service: %w", err)
    }
    return svc, nil
}
```

Notice: we use `google.JWTConfigFromJSON` (not `google.CredentialsFromJSON`). JWT (JSON Web Token) is the service account auth flow. It's the one that doesn't require a consent screen.

### 6.2 Option B: OAuth2 (User Consent Flow)

**How it works:** A human staff member clicks "Connect Google Calendar" in the Pyxis staff app, gets redirected to Google's consent screen, grants permission, and Pyxis receives an access token + refresh token.

**Pros:**
- Can access any calendar the user has access to
- No Google Cloud setup beyond creating an OAuth2 client

**Cons:**
- Requires a consent screen and redirect URLs (complex setup)
- Refresh tokens expire after 7 days if not used (Google policy)
- If the staff member leaves, the connection breaks
- Much more complex token management code

### 6.3 Why Service Account Is Recommended

For a server-side integration like this, **service accounts are the standard approach**:

1. **No human in the loop.** The server starts up, reads the credentials file, and is ready. No one needs to click "allow."
2. **Tokens never expire.** Service accounts use JWT authentication that generates short-lived access tokens automatically. The Go client library handles all of this.
3. **Predictable.** The service account's access doesn't depend on a specific human's Google account.
4. **Simple.** One JSON file, one `google.JWTConfigFromJSON` call. That's it.

### 6.4 The Google Go Client Library

We'll use Google's official Go client library:

```
go get google.golang.org/api/calendar/v3
go get google.golang.org/api/option
go get golang.org/x/oauth2/google
```

This is a well-maintained, idiomatic Go library that handles:
- JWT authentication from the service account JSON
- Automatic token refresh
- Type-safe request/response structs
- Retries and error handling

***
## 7. Backend Implementation — Google Calendar Client

### 7.1 Package Structure

Create a new package `pkg/gcal/` that wraps the Google Calendar API client:

```
pkg/gcal/
├── client.go       # Main client — wraps calendar.Service
├── types.go        # Domain types for calendar events
└── client_test.go  # Unit tests
```

### 7.2 Types (`pkg/gcal/types.go`)

We define our own types for calendar events, separate from the Google library's types. This keeps our business logic decoupled from the Google API:

```go
package gcal

import "time"

// ExternalEvent represents a calendar event from an external Google Calendar.
// Used for the "import" direction.
type ExternalEvent struct {
    ID          string    // Google Calendar event ID
    CalendarID  string    // Which calendar this came from
    CalendarName string   // Human-readable calendar name
    Summary     string    // Event title
    Description string    // Event body
    Location    string    // Venue address
    Start       time.Time
    End         time.Time
    URL         string    // Link to the event in Google Calendar
    IsAllDay    bool
}

// SyncResult is returned after syncing a show to Google Calendar.
type SyncResult struct {
    EventID  string    // Google Calendar event ID
    SyncedAt time.Time // When the sync happened
}
```

### 7.3 Client (`pkg/gcal/client.go`)

**Pseudocode:**

```
package gcal

struct Client:
    svc: *calendar.Service (from google.golang.org/api/calendar/v3)
    calendarID: string  // the venue's Google Calendar ID

function NewClient(ctx, credentialsJSON, calendarID) -> *Client:
    config = google.JWTConfigFromJSON(credentialsJSON, CalendarScope)
    httpClient = config.Client(ctx)
    svc = calendar.NewService(ctx, option.WithHTTPClient(httpClient))
    return &Client{svc, calendarID}

function (c *Client) CreateEvent(ctx, show) -> SyncResult:
    event = &calendar.Event{
        Summary:     show.Artist + " at " + spaceName,
        Description: formatDescription(show),
        Location:    venueAddress,
        Start:       &calendar.EventDateTime{DateTime: show.Date + "T" + show.StartTime},
        End:         &calendar.EventDateTime{DateTime: show.Date + "T" + estimatedEndTime},
        Source:      &calendar.EventSource{Title: "Pyxis", URL: showURL},
        ExtendedProperties: &calendar.EventExtendedProperties{
            Private: map[string]string{"pyxisShowId": show.ID},
        },
    }

    created = c.svc.Events.Insert(c.calendarID, event).Do()
    return SyncResult{EventID: created.Id, SyncedAt: now}

function (c *Client) UpdateEvent(ctx, eventID, show) -> SyncResult:
    // Same as Create but uses c.svc.Events.Update(calendarID, eventID, event)
    updated = c.svc.Events.Update(c.calendarID, eventID, event).Do()
    return SyncResult{EventID: updated.Id, SyncedAt: now}

function (c *Client) DeleteEvent(ctx, eventID) -> error:
    return c.svc.Events.Delete(c.calendarID, eventID).Do()

function (c *Client) ListExternalEvents(ctx, calendarID, timeMin, timeMax) -> []ExternalEvent:
    events = c.svc.Events.List(calendarID).
        TimeMin(timeMin).
        TimeMax(timeMax).
        SingleEvents(true).
        OrderBy("startTime").
        Do()

    result = []
    for each event in events.Items:
        result.append(ExternalEvent{
            ID:          event.Id,
            CalendarID:  calendarID,
            Summary:     event.Summary,
            Description: event.Description,
            Location:    event.Location,
            Start:       parseTime(event.Start),
            End:         parseTime(event.End),
            URL:         event.HtmlLink,
            IsAllDay:    event.Start.Date != "",
        })
    return result
```

**The actual Go implementation:**

```go
package gcal

import (
    "context"
    "fmt"
    "time"

    "google.golang.org/api/calendar/v3"
    "google.golang.org/api/option"
    "golang.org/x/oauth2/google"
)

const calendarScope = "https://www.googleapis.com/auth/calendar"

// Client wraps the Google Calendar API service.
type Client struct {
    svc        *calendar.Service
    calendarID string // the venue's own calendar
}

// NewClient creates a Google Calendar client using service account credentials.
// Returns nil if credentialsJSON is empty (feature disabled).
func NewClient(ctx context.Context, credentialsJSON []byte, calendarID string) (*Client, error) {
    if len(credentialsJSON) == 0 {
        return nil, nil // not an error — feature is disabled
    }

    config, err := google.JWTConfigFromJSON(credentialsJSON, calendarScope)
    if err != nil {
        return nil, fmt.Errorf("parse service account credentials: %w", err)
    }

    svc, err := calendar.NewService(ctx, option.WithHTTPClient(config.Client(ctx)))
    if err != nil {
        return nil, fmt.Errorf("create calendar service: %w", err)
    }

    return &Client{svc: svc, calendarID: calendarID}, nil
}

// CalendarID returns the venue's Google Calendar ID.
func (c *Client) CalendarID() string {
    return c.calendarID
}

// CreateEvent creates a new event on the venue's Google Calendar.
func (c *Client) CreateEvent(ctx context.Context, event *calendar.Event) (*SyncResult, error) {
    created, err := c.svc.Events.Insert(c.calendarID, event).Context(ctx).Do()
    if err != nil {
        return nil, fmt.Errorf("create calendar event: %w", err)
    }
    return &SyncResult{EventID: created.Id, SyncedAt: time.Now()}, nil
}

// UpdateEvent updates an existing event.
func (c *Client) UpdateEvent(ctx context.Context, eventID string, event *calendar.Event) (*SyncResult, error) {
    updated, err := c.svc.Events.Update(c.calendarID, eventID, event).Context(ctx).Do()
    if err != nil {
        return nil, fmt.Errorf("update calendar event: %w", err)
    }
    return &SyncResult{EventID: updated.Id, SyncedAt: time.Now()}, nil
}

// DeleteEvent removes an event from the venue's Google Calendar.
func (c *Client) DeleteEvent(ctx context.Context, eventID string) error {
    err := c.svc.Events.Delete(c.calendarID, eventID).Context(ctx).Do()
    if err != nil {
        return fmt.Errorf("delete calendar event: %w", err)
    }
    return nil
}

// ListExternalEvents fetches events from an external Google Calendar.
func (c *Client) ListExternalEvents(ctx context.Context, calID string, timeMin, timeMax time.Time) ([]ExternalEvent, error) {
    events, err := c.svc.Events.List(calID).
        Context(ctx).
        TimeMin(timeMin.Format(time.RFC3339)).
        TimeMax(timeMax.Format(time.RFC3339)).
        SingleEvents(true).
        OrderBy("startTime").
        Do()
    if err != nil {
        return nil, fmt.Errorf("list events from %s: %w", calID, err)
    }

    result := make([]ExternalEvent, 0, len(events.Items))
    for _, e := range events.Items {
        ext := ExternalEvent{
            ID:          e.Id,
            CalendarID:  calID,
            Summary:     e.Summary,
            Description: e.Description,
            Location:    e.Location,
            URL:         e.HtmlLink,
        }

        // Parse start/end times
        if e.Start != nil {
            if e.Start.DateTime != "" {
                t, _ := time.Parse(time.RFC3339, e.Start.DateTime)
                ext.Start = t
            }
            if e.Start.Date != "" {
                t, _ := time.Parse("2006-01-02", e.Start.Date)
                ext.Start = t
                ext.IsAllDay = true
            }
        }
        if e.End != nil {
            if e.End.DateTime != "" {
                t, _ := time.Parse(time.RFC3339, e.End.DateTime)
                ext.End = t
            }
            if e.End.Date != "" {
                t, _ := time.Parse("2006-01-02", e.End.Date)
                ext.End = t
            }
        }

        result = append(result, ext)
    }
    return result, nil
}
```

---
## 8. Backend Implementation — Sync Show → Google Calendar

### 8.1 The Sync Hook Pattern

The idea is simple: after the existing `ShowService` does its work (create, update, cancel), we add a step that syncs the show to Google Calendar. This is the same pattern used for Discord announcements and audit logging.

We add a **sync helper function** and call it from the appropriate service methods.

### 8.2 Building a Google Calendar Event from a Show

First, we need a function that converts a Pyxis `Show` into a Google Calendar `Event`:

```go
// pkg/gcal/show_to_event.go

package gcal

import (
    "fmt"
    "strings"

    "github.com/go-go-golems/pyxis/pkg/domain"
    "google.golang.org/api/calendar/v3"
)

// ShowToEvent converts a Pyxis Show domain entity into a Google Calendar Event.
func ShowToEvent(show *domain.Show, spaceName, address, websiteURL string) *calendar.Event {
    // Build the event description with show details
    var descParts []string
    if show.Description != "" {
        descParts = append(descParts, show.Description)
    }
    if len(show.Lineup) > 0 {
        descParts = append(descParts, "\nLineup:")
        for _, entry := range show.Lineup {
            line := fmt.Sprintf("  %s", entry.Artist)
            if entry.Role != "" {
                line += fmt.Sprintf(" (%s)", entry.Role)
            }
            if entry.StartTime != "" {
                line += fmt.Sprintf(" — %s", entry.StartTime)
            }
            descParts = append(descParts, line)
        }
    }
    if show.Price != "" {
        descParts = append(descParts, fmt.Sprintf("\nCover: %s", show.Price))
    }
    if show.Age != "" {
        descParts = append(descParts, fmt.Sprintf("Age: %s", show.Age))
    }
    if show.Genre != "" {
        descParts = append(descParts, fmt.Sprintf("Genre: %s", show.Genre))
    }

    // Build start/end times
    // Show.Date is the date (YYYY-MM-DD). StartTime is "20:00".
    // We need a timezone. Use America/New_York as default (or from settings).
    tz := "America/New_York"
    dateStr := show.Date.Format("2006-01-02")

    startTime := dateStr + "T" + defaultTime(show.DoorsTime, show.StartTime, "19:00") + ":00"
    // Estimate end time: start + 4 hours (typical show length)
    endTime := dateStr + "T23:59:00" // or calculate from start + duration

    return &calendar.Event{
        Summary:  fmt.Sprintf("%s at %s", show.Artist, spaceName),
        Location: address,
        Description: strings.Join(descParts, "\n"),
        Start: &calendar.EventDateTime{
            DateTime: startTime,
            TimeZone: tz,
        },
        End: &calendar.EventDateTime{
            DateTime: endTime,
            TimeZone: tz,
        },
        Source: &calendar.EventSource{
            Title: "Pyxis",
            Url:   fmt.Sprintf("%s/shows/%d", websiteURL, show.ID),
        },
        ExtendedProperties: &calendar.EventExtendedProperties{
            Private: map[string]string{
                "pyxisShowId": fmt.Sprintf("%d", show.ID),
            },
        },
    }
}

func defaultTime(options ...string) string {
    for _, s := range options {
        if s != "" {
            return s
        }
    }
    return "19:00"
}
```

### 8.3 The Sync Function

This function is called from `ShowService` after a show is created or updated:

```go
// In pkg/service/show_service.go (or a new file pkg/service/gcal_sync.go)

// syncShowToGCal syncs a show to Google Calendar if the integration is enabled.
// It's designed to be called after a successful DB write — errors are logged but
// do NOT fail the overall operation. A show should still save even if Google is down.
func (s *ShowService) syncShowToGCal(ctx context.Context, show *domain.Show) {
    if s.gcalClient == nil {
        return // Google Calendar not configured
    }

    settings, err := s.settings.Get(ctx)
    if err != nil {
        log.Warn().Err(err).Msg("gcal sync: failed to get settings")
        return
    }

    event := gcal.ShowToEvent(show, settings.SpaceName, settings.Address, settings.Website)

    if show.GoogleCalEventID != "" {
        // Event already exists — update it
        _, err = s.gcalClient.UpdateEvent(ctx, show.GoogleCalEventID, event)
        if err != nil {
            log.Error().Err(err).Int("showId", show.ID).Msg("gcal sync: update failed")
            return
        }
        log.Info().Int("showId", show.ID).Msg("gcal sync: updated event")
    } else {
        // Create new event
        result, err := s.gcalClient.CreateEvent(ctx, event)
        if err != nil {
            log.Error().Err(err).Int("showId", show.ID).Msg("gcal sync: create failed")
            return
        }
        // Store the Google Calendar event ID on the show
        show.GoogleCalEventID = result.EventID
        show.GoogleCalSyncedAt = &result.SyncedAt
        // Update the show record with the event ID
        _, err = s.shows.Update(ctx, show)
        if err != nil {
            log.Error().Err(err).Int("showId", show.ID).Msg("gcal sync: failed to save event ID")
        }
        log.Info().Int("showId", show.ID).Str("eventId", result.EventID).Msg("gcal sync: created event")
    }
}
```

### 8.4 Where to Hook Into ShowService

Modify the existing `ShowService` methods to call `syncShowToGCal`:

**After Create:**
```go
func (s *ShowService) Create(ctx context.Context, show *domain.Show, ...) (*domain.Show, error) {
    // ... existing create logic ...

    // NEW: Sync to Google Calendar (only for confirmed shows)
    if created.Status == domain.StatusConfirmed {
        go s.syncShowToGCal(ctx, created) // fire-and-forget in goroutine
    }

    return created, nil
}
```

**After Update:**
```go
func (s *ShowService) Update(ctx context.Context, show *domain.Show, ...) (*domain.Show, error) {
    // ... existing update logic ...

    // NEW: Sync to Google Calendar
    if updated.Status == domain.StatusConfirmed {
        go s.syncShowToGCal(ctx, updated)
    }

    return updated, nil
}
```

**After Cancel:**
```go
func (s *ShowService) Cancel(ctx context.Context, id int, ...) (*domain.Show, error) {
    // ... existing cancel logic ...

    // NEW: Delete from Google Calendar
    if updated.GoogleCalEventID != "" && s.gcalClient != nil {
        go func() {
            if err := s.gcalClient.DeleteEvent(ctx, updated.GoogleCalEventID); err != nil {
                log.Error().Err(err).Int("showId", id).Msg("gcal sync: delete failed")
            } else {
                log.Info().Int("showId", id).Msg("gcal sync: deleted event")
            }
        }()
    }

    return updated, nil
}
```

### 8.5 Key Design Decisions

1. **Fire-and-forget (goroutine):** The Google Calendar sync runs in a goroutine (`go s.syncShowToGCal(...)`) so it doesn't block the API response. If Google is slow, the user's request still completes instantly. If the sync fails, we log it but don't fail the show creation.

2. **Store event ID on the show:** We add `google_cal_event_id` and `google_cal_synced_at` columns to the `shows` table. This lets us update/delete the event later.

3. **Only sync confirmed shows:** Draft and hold shows are internal — they shouldn't appear on the public Google Calendar.

4. **Idempotent:** If `syncShowToGCal` is called twice for the same show, the second call does an update (not a duplicate create).

***
## 9. Backend Implementation — Import External Calendars

### 9.1 Overview

For importing events from external calendars, we add a new public API endpoint that fetches events from configured external Google Calendars and returns them as JSON.

### 9.2 Configuration: Where External Calendar IDs Live

External calendars are configured in the `settings` table. We add a JSON column `external_calendars` that stores an array of calendar configurations:

```json
[
  {
    "id": "neighbor-venue@group.calendar.google.com",
    "name": "The Parlour",
    "color": "#4A90D9",
    "enabled": true
  },
  {
    "id": "providence-arts@gmail.com",
    "name": "Providence Arts Council",
    "color": "#7ED321",
    "enabled": true
  }
]
```

Each entry has:
- `id` — the Google Calendar ID (how we identify which calendar to fetch)
- `name` — a human-readable label for the UI
- `color` — a CSS color for visual distinction in the calendar UI
- `enabled` — can be toggled without deleting the config

### 9.3 The API Endpoint

**Route:** `GET /api/public/external-events`

**Query parameters:**
- `from` — start date (default: today)
- `to` — end date (default: 30 days from now)

**Handler pseudocode:**

```
function handleListExternalEvents(w, r):
    if gcalClient is nil:
        respond with 200 and empty list  // not an error
        return

    // Parse date range from query params
    from = r.URL.Query().Get("from") or today
    to = r.URL.Query().Get("to") or today + 30 days

    // Get external calendar config from settings
    settings = settingsService.Get(ctx)
    calendars = settings.ExternalCalendars  // parsed from JSON

    // Fetch events from each enabled calendar
    allEvents = []
    for each cal in calendars:
        if not cal.Enabled:
            continue

        events = gcalClient.ListExternalEvents(ctx, cal.ID, from, to)
        for each event in events:
            event.CalendarName = cal.Name
            event.CalendarColor = cal.Color
        allEvents = append(allEvents, events...)

    // Sort by start time
    sort allEvents by Start time

    respond with 200 and allEvents as JSON
```

**Actual Go code:**

```go
func (s *Server) handleListExternalEvents(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()

    if s.gcalClient == nil {
        respondJSON(w, http.StatusOK, []interface{}{})
        return
    }

    // Parse date range
    fromStr := r.URL.Query().Get("from")
    toStr := r.URL.Query().Get("to")

    from := time.Now().Truncate(24 * time.Hour)
    to := from.Add(30 * 24 * time.Hour)

    if fromStr != "" {
        if t, err := time.Parse("2006-01-02", fromStr); err == nil {
            from = t
        }
    }
    if toStr != "" {
        if t, err := time.Parse("2006-01-02", toStr); err == nil {
            to = t
        }
    }

    // Get settings with external calendar config
    settings, err := s.settingsService.Get(ctx)
    if err != nil {
        respondError(w, err)
        return
    }

    if len(settings.ExternalCalendars) == 0 {
        respondJSON(w, http.StatusOK, []interface{}{})
        return
    }

    // Fetch events from each enabled external calendar
    var allEvents []gcal.ExternalEvent
    for _, cal := range settings.ExternalCalendars {
        if !cal.Enabled {
            continue
        }
        events, err := s.gcalClient.ListExternalEvents(ctx, cal.ID, from, to)
        if err != nil {
            log.Warn().Err(err).Str("calendar", cal.ID).Msg("failed to fetch external calendar")
            continue // skip this calendar, don't fail the whole request
        }
        for i := range events {
            events[i].CalendarName = cal.Name
        }
        allEvents = append(allEvents, events...)
    }

    // Sort by start time
    sort.Slice(allEvents, func(i, j int) bool {
        return allEvents[i].Start.Before(allEvents[j].Start)
    })

    respondJSON(w, http.StatusOK, allEvents)
}
```

### 9.4 Caching Strategy

Calling Google Calendar API on every page load would be slow and waste quota. We add a simple in-memory cache:

```go
import "sync"
import "time"

type cachedEvents struct {
    mu       sync.RWMutex
    events   []gcal.ExternalEvent
    fetched  time.Time
    ttl      time.Duration  // e.g., 5 minutes
}

func (c *cachedEvents) Get() ([]gcal.ExternalEvent, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    if time.Since(c.fetched) > c.ttl {
        return nil, false  // cache expired
    }
    return c.events, true
}

func (c *cachedEvents) Set(events []gcal.ExternalEvent) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.events = events
    c.fetched = time.Now()
}
```

The handler checks the cache first. If the cache is fresh (under 5 minutes), return cached data. Otherwise, fetch from Google and update the cache.

### 9.5 Error Handling Philosophy

External calendar fetching is **best-effort**. If one calendar fails to load:

- **Log a warning** (don't error)
- **Skip that calendar** and continue with the others
- **Return partial results** — the shows we could fetch
- **Never fail the whole request** because one external calendar is down

This is important because we don't control external calendars. If the neighbor venue changes their sharing settings, our site shouldn't break.

---

## 10. Frontend Implementation — External Calendar Display

### 10.1 API Hook

Add a React Query hook to fetch external events:

```typescript
// web/packages/pyxis-user-site/src/api/hooks.ts

import { useQuery } from '@tanstack/react-query';

interface ExternalEvent {
  id: string;
  calendarId: string;
  calendarName: string;
  summary: string;
  description: string;
  location: string;
  start: string;  // ISO 8601
  end: string;
  url: string;
  isAllDay: boolean;
}

export function useExternalEvents(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);

  return useQuery<ExternalEvent[]>({
    queryKey: ['external-events', from, to],
    queryFn: async () => {
      const response = await fetch(`/api/public/external-events?${params}`);
      if (!response.ok) return []; // graceful fallback
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes (matches server cache)
    retry: 1, // only retry once
  });
}
```

### 10.2 Display Options

There are two approaches to displaying external events:

**Option A: On the Shows Page (mixed timeline)**

Show Pyxis shows and external events in a single timeline, with external events visually distinguished:

```tsx
// In ShowsPage/Page.tsx

export function Shows() {
  const { data: shows } = usePublicShows();
  const { data: externalEvents } = useExternalEvents();

  return (
    <main>
      {/* Pyxis shows — primary content */}
      <section data-section="pyxis-shows">
        <h2>Upcoming Shows</h2>
        <ShowGrid shows={shows} />
      </section>

      {/* External events — secondary content */}
      {externalEvents && externalEvents.length > 0 && (
        <section data-section="external-events">
          <h2>Events Nearby</h2>
          <ExternalEventList events={externalEvents} />
        </section>
      )}
    </main>
  );
}
```

**Option B: Separate page or tab**

A dedicated "Community Events" page that shows only external calendar events.

**Recommendation:** Start with **Option A** — a separate section on the shows page. It's simpler and keeps everything in one place.

### 10.3 External Event Component

A simple card component for displaying an external event:

```typescript
// web/packages/pyxis-components/src/molecules/ExternalEventCard/ExternalEventCard.tsx

export interface ExternalEventCardProps {
  summary: string;
  calendarName: string;
  start: string;
  location?: string;
  url?: string;
  description?: string;
  isAllDay?: boolean;
}

export function ExternalEventCard({
  summary, calendarName, start, location, url, description, isAllDay,
}: ExternalEventCardProps) {
  const startDate = new Date(start);
  const dateStr = isAllDay
    ? startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : startDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      });

  return (
    <div className="pyxis-external-event" data-source={calendarName}>
      <div className="pyxis-external-event__date">{dateStr}</div>
      <div className="pyxis-external-event__content">
        <h3 className="pyxis-external-event__title">
          {url ? <a href={url} target="_blank" rel="noopener noreferrer">{summary}</a> : summary}
        </h3>
        {location && <p className="pyxis-external-event__location">{location}</p>}
        <span className="pyxis-external-event__source">{calendarName}</span>
      </div>
    </div>
  );
}
```

### 10.4 Visual Design

External events should be visually distinct from Pyxis shows:

- **Different color/badge** — e.g., a small tag that says "The Parlour" or "Community Event"
- **Lighter/dimmer styling** — they're secondary content
- **External link** — clicking takes you to the source calendar (not a Pyxis show detail page)

***
## 11. Configuration & Environment Variables

### 11.1 What Needs to Be Configured

| Variable | Example | Purpose |
|----------|---------|---------|
| `GOOGLE_CAL_ENABLED` | `true` | Master on/off switch |
| `GOOGLE_CAL_CREDENTIALS` | JSON string or file path | Service account credentials |
| `GOOGLE_CAL_ID` | `ppxis@gmail.com` | The venue's Google Calendar ID |
| `GOOGLE_CAL_EXTERNAL` | JSON array of calendar configs | External calendars to import |

### 11.2 How to Get the Service Account Credentials

**Step-by-step setup (one-time, by an admin):**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "Pyxis Calendar Integration")
3. Enable the **Google Calendar API** (APIs & Services → Library → search "Calendar" → Enable)
4. Go to **IAM & Admin → Service Accounts**
5. Click **Create Service Account**
   - Name: `pyxis-calendar-sync`
   - Description: `Pyxis show calendar sync`
   - Click **Create and Continue**
6. Click **Done**
7. Click on the service account email → **Keys** tab → **Add Key → Create New Key → JSON**
8. Download the JSON file — this is your credentials file
9. **Share the venue's Google Calendar** with the service account email:
   - Open Google Calendar
   - Find the venue's calendar in the left sidebar
   - Click the three dots → **Settings and sharing**
   - Under **Share with specific people**, click **Add people**
   - Paste the service account email (e.g., `pyxis-calendar-sync@pyxis-project.iam.gserviceaccount.com`)
   - Set permission to **Make changes to events** (for push/sync)
   - Click **Send**

### 11.3 How to Get the Calendar ID

1. Open Google Calendar
2. Find the venue's calendar in the left sidebar
3. Click the three dots → **Settings and sharing**
4. Scroll down to **Integrate calendar**
5. Copy the **Calendar ID** (it looks like an email address)

### 11.4 How to Get External Calendar IDs

For each external calendar you want to import:

1. Ask the calendar owner to share the calendar with your service account email (read-only is fine)
2. Get their Calendar ID (same steps as above)
3. If the calendar is public, you don't need sharing — just the Calendar ID

### 11.5 Local Development Setup

```bash
# .envrc

# Google Calendar integration
export PYXIS_GOOGLE_CAL_ENABLED=true
export PYXIS_GOOGLE_CAL_ID="ppxis@gmail.com"
export PYXIS_GOOGLE_CAL_CREDENTIALS='{"type":"service_account","project_id":"...",...}'
# OR load from file:
export PYXIS_GOOGLE_CAL_CREDENTIALS_FILE="/path/to/credentials.json"

# External calendars (JSON array)
export PYXIS_GOOGLE_CAL_EXTERNAL='[{"id":"neighbor@gmail.com","name":"The Parlour","enabled":true}]'
```

### 11.6 Config Struct Changes

```go
// Add to pkg/config/config.go Config struct:

// Google Calendar integration
GoogleCalEnabled         bool
GoogleCalID              string
GoogleCalCredentials     string  // JSON string of service account credentials
GoogleCalCredentialsFile string  // OR path to JSON file
GoogleCalExternal        string  // JSON array of external calendar configs
```

### 11.7 Production Setup

Store the credentials as a Kubernetes secret:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: pyxis-gcal-credentials
type: Opaque
stringData:
  credentials.json: |
    {"type":"service_account","project_id":"...",...}
---
# In deployment
env:
  - name: PYXIS_GOOGLE_CAL_ENABLED
    value: "true"
  - name: PYXIS_GOOGLE_CAL_ID
    value: "ppxis@gmail.com"
  - name: PYXIS_GOOGLE_CAL_CREDENTIALS_FILE
    value: "/secrets/gcal/credentials.json"
volumeMounts:
  - name: gcal-credentials
    mountPath: /secrets/gcal
    readOnly: true
```

---

## 12. Database Schema Changes

### 12.1 Migration: Add Google Calendar Fields to Shows

```sql
-- Migration: add_google_cal_fields_to_shows
-- Stores the Google Calendar event ID so we can update/delete events later.

ALTER TABLE shows
    ADD COLUMN google_cal_event_id TEXT DEFAULT '',
    ADD COLUMN google_cal_synced_at TIMESTAMPTZ;

-- Index for looking up shows by their Google Calendar event ID
-- (useful if we later add webhook handling for changes made in Google Calendar)
CREATE INDEX idx_shows_google_cal_event_id
    ON shows (google_cal_event_id)
    WHERE google_cal_event_id != '';
```

**Why `TEXT DEFAULT ''` instead of `NULL`?** The Go codebase uses sqlc, which handles `NULL` with pgtype types. Using an empty string default simplifies the code — we just check `if show.GoogleCalEventID != ""` instead of `if show.GoogleCalEventID.Valid && show.GoogleCalEventID.String != ""`.

### 12.2 Migration: Add Google Calendar Fields to Settings

```sql
-- Migration: add_google_cal_fields_to_settings
-- Stores Google Calendar configuration in the single-row settings table.

ALTER TABLE settings
    ADD COLUMN google_cal_enabled BOOLEAN DEFAULT false,
    ADD COLUMN google_cal_id TEXT DEFAULT '',
    ADD COLUMN external_calendars JSONB DEFAULT '[]'::jsonb;
```

**Why JSONB for external calendars?** External calendars are a list of objects with config (ID, name, color, enabled). JSONB lets us store and query this flexibly without creating a separate table. For a handful of external calendars, this is simpler.

### 12.3 Domain Model Changes

**`pkg/domain/show.go` — add fields:**

```go
type Show struct {
    // ... existing fields ...

    // Google Calendar sync fields
    GoogleCalEventID  string     // Google Calendar event ID (empty if not synced)
    GoogleCalSyncedAt *time.Time // When the event was last synced
}
```

**`pkg/domain/settings.go` — add fields:**

```go
type ExternalCalendar struct {
    ID      string `json:"id"`
    Name    string `json:"name"`
    Color   string `json:"color"`
    Enabled bool   `json:"enabled"`
}

type Settings struct {
    // ... existing fields ...

    // Google Calendar integration
    GoogleCalEnabled   bool
    GoogleCalID        string
    ExternalCalendars  []ExternalCalendar
}
```

### 12.4 sqlc Query Updates

The sqlc queries that insert/update shows need to include the new columns:

```sql
-- In sqlc queries (e.g., pkg/db/shows.sql):

-- Update existing CreateShow to include google_cal columns:
-- name: CreateShow
INSERT INTO shows (artist, date, doors_time, start_time, age, price, genre,
                   description, notes, status, created_by, flyer_url, capacity)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
RETURNING *;

-- Add new query for updating Google Calendar sync status:
-- name: UpdateShowGoogleCalSync
UPDATE shows
SET google_cal_event_id = $2,
    google_cal_synced_at = $3,
    updated_at = NOW()
WHERE id = $1
RETURNING *;
```

### 12.5 Protobuf Schema Changes

Add Google Calendar fields to the Show message:

```protobuf
// proto/pyxis/v1/show.proto

message Show {
  // ... existing fields ...

  // Google Calendar sync status (staff-only, not exposed on public API)
  string google_cal_event_id = 30;
  google.protobuf.Timestamp google_cal_synced_at = 31;
}
```

These fields should only be included in staff API responses (not public), since fans don't need to know about the Google Calendar integration.

***
## 13. Testing Strategy

### 13.1 Backend Unit Tests: Google Calendar Client

The main challenge is testing without hitting the real Google Calendar API. We use Go's `httptest` package to create a fake Google Calendar server.

```go
package gcal

import (
    "context"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    "time"

    "google.golang.org/api/calendar/v3"
    "google.golang.org/api/option"
)

func newTestClient(t *testing.T, handler http.HandlerFunc) (*Client, *httptest.Server) {
    t.Helper()
    server := httptest.NewServer(handler)
    // Create a calendar.Service pointing at the fake server
    svc, err := calendar.NewService(context.Background(),
        option.WithEndpoint(server.URL),
        option.WithoutAuthentication())
    if err != nil {
        t.Fatalf("create test service: %v", err)
    }
    return &Client{svc: svc, calendarID: "test-calendar-id"}, server
}

func TestCreateEvent_Success(t *testing.T) {
    client, server := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
        // Verify it's a POST to the events endpoint
        if r.Method != http.MethodPost {
            t.Errorf("expected POST, got %s", r.Method)
        }

        // Return a fake created event
        event := &calendar.Event{
            Id:      "fake-event-id-123",
            Summary: "Test Show at ppxis",
            Status:  "confirmed",
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(event)
    })
    defer server.Close()

    event := &calendar.Event{
        Summary: "Test Show at ppxis",
        Start:   &calendar.EventDateTime{DateTime: "2026-05-15T20:00:00", TimeZone: "America/New_York"},
        End:     &calendar.EventDateTime{DateTime: "2026-05-15T23:00:00", TimeZone: "America/New_York"},
    }

    result, err := client.CreateEvent(context.Background(), event)
    if err != nil {
        t.Fatalf("CreateEvent failed: %v", err)
    }
    if result.EventID != "fake-event-id-123" {
        t.Errorf("expected event ID 'fake-event-id-123', got '%s'", result.EventID)
    }
}

func TestListExternalEvents_Success(t *testing.T) {
    client, server := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
        if r.Method != http.MethodGet {
            t.Errorf("expected GET, got %s", r.Method)
        }

        // Return fake events
        events := &calendar.Events{
            Items: []*calendar.Event{
                {
                    Id:          "ext-1",
                    Summary:     "Jazz Night",
                    Location:    "The Parlour",
                    Description: "Live jazz every Thursday",
                    Start:       &calendar.EventDateTime{DateTime: "2026-05-14T19:00:00-04:00"},
                    End:         &calendar.EventDateTime{DateTime: "2026-05-14T22:00:00-04:00"},
                    HtmlLink:    "https://calendar.google.com/event?eid=abc",
                },
            },
        }
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(events)
    })
    defer server.Close()

    from := time.Date(2026, 5, 1, 0, 0, 0, 0, time.UTC)
    to := time.Date(2026, 5, 31, 0, 0, 0, 0, time.UTC)

    events, err := client.ListExternalEvents(context.Background(), "ext-calendar-id", from, to)
    if err != nil {
        t.Fatalf("ListExternalEvents failed: %v", err)
    }
    if len(events) != 1 {
        t.Fatalf("expected 1 event, got %d", len(events))
    }
    if events[0].Summary != "Jazz Night" {
        t.Errorf("expected summary 'Jazz Night', got '%s'", events[0].Summary)
    }
}

func TestDeleteEvent_NotFound(t *testing.T) {
    client, server := newTestClient(t, func(w http.ResponseWriter, r *http.Request) {
        // Return 404 (event doesn't exist)
        w.WriteHeader(http.StatusNotFound)
        w.Write([]byte(`{"error":{"code":404,"message":"Event not found"}}`))
    })
    defer server.Close()

    err := client.DeleteEvent(context.Background(), "nonexistent-id")
    if err == nil {
        t.Error("expected error for deleting nonexistent event")
    }
}
```

### 13.2 Integration Tests: Sync Hooks

Test that `ShowService` correctly calls the sync function after create/update/cancel:

```go
func TestShowService_Create_SyncsToGoogleCalendar(t *testing.T) {
    // Create a mock Google Calendar client that records calls
    mockGCal := &mockGCalClient{
        createdEvents: []string{},
    }

    // Create ShowService with the mock
    svc := NewShowService(mockShowRepo, mockAudit, mockDiscord)
    svc.gcalClient = mockGCal
    svc.settings = mockSettingsRepo  // returns confirmed settings

    // Create a confirmed show
    show := &domain.Show{
        Artist: "DJ Shadow",
        Status: domain.StatusConfirmed,
        Date:   time.Date(2026, 5, 15, 0, 0, 0, 0, time.UTC),
    }

    created, err := svc.Create(ctx, show, 1, "admin")
    if err != nil {
        t.Fatal(err)
    }

    // Wait for the goroutine to complete
    time.Sleep(100 * time.Millisecond)

    // Verify the Google Calendar client was called
    if len(mockGCal.createdEvents) != 1 {
        t.Errorf("expected 1 created event, got %d", len(mockGCal.createdEvents))
    }
}
```

### 13.3 Frontend Tests: External Events Hook

Test that the hook handles missing/failed external calendars gracefully:

```typescript
// Mock the fetch call
describe('useExternalEvents', () => {
  it('returns empty array when API returns error', async () => {
    // Mock a failed fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    
    const { result } = renderHook(() => useExternalEvents());
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
```

### 13.4 Manual Testing Checklist

**Push (Export) direction:**
- [ ] Create a confirmed show in the staff app → verify it appears on Google Calendar within seconds
- [ ] Update the show (change artist, date, time) → verify the Google Calendar event updates
- [ ] Cancel the show → verify the Google Calendar event is deleted
- [ ] Create a draft show → verify it does NOT appear on Google Calendar
- [ ] Disable Google Calendar integration → create a show → verify no error

**Pull (Import) direction:**
- [ ] Configure an external calendar in settings
- [ ] Visit the public shows page → verify external events appear in a separate section
- [ ] Verify external events have a distinct visual style (different color, source badge)
- [ ] Disable an external calendar → verify its events disappear
- [ ] Set an invalid calendar ID → verify the site doesn't crash (shows partial results)

---

## 14. Security Considerations

### 14.1 Service Account Credentials Protection

The credentials JSON file contains a **private key** that grants access to Google Calendar. If leaked:

- Anyone could read, modify, or delete events on the venue's calendar
- They could read events from any calendar shared with the service account

**Our protections:**
- Credentials are stored as a Kubernetes secret (never in the codebase)
- In development, the `.envrc` file is gitignored
- The credentials are only loaded server-side (never sent to the browser)

**What NOT to do:**
- ❌ Never commit the credentials JSON to git
- ❌ Never embed credentials in frontend code
- ❌ Never log the full credentials (only log the `client_email` for debugging)

### 14.2 Calendar ID Exposure

Google Calendar IDs are semi-public — they're email addresses or generated IDs. Knowing a calendar ID doesn't grant access (the calendar still needs to be shared). But we shouldn't expose them unnecessarily:

- External calendar IDs are returned by `GET /api/public/external-events` — this is fine, they're meant to be public
- The venue's own calendar ID could be exposed in the public settings if we want fans to "subscribe to our Google Calendar" — this is intentional

### 14.3 Rate Limiting for External Events Endpoint

The `GET /api/public/external-events` endpoint calls Google Calendar API on each request (unless cached). We should:

- Cache results for 5 minutes (reduces API calls dramatically)
- Apply standard rate limiting (same as other public endpoints)
- Not allow unbounded date ranges (cap at 90 days to prevent expensive queries)

### 14.4 Error Information Leakage

When Google Calendar API returns errors, we should NOT pass the full error message to the frontend:

- ❌ `"googleapi: Error 403: Calendar not found, forbidden"`
- ✅ `"Failed to fetch external events"` or just return an empty list

### 14.5 Webhook Security (Future Enhancement)

Google Calendar supports push notifications (webhooks) that notify us when events change. If we add this later:

- We need to verify the webhook channel ID
- We need to validate the `X-Goog-Resource-State` header
- The webhook URL must be HTTPS (which we already have in production)

***
## 15. Step-by-Step Implementation Checklist

### Phase 1: Infrastructure & Authentication

- [ ] 1.1 Create Google Cloud project and enable Calendar API
- [ ] 1.2 Create service account and download credentials JSON
- [ ] 1.3 Share the venue's Google Calendar with the service account email
- [ ] 1.4 Add `google.golang.org/api/calendar/v3` dependency
- [ ] 1.5 Create `pkg/gcal/client.go` with service account authentication
- [ ] 1.6 Test authentication works (call `calendarList.List()` to verify access)

### Phase 2: Database Migrations

- [ ] 2.1 Add migration: `google_cal_event_id` and `google_cal_synced_at` on `shows`
- [ ] 2.2 Add migration: `google_cal_enabled`, `google_cal_id`, `external_calendars` on `settings`
- [ ] 2.3 Update `pkg/domain/show.go` with new fields
- [ ] 2.4 Update `pkg/domain/settings.go` with new fields and `ExternalCalendar` type
- [ ] 2.5 Update sqlc queries (`pkg/db/shows.sql`, `pkg/db/settings.sql`)
- [ ] 2.6 Regenerate sqlc code (`make generate` or `sqlc generate`)

### Phase 3: Push — Export Shows to Google Calendar

- [ ] 3.1 Create `pkg/gcal/client.go` with `CreateEvent`, `UpdateEvent`, `DeleteEvent`
- [ ] 3.2 Create `pkg/gcal/show_to_event.go` with `ShowToEvent` conversion
- [ ] 3.3 Add `gcalClient` to `ShowService` (or as a standalone dependency)
- [ ] 3.4 Add `syncShowToGCal` method to `ShowService`
- [ ] 3.5 Hook into `ShowService.Create()` — sync confirmed shows
- [ ] 3.6 Hook into `ShowService.Update()` — sync updated shows
- [ ] 3.7 Hook into `ShowService.Cancel()` — delete cancelled shows
- [ ] 3.8 Add unit tests for `ShowToEvent` conversion
- [ ] 3.9 Add unit tests for sync hooks using mock client
- [ ] 3.10 Test manually: create show → verify Google Calendar event appears

### Phase 4: Pull — Import External Calendars

- [ ] 4.1 Add `ListExternalEvents` to `pkg/gcal/client.go`
- [ ] 4.2 Add `GET /api/public/external-events` route and handler
- [ ] 4.3 Implement in-memory caching for external events (5 min TTL)
- [ ] 4.4 Add config parsing for `external_calendars` JSON
- [ ] 4.5 Add unit tests for `ListExternalEvents` with fake server
- [ ] 4.6 Add integration test for the public endpoint
- [ ] 4.7 Test manually: configure external calendar → verify events appear

### Phase 5: Frontend

- [ ] 5.1 Add `useExternalEvents` hook to `pyxis-user-site/src/api/hooks.ts`
- [ ] 5.2 Create `ExternalEventCard` component in `pyxis-components`
- [ ] 5.3 Add external events section to `ShowsPage`
- [ ] 5.4 Add Storybook stories for `ExternalEventCard`
- [ ] 5.5 Style external events distinctly from Pyxis shows
- [ ] 5.6 Test responsive layout on mobile

### Phase 6: Staff UI (Optional Enhancement)

- [ ] 6.1 Add Google Calendar settings section in staff settings panel
- [ ] 6.2 Allow adding/removing external calendars from the UI
- [ ] 6.3 Show sync status (last synced, event ID) on show detail page
- [ ] 6.4 Add "Sync to Google Calendar" manual trigger button

### Phase 7: Deploy & Polish

- [ ] 7.1 Add Google Calendar credentials as Kubernetes secret
- [ ] 7.2 Set environment variables in production deployment
- [ ] 7.3 Deploy to staging and verify end-to-end
- [ ] 7.4 Monitor logs for sync errors
- [ ] 7.5 Update ticket changelog

---

## 16. Appendix: Google Calendar API Reference

### 16.1 Key Endpoints

**Base URL:** `https://www.googleapis.com/calendar/v3/`

**Create Event:**
```
POST /calendars/{calendarId}/events
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "summary": "Event Title",
  "description": "Event description",
  "location": "123 Main St",
  "start": {
    "dateTime": "2026-05-15T20:00:00-04:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2026-05-15T23:00:00-04:00",
    "timeZone": "America/New_York"
  },
  "source": {
    "title": "Pyxis",
    "url": "https://pyxis.example.com/shows/42"
  },
  "extendedProperties": {
    "private": {
      "pyxisShowId": "42"
    }
  }
}

Response: 200 OK with the created Event resource (includes generated "id" field)
```

**Update Event:**
```
PUT /calendars/{calendarId}/events/{eventId}
Content-Type: application/json
Authorization: Bearer {access_token}

(same body as Create, with updated fields)

Response: 200 OK with the updated Event resource
```

**Delete Event:**
```
DELETE /calendars/{calendarId}/events/{eventId}
Authorization: Bearer {access_token}

Response: 204 No Content
```

**List Events:**
```
GET /calendars/{calendarId}/events?timeMin=2026-05-01T00:00:00Z&timeMax=2026-05-31T23:59:59Z&singleEvents=true&orderBy=startTime
Authorization: Bearer {access_token}

Response: 200 OK
{
  "items": [
    { "id": "...", "summary": "...", "start": {...}, "end": {...}, ... }
  ],
  "nextPageToken": "..."  // if there are more results
}
```

### 16.2 Common Error Codes

| HTTP Status | Meaning | How We Handle It |
|-------------|---------|-----------------|
| 200 | Success | Return result |
| 201 | Created | Return new event ID |
| 204 | Deleted successfully | No action needed |
| 400 | Bad Request (invalid event data) | Log error, retry won't help |
| 401 | Unauthorized (bad credentials) | Log error, alert ops team |
| 403 | Forbidden (calendar not shared) | Log error, skip this calendar |
| 404 | Not Found (event/calendar doesn't exist) | For delete: treat as success (already gone) |
| 429 | Rate Limited | Back off and retry with exponential delay |
| 500 | Google server error | Retry once, then log and skip |

### 16.3 Quota and Limits

- **1,000,000 requests/day** per project
- Each event create/update/delete = 1 request
- Each events.list = 1 request (regardless of result count)
- For a single venue, this is essentially unlimited

---

## 17. Appendix: Service Account Setup Walkthrough

This is a step-by-step guide for whoever sets up the Google Cloud project (could be the venue owner, a tech-savvy staff member, or the developer).

### 17.1 Create a Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Sign in with the Google account that owns the venue's calendar
3. Click the project dropdown → **New Project**
4. Name it "Pyxis Calendar" → Click **Create**
5. Select the new project from the dropdown

### 17.2 Enable the Google Calendar API

1. In the left sidebar, go to **APIs & Services → Library**
2. Search for "Google Calendar API"
3. Click on it → Click **Enable**

### 17.3 Create a Service Account

1. Go to **IAM & Admin → Service Accounts**
2. Click **Create Service Account**
3. Step 1: Name it `pyxis-calendar-sync` → Click **Continue**
4. Step 2: Skip the roles (we don't need IAM roles, just calendar access) → Click **Continue**
5. Step 3: Skip granting user access → Click **Done**

### 17.4 Download the Credentials

1. Click on the service account you just created (`pyxis-calendar-sync`)
2. Go to the **Keys** tab
3. Click **Add Key → Create New Key**
4. Choose **JSON** → Click **Create**
5. A JSON file will download to your computer. **Keep this safe!** It's the private key.
6. The file looks like: `pyxis-calendar-123-abc.json`

### 17.5 Share the Venue's Calendar

1. Open https://calendar.google.com/
2. Find the venue's calendar in the left sidebar
3. Hover over it → Click the three dots → **Settings and sharing**
4. Scroll to **Share with specific people or groups**
5. Click **Add people and groups**
6. Paste the service account email from the JSON file:
   `pyxis-calendar-sync@pyxis-calendar-123.iam.gserviceaccount.com`
7. Set permissions to **Make changes to events** (so we can create/update/delete)
8. Click **Send** (Google may send a notification email — that's fine)

### 17.6 Get the Calendar ID

1. In the same Settings page, scroll down to **Integrate calendar**
2. Copy the **Calendar ID** (looks like an email address, e.g., `ppxis@gmail.com`)
3. This is the `GOOGLE_CAL_ID` you'll configure in Pyxis

### 17.7 For External Calendars (Import)

For each external calendar you want to import:

1. Ask the calendar owner to share the calendar with your service account email
2. They only need to give **See all event details** (read-only) permission
3. Get their Calendar ID (same way as step 17.6 above)
4. Add it to the `GOOGLE_CAL_EXTERNAL` configuration

### 17.8 Verify It Works

Test the credentials from the command line:

```bash
# Install gcloud CLI if not already installed
# https://cloud.google.com/sdk/docs/install

# Authenticate using the service account
gcloud auth activate-service-account \
  --key-file=pyxis-calendar-123-abc.json

# Test access to the calendar
curl -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "https://www.googleapis.com/calendar/v3/calendars/ppxis@gmail.com/events?maxResults=1"
```

If you see a JSON response with an `items` array, it works!

***

*End of document. Good luck, intern! You've got this. 🚀*
