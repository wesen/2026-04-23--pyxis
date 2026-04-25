---
Title: Cleanup planning diary
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: reference
Intent: short-term
Summary: Chronological diary for prototype-design visual-diff cleanup and consolidation planning.
---

# Cleanup Planning Diary

## Step 1: Create ticket and write intern-facing guide

The user asked for a new docmgr ticket that plans a full cleanup and consolidation of `prototype-design`, visual comparison scripts, specs, and related workflow files. The requested deliverable was explicitly educational: a detailed analysis/design/implementation guide for a new intern, with prose, bullets, pseudocode, diagrams, API references, and file references.

### Prompt Context

**User prompt (verbatim):** "CCreate a new ticket to do a full cleanup and consolidation of prototype-design and scripts and all. 

reate a detailed analysis / design / implementation guide that is very detailed for a new intern, explaining all the parts of the system needed to understand what it is, with prose paragraphs and bullet point sand pseudocode and diagrams and api references and file
  references.
  It should be very clear and detailed. Store in the ticket and the nupload to remarkable."

**Assistant interpretation:** Create a dedicated cleanup ticket, write the guide into the ticket workspace, and upload it to reMarkable after validation.

**Inferred user intent:** Pause implementation churn and establish a clear, teachable foundation before doing a major cleanup/refactor.

### What I did

Created ticket:

```text
PYXIS-VISUAL-DIFF-CLEANUP
```

Ticket path:

```text
ttmp/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP--consolidate-prototype-design-visual-diff-workflows
```

Wrote the main guide:

```text
design/01-prototype-design-visual-diff-cleanup-analysis-design-implementation-guide.md
```

The guide explains:

- the current prototype-vs-Storybook visual comparison system,
- the role of `prototype-design/standalone/public`, `screens/ppxis.jsx`, Storybook stories, native CSSVD configs, promoted JS userland, suite specs, and generated artifacts,
- why selector/config duplication is the cleanup problem,
- the target architecture,
- the proposed `pyxis.visual-suite.v1` schema,
- API references for `compare-section`, `compare-page`, `compare-all`, `compare-spec`, `snapshot-section`, and `diff-snapshots`,
- a safe phased cleanup implementation plan,
- validation commands,
- Shows selector/composition reasoning,
- commit plan, risks, and definition of done.

I also replaced the placeholder task list with a concrete phased checklist.

### What I deliberately did not do

Before creating the guide I had started an implementation pass on Shows selectors. Since the user asked for a new planning ticket rather than immediate code cleanup, I reverted those uncommitted selector changes. The working tree should only contain the new ticket files at this stage.

### What should happen next

- Relate the important code/files to the guide or ticket with `docmgr doc relate`.
- Run `docmgr doctor` for the ticket.
- Dry-run the reMarkable upload.
- Upload the guide bundle to `/ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP`.
- Commit the ticket docs after successful upload or after recording upload status.


## Step 2: Upload guide bundle to reMarkable

I uploaded the cleanup planning bundle to reMarkable after a dry run.

### Dry run

```bash
remarquee upload bundle --dry-run \
  design/01-prototype-design-visual-diff-cleanup-analysis-design-implementation-guide.md \
  tasks.md \
  reference/01-diary.md \
  --name "PYXIS Visual Diff Cleanup Guide" \
  --remote-dir "/ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP" \
  --toc-depth 2
```

The dry run passed and showed the expected bundle contents.

### Upload

```bash
remarquee upload bundle \
  design/01-prototype-design-visual-diff-cleanup-analysis-design-implementation-guide.md \
  tasks.md \
  reference/01-diary.md \
  --name "PYXIS Visual Diff Cleanup Guide" \
  --remote-dir "/ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP" \
  --toc-depth 2
```

Upload result:

```text
OK: uploaded PYXIS Visual Diff Cleanup Guide.pdf -> /ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP
```

Verified remote listing:

```text
[f]	PYXIS Visual Diff Cleanup Guide
```


## Step 3: Revise plan to cut ties with native run configs

The user clarified that Pyxis does not need backwards compatibility with native `css-visual-diff run` configs. The project-specific JS API was developed specifically so Pyxis can express Pyxis-specific suite orchestration, policies, accepted differences, semantic snapshots, and diagnostics in code and suite specs.

