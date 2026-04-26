# Changelog

## 2026-04-25

- Initial workspace created


## 2026-04-25

Step 1: Analyzed frontend RTK Query contracts and wrote unified backend architecture design doc with DB schema, API routes, Go package layout, and phased implementation plan

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/sql-api.md — Reference schema and API spec
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/api/appApi.ts — Staff API contract
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/api/publicApi.ts — Public API contract


## 2026-04-25

Step 2: Applied design refinements — skeleton Discord client, single binary with cmd/pyxis/cmds/, protobuf payloads for camelCase JSON and TS sharing

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/pyxis-backend--pyxis-go-postgresql-backend-design-implementation/design-doc/01-unified-backend-architecture-api-design-guide.md — Updated design document with three refinements


## 2026-04-25

Phase 0+1: Scaffolded Go backend with Glazed CLI, docker-compose PostgreSQL, database migrations, sqlc codegen, migrate up/down commands

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/migrate.go — Migrate command with positional argument
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/migrations/000001_init.up.sql — Initial database schema
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/pool.go — pgxpool connection + golang-migrate integration


## 2026-04-26

Phases 2-4 implemented: public API read endpoints, submission creation, Discord OAuth skeleton, session cookies, auth middleware

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/auth.go — Auth handlers and middleware
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/public.go — Public API handlers with protojson
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/auth_service.go — Discord OAuth + session management


## 2026-04-26

Step 6: Phase 5 complete — staff show CRUD, audit logging, role middleware (commit 9f54adc)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go — Staff handlers with role-based access control
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/audit_service.go — Audit service interface and implementation
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/show_service.go — Show mutations with audit logging


## 2026-04-26

Step 7: Phase 6 complete — submission approval/decline with transactions, artist CRUD (commit 9bdffc8)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/repository/postgres/artist_repo.go — Artist repository
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go — Booking and artist handlers
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/service/submission_service.go — Approve transaction across submissions/artists/shows


## 2026-04-26

Step 8: Phase 7 complete — calendar holds/blocked + attendance logging (commit 310cbd5)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/attendance.sql — Attendance queries with ON CONFLICT upsert
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/db/queries/calendar.sql — Calendar queries
- /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/app.go — Calendar and attendance handlers

