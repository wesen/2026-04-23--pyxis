---
Title: Public Site Production Ship Tasks
Ticket: PYXIS-PUBLIC-PROD-SHIP
Status: active
Topics:
  - frontend
  - production
  - public-site
  - release-readiness
DocType: tasks
Intent: implementation
Summary: Detailed phased task list for shipping pyxis-user-site and the same-origin Go backend/static embed path to production.
LastUpdated: 2026-04-27T20:10:00-04:00
---

# Public Site Production Ship Tasks

## Current launch assumptions

These assumptions were confirmed through `plz-confirm` and backend audit:

- Production domain: `https://pyxis.xyz`.
- Launch scope: public website + backend; focus on the public website.
- Deployment target: Go backend static embed, built through Dagger/local fallback.
- API topology: same-origin API from the same Go binary.
- Production `VITE_API_URL`: blank/same-origin unless a later deployment decision overrides it.
- Booking spam mitigation: none for now; accepted v1 risk.
- Booking notification/content owners: undecided.
- SEO strategy: unresolved; existing `Seo.tsx` needs inspection before use.

## Phase 0: Ticket setup, operator decisions, and backend audit

- [x] **T00 — Create production-readiness ticket workspace**
  - Create `PYXIS-PUBLIC-PROD-SHIP`.
  - Create design doc, diary, tasks, and changelog.
  - Store the public-site production analysis in the ticket.
  - Upload the initial handoff bundle to reMarkable.

- [x] **T01 — Map current public-site architecture**
  - Inspect route tree, API layer, page state handling, SEO helper, Vite config, and proto schema.
  - Record file-backed evidence in the design doc.

- [x] **T02 — Collect operator launch decisions with plz-confirm**
  - Ask production domain, API topology, deployment target, booking spam posture, SEO posture, launch scope, and content owner questions.
  - Store schemas and answers in `sources/`.
  - Record interpreted decisions in `reference/02-operator-production-decisions.md`.

- [x] **T03 — Audit Go backend, Dagger build, and static embed path**
  - Inspect `cmd/build-web/main.go`, `Makefile`, `internal/web/*`, `pkg/server/*`, public handlers, and DB queries.
  - Confirm same-origin/static embed architecture exists.
  - Run `go test ./... -count=1`.
  - Record findings in `reference/03-backend-static-embed-production-audit.md`.

## Phase 1: Build and embed validation

- [x] **T04 — Verify Dagger build-web path in the release environment**
  - Run `go run ./cmd/build-web` without `BUILD_WEB_LOCAL=1`.
  - Confirm Dagger engine availability or expected local fallback behavior.
  - Confirm `internal/web/embed/public/index.html` is recreated.
  - Confirm generated assets are copied under `internal/web/embed/public/assets/`.
  - Record command output and timing in the diary.

- [x] **T05 — Verify local build-web fallback path**
  - Run `BUILD_WEB_LOCAL=1 go run ./cmd/build-web`.
  - Confirm it builds `pyxis-types`, `pyxis-components`, and `pyxis-user-site`.
  - Confirm it copies `web/packages/pyxis-user-site/dist` into `internal/web/embed/public`.
  - Record any environment prerequisites: node version, pnpm version, corepack.

- [x] **T06 — Verify production binary build command**
  - Run `make build-embed`.
  - Confirm it produces `bin/pyxis` built with `-tags embed`.
  - Confirm a bare `make build` is documented as insufficient for production static embed unless `internal/web/embed/public` is present on disk.

- [x] **T07 — Decide whether embedded frontend artifacts are committed or generated only**
  - Inspect `.gitignore` and current `internal/web/embed/public` state.
  - Decide whether production release expects generated embed files in source control or generated during CI/release.
  - Document the decision in the production guide.

## Phase 2: SPA fallback and route behavior tests

- [x] **T08 — Add unit tests for `internal/web.NewSPAHandler`**
  - Test `GET /` returns `index.html`.
  - Test `GET /shows`, `/shows/123`, `/archive`, `/book`, `/book/success`, `/about` fall back to `index.html`.
  - Test `GET /assets/<existing>` returns the static asset.
  - Test `POST /shows` returns 404.
  - Test `/api`, `/api/foo`, `/auth`, `/auth/foo`, `/health`, `/flyers`, `/flyers/foo` are reserved and do not return HTML.

- [x] **T09 — Add unit tests for `spaFallbackHandler`**
  - Test primary non-404 responses are preserved.
  - Test primary 404 delegates to fallback for browser routes.
  - Test reserved fallback paths remain 404.
  - Test response headers/status/body flush correctly.

- [x] **T10 — Add integration smoke script for embedded server routes**
  - Create a ticket script or repo script that:
    - builds embedded binary,
    - starts server on an ephemeral/local port with test DB config,
    - curls `/health`, `/`, `/shows`, `/shows/1`, `/archive`, `/book`, `/book/success`, `/about`, and `/api/public/*`.
  - Validate SPA routes return HTML.
  - Validate API routes return JSON or documented errors.

## Phase 3: Public API contract hardening

