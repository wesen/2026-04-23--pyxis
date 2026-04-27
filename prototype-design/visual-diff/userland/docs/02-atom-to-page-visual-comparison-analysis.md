# Pyxis App Visual Tuning: Atom-to-Page Visual Comparison

## Purpose

This document is a working reference and analysis for the Pyxis App (`pyxis-app`) visual tuning workflow. It explains the atom-to-page visual comparison system, how the css-visual-diff userland works, and how to extend it for new components. The intended reader is a frontend developer who needs to:

1. Understand why visual diffs differ
2. Identify which atoms/molecules are used in a component
3. Trace a visual gap to its root cause (token, atom, or layout)
4. Add new comparison targets to the system

The tone is that of a practical engineering textbook: clear, example-driven, with concrete commands and annotated code.

---

## 1. The Atom-to-Page Comparison Model

### 1.1 The Hierarchy

Visual design in Pyxis follows a strict atomic hierarchy:

```
Atoms       → smallest: Button, Badge, Input, Icon, Avatar, Tag, Textarea, Select
Molecules   → composed: MetricCard, ActivityFeedItem, TodayShowCard, SettingsToggleRow
Organisms   → composed: DashboardHero, ShowsConfirmedPanel, BookingsInboxPanel
Shell      → composed: AppShell (TopBar + Sidebar + MobileBottomNav)
Pages      → composed: DashboardPage, ShowsPage, CalendarPage, BookingsPage
```

Every visual gap you see in a page-level comparison is either:

- **A token mismatch**: a CSS variable that resolves differently
- **An atom difference**: an atom component that renders differently than its prototype counterpart
- **A composition error**: wrong atom composition, spacing, or layering in a molecule or organism
- **A layout error**: the containing shell or page structure is wrong

The debugging order is always the same:

```
Page diff → organism diff → molecule diff → atom diff → token investigation
```

### 1.2 Why This Matters for Visual Tuning

A page-level pixel diff of 8.56% sounds large, but it might be one atom causing all the noise. Conversely, a 1% diff might be a critical token mismatch that will cause problems everywhere.

The css-visual-diff userland provides three tools for this investigation:

| Tool | What it captures | Best for |
|---|---|---|
| `compare.region` | Pixel diff + computed CSS | Confirming how much pixels differ |
| `inspect.section` | Element bounds, styles, text, attributes | Finding which CSS property differs |
| `snapshot.section` | Portable JSON facts | Tracking changes over time without full pixel diffs |

Together they form a feedback loop:

```
Inspect → find property → check atom → check token → fix → snapshot before
       → make change
       → snapshot after → diff snapshots
       → if pixel diff needed → compare.region
```

---

## 2. Anatomy of a Component: The TopBar Case Study

### 2.1 Identifying the Component's Atoms

The `AppTopBar` component renders the dashboard header. Its source reveals the atoms it uses:

```tsx
// web/packages/pyxis-app/src/components/shell/AppShell.tsx (line 3)
import { Avatar, Button, Icon, PyxisLogo, type IconName } from 'pyxis-components';

// line 40 — the TopBar rendering
export function AppTopBar({ title, eyebrow, subtitle, action }: AppTopBarProps) {
  return (
    <header className="app-topbar" data-section="app-topbar" {...appPart('app-topbar')}>
      <div>
        <span>{eyebrow ?? 'Home'}</span>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action ?? (
        <div className="app-topbar-actions">
          <Button variant="outline" size="sm" iconLeft="search" aria-label="Search"/>
          <Button variant="outline" size="sm" iconLeft="bell" aria-label="Notifications"/>
          <Button size="sm" iconLeft="plus">New show</Button>
        </div>
      )}
    </header>
  );
}
```

The atoms used here are:

| Atom | Variant/Props | Role in TopBar |
|---|---|---|
| `Button` | `variant="outline"`, `size="sm"`, `iconLeft="search"` | Search action |
| `Button` | `variant="outline"`, `size="sm"`, `iconLeft="bell"` | Notifications action |
| `Button` | `size="sm"`, `iconLeft="plus"` | Primary "New show" action |

