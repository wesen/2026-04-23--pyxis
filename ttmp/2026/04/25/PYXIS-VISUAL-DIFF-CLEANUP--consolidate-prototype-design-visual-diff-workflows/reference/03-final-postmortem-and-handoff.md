---
Title: Final postmortem and handoff
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - automation
    - pyxis
DocType: reference
Intent: handoff
Owners: []
RelatedFiles:
    - Path: docs/playbooks/05-bottom-up-component-visual-parity.md
      Note: Updated playbook for JS-canonical workflow
    - Path: prototype-design/-deprecated/README.md
      Note: Deprecated quarantine policy created by cleanup
    - Path: prototype-design/screens/ppxis.jsx
      Note: Prototype selectors stabilized for visual suite
    - Path: prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
      Note: Spec mirror regeneration helper
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Canonical visual suite spec after cleanup
ExternalSources: []
Summary: Final handoff for the prototype-design visual-diff cleanup, JS-canonical workflow, deprecated quarantine, validation results, and remaining follow-ups.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Final Postmortem and Handoff

## Executive summary

`PYXIS-VISUAL-DIFF-CLEANUP` consolidated the Pyxis visual-diff workflow around project-specific JavaScript userland and visual suite specs. There is no backwards compatibility requirement for native `css-visual-diff run` configs. Old native configs, old baseline/catalog scripts, generated artifacts, screenshots, imported HTML, and scratch material were moved out of active paths into `prototype-design/-deprecated/`.

Active public-page visual validation now runs through:

```text
prototype-design/visual-diff/userland/
```

with the canonical desktop public-page suite at:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

## Current active layout

Active `prototype-design` workflow files are intentionally small:

```text
prototype-design/lib/
prototype-design/screens/
prototype-design/standalone/
prototype-design/visual-diff/scripts/fixtures/
prototype-design/visual-diff/userland/
```

The active `prototype-design/visual-diff` tree contains:

```text
prototype-design/visual-diff/scripts/fixtures/
prototype-design/visual-diff/userland/
```

No active native `*.css-visual-diff.yml` configs remain outside `prototype-design/-deprecated/`.

## Deprecated quarantine

Historical material now lives under:

```text
prototype-design/-deprecated/
```

Structure:

```text
prototype-design/-deprecated/
  README.md
  generated-output/
    baseline/
    storybook-catalog/
    visual-comparisons/
  screenshots-and-imports/
    comp/
    direct/
    uploads/
    *.png
    Pyxis *.html
  visual-diff-native-configs/
    comparisons/
    public-components/
    storybook-components/
    prototype-*.css-visual-diff.yml
  visual-diff-scripts/
    old baseline/catalog generator and runner scripts
```

Policy:

- Treat this directory as historical evidence.
- Do not add new workflow code here.
- Do not create new native `*.css-visual-diff.yml` configs.
- If useful selector or metadata information is found here, migrate it into `prototype-design/visual-diff/userland/specs/*.visual.yml` or focused docs.

## Canonical public-page workflow

Refresh generated spec mirrors:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

List targets:

```bash
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
```

Run Archive smoke:

```bash
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
```

Run full public-page suite:

```bash
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
```

Run Shows semantic diagnostics:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
```

After any visual run, remove generated runtime artifacts unless explicitly asked to keep them:

```bash
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

## Validation results

After selector stabilization and deprecated quarantine, the full public-page suite returned:

```text
pageCount: 5
sectionCount: 13
maxChangedPercent: 66.03678642230044
classificationCounts: { major-mismatch: 4, review: 4, tune-required: 5 }
```

Current baseline values in `public-pages.desktop.visual.yml`:

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

Shows diagnostics after selector stabilization:

```text
header       styleDiffs=7 yDelta=-40 heightDelta=102.5
shows-list   styleDiffs=7 yDelta=44.5 heightDelta=-476.359375
mailing-list styleDiffs=7 yDelta=-407.859375 heightDelta=8.5
content      styleDiffs=8 yDelta=0 heightDelta=-327.359375
```

## Important decisions

1. JS userland is canonical for Pyxis visual-diff workflow.
2. Native `css-visual-diff run` configs are retired for active Pyxis work.
3. `*.visual.yml` suite specs own project intent.
4. The CommonJS `*.visual.js` files are generated runtime mirrors, not reviewed source of truth.
5. Old baseline/catalog/capture workflows are historical and live under `-deprecated`.
6. Public-page selector stabilization happened before major CSS tuning.
7. Generated artifacts should not be committed unless explicitly requested.

## Commits of interest

Recent cleanup commits:

```text
5373ea0 Consolidate visual diff JS userland
6bcbdb7 Remove retired public page visual configs
8a985a9 Stabilize public page visual selectors
0c142fe Refresh visual suite baselines
ad70940 Update visual parity playbook for JS suite
f16de10 Quarantine deprecated prototype design artifacts
d6225eb Mark old visual diff playbooks deprecated
```

Diary-only/fix commits were also made between these milestones.

## What went well

- The active visual-diff tree is now small and legible.
- Transition JS scaffolding was removed without breaking suite validation.
- Public-page specs are schema-versioned and now include `defaults`, `policy`, `acceptedDifferences`, and `targets`.
- Selector stabilization reduced inflated Shows section comparisons and made diagnostics more meaningful.
- Deprecated material was preserved rather than destroyed, but moved out of active paths.

## What was tricky

- The old generated output trees mixed tracked and ignored files. `git mv` moved tracked files, but ignored generated directories needed plain filesystem moves plus `.gitignore` updates.
- The Goja runtime can parse YAML via `objectFromFile` for explicit verbs, but ergonomic default verbs need a synchronous spec object. The current solution is a generated CommonJS mirror.
- Old docs had many references to active paths that moved to `-deprecated`; those were updated with warning callouts rather than deleted.

## Remaining follow-ups

1. Add a drift check mode to `refresh-spec-mirrors.py` so CI or local validation can fail if YAML and JS mirrors diverge.
2. Add a repository hygiene check that fails when active `prototype-design/**/*.css-visual-diff.yml` files appear outside `prototype-design/-deprecated/`.
3. Decide whether historical playbooks `02`, `03`, and `04` should remain in `docs/playbooks/` with warnings or move to a docs archive.
4. Continue Shows visual tuning using stabilized selectors.
5. If component parity remains active, rebuild it as JS visual suite specs rather than reviving native configs.

## Review checklist

Review these first:

```text
prototype-design/-deprecated/README.md
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/screens/ppxis.jsx
docs/playbooks/05-bottom-up-component-visual-parity.md
```

Validation commands:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

Hygiene checks:

```bash
find prototype-design -path 'prototype-design/-deprecated' -prune -o -type f \
  \( -name '*.css-visual-diff.yml' -o -name '*.mjs' -o -name '*.png' \) -print

git status --short
```
