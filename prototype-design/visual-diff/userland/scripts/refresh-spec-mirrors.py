#!/usr/bin/env python3
"""Refresh CommonJS mirrors for Pyxis visual suite YAML specs.

The YAML specs are the reviewed source of truth. The css-visual-diff Goja
runtime can consume YAML through objectFromFile for explicit verb arguments, but
registry-backed ergonomic verbs need a synchronous CommonJS default spec. This
script regenerates that mirror so the JS file does not drift from YAML.
"""

from __future__ import annotations

import json
from pathlib import Path
import sys

try:
    import yaml
except ImportError as exc:  # pragma: no cover - operator-facing error path
    raise SystemExit("PyYAML is required: python3 -m pip install PyYAML") from exc

ROOT = Path(__file__).resolve().parents[1]
SPECS_DIR = ROOT / "specs"
HEADER = """// Generated mirror of {yaml_name} for registry-backed ergonomic verbs.
// Keep the YAML spec as the reviewed source of truth; run scripts/refresh-spec-mirrors.py after spec edits.

"""


def mirror_spec(yaml_path: Path) -> Path:
    spec = yaml.safe_load(yaml_path.read_text())
    if not isinstance(spec, dict):
        raise ValueError(f"{yaml_path} did not parse to an object")
    js_path = yaml_path.with_suffix(".js")
    js_path.write_text(HEADER.format(yaml_name=yaml_path.name) + "module.exports = " + json.dumps(spec, indent=2) + "\n")
    return js_path


def main(argv: list[str]) -> int:
    specs = [Path(arg) for arg in argv] if argv else sorted(SPECS_DIR.glob("*.visual.yml"))
    if not specs:
        raise SystemExit(f"no *.visual.yml specs found in {SPECS_DIR}")
    for spec in specs:
        js_path = mirror_spec(spec)
        print(f"wrote {js_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
