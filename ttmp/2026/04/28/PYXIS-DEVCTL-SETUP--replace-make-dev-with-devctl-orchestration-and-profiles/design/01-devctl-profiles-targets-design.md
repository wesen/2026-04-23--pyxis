# Adding Profile and Target Support to devctl

## A Detailed Design and Implementation Guide

---

## What This Document Is

This guide explains how to add **profiles** and **targets** to devctl as first-class features. It is written for someone who is new to the codebase but knows Go and has read the devctl user guide. We cover every subsystem that needs to change, why it needs to change, and what the new code should look like. By the end you should be able to implement this feature from scratch.

---

## The Problem

Right now devctl has one implicit profile: "run everything." When you type `devctl up`, every plugin that declares `launch.plan` contributes every service it knows about. There is no built-in way to say:

- "Start only the backend today"
- "Start the storybook server, not the full app"
- "Use the embedded build pipeline, not the dev Vite server"
- "Run integration tests, which need a different database setup"

Teams work around this by:

- Using environment variables in their plugin (`PYXIS_DEV_PROFILE=backend`)
- Writing separate plugins and swapping `.devctl.yaml` files
- Maintaining shell scripts that wrap devctl

These workarounds are fragile because devctl itself does not understand profiles. It cannot filter services, track state per profile, or show you which profile is active in the TUI.

---

## What We Want

A **profile** is a named selection of services and pipeline phases. A **target** is a higher-level named environment configuration that may include its own plugins, config overrides, and service definitions. In practice the terms blur together; for this design we treat "profile" as the user-facing concept and implement it through a combination of config schema changes, protocol extensions, and pipeline filtering.

### User experience

```bash
# List available profiles
devctl profiles list

# Start a specific profile
devctl up --profile backend

# Start the default profile (explicit)
devctl up --profile default

# Start without a profile (backward compatible)
devctl up

# Status is profile-aware
devctl status --profile backend

# Stop only services from this profile
devctl down --profile backend

# TUI shows the active profile
devctl tui --profile storybook
```

---

## Architecture Overview: How devctl Works Today

Before we can change anything, we need to understand the current system. devctl is a pipeline-based orchestrator. Here is the data flow from config file to running process:

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│  .devctl.yaml   │────▶│  Repository  │────▶│   Plugin    │
│  (config file)  │     │   (loader)   │     │  processes  │
└─────────────────┘     └──────────────┘     └─────────────┘
                                                      │
                              ┌───────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Pipeline                            │
│  config.mutate → build.run → prepare.run → validate.run    │
│                      ↓                                      │
│                launch.plan → Supervisor.Start               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      State & Logs                           │
│  .devctl/state.json        .devctl/logs/                    │
└─────────────────────────────────────────────────────────────┘
```

### Key packages and their responsibilities

| Package | File(s) | Responsibility |
|---------|---------|----------------|
| `pkg/config` | `config.go` | Parse `.devctl.yaml` into a `config.File` struct |
| `pkg/discovery` | `discovery.go` | Convert config plugins into `runtime.PluginSpec` values; auto-discover `plugins/devctl-*` executables |
| `pkg/repository` | `repository.go` | Load config + specs; start plugin client processes |
| `pkg/runtime` | `client.go`, `meta.go` | NDJSON protocol over stdio; manage plugin child processes |
| `pkg/protocol` | `types.go` | JSON frame types: Handshake, Request, Response, Event |
| `pkg/patch` | `patch.go` | Dotted-path config merging (`services.backend.port = 8080`) |
| `pkg/engine` | `pipeline.go`, `types.go` | Run the pipeline phases; merge outputs from multiple plugins |
| `pkg/supervise` | `supervisor.go` | Start OS processes from `launch.plan`; health checks; log capture |
| `pkg/state` | `state.go` | Read/write `.devctl/state.json`; track PIDs |
| `cmd/devctl/cmds` | `up.go`, `down.go`, `status.go`, `logs.go`, `tui.go` | CLI command implementations |

### The config file today

```yaml
plugins:
  - id: pyxis
    path: python3
    args: [./devctl-plugin.py]
    priority: 10
strictness: warn
```

This is parsed into `config.File`:

```go
type File struct {
    Plugins    []Plugin `yaml:"plugins"`
    Strictness string   `yaml:"strictness,omitempty"`
}

