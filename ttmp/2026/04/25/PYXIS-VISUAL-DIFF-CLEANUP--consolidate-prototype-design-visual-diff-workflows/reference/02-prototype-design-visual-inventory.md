---
Title: Prototype-design visual-diff inventory and classification
Ticket: PYXIS-VISUAL-DIFF-CLEANUP
Status: active
Topics:
    - frontend
    - visual-diff
    - storybook
    - automation
    - pyxis
DocType: reference
Intent: short-term
Owners: []
RelatedFiles:
    - Path:       Note: Representative retired native config classified for later removal
    - Path: prototype-design/visual-diff/userland/lib/registry.js
      Note: Default target loader/normalizer rewired away from hard-coded PUBLIC_PAGES
    - Path: prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
      Note: Stable full-suite validation script after script reorganization
    - Path: prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
      Note: Canonical public-page visual suite spec classified during Phase 1 and formalized in Phase 2
    - Path: prototype-design/visual-diff/userland/verbs/pyxis-pages.js
      Note: Promoted JS verbs simplified by removing transition commands
ExternalSources: []
Summary: Phase 1 tracked inventory of prototype-design visual assets, configs, generated outputs, and cleanup classifications.
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Prototype-design visual-diff inventory and classification

Generated during Phase 1 cleanup and refreshed after the Phase 3 JS-userland simplification. This inventory classifies current filesystem paths under `prototype-design` for the JS-canonical visual-diff cleanup.

## Classification vocabulary

| Class | Meaning | Action |
| --- | --- | --- |
| canonical-source | Active source for prototype pages, Storybook fixtures, JS userland, suite specs, or fixture preparation. | Keep and document. |
| retired-native | Old native `css-visual-diff run` config or native-run wrapper. | Mine for useful data, then remove/archive outside active workflow paths. |
| generated | Tool output under visual-comparison or Storybook catalog paths. | Do not commit new outputs unless explicitly requested. |
| generated-historical | Large tracked baseline/sample corpus. | Review separately before deleting; do not treat as current workflow source. |
| needs-review | `prototype-design` path not classified by the current cleanup rules. | Inspect before modifying. |

## Counts

| Class | Count |
| --- | ---: |
| canonical-source | 84 |
| retired-native | 72 |
| generated | 2914 |
| generated-historical | 3465 |
| needs-review | 190 |

## Key decisions from inventory

- `prototype-design/visual-diff/userland/**` is the promoted JS-canonical workflow, after Phase 3 simplification.
- `prototype-design/visual-diff/comparisons/**/*.css-visual-diff.yml` and `prototype-design/visual-diff/public-components/*.css-visual-diff.yml` are retired native-run inputs; public-page configs were removed after migration to the visual suite spec.
- `prototype-design/visual-comparisons/**` and `prototype-design/storybook-catalog/**` are generated output, not source.
- `prototype-design/baseline/**` is large generated/historical evidence and should be handled in a later targeted pass.
- Deleted transition scripts and old-output readers are intentionally absent from canonical source.

## Canonical source paths

