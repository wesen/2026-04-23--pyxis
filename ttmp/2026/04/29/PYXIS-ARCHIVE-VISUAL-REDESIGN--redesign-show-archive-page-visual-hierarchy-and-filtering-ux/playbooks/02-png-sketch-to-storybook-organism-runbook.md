---
Title: PNG sketch to Storybook organism runbook
Ticket: PYXIS-ARCHIVE-VISUAL-REDESIGN
Status: active
Topics:
    - frontend
    - storybook
    - visual-design
    - css-visual-diff
    - process
DocType: playbook
Intent: reusable-runbook
Owners: []
RelatedFiles:
    - Path: prototype-design/visual-diff/userland/verbs/pyxis-app.js
      Note: Project-local Storybook screenshot verb used by the runbook
    - Path: web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.css
      Note: Example component CSS tuned from desktop and mobile PNG references
    - Path: web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.stories.tsx
    - Path: web/packages/pyxis-app/src/components/organisms/ShowLog/PostShowLogEditorModal/PostShowLogEditorModal.tsx
      Note: Example organism built from PNG sketches
ExternalSources: []
Summary: Operational runbook for turning designer PNG sketches into finished Pyxis organisms/pages using ticket evidence, Storybook, css-visual-diff screenshots, and iterative visual review.
LastUpdated: 2026-04-29T10:58:00-04:00
WhatFor: Use this when a designer hands over one or more PNG sketches and we need to convert them into production-ready React organisms or pages without blindly copying off-token colors/sizes.
WhenToUse: Read before starting visual implementation from screenshots, mobile sketches, or design-system PNGs.
---


# PNG sketch to Storybook organism runbook

## Purpose

This runbook describes how to turn PNG design sketches into finished Pyxis staff-app organisms/pages. It is based on the ShowLog editor modal iteration, where the source of truth was a mix of:

- a desktop modal screenshot;
- a design-system guidance PNG;
- mobile incident-checked sketches;
- current Storybook captures;
- existing Pyxis tokens/components.

The goal is not to copy every pixel from a PNG. The goal is to extract intent, hierarchy, behavior, and layout, then implement it in a way that still feels native to Pyxis.

## Principles

1. **Treat PNGs as design intent, not code.**
   - The designer’s colors, font sizes, and spacings may be approximate or off-token.
   - Preserve Pyxis token colors, type, button styles, and component conventions unless there is a deliberate reason not to.

2. **Storybook is the implementation workbench.**
   - Build organisms/pages in Storybook first.
   - Add stories for the states visible in the PNGs and for states the PNGs imply.

3. **Capture real screenshots, not imagined coverage.**
   - Use `css-visual-diff screenshot` or a project-local `css-visual-diff verbs ...` command.
   - Store screenshots under the active ticket `sources/` directory.

4. **Do not fake comparisons.**
   - If there is no live HTML prototype/reference URL, do not configure `original` and `react` to the same Storybook URL just to make the tool run.
   - Use a single-target screenshot verb instead.

5. **Commit in logical slices.**
   - Planning/docs.
   - Shared component/token support.
   - Organism implementation.
   - Visual evidence and final polish.

6. **Keep a diary.**
   - Record copied screenshots, tool commands, visual conclusions, wrong turns, and validation results.

## Ticket setup

For a focused visual implementation stream, use one ticket folder with this structure:

```text
ttmp/YYYY/MM/DD/TICKET--slug/
  design-doc/
  playbooks/
  reference/
  scripts/
  sources/
```

Recommended source subfolder for a component iteration:

```text
sources/NN-component-or-page-name/
```

For the ShowLog modal iteration we used:

```text
sources/17-show-log-modal-redesign-reference/
```

## Step 1: Copy all PNG sketches into the ticket

Never work directly from `/tmp/pi-clipboard-...png` paths. Copy them into the ticket so the design record survives the session.

Example:

```bash
mkdir -p ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/sources/17-show-log-modal-redesign-reference

cp /tmp/pi-clipboard-REFERENCE.png \
  ttmp/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN--redesign-show-archive-page-visual-hierarchy-and-filtering-ux/sources/17-show-log-modal-redesign-reference/reference-modal.png
```

Use descriptive names:

```text
reference-modal.png
designer-feedback.png
mobile-feedback-incident-1.png
mobile-feedback-incident-2.png
```

