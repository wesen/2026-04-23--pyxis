---
Title: css-visual-diff Verb Operator Guide
Status: draft
Topics:
  - frontend
  - visual-tuning
  - storybook
  - css-visual-diff
  - operator-workflow
DocType: playbook
Intent: operational
Owners: []
RelatedFiles:
  - Path: prototype-design/visual-diff/userland/verbs/pyxis-pages.js
    Note: Verb definitions, flags, and compact summary implementation.
  - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
    Note: Public-site desktop visual spec used by pyxis-user-site.
  - Path: prototype-design/visual-diff/userland/specs/app.components.visual.yml
    Note: App component visual spec used for Shell/component parity.
  - Path: prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml
    Note: App page visual spec.
  - Path: prototype-design/visual-diff/userland/lib/compare-region.js
    Note: Writes compare-all-output.json and per-section artifacts.
Summary: Practical guide for choosing and running css-visual-diff userland verbs without flooding the terminal or comparing more than the current decision requires.
LastUpdated: 2026-04-27T00:00:00-04:00
WhatFor: Use when comparing Pyxis prototype pages/components to Storybook with css-visual-diff.
WhenToUse: Before running a visual-diff command, especially during iterative tuning.
---

# css-visual-diff Verb Operator Guide

The most common mistake with `css-visual-diff` is to run a broad suite command when the work at hand is a narrow question.

A visual comparison is not one command. It is a loop:

1. choose the smallest useful target,
2. inspect the selectors if needed,
3. compare only that target,
4. inspect the image artifacts,
5. make one visual change,
6. repeat,
7. run broader validation only when the local target is stable.

This guide is about the first three steps: selecting the right verb, flags, and output shape.

---

## 1. Mental Model: Target, Section, Output

Every comparison has three decisions.

### 1.1 Target: Which page or component?

The target comes from a spec.

Examples:

- `public-pages.desktop.visual.yml` contains public-site pages such as `shows`, `archive`, `about`.
- `app.components.visual.yml` contains component stories such as `app-topbar-dashboard`.
- `app.pages.desktop.visual.yml` contains app page stories.

For non-default specs, prefer `compare-spec` with an explicit spec path.

### 1.2 Section: Which region inside that target?

A page can have several sections. For example, public Shows desktop currently has:

- `page`
- `content`
- `header`
- `shows-list`
- `mailing-list`

If you are tuning posters, compare `shows-list`, not the whole page.

### 1.3 Output: Human summary or full machine JSON?

The full comparison object is useful for debugging internals, but it is too noisy for normal iteration.

Use:

```bash
--summary --output json
```

The full report is still written under the output directory as files, especially:

```text
$outDir/compare-all-output.json
$outDir/<page>/artifacts/<section>/compare.json
$outDir/<page>/artifacts/<section>/diff_only.png
$outDir/<page>/artifacts/<section>/left_region.png
$outDir/<page>/artifacts/<section>/right_region.png
```

---

## 2. The Preferred Iteration Command

For the common user-site Shows desktop workflow, use the alias verb:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

rm -rf /tmp/pyxis-user-shows-list-tune

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-user-shows-section \
  shows-list \
  --outDir /tmp/pyxis-user-shows-list-tune \
  --output json
```

The alias hardcodes the public desktop spec and `--page shows`, runs one section, and returns compact operator output with the important artifact paths.

When tuning another public-site section or page, use `compare-spec` directly:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

OUT=/tmp/pyxis-user-shows-list-tune
rm -rf "$OUT"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --section shows-list \
  --outDir "$OUT" \
  --summary \
  --output json
```

This answers the narrow question:

> How far is the React `shows-list` section from the prototype `shows-list` section right now?

It does not spend attention on header, mailing-list, or full-page scroll-height effects.

---

## 3. Keep Terminal Output Small

### 3.1 Prefer alias verbs for repeated workflows

The Shows section alias already returns compact rows, not the full nested suite object:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-user-shows-section shows-list \
  --outDir /tmp/pyxis-user-shows-list-tune \
  --output json
