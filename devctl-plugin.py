#!/usr/bin/env python3
"""
devctl plugin for pyxis development environment.

Profiles (set via PYXIS_DEV_PROFILE env var):
  full       backend + app-vite + site-vite  (default)
  backend    backend only
  frontends  app-vite + site-vite only
  no-auth    full stack without PYXIS_DEV_AUTH

Usage:
  devctl up                           # full profile (default)
  PYXIS_DEV_PROFILE=backend devctl up # backend only
  devctl status
  devctl logs --service backend --follow
  devctl down
"""

import json
import os
import shutil
import subprocess
import sys
import time

# ─── configuration ──────────────────────────────────────────────────────────
PROFILE = os.environ.get("PYXIS_DEV_PROFILE", "full").lower()

BACKEND_BIND = "127.0.0.1:8080"
APP_PORT = 3008
SITE_PORT = 3007
WEBSITE_URL = f"http://localhost:{APP_PORT}"
DISCORD_REDIRECT_URL = f"http://localhost:{APP_PORT}/auth/discord/callback"

DOCKER_COMPOSE = ["docker", "compose"]

# ─── profile definitions ────────────────────────────────────────────────────
# Each profile specifies which services to run and whether dev auth is enabled.
PROFILES = {
    "full": {
        "services": ["backend", "app-vite", "site-vite"],
        "dev_auth": True,
    },
    "backend": {
        "services": ["backend"],
        "dev_auth": True,
    },
    "frontends": {
        "services": ["app-vite", "site-vite"],
        "dev_auth": False,
    },
    "no-auth": {
        "services": ["backend", "app-vite", "site-vite"],
        "dev_auth": False,
    },
}

# ─── helpers ────────────────────────────────────────────────────────────────
def emit(obj):
    sys.stdout.write(json.dumps(obj) + "\n")
    sys.stdout.flush()


def log(msg):
    sys.stderr.write(msg + "\n")
    sys.stderr.flush()


def run(cmd, cwd=None, timeout=60):
    log(f"  $ {' '.join(cmd)}")
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
        if result.returncode != 0:
            log(f"  ! exit {result.returncode}")
            if result.stderr:
                log(result.stderr.strip())
            return False, result.stdout, result.stderr
        return True, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        log(f"  ! timed out after {timeout}s")
        return False, "", "timeout"
    except FileNotFoundError as e:
        log(f"  ! not found: {e.filename}")
        return False, "", str(e)


def get_services(profile_cfg):
    """Build the service list based on the active profile."""
    svc_names = profile_cfg["services"]
    all_svcs = {
        "backend": {
            "name": "backend",
            "command": [
                "direnv", "exec", ".",
                "go", "run", "./cmd/pyxis", "serve",
                "--bind", BACKEND_BIND,
            ],
            "env": {
                "PYXIS_WEBSITE_URL": WEBSITE_URL,
                "PYXIS_DISCORD_REDIRECT_URL": DISCORD_REDIRECT_URL,
            },
            "health": {
                "type": "http",
                "url": f"http://{BACKEND_BIND}/health",
                "timeout_ms": 30000,
            },
        },
        "app-vite": {
            "name": "app-vite",
            "cwd": "web",
            "command": [
                "direnv", "exec", ".",
                "pnpm", "--filter", "pyxis-app",
                "dev", "--host", "0.0.0.0",
            ],
            "health": {
                "type": "tcp",
                "address": f"127.0.0.1:{APP_PORT}",
                "timeout_ms": 30000,
            },
        },
        "site-vite": {
            "name": "site-vite",
            "cwd": "web",
            "command": [
                "direnv", "exec", ".",
                "pnpm", "--filter", "pyxis-user-site",
                "dev", "--host", "0.0.0.0", "--port", str(SITE_PORT),
            ],
            "health": {
                "type": "tcp",
                "address": f"127.0.0.1:{SITE_PORT}",
                "timeout_ms": 30000,
            },
        },
    }

    services = []
    for name in svc_names:
        svc = dict(all_svcs[name])
        if name == "backend" and profile_cfg["dev_auth"]:
            svc["env"] = dict(svc["env"])
            svc["env"]["PYXIS_DEV_AUTH"] = "1"
        services.append(svc)

    return services


# ─── handshake ──────────────────────────────────────────────────────────────
emit({
    "type": "handshake",
    "protocol_version": "v2",
    "plugin_name": "pyxis",
    "capabilities": {
        "ops": ["config.mutate", "validate.run", "prepare.run", "launch.plan"]
    },
})

