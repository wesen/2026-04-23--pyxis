#!/usr/bin/env bash
set -euo pipefail

TICKET_DIR="/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html"
SHOWS_DIFF_DIR="/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-storybook-shows-desktop"
USER_SITE_STORYBOOK_DIR="/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/storybook-static"
OUT_DIR="$TICKET_DIR/various/storybook-ab-overview"
ASSETS_DIR="$OUT_DIR/assets"

mkdir -p "$ASSETS_DIR"

if [[ ! -f "$SHOWS_DIFF_DIR/test.html" ]]; then
  echo "Missing Shows desktop Storybook diff artifacts: $SHOWS_DIFF_DIR" >&2
  echo "Run scripts/14-run-pyxis-storybook-shows-desktop.sh first." >&2
  exit 1
fi

if [[ ! -f "$USER_SITE_STORYBOOK_DIR/index.json" ]]; then
  echo "Missing user-site Storybook static bundle: $USER_SITE_STORYBOOK_DIR" >&2
  echo "Build it with: cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-user-site build-storybook" >&2
  exit 1
fi

cp "$SHOWS_DIFF_DIR/original-full.png" "$ASSETS_DIR/shows-desktop-original-full.png"
cp "$SHOWS_DIFF_DIR/react-full.png" "$ASSETS_DIR/shows-desktop-react-full.png"
cp "$SHOWS_DIFF_DIR/pixeldiff_full_diff_comparison.png" "$ASSETS_DIR/shows-desktop-full-diff-comparison.png"
cp "$SHOWS_DIFF_DIR/original-main.png" "$ASSETS_DIR/shows-desktop-original-main.png"
cp "$SHOWS_DIFF_DIR/react-main.png" "$ASSETS_DIR/shows-desktop-react-main.png"
cp "$SHOWS_DIFF_DIR/pixeldiff_main_diff_comparison.png" "$ASSETS_DIR/shows-desktop-main-diff-comparison.png"
cp "$SHOWS_DIFF_DIR/original-nav.png" "$ASSETS_DIR/shows-desktop-original-nav.png"
cp "$SHOWS_DIFF_DIR/react-nav.png" "$ASSETS_DIR/shows-desktop-react-nav.png"
cp "$SHOWS_DIFF_DIR/pixeldiff_nav_diff_comparison.png" "$ASSETS_DIR/shows-desktop-nav-diff-comparison.png"

python3 - <<'PY'
import html, json, os
from pathlib import Path

ticket_dir = Path('/home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-SCREENSHOT-EXTRACTION--pyxis-screenshot-css-extraction-from-prototype-html')
out_dir = ticket_dir / 'various' / 'storybook-ab-overview'
shows_dir = Path('/home/manuel/workspaces/2026-04-21/hair-v2/css-visual-diff/examples/out/pyxis-storybook-shows-desktop')
storybook_index = Path('/home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/storybook-static/index.json')

pix = json.load(open(shows_dir / 'pixeldiff.json'))
story_data = json.load(open(storybook_index))

stories = []
for key, value in story_data['entries'].items():
    if value.get('title') == 'Public Site/Pages':
        stories.append((key, value.get('name', key)))

stories.sort(key=lambda item: item[1])

story_cards = []
for story_id, name in stories:
    ui_path = story_id.replace('--', '-')
    story_cards.append(f'''
      <article class="story-card">
        <h3>{html.escape(name)}</h3>
        <div class="links">
          <a href="http://localhost:6007/iframe.html?id={html.escape(story_id)}&viewMode=story" target="_blank">Open iframe</a>
          <a href="http://localhost:6007/?path=/story/{html.escape(ui_path)}" target="_blank">Open Storybook UI</a>
        </div>
        <code>{html.escape(story_id)}</code>
      </article>
    ''')

pixel_rows = []
for entry in pix.get('entries', []):
    pixel_rows.append(
        f"<tr><td>{html.escape(entry['section'])}</td><td>{(entry.get('changed_percent') or 0):.4f}%</td><td>{entry.get('changed_pixels', '')}</td></tr>"
    )

sections = [
    ('Full page', 'shows-desktop-original-full.png', 'shows-desktop-react-full.png', 'shows-desktop-full-diff-comparison.png'),
    ('Main content', 'shows-desktop-original-main.png', 'shows-desktop-react-main.png', 'shows-desktop-main-diff-comparison.png'),
    ('Navigation', 'shows-desktop-original-nav.png', 'shows-desktop-react-nav.png', 'shows-desktop-nav-diff-comparison.png'),
]