```text
prototype-design/lib/components.jsx
prototype-design/lib/data.js
prototype-design/lib/tokens.js
prototype-design/screens/auth-dash.jsx
prototype-design/screens/mobile.jsx
prototype-design/screens/ppxis.jsx
prototype-design/screens/public.jsx
prototype-design/screens/roster.jsx
prototype-design/screens/settings-discord.jsx
prototype-design/screens/shows-bookings.jsx
prototype-design/screens/system.jsx
prototype-design/standalone/foundations/index.html
prototype-design/standalone/foundations/system.html
prototype-design/standalone/full-app/artists.html
prototype-design/standalone/full-app/attendance.html
prototype-design/standalone/full-app/bookings.html
prototype-design/standalone/full-app/calendar.html
prototype-design/standalone/full-app/dashboard.html
prototype-design/standalone/full-app/discord.html
prototype-design/standalone/full-app/index.html
prototype-design/standalone/full-app/log.html
prototype-design/standalone/full-app/login.html
prototype-design/standalone/full-app/modal.html
prototype-design/standalone/full-app/settings.html
prototype-design/standalone/full-app/setup.html
prototype-design/standalone/full-app/shows.html
prototype-design/standalone/index.html
prototype-design/standalone/mobile/artist-detail.html
prototype-design/standalone/mobile/artists.html
prototype-design/standalone/mobile/booking-review.html
prototype-design/standalone/mobile/bookings.html
prototype-design/standalone/mobile/calendar.html
prototype-design/standalone/mobile/home.html
prototype-design/standalone/mobile/index.html
prototype-design/standalone/mobile/login.html
prototype-design/standalone/mobile/post-show.html
prototype-design/standalone/mobile/settings.html
prototype-design/standalone/mobile/show-detail.html
prototype-design/standalone/mobile/shows.html
prototype-design/standalone/public/about-mobile.html
prototype-design/standalone/public/about.html
prototype-design/standalone/public/archive-mobile.html
prototype-design/standalone/public/archive.html
prototype-design/standalone/public/book-mobile.html
prototype-design/standalone/public/book.html
prototype-design/standalone/public/detail-mobile.html
prototype-design/standalone/public/detail.html
prototype-design/standalone/public/index.html
prototype-design/standalone/public/shows-mobile.html
prototype-design/standalone/public/shows.html
prototype-design/visual-diff/scripts/fixtures/atom-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/molecule-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/organism-fixture-prepare.js
prototype-design/visual-diff/scripts/fixtures/public-fixture-prepare.js
prototype-design/visual-diff/userland/README.md
prototype-design/visual-diff/userland/lib/artifacts.js
prototype-design/visual-diff/userland/lib/compare-region.js
prototype-design/visual-diff/userland/lib/index.js
prototype-design/visual-diff/userland/lib/inspect.js
prototype-design/visual-diff/userland/lib/markdown.js
prototype-design/visual-diff/userland/lib/normalizers.js
prototype-design/visual-diff/userland/lib/policies.js
prototype-design/visual-diff/userland/lib/registry.js
prototype-design/visual-diff/userland/lib/slug.js
prototype-design/visual-diff/userland/lib/snapshot.js
prototype-design/visual-diff/userland/lib/storybook.js
prototype-design/visual-diff/userland/lib/styles.js
prototype-design/visual-diff/userland/lib/tolerances.js
prototype-design/visual-diff/userland/scripts/diagnose-shows-sections.sh
prototype-design/visual-diff/userland/scripts/run-compare-all-public-pages.sh
prototype-design/visual-diff/userland/scripts/run-compare-spec-public-pages.sh
prototype-design/visual-diff/userland/scripts/smoke-ci-policy-failure.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-all-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-page-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-section-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-compare-spec-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-diff-snapshots-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-inspect-section-archive.sh
prototype-design/visual-diff/userland/scripts/smoke-list-targets.sh
prototype-design/visual-diff/userland/scripts/smoke-snapshot-section-archive.sh
prototype-design/visual-diff/userland/specs/README.md
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.js
prototype-design/visual-diff/userland/specs/public-pages.desktop.visual.yml
prototype-design/visual-diff/userland/verbs/pyxis-pages.js
```

## Retired native configs and native-run inputs

These should not be maintained for backwards compatibility. Mine any useful data into `userland/specs/*.visual.yml`, then remove from active workflow paths.

```text
prototype-design/visual-diff/comparisons/component-system/atoms/avatar-md.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/badge-confirmed.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/button-primary.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/icon-button.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/icon-calendar.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/input-search.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/select-status.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/tag-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/atoms/textarea-notes.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
prototype-design/visual-diff/comparisons/component-system/molecules/card-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/card-head-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/empty-cta.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/field-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/field-error.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/log-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/stat-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/molecules/table-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/organisms/modal-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/organisms/topbar-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/about-intro-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-search-filters-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-show-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/archive-stats-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/collective-list-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/find-us-block-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/lineup-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/poster-redroom.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/pub-show-row-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/public-page-header-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/reserve-ticket-card-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/safer-space-agreement-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/safety-note-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/show-detail-header-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/show-meta-strip-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/show-tile-redroom.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/show-type-chips-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/ticket-stub-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/molecules/year-group-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/about-hero-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/archive-show-list-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-form-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-rules-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-space-aside-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/booking-success-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/ethos-grid-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/ethos-strip-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/mailing-list-cta-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-footer-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-hero-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/pub-nav-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/show-grid-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/space-info-default.css-visual-diff.yml
prototype-design/visual-diff/comparisons/component-system/public/organisms/venue-card-default.css-visual-diff.yml
prototype-design/visual-diff/public-components/footer-desktop.css-visual-diff.yml
prototype-design/visual-diff/public-components/footer-mobile.css-visual-diff.yml
prototype-design/visual-diff/public-components/nav-desktop.css-visual-diff.yml
prototype-design/visual-diff/public-components/nav-mobile.css-visual-diff.yml
prototype-design/visual-diff/public-components/page-header-shows.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-basement.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-cygnus.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-meetups.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-moor.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-orphx.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-petals.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-pixel808.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-redroom.css-visual-diff.yml
prototype-design/visual-diff/public-components/poster-zola.css-visual-diff.yml
prototype-design/visual-diff/public-components/show-grid-desktop.css-visual-diff.yml
prototype-design/visual-diff/public-components/show-grid-mobile.css-visual-diff.yml
prototype-design/visual-diff/public-components/show-tile-compact.css-visual-diff.yml
prototype-design/visual-diff/public-components/show-tile-redroom.css-visual-diff.yml
```

