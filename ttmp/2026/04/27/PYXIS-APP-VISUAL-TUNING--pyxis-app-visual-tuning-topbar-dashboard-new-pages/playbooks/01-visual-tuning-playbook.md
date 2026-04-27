---
Title: Pyxis App Visual Tuning Playbook
Ticket: PYXIS-APP-VISUAL-TUNING
Status: active
Topics:
    - frontend
    - visual-tuning
    - storybook
    - pyxis
    - css-visual-diff
DocType: playbook
Intent: operational
Owners: []
RelatedFiles:
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.tsx
      Note: AppShell component source
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.css
      Note: AppShell CSS
    - Path: web/packages/pyxis-app/src/components/shell/AppShell.stories.tsx
      Note: AppShell Storybook stories
    - Path: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md
      Note: JS scripting experiment guide with compare region workflow
ExternalSources: []
Summary: Operational playbook for capturing pyxis-app component screenshots from Storybook and comparing them with css-visual-diff.
LastUpdated: 2026-04-27T00:00:00-04:00
WhatFor: Capture screenshots and run visual diffs for pyxis-app shell components.
WhenToUse: When tuning app shell visuals or adding new components that need visual validation.
---

# Visual Tuning Playbook

## Overview

This playbook describes how to capture Storybook component screenshots from pyxis-app and compare them using css-visual-diff. It adapts the existing public-site visual diff workflow for the app component system.

## Prerequisites

### 1. Storybook must be running

```bash
# pyxis-app uses port 6008
cd /home/manuel/code/wesen/2026-04-23--pyxis/web
pnpm --filter pyxis-app storybook
# Storybook starts on http://localhost:6008
```

Verify it is reachable:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:6008
# Expected: 200
```

### 2. css-visual-diff CLI

The `css-visual-diff` CLI is already installed. Verify:

```bash
css-visual-diff --version
```

## Workflow Phases

### Phase 1 — Discovery: Find story IDs

#### Method A: Navigate Storybook sidebar

```bash
# Open in browser
open http://localhost:6008
```

#### Method B: Check story files directly

```bash
grep -n "export const\|title:" web/packages/pyxis-app/src/components/shell/AppShell.stories.tsx
```

### Phase 2 — Capture: Screenshot a component

#### Canvas mode (recommended)

```
http://localhost:6008/iframe.html?id=pyxis-app-components-shell-appshell--top-bar-dashboard
```

Use Playwright for clean screenshots:

```bash
# Navigate to the iframe
await page.setViewportSize({ width: 1020, height: 200 });
await page.goto('http://localhost:6008/iframe.html?id=pyxis-app-components-shell-appshell--top-bar-dashboard');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'topbar-dashboard.png', type: 'png' });
```

### Phase 3 — Visual Diff: Compare with reference

#### Use css-visual-diff compare region

```bash
css-visual-diff verbs script compare region \
  --leftUrl "file:///tmp/pi-clipboard-f853f744-655f-4f8a-89fd-052799540564.png" \
  --rightUrl "http://localhost:6008/iframe.html?id=pyxis-app-components-shell-appshell--top-bar-dashboard" \
  --leftSelector "body" \
  --rightSelector "[data-section='app-topbar']" \
  --width 1020 \
  --height 200 \
  --leftWaitMs 500 \
  --rightWaitMs 1000 \
  --outDir "ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/various/topbar-compare" \
  --writeJson \
  --writeMarkdown \
  --writePngs
```

## Story IDs for AppShell

| Story | Story ID |
|---|---|
| Shell | `pyxis-app-components-shell-appshell--shell` |
| ShellWithCustomAction | `pyxis-app-components-shell-appshell--shell-with-custom-action` |
| TopBarDashboard | `pyxis-app-components-shell-appshell--top-bar-dashboard` |
| TopBarWithAction | `pyxis-app-components-shell-appshell--top-bar-with-action` |
| TopBarLongTitle | `pyxis-app-components-shell-appshell--top-bar-long-title` |
| MobileBottomNavigation | `pyxis-app-components-shell-appshell--mobile-bottom-navigation` |

## Key Selectors

| Target | Selector |
|---|---|
| AppShell root | `.app-shell` or `[data-part='app-shell']` |
| TopBar | `[data-section='app-topbar']` or `.app-topbar` |
| Sidebar | `[data-section='app-sidebar']` or `.app-sidebar` |
| Mobile nav | `[data-section='app-mobile-bottom-nav']` or `.app-bottom-nav` |

## Output Artifacts

Captured screenshots and diffs are stored in:

```text
ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/various/
```

Naming convention:

```text
<component>-<story-id>.png
```

## Debugging

### Issue: "Couldn't find story" error

**Fix:** Verify the story ID exists:

```bash
curl -s http://localhost:6008/index.json | jq '.stories[].id' | grep appshell
```

### Issue: Large empty space

**Fix:** Set tight viewport before navigating:

```bash
await page.setViewportSize({ width: 1020, height: 200 });
```

## Automation Script

Save to `scripts/capture-app-shell-screenshots.js`:

```javascript
const STORY_IDS = [
  'pyxis-app-components-shell-appshell--top-bar-dashboard',
  'pyxis-app-components-shell-appshell--top-bar-with-action',
  'pyxis-app-components-shell-appshell--top-bar-long-title',
];

const VIEWPORT = { width: 1020, height: 200 };
const OUT_DIR = './screenshots';

// ... capture loop
```