Update the diary with what each image is and what it should influence.

## Step 2: Inspect the PNG directly

Use `read` on each image. This is useful because it gives a direct rendered view in the agent session and avoids relying only on OCR or memory.

Checklist while reading the image:

- Overall canvas/viewport size.
- Modal/page bounds and placement.
- Column count and column proportions.
- Visual order of sections.
- Field labels and helper text.
- Button copy and alignment.
- Conditional states visible in the screenshot.
- Mobile-specific stacking and sticky footer behavior.

Record concrete observations in the diary or design report.

## Step 3: Analyze the PNG with image understanding

Use `understand_image` for higher-level critique.

Good prompt shape:

```text
Analyze this mobile incident-checked modal reference. What layout refinements should we apply to the current Pyxis mobile modal while keeping our existing colors/tokens? Focus on spacing, order, sticky footer, field sizing, counters, and incident panel.
```

Ask the tool to separate:

- intent to adopt;
- approximate sizing/colors to map to Pyxis tokens;
- potential conflicts with existing style;
- mobile-specific layout concerns;
- behavior implied by the image.

Do not accept the image analysis blindly. Use it as a second opinion.

## Step 4: Translate PNG intent into an implementation report

Before coding, write a short report under `design-doc/` or `reference/`.

Recommended sections:

1. Inputs and evidence.
2. What the PNG shows.
3. What to adopt.
4. What not to copy literally.
5. Current implementation gaps.
6. TSX work.
7. CSS work.
8. Storybook states.
9. Validation plan.
10. Acceptance criteria.

For the ShowLog modal, the key judgment was:

- adopt two-column desktop layout and conditional incident details;
- keep Pyxis colors and button styling rather than copying the designer’s exact hex values;
- add an `xl` modal size as a shared component capability;
- use Storybook screenshots as the baseline because there was no standalone HTML prototype.

## Step 5: Create explicit tasks

Add a task block to `tasks.md` before implementation.

Example:

```markdown
### Modal reference redesign implementation

- [ ] Add shared Modal wide/xl sizing.
- [ ] Refactor organism TSX into reference-style structure.
- [ ] Restyle CSS for desktop and mobile.
- [ ] Add/adjust Storybook states.
- [ ] Capture desktop and mobile screenshots.
- [ ] Compare screenshots against PNG intent.
- [ ] Run TypeScript/build validation.
```

Mark tasks complete as they are validated, not merely when code is typed.

## Step 6: Design the component API and stable selectors before polishing CSS

A design-system organism needs a small contract before it needs detailed styling. Decide what data comes in, what local draft state the component owns, and what events it emits. For a modal, the component should usually receive an entity and callbacks rather than fetching data itself.

Example from the ShowLog modal:

```ts
export type PostShowLogEditorModalProps = {
  entry?: ShowLogEntry;
  isOpen: boolean;
  isSaving?: boolean;
  onCancel: () => void;
  onSave?: (update: ShowLogUpdateInput) => void;
};
```

Then add stable selectors for visual tooling. Use `appPart()` for screenshot targets instead of relying only on incidental class names:

```tsx
panelProps={{ ...appPart('post-show-log-editor-modal') }}
```

This gives a durable selector:

```css
[data-pyxis-component="post-show-log-editor-modal"]
```

That selector can be reused for desktop captures, mobile captures, route-level smoke tests, and later regression checks.

## Step 7: Build from Storybook stories

Stories should represent both visible PNG states and important production states.

For a modal/form organism, include at least:

- empty/default;
- populated/logged;
- incident checked with no notes/validation;
- incident populated;
- saving/disabled;
- mobile default;
- mobile incident checked.

Example story names:

```ts
export const NeedsLog = {}
export const Logged = {}
export const Incident = {}
export const IncidentChecked = {}
export const Saving = {}
export const Mobile = {}
export const MobileIncidentChecked = {}
```

If a story appears visually broken after code changes, restart Storybook before assuming the CSS is broken. Vite can occasionally serve stale/empty CSS modules.

## Step 8: Use a single-target screenshot verb for Storybook-only baselines

If there is no real prototype/reference URL, do not make a YAML file where `original` and `react` both point to the same story. That hides the intent of the artifact.

Instead use a project-local verb.

We added:

```text
prototype-design/visual-diff/userland/verbs/pyxis-app.js
```

