---
Title: Production Readiness Implementation Diary
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
    - frontend
    - production
    - public-site
    - release-readiness
DocType: reference
Intent: long-term
Owners: []
RelatedFiles:
    - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md
    - ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/tasks.md
ExternalSources: []
Summary: "Chronological diary for public-site production-readiness planning and implementation."
LastUpdated: 2026-04-27T20:10:00-04:00
WhatFor: "Use this diary to understand what was investigated, what was created, what commands ran, and what remains before pyxis-user-site ships to production."
WhenToUse: "Update this after each implementation or validation step in PYXIS-PUBLIC-PROD-SHIP."
---

# Production Readiness Implementation Diary

## Step 1: Create the production-readiness ticket and map the public app

The user asked to add a ticket for shipping the public-facing app to production, with a detailed analysis/design/implementation guide, a detailed task list, a diary, and reMarkable upload. I created a new ticket workspace dedicated to the public site rather than mixing production-launch work into the earlier visual-tuning ticket.

### Prompt Context

**User prompt (verbatim excerpt):** "Add ticket for public facing app to ship to prod. create a detailed analysis / design / implementation guide ... Store in the ticket and upload to remarkable. Keep a diary. Add detailed list of tasks"

**Assistant interpretation:** Create a docmgr-backed ticket for pyxis-user-site production readiness, write a long-form implementation guide for a new developer/intern, add a detailed task plan, keep an investigation diary, and upload the deliverables to reMarkable.

**Inferred user intent:** The visual/frontend work is close enough that the next concern is launch readiness: real APIs, deployment, booking form hardening, routing, SEO, mobile/accessibility, and release validation.

### Commands run

```bash
docmgr status --summary-only

docmgr ticket create-ticket \
  --ticket PYXIS-PUBLIC-PROD-SHIP \
  --title "Ship pyxis-user-site public app to production" \
  --topics frontend,production,public-site,release-readiness

docmgr doc add \
  --ticket PYXIS-PUBLIC-PROD-SHIP \
  --doc-type design-doc \
  --title "Public Site Production Readiness Analysis and Ship Plan"

docmgr doc add \
  --ticket PYXIS-PUBLIC-PROD-SHIP \
  --doc-type reference \
  --title "Production Readiness Implementation Diary"
```

### Evidence gathered

I inspected the public-site architecture and key production-facing files:

- `web/packages/pyxis-user-site/src/App.tsx`
- `web/packages/pyxis-user-site/src/api/publicApi.ts`
- `web/packages/pyxis-user-site/src/api/endpoints.ts`
- `web/packages/pyxis-user-site/src/pages/ShowsPage/Page.tsx`
- `web/packages/pyxis-user-site/src/pages/ShowDetailPage/Page.tsx`
- `web/packages/pyxis-user-site/src/pages/ArchivePage/Page.tsx`
- `web/packages/pyxis-user-site/src/pages/BookPage/Page.tsx`
- `web/packages/pyxis-user-site/src/components/Seo.tsx`
- `web/packages/pyxis-user-site/vite.config.ts`
- `proto/pyxis/v1/show.proto`

I also ran repository searches for likely production-readiness issues:

```bash
rg -n "Seo|<Seo|VITE_|localhost|127\.0\.0\.1|mockServiceWorker|MSW|placehold\.co|TODO|FIXME|captcha|honeypot|rate" \
  web/packages/pyxis-user-site web/packages/pyxis-components/src -S

rg -n "serviceWorker|worker.start|setupWorker|mockServiceWorker|initialize" \
  web/packages/pyxis-user-site/src web/packages/pyxis-components/src -S
```

The key findings were:

- The app has a clear client-side route tree in `App.tsx`.
- Public API access is centralized in RTK Query with `VITE_API_URL` support.
- Endpoint paths are centralized in `endpoints.ts`.
- Page-level loading, empty, error, and not-found states exist for several pages.
- `Seo.tsx` exists but is not mounted by route pages yet.
- Vite dev proxy uses localhost for development only.
- Mock placeholders and MSW live in mock/story code, but production data should avoid placeholder flyers.

### What I created

- Primary design/implementation guide:
  - `design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md`
- Detailed task list:
  - `tasks.md`
