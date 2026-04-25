---
Title: Pyxis Full App Baseline Extraction Handover
Status: active
Topics:
  - frontend
  - css-visual-diff
  - prototype
  - baseline-extraction
  - handover
DocType: playbook
Intent: handoff
Owners: []
RelatedFiles:
  - Path: prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html
    Note: Full App prototype entrypoint to cover next; exclude foundations because they already exist.
  - Path: prototype-design/screens/auth-dash.jsx
    Note: Exports LoginScreen, SetupScreen, DashboardScreen.
  - Path: prototype-design/screens/shows-bookings.jsx
    Note: Exports ShowsScreen, BookingsScreen, AuditLogScreen.
  - Path: prototype-design/screens/roster.jsx
    Note: Exports ArtistsScreen, CalendarScreen, AttendanceScreen.
  - Path: prototype-design/screens/settings-discord.jsx
    Note: Exports DiscordScreen, SettingsScreen, ModalShowcase.
  - Path: prototype-design/-deprecated/visual-diff-scripts/11-generate-prototype-baseline-configs.mjs
    Note: Canonical config generator to extend.
  - Path: prototype-design/-deprecated/visual-diff-scripts/12-build-prototype-baseline-index.mjs
    Note: Rebuilds the browsable baseline index after new configs are added.
  - Path: prototype-design/-deprecated/visual-diff-scripts/13-serve-prototype-baseline-index.sh
    Note: Serves the baseline index locally.
  - Path: prototype-design/-deprecated/generated-output/baseline/index.html
    Note: Current browsable baseline index.
  - Path: docs/playbooks/02-html-prototype-baseline-extraction-playbook.md
    Note: Canonical baseline extraction playbook to follow for the detailed extraction loop.
ExternalSources: []
Summary: Handover for extracting the remaining Full App baseline from prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html without recomputing the whole existing baseline set.
LastUpdated: 2026-04-24T00:00:00Z
WhatFor: Use this when continuing baseline extraction for the non-foundations Full App prototype screens.
WhenToUse: When a colleague is tasked with finishing baseline extraction for Pyxis Full App screens after the public site, mobile screens, and foundations baseline already exist.
---

# Pyxis Full App Baseline Extraction Handover

> [!warning] Deprecated workflow
> This handover documents the historical Full App baseline extraction workflow. The referenced baseline configs, generated outputs, and old scripts have been quarantined under `prototype-design/-deprecated/`. Do not extend this workflow unless intentionally doing archaeology.

This handover is for the colleague who will extract the remaining baseline from:

```text
prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html
```

## Scope

**In scope:** every Full App screen **except** the Foundations/SystemPage baseline, which is already done.

**Out of scope:** recomputing or redesigning the existing baseline work for:

- public site pages,
- public components,
- mobile app screens,
- Full App foundations.

The current canonical prototype baseline workflow is already set up under:

```text
prototype-design/visual-diff/
prototype-design/visual-diff/scripts/
prototype-design/-deprecated/generated-output/baseline/
prototype-design/standalone/
```

Your job is to extend that workflow to the **remaining Full App screens**.

---

# 1. The most important warning

## Do **not** recompute the whole existing baseline as part of your inner loop.

This matters enough to repeat plainly:

> **Do not rerun the full existing baseline set while you are still authoring the new Full App screen configs.**

Why:

- the existing baseline already covers public pages, public components, mobile screens, and foundations,
- the new Full App work adds another large set of screens,
- `prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html` is huge and DesignCanvas-based,
- a full rerun of everything is slow, noisy, and unnecessary while you are still fixing selectors.

## Practical rule

While authoring the new Full App baselines:

- run **one config at a time**, or
- run a **small dedicated Full App sample subset**,
- rebuild the index only after the new configs are stable,
- only do a broad/full refresh if there is a very specific reason.

Do **not** use the current all-config full runner as your main iteration loop:

```bash
prototype-design/-deprecated/visual-diff-scripts/07-run-prototype-baseline-full.sh
```

That script scans the whole config directory and reruns everything.

Instead, during development, prefer:

```bash
css-visual-diff inspect \
  --config prototype-design/visual-diff/CONFIG.css-visual-diff.yml \
  --side original \
  --all-styles
```

without `--out`, so the config writes only its own canonical artifact directory.

---

# 2. Current state before you begin

The baseline system already exists and is working.

## Canonical locations

### Configs