- [x] **T11 — Contract-test `GET /api/public/shows`**
  - Seed or create confirmed future shows.
  - Verify only `status='confirmed'` and `date >= CURRENT_DATE` are returned.
  - Verify sort order is ascending by date.
  - Verify response decodes as `ShowListSchema` in frontend/TS or proto JSON in Go.

- [x] **T12 — Fix/test public show detail visibility**
  - Audit `handleGetPublicShow` and `showService.GetByID` behavior for draft/hold/blocked/archived shows.
  - Decide public rule:
    - confirmed upcoming only,
    - confirmed plus archived,
    - or any show with public flag/status.
  - Implement `GetPublicShowByID` or equivalent if non-public statuses currently leak.
  - Add tests for confirmed, draft, hold, blocked, archived, missing, and invalid IDs.

- [x] **T13 — Contract-test archive endpoints**
  - Verify `GET /api/public/archive` returns only archived shows.
  - Verify search filters by artist/genre.
  - Verify sort order is newest first.
  - Verify `GET /api/public/archive/stats` aggregates archived shows only.
  - Verify responses decode as `ArchivedShowListSchema` and `ArchiveStatsSchema`.

- [x] **T14 — Standardize public API error shape/status codes**
  - Inspect `respondError` behavior.
  - Ensure invalid IDs return 400 or a consistent client error.
  - Ensure not found returns 404.
  - Ensure validation errors return 400 with useful messages.
  - Ensure frontend `getApiErrorMessage` displays useful text.

## Phase 4: Booking submission v1 hardening

- [x] **T15 — Document accepted no-spam-mitigation risk**
  - Record that Manuel accepted `none for now` for booking spam mitigation.
  - Add a post-launch follow-up task for honeypot/rate-limit.
  - Make sure UI/docs do not claim spam protection exists.

- [x] **T16 — Strengthen minimum booking validation**
  - Current service validates only artist name and links.
  - Decide launch required fields for the visible `/book` form.
  - Add validation for preferred date, message, expected draw bounds, and link length/format if required.
  - Return structured 400s or at least consistent error messages.
  - Add tests for missing artist, missing links, malformed date, excessive message length, and valid submission.

- [x] **T17 — Verify submission persistence and review path**
  - Confirm `POST /api/public/submissions` creates `status='pending'` rows.
  - Confirm staff endpoint `GET /api/app/bookings` can list created submissions.
  - Confirm review/approve/decline endpoints work with auth in a dev/staging setup.
  - Record that notification owner remains undecided.

- [x] **T18 — Prevent duplicate frontend submits**
  - Confirm `BookingForm` disables submit or otherwise prevents double-click while `isSubmitting` is true.
  - Add frontend test/story if missing.
  - If the shared component does not enforce this, update it or add page-level guard.

## Phase 5: Production auth/cookie exposure check

- [ ] **T19 — Ensure dev auth is disabled in production**
  - Confirm `PYXIS_DEV_AUTH` is unset/false in production.
  - Add a deployment checklist item.
  - Optionally add startup logging that warns if `PYXIS_DEV_AUTH=1`.
  - Use the `hair-booking` precedent: keep dev auth local-only while `auth-mode=oidc` owns production browser login.

- [ ] **T20 — Fix or gate secure cookie behavior for HTTPS production**
  - `pkg/server/auth.go` currently sets `Secure: false` with a TODO.
  - Add config for secure cookies, or infer from production mode/HTTPS proxy headers.
  - Use the `hair-booking` `shouldUseSecureCookies` pattern: request TLS, `X-Forwarded-Proto: https`, or HTTPS redirect URL should force `Secure` cookies.
  - Ensure Discord/OIDC callback and dev-login cookies cannot be insecure in production.
  - Add tests or a focused code review note.

- [ ] **T21 — Decide whether staff `/api/app/*` and `/auth/*` are exposed at launch**
  - If exposed, verify current Discord OAuth config and roles or replace it with a Keycloak/OIDC plan.
  - Decide whether Pyxis staff identity should use `pyxis-web`, `pyxis-staff-web`, or separate public/staff clients.
  - Decide whether roles remain local DB roles, Keycloak groups/realm roles, or a hybrid.
  - If not intended for public launch, restrict at proxy/router/deployment layer.
  - Document the decision.

## Phase 5A: Keycloak/OIDC follow-up from hair-booking precedent

- [ ] **T21A — Create a Pyxis Keycloak/OIDC implementation ticket**
  - Base the plan on `/home/manuel/code/wesen/hair-booking`.
  - Include local compose, realm import, OIDC callback/session design, role mapping, Terraform hosted client, and smoke tests.
  - Decide whether this is required for public launch or can follow after public-site launch if staff routes are hidden.

- [ ] **T21B — Prototype local Pyxis Keycloak fixture**
  - Add or design `docker-compose.local.yml` with app Postgres, Keycloak Postgres, and Keycloak.
  - Add `dev/keycloak/realm-import/pyxis-dev-realm.json` with admin/booker/door test users or role claims.
  - Include a port override analogous to `HAIR_BOOKING_KEYCLOAK_PORT`.