- This diary:
  - `reference/01-production-readiness-implementation-diary.md`

### What worked

The app already has a strong frontend foundation for launch hardening. The biggest missing pieces are not visual polish; they are production concerns: API contract validation, booking form hardening, route fallback, SEO mounting, mobile/accessibility smoke, deployment topology, and release validation.

### What didn't work

No command failures occurred during ticket setup or evidence gathering.

### What was tricky to build

The main challenge was separating visual readiness from production readiness. The public pages can look acceptable and still not be safe to ship. The design doc therefore treats build/visual validation as only one launch gate among several.

### What warrants a second pair of eyes

A backend or deployment owner should review the API topology, booking anti-spam requirements, and route fallback plan before implementation starts.

### Code review instructions

This step only creates documentation. Review the ticket docs for accuracy against the current codebase and confirm the task list matches launch priorities.

### Next steps

1. Relate the key source files to the ticket docs.
2. Run docmgr validation.
3. Upload the ticket docs to reMarkable.
4. Commit the ticket workspace if desired.

## Step 2: Validate ticket docs and upload the production-readiness bundle

After writing the design guide, tasks, and diary, I related the primary design doc to the source files it analyzes, updated the changelog, ran docmgr validation, fixed vocabulary, and uploaded the handoff bundle to reMarkable.

### Commands run

```bash
docmgr doc relate --doc <design-doc> --file-note <source-file:reason>
docmgr changelog update --ticket PYXIS-PUBLIC-PROD-SHIP --entry "Created public-site production readiness analysis, detailed ship tasks, and implementation diary." ...
docmgr doctor --ticket PYXIS-PUBLIC-PROD-SHIP --stale-after 30
```

The first doctor run warned that `production` and `release-readiness` were not known topic vocabulary values. I added both:

```bash
docmgr vocab add --category topics --slug production --description "Production deployment, launch readiness, runtime operations, and release gating."
docmgr vocab add --category topics --slug release-readiness --description "Ship/no-ship validation, launch checklists, and production readiness planning."
docmgr doctor --ticket PYXIS-PUBLIC-PROD-SHIP --stale-after 30
```

The second doctor run passed:

```text
## Doctor Report (1 findings)

### PYXIS-PUBLIC-PROD-SHIP

- ✅ All checks passed
```

Then I verified and uploaded to reMarkable:

```bash
remarquee status
remarquee cloud account --non-interactive
remarquee upload bundle --dry-run \
  design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md \
  tasks.md \
  reference/01-production-readiness-implementation-diary.md \
  --name "PYXIS-PUBLIC-PROD-SHIP public site production readiness" \
  --remote-dir "/ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP" \
  --toc-depth 2

remarquee upload bundle ...
remarquee cloud ls /ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP --long --non-interactive
```

The upload succeeded:

```text
OK: uploaded PYXIS-PUBLIC-PROD-SHIP public site production readiness.pdf -> /ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP
[f]	PYXIS-PUBLIC-PROD-SHIP public site production readiness
```

### What worked

The docs validate cleanly after adding the missing vocabulary terms. The reMarkable bundle upload succeeded and the remote listing shows the uploaded PDF.

### What didn't work

The first `docmgr doctor` run found missing topic vocabulary. This was expected for new release-related topics and was fixed by adding explicit vocabulary entries.

### What was tricky to build

The bundle includes three documents with different roles: design guide, task list, and diary. Keeping them separate makes the ticket easier to execute, while bundling them into one PDF makes it easier to read on reMarkable.

### Next steps

Start Phase 1 of the task list: decide production domain/API topology, classify dev assumptions, and configure SPA route fallback.

## Step 3: Collect operator launch decisions with plz-confirm

The user asked me to ask the questions needed for the production-readiness work and specifically requested that I use `plz-confirm help --all` to learn how to ask feedback questions.

### Commands run

```bash
plz-confirm help --all
plz-confirm help how-to-use
```

The help output showed that `plz-confirm form` accepts a JSON Schema via `--schema @file.json`, and that common flags include `--base-url`, `--wait-timeout`, and `--output json`.

I wrote the first question schema:

```text
sources/01-prod-readiness-operator-questions.schema.json
```

My first attempt used the default base URL and failed:

