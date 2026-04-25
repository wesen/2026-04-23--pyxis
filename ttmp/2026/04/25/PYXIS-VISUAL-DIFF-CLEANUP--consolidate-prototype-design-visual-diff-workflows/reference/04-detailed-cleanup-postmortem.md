---
Title: Detailed cleanup postmortem
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - automation
    - pyxis
DocType: reference
Intent: retrospective
Owners: []
RelatedFiles:
    - Path: docs/playbooks/05-bottom-up-component-visual-parity.md
      Note: Updated playbook that closes old workflow chapter
    - Path: prototype-design/-deprecated/README.md
      Note: Deprecated quarantine policy central to cleanup retrospective
    - Path: prototype-design/screens/ppxis.jsx
      Note: Selector stabilization lesson source
    - Path: prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
      Note: Generated mirror lesson and follow-up point
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Canonical visual suite used after cleanup
ExternalSources: []
Summary: Detailed retrospective on the prototype-design visual-diff cleanup, lessons learned, caveats, and forward path for proper JS-canonical visual diffing.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Detailed Cleanup Postmortem

## 1. Why this cleanup mattered

The cleanup started because the Pyxis visual-diff area had become a sedimentary stack of several valid but incompatible generations of work. Each layer made sense when it was created:

1. imported prototype HTML and screenshots,
2. prototype baseline extraction,
3. native `css-visual-diff run` YAML configs,
4. Storybook component capture configs,
5. bottom-up component parity reports,
6. first-pass public-page comparison configs,
7. JavaScript userland experiments,
8. promoted JS suite/spec/catalalog/snapshot workflows.

The problem was not that these layers were wrong. The problem was that they all remained visible as if they were equally current. A future developer could easily choose the wrong workflow, add a new native YAML config, or tune CSS against a stale/broad selector. That would keep the project stuck in compatibility mode.

The central decision was therefore simple but important:

```text
Pyxis visual diffing is project-specific work.
The css-visual-diff JavaScript API exists so Pyxis can express that project-specific workflow directly.
No backwards compatibility with old native configs is required.
```

Once that was explicit, the cleanup had a clear north star: preserve history, but make the active workflow small, obvious, and spec-driven.

## 2. What changed

### 2.1 JS userland became the active workflow

The active workflow now lives under:

```text
prototype-design/visual-diff/userland/
```

The canonical public-page suite is:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

The main commands are:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
```

The suite uses:

- project-specific `*.visual.yml` specs,
- `cvd.compare.region(...)`,
- catalogs,
- policy classification,
- semantic snapshots,
- generated JSON/Markdown reports,
- stable `data-page` and `data-section` selectors.

### 2.2 JS transition scaffolding was removed

The promoted JS userland had some code that only existed because we were learning the API and bridging between old and new workflows. That is gone now.

Removed examples:

```text
lib/results.js
pyxis pages summarize-results
pyxis pages import-smoke
pyxis pages compare-section-command
buildCompareRegionArgs(...)
argsToShellCommand(...)
planCompareSection(...)
```

Removed old smoke/development scripts:

```text
02-smoke-import-mechanism.sh
03-smoke-summarize-existing-page-results.sh
05-smoke-compare-section-command.sh
06-smoke-child-process-unavailable.sh
07-capture-new-flexible-js-api-docs.sh
```

This matters because the JS layer should no longer be half product workflow and half archaeology.

### 2.3 The registry stopped owning selector truth

Previously `lib/registry.js` had a hard-coded `PUBLIC_PAGES` array that duplicated the YAML spec. That was dangerous: every selector cleanup would need to be edited twice.

Now the YAML spec is the source of truth, and `registry.js` normalizes a generated CommonJS mirror:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml  # reviewed source
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js   # generated runtime mirror
```

A helper was added:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

This does not completely eliminate drift risk, but it turns a hand-maintained duplicate into a generated mirror with an obvious refresh command.

### 2.4 Native configs were removed or quarantined

The five public-page native configs were deleted after proving the JS spec suite covered the same public-page intent:

```text
prototype-design/visual-diff/comparisons/public-pages/about-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/book-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/show-detail-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
```

Remaining old native configs were moved into:

```text
prototype-design/-deprecated/visual-diff-native-configs/
```

This includes old component-system configs, prototype page configs, public component configs, and Storybook component config trees.

### 2.5 Old generated output and scratch material were quarantined

