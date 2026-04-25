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
