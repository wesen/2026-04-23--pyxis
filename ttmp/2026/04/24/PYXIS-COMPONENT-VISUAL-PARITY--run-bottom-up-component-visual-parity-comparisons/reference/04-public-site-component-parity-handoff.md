---
Title: Public site component parity handoff
Ticket: PYXIS-COMPONENT-VISUAL-PARITY
Status: active
Topics:
  - frontend
  - storybook
  - public-site
  - visual-regression
  - css-visual-diff
DocType: reference
Intent: handoff
Summary: Next-developer handoff for extending the bottom-up Pyxis visual parity workflow into public-site components, with Storybook taxonomy, recommended order, fixture strategy, and validation commands.
LastUpdated: 2026-04-24T00:00:00Z
---

# Public Site Component Parity Handoff

## 0. Purpose

This handoff is for the next developer continuing Pyxis visual parity after the generic atom/molecule pass.

The important state is:

- Generic atoms are covered and accepted.
- Generic molecules are now covered; some are accepted and some are queued as `needs-review`.
- Generic organisms have started: `TopBar` is accepted, `Modal` is close but queued as `needs-review`.
- The next large frontier is the **public-site component ladder**.

Do not jump directly to full public pages. The same bottom-up rule still applies, but now inside the public-site domain:

```text
public molecules → public organisms/sections → public pages
```

The public components live here:

```text
web/packages/pyxis-components/src/public/
```

The prototype source of truth is still primarily:

```text
prototype-design/Pyxis Public Site.html
prototype-design/screens/ppxis.jsx
```

---

## 1. Current generic layer checkpoint

The latest relevant commits are:

```text
731c88571405cca9749d78639bd66623002a05b4 Add bottom-up component visual parity workflow
5a4a86e902b8554c57919c7e51f1066fa293e34b Add organism parity comparisons and LLM review report
b02e6754ba47f4fd7b179ba7c0c0914153b45022 Add remaining molecule parity coverage
```

Generic molecule coverage now includes:

```text
card-default          accepted
card-head-default     needs-review
empty-cta             accepted
field-default         accepted
field-error           accepted
log-row-default       needs-review
table-default         needs-review
stat-default          accepted
```

`LogRow` deserves special attention: it appears closer to a public show-detail lineup row than a generic audit row. It may eventually need to move, split, or be reconciled with `public/LineupRow`.

---

## 2. Storybook taxonomy change already made

The public Storybook section has been reorganized into subdirectories:

```text
Public/Molecules/*
Public/Organisms/*
```

### Public/Molecules

```text
ArchiveStats
LineupRow
PubShowRow
TicketStub
YearGroup
```

### Public/Organisms

```text
AboutHero
BookingForm
BookingRules
BookingSuccess
EthosStrip
MailingListCTA
PubFooter
PubHero
PubNav
SpaceInfo
VenueCard
```

This is only Storybook taxonomy. It does not move files on disk. The files remain under:

```text
web/packages/pyxis-components/src/public/<Component>/<Component>.stories.tsx
```

The goal is to make the public ladder visible in Storybook before adding parity configs.

---

## 3. Why public has its own ladder

The generic design-system ladder is:

```text
atoms → molecules → organisms
```

Public site components have their own domain-specific ladder:

```text
public molecules → public organisms/sections → public pages
```

A public component is allowed to know about shows, tickets, archives, booking rules, venue information, and public navigation. That is why these components should not be forced into the generic molecule/organism folders.

Example:

```text
LineupRow   = public molecule
TicketStub  = public molecule/section fragment
PubNav      = public organism
VenueCard   = public organism/section
BookingForm = public organism/workflow
Shows page  = public page
```

This distinction matters for visual parity because public pages should only be compared after their domain components are inspectable.

---

## 4. Recommended public-site comparison order

Start with the smallest public components and work upward.

### Batch P1: public molecules / row-like components

Recommended order:

```text
LineupRow
TicketStub
ArchiveStats
YearGroup
PubShowRow
```

Why:

- They are relatively small.
- They appear inside larger public sections/pages.
- They should be easier to fixture precisely than full public sections.

### Batch P2: public navigation and shell sections

```text
PubNav
PubFooter
PubHero
AboutHero
```

Why:

- `PubNav` already has prototype baseline examples under `prototype-design/baseline/sample/.../nav/prepared.html`.
- These establish page-level public typography, spacing, and shell rhythm.

### Batch P3: public content sections

```text
VenueCard
SpaceInfo
EthosStrip
MailingListCTA
BookingRules
BookingSuccess
```

### Batch P4: public workflows / larger sections

```text
BookingForm
```

### Batch P5: public pages

Only after lower layers:

```text
Shows
Show detail
Archive
Book
About
```

---

