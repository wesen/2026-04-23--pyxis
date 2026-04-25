---
Title: Postmortem — Public component CSS extraction and visual-diff workflow
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: active
Topics:
  - frontend
  - css
  - storybook
  - visual-diff
  - workflow
  - postmortem
  - pyxis
DocType: reference
Intent: long-term
Summary: Detailed postmortem of the B2-B7 public component CSS extraction, Storybook coverage, visual validation, and workflow/tooling lessons.
LastUpdated: 2026-04-24T00:00:00Z
---

# Postmortem — Public Component CSS Extraction and Visual-Diff Workflow

## Executive summary

This work converted the public-site React component inventory from a prototype-discovery implementation style into a more durable, themeable component-library style.

Before this pass, many public components under:

```text
web/packages/pyxis-components/src/public
```

used large static JSX inline style objects. After the pass, canonical public components generally have:

- a component-local CSS file,
- a self-imported stylesheet,
- root `className` support through `clsx`,
- stable `data-pyxis-component` / `data-pyxis-part` selectors,
- component-local CSS variables for theme overrides,
- Storybook default/narrow/theme stories,
- `css-visual-diff` validation against existing configs.

This did **not** attempt to make every component visually perfect. It was primarily an architecture stabilization pass. Visual tuning remains separate.

## Scope completed

### Documentation and planning

Created or updated:

```text
design-doc/02-public-component-css-extraction-and-theming-guide.md
design-doc/03-public-component-theming-adr.md
design-doc/04-public-component-taxonomy-adr.md
reference/02-css-extraction-validation-cleanup.md
reference/03-css-extraction-postmortem.md
tasks.md
changelog.md
reference/01-investigation-diary.md
```

Updated playbook:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
```

### Component extraction batches

Completed B2, B3, B4, B5, B6, and B7.

Representative extracted components:

```text
SafetyNote
ArchiveStats
TicketStub
LineupRow
YearGroup
Poster
ShowTypeChips
ArchiveShowRow
ArchiveShowList
ArchiveSearchFilters
ShowTile
ShowGrid
PublicPageHeader
ShowDetailHeader
ShowMetaStrip
ReserveTicketCard
BookingForm
BookingSpaceAside
BookingRules
BookingSuccess
SaferSpaceAgreement
AboutHero
AboutIntro
EthosGrid
EthosStrip
CollectiveList
FindUsBlock
SpaceInfo
VenueCard
MailingListCTA
PubHero
PubFooter
PubNav cleanup
```

Deferred:

```text
PubShowRow — pending taxonomy decision.
```

## What was easy

### 1. Components with simple display markup were straightforward

The easiest components were those that already had a clear visual root and a few text subparts:

```text
PublicPageHeader
ShowDetailHeader
ShowMetaStrip
YearGroup
BookingSpaceAside
ArchiveSearchFilters
```

These usually followed the pattern:

```tsx
<div {...pyxisPart('component')} style={{ ... }}>
  <div style={{ ... }}>...</div>
</div>
```

The conversion was mechanical:

1. create `Component.css`,
2. import it from `Component.tsx`,
3. add `clsx('pyxis-component', className)`,
4. move styles into `:where([data-pyxis-component='...'][data-pyxis-part='...'])`,
5. add parts for semantic sub-elements.

Several of these preserved exact pixel parity after extraction.

### 2. The existing `pyxisPart` helper was the right foundation

Because `pyxisPart` already existed, there was no need to invent a selector contract. The skill's generic `data-part` guidance mapped cleanly to:

```text
data-pyxis-component
data-pyxis-part
```

This helped keep CSS, Storybook, and visual-diff selectors aligned.

### 3. Existing visual-diff configs made regression checks cheap

Most components already had configs under:

```text
prototype-design/visual-diff/comparisons/component-system/public
```

That made validation straightforward:

```bash
css-visual-diff run --config path/to/component.css-visual-diff.yml
```

For B7, whole-directory runs worked well:

```bash
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/molecules
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/organisms
```

### 4. Storybook theme stories were easy once variables existed

After component-local variables existed, Storybook theme stories were simple:

```tsx
<div style={{ '--pyxis-component-accent': 'var(--color-text-primary)' } as CSSProperties}>
  <Component />