type Plugin struct {
    ID       string            `yaml:"id"`
    Path     string            `yaml:"path"`
    Args     []string          `yaml:"args,omitempty"`
    Priority int               `yaml:"priority,omitempty"`
    WorkDir  string            `yaml:"workdir,omitempty"`
    Env      map[string]string `yaml:"env,omitempty"`
}
```

### The request context today

When devctl sends a request to a plugin, it includes a `RequestContext`:

```go
type RequestContext struct {
    RepoRoot   string `json:"repo_root,omitempty"`
    Cwd        string `json:"cwd,omitempty"`
    DeadlineMs int64  `json:"deadline_ms,omitempty"`
    DryRun     bool   `json:"dry_run,omitempty"`
}
```

Notice: there is **no profile or target field**. The plugin has no way to know which profile the user requested unless we add it.

### The state file today

```go
type State struct {
    RepoRoot  string          `json:"repo_root"`
    CreatedAt time.Time       `json:"created_at"`
    Services  []ServiceRecord `json:"services"`
}
```

Notice: there is **no profile field**. All services from all profiles go into the same state file. This means you cannot run `devctl up --profile backend` and `devctl up --profile frontends` at the same time without them clobbering each other's state.

---

## Design: Profiles as a First-Class Feature

### Core principle

Profiles are **declared in `.devctl.yaml`**, **passed through the protocol to plugins**, **used to filter services in the pipeline**, and **stored in state** so that every devctl command is profile-aware.

### The new config file

```yaml
plugins:
  - id: pyxis
    path: python3
    args: [./devctl-plugin.py]
    priority: 10

profiles:
  default:
    description: "Full dev stack: backend + frontends"
    plugin-overrides:
      pyxis:
        env:
          PYXIS_DEV_PROFILE: full

  backend:
    description: "Backend API server only"
    select-services:
      - backend
    plugin-overrides:
      pyxis:
        env:
          PYXIS_DEV_PROFILE: backend

  frontends:
    description: "Staff app + public site only"
    select-services:
      - app-vite
      - site-vite
    plugin-overrides:
      pyxis:
        env:
          PYXIS_DEV_PROFILE: frontends

  storybook:
    description: "Component library storybook"
    plugins:
      - id: storybook
        path: bash
        args: [-c, "pnpm --filter pyxis-components storybook"]
        priority: 20
```

This design supports three mechanisms:

1. **`select-services`** — after all plugins produce their `launch.plan`, only services matching these names are started.
2. **`plugin-overrides`** — extra env vars (or args, priority) applied to a plugin when this profile is active.
3. **`plugins`** — profile-specific plugins that are only loaded for this profile.

### The new config types

```go
// pkg/config/config.go

type File struct {
    Plugins    []Plugin            `yaml:"plugins"`
    Profiles   map[string]Profile  `yaml:"profiles,omitempty"`
    Strictness string              `yaml:"strictness,omitempty"`
}

type Profile struct {
    Description       string              `yaml:"description,omitempty"`
    SelectServices    []string            `yaml:"select-services,omitempty"`
    PluginOverrides   map[string]Plugin   `yaml:"plugin-overrides,omitempty"`
    Plugins           []Plugin            `yaml:"plugins,omitempty"`
}
```

Key design decisions:

- **Profiles are optional** — if no profiles are defined, devctl behaves exactly as it does today.
- **`default` is the implicit profile** — if profiles exist but the user does not specify one, `default` is used. If no `default` profile exists and the user does not specify one, devctl falls back to the legacy behavior (all services).
- **Profile-local plugins are merged with global plugins** — profile plugins are appended to the global plugin list before discovery sorts them by priority.
- **`plugin-overrides` merge shallowly** — they override top-level fields (`env`, `args`, `priority`) but do not replace the entire plugin spec.

---

## What Changes in Each Subsystem

### 1. Config (`pkg/config/config.go`)

**What changes:** Add `Profile` and `Profiles` types.

**Why:** The config file is the source of truth for what profiles exist and what they mean.

**Pseudocode:**

```go
package config

// Existing types stay the same...

type File struct {
    Plugins    []Plugin           `yaml:"plugins"`
    Profiles   map[string]Profile `yaml:"profiles,omitempty"`
    Strictness string             `yaml:"strictness,omitempty"`
}