Note: `Icon` is used in the sidebar, not the topbar. `Avatar` and `PyxisLogo` belong to the sidebar.

### 2.2 The Prototype Atoms

The prototype renders the same components via `prototype-design/lib/components.jsx` and `prototype-design/screens/auth-dash.jsx`. The topbar prototype uses the same atom types but with prototype-specific class names and data attributes.

The atom mapping for TopBar:

```
AppTopBar (React)         →  PPXDesktop AppShell topbar region (Prototype)
  ├─ Button outline-sm     →  px-btn with appropriate sizing
  ├─ Button outline-sm     →  px-btn with appropriate sizing
  └─ Button sm (primary)   →  px-btn with accent color
```

### 2.3 The Token Mapping

The visual diff showed these CSS property differences:

| Property | Prototype | React (Storybook) | Likely cause |
|---|---|---|---|
| `color` | `rgb(26, 26, 24)` | `rgb(31, 30, 28)` | Token mismatch |
| `font-size` | `13px` | `14px` | Token or base font-size difference |
| `line-height` | `19.5px` | `20.3px` | Computed from font-size change |

Tracing `color`:

- Prototype: `PX.color.ink = "#1A1A18"` → `rgb(26, 26, 24)`
- App tokens: `--app-ink = "#1f1e1c"` → `rgb(31, 30, 28)`

**Root cause identified:** The app tokens use `#1f1e1c` but the prototype uses `#1A1A18`. These are visually similar warm blacks but not identical. The question is: which one is the intended design?

```
Token source file           →  Value
prototype-design/lib/tokens.js  →  #1A1A18
web/packages/pyxis-app/src/styles/app-tokens.css  →  #1f1e1c
```

This is a **token normalization task**: decide which value is canonical, update the app tokens to match, regenerate the JS mirror if needed, then re-run the comparison.

### 2.4 The Full Atom Diff Checklist for TopBar

To do a thorough atom-level analysis, test each atom used in TopBar:

```bash
# Compare Button atoms from prototype vs Storybook
css-visual-diff verbs script compare region \
  --leftUrl "http://localhost:7070/standalone/full-app/dashboard.html" \
  --rightUrl "http://localhost:6008/iframe.html?id=pyxis-app-components-atoms-button--default" \
  --leftSelector ".px-btn" \
  --rightSelector "[data-pyxis-component='button']" \
  --width 520 \
  --height 100 \
  --outDir /tmp/atom-button-compare \
  --writeJson --writePngs
```

This is the **bottom-up verification pattern**: confirm atoms match before trusting page-level comparisons.

---

## 3. The css-visual-diff Userland System

### 3.1 Layer Architecture

The userland is organized as four layers. Understanding the layers makes extension straightforward:

```
Layer 1 — SPEC (YAML)           Source of truth, reviewed, committed
    ↓ targetsFromSpec()
Layer 2 — REGISTRY (JS)          Runtime lookup, URL resolution, filtering
    ↓ called by
Layer 3 — LIBRARY (JS modules)   Pure functions: compare, inspect, snapshot, policy
    ↓ called by
Layer 4 — VERB LAYER (pyxis-pages.js)   CLI entrypoints
    ↓ invoked by
Layer 5 — css-visual-diff CORE   Go binary wrapping Playwright
```

### 3.2 The Registry's Default Spec Problem

The registry in `lib/registry.js` hardcodes its default spec:

```javascript
// lib/registry.js — line 2
var defaultSpec = require('../specs/public-pages.desktop.visual.js')
```

This means **all** registry-backed verbs — `listTargets`, `compareSection`, `comparePage`, `compareAll` — operate on public pages by default. They will throw `"unknown page: dashboard"` because `dashboard` is an app page, not a public page.

