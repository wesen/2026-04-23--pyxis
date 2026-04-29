---

Title: Pyxis production Glazed and Argo CD implementation guide
Ticket: PYXIS-PRODUCTION-ARGOCD-GLAZED
DocType: design-doc
Type: design-doc
Status: draft
Topics:
  - pyxis
  - glazed
  - production
  - release-readiness
  - backend
Summary: Intern-oriented analysis, design, and implementation guide for packaging Pyxis as a production Glazed application and deploying it to the Hetzner k3s cluster through Argo CD.
RelatedFiles:
  - /home/manuel/code/wesen/2026-04-23--pyxis/Makefile
  - /home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/main.go
  - /home/manuel/code/wesen/2026-04-23--pyxis/cmd/pyxis/cmds/serve.go
  - /home/manuel/code/wesen/2026-04-23--pyxis/internal/web/static.go
  - /home/manuel/code/wesen/2026-04-23--pyxis/pkg/server/server.go
  - /home/manuel/code/wesen/2026-03-27--hetzner-k3s/docs/app-packaging-and-gitops-pr-standard.md
  - /home/manuel/code/wesen/2026-03-27--hetzner-k3s/gitops/kustomize/hair-booking/deployment.yaml
---

# Pyxis production Glazed and Argo CD implementation guide

## 1. Executive summary

Pyxis is ready to become a real deployed application, but it currently still looks like a feature-development repository rather than a production service. It has the important core pieces: a Glazed/Cobra CLI entrypoint, a Go HTTP server, PostgreSQL migrations, a public Vite site that can be embedded into the Go binary, a staff React app, Discord OAuth, an optional embedded Discord bot, and local PostgreSQL development through Docker Compose. What it does not yet have is the standard production envelope used by the Hetzner k3s platform: a Dockerfile, CI image publishing, optional GoReleaser artifacts, GitOps manifests, Vault-backed runtime secrets, Argo CD Application registration, and operator playbooks.

The target state is a single deployable Pyxis container image, published to GHCR, pinned in the GitOps repository, and reconciled by Argo CD into the k3s cluster. The container should run the Glazed command:

```text
pyxis serve --bind 0.0.0.0:8080 --db-url "$PYXIS_DATABASE_URL" ...
```

The public website should be served by the same Go binary from embedded Vite assets. Staff APIs, public APIs, auth endpoints, health checks, and uploaded flyer files should be served by the same HTTP server. PostgreSQL should come from the shared in-cluster PostgreSQL service. Runtime secrets should come from Vault via Vault Secrets Operator. Uploaded flyer files should be stored on a Kubernetes PVC until an object-storage backend exists.

The deployment architecture should look like this:

```text
Pyxis app repository
  ├─ Go + Glazed CLI
  ├─ web/ pnpm workspace
  ├─ Dockerfile
  ├─ GitHub Actions
  └─ optional GitOps PR script
        │
        │ builds/tests/publishes
        ▼
GitHub Container Registry
  ghcr.io/<owner>/pyxis:sha-<commit>
        │
        │ image tag is pinned in GitOps
        ▼
Hetzner k3s GitOps repository
  ../2026-03-27--hetzner-k3s/gitops/kustomize/pyxis
  ../2026-03-27--hetzner-k3s/gitops/applications/pyxis.yaml
        │
        │ Argo CD reconciles
        ▼
Kubernetes namespace: pyxis
  ├─ Deployment pyxis
  ├─ Service pyxis
  ├─ Ingress pyxis.yolo.scapegoat.dev
  ├─ PVC pyxis-data
  ├─ VaultStaticSecret pyxis-runtime
  └─ DB bootstrap Job
```

This guide is written for a new intern. It explains both what to build and why each part exists. Do not treat this as a list of random YAML files. The important mental model is that the app repository owns software artifacts, while the GitOps repository owns the desired runtime state. Argo CD deploys what the GitOps repository says, not whatever happens to be on a developer laptop.

## 2. What Pyxis is

Pyxis is an independent venue management system. It has three user-facing surfaces and one optional automation surface.

The first surface is the public website. It lets visitors see upcoming shows, browse the archive, inspect show details, and submit booking requests. The public site is implemented in the `web/packages/pyxis-user-site` Vite/React package and is served in production from the Go binary through `internal/web/static.go`.

The second surface is the staff application. It is a React app under `web/packages/pyxis-app`. It includes dashboard, shows, booking review, calendar, artists, post-show log, audit log, Discord settings, and application settings pages. In development it is served by Vite on `localhost:3008`, but for production we must decide whether it is embedded into the same Go binary or built/served separately. The simplest production path is to embed the public site first and continue staff app deployment once the staff route exposure decision is settled. If the staff app is intended to be publicly reachable behind Discord OAuth, it can also be built into a static bundle and served by the Go binary or by a second static route.

