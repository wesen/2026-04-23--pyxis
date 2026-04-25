# Deprecated prototype-design artifacts

This folder is a quarantine area for historical prototype/design visual-diff material that no longer serves the active Pyxis workflow.

Active work should use:

```text
prototype-design/screens/
prototype-design/lib/
prototype-design/standalone/
prototype-design/visual-diff/scripts/fixtures/
prototype-design/visual-diff/userland/
```

Do not add new workflow code or new visual-diff configs here.

## Contents

```text
visual-diff-native-configs/  old native css-visual-diff YAML config trees
visual-diff-scripts/         old baseline/catalog generator and runner scripts
screenshots-and-imports/     old pasted/imported HTML and PNG scratch artifacts
generated-output/            old generated baseline, catalog, and comparison outputs
```

## Policy

- Treat this directory as historical evidence only.
- If useful selectors or metadata are found here, migrate them into `prototype-design/visual-diff/userland/specs/*.visual.yml` or focused docs.
- Do not run deprecated scripts as part of normal validation.
- Do not create new native `*.css-visual-diff.yml` configs for Pyxis work.
- Large ignored generated-output subtrees may exist locally but should not be treated as source.