type Profile struct {
    Description     string            `yaml:"description,omitempty"`
    SelectServices  []string          `yaml:"select-services,omitempty"`
    PluginOverrides map[string]Plugin `yaml:"plugin-overrides,omitempty"`
    Plugins         []Plugin          `yaml:"plugins,omitempty"`
}

// GetProfile returns a profile by name, or nil if not found.
func (f *File) GetProfile(name string) *Profile {
    if f.Profiles == nil {
        return nil
    }
    p, ok := f.Profiles[name]
    if !ok {
        return nil
    }
    return &p
}

// DefaultProfileName is the profile used when the user does not specify one.
const DefaultProfileName = "default"
```

### 2. Discovery (`pkg/discovery/discovery.go`)

**What changes:** Accept an optional active profile; merge profile-local plugins and overrides into the spec list.

**Why:** Profile-specific plugins need to be discovered. Plugin overrides need to be applied before the plugin process starts.

**Pseudocode:**

```go
package discovery

type Options struct {
    RepoRoot string
    Profile  *config.Profile  // NEW
}

func Discover(cfg *config.File, opts Options) ([]runtime.PluginSpec, error) {
    // ... existing global plugin discovery ...

    // If a profile is active, apply overrides and add profile-local plugins.
    if opts.Profile != nil {
        for i := range out {
            if override, ok := opts.Profile.PluginOverrides[out[i].ID]; ok {
                applyOverride(&out[i], override)
            }
        }
        for _, p := range opts.Profile.Plugins {
            spec, err := toSpec(opts.RepoRoot, p)
            if err != nil {
                return nil, err
            }
            out = append(out, spec)
        }
        // Re-sort because we may have changed priorities or added new plugins.
        sort.SliceStable(out, func(i, j int) bool {
            if out[i].Priority != out[j].Priority {
                return out[i].Priority < out[j].Priority
            }
            return out[i].ID < out[j].ID
        })
    }

    return out, nil
}

func applyOverride(spec *runtime.PluginSpec, override config.Plugin) {
    if len(override.Args) > 0 {
        spec.Args = override.Args
    }
    if override.Priority != 0 {
        spec.Priority = override.Priority
    }
    if override.WorkDir != "" {
        spec.WorkDir = override.WorkDir
    }
    for k, v := range override.Env {
        if spec.Env == nil {
            spec.Env = map[string]string{}
        }
        spec.Env[k] = v
    }
}
```

### 3. Protocol (`pkg/protocol/types.go`)

**What changes:** Add `Profile` to `RequestContext`.

**Why:** Plugins need to know which profile is active so they can return the correct services, config, and validation results.

```go
type RequestContext struct {
    RepoRoot   string `json:"repo_root,omitempty"`
    Cwd        string `json:"cwd,omitempty"`
    DeadlineMs int64  `json:"deadline_ms,omitempty"`
    DryRun     bool   `json:"dry_run,omitempty"`
    Profile    string `json:"profile,omitempty"`  // NEW
}
```

This is a backward-compatible change. Old plugins will ignore the new field. New plugins can read `ctx.profile` and adapt their behavior.

### 4. Runtime (`pkg/runtime/meta.go`, `pkg/runtime/client.go`)

**What changes:** Add `Profile` to `RequestMeta`; pass it into `RequestContext`.

**Why:** `RequestMeta` is the Go struct that carries repo context from the CLI down to the protocol layer.

```go
// pkg/runtime/meta.go

type RequestMeta struct {
    RepoRoot string
    Cwd      string
    DryRun   bool
    Profile  string  // NEW
}
```

```go
// pkg/runtime/client.go — in requestContextFrom()

func requestContextFrom(ctx context.Context, meta RequestMeta) protocol.RequestContext {
    rc := protocol.RequestContext{}
    // ... existing deadline, repo_root, cwd, dry_run ...
    rc.Profile = meta.Profile  // NEW
    return rc
}
```

### 5. Repository (`pkg/repository/repository.go`)

**What changes:** Pass profile through to discovery; store it for later use.

**Why:** The repository is the bridge between config loading and plugin instantiation.

```go
type Options struct {
    RepoRoot   string
    ConfigPath string
    Cwd        string
    DryRun     bool
    Profile    string  // NEW
}

type Repository struct {
    Root      string
    Config    *config.File
    Specs     []runtime.PluginSpec
    SpecByID  map[string]runtime.PluginSpec
    Request   runtime.RequestMeta
    ConfigAbs string
    Profile   string  // NEW — the active profile name
}