## Generated output paths present today

These are generated artifacts present in the worktree. Do not add new artifacts under these trees without explicit review. The list is abbreviated when large.

```text
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/atom-diff-fixture/default/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/avatar/default/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/avatar/playground/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/avatar/sizes/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/all-statuses/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/custom-text/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/default/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/live-indicator/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/on-dark-background/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/badge/playground/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/all-sizes/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/all-variants/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/danger-variant/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/default/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/disabled/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/discord-variant/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/story-root/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/story-root/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/full-width/inspect/original/story-root/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/capture-target/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/capture-target/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/capture-target/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/capture-target/metadata.json
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/capture-target/prepared.html
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/capture-target/screenshot.png
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/index.json
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/index.md
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/story-root/computed-css.json
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/story-root/computed-css.md
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/story-root/inspect.json
prototype-design/storybook-catalog/artifacts/atoms/button/icon-only/inspect/original/story-root/metadata.json
... 2664 more generated paths omitted; regenerate with `find prototype-design/visual-comparisons prototype-design/storybook-catalog -type f | sort`.
```

## Generated/historical baseline paths

`prototype-design/baseline/**` contains a large tracked baseline/sample corpus. The inventory counted it, but intentionally does not list every file here.

```text
prototype-design/baseline/**
```

## Needs-review paths

