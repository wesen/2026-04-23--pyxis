---
Title: Pyxis App React Intern Playbook
Ticket: PYXIS-APP-REACT
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - pyxis
    - rtk-query
DocType: playbook
Intent: implementation-guide
Owners: []
RelatedFiles:
    - Path: docs/playbooks/05-bottom-up-component-visual-parity.md
      Note: Existing bottom-up visual parity playbook to extend
    - Path: prototype-design/standalone/full-app/index.html
      Note: Desktop/full-app prototype index for visual baselines
    - Path: prototype-design/standalone/mobile/index.html
      Note: Mobile viewport prototype index for responsive app baselines
    - Path: prototype-design/visual-diff/userland/README.md
      Note: JS-canonical visual-diff workflow documentation
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Example visual suite spec to model app specs after
    - Path: ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/design/01-pyxis-app-react-end-to-end-workflow-guide.md
      Note: Detailed design guide that this playbook operationalizes
    - Path: web/packages/pyxis-user-site/.storybook/main.ts
      Note: Storybook/MSW/source-alias setup to mirror
    - Path: web/packages/pyxis-user-site/src/api/publicApi.ts
      Note: RTK Query pattern to mirror for app API slice
ExternalSources: []
Summary: Practical handoff playbook for implementing the responsive pyxis-app React package from prototype baselines using Storybook, RTK Query, modular components, and JS-canonical visual diffing.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Pyxis App React Intern Playbook

## Who this is for

This playbook is for a new intern joining the Pyxis React implementation effort. It assumes you know React and TypeScript basics, but it does **not** assume you know this repository, the prototype history, or the current visual-diff workflow.

Your job is not to “copy HTML until it looks close.” Your job is to build a maintainable, typed, modular, responsive React package called `pyxis-app`, and use visual diffing as feedback while you work from small components up to full pages.

The core idea:

```text
Build small trustworthy components first.
Then compose larger sections.
Then compose responsive pages.
Then tune page-level parity.
```

## The most important correction: mobile is responsive, not separate

The mobile prototype is a responsive/mobile baseline for the same main app. It is not a separate React product.

Do this:

```text
DashboardPage.tsx
  desktop viewport → compare to standalone/full-app/dashboard.html
  mobile viewport  → compare to standalone/mobile/home.html
```

Avoid this unless there is a very strong reason:

```text
DashboardPage.tsx
MobileDashboardPage.tsx
```

A mobile-only shell detail like `AppBottomNav` is fine. A parallel mobile page hierarchy is not the default.

Good mental model:

```text
One app.
One route tree.
One data layer.
One component system.
Many responsive viewport variants.
```

---

## 1. Map of the repository

### Prototype sources

Prototype source modules are visual/reference material:

```text
prototype-design/lib/tokens.js
prototype-design/lib/data.js
prototype-design/lib/components.jsx
prototype-design/screens/auth-dash.jsx
prototype-design/screens/shows-bookings.jsx
prototype-design/screens/roster.jsx
prototype-design/screens/settings-discord.jsx
prototype-design/screens/mobile.jsx
```

Read these to understand what the UI should do and how it looks. Do not blindly copy them as production code.

### Prototype standalone pages

Desktop/full-app baselines:

```text
prototype-design/standalone/full-app/index.html
prototype-design/standalone/full-app/login.html
prototype-design/standalone/full-app/setup.html
prototype-design/standalone/full-app/dashboard.html
prototype-design/standalone/full-app/shows.html
prototype-design/standalone/full-app/calendar.html
prototype-design/standalone/full-app/bookings.html
prototype-design/standalone/full-app/modal.html
prototype-design/standalone/full-app/artists.html
prototype-design/standalone/full-app/attendance.html
prototype-design/standalone/full-app/log.html
prototype-design/standalone/full-app/discord.html
prototype-design/standalone/full-app/settings.html
```

Mobile viewport baselines:

```text
prototype-design/standalone/mobile/index.html
prototype-design/standalone/mobile/login.html
prototype-design/standalone/mobile/home.html
prototype-design/standalone/mobile/shows.html
prototype-design/standalone/mobile/show-detail.html
prototype-design/standalone/mobile/calendar.html
prototype-design/standalone/mobile/bookings.html
prototype-design/standalone/mobile/booking-review.html
prototype-design/standalone/mobile/artists.html
prototype-design/standalone/mobile/artist-detail.html
prototype-design/standalone/mobile/post-show.html
prototype-design/standalone/mobile/settings.html
```

### Existing web packages

