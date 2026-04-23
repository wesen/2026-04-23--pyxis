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
      Note: API and DB schema already designed
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Backend Functionality Analysis

## Purpose

Analyze and document the backend architecture needed to support the pyxis web frontend, including API design, database schema, authentication flow, and Discord bot integration.

**Note:** This document assumes the Discord bot is a separate service (or can be implemented as a separate service). The web backend only needs to know how to trigger Discord actions via webhooks or API calls.

---

## 1. Architecture Overview

### 1.1 System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Web Frontend                                  │
│                   (React + RTK Query + Components)                   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Web Backend                                     │
│                 (Go + net/http or Node.js)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Auth API    │  │  Core API   │  │  Public API  │              │
│  │  (Discord)   │  │  (Shows,    │  │  (No auth    │              │
│  │              │  │  Artists,   │  │   required)  │              │
│  │              │  │  Bookings)  │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Database (PostgreSQL)                      │   │
│  │  users | shows | submissions | artists | attendance_logs     │   │
│  │  calendar_holds | calendar_blocked | audit_log | settings   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              ▼                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Discord Bot Service (Separate Process)            │   │
│  │  - Pins/unpins messages                                       │   │
│  │  - DMs users                                                 │   │
│  │  - Posts to channels                                         │   │
│  │  - Nightly auto-archive cron                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Deployment Model

| Component | Deployment | Notes |
|-----------|------------|-------|
| Web Frontend | Static hosting (Vercel, Netlify, Cloudflare Pages) | Build output only |
| Web Backend | Container (Docker) | Connects to DB + Redis + Discord |
| Database | Managed PostgreSQL | Supabase, Railway, Neon, etc. |
| Discord Bot | Separate process or serverless | Can be same binary as backend |

### 1.3 Technology Choices

| Layer | Option A | Option B | Recommendation |
|-------|----------|----------|----------------|
| Backend Language | Go | Node.js/TypeScript | **Go** — simpler deployment, better performance |
| HTTP Framework | `net/http` (Go 1.22+) | Echo/Gin | **`net/http` with ServeMux** — minimal deps |
| Database | PostgreSQL | SQLite | **PostgreSQL** — JSONB for metadata |
| ORM | sqlx | GORM | **sqlx** — lightweight, raw SQL friendly |
| Auth | Discord OAuth | Custom JWT | **Discord OAuth** — matches design |
| File Storage | S3/R2 | Local disk | **R2** (S3-compatible, no egress) |
| Session | In-memory + Redis | JWT | **JWT in httpOnly cookie** — stateless |

---

## 2. API Design

### 2.1 API Endpoints Summary

The `sql-api.md` already provides a comprehensive endpoint list. Here's the implementation priority:

#### Tier 1 — MVP (Day 1)
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/discord/callback` | POST | None | OAuth exchange |
| `/auth/me` | GET | Required | Current user |
| `/auth/logout` | POST | Required | Clear session |
| `/public/shows` | GET | None | Upcoming shows |
| `/public/shows/:id` | GET | None | Show detail |
| `/shows` | GET | Required | All shows |
| `/shows` | POST | Required | Create show |
| `/shows/:id` | PATCH | Required | Update show |
| `/settings` | GET | Required | Space settings |

#### Tier 2 — Core Workflow
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/shows/:id/cancel` | PATCH | Required | Cancel + Discord unpin |
| `/shows/:id/archive` | PATCH | Required | Archive + Discord unpin |
| `/shows/:id/announce` | POST | Required | Post to Discord |
| `/submissions` | GET | Required | Submissions queue |
| `/submissions` | POST | None | Public booking form |
| `/submissions/:id/approve` | PATCH | Required | Approve + create show |
| `/submissions/:id/decline` | PATCH | Required | Decline + DM |
| `/artists` | GET | Required | Artist directory |
| `/artists/:id` | PATCH | Required | Update notes |
| `/calendar` | GET | Required | Month view |
| `/calendar/holds` | POST/DELETE | Required | Manage holds |
| `/audit-log` | GET | Required | Activity log |

