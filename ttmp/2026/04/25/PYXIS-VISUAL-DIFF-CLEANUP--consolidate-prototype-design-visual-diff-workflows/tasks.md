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
Summary: Task checklist for consolidating prototype-design visual-diff workflows.
---

# Tasks

## Phase 0 — Planning and handoff

- [x] Create docmgr ticket workspace.
- [x] Write intern-facing analysis/design/implementation guide.
- [x] Relate key source files to the guide/ticket.
- [x] Upload guide to reMarkable.

## Phase 1 — Inventory and classification

- [ ] Produce tracked inventory of `prototype-design` visual assets, configs, scripts, and generated outputs.
- [ ] Classify paths as canonical-source, compatibility, generated, historical, or obsolete.
- [ ] Decide which generated/historical paths under `prototype-design/baseline` should remain tracked.

## Phase 2 — Source-of-truth cleanup

- [ ] Formalize `*.visual.yml` schema with `schemaVersion`, `defaults`, `targets`, `policy`, and `acceptedDifferences`.
- [ ] Decide loader strategy for default ergonomic verbs.
- [ ] Stop maintaining hard-coded selector truth in `lib/registry.js` or mark it as compatibility only.
- [ ] Keep `compare-spec` as the canonical explicit suite runner.

## Phase 3 — Selector stabilization

- [ ] Add stable `data-page` / `data-section` selectors to public prototypes where missing.
- [ ] Update visual suite spec selectors to use stable selectors.
- [ ] Validate Shows semantic diagnostics before and after selector changes.
- [ ] Update native compatibility configs if they remain hand-maintained.

## Phase 4 — Script and docs cleanup

- [ ] Rename/reorganize promoted userland scripts into stable non-ticket-era names.
- [ ] Update `prototype-design/visual-diff/userland/README.md`.
- [ ] Add `prototype-design/visual-diff/userland/specs/README.md`.
- [ ] Update `docs/playbooks/05-bottom-up-component-visual-parity.md`.

## Phase 5 — Legacy config policy

- [ ] Classify `prototype-design/visual-diff/comparisons/**` as compatibility/native-run configs or generated outputs.
- [ ] Decide whether to generate native css-visual-diff configs from the visual suite spec.
- [ ] Move or annotate legacy configs so they do not compete with the canonical suite spec.

## Phase 6 — Final validation and handoff

- [ ] Run promoted smoke suite.
- [ ] Run full spec suite.
- [ ] Ensure generated artifacts are not committed.
- [ ] Write final postmortem/reference report.
- [ ] Commit cleanup in safe chunks.