### Prompt Context

**User prompt (verbatim):** "no backwards compatibility, we can cut ties. Update the cleanup document to take that into account, we should be doing project specific work, that's why the JS API was developed!"

**Assistant interpretation:** Strengthen the cleanup plan: do not preserve native `*.css-visual-diff.yml` configs as compatibility artifacts, and make the promoted JS userland plus suite specs the canonical Pyxis workflow.

**Inferred user intent:** Avoid a weak cleanup that keeps two parallel workflows alive. Remove the old native-run layer from active Pyxis usage.

### What I changed

Updated the main guide:

```text
design/01-prototype-design-visual-diff-cleanup-analysis-design-implementation-guide.md
```

to say:

- the JS userland workflow is canonical for Pyxis,
- native `css-visual-diff run` configs are retired,
- old native configs should be mined for useful data and removed from active paths,
- no native-config emitter or compatibility branch should be planned,
- future upstream repros can be created ad hoc in tickets if needed.

Updated `tasks.md` so Phase 5 is now native run-config removal, not compatibility classification.

### Why

Keeping native run configs as a permanent compatibility layer would preserve exactly the duplication the cleanup is supposed to eliminate. Pyxis needs a project-specific visual suite, not two parallel config systems.

### What should happen next

Begin the cleanup implementation with the strengthened rule: if Pyxis needs a comparison, it belongs in `*.visual.yml` and JS userland; if an old native config only exists for `css-visual-diff run`, migrate useful data out and remove it.


## Step 4: Upload revised JS-canonical guide

After revising the cleanup plan to remove native run-config backwards compatibility, I uploaded a second guide bundle to reMarkable.

Remote directory:

```text
/ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP
```

Uploaded document:

```text
PYXIS Visual Diff Cleanup Guide - JS Canonical
```

Remote listing now shows both the original planning guide and the revised JS-canonical guide. The revised one should be treated as current.


## Step 5: Add explicit JS userland cleanup section

The user asked whether the ticket already addressed cleanup of the JavaScript userland itself. It only did so indirectly, so I added a dedicated guide section and task phase.

### Prompt Context

**User prompt (verbatim):** "update"

**Assistant interpretation:** Update the cleanup guide to explicitly describe which promoted JS userland files, verbs, and scripts are core, transitional, or removable.

### What changed

Added a new section to the guide:

```text
Phase C: Simplify the JavaScript userland itself
```

It now lists:

- core files to keep,
- `registry.js` as a loader/normalizer refactor target,
- ergonomic verbs that may stay if spec-backed,
- transitional code to remove (`results.js`, `summarize-results`, `compare-section-command`, command builders),
- development-only scripts to remove or move to ticket history,
- operational scripts to keep/rename,
- desired final `userland/` shape,
- validation commands for the reduced JS userland.

Updated `tasks.md` with a new Phase 3 for JS userland simplification and renumbered later phases.


## Step 6: Upload JS userland cleanup revision

Uploaded the revised guide bundle with the explicit JS userland cleanup section.

Remote directory:

```text
/ai/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP
```

Uploaded document:

```text
PYXIS Visual Diff Cleanup Guide - JS Userland Cleanup
```

This is now the most current uploaded guide.


## Step 7: Implement cleanup Phases 1–3

This step moved the cleanup ticket from planning into implementation. I created a tracked inventory for `prototype-design`, formalized the visual suite spec shape, and simplified the promoted JavaScript userland so it no longer carries native-output readers, command-planner compatibility, or development-only smoke scripts.

The most important outcome is that the JS userland now reflects the cleanup decision: Pyxis uses project-specific visual suite specs and JavaScript verbs as the canonical workflow. Registry-backed ergonomic commands still exist, but their selector truth now comes from a CommonJS mirror of the visual suite spec rather than a hand-maintained `PUBLIC_PAGES` array.

### Prompt Context

**User prompt (verbatim):** "WOrk on docmgr ticket PYXIS-VISUAL-DIFF-CLEANUP Phase 1 - 3"

