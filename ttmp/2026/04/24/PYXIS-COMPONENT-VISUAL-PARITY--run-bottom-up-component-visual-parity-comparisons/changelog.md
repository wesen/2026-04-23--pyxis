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


## 2026-04-24

Completed remaining AtomDiffFixture atom comparisons for Avatar, Icon, IconButton, and Textarea. Extended both prototype and Storybook atom fixtures for Textarea, fixed React Textarea CSS, and reached 0% pixel diff for all added atom configs.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated accepted remaining atom entries
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/AtomDiffFixture.stories.tsx — Added Textarea fixture row
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/atoms/Textarea/Textarea.css — Aligned Textarea sizing and typography to prototype


## 2026-04-24

Updated the implementation guide with final atom sweep results and moved next recommendation to molecule comparisons plus promoting the atom fixture prepare script to canonical prototype-design scripts.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/analysis/01-bottom-up-prototype-to-storybook-visual-parity-implementation-guide.md — Atom sweep results and next molecule recommendations


## 2026-04-24

Wrote end-of-week postmortem and next-developer handoff covering completed atom parity workflow, problems, lessons, current process, documentation consolidation recommendation, next steps, and tooling improvement ideas.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Postmortem and handoff document


## 2026-04-24

Expanded the postmortem into a textbook-style handoff chapter with conceptual foundations, validated workflow, atom sweep evidence, lessons, documentation consolidation plan, next-day quick start, and tooling improvement recommendations.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Expanded textbook-style postmortem handoff


## 2026-04-24

Attempted reMarkable upload of the expanded postmortem. Local PDF generation succeeded, but remarquee/rmapi upload failed with HTTP 400 even for a tiny test PDF; this is recorded as a tooling/environment issue to retry later.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Upload failure recorded
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Document intended for reMarkable upload


## 2026-04-24

Switched the parity workflow guidance from static Storybook builds served by Python to a live Storybook dev server in tmux; explained the parity map; promoted atom fixture script to a canonical path; added the first molecule fixture/config for Card default; ran the comparison successfully with 0.0000% pixel diff; wrote the canonical bottom-up parity playbook.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Canonical daily workflow playbook
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js — Canonical atom prototype fixture prepare script
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js — New molecule prototype fixture prepare script
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx — New Storybook molecule fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml — First molecule comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Updated parity map with accepted Card default result
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 8 diary entry
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/02-postmortem-and-next-developer-handoff.md — Updated handoff guidance


## 2026-04-24

Completed the recommended first molecule batch after Card by adding Field default, Field error, Stat default, and Empty with CTA fixture states/configs; repaired React Field, Stat, and Empty visual drift; all four new molecule comparisons now report 0.0000% pixel diff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js — Added Field, Stat, and Empty fixture states
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/MoleculeDiffFixture.stories.tsx — Added matching Storybook molecule states
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/field-default.css-visual-diff.yml — Field default comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/field-error.css-visual-diff.yml — Field error comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/stat-default.css-visual-diff.yml — Stat default comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/molecules/empty-cta.css-visual-diff.yml — Empty with CTA comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Field/Field.tsx — Aligned Field label/message spacing and typography with prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Stat/Stat.tsx — Aligned Stat typography, spacing, shadow, and part attributes with prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Empty/Empty.tsx — Aligned Empty state icon, spacing, typography, and action layout with prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded accepted molecule results and accepted CSS differences
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated known-good molecule list
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 9 diary entry


## 2026-04-24

Committed the completed atom/molecule workflow as `731c88571405cca9749d78639bd66623002a05b4`, then started the organism layer with TopBar default. Added prototype and Storybook organism fixtures, added the TopBar comparison config, aligned React TopBar typography/spacing/parts to the prototype, and reached 0.0000% pixel diff.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js — New organism prototype fixture prepare script
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx — New Storybook organism fixture
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml — TopBar organism comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/TopBar/TopBar.tsx — Aligned TopBar with prototype and added stable part selectors
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded accepted TopBar organism result
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated known-good organism list
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 10 diary entry


## 2026-04-24

Wrote a detailed maintainer-facing report on `css-visual-diff llm-review` based on Pyxis TopBar experiments with GLM-5V, GPT-5 Nano, and GPT-5 Mini. The report documents evidence mismatch, prepared HTML pitfalls, CSS over-indexing, triptych misinterpretation, prompt-control gaps, and recommended tool improvements.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/03-css-visual-diff-llm-review-maintainer-report.md — Maintainer report for future `llm-review` improvements
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 11 diary entry


## 2026-04-24

Continued the main organism parity workflow with Modal default. Added prototype and Storybook Modal fixture states plus a Modal comparison config, aligned React Modal panel/header/body/footer styling toward the prototype, and recorded the result as needs-review: header/body are pixel-perfect, panel/footer still have localized residual diffs.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js — Added Modal default fixture state
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/OrganismDiffFixture.stories.tsx — Added matching Modal default Storybook state
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml — Modal organism comparison config
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/organisms/Modal/Modal.tsx — Aligned Modal dimensions, backdrop, panel, header, body, footer styling toward prototype
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/comparisons/component-system/component-parity-map.json — Recorded Modal default as needs-review
- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Updated organism status list with Modal follow-up state
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/01-diary.md — Detailed Step 12 diary entry

