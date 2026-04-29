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

## Step 16: Phase 5 GitOps PR automation

This step connected the image publishing workflow from Phase 3 to the GitOps manifests from Phase 4. The intent is to make every successful `main` image publish propose an explicit GitOps pull request instead of relying on a human to remember which manifests need image bumps.

The implementation updates both runtime image sites: the normal `Deployment` container and the migration `Job` container. That keeps the rollout and schema migration image in lockstep for each source commit.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the next phase of the Pyxis productionization plan after completing Phase 4.

**Inferred user intent:** Finish the remaining CI-to-GitOps automation work so published Pyxis images can be promoted through reviewed GitOps PRs.

**Commit (code):** 9a768db — "PYXIS-PRODUCTION-ARGOCD-GLAZED: add gitops pr automation"

### What I did

- Added `deploy/gitops-targets.json` with two targets:
  - `pyxis-prod-app` for `gitops/kustomize/pyxis/deployment.yaml`, container `pyxis`.
  - `pyxis-prod-migrate` for `gitops/kustomize/pyxis/migration-job.yaml`, container `migrate`.
- Added `scripts/open_gitops_pr.py`.
- Updated `.github/workflows/publish-image.yml` so a push to `main` opens GitOps image-bump PRs after publishing the GHCR image.
- Documented the workflow and required secret in `docs/deployment/pyxis-ci-cd.md`.
- Saved dry-run evidence in `sources/05-gitops-pr-script-dry-run.txt`.

### Why

- The app repo should own image publishing and the handoff into GitOps.
- The k3s GitOps repo should remain the source of truth for runtime manifests.
- A normal PR is easier to review and roll back than an automatic in-cluster image updater.

### What worked

- The script successfully found and patched both target image fields in dry-run mode.
- The dry-run diff showed only the expected image-line changes.
- `python3 -m py_compile scripts/open_gitops_pr.py` passed.
- `python3 -m json.tool deploy/gitops-targets.json` passed.
- YAML parsing for all GitHub workflows passed after editing `publish-image.yml`.

### What didn't work

- The first local dry-run mutated files in the existing GitOps checkout because the script patched files before returning in `--dry-run` mode.
- Exact recovery command:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
git checkout -- gitops/kustomize/pyxis/deployment.yaml gitops/kustomize/pyxis/migration-job.yaml
```

- Fixed by storing the original manifest text before patching and restoring it before returning from dry-run mode.

### What I learned

- Dry-run support must be non-mutating even when it operates against an existing checkout rather than a disposable clone.
- Pyxis has two image-bearing GitOps manifests that must stay aligned: app deployment and migration job.

### What was tricky to build

- The updater intentionally avoids a full YAML rewrite because that would reorder or reformat GitOps manifests and make PRs harder to review.
- Instead it performs a narrow text patch: find `- name: <container>` and replace the following `image:` line.
- The sharp edge is making that narrow patch safe enough to fail if the container/image shape is not found, while still keeping dry-run non-mutating.

### What warrants a second pair of eyes

- Review `scripts/open_gitops_pr.py` parsing logic to confirm it handles the manifest style we expect and fails safely on future structure changes.
- Review `.github/workflows/publish-image.yml` secret handling and whether `GITOPS_PR_TOKEN` should be required immediately or temporarily disabled until the repository secret is installed.
- Review target repo owner/image owner assumptions: the current image is `ghcr.io/${{ github.repository_owner }}/pyxis`, while GitOps placeholder currently uses `ghcr.io/wesen/pyxis`.

### What should be done in the future

- Add the repository secret with `gh secret set GITOPS_PR_TOKEN --repo wesen/pyxis` or the actual Pyxis repo slug.
- Run the workflow once on `main` and verify that it opens two clean GitOps PRs or one PR per target as expected.
- Consider grouping multiple targets in the same GitOps repo into one PR if PR volume becomes noisy.

### Code review instructions

- Start with `deploy/gitops-targets.json` to verify target paths and container names.
- Then inspect `scripts/open_gitops_pr.py`, especially `patch_container_image()` and `process_target()`.
- Then inspect `.github/workflows/publish-image.yml` to confirm the workflow passes `GITOPS_PR_TOKEN`, `GH_TOKEN`, and the immutable `sha-${{ github.sha }}` image.
- Validate locally with:

```bash
python3 -m py_compile scripts/open_gitops_pr.py
python3 -m json.tool deploy/gitops-targets.json
python3 scripts/open_gitops_pr.py \
  --image ghcr.io/wesen/pyxis:sha-testphase5 \
  --gitops-root /home/manuel/code/wesen/2026-03-27--hetzner-k3s \
  --dry-run