```

Typical output shape:

```json
[
  {
    "page": "shows",
    "section": "shows-list",
    "classification": "tune-required",
    "changedPercent": 20.5,
    "diffOnlyPath": "/tmp/.../diff_only.png",
    "rightRegionPath": "/tmp/.../right_region.png",
    "leftRegionPath": "/tmp/.../left_region.png"
  }
]
```

### 3.2 Redirect the summary

If the summary is still distracting, save it:

```bash
OUT=/tmp/pyxis-user-shows-list-tune
rm -rf "$OUT"
mkdir -p "$OUT"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --section shows-list \
  --outDir "$OUT" \
  --summary \
  --output json \
  > "$OUT/summary.json"
```

Then print only the fields an operator needs:

```bash
jq '.[0].rows[] | {
  section,
  classification,
  changedPercent,
  bounds,
  diffOnlyPath,
  leftRegionPath,
  rightRegionPath
}' "$OUT/summary.json"
```

### 3.3 Read artifacts, not walls of JSON

For visual tuning, the image artifacts are usually more important than the JSON.

Inspect in this order:

1. `diff_only.png` — where pixels differ.
2. `right_region.png` — what the React/Storybook side currently looks like.
3. `left_region.png` — what the prototype expects.
4. `diff_comparison.png` — only when you need wide triptych context.

Example paths:

```text
/tmp/pyxis-user-shows-list-tune/shows/artifacts/shows-list/diff_only.png
/tmp/pyxis-user-shows-list-tune/shows/artifacts/shows-list/right_region.png
/tmp/pyxis-user-shows-list-tune/shows/artifacts/shows-list/left_region.png
```

---

## 4. Choosing the Right Verb

| Situation | Verb | Typical flags |
|---|---|---|
| Find available default targets | `list-targets` | `--output json` |
| Check whether selectors exist and what styles differ | `inspect-spec` | `--page`, `--section`, `--elements`, `--summary` |
| Compare user-site Shows section quickly | `compare-user-shows-section` | section argument, optional `--outDir` |
| Compare one section from an explicit YAML spec | `compare-spec` | `--page`, `--section`, `--summary` |
| Compare one whole page from an explicit YAML spec | `compare-spec` | `--page`, `--summary` |
| Compare a component target from app spec | `compare-spec` | `--page app-topbar-dashboard`, `--summary` |
| Capture semantic state before/after a code change | `snapshot-section` + `diff-snapshots` | `--outDir`, then compare snapshot JSON files |

The general rule:

> Use `compare-spec` for Pyxis work unless you intentionally want the default registry target.

The default registry is public-page oriented. App components and app pages should always pass the YAML spec explicitly.

---

## 5. Before Comparing: Inspect Selectors When Unsure

If a section comparison looks strange, first confirm both selectors exist.

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --section shows-list \
  --elements '&' \
  --stylePreset layout \
  --summary \
  --output json
```

Use `--elements` to inspect nested nodes without creating new specs:

```bash
--elements '&,.pyxis-show-grid,.pyxis-show-tile,.pyxis-poster'
```

Useful style presets:

- `layout` — bounds, display, grid/flex, width/height questions.
- `typography` — text size, line-height, font-family, color.
- `surface` — backgrounds, borders, radii, shadows.
- `spacing` — margins and padding.
- `pageShell` — page-level shell and container properties.

---

## 6. During Tuning: Narrow First, Broad Later

Do not attach TypeScript, Vite build, Storybook build, and full-page visual comparison to every micro-iteration.

### 6.1 Fast loop

Use while changing CSS or fixture data:

```bash
OUT=/tmp/pyxis-user-shows-list-tune
rm -rf "$OUT"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --section shows-list \
  --outDir "$OUT" \
  --summary \
  --output json \
  > "$OUT-summary.json"
```

Then inspect:

```text
$OUT/shows/artifacts/shows-list/diff_only.png
$OUT/shows/artifacts/shows-list/right_region.png
$OUT/shows/artifacts/shows-list/left_region.png
```

### 6.2 Local validation loop