**Assistant interpretation:** Implement the first three cleanup phases in the docmgr ticket: inventory/classification, source-of-truth cleanup, and JS userland simplification.

**Inferred user intent:** Turn the revised plan into committed repo changes while keeping detailed diary records and committing at a coherent milestone.

**Commit (code):** `5373ea0` — "Consolidate visual diff JS userland"

### What I did

- Created a tracked Phase 1 inventory document:
  - `reference/02-prototype-design-visual-inventory.md`
- Classified current `prototype-design` filesystem paths as:
  - `canonical-source`
  - `retired-native`
  - `generated`
  - `generated-historical`
  - `needs-review`
- Marked native configs under `prototype-design/visual-diff/comparisons/**` and `prototype-design/visual-diff/public-components/**` as retired-native inputs.
- Marked `prototype-design/visual-comparisons/**` and `prototype-design/storybook-catalog/**` as generated output.
- Left `prototype-design/baseline/**` as generated-historical and deferred deletion to a separate targeted pass.
- Formalized the public-page visual suite schema in:
  - `prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml`
- Added v1 schema fields:
  - `schemaVersion: pyxis.visual-suite.v1`
  - `defaults`
  - `policy`
  - `acceptedDifferences`
  - `targets`
- Added a CommonJS spec mirror for Goja runtime ergonomic verbs:
  - `prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js`
- Added spec documentation:
  - `prototype-design/visual-diff/userland/specs/README.md`
- Rewrote `lib/registry.js` so it no longer owns hard-coded `PUBLIC_PAGES`; it now normalizes target data from the default visual suite mirror.
- Removed old native-output summary code:
  - deleted `prototype-design/visual-diff/userland/lib/results.js`
  - removed `results` from `lib/index.js`
  - removed the `pyxis pages summarize-results` verb
- Removed command-planner compatibility code:
  - removed `buildCompareRegionArgs(...)`
  - removed `argsToShellCommand(...)`
  - removed `planCompareSection(...)`
  - removed the `pyxis pages compare-section-command` verb
- Removed import/runtime proving code:
  - removed the `pyxis pages import-smoke` verb
  - removed old numbered transition scripts `02`, `03`, `05`, `06`, and `07`
- Moved stable operational scripts under:
  - `prototype-design/visual-diff/userland/scripts/`
- Rewrote `prototype-design/visual-diff/userland/README.md` around the JS-canonical workflow.
- Checked off Phases 1–3 in `tasks.md`.

### Why

The previous userland still contained code from multiple development stages. Some of that code proved imports, summarized native-run `pixeldiff.md` artifacts, or built shell commands for the built-in compare-region verb. Those paths no longer belong in promoted project infrastructure because direct `cvd.compare.region(...)` and spec-driven JS orchestration are now validated.

The registry rewrite matters because the old `PUBLIC_PAGES` array was a second source of truth beside `public-pages.desktop.visual.yml`. Keeping both would make future selector cleanup and page tuning error-prone.

### What worked

Validation commands succeeded:

```bash
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh >/tmp/pyxis-list-targets.json
# Result: 13 rows; first page shows; last section content

prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh >/tmp/pyxis-compare-spec-archive.json
# Result: pageCount=1, sectionCount=2, maxChangedPercent=7.128146453089244

prototype-design/visual-diff/userland/scripts/smoke-ci-policy-failure.sh
# Result: ci policy failure smoke passed

prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh >/tmp/pyxis-compare-spec-public-pages.json
# Result: pageCount=5, sectionCount=13, maxChangedPercent=66.85658212560386, classificationCounts={major-mismatch: 5, review: 2, tune-required: 6}
```

After validation I removed generated runtime artifacts again:

```bash
rm -rf prototype-design/visual-comparisons/cssvd-js
```

### What didn't work

One minor shell issue occurred while printing section labels:

```text
/bin/bash: line 1: printf: --: invalid option
printf: usage: printf [-v var] format [arguments]
```

Cause: `printf '--- status ---\n'` can be interpreted as options by Bash's printf in this environment. This was harmless and did not affect repo changes. Future shell snippets should use `printf '%s\n' '--- status ---'` or `echo`.