```

### Technical details

Dry-run evidence showed the expected changes:

```diff
-          image: ghcr.io/wesen/pyxis:sha-REPLACE_ME
+          image: ghcr.io/wesen/pyxis:sha-testphase5
```

for both:

```text
gitops/kustomize/pyxis/deployment.yaml
gitops/kustomize/pyxis/migration-job.yaml
```

## Step 17: Hardened GitOps PR script logging

After writing the updater, I noticed a credential-safety issue before committing: clone commands can include the GitOps token when a private target repository needs authenticated clone/push access. Even though Pyxis' current GitOps repo may be readable, scripts should not rely on that staying true.

I changed the command runner so it redacts `GITOPS_PR_TOKEN` before printing commands or command failure output. Then I reran py_compile and the local dry-run with a fake `GITOPS_PR_TOKEN` value to make sure the normal dry-run path still worked and left the GitOps checkout clean.

### Prompt Context

**User prompt (verbatim):** (same as Step 16)

**Assistant interpretation:** Continue implementing Phase 5 while keeping the implementation diary current.

**Inferred user intent:** Ensure the CI automation is robust enough for production use and the work is auditable.

**Commit (code):** 9a768db — "PYXIS-PRODUCTION-ARGOCD-GLAZED: add gitops pr automation"

### What I did

- Added `redact()` to `scripts/open_gitops_pr.py`.
- Updated `run()` to print redacted commands and redacted failure output.
- Re-ran:

```bash
python3 -m py_compile scripts/open_gitops_pr.py
GITOPS_PR_TOKEN=secret-token python3 scripts/open_gitops_pr.py \
  --image ghcr.io/wesen/pyxis:sha-testphase5 \
  --gitops-root /home/manuel/code/wesen/2026-03-27--hetzner-k3s \
  --dry-run
```

### Why

- CI logs must not expose credentials.
- The GitOps PR token is powerful enough to push branches and open PRs, so it must be treated as secret in every log path.

### What worked

- The script still compiled.
- The dry-run still produced only the two expected image diffs.
- The k3s checkout remained clean except for unrelated local `.codex` and `.playwright-mcp/` artifacts.

### What didn't work

- N/A after the redaction change; this was a pre-commit hardening step.

### What I learned

- Even helper scripts that are primarily run in CI should assume command echoing can become an accidental secret leak.

### What was tricky to build

- The script uses a central `run()` helper, so redaction could be handled in one place rather than at every call site.
- The remaining risk is command output from external tools; the failure path now redacts captured stdout before printing it.

### What warrants a second pair of eyes

- Confirm that using token-authenticated HTTPS clone/push is acceptable, or switch to GitHub App credentials later.
- Confirm GitHub Actions' own secret masking also masks `GITOPS_PR_TOKEN` in any downstream tool output.

### What should be done in the future

- Consider replacing a PAT with a least-privilege GitHub App installation token if this pattern expands to many app repos.

### Code review instructions

- Review `redact()` and `run()` in `scripts/open_gitops_pr.py`.
- Validate by running the script with a fake `GITOPS_PR_TOKEN` and verifying the token never appears in logs.

### Technical details

The local dry-run command used a fake token value:

```bash
GITOPS_PR_TOKEN=secret-token python3 scripts/open_gitops_pr.py --image ghcr.io/wesen/pyxis:sha-testphase5 --gitops-root /home/manuel/code/wesen/2026-03-27--hetzner-k3s --dry-run
```

## Step 18: Uploaded updated Phase 5 bundle

Uploaded the updated production guide bundle after finishing and documenting Phase 5 GitOps PR automation.

Upload path:

```text
/ai/2026/04/29/PYXIS-PRODUCTION-ARGOCD-GLAZED/PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks v6
```

### Prompt Context

**User prompt (verbatim):** (same as Step 16)

**Assistant interpretation:** Continue keeping the reMarkable handoff current after implementation work.

**Inferred user intent:** Keep the production guide and diary available on-device for review.

**Commit (code):** N/A — documentation publication step.

### What I did

- Ran `remarquee upload bundle --dry-run` for the v6 bundle.
- Ran the actual `remarquee upload bundle` command.

### Why

- The reMarkable copy should include the latest Phase 5 diary entries and tasks.

### What worked

- Dry-run showed the expected bundle inputs.
- Upload completed successfully.

### What didn't work

- N/A.

### What I learned

- N/A.

### What was tricky to build

- N/A.

### What warrants a second pair of eyes

- N/A.

### What should be done in the future

- Upload a new bundle after Phase 6 rollout notes are added.

### Code review instructions

- N/A.

### Technical details

Bundle name:

```text
PYXIS-PRODUCTION-ARGOCD-GLAZED production guide and playbooks v6
```

## Step 19: Fixed CI Git author identity for GitOps PR commits

After confirming `GITOPS_PR_TOKEN` exists and pushing the Phase 5 work, the first `publish-image` workflow successfully built/pushed the image and reached the GitOps PR handoff. The handoff failed at `git commit` because the fresh GitHub runner clone had no author identity configured.

I fixed the updater script to configure a local Git author name and email inside each cloned GitOps checkout before creating the deployment branch. This keeps the fix self-contained in the script instead of relying on every workflow caller to remember Git config setup.

### Prompt Context

**User prompt (verbatim):** "GITOPS_PR_TOKEN is set"

**Assistant interpretation:** Proceed with the release handoff now that the required GitHub secret exists.

**Inferred user intent:** Push the CI/GitOps automation through a real GitHub Actions run and fix any remaining workflow issues.

**Commit (code):** pending — Git author fix implemented before commit.

### What I did

- Verified the secret exists with:

```bash
gh secret list --repo wesen/2026-04-23--pyxis | rg '^GITOPS_PR_TOKEN\b'
```

- Pushed both repos:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s && git push origin main
cd /home/manuel/code/wesen/2026-04-23--pyxis && git push origin main
```