# ─── request loop ───────────────────────────────────────────────────────────
for line in sys.stdin:
    line = line.strip()
    if not line:
        continue

    req = json.loads(line)
    rid = req.get("request_id", "")
    op = req.get("op", "")
    ctx = req.get("ctx", {}) or {}
    dry_run = bool(ctx.get("dry_run", False))
    repo_root = ctx.get("repo_root", ".")

    # Validate profile early
    if PROFILE not in PROFILES:
        emit({
            "type": "response",
            "request_id": rid,
            "ok": False,
            "error": {
                "code": "E_INVALID_PROFILE",
                "message": (
                    f"Unknown profile '{PROFILE}'. "
                    f"Valid profiles: {', '.join(PROFILES.keys())}"
                ),
            },
        })
        continue

    profile_cfg = PROFILES[PROFILE]

    if op == "config.mutate":
        emit({
            "type": "response",
            "request_id": rid,
            "ok": True,
            "output": {
                "config_patch": {
                    "set": {
                        "services.backend.bind": BACKEND_BIND,
                        "services.app.port": APP_PORT,
                        "services.site.port": SITE_PORT,
                        "env.PYXIS_WEBSITE_URL": WEBSITE_URL,
                        "env.PYXIS_DISCORD_REDIRECT_URL": DISCORD_REDIRECT_URL,
                        "env.PYXIS_DEV_PROFILE": PROFILE,
                    },
                    "unset": [],
                }
            },
        })

    elif op == "validate.run":
        errors = []
        warnings = []

        needed = {
            "docker": "docker",
            "go": "go",
            "pnpm": "pnpm",
            "direnv": "direnv",
        }
        missing = [name for name, cmd in needed.items() if not shutil.which(cmd)]
        if missing:
            install_hints = []
            for name in missing:
                if name == "docker":
                    install_hints.append("docker (https://docs.docker.com/get-docker/)")
                elif name == "go":
                    install_hints.append("go (https://go.dev/dl/ or 'brew install go')")
                elif name == "pnpm":
                    install_hints.append("pnpm (https://pnpm.io/installation)")
                elif name == "direnv":
                    install_hints.append("direnv (https://direnv.net/docs/installation.html)")
                else:
                    install_hints.append(name)
            errors.append({
                "code": "E_MISSING_TOOL",
                "message": f"Missing required tools: {', '.join(missing)}. Install: {', '.join(install_hints)}",
            })

        ok, _, _ = run(["docker", "compose", "version"], timeout=5)
        if not ok:
            errors.append({
                "code": "E_MISSING_TOOL",
                "message": "docker compose plugin not available. Install Docker Desktop or docker-engine + docker-compose-plugin (https://docs.docker.com/compose/install/)",
            })

        emit({
            "type": "response",
            "request_id": rid,
            "ok": True,
            "output": {
                "valid": len(errors) == 0,
                "errors": errors,
                "warnings": warnings,
            },
        })

    elif op == "prepare.run":
        if dry_run:
            log("[dry-run] would: docker compose up -d db")
            log("[dry-run] would: wait for postgres")
            log("[dry-run] would: go run ./cmd/pyxis migrate up")
            emit({
                "type": "response",
                "request_id": rid,
                "ok": True,
                "output": {
                    "steps": [
                        {"name": "db-up", "ok": True, "duration_ms": 0},
                        {"name": "db-wait", "ok": True, "duration_ms": 0},
                        {"name": "migrate", "ok": True, "duration_ms": 0},
                    ],
                    "artifacts": {},
                },
            })
            continue

        steps = []
        start = time.time()

        # 1. Start db
        log("Starting PostgreSQL container...")
        ok, _, _ = run(DOCKER_COMPOSE + ["up", "-d", "db"], cwd=repo_root, timeout=30)
        steps.append({"name": "db-up", "ok": ok, "duration_ms": int((time.time() - start) * 1000)})
        if not ok:
            emit({
                "type": "response",
                "request_id": rid,
                "ok": False,
                "error": {
                    "code": "E_PREPARE_FAILED",
                    "message": "Failed to start PostgreSQL container. Check 'docker compose logs db' and ensure Docker is running.",
                },
            })
            continue

        # 2. Wait for postgres
        wait_start = time.time()
        log("Waiting for PostgreSQL to be ready...")
        ready = False
        for i in range(30):
            ok, _, _ = run(
                DOCKER_COMPOSE + ["exec", "-T", "db", "pg_isready", "-U", "pyxis", "-d", "pyxis"],
                cwd=repo_root,
                timeout=5,
            )
            if ok:
                ready = True
                log("PostgreSQL is healthy")
                break
            time.sleep(1)
        steps.append({"name": "db-wait", "ok": ready, "duration_ms": int((time.time() - wait_start) * 1000)})
        if not ready:
            emit({
                "type": "response",
                "request_id": rid,
                "ok": False,
                "error": {
                    "code": "E_PREPARE_FAILED",
                    "message": "PostgreSQL did not become healthy within 30s. Check 'docker compose logs db' and verify the container is not out of disk/memory.",
                },
            })
            continue

        # 3. Run migrations (skip if backend is not in this profile and user says so)
        mig_start = time.time()
        log("Running database migrations...")
        ok, _, _ = run(
            ["direnv", "exec", ".", "go", "run", "./cmd/pyxis", "migrate", "up"],
            cwd=repo_root,
            timeout=60,
        )
        steps.append({"name": "migrate", "ok": ok, "duration_ms": int((time.time() - mig_start) * 1000)})
        if not ok:
            emit({
                "type": "response",
                "request_id": rid,
                "ok": False,
                "error": {
                    "code": "E_PREPARE_FAILED",
                    "message": "Database migrations failed. Run 'go run ./cmd/pyxis migrate up' manually to see the error. Common causes: schema conflict or database not reachable.",
                },
            })
            continue

        emit({
            "type": "response",
            "request_id": rid,
            "ok": True,
            "output": {
                "steps": steps,
                "artifacts": {},
            },
        })

    elif op == "launch.plan":
        services = get_services(profile_cfg)
        log(f"Profile '{PROFILE}': launching {len(services)} service(s): "
            f"{', '.join(s['name'] for s in services)}")
        emit({
            "type": "response",
            "request_id": rid,
            "ok": True,
            "output": {"services": services},
        })

    else:
        emit({
            "type": "response",
            "request_id": rid,
            "ok": False,
            "error": {"code": "E_UNSUPPORTED", "message": f"unsupported op: {op}"},
        })
