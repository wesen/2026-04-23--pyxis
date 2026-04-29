---

Title: Pyxis production deployment diary
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
DocType: diary
Type: diary
Status: active
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
Summary: Chronological notes for turning Pyxis into a production Glazed app deployed through the Hetzner k3s Argo CD GitOps repo.
---

# Pyxis production deployment diary

## Step 1: Created ticket and bounded the request

Created `PYXIS-PRODUCTION-ARGOCD-GLAZED` to plan the productionization of Pyxis as a real Glazed/Go application, packaged similarly to `/home/manuel/code/wesen/corporate-headquarters/discord-bot` and deployed through the Argo CD GitOps repository at `/home/manuel/code/wesen/2026-03-27--hetzner-k3s`.

The requested deliverable is documentation-first: a detailed analysis/design/implementation guide for a new intern, plus focused playbooks/docs in the ticket, then upload to reMarkable.

## Step 2: Collected reference surfaces

Inventoried the Pyxis repository, the `discord-bot` packaging/CI reference, and the k3s GitOps reference manifests/playbooks. Evidence was saved to:

```text
sources/01-deployment-reference-inventory.txt
```

Important references read:

- Pyxis `Makefile`, `cmd/pyxis/main.go`, `cmd/pyxis/cmds/serve.go`, `pkg/config/config.go`, `pkg/server/server.go`, `internal/web/static.go`, `docker-compose.yml`.
- `discord-bot` `Makefile`, `Dockerfile`, `.github/workflows/push.yml`, `.github/workflows/release.yaml`, `.github/workflows/lint.yml`, `.github/workflows/dependency-scanning.yml`, `.github/workflows/codeql-analysis.yml`, `.goreleaser.yaml`.
- k3s docs `app-packaging-and-gitops-pr-standard.md`, `public-repo-ghcr-argocd-deployment-playbook.md`, `vault-backed-postgres-bootstrap-job-pattern.md`.
- k3s reference app manifests for `hair-booking`, especially DB bootstrap, VaultStaticSecret, deployment, PVC, service, and ingress.

## Step 3: Wrote implementation guide and playbooks

Prepared the main intern-oriented guide under `design/01-pyxis-production-glazed-argocd-implementation-guide.md` and focused operational playbooks under `playbooks/`. The guide treats Pyxis as a single Go binary that embeds the public Vite site, serves staff/public APIs, uses PostgreSQL, writes flyer files to a PVC, authenticates staff through Discord OAuth, and optionally runs the embedded Discord bot.

## Step 4: Validation/publication

Ran `docmgr doctor --ticket PYXIS-PRODUCTION-ARGOCD-GLAZED --stale-after 30` and uploaded the documentation bundle to reMarkable after a dry-run.

## Step 5: Uploaded to reMarkable

Ran a dry-run first, then uploaded the bundle:

```bash
remarquee upload bundle --dry-run <guide-and-playbooks> --name "PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks" --remote-dir "/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED" --toc-depth 2
remarquee upload bundle <guide-and-playbooks> --name "PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks" --remote-dir "/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED" --toc-depth 2
```

Upload result:

```text
/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks
```

## Step 6: Clarified PostgreSQL provisioning decision and expanded task phases

The operator asked whether Pyxis should reuse the existing PostgreSQL service and whether database creation should happen through Terraform or a Postgres operator. I updated the implementation guide to make the v1 decision explicit:

- reuse the existing shared in-cluster PostgreSQL service;
- create the Pyxis database and role with an Argo CD synced Kubernetes bootstrap Job;
- store credentials in Vault and sync them with Vault Secrets Operator;
- do not use Terraform for the app database/user in this cluster-local GitOps rollout;
- do not introduce a Postgres operator for Pyxis v1, though it can be reconsidered later as a platform-level decision.

I also rewrote `tasks.md` into detailed phased work: Phase 1 packaging baseline, Phase 2 production configuration hardening, Phase 3 CI/CD, Phase 4 GitOps manifests, Phase 5 GitOps PR automation, and Phase 6 first production rollout.

