---
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
Title: Turn Pyxis into a deployed Glazed application on ArgoCD k3s
Status: active
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
---

# Tasks

## Phase 0 — Research, decisions, and publication

- [x] T001. Create docmgr ticket workspace.
- [x] T002. Inventory current Pyxis build/runtime surfaces and comparable reference apps.
- [x] T003. Read the `corporate-headquarters/discord-bot` Makefile, Dockerfile, GoReleaser, and CI workflows.
- [x] T004. Read the Hetzner k3s GitOps playbooks and reference manifests for app deployment.
- [x] T005. Write a detailed intern-oriented production deployment analysis/design/implementation guide.
- [x] T006. Add focused playbooks/docs inside the ticket for implementation operators.
- [x] T007. Clarify PostgreSQL decision: reuse existing shared in-cluster PostgreSQL; create Pyxis DB/user through an Argo-synced bootstrap Job; do not use Terraform or a Postgres operator for v1.
- [x] T008. Upload the guide/playbook bundle to reMarkable.

## Phase 1 — Application packaging baseline

Goal: make Pyxis buildable as a production container from the app repo without touching the k3s repo yet.

- [x] T101. Add `.dockerignore` that excludes local artifacts, node_modules, Storybook outputs, temporary screenshots, ticket scratch output, and runtime flyer data.
- [x] T102. Add a multi-stage `Dockerfile` that builds the public web bundle, embeds it in the Go binary, copies bot scripts, creates a non-root runtime user, exposes port 8080, and provides `/data/flyers` for runtime storage.
- [x] T103. Expand `Makefile` with production variables (`IMAGE_REPOSITORY`, `IMAGE_TAG`, `GOLANGCI_LINT_*`) and targets (`ci`, `web-check`, `docker-build`, `docker-run`, `docker-smoke`, `gosec`, `govulncheck`, `golangci-lint-install`, `lintmax`).
- [x] T104. Add `.golangci-lint-version` and `.golangci.yml` baseline config compatible with the repo.
- [x] T105. Validate `make web-check`.
- [x] T106. Validate targeted Go tests.
- [x] T107. Validate `make build-embed`.
- [x] T108. Validate Docker build if Docker is available locally; otherwise record blocker and exact command.
- [x] T109. Record Phase 1 implementation diary and commit the packaging baseline without unrelated runtime artifacts.

## Phase 2 — Production configuration hardening

Goal: make the Glazed `serve` command consume production env vars cleanly.

- [x] T201. Add env-backed default for `--db-url` using `PYXIS_DATABASE_URL`.
- [x] T202. Add env-backed defaults for `--bind`, Discord bot enablement, and Discord sync/debug flags if missing.
- [x] T203. Add configurable flyer storage root/public prefix (`PYXIS_FLYER_STORAGE_LOCAL_DIR`, `PYXIS_FLYER_PUBLIC_PREFIX`) and wire `storage.NewLocalFlyerStore` from config.
- [x] T204. Audit session cookie/session secret production readiness; add `PYXIS_SESSION_SECRET` support if required by current auth implementation.
- [x] T205. Add/adjust health/readiness endpoint behavior if `/health` should include DB readiness versus shallow process liveness.
- [x] T206. Add production config documentation and example env file without secrets.
- [x] T207. Validate local `pyxis serve` using env-only configuration.

## Phase 3 — GitHub CI/CD and release automation

Goal: make GitHub the source of tested images and optional CLI release artifacts.

- [x] T301. Add `.github/workflows/push.yml` for Go tests, web TypeScript/build checks, generation checks, and embedded binary build.
- [x] T302. Add `.github/workflows/publish-image.yml` to build and push `ghcr.io/.../pyxis:sha-<commit>` on `main`.
- [x] T303. Add `.github/workflows/lint.yml` using golangci-lint.
- [x] T304. Add `.github/workflows/dependency-scanning.yml` with dependency review, govulncheck, and gosec.
- [x] T305. Add `.github/workflows/codeql-analysis.yml` for Go.
- [x] T306. Add Dependabot config for Go modules and GitHub Actions; decide pnpm policy.
- [x] T307. Add `.goreleaser.yaml` for Pyxis CLI artifacts if approved.
- [x] T308. Add local/CI documentation for required GitHub secrets and package visibility.
- [x] T309. Verify CI workflow syntax and run locally where possible.

