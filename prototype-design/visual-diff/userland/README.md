# Pyxis css-visual-diff JavaScript userland

This directory contains the promoted Pyxis project-specific workflow layer for `css-visual-diff`.

It compares standalone prototype pages against Storybook-rendered React pages through the JavaScript API (`cvd.compare.region`, catalogs, policies, and semantic snapshots). The JS userland and `specs/*.visual.yml` files are the canonical Pyxis workflow; native `css-visual-diff run` configs are retired and should not be maintained as a parallel path.

## Layout

```text
prototype-design/visual-diff/userland/
  lib/                  # reusable JS modules for comparison, policy, snapshots, and spec normalization
  specs/                # project-specific visual suite specs
  verbs/                # repository-scanned css-visual-diff verbs
  scripts/              # stable smoke/run scripts
```

Generated artifacts should be written under:

```text
prototype-design/visual-comparisons/cssvd-js/
```

Do not treat generated comparison artifacts as source unless a review explicitly asks for them to be committed.

## Source of truth

The reviewed public-page suite spec is:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

`specs/public-pages.desktop.visual.js` is a CommonJS mirror used by registry-backed ergonomic verbs in the Goja runtime. Keep the YAML spec as the reviewed source of truth and regenerate the JS mirror after spec edits:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

## Repository-scanned verbs

Use the userland directory as the repository root so local imports resolve correctly:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages list-targets \
  --output json
```

Available verbs:

```text
pyxis pages list-targets
pyxis pages inspect-section
pyxis pages compare-section
pyxis pages compare-page
pyxis pages compare-all
pyxis pages compare-spec
pyxis pages snapshot-section
pyxis pages diff-snapshots
```

Removed transition verbs:

```text
pyxis pages import-smoke
pyxis pages summarize-results
pyxis pages compare-section-command
```

Those verbs were only needed while proving repository imports, reading old native-run artifacts, or building shell-command plans before direct `cvd.compare.region(...)` was available.

## Common commands

Run the canonical Archive spec smoke:

```bash
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
```

Run the canonical desktop public-page suite from the YAML visual spec:

```bash
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
```

Run the registry-backed full public-page suite smoke. This uses the JS mirror of the YAML spec:

```bash
prototype-design/visual-diff/userland/scripts/run-compare-all-public-pages.sh
```

Run the CI policy failure smoke:

```bash
prototype-design/visual-diff/userland/scripts/smoke-ci-policy-failure.sh
```

Write a semantic snapshot/diff for one section:

```bash
prototype-design/visual-diff/userland/scripts/smoke-snapshot-section-archive.sh
```

Diff two semantic snapshots:

```bash
prototype-design/visual-diff/userland/scripts/smoke-diff-snapshots-archive.sh
```

Capture Shows diagnostic snapshots for the largest residual page diffs:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
```

## Direct examples

Compare one section:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-section archive content \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-section/archive-content \
  --output json
```

Compare one page and write a catalog:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-page archive \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-page/archive \
  --output json
```

Run a spec subset via `objectFromFile`:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page archive \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-spec/archive-filter \
  --output json
```

## Policy modes

`compare-all` and `compare-spec` support two modes:

```text
authoring  write reports and return normally
ci         write reports, then fail if policy thresholds are exceeded
```

Policy options:

```text
--maxChangedPercent <number>      0 disables this threshold
--maxPolicyBand <band>            accepted, review, tune-required, major-mismatch
```

Example:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page archive \
  --mode ci \
  --maxChangedPercent 10 \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-spec/archive-ci \
  --output json
```

## Cleanup policy

Do not add new native `*.css-visual-diff.yml` configs for Pyxis. If Pyxis needs a comparison, add it to a project-specific visual suite spec and run it through this JS userland.

Transition scripts and old-output readers should live in ticket history, not in this promoted directory.
