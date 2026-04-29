---
Title: Next-session runbook for show edit modal/page redesign
Ticket: PYXIS-SHOW-EDIT-VISUAL-REDESIGN
Status: active
Topics:
  - pyxis
  - staff-app
  - design-system
  - react
  - storybook
DocType: playbook
Intent: short-term
Summary: Practical restart guide capturing what we wish we had known before beginning the show edit modal/page visual redesign.
LastUpdated: 2026-04-29T19:20:00-04:00
---

# Next-session runbook for show edit modal/page redesign

Use this when restarting the show edit visual redesign work. It captures the shortcuts, caveats, and hard-won context from today so the next session can start faster.

## 1. Start from the ticket, not chat memory

Ticket path:

```text
ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/
```

Read these first, in this order:

```text
index.md
tasks.md
sources/06-widget-reuse-and-deprecation-audit.md
design-doc/01-show-edit-modal-and-page-visual-redesign-implementation-guide.md
reference/01-show-edit-visual-redesign-diary.md
```

The design doc is long. If you are implementing immediately, first skim:

- `Widget reuse and deprecation audit`
- `Design decomposition`
- `Implementation phases`
- `File reference map`
- `Implementation checklist for the intern`

## 2. Current commit state to know

Important commits for this ticket:

```text
8daad47 PYXIS-SHOW-EDIT-VISUAL-REDESIGN: document show edit redesign
6acee5f PYXIS-SHOW-EDIT-VISUAL-REDESIGN: add widget reuse audit
06dff27 PYXIS-SHOW-EDIT-VISUAL-REDESIGN: decompose show modal
5c13cd0 PYXIS-SHOW-EDIT-VISUAL-REDESIGN: capture modal story evidence
```

The modal decomposition is committed. Page decomposition work was started after that and may still be in the working tree if not committed; check `git status` before editing.

## 3. Do not repeat the initial mistake: decompose first

The key process correction was: do not copy the PNG into route CSS. First map it into components.

Use these runbooks:

```text
docs/playbooks/07-react-application-decomposition-and-component-reuse.md
docs/playbooks/06-react-widget-folder-storybook-css-organization.md
docs/playbooks/05-bottom-up-component-visual-parity.md
docs/playbooks/09-pyxis-app-visual-tuning-runbook.md
```

The implementation should preserve this layering:

```text
Page
  owns route params, RTK Query hooks, mutations, loading/error, navigation
Organism
  owns coherent page sections, gets props/callbacks
Molecule
  owns reusable row/card/form-section/dropzone shapes
Atom
  owns small status/date/age/draw indicators
pyxis-components
  owns generic Button/Modal/Input/etc.
```

If you catch yourself adding a large block of JSX directly to `ShowDetailPage`, stop and ask what organism/molecule it should become.

## 4. Widgets already added for the modal

These new molecule folders exist and should be reused, not recreated:

```text
web/packages/pyxis-app/src/components/molecules/ShowFormSection/
web/packages/pyxis-app/src/components/molecules/ShowLineupRowEditor/
web/packages/pyxis-app/src/components/molecules/FlyerDropzone/
```

Each follows the expected folder shape:

```text
Component.tsx
Component.css
Component.stories.tsx
index.ts
```

`NewShowModal` now composes them:

```text
web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx
```

Do not undo that decomposition while tuning visuals.

## 5. Modal validation already passed

These commands passed after the modal decomposition:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
```

Evidence:

```text
sources/07-modal-decomposition-validation.txt
sources/08-modal-storybook-captures/
sources/09-modal-storybook-smoke.txt
```

Modal capture script:

```text
scripts/01-capture-new-show-modal-stories.js
```

Modal interaction smoke script:

```text
scripts/02-smoke-new-show-modal-story.js
```

Run them from repo root, with Storybook already running:

```bash
node ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/scripts/01-capture-new-show-modal-stories.js
node ttmp/2026/04/29/PYXIS-SHOW-EDIT-VISUAL-REDESIGN--redesign-pyxis-show-edit-modal-and-show-edit-page/scripts/02-smoke-new-show-modal-story.js
```

## 6. Storybook startup caveat

A stale Storybook process returned this error:

```text
Unable to index files:
- ./src/components/organisms/ShowDetailDiscordPanel/ShowDetailDiscordPanel.stories.tsx: ENOENT
- ./src/components/shell/AppShell.stories.tsx: ENOENT
```

The fix was to kill the stale process and start fresh:

```bash
pkill -f 'storybook.*6008' || true
nohup pnpm --dir web --filter pyxis-app storybook --host 127.0.0.1 --port 6008 \
  > /tmp/pyxis-app-storybook-6008-fresh.log 2>&1 &
