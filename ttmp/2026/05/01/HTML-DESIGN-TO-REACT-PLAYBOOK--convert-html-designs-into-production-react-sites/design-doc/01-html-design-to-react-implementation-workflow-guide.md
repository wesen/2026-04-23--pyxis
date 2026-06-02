---
Title: HTML Design to React Implementation Workflow Guide
Ticket: HTML-DESIGN-TO-REACT-PLAYBOOK
Status: active
Topics:
    - frontend
    - react
    - storybook
    - visual-diff
    - design-system
    - automation
DocType: design-doc
Intent: implementation-guide
Owners: []
RelatedFiles:
    - Path: ../../../../../../../corporate-headquarters/css-visual-diff
      Note: Current css-visual-diff JavaScript API and CLI reference
    - Path: prototype-design/screens
      Note: Pyxis Claude-style JSX screen sources used to derive page, section, and component inventory.
    - Path: prototype-design/standalone
      Note: |-
        Pyxis standalone prototype pages used as visual baselines.
        Standalone Pyxis prototype baselines that inspired Phase 1
    - Path: prototype-design/visual-diff/userland
      Note: |-
        Current Pyxis JavaScript-first css-visual-diff workflow layer.
        Canonical Pyxis JavaScript-first visual-diff userland
    - Path: ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/corporate-headquarters/css-visual-diff
      Note: Current css-visual-diff tool implementation and JavaScript API reference.
    - Path: web/packages/pyxis-app/src
      Note: |-
        Staff app page and section decomposition patterns.
        Staff app page-section decomposition examples
    - Path: web/packages/pyxis-components/src
      Note: |-
        Final reusable atoms, molecules, organisms, public-domain components, stories, and CSS ownership patterns.
        React component taxonomy and Storybook examples
ExternalSources: []
Summary: Detailed intern-facing playbook for converting Claude-style HTML/JSX designs into finished React websites using standalone pages, component taxonomy, Storybook, css-visual-diff JavaScript scripts, and iterative visual review.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# HTML Design to React Implementation Workflow Guide

## 1. Executive summary

This guide explains how to convert a Claude-style HTML/JSX prototype into a finished React website or app. It is based on the Pyxis conversion, which began with prototype pages under `prototype-design/` and evolved into typed React packages, Storybook stories, css-visual-diff visual suites, and production pages.

The recommended workflow is:

```text
Claude HTML/JSX prototype
  -> standalone browser pages
  -> source inventory and selector map
  -> atom/molecule/organism/page taxonomy
  -> typed React components and Storybook stories
  -> css-visual-diff JavaScript userland specs/scripts
  -> bottom-up visual tuning with compact artifacts
  -> page-level checkpoints
  -> accepted differences, docs, and production integration
```

The key rules are:

1. Keep the prototype available as static standalone HTML so it can be served and compared in a browser.
2. Decompose the design before coding: identify pages, page sections, repeated components, domain objects, props, and state variants.
3. Build React bottom-up, not full-page-first.
4. Give every visual target stable selectors: `data-page`, `data-section`, `data-component` or project-specific `data-pyxis-component`, `data-part`, and `data-element`.
5. Use Storybook as the normal implementation workbench.
6. Use `css-visual-diff` through JavaScript verbs/scripts. The old native YAML manifest approach should not be revived.
7. Compare the smallest meaningful target, inspect the image/CSS evidence, make one focused change, and repeat.
8. Stop when the design is close enough and the remaining differences are understood. Pixel diffs are decision support, not a demand for mathematical identity.

## 2. Why this guide exists

The Pyxis project was the first large run of this process, so it contains a lot of trial and error. Early work tried broad visual comparisons and native YAML-style visual-diff configs. Later work converged on a better loop:

- standalone prototype pages are treated as visual specifications;
- React components are decomposed into atoms, molecules, organisms, and pages;
- Storybook stories exist for each layer;
- css-visual-diff is used as a JavaScript-first programmable tool;
- project-specific YAML specs, when useful, are just data consumed by JavaScript verbs;
- terminal output is compact while full artifacts remain on disk;
- screenshots, cropped images, computed CSS, and semantic snapshots guide CSS/token changes.