No css-visual-diff validation failures occurred.

### What I learned

The Goja verb runtime can consume the `objectFromFile` YAML object for explicit `compare-spec`, but library-level synchronous default loading is easier through a CommonJS module. The compromise is a generated JS mirror of the YAML spec for ergonomic registry-backed verbs. The YAML remains the reviewed source of truth.

The full public-page spec suite still reproduces the same expected first-pass numbers, which means the schema migration did not alter comparison semantics.

### What was tricky to build

The tricky part was removing duplicated selector truth without making every ergonomic command require an explicit spec argument. `compare-spec` already receives parsed YAML through `objectFromFile`, but `list-targets`, `compare-section`, `compare-page`, `compare-all`, `inspect-section`, and `snapshot-section` still need a default inventory. The short-term solution is `public-pages.desktop.visual.js`, a CommonJS mirror of the YAML spec.

This is acceptable for the current cleanup because it removes the hand-coded `PUBLIC_PAGES` registry from library code. The remaining risk is remembering to regenerate the JS mirror after YAML edits. That risk is documented in the README and specs README, and can be eliminated later with a small generator or by making all ergonomic verbs accept explicit specs.

### What warrants a second pair of eyes

- Confirm that tracking `public-pages.desktop.visual.js` as a mirror is acceptable, or decide to add a generator script in a follow-up.
- Review the v1 schema shape (`defaults`, `policy`, `acceptedDifferences`, `targets`) before more specs are added.
- Review whether registry-backed verbs should remain long-term or whether `compare-spec` should become the only canonical runner.
- Review the `needs-review` inventory paths before any deletion pass outside the userland cleanup.

### What should be done in the future

- Add a tiny generator/check script so `public-pages.desktop.visual.js` cannot drift from the YAML spec.
- Continue Phase 4 selector stabilization, especially replacing broad Shows prototype selectors.
- Start Phase 6 by mining retired native configs and deleting them from active paths after useful data is migrated.
- Update the broader bottom-up playbook now that userland scripts moved under `scripts/`.

### Code review instructions

Start with:

1. `prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml`
2. `prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js`
3. `prototype-design/visual-diff/userland/lib/registry.js`
4. `prototype-design/visual-diff/userland/verbs/pyxis-pages.js`
5. `prototype-design/visual-diff/userland/lib/compare-region.js`
6. `prototype-design/visual-diff/userland/scripts/`
7. `reference/02-prototype-design-visual-inventory.md`

Validate with:

```bash
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-ci-policy-failure.sh
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

### Technical details

Current suite count after migration:

```text
pageCount: 5
sectionCount: 13
maxChangedPercent: 66.85658212560386
classificationCounts: { major-mismatch: 5, review: 2, tune-required: 6 }
```

Inventory count after refresh:

```text
canonical-source: 84
retired-native: 77
generated: 2914
generated-historical: 3465
needs-review: 190
```


## Step 8: Final hygiene check after commit

After committing the Phase 1–3 implementation and diary update, I ran final hygiene checks. The repo remained clean, and the lightweight `list-targets` validation still returned the expected 13 section rows from the spec-backed registry.

### Prompt Context

**User prompt (verbatim):** (same as Step 7)

**Assistant interpretation:** Confirm the committed cleanup is still valid and record any final validation issue.

**Inferred user intent:** Leave the ticket in a clean, resumable state with exact validation notes.

**Commit (code):** `5373ea0` — "Consolidate visual diff JS userland"

**Commit (diary):** `9ef94d8` — "Diary: record visual diff cleanup phases"

### What I did

- Ran `docmgr doctor --ticket PYXIS-VISUAL-DIFF-CLEANUP --stale-after 30`.
- Re-ran `pyxis pages list-targets` and parsed the JSON via a temporary file.
- Checked `git status --short`.

### Why

This confirmed that the committed code still loaded in the css-visual-diff Goja runtime and that no generated artifacts or accidental edits were left behind.

### What worked

The corrected list-targets validation worked:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages list-targets --output json >/tmp/pyxis-final-list.json
python3 - <<'PY'
import json
rows=json.load(open('/tmp/pyxis-final-list.json'))
print({'rows': len(rows), 'first': rows[0]['page']+'/'+rows[0]['section'], 'last': rows[-1]['page']+'/'+rows[-1]['section']})
PY
```