## Phase 4 — GitOps package in `../2026-03-27--hetzner-k3s`

Goal: define desired cluster state for Pyxis in the GitOps repo.

- [x] T401. Create `gitops/kustomize/pyxis/namespace.yaml`.
- [x] T402. Create app and DB-bootstrap service accounts.
- [x] T403. Create Vault connection/auth manifests for Pyxis runtime and DB bootstrap.
- [x] T404. Create VaultStaticSecret for `apps/pyxis/prod/runtime`.
- [x] T405. Create VaultStaticSecret for shared PostgreSQL admin credentials.
- [x] T406. Create idempotent DB bootstrap ConfigMap script for database `pyxis` and role `pyxis_app`.
- [x] T407. Create DB bootstrap Job with Argo hook/sync-wave annotations.
- [x] T408. Create migration Job using the same Pyxis image and `pyxis migrate up`.
- [x] T409. Create PVC for `/data` flyer storage.
- [x] T410. Create Deployment using GHCR image, runtime secrets, `/data` mount, probes, and resource requests/limits.
- [x] T411. Create Service.
- [x] T412. Create Ingress for `pyxis.yolo.scapegoat.dev` with cert-manager/Traefik annotations.
- [x] T413. Create `kustomization.yaml` with correct resource ordering.
- [x] T414. Create `gitops/applications/pyxis.yaml` Argo CD Application.
- [x] T415. Run `kubectl kustomize` and server-side dry-run.

## Phase 5 — GitOps PR automation

Goal: connect successful app image publication to reviewed GitOps image bumps.

- [x] T501. Add `deploy/gitops-targets.json` describing the Pyxis deployment target manifest/container.
- [x] T502. Add `scripts/open_gitops_pr.py` with dry-run support.
- [x] T503. Add CI job/step that opens a GitOps PR after image publish.
- [x] T504. Add `GITOPS_PR_TOKEN` setup documentation.
- [x] T505. Validate script against a temporary branch or dry-run checkout.

## Phase 6 — First production rollout

Goal: safely bring Pyxis live under Argo CD.

- [x] T601. Write/verify Vault secrets for Pyxis runtime and DB bootstrap.
- [x] T602. Merge GitOps package PR.
- [x] T603. One-time apply `gitops/applications/pyxis.yaml` if app-of-apps does not materialize it automatically.
- [x] T604. Watch Argo CD sync and Kubernetes rollout.
- [x] T605. Validate `/health`, public pages, public APIs, and embedded static assets.
- [x] T606. Validate DB bootstrap and migrations; confirm `show_logs` exists.
- [x] T607. Validate flyer upload persistence on PVC.
- [ ] T608. Validate Discord OAuth after bot is installed in guild and role mapping secrets are present.
- [ ] T609. Validate optional embedded Discord bot only after web/auth rollout is stable.
- [ ] T610. Record production smoke evidence and rollback instructions.

## Phase 7 — Bundle and deploy the staff/admin app

Goal: make the React staff app (`web/packages/pyxis-app`) available in production without breaking the public site at `/`.