The verb command is:

```bash
css-visual-diff verbs pyxis app capture-story \
  pyxis-app-components-organisms-showlog-postshowlogeditormodal--incident \
  ttmp/.../sources/17-show-log-modal-redesign-reference/current-mobile-incident.png \
  --width 375 \
  --height 980 \
  --output json
```

This writes one actual Storybook screenshot plus inspect artifacts. It does not pretend to compare source and destination.

Use desktop captures too:

```bash
css-visual-diff verbs pyxis app capture-story \
  pyxis-app-components-organisms-showlog-postshowlogeditormodal--incident \
  ttmp/.../sources/17-show-log-modal-redesign-reference/current-desktop-incident.png \
  --width 1200 \
  --height 980 \
  --output json
```

## Step 9: Capture before and after screenshots

Use descriptive names:

```text
current-modal.png
current-after-redesign.png
current-desktop-incident-before-privacy-fix.png
current-desktop-incident-after-privacy-fix.png
current-mobile-incident-before-refine.png
current-mobile-incident-after-refine.png
```

Read the images directly after capture:

```text
read sources/.../current-mobile-incident-after-refine.png
```

Then ask targeted image-understanding questions if useful.

## Step 10: Watch for stale Storybook/Vite CSS

A failure mode observed during the ShowLog modal iteration:

- Storybook was running for a long time.
- A CSS import still existed.
- Network request for the CSS module returned `200`.
- But Vite served:

```js
const __vite__css = ""
```

Result: markup rendered, but all component CSS disappeared.

Debug checklist:

1. Inspect computed styles in the browser.
2. Fetch the CSS module URL and check whether `__vite__css` is empty.
3. If empty, restart Storybook.
4. Re-capture screenshots only after CSS is confirmed loaded.

Useful browser check:

```js
const cssUrl = [...performance.getEntriesByType('resource')]
  .map(e => e.name)
  .find(n => n.includes('PostShowLogEditorModal.css'))
const txt = await fetch(cssUrl).then(r => r.text())
txt.includes('app-post-show-log-modal__pre-show-note')
```

Restart command:

```bash
pkill -f 'storybook dev -p 6008' || true
cd web && nohup pnpm --filter pyxis-app storybook --host 0.0.0.0 --port 6008 \
  > /tmp/pyxis-app-storybook-6008.log 2>&1 &
```

## Step 11: Implement layout first, then tune spacing

For a modal/page derived from a PNG, implement in this order:

1. Semantic structure in TSX.
2. Shared component support if needed (`Modal width="xl"`, common panel props, etc.).
3. Desktop layout.
4. Mobile layout.
5. Conditional behavior.
6. Micro-spacing and text size.
7. Final screenshot evidence.

Do not start with exact colors or shadows. First make the structure correct.

## Step 12: Use Pyxis styling, not copied PNG styling

When a designer PNG includes design-system colors, map roles to Pyxis tokens:

- background → existing app surface;
- text → `--app-ink` / `--app-muted`;
- borders → `--app-rule` or local semantic mix;
- danger/incident → Pyxis danger/accent tokens where available;
- buttons → shared `Button` variants.

Only hard-code local semantic tints if no existing token exists and the tint is part of the component’s meaning, such as:

- warm pre-show note background;
- subtle incident alert background.

Even then, keep them muted enough to fit the app.

## Step 13: Mobile-specific checks

For mobile sketches, verify:

- modal width fits viewport;
- no column overflow;
- header title wraps acceptably;
- input fields do not collapse below readable width;
- two-column numeric inputs are still readable or stack if needed;
- incident panel appears below primary notes when checked;
- sticky footer does not cover required content;
- footer buttons have acceptable tap targets;
- textarea counters are visible and right-aligned;
- privacy banner does not stretch awkwardly.

If a screenshot looks like “all CSS disappeared,” confirm CSS loading before tuning.

## Step 14: Record product/data decisions separately

PNGs often include fields that do not exist in backend schema yet.

Examples from ShowLog:

- `quickHighlight`
- `totalDoor`

Do not silently add fake inputs to production if the values are lost. Choose one:

1. Storybook-only visual placeholder.
2. Fold into an existing notes field with explicit code/reporting.
3. Add backend persistence first.

Document the decision in the ticket.

## Step 15: Remove or archive obsolete components after a rename