func Load(opts Options) (*Repository, error) {
    // ... load config ...

    var activeProfile *config.Profile
    if opts.Profile != "" {
        activeProfile = cfg.GetProfile(opts.Profile)
        if activeProfile == nil {
            return nil, errors.Errorf("unknown profile %q", opts.Profile)
        }
    }

    specs, err := discovery.Discover(cfg, discovery.Options{
        RepoRoot: root,
        Profile:  activeProfile,
    })
    if err != nil {
        return nil, err
    }

    // ...
    return &Repository{
        // ... existing fields ...
        Profile: opts.Profile,
    }, nil
}
```

### 6. Engine Pipeline (`pkg/engine/pipeline.go`)

**What changes:** Add a `Filter` method that selects only services matching the profile's `select-services` list.

**Why:** Even if plugins return all services, the pipeline should only start the ones relevant to the active profile.

```go
// NEW: FilterPlan selects services by name from a launch plan.
func FilterPlan(plan LaunchPlan, allowed []string) LaunchPlan {
    if len(allowed) == 0 {
        return plan  // No filter = everything
    }
    allowedSet := map[string]struct{}{}
    for _, name := range allowed {
        allowedSet[name] = struct{}{}
    }
    var out []ServiceSpec
    for _, svc := range plan.Services {
        if _, ok := allowedSet[svc.Name]; ok {
            out = append(out, svc)
        }
    }
    return LaunchPlan{Services: out}
}
```

This is called in `cmd/devctl/cmds/up.go` after `p.LaunchPlan()` but before `sup.Start()`.

### 7. State (`pkg/state/state.go`)

**What changes:** Add `Profile` to `State`; change state file path to be profile-scoped.

**Why:** Different profiles must not clobber each other's state. You should be able to run `devctl up --profile backend` and `devctl up --profile frontends` simultaneously without conflict.

```go
type State struct {
    RepoRoot  string          `json:"repo_root"`
    Profile   string          `json:"profile,omitempty"`  // NEW
    CreatedAt time.Time       `json:"created_at"`
    Services  []ServiceRecord `json:"services"`
}

