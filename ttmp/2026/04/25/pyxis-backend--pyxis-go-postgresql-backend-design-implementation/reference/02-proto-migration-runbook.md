---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: pkg/server/app.go
      Note: Backend handlers — migrate ad-hoc JSON to protojson here
    - Path: proto/pyxis/v1/show.proto
      Note: Proto schema — add messages here
    - Path: web/packages/pyxis-app/src/api/appApi.ts
      Note: RTK Query slice — add fromJson transformResponse here
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---




# Proto-Everywhere Migration Runbook

## Before You Start

1. **Read the Diary skill** (`/home/manuel/.pi/agent/skills/diary/SKILL.md`). Every migration step must be recorded in the investigation diary.
2. **Read the Docmgr skill** (`/home/manuel/.pi/agent/skills/docmgr/SKILL.md`). Use `docmgr doc relate` to link changed files to the diary.
3. **Read the existing diary** (`reference/01-investigation-diary.md`) to understand what has been done and what remains.
4. **Read the task list** (`tasks.md`) — focus on Phase 12 unfinished items.

## Committing Rules

- **Commit after every endpoint migration** (backend handler + frontend RTK Query update = one commit).
- **Commit message format:** `Phase 12.2.N: Migrate <endpoint> to protojson`
- **Never commit broken code.** Run `go build ./...` before every commit.
- **Update the diary before the commit** so the commit hash appears in the diary entry.

## Codebase Layout (Relevant Files)

```
/home/manuel/code/wesen/2026-04-23--pyxis/
├── proto/pyxis/v1/show.proto          # ADD proto messages here
├── gen/proto/proto/pyxis/v1/          # Go generated code (auto)
├── web/packages/pyxis-types/src/generated/  # TS generated code (auto)
│
├── pkg/server/app.go                  # STAFF API handlers (migrate these)
├── pkg/server/public.go               # PUBLIC API handlers (most already done)
│
├── web/packages/pyxis-app/src/api/appApi.ts      # RTK Query staff slice
├── web/packages/pyxis-user-site/src/api/publicApi.ts  # RTK Query public slice
├── web/packages/pyxis-types/src/index.ts         # TS type exports
│
├── ttmp/2026/04/25/pyxis-backend--pyxis-go-postgresql-backend-design-implementation/
│   ├── tasks.md                        # Check off completed items
│   └── reference/01-investigation-diary.md  # WRITE progress here
```

## The Migration Recipe (One Endpoint at a Time)

Pick the **next unchecked task** from Phase 12 in `tasks.md`. Follow these steps in order.

### Step 1: Add the Proto Message (if missing)

Open `proto/pyxis/v1/show.proto`. Find or add the message that describes the response shape.

**Example:** If the endpoint returns a single `CalendarHold`:

```protobuf
message CalendarHold {
  int32  id    = 1;
  string date  = 2;
  string label = 3;
}
```

If it returns a list, also add a `*List` wrapper:

```protobuf
message CalendarHoldList {
  repeated CalendarHold holds = 1;
}
```

**Rule:** If the backend currently returns `map[string]interface{}`, there must be a proto message for it.

### Step 2: Regenerate Code

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
buf generate
go build ./...
```

Both must pass. If `buf generate` fails, fix the `.proto` syntax. If `go build` fails, fix the Go code.

### Step 3: Write the Domain→Proto Mapper (Go)

Open `pkg/server/public.go`. Add a helper function that converts a `domain.*` struct to a `pyxisv1.*` proto message.

**Pattern:**

```go
func artistToProto(artist *domain.Artist) *pyxisv1.Artist {
    return &pyxisv1.Artist{
        Id:        int32(artist.ID),
        Name:      artist.Name,
        Genre:     artist.Genre,
        Links:     artist.Links,
        Notes:     artist.Notes,
        CreatedAt: artist.CreatedAt.Format(time.RFC3339),
        UpdatedAt: artist.UpdatedAt.Format(time.RFC3339),
    }
}
```

Place the helper near the existing `showToProto` / `archivedShowToProto` functions.

### Step 4: Migrate the Backend Handler (Go)

Open `pkg/server/app.go`. Find the handler for your endpoint.

**Before (ad-hoc JSON — WRONG):**

```go
func (s *Server) handleListArtists(w http.ResponseWriter, r *http.Request) {
    // ... fetch data ...
    pbArtists := make([]map[string]interface{}, len(artists))
    for i, artist := range artists {
        pbArtists[i] = map[string]interface{}{
            "id":        artist.ID,
            "name":      artist.Name,
            // ...
        }
    }
    respondJSON(w, http.StatusOK, map[string]interface{}{
        "artists": pbArtists,
    })
}
```

**After (protojson — CORRECT):**

```go
func (s *Server) handleListArtists(w http.ResponseWriter, r *http.Request) {
    // ... fetch data ...
    pbArtists := make([]*pyxisv1.Artist, len(artists))
    for i, artist := range artists {
        pbArtists[i] = artistToProto(&artist)
    }
    respondProtoJSON(w, http.StatusOK, &pyxisv1.ArtistList{Artists: pbArtists})
}
```

**Key changes:**
- Replace `map[string]interface{}` with `*pyxisv1.*`
- Replace `respondJSON` with `respondProtoJSON`
- Use the mapper from Step 3

Run `go build ./...` after every handler change.

### Step 5: Verify the Generated TypeScript

Check that the TS generated file has the new message:

```bash
grep -n "export class Artist" web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts
grep -n "export class ArtistList" web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts
grep -n "export class ArtistSchema" web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts
```

You need both the class (`Artist`) and the schema (`ArtistSchema`) for `fromJson`.

### Step 6: Update the Frontend RTK Query Slice (TypeScript)

Open `web/packages/pyxis-app/src/api/appApi.ts` (for staff endpoints) or `web/packages/pyxis-user-site/src/api/publicApi.ts` (for public endpoints).

**Before (ad-hoc type or hand-written interface):**

```typescript
getArtists: builder.query<Artist[], void>({
    query: () => '/api/app/artists',
}),
```

**After (fromJson with generated proto type):**

```typescript
import { fromJson, ArtistList, ArtistListSchema } from 'pyxis-types';

