#!/usr/bin/env python3
"""Check unresolved relative imports in pyxis-app source files.

This intentionally checks CSS side-effect imports as well as TS/TSX imports.
`tsc --noEmit` can miss broken CSS imports that Vite later reports via
[plugin:vite:import-analysis].

Usage:

    python3 scripts/check-relative-imports.py

The script exits non-zero when unresolved relative imports are found.
"""

from __future__ import annotations

import re
from pathlib import Path

APP_ROOT = Path(__file__).resolve().parents[1]
SRC = APP_ROOT / "src"

IMPORT_RE = re.compile(
    r"(?P<prefix>\bfrom\s+['\"]|\bimport\s+['\"])(?P<spec>\.\.?/[^'\"]+)(?P<suffix>['\"])"
)

SOURCE_EXTENSIONS = {".ts", ".tsx", ".js", ".jsx"}
RESOLVE_EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".css"]
INDEX_FILES = ["index.ts", "index.tsx", "index.js", "index.jsx"]


def module_exists(importer: Path, spec: str) -> bool:
    base = (importer.parent / spec).resolve()

    for ext in RESOLVE_EXTENSIONS:
        candidate = Path(str(base) + ext)
        if candidate.is_file():
            return True

    if base.is_dir():
        return any((base / index_file).is_file() for index_file in INDEX_FILES)

    return False


def line_number(content: str, offset: int) -> int:
    return content.count("\n", 0, offset) + 1


def main() -> int:
    unresolved: list[tuple[Path, int, str]] = []

    for path in sorted(SRC.rglob("*")):
        if path.suffix not in SOURCE_EXTENSIONS:
            continue

        content = path.read_text()
        for match in IMPORT_RE.finditer(content):
            spec = match.group("spec")
            if not module_exists(path, spec):
                unresolved.append((path, line_number(content, match.start("spec")), spec))

    for path, line, spec in unresolved:
        print(f"{path.relative_to(APP_ROOT)}:{line}: {spec}")

    print(f"unresolved: {len(unresolved)}")
    return 1 if unresolved else 0


if __name__ == "__main__":
    raise SystemExit(main())
