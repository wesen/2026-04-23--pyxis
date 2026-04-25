# Pyxis visual suite specs

This directory contains project-specific visual suite specs for the promoted Pyxis `css-visual-diff` JavaScript userland.

## Canonical spec

```text
public-pages.desktop.visual.yml
```

This YAML file is the reviewed source of truth for the desktop public-page visual suite.

## Runtime mirror

```text
public-pages.desktop.visual.js
```

This CommonJS file mirrors the YAML spec for registry-backed ergonomic verbs that need synchronous access to the default suite in the Goja runtime.

Do not edit the JS mirror by hand unless you are also updating the YAML source. Prefer regenerating it from the YAML after spec edits.

## Schema

Current schema version:

```text
pyxis.visual-suite.v1
```

Top-level fields:

```text
schemaVersion        required; currently pyxis.visual-suite.v1
name                 suite name, e.g. public-pages
defaults             shared defaults for targets
policy               project policy metadata for review/CI reporting
acceptedDifferences  suite-level accepted-difference metadata
targets              ordered page targets
```

`defaults` fields:

```text
variant        default variant, e.g. desktop
prototypeBase  base URL for standalone prototype pages
storybookBase  base URL for Storybook iframe pages
viewport       browser viewport for comparisons
waitMs         default post-navigation wait
threshold      pixel threshold used by compare.region
inspect        collection profile: minimal, rich, or debug
```

Each page target contains:

```text
page            stable page slug
variant         page variant, usually desktop
priority        tuning priority label
prototypePath   path relative to prototypeBase
storyId         Storybook story id
baselineDiffs   last known first-pass changed-percent values
sections        section comparisons
```

Each section contains:

```text
name            stable section id
original        prototype selector
react           React/Storybook selector
```

Future additions should prefer project-specific fields such as policy, accepted differences, semantic snapshot presets, and role metadata over native `css-visual-diff run` config shape.