- Watched `publish-image` run `25123190533`.
- Inspected failed logs with:

```bash
gh run view 25123190533 --log-failed
```

- Updated `scripts/open_gitops_pr.py` to run:

```bash
git config user.name pyxis-ci
git config user.email pyxis-ci@users.noreply.github.com
```

inside the cloned GitOps repo before `git checkout -b` and `git commit`.

### Why

- GitHub-hosted runners do not necessarily have a useful Git commit identity for arbitrary cloned repositories.
- The GitOps PR script owns branch/commit creation, so it should own the commit identity too.

### What worked

- The workflow got past token validation, clone, image patching, and diff generation.
- Token redaction worked in CI logs: the authenticated clone URL was shown as redacted.
- The image tag being proposed was the immutable full SHA tag:

```text
ghcr.io/wesen/pyxis:sha-39e5062a4d6d88c8ca3389b1a6974f3c425843f0
```

### What didn't work

The first real `publish-image` handoff failed with:

```text
Author identity unknown

*** Please tell me who you are.

Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: empty ident name (for <runner@...>) not allowed
error: Command '['git', 'commit', '-m', 'pyxis-prod-app: deploy ghcr.io/wesen/pyxis:sha-39e5062a4d6d88c8ca3389b1a6974f3c425843f0']' returned non-zero exit status 128.
```

### What I learned

- The remaining CI/CD bug was not credentials or GitHub permissions; it was local Git author identity inside the temporary GitOps clone.

### What was tricky to build

- The script supports both CI clones and local `--gitops-root` validation. The author config should only be forced for CI-managed clones so local dry-run/checkouts do not unexpectedly alter developer repo configuration.

### What warrants a second pair of eyes

- Confirm the chosen author identity `pyxis-ci <pyxis-ci@users.noreply.github.com>` is acceptable for GitOps repo history.
- Confirm whether the script should eventually create one combined PR for both image targets instead of one PR per target.

### What should be done in the future

- Re-run the image publishing workflow after this fix is pushed.
- Verify that GitOps PRs are created and point to the new full SHA image.

### Code review instructions

- Review `scripts/open_gitops_pr.py` around `process_target()` and argument defaults for `--git-user-name` / `--git-user-email`.
- Validate with:

```bash
python3 -m py_compile scripts/open_gitops_pr.py
GITOPS_PR_TOKEN=secret-token python3 scripts/open_gitops_pr.py \
  --image ghcr.io/wesen/pyxis:sha-testphase5 \
  --gitops-root /home/manuel/code/wesen/2026-03-27--hetzner-k3s \
  --dry-run
```

### Technical details

Failed workflow:

```text
https://github.com/wesen/2026-04-23--pyxis/actions/runs/25123190533
```

## Step 20: URL-encoded GitOps token in HTTPS Git remote

