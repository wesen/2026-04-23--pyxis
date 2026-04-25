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

**Commit (code):** `e24ca46` — "Remove retired public page visual configs"

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