```text
web/packages/pyxis-types       # dependency-free shared TypeScript contracts
web/packages/pyxis-components  # generic + public-site reusable components
web/packages/pyxis-user-site   # public website app; use as RTK Query/Storybook model
web/packages/pyxis-app         # new package you will create
```

### Current visual-diff userland

```text
prototype-design/visual-diff/userland/
  README.md
  lib/
  specs/
  scripts/
  verbs/
```

This is the active visual workflow. Do not create new native `*.css-visual-diff.yml` configs.

---

## 2. Where to look for help

### Read these docs first

```text
design/01-pyxis-app-react-end-to-end-workflow-guide.md
tasks.md
various/01-source-inventory.md
docs/component-system-and-public-site-components.md
docs/playbooks/05-bottom-up-component-visual-parity.md
prototype-design/visual-diff/userland/README.md
```

### Existing code examples

For package and Storybook patterns:

```text
web/packages/pyxis-user-site/package.json
web/packages/pyxis-user-site/.storybook/main.ts
web/packages/pyxis-user-site/.storybook/preview.tsx
web/packages/pyxis-user-site/src/store.ts
web/packages/pyxis-user-site/src/api/publicApi.ts
web/packages/pyxis-user-site/stories/PublicPages.stories.tsx
```

For component selector/theming patterns:

```text
web/packages/pyxis-components/src/utils/parts.ts
web/packages/pyxis-components/src/atoms/Button/Button.tsx
web/packages/pyxis-components/src/molecules/Card/Card.tsx
web/packages/pyxis-components/src/public/PublicPageHeader/PublicPageHeader.tsx
web/packages/pyxis-components/src/public/ShowTile/ShowTile.tsx
```

For visual spec patterns:

```text
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
prototype-design/visual-diff/userland/lib/compare-region.js
```

### CLI help

For `css-visual-diff`:

```bash
css-visual-diff help inspect-workflow
css-visual-diff help story-config-authoring
css-visual-diff verbs --repository prototype-design/visual-diff/userland --help
```

For docmgr:

```bash
docmgr doctor --ticket PYXIS-APP-REACT --stale-after 30
docmgr doc relate --help
docmgr ticket --help
```

For reMarkable uploads:

```bash
remarquee status
remarquee upload bundle --dry-run <files...> --name "..." --remote-dir "/ai/YYYY/MM/DD/TICKET"
```

---

## 3. Development environment

### Prototype server

Run from repo root:

```bash
python3 -m http.server 7070 --directory prototype-design
```

Prototype URLs:

```text
http://localhost:7070/standalone/full-app/index.html
http://localhost:7070/standalone/mobile/index.html
```

### Existing Storybook ports

```text
pyxis-components: http://localhost:6006
pyxis-user-site:  http://localhost:6007
pyxis-app:        http://localhost:6008  # create this
```

Start future `pyxis-app` Storybook:

```bash
tmux new-session -d -s pyxis-app-storybook \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook'
```

If it gets stale:

```bash
tmux send-keys -t pyxis-app-storybook C-c \
  'cd /home/manuel/code/wesen/2026-04-23--pyxis/web && pnpm --filter pyxis-app storybook' Enter
```

---

## 4. The implementation loop

The workflow is always bottom-up:

```text
1. Identify a repeated UI shape in the prototype.
2. Classify it: shared generic component or pyxis-app component.
3. Build the smallest useful React component.
4. Add CSS + selector contract.
5. Add Storybook story.
6. Add visual spec target.
7. Compare prototype crop to Storybook crop.
8. Tune component.
9. Compose organism.
10. Compose page.
11. Compare full page at desktop and mobile viewport.
```

Pseudocode:

```ts
for (const route of appRoutes) {
  const prototypeDesktop = desktopPrototypeFor(route);
  const prototypeMobile = mobilePrototypeFor(route);

  const components = identifyRepeatedShapes(prototypeDesktop, prototypeMobile);

  for (const component of components) {
    buildReactComponent(component);
    writeStorybookStory(component);
    addVisualSpecTarget(component);
    compareAndTune(component);
  }

  buildResponsivePage(route);
  addDesktopStory(route);
  addMobileViewportStory(route);
  addDesktopVisualTarget(route);
  addMobileVisualTarget(route);
  compareAndTune(route);
}
```

---

## 5. Component taxonomy rules

### Use `pyxis-components` for generic reusable UI

Examples:

```text
Button
Badge
Input
Select
Textarea
Card
Field
Stat
Table
Empty
Modal
TopBar
```

If a component makes sense outside the staff app, consider `pyxis-components`.

### Use `pyxis-app` for staff-app domain UI

Examples:

```text
MetricCard
TodayShowCard
ActivityFeedItem
ShowTableRow
BookingQueueRow
ArtistRosterRow
CalendarEventChip
DiscordChannelRow
SettingsToggleRow
AppShell
AppSidebar
DashboardOverview
BookingQueue
CalendarMonth
ArtistRoster
SettingsPanel
```

### Use responsive variants for mobile

Prefer:

```text
BookingQueue
  desktop: table/list layout
  mobile: card stack layout
```

Avoid starting with:

```text
BookingQueue
MobileBookingQueue
```

Create a mobile-specific component only if the interaction is truly different, not merely stacked or narrower.

---

## 6. Selector contract

Visual diffing depends on stable selectors.

### Components

Each reusable component root:

```html
data-pyxis-component="metric-card"
data-pyxis-part="root"
```

Each important internal part:

```html
data-pyxis-component="metric-card"
data-pyxis-part="value"
```

React example:

```tsx
<article className="pyxis-metric-card" {...pyxisPart('metric-card')}>
  <div {...pyxisPart('metric-card', 'label')}>{label}</div>
  <strong {...pyxisPart('metric-card', 'value')}>{value}</strong>
</article>
```

### Pages

Each page root:

```html
data-page="dashboard"
```

Each important page section:

```html
data-section="dashboard-metrics"
data-section="dashboard-activity"
```

React example:

```tsx
<main className="pyxis-dashboard-page" data-page="dashboard">
  <section data-section="dashboard-metrics">
    <DashboardMetrics />
  </section>
  <section data-section="dashboard-activity">
    <ActivityFeed />
  </section>
</main>
```

### Avoid broad selectors

Avoid these unless comparing the whole shell intentionally:

```css
#root > *
#storybook-root > *
```

Prefer:

```css
[data-page='dashboard']
[data-section='dashboard-metrics']
[data-pyxis-component='metric-card'][data-pyxis-part='root']
```

---

## 7. CSS and theming rules

Use CSS files, tokens, and component-local variables.

Recommended component shape:

```text
src/components/molecules/MetricCard/
  MetricCard.tsx
  MetricCard.css
  MetricCard.stories.tsx
  index.ts
```

CSS example:

```css
:where([data-pyxis-component='metric-card'][data-pyxis-part='root']) {
  --pyxis-metric-card-bg: var(--color-surface);
  --pyxis-metric-card-border: var(--color-border-subtle);

  background: var(--pyxis-metric-card-bg);
  border: 1px solid var(--pyxis-metric-card-border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}
```

Static prototype styles should become CSS. Inline styles are allowed only for truly dynamic values.

---

## 8. RTK Query rules

### Types first

Add app types to:

```text
web/packages/pyxis-types/src/app.ts
```

Export them from:

```text
web/packages/pyxis-types/src/index.ts
```

### API slice

Use `pyxis-user-site` as the model:

```text
web/packages/pyxis-user-site/src/api/publicApi.ts
web/packages/pyxis-user-site/src/store.ts
```

`pyxis-app` should have:

```text
web/packages/pyxis-app/src/api/endpoints.ts
web/packages/pyxis-app/src/api/appApi.ts
web/packages/pyxis-app/src/api/hooks.ts
web/packages/pyxis-app/src/store.ts
```

### MSW handlers

Use wildcard patterns:

```ts
http.get('*/api/app/shows', () => HttpResponse.json(seedShows));
```

This matters because RTK Query can call absolute URLs.

---

## 9. Storybook rules

### Component stories

Each important component needs at least one Storybook story.

```text
MetricCard.stories.tsx
BookingQueue.stories.tsx
AppShell.stories.tsx
```

Include states:

- default,
- empty/loading if relevant,
- compact/mobile viewport if relevant,
- error/disabled if relevant.

### Page stories

Use one story file for route/page stories:

```text
web/packages/pyxis-app/stories/AppPages.stories.tsx
```

Use the same page component for desktop and mobile stories:

```tsx
export const DashboardDesktop = {
  args: { route: '/', storyName: 'dashboard-desktop', width: 1240, minHeight: 760 },
};

export const DashboardMobile = {
  args: { route: '/', storyName: 'dashboard-mobile', width: 390, minHeight: 844 },
};
```

The story frame should expose:

```html
data-story="pyxis-app-page"
data-story-name="dashboard-desktop"
data-story-frame="pyxis-app-shell"
```

---

## 10. Visual-diff rules

### Use JS/YAML specs

Create specs under:

```text
prototype-design/visual-diff/userland/specs/
```

Planned specs:

```text
app.components.visual.yml
app.pages.desktop.visual.yml
app.pages.mobile.visual.yml
```

