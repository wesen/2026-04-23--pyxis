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
LastUpdated: 2026-04-27T18:45:00-04:00
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