The current css-visual-diff README states that the tool is intentionally JavaScript-first and that the old native `run --config` YAML pipeline has been removed. It recommends writing JavaScript verbs that load project data such as YAML specs, JSON, registries, Storybook metadata, or ad-hoc selector lists (`../corporate-headquarters/css-visual-diff/README.md:3-5`, `:43-54`).

## 3. Current-state evidence from Pyxis

### 3.1 Prototype inputs

Pyxis prototype source lives in:

```text
prototype-design/
  lib/
    tokens.js
    data.js
    components.jsx
  screens/
    auth-dash.jsx
    mobile.jsx
    ppxis.jsx
    roster.jsx
    settings-discord.jsx
    shows-bookings.jsx
    system.jsx
  standalone/
    foundations/
    full-app/
    mobile/
    public/
```

The Pyxis app guide records the end-to-end target workflow from standalone pages, to component inventory, to Storybook, visual specs, css-visual-diff tuning, and accepted differences (`ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/design/01-pyxis-app-react-end-to-end-workflow-guide.md:53-67`). It also records that the standalone full-app and mobile indexes already existed and should be validated and extended, not rebuilt blindly (`...:160-167`).

For a new project, assume the prototype is not yet clean. Your first job is to make it browser-addressable and stable enough to inspect.

### 3.2 React output shape

Pyxis ended with a layered component system:

```text
web/packages/pyxis-components/src/
  atoms/
  molecules/
  organisms/
  public/
    atoms/
    molecules/
    organisms/

web/packages/pyxis-app/src/
  components/
    atoms/
    molecules/
    organisms/
  pages/
```

A generic atom example is `Button`, which exposes typed props for variant, size, icons, loading, and width (`web/packages/pyxis-components/src/atoms/Button/Button.tsx:8-15`), applies stable part selectors (`...:50-57`, `:83-85`), and imports its own CSS (`...:6`).

A public-domain molecule example is `ShowTile`, which exposes a typed `ShowTileProps` object (`web/packages/pyxis-components/src/public/molecules/ShowTile/ShowTile.tsx:17-23`), owns data-to-visual mapping helpers (`...:25-65`), sets CSS variables for local styling (`...:72-75`), and marks inner visual parts with stable selectors (`...:78-100`).

A page-section organism example is `DashboardHero`, which accepts typed app data and callbacks (`web/packages/pyxis-app/src/components/organisms/Dashboard/DashboardHero/DashboardHero.tsx:5-9`) and uses `data-section` plus `data-element` hooks for visual tuning (`...:14-22`).

### 3.3 Visual comparison output shape

The css-visual-diff README defines the middle-loop mental model: choose the smallest meaningful target, verify selectors, compare only that target, inspect compact artifacts, change one CSS/token/component detail, repeat, and run broader validation only after the local target is stable (`../corporate-headquarters/css-visual-diff/README.md:17-25`). It also lists the high-signal artifacts: compact summary JSON, structured compare JSON, prototype/implementation crops, diff images, computed CSS/style diffs, and semantic snapshots (`...:27-37`).

Pyxis userland lives at:

```text
prototype-design/visual-diff/userland/
  lib/
  specs/
  verbs/
  scripts/
  docs/
```

Its README describes a three-layer system: YAML visual suite specs as project data, registry/library modules, and registered css-visual-diff verbs (`prototype-design/visual-diff/userland/README.md:65-96`). The quick start serves prototype pages from `prototype-design`, Storybook from package-specific ports, then runs verbs such as `list-targets`, `inspect-section`, `compare-section`, `compare-page`, `compare-all`, and CI policy checks (`...:9-63`).

A Pyxis app visual spec shows the target shape:

```yaml
schemaVersion: pyxis.visual-suite.v1
name: app-pages-desktop
defaults:
  prototypeBase: http://localhost:7070
  storybookBase: http://localhost:6008
  viewport: { width: 1240, height: 900 }
  waitMs: 1000
  threshold: 30
  inspect: rich
  variant: desktop
policy:
  bands:
    - { name: accepted, maxChangedPercent: 0.5 }
    - { name: review, maxChangedPercent: 10 }
    - { name: tune-required, maxChangedPercent: 30 }
    - { name: major-mismatch, maxChangedPercent: 100 }
targets:
  - page: dashboard
    prototypePath: /standalone/full-app/dashboard.html
    storyId: pyxis-app-pages-pages--dashboard-desktop
    sections:
      - { name: hero, original: '[data-section="dashboard-hero"]', react: '[data-section="dashboard-hero"]' }
```

The real file records the same defaults, policy bands, Storybook ID, and page/section selector contracts (`prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml:1-60`).

## 4. Target architecture for a new conversion project

### 4.1 Repository layout

Use this layout unless the existing repo already has a strong convention:

```text
prototype-design/
  package.json or scripts/              # optional, only if needed to generate static pages
  source/ or screens/                   # original Claude HTML/JSX chunks
  lib/                                  # prototype data, tokens, helpers
  standalone/
    index.html
    pages/*.html or public/*.html       # browser-ready baseline pages
  visual-diff/
    userland/
      lib/                              # reusable script modules
      specs/                            # project YAML/JSON data consumed by JS
      verbs/                            # registered css-visual-diff commands
      scripts/                          # smoke/operator scripts

web/
  packages/
    design-components/ or app-components/
      src/
        tokens/
        atoms/
        molecules/
        organisms/
        pages or public/...
      .storybook/
    app/
      src/pages/
      src/routes/
      src/api/                          # if real data exists
      .storybook/
```

### 4.2 Responsibility boundaries

```text
Prototype standalone page
  visual source of truth, no production responsibilities

Atom
  smallest reusable visual/control primitive: button, badge, icon, input

Molecule
  reusable composition around one object or interaction: card, row, field, tile

Organism
  coherent page section or widget: hero, nav, table panel, booking form, calendar board

Page component
  route-level layout and state composition; owns data fetching, route params, loading/error/empty states

Storybook story
  isolated render harness for one component/page state; not production routing

Visual spec/script
  maps prototype URL + selector to Storybook URL + selector and writes evidence artifacts
```

The public taxonomy guide expresses the same separation: route pages own route params, navigation, RTK Query hooks, and page states; organisms own coherent public-site sections; molecules own reusable rows/cards/items and do not fetch data; atoms own tiny controls or markers.

### 4.3 Selector contract

Every visual target must have stable selectors before repeated tuning starts.

Recommended selector vocabulary:

```tsx
<main data-page="shows">
  <section data-section="shows-hero">
    <h1 data-element="page-title">Upcoming shows</h1>
  </section>

  <section data-section="shows-list">
    <ShowTile data-component="show-tile" />
  </section>
</main>
```

For component libraries, use a component/part helper similar to Pyxis:

```tsx
<button data-component="button" data-part="root" data-variant={variant}>
  <span data-part="label">Reserve ticket</span>
</button>
```

Why this matters:

- Storybook stories can be compared without brittle CSS selectors.
- Page sections can be tuned independently.
- `css-visual-diff inspect` can answer subelement questions.
- Future refactors can keep visual specs stable even when class names change.

## 5. Phase-by-phase workflow

### Phase 0: Create the ticket and evidence workspace

For doc-managed work, create a ticket before coding:

```bash
docmgr ticket create-ticket \
  --ticket NEW-SITE-REACT-CONVERSION \
  --title "Convert new site HTML design into React Storybook site" \
  --topics frontend,react,storybook,visual-diff,design-system

docmgr doc add --ticket NEW-SITE-REACT-CONVERSION --doc-type design-doc --title "Implementation guide"
docmgr doc add --ticket NEW-SITE-REACT-CONVERSION --doc-type reference --title "Investigation diary"
```