**Solution:** For app targets, always use `compare-spec` with an explicit YAML spec:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard
```

This pattern bypasses the default spec and loads the app spec directly.

### 3.3 The Spec File Schema

A visual suite spec is a YAML file with this structure:

```yaml
schemaVersion: pyxis.visual-suite.v1
name: app-pages-desktop
defaults:
  prototypeBase: http://localhost:7070
  storybookBase: http://localhost:6008    # ← app uses 6008
  viewport:
    width: 1240
    height: 900
  waitMs: 1000
  threshold: 30
  inspect: rich
  variant: desktop
policy:
  bands:
    - name: accepted
      maxChangedPercent: 0.5
    - name: review
      maxChangedPercent: 10
    - name: tune-required
      maxChangedPercent: 30
    - name: major-mismatch
      maxChangedPercent: 100
targets:
  - page: dashboard
    variant: desktop
    priority: tune-first
    prototypePath: /standalone/full-app/dashboard.html
    storyId: pyxis-app-pages-pages--dashboard-desktop
    sections:
      - name: topbar
        original: 'main > div:first-child'
        react: '[data-section="app-topbar"]'
```

Each `section` entry maps a prototype selector to a Storybook selector. The selectors must be stable `data-*` attributes or well-defined CSS selectors that exist on both sides.

### 3.4 The Comparison Engine

The comparison engine in `lib/compare-region.js` performs these steps:

```
Step 1 — resolve(page, section, options)
  └─ registry.findPage() → registry.findSection()

Step 2 — open browsers
  ├─ browser.page(prototypeUrl, {viewport, waitMs})
  └─ browser.page(storybookUrl, {viewport, waitMs})

Step 3 — wait for selectors
  ├─ waitForLocator(leftPage, section.original)
  └─ waitForLocator(rightPage, section.react)

Step 4 — cvd.compare.region({left, right, threshold, inspect, outDir})
  └─ Returns comparison object with artifacts

Step 5 — write artifacts
  ├─ comparison.artifacts.write(outDir, ['json', 'markdown'])
  └─ ensureDocmgrMarkdown()

Step 6 — classification
  └─ policies.withClassification(row) → adds classification band
```

The key artifacts produced:

| File | Content |
|---|---|
| `compare.json` | Full structured result from `cvd.compare.region` |
| `compare.md` | Markdown summary with pixel diff + style changes |
| `left_region.png` | Screenshot of left (prototype) selector |
| `right_region.png` | Screenshot of right (Storybook) selector |
| `diff_comparison.png` | Side-by-side diff visualization |
| `diff_only.png` | Changed pixels only |

### 3.5 The Policy Classification System

Every comparison result is classified into bands:

```javascript
function classifyChangedPercent(percent) {
  if (n <= 1)    return 'accepted'
  if (n <= 10)   return 'review'
  if (n <= 25)   return 'tune-required'
  return 'major-mismatch'
}
```

The CI gate (`--mode ci`) fails if any section exceeds the configured threshold:

```bash
css-visual-diff verbs ... compare-all \
  --mode ci \
  --maxChangedPercent 10
```

A section at 8.56% (our TopBar result) is classified as `review` — it passes CI but is flagged for human review.

### 3.6 Style Property Presets

Inspection captures CSS properties based on a preset:

```javascript
var presets = {
  typography: ['font-family', 'font-size', 'font-weight', 'line-height', 'color', ...],
  layout:     ['display', 'position', 'width', 'height', 'margin', 'padding', ...],
  surface:     ['background-color', 'border-color', 'border-radius', 'box-shadow', ...],
  spacing:     ['margin-top', 'margin-right', 'margin-bottom', 'margin-left', ...],
  pageShell:   ['box-sizing', 'width', 'height', 'padding', 'display', ...],
}
```

For the TopBar, `surface` or `typography` presets would capture the color difference. The default is `pageShell`.

---

## 4. Extending the Userland

### 4.1 Adding a New Atom Comparison

To add an atom to the visual diff system:

1. **Identify the atom's selector on both sides**

```bash
# Prototype inspection
curl -s http://localhost:7070/standalone/full-app/dashboard.html | \
  grep -o 'data-pyxis-component="[^"]*"' | sort -u