The third surface is the HTTP API. Public endpoints live under `/api/public/*`; staff endpoints live under `/api/app/*`; auth endpoints live under `/auth/*`; flyer files are served under `/flyers/*`; health is at `/health`. The routes are registered in `pkg/server/server.go`.

The fourth surface is the optional Discord bot. The `serve` command can start the HTTP server alone, or start the HTTP server plus an embedded Discord bot when `--discord-bot` is true. The bot path is configured by `--discord-bot-script`, defaulting to `bot/discord/show-space/index.js`. In production this means the Docker image must include the bot JavaScript files if the bot is enabled.

The high-level runtime looks like this:

```text
Browser visitor
  -> https://pyxis.yolo.scapegoat.dev/
  -> Go server SPA fallback
  -> embedded public Vite bundle

Staff browser
  -> https://pyxis.yolo.scapegoat.dev/auth/discord/login
  -> Discord OAuth
  -> /api/app/* with session cookie

Pyxis server
  -> PostgreSQL database
  -> local flyer directory on /data/flyers
  -> Discord API for OAuth role mapping and optional bot
```

Important Pyxis files:

- `cmd/pyxis/main.go`: Cobra/Glazed application root.
- `cmd/pyxis/cmds/serve.go`: Glazed `serve` command and runtime flags.
- `pkg/config/config.go`: configuration struct and local defaults.
- `pkg/server/server.go`: HTTP route registration and dependency wiring.
- `pkg/db/migrations/`: database schema migrations.
- `pkg/db/queries/`: sqlc query definitions.
- `internal/web/generate.go`: `go generate` entrypoint for building web assets.
- `internal/web/static.go`: SPA static-file/fallback serving logic.
- `cmd/build-web/main.go`: builds/copies frontend assets for embedding.
- `web/packages/pyxis-user-site`: public site source.
- `web/packages/pyxis-app`: staff app source.
- `bot/discord/show-space/index.js`: expected Discord bot script path.

## 3. What “proper Glazed application” means here

Pyxis already uses Glazed. The command root in `cmd/pyxis/main.go` builds a Cobra root command, adds Glazed logging flags, loads embedded help docs, builds command groups through `pkg/cmdtools`, and executes the command. That means production should not invent a separate `main` or bypass the CLI. The production container should run the same command an operator can run locally.

The important Glazed command for production is `serve`. Its settings struct in `cmd/pyxis/cmds/serve.go` defines the operational contract:

```go
type ServeSettings struct {
    Bind                string `glazed:"bind"`
    DBURL               string `glazed:"db-url"`
    WebsiteURL          string `glazed:"website-url"`
    SessionCookieName   string `glazed:"session-cookie-name"`
    DiscordClientID     string `glazed:"discord-client-id"`
    DiscordClientSecret string `glazed:"discord-client-secret"`
    DiscordRedirectURL  string `glazed:"discord-redirect-url"`
    DiscordBotToken     string `glazed:"discord-bot-token"`
    DiscordGuildID      string `glazed:"discord-guild-id"`
    DiscordBot          bool   `glazed:"discord-bot"`
    DiscordBotScript    string `glazed:"discord-bot-script"`
    DiscordSyncOnStart  bool   `glazed:"discord-sync-on-start"`
    DiscordDebug        bool   `glazed:"discord-debug"`
    DiscordAdminRoleID  string `glazed:"discord-admin-role-id"`
    DiscordBookerRoleID string `glazed:"discord-booker-role-id"`
    DiscordDoorRoleID   string `glazed:"discord-door-role-id"`
}
```

That struct is the production deployment API. The Kubernetes Deployment should pass these settings either as command-line flags or as environment variables consumed by defaults. Today many flags already read environment variables through `envOr(...)`, but `db-url` currently has a hard-coded local default rather than a `PYXIS_DATABASE_URL` default. One productionization task is to make every production setting work cleanly from env vars.

Recommended convention:

```text
PYXIS_BIND=0.0.0.0:8080
PYXIS_DATABASE_URL=postgres://...
PYXIS_WEBSITE_URL=https://pyxis.yolo.scapegoat.dev
PYXIS_SESSION_COOKIE_NAME=pyxis_session
PYXIS_SESSION_SECRET=...
PYXIS_DISCORD_CLIENT_ID=...
PYXIS_DISCORD_CLIENT_SECRET=...
PYXIS_DISCORD_REDIRECT_URL=https://pyxis.yolo.scapegoat.dev/auth/discord/callback
DISCORD_BOT_TOKEN=...
DISCORD_GUILD_ID=...
DISCORD_ADMIN_ROLE_ID=...
DISCORD_BOOKER_ROLE_ID=...
DISCORD_DOOR_ROLE_ID=...
```