// StatePath now includes the profile name.
func StatePath(repoRoot string, profile string) string {
    if profile == "" || profile == "default" {
        return filepath.Join(repoRoot, StateDirName, StateFilename)
    }
    return filepath.Join(repoRoot, StateDirName, fmt.Sprintf("state-%s.json", profile))
}
```

Similarly, logs should go into profile-scoped directories:

```go
func LogsDir(repoRoot string, profile string) string {
    if profile == "" || profile == "default" {
        return filepath.Join(repoRoot, StateDirName, LogsDirName)
    }
    return filepath.Join(repoRoot, StateDirName, fmt.Sprintf("logs-%s", profile))
}
```

### 8. Supervisor (`pkg/supervise/supervisor.go`)

**What changes:** Accept profile name in `Options`; use it for log directory paths.

**Why:** Log files need to be isolated per profile just like state.

```go
type Options struct {
    RepoRoot        string
    ShutdownTimeout time.Duration
    ReadyTimeout    time.Duration
    WrapperExe      string
    Profile         string  // NEW
}
```

Update all `state.LogsDir(...)` calls to pass `s.opts.Profile`.

### 9. CLI Commands

#### `up.go`

**What changes:**
1. Add `--profile` flag
2. Pass profile through `Repository.Options`
3. After `p.LaunchPlan()`, call `engine.FilterPlan(plan, allowedServices)` if profile has `select-services`
4. Pass profile to `supervise.Options` and `state.Save()`

```go
func newUpCmd() *cobra.Command {
    var profile string  // NEW
    // ... existing flags ...

    cmd := &cobra.Command{
        RunE: func(cmd *cobra.Command, args []string) error {
            // ... existing setup ...
            repo, err := repository.Load(repository.Options{
                RepoRoot:   opts.RepoRoot,
                ConfigPath: opts.Config,
                Cwd:        meta.Cwd,
                DryRun:     opts.DryRun,
                Profile:    profile,  // NEW
            })
            // ...
            plan, err := p.LaunchPlan(opCtx, conf)
            // ...
            // NEW: Filter services if profile has select-services.
            if profile != "" && repo.Config != nil {
                if p := repo.Config.GetProfile(profile); p != nil && len(p.SelectServices) > 0 {
                    plan = engine.FilterPlan(plan, p.SelectServices)
                }
            }
            // ...
            sup := supervise.New(supervise.Options{
                RepoRoot:     opts.RepoRoot,
                ReadyTimeout: opts.Timeout,
                WrapperExe:   wrapperExe,
                Profile:      profile,  // NEW
            })
            st, err := sup.Start(ctx, plan)
            // ...
            st.Profile = profile  // NEW
            if err := state.Save(opts.RepoRoot, profile, st); err != nil {  // NEW signature
                // ...
            }
        },
    }

    cmd.Flags().StringVar(&profile, "profile", "", "Profile to use (from .devctl.yaml)")  // NEW
    // ... existing flags ...
}
```

#### `down.go`

**What changes:** Add `--profile` flag; load profile-scoped state.

```go
func newDownCmd() *cobra.Command {
    var profile string  // NEW

    cmd := &cobra.Command{
        RunE: func(cmd *cobra.Command, args []string) error {
            // ...
            st, err := state.Load(opts.RepoRoot, profile)  // NEW signature
            // ...
            sup := supervise.New(supervise.Options{
                RepoRoot:        opts.RepoRoot,
                ShutdownTimeout: opts.Timeout,
                Profile:         profile,  // NEW
            })
            // ...
            return state.Remove(opts.RepoRoot, profile)  // NEW signature
        },
    }

    cmd.Flags().StringVar(&profile, "profile", "", "Profile to stop")  // NEW
    AddRepoFlags(cmd)
    return cmd
}
```

#### `status.go`, `logs.go`

Both need `--profile` and profile-scoped state loading.

#### `plan.go`

Add `--profile` to preview what a specific profile would run.

#### `tui.go`

Add `--profile` flag and pass it through `RootOptions` to the action runner.

### 10. New command: `profiles list`

**What changes:** Add a new CLI command.

**Why:** Users need to discover what profiles are available.

```go
func newProfilesListCmd() *cobra.Command {
    return &cobra.Command{
        Use:   "list",
        Short: "List available profiles from .devctl.yaml",
        RunE: func(cmd *cobra.Command, args []string) error {
            opts, err := getRootOptions(cmd)
            if err != nil {
                return err
            }
            cfg, err := config.LoadOptional(opts.Config)
            if err != nil {
                return err
            }
            if len(cfg.Profiles) == 0 {
                fmt.Fprintln(cmd.OutOrStdout(), "No profiles defined.")
                return nil
            }
            for name, profile := range cfg.Profiles {
                fmt.Fprintf(cmd.OutOrStdout(), "%s: %s\n", name, profile.Description)
            }
            return nil
        },
    }
}
```

---

## Data Flow with Profiles

Here is the full pipeline with profiles added:

```
User runs: devctl up --profile backend

         ┌─────────────────────────────┐
         │  1. Parse CLI flags         │
         │     profile = "backend"     │
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  2. Load .devctl.yaml       │
         │     Find profile "backend"  │
         │     → select-services       │
         │     → plugin-overrides      │
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  3. Discovery               │
         │     Merge global + profile  │
         │     plugins; apply overrides│
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  4. Start plugin processes  │
         │     RequestMeta.Profile =   │
         │     "backend"               │
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  5. Pipeline phases         │
         │     config.mutate           │
         │     validate.run            │
         │     prepare.run             │
         │     launch.plan             │
         │       → plugins see         │
         │         ctx.profile         │
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  6. Filter services         │
         │     Keep only "backend"     │
         │     from select-services    │
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  7. Supervise               │
         │     Start filtered services │
         │     Logs → .devctl/logs/    │
         └─────────────┬───────────────┘
                       ▼
         ┌─────────────────────────────┐
         │  8. Save state              │
         │     .devctl/state-backend.json
         └─────────────────────────────┘
```

---

## Plugin Protocol Changes

Plugins receive the profile name in every request's `ctx.profile` field. Here is how a plugin should handle it:

### Minimal change (backward compatible)

```python
# Old plugin — ignores profile, works fine
for line in sys.stdin:
    req = json.loads(line)
    rid = req.get("request_id", "")
    op = req.get("op", "")
    ctx = req.get("ctx", {})
    # ... handle ops as before ...
