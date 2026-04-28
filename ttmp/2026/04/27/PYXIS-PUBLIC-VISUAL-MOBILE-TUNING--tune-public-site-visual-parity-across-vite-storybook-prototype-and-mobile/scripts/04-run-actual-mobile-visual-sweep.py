#!/usr/bin/env python3
"""Run an actual mobile css-visual-diff sweep for public pages.

Unlike the coverage-card publisher, this script captures real browser screenshots
via `css-visual-diff compare` and emits the same summary JSON shape consumed by
our previous public-pages review bundle builder.

It intentionally starts with page/content and the selectors we know are present
in the rendered standalone prototype. Missing or flaky selectors are skipped with
an error row so the sweep remains inspectable.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[7]

TARGETS: list[dict[str, Any]] = [
    # Whole mobile pages / content regions.
    {"page": "shows", "section": "page", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "#root", "selector2": "[data-story-frame='pyxis-page-shell']"},
    {"page": "shows", "section": "content", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "[data-page='shows']", "selector2": "[data-page='shows']"},
    {"page": "shows", "section": "header", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "[data-section='shows-header']", "selector2": "[data-section='shows-header'] [data-pyxis-component='public-page-header']"},
    {"page": "shows", "section": "shows-list", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "[data-section='shows-list']", "selector2": "[data-section='shows-list']"},
    {"page": "shows", "section": "mailing-list", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "[data-section='mailing-list']", "selector2": "[data-section='mailing-list']"},
    {"page": "shows", "section": "mailing-title", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "[data-section='mailing-list'] h3", "selector2": "[data-section='mailing-list'] [data-pyxis-part='title']"},
    {"page": "shows", "section": "mailing-form", "proto": "/standalone/public/shows-mobile.html", "story": "public-site-pages-shows--mobile", "selector1": "[data-section='mailing-list'] form", "selector2": "[data-section='mailing-list'] [data-pyxis-part='form']"},

    {"page": "show-detail", "section": "page", "proto": "/standalone/public/detail-mobile.html", "story": "public-site-pages-show-detail--mobile", "selector1": "#root", "selector2": "[data-story-frame='pyxis-page-shell']"},
    {"page": "show-detail", "section": "content", "proto": "/standalone/public/detail-mobile.html", "story": "public-site-pages-show-detail--mobile", "selector1": "[data-page='show-detail']", "selector2": "[data-page='show-detail']"},
    {"page": "show-detail", "section": "ticket-card", "proto": "/standalone/public/detail-mobile.html", "story": "public-site-pages-show-detail--mobile", "selector1": "[data-pyxis-component='reserve-ticket-card']", "selector2": "[data-pyxis-component='reserve-ticket-card']"},

    {"page": "archive", "section": "page", "proto": "/standalone/public/archive-mobile.html", "story": "public-site-pages-archive--mobile", "selector1": "#root", "selector2": "[data-story-frame='pyxis-page-shell']"},
    {"page": "archive", "section": "content", "proto": "/standalone/public/archive-mobile.html", "story": "public-site-pages-archive--mobile", "selector1": "[data-page='archive']", "selector2": "[data-page='archive']"},
    {"page": "archive", "section": "header", "proto": "/standalone/public/archive-mobile.html", "story": "public-site-pages-archive--mobile", "selector1": "[data-page='archive'] header", "selector2": "[data-section='archive-header']"},
    {"page": "archive", "section": "filters", "proto": "/standalone/public/archive-mobile.html", "story": "public-site-pages-archive--mobile", "selector1": "[data-pyxis-component='archive-search-filters']", "selector2": "[data-pyxis-component='archive-search-filters']"},

    {"page": "book", "section": "page", "proto": "/standalone/public/book-mobile.html", "story": "public-site-pages-book--mobile", "selector1": "#root", "selector2": "[data-story-frame='pyxis-page-shell']"},
    {"page": "book", "section": "content", "proto": "/standalone/public/book-mobile.html", "story": "public-site-pages-book--mobile", "selector1": "[data-page='book']", "selector2": "[data-page='book']"},
    {"page": "book", "section": "header", "proto": "/standalone/public/book-mobile.html", "story": "public-site-pages-book--mobile", "selector1": "[data-page='book'] header", "selector2": "[data-section='book-header']"},
    {"page": "book", "section": "booking-form", "proto": "/standalone/public/book-mobile.html", "story": "public-site-pages-book--mobile", "selector1": "[data-pyxis-component='booking-form']", "selector2": "[data-pyxis-component='booking-form']"},
    {"page": "book", "section": "space-aside", "proto": "/standalone/public/book-mobile.html", "story": "public-site-pages-book--mobile", "selector1": "[data-pyxis-component='booking-space-aside']", "selector2": "[data-pyxis-component='booking-space-aside']"},

    {"page": "about", "section": "page", "proto": "/standalone/public/about-mobile.html", "story": "public-site-pages-about--mobile", "selector1": "#root", "selector2": "[data-story-frame='pyxis-page-shell']"},
    {"page": "about", "section": "content", "proto": "/standalone/public/about-mobile.html", "story": "public-site-pages-about--mobile", "selector1": "[data-page='about']", "selector2": "[data-page='about']"},
    {"page": "about", "section": "hero", "proto": "/standalone/public/about-mobile.html", "story": "public-site-pages-about--mobile", "selector1": "[data-section='about-hero']", "selector2": "[data-section='about-hero']"},
    {"page": "about", "section": "intro", "proto": "/standalone/public/about-mobile.html", "story": "public-site-pages-about--mobile", "selector1": "[data-pyxis-component='about-intro']", "selector2": "[data-pyxis-component='about-intro']"},
]


def classify(pct: float) -> str:
    if pct <= 0.5:
        return "accepted"
    if pct <= 10:
        return "review"
    if pct <= 30:
        return "tune-required"
    return "major-mismatch"


def artifact_path(data: dict[str, Any], key: str, fallback: Path) -> str:
    pixel = data.get("pixel_diff") or data.get("pixelDiff") or {}
    value = pixel.get(key) or pixel.get("diffOnlyPath" if key == "diff_only_path" else "diffComparisonPath")
    return str(value or fallback)


def run_target(target: dict[str, Any], out_root: Path, prototype_base: str, storybook_base: str, timeout: int) -> dict[str, Any]:
    artifact_dir = out_root / target["page"] / "artifacts" / target["section"]
    if artifact_dir.exists():
        shutil.rmtree(artifact_dir)
    artifact_dir.mkdir(parents=True, exist_ok=True)

    url1 = prototype_base.rstrip("/") + target["proto"]
    url2 = f"{storybook_base.rstrip('/')}/iframe.html?id={target['story']}&viewMode=story&globals=viewport:pyxisMobile"
    cmd = [
        "css-visual-diff", "compare",
        "--url1", url1,
        "--url2", url2,
        "--selector1", target["selector1"],
        "--selector2", target["selector2"],
        "--viewport-w", "390",
        "--viewport-h", "844",
        "--wait-ms1", "1200",
        "--wait-ms2", "1200",
        "--threshold", "30",
        "--out", str(artifact_dir),
        "--write-json=true",
        "--write-markdown=true",
        "--write-pngs=true",
    ]
    try:
        subprocess.run(cmd, check=True, timeout=timeout, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        compare = json.loads((artifact_dir / "compare.json").read_text())
        pixel = compare.get("pixel_diff") or compare.get("pixelDiff") or {}
        pct = float(pixel.get("changed_percent", pixel.get("changedPercent", 0)) or 0)
        changed_pixels = int(pixel.get("changed_pixels", pixel.get("changedPixels", 0)) or 0)
        total_pixels = int(pixel.get("total_pixels", pixel.get("totalPixels", 0)) or 0)
        normalized_width = pixel.get("normalized_width", pixel.get("normalizedWidth"))
        normalized_height = pixel.get("normalized_height", pixel.get("normalizedHeight"))
        bounds = {
            "changed": (compare.get("url1", {}).get("computed", {}).get("bounds") != compare.get("url2", {}).get("computed", {}).get("bounds")),
            "left": compare.get("url1", {}).get("computed", {}).get("bounds"),
            "right": compare.get("url2", {}).get("computed", {}).get("bounds"),
            "delta": None,
            "normalizedWidth": normalized_width,
            "normalizedHeight": normalized_height,
        }
        # The previous review bundle generator expects left_region/right_region
        # filenames beside diff_only.png. css-visual-diff compare writes
        # url1_screenshot/url2_screenshot, so copy them into the legacy names.
        legacy_left = artifact_dir / "left_region.png"
        legacy_right = artifact_dir / "right_region.png"
        if (artifact_dir / "url1_screenshot.png").exists():
            shutil.copy2(artifact_dir / "url1_screenshot.png", legacy_left)
        if (artifact_dir / "url2_screenshot.png").exists():
            shutil.copy2(artifact_dir / "url2_screenshot.png", legacy_right)

        row = {
            "page": target["page"],
            "variant": "mobile",
            "section": target["section"],
            "classification": classify(pct),
            "changedPercent": pct,
            "changedPixels": changed_pixels,
            "totalPixels": total_pixels,
            "threshold": 30,
            "leftSelector": target["selector1"],
            "rightSelector": target["selector2"],
            "bounds": bounds,
            "text": {"changed": None},
            "styleChangeCount": len(compare.get("computed_diffs") or []),
            "styleDiffs": [
                {"property": d.get("property"), "left": d.get("original"), "right": d.get("react")}
                for d in (compare.get("computed_diffs") or [])
            ],
            "attributeChangeCount": 0,
            "attributeDiffs": [],
            "artifactJson": str(artifact_dir / "compare.json"),
            "artifactMarkdown": str(artifact_dir / "compare.md"),
            "leftRegionPath": str(legacy_left),
            "rightRegionPath": str(legacy_right),
            "diffOnlyPath": artifact_path(compare, "diff_only_path", artifact_dir / "diff_only.png"),
            "diffComparisonPath": artifact_path(compare, "diff_comparison_path", artifact_dir / "diff_comparison.png"),
            "error": "",
        }
        return row
    except Exception as exc:
        message = str(exc)
        if hasattr(exc, "stderr") and getattr(exc, "stderr"):
            message = getattr(exc, "stderr")[-1200:]
        compare_json = artifact_dir / "compare.json"
        compare_md = artifact_dir / "compare.md"
        compare_json.write_text(json.dumps({"error": message, "target": target, "url1": url1, "url2": url2}, indent=2))
        compare_md.write_text(f"# Failed comparison: {target['page']} / {target['section']}\n\n```text\n{message}\n```\n")
        return {
            "page": target["page"],
            "variant": "mobile",
            "section": target["section"],
            "classification": "failed",
            "changedPercent": 100.0,
            "changedPixels": 0,
            "totalPixels": 0,
            "threshold": 30,
            "leftSelector": target["selector1"],
            "rightSelector": target["selector2"],
            "bounds": {"changed": None, "left": None, "right": None, "delta": None},
            "text": {"changed": None},
            "styleChangeCount": 0,
            "styleDiffs": [],
            "attributeChangeCount": 0,
            "attributeDiffs": [],
            "artifactJson": str(compare_json),
            "artifactMarkdown": str(compare_md),
            "leftRegionPath": "",
            "rightRegionPath": "",
            "diffOnlyPath": "",
            "diffComparisonPath": "",
            "error": message,
        }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out-dir", type=Path, default=Path("/tmp/pyxis-public-mobile-actual-sweep"))
    parser.add_argument("--json-out", type=Path, default=Path("/tmp/pyxis-public-mobile-actual-sweep.json"))
    parser.add_argument("--prototype-base", default="http://localhost:7070")
    parser.add_argument("--storybook-base", default="http://localhost:6007")
    parser.add_argument("--timeout", type=int, default=90)
    args = parser.parse_args()

    if args.out_dir.exists():
        shutil.rmtree(args.out_dir)
    args.out_dir.mkdir(parents=True, exist_ok=True)

    rows = []
    failures = []
    for index, target in enumerate(TARGETS, 1):
        print(f"[{index}/{len(TARGETS)}] {target['page']} / {target['section']}", flush=True)
        row = run_target(target, args.out_dir, args.prototype_base, args.storybook_base, args.timeout)
        if row.get("classification") == "failed":
            failures.append(row)
        else:
            rows.append(row)

    counts: dict[str, int] = {}
    for row in rows:
        counts[row["classification"]] = counts.get(row["classification"], 0) + 1

    rows.sort(key=lambda r: (-float(r.get("changedPercent", 0)), r.get("page", ""), r.get("section", "")))
    suite = {
        "classificationCounts": counts,
        "jsonPath": str(args.out_dir / "compare-all-output.json"),
        "markdownPath": str(args.out_dir / "01-suite-summary.md"),
        "maxChangedPercent": max((float(r.get("changedPercent", 0)) for r in rows), default=0),
        "pageCount": len(set(r["page"] for r in rows)),
        "sectionCount": len(rows),
        "policy": {"failureCount": counts.get("failed", 0), "ok": counts.get("failed", 0) == 0, "worstClassification": rows[0]["classification"] if rows else "accepted"},
        "rows": rows,
        "source": "actual-mobile-css-visual-diff-sweep",
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
    }
    (args.out_dir / "compare-all-output.json").write_text(json.dumps([suite], indent=2))
    (args.out_dir / "summary.json").write_text(json.dumps([suite], indent=2))
    (args.out_dir / "failures.json").write_text(json.dumps(failures, indent=2))
    (args.out_dir / "01-suite-summary.md").write_text("# Pyxis public mobile actual visual sweep\n\n" + "\n".join(f"- {k}: {v}" for k, v in counts.items()) + "\n")
    args.json_out.write_text(json.dumps([suite], indent=2))
    print(f"summary: {args.json_out}")
    print(f"outDir: {args.out_dir}")


if __name__ == "__main__":
    main()
