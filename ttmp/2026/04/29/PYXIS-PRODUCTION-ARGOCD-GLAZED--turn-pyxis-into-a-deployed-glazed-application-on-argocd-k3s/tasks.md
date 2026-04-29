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

- [ ] T201. Add env-backed default for `--db-url` using `PYXIS_DATABASE_URL`.
- [ ] T202. Add env-backed defaults for `--bind`, Discord bot enablement, and Discord sync/debug flags if missing.
- [ ] T203. Add configurable flyer storage root/public prefix (`PYXIS_FLYER_STORAGE_LOCAL_DIR`, `PYXIS_FLYER_PUBLIC_PREFIX`) and wire `storage.NewLocalFlyerStore` from config.
- [ ] T204. Audit session cookie/session secret production readiness; add `PYXIS_SESSION_SECRET` support if required by current auth implementation.
- [ ] T205. Add/adjust health/readiness endpoint behavior if `/health` should include DB readiness versus shallow process liveness.
- [ ] T206. Add production config documentation and example env file without secrets.
- [ ] T207. Validate local `pyxis serve` using env-only configuration.

## Phase 3 — GitHub CI/CD and release automation

Goal: make GitHub the source of tested images and optional CLI release artifacts.

- [ ] T301. Add `.github/workflows/push.yml` for Go tests, web TypeScript/build checks, generation checks, and embedded binary build.
- [ ] T302. Add `.github/workflows/publish-image.yml` to build and push `ghcr.io/.../pyxis:sha-<commit>` on `main`.
- [ ] T303. Add `.github/workflows/lint.yml` using golangci-lint.
- [ ] T304. Add `.github/workflows/dependency-scanning.yml` with dependency review, govulncheck, and gosec.
- [ ] T305. Add `.github/workflows/codeql-analysis.yml` for Go.
- [ ] T306. Add Dependabot config for Go modules and GitHub Actions; decide pnpm policy.
- [ ] T307. Add `.goreleaser.yaml` for Pyxis CLI artifacts if approved.
- [ ] T308. Add local/CI documentation for required GitHub secrets and package visibility.
- [ ] T309. Verify CI workflow syntax and run locally where possible.

## Phase 4 — GitOps package in `../2026-03-27--hetzner-k3s`

Goal: define desired cluster state for Pyxis in the GitOps repo.

- [ ] T401. Create `gitops/kustomize/pyxis/namespace.yaml`.
- [ ] T402. Create app and DB-bootstrap service accounts.
- [ ] T403. Create Vault connection/auth manifests for Pyxis runtime and DB bootstrap.
- [ ] T404. Create VaultStaticSecret for `apps/pyxis/prod/runtime`.
- [ ] T405. Create VaultStaticSecret for shared PostgreSQL admin credentials.
- [ ] T406. Create idempotent DB bootstrap ConfigMap script for database `pyxis` and role `pyxis_app`.
- [ ] T407. Create DB bootstrap Job with Argo hook/sync-wave annotations.
- [ ] T408. Create migration Job using the same Pyxis image and `pyxis migrate up`.
- [ ] T409. Create PVC for `/data` flyer storage.
- [ ] T410. Create Deployment using GHCR image, runtime secrets, `/data` mount, probes, and resource requests/limits.
- [ ] T411. Create Service.
- [ ] T412. Create Ingress for `pyxis.yolo.scapegoat.dev` with cert-manager/Traefik annotations.
- [ ] T413. Create `kustomization.yaml` with correct resource ordering.
- [ ] T414. Create `gitops/applications/pyxis.yaml` Argo CD Application.
- [ ] T415. Run `kubectl kustomize` and server-side dry-run.

## Phase 5 — GitOps PR automation

Goal: connect successful app image publication to reviewed GitOps image bumps.

- [ ] T501. Add `deploy/gitops-targets.json` describing the Pyxis deployment target manifest/container.
- [ ] T502. Add `scripts/open_gitops_pr.py` with dry-run support.
- [ ] T503. Add CI job/step that opens a GitOps PR after image publish.
- [ ] T504. Add `GITOPS_PR_TOKEN` setup documentation.
- [ ] T505. Validate script against a temporary branch or dry-run checkout.

## Phase 6 — First production rollout

Goal: safely bring Pyxis live under Argo CD.

- [ ] T601. Write/verify Vault secrets for Pyxis runtime and DB bootstrap.
- [ ] T602. Merge GitOps package PR.
- [ ] T603. One-time apply `gitops/applications/pyxis.yaml` if app-of-apps does not materialize it automatically.
- [ ] T604. Watch Argo CD sync and Kubernetes rollout.
- [ ] T605. Validate `/health`, public pages, public APIs, and embedded static assets.
- [ ] T606. Validate DB bootstrap and migrations; confirm `show_logs` exists.
- [ ] T607. Validate flyer upload persistence on PVC.
- [ ] T608. Validate Discord OAuth after bot is installed in guild and role mapping secrets are present.
- [ ] T609. Validate optional embedded Discord bot only after web/auth rollout is stable.
- [ ] T610. Record production smoke evidence and rollback instructions.