The cleanup created:

```text
prototype-design/-deprecated/
```

with:

```text
generated-output/
screenshots-and-imports/
visual-diff-native-configs/
visual-diff-scripts/
```

This was a better choice than immediate deletion because the old artifacts still contain evidence: screenshots, prepared HTML, CSS dumps, manifests, old scripts, and historical reports. But they no longer sit in active paths and no longer pretend to be current workflow.

### 2.6 Public prototype selectors were stabilized

The public prototype shell now has stable page and section selectors. Shows was the key case:

```text
[data-page='shows']
[data-section='shows-header']
[data-section='shows-list']
[data-section='mailing-list']
```

The old problem was broad selectors like:

```text
#root > *
```

being compared against narrow React sections. That produced misleading diffs. The comparison was technically deterministic but semantically wrong: it compared different DOM scopes.

After the cleanup, section-level diffs are better scoped and therefore more useful for actual tuning.

## 3. What changed in the numbers

After selector stabilization, the full public-page suite returned:

```text
pageCount: 5
sectionCount: 13
maxChangedPercent: 66.03678642230044
classificationCounts: { major-mismatch: 4, review: 4, tune-required: 5 }
```

Current baselines:

```text
shows/page          46.3495
shows/content       52.4196
shows/header         7.2648
shows/shows-list    66.0368
shows/mailing-list   9.9766
show-detail/page    18.5282
show-detail/content 30.0792
archive/page         6.6511
archive/content      7.2126
book/page           12.1006
book/content        16.9306
about/page          18.2795
about/content       20.5467
```

The important point is not that all diffs improved. Some changed because the crop changed. That is expected. Selector cleanup changes what is being measured. A better-scoped 7.21% diff is more useful than a less accurate 7.12% diff.

Shows diagnostics after selector stabilization:

```text
header       styleDiffs=7 yDelta=-40 heightDelta=102.5
shows-list   styleDiffs=7 yDelta=44.5 heightDelta=-476.359375
mailing-list styleDiffs=7 yDelta=-407.859375 heightDelta=8.5
content      styleDiffs=8 yDelta=0 heightDelta=-327.359375
```

These numbers tell us where to focus next:

- `shows-list` is still the largest section mismatch.
- `shows/content` remains high because it includes the page content stack.
- `shows/header` and `shows/mailing-list` are now much more tractable.
- Archive remains closest to acceptance.

## 4. What I learned

### 4.1 Compatibility is not neutral

Keeping old configs “just in case” sounds safe, but in practice it creates uncertainty. If two workflows exist, developers have to decide which one is authoritative. That decision gets made repeatedly and inconsistently.

The cleanup became much clearer after deciding:

```text
No backwards compatibility requirement.
Cut ties with the native config workflow for active Pyxis work.
```

That did not mean deleting all evidence. It meant removing old paths from the active decision surface.

### 4.2 Deterministic does not mean meaningful

`css-visual-diff` can deterministically compare two selectors, but if the selectors do not represent equivalent regions, the result is misleading.

The Shows page demonstrated this clearly. Comparing prototype `#root > *` to React `[data-section='shows-list']` is deterministic, but not semantically equivalent. That kind of mismatch leads to noisy CSS tuning because the tool is measuring selection error plus visual difference.

The lesson:

```text
Selector scope is part of the test contract.
```

Before tuning CSS, validate that the compared regions mean the same thing.

### 4.3 Project-specific specs are worth it

The native config format is useful as a general-purpose low-level runner format. Pyxis needs more than that:

- page targets,
- section roles,
- priorities,
- baseline diffs,
- policy bands,
- accepted differences,
- semantic snapshot presets,
- Storybook-specific conventions,
- prototype-specific selectors.

That belongs in a Pyxis visual suite schema, not in generic native run configs. The JS API lets us express project-specific orchestration directly.

### 4.4 Generated mirrors need explicit tooling

The Goja runtime detail matters: explicit `compare-spec` can receive parsed YAML through `objectFromFile`, but ergonomic default verbs need a synchronously importable object. The current `.visual.js` mirror solves that.

But generated files are always a drift risk unless there is a refresh/check command. Adding `refresh-spec-mirrors.py` was a small but important cleanup step.

A future `--check` mode would make this stronger.

### 4.5 Deprecated is better than ambiguous

Moving old outputs/configs/scripts into `prototype-design/-deprecated/` changed the repository semantics. Before, old and new artifacts were siblings. After, the active tree communicates intent:

```text
Use visual-diff/userland for current work.
Go to -deprecated only for archaeology.
```

That is better than either keeping everything mixed together or deleting history too aggressively.

### 4.6 Documentation must be moved with code

After moving files, old playbooks still pointed at the previous locations. That would have undermined the cleanup. Updating the old playbooks to say “this is deprecated” was as important as moving the files.

Docs can resurrect old workflows if they keep describing them as current.

## 5. What is worth noting for future work

### 5.1 Do not add active native YAML configs

If a future task needs a comparison, add it to a project-specific visual suite spec and JS userland workflow. Do not add new active files like:

```text
prototype-design/visual-diff/**/*.css-visual-diff.yml
```

If a minimal upstream repro is needed for `css-visual-diff`, create it in the relevant ticket workspace, not as a permanent Pyxis workflow file.

### 5.2 Keep generated artifacts out of commits

Runtime artifacts should be removed after local runs:

```bash
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

The deprecated generated output is historical and quarantined. New generated output should not creep back into active source paths.

### 5.3 Tune after selector validation

For future visual tuning, use this sequence:

1. Check selectors in the visual suite spec.
2. Run semantic snapshot diagnostics.
3. Inspect screenshots/images directly if needed.
4. Tune CSS/composition.
5. Re-run spec suite.
6. Update baselines only when the selector contract or accepted target changes.

Do not tune from pixel percentages alone.

### 5.4 Treat page-level and component-level workflows separately

Public pages now have a clean JS suite. Component parity is historically documented but not rebuilt as a JS suite yet. If component parity remains important, it should be rebuilt as component-level `*.visual.yml` specs rather than by reviving old native configs.

### 5.5 The deprecated folder is not a landfill for new work

`prototype-design/-deprecated/` should not become a new place to put random outputs. It is a quarantine for old material. New temporary work should go in ticket workspaces or ignored generated-output paths and be removed before commit.

## 6. Mistakes and sharp edges

### 6.1 Shell pipe plus Python here-doc

One validation mistake happened while piping JSON to Python with a here-doc:

```bash
css-visual-diff ... --output json | python3 - <<'PY'
import sys,json
rows=json.load(sys.stdin)
PY
```

This fails because the here-doc becomes Python's stdin, so the piped JSON is not available. The fix is to write JSON to a temp file or use `python3 -c`.

### 6.2 `git mv` and ignored generated directories

Some generated output trees had tracked files and ignored/untracked files mixed together. `git mv` moved tracked files, but failed or ignored some generated-only directories. The fix was:

1. use `git mv` for tracked files,
2. use plain `mv` for ignored generated directories,
3. update `.gitignore` for the new deprecated generated-output paths.

### 6.3 Commit hash recording during amend

While trying to keep diary commit hashes exact during amend operations, there were a couple of shell quoting mistakes where backticks in Python replacement strings were interpreted by the shell. This was fixed, but the lesson is: avoid shell-interpolated Python snippets with Markdown backticks unless the heredoc is safely quoted.

### 6.4 Full precision vs rounded baselines

The spec currently stores `baselineDiffs` rounded to four decimals. That is readable and matches the previous style, but if strict regression math is added later, full precision may be preferable.

## 7. Current state of the project

The cleanup chapter is effectively closed.

Active validation:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

Current active public-page suite:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

Current historical archive:

```text
prototype-design/-deprecated/
```

Current best next work:

```text
Shows visual tuning with stable selectors.
```

## 8. Recommended next chapter: proper visual diffing

Now that cleanup is done, the next chapter should focus on improving actual parity rather than infrastructure archaeology.

Recommended order:

1. Start with Shows because it has the largest residual mismatch.
2. Use `diagnose-shows-sections.sh` before changing CSS.
3. Tune header and mailing-list first because they are now bounded and review-band.
4. Then tune `shows-list`, likely by aligning grid/card spacing, page vertical rhythm, poster sizes, and mailing-list placement.
5. Re-run `run-compare-spec-public-pages.sh` after each coherent change.
6. Update `baselineDiffs` only after accepting a new stable comparison contract or a meaningful tuning checkpoint.

A good visual-diff loop from here is:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
# inspect PNGs / semantic output
# make CSS or composition change
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

The key mindset shift is:

```text
We are no longer cleaning the visual-diff workflow.
We are now using it.
```
