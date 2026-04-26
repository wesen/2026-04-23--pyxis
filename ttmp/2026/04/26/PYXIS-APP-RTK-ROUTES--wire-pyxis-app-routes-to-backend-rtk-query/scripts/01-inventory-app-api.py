#!/usr/bin/env python3
"""Inventory backend staff app routes and frontend RTK Query endpoint declarations.

Run from the repository root:

    ttmp/2026/04/26/PYXIS-APP-RTK-ROUTES--wire-pyxis-app-routes-to-backend-rtk-query/scripts/01-inventory-app-api.py

The script intentionally uses simple regex extraction. It is a ticket aid, not a compiler.
"""
from __future__ import annotations

import re
from pathlib import Path

def find_repo_root() -> Path:
    here = Path(__file__).resolve()
    for parent in [here, *here.parents]:
        if (parent / "go.mod").exists() and (parent / "web/pnpm-workspace.yaml").exists():
            return parent
    raise RuntimeError("could not find repository root from script path")


ROOT = find_repo_root()
SERVER = ROOT / "pkg/server/server.go"
FRONTEND_ENDPOINTS = ROOT / "web/packages/pyxis-app/src/api/endpoints.ts"
FRONTEND_API = ROOT / "web/packages/pyxis-app/src/api/appApi.ts"

ROUTE_RE = re.compile(r'mux\.Handle(?:Func)?\("(?:(GET|POST|PATCH|DELETE) )?([^"{]+(?:\{[^}]+\}[^"{]*)*)"')
ENDPOINT_RE = re.compile(r"^\s*(\w+):\s*(?:'([^']+)'|\(([^)]*)\)\s*=>\s*`([^`]+)`)", re.M)
HOOK_RE = re.compile(r"(\w+):\s*builder\.(query|mutation)<([^>]*)>\(\{\s*query:\s*([^,}]+)", re.S)


def main() -> None:
    print("# Pyxis App API Inventory\n")
    print("## Backend staff routes from pkg/server/server.go\n")
    server_text = SERVER.read_text()
    for method, path in ROUTE_RE.findall(server_text):
        if "/api/app" not in path and "/auth" not in path:
            continue
        print(f"- `{method or 'ANY'} {path}`")

    print("\n## Frontend endpoint constants from pyxis-app/src/api/endpoints.ts\n")
    endpoints_text = FRONTEND_ENDPOINTS.read_text()
    for name, literal, arg, template in ENDPOINT_RE.findall(endpoints_text):
        value = literal or template
        print(f"- `{name}` -> `{value}`")

    print("\n## RTK Query builder declarations from appApi.ts\n")
    api_text = FRONTEND_API.read_text()
    for name, kind, types, query in HOOK_RE.findall(api_text):
        print(f"- `{name}`: `{kind}` `<{types.strip()}>`, query `{query.strip()}`")


if __name__ == "__main__":
    main()
