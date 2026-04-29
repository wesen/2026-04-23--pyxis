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

## Step 11: Phase 3 GitHub CI/CD and release automation

Implemented the third productionization phase: GitHub workflows for validation, image publishing, linting/security, Dependabot, and optional GoReleaser CLI artifacts.

### Files added

```text
.github/workflows/push.yml
.github/workflows/publish-image.yml
.github/workflows/lint.yml
.github/workflows/dependency-scanning.yml
.github/workflows/codeql-analysis.yml
.github/dependabot.yml
.goreleaser.yaml
docs/deployment/pyxis-ci-cd.md
```

### Makefile update

Added GoReleaser helper targets:

```text
goreleaser
release
tag-major
tag-minor
tag-patch
```

`goreleaser` defaults to snapshot/single-target mode for local validation:

```bash
make goreleaser
```

### Workflow summary

`push.yml` runs on PRs and main pushes. It sets up Go, pnpm/Node, installs web dependencies, runs `make generate`, checks generated diffs, runs `go test ./...`, runs `make web-check`, and builds the embedded binary with `BUILD_WEB_LOCAL=1 make build-embed`.

`publish-image.yml` builds the Docker image on PRs and pushes GHCR images on `main`. It tags with `sha-<commit>` plus branch/ref convenience tags. The GitOps repo should pin the `sha-...` tag.

`lint.yml` runs golangci-lint using `.golangci-lint-version`.

`dependency-scanning.yml` adds dependency review, `govulncheck`, and `gosec`.

`codeql-analysis.yml` adds CodeQL Go analysis.

`dependabot.yml` covers Go modules, GitHub Actions, and web npm dependencies under `/web`.

### Validation

Passed:

```bash
go test ./cmd/pyxis/... ./pkg/server ./pkg/service ./pkg/repository/postgres ./internal/web -count=1
goreleaser check
python3 - <<'PY'
from pathlib import Path
import yaml
for p in list(Path('.github/workflows').glob('*.yml')) + [Path('.github/dependabot.yml'), Path('.goreleaser.yaml'), Path('.golangci.yml')]:
    yaml.safe_load(p.read_text())
    print(f'ok {p}')
PY
```

`actionlint` is not installed on this machine, so workflow semantic linting with actionlint was recorded as unavailable:

```text
actionlint not installed
```

### GoReleaser config issue fixed

First `goreleaser check` failed because `snapshot.name_template` is deprecated in GoReleaser v2. Fixed by using:

```yaml
snapshot:
  version_template: "{{ incpatch .Version }}-next"
```

After that, `goreleaser check` passed.

## Step 12: Rechecked generated code and full Go tests

Because the new `push.yml` workflow includes `make generate` followed by a generated-code diff check, I ran the generation step locally:

```bash
make generate
```

It completed without introducing generated-code diffs. Then I ran the same broad Go test shape intended for CI:

```bash
go test ./... -count=1
```

This passed across command, generated proto, internal web, repository, server, service, Discord bot, and storage packages.

## Step 13: Uploaded updated Phase 3 bundle

Uploaded the updated guide/tasks/playbooks/diary after completing Phase 3 CI/CD work.

Upload path:

```text
/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks v4
```

## Step 14: Phase 4 GitOps package in the Hetzner k3s repo

Implemented the first Pyxis GitOps package in `/home/manuel/code/wesen/2026-03-27--hetzner-k3s`.

Created Argo CD application:

```text
gitops/applications/pyxis.yaml
```

Created Kustomize package:

```text
gitops/kustomize/pyxis/namespace.yaml
gitops/kustomize/pyxis/serviceaccount.yaml
gitops/kustomize/pyxis/db-bootstrap-serviceaccount.yaml
gitops/kustomize/pyxis/vault-connection.yaml
gitops/kustomize/pyxis/vault-auth.yaml
gitops/kustomize/pyxis/db-bootstrap-vault-auth.yaml
gitops/kustomize/pyxis/runtime-secret.yaml
gitops/kustomize/pyxis/image-pull-secret.yaml
gitops/kustomize/pyxis/postgres-admin-secret.yaml
gitops/kustomize/pyxis/db-bootstrap-script-configmap.yaml
gitops/kustomize/pyxis/db-bootstrap-job.yaml
gitops/kustomize/pyxis/migration-job.yaml
gitops/kustomize/pyxis/persistentvolumeclaim.yaml
gitops/kustomize/pyxis/deployment.yaml
gitops/kustomize/pyxis/service.yaml
gitops/kustomize/pyxis/ingress.yaml
gitops/kustomize/pyxis/kustomization.yaml
```

### Design notes

The package follows the existing `hair-booking` shape:

- namespace-scoped app resources under namespace `pyxis`;
- app service account `pyxis`;
- separate bootstrap service account `pyxis-db-bootstrap`;
- Vault Secrets Operator for runtime, image pull, and PostgreSQL admin secrets;
- idempotent PostgreSQL bootstrap Job using `postgres:16-alpine`;
- migration Job using the Pyxis image and `pyxis migrate --db-url $(PYXIS_DATABASE_URL) up`;
- PVC `pyxis-data` mounted at `/data` for flyer storage;
- Deployment with `PYXIS_FLYER_STORAGE_PATH=/data/flyers` and `PYXIS_FLYER_BASE_URL=/flyers`;
- Service on port 80 targeting container port 8080;
- Traefik/cert-manager Ingress for `pyxis.yolo.scapegoat.dev`.

The initial image is a placeholder:

```text
ghcr.io/wesen/pyxis:sha-REPLACE_ME
```

Phase 5 should replace this with CI/GitOps PR automation that writes a real `sha-<commit>` tag.

### Validation

Rendered Kustomize output:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
kubectl kustomize gitops/kustomize/pyxis >/tmp/pyxis-kustomize.yaml
```

Client dry-run passed:

```bash
kubectl apply --dry-run=client -k gitops/kustomize/pyxis
```

Saved evidence:

```text
sources/02-pyxis-gitops-client-dry-run.txt
sources/03-pyxis-gitops-kustomize-render.yaml
sources/04-pyxis-gitops-server-dry-run-note.txt
```

Server-side dry-run currently reports namespace-not-found for namespaced resources because the namespace is new and server-side dry-run does not persist the dry-run namespace object for subsequent resources in the same request. This is a validation caveat rather than a Kustomize render error. Argo CD sync has `CreateNamespace=true`, and the package includes `namespace.yaml`.

Committed the k3s repo change:

```text
816a0f9 PYXIS: add argocd gitops package
```

## Step 15: Uploaded updated Phase 4 bundle

Uploaded the updated guide/tasks/playbooks/diary after completing the k3s GitOps package.

Upload path:

```text
/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks v5
```