The command invocation inside Kubernetes can then be boring:

```yaml
command: ["/usr/local/bin/pyxis"]
args:
  - serve
  - --bind
  - 0.0.0.0:8080
  - --db-url
  - $(PYXIS_DATABASE_URL)
  - --website-url
  - $(PYXIS_WEBSITE_URL)
  - --discord-bot=$(PYXIS_DISCORD_BOT_ENABLED)
```

In practice Kubernetes does not interpolate `$(...)` inside every field the way a shell does unless using env expansion in command/args; a safer pattern is to add env-backed defaults for all flags and call only:

```yaml
args: ["serve"]
```

That is the intern-friendly target: the manifest declares environment variables, and the Glazed command reads them.

## 4. The app repository vs the GitOps repository

The platform follows a strict boundary.

The Pyxis application repository should own:

- Go source code.
- React/Vite source code.
- migrations and sqlc queries.
- Dockerfile.
- Makefile build/test targets.
- GitHub Actions workflows.
- GoReleaser config if CLI artifacts are published.
- optional CI helper script that opens a GitOps PR.

The Hetzner k3s GitOps repository should own:

- namespace.
- service account.
- VaultAuth and VaultStaticSecret resources.
- DB bootstrap job.
- deployment.
- service.
- ingress.
- PVC.
- Argo CD Application manifest.
- exact pinned image tag.

The GitOps repository is the cluster’s source of truth. A developer merging a Pyxis code change does not automatically change the cluster unless a GitOps manifest references the new image. The standard flow is:

```text
1. Merge app change to main.
2. GitHub Actions runs tests and builds image.
3. GitHub Actions publishes ghcr.io/<owner>/pyxis:sha-<commit>.
4. CI opens a PR against ../2026-03-27--hetzner-k3s.
5. Reviewer checks the manifest image bump.
6. Reviewer merges the GitOps PR.
7. Argo CD syncs the Pyxis Application.
8. Kubernetes rolls out the new pod.
```

This is the same model described in `../2026-03-27--hetzner-k3s/docs/app-packaging-and-gitops-pr-standard.md` and `docs/public-repo-ghcr-argocd-deployment-playbook.md`.

## 5. Current Pyxis build state

The current `Makefile` has development-oriented targets:

```make
build:
	go build -o bin/pyxis ./cmd/pyxis

build-web:
	go run ./cmd/build-web

generate-web:
	go generate ./internal/web

build-embed: build-web
	go build -tags embed -o bin/pyxis ./cmd/pyxis

serve-embed: build-web
	go run -tags embed ./cmd/pyxis serve --bind :8080

test:
	go test ./... -count=1
```

This is a good start. The production version should keep those targets, but add the standard packaging envelope similar to `corporate-headquarters/discord-bot`:

```make
.PHONY: all test build build-embed build-web lint lintmax gosec govulncheck docker-build docker-run goreleaser install clean

VERSION ?= v0.0.1
IMAGE_REPOSITORY ?= ghcr.io/wesen/pyxis
IMAGE_TAG ?= sha-$(shell git rev-parse --short HEAD)
GOLANGCI_LINT_VERSION ?= $(shell cat .golangci-lint-version)
GOLANGCI_LINT_BIN ?= $(CURDIR)/.bin/golangci-lint

all: test build-embed

ci: generate test web-check build-embed

web-check:
	cd web/packages/pyxis-app && pnpm exec tsc --noEmit
	cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
	cd web/packages/pyxis-user-site && pnpm exec vite build

build-embed: build-web
	CGO_ENABLED=0 go build -tags embed -trimpath -o bin/pyxis ./cmd/pyxis

docker-build:
	docker build -t $(IMAGE_REPOSITORY):$(IMAGE_TAG) .

smoke-embed: build-embed
	./bin/pyxis serve --bind 127.0.0.1:18086
```

The exact final Makefile can vary, but the intent should not: one command should answer “can CI build this,” and another should answer “can I build the production image locally.”

## 6. Dockerfile design

The `discord-bot` reference uses a slim runtime image and copies a prebuilt binary from `.bin`. Pyxis has a web build step, so a more self-contained Dockerfile is useful. The Dockerfile should not rely on local `.bin` artifacts unless the CI workflow explicitly builds them first. A multi-stage Dockerfile is clearer for interns and safer for CI.

Recommended structure:

```dockerfile
# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS web
WORKDIR /src/web
COPY web/package.json web/pnpm-lock.yaml web/pnpm-workspace.yaml ./
COPY web/packages ./packages
RUN corepack enable && pnpm install --frozen-lockfile
WORKDIR /src
COPY cmd ./cmd
COPY internal ./internal
COPY web ./web
RUN go run ./cmd/build-web

FROM golang:1.24-bookworm AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=web /src/internal/web/embed/public ./internal/web/embed/public
RUN CGO_ENABLED=1 go build -tags embed -trimpath -o /out/pyxis ./cmd/pyxis

FROM debian:bookworm-slim
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --system --uid 10001 --home-dir /app --shell /usr/sbin/nologin appuser
WORKDIR /app
COPY --from=build /out/pyxis /usr/local/bin/pyxis
COPY bot /app/bot
RUN mkdir -p /data/flyers \
  && chown -R appuser:appuser /app /data \
  && chmod +x /usr/local/bin/pyxis
USER appuser
EXPOSE 8080
ENTRYPOINT ["pyxis"]
CMD ["serve"]
```

There are details to refine:

- Pyxis currently needs `CGO_ENABLED=1` because the Glazed help system initializes an in-memory SQLite store through `go-sqlite3`; a `CGO_ENABLED=0` binary can compile but fail when running `pyxis --help` or `pyxis serve --help`.
- Production Docker builds cannot rely on local Go `replace` directives pointing at sibling workstation directories such as `../corporate-headquarters/discord-bot`; dependencies used in the image must resolve from published module versions or be vendored/copied intentionally.
- If Go must run `cmd/build-web` in the web stage, the web stage also needs Go. Alternatively use one `golang` stage with Node installed, or build web assets in CI and copy them into the image.
- If the staff app is also embedded, `cmd/build-web` must learn how to build/copy both public and staff bundles and `internal/web` must serve both. Today it primarily supports the public bundle.
- If the Discord bot script is optional, copying `bot/` into the runtime image is harmless and keeps `--discord-bot` usable.
- The runtime image should mount `/data` and configure flyer storage to use `/data/flyers` instead of `./data/flyers`.

The minimum viable Dockerfile can be simpler: run `make build-web` and `go build -tags embed` inside one build stage, then copy the binary and bot scripts into Debian slim.

## 7. GitHub Actions design

Use the `discord-bot` workflows as the house style. Pyxis should have at least four workflows.

### 7.1 Push/PR validation

File:

```text
.github/workflows/push.yml
```

Purpose:

- check out repository.
- set up Go.
- set up pnpm/Node.
- run sqlc/buf generation check if desired.
- build web assets.
- run Go tests.
- run frontend TypeScript checks.
- build embedded binary.

Pseudocode:

```yaml
name: pyxis-pipeline
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-go@v6
        with:
          go-version-file: go.mod
          cache: true
      - uses: pnpm/action-setup@v4
        with:
          package_json_file: web/package.json
      - uses: actions/setup-node@v5
        with:
          node-version-file: web/package.json
          cache: pnpm
          cache-dependency-path: web/pnpm-lock.yaml
      - run: cd web && pnpm install --frozen-lockfile
      - run: sqlc generate
      - run: buf generate
      - run: go test ./...
      - run: cd web/packages/pyxis-app && pnpm exec tsc --noEmit
      - run: cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
      - run: make build-embed
```

### 7.2 Image publish workflow

File:

```text
.github/workflows/publish-image.yml
```

Purpose:

- build Docker image.
- push to GHCR for `main` and tags.
- produce immutable `sha-<commit>` tag.
- optionally open GitOps PR.

Pseudocode:

```yaml
name: publish-image
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read
  packages: write

jobs:
  image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: docker/setup-buildx-action@v4
      - uses: docker/login-action@v4
        if: github.event_name == 'push'
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/metadata-action@v6
        id: meta
        with:
          images: ghcr.io/wesen/pyxis
          tags: |
            type=sha,prefix=sha-
            type=ref,event=branch
      - uses: docker/build-push-action@v7
        with:
          context: .
          push: ${{ github.event_name == 'push' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

### 7.3 Security workflows

Copy the pattern from `corporate-headquarters/discord-bot`:

- `lint.yml` using `golangci/golangci-lint-action`.
- `dependency-scanning.yml` using dependency review, `govulncheck`, and `gosec`.
- `codeql-analysis.yml` using CodeQL for Go.

Pyxis also has Node dependencies, so add either Dependabot or a pnpm audit policy. Do not make `pnpm audit` fail production CI until the team agrees on severity policy; start with report-only if dependency noise is high.

### 7.4 Release workflow

If Pyxis should be installable as a CLI, add `.goreleaser.yaml` similar to `discord-bot`. If Pyxis is only a web service, GoReleaser is optional. The user asked for a “proper Glazed application,” so I recommend adding GoReleaser for the CLI binary even if the production deployment uses Docker.

The release artifacts would be:

- Linux amd64/arm64 binary.
- Darwin amd64/arm64 binary.
- checksums.
- optional Homebrew formula.
- optional deb/rpm packages.

The container image should still be published by Docker workflow, not by GoReleaser, unless the team wants a single release orchestrator.

## 8. GitOps package design

The Pyxis kustomize package should follow the `hair-booking` shape because Pyxis is similar: Go web app, PostgreSQL, runtime auth secrets, uploads/data PVC, public ingress.

Target tree in the GitOps repository:

```text
../2026-03-27--hetzner-k3s/gitops/kustomize/pyxis/
  namespace.yaml
  serviceaccount.yaml
  db-bootstrap-serviceaccount.yaml
  vault-connection.yaml
  vault-auth.yaml
  db-bootstrap-vault-auth.yaml
  runtime-secret.yaml
  image-pull-secret.yaml        # only if GHCR package is private
  postgres-admin-secret.yaml
  db-bootstrap-script-configmap.yaml
  db-bootstrap-job.yaml
  persistentvolumeclaim.yaml
  deployment.yaml
  service.yaml
  ingress.yaml
  kustomization.yaml
```

Argo CD Application:

```text
../2026-03-27--hetzner-k3s/gitops/applications/pyxis.yaml
```

The Application should look like:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: pyxis
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  destination:
    server: https://kubernetes.default.svc
    namespace: pyxis
  source:
    repoURL: https://github.com/wesen/2026-03-27--hetzner-k3s.git
    targetRevision: main
    path: gitops/kustomize/pyxis
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true
```

Remember the platform rule from the k3s docs: adding `gitops/applications/pyxis.yaml` to Git does not necessarily create the live Argo Application object unless an app-of-apps layer applies it. The first rollout needs a one-time bootstrap:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
export KUBECONFIG=$PWD/.cache/kubeconfig-tailnet.yaml
kubectl apply -f gitops/applications/pyxis.yaml
kubectl -n argocd annotate application pyxis argocd.argoproj.io/refresh=hard --overwrite
```

## 9. Kubernetes resources in detail

### 9.1 Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: pyxis
```

The namespace isolates Pyxis resources and gives Vault/Kubernetes auth a stable service-account boundary.

### 9.2 Service accounts

Use at least two service accounts:

```text
pyxis
pyxis-db-bootstrap
```

The app service account reads runtime secrets. The bootstrap service account reads the PostgreSQL admin secret and app DB credential. This separation mirrors `hair-booking` and keeps admin DB credentials out of the long-running app pod.

### 9.3 Runtime secret

Use Vault Secrets Operator:

```yaml
apiVersion: secrets.hashicorp.com/v1beta1
kind: VaultStaticSecret
metadata:
  name: pyxis-runtime
spec:
  vaultAuthRef: pyxis
  mount: kv
  type: kv-v2
  path: apps/pyxis/prod/runtime
  refreshAfter: 30s
  destination:
    name: pyxis-runtime
    create: true
    overwrite: true
```

Suggested Vault keys:

```text
dsn                         # full PostgreSQL URL, easiest for app runtime
database                    # pyxis
username                    # pyxis_app
password                    # generated password
session_secret              # if/when server supports signed/encrypted session secret
website_url                 # https://pyxis.yolo.scapegoat.dev
discord_client_id
discord_client_secret
discord_redirect_url
discord_bot_token
discord_guild_id
discord_admin_role_id
discord_booker_role_id
discord_door_role_id
discord_bot_enabled         # "false" initially, then "true" after bot install is confirmed
```

Current code may need a `SessionSecret` config field before `session_secret` is useful. Add it before production if sessions are currently unsigned or dev-only.

### 9.4 PostgreSQL bootstrap

The shared PostgreSQL server already exists in the platform. Pyxis needs its own database and role. Use the bootstrap Job pattern from `docs/vault-backed-postgres-bootstrap-job-pattern.md` and `gitops/kustomize/hair-booking/db-bootstrap-job.yaml`.

The explicit v1 decision is:

- **Reuse the existing shared in-cluster PostgreSQL server.** Do not create a new PostgreSQL server just for Pyxis during the first rollout.
- **Create the Pyxis database and role with an Argo CD synced Kubernetes Job.** The Job reads a short-lived working copy of secrets from Kubernetes Secrets that are synchronized by Vault Secrets Operator.
- **Do not use Terraform for the Pyxis database/user.** Terraform is better for cloud/server/DNS/platform bootstrap. This database is an in-cluster application concern, and the rest of the app rollout is already driven by Argo CD.
- **Do not introduce a Postgres operator for Pyxis v1.** A Postgres operator may be a good future platform decision if the cluster wants per-app clusters, database CRDs, managed backups, or HA/failover. It is unnecessary for this first Pyxis deployment because the platform already has a shared Postgres service and a proven bootstrap-Job pattern.

