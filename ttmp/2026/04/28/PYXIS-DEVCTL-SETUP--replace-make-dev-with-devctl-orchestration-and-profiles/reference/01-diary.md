# Diary

## Goal

Replace the tmux-based `make dev` workflow in pyxis with a proper devctl plugin that supports multiple profiles (full, backend-only, frontends-only, no-auth), then document it in a Glazed help entry and update the Makefile to deprecate the old targets.

---

## Step 1: Investigate devctl upstream and design the plugin

**User prompt (verbatim):** "look at ../corporate-headquarters/devctl and figure out how to use it for a better version of Makefile `make dev`"

**Assistant interpretation:** Understand the devctl tool from the corporate-headquarters repo and design a replacement for the existing `make dev` tmux-based workflow.

**Inferred user intent:** The user wants to modernize the pyxis dev environment from manual tmux session management to a declarative, supervised orchestration tool.

### What I did

Read devctl's README, plugin authoring guide, testdata examples, and source code:
- `/home/manuel/code/wesen/corporate-headquarters/devctl/README.md`
- `/home/manuel/code/wesen/corporate-headquarters/devctl/pkg/doc/topics/devctl-plugin-authoring.md`
- `/home/manuel/code/wesen/corporate-headquarters/devctl/testdata/plugins/e2e/plugin.py`
- `/home/manuel/code/wesen/corporate-headquarters/devctl/cmd/devctl/cmds/up.go`
- `/home/manuel/code/wesen/corporate-headquarters/devctl/pkg/supervise/supervisor.go`

### What worked

The devctl protocol is straightforward NDJSON over stdio:
1. Handshake declares capabilities (`config.mutate`, `validate.run`, `prepare.run`, `launch.plan`)
2. devctl drives the plugin by sending requests on stdin
3. Plugin responds with JSON on stdout; logs go to stderr

Key findings from source code:
- `devctl up` runs: `config.mutate` → `build.run` → `prepare.run` → `validate.run` → `launch.plan` → supervise
- `devctl up` detects existing state and prompts for restart (or use `--force`)
- Shutdown: SIGTERM → 3s wait → SIGKILL
- Logs go to `.devctl/logs/<service>-<timestamp>.stdout.log`
- Health checks: TCP (dials every 200ms) or HTTP (GET every 300ms, accepts 2xx–4xx)

### What didn't work

Nothing failed during investigation, but I noted documentation gaps:
- No documented state/lifecycle behavior (had to read `up.go`)
- Incomplete pipeline examples in README (no `prepare.run`)
- Missing `.devctl.yaml` schema reference
- Health check schema scattered across examples

### What I learned

- `launch.plan` services are merged by `name`; stable names matter for `logs` and `status`
- `command` is an argv array; use `["bash", "-lc", "..."]` for shell features
- `cwd` is resolved relative to `repo_root`
- `env` is merged with parent environment
- `prepare.run` is the right place for DB startup and migrations

### What was tricky to build

Understanding how devctl's supervisor actually starts processes required reading `pkg/supervise/supervisor.go`. The key insight: devctl creates a new process group (`Setpgid: true`) and uses either direct exec or a wrapper executable depending on `WrapperExe`. For pyxis, the direct exec path is sufficient.

### What warrants a second pair of eyes

N/A — investigation phase only.

### What should be done in the future

Contribute doc patches back to devctl upstream (done in Step 4).

---

## Step 2: Create the pyxis devctl plugin

**User prompt (verbatim):** (implied continuation from Step 1)

**Assistant interpretation:** Build the actual plugin and config files.

**Inferred user intent:** Ship a working devctl setup for pyxis.

### What I did

Created three files:
- `.devctl.yaml` — config pointing to `./devctl-plugin.py`
- `devctl-plugin.py` — Python plugin implementing the full pipeline
- Updated `.gitignore` to ignore `.devctl/`