Result:

```text
{'rows': 13, 'first': 'shows/page', 'last': 'about/content'}
```

### What didn't work

I first attempted to pipe JSON into a Python here-doc:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages list-targets --output json | python3 - <<'PY'
import sys,json
rows=json.load(sys.stdin)
print({'rows': len(rows), 'first': rows[0]['page']+'/'+rows[0]['section'], 'last': rows[-1]['page']+'/'+rows[-1]['section']})
PY
```

That failed because the here-doc supplies Python's stdin, so the piped JSON is not available to `json.load(sys.stdin)`. Exact error:

```text
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
```

The fix was to write the command output to `/tmp/pyxis-final-list.json` and read that file.

### What I learned

Do not combine a shell pipe with `python3 - <<'PY'` when the Python program also needs stdin data. Use a temporary file or `python3 -c`.

### What was tricky to build

N/A; this was a validation-shell issue, not an implementation issue.

### What warrants a second pair of eyes

N/A beyond the review items already listed in Step 7.

### What should be done in the future

Use file-based JSON parsing in diary/validation snippets when the Python code is embedded as a here-doc.

### Code review instructions

Use the validation commands from Step 7. The final lightweight check is:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland pyxis pages list-targets --output json >/tmp/pyxis-final-list.json
python3 -c 'import json; rows=json.load(open("/tmp/pyxis-final-list.json")); print(len(rows))'
```

### Technical details

`docmgr doctor` still reports only the known unknown-topic vocabulary warning for `automation`, `frontend`, `pyxis`, `storybook`, and `visual-diff`.


## Step 9: Delete retired public-page native configs

I started Phase 6 with the safest deletion set: the five page-level native `css-visual-diff run` configs. These had a direct replacement in the canonical JS visual suite spec and were no longer needed as active workflow inputs.

I intentionally did not delete `prototype-design/visual-diff/public-components/**` yet. Those files are retired-native under the new policy, but active baseline scripts and baseline manifests still reference them. They should be handled with the baseline/prototype-catalog cleanup rather than mixed into the page-suite deletion.

### Prompt Context

**User prompt (verbatim):** "ok, delete what you think is best, then commit, diary, and continue"

**Assistant interpretation:** Remove the low-risk obsolete files now, validate, record the decision in the diary, commit, then proceed to the next cleanup work.

**Inferred user intent:** Make concrete cleanup progress instead of only planning, while avoiding risky broad deletions.

**Commit (code):** `6bcbdb7` — "Remove retired public page visual configs"

### What I did

Deleted:

```text
prototype-design/visual-diff/comparisons/public-pages/about-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/book-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/show-detail-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
```

Updated:

```text
reference/02-prototype-design-visual-inventory.md
tasks.md
```

The inventory now counts `retired-native: 72` instead of `77` and notes that page-level native configs have been removed after migration to the JS visual suite spec.

### Why

These configs were the clearest safe deletion because every page and section they covered is represented in:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

Keeping them would preserve a second active public-page workflow, exactly what the cleanup plan says to avoid.

### What worked

The spec-backed public-page suite still runs after deletion:

```bash
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh >/tmp/pyxis-after-delete-public-page-configs.json
python3 - <<'PY'
import json
run=json.load(open('/tmp/pyxis-after-delete-public-page-configs.json'))[0]
print({'pageCount':run['pageCount'],'sectionCount':run['sectionCount'],'maxChangedPercent':run['maxChangedPercent'],'classificationCounts':run['classificationCounts']})
PY
rm -rf prototype-design/visual-comparisons/cssvd-js
```

Result:

```text
{'pageCount': 5, 'sectionCount': 13, 'maxChangedPercent': 66.85658212560386, 'classificationCounts': {'major-mismatch': 5, 'review': 2, 'tune-required': 6}}
```

### What didn't work

N/A. The deletion and validation were straightforward.

### What I learned