The next real `publish-image` run passed the Git author step and failed at `git push`. The runner was using the token-bearing HTTPS remote, but GitHub rejected it as an invalid username or token. Since the secret exists and is masked in logs, the safest script-side fix is to URL-encode the token before embedding it in the remote URL; otherwise any token character with URL authority meaning can corrupt the clone/push URL.

This does not prove the token has the right permissions. If the next run still fails, the remaining likely cause is token scope/repository access rather than script formatting.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue debugging the real GitHub Actions GitOps PR handoff after the user pasted the push-authentication failure.

**Inferred user intent:** Get the CI-created GitOps PR flow working end-to-end now that the token exists.

**Commit (code):** pending — URL-encoding fix implemented before commit.

### What I did

- Updated `scripts/open_gitops_pr.py` to import `urllib.parse.quote`.
- Changed `repo_url()` so `GITOPS_PR_TOKEN` is URL-encoded before being inserted as the HTTPS basic-auth password.
- Revalidated syntax and local dry-run:

```bash
python3 -m py_compile scripts/open_gitops_pr.py
python3 -m json.tool deploy/gitops-targets.json >/dev/null
GITOPS_PR_TOKEN='secret/token@with:chars' python3 scripts/open_gitops_pr.py \
  --image ghcr.io/wesen/pyxis:sha-testphase5 \
  --gitops-root /home/manuel/code/wesen/2026-03-27--hetzner-k3s \
  --dry-run
```

### Why

- A Git token embedded in a URL must be URL-escaped.
- The GitHub Actions log only shows a redacted remote, so the actual token shape cannot be inspected from CI logs.

### What worked

- The script still compiles.
- Dry-run mode still patches both expected manifests and restores them afterward.
- Redaction still protects the fake token in command output.

### What didn't work

The real workflow failure pasted by the user was:

```text
+ git push --set-upstream origin deploy/pyxis-prod-app/sha-96ce1bf7fa27ef423905f44616f2b3d1d3ecab51
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed for 'https://github.com/wesen/2026-03-27--hetzner-k3s.git/'
error: Command '['git', 'push', '--set-upstream', 'origin', 'deploy/pyxis-prod-app/sha-96ce1bf7fa27ef423905f44616f2b3d1d3ecab51']' returned non-zero exit status 128.
```

### What I learned

- The workflow has now progressed through build, image push, clone, patch, commit, and is failing specifically on authenticated push to the GitOps repo.

### What was tricky to build

- The logged remote is redacted by both our script and GitHub, which is correct for safety but means debugging has to proceed by hardening the URL construction and then, if needed, checking token scopes out-of-band.

### What warrants a second pair of eyes

- If the next workflow still fails, verify the secret value is a PAT or GitHub App token with write access to `wesen/2026-03-27--hetzner-k3s` contents and pull requests.
- Confirm the token was set on repo `wesen/2026-04-23--pyxis`, not only in an environment or another repo.

### What should be done in the future

- Prefer a GitHub App installation token with narrowly scoped access to the GitOps repo once this flow stabilizes.

### Code review instructions

- Review `repo_url()` in `scripts/open_gitops_pr.py`.
- Confirm the token is escaped with `quote(token, safe='')` and still redacted before printing.

### Technical details

The URL construction now uses:

```python
quote(token, safe='')
```

## Step 21: Fixed GitOps image tag length mismatch

After refreshing the GitOps token and rerunning the workflow, the GitOps PR handoff succeeded and opened PRs. I merged the two generated PRs, applied the Argo CD Application, and watched the first sync. Vault secret synchronization and the database bootstrap job worked, but the migration Job could not pull the image.

The problem was a tag contract mismatch: `docker/metadata-action` publishes `sha-<short-sha>` by default, but the GitOps PR step was writing `sha-<full-sha>`. Kubernetes was trying to pull a tag that did not exist in GHCR.

### Prompt Context

**User prompt (verbatim):** "look at things like ../hair-booking for setup (it could also be that the token is expired?)"

**Assistant interpretation:** Compare Pyxis with the working hair-booking setup, consider token staleness, and continue fixing the CI/GitOps rollout path.

**Inferred user intent:** Make the Pyxis GitOps PR automation behave like the proven app packaging flow and get past the real rollout failures.

**Commit (code):** pending — short-SHA image handoff fix implemented before commit.

### What I did

