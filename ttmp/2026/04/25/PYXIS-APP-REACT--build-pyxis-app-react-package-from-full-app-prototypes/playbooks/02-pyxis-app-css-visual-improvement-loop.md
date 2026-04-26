---
Title: Pyxis App CSS Visual Improvement Loop
Ticket: PYXIS-APP-REACT
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
DocType: playbook
Intent: implementation-guide
Summary: Runbook for using css-visual-diff on pyxis-app with selector-first, individual-crop-first validation and compact operator output.
---

# Pyxis App CSS Visual Improvement Loop

## Rule zero: improve the tool output when it gets noisy

This workflow will be run many times. If a `css-visual-diff` command prints too much low-signal JSON, update the JS userland verb or script output instead of forcing reviewers to scan noise.

Preferred pattern:

1. Keep the full result on disk (`compare-all-output.json`, per-section `compare.json`, markdown reports, image artifacts).
2. Print only the operator summary needed for the next decision:
   - page, section, and variant,
   - classification and changed percent/pixels,
   - selectors,
   - bounds and normalized crop dimensions,
   - text changed status,
   - CSS/style diffs with left/right values,
   - attribute diffs when present,
   - artifact report paths,
   - `left_region.png`, `right_region.png`, `diff_only.png`, and optional `diff_comparison.png` paths.
3. Add a JS verb flag when the compact output is generally useful. For this ticket, `pyxis pages compare-spec --summary` now returns compact rows with enough style, bounds, text, attribute, pixel, selector, and artifact information for the normal loop.
4. Fall back to the full JSON only when the compact summary is missing information needed to debug.

The goal is: **all information needed, and no more, while preserving full evidence in artifacts**.

## Do not chase pixel perfection

Once individual crops are close and the comparison is in the `review` band, stop and document accepted differences if the remaining diff is mostly typography anti-aliasing, font rendering, gradients, shadows, or subtle browser rendering drift. Pixel diffs are evidence for decisions, not a requirement to make every screenshot mathematically identical.

## Keep CSS ownership local enough for Storybook

Do not let large bucket stylesheets become hidden dependencies for many unrelated stories. Broad files such as `Rows.css` or `Panels.css` are fragile in Vite/Storybook because a stale or empty transformed CSS module can silently remove styles from many organisms at once.

Preferred ownership model:

1. Atoms import their own atom CSS.
2. Molecules import their own molecule CSS plus small shared primitives such as `Table.css` when needed.
3. Organisms import their own section CSS, for example `DashboardSections.css`, `ShowsSections.css`, or `Phase8Sections.css`.
4. Generic shells such as `Panels.css` should contain only the reusable shell/utility rules for `Panel`, `.app-card-list`, `.app-empty-state`, and similar cross-section primitives.
5. Avoid relying on transitive CSS from a child component. If an organism's layout needs a rule, import that organism stylesheet from the organism module.

Use query-suffixed CSS imports such as `Panels.css?dashboard` only as a short-term diagnostic/workaround. If a suffix fixes an empty CSS module, follow up by splitting the stylesheet into owned component/organism files and removing the suffix from source imports.

Before accepting a split, verify at least one affected isolated Storybook story by fetching or inspecting the transformed CSS module: it should contain real CSS, not `const __vite__css = ""`.

## Keep the theme cohesive

Do not tune each component into a one-off clone of its current prototype crop. Use the visual loop to discover shared theme decisions, then encode those decisions in reusable tokens and variables.

Preferred order:

1. Fix selector/crop/data mismatches first.
2. Identify whether a visual difference is component-specific or theme-wide.
3. If it is theme-wide, update shared app tokens in `web/packages/pyxis-app/src/styles/app-tokens.css` or existing package tokens instead of patching one component.
4. If a component needs an override, expose a component-local CSS variable with a sensible default from the shared tokens.
5. Avoid hard-coded hex/spacing/font values in individual components unless they are temporary parity evidence; document those as follow-up token-hardening work.
6. Re-run a small component and one page section after token changes to make sure the theme still holds together.