# Storybook inspection
curl -s http://localhost:6008/index.json | \
  jq '.stories[].id' | grep -i button
```

2. **Verify the story exists**

```bash
curl -s http://localhost:6008/index.json | \
  jq '.stories[] | select(.id | contains("button")) | .id'
```

3. **Add to `app.components.visual.yml`**

```yaml
- page: button-primary
  variant: component
  priority: tune-first
  prototypePath: /standalone/full-app/dashboard.html
  storyId: pyxis-app-components-atoms-button--primary
  viewport:
    width: 200
    height: 60
  sections:
    - name: component
      original: '[data-pyxis-component="button"][data-variant="primary"]'
      react: '[data-pyxis-component="button"][data-variant="primary"]'
```

4. **Regenerate the JS mirror**

```bash
python3 prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

5. **Run the comparison**

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page button-primary \
  --outDir /tmp/button-compare
```

### 4.2 Adding a New Page Section

The TopBar was already in the spec, but if you needed to add a new section:

```yaml
# In app.pages.desktop.visual.yml
- page: dashboard
  sections:
    - name: topbar                      # ← new section
      original: 'main > div:first-child'
      react: '[data-section="app-topbar"]'
    - name: sidebar                    # ← already exists
      original: 'aside'
      react: '[data-section="app-sidebar"]'
```

Then compare just that section:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --outDir /tmp/dashboard-topbar-only
```

### 4.3 Creating a Snapshot-Based Tuning Workflow

For iterative CSS work, snapshot-based tuning is faster than full pixel diffs:

```bash
# Capture baseline
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section dashboard topbar \
  --variant desktop \
  --outDir /tmp/topbar-baseline \
  --stylePreset typography \
  --output json

# ... edit CSS ...

# Capture after
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages snapshot-section dashboard topbar \
  --variant desktop \
  --outDir /tmp/topbar-after \
  --stylePreset typography \
  --output json

# Diff
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages diff-snapshots \
  /tmp/topbar-baseline/snapshot.json \
  /tmp/topbar-after/snapshot.json \
  --outDir /tmp/topbar-snapshot-diff \
  --output json
```

The snapshot diff reports:
- Which CSS properties changed
- Bounds deltas (x, y, width, height) with tolerance
- Text content changes
- A change/no-change classification

This is especially useful when tuning atoms: one CSS property change can be verified with a snapshot diff before running a full pixel comparison.

---

## 5. Practical Debugging Workflow

### 5.1 The Five-Question Framework

When you encounter a visual diff that needs investigation, apply this sequence:

**Question 1 — Is the selector correct on both sides?**
Run `inspect-section --side both` and confirm `exists: true` and `visible: true` on both sides.

**Question 2 — Is the pixel diff coming from the atoms or the layout?**
Compare the pixel diff percentage with the bounds difference. If bounds match but pixels differ, the atoms differ. If bounds differ, the layout differs.

**Question 3 — Which CSS property is causing the diff?**
Check the `styles` array in the comparison output. Look for `changed: true` properties.

**Question 4 — Is this property coming from a token or inline style?**
- If it's a token (`--app-ink`, `--app-accent`), check `app-tokens.css` vs prototype `tokens.js`
- If it's an inline style, check the component TSX

**Question 5 — Is the diff explainable as an accepted difference?**
If the diff is known (e.g., prototype uses a slightly different gray), add it to `acceptedDifferences` in the spec:

```yaml
sections:
  - name: topbar
    acceptedDifferences:
      - "Prototype uses #1A1A18, app uses #1f1e1c for ink color"
```

### 5.2 The TopBar Investigation Worked Example