## Step 7: Started Phase 1 application packaging baseline

Implemented the first productionization phase in the Pyxis app repo.

Files added:

```text
Dockerfile
.dockerignore
.golangci-lint-version
.golangci.yml
```

Files updated:

```text
Makefile
go.mod
go.sum
```

The Dockerfile is a multi-stage build:

1. `node:22-bookworm-slim` builds the pnpm web workspace packages and the public user-site bundle.
2. `golang:1.26-bookworm` downloads Go modules, copies the repo, overlays the built public site into `internal/web/embed/public`, and builds `pyxis` with the `embed` tag.
3. `debian:bookworm-slim` installs CA certificates, creates non-root user `appuser`, copies the binary and `bot/` scripts, creates `/data/flyers`, exposes 8080, and runs `pyxis serve` by default.

The Makefile now has production-oriented targets and variables:

```text
ci
web-check
docker-build
docker-run
docker-smoke
golangci-lint-install
lintmax
gosec
govulncheck
IMAGE_REPOSITORY
IMAGE_TAG
IMAGE
GOLANGCI_LINT_VERSION
```

### Issue 1: Docker build could not use local `replace` directives

First `make docker-build IMAGE_REPOSITORY=pyxis IMAGE_TAG=phase1-local` failed because `go.mod` had local replace directives:

```text
github.com/go-go-golems/discord-bot => ../corporate-headquarters/discord-bot
github.com/go-go-golems/go-go-goja => ../corporate-headquarters/go-go-goja
```

Inside a Docker build context those sibling directories do not exist. That is exactly the kind of hidden workstation coupling production packaging is meant to remove.

Fix:

- removed both local `replace` directives;
- changed `github.com/go-go-golems/discord-bot` from `v0.0.0` to published `v0.1.1`;
- kept `github.com/go-go-golems/go-go-goja` on published `v0.4.12`;
- ran `go mod tidy`.

Validation after this fix:

```bash
go test ./pkg/discordbot ./cmd/pyxis/... ./pkg/server ./pkg/service ./pkg/repository/postgres ./internal/web -count=1
```

### Issue 2: Docker web stage was missing root TypeScript config

Second Docker build failed in the `pyxis-types` build:

```text
error TS5083: Cannot read file '/src/web/tsconfig.json'.
```

The Dockerfile copied workspace packages and lockfiles but not `web/tsconfig.json`. Fix: copy `web/tsconfig.json` into the web build stage alongside `package.json`, lockfile, and workspace file.

### Issue 3: CGO-disabled binary broke Glazed help

`docker-smoke` initially failed when running `pyxis --help`:

```text
Binary was compiled with 'CGO_ENABLED=0', go-sqlite3 requires cgo to work. This is a stub
```

The Glazed help system uses an in-memory SQLite store through `go-sqlite3`, so a CGO-disabled binary can compile but fail immediately for help output. Fix: build the embedded binary and Docker image with `CGO_ENABLED=1`. The runtime image is Debian slim, so glibc is available for the dynamically linked binary.

This is an important production note: Pyxis is not currently a static `scratch`/distroless-CGO-off binary unless the help system is changed to avoid `go-sqlite3` or use a pure-Go SQLite driver.

### Phase 1 validation

Passed:

```bash
make web-check
go test ./pkg/server ./pkg/service ./pkg/repository/postgres ./internal/web -count=1
go test ./pkg/discordbot ./cmd/pyxis/... ./pkg/server ./pkg/service ./pkg/repository/postgres ./internal/web -count=1
BUILD_WEB_LOCAL=1 make build-embed
./bin/pyxis --help
make docker-build IMAGE_REPOSITORY=pyxis IMAGE_TAG=phase1-local
make docker-smoke IMAGE_REPOSITORY=pyxis IMAGE_TAG=phase1-local
```

`make docker-smoke` rebuilds the image and verifies both `pyxis --help` and `pyxis serve --help` inside the container.

## Step 8: Uploaded updated bundle after Phase 1 implementation

Uploaded a third reMarkable bundle after Phase 1 work because the implementation guide now includes two important packaging findings:

