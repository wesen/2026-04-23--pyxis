#!/usr/bin/env python3
"""
Fix relative imports after moving organism components from:

    src/components/organisms/ComponentName/ComponentName.tsx

to:

    src/components/organisms/PageGroup/ComponentName/ComponentName.tsx

The safe rule is filesystem-based, not regex-depth-based:

1. For each relative import in moved organism files, check whether it resolves now.
2. If it does not resolve, try the same import with one extra '../' prepended.
3. Only rewrite when the extra '../' candidate resolves on disk.

This avoids blindly changing already-correct sibling imports such as:

    from '../DashboardHero'

while fixing imports that still point to the old flat location, such as:

    from '../Panel'              -> from '../../Panel'
    from '../../molecules/Card'  -> from '../../../molecules/Card'
    from '../../../api/mockData' -> from '../../../../api/mockData'

Usage:

    # Dry-run all files
    python3 scripts/02-fix-organism-import-paths.py --dry-run

    # Dry-run only a few files first
    python3 scripts/02-fix-organism-import-paths.py --dry-run --limit 5

    # Apply
    python3 scripts/02-fix-organism-import-paths.py --apply
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[6]
APP_SRC = REPO_ROOT / "web/packages/pyxis-app/src"
ORGANISMS = APP_SRC / "components/organisms"
PAGE_GROUPS = ["Bookings", "Calendar", "Dashboard", "Roster", "Settings", "ShowDetail", "Shows"]

IMPORT_RE = re.compile(r"(?P<prefix>\bfrom\s+['\"]|\bimport\s+['\"])(?P<spec>\.\.?/[^'\"]+)(?P<suffix>['\"])")

EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".css"]
INDEX_EXTENSIONS = ["index.ts", "index.tsx", "index.js", "index.jsx"]


@dataclass
class Change:
    path: Path
    old: str
    new: str
    line: int


def module_exists(importer: Path, spec: str) -> bool:
    """Approximate TS/Vite relative module resolution for project source files."""
    base = (importer.parent / spec).resolve()

    for ext in EXTENSIONS:
        candidate = Path(str(base) + ext)
        if candidate.is_file():
            return True

    if base.is_dir():
        for idx in INDEX_EXTENSIONS:
            if (base / idx).is_file():
                return True

    return False


def add_one_parent(spec: str) -> str:
    if spec.startswith("./"):
        return "../" + spec[2:]
    if spec.startswith("../"):
        return "../" + spec
    return spec


def line_number(content: str, offset: int) -> int:
    return content.count("\n", 0, offset) + 1


def fix_file(path: Path) -> tuple[str, list[Change]]:
    content = path.read_text()
    changes: list[Change] = []

    def repl(match: re.Match[str]) -> str:
        spec = match.group("spec")

        # If the current import already resolves, leave it alone.
        if module_exists(path, spec):
            return match.group(0)

        candidate = add_one_parent(spec)
        if candidate != spec and module_exists(path, candidate):
            changes.append(Change(path, spec, candidate, line_number(content, match.start("spec"))))
            return f"{match.group('prefix')}{candidate}{match.group('suffix')}"

        return match.group(0)

    return IMPORT_RE.sub(repl, content), changes


def iter_target_files() -> list[Path]:
    files: list[Path] = []
    for group in PAGE_GROUPS:
        group_dir = ORGANISMS / group
        if group_dir.exists():
            files.extend(sorted(group_dir.rglob("*.tsx")))
    return files


def main() -> int:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true", help="show changes but do not write files")
    mode.add_argument("--apply", action="store_true", help="write changes")
    parser.add_argument("--limit", type=int, default=0, help="only inspect the first N files")
    args = parser.parse_args()

    files = iter_target_files()
    if args.limit:
        files = files[: args.limit]

    total_changes: list[Change] = []
    changed_files: list[Path] = []

    for path in files:
        new_content, changes = fix_file(path)
        if changes:
            total_changes.extend(changes)
            changed_files.append(path)
            if args.apply:
                path.write_text(new_content)

    for change in total_changes:
        rel = change.path.relative_to(REPO_ROOT)
        print(f"{rel}:{change.line}: {change.old} -> {change.new}")

    print()
    print(f"mode: {'apply' if args.apply else 'dry-run'}")
    print(f"files inspected: {len(files)}")
    print(f"files changed: {len(changed_files)}")
    print(f"imports changed: {len(total_changes)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
