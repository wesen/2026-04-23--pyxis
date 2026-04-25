# Tasks

## Phase 0 — Ticket setup and handoff docs

- [x] Create docmgr ticket `PYXIS-CSSVD-JS-LIB`.
- [x] Add implementation guide.
- [x] Add maintainer feature-request document.
- [x] Add implementation diary.
- [x] Update ticket index/changelog.
- [ ] Review and refine implementation guide before starting code.
- [x] Dry-run reMarkable bundle upload.
- [x] Upload ticket bundle to reMarkable.
- [x] Verify upload exists on reMarkable.
- [x] Upload whole current ticket bundle to reMarkable before implementation.
- [x] Verify current ticket bundle exists on reMarkable.
- [x] Upload implementation progress docs bundle to reMarkable.
- [x] Upload implementation source bundle to reMarkable.
- [x] Verify progress/source uploads exist on reMarkable.
- [x] Capture newer flexible JavaScript API docs with `scripts/07-capture-new-flexible-js-api-docs.sh`.
- [x] Store new API experiment scripts in the ticket `scripts/` folder.

## Phase 1 — Library skeleton and registry

- [x] Create `scripts/lib/slug.js`.
- [x] Create `scripts/lib/storybook.js`.
- [x] Create `scripts/lib/artifacts.js`.
- [x] Create `scripts/lib/registry.js`.
- [x] Create `scripts/verbs/pyxis-pages.js`.
- [x] Implement `pyxis pages list-targets`.
- [x] Add smoke script `scripts/01-smoke-list-targets.sh`.
- [x] Validate list-targets with `css-visual-diff verbs --repository ... pyxis pages list-targets --output json`.
- [x] Add import-mechanism smoke verb `pyxis pages import-smoke`.
- [x] Add smoke script `scripts/02-smoke-import-mechanism.sh`.
- [x] Validate relative imports use `--repository <ticket>/scripts` rather than `scripts/verbs`.
- [x] Record results in diary.

## Phase 2 — Existing result summarizer

- [x] Create `scripts/lib/results.js`.
- [x] Create `scripts/lib/policies.js`.
- [x] Create `scripts/lib/markdown.js`.
- [x] Parse `pixeldiff.md` tables from `prototype-design/visual-comparisons/public-pages`.
- [ ] Parse built-in `compare.json` output shape. (Deferred to Phase 4 compare bridge.)
- [x] Normalize result rows with page, variant, section, changed percent, artifact paths, and source.
- [x] Implement threshold classification bands: accepted, review, tune-required, major-mismatch.
- [x] Implement `pyxis pages summarize-results`.
- [x] Add smoke script `scripts/03-smoke-summarize-existing-page-results.sh`.
- [x] Generate JSON and Markdown summary under `various/`.
- [x] Confirm generated summary reproduces the previous Phase 7 page-diff report.
- [x] Record results in diary.

## Phase 3 — Locator-first inspect command

- [x] Create `scripts/lib/styles.js` with typography/layout/surface/spacing presets.
- [x] Create `scripts/lib/inspect.js` using `cvd.browser()`, `browser.page()`, and locators.
- [x] Implement page/section selector lookup from registry.
- [x] Implement `pyxis pages inspect-section <page> <section>`.
- [x] Support `--side original|react|both`.
- [x] Support `--stylePreset typography|layout|surface|spacing|pageShell`.
- [x] Support `--failOnMissing`.
- [x] Add smoke script `scripts/04-smoke-inspect-section.sh`.
- [x] Validate with Archive content.
- [ ] Validate with Shows header before using it for Shows tuning.
- [x] Record results in diary.

## Phase 4 — Pixel compare-section bridge

- [x] Create `scripts/lib/compare-region.js` for command planning.
- [x] Confirm `child_process` is unavailable in css-visual-diff Goja verbs.
- [x] Implement `pyxis pages compare-section-command <page> <section>` as a command-plan bridge.
- [x] Add smoke script `scripts/05-smoke-compare-section-command.sh`.
- [x] Add diagnostic script `scripts/06-smoke-child-process-unavailable.sh`.
- [x] Replace `child_process` bridge plan with direct `cvd.compare.region(...)` implementation.
- [x] Create output directories before direct `cvd.compare.region(...)` artifact writes.
- [x] Read/validate generated `compare.json` from `comparison.artifacts.write(...)`.
- [x] Wrap generated Markdown with docmgr-compatible frontmatter when output lives under `ttmp`.
- [x] Implement `pyxis pages compare-section <page> <section>` using `cvd.compare.region(...)`.
- [x] Add smoke script `scripts/08-smoke-new-api-compare-section.sh`.
- [x] Validate Archive content result is exactly `7.128146453089244%` / `102172` changed pixels.
- [x] Record results in diary.

## Phase 5 — Page and suite orchestration

- [ ] Implement `pyxis pages compare-page <page>`.
- [ ] Implement `pyxis pages compare-all`.
- [ ] Support `--mode authoring|ci`.
- [ ] Support `--maxChangedPercent` or policy band failure thresholds.
- [ ] Generate aggregate JSON report.
- [ ] Generate aggregate Markdown report.
- [ ] Add smoke script `scripts/05-smoke-compare-page.sh`.
- [ ] Add smoke script `scripts/06-smoke-compare-all.sh`.
- [ ] Validate all current desktop page sections run from registry.
- [ ] Record results in diary.

## Phase 6 — Snapshot and semantic diff tooling

- [ ] Create `scripts/lib/normalizers.js`.
- [ ] Create `scripts/lib/tolerances.js`.
- [ ] Implement userland color/zero/font-family normalization.
- [ ] Implement userland numeric tolerance filtering for bounds.
- [ ] Implement `pyxis pages snapshot-section <page> <section>`.
- [ ] Implement optional `pyxis pages diff-snapshots`.
- [ ] Write JSON and Markdown semantic reports.
- [ ] Validate with Shows header or Archive content.
- [ ] Record results in diary.

## Phase 7 — Accepted differences and maintainer feedback loop

- [ ] Add accepted-difference metadata support to registry or sidecar JSON.
- [ ] Include accepted differences in Markdown reports.
- [x] Revisit maintainer feature-request document after flexible JS API implementation experience.
- [x] Mark core pixel compare request as satisfied by `cvd.compare.region(...)`.
- [ ] Prepare upstream issue text or discussion notes.

## Phase 8 — Promotion decision

- [ ] Decide whether stable code should move to `prototype-design/visual-diff/verbs`, `prototype-design/visual-diff/js-lib`, or `tools/cssvd-pyxis`.
- [ ] If promoted, move stable scripts out of ticket workspace.
- [ ] Update docs/playbooks with new command workflow.
- [ ] Add final validation commands.
- [ ] Create final postmortem/reference report.
- [ ] Optionally upload final implementation bundle to reMarkable.
