---

Title: Pyxis packaging and CI playbook
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
DocType: playbook
Type: playbook
Status: draft
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
Summary: Operator checklist for adding production packaging, Makefile targets, Docker image publishing, and optional GoReleaser support to Pyxis.
---

# Pyxis packaging and CI playbook

## Goal

Make Pyxis buildable and releasable from a clean GitHub runner. The output should be:

- a tested Go/React repository;
- an embedded-site `pyxis` binary;
- a Docker image pushed to GHCR with immutable `sha-<commit>` tags;
- optional GoReleaser CLI artifacts for the Glazed command.

## Preconditions

- `go test ./pkg/server ./pkg/service ./pkg/repository/postgres -count=1` passes locally.
- `cd web/packages/pyxis-app && pnpm exec tsc --noEmit` passes.
- `cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit && pnpm exec vite build` passes.
- `make build-embed` works locally.
- GitHub repo has Actions enabled.
- GHCR package visibility strategy is known: public package, image pull secret, or private pull setup.

## Step 1: Add packaging files

Create or update:

```text
Dockerfile
.dockerignore
.golangci-lint-version
.golangci.yml
.goreleaser.yaml        # optional but recommended for CLI releases
.github/workflows/push.yml
.github/workflows/publish-image.yml
.github/workflows/lint.yml
.github/workflows/dependency-scanning.yml
.github/workflows/codeql-analysis.yml
```

Use `/home/manuel/code/wesen/corporate-headquarters/discord-bot` as style reference, but account for Pyxis having a `web/` pnpm workspace and embedded web assets.

## Step 2: Expand Makefile

Keep existing development targets and add production targets:

```make
ci: generate test web-check build-embed
web-check:
	cd web/packages/pyxis-app && pnpm exec tsc --noEmit
	cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
	cd web/packages/pyxis-user-site && pnpm exec vite build

docker-build:
	docker build -t $(IMAGE_REPOSITORY):$(IMAGE_TAG) .

docker-smoke:
	docker run --rm -p 18086:8080 $(IMAGE_REPOSITORY):$(IMAGE_TAG)
```

The Makefile should let a new intern answer three questions quickly:

- Can the repo pass CI? `make ci`
- Can the production binary be built? `make build-embed`
- Can the container be built? `make docker-build`

## Step 3: Dockerfile smoke checks

After creating the Dockerfile:

```bash
docker build -t pyxis:local .
docker run --rm pyxis:local --help
docker run --rm pyxis:local serve --help
```

Then with local database running:

```bash
docker compose up -d db
docker run --rm -p 18086:8080 \
  -e PYXIS_DATABASE_URL='postgres://pyxis:pyxis@host.docker.internal:5433/pyxis?sslmode=disable' \
  pyxis:local
curl -i http://127.0.0.1:18086/health
```

## Step 4: GitHub Actions image publishing

The publish workflow should:

- build on PR but not push;
- push on `main`;
- publish `sha-<commit>` tag;
- optionally publish `main` and `latest` convenience tags;
- use `permissions: packages: write`.

Do not hand-push production images unless explicitly asked. If CI cannot publish to GHCR, fix the CI/repo/package contract.

## Step 5: Optional GoReleaser

Add GoReleaser if Pyxis should be installed as a CLI. Keep Docker deployment separate unless the team decides GoReleaser should own images too.

Smoke:

```bash
goreleaser release --skip=sign --snapshot --clean --single-target
```

## Done when

- `make ci` passes locally.
- Docker image builds from a clean checkout.
- GitHub Actions PR workflow passes.
- Merge to `main` publishes `ghcr.io/.../pyxis:sha-<commit>`.
- Optional GoReleaser snapshot succeeds.