#### Tier 3 — Polish
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/artists/:id` | GET | Required | Artist detail |
| `/calendar/blocked` | POST/DELETE | Required | Block dates |
| `/attendance` | GET/POST/PATCH | Required | Post-show logs |
| `/shows/:id/flyer` | POST/DELETE | Required | Upload/delete flyer |
| `/settings` | PATCH | Required | Update settings |
| `/settings/discord/status` | GET | Required | Bot health |
| `/settings/discord` | DELETE | Required | Disconnect bot |
| `/settings/export` | GET | Required | CSV export |
| `/public/archive` | GET | None | Past shows |
| `/setup/status` | GET | None | Setup wizard status |
| `/setup` | POST | Required | Complete setup |

### 2.2 Request/Response Patterns

#### Standard Response Envelope
```typescript
// Success
{
  "data": T,        // The actual payload
  "meta": {          // Optional pagination
    "limit": number,
    "offset": number,
    "total": number
  }
}

// Error
{
  "error": {
    "code": "SHOW_NOT_FOUND",
    "message": "Show with ID 42 not found"
  }
}
```

#### Show Object
```typescript
interface Show {
  id: number;
  artist: string;
  date: string;              // YYYY-MM-DD
  doors_time: string;       // "8:00 PM"
  age: "21+" | "18+" | "All Ages";
  price: string;
  genre: string;
  notes: string | null;
  status: "confirmed" | "cancelled" | "archived";
  flyer_url: string | null;
  submission_id: number | null;
  artist_id: number | null;
  created_by: number | null;
  created_at: string;       // ISO 8601
  updated_at: string;
}
```

#### Submission Object
```typescript
interface Submission {
  id: number;
  artist_name: string;
  preferred_date: string | null;
  genre: string | null;
  expected_draw: number | null;
  links: string | null;
  tech_rider: string | null;
  message: string | null;
  status: "pending" | "approved" | "declined";
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}
```

### 2.3 Authentication Flow

```
1. User clicks "Continue with Discord"
2. Backend redirects to Discord OAuth:
   https://discord.com/api/oauth2/authorize
     ?client_id=XXX
     &redirect_uri=https://app.pyxis.xyz/auth/discord/callback
     &response_type=code
     &scope=identify+email

3. User authorizes in Discord
4. Discord redirects to /auth/discord/callback?code=XXX

5. Backend exchanges code for token:
   POST https://discord.com/api/oauth2/token
   { code, client_id, client_secret, redirect_uri }

6. Backend fetches user info:
   GET https://discord.com/api/users/@me
   Authorization: Bearer <access_token>

7. Backend creates/updates user in DB, generates JWT

8. Backend sets httpOnly cookie:
   Set-Cookie: session=<jwt>; HttpOnly; Secure; SameSite=Lax

9. Redirect to /dashboard
```

#### Role-Based Access
```typescript
enum Role {
  ADMIN = "admin",     // Full access
  BOOKER = "booker",   // Shows, submissions, artists, calendar
  STAFF = "staff"      // Read-only dashboard access
}

// Middleware example
function requireRole(roles: Role[]) {
  return (handler) => (w, r) => {
    const user = getUserFromRequest(r);
    if (!user || !roles.includes(user.role)) {
      return json(w, 403, { error: "Forbidden" });
    }
    return handler(w, r);
  };
}

// Usage
router.HandleFunc("POST /shows", requireRole([Role.ADMIN, Role.BOOKER], createShow));
```

---

## 3. Database Schema

The `sql-api.md` provides the complete schema. Key implementation notes:

### 3.1 Indexes for Performance

```sql
-- Shows
CREATE INDEX idx_shows_status_date ON shows(status, date);  -- Dashboard queries
CREATE INDEX idx_shows_date_desc ON shows(date DESC);       -- Public shows ordering

-- Submissions
CREATE INDEX idx_submissions_status_created ON submissions(status, created_at DESC);

-- Audit Log
CREATE INDEX idx_audit_log_actor_created ON audit_log(actor, created_at DESC);
```

### 3.2 Triggers

```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shows_updated_at BEFORE UPDATE ON shows
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER artists_updated_at BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER attendance_logs_updated_at BEFORE UPDATE ON attendance_logs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 3.3 Audit Log Helper

```sql
-- Procedure for consistent audit logging
CREATE OR REPLACE FUNCTION log_action(
  p_actor TEXT,
  p_actor_id INT,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id INT,
  p_metadata JSONB DEFAULT NULL
) RETURNS INT AS $$
  INSERT INTO audit_log (actor, actor_id, action, entity_type, entity_id, metadata)
  VALUES (p_actor, p_actor_id, p_action, p_entity_type, p_entity_id, p_metadata)
  RETURNING id;
$$ LANGUAGE plpgsql;
```