```bash
plz-confirm form --title "Pyxis public-site production decisions" --schema @... --wait-timeout 0 --output json
```

Error:

```text
Error: create form request: create request failed: status=404 body=404 page not found
```

I checked running processes and found the active server:

```text
plz-confirm serve --addr :9876
```

The working command was:

```bash
plz-confirm form \
  --base-url http://localhost:9876 \
  --title "Pyxis public-site production decisions" \
  --schema @ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/sources/01-prod-readiness-operator-questions.schema.json \
  --wait-timeout 0 \
  --output json
```

I saved parsed answers to:

```text
sources/02-prod-readiness-operator-answers.json
```

Then I asked follow-up questions with:

```text
sources/03-prod-readiness-followup-questions.schema.json
```

and saved answers to:

```text
sources/04-prod-readiness-followup-answers.json
```

### Key answers

- Production domain: `https://pyxis.xyz`.
- Launch scope: public website + backend; focus on public website.
- Deployment target: Go backend static embed, likely built with Dagger.
- API topology: same binary / same-origin API.
- Production `VITE_API_URL`: interpret as blank/same-origin.
- Booking spam mitigation: none for now; accepted v1 risk.
- Booking notification owner: undecided.
- Content approver: undecided/admin user later.
- SEO: Manuel asked what the existing `Seo` component is; do not treat SEO as definitively rejected yet.
- Target launch date: no urgency.

I recorded the interpreted decisions in:

```text
reference/02-operator-production-decisions.md
```

### What worked

`plz-confirm form` was the right widget because the questions were structured and multi-field. Saving the schemas and parsed answers gives future developers an audit trail of the operator decisions.

### What didn't work

The first command failed because `plz-confirm` was not running on the documented default `http://localhost:3000`. Passing `--base-url http://localhost:9876` fixed it.

### What was tricky to build

Some schema enum fields accepted free-form operator text rather than only enum values. That is fine for this use case because the human language was more useful than a strict enum, but future scripts should not rely on exact enum values unless the widget enforces them.

### Next steps

Proceed to backend/deployment audit because Manuel explicitly answered `yes` to inspecting the Go backend/Dagger/static embed setup next.

## Step 4: Audit backend static embed and convert launch plan into concrete tasks

Manuel asked me to proceed with the backend/Dagger/static embed audit and then add detailed phased tasks.

### Commands run

```bash
go test ./... -count=1
```

Result:

```text
ok  github.com/go-go-golems/pyxis/pkg/discordbot 0.026s
```

All other packages either passed or had no test files.

### Files inspected

- `cmd/build-web/main.go`
- `Makefile`
- `internal/web/embed.go`
- `internal/web/embed_none.go`
- `internal/web/static.go`
- `internal/web/generate.go`
- `pkg/server/server.go`
- `pkg/server/spa_fallback.go`
- `pkg/server/public.go`
- `pkg/service/submission_service.go`
- `pkg/service/show_service.go`
- `pkg/db/queries/shows.sql`
- `pkg/db/queries/submissions.sql`
- `pkg/db/migrations/000001_init.up.sql`
- `pkg/repository/postgres/show_repo.go`
- `pkg/repository/postgres/submission_repo.go`
- `pkg/server/auth.go`

### What I found

The backend already implements the desired production topology: the public site can be built and copied into `internal/web/embed/public`, then served from a Go binary built with `-tags embed`. `make build-embed` runs `build-web` and then builds `bin/pyxis` with the embed tag. `make serve-embed` builds and serves the embedded binary on `:8080`.

The server also already has the same-origin public API routes expected by `pyxis-user-site`:

- `GET /api/public/shows`
- `GET /api/public/shows/{id}`
- `GET /api/public/archive`
- `GET /api/public/archive/stats`
- `POST /api/public/submissions`

The SPA fallback is also implemented carefully. It reserves `/api`, `/auth`, `/health`, and `/flyers`, while browser routes like `/shows/42` should fall back to `index.html`.

### Key risks discovered

- Public show detail currently appears to call generic `GetByID`; we should verify it does not expose draft/hold/blocked/archived shows unintentionally.
- Booking validation is minimal: artist name and links only.
- Manuel accepted no spam mitigation for v1, so this is documented as a risk, not a blocker.
- Staff auth routes are served by the same binary; `auth.go` still has `Secure: false` cookie TODOs that matter if staff routes are exposed over HTTPS.
- Static asset cache-control is not customized.
- Dagger build path exists, but still needs execution in the release environment.

