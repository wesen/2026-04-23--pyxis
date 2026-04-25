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

## Required loop order

1. Verify prototype and React selectors exist.
2. Run a focused comparison.
3. Inspect individual crops first with the `read` tool:
   - `left_region.png`,
   - `right_region.png`.
4. Only after crops are comparable, inspect `diff_only.png` for residual pixel drift.
5. Treat `diff_comparison.png` as optional context, not the validation source.
6. Make the smallest CSS/token/story/data change suggested by the evidence.
7. Rerun the focused comparison.
8. Record changed percent, changed pixels, crop dimensions, and accepted differences in the diary.
9. Commit at a coherent milestone.

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
- Mock data mismatch: align fixture data before tuning style.
- Missing prototype selectors: add selector-only prototype changes and commit separately.
- Judging from `diff_comparison.png`: use individual crops first.
- Tool output too verbose: add or refine a JS verb summary flag and keep full JSON on disk.
- Generated artifacts landing in active source paths: move them to ticket `various/NN-*` folders or ignored output directories.
