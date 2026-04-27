#!/usr/bin/env python3
"""Build an operator review HTML page for public page visual-diff artifacts.

Usage:
  python3 05-build-public-pages-review.py \
    --summary-json /tmp/pyxis-public-pages-final-sweep.json \
    --output-dir /tmp/pyxis-public-pages-visual-review-YYYYMMDD-HHMMSS

The script is intentionally read-only with respect to comparison artifacts: it
summarizes already-captured css-visual-diff output and links the original
left/right/diff_only/compare artifacts for review.
"""

from __future__ import annotations

import argparse
import html
import json
import shutil
from pathlib import Path
from datetime import datetime


def load_rows(path: Path) -> list[dict]:
    payload = json.loads(path.read_text())
    if isinstance(payload, list) and payload and "rows" in payload[0]:
        return payload[0]["rows"]
    if isinstance(payload, dict) and "rows" in payload:
        return payload["rows"]
    raise SystemExit(f"Unsupported summary JSON shape: {path}")


def artifact(row: dict, name: str) -> str:
    if name == "diff":
        return row.get("diffOnlyPath") or ""
    base = Path(row.get("diffOnlyPath") or "")
    if not base:
        return ""
    artifacts = base.parent
    mapping = {
        "left": artifacts / "left_region.png",
        "right": artifacts / "right_region.png",
        "comparison": artifacts / "diff_comparison.png",
        "compare": artifacts / "compare.json",
    }
    return str(mapping[name])


def bundle_artifact(path: str, output_dir: Path, page: str, section: str, name: str) -> str:
    """Copy an artifact into the review bundle and return a relative URL."""
    if not path:
        return ""
    source = Path(path)
    if not source.exists():
        return ""
    target_dir = output_dir / "artifacts" / page / section
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / f"{name}{source.suffix}"
    shutil.copy2(source, target)
    return target.relative_to(output_dir).as_posix()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--summary-json", required=True, type=Path)
    ap.add_argument("--output-dir", required=True, type=Path)
    args = ap.parse_args()

    rows = sorted(load_rows(args.summary_json), key=lambda r: (-float(r.get("changedPercent", 0)), r.get("page", ""), r.get("section", "")))
    args.output_dir.mkdir(parents=True, exist_ok=True)

    cards = []
    for row in rows:
        raw_page = str(row.get("page", ""))
        raw_section = str(row.get("section", ""))
        page = html.escape(raw_page)
        section = html.escape(raw_section)
        cls = html.escape(str(row.get("classification", "")))
        pct = float(row.get("changedPercent", 0))
        diff = bundle_artifact(artifact(row, "diff"), args.output_dir, raw_page, raw_section, "diff_only")
        left = bundle_artifact(artifact(row, "left"), args.output_dir, raw_page, raw_section, "left_region")
        right = bundle_artifact(artifact(row, "right"), args.output_dir, raw_page, raw_section, "right_region")
        compare = bundle_artifact(artifact(row, "compare"), args.output_dir, raw_page, raw_section, "compare")
        cards.append(f"""
<section class='card {cls}' data-page='{page}' data-section='{section}'>
  <header>
    <div><strong>{page}</strong> / {section}</div>
    <div class='pill'>{cls} · {pct:.3f}%</div>
  </header>
  <div class='links'>
    <a href='{left}'>left/prototype</a>
    <a href='{right}'>right/react</a>
    <a href='{diff}'>diff_only</a>
    <a href='{compare}'>compare.json</a>
  </div>
  <div class='grid'>
    <figure><figcaption>Prototype</figcaption><img src='{left}' loading='lazy'></figure>
    <figure><figcaption>React</figcaption><img src='{right}' loading='lazy'></figure>
    <figure><figcaption>Diff only</figcaption><img src='{diff}' loading='lazy'></figure>
  </div>
  <textarea placeholder='Reviewer notes for {page}/{section}'></textarea>
  <button type='button' onclick="copyCard(this)">To clipboard</button>
</section>
""")

    generated = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    html_doc = f"""<!doctype html>
<html>
<head>
<meta charset='utf-8'>
<title>Pyxis public pages visual review</title>
<style>
body {{ margin: 0; padding: 24px; font: 14px/1.5 Inter, system-ui, sans-serif; background: #f7f4ee; color: #1a1a18; }}
h1 {{ margin: 0 0 8px; font-family: Georgia, serif; font-size: 34px; }}
.summary {{ margin: 0 0 24px; color: #6f675d; }}
.toolbar {{ position: sticky; top: 0; z-index: 2; background: #f7f4ee; padding: 12px 0; border-bottom: 1px solid #ddd6ca; margin-bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap; }}
button {{ background: #1a1a18; color: white; border: 0; border-radius: 6px; padding: 8px 12px; font-weight: 700; cursor: pointer; }}
.card {{ background: white; border: 1px solid #ddd6ca; border-radius: 12px; margin: 0 0 24px; padding: 16px; box-shadow: 0 8px 24px rgba(0,0,0,.04); }}
.card.tune-required {{ border-color: #d28b21; }}
.card.major-mismatch {{ border-color: #c8270d; }}
.card header {{ display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; }}
.pill {{ border-radius: 999px; padding: 4px 10px; background: #eee7dc; font-size: 12px; font-weight: 700; }}
.links {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }}
a {{ color: #c8270d; }}
.grid {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: start; }}
figure {{ margin: 0; border: 1px solid #eee7dc; background: #fff; overflow: auto; max-height: 760px; }}
figcaption {{ position: sticky; top: 0; background: #1a1a18; color: white; padding: 6px 8px; font-size: 12px; font-weight: 700; }}
img {{ display: block; max-width: 100%; height: auto; }}
textarea {{ width: 100%; min-height: 70px; margin: 12px 0; box-sizing: border-box; border: 1px solid #ddd6ca; border-radius: 8px; padding: 10px; font: inherit; }}
@media (max-width: 1100px) {{ .grid {{ grid-template-columns: 1fr; }} }}
</style>
</head>
<body>
<h1>Pyxis public pages visual review</h1>
<p class='summary'>Generated {generated}. Source summary: <code>{html.escape(str(args.summary_json))}</code>. Inspect diff_only first, then right/react, then left/prototype.</p>
<div class='toolbar'>
  <button onclick="filterCards('')">All</button>
  <button onclick="filterCards('tune-required')">Tune-required</button>
  <button onclick="filterCards('review')">Review</button>
  <button onclick="copyAll()">All notes to clipboard</button>
</div>
{''.join(cards)}
<script>
function filterCards(cls) {{
  document.querySelectorAll('.card').forEach(card => {{ card.style.display = !cls || card.classList.contains(cls) ? '' : 'none'; }});
}}
function cardText(card) {{
  return `${{card.dataset.page}}/${{card.dataset.section}}\n${{card.querySelector('.pill').textContent}}\nNotes: ${{card.querySelector('textarea').value}}`;
}}
function copyCard(button) {{ navigator.clipboard.writeText(cardText(button.closest('.card'))); }}
function copyAll() {{ navigator.clipboard.writeText([...document.querySelectorAll('.card')].map(cardText).join('\n\n---\n\n')); }}
</script>
</body>
</html>
"""
    (args.output_dir / "index.html").write_text(html_doc)
    print(args.output_dir / "index.html")


if __name__ == "__main__":
    main()
