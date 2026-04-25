# Changelog

- Created docmgr ticket `PYXIS-CSSVD-JS-WORKFLOW` for exploring `css-visual-diff` JavaScript scripting as a replacement/supplement for the current YAML visual parity workflow.
- Read `css-visual-diff help pixel-accuracy-scripting-guide` and related help pages: `javascript-api`, `javascript-verbs`, and `inspect-workflow`.
- Added `scripts/01-capture-cssvd-js-help.sh` and captured 1,417 lines of css-visual-diff help text under `sources/css-visual-diff-help/`.
- Added `scripts/02-smoke-cssvd-js-verb.js` and confirmed ticket-local repository-scanned JS verbs work with `css-visual-diff verbs --repository ... pyxis workflow summarize-targets --output json`.
- Added `scripts/03-run-built-in-compare-region-smoke.sh` and successfully reproduced the Archive content page diff without YAML using `verbs script compare region`; result matched the YAML content diff at `7.1281%`.
- Recorded an invocation failure where shell redirection targeted a directory before the script created it; fixed by creating the directory before redirecting stdout.
- Wrote `design/01-css-visual-diff-javascript-workflow-experiment-guide.md`, including a detailed experiment plan and proposed migration workflow.
- Wrote `reference/01-exploration-diary.md` with chronological experiment logs and exact commands/failures.
- Wrote `reference/02-copious-research-notes-for-technical-deep-dive.md` with blog-post narrative hooks, API notes, and evidence paths.

## 2026-04-25

Initial css-visual-diff JavaScript workflow exploration: captured docs, proved ticket-local JS verbs, reproduced Archive content diff with built-in compare-region, and wrote experiment guide/diary/research notes.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/design/01-css-visual-diff-javascript-workflow-experiment-guide.md — Primary experiment guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/01-exploration-diary.md — Detailed chronological experiment log
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/reference/02-copious-research-notes-for-technical-deep-dive.md — Blog-post research notes


- Added JS API wishlist research notes after initial Pyxis experiments, covering first-class pixel compare APIs, multi-section runners, YAML interop helpers, result summarizers, tolerances, CSS normalization, policy helpers, and blog-post-oriented reporting.

- Added a follow-up note classifying JS API wishlist items into userland-buildable workflow helpers, awkward-but-possible wrappers, and genuinely core/API-exposure needs. Conclusion: most can be prototyped in JS; the main missing core primitive is a JS-callable pixel comparison function.