Add a diary entry for each major investigation/coding loop. Record commands, errors, artifacts, and why decisions changed.

### Phase 1: Preserve and normalize prototype inputs

Goal: produce standalone browser pages comparable by URL.

Tasks:

1. Copy original HTML/JSX into `prototype-design/source/` or `prototype-design/screens/` unchanged.
2. Create `prototype-design/standalone/index.html` with links to each page.
3. For each page, create a static `standalone/<group>/<page>.html`.
4. Ensure pages do not require hidden dev-server state.
5. Add page/section selectors to prototype markup.
6. Freeze fonts/assets or provide local fallbacks.
7. Capture a first screenshot of each standalone page.

Example standalone page skeleton:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Prototype - Shows</title>
  <link rel="stylesheet" href="../assets/prototype.css" />
</head>
<body>
  <main data-page="shows">
    <section data-section="shows-hero">...</section>
    <section data-section="shows-list">...</section>
  </main>
</body>
</html>
```

Run locally:

```bash
python3 -m http.server 7070 --directory prototype-design
open http://localhost:7070/standalone/index.html
```

Validation checklist:

- The page opens from a clean browser tab.
- The viewport and scroll height are deterministic.
- Important sections can be selected with `document.querySelector('[data-section="..."]')`.
- No external CDN or generated asset can disappear unexpectedly.

### Phase 2: Inventory the design before building React

Goal: understand what the design contains and decide the component taxonomy.

Create an inventory table with:

| Field | Description |
| --- | --- |
| Page | route/page name: shows, about, dashboard, settings |
| Section | hero, nav, filter bar, list, detail panel, footer |
| Repeated visual unit | card, row, chip, button, metric, poster, panel |
| Domain object | show, artist, booking, venue, article, product |
| State variants | empty, loading, selected, disabled, error, mobile, long text |
| Candidate layer | atom, molecule, organism, page |
| Source selector | prototype selector |
| React target selector | planned stable selector |

Use scripts where useful. For static HTML:

```js
// scripts/inventory-dom.mjs
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
await page.goto('http://localhost:7070/standalone/public/shows.html');

const sections = await page.$$eval('[data-section]', nodes => nodes.map(node => ({
  section: node.getAttribute('data-section'),
  tag: node.tagName.toLowerCase(),
  text: node.textContent.trim().slice(0, 120),
  classes: node.getAttribute('class'),
  bounds: node.getBoundingClientRect().toJSON?.() ?? {},
})));

console.log(JSON.stringify(sections, null, 2));
await browser.close();
```

If the prototype is JSX, inspect the JSX directly and record component-like functions, repeated class names, token constants, and fake data shapes.

Classification rules:

- If it is a basic visual/control primitive independent of domain nouns, make it an atom.
- If it represents one domain object or one small composition, make it a molecule.
- If it represents a complete page section, make it an organism.
- If it owns routing, data fetching, global state, or page-level loading/error handling, keep it in the page/app package.
- If the same shape appears three times with different content, extract it now.
- If the shape appears once but is large enough to tune visually, extract it as an organism anyway.

### Phase 3: Define data contracts and props

Goal: components should be typed around real concepts, not copied DOM fragments.

For each component, write props before implementation:

```ts
export type ShowTileProps = {
  show: {
    id: string;
    title: string;
    date: string;
    doorsTime?: string;
    genre?: string;
    age?: string;
    price?: string;
    flyerUrl?: string;
    reserveTicketEnabled?: boolean;
  };
  compact?: boolean;
  onSelect?: (showId: string) => void;
};
```

Good prop design:

- exposes domain data and semantic variants;
- avoids exposing arbitrary class soup from the prototype;
- keeps callbacks at the right level;
- supports Storybook states without API calls;
- allows CSS variables for localized styling where needed.

Bad prop design:

```ts
type BadProps = {
  htmlFromPrototype: string;
  exactClassName: string;
  redVersion: boolean;
  redVersionButLarge: boolean;
};
```

### Phase 4: Create Storybook and the first component slices

Goal: every component can be rendered and tuned in isolation.

Minimum setup per package:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6008",
    "build-storybook": "storybook build",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

Story file pattern:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ShowTile } from './ShowTile';
import { mockShow } from '../../mocks/shows';

const meta = {
  title: 'Public/Molecules/ShowTile',
  component: ShowTile,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ShowTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { show: mockShow },
};

export const SoldOut: Story = {
  args: { show: { ...mockShow, reserveTicketEnabled: false } },
};

export const Compact: Story = {
  args: { show: mockShow, compact: true },
};
```

