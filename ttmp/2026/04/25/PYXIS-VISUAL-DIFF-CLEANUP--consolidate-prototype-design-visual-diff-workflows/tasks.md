---
Title: Tasks
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: tasks
Intent: short-term
Summary: Task checklist for consolidating prototype-design visual-diff workflows around project-specific JS userland with no native run-config compatibility requirement.
---

# Tasks

## Phase 0 — Planning and handoff

- [x] Create docmgr ticket workspace.
- [x] Write intern-facing analysis/design/implementation guide.
- [x] Relate key source files to the guide/ticket.
- [x] Upload guide to reMarkable.
- [x] Revise guide to make JS userland the canonical workflow and remove backwards-compatibility requirements for native `css-visual-diff run` configs.

## Phase 1 — Inventory and classification

- [x] Produce tracked inventory of `prototype-design` visual assets, configs, scripts, and generated outputs.
- [x] Classify paths as canonical-source, retired-native, generated, generated-historical, or needs-review.
- [x] Decide which generated/historical paths under `prototype-design/baseline` should remain tracked for now: defer deletion to a separate targeted baseline-corpus pass.

## Phase 2 — Source-of-truth cleanup

- [x] Formalize `*.visual.yml` schema with `schemaVersion`, `defaults`, `targets`, `policy`, and `acceptedDifferences`.
- [x] Keep `compare-spec` and project-specific JS userland as the canonical suite runner.
- [x] Stop maintaining hard-coded selector truth in `lib/registry.js`; convert it into a loader/normalizer backed by the visual suite mirror.
- [x] Do not add or maintain new native `*.css-visual-diff.yml` configs.

## Phase 3 — JS userland simplification

- [x] Remove old native-output summary code (`lib/results.js`, `summarize-results`).
- [x] Remove command-planner compatibility code (`compare-section-command`, `planCompareSection`, shell command builders).
- [x] Remove import/runtime proving scripts from promoted userland.
- [x] Rewire ergonomic verbs to the default visual suite spec or remove them in favor of `compare-spec`.
- [x] Move stable operational scripts under `userland/scripts/` with descriptive names.
- [x] Validate the reduced JS userland smoke suite.

## Phase 4 — Selector stabilization

- [x] Add stable `data-page` / `data-section` selectors to public prototypes where missing.
- [x] Update visual suite spec selectors to use stable selectors.
- [x] Validate Shows semantic diagnostics before and after selector changes.
- [x] Refresh public-page `baselineDiffs` after selector stabilization.
- [x] Add a spec-mirror refresh script to prevent YAML/CommonJS drift.
- [ ] Remove or archive native configs after useful selector data is migrated into the visual suite spec.

## Phase 5 — Script and docs cleanup

- [x] Rename/reorganize promoted userland scripts into stable non-ticket-era names.
- [x] Update `prototype-design/visual-diff/userland/README.md`.
- [x] Add `prototype-design/visual-diff/userland/specs/README.md`.
- [x] Update `docs/playbooks/05-bottom-up-component-visual-parity.md` to remove native `css-visual-diff run` as the Pyxis page workflow.

## Phase 6 — Native run-config removal

- [x] Mine public-page configs under `prototype-design/visual-diff/comparisons/public-pages/**`; useful data is represented in `userland/specs/public-pages.desktop.visual.yml`.
- [ ] Mine remaining component-system configs under `prototype-design/visual-diff/comparisons/component-system/**` for useful data missing from suite specs.
- [x] Delete public-page native run configs from active workflow paths after migration.
- [ ] Delete remaining native run configs from active workflow paths after migration.
- [ ] Record removed paths and rationale in the cleanup diary/postmortem.

## Phase 7 — Final validation and handoff

- [ ] Run promoted smoke suite.
- [ ] Run full spec suite.
- [ ] Ensure generated artifacts are not committed.
- [ ] Write final postmortem/reference report.
- [ ] Commit cleanup in safe chunks.