### What I created/updated

- Created backend audit:
  - `reference/03-backend-static-embed-production-audit.md`
- Rewrote the task list into a concrete implementation plan with phases T00-T37:
  - `tasks.md`

### What worked

The codebase is further along than expected. The same-origin Go binary/static embed shape is already implemented; production work can focus on tests, validation, visibility rules, and launch hardening.

### What didn't work

No command failed during the audit. I did not run `make build-embed` yet because it will build/copy frontend assets and should be treated as an implementation/validation task with recorded artifact changes.

### What was tricky to build

The main task was translating broad production readiness into repository-specific tasks. After the audit, the right task list is no longer abstract: it can name exact files, commands, tests, and route behaviors.

### Next steps

Start Phase 1:

1. Run and validate `go run ./cmd/build-web` through Dagger.
2. Run and validate `BUILD_WEB_LOCAL=1 go run ./cmd/build-web`.
3. Run and validate `make build-embed`.
4. Add tests for `internal/web.NewSPAHandler` and `spaFallbackHandler`.

## Step 5: Upload updated backend audit bundle to reMarkable

After adding the backend static embed audit and expanding the task list, I reran docmgr validation and uploaded an updated bundle to reMarkable.

### Commands run

```bash
docmgr doctor --ticket PYXIS-PUBLIC-PROD-SHIP --stale-after 30
```

Result:

```text
✅ All checks passed
```

Then I ran a dry-run bundle upload and the real upload:

```bash
remarquee upload bundle --dry-run \
  design-doc/01-public-site-production-readiness-analysis-and-ship-plan.md \
  tasks.md \
  reference/01-production-readiness-implementation-diary.md \
  reference/02-operator-production-decisions.md \
  reference/03-backend-static-embed-production-audit.md \
  --name "PYXIS-PUBLIC-PROD-SHIP backend audit and task plan" \
  --remote-dir "/ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP" \
  --toc-depth 2

remarquee upload bundle ...
remarquee cloud ls /ai/2026/04/27/PYXIS-PUBLIC-PROD-SHIP --long --non-interactive
```

Remote listing:

```text
[f] PYXIS-PUBLIC-PROD-SHIP backend audit and task plan
[f] PYXIS-PUBLIC-PROD-SHIP public site production readiness
```

### What worked

The updated bundle now includes the initial design guide, the expanded task list, the diary, operator decisions, and backend audit.

### Next steps

Commit the updated ticket docs, then begin implementation with the build/embed validation and fallback tests.

## Step 6: Complete production phases 1-4

The user asked me to complete phases 1-4 of the production shipping task list, check tasks off as they are completed, commit at appropriate intervals, and keep the diary current. This step covers T04 through T18.

### Commands run

```bash
go run ./cmd/build-web 2>&1 | tee /tmp/pyxis-prod-build-web-dagger.log
BUILD_WEB_LOCAL=1 go run ./cmd/build-web 2>&1 | tee /tmp/pyxis-prod-build-web-local.log
make build-embed 2>&1 | tee /tmp/pyxis-prod-make-build-embed.log
```

The Dagger/default path, local fallback path, and production embedded binary build all succeeded. The build regenerated `internal/web/embed/public/index.html` and hashed asset files under `internal/web/embed/public/assets/`. I restored `web/packages/pyxis-user-site/tsconfig.tsbuildinfo` after build/test runs because it is tracked but behaves like local TypeScript build noise in this workflow.

After adding code and tests, I reran the production-intent build and smoke commands:

```bash
gofmt -w internal/web/static_test.go pkg/server/spa_fallback_test.go pkg/service/show_service.go pkg/service/show_service_test.go pkg/service/submission_service.go pkg/service/submission_service_test.go pkg/server/public.go
go test ./... -count=1
make build-embed >/tmp/pyxis-prod-make-build-embed-final.log 2>&1
BIND=127.0.0.1:18084 SKIP_BUILD=1 \
  ttmp/2026/04/27/PYXIS-PUBLIC-PROD-SHIP--ship-pyxis-user-site-public-app-to-production/scripts/01-smoke-embedded-public-site.sh \
  2>&1 | tee /tmp/pyxis-embedded-public-smoke-final.log
```