- Inspected `../hair-booking/.github/workflows/publish-image.yaml` and `../hair-booking/scripts/open_gitops_pr.py`.
- Confirmed hair-booking publishes and deploys `sha-${GITHUB_SHA::7}`.
- Refreshed the Pyxis `GITOPS_PR_TOKEN` using the current `gh auth token` because the previous token could have been stale/expired:

```bash
gh auth token | gh secret set GITOPS_PR_TOKEN --repo wesen/2026-04-23--pyxis
```

- Re-ran the publish workflow; it succeeded and opened:
  - PR 48 for `deployment.yaml`.
  - PR 49 for `migration-job.yaml`.
- Reviewed both diffs and merged them.
- Applied the Argo CD Application:

```bash
kubectl apply -f gitops/applications/pyxis.yaml
kubectl -n argocd annotate application pyxis argocd.argoproj.io/refresh=hard --overwrite
```

- Wrote Vault runtime/image-pull secrets and Vault policies/roles for:
  - `kv/apps/pyxis/prod/runtime`
  - `kv/apps/pyxis/prod/image-pull`
  - `pyxis-prod`
  - `pyxis-db-bootstrap`
- Observed successful VSO sync and successful DB bootstrap Job.
- Observed migration Job `ImagePullBackOff` because the full SHA image tag did not exist.
- Updated `.github/workflows/publish-image.yml` to compute:

```bash
IMAGE="ghcr.io/${{ github.repository_owner }}/pyxis:sha-${GITHUB_SHA::7}"
```

instead of using the full `${{ github.sha }}`.

### Why

- The GitOps image reference must exactly match a tag that the image publishing step creates.
- Hair-booking already uses the short-SHA convention, so Pyxis should follow the same standard unless Docker metadata is changed to publish full-SHA tags.

### What worked

- Refreshing `GITOPS_PR_TOKEN` resolved the Git push authentication failure.
- The Git author fix from the previous step worked.
- The GitOps PR automation successfully opened and merged PRs.
- Argo CD applied the Pyxis Application.
- Vault Secrets Operator successfully synced `pyxis-runtime`, `pyxis-postgres-admin`, and `pyxis-ghcr-pull`.
- `pyxis-db-bootstrap` completed successfully.

### What didn't work

The migration Job failed to pull the image:

```text
Failed to pull image "ghcr.io/wesen/pyxis:sha-e4856701629e48fd114747f8c4ae3363d4f1ed95":
failed to resolve reference "ghcr.io/wesen/pyxis:sha-e4856701629e48fd114747f8c4ae3363d4f1ed95":
ghcr.io/wesen/pyxis:sha-e4856701629e48fd114747f8c4ae3363d4f1ed95: not found
```

The published Docker metadata showed:

```text
ghcr.io/wesen/pyxis:sha-e485670
```

### What I learned

- The issue was no longer token authentication; it became a release artifact naming mismatch.
- The working hair-booking setup is a useful reference because it explicitly computes `sha-${GITHUB_SHA::7}` for GitOps handoff.

### What was tricky to build

- `docker/metadata-action` exposes `type=sha,prefix=sha-`, which defaults to a short SHA tag. The workflow step used the full GitHub SHA independently, so both lines looked plausible until Kubernetes tried to pull the image.

### What warrants a second pair of eyes

- Confirm we want short SHA tags everywhere. The alternative is configuring Docker metadata to publish full SHA tags, but the cluster/app standard currently points toward short SHA tags.
- Review whether the two generated PRs should be collapsed into one PR per image in a future script improvement.

### What should be done in the future

- Push this workflow fix and verify the next generated GitOps PRs update both manifests to a real short-SHA tag.
- After merging those PRs, refresh Argo CD and confirm the migration Job can pull and run.

### Code review instructions

- Review `.github/workflows/publish-image.yml`, especially the `IMAGE="...sha-${GITHUB_SHA::7}"` line.
- Compare with `../hair-booking/.github/workflows/publish-image.yaml`.

### Technical details

Current failed image reference in cluster before this fix:

```text
ghcr.io/wesen/pyxis:sha-e4856701629e48fd114747f8c4ae3363d4f1ed95
```

Expected published tag shape:

```text
ghcr.io/wesen/pyxis:sha-e485670
```

## Step 22: First production rollout smoke

After fixing the short-SHA handoff, the next `publish-image` workflow succeeded and opened fresh GitOps PRs with a real published tag. I merged those PRs, refreshed Argo CD, cleared the stale failed hook operation from the previous full-SHA attempt, and watched Pyxis roll out successfully.

