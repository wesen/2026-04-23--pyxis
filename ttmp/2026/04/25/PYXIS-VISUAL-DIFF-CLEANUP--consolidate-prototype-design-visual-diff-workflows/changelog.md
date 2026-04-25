---
Title: Changelog
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: changelog
Intent: short-term
Summary: Changelog for the prototype-design visual-diff cleanup ticket.
---

# Changelog

- Created cleanup/consolidation ticket for `prototype-design`, visual-diff scripts, specs, native configs, and generated-artifact policy.
- Added intern-facing analysis/design/implementation guide at `design/01-prototype-design-visual-diff-cleanup-analysis-design-implementation-guide.md`.
- Added concrete phased task checklist and planning diary.
- Uploaded guide bundle to reMarkable at `/ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP` as `PYXIS Visual Diff Cleanup Guide`.
- Revised cleanup guide and task list to make project-specific JS userland the canonical workflow and remove backwards-compatibility requirements for native `css-visual-diff run` configs.
- Uploaded revised JS-canonical cleanup guide bundle to reMarkable as `PYXIS Visual Diff Cleanup Guide - JS Canonical`.
- Added explicit JS userland cleanup section to guide and tasks, covering keep/rewire/remove decisions for transitional modules, verbs, and scripts.
- Uploaded updated JS-userland-cleanup guide bundle to reMarkable as `PYXIS Visual Diff Cleanup Guide - JS Userland Cleanup`.
- Implemented cleanup Phases 1–3: added prototype-design inventory, formalized visual suite schema, rewired registry to spec mirror, removed JS transition scaffolding, moved stable scripts under `userland/scripts/`, and validated list/Archive/full-suite smokes.
- Committed Phases 1–3 cleanup as `5373ea0` (`Consolidate visual diff JS userland`).
- Recorded final hygiene validation note after Phase 1–3 cleanup; list-targets returned 13 rows and docmgr only reported the known topic-vocabulary warning.
- Deleted five retired public-page native `css-visual-diff run` configs after validating the spec-backed public-page suite still produces 5 pages / 13 sections.
- Committed public-page native config deletion.
- Stabilized public prototype selectors by adding `data-page` to the shell, Shows section selectors, a prototype mailing-list CTA counterpart, and matching visual-suite selectors; validated Shows diagnostics and Archive spec smoke.
- Committed public-page selector stabilization.
- Refreshed public-page visual suite baselines after selector stabilization and added `scripts/refresh-spec-mirrors.py` to regenerate CommonJS mirrors from YAML specs.
- Committed refreshed selector-stabilized baselines and spec mirror generator.
- Updated bottom-up visual parity playbook to point public-page validation at JS visual suite scripts and mark native component config directories as retired inputs.
- Committed visual parity playbook JS-suite update.
- Created `prototype-design/-deprecated/` quarantine, moved old native configs/scripts/generated outputs/screenshots/imports out of active paths, updated inventory/tasks, and validated JS visual suite.
- Committed deprecated prototype-design quarantine.
- Marked old baseline/storybook/component-native playbooks as deprecated and rewrote their moved artifact paths to `prototype-design/-deprecated/...`.
- Committed deprecated playbook/path-reference updates.
- Added final cleanup postmortem/handoff and related it to key active/quarantine files.
- Committed final cleanup postmortem/handoff.
- Added detailed cleanup postmortem to close the visual-diff cleanup chapter and frame the next proper visual-diff tuning phase.