Examples:

- Surface, border, shadow, radius, accent/status colors, body/display font, and base text sizes should come from shared variables.
- `MetricCard`, `TodayShowCard`, panels, rows, and shell surfaces should share the same surface/border/radius/shadow vocabulary.
- Do not make `MetricCard` look correct by introducing values that make dashboard panels or booking cards drift away from the same design language.

## Extract page sections before tuning the whole page

Do not tackle a full dashboard/page crop as the primary feedback loop once the page has more than a few regions. Full-page comparisons are useful checkpoints, but they are too noisy for everyday tuning because shell, typography, table density, section order, and scroll-height differences all overlap.

Preferred page workflow:

1. Start with the page inventory and identify organisms/sections such as:
   - `DashboardHero`,
   - `DashboardMetricsGrid`,
   - `DashboardUpcomingPanel`,
   - `DashboardQuickActionsPanel`,
   - `DashboardActivityPanel`,
   - `DashboardAttentionPanel`,
   - mobile bottom navigation or mobile header if they are page-specific enough.
2. Add stable `data-section` selectors to both prototype and React for each section before tuning.
3. Extract reusable React components/organisms for those sections instead of growing one large page component.
4. Add rich Storybook stories for every extracted section:
   - default desktop,
   - mobile/narrow when the section changes layout,
   - dense/empty/long-content states when relevant,
   - theme/token override examples if the section exposes local variables.
5. Compare and tune one extracted section at a time using `--section`, individual crop inspection, and `diff_only.png` only after crops are aligned.
6. If a page section is awkward to crop because it is below the fold or depends on full-column context, add a standalone organism story for focused structure/tuning, then validate the final section in the real page context before accepting it.
7. Promote repeated style decisions from section work into shared tokens as you go. This keeps the feedback loop small while preventing component-by-component token drift.
8. Re-run one small component, the focused section, and then an occasional full-page checkpoint after token changes.

Concrete example: for the dashboard, tune `DashboardUpcomingPanel` as an organism with its own Storybook story and focused visual spec before trying to improve the full dashboard page number. If its crop is close but the full page is still noisy, move to the next organism rather than overfitting the page.

Calendar example: tune `CalendarMonthPanel` as a standalone organism because the grid geometry, weekday labels, leading blank cells, and event chips are easy to validate in isolation. For `CalendarAgenda`, use the standalone story to verify content and local styling, but trust the full page `calendar-agenda` section checkpoint more for final acceptance because the prototype captures the entire right-column height and page context.

For multi-page work, split the backlog into one phase per route/page. Each page phase should begin by listing the organisms it needs and the atoms/molecules it should reuse. Do not start with a generic “remaining pages” pass. The per-page phase should prove consistency bottom-up:

1. atoms/molecules already exist or are extracted,
2. page-specific organisms are extracted and covered in Storybook,
3. shared values are promoted into tokens as repeated patterns appear,
4. section comparisons pass or reach an accepted review-band stop point,
5. only then does the page get a full-page checkpoint.

This keeps feedback loops small, prevents one page from inventing private visual rules, and makes the app feel like one cohesive system as each route is added.

## Use the tool at the right inspection depth

Do not treat the visual tool as only a screenshot diff. Use it flexibly at the level that matches the current question.

Recommended levels:

1. **Page checkpoint** — compare `section: page` only to understand overall drift, scroll height, shell alignment, and gross content gaps.
2. **Organism/section crop** — compare a stable `data-section` such as `dashboard-hero`, `dashboard-upcoming`, or `dashboard-activity` for normal tuning.
3. **Element/subelement inspection** — inspect nested selectors inside a section when the crop is close but a specific thing looks wrong: a button label, date text, icon, badge, table cell, or headline.
4. **CSS preset inspection** — ask for only the CSS family that matters:
   - `typography`: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `text-transform`, `color`, `opacity`, `visibility`.
   - `layout`: `display`, `position`, `width`, `height`, `min-height`, `gap`, flex/grid alignment, margins.
   - `spacing`: margins and padding only.
   - `surface`: background, border, radius, shadow.
   - `debug`: a larger mixed set when the focused presets do not explain the difference.

