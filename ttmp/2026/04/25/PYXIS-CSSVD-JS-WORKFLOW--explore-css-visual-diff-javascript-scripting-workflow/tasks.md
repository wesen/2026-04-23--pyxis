# Tasks

## Phase 0 — Ticket setup and source capture

- [x] Read `css-visual-diff help pixel-accuracy-scripting-guide`.
- [x] Read related help pages: `javascript-api`, `javascript-verbs`, `inspect-workflow`.
- [x] Create docmgr ticket `PYXIS-CSSVD-JS-WORKFLOW`.
- [x] Create scripts directory and store all exploratory scripts there.
- [x] Capture help docs into `sources/css-visual-diff-help/`.
- [x] Create design guide for planned experiments.
- [x] Create detailed diary.
- [x] Create copious research notes for later technical deep dive blog post.

## Phase 1 — Smoke-test JavaScript verb infrastructure

- [x] Add script `01-capture-cssvd-js-help.sh`.
- [x] Add script `02-smoke-cssvd-js-verb.js`.
- [x] Run `css-visual-diff verbs --repository ... pyxis workflow summarize-targets --output json`.
- [x] Record command output and lessons.

## Phase 2 — YAML-free built-in region comparison smoke

- [x] Add script `03-run-built-in-compare-region-smoke.sh`.
- [x] Run Archive content comparison without YAML.
- [x] Record redirection failure and fix.
- [x] Confirm output artifacts were written.
- [x] Compare Archive result to existing YAML result.

## Phase 3 — YAML interop report

- [ ] Add script `04-report-public-page-yaml-results.js`.
- [ ] Load current public page YAML configs with `cvd.loadConfig`.
- [ ] Summarize page/section pixel diffs into JSON and Markdown.
- [ ] Replace manual Phase 7 table copy/paste with script output.

## Phase 4 — Pyxis public page registry DSL

- [ ] Add script `05-pyxis-public-page-registry.js`.
- [ ] Model prototype/storybook base URLs once.
- [ ] Model desktop and mobile viewport variants.
- [ ] Model page sections from `data-page` / `data-section` selectors.
- [ ] Generate/list comparable targets from the registry.

## Phase 5 — Locator-first inspect-section command

- [ ] Add script `06-inspect-public-page-section.js`.
- [ ] Inspect existence/visibility/bounds/text/styles for one page section.
- [ ] Add authoring vs fail-on-missing behavior.
- [ ] Use Shows page as first real tuning target.

## Phase 6 — Probe/snapshot semantic diffs

- [ ] Add script `07-snapshot-public-page-contracts.js`.
- [ ] Define narrow probes for page shell/header/content/component contracts.
- [ ] Diff prototype vs React snapshots.
- [ ] Add ignore paths for expected responsive offsets.
- [ ] Write JSON and Markdown reports.

## Phase 7 — Catalog workflow

- [ ] Add script `08-build-public-page-catalog.js`.
- [ ] Use `cvd.catalog()` and `page.inspectAll()` to write review artifacts.
- [ ] Generate `manifest.json` and `index.md`.
- [ ] Decide whether catalog replaces or supplements `prototype-design/visual-comparisons`.

## Phase 8 — Mobile and threshold policy

- [ ] Add script `09-generate-mobile-page-checks.js`.
- [ ] Add script `10-evaluate-page-threshold-policy.js`.
- [ ] Propose policy bands for accepted/review/tune/fail.
- [ ] Apply policy to current page diff numbers.

## Phase 9 — Blog-post synthesis

- [ ] Convert diary and research notes into a technical deep dive outline.
- [ ] Extract command snippets and artifact examples.
- [ ] Identify screenshots/artifacts to include.
- [ ] Write recommendations for stable project-level adoption.
