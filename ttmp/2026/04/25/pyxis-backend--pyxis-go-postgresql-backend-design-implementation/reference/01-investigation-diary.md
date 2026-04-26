---
title: "Investigation Diary"
doc-type: reference
ticket: pyxis-backend
topics:
  - backend
  - go
  - postgresql
  - api-design
  - glazed
  - architecture
status: active
intent: long-term
---

# Diary

## Goal

Record the investigation and design process for the Pyxis Go + PostgreSQL backend, capturing what was discovered about the frontend API contracts, how the unified backend architecture was designed, and what decisions were made along the way.

---

## Step 1: Frontend API Discovery and Architecture Design

The user asked for a comprehensive design document for a new Go backend that serves both the public Pyxis site and the staff app. Before writing any backend code, we needed to understand exactly what the frontend expects. This meant reading every RTK Query slice, every type definition, and every mock handler in the web workspace.

We discovered that the frontend is split into two packages (`pyxis-user-site` and `pyxis-app`), each with its own API slice, but both drawing types from a shared `pyxis-types` package. The public API is entirely read-only except for booking submissions. The staff API is currently read-only in the frontend code, but the `prototype-design/sql-api.md` spec defines a full mutation surface. The backend must be designed for the full surface, not just what is wired today.

The database schema from `sql-api.md` is well-thought-out and was adopted with minor refinements (added `show_lineup` table for normalized lineup entries, clarified status values). The architecture follows clean layering: handlers -> services -> repositories -> sqlc/PostgreSQL. Glazed provides the CLI framework. Auth is Discord OAuth with stateful sessions.

### Prompt Context

**User prompt (verbatim):** "Create a new docmgr ticket to create the go + postgresql backend for the pyxis show app (backend which serves both the public page and app page). Keep a diary as you go always (see skill). Analyze the web rtk-query setup across both apps, and design a unified API + DB schema + go backend architecture (using the glazed command framework) and its routes and CLI tools to interact with it. cmd/ for cmds, pkg/ for the code. package name is github.com/go-go-golems/pyxis . Create a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet points and pseudocode and diagrams and api references and file references. It should be very clear and detailed. Store in the ticket and then upload to remarkable. You can write scripts and all kinds of other things in the scripts/ folder of the ticket. Don't write code yet, this is about making sure we have a clean foundation to start."

**Assistant interpretation:** Create a docmgr ticket with a detailed backend design document analyzing the existing frontend API contracts, proposing a Go/PostgreSQL backend architecture using Glazed, and providing a phased implementation plan. Also maintain a diary and upload to reMarkable.

**Inferred user intent:** Establish a solid architectural foundation before any implementation begins, so that a new intern (or any future developer) can understand the system end-to-end and start building confidently.

### What I did

- Created docmgr ticket `pyxis-backend` with topics: backend, go, postgresql, api-design, glazed, architecture.
- Added design document: `design-doc/01-unified-backend-architecture-api-design-guide.md`.
- Added diary document: `reference/01-investigation-diary.md`.
- Read and analyzed all frontend API files:
  - `web/packages/pyxis-user-site/src/api/publicApi.ts`
  - `web/packages/pyxis-user-site/src/api/endpoints.ts`
  - `web/packages/pyxis-user-site/src/api/types.ts`
  - `web/packages/pyxis-user-site/src/api/hooks.ts`
  - `web/packages/pyxis-app/src/api/appApi.ts`
  - `web/packages/pyxis-app/src/api/endpoints.ts`
  - `web/packages/pyxis-app/src/api/hooks.ts`
  - `web/packages/pyxis-app/src/api/mockData.ts`
  - `web/packages/pyxis-app/src/api/mockHandlers.ts`
  - `web/packages/pyxis-types/src/public.ts`
  - `web/packages/pyxis-types/src/app.ts`
  - `web/packages/pyxis-types/src/index.ts`
- Read reference documents: `prototype-design/sql-api.md`, `user-stories.md`.
- Wrote comprehensive design document (~49KB) covering:
  - Domain primer (what Pyxis is)
  - Current frontend architecture with evidence
  - Complete API surface mapping
  - Gap analysis
  - Proposed Go package layout (`cmd/`, `pkg/`)
  - Database schema with SQL DDL
  - Data access layer (sqlc + pgx)
  - Domain service layer with pseudocode
  - HTTP handler layer with router setup
  - Auth design (Discord OAuth + stateful sessions)
  - CLI tools design (Glazed commands)
  - Flyer storage abstraction
  - Discord integration design
  - 10-phase implementation plan
  - Testing strategy
  - Risks, alternatives, open questions
  - File references and quick-start cheat sheet

### Why

- The frontend already exists and has precise expectations. Backend design must be driven by those expectations, not invented independently.
- A single unified backend is simpler than two services, given the small team size and tight data relationships.
- Clean architecture (handler -> service -> repository) keeps code testable and lets us swap PostgreSQL for SQLite in tests.
- sqlc eliminates boilerplate and prevents runtime SQL errors.
- Glazed gives us professional CLI tooling for free.

### What worked

- Reading the RTK Query slices gave an exact endpoint inventory. No guesswork needed.
- The `prototype-design/sql-api.md` schema was almost perfect as-is. Minor additions (`show_lineup` table) were the only changes.
- docmgr ticket creation was smooth; the vocabulary already contained relevant topics.

### What didn't work

- No failures encountered during this design phase. All files were readable and well-structured.

### What I learned

- The frontend uses MSW (Mock Service Worker) for all API mocking. The mock handlers define the exact routes the backend must implement.
- The public site and staff app have *different* `Show` types. The public `Show` is richer (description, lineup, flyer_url). The staff `AppShow` is simpler (draw, capacity, pinned, notes). The backend needs to support both views from the same `shows` table.
- `pyxis-types` is the single source of truth for frontend types. The backend should mirror these shapes in Go structs.
- The staff app currently has no mutation endpoints wired in RTK Query, but the spec documents them extensively. The backend must implement the full spec even if the frontend only reads initially.

### What was tricky to build

- Deciding whether to use one binary or two. The user specified `cmd/` for commands, which implies multiple binaries. We chose `cmd/pyxis` (server) and `cmd/pyxis-cli` (tools), but noted they could be merged into one multi-command binary using Glazed subcommands.
- Mapping the six `show.status` values (`confirmed`, `cancelled`, `archived`, `draft`, `hold`, `blocked`) to the two frontend views. The public API only exposes three; the staff API exposes all six. We store all six in one column and filter in the repository layer.
- Designing the submission approval flow. It spans three tables (`submissions`, `artists`, `shows`) and must be atomic. A repository-level transaction wrapper is needed.

### What warrants a second pair of eyes

- The database schema refinements (especially `show_lineup` as a separate table) should be reviewed against the frontend `Show.lineup` type to ensure the join produces the right shape.
- The auth session design (stateful vs JWT) should be confirmed. We recommended stateful for revocation simplicity, but this adds a database round-trip to every authenticated request.
- The decision to serve both SPAs from the same Go process should be validated against deployment plans. If the frontend is deployed to a CDN, the backend only needs API routes.