The first production smoke passed for health, embedded public HTML, public API access, database bootstrap/migration, and PVC-backed flyer static serving. Discord OAuth remains separately blocked by the known guild installation issue.

### Prompt Context

**User prompt (verbatim):** (same as Step 21)

**Assistant interpretation:** Continue comparing against the working setup and complete the rollout after correcting the token/tag issues.

**Inferred user intent:** Get Pyxis running in production and record the exact rollout state.

**Commit (code):** bf7e8d4 — "PYXIS-PRODUCTION-ARGOCD-GLAZED: use published short sha image tag"

### What I did

- Pushed the short-SHA workflow fix.
- Watched `publish-image` run `25126892485`; it succeeded.
- Reviewed and merged GitOps PRs:
  - `#50 pyxis-prod-app: deploy ghcr.io/wesen/pyxis:sha-bf7e8d4`
  - `#51 pyxis-prod-migrate: deploy ghcr.io/wesen/pyxis:sha-bf7e8d4`
- Pulled the k3s repo to `2bba71b`.
- Refreshed Argo CD.
- Cleared the stale operation from the earlier failed full-SHA hook and deleted the stale `pyxis-migrate` job so Argo could resync at the new revision:

```bash
kubectl -n argocd patch application pyxis --type merge -p '{"operation": null}'
kubectl -n pyxis delete job pyxis-migrate --ignore-not-found
kubectl -n argocd annotate application pyxis argocd.argoproj.io/refresh=hard --overwrite
```

- Confirmed:
  - `pyxis-db-bootstrap` completed.
  - `pyxis-migrate` completed.
  - app pod is running and ready.
  - Argo reports `Synced Healthy Succeeded`.
- Ran HTTP, DB, and flyer/PVC smoke checks.

### Why

- The previous Argo operation was waiting on a hook job with an immutable failed image. Clearing the operation and deleting the failed hook let Argo run the corrected migration hook from the new Git revision.

### What worked

- VSO synced all three expected Kubernetes secrets.
- DB bootstrap and migration completed.
- App container pulled and ran `ghcr.io/wesen/pyxis:sha-bf7e8d4`.
- `/health` returned HTTP 200 with `{"status":"ok"}`.
- `/` returned embedded public HTML.
- `/api/public/shows` returned HTTP 200 with `{}`.
- DB check confirmed `public.show_logs` exists.
- PVC flyer smoke returned the file written under `/data/flyers` through `/flyers/...`.

### What didn't work

- The previous full-SHA migration hook remained stuck until I explicitly cleared the Argo operation and deleted the stale hook job.
- Discord OAuth was not fully validated because the known bot/guild installation blocker still applies.

### What I learned

- Argo hook jobs can hold an operation at an older revision; when the hook itself is stuck on a bad immutable image, a manual operation clear plus hook deletion may be needed to move to the fixed revision.

### What was tricky to build

- The rollout crossed three asynchronous systems at once: GitHub Actions image publish, GitOps PR merge, and Argo hook execution. The failure moved from token auth to image tag mismatch to stale hook operation, so each fix needed a fresh observation point.

### What warrants a second pair of eyes

- Review whether clearing Argo operations manually is acceptable as first-rollout recovery guidance and add it to the playbook if so.
- Review the production secret key names and whether `PYXIS_DISCORD_BOT_ENABLED=false` is still the desired initial rollout default.

### What should be done in the future

- Install/invite the Discord app into the target guild and rerun real OAuth smoke.
- Consider adding an app-level production smoke script that captures the HTTP/DB/PVC checks in one repeatable command.
- Consider grouping the two GitOps image target changes into one PR.

### Code review instructions

- In the k3s repo, inspect `gitops/kustomize/pyxis/deployment.yaml` and `migration-job.yaml`; both should use `ghcr.io/wesen/pyxis:sha-bf7e8d4`.
- Validate cluster state with:

```bash
kubectl -n argocd get app pyxis
kubectl -n pyxis get pods,jobs,pvc,svc,ingress
curl -k https://pyxis.yolo.scapegoat.dev/health
```

### Technical details

Evidence saved in:

```text
sources/08-production-rollout-smoke.txt
```

Key final state:

```text
Argo: Synced Healthy Succeeded
Image: ghcr.io/wesen/pyxis:sha-bf7e8d4
Health: HTTP 200 {"status":"ok"}
DB: show_logs exists
Flyers: /flyers/smoke/pvc.txt returned ok
```