</div>
```

This pattern should be reused.

## What was hard

### 1. Taxonomy ambiguity slowed decisions

The hardest non-technical issue was deciding whether a component deserved polishing.

Examples:

```text
PubShowRow vs ShowTile/ShowGrid vs ArchiveShowRow
EthosGrid vs EthosStrip
BookingSpaceAside vs VenueCard
FindUsBlock vs SpaceInfo
```

For `PubShowRow`, the safest decision was to defer CSS extraction until taxonomy is decided. Otherwise we risk polishing a component that should be deprecated.

### 2. Some visual-diff configs compare non-equivalent roots

Several configs compare a prototype wrapper or first child to a React component root. This can produce scary CSS diffs even when the component screenshot is close.

Examples:

- `BookingSuccess` original selector targets `> *`, while React targets the full success root.
- `BookingRules` reported width/height differences caused by fixture selector context.
- `AboutHero` had exact component pixels but root residual diff.

This made it important to read both:

```text
pixeldiff.md
cssdiff.md
```

and not overreact to root CSS differences.

### 3. CSS extraction and visual tuning are related but not the same

Some components still have residual pixel diffs after clean extraction:

```text
EthosStrip
EthosGrid
FindUsBlock
CollectiveList
BookingSuccess
Poster
ShowTile / ShowGrid via Poster
```

This is acceptable for an architecture pass, but it must be clearly recorded. Exact parity should be a separate tuning task.

### 4. Tokens were not always exact enough

Replacing a prototype value with a nearby token can introduce drift.

Example:

- `ReserveTicketCard` initially used a larger typography token for price.
- Pixel diff jumped to ~11%.
- Restoring exact `20px` reduced it to ~1.17%.

Lesson:

```text
During CSS extraction, preserve exact visual values first. Token-hardening can be a later pass.
```

### 5. Form extraction needs extra care

`BookingForm` required more thought than display components because it has:

- labels,
- inputs,
- select,
- textarea,
- submit disabled state,
- focus-visible behavior,
- `onSubmit`,
- accessibility relationships.

The extraction improved label/control relationships by adding explicit `id` and `htmlFor`, but this was more than a pure style move. Form components should always be reviewed for accessibility during style extraction.

## What could be improved in `css-visual-diff`

### 1. Artifact summary command

After running a directory, it would be useful to have a machine-readable summary of pixel diffs across all configs:

```bash
css-visual-diff summarize --output prototype-design/visual-comparisons/component-system/public
```

Desired output:

```text
slug, component, level, component_diff, root_diff, status, report_path
```

This would avoid manually opening many `pixeldiff.md` files.

### 2. Config-dir should optionally emit a consolidated report

`run --config-dir` currently completes successfully but the useful information is spread across many output directories.

Suggested flag:

```bash
css-visual-diff run --config-dir ... --summary-md /tmp/public-summary.md --summary-json /tmp/public-summary.json
```

### 3. Selector mismatch warnings

Some configs compare different semantic scopes. The tool could warn when the original and React selectors have very different dimensions or DOM roles.

Example warning:

```text
Warning: root section dimensions differ by >200%; original selector may not match React selector scope.
```

This would have helped with `BookingSuccess` and similar configs.

### 4. Baseline comparison mode

For CSS extraction, the important question is often:

```text
Did React before extraction differ from React after extraction?
```

Current configs compare prototype vs React, but a refactor-safety workflow also needs React-before vs React-after. Possible future feature:

```bash
css-visual-diff baseline save --config ... --name before-css-extraction
css-visual-diff baseline compare --config ... --name before-css-extraction
```

This would isolate refactor regressions from pre-existing prototype parity gaps.

### 5. First-class part-selector validation

A useful mode would check that expected `data-pyxis-part` selectors exist:

```yaml
parts:
  component: show-tile
  required: [root, title, meta, price, ticket-pill]
```

Then:

```bash
css-visual-diff parts --config ...
```

This would make the theming contract testable.

### 6. LLM review should consume config-run artifacts

Earlier work showed standalone `llm-review` can disagree with deterministic config-run artifacts. Future LLM review should take existing run outputs as input:

```text
pixeldiff.md
cssdiff.md
matched-styles.md
original/react crops
config YAML
```

and summarize those, rather than recapturing mismatched evidence.

## Workflow improvements

### 1. Commit one component or small group at a time

This worked well. Good commit boundaries were:

- one component for complex components,
- small related group for simple B5 text components,
- separate validation/doc commit.

This made it easy to record exact validation results and roll back if needed.

### 2. Use a two-pass approach

Recommended future workflow:

```text
Pass 1 — architecture extraction
  Move static JSX styles to CSS.
  Add parts.
  Preserve visual values.
  Validate no major regression.

Pass 2 — token hardening and visual tuning
  Replace CSS hex fallbacks with tokens.
  Tune remaining pixel diffs.
  Update accepted statuses.
```

Trying to do both at once risks unnecessary visual drift.

### 3. Separate taxonomy decisions from CSS extraction

If a component is likely to be deprecated, do not polish it before taxonomy is decided.

This was the right call for:

```text
PubShowRow
```

### 4. Keep diary entries close to the work

The implementation diary was valuable because it captured:

- exact commands,
- exact pixel diffs,
- why some diffs are accepted/deferred,
- which residual diffs are selector/context issues.

Future work should continue appending after each commit or small batch.

### 5. Storybook theme stories should use component variables directly

The most useful stories were not generic dark-mode wrappers, but direct component-variable overrides:

```tsx
<div style={{ '--pyxis-ticket-stub-bg': 'var(--color-ink)' } as CSSProperties}>
```

This demonstrates the actual theming API.

### 6. Do not commit visual-comparison artifacts

The `prototype-design/visual-comparisons/` directory is regenerated evidence. It should remain local unless explicitly requested.

## Playbook updates made

Updated:

```text
docs/playbooks/05-bottom-up-component-visual-parity.md
```

Added notes for:

- CSS extraction vs visual tuning,
- use of `data-pyxis` parts,
- component-local CSS variables,
- Storybook theme stories,
- directory-level visual-diff validation,
- remaining inline-style classification,
- when to update the parity map with `styleArchitecture`.

## What to do next

1. Review and accept/revise the theming ADR.
2. Review taxonomy ADR before page wiring.
3. Do token-hardening pass on CSS fallback colors.
4. Tune high-diff components after taxonomy decisions.
5. Start RTK Query / `pyxis-types` migration or page wiring depending on priority.
6. Only start page-level visual parity after data layer + component taxonomy are stable.
