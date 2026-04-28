#!/usr/bin/env python3
"""Publish a public-site visual coverage rundown for operator inspection.

This is not a screenshot comparison runner. It produces a reviewable HTML and JSON
coverage map that answers: which public pages/elements need visual coverage, which
selectors should be compared, which render pairs matter, and what current status
we know from the active ticket diary.

Usage:
  python3 scripts/02-build-public-visual-coverage-rundown.py \
    --output-dir /tmp/pyxis-public-visual-coverage-rundown \
    --json-out /tmp/pyxis-public-visual-coverage-rundown.json
"""

from __future__ import annotations

import argparse
import html
import json
from datetime import datetime
from pathlib import Path
from typing import Any

PAIR_DESCRIPTIONS = {
    "prototype-storybook": "Standalone original vs Storybook fixture; use first for mobile baseline tuning.",
    "vite-storybook": "Live Vite route vs Storybook fixture; use after fixture/data is aligned or for data-insensitive subparts.",
    "prototype-vite": "Standalone original vs live Vite route; use for final production-like smoke after source of truth is clear.",
}

PAGES: list[dict[str, Any]] = [
    {
        "page": "shows",
        "routes": {"prototypeDesktop": "/standalone/public/shows.html", "prototypeMobile": "/standalone/public/shows-mobile.html", "vite": "/", "storybookDesktop": "public-site-pages-shows--desktop", "storybookMobile": "public-site-pages-shows--mobile"},
        "notes": "Poster artwork is expected to differ in some runs; prefer tile/info/form subparts over broad page pixels.",
        "elements": [
            {"name": "nav-closed", "selector": "[data-pyxis-component='pub-nav']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "covered-partial", "notes": "Closed mobile state matches prototype direction; open menu has no original design."},
            {"name": "nav-open-mobile", "selector": ".pyxis-pub-nav__mobile-menu", "priority": "high", "viewports": ["mobile"], "pairs": ["vite-storybook"], "status": "needs-design-review", "notes": "Functional conservative dropdown implemented; no standalone opened-menu prototype exists."},
            {"name": "shows-header", "selector": "[data-section='shows-header']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-focused-review"},
            {"name": "shows-list", "selector": "[data-section='shows-list']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "covered-broad-noisy", "notes": "Mobile Storybook fixed from 3-column to 1-column; broad diff still poster/text noisy."},
            {"name": "show-tile-poster", "selector": "[data-pyxis-component='show-tile'] [data-pyxis-component='poster'], .pyxis-show-tile__flyer", "priority": "medium", "viewports": ["mobile", "desktop"], "pairs": ["prototype-storybook"], "status": "needs-deep-coverage", "notes": "Compare per poster kind only when useful; avoid overfitting all posters."},
            {"name": "show-tile-info", "selector": "[data-pyxis-component='show-tile'] [data-pyxis-part='info']", "priority": "high", "viewports": ["mobile", "desktop"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-deep-coverage"},
            {"name": "mailing-title", "selector": "[data-section='mailing-list'] [data-pyxis-part='title']", "priority": "done", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "covered", "lastObserved": "0% for mobile prototype-storybook and Vite-storybook; desktop Vite-storybook 0%."},
            {"name": "mailing-form", "selector": "[data-section='mailing-list'] [data-pyxis-part='form']", "priority": "done", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "covered", "lastObserved": "0% for key input/button/form checks after token import."},
        ],
    },
    {
        "page": "show-detail",
        "routes": {"prototypeDesktop": "/standalone/public/detail.html", "prototypeMobile": "/standalone/public/detail-mobile.html", "vite": "/shows/1", "storybookDesktop": "public-site-pages-show-detail--desktop", "storybookMobile": "public-site-pages-show-detail--mobile"},
        "notes": "Use component internals: whole detail content includes poster and long layout shifts.",
        "elements": [
            {"name": "back-link", "selector": ".pyxis-show-detail-page__back", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "poster-or-flyer", "selector": "[data-section='show-detail-aside'] [data-pyxis-component='poster'], .pyxis-show-detail-page__flyer-button", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage", "notes": "May differ if backend provides uploaded flyer instead of stylized poster."},
            {"name": "reserve-ticket-card", "selector": "[data-pyxis-component='reserve-ticket-card']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
            {"name": "detail-hero", "selector": "[data-section='show-detail-hero']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "meta-strip", "selector": "[data-pyxis-component='show-meta-strip']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
            {"name": "lineup", "selector": "[data-pyxis-component='show-lineup']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "safety-note", "selector": "[data-pyxis-component='safety-note']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
        ],
    },
    {
        "page": "archive",
        "routes": {"prototypeDesktop": "/standalone/public/archive.html", "prototypeMobile": "/standalone/public/archive-mobile.html", "vite": "/archive", "storybookDesktop": "public-site-pages-archive--desktop", "storybookMobile": "public-site-pages-archive--mobile"},
        "notes": "Broad mobile content scan currently around 10.30%; split into controls and rows.",
        "elements": [
            {"name": "archive-header", "selector": "[data-section='archive-header']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "archive-stats", "selector": "[data-section='archive-stats']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
            {"name": "archive-filters", "selector": "[data-section='archive-filters']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
            {"name": "archive-year-group", "selector": "[data-section='archive-years'] [data-pyxis-component='year-group']:first-of-type", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "archive-show-row", "selector": "[data-pyxis-component='archive-show-row']:first-of-type", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
        ],
    },
    {
        "page": "book",
        "routes": {"prototypeDesktop": "/standalone/public/book.html", "prototypeMobile": "/standalone/public/book-mobile.html", "vite": "/book", "storybookDesktop": "public-site-pages-book--desktop", "storybookMobile": "public-site-pages-book--mobile"},
        "notes": "Broad mobile content scan currently around 19.33%; form fields and aside card need separate checks.",
        "elements": [
            {"name": "book-header", "selector": "[data-section='book-header']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "booking-form", "selector": "[data-pyxis-component='booking-form']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
            {"name": "booking-form-fields", "selector": "[data-pyxis-component='booking-form'] input, [data-pyxis-component='booking-form'] textarea", "priority": "high", "viewports": ["mobile"], "pairs": ["prototype-storybook"], "status": "needs-deep-coverage", "notes": "May need individual selectors per field for typography/padding diffs."},
            {"name": "show-type-chips", "selector": "[data-pyxis-component='booking-form'] [data-pyxis-component='show-type-chips']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "checkbox-submit", "selector": "[data-pyxis-component='booking-form'] button[type='submit'], [data-pyxis-component='booking-form'] input[type='checkbox']", "priority": "medium", "viewports": ["mobile"], "pairs": ["prototype-storybook"], "status": "needs-deep-coverage"},
            {"name": "booking-space-aside", "selector": "[data-section='book-aside'] [data-pyxis-component='booking-space-aside']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
        ],
    },
    {
        "page": "book-success",
        "routes": {"prototypeDesktop": "n/a", "prototypeMobile": "n/a", "vite": "/book/success", "storybookDesktop": "public-site-pages-book-success--desktop", "storybookMobile": "not-yet-defined"},
        "notes": "No standalone original page was part of the current prototype sweep; still needs app/story coverage for regression.",
        "elements": [
            {"name": "booking-success", "selector": "[data-pyxis-component='booking-success']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["vite-storybook"], "status": "needs-story-coverage"},
        ],
    },
    {
        "page": "about",
        "routes": {"prototypeDesktop": "/standalone/public/about.html", "prototypeMobile": "/standalone/public/about-mobile.html", "vite": "/about", "storybookDesktop": "public-site-pages-about--desktop", "storybookMobile": "public-site-pages-about--mobile"},
        "notes": "Broad mobile content scan currently around 16.41%; split into hero, intro, ethos, and split panel.",
        "elements": [
            {"name": "about-hero", "selector": "[data-section='about-hero']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "about-intro", "selector": "[data-section='about-intro']", "priority": "high", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
            {"name": "about-ethos", "selector": "[data-section='about-ethos']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "collective-list", "selector": "[data-pyxis-component='collective-list']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
            {"name": "find-us-block", "selector": "[data-pyxis-component='find-us-block']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook"], "status": "needs-coverage"},
        ],
    },
    {
        "page": "global-footer",
        "routes": {"prototypeDesktop": "all standalone pages", "prototypeMobile": "all standalone mobile pages", "vite": "all routes", "storybookDesktop": "all page stories", "storybookMobile": "all page stories"},
        "notes": "Footer appears on all public pages; one desktop and one mobile representative check is enough unless page-specific context changes it.",
        "elements": [
            {"name": "pub-footer", "selector": "[data-pyxis-component='pub-footer']", "priority": "medium", "viewports": ["desktop", "mobile"], "pairs": ["prototype-storybook", "vite-storybook"], "status": "needs-coverage"},
        ],
    },
]


def counts(pages: list[dict[str, Any]]) -> dict[str, int]:
    result: dict[str, int] = {}
    for page in pages:
        for element in page["elements"]:
            result[element["status"]] = result.get(element["status"], 0) + 1
    return result


def row_class(status: str) -> str:
    return status.replace("-", "_")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", type=Path, default=Path("/tmp/pyxis-public-visual-coverage-rundown"))
    ap.add_argument("--json-out", type=Path, default=Path("/tmp/pyxis-public-visual-coverage-rundown.json"))
    args = ap.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    payload = {
        "title": "Pyxis public-site visual coverage rundown",
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "ticket": "PYXIS-PUBLIC-VISUAL-MOBILE-TUNING",
        "currentServers": {
            "prototype": "http://localhost:7070",
            "publicVite": "http://localhost:3007",
            "publicStorybook": "http://localhost:6007",
        },
        "pairDescriptions": PAIR_DESCRIPTIONS,
        "statusCounts": counts(PAGES),
        "pages": PAGES,
    }
    args.json_out.write_text(json.dumps(payload, indent=2))

    page_cards: list[str] = []
    for page in PAGES:
        element_rows = []
        for element in page["elements"]:
            pairs = ", ".join(element.get("pairs", []))
            viewports = ", ".join(element.get("viewports", []))
            notes = html.escape(element.get("notes", ""))
            last = html.escape(element.get("lastObserved", ""))
            status = element["status"]
            element_rows.append(f"""
<tr class='{row_class(status)}'>
  <td><strong>{html.escape(element['name'])}</strong><br><code>{html.escape(element['selector'])}</code></td>
  <td>{html.escape(element['priority'])}</td>
  <td>{html.escape(status)}</td>
  <td>{html.escape(viewports)}</td>
  <td>{html.escape(pairs)}</td>
  <td>{notes}{('<br><em>' + last + '</em>') if last else ''}</td>
</tr>""")
        routes = page.get("routes", {})
        routes_html = "".join(f"<li><strong>{html.escape(k)}:</strong> <code>{html.escape(str(v))}</code></li>" for k, v in routes.items())
        page_cards.append(f"""
<section class='page-card' id='page-{html.escape(page['page'])}'>
  <h2>{html.escape(page['page'])}</h2>
  <p>{html.escape(page.get('notes', ''))}</p>
  <details><summary>Routes / story IDs</summary><ul>{routes_html}</ul></details>
  <table>
    <thead><tr><th>Element / selector</th><th>Priority</th><th>Status</th><th>Viewports</th><th>Pairs</th><th>Notes</th></tr></thead>
    <tbody>{''.join(element_rows)}</tbody>
  </table>
</section>""")

    status_counts = "".join(f"<span class='pill'>{html.escape(k)}: {v}</span>" for k, v in payload["statusCounts"].items())
    pair_lines = "".join(f"<li><strong>{html.escape(k)}:</strong> {html.escape(v)}</li>" for k, v in PAIR_DESCRIPTIONS.items())
    generated = html.escape(payload["generatedAt"])
    json_rel = html.escape(args.json_out.as_posix())
    html_doc = f"""<!doctype html>
<html lang='en'>
<head>
<meta charset='utf-8'>
<title>Pyxis public visual coverage rundown</title>
<style>
body {{ margin: 0; padding: 28px; font: 14px/1.5 Inter, system-ui, sans-serif; background: #f7f4ee; color: #1a1a18; }}
h1 {{ font: 700 36px/1.05 Georgia, serif; margin: 0 0 8px; }}
h2 {{ font: 700 26px/1.1 Georgia, serif; margin: 0 0 8px; color: #c8270d; }}
code {{ background: #f1ece3; border-radius: 4px; padding: 1px 4px; font-size: 12px; }}
.summary {{ color: #6f675d; margin-bottom: 18px; }}
.toolbar {{ position: sticky; top: 0; z-index: 2; background: #f7f4ee; border-bottom: 1px solid #ddd6ca; padding: 12px 0; margin-bottom: 18px; display: flex; flex-wrap: wrap; gap: 8px; }}
.toolbar a, .pill {{ border: 1px solid #ddd6ca; border-radius: 999px; color: #1a1a18; background: #fff; padding: 6px 10px; text-decoration: none; font-weight: 700; font-size: 12px; }}
.page-card {{ background: #fff; border: 1px solid #ddd6ca; border-radius: 14px; padding: 18px; margin: 0 0 20px; box-shadow: 0 8px 28px rgba(26,26,24,.05); }}
table {{ border-collapse: collapse; width: 100%; margin-top: 12px; }}
th, td {{ border-top: 1px solid #eee7dc; padding: 10px; text-align: left; vertical-align: top; }}
th {{ color: #6f675d; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }}
tr.needs_coverage td, tr.needs_deep_coverage td, tr.needs_story_coverage td {{ background: #fffaf2; }}
tr.needs_design_review td {{ background: #fff2ef; }}
tr.covered td, tr.covered_partial td, tr.covered_broad_noisy td {{ background: #f4faf3; }}
details {{ margin: 8px 0; }}
</style>
</head>
<body>
<h1>Pyxis public-site visual coverage rundown</h1>
<div class='summary'>Generated {generated}. JSON: <code>{json_rel}</code></div>
<div class='toolbar'>{status_counts}</div>
<section class='page-card'>
  <h2>How to read this</h2>
  <p>This is the coverage map for the next css-visual-diff passes. Use it to choose deeper selectors rather than broad page screenshots when posters, live data, or shell spacing swamp the real issue.</p>
  <ul>{pair_lines}</ul>
</section>
{''.join(page_cards)}
</body>
</html>
"""
    (args.output_dir / "index.html").write_text(html_doc)
    print(f"html: {args.output_dir / 'index.html'}")
    print(f"json: {args.json_out}")


if __name__ == "__main__":
    main()