The page-level native configs are now genuinely unnecessary for current Pyxis workflow. Search still finds historical references in older ticket docs, but those are evidence of past work, not active source.

### What was tricky to build

The main judgment call was not deleting the older `visual-diff/public-components` configs in the same pass. Although they are also retired-native by policy, they still have live references from baseline scripts and baseline manifests. Deleting them now would force a broader baseline-catalog cleanup and risk mixing concerns.

### What warrants a second pair of eyes

- Confirm that historical ticket docs can keep references to removed native configs as historical evidence.
- Confirm whether the next deletion pass should target `visual-diff/public-components/**` together with `prototype-design/baseline/**` and related scripts.

### What should be done in the future

- Continue with Phase 4 selector stabilization.
- Later, delete or archive `visual-diff/public-components/**` as part of a baseline/prototype-catalog cleanup.
- Later, migrate or remove remaining component-system native configs under `visual-diff/comparisons/component-system/**`.

### Code review instructions

Review deleted paths and compare with the visual suite spec:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

Validate with:

```bash
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

### Technical details

The removed files are still referenced by older ticket documentation and previous exploratory scripts. Those references document historical workflows and were not updated in this deletion pass.


## Step 10: Stabilize public-page prototype selectors

After deleting the safest native configs, I continued into Phase 4 selector stabilization. The public prototype shell now exposes `data-page`, and the Shows prototype has section-level selectors for the header, show grid, and mailing-list CTA. The suite spec now compares prototype and React sections using matching stable selectors instead of broad `#root > *` crops.

This is intentionally selector/composition cleanup, not final CSS tuning. The residual diffs changed because the comparison windows are now more structurally equivalent, especially for Shows.

### Prompt Context

**User prompt (verbatim):** (same as Step 9)

**Assistant interpretation:** Continue after the safe deletion commit by implementing the next cleanup item: selector stabilization.

**Inferred user intent:** Keep progressing through the cleanup ticket toward a better foundation for later visual tuning.

**Commit (code):** `8a985a9` — "Stabilize public page visual selectors"

### What I did

Updated:

```text
prototype-design/screens/ppxis.jsx
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js
tasks.md
```

Specific prototype changes:

- Added `data-page={cur === "detail" ? "show-detail" : cur}` to the public prototype shell `<main>`.
- Wrapped the Shows page header with `data-section="shows-header"`.
- Wrapped the Shows grid with `data-section="shows-list"`.
- Added a prototype mailing-list CTA section with `data-section="mailing-list"` and `data-pyxis-component="mailing-list-cta"` parts so the React mailing-list comparison has a real prototype counterpart.

Specific spec changes:

- Shows `content` now compares `[data-page='shows']` to `[data-page='shows']`.
- Shows `header`, `shows-list`, and `mailing-list` now compare matching `[data-section=...]` selectors.
- Show detail, Archive, Book, and About `content` sections now compare matching `[data-page=...]` selectors on both sides.
- Page-level comparison still uses prototype `#root` versus Storybook frame, because that is the outer whole-page crop.

### Why

The old Shows selectors compared broad prototype regions like `#root > *` against section-specific React selectors. That inflated section-level diffs and made later CSS tuning misleading. Stable selectors let the visual diff answer the intended question: how close is this section to its counterpart?

### What worked

`list-targets` now shows stable selectors for Shows:

```text
content      [data-page='shows']          -> [data-page='shows']
header       [data-section='shows-header'] -> [data-section='shows-header']
shows-list   [data-section='shows-list']   -> [data-section='shows-list']
mailing-list [data-section='mailing-list'] -> [data-section='mailing-list']
```