- [x] T701. Decide and document the production staff-app route prefix; default proposal: serve `pyxis-app` under `/app/` while keeping the public site under `/`.
- [x] T702. Update `pyxis-app` router/build configuration for the chosen basename/base path (`/app`) so refreshes and static assets work behind the Go server.
- [x] T703. Extend the web build pipeline to build `pyxis-types`, `pyxis-components`, `pyxis-user-site`, and `pyxis-app` in the correct dependency order.
- [x] T704. Extend `cmd/build-web` and/or add a sibling build step so the staff app dist is copied into a separate embed tree, for example `internal/web/embed/app`.
- [x] T705. Add Go embed/static handler support for two SPAs: public site fallback for `/` routes and staff app fallback for `/app/*` routes.
- [x] T706. Ensure reserved backend paths (`/api/*`, `/auth/*`, `/health`, `/flyers/*`) never fall through to either SPA incorrectly.
- [x] T707. Update the Dockerfile to copy/build the staff app dist into the production binary image.
- [x] T708. Add tests for staff app static serving, `/app/*` refresh fallback, and public-site fallback coexistence.
- [x] T709. Update login/return-to handling so unauthenticated staff routes redirect to `/app/login?return_to=...` and Discord callback returns to `/app/...` safely.
- [x] T710. Rebuild and smoke the embedded binary locally (`BUILD_WEB_LOCAL=1 make build-embed`) with both SPAs present.
- [x] T711. Build and smoke the Docker image locally with both public and staff app routes.
- [ ] T712. Update production documentation and the Discord setup guide to use `/app` staff URLs where appropriate.
- [ ] T713. Publish a new image, let GitOps PR automation update the deployment/migration job image, merge, and confirm Argo CD rolls out the new image.
- [ ] T714. Production-smoke `/app/login`, a protected `/app/*` route redirect, `GET /api/app/session`, and a real Discord login once guild/bot prerequisites are satisfied.

## Phase 8 — Seed production database content and flyer graphics

Goal: seed initial Pyxis content and flyer assets in a repeatable, non-destructive, GitOps-friendly way.

- [ ] T801. Define the production seed scope: which shows, artists, submissions, settings, show logs, and flyer graphics should exist initially.
- [x] T802. Inventory existing seed inputs (`fixtures/dev.sql`, `data/flyers/show-1/seed-flyer.svg`, local flyer artifacts under `data/flyers/show-19/` and `data/flyers/show-24/`) and decide which are production-safe.
- [x] T803. Fix the current seed command/fixture drift from the ShowLog migration: replace `attendance_logs` references with `show_logs` and update seed count reporting.
- [ ] T804. Split destructive local development fixtures from production seed data; production seeding must be idempotent and must not `TRUNCATE` live tables.
- [ ] T805. Add a production seed fixture format, preferably declarative JSON/YAML plus Go import logic, or a carefully reviewed SQL file using `INSERT ... ON CONFLICT`.
- [ ] T806. Add `pyxis seed` options for production-safe mode, dry-run/report mode, and explicit fixture path; refuse destructive fixtures unless an explicit local/dev flag is present.
- [ ] T807. Package seed flyer graphics in a predictable source directory, for example `fixtures/flyers/`, with stable filenames that match seeded `shows.flyer_url` values.
- [ ] T808. Add a seed-assets command or Kubernetes Job step that copies bundled flyer graphics into the PVC at `/data/flyers` without overwriting existing uploaded files unless explicitly requested.
- [ ] T809. Add a GitOps seed Job manifest, gated as a manual/sync hook or one-shot job, that runs after migrations and before production smoke.
- [ ] T810. Ensure the seed Job uses the same image tag as the app Deployment and mounts the same `pyxis-data` PVC.
- [ ] T811. Add seed verification queries: count seeded shows/artists, verify `show_logs` rows, verify expected `flyer_url` values, and verify files exist under `/data/flyers`.
- [ ] T812. Add HTTP smoke for seeded content: public show list/detail pages and direct `/flyers/...` URLs.
- [ ] T813. Define rollback behavior for seed mistakes: restore DB snapshot, delete seeded rows by stable seed IDs/markers, and remove seeded flyer files from PVC.
- [ ] T814. Document operator workflow for running seed in production, including required approvals and how to avoid running destructive dev fixtures.
- [ ] T815. Run seed once in production after backup/snapshot confirmation and record evidence in the ticket.
- [ ] T816. Decide whether future seeds should be GitOps-managed one-shot Jobs, application CLI commands run manually, or an admin-app import workflow.