The final smoke script passed:

```text
[smoke] HTML OK /
[smoke] HTML OK /shows
[smoke] HTML OK /shows/1
[smoke] HTML OK /archive
[smoke] HTML OK /book
[smoke] HTML OK /book/success
[smoke] HTML OK /about
[smoke] JSON OK /api/public/shows
[smoke] JSON OK /api/public/archive
[smoke] JSON OK /api/public/archive/stats
[smoke] public API visibility OK
[smoke] booking submission OK
[smoke] embedded public site smoke passed
```

I also ran a focused dev-auth review-path smoke for T17: I started the server with `PYXIS_DEV_AUTH=1` on `127.0.0.1:18085`, posted a marker-prefixed public booking, logged in through `/auth/dev-login?username=smoke-admin&role=admin`, confirmed `GET /api/app/bookings?status=pending` listed the marker submission, and then cleaned up the marker row. This verifies persistence and staff listing in a dev/staging setup. Production auth exposure and approve/decline operational review remain Phase 5 concerns because secure-cookie and public route exposure are not settled yet.

I also ran the public frontend validation after the main hardening changes:

```bash
cd web/packages/pyxis-user-site
pnpm exec tsc --noEmit
pnpm exec vite build
```

Both passed. The Vite build produced the expected public-site chunks and the usual sourcemap output.

### What changed

Static serving and SPA fallback tests were added:

- `internal/web/static_test.go`
- `pkg/server/spa_fallback_test.go`

Public API and booking hardening were implemented:

- `pkg/service/show_service.go` now has `GetPublicByID`, with v1 public detail visibility set to confirmed-upcoming shows only.
- `pkg/server/public.go` now uses `GetPublicByID` for `GET /api/public/shows/{id}`.
- `pkg/server/public.go` maps `service.ErrValidation` to `400 VALIDATION_ERROR`.
- `pkg/service/submission_service.go` now has a shared `ErrValidation` sentinel and validates artist name, links, field lengths, and expected draw bounds.

Focused service tests were added:

- `pkg/service/show_service_test.go` covers confirmed upcoming shows and hidden draft/hold/blocked/cancelled/archived/past shows.
- `pkg/service/submission_service_test.go` covers valid submissions and validation failures.

A production smoke script was added:

- `scripts/01-smoke-embedded-public-site.sh`

It validates the same-origin embedded site, seeded public visibility behavior, archive behavior, and booking confirmation creation. It uses temporary marker-prefixed rows and cleans them up.

### What worked

The existing backend/static embed architecture was solid. The Dagger path, local build-web fallback, `make build-embed`, Go tests, frontend typecheck/build, and embedded smoke all passed after the hardening changes.

The smoke script was especially useful because it exercised the exact topology we want for production: one Go binary, embedded public assets, same-origin `/api/public/*` calls, and browser routes falling back to the React app.

### What didn't work

The first smoke attempt used port `18080`, which was already occupied by an older local Pyxis process. I changed the script default to `127.0.0.1:18081` and later ran the validation on `127.0.0.1:18084` to avoid local process collisions.

The first booking smoke attempt also posted a request without `links`, which exposed that the production form and backend launch requirement still expect links. I kept links required, changed validation errors to be structured `400 VALIDATION_ERROR`, and updated the smoke payload to include a temporary link.

### What was tricky to build

The tricky boundary was deciding what counts as “public.” The list endpoint already used SQL that returns confirmed upcoming shows, but detail used generic `GetByID`. The safe v1 rule is now explicit: public detail is confirmed-upcoming only. Archived content remains available through the archive endpoint, not through the upcoming show-detail endpoint.

Another tricky point is the committed embed tree. The repo already tracks `internal/web/embed/public`; for now the release rule is to regenerate during CI/release and commit regenerated assets when production changes alter the frontend bundle, so the fallback tree and embedded tree do not drift.

### Task updates

I checked off T04-T18 in `tasks.md` and added the implementation update to the design guide. Phase 5 remains open and now starts with auth/cookie exposure review.