Plugin implements:
- `config.mutate`: sets `services.backend.bind=127.0.0.1:8080`, `services.app.port=3008`, `services.site.port=3007`, OAuth URLs
- `validate.run`: checks `docker`, `go`, `pnpm`, `direnv` are installed
- `prepare.run`: `docker compose up -d db`, waits for `pg_isready`, runs `go run ./cmd/pyxis migrate up`
- `launch.plan`: three supervised services with health checks

Verified with:
```bash
devctl plugins list   # handshake OK
devctl plan           # shows 3 services
devctl up --dry-run   # full pipeline preview
```

### What worked

Plugin handshake validated immediately. Dry-run showed correct config and service plan.

### What didn't work

Initially forgot to add `.devctl/` to `.gitignore` — fixed.

### What was tricky to build

Deciding how to run commands through direnv. The plugin uses `direnv exec . go run ...` so that `.envrc` env vars (Discord secrets) are loaded for the backend. For Vite apps, `direnv exec . pnpm --filter ...` ensures the same.

### What warrants a second pair of eyes

The `prepare.run` migration step runs `direnv exec . go run ./cmd/pyxis migrate up` with a 60s timeout. If migrations are slow or the DB is cold, this could timeout. Consider increasing or making it configurable.

### What should be done in the future

- Test `devctl up` with a cold start (no DB container)
- Verify health checks pass reliably on slower machines

---

## Step 3: Add profile support

**User prompt (verbatim):** "can we have different profiles for the devctl up?"

**Assistant interpretation:** The user wants to run subsets of services (e.g. backend-only, frontends-only, no dev auth) via a profile selector.

**Inferred user intent:** Make the dev environment flexible for different workflows — backend API work, frontend-only work, testing with real OAuth.

### What I did

Refactored `devctl-plugin.py` to support profiles via the `PYXIS_DEV_PROFILE` environment variable:

| Profile | Services | Dev auth |
|---------|----------|----------|
| `full` (default) | backend + app-vite + site-vite | yes |
| `backend` | backend only | yes |
| `frontends` | app-vite + site-vite | N/A |
| `no-auth` | backend + app-vite + site-vite | no |

Usage:
```bash
PYXIS_DEV_PROFILE=backend devctl up    # backend only
devctl up                              # full profile (default)
```

The plugin validates the profile name and returns `E_INVALID_PROFILE` if unknown. It also logs which services are being launched.

### What worked

The env-var approach is clean — no file changes needed to switch profiles, and devctl doesn't need to know about profiles at all.

### What didn't work

N/A.

### What was tricky to build

Deciding whether `prepare.run` should still start the DB for `frontends` profile. Decision: yes, keep it consistent. `docker compose up -d db` is idempotent, and migrations are harmless no-ops if already applied. The frontend apps still proxy to `/api` on `localhost:8080`, so a backend is expected to exist somewhere.

### What warrants a second pair of eyes

The profile env var is read at module load time (top-level), not per-request. This is fine because devctl starts a fresh plugin process for each command, but if devctl ever caches plugin processes, this would break.

### What should be done in the future

- Consider adding a `devctl` dynamic command (`pyxis-profile`) to switch profiles via a file or env helper
- Add a `--profile` flag if devctl ever supports passing arbitrary flags to plugins

---

## Step 4: Patch devctl upstream documentation

**User prompt (verbatim):** "how good was the devctl documentation? should it get updated?" followed by "ok, update them"

**Assistant interpretation:** Evaluate devctl docs and contribute patches.

**Inferred user intent:** Improve devctl documentation for future users (including the pyxis team).

### What I did

Updated 4 files in the devctl repo:

1. **`README.md`**
   - Added `.devctl.yaml` schema reference table
   - Added `devctl up` lifecycle section (state detection, prompt, shutdown)
   - Expanded flags table (`--force`, `--skip-validate`, `--skip-build`, `--skip-prepare`)
   - Updated State and Logs section with timestamped filenames

