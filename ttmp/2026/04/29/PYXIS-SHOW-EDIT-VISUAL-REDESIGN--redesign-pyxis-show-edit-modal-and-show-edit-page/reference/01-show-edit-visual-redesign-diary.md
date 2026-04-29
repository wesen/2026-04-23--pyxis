---
Title: Show edit visual redesign diary
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
    - pyxis
    - staff-app
    - design-system
    - react
    - storybook
DocType: reference
Intent: long-term
Owners: []
RelatedFiles: []
ExternalSources: []
Summary: "Chronological diary for the Pyxis show edit modal/page visual redesign planning ticket."
LastUpdated: 2026-04-29T18:40:00-04:00
WhatFor: "Use this to continue the implementation later with context about what was analyzed, what was decided, and what evidence exists."
WhenToUse: "Before implementing or reviewing the show edit modal/page visual redesign."
---

# Show edit visual redesign diary

## Initial request

The user asked to create a new ticket for updating the look and functionality of the show edit modal and show edit page. They provided two PNG references:

- `~/Downloads/show-admin.png`
- `~/Downloads/show-modal.png`

They asked for a very detailed analysis/design/implementation guide suitable for a new intern, with prose, bullet points, pseudocode, diagrams, API references, and file references. They also asked to store the guide in the ticket and upload it to reMarkable.

## Step 1: Read the relevant workflow skill

I loaded the `ticket-research-docmgr-remarkable` skill and its writing/checklist references:

```text
/home/manuel/.pi/agent/skills/ticket-research-docmgr-remarkable/SKILL.md
/home/manuel/.pi/agent/skills/ticket-research-docmgr-remarkable/references/writing-style.md
/home/manuel/.pi/agent/skills/ticket-research-docmgr-remarkable/references/deliverable-checklist.md
```

The workflow requires ticket creation, evidence gathering, a comprehensive design document, diary/bookkeeping updates, `docmgr doctor`, a reMarkable dry-run, a real upload, and remote listing verification.

## Step 2: Create ticket workspace

Command:

```bash
docmgr ticket create-ticket --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --title "Redesign Pyxis show edit modal and show edit page" --topics pyxis,staff-app,visual-design,react,storybook,docmgr
```

Result:

```text
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Path: ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page
```

Then I added the primary design doc and diary:

```bash
docmgr doc add --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --doc-type design-doc --title "Show edit modal and page visual redesign implementation guide"
docmgr doc add --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --doc-type reference --title "Show edit visual redesign diary"
```

## Step 3: Copy PNG references into the ticket

Command:

```bash
mkdir -p ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/01-reference-pngs
cp /home/manuel/Downloads/show-admin.png ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/01-reference-pngs/show-admin-reference.png
cp /home/manuel/Downloads/show-modal.png ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/sources/01-reference-pngs/show-modal-reference.png
```

This follows the PNG workflow rule: never work from transient clipboard/download paths as the only source of record.

## Step 4: Analyze PNG references and current code

I used image understanding to inspect both references and wrote a concise source document:

```text
sources/04-reference-png-analysis.md
```

I also gathered repository evidence:

```bash
rg --files web/packages/pyxis-app/src | rg 'NewShowModal|ShowDetailPage|ShowDetail|FlyerField|Panel|StatusPill|StatusBadge|NoteBlock|MetadataStrip|ShowTableRow|parts|appApi|mockData|stories|CalendarAgenda'
rg -n "export \\{|Button|Modal|Input|Select|Textarea|Field|Card|Badge|Tag" web/packages/pyxis-components/src/index.ts web/packages/pyxis-components/src -g 'index.ts'
rg -n "useGetShow|useUpdateShow|useCreateShow|useUploadShowFlyer|showToProto|protoToDomainShow|reserveTicketEnabled|Lineup" web/packages/pyxis-app/src/api/appApi.ts pkg/server/app.go pkg/server/public.go proto/pyxis/v1/show.proto
```

Saved to:

```text
sources/02-code-evidence-inventory.txt
```

Then I captured line-anchored excerpts from key files:

```bash
nl -ba web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
nl -ba web/packages/pyxis-app/src/pages/ShowDetailPage/Page.tsx
nl -ba web/packages/pyxis-app/src/components/organisms/FlyerField/FlyerField.tsx
nl -ba web/packages/pyxis-app/src/api/appApi.ts
nl -ba proto/pyxis/v1/show.proto
```

Saved to:

```text
sources/03-line-anchored-code-excerpts.txt
```

## Step 5: Important process correction

Before this ticket, the user explicitly pointed out that the implementation plan must start from component decomposition, not just image-to-CSS tuning. I confirmed the repo has runbooks for this:

```text
docs/playbooks/07-react-application-decomposition-and-component-reuse.md
docs/playbooks/06-react-widget-folder-storybook-css-organization.md
docs/playbooks/05-bottom-up-component-visual-parity.md
docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
```

The design guide therefore centers the implementation around pages, organisms, molecules, atoms, and shared primitives.

## Step 6: Write the implementation guide

I replaced the generated design-doc stub with a detailed guide:

```text
design-doc/01-show-edit-modal-and-page-visual-redesign-implementation-guide.md
```

The guide includes:

- executive summary;
- problem statement and scope;
- current-state architecture;
- repository/data-flow explanation;
- component decomposition;
- page/organism/molecule/atom responsibilities;
- API and persistence notes;
- pseudocode for create/update/flyer flows;
- ASCII diagrams;
- phased implementation plan;
- testing strategy;
- risks and mitigations;
- alternatives considered;
- file reference map;
- intern checklist.

## What worked

- `docmgr ticket create-ticket` created the expected workspace.
- The PNG references copied cleanly into `sources/01-reference-pngs/`.
- The existing codebase already has many reusable pieces: `NewShowModal`, `FlyerField`, `Panel`, `StatusPill`, `NoteBlock`, `MetadataStrip`, RTK Query hooks, and generated protobuf types.
- The existing data model already supports the fields in the references, so the visual redesign should not require a backend migration.

## What did not work / caveats

- No implementation code was changed in this ticket. This is an analysis/design/delivery ticket.
- Some visual actions in the PNGs may not have existing real behavior yet: `Duplicate`, flyer delete, `Open post`, and cancel-show semantics need explicit product/API decisions before active buttons are shipped.
- The final implementation should first capture current screenshots; this was documented as a future implementation-prep task, not performed here.

## What was tricky

The key tricky part is scope control. The edit page reference looks like a fully inline editing surface, while Pyxis currently has a modal-based editing flow that already handles important backend constraints like confirmed-with-flyer. The guide recommends keeping page data/mutation orchestration in the page and introducing structured organisms/molecules first, before deciding whether full inline editing is necessary.

## Code review instructions for future implementation

When implementation begins, reviewers should check:

1. Did the implementer decompose components before heavy CSS tuning?
2. Did pages keep RTK Query hooks and pass props down?
3. Did organisms/molecules avoid direct route-level fetching?
4. Did new components own their CSS/stories/index files?
5. Did the redesign preserve confirmed-with-flyer and reserve-ticket semantics?
6. Did inactive reference actions remain disabled/omitted unless backed by real behavior?
7. Did the implementation include Storybook stories and screenshot evidence?

## Validation and delivery evidence

To be completed after this doc is validated and uploaded:

```bash
docmgr doctor --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --stale-after 30
remarquee upload bundle --dry-run ...
remarquee upload bundle ...
remarquee cloud ls /ai/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN --long --non-interactive
```

## Step 7: Validate ticket and upload to reMarkable

I fixed initial `docmgr doctor` findings before upload:

- Replaced unknown topics `visual-design`/`docmgr` with known vocabulary topic `design-system` and existing topics.
- Added frontmatter to `sources/04-reference-png-analysis.md` because docmgr validates Markdown files inside the ticket.
- Removed note-less related files from the ticket index and kept detailed related-file notes on the primary design document.

Validation command:

```bash
docmgr doctor --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --stale-after 30
```

Result:

```text
✅ All checks passed
```

reMarkable preflight:

```bash
remarquee status
remarquee cloud account --non-interactive
```

Result:

```text
remarquee: ok
user=wesen@ruinwesen.com sync_version=1.5
```

Dry-run upload:

```bash
remarquee upload bundle --dry-run \
  index.md \
  design-doc/01-show-edit-modal-and-page-visual-redesign-implementation-guide.md \
  reference/01-show-edit-visual-redesign-diary.md \
  tasks.md \
  changelog.md \
  sources/04-reference-png-analysis.md \
  --name "PYXIS-SHOW-EDIT-VISUAL-REDESIGN guide" \
  --remote-dir "/ai/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN" \
  --toc-depth 2
```

Real upload result:

```text
OK: uploaded PYXIS-SHOW-EDIT-VISUAL-REDESIGN guide.pdf -> /ai/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN
```

Verification listing:

```bash
remarquee cloud ls /ai/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN --long --non-interactive
```

Result:

```text
[f]	PYXIS-SHOW-EDIT-VISUAL-REDESIGN guide
```


## Step 8: Add widget reuse/deprecation audit

