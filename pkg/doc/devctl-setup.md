---
Title: Pyxis Dev Environment with devctl
Slug: pyxis-devctl-setup
Short: "Start the full Pyxis dev stack (PostgreSQL, backend, staff app, public site) with a single `devctl up` command."
Topics:
  - pyxis
  - devctl
  - dev-environment
  - development
Commands:
  - devctl up
  - devctl down
  - devctl status
  - devctl logs
  - devctl plan
  - devctl tui
IsTopLevel: true
IsTemplate: false
ShowPerDefault: true
SectionType: GeneralTopic
---

## What this is

Pyxis uses [devctl](https://github.com/go-go-golems/devctl) to manage its development environment. Instead of juggling tmux sessions and remembering startup order, you run a single command and devctl supervises everything: PostgreSQL, database migrations, the Go backend, and both Vite frontend apps.

## Prerequisites

- [Go](https://go.dev/) 1.22+
- [Node.js](https://nodejs.org/) + [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) with the `docker compose` plugin
- [direnv](https://direnv.net/) (loads `.envrc` automatically)
- [devctl](https://github.com/go-go-golems/devctl) installed

Install devctl:

```bash
# macOS/Linux
brew tap go-go-golems/go-go-go
brew install go-go-golems/go-go-go/devctl

# Or with Go
go install github.com/go-go-golems/devctl/cmd/devctl@latest
```

## Quick start

```bash
# 1. Verify the plugin loads
devctl plugins list

# 2. Preview what would run (no side effects)
devctl plan

# 3. Start the full dev stack
devctl up

# 4. Check what's running
devctl status

# 5. Stream logs for a service
devctl logs --service backend --follow
devctl logs --service app-vite --follow

# 6. Stop everything
devctl down
```

## What `devctl up` starts

| Service | Description | URL |
|---------|-------------|-----|
| `backend` | Go HTTP server (API + auth) | http://127.0.0.1:8080 |
| `app-vite` | Staff management app (Vite) | http://localhost:3008 |
| `site-vite` | Public-facing show site (Vite) | http://localhost:3007 |
| `db` | PostgreSQL 16 (Docker) | localhost:5433 |

The `devctl up` pipeline runs in this order:

1. **config.mutate** — sets ports and OAuth redirect URLs
2. **validate.run** — checks that `docker`, `go`, `pnpm`, and `direnv` are installed
3. **prepare.run** — starts the PostgreSQL container, waits for it to be healthy, runs `go run ./cmd/pyxis migrate up`
4. **launch.plan** — starts the three supervised services
5. **Supervise** — devctl tracks PIDs, captures logs, and runs health checks

## Daily workflow

### Start or restart

```bash
devctl up                    # First start
devctl up --force           # Restart even if state exists
```

If state already exists from a previous session, devctl prompts:

```
state exists; restart (down then up)? (y/N):
```

Answer `y` or use `--force` to skip the prompt.

### Observe

```bash
devctl status                          # Running services, PIDs, health
devctl logs --service backend          # Backend stdout
devctl logs --service backend --stderr # Backend stderr
devctl logs --service app-vite --follow # Live tail staff app
devctl tui                             # Interactive dashboard
```

In the TUI:
- `u` — start/restart
- `d` — stop
- `l` or `Enter` — view logs for selected service
- `Tab` — switch views
- `q` — quit

### Stop

```bash
devctl down
```

This sends SIGTERM to all services, waits up to 3s, then SIGKILL if needed. The PostgreSQL container keeps running; use `docker compose down` to remove it.

### Dry-run

```bash
devctl up --dry-run
```

Shows the full pipeline output (config, prepare steps, validation, launch plan) without starting anything.

## Architecture

The dev setup is driven by two files at the repo root:

- **`.devctl.yaml`** — tells devctl to load `./devctl-plugin.py`
- **`devctl-plugin.py`** — a Python plugin that speaks the devctl NDJSON protocol

The plugin implements four pipeline phases:

| Phase | What it does |
|-------|--------------|
| `config.mutate` | Sets `services.backend.bind`, `services.app.port`, `services.site.port`, and OAuth env vars |
| `validate.run` | Checks for `docker`, `go`, `pnpm`, `direnv` |
| `prepare.run` | `docker compose up -d db`, waits for `pg_isready`, runs migrations |
| `launch.plan` | Defines the three supervised services with health checks |

## Service health checks

| Service | Type | Target |
|---------|------|--------|
| `backend` | HTTP | http://127.0.0.1:8080/health |
| `app-vite` | TCP | 127.0.0.1:3008 |
| `site-vite` | TCP | 127.0.0.1:3007 |

devctl waits for all health checks to pass before considering `up` successful. If a health check fails, all already-started services are stopped and the error is reported.

## Logs and state

devctl stores everything under `.devctl/`:

```
.devctl/
├── state.json              # Service PIDs, start times, health config
└── logs/
    ├── backend-20060102-150405.stdout.log
    ├── backend-20060102-150405.stderr.log
    ├── app-vite-20060102-150405.stdout.log
    └── ...
```

- **Logs**: Timestamped per run. Read with `devctl logs --service <name>`.
- **State**: Used by `status`, `logs`, and `down`. Deleted on `down`.
- **Reset**: `rm -rf .devctl/` or `devctl down`.

`.devctl/` is already in `.gitignore`.

## Environment variables

direnv loads `.envrc` automatically. The plugin sets these for the backend:

- `PYXIS_WEBSITE_URL=http://localhost:3008`
- `PYXIS_DISCORD_REDIRECT_URL=http://localhost:3008/auth/discord/callback`
- `PYXIS_DEV_AUTH=1` — enables the `/auth/dev-login` endpoint for local development

The Vite apps proxy `/api`, `/auth`, and `/flyers` to `http://localhost:8080` via their `vite.config.ts`.

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| `state exists; run devctl down first or use --force` | Previous `up` left state behind | Run `devctl down` or use `devctl up --force` |
| `missing tools: pnpm, docker` | Prerequisites not installed | Install Docker, Go, pnpm, and direnv |
| `postgres did not become healthy within 30s` | Docker container is slow or failing | Check `docker compose logs db` |
| `migrations failed` | Database not ready or migration conflict | Run `docker compose down` then `devctl up` again |
| `tcp health timeout` for Vite apps | Port already in use | Kill processes on `:3008` or `:3007` |
| `stdout contamination` in plugin | Plugin printed non-JSON to stdout | Check `devctl-plugin.py` — only `emit()` should write to stdout |

## Comparison with `make dev`

The previous `make dev` target used tmux sessions. devctl replaces it with:

| Feature | `make dev` | devctl |
|---------|-----------|--------|
| Startup | `make dev` | `devctl up` |
| Logs | `tmux attach` / `tail -f /tmp/...` | `devctl logs --service <name> --follow` |
| Stop | `make dev-stop` | `devctl down` |
| Health checks | None | HTTP/TCP probes on all services |
| State tracking | tmux sessions | `.devctl/state.json` + PID tracking |
| Dry-run | None | `devctl up --dry-run` |
| Dashboard | None | `devctl tui` |

`make dev`, `make dev-stop`, and `make dev-logs` are still in the Makefile for backward compatibility but devctl is the preferred approach.

## See Also

- `glaze help devctl-user-guide` — General devctl usage
- `glaze help devctl-plugin-authoring` — Writing devctl plugins
- `glaze help devctl-scripting-guide` — Plugin scripting patterns
- `glaze help devctl-tui-guide` — TUI reference
- [devctl README](https://github.com/go-go-golems/devctl) — Upstream documentation