sleep 15
curl -fsS http://localhost:6008/index.json
```

Expected: the index should include about 310 stories, including:

```text
pyxis-app-components-molecules-flyerdropzone--empty
pyxis-app-components-molecules-showformsection--default
pyxis-app-components-molecules-showlineuproweditor--default
pyxis-app-components-organisms-newshowmodal--create-default
```

## 7. Screenshot selector caveat

The first screenshot script failed because this selector matched both root and form:

```text
[data-pyxis-component="new-show-modal"]
```

Use the precise selector:

```text
[data-pyxis-component="new-show-modal"][data-pyxis-part="root"]
```

This matters because `NewShowModal` has both:

- root part on the modal panel;
- form part on the internal form.

## 8. Protobuf story fixture caveat

Do not build a new protobuf story fixture by spreading an existing `create(ShowSchema, ...)` result and replacing nested `lineup` with object literals.

This failed:

```ts
const longLineupShow = create(ShowSchema, {
  ...confirmedShow,
  lineup: [{ artist: '...', role: '...', startTime: '...', endTime: '...' }],
});
```

TypeScript complained because nested literals were checked against full generated message types.

Use this instead:

```ts
const confirmedShowData = { artist: '...', date: '...', status: ShowStatus.CONFIRMED };

const confirmedShow = create(ShowSchema, {
  ...confirmedShowData,
  lineup: [{ artist: 'YOYOYOYO', role: 'Headline', startTime: '9:00 PM', endTime: '10:00 PM' }],
});

const longLineupShow = create(ShowSchema, {
  ...confirmedShowData,
  lineup: [{ artist: 'A Very Long Artist Name', role: 'Headline', startTime: '11:00 PM', endTime: '12:00 AM' }],
});
```

## 9. Preserve current product semantics

Do not regress these behaviors while changing layout:

- Confirmed shows require a flyer.
- Create confirmed-with-selected-flyer is a multi-step flow: create draft → upload flyer → update confirmed.
- `price` is optional display text.
- `reserveTicketEnabled` controls public reserve CTA and defaults false.
- Drafts appear in Shows → Drafts.
- Staff notes are staff-only.
- Page-level RTK Query stays in pages.

## 10. Page decomposition status and likely next steps

The planned page components are:

```text
web/packages/pyxis-app/src/components/organisms/ShowEdit/ShowEditHeader/
web/packages/pyxis-app/src/components/organisms/ShowEdit/ShowFlyerCard/
web/packages/pyxis-app/src/components/organisms/ShowEdit/ShowEditRail/
web/packages/pyxis-app/src/components/organisms/ShowEdit/ShowEditMain/
web/packages/pyxis-app/src/components/organisms/ShowEdit/index.ts
```

Before continuing, run:

```bash
git status --short
pnpm --dir web --filter pyxis-app exec tsc --noEmit
```

If those page components are present but uncommitted, validate and decide whether to keep/fix or revert before proceeding. The next clean implementation slice should be:

```text
PYXIS-SHOW-EDIT-VISUAL-REDESIGN: decompose show edit page
```

Validation target:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
docmgr doctor --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --stale-after 30
```

## 11. What to commit and what not to commit

Commit:

- component TSX/CSS/stories/index files;
- ticket docs/tasks/changelog/diary;
- scripts under this ticket's `scripts/` directory;
- evidence under this ticket's `sources/` directory.

Do not commit unrelated local artifacts:

```text
data/flyers/show-19/
data/flyers/show-24/
data/flyers/show-29/
data/flyers/show-31/
data/flyers/show-32/
pyxis
ttmp/2026/04/29/PYXIS-GOOGLE-CALENDAR--add-google-calendar-integration-for-import-and-sync/
ttmp/2026/04/29/PYXIS-MAILCHIMP-MAILING-LIST--add-mailchimp-mailing-list-signup-to-public-website/
```

## 12. End-of-session checklist

Before stopping next time:

```bash
pnpm --dir web --filter pyxis-app exec tsc --noEmit
pnpm --dir web --filter pyxis-app build
docmgr doctor --ticket PYXIS-SHOW-EDIT-VISUAL-REDESIGN --stale-after 30
git status --short
```

Update:

```text
tasks.md
changelog.md
reference/01-show-edit-visual-redesign-diary.md
```

Then commit one logical slice.