getArtists: builder.query<Artist[], void>({
    query: () => '/api/app/artists',
    transformResponse: (response: unknown) => {
        const list = fromJson(ArtistListSchema, response as any);
        return list.artists;
    },
}),
```

**Pattern:**
1. Import `fromJson`, the message class, and the schema from `pyxis-types`.
2. Add `transformResponse` that calls `fromJson(Schema, response as any)`.
3. Extract the array or field you need.

### Step 7: Update Type Exports (if needed)

Open `web/packages/pyxis-types/src/index.ts`. If the endpoint's response type was previously hand-written, add an export alias:

```typescript
// During migration: keep both
export type { Artist as ProtoArtist } from './generated/proto/pyxis/v1/show_pb';
export { ArtistSchema as ProtoArtistSchema } from './generated/proto/pyxis/v1/show_pb';

// If components already use the hand-written `Artist` interface,
// keep it until components are migrated. Do NOT remove it yet.
```

### Step 8: Test End-to-End

1. Start the backend:
   ```bash
   docker compose up -d
   go run ./cmd/pyxis serve --bind :8282
   ```
2. Test the endpoint with curl:
   ```bash
   curl -s http://localhost:8282/api/app/artists | jq .
   ```
   Verify the JSON keys are **camelCase** (e.g., `createdAt`, not `created_at`).
3. Check the frontend compiles:
   ```bash
   cd web/packages/pyxis-app && pnpm build
   ```

### Step 9: Document and Commit

1. Write a diary entry in `reference/01-investigation-diary.md` following the diary skill format.
2. Run `docmgr doc relate` to link changed files.
3. Check off the task in `tasks.md`.
4. Commit:
   ```bash
   git add proto/pyxis/v1/show.proto pkg/server/app.go pkg/server/public.go \
           web/packages/pyxis-app/src/api/appApi.ts web/packages/pyxis-types/src/index.ts
   git commit -m "Phase 12.2.N: Migrate <endpoint> to protojson"
   ```

## Reference: Already-Migrated Handlers (Do Not Touch)

These already use `respondProtoJSON`. Use them as examples:

| Handler | Proto Message | File |
|---------|--------------|------|
| `handleListPublicShows` | `ShowList` | `pkg/server/public.go` |
| `handleGetPublicShow` | `Show` | `pkg/server/public.go` |
| `handleGetArchive` | `ArchivedShowList` | `pkg/server/public.go` |
| `handleGetArchiveStats` | `ArchiveStats` | `pkg/server/public.go` |
| `handleCreateSubmission` | `BookingConfirmation` | `pkg/server/public.go` |
| `handleListAppShows` | `ShowList` | `pkg/server/app.go` |
| `handleCreateShow` | `Show` | `pkg/server/app.go` |
| `handleUpdateShow` | `Show` | `pkg/server/app.go` |
| `handleListArtists` | `ArtistList` | `pkg/server/app.go` |
| `handleGetArtist` | `Artist` | `pkg/server/app.go` |
| `handleUpdateArtist` | `Artist` | `pkg/server/app.go` |

## Reference: Still Ad-Hoc (Migrate These Next)

Check `tasks.md` Phase 12.2 for the full list. The next highest-priority items are:

1. `handleListBookings` → `SubmissionList`
2. `handleListCalendar` → `CalendarResponse`
3. `handleCreateCalendarHold` → `CalendarHold`
4. `handleCreateCalendarBlocked` → `CalendarBlocked`
5. `handleListAttendance` → `AttendanceLogList`
6. `handleGetAttendance` → `AttendanceLog`
7. `handleUpsertAttendance` → `AttendanceLog`
8. `handleGetSettings` → `Settings`
9. `handleUpdateSettings` → `Settings`
10. `handleListAuditLog` → `AuditLogEntryList`

## Common Pitfalls

- **Forgetting to run `buf generate` after changing `.proto`.** The Go code will reference non-existent types.
- **Using `json.Marshal` instead of `protojson.Marshal`.** Proto messages have no `json` tags — `json.Marshal` emits snake_case keys. Always use `respondProtoJSON`.
- **Not adding a `*List` wrapper for list endpoints.** `fromJson` needs a schema for the root object. A bare array `[]` has no schema.
- **Removing hand-written types before components are migrated.** Keep dual exports in `pyxis-types` until the UI components are updated.
- **Forgetting `transformResponse`.** Without it, RTK Query caches the raw JSON object, not the typed proto message.

## If You Get Stuck

1. Re-read the existing migrated handlers in `pkg/server/app.go` — they are the living examples.
2. Check the generated Go code in `gen/proto/proto/pyxis/v1/show.pb.go` to see the exact field names.
3. Check the generated TypeScript in `web/packages/pyxis-types/src/generated/proto/pyxis/v1/show_pb.ts`.
4. Look at the `protobuf-go-ts-schema-exchange` skill: `/home/manuel/.pi/agent/skills/protobuf-go-ts-schema-exchange/SKILL.md`.