```text
prototype-design/01-desktop-shows.png
prototype-design/02-desktop-detail.png
prototype-design/03-desktop-archive.png
prototype-design/04-desktop-book.png
prototype-design/05-desktop-about.png
prototype-design/06-mobile-shows.png
prototype-design/07-mobile-detail.png
prototype-design/08-mobile-archive.png
prototype-design/09-mobile-book.png
prototype-design/10-mobile-about.png
prototype-design/Pyxis Full App.html
prototype-design/Pyxis Mobile.html
prototype-design/Pyxis Public Site.html
prototype-design/comp/01-desktop-shows-full.png
prototype-design/comp/02-desktop-shows-nav.png
prototype-design/comp/03-desktop-shows-heading.png
prototype-design/comp/04-desktop-shows-hero.png
prototype-design/comp/05-desktop-shows-list.png
prototype-design/comp/06-desktop-shows-footer.png
prototype-design/comp/07-desktop-show-row.png
prototype-design/comp/08-desktop-detail-full.png
prototype-design/comp/09-desktop-detail-hero.png
prototype-design/comp/10-desktop-detail-content.png
prototype-design/comp/11-desktop-archive-full.png
prototype-design/comp/12-desktop-archive-header.png
prototype-design/comp/13-desktop-archive-stats.png
prototype-design/comp/14-desktop-archive-years.png
prototype-design/comp/15-desktop-book-full.png
prototype-design/comp/16-desktop-book-form.png
prototype-design/comp/17-desktop-book-sidebar.png
prototype-design/comp/18-desktop-about-full.png
prototype-design/comp/19-desktop-about-hero.png
prototype-design/comp/20-mobile-shows-full.png
prototype-design/comp/21-mobile-shows-nav.png
prototype-design/design-canvas.jsx
prototype-design/direct/home/desktop-shows-full.png
prototype-design/direct/home/desktop-shows.html
prototype-design/direct/home/desktop-shows.inspect.json
prototype-design/direct/home/footer.png
prototype-design/direct/home/header.png
prototype-design/direct/home/heading-block.png
prototype-design/direct/home/main.png
prototype-design/direct/home/nav.png
prototype-design/direct/home/shows-grid.png
prototype-design/direct/review/home-old-vs-direct.png
prototype-design/ios-frame.jsx
prototype-design/prototype-overview.png
prototype-design/sql-api.md
prototype-design/uploads/pasted-1776956913224-0.png
prototype-design/uploads/showspace-dashboard-2.jsx
prototype-design/uploads/showspace-dashboard.jsx
prototype-design/uploads/showspace-public.jsx
prototype-design/visual-diff/prototype-foundations-system.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-artists.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-attendance.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-bookings.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-calendar.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-dashboard.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-discord.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-log.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-login.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-modal.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-settings.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-setup.css-visual-diff.yml
prototype-design/visual-diff/prototype-full-app-shows.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-artist-detail.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-artists.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-booking-review.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-bookings.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-calendar.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-home.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-login.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-post-show.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-settings.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-show-detail.css-visual-diff.yml
prototype-design/visual-diff/prototype-mobile-shows.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-about-mobile.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-about.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-archive-mobile.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-archive.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-book-mobile.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-book.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-detail-mobile.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-detail.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-shows-mobile.css-visual-diff.yml
prototype-design/visual-diff/prototype-public-shows.css-visual-diff.yml
prototype-design/visual-diff/scripts/06-run-prototype-baseline-sample.sh
prototype-design/visual-diff/scripts/07-run-prototype-baseline-full.sh
prototype-design/visual-diff/scripts/08-run-prototype-public-component-sample.sh
prototype-design/visual-diff/scripts/11-generate-prototype-baseline-configs.mjs
prototype-design/visual-diff/scripts/12-build-prototype-baseline-index.mjs
prototype-design/visual-diff/scripts/13-serve-prototype-baseline-index.sh
prototype-design/visual-diff/scripts/14-generate-standalone-mobile-html.mjs
prototype-design/visual-diff/scripts/15-generate-standalone-full-app-html.mjs
prototype-design/visual-diff/scripts/16-run-full-app-screen-sample.sh
prototype-design/visual-diff/scripts/17-run-full-app-baseline-full.sh
prototype-design/visual-diff/scripts/18-generate-storybook-design-system-configs.mjs
prototype-design/visual-diff/scripts/19-run-storybook-atoms-sample.sh
prototype-design/visual-diff/scripts/20-run-storybook-catalog-full.sh
prototype-design/visual-diff/scripts/21-build-storybook-catalog-index.mjs
prototype-design/visual-diff/scripts/22-serve-storybook-catalog-index.sh
prototype-design/visual-diff/storybook-components/atoms/atom-diff-fixture/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/avatar/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/avatar/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/avatar/sizes/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/badge/all-statuses/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/badge/custom-text/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/badge/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/badge/live-indicator/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/badge/on-dark-background/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/badge/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/all-sizes/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/all-variants/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/danger-variant/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/disabled/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/discord-variant/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/full-width/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/icon-only/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/loading/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/button/with-icons/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/all-icons/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/colors/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/in-button/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/pyxislogo/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/pyxismark/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/sizes/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/icon/with-inline-text/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/all-variants/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/disabled/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/password/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/with-error/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/with-hint/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/input/with-icon/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/select/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/select/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/tag/colored-tags/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/tag/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/tag/genre-tags/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/tag/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/textarea/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/textarea/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/atoms/textarea/with-error/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card-head/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card-head/title-only/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card/interactive/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card/playground/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card/sizes/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/card/with-header/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/empty/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/empty/no-action/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/field/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/field/states/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/field/with-error/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/log-row/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/log-row/lineup/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/stat/dashboard-set/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/stat/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/table/clickable-rows/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/molecules/table/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/organisms/modal/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/organisms/modal/large/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/organisms/top-bar/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/organisms/top-bar/no-actions/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/about-hero/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/archive-stats/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/booking-form/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/booking-rules/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/booking-success/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/ethos-strip/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/lineup-row/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/mailing-list-cta/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-footer/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-hero/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-nav/about-active/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-nav/archive-active/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-nav/book-active/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-nav/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-nav/interactive/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/pub-show-row/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/space-info/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/ticket-stub/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/venue-card/default/config.css-visual-diff.yml
prototype-design/visual-diff/storybook-components/public/year-group/default/config.css-visual-diff.yml
```

## Regeneration commands

```bash
find prototype-design -type f | sort
find prototype-design/visual-diff/userland -maxdepth 3 -type f | sort
find prototype-design/visual-diff/comparisons prototype-design/visual-diff/public-components -type f | sort
find prototype-design/visual-comparisons prototype-design/storybook-catalog -type f | sort
find prototype-design/baseline -type f | sort
```