The normal `compare-spec --summary` output is intentionally root-level. If a problem is inside a section, do not keep guessing CSS from the root row. Add/use a spec-aware inspection verb that can query nested selectors on both the prototype and React sides and print compact rows for the selected CSS preset.

### Targeting subelements

Sufficiently stable selectors should exist for repeatable tuning. Prefer explicit `data-*` hooks where the subelement is important to visual parity:

```tsx
<section data-section="dashboard-hero">
  <p data-element="hero-date-line">
    <span data-element="hero-date">Fri, May 2, 2025</span>
    <span data-element="hero-doors">Doors 8:00 PM</span>
  </p>
  <div data-element="hero-actions">
    <Button data-element="hero-discord-action">View on Discord</Button>
    <Button data-element="hero-edit-action">Edit show</Button>
  </div>
</section>
```

If the prototype cannot easily receive matching `data-element` hooks yet, use selectors relative to the section crop as a temporary diagnostic, but prefer adding stable prototype + React hooks before repeated work.

Examples of useful subelement targets:

```text
[data-section="dashboard-hero"] [data-element="hero-discord-action"]
[data-section="dashboard-hero"] [data-element="hero-discord-action"] [data-pyxis-part="label"]
[data-section="dashboard-hero"] [data-element="hero-date-line"]
[data-section="dashboard-hero"] [data-element="hero-date"]
```

For third-party/shared components, target the part attributes too:

```text
[data-pyxis-component="button"][data-pyxis-part="root"]
[data-pyxis-component="button"] [data-pyxis-part="label"]
[data-pyxis-component="button"] [data-pyxis-part="icon-start"]
```

### How to dial in a specific Dashboard Hero element

For the **“View on Discord”** button:

1. Compare the whole hero section first:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages compare-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --summary \
  --outDir ttmp/.../various/14-dashboard-hero-consolidation/run-N \
  --output json
```

2. Inspect individual hero crops with `read`.
3. If the button is wrong, inspect the button root and label typography, not just the hero root. This command shape has been validated for this ticket via the `inspect-spec` verb:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --elements '[data-element="hero-discord-action"],[data-element="hero-discord-action"] [data-pyxis-part="label"]' \
  --stylePreset typography \
  --summary \
  --output json
```

Expected decision-critical output:

```json
{
  "element": "hero-discord-action label",
  "text": { "left": "View on Discord", "right": "View on Discord" },
  "bounds": { "left": { "width": 142, "height": 34 }, "right": { "width": 154, "height": 32 } },
  "styles": {
    "font-size": { "left": "13px", "right": "13px" },
    "font-weight": { "left": "600", "right": "700" },
    "letter-spacing": { "left": "normal", "right": "0.08em" },
    "text-transform": { "left": "none", "right": "uppercase" },
    "color": { "left": "rgb(255,255,255)", "right": "rgb(255,255,255)" }
  }
}
```

Then tune only the property that explains the mismatch. For example, if the label is invisible, inspect `color`, `opacity`, `visibility`, `overflow`, and the label part. If the label is clipped, inspect `width`, `height`, `padding`, `display`, and `white-space`.

For the **“Fri, May 2, 2025”** text in the hero:

1. Target the date line and individual date span:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --elements '[data-element="hero-date-line"],[data-element="hero-date"]' \
  --stylePreset typography \
  --summary \
  --output json