2. **`pkg/doc/topics/devctl-user-guide.md`**
   - Added restart behavior docs
   - Added `down` shutdown details
   - Added `--force`/`--skip-*` flags
   - Added "Logs on disk" subsection

3. **`pkg/doc/topics/devctl-plugin-authoring.md`**
   - Added `build.run`/`prepare.run` response schema table
   - Added `launch.plan` service schema table (with health check sub-fields)
   - Added section 6.6: "Supervision, logs, and process lifecycle"
   - Added section 15: "Cookbook" mapping all `testdata/plugins/` examples

4. **`docs/plugin-authoring.md`**
   - Added service schema table and expanded example list

### What worked

All edits applied cleanly. The authoring guide now has complete schema tables that I wish I'd had when writing the pyxis plugin.

### What didn't work

N/A.

### What was tricky to build

The `edit` tool requires exact text matching. I had to read files carefully to get whitespace right. Merged nearby changes into single edit calls to avoid overlap.

### What warrants a second pair of eyes

The upstream doc changes are in a sibling repo (`../corporate-headquarters/devctl`). They need to be committed and pushed separately from pyxis.

### What should be done in the future

Submit a PR to the devctl repo with these documentation improvements.

---

## Step 5: Create Glazed help entry and wire into CLI

**User prompt (verbatim):** "create a document in th epyxis docs (in the glazed helper format entry) about the devctl setup / update existing documentation if needed"

**Assistant interpretation:** Create a Glazed help topic for the devctl setup and integrate it into the pyxis CLI.

**Inferred user intent:** Make the devctl documentation discoverable via `pyxis help pyxis-devctl-setup`.

### What I did

Created `pkg/doc/devctl-setup.md` with Glazed frontmatter:
- `Slug: pyxis-devctl-setup`
- `SectionType: GeneralTopic`
- `IsTopLevel: true`

Created `pkg/doc/doc.go` with `go:embed` to embed help files.

Wired into `cmd/pyxis/main.go`:
```go
helpSystem := help.NewHelpSystem()
if err := doc.AddDocToHelpSystem(helpSystem); err != nil {
    return err
}
help_cmd.SetupCobraRootCommand(helpSystem, rootCmd)
```

Verified:
```bash
go build ./cmd/pyxis
go run ./cmd/pyxis help pyxis-devctl-setup   # renders correctly
```

Also updated `web/README.md` to mention `devctl up` as the recommended full-stack workflow.

### What worked

The help system picked up the new topic immediately. `pyxis help pyxis-devctl-setup` renders the full document.

### What didn't work

N/A.

### What was tricky to build

Understanding the exact Glazed help wiring pattern. The key is that `help.NewHelpSystem()` must load sections from the embedded FS *before* `help_cmd.SetupCobraRootCommand()` is called. The reference pattern is in `corporate-headquarters/glazed/cmd/glaze/main.go`.

### What warrants a second pair of eyes

The `pkg/doc/doc.go` file uses `//go:embed *.md` which embeds all `.md` files in `pkg/doc/`. If future docs are added there, they'll automatically be loaded. This is correct but worth noting.

### What should be done in the future

- Add more Glazed help topics for other pyxis workflows (e.g. database migrations, deployment)
- Consider embedding the playbooks from `docs/playbooks/` into the help system too

---

## Step 6: Remove legacy Makefile targets

**User prompt (verbatim):** "delete the targets" (referring to `dev`, `dev-stop`, `dev-logs`)

**Assistant interpretation:** Remove the tmux-based dev targets from the Makefile.

**Inferred user intent:** Clean up the legacy workflow now that devctl is the primary approach.

### What I did