---

## 4. Discord Bot Integration

### 4.1 Communication Protocol

The backend should **not** run the Discord bot directly. Instead, use a message queue or direct API calls:

#### Option A: REST API (Simpler)
The Discord bot exposes HTTP endpoints that the backend calls:

```
Backend                          Discord Bot
    │                                  │
    ├── POST /bot/pin?channel=X&msg=Y ──► Bot pins message
    ├── DELETE /bot/unpin?channel=X&msg=Y ──► Bot unpins
    ├── POST /bot/dm?user=DISCORD_ID ──► Bot sends DM
    └── POST /bot/post?channel=X&embed=JSON ──► Bot posts embed
```

#### Option B: Message Queue (More Robust)
```
Backend                          Queue                          Discord Bot
    │                               │                                 │
    ├── publish("pin", {channel, msg}) ──► Queue ──► consume() ──► pin
    └── publish("dm", {user, content}) ──► Queue ──► consume() ──► dm
```

**Recommendation:** Option A for MVP, Option B if reliability is critical.

### 4.2 Bot Endpoints

```go
type BotService interface {
    // Post an embed to a channel and return the message ID
    PostEmbed(ctx context.Context, channelID string, embed *discordgo.MessageEmbed) (messageID string, err error)
    
    // Pin a message (by channel + message ID)
    PinMessage(ctx context.Context, channelID, messageID string) error
    
    // Unpin a message
    UnpinMessage(ctx context.Context, channelID, messageID string) error
    
    // Send a DM to a user
    SendDM(ctx context.Context, userDiscordID, content string) error
    
    // Get channel info
    GetChannel(ctx context.Context, channelID string) (*discordgo.Channel, error)
    
    // Health check
    Ping(ctx context.Context) error
}
```

### 4.3 Discord Message Templates

#### Show Announcement Embed
```go
var ShowAnnouncementEmbed = &discordgo.MessageEmbed{
    Title:       "🎵 {Artist}",
    Description: "{Description}",
    Color:       0xC8270D, // Crimson accent
    Fields: []*discordgo.MessageEmbedField{
        {Name: "📅 Date", Value: "{Date}", Inline: true},
        {Name: "🚪 Doors", Value: "{Doors}", Inline: true},
        {Name: "👤 Age", Value: "{Age}", Inline: true},
        {Name: "💰 Price", Value: "{Price}", Inline: true},
    },
    Footer: &discordgo.MessageEmbedFooter{
        Text: "Pyxis · 25 Manton Ave · Providence RI",
    },
    Timestamp: "{Date}T{Doors}:00Z",
}
```

#### Cancellation Notice
```go
var CancellationNotice = &discordgo.MessageEmbed{
    Title:       "❌ Cancelled: {Artist}",
    Description: "This show has been cancelled. Sorry for any inconvenience.",
    Color:       0x555048, // Muted
    Fields: []*discordgo.MessageEmbedField{
        {Name: "📅 Original Date", Value: "{Date}"},
    },
}
```

### 4.4 Nightly Cron Job

The Discord bot should run a daily cron at ~23:00:
```go
// Pseudo-code
func AutoArchivePastShows() {
    yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
    
    shows, _ := db.Query(`
        SELECT id, artist, discord_channel_id, discord_message_id
        FROM shows
        WHERE status = 'confirmed' AND date < $1
    `, yesterday)
    
    for show := range shows {
        // 1. Unpin from Discord
        bot.UnpinMessage(show.ChannelID, show.MessageID)
        
        // 2. Post archive notice to #staff
        bot.PostEmbed("staff", ArchiveNoticeEmbed(show))
        
        // 3. Update DB
        db.Exec("UPDATE shows SET status = 'archived' WHERE id = $1", show.ID)
        
        // 4. Log action
        log_action("bot", nil, "auto-archived show", "show", show.ID, nil)
    }
}
```

---

## 5. RTK Query Integration

### 5.1 API Slice Structure