Shows semantic diagnostics now run with the new section scopes:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
```

Result:

```text
header       styleDiffs=7 yDelta=-40 heightDelta=102.5
shows-list   styleDiffs=7 yDelta=44.5 heightDelta=-476.359375
mailing-list styleDiffs=7 yDelta=-407.859375 heightDelta=8.5
content      styleDiffs=8 yDelta=0 heightDelta=-327.359375
```

Archive spec smoke also still runs after `content` selector stabilization:

```text
pageCount=1
sectionCount=2
maxChangedPercent=7.2125872435568175
content selector: [data-page='archive'] -> [data-page='archive']
page selector: #root -> [data-story-frame='pyxis-page-shell']
```

### What didn't work

N/A. The scripts ran successfully.

### What I learned

Changing from broad prototype selectors to stable section selectors can change the measured diff even before CSS tuning. That is expected and desirable: the numbers now describe the intended section crops rather than unrelated page chrome or full-content spans.

### What was tricky to build

The tricky part was the Shows mailing-list section. React already had a mailing-list section, while the prototype Shows page did not have an equivalent page-level CTA. I added a small prototype CTA using the same text and `data-pyxis-component`/`data-pyxis-part` contract as the React component. This moves the comparison from "missing prototype counterpart" to "real section with styling differences to tune later."

### What warrants a second pair of eyes

- Confirm that adding the prototype mailing-list CTA is acceptable as prototype composition stabilization rather than overfitting to React.
- Review whether page-level `#root` should eventually become a more explicit prototype frame selector, or whether it is fine for whole-page comparisons.
- Review the changed Archive content diff baseline; it moved from ~7.128% to ~7.213% because the selector crop changed to `[data-page='archive']`.

### What should be done in the future

- Re-run the full spec suite and update baselineDiffs in the visual spec once selector stabilization is accepted.
- Tune Shows CSS/composition using the now-stable section diagnostics.
- Continue with native config removal for component-system/public-component configs in a separate pass.

### Code review instructions

Start with:

```text
prototype-design/screens/ppxis.jsx
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
```

Validate with:

```bash
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

### Technical details

The JS spec mirror was regenerated manually after YAML edits. This reinforces the follow-up need for a generator/check to prevent drift.


## Step 11: Refresh post-selector baselines and add spec mirror generator

After selector stabilization, I ran the full public-page spec suite again and updated the suite baselines to match the new, more precise selector scopes. I also added a small mirror-refresh script so the CommonJS runtime spec can be regenerated from the YAML source instead of edited by hand.

This step closes the drift risk identified during Phases 1–3: the YAML spec remains the reviewed source of truth, while the JS mirror is now generated by an explicit script.

### Prompt Context

**User prompt (verbatim):** "continue"

**Assistant interpretation:** Continue the cleanup workflow after deleting retired public-page configs and stabilizing selectors.

**Inferred user intent:** Keep moving through the next practical cleanup items, committing coherent milestones and keeping the diary detailed.

**Commit (code):** `0c142fe` — "Refresh visual suite baselines"

### What I did

Updated:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/specs/README.md
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
tasks.md
```

Added:

```text
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

The script reads `specs/*.visual.yml` and writes the matching `.visual.js` CommonJS mirror for registry-backed ergonomic verbs.

Updated the public-page suite `baselineDiffs` after selector stabilization. New measured values:

```text
shows/page          46.3495
shows/content       52.4196
shows/header         7.2648
shows/shows-list    66.0368
shows/mailing-list   9.9766
show-detail/page    18.5282
show-detail/content 30.0792
archive/page         6.6511
archive/content      7.2126
book/page           12.1006
book/content        16.9306
about/page          18.2795
about/content       20.5467
```

### Why

The old baselines were measured before stable prototype selectors existed. After changing content/section selectors, the numbers needed to be refreshed so future reports compare against the current crop semantics.

The mirror generator reduces a known maintenance risk. `compare-spec` can use YAML via `objectFromFile`, but registry-backed commands need a synchronous JS object in Goja. A generated mirror is safer than hand-editing.

### What worked

Full suite after selector stabilization:

```text
pageCount: 5
sectionCount: 13
maxChangedPercent: 66.03678642230044
classificationCounts: { major-mismatch: 4, review: 4, tune-required: 5 }
```

Mirror refresh and list-targets validation:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh >/tmp/list-after-refresh.json
```

Result:

```text
{'rows': 13, 'shows_header_baseline': 7.2648}
```

### What didn't work

N/A. The generator and smoke validation worked.

### What I learned

The selector stabilization improved the policy distribution even though Shows remains the largest mismatch. In particular, header and mailing-list are now review-band rather than inflated major mismatches. Shows content still includes the entire page content and remains high, which is a real composition/tuning target.

### What was tricky to build

The generator uses PyYAML, which is available in this environment. If this script is promoted into CI, we should either ensure PyYAML is installed or replace it with a Node-based generator using an explicit workspace dependency.

### What warrants a second pair of eyes

- Review whether `baselineDiffs` should be rounded to four decimals, as done here, or stored with full precision.
- Review whether PyYAML is acceptable for local tooling or whether a Node script would fit the repo better.

### What should be done in the future

- Add a CI/check mode for `refresh-spec-mirrors.py` so mirror drift fails fast.
- Tune Shows using the new stable selector diagnostics.
- Continue native config cleanup for component-system configs after deciding whether to create component visual suite specs.

### Code review instructions

Start with:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
```

Validate with:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

### Technical details

The full-suite run was written to `/tmp/pyxis-public-suite-after-selector.json`; generated cssvd artifacts were removed afterward.


## Step 12: Update parity playbook for JS-canonical page workflow

I updated the bottom-up visual parity playbook so it no longer instructs developers to use native `css-visual-diff run --config-dir` as the public-page workflow. Component native configs are now described as retired historical inputs to mine during cleanup, while page-level public-site validation points to the promoted JS visual suite scripts.

This aligns the general playbook with the cleanup ticket's implementation state: public pages are spec-driven and JS-canonical, and new Pyxis work should not add native `*.css-visual-diff.yml` configs.

### Prompt Context

**User prompt (verbatim):** (same as Step 11)

**Assistant interpretation:** Continue cleanup by updating docs that still described the old/native validation flow.

**Inferred user intent:** Keep consolidating the workflow so future developers follow the JS suite path rather than resurrecting native config-dir runs.

**Commit (code/docs):** pending at diary-write time — intended message: "Update visual parity playbook for JS suite"

### What I did

Updated:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
tasks.md
```

The playbook now says:

- Run React typechecks first for component batches.
- Treat `prototype-design/visual-diff/comparisons/component-system/**` as retired inputs, useful only when intentionally mining historical evidence.
- Do not create new native `*.css-visual-diff.yml` configs for Pyxis work.
- Use the JS-canonical page suite for public-site validation:

```bash
prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

- Use Shows semantic diagnostics before tuning large page diffs:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
rm -rf prototype-design/visual-comparisons/cssvd-js
```

I also checked off the Phase 5 docs/script-cleanup tasks because the script reorganization, userland README, specs README, and playbook updates are now done.

### Why

Without this playbook update, a future developer could follow stale docs and reintroduce native config-dir workflows after the cleanup intentionally removed them from public-page work.

### What worked

A search confirmed the playbook no longer contains old numbered userland script paths or `run --config-dir` instructions as validation guidance. Remaining mentions are historical/wishlist context only.

### What didn't work

N/A. This was a docs-only update.

### What I learned

The playbook still contains older component-level `css-visual-diff screenshot`, `css-md`, and single-config examples. I left those alone because component-system migration is not finished; this update specifically prevents native config-dir from being presented as the public-page workflow.

### What was tricky to build

The nuance was not over-editing component-level historical guidance. Public pages are already JS-canonical. Component-system configs remain retired-native but not yet fully migrated into component visual suite specs, so the playbook should warn against adding new native configs without pretending all component examples have already been replaced.

### What warrants a second pair of eyes

- Decide whether component-system examples should be rewritten to use new component visual suite specs once those specs exist.
- Decide whether the tooling wishlist should be moved to a separate historical note now that JS `compare-spec` summary reporting exists.

### What should be done in the future

- Migrate component-system parity examples to spec-driven JS suites if component parity remains an active workflow.
- Continue native config cleanup for remaining retired component configs.

### Code review instructions

Review:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
ttmp/2026/04/25/PYXIS-VISUAL-DIFF-CLEANUP--consolidate-prototype-design-visual-diff-workflows/tasks.md
```

Validate docs intent with:

```bash
rg "config-dir|visual-diff/userland/[0-9]" docs/playbooks/05-bottom-up-component-visual-parity.md
```

### Technical details

No generated artifacts were produced.