```text
prototype-design/visual-diff/
prototype-design/-deprecated/visual-diff-native-configs/public-components/
prototype-design/visual-diff/scripts/
```

### Generated baseline

```text
prototype-design/-deprecated/generated-output/baseline/
```

### Browsable index

```text
prototype-design/-deprecated/generated-output/baseline/index.html
```

Served locally with:

```bash
prototype-design/-deprecated/visual-diff-scripts/13-serve-prototype-baseline-index.sh
```

URL:

```text
http://localhost:8795/index.html
```

## Current baseline totals

At handoff time, the baseline already contains:

- 1 foundations config
- 10 public page configs
- 18 public component configs
- 11 mobile screen configs

Total:

```text
40 configs
261 screenshots
261 computed-css.md
261 prepared.html
261 inspect.json
```

The foundations part of `Pyxis Full App.html` is already represented by:

```text
prototype-design/-deprecated/visual-diff-native-configs/prototype-foundations-system.css-visual-diff.yml
```

and writes to:

```text
prototype-design/-deprecated/generated-output/baseline/artifacts/foundations/system/
```

Do not replace or re-author that unless you discover a real defect.

---

# 3. What remains to extract from Pyxis Full App

From `prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html`, the remaining artboards are:

## Entry & onboarding

| Artboard ID | Label | Component | Source file |
|---|---|---|---|
| `login` | Login · Sign-in | `LoginScreen` | `prototype-design/screens/auth-dash.jsx` |
| `setup` | Setup · Wizard step 3 | `SetupScreen` | `prototype-design/screens/auth-dash.jsx` |

## Program

| Artboard ID | Label | Component | Source file |
|---|---|---|---|
| `dashboard` | Dashboard · Home | `DashboardScreen` | `prototype-design/screens/auth-dash.jsx` |
| `shows` | Shows · Index | `ShowsScreen` | `prototype-design/screens/shows-bookings.jsx` |
| `calendar` | Calendar · May 2025 | `CalendarScreen` | `prototype-design/screens/roster.jsx` |
| `bookings` | Bookings · Queue | `BookingsScreen` | `prototype-design/screens/shows-bookings.jsx` |
| `modal` | Shows · New show modal | `ModalShowcase` | `prototype-design/screens/settings-discord.jsx` |

## Roster & history

| Artboard ID | Label | Component | Source file |
|---|---|---|---|
| `artists` | Artists · Roster | `ArtistsScreen` | `prototype-design/screens/roster.jsx` |
| `attendance` | Post-show log | `AttendanceScreen` | `prototype-design/screens/roster.jsx` |

## Operate

| Artboard ID | Label | Component | Source file |
|---|---|---|---|
| `log` | Audit log | `AuditLogScreen` | `prototype-design/screens/shows-bookings.jsx` |
| `discord` | Discord · Channel mapping | `DiscordScreen` | `prototype-design/screens/settings-discord.jsx` |
| `settings` | Settings · Space | `SettingsScreen` | `prototype-design/screens/settings-discord.jsx` |

That is **11 new Full App screen baselines**.

---

# 4. Files you should read before making changes

Read these first.

## Pyxis-specific baseline workflow

```text
docs/playbooks/02-html-prototype-baseline-extraction-playbook.md
```

## Built-in css-visual-diff help

```bash
css-visual-diff help inspect-workflow
css-visual-diff help story-config-authoring
```

These help pages are worth actually reading in the terminal. They are concise and operationally correct.

Use this order:

```text
prepared HTML first
→ screenshot crop second
→ computed CSS third
→ full extraction last
```

## Source files to inspect

```text
prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html
prototype-design/screens/auth-dash.jsx
prototype-design/screens/shows-bookings.jsx
prototype-design/screens/roster.jsx
prototype-design/screens/settings-discord.jsx
prototype-design/lib/components.jsx
prototype-design/design-canvas.jsx
prototype-design/-deprecated/visual-diff-scripts/11-generate-prototype-baseline-configs.mjs
```

---

# 5. Recommended extraction strategy

Do **not** capture `Pyxis Full App.html` directly as a viewport screenshot.

It is a DesignCanvas file. The same rule that applied to public and mobile still applies here:

> Do not trust DesignCanvas screenshots. Build standalone entrypoints or clean prepared roots.

## Recommended approach

Create clean standalone HTML pages for the non-foundations Full App screens, just like we did for:

- `prototype-design/standalone/public/`
- `prototype-design/standalone/mobile/`

