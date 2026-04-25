# Changelog

- Created docmgr ticket `PYXIS-CSSVD-JS-LIB` for later implementation of the Pyxis css-visual-diff JavaScript userland library.
- Added `design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md` with architecture, module plan, command plan, phases, validation checklist, and open questions.
- Added `design/02-css-visual-diff-maintainer-feature-requests.md` with prioritized upstream requests, explanations, and usage examples.
- Added `reference/01-implementation-diary.md` with setup context and future implementation guidance.
- Expanded `tasks.md` into phased implementation tasks from library skeleton through promotion decision.
- Updated `index.md` with key links, status, recommended first implementation step, and reMarkable upload target.

## 2026-04-25

Created implementation planning ticket with userland library guide, maintainer feature requests, tasks, diary seed, and scripts README.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/design/01-pyxis-css-visual-diff-javascript-userland-library-implementation-guide.md — Implementation guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/design/02-css-visual-diff-maintainer-feature-requests.md — Maintainer requests
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/tasks.md — Phased tasks


- Uploaded ticket bundle to reMarkable as `PYXIS css-visual-diff JS Userland Library Plan` under `/ai/2026/04/25/PYXIS-CSSVD-JS-LIB` after a successful dry run, and verified the upload with `remarquee cloud ls`.

- Uploaded the whole current ticket bundle to reMarkable as `PYXIS css-visual-diff JS Userland Library Current Ticket` under `/ai/2026/04/25/PYXIS-CSSVD-JS-LIB` before starting implementation.
- Completed Phase 1 library skeleton and registry: added slug/storybook/artifact/registry modules, `pyxis pages list-targets`, `pyxis pages import-smoke`, and smoke scripts validating relative imports and target registry output.
- Completed Phase 2 existing result summarizer: added result parsing, policy classification, Markdown report generation, `pyxis pages summarize-results`, and a smoke script that produces 13 sorted public-page diff rows from existing `pixeldiff.md` artifacts.
- Completed Phase 3 locator-first inspect command: added style presets, browser/locator inspection helper, `pyxis pages inspect-section`, and an Archive content smoke test with two visible sides.
- Started Phase 4 compare bridge investigation: added compare-region command planner, `pyxis pages compare-section-command`, smoke output for Archive content, and documented that `child_process` is unavailable in the current css-visual-diff Goja runtime.
- Uploaded post-implementation progress docs bundle and source bundle to reMarkable; verified `Current Ticket`, `Plan`, `Progress`, and `Source` documents under `/ai/2026/04/25/PYXIS-CSSVD-JS-LIB`.
- Evaluated the newer flexible css-visual-diff JavaScript API, captured updated docs, replaced the command-planner-only compare bridge with direct `cvd.compare.region(...)`, validated Archive content at `7.128146453089244%`, and wrote `reference/02-flexible-javascript-api-evaluation-report.md`.

## 2026-04-25

Evaluated new flexible css-visual-diff JS API, updated compare-section to use cvd.compare.region directly, validated Archive content parity, and wrote the technical evaluation report.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/reference/02-flexible-javascript-api-evaluation-report.md — Technical evaluation report
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/08-smoke-new-api-compare-section.sh — Validation smoke script
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/scripts/lib/compare-region.js — cvd.compare.region implementation

- Uploaded `PYXIS css-visual-diff Flexible JS API Evaluation` and `PYXIS css-visual-diff Flexible JS API Experiment Source` to reMarkable under `/ai/2026/04/25/PYXIS-CSSVD-JS-LIB` and verified both documents.
- Added clean maintainer follow-up request document `design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md`, containing only remaining desired features after `cvd.compare.region(...)` satisfied the original core request.

## 2026-04-25

Created clean maintainer follow-up request document containing only current desired css-visual-diff features after the flexible JS API landed.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-LIB--implement-pyxis-css-visual-diff-javascript-userland-library/design/03-clean-css-visual-diff-maintainer-follow-up-requests-after-flexible-js-api.md — Clean current maintainer request document

- Updated Pyxis compare-section to use newly landed `locator.waitFor(...)` and stable `comparison.artifacts.write(...)` paths; rewrote the clean maintainer request document to remove landed beta ergonomics requests and keep only remaining deferred/policy-oriented asks.
- Implemented `pyxis pages compare-page <page>` using `cvd.compare.region(...)` across registered sections and `cvd.catalog.create(...).record(...)`; added Archive page smoke producing two section comparisons plus catalog manifest/index.