```typescript
// features/shows/showsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const showsApi = createApi({
  reducerPath: 'showsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      // Auth handled by cookie, but explicit for clarity
      return headers;
    },
  }),
  tagTypes: ['Show', 'ShowList'],
  endpoints: (builder) => ({
    getShows: builder.query<Show[], { status?: ShowStatus }>({
      query: ({ status }) => status ? `/shows?status=${status}` : '/shows',
      providesTags: (result) => 
        result 
          ? [...result.map(({ id }) => ({ type: 'Show' as const, id })), 'ShowList']
          : ['ShowList'],
    }),
    getShow: builder.query<Show, number>({
      query: (id) => `/shows/${id}`,
      providesTags: (_, __, id) => [{ type: 'Show', id }],
    }),
    createShow: builder.mutation<Show, CreateShowInput>({
      query: (body) => ({ url: '/shows', method: 'POST', body }),
      invalidatesTags: ['ShowList'],
    }),
    updateShow: builder.mutation<Show, { id: number; patch: Partial<Show> }>({
      query: ({ id, patch }) => ({ url: `/shows/${id}`, method: 'PATCH', body: patch }),
      // Optimistic update
      onQueryStarted: async ({ id, patch }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          showsApi.util.updateQueryData('getShow', id, (draft) => {
            Object.assign(draft, patch);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Show', id }, 'ShowList'],
    }),
    cancelShow: builder.mutation<void, number>({
      query: (id) => ({ url: `/shows/${id}/cancel`, method: 'PATCH' }),
      // Optimistic
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          showsApi.util.updateQueryData('getShows', undefined, (draft) => {
            const show = draft.find(s => s.id === id);
            if (show) show.status = 'cancelled';
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['ShowList'],
    }),
    announceShow: builder.mutation<{ messageId: string }, number>({
      query: (id) => ({ url: `/shows/${id}/announce`, method: 'POST' }),
      invalidatesTags: (_, __, id) => [{ type: 'Show', id }],
    }),
  }),
});
```

### 5.2 Redux Store Setup

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { showsApi } from '../features/shows/showsApi';
import { submissionsApi } from '../features/submissions/submissionsApi';
import { artistsApi } from '../features/artists/artistsApi';
import { calendarApi } from '../features/calendar/calendarApi';
import { authApi } from '../features/auth/authApi';
import authSlice from '../features/auth/authSlice';
import uiSlice from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [showsApi.reducerPath]: showsApi.reducer,
    [submissionsApi.reducerPath]: submissionsApi.reducer,
    [artistsApi.reducerPath]: artistsApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(showsApi.middleware)
      .concat(submissionsApi.middleware)
      .concat(artistsApi.middleware)
      .concat(calendarApi.middleware)
      .concat(authApi.middleware),
});

setupListeners(store.dispatch);
```

---

## 6. File Upload (Flyers)

### 6.1 Upload Flow

```
1. User selects image in show editor
2. Client validates (type: jpg/png/webp, max: 5MB)
3. Client sends POST /shows/:id/flyer
   Content-Type: multipart/form-data
   Body: { file: <binary> }
4. Backend:
   - Validates file (type, size)
   - Generates unique filename: {showId}/{timestamp}.{ext}
   - Uploads to R2/S3
   - Updates show.flyer_url in DB
   - Logs audit entry
5. Client receives { flyer_url: "..." }
6. RTK Query invalidates show cache
```

### 6.2 Implementation

```go
// Handler
func uploadFlyer(w http.ResponseWriter, r *http.Request) {
    showID, _ := strconv.Atoi(mux.Vars(r)["id"])
    
    // Max 5MB
    r.ParseMultipartForm(5 << 20)
    file, header, err := r.FormFile("file")
    defer file.Close()
    if err != nil {
        jsonError(w, 400, "FILE_REQUIRED")
        return
    }
    
    // Validate type
    allowed := map[string]bool{"image/jpeg": true, "image/png": true, "image/webp": true}
    if !allowed[header.Header.Get("Content-Type")] {
        jsonError(w, 400, "INVALID_FILE_TYPE")
        return
    }
    
    // Generate key
    ext := filepath.Ext(header.Filename)
    key := fmt.Sprintf("flyers/%d/%d%s", showID, time.Now().Unix(), ext)
    
    // Upload to R2
    _, err = r2.PutObject(r.Context(), "pyxis-flyers", key, file, header.Size, nil)
    if err != nil {
        jsonError(w, 500, "UPLOAD_FAILED")
        return
    }
    
    url := fmt.Sprintf("https://flyers.pyxis.xyz/%s", key)
    
    // Update DB
    db.Exec("UPDATE shows SET flyer_url = $1 WHERE id = $2", url, showID)
    log_action(getUser(r).DiscordUsername, getUser(r).ID, "uploaded flyer", "show", showID, nil)
    
    json(w, 200, {"flyer_url": url})
}
```

---

## 7. Implementation Phases

### Phase 1: Foundation (1-2 days)
- [ ] Project scaffold (Go + SQLx + PostgreSQL)
- [ ] Database migrations
- [ ] Basic auth (Discord OAuth)
- [ ] Shows CRUD
- [ ] Settings read

### Phase 2: Core Workflow (2-3 days)
- [ ] Submissions (public form + queue)
- [ ] Approve/decline with Discord DM
- [ ] Show cancel/archive with Discord
- [ ] Calendar (shows + holds)
- [ ] Audit logging

### Phase 3: Polish (1-2 days)
- [ ] Artists directory
- [ ] Post-show logging
- [ ] Flyer uploads
- [ ] Settings write + Discord reconnect
- [ ] CSV export

### Phase 4: Public Site (1-2 days)
- [ ] Public API endpoints
- [ ] Archive endpoint
- [ ] Frontend integration

---

## 8. Error Handling

### 8.1 Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;      // Machine-readable: SHOW_NOT_FOUND
    message: string;   // Human-readable: "Show with ID 42 not found"
    details?: any;     // Optional: field errors, etc.
  }
}
```

