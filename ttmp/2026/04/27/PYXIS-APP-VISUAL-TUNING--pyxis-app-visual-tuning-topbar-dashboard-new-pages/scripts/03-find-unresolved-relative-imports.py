#!/usr/bin/env python3
"""Find unresolved relative imports in pyxis-app source files, including CSS side-effect imports.

Unlike TypeScript, this catches CSS imports that Vite resolves.
"""
from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[6]
SRC = REPO_ROOT / "web/packages/pyxis-app/src"
IMPORT_RE = re.compile(r"(?P<prefix>\bfrom\s+['\"]|\bimport\s+['\"])(?P<spec>\.\.?/[^'\"]+)(?P<suffix>['\"])")
EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".css"]
INDEX_EXTENSIONS = ["index.ts", "index.tsx", "index.js", "index.jsx"]


def module_exists(importer: Path, spec: str) -> bool:
    base = (importer.parent / spec).resolve()
    for ext in EXTENSIONS:
        candidate = Path(str(base) + ext)
        if candidate.is_file():
            return True
    if base.is_dir():
        return any((base / idx).is_file() for idx in INDEX_EXTENSIONS)
    return False


def main() -> int:
    unresolved: list[tuple[Path, int, str]] = []
    for path in sorted(SRC.rglob("*")):
        if path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        content = path.read_text()
        for match in IMPORT_RE.finditer(content):
            spec = match.group("spec")
            if not module_exists(path, spec):
                line = content.count("\n", 0, match.start("spec")) + 1
                unresolved.append((path, line, spec))
    for path, line, spec in unresolved:
        print(f"{path.relative_to(REPO_ROOT)}:{line}: {spec}")
    print(f"unresolved: {len(unresolved)}")
    return 1 if unresolved else 0

if __name__ == "__main__":
    raise SystemExit(main())