The mental model is:

```text
Existing GitOps-managed PostgreSQL StatefulSet
  -> shared cluster admin credential in Vault
  -> Pyxis runtime DB credential in Vault
  -> Vault Secrets Operator syncs both into namespace pyxis
  -> pyxis-db-bootstrap Job creates/updates role and database
  -> pyxis migration Job applies schema migrations
  -> pyxis Deployment connects with least-privilege runtime DSN
```

This keeps responsibilities aligned. Vault owns secret values, Argo CD owns Kubernetes desired state, the bootstrap Job owns idempotent SQL side effects, and the long-running Pyxis pod only gets the least-privilege application DSN.

Pseudocode:

```text
Job pyxis-db-bootstrap:
  env from postgres admin secret:
    POSTGRES_SERVICE_HOST
    POSTGRES_SERVICE_PORT
    POSTGRES_ADMIN_USER
    POSTGRES_ADMIN_PASSWORD
  env from pyxis runtime secret:
    PYXIS_DB_NAME
    PYXIS_DB_USER
    PYXIS_DB_PASSWORD
  run bootstrap.sh:
    if role missing, create role
    else update password
    if database missing, create database owned by role
    ensure owner and grants
```

The SQL should be idempotent, meaning the job can run repeatedly without failing after the first success.

### 9.5 Deployment

The Deployment is the core runtime object. It should use the GHCR image tag pinned by GitOps:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pyxis
  annotations:
    argocd.argoproj.io/sync-wave: "2"
spec:
  replicas: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: pyxis
      app.kubernetes.io/component: app
  template:
    metadata:
      labels:
        app.kubernetes.io/name: pyxis
        app.kubernetes.io/component: app
    spec:
      enableServiceLinks: false
      serviceAccountName: pyxis
      containers:
        - name: pyxis
          image: ghcr.io/wesen/pyxis:sha-REPLACE_ME
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
              name: http
          env:
            - name: PYXIS_DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: pyxis-runtime
                  key: dsn
            - name: PYXIS_WEBSITE_URL
              value: https://pyxis.yolo.scapegoat.dev
            - name: PYXIS_DISCORD_CLIENT_ID
              valueFrom:
                secretKeyRef:
                  name: pyxis-runtime
                  key: discord_client_id
            - name: PYXIS_DISCORD_CLIENT_SECRET
              valueFrom:
                secretKeyRef:
                  name: pyxis-runtime
                  key: discord_client_secret
            - name: PYXIS_DISCORD_REDIRECT_URL
              valueFrom:
                secretKeyRef:
                  name: pyxis-runtime
                  key: discord_redirect_url
            - name: DISCORD_BOT_TOKEN
              valueFrom:
                secretKeyRef:
                  name: pyxis-runtime
                  key: discord_bot_token
            - name: DISCORD_GUILD_ID
              valueFrom:
                secretKeyRef:
                  name: pyxis-runtime
                  key: discord_guild_id
          volumeMounts:
            - name: data
              mountPath: /data
          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 20
            periodSeconds: 20
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: pyxis-data
```

Important implementation gap: `pkg/server/server.go` currently constructs local flyer storage with `./data/flyers`. For Kubernetes, add config/env for `PYXIS_FLYER_STORAGE_LOCAL_DIR=/data/flyers` and `PYXIS_FLYER_PUBLIC_BASE=/flyers`, then wire `storage.NewLocalFlyerStore` from config. Otherwise the pod writes inside its working directory instead of the mounted PVC.

### 9.6 Service and ingress

Service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: pyxis
spec:
  selector:
    app.kubernetes.io/name: pyxis
    app.kubernetes.io/component: app
  ports:
    - name: http
      port: 80
      targetPort: http
```

Ingress:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: pyxis
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: traefik
  tls:
    - hosts:
        - pyxis.yolo.scapegoat.dev
      secretName: pyxis-tls
  rules:
    - host: pyxis.yolo.scapegoat.dev
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: pyxis
                port:
                  number: 80