Run via:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --outDir prototype-design/visual-comparisons/cssvd-js/compare-spec/app-dashboard \
  --output json
```

### Mobile spec pattern

Mobile specs compare a mobile prototype baseline against the same React app page at a mobile viewport:

```yaml
- page: dashboard
  variant: mobile
  prototypePath: /standalone/mobile/home.html
  storyId: pyxis-app-pages--dashboard-mobile
  sections:
    - name: page
      original: '#root'
      react: '[data-story-frame="pyxis-app-shell"]'
    - name: content
      original: '[data-page="dashboard"]'
      react: '[data-page="dashboard"]'
```

### Inspect images separately

For high diffs, inspect:

```text
left_region.png
right_region.png
```

before looking at:

```text
diff_only.png
diff_comparison.png
```

The combined triptych is useful for reports, but raw left/right crops are better for diagnosis.

### Artifact history

Generated runtime output goes to:

```text
prototype-design/visual-comparisons/cssvd-js/
```

Before committing, either delete it or copy useful artifacts into the ticket first:

```bash
mkdir -p ttmp/.../various/04-dashboard-first-run
cp -a prototype-design/visual-comparisons/cssvd-js/compare-spec/app-dashboard \
  ttmp/.../various/04-dashboard-first-run/
rm -rf prototype-design/visual-comparisons/cssvd-js prototype-design/visual-comparisons
```

---

## 11. Diary requirements

Every work chunk should add a diary entry with:

- prompt/context,
- what you changed,
- why,
- exact commands run,
- errors encountered,
- what worked,
- what did not work,
- visual-diff numbers if applicable,
- artifact folder path,
- what to review,
- next steps.

Diary file:

```text
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/reference/01-diary.md
```

Use short but precise entries. Future playbooks will be written from these notes.

---

## 12. First recommended implementation path

Do this first:

1. Scaffold `pyxis-app` package.
2. Add app types + RTK Query skeleton.
3. Add `AppShell` with responsive desktop/mobile shell behavior.
4. Add `MetricCard`.
5. Add `ActivityFeedItem`.
6. Add `DashboardOverview`.
7. Add `DashboardPage`.
8. Add `DashboardDesktop` and `DashboardMobile` stories.
9. Add desktop/mobile dashboard visual spec targets.
10. Run focused dashboard comparisons.

Why Dashboard first?

- It touches shell, metrics, activity, and core app data.
- It has both desktop and mobile prototype baselines.
- It proves the “one responsive page” rule early.
- It provides reusable components for later pages.

---

## 13. Common mistakes to avoid

### Mistake: Treating mobile as a separate app

Do not build a parallel mobile app unless explicitly approved. Build responsive pages.

### Mistake: Tuning page pixels before component/data parity

If data counts differ, visual diffs are noise. Align fixtures first.

### Mistake: Inspecting only `diff_comparison.png`

Use `left_region.png` and `right_region.png` first.

### Mistake: Broad selectors

If selector scopes do not match, numbers are misleading.

### Mistake: Committing generated outputs

Copy useful artifacts to `various/NN-*`, then remove active generated output.

### Mistake: Adding native YAML configs

Do not add active `*.css-visual-diff.yml` configs. Use JS/YAML visual suite specs.

---

## 14. Definition of done for your first page

Your first page is done when:

- [ ] page uses RTK Query data or deterministic Storybook fixture data,
- [ ] component pieces are extracted and storybooked,
- [ ] page has desktop and mobile viewport stories,
- [ ] page root has `data-page`,
- [ ] important sections have `data-section`,
- [ ] desktop visual target exists,
- [ ] mobile visual target exists,
- [ ] focused visual comparisons have run,
- [ ] raw left/right crops were inspected,
- [ ] useful artifacts were preserved under `various/NN-*`,
- [ ] generated active artifacts were cleaned,
- [ ] typecheck passes,
- [ ] diary explains the work,
- [ ] commit is clean and reviewable.

---

## 15. If you get lost

Use this recovery checklist:

1. Stop editing.
2. Run `git status --short`.
3. Write down what you were trying to do in the diary.
4. If changes are experimental, save a patch in `experiments/`:

   ```bash
   git diff > ttmp/.../experiments/NN-description.patch
   ```

5. Re-read:

   ```text
   tasks.md
   design/01-pyxis-app-react-end-to-end-workflow-guide.md
   this playbook
   ```

6. Restart from the smallest failing unit: component story before page story, selector before CSS tuning, data fixture before pixel comparison.

The goal is not speed. The goal is a clean, repeatable, well-documented workflow that future developers can trust.