- [ ] **T21C — Design hosted Terraform resources**
  - Add a future `/home/manuel/code/wesen/terraform/keycloak/apps/pyxis` environment.
  - Include hosted redirect URI `https://pyxis.xyz/auth/callback` and logout callback if implemented.
  - Keep hosted Terraform state in the central infra repo, not the Pyxis app repo.

## Phase 6: SEO and public metadata

- [ ] **T22 — Decide SPA metadata strategy**
  - Explain current `Seo.tsx` behavior to Manuel.
  - Test whether rendering it actually updates `document.head` correctly.
  - Choose one:
    - accept generic `index.html` metadata for v1,
    - implement `react-helmet-async` or equivalent,
    - manually manage `document.title` and meta tags in route effects,
    - server-inject metadata for show detail.

- [ ] **T23 — Wire basic route metadata if chosen**
  - Add title/description for Shows, Show Detail, Archive, Book, Book Success, About, and Not Found.
  - Set `noindex` for Not Found if supported.
  - Verify with browser devtools.

- [ ] **T24 — Verify static SEO assets**
  - Confirm `web/packages/pyxis-user-site/public/robots.txt` domain is `https://pyxis.xyz`.
  - Confirm `sitemap.xml` exists and points to launch routes/domain.
  - Confirm referenced `og-default.png` exists or update the default image reference.

## Phase 7: Frontend production runtime polish

- [ ] **T25 — Remove production ambiguity around `VITE_API_URL`**
  - Document that production same-origin builds use blank `VITE_API_URL`.
  - Optionally add an `.env.production.example` with `VITE_API_URL=` and explanatory comments.
  - Ensure Vite dev proxy remains documented as dev-only.

- [ ] **T26 — Fix ShowDetail ticket/reserve data hardcoding**
  - `ShowDetailPage` currently passes hardcoded `ReserveTicketCard price="$10 – $15"`.
  - Decide launch behavior:
    - use `show.price`,
    - link to real ticket URL if available,
    - or hide/replace card when ticketing is not real.
  - Implement and test the chosen behavior.

- [ ] **T27 — Confirm production flyer URL behavior**
  - Verify uploaded flyers are served from `/flyers/*` or a future object-storage URL.
  - Verify missing/placeholder flyers use poster fallback.
  - Verify flyer lightbox works on mobile and desktop.

## Phase 8: Mobile, accessibility, and browser smoke

- [ ] **T28 — Manual responsive smoke pass**
  - Test widths: 375px, 768px, 920px, 1440px.
  - Pages: Shows, Show Detail, Archive, Book, Book Success, About, Not Found.
  - Verify forms, navigation, lightbox, and card grids.
  - Record screenshots or notes in the diary.

- [ ] **T29 — Accessibility smoke pass**
  - Keyboard through nav and booking form.
  - Verify focus states.
  - Verify labels/button names.
  - Run Storybook a11y build/check if available.
  - Fix launch-blocking issues.

- [ ] **T30 — Browser smoke pass**
  - Test Chrome.
  - Test Safari/iOS Safari if available.
  - Test Firefox.
  - Record browser-specific issues.

## Phase 9: Release candidate validation

- [ ] **T31 — Run complete static validation**
  - Run:
    - `go test ./... -count=1`
    - `cd web/packages/pyxis-components && pnpm exec tsc --noEmit`
    - `cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit`
    - `cd web/packages/pyxis-user-site && pnpm exec vite build`
    - `cd web/packages/pyxis-user-site && pnpm exec storybook build`
    - `make build-embed`

- [ ] **T32 — Run production-intent visual smoke**
  - Run public pages visual spec against production-intent data.
  - Keep broad Shows rows accepted unless new human feedback appears.
  - Record any launch-blocking visual regressions.

- [ ] **T33 — Deploy staging/release candidate**
  - Deploy the embedded Go binary with production-like DB and env.
  - Verify `https://pyxis.xyz` equivalent staging URL if available.
  - Verify same-origin API calls.
  - Verify route refresh.
  - Verify booking submission path.

- [ ] **T34 — Record rollback and disable-booking procedure**
  - Document how to roll back the binary/deployment.
  - Document how to disable booking submissions if spam or backend issues occur.
  - Document who owns production incident response.

- [ ] **T35 — Release owner sign-off**
  - Confirm production URL.
  - Confirm commit SHA/build artifact.
  - Confirm accepted risks.
  - Confirm content owner or temporary sign-off.
  - Mark ship/no-ship checklist complete.

## Phase 10: Post-launch follow-up

- [ ] **T36 — Monitor first production usage**
  - Check `/health`.
  - Check API errors/logs.
  - Check booking submissions.
  - Check frontend errors if instrumentation exists.
  - Check mobile/user feedback.

- [ ] **T37 — Create follow-up tickets for deferred risks**
  - Booking spam mitigation.
  - Booking notification owner/workflow.
  - Proper route/show-detail SEO if skipped.
  - Mobile visual-diff specs.
  - Richer lineup display schema.
  - Asset cache-control improvements.
