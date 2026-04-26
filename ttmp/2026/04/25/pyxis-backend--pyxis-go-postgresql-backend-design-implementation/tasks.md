# Tasks

## Phase 0 — Scaffold & Tooling

- [x] 0.1 Initialize Go module `github.com/go-go-golems/pyxis`
- [x] 0.2 Create `docker-compose.yml` with PostgreSQL service
- [x] 0.3 Add `Makefile` with targets: `build`, `test`, `lint`, `migrate`, `seed`, `generate`
- [ ] 0.4 Add `golangci-lint` configuration
- [x] 0.5 Create package skeleton: `pkg/server`, `pkg/domain`, `pkg/service`, `pkg/repository`, `pkg/db`, `pkg/cmdtools`, `pkg/discord`, `pkg/storage`, `pkg/config`, `internal/testutil`
- [x] 0.6 Create `cmd/pyxis/main.go` entrypoint wiring Glazed root command
- [x] 0.7 Add `cmd/pyxis/cmds/serve.go` — "serve" subcommand skeleton
- [x] 0.8 Add `.gitignore` for Go project
- [x] 0.9 Commit Phase 0

## Phase 1 — Database & Migrations

- [x] 1.1 Write SQL migration files for all tables (up + down)
- [x] 1.2 Add `docker-compose.yml` with PostgreSQL 16, healthcheck, and persistent volume
- [x] 1.3 Integrate `golang-migrate` as library in `cmd/pyxis/cmds/migrate.go`
- [x] 1.4 Add `pkg/db/db.go` — pgxpool connection wrapper
- [x] 1.5 Add sqlc configuration (`sqlc.yaml`)
- [x] 1.6 Write first sqlc query files (`shows.sql`, `submissions.sql`)
- [x] 1.7 Run `sqlc generate` and verify Go code compiles
- [x] 1.8 Add `cmd/pyxis/cmds/seed.go` — seed command skeleton
- [x] 1.9 Test `pyxis migrate up` and `pyxis migrate down` end-to-end
- [x] 1.10 Commit Phase 1

## Phase 2 — Domain Models & Public API (Read-Only)

- [x] 2.1 Define protobuf schemas in `proto/pyxis/v1/` for Show, AppShow, ArchivedShow, ArchiveStats, BookingFormData, BookingConfirmation
- [x] 2.2 Configure `buf.yaml` and `buf.gen.yaml`
- [x] 2.3 Run `buf generate` and verify Go protobuf code compiles
- [x] 2.4 Define domain structs in `pkg/domain/`
- [x] 2.5 Implement `ShowRepository` interface + PostgreSQL implementation
- [x] 2.6 Implement `ShowService` with read-only methods
- [x] 2.7 Wire public HTTP handlers: `GET /api/public/shows`, `GET /api/public/shows/{id}`
- [x] 2.8 Wire public HTTP handlers: `GET /api/public/archive`, `GET /api/public/archive/stats`
- [x] 2.9 Seed database with realistic show data
- [x] 2.10 Commit Phase 2

## Phase 3 — Public API Write + Submissions

- [ ] 3.1 Define protobuf schemas for Submission types
- [ ] 3.2 Implement `SubmissionRepository` + PostgreSQL implementation
- [ ] 3.3 Implement `SubmissionService` with create method
- [ ] 3.4 Wire `POST /api/public/submissions` handler
- [ ] 3.5 Add validation for booking form data
- [ ] 3.6 Commit Phase 3

## Phase 4 — Auth + Session

- [ ] 4.1 Define protobuf schemas for User, AuthSession
- [ ] 4.2 Create `users` and `sessions` tables + migrations
- [ ] 4.3 Implement Discord OAuth callback handler
- [ ] 4.4 Implement `GET /auth/me`, `POST /auth/logout`
- [ ] 4.5 Add `requireAuth` middleware
- [ ] 4.6 Wire `GET /api/app/session`
- [ ] 4.7 Commit Phase 4

## Phase 5 — Staff API — Shows CRUD

- [x] 5.1 Implement show mutations: create, update, cancel, archive
- [x] 5.2 Add audit logging for every mutation
- [x] 5.3 Wire `POST /api/app/shows`, `PATCH /api/app/shows/{id}`
- [x] 5.4 Wire `PATCH /api/app/shows/{id}/cancel`, `PATCH /api/app/shows/{id}/archive`
- [x] 5.5 Add role checks (Admin/Booker only for cancel)
- [x] 5.6 Commit Phase 5

## Phase 6 — Staff API — Submissions + Artists

- [x] 6.1 Implement submission approval/decline with transaction
- [x] 6.2 Implement artist creation on approval
- [x] 6.3 Wire `GET /api/app/bookings`, `PATCH /api/app/bookings/{id}/approve`
- [x] 6.4 Wire `GET /api/app/artists`, `GET /api/app/artists/{id}`, `PATCH /api/app/artists/{id}`
- [x] 6.5 Commit Phase 6

## Phase 7 — Calendar + Attendance

- [x] 7.1 Implement `calendar_holds` and `calendar_blocked` repositories
- [x] 7.2 Add calendar endpoints
- [x] 7.3 Implement `attendance_logs` repository
- [x] 7.4 Add attendance endpoints
- [x] 7.5 Commit Phase 7

## Phase 8 — Settings + Audit Log

- [x] 8.1 Implement settings repository (single-row)
- [x] 8.2 Add `GET /api/app/settings`, `PATCH /api/app/settings`
- [x] 8.3 Implement audit log repository
- [x] 8.4 Add `GET /api/app/audit-log` with pagination
- [x] 8.5 Commit Phase 8

## Phase 9 — Flyers + Discord

- [x] 9.1 Add `FlyerStore` interface + local filesystem implementation
- [x] 9.2 Add flyer upload/delete handlers
- [x] 9.3 Integrate Discord client skeleton in services
- [x] 9.4 Add `POST /api/app/shows/{id}/announce`
- [x] 9.5 Commit Phase 9

## Phase 10 — CLI Polish + Export

- [x] 10.1 Finalize all CLI commands (serve, migrate, seed, export)
- [x] 10.2 Add CSV export functionality
- [ ] 10.3 Add rich seed fixtures
- [ ] 10.4 Write integration tests
- [ ] 10.5 Add CI GitHub Actions workflow
- [x] 10.6 Commit Phase 10

## Phase 11 — TypeScript Protobuf Generation + RTK Query Migration

- [ ] 11.1 Install `@bufbuild/protobuf` and configure `buf.gen.yaml` for TypeScript output
- [ ] 11.2 Generate TypeScript bindings from existing `proto/pyxis/v1/show.proto`
- [ ] 11.3 Update `pyxis-types` package to export generated types
- [ ] 11.4 Migrate `publicApi.ts` RTK Query slice to use generated types + `fromJson`
- [ ] 11.5 Migrate `appApi.ts` RTK Query slice to use generated types + `fromJson`
- [ ] 11.6 Remove hand-written API response interfaces from `pyxis-types`
- [ ] 11.7 Add widget-level transform helpers where normalization was removed
- [ ] 11.8 Test end-to-end: Go `protojson.Marshal` → TS `fromJson` round-trip
- [ ] 11.9 Commit Phase 11

## Future / Open Questions

- [ ] Implement real Discord bot (replace NoOpClient)
- [ ] Add OpenAPI/Swagger generation
- [ ] Evaluate `pg_trgm` for archive search
- [ ] Add rate limiting on public submissions
