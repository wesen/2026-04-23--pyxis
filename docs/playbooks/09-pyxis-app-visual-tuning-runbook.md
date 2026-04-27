---
Title: Pyxis App Visual Tuning Runbook
Status: draft
Topics:
  - frontend
  - visual-tuning
  - storybook
  - css-visual-diff
  - pyxis-app
DocType: playbook
Intent: operational
Owners: []
RelatedFiles:
  - Path: web/packages/pyxis-app/src/components/shell/AppShell.tsx
    Note: AppShell component (TopBar, Sidebar, MobileBottomNav)
  - Path: web/packages/pyxis-app/src/components/shell/AppShell.css
    Note: AppShell CSS styles
  - Path: web/packages/pyxis-app/src/components/shell/AppTopBar.stories.tsx
    Note: TopBar stories
  - Path: web/packages/pyxis-app/src/components/shell/AppSidebar.stories.tsx
    Note: Sidebar stories
  - Path: web/packages/pyxis-app/src/components/shell/AppMobileBottomNav.stories.tsx
    Note: Mobile nav stories
  - Path: web/packages/pyxis-app/src/components/shell/index.ts
    Note: Shell component exports
  - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
    Note: Visual spec for app components (prototype vs Storybook)
  - Path: prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
    Note: Visual spec for app pages
  - Path: prototype-design/visual-diff/userland/docs/01-architecture-and-internals.md
    Note: Detailed userland architecture reference
  - Path: prototype-design/visual-diff/userland/docs/02-atom-to-page-visual-comparison-analysis.md
    Note: Textbook-style atom-to-page comparison analysis
ExternalSources: []
Summary: Operational runbook for tuning pyxis-app components and pages using css-visual-diff. Covers atom-to-page debugging, token analysis, visual diff workflow, and component reorganization.
LastUpdated: 2026-04-27T09:30:00-04:00
WhatFor: Use when tuning app shell visuals, adding new components, or validating Storybook component parity against the prototype.
WhenToUse: Read before starting visual tuning work on pyxis-app.
---

# Pyxis App Visual Tuning Runbook

This runbook documents the workflow for visual tuning pyxis-app components using `css-visual-diff`. It covers the complete loop from pixel diff → atom inspection → token analysis → CSS fix.

---

## 1. Architecture Overview

### The System

```
SPEC LAYER     (YAML: app.components.visual.yml, app.pages.desktop.visual.yml)
    ↓ targetsFromSpec()
REGISTRY LAYER (JS: in-memory target lookup, URL resolution)
    ↓ called by
LIBRARY LAYER  (JS: compare-region.js, inspect.js, snapshot.js, policies.js)
    ↓ called by
VERB LAYER     (pyxis-pages.js: 9 registered commands)
    ↓ invoked by
css-visual-diff CORE (Go binary + Playwright)
```

### Key Insight: Default Spec vs Explicit Spec

The registry defaults to `public-pages.desktop.visual.js`. **For app targets, always use `compare-spec`**:

```bash
# This throws "unknown page: dashboard"
css-visual-diff verbs ... pyxis pages compare-section dashboard topbar

# This works
css-visual-diff verbs ... pyxis pages compare-spec \
  app.components.visual.yml --page app-topbar-dashboard
```

### Ports

| Service | Port |
|---|---:|
| Prototype static server | 7070 |
| pyxis-app Storybook | 6008 |
| pyxis-user-site Storybook | 6007 |

---

## 2. The Atom-to-Page Debugging Model

When you see a visual diff, work top-down:

```
Page diff (8.56%)
    ↓
Which atom is causing it?
    ↓
Is the atom's CSS token correct?
    ↓
Fix the token or the atom
```

### The Five-Question Framework

1. **Is the selector correct on both sides?**
   Run `inspect-section --side both` and confirm `exists: true` and `visible: true`.

2. **Is the diff from atoms or layout?**
   Bounds match but pixels differ → atom difference. Bounds differ → layout difference.

3. **Which CSS property?**
   Check the `styles` array in `compare.json`. Look for `changed: true`.

4. **Token or inline style?**
   - Token: check `--app-*` in `app-tokens.css`
   - Inline: check the component TSX

5. **Is it an accepted difference?**
   Add to `acceptedDifferences` in the spec if known and intentional.

---

## 3. Example: TopBar Debugging

### 3.1 The Initial Diff

Running `compare-spec` on `app-topbar-dashboard`:

```
Pixel diff: 8.56% → classification: review
Text: matches exactly
Styles changed: color, font-size, line-height
```

### 3.2 Identifying the Atoms

The TopBar uses these atoms from `pyxis-components`:

| Atom | Usage | Variant |
|---|---|---|
| `Button` | Search, Notifications | outline, sm |
| `Button` | New show | primary, sm |
| `Icon` | Nav icons (sidebar) | — |
| `Avatar` | User footer | sm |
| `PyxisLogo` | Brand | stack |

### 3.3 The Token Mismatch

Three token systems exist in Pyxis:

| System | File | Primary ink value |
|---|---|---|
| Prototype | `prototype-design/lib/tokens.js` | `#1A1A18` |
| Shared components | `pyxis-components/src/tokens/tokens.css` | `#1A1A18` |
| App tokens | `pyxis-app/src/styles/app-tokens.css` | `#1f1e1c` |

The app tokens **drifted** from the prototype. This causes the 8.56% diff.

```css
/* prototype + shared components */
--color-text-primary: #1A1A18;  /* rgb(26, 26, 24) ✓ matches prototype */

/* app tokens — DIVERGENT */
--app-ink: #1f1e1c;            /* rgb(31, 30, 28) ✗ off by 5 units */
--app-muted: #6f685e;          /* rgb(111, 104, 94) ✗ off by 27 units */
--app-faint: #9b9488;         /* rgb(155, 148, 136) ✗ off by 15 units */
```

### 3.4 Fixing the Token Mismatch

Update `pyxis-app/src/styles/app-tokens.css` to match the prototype:

```css
:root {
  /* was: #1f1e1c — now matches prototype + shared components */
  --app-ink: #1A1A18;
  --app-ink-rgb: 26, 26, 24;

  /* was: #6f685e — matches PX.color.ink3 */
  --app-muted: #8A857B;

  /* was: #9b9488 — matches PX.color.ink4 */
  --app-faint: #B8B2A5;
}
```

Then re-run the comparison to confirm the diff drops.

---

## 4. Running Visual Comparisons

### 4.1 Start Servers

```bash
# Prototype
cd /home/manuel/code/wesen/2026-04-23--pyxis
python3 -m http.server 7070 --directory prototype-design &

# pyxis-app Storybook
cd web
pnpm --filter pyxis-app storybook &
```

### 4.2 Inspect Before Comparing

Always inspect selectors first:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  app.components.visual.yml \
  --page app-topbar-dashboard \
  --side both \
  --output json
```

### 4.3 Compare a Component

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --outDir /tmp/app-topbar-compare \
  --output json
```

### 4.4 Inspect Image Artifacts

After each `compare-spec` run, inspect the generated image artifacts with `read`. Prefer the single diff image first; the side-by-side triptych is very wide and should be used only when extra context is needed.

Recommended inspection order:

```text
<outDir>/<page>/artifacts/<section>/diff_only.png       # first: compact remaining mismatch map
<outDir>/<page>/artifacts/<section>/right_region.png    # second: React/Storybook result
<outDir>/<page>/artifacts/<section>/left_region.png     # third: prototype reference
<outDir>/<page>/artifacts/<section>/diff_comparison.png # optional: wide triptych context
```

For example:

```text
/tmp/app-topbar-compare/app-topbar-dashboard/artifacts/component/diff_only.png
/tmp/app-topbar-compare/app-topbar-dashboard/artifacts/component/right_region.png
/tmp/app-topbar-compare/app-topbar-dashboard/artifacts/component/left_region.png
```

Use `compare.json` for the numeric/style summary, but use `diff_only.png` as the first visual triage artifact.

### 4.5 Keep Diagnostic Scripts Traceable

If you write any helper script while diagnosing a visual mismatch, store it in the active ticket workspace before or when you run it. Do not leave one-off scripts only in `/tmp`, shell history, or an assistant transcript.

Use this location pattern:

```text
ttmp/YYYY/MM/DD/<TICKET--slug>/scripts/NN-purpose.py
ttmp/YYYY/MM/DD/<TICKET--slug>/scripts/NN-purpose.sh
```

Rules:

- Give scripts numbered names so the workflow can be reconstructed later.
- Add a short docstring/header explaining what the script measures and what it does not prove.
- Prefer dry-run/report-only behavior for scripts that modify files.
- For diagnostic scripts, record the exact invocation and key output in the diary.
- Keep css-visual-diff as the source of truth; helper scripts may summarize existing artifacts but should not replace visual-diff comparison.

Example from TopBar tuning:

```bash
ttmp/2026/04/27/PYXIS-APP-VISUAL-TUNING--pyxis-app-visual-tuning-topbar-dashboard-new-pages/scripts/04-measure-red-button-bounds.py \
  /tmp/pyxis-topbar-after-primary-md/app-topbar-dashboard/artifacts/component/left_region.png \
  /tmp/pyxis-topbar-after-primary-md/app-topbar-dashboard/artifacts/component/right_region.png \
  --min-area 80
```

### 4.6 Compare All App Components

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --outDir /tmp/app-components-compare \
  --output json
```

### 4.7 Snapshot-Based Tuning

Capture a baseline, make CSS changes, capture again, then diff:

```bash
# Baseline
css-visual-diff verbs ... pyxis pages snapshot-section \
  app-topbar-dashboard component \
  --outDir /tmp/before-tuning

# Edit CSS...

# After
css-visual-diff verbs ... pyxis pages snapshot-section \
  app-topbar-dashboard component \
  --outDir /tmp/after-tuning

# Diff
css-visual-diff verbs ... pyxis pages diff-snapshots \
  /tmp/before-tuning/snapshot.json \
  /tmp/after-tuning/snapshot.json \
  --outDir /tmp/snapshot-diff
