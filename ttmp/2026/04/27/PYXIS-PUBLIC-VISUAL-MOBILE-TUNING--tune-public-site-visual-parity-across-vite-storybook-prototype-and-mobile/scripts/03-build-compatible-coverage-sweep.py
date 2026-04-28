#!/usr/bin/env python3
"""Build a css-visual-diff-review-compatible coverage sweep.

The previous public-page review tooling expects a css-visual-diff summary JSON shaped as:

  [{ pageCount, sectionCount, classificationCounts, rows: [...] }]

and each row points at image artifacts plus compare.json/compare.md. This script emits
that same shape for a *coverage rundown*. The images are generated coverage cards,
not pixel screenshots; they make the bundle consumable by the same review UI while
clearly marking rows as coverage/planning items.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import textwrap
from datetime import datetime
from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

THIS_DIR = Path(__file__).resolve().parent
RUN_SCRIPT = THIS_DIR / "02-build-public-visual-coverage-rundown.py"

CLASS_FOR_STATUS = {
    "covered": "accepted",
    "covered-partial": "review",
    "covered-broad-noisy": "review",
    "needs-design-review": "review",
    "needs-focused-review": "tune-required",
    "needs-deep-coverage": "tune-required",
    "needs-coverage": "tune-required",
    "needs-story-coverage": "tune-required",
}

PERCENT_FOR_STATUS = {
    "covered": 0.0,
    "covered-partial": 2.0,
    "covered-broad-noisy": 8.0,
    "needs-design-review": 9.0,
    "needs-focused-review": 20.0,
    "needs-deep-coverage": 25.0,
    "needs-coverage": 30.0,
    "needs-story-coverage": 30.0,
}


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    return ImageFont.load_default()


def draw_card(path: Path, title: str, lines: list[str], accent: tuple[int, int, int]) -> None:
    width, height = 820, 520
    img = Image.new("RGB", (width, height), (252, 250, 246))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, width - 1, height - 1], outline=(221, 214, 202), width=2)
    draw.rectangle([0, 0, width, 58], fill=accent)
    draw.text((24, 16), title[:90], fill=(255, 255, 255), font=font(22, True))
    y = 82
    for raw in lines:
        wrapped = textwrap.wrap(str(raw), width=78) or [""]
        for line in wrapped:
            draw.text((24, y), line, fill=(26, 26, 24), font=font(18, False))
            y += 27
            if y > height - 34:
                draw.text((24, y), "…", fill=(26, 26, 24), font=font(18, True))
                path.parent.mkdir(parents=True, exist_ok=True)
                img.save(path)
                return
        y += 8
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path)


def load_coverage(output_dir: Path) -> dict[str, Any]:
    raw_path = output_dir / "coverage-source.json"
    cmd = ["python3", str(RUN_SCRIPT), "--output-dir", str(output_dir), "--json-out", str(raw_path)]
    subprocess.run(cmd, check=True)
    return json.loads(raw_path.read_text())


def compare_payload(page: dict[str, Any], element: dict[str, Any], row: dict[str, Any]) -> dict[str, Any]:
    return {
        "bounds": {"changed": False, "left": None, "right": None, "delta": None},
        "pixel": {
            "changedPercent": row["changedPercent"],
            "changedPixels": row["changedPixels"],
            "totalPixels": row["totalPixels"],
            "note": "Coverage rundown row; generated cards, not a pixel screenshot comparison.",
        },
        "left": {"page": page["page"], "routes": page.get("routes", {}), "pairDescriptions": row.get("pairDescriptions", {})},
        "right": {"element": element["name"], "selector": element["selector"], "status": element["status"]},
        "styles": [
            {"property": "coverage-status", "left": "planned", "right": element["status"], "changed": element["status"] != "covered"},
            {"property": "priority", "left": "n/a", "right": element["priority"], "changed": True},
            {"property": "viewports", "left": "n/a", "right": ", ".join(element.get("viewports", [])), "changed": True},
            {"property": "pairs", "left": "n/a", "right": ", ".join(element.get("pairs", [])), "changed": True},
        ],
        "attributes": [
            {"name": "selector", "left": None, "right": element["selector"], "changed": True},
            {"name": "notes", "left": None, "right": element.get("notes", page.get("notes", "")), "changed": bool(element.get("notes") or page.get("notes"))},
        ],
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", type=Path, default=Path("/tmp/pyxis-public-visual-coverage-rundown"))
    ap.add_argument("--json-out", type=Path, default=Path("/tmp/pyxis-public-visual-coverage-rundown.json"))
    args = ap.parse_args()

    if args.output_dir.exists():
        shutil.rmtree(args.output_dir)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    coverage = load_coverage(args.output_dir)
    rows: list[dict[str, Any]] = []
    classification_counts: dict[str, int] = {}

    for page in coverage["pages"]:
        for element in page["elements"]:
            status = element["status"]
            classification = CLASS_FOR_STATUS.get(status, "tune-required")
            classification_counts[classification] = classification_counts.get(classification, 0) + 1
            changed = PERCENT_FOR_STATUS.get(status, 30.0)
            total = 10000
            changed_pixels = int(total * changed / 100.0)
            section = element["name"]
            art_dir = args.output_dir / page["page"] / "artifacts" / section
            diff = art_dir / "diff_only.png"
            left = art_dir / "left_region.png"
            right = art_dir / "right_region.png"
            comparison = art_dir / "diff_comparison.png"
            compare_json = art_dir / "compare.json"
            compare_md = art_dir / "compare.md"

            draw_card(left, f"{page['page']} / {section}: routes", [
                f"Page: {page['page']}",
                f"Prototype desktop: {page.get('routes', {}).get('prototypeDesktop')}",
                f"Prototype mobile: {page.get('routes', {}).get('prototypeMobile')}",
                f"Storybook desktop: {page.get('routes', {}).get('storybookDesktop')}",
                f"Storybook mobile: {page.get('routes', {}).get('storybookMobile')}",
                f"Vite: {page.get('routes', {}).get('vite')}",
                f"Page note: {page.get('notes', '')}",
            ], (26, 26, 24))
            draw_card(right, f"{page['page']} / {section}: selector", [
                f"Element: {section}",
                f"Selector: {element['selector']}",
                f"Priority: {element['priority']}",
                f"Status: {status}",
                f"Viewports: {', '.join(element.get('viewports', []))}",
                f"Pairs: {', '.join(element.get('pairs', []))}",
                f"Notes: {element.get('notes', '')}",
                f"Last observed: {element.get('lastObserved', '')}",
            ], (200, 39, 13) if classification != "accepted" else (60, 122, 79))
            draw_card(diff, f"{page['page']} / {section}: coverage status", [
                f"Classification: {classification}",
                f"Synthetic changedPercent: {changed}",
                "This is a compatibility coverage card, not a screenshot diff.",
                "Use this row to decide which real css-visual-diff comparison to run next.",
            ], (210, 139, 33) if classification == "tune-required" else (46, 93, 158))

            # Comparison triptych card.
            canvas = Image.new("RGB", (2460, 520), (255, 255, 255))
            for idx, src in enumerate([left, right, diff]):
                im = Image.open(src)
                canvas.paste(im, (idx * 820, 0))
            canvas.save(comparison)

            row = {
                "page": page["page"],
                "variant": "coverage",
                "section": section,
                "classification": classification,
                "changedPercent": changed,
                "changedPixels": changed_pixels,
                "totalPixels": total,
                "threshold": 30,
                "leftSelector": "coverage/routes",
                "rightSelector": element["selector"],
                "bounds": {"changed": False, "left": None, "right": None, "delta": None},
                "text": {"changed": True, "left": page.get("notes", ""), "right": element.get("notes", "")},
                "styleChangeCount": 4,
                "attributeChangeCount": 2,
                "artifactJson": str(compare_json),
                "artifactMarkdown": str(compare_md),
                "leftRegionPath": str(left),
                "rightRegionPath": str(right),
                "diffOnlyPath": str(diff),
                "diffComparisonPath": str(comparison),
                "coverageStatus": status,
                "priority": element["priority"],
                "viewports": element.get("viewports", []),
                "pairs": element.get("pairs", []),
                "pairDescriptions": coverage.get("pairDescriptions", {}),
            }
            compare_json.write_text(json.dumps(compare_payload(page, element, row), indent=2))
            compare_md.write_text(f"# Coverage row: {page['page']} / {section}\n\nStatus: `{status}`\n\nSelector: `{element['selector']}`\n")
            rows.append(row)

    rows.sort(key=lambda r: (-r["changedPercent"], r["page"], r["section"]))
    suite = {
        "classificationCounts": classification_counts,
        "jsonPath": str(args.output_dir / "compare-all-output.json"),
        "markdownPath": str(args.output_dir / "01-suite-summary.md"),
        "maxChangedPercent": max((r["changedPercent"] for r in rows), default=0),
        "pageCount": len(coverage["pages"]),
        "sectionCount": len(rows),
        "policy": {"failureCount": 0, "ok": True, "worstClassification": "tune-required"},
        "rows": rows,
        "source": "coverage-rundown-compatible",
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
    }
    (args.output_dir / "compare-all-output.json").write_text(json.dumps([suite], indent=2))
    (args.output_dir / "summary.json").write_text(json.dumps([suite], indent=2))
    (args.output_dir / "01-suite-summary.md").write_text(f"# Pyxis public visual coverage rundown\n\nRows: {len(rows)}\n\nThis is a compatibility coverage sweep.\n")
    args.json_out.write_text(json.dumps([suite], indent=2))

    print(f"html: {args.output_dir / 'index.html'}")
    print(f"json: {args.json_out}")
    print(f"compatibleSummary: {args.output_dir / 'summary.json'}")
    print(f"rows: {len(rows)}")


if __name__ == "__main__":
    main()