```

### Profile-aware plugin

```python
for line in sys.stdin:
    req = json.loads(line)
    rid = req.get("request_id", "")
    op = req.get("op", "")
    ctx = req.get("ctx", {})
    profile = ctx.get("profile", "") or "default"

    if op == "launch.plan":
        # Return all services; devctl will filter them
        services = get_all_services()
        # Or: return only services relevant to this profile
        if profile == "backend":
            services = [s for s in services if s["name"] == "backend"]
        emit({...})
```

**Design note:** We intentionally allow plugins to either (a) return all services and let devctl filter them, or (b) return only profile-relevant services. Both work. Filtering in devctl is the safer default because it prevents plugins from accidentally starting services that the user did not request.

---

## State Isolation

With profiles, state files are isolated:

```
.devctl/
├── state.json              # default profile (or legacy, no profile)
├── state-backend.json      # backend profile
├── state-frontends.json    # frontends profile
├── logs/                   # default profile logs
├── logs-backend/           # backend profile logs
└── logs-frontends/         # frontends profile logs
```

This means:

- `devctl up --profile backend` writes to `state-backend.json`
- `devctl up --profile frontends` writes to `state-frontends.json`
- Both can run simultaneously without conflict
- `devctl down --profile backend` only stops services from the backend profile
- `devctl status --profile backend` only shows backend services

---

## TUI Changes

The TUI needs minimal changes:

1. Add `--profile` flag to `devctl tui`
2. Pass profile through `RootOptions` to the action runner
3. The dashboard should display the active profile name in the header
4. The state watcher should poll the profile-scoped state file

```go
type RootOptions struct {
    RepoRoot string
    Config   string
    Strict   bool
    DryRun   bool
    Timeout  time.Duration
    Profile  string  // NEW
}
```

---

## Backward Compatibility

This design preserves full backward compatibility:

1. **No profiles in `.devctl.yaml`** → devctl behaves exactly as before
2. **Plugins that ignore `ctx.profile`** → still work; devctl handles filtering
3. **State file path for default/no-profile** → stays at `.devctl/state.json`
4. **All existing CLI flags** → unchanged behavior

---

## Implementation Order

We recommend implementing this in five phases:

### Phase 1: Config and Protocol (no CLI changes)

- Add `Profile` to `config.File`
- Add `Profile` to `protocol.RequestContext`
- Add `Profile` to `runtime.RequestMeta`
- Update discovery to support profile merging
- Write unit tests for config parsing and discovery merging

### Phase 2: State Isolation

- Add `Profile` to `state.State`
- Change `StatePath()` and `LogsDir()` to be profile-scoped
- Update `supervise.Options` with profile
- Update `up.go` and `down.go` to use new state paths
- Test: run `devctl up` with default profile, verify state file location

### Phase 3: Pipeline Filtering

- Add `engine.FilterPlan()`
- Call it in `up.go` after `launch.plan`
- Test: define a profile with `select-services`, verify only those services start

### Phase 4: CLI Flags

- Add `--profile` to `up`, `down`, `status`, `logs`, `plan`, `tui`
- Add `devctl profiles list` command
- Update help text

### Phase 5: Documentation

- Update `.devctl.yaml` schema reference in README
- Update plugin authoring guide with `ctx.profile`
- Add cookbook example: "Profile-aware plugin"

---

## Example: Profile-Aware Plugin

Here is a complete example plugin that uses profiles:

```python
#!/usr/bin/env python3
import json, os, sys

PROFILE = os.environ.get("PYXIS_DEV_PROFILE", "full")

PROFILES = {
    "full":      ["backend", "app-vite", "site-vite"],
    "backend":   ["backend"],
    "frontends": ["app-vite", "site-vite"],
    "storybook": ["storybook"],
}

def emit(obj):
    sys.stdout.write(json.dumps(obj) + "\n")
    sys.stdout.flush()

emit({
    "type": "handshake",
    "protocol_version": "v2",
    "plugin_name": "pyxis",
    "capabilities": {
        "ops": ["config.mutate", "validate.run", "prepare.run", "launch.plan"]
    },
})