```

2. If the text content is different, fix data/copy first (`Fri, May 2, 2025` vs generated locale output).
3. If content is correct but visual placement is off, switch to layout/spacing:

```bash
# Same command shape, but use:
--stylePreset layout
# or:
--stylePreset spacing
```

4. If separators are wrong, inspect the child spans and CSS pseudo/markup strategy. Use actual spans/gaps when possible; pseudo separators can be harder to inspect and compare.

### When to improve the JS tool

If you need nested CSS information more than once, do not rely on ad-hoc Playwright snippets. Add or use a JS userland verb/flag that:

- accepts a spec path, page, section, and one or more element selectors,
- resolves prototype and React URLs/selectors from the spec,
- scopes element selectors under the section selector unless an absolute selector is requested,
- supports `--stylePreset typography|layout|surface|spacing|pageShell`,
- returns compact rows with text, bounds, styles, and attributes,
- writes full JSON under the ticket artifact folder when the output is too large for the terminal.

This is now implemented as `pyxis pages inspect-spec`. It accepts relative subelement selectors and `&` for the section root. Example validation command:

```bash
css-visual-diff verbs --repository prototype-design/visual-diff/userland \
  pyxis pages inspect-spec \
  prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml \
  --page dashboard \
  --section hero \
  --elements '[data-element="hero-discord-action"],[data-element="hero-date-line"],[data-element="hero-date"]' \
  --stylePreset typography \
  --summary \
  --output json
```

A useful pattern is to run `typography` first, then `layout` only if typography matches but the crop is still off. In the Dashboard Hero example, `inspect-spec` showed the `View on Discord` button typography matched after tuning, while `layout` showed the action group and date-line x/y/bounds differences that still explained residual pixel drift.

This keeps the workflow reproducible and diary-friendly.

## Required loop order

1. Verify prototype and React selectors exist.
2. Run a focused comparison.
3. Inspect individual crops first with the `read` tool:
   - `left_region.png`,
   - `right_region.png`.
4. Only after crops are comparable, inspect `diff_only.png` for residual pixel drift.
5. Treat `diff_comparison.png` as optional context, not the validation source.
6. Confirm the Storybook story actually loads the CSS needed by the organism. If a story stops rendering a child component that used to import a stylesheet, move the organism-critical rules into the organism stylesheet or import the stylesheet directly; otherwise an isolated story can silently lose styling even while the page looks correct.
7. Make the smallest CSS/token/story/data change suggested by the evidence.
8. Rerun the focused comparison.
9. Run a page-section checkpoint when the standalone organism crop has known context differences such as full-column height, below-the-fold placement, or wrapper width differences.
10. Record changed percent, changed pixels, crop dimensions, and accepted differences in the diary.
11. Commit at a coherent milestone.

## Commands

MetricCard component proof:

```bash
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/03-smoke-compare-metric-card.sh run-name
```

Dashboard metrics section proof:

```bash
ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/scripts/04-smoke-compare-dashboard-metrics.sh run-name
```

Both scripts print compact summaries and preserve full artifacts under numbered `various/` folders.

## Proven artifact examples

MetricCard component proof:

```text
various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/left_region.png
various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/right_region.png
various/05-css-loop-metric-card/run-05-final/metric-card/artifacts/component/diff_only.png
```

Dashboard metrics section proof:

```text
various/06-css-loop-dashboard-metrics/run-08-final/dashboard/artifacts/metrics/left_region.png
various/06-css-loop-dashboard-metrics/run-08-final/dashboard/artifacts/metrics/right_region.png
various/06-css-loop-dashboard-metrics/run-08-final/dashboard/artifacts/metrics/diff_only.png
```

## Failure modes

- Full-page-vs-component crop mismatch: fix selectors before CSS.
- Storybook wrapper padding changing crop bounds: adjust story wrapper or crop selector.
- Storybook organism missing CSS that only used to arrive through a child component import: import the stylesheet directly or move organism-critical rules into the organism stylesheet.
- Standalone organism crop has different vertical context than the prototype page column: use the story for local tuning, then accept/reject using the page-section crop.
- Mock data mismatch: align fixture data before tuning style.
- Missing prototype selectors: add selector-only prototype changes and commit separately.
- Judging from `diff_comparison.png`: use individual crops first.
- Tool output too verbose: add or refine a JS verb summary flag and keep full JSON on disk.
- Generated artifacts landing in active source paths: move them to ticket `various/NN-*` folders or ignored output directories.