Story requirements:

- Default state.
- Important visual variants.
- Empty/long-content/error states where relevant.
- Mobile/narrow state when layout changes.
- No route/API dependency for atom/molecule/organism stories.
- Stable story titles that mirror the source tree.

### Phase 5: Build the CSS architecture

Goal: CSS should be maintainable, reusable, and tunable.

Recommended hierarchy:

```text
src/tokens/
  tokens.css            # global design variables
  tokens.ts             # typed token names if needed

src/atoms/Button/
  Button.tsx
  Button.css
  Button.stories.tsx
  index.ts

src/molecules/ShowTile/
  ShowTile.tsx
  ShowTile.css
  ShowTile.stories.tsx
  index.ts
```

Rules from Pyxis experience:

1. A widget owns its CSS.
2. Do not rely on transitive CSS from child components.
3. Avoid large bucket CSS files once a section is stable.
4. Promote repeated values into tokens.
5. Use component-local CSS variables for intentional local overrides.
6. Do not patch every crop with private hard-coded colors and spacings.

The Pyxis CSS playbook warns that broad bucket stylesheets can become hidden dependencies and that stale/empty Vite-transformed CSS modules can silently remove styles from many Storybook organisms (`ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/playbooks/02-pyxis-app-css-visual-improvement-loop.md:43-60`). It also says shared visual differences should become tokens rather than one-off component patches (`...:62-79`).

### Phase 6: Create css-visual-diff userland scripts

Goal: compare prototype and React using repeatable, project-aware commands.

Use the current JS-first model:

```text
visual-diff/userland/
  lib/
    registry.js
    compare-region.js
    inspect.js
    markdown.js
    policies.js
    storybook.js
  specs/
    public-pages.desktop.visual.yml
    app.components.visual.yml
  verbs/
    project-pages.js
  scripts/
    smoke-list-targets.sh
    smoke-compare-section.sh
```

Spec data should name pages, variants, URLs, story IDs, selectors, viewport, and policy bands. JavaScript loads the spec and calls `css-visual-diff` APIs.

Minimal direct comparison command:

```bash
css-visual-diff compare \
  --url1 http://localhost:7070/standalone/public/shows.html \
  --selector1 '[data-section="shows-list"]' \
  --url2 'http://localhost:6008/iframe.html?id=public-pages-shows--default&viewMode=story' \
  --selector2 '[data-section="shows-list"]' \
  --viewport-w 1280 \
  --viewport-h 1600 \
  --threshold 30 \
  --out /tmp/new-site-shows-list
```

Preferred repeatable command through project verbs:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  project pages compare-spec \
  prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml \
  --page shows \
  --section shows-list \
  --outDir /tmp/new-site-shows-list \
  --summary \
  --output json
```

The operator loop should write full artifacts but print only:

- page/section/variant;
- classification and changed percent;
- selectors;
- bounds and crop dimensions;
- text/style/attribute diffs;
- paths to `left_region.png`, `right_region.png`, `diff_only.png`, `compare.json`, and `compare.md`.

This rule comes directly from the Pyxis app CSS playbook (`.../playbooks/02-pyxis-app-css-visual-improvement-loop.md:17-37`).

### Phase 7: Tune bottom-up

Goal: improve the implementation with the smallest possible feedback loop.

Recommended order:

```text
1. foundation tokens and fonts
2. atoms
3. molecules
4. organisms/page sections
5. route/page composition
6. responsive/mobile variants
7. full-site suite
```

Normal loop:

```text
choose target
  -> inspect selectors
  -> compare crop
  -> read left/right/diff images
  -> inspect CSS preset if needed
  -> make one code/CSS/token edit
  -> rerun same command
  -> record result and artifact path