## Recommended new generator

Create a new repo-root script, for example:

```text
prototype-design/-deprecated/visual-diff-scripts/15-generate-standalone-full-app-html.mjs
```

Its job should be:

- generate one standalone HTML page per Full App screen,
- render a single named screen directly into `#root`,
- bypass `DesignCanvas`,
- use the standard app screen width/height:

```text
width: 1240
height: 760
```

## Suggested standalone output directory

```text
prototype-design/standalone/full-app/
```

Suggested files:

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

## Why this is the best next step

This keeps the Full App workflow consistent with what already works:

- public pages use standalone HTML,
- mobile screens use standalone HTML,
- foundations uses direct component rendering,
- Full App screens should also get clean standalone HTML instead of canvas capture.

---

# 6. How to structure the new configs

Extend:

```text
prototype-design/-deprecated/visual-diff-scripts/11-generate-prototype-baseline-configs.mjs
```

with a new group of entries for the Full App screens.

## Suggested config shape

Use per-screen configs like:

```text
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-login.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-setup.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-dashboard.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-shows.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-calendar.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-bookings.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-modal.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-artists.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-attendance.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-log.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-discord.css-visual-diff.yml
prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-settings.css-visual-diff.yml
```

## Suggested output directories

Write them under:

```text
prototype-design/-deprecated/generated-output/baseline/artifacts/full-app/
```

For example:

```text
prototype-design/-deprecated/generated-output/baseline/artifacts/full-app/login/
prototype-design/-deprecated/generated-output/baseline/artifacts/full-app/setup/
prototype-design/-deprecated/generated-output/baseline/artifacts/full-app/dashboard/
...
```

## Suggested metadata

Use:

```yaml
source_html: prototype-design/-deprecated/screenshots-and-imports/Pyxis Full App.html
```

and a screen-specific `urlPath` like:

```yaml
urlPath: standalone/full-app/dashboard.html
```

---

# 7. How to choose style probes

Do not overfit the first version.

The goal is not to perfectly decompose every atom on day one. The goal is to get stable, meaningful screen baselines.

## Start with screen-level structural probes

For each Full App screen, start with a conservative set like:

- `full-screen`
- `screen-shell`
- `header`
- `main-primary`
- `main-secondary` or `sidebar`
- one or two critical cards/tables/rows

You can add more detail after the first stable capture.

## Example screen-specific suggestions

### LoginScreen
Start with:
- full root
- left marquee panel
- right auth panel
- main headline
- Discord CTA button

### SetupScreen
Start with:
- full root
- progress strip
- main card
- first field row
- footer action row

### DashboardScreen
Start with:
- hero strip
- stats grid
- upcoming shows card
- quick actions card
- recent activity card
- bot status card
- needs-attention card

### ShowsScreen
Start with:
- filter row
- confirmed table card
- archived card
- first table row or table wrapper

### CalendarScreen
Start with:
- calendar shell
- month header
- calendar grid
- right summary card
- today card

### BookingsScreen
Start with:
- pending queue card
- first booking item
- processed table card
- insights card
- decline templates card

### ModalShowcase
Start with:
- background shell
- modal overlay
- modal content panel
- modal footer

### ArtistsScreen
Start with:
- featured cards grid
- first featured card
- table card
- first artist row

### AttendanceScreen
Start with:
- KPI strip
- past shows table card
- inline editor card
- attendance field block

### AuditLogScreen
Start with:
- filters column card
- activity card
- first log row

### DiscordScreen
Start with:
- server connection card
- channel mapping card
- first mapping row
- sidebar bot status card
- bot capabilities card

### SettingsScreen
Start with:
- left tab rail
- space info card
- staff & roles card
- danger zone card

## Important principle

Prefer stable wrappers over brittle micro-selectors at first.

If you have to choose between:

- a stable card wrapper, and
- a fragile nested selector into the third child of the fourth row,

choose the stable card wrapper first.

---

# 8. The actual iteration loop you should use

For each new Full App screen:

## Step 1: Generate or edit the standalone page

Create the standalone page under:

```text
prototype-design/standalone/full-app/
```

## Step 2: Generate the YAML config

Put it under:

```text
prototype-design/visual-diff/
```

## Step 3: Inspect prepared HTML first

Use either the built-in help flow or the direct command:

```bash
css-visual-diff html \
  --config prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-dashboard.css-visual-diff.yml \
  --side original \
  --root \
  --output-file /tmp/prototype-full-app-dashboard-root.html
```