### What should be done in the future

- Add OpenAPI/Swagger generation from Go handlers so frontend developers can generate types automatically instead of maintaining `pyxis-types` by hand.
- Consider adding a GraphQL layer later if the frontend grows complex nested queries (artist + shows + attendance in one request).
- Evaluate `pg_trgm` for archive search if `ILIKE` performance degrades with large archives.
- Add rate limiting on `POST /api/public/submissions` before public launch.

### Code review instructions

- Start with `prototype-design/sql-api.md` to understand the original schema.
- Read `web/packages/pyxis-types/src/public.ts` and `app.ts` to see the contract the backend must satisfy.
- Review the design document section 3 (Current Frontend Architecture) for accuracy against the actual frontend code.
- Check that every endpoint in `pyxis-app/src/api/endpoints.ts` and `pyxis-user-site/src/api/endpoints.ts` is accounted for in the proposed backend routes.

### Technical details

**Key commands run:**

```bash
docmgr status --summary-only
docmgr ticket create-ticket --ticket pyxis-backend --title "Pyxis Go + PostgreSQL Backend Design & Implementation" --topics backend,go,postgresql,api-design,glazed,architecture
docmgr doc add --ticket pyxis-backend --doc-type design-doc --title "Unified Backend Architecture & API Design Guide"
docmgr doc add --ticket pyxis-backend --doc-type reference --title "Investigation Diary"
```

**Key files analyzed:**

- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/publicApi.ts` — Public RTK Query slice
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts` — Staff RTK Query slice
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-types/src/public.ts` — Public TypeScript types
- `/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-types/src/app.ts` — Staff TypeScript types
- `/home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/sql-api.md` — Original SQL schema and API spec
- `/home/manuel/code/wesen/2026-04-23--pyxis/user-stories.md` — MVP implementation plan and user stories

---

## Step 2: Design Refinements — Skeleton Discord, Single Binary, Protobuf Payloads

After the initial design was complete, the user requested three specific refinements:

1. **Discord integration is skeleton-only.** No full bot implementation in the initial backend. We define a `discord.Client` interface and a `NoOpClient` implementation so services can call Discord methods without blocking, but the real bot is a parallel workstream.
2. **Single binary with subcommands.** Instead of `cmd/pyxis/` and `cmd/pyxis-cli/`, we use one `cmd/pyxis/main.go` entrypoint with `cmd/pyxis/cmds/*.go` subcommands (`serve`, `migrate`, `seed`, ...). Glazed makes this natural.
3. **Protobuf schemas for API payloads.** All JSON payloads are described in `.proto` files under `proto/pyxis/v1/`. We use `protojson.Marshal` in Go and `fromJson` in TypeScript. This gives us camelCase JSON automatically, a single source of truth for both languages, and forward compatibility.

These changes were applied to the design document. The protobuf section added significant detail: repository layout, example `show.proto`, `buf.yaml`/`buf.gen.yaml` configs, Go `protojson` emitter pattern, TypeScript `fromJson` decoder pattern, and the three-layer mapping flow (DB → domain → proto → JSON).

### Prompt Context

**User prompt (verbatim):** "1. no discord bot yet, or just the skeleton 2. cmd/pyxis/main.go and then cmd/pyxis/cmds/serve.go etc... 3. make camelCase for json fields in the API (unified) Use protobuf for describing the payloads (so we can share with typescript later on, see skill). Update document"

**Assistant interpretation:** Apply three refinements to the existing design: (1) Discord client is interface + no-op only, (2) single binary with subcommands in `cmd/pyxis/cmds/`, (3) define all API payloads in protobuf for camelCase JSON and future TypeScript sharing.

**Inferred user intent:** Keep the initial implementation scope tight (no Discord bot yet) while establishing the right structural patterns (single binary, protobuf schemas) that will scale as the project grows.

### What I did

- Updated section 5.2 (Package Layout): replaced dual-binary `cmd/pyxis/` + `cmd/pyxis-cli/` with single `cmd/pyxis/main.go` + `cmd/pyxis/cmds/*.go`.
- Updated explanatory text below the tree to reflect the single-binary decision.
- Updated section 14 (Discord Integration): renamed to "Discord Integration (Skeleton Only)", added `NoOpClient` implementation, explained the interface-as-boundary pattern.
- Inserted new section 7 (API Payload Schemas: Protobuf) between Database Schema and Data Access Layer, covering:
  - Why protobuf (single source of truth, camelCase JSON, type-safe codegen)
  - Proto repository layout (`proto/pyxis/v1/*.proto`)
  - Example `show.proto` with `Show`, `AppShow`, `ArchivedShow`, `ArchiveStats`, `BookingFormData`, `BookingConfirmation` messages
  - `buf.yaml` and `buf.gen.yaml` configuration
  - Go `protojson.Marshal` emitter pattern
  - TypeScript `fromJson` decoder pattern
  - Three-layer mapping: DB row → domain struct → proto message → camelCase JSON
  - Frontend migration plan (hand-written types → generated protobuf types)
- Renumbered all subsequent sections (8–19) and subsections to accommodate the new section 7.
- Updated section 19 (File References) to list `cmd/pyxis/cmds/*.go`, `proto/pyxis/v1/*.proto`, `buf.yaml`, and generated code paths.
- Ran `docmgr doctor --ticket pyxis-backend` — passed cleanly.

### Why

- A skeleton Discord client prevents scope creep while keeping the door open for full integration later. Services don't need to know whether Discord is real or no-op.
- One binary is simpler to deploy and reason about. Glazed subcommands give the same organizational clarity as separate binaries without the operational overhead.
- Protobuf + `protojson` solves the camelCase problem for free (`doors_time` → `doorsTime`) and establishes a canonical schema that both Go and TypeScript can consume. The frontend can migrate to generated types later without changing the JSON wire format.

### What worked

- The sed/Python renumbering script successfully fixed all section and subsection numbers after inserting the new protobuf section.
- The `protobuf-go-ts-schema-exchange` skill provided exact patterns for `buf.gen.yaml`, `protojson.Marshal`, and `fromJson`.

### What didn't work

- The first sed attempt to renumber sections corrupted subsection numbers (e.g., `3.11` instead of `3.1`). Required a Python script to fix properly.

### What I learned

- `protojson.Marshal` automatically converts snake_case proto fields to camelCase JSON, which is exactly what the frontend already expects.
- With `paths=source_relative`, generated Go code keeps the `proto/` prefix in import paths, so `go_package` must be aligned accordingly.
- The three-layer mapping (sqlc struct → domain struct → proto message) adds a small amount of boilerplate but provides clean separation: DB schema changes don't leak into the API contract, and API contract changes don't force DB migrations.

### What was tricky to build

- Deciding where to insert the protobuf section. It naturally sits between Database Schema (section 6) and Data Access Layer (now section 8) because it describes the API contract, which is orthogonal to both storage and query logic.
- Explaining the three-layer mapping without confusing interns. The key insight is that domain structs are the "glue" — they belong to neither the database nor the wire format.

### What warrants a second pair of eyes

- The `show.proto` example should be reviewed against the actual frontend `Show` and `AppShow` types to ensure every field is represented.
- The `buf.gen.yaml` output paths (`gen/proto` for Go, `web/src/pb` for TS) should be validated against the actual frontend workspace layout when implementation begins.

### What should be done in the future

- Run `buf generate` and verify the Go structs compile.
- Write a small integration test that round-trips a `Show` message through `protojson.Marshal` and `protojson.Unmarshal` to confirm field names and types.
- Once the frontend is ready, generate TypeScript bindings and replace `pyxis-types` with the generated package.

### Code review instructions

- Review the new section 7 (API Payload Schemas: Protobuf) for accuracy.
- Check that section 14 (Discord Integration) correctly scopes the work to skeleton-only.
- Verify the package tree in section 5.2 reflects the single-binary decision.

### Technical details

**Files modified:**

- `/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/pyxis-backend--pyxis-go-postgresql-backend-design-implementation/design-doc/01-unified-backend-architecture-api-design-guide.md`

**Key commands run:**

```bash
# Fix section numbering after inserting new section
python3 -c "
import re
with open('.../01-unified-backend-architecture-api-design-guide.md', 'r') as f:
    content = f.read()
lines = content.split('\n')
parent_num = 0
subsection_counter = 0
output = []
for line in lines:
    m = re.match(r'^(## )(\d+)\.(.+)\$', line)
    if m:
        parent_num = int(m.group(2))
        subsection_counter = 0
        output.append(line)
        continue
    sm = re.match(r'^(### )(\d+)\.(\d+)(.*)\$', line)
    if sm:
        subsection_counter += 1
        line = f'### {parent_num}.{subsection_counter}{sm.group(4)}'
    output.append(line)
with open('...', 'w') as f:
    f.write('\n'.join(output))
"

docmgr doctor --ticket pyxis-backend --stale-after 30
```

---

## Step 3: Implementation — Phases 0 & 1 (Scaffold, Database, Migrations)

After the design was finalized, we moved to implementation. The user asked us to work through tasks one by one, commit at appropriate intervals, use docker-compose for PostgreSQL, and keep a diary.

Phase 0 established the Go module, package skeleton, Glazed CLI entrypoint (`cmd/pyxis/main.go`), and subcommands (`serve`, `migrate`, `seed`). Phase 1 added the full database schema as golang-migrate SQL files, integrated `golang-migrate` as a library, added pgxpool connection management, and configured sqlc for type-safe query generation. We hit several practical issues during implementation that weren't visible during design.

### Prompt Context

**User prompt (verbatim):** "Add detailed tasks to the ticket, then work on them one by one, commit at appropriate intervals, use docker-compose to set up postgresql, keep a diary as you work"

**Assistant interpretation:** Create a granular task list in the ticket, then implement Phases 0 and 1 sequentially, committing after each phase, with PostgreSQL running in docker-compose, and recording progress in the diary.

**Inferred user intent:** Move from design to working code quickly, with clear checkpoints and persistence via commits and diary entries.

### What I did

- Added 10-phase task list to `tasks.md` with ~50 granular tasks.
- Initialized Go module `github.com/go-go-golems/pyxis`.
- Created `docker-compose.yml` with PostgreSQL 16 on port 5433 (5432 was in use).
- Added `Makefile` with `build`, `test`, `lint`, `migrate`, `seed`, `generate`, `dev`, `clean` targets.
- Created package skeleton: `pkg/server`, `pkg/domain`, `pkg/service`, `pkg/repository`, `pkg/db`, `pkg/cmdtools`, `pkg/discord`, `pkg/storage`, `pkg/config`, `internal/testutil`, `proto/pyxis/v1`, `fixtures`.
- Built `cmd/pyxis/main.go` following the Glazed root initialization pattern (logging, help system, command wiring).
- Implemented `cmd/pyxis/cmds/serve.go` and `cmd/pyxis/cmds/migrate.go` with Glazed commands.
- Added `pkg/config/config.go` and `pkg/server/server.go` (HTTP skeleton with health endpoint).
- Added `pkg/discord/client.go` with `Client` interface and `NoOpClient` implementation.
- Wrote complete SQL migration: `000001_init.up.sql` + `000001_init.down.sql` covering all 11 tables, indexes, triggers, and the single-row settings constraint.
- Added `pkg/db/pool.go` with `Connect()`, `MigrateUp()`, `MigrateDown()` using pgxpool + golang-migrate `iofs` source.
- Configured `sqlc.yaml` with `emit_json_tags: true`, `json_tags_case_style: camel`, `emit_interface: true`.
- Wrote first sqlc query file (`pkg/db/queries/shows.sql`) with 7 queries: `ListUpcomingShows`, `GetShow`, `GetShowWithLineup`, `CreateShow`, `UpdateShow`, `ArchiveShow`, `SearchArchive`, `GetArchiveStats`.
- Ran `sqlc generate` successfully after fixing ambiguous column references in queries.
- Verified generated code has camelCase JSON tags (`createdAt`, `updatedAt`, `showId`).
- Added `cmd/pyxis/cmds/seed.go` skeleton.
- Committed Phase 0 and Phase 1 separately.
- Updated `glazed-command-authoring` skill doc to document `cmds.WithArguments` and `fields.WithIsArgument`.

### Why

- docker-compose gives us reproducible local PostgreSQL without requiring system-level Postgres installation.
- sqlc eliminates handwritten `Scan` code and catches SQL errors at generation time.
- `golang-migrate` via `iofs` lets us embed migrations in the binary using `//go:embed` — no external migration files needed at runtime.
- CamelCase JSON tags from sqlc align with the protobuf camelCase strategy.

### What worked

- `pyxis migrate up` successfully created all 11 tables, indexes, and triggers.
- `pyxis migrate down` successfully rolled back all tables.
- `pyxis serve` starts and responds to `/health`.
- `go build ./cmd/pyxis` compiles cleanly.
- sqlc generated code compiles and has correct camelCase JSON tags.

### What didn't work

- **Port conflict:** PostgreSQL default port 5432 was already in use on the host. Changed docker-compose to expose 5433.
- **`cmds.WithArguments` missing from skill doc:** The Glazed skill didn't mention positional arguments. I updated the skill with a new subsection after investigating the glazed source code.
- **sqlc overwrote `pkg/db/db.go`:** sqlc's output directory was `pkg/db/` and it generated its own `db.go`, overwriting my custom connection/migration code. Fixed by renaming custom code to `pkg/db/pool.go`.
- **Ambiguous column references in sqlc:** `SELECT id FROM shows s LEFT JOIN attendance_logs al` failed because `id` was ambiguous. Had to qualify all columns with table aliases (`s.id`, `s.artist`, etc.).
- **`pgx.WithInstance` expects `*sql.DB`, not `*pgxpool.Pool`:** golang-migrate's pgx driver requires a `database/sql` connection. Added `sql.Open("pgx", connStr)` inside `MigrateUp/Down` while keeping `pgxpool.Pool` for application queries.

### What I learned

- sqlc generates into the configured `out` directory and will overwrite any existing `.go` files with matching names (like `db.go`). Name custom files differently (e.g., `pool.go`).
- `fields.WithIsArgument(true)` marks a field as a positional argument in Glazed, and `cmds.WithArguments(...)` registers them separately from flags. This gives natural CLI syntax like `pyxis migrate up`.
- `sqlc`'s `json_tags_case_style: camel` correctly converts `doors_time` → `doorsTime` in generated struct tags.

### What was tricky to build

- The sqlc `GetShowWithLineup` query uses `jsonb_agg` + `jsonb_build_object` to embed lineup entries as JSON. sqlc inferred the `lineup` column as `interface{}` because it couldn't determine the exact JSON shape. This is acceptable for now — we'll map it to the proto `LineupEntry` message in the service layer.
- Figuring out that `golang-migrate` with `iofs.New(Migrations, "migrations")` requires the subdirectory path to be `"migrations"` (matching the embed pattern `migrations/*.sql`), not `"."`.

### What warrants a second pair of eyes

- The `docker-compose.yml` uses port 5433. All default connection strings in config and commands point to `:5433`. If someone else runs this, they need to know about the port mapping.
- The `show_lineup` JSON aggregation in `GetShowWithLineup` returns `interface{}`. We should verify this works correctly when we wire the public API handler.

### What should be done in the future

- Add `golangci-lint` config and enable it in CI.
- Write proper integration tests for `MigrateUp/Down` using `testcontainers-go`.
- Add more sqlc queries for submissions, artists, calendar, attendance, audit log, and settings.

### Code review instructions

- Start with `pkg/db/migrations/000001_init.up.sql` to review the complete schema.
- Check `pkg/db/pool.go` for the pgxpool + golang-migrate integration.
- Review `cmd/pyxis/cmds/migrate.go` for the Glazed command with positional argument pattern.
- Check `pkg/db/models.go` and `pkg/db/shows.sql.go` for sqlc generated code quality.

### Technical details

**Key commands run:**

```bash
go mod init github.com/go-go-golems/pyxis
docker compose up -d
go get github.com/go-go-golems/glazed@latest
go get github.com/golang-migrate/migrate/v4/database/pgx/v5 github.com/golang-migrate/migrate/v4/source/iofs github.com/jackc/pgx/v5/pgxpool
go mod tidy
go build ./cmd/pyxis
go run ./cmd/pyxis migrate up
go run ./cmd/pyxis migrate down
sqlc generate
go build ./pkg/db
```

**Commits:**

- `0a7dec4` — Phase 0: Scaffold Go backend with Glazed CLI, docker-compose, package skeleton
- `a818249` — Phase 1: Database migrations, sqlc, pgxpool, migrate/seed commands

**Files created/modified:**

- `/home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/main.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/serve.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/migrate.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/seed.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/pool.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/migrations/000001_init.up.sql`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/migrations/000001_init.down.sql`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/shows.sql`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/models.go` (generated)
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/querier.go` (generated)
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/shows.sql.go` (generated)
- `/home/manuel/code/wesen/2026-04-23--pyxis/docker-compose.yml`
- `/home/manuel/code/wesen/2026-04-23--pyxis/Makefile`
- `/home/manuel/code/wesen/2026-04-23--pyxis/sqlc.yaml`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/config/config.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/discord/client.go`
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/cmdtools/root.go`

---

## Step 4: Implementation — Phases 2, 3, 4 (Public API, Submissions, Auth Skeleton)

Continued implementation through the evening. Phase 2 added protobuf schemas, domain models, the show repository/service, and public API read endpoints (`GET /api/public/shows`, `GET /api/public/shows/{id}`, `GET /api/public/archive`, `GET /api/public/archive/stats`). Phase 3 added the submission write endpoint (`POST /api/public/submissions`) with validation. Phase 4 added the Discord OAuth skeleton, session management, and auth middleware.

### What I did

- **Phase 2:**
  - Created `proto/pyxis/v1/show.proto` with `Show`, `AppShow`, `ArchivedShow`, `ArchiveStats`, `BookingFormData`, `BookingConfirmation`, `ShowList`, `ArchivedShowList`, `Submission`, `User`, `AuthSession` messages.
  - Configured `buf.yaml` and `buf.gen.yaml` with `local: protoc-gen-go` plugin.
  - Ran `buf generate` — output goes to `gen/proto/proto/pyxis/v1/` (double `proto` due to `paths=source_relative`).
  - Defined domain structs: `pkg/domain/show.go` (`Show`, `LineupEntry`, `ArchivedShow`, `ArchiveStats`), `pkg/domain/submission.go`.
  - Implemented `pkg/repository/repository.go` with `ShowRepository` and `SubmissionRepository` interfaces.
  - Implemented `pkg/repository/postgres/show_repo.go` with `ListUpcoming`, `GetByID`, `SearchArchive`, `GetArchiveStats`.
  - Implemented `pkg/service/show_service.go` with read-only methods.
  - Created `pkg/server/public.go` with public HTTP handlers using `protojson.Marshal` for camelCase JSON responses.
  - Updated `pkg/server/server.go` to wire repositories, services, and routes.
  - Created `fixtures/dev.sql` with seed data for shows, lineup, and attendance logs.
  - Verified endpoints via curl: upcoming shows return camelCase (`doorsTime`, `createdAt`), archive and stats work.
  - Committed as `7e7fdb4`.

- **Phase 3:**
  - Added `Submission` message to `show.proto` and regenerated.
  - Created `pkg/db/queries/submissions.sql` with `CreateSubmission`.
  - Implemented `pkg/repository/postgres/submission_repo.go` mapping domain → sqlc params using `pgtype.Text/Int4/Date`.
  - Implemented `pkg/service/submission_service.go` with validation (artist name and links required).
  - Added `handleCreateSubmission` to `pkg/server/public.go` using `protojson.Unmarshal` to parse request body.
  - Verified via curl: `POST /api/public/submissions` returns `{"success":true,"submissionId":1}`.
  - Committed as `c6dfad2`.

- **Phase 4:**
  - Added `User` and `AuthSession` messages to `show.proto` and regenerated.
  - Created `pkg/db/queries/auth.sql` with `UpsertUser`, `GetUser`, `CreateSession`, `GetSession`, `DeleteSession`.
  - Implemented `pkg/service/auth_service.go` with Discord OAuth2 flow (`golang.org/x/oauth2`), user upsert, and session creation.
  - Created `pkg/server/auth.go` with `handleDiscordCallback`, `handleGetMe`, `handleLogout`, `handleGetSession`, `requireAuth` middleware, and `dbUserToProto` helper.
  - Updated `pkg/config/config.go` to add `DiscordClientID`, `DiscordClientSecret`, `DiscordRedirectURL` fields.
  - Updated `pkg/server/server.go` to wire auth service and routes.
  - Committed as `be09733`.

- **Skill update:** Added `cmds.WithArguments` / `fields.WithIsArgument` documentation to `glazed-command-authoring` skill.

### What worked

- `protojson.Marshal` correctly emits camelCase JSON (`doorsTime`, `submissionId`, `createdAt`).
- `protojson.Unmarshal` correctly parses camelCase JSON into proto structs.
- Public API endpoints all return correct data shapes matching the frontend expectations.
- The `requireAuth` middleware pattern works with `context.WithValue`.

### What didn't work

- **sqlc `pgtype` types:** Initially tried to assign `pgtype.Text` fields directly to `string` vars in the repo. Fixed by using `.String` accessor.
- **`interface{}` from `COALESCE(SUM(...), 0)`:** sqlc inferred `totalAttendance` as `interface{}` in `GetArchiveStats`. Added type switch in repo.
- **protojson vs json:** Initially used `json.NewDecoder` on proto structs which has no effect because proto structs don't have `json` tags. Fixed by using `protojson.Unmarshal`.
- **Port conflicts in testing:** Multiple test servers left running on :18080 and :18081. Need to use random ports or clean up better in tests.

### What I learned

- sqlc nullable columns become `pgtype.Text/Int4/Date` in generated structs. Always check `.Valid` before using `.String`/`.Int32`/`.Time`.
- `protojson` is the correct way to serialize/deserialize proto messages to JSON — it respects the proto field names and converts to camelCase automatically.
- `buf generate` with `paths=source_relative` preserves the `proto/` prefix from source paths, resulting in `gen/proto/proto/pyxis/v1/`. This is expected but looks odd.

### What warrants a second pair of eyes

- The `show.proto` file is growing — should we split it into `show.proto`, `submission.proto`, `user.proto`?
- `AuthSession.space_name` is hardcoded to `"Pyxis"` in the handler. Should come from `settings` table eventually.
- Discord OAuth config is currently empty strings in `DefaultConfig()`. Needs env vars or flags.

### What should be done in the future

- Phase 5: Staff API show mutations (create, update, cancel, archive) + audit logging.
- Phase 6: Submission approval/decline + artist auto-creation.
- Phase 7-10: Calendar, attendance, settings, flyers, CLI polish.
- Add proper error types (`ErrNotFound`, `ErrInvalidInput`, etc.) instead of `fmt.Errorf`.

---

## Step 5: Handoff Note — Where to Pick Up Tomorrow

**Context:** Read the `diary` skill first (`/home/manuel/.pi/agent/skills/diary/SKILL.md`) to follow the exact format for new entries. This diary is at `ttmp/2026/04/25/pyxis-backend--pyxis-go-postgresql-backend-design-implementation/reference/01-investigation-diary.md`.

**Current state:**
- Phases 0-4 are complete and committed.
- Phase 5 is **in progress** — I started adding `ListAll` to `ShowRepo`, added `AuditLogEntry` domain type, created `pkg/db/queries/audit.sql`, and regenerated sqlc. The show repo now has `Create`, `Update`, `Archive` methods but they are **not yet wired to HTTP handlers**.
- The staff API routes in `pkg/server/server.go` are mostly empty (only `GET /api/app/session` exists).

**What to do next:**

1. **Finish Phase 5 (Staff API — Shows CRUD):**
   - Wire `POST /api/app/shows`, `PATCH /api/app/shows/{id}`, `PATCH /api/app/shows/{id}/cancel`, `PATCH /api/app/shows/{id}/archive` in `pkg/server/app.go` (create this file for staff handlers).
   - Add audit logging to every mutation via `AuditService`.
   - Add role checks (Admin/Booker only for mutations).
   - Test with curl.
   - Commit.

2. **Phase 6 (Submissions + Artists):**
   - Add `GET /api/app/bookings`, `PATCH /api/app/bookings/{id}/approve`, `PATCH /api/app/bookings/{id}/decline`.
   - Implement artist creation on approval (transaction across `submissions`, `artists`, `shows`).
   - Add `GET /api/app/artists`, `GET /api/app/artists/{id}`, `PATCH /api/app/artists/{id}`.
   - Commit.

3. **Phases 7-10:** Continue down the task list in `tasks.md`.

**Key files to look at first tomorrow:**

- `pkg/server/server.go` — see how routes are wired, add staff routes there.
- `pkg/repository/postgres/show_repo.go` — mutations are already implemented, just need HTTP handlers.
- `pkg/service/show_service.go` — needs `Create`, `Update`, `Cancel`, `Archive` methods.
- `pkg/domain/audit.go` — audit log domain type is defined but not used yet.
- `pkg/db/queries/audit.sql` — audit log queries exist but no repo/service uses them yet.

**Running the server locally:**

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
docker compose up -d          # PostgreSQL on port 5433
go run ./cmd/pyxis migrate up # apply migrations
go run ./cmd/pyxis serve      # server on :8080
```

**Commits so far:**
- `0a7dec4` — Phase 0: Scaffold
- `a818249` — Phase 1: Database & Migrations
- `7e7fdb4` — Phase 2: Public API Read-Only
- `c6dfad2` — Phase 3: Public API Write (Submissions)
- `be09733` — Phase 4: Auth + Session
- `0123fec` — Phase 5 start: show mutations in repo, audit queries, domain types
- `9f54adc` — Phase 5: Staff API show CRUD + audit logging + role middleware

**Open questions from today:**
- Should `show.proto` be split into multiple proto files?
- Discord OAuth will be replaced with Keycloak/OAuth — how does this affect the session and user models?
- Should we use `testcontainers-go` for integration tests?

---

## Step 6: Implementation — Phase 5 (Staff API Shows CRUD + Audit Logging)

Picked up where yesterday left off. Phase 5 was partially complete — the repository mutations (`Create`, `Update`, `Archive`, `ListAll`) existed but were not wired to HTTP handlers. The task was to add service-layer mutations, audit logging, role-based middleware, and staff HTTP handlers.

### Prompt Context

**User prompt (verbatim):** "we'll do auth through keycloak / oauth"

**Assistant interpretation:** The user is providing architectural direction for auth — Keycloak/OAuth will replace the Discord OAuth skeleton. This is a future refactor, not an immediate change.

**Inferred user intent:** Keep the current auth skeleton functional but note that it will be replaced with a proper OAuth2/Keycloak integration later.

**Commit (code):** `9f54adc` — "Phase 5: Staff API show CRUD + audit logging + role middleware"

### What I did

- Fixed `show_repo.go` build errors: `ListUpcoming` now uses `upcomingRowToShow` helper for `ListUpcomingShowsRow` type; `ListAll` dereferences the pointer from `rowToShow`.
- Committed yesterday's uncommitted Phase 5 start work as `0123fec`.
- Created `pkg/repository/postgres/audit_repo.go` implementing `AuditLogRepository` with JSON metadata serialization.
- Created `pkg/service/audit_service.go` with `AuditService` interface and `Log` method.
- Updated `pkg/service/show_service.go` to add `Create`, `Update`, `Cancel`, `Archive`, `ListAll` methods — each logs to audit on success.
- Created `pkg/server/app.go` with staff handlers: `handleListAppShows`, `handleCreateShow`, `handleUpdateShow`, `handleCancelShow`, `handleArchiveShow`.
- Added `requireRole` middleware in `app.go` for role-based access control (`admin`, `booker`, `door`).
- Updated `pkg/server/server.go` to wire audit service, update `ShowService` constructor, and register staff routes with auth + role middleware.
- Fixed `respondError` in `public.go` to return 401 for "unauthenticated" and 403 for "forbidden".
- Created test user (`Test Booker`, role `booker`) and session in PostgreSQL for manual endpoint testing.
- Tested all staff endpoints via curl on port 8282:
  - `GET /api/app/shows` — returns all shows (auth required)
  - `POST /api/app/shows` — creates show, returns 201
  - `PATCH /api/app/shows/{id}` — updates show, returns 200
  - `PATCH /api/app/shows/{id}/cancel` — cancels show (sets status `cancelled`), returns 200
  - `PATCH /api/app/shows/{id}/archive` — archives show, returns 200 with `{"success":true}`
- Updated `tasks.md` to mark Phase 5 tasks complete.
- Updated changelog via docmgr.

### Why

- Staff mutations need audit trails for accountability (who created/cancelled/archived what show and when).
- Role-based access control prevents unauthorized mutations (e.g., `door` staff can view but not modify shows).
- The `ShowService` now owns both read and write operations, keeping handlers thin.

### What worked

- All staff endpoints tested successfully with curl and session cookie.
- `requireAuth` + `requireRole` middleware chaining works correctly with Go 1.22 `http.ServeMux`.
- Audit logging fires on every mutation without blocking the response (errors are silently ignored with `_ = s.audit.Log(...)`).

### What didn't work

- **Build failures after Phase 5 start commit:** `rowToShow` returned `*domain.Show` but `ListUpcoming`/`ListAll` assigned to `domain.Show` values. Also `ListUpcomingShowsRow` is a different type than `db.Show`. Fixed by creating `upcomingRowToShow` and dereferencing pointers.
- **Port conflicts:** 8080 and 8081 were in use by frontend dev servers. Used 8282 for testing.
- **Accidental commit of 3857 prototype files:** `git add -A` staged visual comparison artifacts from `prototype-design/-deprecated/`. Had to `git reset --soft` and redo the commit with selective staging.
- **Show ID extraction in bash test script failed:** `grep -o '"id":[0-9]*'` didn't extract properly when curl body and HTTP code were on separate lines. Tested with hardcoded ID instead.

### What I learned

- `sqlc` generates different row types for queries that select different column subsets (`ListUpcomingShowsRow` vs `Show`). Each needs its own mapping helper.
- Go 1.22 `http.ServeMux` method patterns (`GET /path`) work with `mux.Handle` but not `mux.HandleFunc` when wrapping with middleware that returns `http.Handler`.
- Always use selective `git add` in repos with large untracked artifact directories.

### What was tricky to build

- The `requireAuth` + `requireRole` middleware chaining: `s.requireAuth(s.requireRole("admin", "booker")(http.HandlerFunc(handler)))`. The order matters — auth must run before role check, but both return `http.Handler`, so they compose naturally.
- Deciding whether to make audit logging blocking or fire-and-forget. Chose fire-and-forget (ignore error) to avoid failing user requests due to audit log issues, but this means audit gaps are silent.

### What warrants a second pair of eyes

- The `Archive` mutation doesn't check if the show is already archived or cancelled — it just runs `UPDATE ... SET status = 'archived'`. Should we guard against archiving an already-archived show?
- `handleArchiveShow` returns raw JSON `{"success":true}` instead of a proto message. Inconsistent with other endpoints but acceptable for simple success responses.
- Role values are hardcoded strings (`"admin"`, `"booker"`, `"door"`). Should be constants or enums.

### What should be done in the future

- Phase 6: Submissions + Artists (approval/decline flow with transactions).
- Phase 7-10: Calendar, attendance, settings, flyers, CLI polish.
- Refactor auth to Keycloak/OAuth as directed by user.
- Add proper error types (`ErrInvalidInput`, `ErrUnauthorized`) instead of string matching in `respondError`.
- Consider making audit logging async or queued to avoid any latency impact.

### Code review instructions

- Start with `pkg/server/app.go` for the staff handler patterns and role middleware.
- Review `pkg/service/show_service.go` for audit integration in mutations.
- Check `pkg/server/server.go` for route wiring and middleware chaining.
- Validate by running the server and testing with curl (see Technical details).

### Technical details

**Key commands run:**

```bash
# Fix build errors
go build ./...

# Commit Phase 5 start work
git add pkg/db/querier.go pkg/db/queries/shows.sql pkg/db/shows.sql.go pkg/domain/show.go pkg/repository/postgres/show_repo.go pkg/repository/repository.go pkg/db/audit.sql.go pkg/db/queries/audit.sql pkg/domain/audit.go
git commit -m "Phase 5 start: show mutations in repo, audit queries, domain types"

# Test endpoints
go run ./cmd/pyxis serve --bind :8282
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/shows
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X POST http://localhost:8282/api/app/shows -d '{"artist":"Test","date":"2026-07-01","status":"draft"}'
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X PATCH http://localhost:8282/api/app/shows/14 -d '{"artist":"Updated"}'
curl -s -H "Cookie: session=test-session-abc" -X PATCH http://localhost:8282/api/app/shows/14/cancel
curl -s -H "Cookie: session=test-session-abc" -X PATCH http://localhost:8282/api/app/shows/14/archive
```

**Test user/session setup:**

```sql
INSERT INTO users (discord_id, discord_username, role, created_at, last_login_at)
VALUES ('test123', 'Test Booker', 'booker', NOW(), NOW())
ON CONFLICT (discord_id) DO UPDATE SET role = 'booker', last_login_at = NOW();

INSERT INTO sessions (id, user_id, expires_at, created_at)
VALUES ('test-session-abc', (SELECT id FROM users WHERE discord_id = 'test123'), NOW() + INTERVAL '7 days', NOW())
ON CONFLICT (id) DO UPDATE SET expires_at = NOW() + INTERVAL '7 days';
```

**Files created/modified:**

- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go` — Staff handlers + role middleware
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go` — Route wiring
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go` — Error status codes
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/show_service.go` — Mutation methods + audit
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/audit_service.go` — Audit service
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/postgres/audit_repo.go` — Audit repo
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/postgres/show_repo.go` — Build fixes

---

## Step 7: Implementation — Phase 6 (Staff API Submissions + Artists)

Phase 6 implements the booking approval/decline flow and artist management. When a submission is approved, the system creates a new artist (or links an existing one by name) and creates a draft show from the submission data — all in a single database transaction.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the Pyxis backend through the remaining phases. Phase 6 is next: submissions + artists.

**Inferred user intent:** Build out the staff-side booking management and artist catalog.

**Commit (code):** `9bdffc8` — "Phase 6: Staff API submissions + artists — approval/decline flow with transactions"

### What I did

- Added `ApproveSubmission`, `DeclineSubmission` queries to `pkg/db/queries/submissions.sql`.
- Created `pkg/db/queries/artists.sql` with `ListArtists`, `GetArtist`, `GetArtistByName`, `CreateArtist`, `UpdateArtist`.
- Regenerated sqlc code.
- Created `pkg/domain/artist.go` with `Artist` domain struct.
- Updated `pkg/repository/repository.go` with `ArtistRepository` interface and expanded `SubmissionRepository`.
- Created `pkg/repository/postgres/artist_repo.go` implementing all artist operations.
- Updated `pkg/repository/postgres/submission_repo.go` with `GetByID`, `List`, `Approve`, `Decline` methods.
- Created `pkg/service/artist_service.go` for artist business logic.
- Updated `pkg/service/submission_service.go` with:
  - `List` and `GetByID` methods
  - `Approve` method with transaction across submissions → artists → shows
  - `Decline` method with audit logging
  - Pool dependency for transaction management
- Created staff handlers in `pkg/server/app.go`:
  - `handleListBookings` (`GET /api/app/bookings?status=`)
  - `handleApproveBooking` (`PATCH /api/app/bookings/{id}/approve`)
  - `handleDeclineBooking` (`PATCH /api/app/bookings/{id}/decline`)
  - `handleListArtists` (`GET /api/app/artists`)
  - `handleGetArtist` (`GET /api/app/artists/{id}`)
  - `handleUpdateArtist` (`PATCH /api/app/artists/{id}`)
- Added `respondJSON` helper in `pkg/server/public.go` for non-proto responses.
- Fixed `respondError` to return 404 for "no rows in result set" (pgx not-found).
- Fixed `ListSubmissions` query: `COALESCE($1, status)` didn't work with empty string; changed to `($1 = '' OR status = $1)`.
- Wired all routes in `pkg/server/server.go` with auth + role middleware.
- Tested all endpoints:
  - List all bookings ✓
  - List pending bookings ✓
  - Approve booking → creates artist + draft show ✓
  - Decline booking ✓
  - List artists ✓
  - Get artist by ID (404 for missing) ✓
  - Update artist ✓

### Why

- The approval flow spans three tables (submissions, artists, shows) and must be atomic — a partial approval would leave the database in an inconsistent state.
- Artist deduplication by name prevents creating duplicate artists when the same group submits multiple times.
- Draft shows from approved submissions give bookers a starting point they can refine before confirming.

### What worked

- The transaction pattern using `pgxpool.Pool.Begin()` + `db.New(tx)` + per-tx repos works cleanly.
- Artist auto-creation on approval: `GetArtistByName` first, then `CreateArtist` if not found.
- The `respondJSON` helper handles non-proto responses without forcing everything into protobuf.

### What didn't work

- **`ListSubmissions` COALESCE bug:** `SELECT * WHERE status = COALESCE($1, status)` with `$1 = ''` evaluated to `status = ''`, which matches nothing. Fixed by using `($1 = '' OR status = $1)`.
- **Approval failed with null date:** The test submission had no `preferred_date`, and `shows.date` is `NOT NULL`. Added a guard in `Approve` that returns an error if no preferred date is set.
- **Stale server process:** A previous `pyxis serve` was still running on port 8282, causing the new server to fail with "address already in use". Responses came from the old process with old code. Killed stale processes with `pkill`.
- **Build error in `artist_repo.go`:** `dbArtistToDomain` returns `*domain.Artist` but `List` assigned to `domain.Artist` values. Fixed by dereferencing.

### What I learned

- `sqlc` `COALESCE($1, status)` is not the right pattern for optional filters — it evaluates the parameter first, and if the parameter is empty string, it compares against empty string, not "skip the filter". Use `($1 = '' OR status = $1)` instead.
- `pgx.Tx` implements `DBTX` so `db.New(tx)` creates transaction-scoped queries. This is the key to repository-level transactions with sqlc.
- `protojson.Marshal` only works with `proto.Message`; for ad-hoc JSON responses (like artist lists without a protobuf message), use `json.Marshal` directly.

### What was tricky to build

- Structuring the transaction in `SubmissionService.Approve`: the service holds separate repos, but for the transaction it needs tx-scoped versions. The solution was to start a tx, create new `db.New(tx)` queries, and instantiate new repos from those queries. This is slightly verbose but keeps the transaction logic in one place.
- Deciding where to handle the "artist already exists" case. Chose to check by name in the service during approval, rather than adding a uniqueness constraint or upsert. This allows intentional duplicates (e.g., two different bands with the same name) while preventing accidental ones.

### What warrants a second pair of eyes

- The `Approve` transaction commits before audit logging. If audit logging fails, the transaction is already committed. This is acceptable for now (audit is best-effort) but should be documented.
- Artist deduplication is by exact name match. This could cause issues with slight variations ("The Band" vs "The band"). Consider case-insensitive matching or fuzzy matching.
- The `SubmissionList` and artist list responses are not protobuf messages — they use `respondJSON` with `map[string]interface{}`. For consistency, these should eventually have protobuf message types.

### What should be done in the future

- Phase 7-10: Calendar, attendance, settings, flyers, CLI polish.
- Add protobuf messages for `SubmissionList`, `ArtistList`, `Artist`.
- Consider adding `DELETE /api/app/artists/{id}` if artists need to be removable.
- Add pagination to `ListSubmissions` and `ListArtists`.

### Code review instructions

- Start with `pkg/service/submission_service.go` for the approval transaction logic.
- Review `pkg/repository/postgres/artist_repo.go` for artist CRUD patterns.
- Check `pkg/db/queries/submissions.sql` and `artists.sql` for query correctness.
- Validate by running the server and testing with curl (see Technical details).

### Technical details

**Key commands run:**

```bash
sqlc generate
go build ./...

# Test endpoints
go run ./cmd/pyxis serve --bind :8282
curl -s -H "Cookie: session=test-session-abc" "http://localhost:8282/api/app/bookings"
curl -s -H "Cookie: session=test-session-abc" "http://localhost:8282/api/app/bookings?status=pending"
curl -s -H "Cookie: session=test-session-abc" -X PATCH "http://localhost:8282/api/app/bookings/1/approve"
curl -s -H "Cookie: session=test-session-abc" -X PATCH "http://localhost:8282/api/app/bookings/2/decline"
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/artists
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/artists/2
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X PATCH "http://localhost:8282/api/app/artists/2" -d '{"name":"Updated","genre":"Noise-Rock"}'
```

**Files created/modified:**

- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/artists.sql` — Artist queries
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/submissions.sql` — Approve/decline queries
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/artists.sql.go` — Generated artist query code
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/domain/artist.go` — Artist domain type
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/repository.go` — Updated interfaces
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/postgres/artist_repo.go` — Artist repo
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/postgres/submission_repo.go` — Updated submission repo
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/artist_service.go` — Artist service
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/submission_service.go` — Approval/decline logic
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go` — Booking + artist handlers
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go` — Route wiring
- `/home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go` — `respondJSON` + 404 handling

---

## Step 8: Implementation — Phase 7 (Calendar + Attendance)

Phase 7 adds calendar management (holds and blocked dates) and attendance logging endpoints. Calendar holds represent tentative reservations, blocked dates represent unavailable days, and attendance logs track post-show metrics.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the Pyxis backend. Phase 7 is next: calendar + attendance.

**Inferred user intent:** Build out staff-side calendar and attendance management.

**Commit (code):** `310cbd5` — "Phase 7: Calendar + Attendance endpoints"

### What I did

- Created `pkg/db/queries/calendar.sql` with `ListCalendarHolds`, `CreateCalendarHold`, `DeleteCalendarHold`, `ListCalendarBlocked`, `CreateCalendarBlocked`, `DeleteCalendarBlocked`.
- Created `pkg/db/queries/attendance.sql` with `GetAttendanceLog`, `UpsertAttendanceLog` (using `ON CONFLICT` for idempotent updates), `ListAttendanceLogs` (with JOIN to shows for artist/date).
- Regenerated sqlc code.
- Created `pkg/domain/calendar.go` with `CalendarHold` and `CalendarBlocked` structs.
- Created `pkg/domain/attendance.go` with `AttendanceLog` struct.
- Updated `pkg/repository/repository.go` with `CalendarRepository` and `AttendanceRepository` interfaces.
- Created `pkg/repository/postgres/calendar_repo.go` and `attendance_repo.go`.
- Created `pkg/service/calendar_service.go` and `attendance_service.go`.
- Added handlers in `pkg/server/app.go`:
  - `GET /api/app/calendar` — returns holds + blocked combined
  - `POST /api/app/calendar/holds` — create hold
  - `DELETE /api/app/calendar/holds/{id}` — delete hold
  - `POST /api/app/calendar/blocked` — create blocked date
  - `DELETE /api/app/calendar/blocked/{id}` — delete blocked date
  - `GET /api/app/attendance` — list logs with pagination
  - `GET /api/app/attendance/{showId}` — get log by show
  - `PATCH /api/app/attendance/{showId}` — upsert log
- Wired routes in `pkg/server/server.go` with auth + role middleware.
- Tested all endpoints:
  - Calendar CRUD ✓
  - Attendance list/get/upsert ✓

### What worked

- `ON CONFLICT (show_id) DO UPDATE` in `UpsertAttendanceLog` gives idempotent attendance recording.
- Combined calendar endpoint (`GET /api/app/calendar`) returns both holds and blocked in one response, reducing frontend round-trips.
- `ListAttendanceLogs` JOINs with `shows` to include artist name and date, making the list view self-contained.

### What didn't work

- **`ListAttendanceLogsRow` artist field type:** sqlc inferred `Artist` as `string` (not `pgtype.Text`) because the join column is `NOT NULL` in the shows table. Had to fix the mapping in `attendance_repo.go`.

### What should be done in the future

- Phase 8: Settings + Audit Log read endpoints.
- Phase 9: Flyers + Discord skeleton.
- Phase 10: CLI polish + export.

### Technical details

**Test commands:**

```bash
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/calendar
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X POST http://localhost:8282/api/app/calendar/holds -d '{"date":"2026-10-01","label":"Potential Show"}'
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X POST http://localhost:8282/api/app/calendar/blocked -d '{"date":"2026-10-15","reason":"Venue Maintenance"}'
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/attendance
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X PATCH http://localhost:8282/api/app/attendance/1 -d '{"draw":45,"notes":"Good crowd"}'
```

---

## Step 9: Implementation — Phase 8 (Settings + Audit Log)

Phase 8 adds the settings management and audit log read endpoints. Settings is a single-row table with space configuration, and the audit log provides a read-only view of staff actions.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue implementing the Pyxis backend. Phase 8 is next: settings + audit log.

**Inferred user intent:** Build out space configuration and audit log read endpoints.

**Commit (code):** `aaa907a` — "Phase 8: Settings + Audit Log read endpoints"

### What I did

- Created `pkg/db/queries/settings.sql` with `GetSettings` and `UpdateSettings` (using `COALESCE` for partial updates).
- Regenerated sqlc code.
- Created `pkg/domain/settings.go` with `Settings` struct.
- Updated `pkg/repository/repository.go` with `SettingsRepository` interface and expanded `AuditLogRepository` with `List`.
- Created `pkg/repository/postgres/settings_repo.go` mapping domain → sqlc params.
- Updated `pkg/repository/postgres/audit_repo.go` with `List` method.
- Created `pkg/service/settings_service.go`.
- Updated `pkg/service/audit_service.go` with `List` method on the interface.
- Added handlers in `pkg/server/app.go`:
  - `GET /api/app/settings` — read settings (all staff)
  - `PATCH /api/app/settings` — update settings (admin only)
  - `GET /api/app/audit-log` — list audit entries with pagination (admin only)
- Wired routes in `pkg/server/server.go`.
- Tested all endpoints:
  - Get settings ✓
  - Update settings ✓
  - List audit log ✓

### What worked

- `COALESCE($1, space_name)` pattern in `UpdateSettings` allows partial updates — only provided fields change.
- Audit log `List` reuses the existing `ListAuditLog` sqlc query with limit/offset pagination.

### What didn't work

- **`UpdateSettingsParams.SpaceName` is plain `string`:** sqlc inferred it as `string` (not `pgtype.Text`) because `space_name` is `NOT NULL`. The helper `strPtrToPgtypeText` failed. Fixed by passing `settings.SpaceName` directly.
- **Role testing:** Settings update and audit log require `admin` role. The test user was `booker` and got 403. Updated test user to `admin` for validation.

### What should be done in the future

- Phase 9: Flyers + Discord skeleton.
- Phase 10: CLI polish + export.

### Technical details

**Test commands:**

```bash
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/settings
curl -s -H "Cookie: session=test-session-abc" -H "Content-Type: application/json" -X PATCH http://localhost:8282/api/app/settings -d '{"spaceName":"Pyxis Updated","tagline":"Underground music venue","capacity":120,"setupComplete":true}'
curl -s -H "Cookie: session=test-session-abc" http://localhost:8282/api/app/audit-log
```