## 5. Suggested fixture strategy

Create dedicated public fixture scripts rather than mixing public components into the generic molecule fixture.

Suggested prototype fixture path:

```text
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
```

Suggested Storybook fixture path:

```text
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
```

Suggested story title:

```text
Public/Fixtures/Public Diff Fixture
```

Suggested fixture wrapper:

```html
data-fixture="pyxis-public"
```

Use `data-comp` names such as:

```text
public-lineup-row-default
public-ticket-stub-default
public-archive-stats-default
public-year-group-default
public-pub-show-row-default
public-nav-shows-active
public-footer-default
public-hero-default
```

Keep the rule from atoms/molecules:

```text
same logical wrapper on both sides,
side-specific internal selectors for CSS probes.
```

---

## 6. Comparison config layout

Do not put public configs under generic molecules/organisms. Use a public subtree:

```text
prototype-design/visual-diff/comparisons/component-system/public/molecules/
prototype-design/visual-diff/comparisons/component-system/public/organisms/
prototype-design/visual-diff/comparisons/component-system/public/pages/
```

Example:

```text
prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-nav-shows-active.css-visual-diff.yml
```

Update the parity map with `level` and `domain`, for example:

```json
{
  "slug": "public-molecules-lineup-row-default",
  "domain": "public",
  "level": "molecule",
  "component": "LineupRow",
  "state": "default",
  "status": "needs-review"
}
```

The current parity map does not require `domain`, but public work will be clearer if we add it for new entries.

---

## 7. Prototype sources to inspect

Main public prototype:

```text
prototype-design/screens/ppxis.jsx
```

Existing public baseline prepared artifacts are useful references. Examples already found:

```text
prototype-design/baseline/sample/prototype-public-detail/nav/prepared.html
prototype-design/baseline/sample/prototype-public-detail/detail-grid/prepared.html
prototype-design/baseline/sample/prototype-public-detail/full-shell/prepared.html
```

For `PubNav`, the prepared HTML already shows a clean source-of-truth snippet:

```html
<header style="background: rgb(255, 255, 255); border-bottom: 1px solid rgb(234, 231, 224); position: sticky; top: 0px; z-index: 50;">
  ...
</header>
```

For `LineupRow`, inspect the show detail lineup table in `ppxis.jsx` or prepared detail-grid artifacts. The row shape is roughly:

```html
<tr style="border-top: 1px solid rgb(234, 231, 224);">
  <td style="padding: 12px 12px 12px 0; color: muted; width: 60px;">9:45</td>
  <td style="padding: 12px 0; font-weight: 600;">
    sable witch
    <div style="font-size: 11.5px; color: muted; font-style: italic;">opener · dj set</div>
  </td>
</tr>
```

That is probably the real reference for React `public/LineupRow` and maybe for the current generic `LogRow` confusion.

---

## 8. Validation loop

Keep using live Storybook in tmux:

```bash
tmux capture-pane -pt pyxis-components-storybook -S -80
```

If needed:

```bash
tmux new-session -d -s pyxis-components-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-components storybook'
```

For each new public target:

```bash
cd /home/manuel/code/wesen/2026-04-23--pyxis
cd web && pnpm --filter pyxis-components typecheck
cd ..
css-visual-diff run \
  --config prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml \
  --modes capture,cssdiff,matched-styles,pixeldiff,html-report
```

At this stage, coverage is more important than zero diff. It is acceptable to mark new public targets as:

```text
needs-review
```

as long as:

- selectors match,
- screenshots are the intended component/state,
- the parity map records the status and known caveats.

---

## 9. What not to do next

Do not start by tuning full public pages.

Do not force public components into generic molecule/organism configs.

Do not try to make every first public target pixel-perfect before adding the next one. The current user direction is coverage-first: get missing comparison targets into the queue, then cycle back.

Do not rely on `llm-review` as a verdict layer yet. The maintainer report documents why:

```text
ttmp/2026/04/24/PYXIS-COMPONENT-VISUAL-PARITY--run-bottom-up-component-visual-parity-comparisons/reference/03-css-visual-diff-llm-review-maintainer-report.md
```

---

## 10. Immediate next task

Start with `LineupRow`.

Suggested first files:

```text
web/packages/pyxis-components/src/public/LineupRow/LineupRow.tsx
web/packages/pyxis-components/src/public/LineupRow/LineupRow.stories.tsx
prototype-design/screens/ppxis.jsx
prototype-design/baseline/sample/prototype-public-detail/detail-grid/prepared.html
```

Create:

```text
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx
prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml
```

Then add a parity-map entry:

```text
public-molecules-lineup-row-default
```

Status should probably start as:

```text
needs-review
```

unless it happens to be pixel-perfect on the first run.