for line in sys.stdin:
    if not line.strip():
        continue
    req = json.loads(line)
    rid = req.get("request_id", "")
    op = req.get("op", "")
    ctx = req.get("ctx", {})
    profile = ctx.get("profile", "") or "default"

    if op == "config.mutate":
        emit({
            "type": "response", "request_id": rid, "ok": True,
            "output": {"config_patch": {
                "set": {
                    "env.PYXIS_PROFILE": profile,
                    "services.backend.port": 8080,
                },
                "unset": []
            }}
        })

    elif op == "launch.plan":
        all_services = {
            "backend":   {"name": "backend",   "command": ["go", "run", "."]},
            "app-vite":  {"name": "app-vite",  "command": ["pnpm", "dev"]},
            "site-vite": {"name": "site-vite", "command": ["pnpm", "dev"]},
            "storybook": {"name": "storybook", "command": ["pnpm", "storybook"]},
        }
        allowed = PROFILES.get(profile, list(all_services.keys()))
        services = [all_services[name] for name in allowed if name in all_services]
        emit({
            "type": "response", "request_id": rid, "ok": True,
            "output": {"services": services}
        })

    else:
        emit({
            "type": "response", "request_id": rid, "ok": False,
            "error": {"code": "E_UNSUPPORTED", "message": f"unsupported op: {op}"}
        })
```

And the matching `.devctl.yaml`:

```yaml
plugins:
  - id: pyxis
    path: python3
    args: [./devctl-plugin.py]
    priority: 10

profiles:
  default:
    description: "Full stack"
  backend:
    description: "Backend only"
    select-services: [backend]
  frontends:
    description: "Frontends only"
    select-services: [app-vite, site-vite]
  storybook:
    description: "Storybook only"
    select-services: [storybook]
```

---

## Open Questions

1. **Should `devctl down` without `--profile` stop all profiles?**  
   Current design: no, it stops only the default/legacy profile. A future `devctl down --all` flag could stop everything.

2. **Should plugins be able to declare their own profiles?**  
   Current design: no, profiles are repo-level (in `.devctl.yaml`). Plugin-level profiles add complexity without clear benefit.

3. **Should `prepare.run` and `build.run` also be filtered by profile?**  
   Current design: no. `prepare.run` steps (like migrations) are typically shared infrastructure. If a profile truly needs different prepare steps, its plugin can check `ctx.profile` and return different steps.

4. **Should the TUI allow switching profiles without restarting?**  
   Future work: yes, but requires significant TUI state machine changes. Out of scope for the initial implementation.

---

## File Reference Summary

| File | Change |
|------|--------|
| `pkg/config/config.go` | Add `Profile` struct, `Profiles` map to `File` |
| `pkg/discovery/discovery.go` | Accept `*config.Profile`; merge overrides and local plugins |
| `pkg/protocol/types.go` | Add `Profile string` to `RequestContext` |
| `pkg/runtime/meta.go` | Add `Profile string` to `RequestMeta` |
| `pkg/runtime/client.go` | Pass `meta.Profile` into `requestContextFrom` |
| `pkg/repository/repository.go` | Accept `Profile` in `Options`; pass to discovery |
| `pkg/engine/pipeline.go` | Add `FilterPlan()` function |
| `pkg/engine/types.go` | No changes needed |
| `pkg/state/state.go` | Add `Profile` to `State`; profile-scoped `StatePath()` and `LogsDir()` |
| `pkg/supervise/supervisor.go` | Add `Profile` to `Options`; use profile-scoped log paths |
| `cmd/devctl/cmds/up.go` | Add `--profile` flag; filter plan; pass profile to supervisor and state |
| `cmd/devctl/cmds/down.go` | Add `--profile` flag; load profile-scoped state |
| `cmd/devctl/cmds/status.go` | Add `--profile` flag |
| `cmd/devctl/cmds/logs.go` | Add `--profile` flag |
| `cmd/devctl/cmds/plan.go` | Add `--profile` flag |
| `cmd/devctl/cmds/tui.go` | Add `--profile` flag; pass through `RootOptions` |
| `cmd/devctl/cmds/plugins.go` | Add `profiles list` subcommand |
| `README.md` | Update `.devctl.yaml` schema reference |
| `pkg/doc/topics/devctl-plugin-authoring.md` | Document `ctx.profile` and profile-aware plugin patterns |

---

## See Also

- `glaze help devctl-plugin-authoring` — Plugin protocol reference
- `glaze help devctl-user-guide` — User-facing devctl documentation
- `devctl-plugin.py` in the pyxis repo — Real-world profile-aware plugin (env-var approach)
- `pkg/doc/topics/devctl-tui-guide` — TUI architecture and extension points
