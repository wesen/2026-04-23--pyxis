#!/usr/bin/env python3
"""Fetch pyxis-app Storybook index and summarize available app stories.

Purpose: evidence for the functional OSHA audit; this is read-only.
"""
import json, sys, urllib.request
from pathlib import Path
url = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:6008/index.json'
out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path('/tmp/pyxis-app-storybook-index-summary.json')
idx = json.load(urllib.request.urlopen(url))
entries = []
for story_id, e in sorted(idx.get('entries', {}).items()):
    if story_id.startswith('pyxis-app-'):
        entries.append({'id': story_id, 'title': e.get('title'), 'name': e.get('name'), 'type': e.get('type')})
by_title = {}
for e in entries:
    by_title.setdefault(e['title'], []).append(e['name'])
summary = {'url': url, 'entryCount': len(entries), 'titles': [{'title': k, 'stories': v} for k, v in sorted(by_title.items())], 'entries': entries}
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(summary, indent=2))
print(out)
print('entryCount', len(entries))
for row in summary['titles']:
    print(row['title'], '=>', ', '.join(row['stories']))
