# Pyxis css-visual-diff JavaScript userland

This directory contains the promoted Pyxis JavaScript workflow layer for `css-visual-diff`.

It started as the `PYXIS-CSSVD-JS-LIB` ticket prototype and now holds reusable project infrastructure for comparing standalone prototype pages against Storybook-rendered React pages.

## Layout

```text
prototype-design/visual-diff/userland/
  lib/                  # reusable JS modules
  verbs/                # repository-scanned css-visual-diff verbs
  *.sh                  # smoke/run scripts
```

Generated artifacts should be written under:

```text
prototype-design/visual-comparisons/cssvd-js/
```

Do not treat generated comparison artifacts as source unless a review explicitly asks for them to be committed.

## Repository-scanned verbs

Use the userland directory as the repository root so local imports resolve correctly:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages list-targets \
  --output json
```

Available verbs include:

```text
pyxis pages list-targets
pyxis pages import-smoke
pyxis pages summarize-results
pyxis pages inspect-section
pyxis pages compare-section-command
pyxis pages compare-section
pyxis pages compare-page
pyxis pages compare-all
pyxis pages compare-spec
pyxis pages snapshot-section
```

## Common commands

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

Run the desktop public-page suite from the built-in JS registry:

```bash
prototype-design/visual-diff/userland/11-run-compare-all-public-pages.sh
```

Run the Archive subset from the YAML visual spec via `objectFromFile`:

```bash
prototype-design/visual-diff/userland/13-smoke-compare-spec-archive-filter.sh
```

Run the CI policy failure smoke:

```bash
prototype-design/visual-diff/userland/12-smoke-compare-all-ci-policy-fail.sh
```

Write a semantic snapshot/diff for one section:

```bash
prototype-design/visual-diff/userland/15-smoke-snapshot-section-archive-content.sh
```

## Policy modes

`compare-all` supports two modes:

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
  pyxis pages compare-all \
  --page archive \
  --mode ci \
  --maxChangedPercent 10 \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-all/archive-ci \
  --output json
```

## Spec-driven suites

`compare-spec` uses css-visual-diff's `objectFromFile` field support. The verb receives the parsed JSON/YAML object, not a filename string.

The first promoted spec lives at:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

Example:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page archive \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-spec/archive-filter \
  --output json
```

## Next cleanup

The built-in target registry still lives in `lib/registry.js` for compatibility with existing commands. Future cleanup can make the YAML spec the primary source of truth and keep `registry.js` as a loader/compatibility adapter.
