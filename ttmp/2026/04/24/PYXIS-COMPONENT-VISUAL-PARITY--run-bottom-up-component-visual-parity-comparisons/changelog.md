# Changelog

## 2026-04-24

- Initial workspace created


## 2026-04-24

Created bottom-up visual parity implementation guide covering baseline extraction, matching Storybook stories, css-visual-diff comparison modes, optional LLM review, repair loop, manifests, and first atom batches.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md — Primary analysis and implementation guide


## 2026-04-24

Iteration 1: added first atom parity map and Button primary comparison config; inspected both sides and ran capture/cssdiff/matched-styles/pixeldiff/html-report successfully with 0% pixel diff; noted output.dir relative-path pitfall.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/.gitignore — Ignore generated comparison outputs
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml — First runnable atom comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Initial hand-curated atom parity map


## 2026-04-24

Iteration 2: added Badge confirmed comparison, ran full deterministic modes, got 0% pixel diff, adjusted CSS prop list to avoid harmless auto-size width/height differences, and updated the guide with validated workflow corrections.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml — Second atom comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated accepted Button and Badge parity statuses
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md — Updated validated workflow notes


## 2026-04-24

Promoted atom comparison workflow to Tag default, Input search, and Select status. Tag and Select were already pixel-perfect; Input used visual/CSS diff feedback to align React sizing and icon markup with the prototype, reaching 0% pixel diff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/04-storybook-component-capture-playbook.md — Playbook updated with validated comparison workflow notes
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/Input/Input.css — Input sizing and icon positioning aligned to prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/Input/Input.tsx — Input icon now uses a wrapper like the prototype

