---
Title: Visual tuning diary
Ticket: PYXIS-PUBLIC-PAGE-VISUAL-TUNING
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
DocType: reference
Intent: diary
Summary: Chronological diary for public-page visual diffing and tuning using the JS-canonical Pyxis visual suite.
---

# Visual Tuning Diary

## Step 1: Open the proper visual-diffing chapter

The cleanup chapter is closed enough to begin actual visual tuning. The user explicitly asked to keep a detailed diary, commit at appropriate intervals, and move experiments into an `experiments/` folder so the active setup stays clean.

### Prompt Context

**User prompt (verbatim):** "alright, let's do the visual diffing/tuning, keep a detailed diary, commit at appropriate intervals. Write everything down so we can do a proper brilliant playbook. If you need to experiment with scripts, make sure to properly cleanup by moving them to a experiments/ folder so that we keep a clean setup."

**Follow-up prompt:** "continue"

**Assistant interpretation:** Start a new visual tuning ticket and begin with disciplined measurement, not blind CSS edits.

**Inferred user intent:** Use the freshly-cleaned JS visual suite for real page parity work, record enough detail to later write a strong repeatable playbook, and avoid polluting active workflow directories with one-off experiments.

### Plan

1. Create a focused tuning ticket.
2. Capture the current baseline and diagnostics.
3. Start with Shows, because it currently has the largest residual diff.
4. Inspect images and semantic diagnostics before editing CSS.
5. Commit coherent milestones: ticket setup, each tuning batch, diary updates.
6. Place one-off scripts under this ticket's `experiments/` folder and promote only stable scripts.

### Current known baseline

From the cleanup postmortem:

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

### First target

Shows page, especially:

```text
shows/header
shows/shows-list
shows/mailing-list
shows/content
```

### Notes for the future playbook

A good tuning loop should be measurement-first:

```bash
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
# inspect semantic and image output
# edit CSS/composition
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

The key rule: do not tune against a number until the compared selectors have been validated as semantically equivalent.


## Step 2: Inspect Shows images separately instead of the triptych

The user pointed out that the combined left/right/diff triptych makes analysis harder, especially when the pixel diff count is high. I switched to reading the separate `left_region.png` and `right_region.png` files for Shows header, list, and mailing list. This immediately made the actual problem clearer.

### Prompt Context

**User prompt (verbatim):** "ok, analyze the 3 images by reading them separately, that should give you better insight into what is going on. In fact you probably only need the first 2 when the pixel diff count is high"

**Assistant interpretation:** Stop using `diff_comparison.png` as the primary inspection artifact. Read prototype and React crops separately, especially for high-diff sections, because semantic/layout mismatches are easier to see in the raw crops.

**Inferred user intent:** Make visual analysis less noisy and more diagnostic before CSS tuning.

### Files inspected

```text
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/artifacts/header/left_region.png
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/artifacts/header/right_region.png
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/artifacts/shows-list/left_region.png
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/artifacts/shows-list/right_region.png
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/artifacts/mailing-list/left_region.png
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/artifacts/mailing-list/right_region.png
```

### Numeric context

```text
header       changed=7.2648   left=856x101.09 at x32 y101       right=824x203.59 at x48 y61       delta width=-32 height=+102.5 y=-40
shows-list   changed=66.0368  left=856x1386.02 at x32 y230.09   right=824x909.66 at x48 y274.59   delta width=-32 height=-476.36 y=+44.5
mailing-list changed=9.9766   left=856x136 at x32 y1664.11      right=824x144.5 at x48 y1256.25    delta width=-32 height=+8.5 y=-407.86
content      changed=52.4196  left=920x1739.11 at x0 y61        right=920x1411.75 at x0 y61       delta height=-327.36
```

### Header observations

The separate crops show that the header issue is primarily wrapper spacing and color, not text content.

Prototype header crop:

- starts lower on the page, after nav and 40px main top padding,
- has no extra top padding inside the header section,
- is 856px wide because the prototype page uses 32px side padding inside a 920px shell,
- text is dark/black,
- crop height is about 101px.

React header crop:

- starts at y=61, immediately after nav, because the React main has no top padding equivalent,
- adds `padding-block: 44px 28px` on `.pyxis-shows-page__header`,
- is 824px wide because React uses 48px side padding,
- title is red/accent instead of dark/black,
- crop height is about 204px.

Conclusion: the first tuning change should align page inner padding and header vertical ownership. The prototype puts top spacing on `<main>` and little/no spacing inside the section; React puts large spacing on the header section and uses wider side gutters.

### Shows list observations

The separate list crops reveal a data/fixture mismatch, not just CSS mismatch.

Prototype list:

- contains 9 shows, in this order: Redroom Inferno, 808 Collective, Petals of Love, Monday Meet-Ups, Basement Frequencies, Orphx, Moor Mother, Cygnus + Guests, Zola Jesus.
- uses varied poster artwork for all 9.
- occupies 3 full rows, about 1386px high.

React list:

- contains only 6 shows from the MSW seed data: Burial Hex, Moor Mother, Cygnus + Guests, Open Mic Night, Zola Jesus, Orphx.
- every visible poster is the default redroom poster because `ShowGrid`/`ShowTile` do not derive `posterKind` from the seed show data.
- occupies 2 rows, about 910px high.

Conclusion: the 66% Shows list diff is dominated by fixture/data mismatch. CSS tuning alone cannot solve it. We need either:

1. make Storybook/MSW Shows data match the prototype `P_SHOWS` set, including `title`, `kind`, and `poster`, or
2. change the prototype baseline to use the same 6-show seed data, which would lose the richer prototype intent.

Given the project goal is React parity with the prototype, the better move is to make the Storybook page fixture data match the prototype.

### Mailing-list observations

The separate crops show the mailing-list component itself is very close.

Prototype mailing list:

- 856px wide, matching 32px page gutters,
- title/description/form structure matches React,
- placeholder text is slightly different: `your@email.com`.

React mailing list:

- 824px wide, matching 48px page gutters,
- title/description/form structure matches prototype,
- placeholder text is the same visual string in the current crop,
- height is only 8.5px taller.

The huge y delta is not a component problem; it is caused by the list above being two rows instead of three. Once Shows list data matches the prototype and page gutters are aligned, the mailing-list position should become much closer.

### Main insight

The first proper tuning step should not be typography or card CSS. It should be fixture/data and page-shell alignment:

1. align React public page inner gutter with prototype: 48px -> 32px at desktop,
2. move Shows top spacing from `.pyxis-shows-page__header` toward page/main spacing or reduce header padding,
3. make Shows Storybook data match the prototype 9-show set and poster variants.

Only after that should we tune poster/card CSS.

### Playbook note

For high-diff sections, inspect `left_region.png` and `right_region.png` first. Use `diff_only.png` only after the two raw crops represent the same semantic content. The triptych is useful for reporting, but raw crops are better for diagnosis.


## Step 3: Preserve intermediate artifacts with numeric history folders

The user asked that all intermediate artifacts be stored in a retraceable history folder, even if they are not worth keeping long-term. I created a numbered artifact folder for the separate image inspection step and copied the generated Shows comparison artifacts into it before cleaning the active runtime output path.

### Prompt Context

**User prompt (verbatim):** "store all intermediate artifacts in a folder that we can use for history, even if they are not worth keeping in the long run. with a numerical prefix so that we can retrace your steps"

**Assistant interpretation:** Ticket-local `various/NN-*` folders are the right place for historical intermediate artifacts. Active generated paths under `prototype-design/visual-comparisons` should still be cleaned after copying.

### What I did

Created:

```text
various/02-separate-image-inspection-artifacts/
```

Copied the generated Shows artifacts from:

```text
prototype-design/visual-comparisons/cssvd-js/compare-spec/public-pages-desktop/shows/
prototype-design/visual-comparisons/cssvd-js/snapshot-section/shows/
```

into the numbered history folder, then removed active runtime output:

```bash
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

### New process rule

Every measurement/tuning step that produces useful intermediate output should get a numbered folder under this ticket, for example:

```text
various/01-baseline/
various/02-separate-image-inspection-artifacts/
various/03-after-page-gutter-and-header-spacing/
```

Active workflow paths stay clean; ticket history keeps the trail.


## Step 4: Pause tuning and preserve interrupted experiment patch

The user pivoted before this tuning pass was complete, asking to document the full end-to-end workflow for transforming prototype pages into modular, themable React/RTK Query packages. Before switching contexts, I preserved the in-progress source changes as an experiment patch and will revert the active source files so the documentation work starts from a clean tree.

### Prompt Context

**User prompt (verbatim excerpt):** "Ok, before we get too far into the details, we actually want to document our end to end workflow..."

**Assistant interpretation:** Stop detailed Shows tuning for now; document the larger repeatable workflow. Preserve the interrupted experiment without leaving half-finished source changes applied.

### What I preserved

```text
experiments/01-interrupted-shows-fixture-spacing-pass.patch
```

The patch includes the incomplete Shows fixture/data and page spacing tuning pass.

### Why revert active source

The pass was not complete, and type-checking exposed friction around mock/generated type declarations. Since the next task is a design/implementation guide rather than a finished tuning commit, keeping the patch in `experiments/` is cleaner than committing half-applied UI changes.