### Next steps

1. Commit the phase 1-4 hardening changes.
2. Start Phase 5: production auth/cookie exposure and `/auth/*`/`/api/app/*` launch exposure decision.
3. Upload an updated production-readiness bundle to reMarkable after commit if the user wants the latest phase 1-4 implementation notes on-device.

## Step 7: Analyze hair-booking as the Keycloak/OIDC precedent

The user asked whether we already had Keycloak study material, then asked me to analyze `/home/manuel/code/wesen/hair-booking` for Keycloak usage, Docker Compose setup, and related production details, update the production document, and upload a v2 bundle to reMarkable.

### Commands run

```bash
cd /home/manuel/code/wesen/hair-booking
find . -maxdepth 3 -iname '*keycloak*' -o -iname 'docker-compose*' -o -iname '*.yml' -o -iname '*.yaml'
rg -n "keycloak|KEYCLOAK|oidc|OIDC|oauth|OAuth|openid|OpenID|realm|client_id|clientId|issuer|jwt|JWT|auth" . -S --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!vendor'
```

I then read the relevant implementation and operations files:

- `docker-compose.local.yml`
- `dev/keycloak/realm-import/hair-booking-dev-realm.json`
- `pkg/auth/config.go`
- `pkg/auth/oidc.go`
- `pkg/auth/session.go`
- `pkg/server/http.go`
- `pkg/server/handlers_me.go`
- `pkg/server/handlers_stylist.go`
- `pkg/stylist/authorizer.go`
- `Makefile`
- `README.md`
- `docs/operations-playbook.md`
- `docs/smoke-testing-playbook.md`
- `docs/deployments/hair-booking-coolify.md`
- `/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/hosted/main.tf`
- `/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/local/main.tf`
- `/home/manuel/code/wesen/terraform/keycloak/apps/hair-booking/envs/k3s-parallel/main.tf`
- `/home/manuel/code/wesen/terraform/keycloak/README.md`
- `/home/manuel/code/wesen/terraform/docs/shared-keycloak-platform-playbook.md`

### Findings

`hair-booking` is the best existing local precedent for Pyxis Keycloak work. It has a local Docker Compose fixture with separate app Postgres, Keycloak Postgres, and Keycloak services; a local app-specific realm import; server-side OIDC login/callback/logout handlers; signed HTTP-only app sessions; secure-cookie inference based on TLS/proxy/redirect URL; a stable `/api/me` contract; and hosted Keycloak client provisioning in the central Terraform repo.

The main design lesson is to keep Keycloak backend-owned. The React app should not store Keycloak tokens. The Go server should redirect to Keycloak, verify the ID token on callback, and create an app session cookie that the existing staff API middleware can understand.

For Pyxis, the lowest-risk path is to keep the existing database-backed session and role middleware, then replace only the identity-provider login/callback layer. Roles can remain local DB roles at first, keyed by Keycloak subject/email, before adding Keycloak group/realm-role mapping later.

### Document updates

I updated the production readiness design document with a new section:

- `## 12. Keycloak precedent from hair-booking`

It covers:

- local Docker Compose shape;
- local realm import defaults;
- OIDC runtime settings;
- login/callback/logout/session mechanics;
- authorization/role-mapping implications for Pyxis;
- central Terraform hosted-client pattern;
- production deployment variables and smoke order;
- a recommended Pyxis implementation plan;
- a concrete Phase 5 carry-over checklist.

I also updated `tasks.md` Phase 5 with Keycloak-specific follow-ups and added Phase 5A tasks T21A-T21C for a future Pyxis Keycloak/OIDC implementation ticket, local fixture, and hosted Terraform design.

### What worked

The `hair-booking` repo is very reusable as a reference. It already solved the two exact things Pyxis is about to face: local Keycloak ergonomics and production secure-cookie/redirect behavior behind a platform edge.

### What warrants a second pair of eyes

Before implementation, Manuel should decide whether Pyxis staff identity uses one client (`pyxis-web`) or a staff-specific client (`pyxis-staff-web`), and whether staff roles remain local DB roles or move into Keycloak groups/realm roles.

### Next steps

Upload the updated production-readiness bundle as a v2 reMarkable PDF, then commit the documentation updates.