A design-system iteration is not complete if it leaves multiple components that appear to solve the same problem. This is especially common when a screen is renamed. In Pyxis, the Post-show log screen used to be called Attendance. That left old components such as:

```text
web/packages/pyxis-app/src/components/organisms/Roster/AttendancePanel/
web/packages/pyxis-app/src/components/molecules/AttendanceStat/
```

while the new implementation lived under:

```text
web/packages/pyxis-app/src/components/organisms/ShowLog/
```

After the new organism is accepted, remove stale exports and stale stories, or explicitly archive them. Storybook should not show two competing canonical components unless both are deliberately supported. A future developer should not have to guess whether `AttendancePanel` or `PostShowLogPanel` is the right component.

Checklist:

- Rename page folders/classes when the product name changes (`AttendancePage` → `ShowLogPage`) even if the public route remains stable for compatibility.
- Remove obsolete organism folders after the replacement is wired.
- Remove obsolete molecule helpers if they are only used by the old organism.
- Remove package/barrel exports for deleted components.
- Re-run Storybook inventory or grep to ensure stale stories are gone.

## Step 16: Check layout mechanics, not just colors

Some visual bugs come from layout defaults rather than obvious styling errors. CSS grid stretches items by default, which can make a small card fill a tall column. In the ShowLog modal, this made the `Incident logs are private` gray box extend toward the bottom of the desktop side column.

The fix was to align the side-column content to the start:

```css
.app-post-show-log-modal__side-column {
  align-content: start;
  display: grid;
  gap: 22px;
}
```

This kind of issue is why screenshots matter. TypeScript will pass, the CSS will be syntactically valid, and the component will still feel wrong. When a card, banner, or panel is visually too tall, check grid/flex stretching before changing padding or colors.

## Step 17: Validate before commit

Minimum validation for React component work:

```bash
cd web/packages/pyxis-app && pnpm exec tsc --noEmit
cd web/packages/pyxis-app && pnpm exec vite build
```

If shared components changed:

```bash
cd web/packages/pyxis-components && pnpm exec tsc --noEmit
```

For ticket hygiene:

```bash
docmgr doctor --ticket TICKET-ID --stale-after 30
```

## Step 18: Commit rhythm

Recommended commits:

1. `TICKET: add png reference analysis`
2. `TICKET: add visual capture verb`
3. `TICKET: add shared component support`
4. `TICKET: implement organism/page redesign`
5. `TICKET: tune mobile visual states`
6. `TICKET: document final visual evidence`

Do not commit unrelated runtime artifacts, such as local uploaded flyers or binaries.

## Step 19: Final review package

A finished visual iteration should leave behind:

- copied PNG references;
- current before screenshots;
- current after screenshots;
- Storybook stories for states;
- CSS/TSX implementation;
- diary notes with commands and conclusions;
- task checkboxes;
- validation output;
- optional reMarkable/report upload if requested.

## Lessons from the ShowLog modal iteration

1. A PNG design system can be useful for layout and hierarchy even when colors/sizes are not canonical.
2. Conditional incident details were ambiguous: hide entirely when unchecked vs. show a muted affordance. Prefer asking or documenting the chosen behavior.
3. Desktop and mobile should be captured separately. Desktop can look correct while mobile overflows or loses hierarchy.
4. CSS disappearing in Storybook can be a dev-server issue, not necessarily a bad edit.
5. A reusable `css-visual-diff verbs pyxis app capture-story` command is better than fake same-source YAML for Storybook-only baselines.
6. Component API and stable selectors should come before micro-tuning. Without them, screenshots and route integration become fragile.
7. Data model mismatches must be explicit. If a PNG introduces `quickHighlight` or `totalDoor`, either persist those fields or document the temporary behavior.
8. Rename cleanup matters. Old `Attendance` components should not linger as apparently-valid alternatives after the screen becomes `ShowLog`.
9. Grid/flex stretching can create visual bugs that look like bad sizing. Check layout mechanics before changing tokens.

## Related durable note

A longer textbook-style version of this process was added to the Obsidian vault:

```text
/home/manuel/code/wesen/obsidian-vault/Projects/2026/04/29/ARTICLE - Playbook - Adding Pyxis Design System Components from PNG Feedback.md
```

Use the Obsidian article for onboarding and conceptual explanation. Use this ticket runbook for the operational checklist and exact commands.