```

Pseudocode:

```pseudo
for page in priority_pages:
  inventory page sections
  for component in reused_atoms_and_molecules(page):
    compare component story against prototype component crop
    while not close_enough(component):
      inspect focused CSS family
      edit token/component CSS
      rerun same component comparison
    document accepted differences

  for section in page.sections:
    compare section crop
    while not close_enough(section):
      if crop mismatch is caused by child component:
        return to child component story
      else if mismatch is theme-wide:
        edit shared tokens
      else:
        edit section CSS/markup
      rerun section comparison

  run page checkpoint
  record remaining differences
```

Do not start with full-page tuning for complex pages. The Pyxis playbook says full-page crops are useful checkpoints but too noisy for everyday tuning because shell, typography, table density, section order, and scroll-height differences overlap (`.../playbooks/02-pyxis-app-css-visual-improvement-loop.md:81-119`).

### Phase 8: Use image understanding and manual review deliberately

Goal: verify direction when numeric diffs are insufficient.

Use `read` for local artifact text/JSON/Markdown. Use image review tools such as `understand_image` for image crops when the next edit depends on human-like visual judgment.

Good prompt pattern:

```text
Compare the prototype crop and React crop. Focus only on the hero section.
Report the three biggest visual differences that can be changed with CSS.
Ignore anti-aliasing and tiny text rendering differences.
```

Inputs:

```text
/tmp/run/shows/artifacts/hero/left_region.png
/tmp/run/shows/artifacts/hero/right_region.png
/tmp/run/shows/artifacts/hero/diff_only.png
```

Use this when:

- the diff percentage improved but the visual hierarchy still feels wrong;
- the mismatch is about spacing, alignment, or hierarchy rather than a single CSS property;
- you need a sanity check before doing a broader page pass.

Do not use it as a replacement for CSS inspection. First compare and inspect; then use image understanding for judgment.

### Phase 9: Page integration and production readiness

Goal: turn visually tuned components into a working website/app.

For route pages:

- own data fetching, route params, and navigation;
- pass typed props into organisms;
- keep atom/molecule/organism stories free of route API requirements;
- add MSW or mock fixtures for page stories if data fetching is present;
- add smoke tests for critical routes;
- verify Vite build, Storybook build, typecheck, lint, and production serving.

Checklist:

```bash
pnpm --filter <components-package> typecheck
pnpm --filter <components-package> build-storybook
pnpm --filter <app-package> typecheck
pnpm --filter <app-package> build
pnpm --filter <app-package> build-storybook
```

Run a final visual suite only after focused work is stable:

```bash
css-visual-diff verbs \
  --repository prototype-design/visual-diff/userland \
  project pages compare-all \
  --mode ci \
  --maxChangedPercent 10 \
  --outDir /tmp/new-site-final-visual-suite \
  --output json
```

## 6. Detailed css-visual-diff script design

### 6.1 JavaScript API mental model

The css-visual-diff core supplies browser and artifact primitives. Project scripts supply meaning.

```js
const cvd = require('css-visual-diff');

