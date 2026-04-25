---
Title: Prototype-design visual-diff inventory and classification
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: reference
Intent: short-term
Owners: []
RelatedFiles:
  - Path: prototype-design/-deprecated/README.md
    Note: Quarantine policy for historical prototype-design artifacts
  - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
    Note: Canonical public-page visual suite spec
  - Path: prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
    Note: Canonical public-page visual validation script
  - Path: prototype-design/visual-diff/userland/lib/registry.js
    Note: Spec-backed default target loader/normalizer
  - Path: prototype-design/screens/ppxis.jsx
    Note: Active public prototype source with stable data-page/data-section selectors
ExternalSources: []
Summary: Current Phase 6 inventory after quarantining deprecated prototype-design visual-diff artifacts.
---

# Prototype-design visual-diff inventory and classification

This inventory was refreshed after creating `prototype-design/-deprecated/` and moving historical visual-diff material out of active paths.

## Current layout summary

Active source paths are now intentionally small:

```text
prototype-design/lib/
prototype-design/screens/
prototype-design/standalone/
prototype-design/visual-diff/scripts/fixtures/
prototype-design/visual-diff/userland/
```

Deprecated/historical material is quarantined under:

```text
prototype-design/-deprecated/
```

## Counts after quarantine

Current filesystem count under `prototype-design`:

| Class | Count | Meaning |
| --- | ---: | --- |
| canonical-source | 88 | Active prototype sources, standalone HTML, fixture preparation, and JS userland. |
| deprecated | 6639 | Historical configs, generated outputs, screenshots, imports, and old scripts moved under `-deprecated`. |
| active retired-native | 0 | No native `*.css-visual-diff.yml` configs remain in active paths. |
| active generated-output | 0 | Old generated visual outputs were moved out of active paths. |
| needs-review | 0 | No remaining active `prototype-design` paths fell outside the classification rules. |

## Deprecated quarantine structure

```text
prototype-design/-deprecated/
  README.md
  generated-output/
    baseline/
    storybook-catalog/
    visual-comparisons/        # ignored local generated output moved out of active path
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
    old baseline/catalog generator, runner, and server scripts
```

## Active visual-diff source

```text
prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/lib/artifacts.js
prototype-design/visual-diff/userland/lib/compare-region.js
prototype-design/visual-diff/userland/lib/index.js
prototype-design/visual-diff/userland/lib/inspect.js
prototype-design/visual-diff/userland/lib/markdown.js
prototype-design/visual-diff/userland/lib/normalizers.js
prototype-design/visual-diff/userland/lib/policies.js
prototype-design/visual-diff/userland/lib/registry.js
prototype-design/visual-diff/userland/lib/slug.js
prototype-design/visual-diff/userland/lib/snapshot.js
prototype-design/visual-diff/userland/lib/storybook.js
prototype-design/visual-diff/userland/lib/styles.js
prototype-design/visual-diff/userland/lib/tolerances.js
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/run-compare-all-public-pages.sh
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
prototype-design/visual-diff/userland/scripts/smoke-ci-policy-failure.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-all-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-page-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-section-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-diff-snapshots-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-inspect-section-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/smoke-snapshot-section-archive.sh
prototype-design/visual-diff/userland/specs/README.md
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
```

## Deprecated classes and rationale

| Deprecated group | Rationale |
| --- | --- |
| `visual-diff-native-configs/` | Native `css-visual-diff run` configs are no longer the Pyxis workflow. Public-page intent is represented by `userland/specs/public-pages.desktop.visual.yml`. Component configs remain as historical evidence until component visual suites are rebuilt or intentionally discarded. |
| `visual-diff-scripts/` | Old generator/runner/server scripts operated the baseline/catalog/native-config workflow. Active validation now lives under `visual-diff/userland/scripts/`. |
| `generated-output/baseline/` | Historical baseline corpus and generated reports; not active source. |
| `generated-output/storybook-catalog/` | Historical Storybook catalog artifacts; not active source. |
| `generated-output/visual-comparisons/` | Old generated comparison reports and PNGs moved out of active paths. New runtime artifacts should still be generated under `prototype-design/visual-comparisons/cssvd-js/` and removed before commit unless requested. |
| `screenshots-and-imports/` | Old imported HTML, pasted screenshots, direct crops, and scratch images. |

## Regeneration/check commands

```bash
find prototype-design -path 'prototype-design/-deprecated' -prune -o -type f -print | sort
find prototype-design/visual-diff -maxdepth 4 -type f | sort
find prototype-design/-deprecated -maxdepth 3 -type d | sort
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```