- Pyxis container builds must use published module versions rather than local `replace` directives.
- Pyxis currently requires `CGO_ENABLED=1` because Glazed help initializes `go-sqlite3`.

Upload path:

```text
/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks v3
```

## Step 9: Phase 2 production configuration hardening

Implemented the second productionization phase: make `pyxis serve` configurable from production environment variables instead of relying on local defaults or hard-coded flyer storage paths.

### Runtime configuration changes

Updated `cmd/pyxis/cmds/serve.go`:

- `--bind` now defaults from `PYXIS_BIND`, falling back to `0.0.0.0:8080`.
- `--db-url` now defaults from `PYXIS_DATABASE_URL`, falling back to the local Docker Compose DSN.
- Added `--flyer-storage-path`, defaulting from `PYXIS_FLYER_STORAGE_PATH` and falling back to `./data/flyers`.
- Added `--flyer-base-url`, defaulting from `PYXIS_FLYER_BASE_URL` and falling back to `/flyers`.
- `--discord-bot` now defaults from `PYXIS_DISCORD_BOT_ENABLED`.
- `--discord-sync-on-start` now defaults from `PYXIS_DISCORD_SYNC_ON_START`.
- `--discord-debug` now defaults from `PYXIS_DISCORD_DEBUG`.
- Added `envOrBool` parsing for `1/true/yes/y/on` and `0/false/no/n/off`.

Updated `pkg/config/config.go`:

- added `FlyerStoragePath`;
- added `FlyerBaseURL`;
- set local defaults in `DefaultConfig()`.

Updated `pkg/server/server.go`:

- creates `storage.NewLocalFlyerStore` from config instead of hard-coded `./data/flyers`;
- serves `/flyers/` from the configured storage path.

Added example production environment file:

```text
docs/deployment/pyxis-production-env.example
```

### Session secret audit

I inspected `pkg/server/auth.go` and `pkg/service/auth_service.go`. Current browser sessions are opaque random session IDs stored server-side in the PostgreSQL `sessions` table. The cookie stores only the session token. Because there is no signed/encrypted client-side session payload, a `PYXIS_SESSION_SECRET` is not required for the current implementation.

Production-relevant session settings today are:

- `PYXIS_SESSION_COOKIE_NAME`, now already supported;
- `Secure` cookie behavior, derived from TLS, `X-Forwarded-Proto: https`, or HTTPS Discord redirect URL;
- PostgreSQL persistence for session records.

If the session model changes later to signed client-side cookies, add `PYXIS_SESSION_SECRET` then. For the current server-side-session model, adding an unused secret would create false confidence.

### Validation

Passed:

```bash
go test ./cmd/pyxis/... ./pkg/server ./pkg/service ./pkg/repository/postgres ./internal/web -count=1
```

Validated env-backed defaults with a clean environment so local `.envrc` secrets were not included:

```bash
env -i PATH="$PATH" HOME="$HOME" \
  PYXIS_BIND=127.0.0.1:19090 \
  PYXIS_DATABASE_URL=postgres://example:secret@db.example/pyxis \
  PYXIS_FLYER_STORAGE_PATH=/data/flyers \
  PYXIS_FLYER_BASE_URL=/flyers \
  PYXIS_DISCORD_BOT_ENABLED=true \
  PYXIS_DISCORD_SYNC_ON_START=true \
  PYXIS_DISCORD_DEBUG=true \
  ./bin/pyxis serve --help
```

The help output showed the expected env-derived defaults for bind, DB URL, flyer storage path, flyer base URL, and Discord bool flags.

## Step 10: Revalidated embedded build and Docker smoke after Phase 2

After wiring env-backed production config, re-ran the packaging checks from Phase 1 to ensure the Docker/runtime surface still works:

```bash
BUILD_WEB_LOCAL=1 make build-embed
make docker-smoke IMAGE_REPOSITORY=pyxis IMAGE_TAG=phase2-local
```

Both passed. Logs were written to temporary files:

```text
/tmp/pyxis-phase2-build-embed.log
/tmp/pyxis-phase2-docker-smoke.log
```