Open the file and verify the expected screen exists.

## Step 4: Run one config only

Use:

```bash
css-visual-diff inspect \
  --config prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-dashboard.css-visual-diff.yml \
  --side original \
  --all-styles
```

Let the config write to its canonical `output.dir`.

## Step 5: Inspect PNGs with the `read` image tool

Do not trust dimensions alone.

You want to confirm:

- no DesignCanvas chrome,
- correct screen,
- correct crop,
- visible loaded text/fonts,
- no accidental wrapper or blank area.

## Step 6: Fix selectors and rerun only that config

Do not expand to the full batch yet.

## Step 7: Repeat for a few screens

Once several representative screens are stable, create or update a **dedicated Full App sample runner**.

---

# 9. Strong recommendation: make a dedicated Full App sample runner

Do not overload the current generic sample runner immediately.

Instead, create a new script, for example:

```text
prototype-design/-deprecated/visual-diff-scripts/16-run-full-app-screen-sample.sh
```

Use it for a focused subset such as:

- login
- dashboard
- shows
- modal
- discord
- settings

Why:

- those cover the main layout varieties,
- they expose common selector issues early,
- they avoid re-running public/mobile/foundations while you iterate.

This script should write to something like:

```text
prototype-design/-deprecated/generated-output/baseline/sample-full-app/
```

This is much safer and faster than repeatedly invoking the global all-config full runner.

---

# 10. When to rebuild the manifest/index

After you have:

- the standalone generator working,
- the new Full App YAML configs generated,
- and some or all of the new screen artifacts captured,

then rebuild the manifest and index:

```bash
node prototype-design/-deprecated/visual-diff-scripts/11-generate-prototype-baseline-configs.mjs
node prototype-design/-deprecated/visual-diff-scripts/12-build-prototype-baseline-index.mjs
prototype-design/-deprecated/visual-diff-scripts/13-serve-prototype-baseline-index.sh
```

Review at:

```text
http://localhost:8795/index.html
```

The index should get a new section or at least entries for the Full App screens.

---

# 11. Do not make these mistakes

## Mistake 1: using `Pyxis Full App.html` directly as a screenshot target
Wrong because you will capture DesignCanvas, not the screen.

## Mistake 2: rerunning the whole current baseline in the authoring loop
Wrong because it wastes time and recomputes already-valid baselines.

## Mistake 3: starting with tiny fragile selectors
Wrong because brittle selectors hide the actual layout problems.

## Mistake 4: trusting one PNG without checking prepared HTML
Wrong because the selector may be matching the wrong element.

## Mistake 5: touching foundations unless necessary
Wrong because foundations already have a working baseline and are not the task.

---

# 12. Recommended concrete first steps

If you were starting this tomorrow, do exactly this:

1. Read:
   ```bash
   css-visual-diff help inspect-workflow
   css-visual-diff help story-config-authoring
   ```
2. Read:
   ```text
   docs/playbooks/02-html-prototype-baseline-extraction-playbook.md
   ```
3. Create:
   ```text
   prototype-design/-deprecated/visual-diff-scripts/15-generate-standalone-full-app-html.mjs
   ```
4. Generate:
   ```text
   prototype-design/standalone/full-app/*.html
   ```
5. Add one config only:
   ```text
   prototype-design/-deprecated/visual-diff-native-configs/prototype-full-app-login.css-visual-diff.yml
   ```
6. Run only that config.
7. Inspect PNG + prepared HTML.
8. Add dashboard next.
9. Add shows next.
10. Once 4–6 screens are stable, create the dedicated Full App sample runner.
11. Only then finish the remaining screens.
12. Rebuild the index.

---

# 13. Definition of done

This handoff is complete when the colleague can:

- point at a clean standalone HTML page for each non-foundations Full App screen,
- point at a canonical `prototype-design/visual-diff/*.css-visual-diff.yml` config for each screen,
- open screen artifacts under `prototype-design/-deprecated/generated-output/baseline/artifacts/full-app/...`,
- inspect them in `prototype-design/-deprecated/generated-output/baseline/index.html`,
- and do all that **without** rerunning the already-existing public/mobile/foundations baseline set during the normal authoring loop.

That last condition matters.

> The work is not “good” if it technically functions but forces repeated recomputation of the whole baseline catalog.

The correct continuation path is **targeted, incremental, repo-local, and standalone-based**.