Deleted from `Makefile`:
- `.PHONY` entries: `dev`, `dev-stop`, `dev-logs`
- All tmux/dev variables: `TMUX`, `DEV_BACKEND_SESSION`, `DEV_VITE_SESSION`, `DEV_PUBLIC_VITE_SESSION`, `DEV_BACKEND_BIND`, `DEV_VITE_HOST`, `DEV_WEBSITE_URL`, `DEV_PUBLIC_SITE_URL`, `DEV_DISCORD_REDIRECT_URL`
- Targets: `dev`, `dev-stop`, `dev-logs` (the entire tmux orchestration block)

Added a comment at the top:
```makefile
# Development environment: use `devctl up` instead of `make dev`.
# See: pyxis help pyxis-devctl-setup
```

### What worked

Makefile is now clean. Remaining targets: `build`, `build-web`, `generate-web`, `build-embed`, `serve-embed`, `test`, `lint`, `migrate`, `migrate-down`, `seed`, `generate`, `clean`.

### What didn't work

N/A.

### What was tricky to build

The `edit` tool needed exact matching for the large Makefile block. I had to carefully identify the boundaries of the `dev` target (which spans many lines) and the `dev-stop`/`dev-logs` targets.

### What warrants a second pair of eyes

N/A — straightforward deletion.

### What should be done in the future

N/A.

---

## Step 7: Answer `devctl run` question

**User prompt (verbatim):** "what does devctl run do?"

**Assistant interpretation:** The user is asking about a `devctl run` command, likely expecting it to exist analogous to `docker compose run` or `make run`.

**Inferred user intent:** Understand the devctl command surface to know if there's a one-off execution command.

### What I did

Investigated the devctl codebase:
- Checked `cmd/devctl/cmds/` — no `run.go` exists
- Checked `root.go` — registered commands are: `completion`, `down`, `help`, `logs`, `plan`, `plugins`, `status`, `stream`, `tui`, `up`, `wrap-service`
- Checked `dynamic_commands.go` — plugins can expose custom commands via `command.run`, but these are plugin-specific (e.g. `devctl db-reset`), not a generic `run`

Ran `devctl --help` to confirm:
```
Available Commands:
  completion  Generate autocompletion script
  down        Stop supervised services and remove state
  help        Help about any command or topic
  logs        Show logs for a supervised service
  plan        Compute a merged launch plan from plugins
  plugins     Plugin discovery and inspection
  status      Show status of supervised services
  stream      Start and inspect protocol streams
  tui         Interactive terminal UI for devctl
  up          Start the dev environment
```

### What I learned

**`devctl run` does not exist.** There is no one-off execution command. The closest equivalents are:

| What you want | devctl command |
|--------------|----------------|
| Start the dev environment | `devctl up` |
| Stop the dev environment | `devctl down` |
| Run a plugin-defined custom command | `devctl <plugin-command>` (e.g. `devctl db-reset` if a plugin exposes it) |
| Run a one-off command against a running service | Use `devctl logs` or attach to the process directly |

If a plugin exposes a `command.run` capability, devctl dynamically wires it as a top-level subcommand. For example, if the pyxis plugin exposed a `db-reset` command, you would run `devctl db-reset`. But there is no generic `devctl run <service> <cmd>`.

### What should be done in the future

If one-off commands are needed (e.g. `devctl run backend go test ./...`), they would need to be added as dynamic `command.run` handlers in the plugin, or devctl upstream would need a new `run` verb.

---

## Summary

| Artifact | Status |
|----------|--------|
| `.devctl.yaml` | ✅ Created |
| `devctl-plugin.py` | ✅ Created with profiles |
| `pkg/doc/devctl-setup.md` | ✅ Created (Glazed help entry) |
| `pkg/doc/doc.go` | ✅ Created (`go:embed` wiring) |
| `cmd/pyxis/main.go` | ✅ Updated (help system integration) |
| `web/README.md` | ✅ Updated (devctl reference) |
| `Makefile` | ✅ Legacy targets removed |
| `.gitignore` | ✅ `.devctl/` added |
| devctl upstream docs | ✅ Patched (4 files) |