```

---

## 5. Spec Structure

### 5.1 App Components Spec

```yaml
schemaVersion: pyxis.visual-suite.v1
name: app-components
defaults:
  prototypeBase: http://localhost:7070
  storybookBase: http://localhost:6008   # ← app uses 6008
  viewport:
    width: 520
    height: 420
  waitMs: 1000
  threshold: 30
  inspect: rich
  variant: component
targets:
  - page: app-topbar-dashboard
    priority: tune-first
    prototypePath: /standalone/full-app/dashboard.html
    storyId: pyxis-app-components-shell-apptopbar--dashboard
    viewport:
      width: 1020
      height: 120
    sections:
      - name: component
        original: 'main > div:first-child'
        react: '[data-section="app-topbar"]'
```

### 5.2 Adding a New Target

1. Edit `app.components.visual.yml`
2. Run `refresh-spec-mirrors.py`
3. Compare with `compare-spec`

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

---

## 6. Component Reorganization

### 6.1 Shell Components

The Shell is split into one story file per component:

```
web/packages/pyxis-app/src/components/shell/
├── AppShell.tsx              # Main AppShell + all functions
├── AppShell.css              # Shared shell styles
├── AppShell.stories.tsx      # AppShell stories only
├── AppTopBar.stories.tsx     # AppTopBar stories
├── AppSidebar.stories.tsx    # AppSidebar stories
├── AppMobileBottomNav.stories.tsx
└── index.ts                   # Re-exports all shell components
```

Each story file follows the pattern:
- `title` in meta matches the component path: `Pyxis App/Components/Shell/AppTopBar`
- `component` export matches the function name: `AppTopBar`
- Individual stories per state/variant

### 6.2 Story ID Naming

Story IDs follow the pattern:

```
pyxis-app-components-shell-<component-lowercase>--<story-kebab>
```

| Story | Story ID |
|---|---|
| AppTopBar Default | `pyxis-app-components-shell-apptopbar--dashboard` |
| AppSidebar Default | `pyxis-app-components-shell-appsidebar--default` |
| AppMobileBottomNav Default | `pyxis-app-components-shell-appmobilebottomnav--default` |

### 6.3 Verifying Story IDs

```bash
curl -s http://localhost:6008/index.json | \
  grep -o '"id":"pyxis-app-components-shell[^"]*"' | sort
```

---

## 7. Policy Bands

| Band | Max % | Meaning |
|---|---|---|
| `accepted` | ≤1% | Near-exact match |
| `review` | ≤10% | Needs review |
| `tune-required` | ≤25% | Tuning required |
| `major-mismatch` | >25% | Composition error |

### CI Gate

```bash
css-visual-diff verbs ... compare-spec \
  --mode ci \
  --maxChangedPercent 10
```

---

## 8. Token Reference

### Token Files and Their Roles

| File | Role | Source of truth? |
|---|---|---|
| `prototype-design/lib/tokens.js` | Prototype design decisions | Yes |
| `pyxis-components/src/tokens/tokens.css` | Shared component tokens | Matches prototype |
| `pyxis-app/src/styles/app-tokens.css` | App-specific tokens | **Drifted** — needs fixing |

### App Token Drift Pattern

The `--app-*` tokens in `app-tokens.css` sometimes differ from their `PX.*` prototype equivalents:

| Prototype | Prototype value | App token | App value | Status |
|---|---|---|---|---|
| `PX.color.ink` | `#1A1A18` | `--app-ink` | `#1f1e1c` | **Drifted** |
| `PX.color.ink3` | `#8A857B` | `--app-muted` | `#6f685e` | **Drifted** |
| `PX.color.ink4` | `#B8B2A5` | `--app-faint` | `#9b9488` | **Drifted** |

When fixing token mismatches, prefer updating the app tokens to match the prototype. The shared component tokens already match the prototype.

---

## 9. Quick Reference

```bash
# Start servers
python3 -m http.server 7070 --directory prototype-design &
cd web && pnpm --filter pyxis-app storybook &

# List app component targets
css-visual-diff verbs --repo prototype-design/visual-diff/userland \
  pyxis pages list-targets --output json

# Inspect a component
css-visual-diff verbs --repo prototype-design/visual-diff/userland \
  pyxis pages compare-spec app.components.visual.yml \
  --page app-topbar-dashboard --outDir /tmp/compare

# Refresh mirrors after editing YAML
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

---

## 10. Troubleshooting

### "unknown page" error

You used a registry verb without `--spec`. Use `compare-spec`:
```bash
pyxis pages compare-spec app.components.visual.yml --page your-component
```

### Selector not found on prototype

Check `prototype-design/lib/components.jsx` and `prototype-design/screens/auth-dash.jsx` for `data-*` attributes and class names.

### Pixel diff is high but text matches

Token mismatch. Check `app-tokens.css` against `prototype-design/lib/tokens.js`.

### Story ID changed after refactoring

Update the `storyId` in the spec YAML. Regenerate mirrors.