```

## 10. Database migrations

Pyxis has migrations under `pkg/db/migrations`. Production must decide how migrations run. There are three common patterns:

1. App auto-migrates on startup.
2. A Kubernetes migration Job runs before the Deployment.
3. An operator runs `pyxis migrate up` manually before rollout.

The cleanest production pattern is a migration Job or an app startup flag. `hair-booking` uses `HAIR_BOOKING_AUTO_MIGRATE=true`, but Pyxis currently exposes Makefile migration targets and likely Glazed migration commands through `pkg/cmdtools`. The intern should inspect `pkg/cmdtools` and `cmd/pyxis/cmds` before implementing.

Recommended first production approach:

```text
Use a pre-deployment Kubernetes Job:
  image: same pyxis image as app
  command: ["pyxis"]
  args: ["migrate", "up", "--db-url", "$(PYXIS_DATABASE_URL)"]
  env: PYXIS_DATABASE_URL from pyxis-runtime secret
```

If the migration command does not support env-backed `--db-url`, add it. The Job should run before Deployment sync wave 2, for example sync wave 1 after DB bootstrap wave 0/1.

Pseudo rollout order:

```text
wave -2: namespace, service accounts, VaultAuth
wave -1: VaultStaticSecret resources
wave  0: DB bootstrap script ConfigMap
wave  1: DB bootstrap Job and migration Job
wave  2: PVC, Deployment, Service
wave  3: Ingress
```

## 11. Discord OAuth and bot production concerns

Discord OAuth is the staff authentication path. The app needs:

- Discord application client ID.
- Discord client secret.
- redirect URL exactly matching the public production callback.
- bot token for guild member role lookup.
- guild/server ID.
- role IDs for `admin`, `booker`, and `door`.

The current known blocker from earlier local testing was that the `pyxis` bot application was not installed in the configured guild. Production cannot have real staff login until the bot is installed in Discord server `586274407350272042` and can read guild member roles. If role lookup still fails after install, enable Discord Developer Portal `SERVER MEMBERS INTENT`.

Production redirect URL should be:

```text
https://pyxis.yolo.scapegoat.dev/auth/discord/callback
```

The Discord bot should be disabled for the first web rollout unless the operator intentionally wants slash-command behavior immediately:

```text
PYXIS_DISCORD_BOT_ENABLED=false
```

After web auth is validated, enable bot mode:

```text
pyxis serve --discord-bot --discord-sync-on-start
```

or equivalent env-backed configuration.

## 12. Public site and staff app serving strategy

Pyxis currently has a production-friendly public site path: `cmd/build-web` builds/copies frontend assets, `internal/web/embed.go` embeds them with the `embed` tag, and `internal/web/static.go` serves browser routes through an SPA fallback while preserving `/api`, `/auth`, `/flyers`, and `/health` as backend routes.

The public site should be the first production target because it is already built for same-origin Go serving.

The staff app needs a deployment decision. There are two paths:

### Path A: Same binary serves staff app too

Pros:

- one image.
- one hostname.
- same-origin staff APIs.
- simpler CORS/cookie model.

Cons:

- `cmd/build-web` and `internal/web` need to support two SPA bundles.
- route partitioning must be clear: public pages at `/`, staff pages maybe `/app/*` or only protected routes.

### Path B: Staff app remains separate Vite/static deployment

Pros:

- less change to public-site embed path.
- staff app can be deployed independently.

Cons:

- second image or static hosting path.
- cookie and auth callback complexity.
- more GitOps resources.

Recommended for first production rollout: deploy public site + backend in one Pyxis image, but keep staff app reachable only if the product owner confirms route exposure. If staff app is needed immediately, embed it under `/app` and set staff navigation accordingly.

## 13. CI-created GitOps PR

Once image publishing is stable, add an app-repo script similar to the k3s standard:

```text
deploy/gitops-targets.json
scripts/open_gitops_pr.py
```

Example target metadata:

```json
{
  "targets": [
    {
      "name": "pyxis-prod",
      "gitops_repo": "wesen/2026-03-27--hetzner-k3s",
      "gitops_branch": "main",
      "manifest_path": "gitops/kustomize/pyxis/deployment.yaml",
      "container_name": "pyxis"
    }
  ]
}
```

Script pseudocode:

```python
load targets
for target in targets:
    clone gitops repo to temp dir
    checkout branch pyxis-image-<sha>
    parse deployment.yaml
    find container named pyxis
    replace image with ghcr.io/wesen/pyxis:sha-<sha>
    run kubectl kustomize gitops/kustomize/pyxis as validation
    commit change
    push branch
    open PR with gh CLI or GitHub API
```

The workflow secret should be named something like:

```text
GITOPS_PR_TOKEN
```

Do not use `secrets.*` directly in GitHub Actions `if:` expressions. Follow the k3s playbook rule: expose secrets as env vars, check emptiness inside shell, and fail explicitly if the GitOps PR step is required.

## 14. Implementation phases

### Phase 1: App packaging baseline

- Add Dockerfile.
- Add `.dockerignore`.
- Add `.golangci-lint-version` and `.golangci.yml` if missing.
- Expand Makefile.
- Ensure `make build-embed` works from a clean checkout.
- Ensure the Docker image can run `pyxis --help` and `pyxis serve --help`.

### Phase 2: Configuration hardening

- Add env-backed defaults for all production `serve` flags.
- Add configurable flyer storage path.
- Add session secret config if missing.
- Decide staff app serving strategy.
- Ensure production startup fails clearly when required Discord OAuth fields are partially configured.

### Phase 3: CI/CD

- Add push/PR validation workflow.
- Add publish-image workflow.
- Add lint/security workflows.
- Optionally add GoReleaser.
- Verify GHCR package visibility/pull strategy.

### Phase 4: GitOps package

- Create `gitops/kustomize/pyxis` in k3s repo.
- Create Vault auth/secrets.
- Create DB bootstrap job.
- Create migration job if needed.
- Create deployment/service/ingress/PVC.
- Create `gitops/applications/pyxis.yaml`.
- Run `kubectl kustomize` or `kubectl apply --dry-run=server`.

### Phase 5: First rollout

- Write Vault secrets.
- Merge GitOps package.
- Apply Argo Application once.
- Watch sync and rollout.
- Validate public URL.
- Validate health endpoint.
- Validate DB-backed public shows/API.
- Validate staff Discord OAuth after bot installation.
- Validate flyer upload to PVC.

## 15. Validation commands

Local app validation:

```bash
make test
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit
make build-embed
./bin/pyxis serve --bind 127.0.0.1:18086
curl -i http://127.0.0.1:18086/health
```

Docker validation:

```bash
docker build -t pyxis:local .
docker run --rm -p 18086:8080 \
  -e PYXIS_DATABASE_URL='postgres://pyxis:pyxis@host.docker.internal:5433/pyxis?sslmode=disable' \
  pyxis:local
curl -i http://127.0.0.1:18086/health
```

GitOps validation:

```bash
cd /home/manuel/code/wesen/2026-03-27--hetzner-k3s
kubectl kustomize gitops/kustomize/pyxis
kubectl apply --dry-run=server -k gitops/kustomize/pyxis
```

Argo validation:

```bash
kubectl -n argocd get application pyxis
kubectl -n argocd describe application pyxis
kubectl -n pyxis get pods,svc,ingress,pvc,secrets
kubectl -n pyxis logs deploy/pyxis
```

Production HTTP validation:

```bash
curl -i https://pyxis.yolo.scapegoat.dev/health
curl -i https://pyxis.yolo.scapegoat.dev/api/public/settings
curl -i https://pyxis.yolo.scapegoat.dev/api/public/shows
curl -I https://pyxis.yolo.scapegoat.dev/
```

## 16. Risks and decisions

### Staff route exposure

The public site is safe to expose. The staff app should only be exposed once Discord OAuth is working in the production guild. If the staff app is embedded before that, make sure staff routes are protected and not just hidden by UI navigation.

### Discord bot guild membership

Earlier diagnostics showed the bot was not installed in the configured guild. This blocks real staff role lookup. Do not call production auth done until the bot can see the guild and fetch member roles.

### Flyer storage

Local filesystem storage is acceptable for v1 if backed by a PVC. It is not multi-replica safe. Keep replicas at `1` until storage moves to S3/R2 or equivalent.

### Migrations

Do not rely on humans remembering to run migrations manually. Add a migration Job or startup auto-migrate flag before first real production usage.

### Image pull

If the Pyxis repo or GHCR package is private, wire `image-pull-secret.yaml` through VaultStaticSecret. If the package is public, omit it and keep the deployment simpler.

## 17. Definition of done

Pyxis is “real” when all of the following are true:

- A clean checkout can run CI successfully.
- GitHub Actions publishes `ghcr.io/.../pyxis:sha-<commit>`.
- GitOps contains `gitops/kustomize/pyxis` and `gitops/applications/pyxis.yaml`.
- Argo CD has a live `pyxis` Application.
- Kubernetes runs a healthy Pyxis pod.
- `/health` returns 200 through ingress.
- public site pages load through the Go binary.
- public API reads from the production PostgreSQL database.
- database bootstrap is idempotent.
- migrations are automated or explicitly represented in GitOps.
- runtime secrets come from Vault/VSO.
- flyer uploads land on the PVC.
- staff Discord OAuth works against the configured guild.
- the image tag in production can be traced to a Git commit.
- rollback is a Git revert of the image bump or manifest change.