### 8.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | No valid session |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `CONFLICT` | 409 | Date already booked, etc. |
| `DISCORD_ERROR` | 502 | Bot action failed |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### 8.3 Client-Side Handling

```typescript
// RTK Query error handling
const { error } = useCreateShowMutation();
if (error) {
  if ('data' in error) {
    const apiError = error.data as ErrorResponse;
    switch (apiError.error.code) {
      case 'DATE_ALREADY_BOOKED':
        setFieldError('date', 'This date already has a confirmed show');
        break;
      case 'UNAUTHORIZED':
        navigate('/login');
        break;
      default:
        toast.error(apiError.error.message);
    }
  }
}
```

---

## 9. Security Considerations

| Concern | Mitigation |
|---------|------------|
| CSRF | SameSite=Lax cookies + CSRF token for state-changing ops |
| XSS | React's built-in escaping + CSP headers |
| SQL Injection | Parameterized queries (sqlx) |
| File Upload | Type validation, size limits, sandboxed storage |
| Rate Limiting | Middleware limiting public endpoints |
| Bot Token | Never exposed to frontend, backend-only |
| Admin Actions | Require ADMIN role explicitly |

---

## 10. Monitoring & Observability

### 10.1 Logging

```go
// Structured logging
log.Info("show cancelled",
    "show_id", showID,
    "actor", user.DiscordUsername,
    "discord_unpin", "success",
)
```

### 10.2 Health Checks

```go
router.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
    // Check DB
    if err := db.Ping(); err != nil {
        json(w, 503, {"status": "unhealthy", "db": "down"})
        return
    }
    // Check Discord bot
    if err := bot.Ping(r.Context()); err != nil {
        json(w, 200, {"status": "degraded", "bot": "down"})
        return
    }
    json(w, 200, {"status": "healthy"})
})
```

### 10.3 Metrics (Optional)

- Request latency histograms
- Error rate counters
- Discord action success/failure
- Active users gauge

---

## 11. Testing Strategy

### Backend Tests
```go
// Table-driven tests
func TestShowsAPI(t *testing.T) {
    tests := []struct {
        name       string
        method     string
        path       string
        body       string
        auth       string
        wantStatus int
        wantBody   string
    }{
        {"create show as booker", "POST", "/shows", showJSON, bookerToken, 201, ""},
        {"create show as staff", "POST", "/shows", showJSON, staffToken, 403, ""},
        {"get shows unauthenticated", "GET", "/shows", "", "", 401, ""},
    }
    // ...
}
```

### Integration Tests
```go
func TestDiscordIntegration(t *testing.T) {
    // Create show
    show := createShow()
    
    // Announce
    resp := announceShow(show.ID)
    assertDiscordMessageSent(t, channelID, "Burial Hex")
    
    // Archive
    archiveShow(show.ID)
    assertDiscordMessageUnpinned(t, channelID, resp.MessageID)
}
```

---

## 12. Future Considerations (Out of Scope for MVP)

| Feature | Priority | Complexity |
|---------|----------|------------|
| Multi-venue support | Low | High |
| Ticket sales integration | Medium | High |
| Email newsletters | Medium | Medium |
| Payment splitting | Low | High |
| Analytics dashboard | Low | Medium |
| Mobile app | Low | High |