The user asked whether the planning work had actually studied which widgets already exist for reuse and which should be deprecated after the redesign. The first guide contained an initial reuse map, but it did not yet have a dedicated deprecation audit.

I added:

```text
sources/06-widget-reuse-and-deprecation-audit.md
```

The audit identifies direct reuse candidates (`Button`, `Modal`, `StatusPill`, `NoteBlock`, `Panel`, `FlyerField`, etc.), likely new show-edit-specific widgets (`ShowEditHeader`, `ShowEditRail`, `ShowFlyerCard`, `ShowFormSection`, `ShowLineupRowEditor`), and likely deprecation/replacement candidates (`ShowDetailHero`, `ShowDetailInfoPanel`, older page-owned show detail styles, and some broad legacy CSS buckets).

I also updated the primary design guide to reference this audit and marked task `T203` complete.

## Step 9: Expand implementation tasks into storybook-first phases

The user asked to continue from documentation into implementation, following the runbooks: storybook first, component folders that match the existing structure, good widget-owned CSS, and a detailed diary.

I expanded the task plan so the coding work is split into reviewable phases:

1. Storybook-first modal component decomposition.
2. Modal visual polish and evidence.
3. Storybook-first show edit page decomposition.
4. Show edit page visual polish and evidence.

This deliberately separates component extraction from visual retuning so regressions are easier to isolate.


## Step 10: Implement Phase 3 modal decomposition

I started implementation with the Storybook-first modal component decomposition phase, following the runbook's widget-folder pattern.

Created new molecule folders:

```text
web/packages/pyxis-app/src/components/molecules/ShowFormSection/
web/packages/pyxis-app/src/components/molecules/ShowLineupRowEditor/
web/packages/pyxis-app/src/components/molecules/FlyerDropzone/
```

Each folder contains:

```text
Component.tsx
Component.css
Component.stories.tsx
index.ts
```

Implementation details:

- `ShowFormSection` owns modal section rhythm: uppercase heading, optional description, optional action, body slot, and stable `appPart()` selectors.
- `ShowLineupRowEditor` owns a single editable lineup row with artist, role, start time, end time, and remove action. It has desktop, two-column, and single-column responsive behavior.
- `FlyerDropzone` owns the visual dropzone treatment while keeping a real file input for keyboard/browser accessibility.
- `NewShowModal` now composes those molecules instead of owning all row/section markup directly. Its external props contract remains unchanged.

Validation commands:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

Both passed.

What was tricky:

- Story fixtures using `create(ShowSchema, { ...confirmedShow, lineup: [...] })` failed because spreading an existing protobuf message into a new `create()` call turned nested lineup entries into already-created message values while the replacement literals were checked against full `Show_LineupEntry` message types. I fixed this by splitting the shared plain fixture data into `confirmedShowData` and passing plain objects to each `create()` call.

Next step:

- Commit Phase 3 modal decomposition, then proceed to Phase 4 visual evidence/capture and interaction smoke.


## Step 11: Capture Phase 4 modal visual evidence and smoke

I restarted Storybook on port 6008 after an existing stale Storybook process returned an indexing error for old paths:

```text
Unable to index files:
- ./src/components/organisms/ShowDetailDiscordPanel/ShowDetailDiscordPanel.stories.tsx: ENOENT
- ./src/components/shell/AppShell.stories.tsx: ENOENT
```

A fresh Storybook process successfully indexed 310 stories and included the new story IDs for:

- `FlyerDropzone`
- `ShowFormSection`
- `ShowLineupRowEditor`
- `NewShowModal`

I added capture script:

```text
scripts/01-capture-new-show-modal-stories.js
```

First run failed because `[data-pyxis-component="new-show-modal"]` matched both the modal root and the form part. I fixed the selector to target:

```text
[data-pyxis-component="new-show-modal"][data-pyxis-part="root"]
```

Then the capture passed and wrote screenshots to:

```text
sources/08-modal-storybook-captures/
```

Captured states:

- `new-show-modal-create-default.png`
- `new-show-modal-edit-existing-with-flyer.png`
- `new-show-modal-confirmed-needs-flyer.png`
- `new-show-modal-mobile.png`

I inspected `new-show-modal-create-default.png` with the image-capable read tool. It shows the intended sectioned structure: Basics, Date & Time, Details, Lineup, Additional Info, Flyer, and footer actions.

I also added interaction smoke script:

```text
scripts/02-smoke-new-show-modal-story.js
```

It verifies that clicking `Create show` on the empty modal shows the required artist validation, then fills an artist and clicks `Save draft`. Smoke output was saved to:

```text
sources/09-modal-storybook-smoke.txt
```