Here is the complete investigation of our TopBar 8.56% diff, step by step:

**Step 1: Confirm selectors**

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-section dashboard topbar \
  --variant desktop \
  --side both \
  --output json
```

Result: both sides exist and visible ✓

**Step 2: Run comparison**

```bash
css-visual-diff verbs script compare region \
  --leftUrl "http://localhost:7070/standalone/full-app/dashboard.html" \
  --rightUrl "http://localhost:6008/iframe.html?id=pyxis-app-components-shell-appshell--top-bar-dashboard" \
  --leftSelector "main > div:first-child" \
  --rightSelector "[data-section='app-topbar']" \
  --width 1240 \
  --height 120
```

Result: 8.56% pixel diff, `color` changed ✓

**Step 3: Identify atom**

TopBar uses `Button` atoms. Check if the Button atom itself matches:

```bash
# This is a hypothetical atom-level check
css-visual-diff verbs script compare region \
  --leftUrl "http://localhost:7070/standalone/full-app/dashboard.html" \
  --rightUrl "http://localhost:6008/iframe.html?id=pyxis-app-components-atoms-button--outline" \
  --leftSelector ".px-btn-outline" \
  --rightSelector "[data-pyxis-component='button'][data-variant='outline']" \
  --width 520 \
  --height 60
```

If the Button matches but the TopBar still differs, the diff is in the TopBar's own CSS (the `color` for the subtitle `p` tag).

**Step 4: Check token files**

```bash
grep -n "ink\|#1A1A\|#1f1e" \
  prototype-design/lib/tokens.js \
  web/packages/pyxis-app/src/styles/app-tokens.css \
  web/packages/pyxis-components/src/tokens/tokens.css
```

Found: prototype `#1A1A18` vs app `#1f1e1c` — confirmed token mismatch.

**Step 5: Decide on fix**

The token mismatch should be resolved by choosing a canonical value. If `#1A1A18` is the design intent, update `--app-ink` in `app-tokens.css`. Then regenerate snapshots and re-run comparisons.

---

## 6. Key Files Quick Reference

| File | Purpose |
|---|---|
| `lib/registry.js` | Spec loading, target lookup, hardcoded to public-pages default |
| `lib/compare-region.js` | Comparison orchestration using `cvd.compare.region` |
| `lib/inspect.js` | Browser-based element inspection |
| `lib/snapshot.js` | Semantic snapshots and snapshot diffs |
| `lib/policies.js` | Classification bands and CI policy gate |
| `lib/styles.js` | CSS property presets for inspection |
| `lib/normalizers.js` | Value normalization (colors, units) |
| `lib/tolerances.js` | Numeric comparison with tolerance |
| `verbs/pyxis-pages.js` | Registered CLI verbs |
| `specs/app.components.visual.yml` | Atom/molecule comparison targets |
| `specs/app.pages.desktop.visual.yml` | Page section comparison targets |
| `web/packages/pyxis-app/src/styles/app-tokens.css` | App CSS token definitions |
| `web/packages/pyxis-components/src/tokens/tokens.css` | Shared component tokens |
| `prototype-design/lib/tokens.js` | Prototype token definitions |

---

## 7. Summary of Findings

The TopBar comparison revealed:

1. **8.56% pixel difference** — classified as `review` band
2. **Text content matches exactly** — no text rendering issues
3. **CSS differences** in `color`, `font-size`, `line-height`
4. **Root cause**: token mismatch `#1A1A18` (prototype) vs `#1f1e1c` (app)
5. **Atoms used**: `Button` (3 instances) — these should also be atom-tested
6. **Userland limitation**: default spec is public-pages; app targets need `compare-spec`

The next steps for this investigation are:
- Verify the Button atoms match between prototype and Storybook
- Resolve the token mismatch (choose canonical ink color)
- Add TopBar to `app.components.visual.yml` as a component target
- Split AppShell stories into individual files
- Reorganize organisms into page-based subfolders