ab_sections = []
for title, original_name, react_name, diff_name in sections:
    ab_sections.append(f'''
      <section class="ab-section">
        <h2>{html.escape(title)}</h2>
        <div class="triptych">
          <figure>
            <figcaption>A — Prototype</figcaption>
            <a href="assets/{html.escape(original_name)}" target="_blank"><img src="assets/{html.escape(original_name)}" alt="{html.escape(title)} prototype" /></a>
          </figure>
          <figure>
            <figcaption>B — Storybook React</figcaption>
            <a href="assets/{html.escape(react_name)}" target="_blank"><img src="assets/{html.escape(react_name)}" alt="{html.escape(title)} Storybook" /></a>
          </figure>
          <figure>
            <figcaption>Diff comparison</figcaption>
            <a href="assets/{html.escape(diff_name)}" target="_blank"><img src="assets/{html.escape(diff_name)}" alt="{html.escape(title)} diff" /></a>
          </figure>
        </div>
      </section>
    ''')

html_doc = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pyxis Storybook A/B overview</title>
  <style>
    body {{ margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; background: #F3F1EB; color: #1A1A18; }}
    header {{ padding: 28px 32px; background: white; border-bottom: 1px solid #EAE6DD; position: sticky; top: 0; z-index: 2; }}
    h1 {{ margin: 0 0 8px; font-family: Fraunces, Georgia, serif; font-size: 32px; font-weight: 500; letter-spacing: -0.02em; }}
    h2 {{ margin: 0 0 14px; font-family: Fraunces, Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: -0.02em; }}
    .note {{ max-width: 980px; color: #555048; line-height: 1.6; }}
    main {{ padding: 28px 32px 48px; }}
    .story-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 20px 0 36px; }}
    .story-card {{ background: white; border: 1px solid #EAE6DD; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(26, 24, 22, 0.06); }}
    .story-card h3 {{ margin: 0 0 10px; font-size: 16px; font-weight: 600; }}
    .links {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }}
    a {{ color: #C8270D; text-decoration: none; }}
    a:hover {{ text-decoration: underline; }}
    code {{ display: inline-block; margin-top: 6px; background: #FAF8F2; padding: 4px 7px; border-radius: 6px; font-family: JetBrains Mono, monospace; font-size: 12px; color: #555048; }}
    table {{ border-collapse: collapse; width: 100%; max-width: 700px; background: white; border: 1px solid #EAE6DD; border-radius: 12px; overflow: hidden; margin: 14px 0 36px; }}
    th, td {{ padding: 10px 12px; border-bottom: 1px solid #EAE6DD; text-align: left; font-size: 13px; }}
    th {{ background: #FAF8F2; }}
    .ab-section {{ margin: 36px 0; }}
    .triptych {{ display: grid; grid-template-columns: repeat(3, minmax(260px, 1fr)); gap: 16px; align-items: start; }}
    figure {{ margin: 0; background: white; border: 1px solid #EAE6DD; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(26, 24, 22, 0.06); }}
    figcaption {{ padding: 10px 12px; font-size: 13px; font-weight: 600; border-bottom: 1px solid #EAE6DD; background: #FAF8F2; }}
    img {{ width: 100%; height: auto; display: block; }}
    @media (max-width: 1000px) {{ .triptych {{ grid-template-columns: 1fr; }} }}
  </style>
</head>
<body>
  <header>
    <h1>Pyxis Storybook A/B overview</h1>
    <div class="note">
      This page answers two questions: <strong>which user-site page stories were added?</strong> and <strong>what does the current A/B comparison look like?</strong>
      Right now, actual side-by-side prototype-vs-Storybook image artifacts exist for <strong>Shows Desktop</strong>. The other added stories are listed below with direct links.
      The full detailed diff report is still available at <a href="http://localhost:8793/test.html" target="_blank">http://localhost:8793/test.html</a>.
    </div>
  </header>
  <main>
    <h2>Added page stories</h2>
    <div class="story-grid">
      {''.join(story_cards)}
    </div>

    <h2>Shows Desktop diff summary</h2>
    <table>
      <thead>
        <tr><th>Section</th><th>Changed</th><th>Changed pixels</th></tr>
      </thead>
      <tbody>
        {''.join(pixel_rows)}
      </tbody>
    </table>

    {''.join(ab_sections)}
  </main>
</body>
</html>'''

(out_dir / 'test.html').write_text(html_doc)
(out_dir / 'index.html').write_text(html_doc)
print(f'Wrote {out_dir / "test.html"}')
PY

echo "A/B overview built at: $OUT_DIR/test.html"
