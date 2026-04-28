#!/usr/bin/env python3
"""Inventory pyxis-app routes, visual spec targets, API endpoints, and likely action handlers.

Purpose:
  This script is a read-only exploration aid for PYXIS-APP-VISUAL-FUNCTIONAL-AUDIT.
  It gathers the main staff-app surfaces that an intern needs before tuning visuals
  or checking functional coverage. It does not modify files.

Usage:
  python3 scripts/01-inventory-app-surfaces.py --output sources/01-app-surface-inventory.json
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[6]
APP = ROOT / "web/packages/pyxis-app/src"
SPEC_PAGES = ROOT / "prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml"
SPEC_COMPONENTS = ROOT / "prototype-design/visual-diff/userland/specs/app.components.visual.yml"
SERVER = ROOT / "pkg/server/server.go"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def collect_routes() -> list[dict[str, str]]:
    text = read(APP / "App.tsx")
    rows = []
    for m in re.finditer(r'<Route\s+path="([^"]+)"\s+element=\{<RequireSession><([A-Za-z0-9_]+)', text):
        rows.append({"path": m.group(1), "pageComponent": m.group(2), "auth": "RequireSession"})
    if '<Route path="/login"' in text:
        rows.insert(0, {"path": "/login", "pageComponent": "LoginPage", "auth": "PublicOnlyLogin"})
    return rows


def collect_story_files() -> list[dict[str, str]]:
    rows = []
    for path in sorted((APP / "pages").glob("*Page/Page.stories.tsx")):
        text = read(path)
        title = re.search(r"title:\s*['\"]([^'\"]+)", text)
        rows.append({"file": str(path.relative_to(ROOT)), "title": title.group(1) if title else ""})
    return rows


def collect_spec_targets(path: Path) -> list[dict[str, object]]:
    text = read(path)
    targets = []
    current: dict[str, object] | None = None
    current_section: dict[str, str] | None = None
    for line in text.splitlines():
        if m := re.match(r"\s*- page: (.+)", line):
            if current:
                targets.append(current)
            current = {"page": m.group(1).strip(), "sections": []}
        elif current and (m := re.match(r"\s*storyId: (.+)", line)):
            current["storyId"] = m.group(1).strip()
        elif current and (m := re.match(r"\s*prototypePath: (.+)", line)):
            current["prototypePath"] = m.group(1).strip()
        elif current and (m := re.match(r"\s*- name: (.+)", line)):
            current_section = {"name": m.group(1).strip()}
            current["sections"].append(current_section)  # type: ignore[index]
        elif current_section and (m := re.match(r"\s*original: ['\"]?(.+?)['\"]?$", line)):
            current_section["original"] = m.group(1).strip()
        elif current_section and (m := re.match(r"\s*react: ['\"]?(.+?)['\"]?$", line)):
            current_section["react"] = m.group(1).strip()
    if current:
        targets.append(current)
    return targets


def collect_frontend_endpoints() -> dict[str, str]:
    text = read(APP / "api/endpoints.ts")
    out: dict[str, str] = {}
    for m in re.finditer(r"(\w+):\s*(?:\([^)]*\)\s*=>\s*)?`?['\"]?([^,`'\"]+)", text):
        out[m.group(1)] = m.group(2)
    return out


def collect_server_routes() -> list[dict[str, str]]:
    text = read(SERVER)
    rows = []
    for m in re.finditer(r'mux\.Handle(?:Func)?\("([A-Z]+)\s+([^" ]+)"[^\n]+(?:requireRole\(([^)]*)\))?', text):
        roles = (m.group(3) or "").replace('"', '').replace(' ', '')
        rows.append({"method": m.group(1), "path": m.group(2), "roles": roles})
    return rows


def collect_action_lines() -> list[dict[str, object]]:
    rows = []
    for base in [APP / "pages", APP / "components"]:
        for path in sorted(base.rglob("*.tsx")):
            text = read(path)
            for idx, line in enumerate(text.splitlines(), start=1):
                if any(token in line for token in ["onClick=", "onSubmit=", "disabled", "console.log", "href=\"#"]):
                    rows.append({"file": str(path.relative_to(ROOT)), "line": idx, "text": line.strip()[:240]})
    return rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    data = {
        "routes": collect_routes(),
        "pageStories": collect_story_files(),
        "visualSpecs": {
            "pages": collect_spec_targets(SPEC_PAGES),
            "components": collect_spec_targets(SPEC_COMPONENTS),
        },
        "frontendEndpoints": collect_frontend_endpoints(),
        "serverRoutes": collect_server_routes(),
        "actionLines": collect_action_lines(),
    }
    out = Path(args.output)
    if not out.is_absolute():
        out = ROOT / out
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(out)


if __name__ == "__main__":
    main()