After a likely fix:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site
pnpm exec tsc --noEmit
pnpm exec vite build
```

### 6.3 Broad visual validation loop

After the target section is stable, compare the whole page:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

OUT=/tmp/pyxis-user-shows-page-tune
rm -rf "$OUT"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --outDir "$OUT" \
  --summary \
  --output json
```

Only then consider the full public-pages suite.

---

## 7. Example: User-Site Shows Poster Regression

### Problem

The Storybook page:

```text
http://localhost:6007/?path=/story/public-site-pages--shows-desktop&globals=viewport:pyxisDesktop
```

changed substantially after flyer/poster upload work.

A broad command produced a long JSON dump for all Shows sections. That was technically correct but operationally poor: the important mismatch was in `shows-list`.

### Better command

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

OUT=/tmp/pyxis-user-shows-list-after-change
rm -rf "$OUT"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-user-shows-section \
  shows-list \
  --outDir "$OUT" \
  --output json
```

If you need the generic form for a different spec, use `compare-spec --page shows --section shows-list --summary`.

### What mattered

The useful evidence was not the full JSON object. It was:

```text
$outDir/shows/artifacts/shows-list/diff_only.png
$outDir/shows/artifacts/shows-list/right_region.png
$outDir/shows/artifacts/shows-list/left_region.png
```

Those images showed the actual cause: the React side rendered uploaded-style placeholder flyer images instead of the prototype's stylized poster components.

---

## 8. App Component Example

For an app component target such as the Dashboard TopBar, do not use the default public-page registry. Pass the app component spec explicitly.

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis

OUT=/tmp/pyxis-topbar-dashboard-tune
rm -rf "$OUT"

css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.components.visual.yml \
  --page app-topbar-dashboard \
  --section component \
  --outDir "$OUT" \
  --summary \
  --output json
```

Inspect:

```text
/tmp/pyxis-topbar-dashboard-tune/app-topbar-dashboard/artifacts/component/diff_only.png
/tmp/pyxis-topbar-dashboard-tune/app-topbar-dashboard/artifacts/component/right_region.png
/tmp/pyxis-topbar-dashboard-tune/app-topbar-dashboard/artifacts/component/left_region.png
```

---

## 9. When to Use Full Output

Use full output only when you need implementation detail, for example:

- debugging why a selector has unexpected bounds,
- reading all style diffs,
- checking accepted-difference metadata,
- investigating policy behavior,
- comparing multiple sections in one report for a handoff.

Command:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --outDir /tmp/pyxis-user-shows-full \
  --output json \
  > /tmp/pyxis-user-shows-full/stdout-full.json
```

But for ordinary tuning, prefer `--summary`.

---

## 10. Optional Wrapper Script Pattern

For ticket work, a small wrapper can make the workflow harder to misuse.

Create it in the ticket `scripts/` directory, not as an untracked `/tmp` one-off.

Example interface:

```bash
./05-compare-user-shows-section.sh shows-list /tmp/pyxis-user-shows-list-tune
```

Expected behavior:

1. remove/recreate the output directory,
2. run `compare-spec --page shows --section "$SECTION" --summary`,
3. write summary JSON to `$OUT/summary.json`,
4. print only section, classification, changed percent, and artifact paths.

A good wrapper prints something like:

```text
section: shows-list
classification: tune-required
changedPercent: 20.50
diffOnly: /tmp/pyxis-user-shows-list-tune/shows/artifacts/shows-list/diff_only.png
right: /tmp/pyxis-user-shows-list-tune/shows/artifacts/shows-list/right_region.png
left: /tmp/pyxis-user-shows-list-tune/shows/artifacts/shows-list/left_region.png
```

This is the right amount of terminal output for an operator.

---

## 11. Checklist Before Running a Visual Command

Ask these questions:

1. Am I comparing the smallest useful target?
2. Do I need the whole page, or only one section?
3. Do I need full JSON, or is `--summary` enough?
4. Is this an app target that needs an explicit app spec?
5. Where will the artifacts be written?
6. Which image will I inspect first? Usually `diff_only.png`.
7. Do I need TypeScript/build validation now, or after the visual change stabilizes?

If the answer to #2 is "only one section," include `--section`.

If the answer to #3 is "summary is enough," include `--summary`.