async function compareTarget(target, outDir) {
  const leftUrl = `${target.prototypeBase}${target.prototypePath}`;
  const rightUrl = storybookIframeUrl(target.storybookBase, target.storyId);

  const comparison = await cvd.compare.region({
    left: {
      url: leftUrl,
      selector: target.sections[0].original,
      viewport: cvd.viewport(target.viewport.width, target.viewport.height),
      waitMs: target.waitMs,
    },
    right: {
      url: rightUrl,
      selector: target.sections[0].react,
      viewport: cvd.viewport(target.viewport.width, target.viewport.height),
      waitMs: target.waitMs,
    },
    threshold: target.threshold,
  });

  const written = await comparison.artifacts.write(outDir, ['json', 'markdown', 'images']);
  return summarize(comparison, written);
}
```

### 6.2 Registry pattern

A registry maps human names to URLs/selectors:

```js
function targetsFromSpec(spec) {
  return spec.targets.flatMap(target =>
    target.sections.map(section => ({
      key: `${target.page}:${target.variant}:${section.name}`,
      page: target.page,
      variant: target.variant ?? spec.defaults.variant,
      prototypeUrl: spec.defaults.prototypeBase + target.prototypePath,
      storybookUrl: iframeUrl(spec.defaults.storybookBase, target.storyId),
      originalSelector: section.original,
      reactSelector: section.react,
      viewport: target.viewport ?? spec.defaults.viewport,
      threshold: target.threshold ?? spec.defaults.threshold,
      policy: spec.policy,
      acceptedDifferences: [
        ...(spec.acceptedDifferences ?? []),
        ...(target.acceptedDifferences ?? []),
        ...(section.acceptedDifferences ?? []),
      ],
    }))
  );
}
```

### 6.3 Inspection before comparison

Always provide a way to ask: does the selector exist, is it visible, what are its bounds, and what styles matter?

```js
async function inspectSection({ url, selector, stylePreset, outDir }) {
  const browser = await cvd.browser();
  try {
    const page = await browser.page(url, { viewport: cvd.viewport(1280, 900), waitMs: 500 });
    const element = await cvd.extract(page.locator(selector), [
      cvd.extractors.exists(),
      cvd.extractors.visible(),
      cvd.extractors.text(),
      cvd.extractors.bounds(),
      cvd.extractors.computedStyle(stylePropsFor(stylePreset)),
      cvd.extractors.attributes(['class', 'data-page', 'data-section', 'data-component', 'data-part']),
    ]);
    await cvd.write.json(`${outDir}/inspect.json`, element);
    return element;
  } finally {
    await browser.close();
  }
}
```

### 6.4 Policy bands

Use policy bands to decide how much attention a target needs:

| Band | Meaning | Action |
| --- | --- | --- |
| `accepted` | Very close. | Move on unless review image looks wrong. |
| `review` | Close enough for human judgment. | Inspect artifacts, document accepted differences if understood. |
| `tune-required` | Meaningful drift. | Tune component/section before broader validation. |
| `major-mismatch` | Wrong selector, missing content, or very different layout. | Stop and fix structure/selector/data first. |

Do not use CI mode as the first tuning command. Use CI mode after local evidence is stable.

## 7. Common failure modes and fixes

### 7.1 Starting from a full-page diff

Symptom: huge changed percent, unclear next edit.

Fix:

1. Split the page into `data-section` targets.
2. Compare one organism/section.
3. If the section is still too broad, inspect a child element.
4. Return to full-page only as a checkpoint.

### 7.2 Selector drift

Symptom: comparison says major mismatch, but screenshots look like different regions.

Fix:

1. Run `inspect-section` on both sides.
2. Verify existence, visibility, text, and bounds.
3. Add stable selectors to prototype and React.
4. Avoid brittle `nth-child` selectors except as temporary diagnostics.

### 7.3 Component copied too literally from prototype

Symptom: React component works visually but has bad props, no reuse, no states.

Fix:

1. Define domain props.
2. Move fake data to story fixtures/mocks.
3. Split repeated pieces into atoms/molecules.
4. Add state stories.

### 7.4 CSS bucket dependency

Symptom: component looks correct in page but wrong in isolated Storybook.

Fix:

1. Move rules into the component's own CSS file.
2. Import that CSS from the component module.
3. Keep shared primitive CSS small and intentional.
4. Verify transformed Storybook CSS is non-empty if Vite behaves strangely.

### 7.5 Overfitting pixels

Symptom: many tiny edits improve one crop but make the site less cohesive.

Fix:

1. Decide whether the difference is theme-wide.
2. Move repeated values to tokens.
3. Compare one atom, one section, and one page after token edits.
4. Document accepted differences for anti-aliasing, shadows, gradients, and font rendering.

### 7.6 Old native visual-diff manifests reappear

Symptom: someone creates `*.css-visual-diff.yml` as if the Go CLI will run it directly.

Fix:

1. Stop extending that path.
2. Keep YAML only as project data if useful.
3. Load YAML from JavaScript userland and call the JS API/verbs.
4. Update docs/examples that imply native manifest support.

## 8. Intern implementation plan

### Week 1: Baselines and inventory

Deliverables:

- `prototype-design/standalone/index.html` and at least three target pages.
- First screenshot artifacts.
- Component inventory table.
- Initial selector map.
- Storybook package booting.

Commands:

```bash
python3 -m http.server 7070 --directory prototype-design
pnpm --filter <package> storybook
pnpm --filter <package> typecheck
```

### Week 2: Foundations and component library

Deliverables:

- tokens and font setup;
- atoms with stories;
- first molecules with stories;
- first css-visual-diff component comparison script;
- diary entries with artifacts.

Acceptance:

- Atoms and first molecules render in Storybook.
- Each visual component has stable selectors.
- At least one component comparison writes left/right/diff images.

### Week 3: Organisms and page sections

Deliverables:

- extracted organisms for one priority page;
- page story with mock data;
- visual spec with page sections;
- repeated tuning loop documented.

Acceptance:

- Section-level comparisons are in `review` or `accepted`, or differences are documented.
- Full-page checkpoint no longer shows structural mismatches.

### Week 4: Remaining pages and production integration

Deliverables:

- remaining routes composed;
- responsive variants;
- final visual suite summary;
- production build and Storybook build;
- accepted-differences document.

Acceptance:

- CI-style visual suite is below chosen threshold or has documented accepted differences.
- App build, Storybook build, typecheck, and smoke route tests pass.

## 9. Review checklist

Before declaring the conversion complete:

- [ ] All prototype pages used for comparison are committed or archived.
- [ ] Every compared page/section has stable selectors on both sides.
- [ ] All atoms/molecules/organisms have colocated stories.
- [ ] Route pages own data and navigation; lower components do not fetch route data.
- [ ] CSS ownership is local to widgets or intentionally shared through tokens/primitives.
- [ ] Visual specs are project data interpreted by JavaScript userland, not old native manifests.
- [ ] Component comparisons were run before page comparisons.
- [ ] Full artifacts are stored outside source or under ticket `various/` if important evidence.
- [ ] Accepted differences are documented.
- [ ] Typecheck/build/Storybook build pass.

## 10. References

Primary Pyxis references:

- `prototype-design/standalone/` — standalone prototype baselines.
- `prototype-design/screens/` — Claude-style JSX screen sources.
- `prototype-design/visual-diff/userland/README.md` — Pyxis visual-diff userland quick start and architecture.
- `prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml` — app page visual spec example.
- `../corporate-headquarters/css-visual-diff/README.md` — current JS-first css-visual-diff API and operator model.
- `web/packages/pyxis-components/src/atoms/Button/Button.tsx` — typed atom, stable part selectors, and CSS import example.
- `web/packages/pyxis-components/src/public/molecules/ShowTile/ShowTile.tsx` — domain molecule example.
- `web/packages/pyxis-app/src/components/organisms/Dashboard/DashboardHero/DashboardHero.tsx` — page-section organism with `data-section`/`data-element` hooks.
- `ttmp/2026/05/01/HTML-DESIGN-TO-REACT-PLAYBOOK--convert-html-designs-into-production-react-sites/reference/02-pyxis-workflow-evidence-map.md` — where to look for Pyxis workflow evidence and historical docs.

The short version: preserve the prototype, name the sections, decompose the system, write stories, compare the smallest target, tune with evidence, and only then trust full-page visual numbers.
