# Changelog

## 2026-04-25

- Initial workspace created

- Added source inventory script/output and wrote detailed pyxis-app React end-to-end workflow guide.
- Uploaded `PYXIS App React Workflow Guide` bundle to reMarkable under `/ai/2026/04/25/PYXIS-APP-REACT`.
- Corrected pyxis-app architecture so mobile is a responsive viewport variant of the main app, not a separate app.
- Rewrote task list as detailed intern handoff and added `playbooks/01-pyxis-app-react-intern-playbook.md`.
- Uploaded `PYXIS App React Intern Handoff` bundle to reMarkable under `/ai/2026/04/25/PYXIS-APP-REACT`.
- Committed intern handoff playbook, detailed tasks, responsive mobile correction, and upload notes.

## 2026-04-25

Step 5: Completed phases 0-6 with pyxis-app scaffold, app data contracts, responsive shell/components, initial visual specs, and route/selector docs (commit 05b60dad9ef797b0ca29045e14c6218fc9955353)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/App.tsx — New responsive app package route entry
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-types/src/app.ts — New staff app type contracts


## 2026-04-25

Step 7: Proved the component-level css-visual-diff loop with MetricCard; final like-for-like crop is in review band at 3.7242% / 1170 changed pixels (commits bb41b0c and 3946816)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/specs/app.components.visual.yml — MetricCard spec now uses like-for-like selectors
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/MetricCard.css — CSS tuned from individual crop evidence


## 2026-04-25

Step 8: Proved dashboard metrics section visual loop and added compare-spec --section/--summary output; final section crop is review-band at 7.4449% / 9801 pixels (commit 666db83420d99c6d38b5425187af0763e0c8ede9)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/verbs/pyxis-pages.js — Compact summary output for visual iteration
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/playbooks/02-pyxis-app-css-visual-improvement-loop.md — Runbook note for tuning tool output and not chasing pixel perfection


## 2026-04-25

Step 9: Finished Phase 6C visual improvement runbook with compact-output, stop-when-close, and cohesive-theme/token guidance (commit d7f3692199b72a4933a5389c090c87230f753f89)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/05-bottom-up-component-visual-parity.md — Central doc pointer
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/playbooks/02-pyxis-app-css-visual-improvement-loop.md — Runbook for future pyxis-app visual tuning


## 2026-04-25

Step 10: Hardened pyxis-app theme tokens before Phase 7 and validated unchanged MetricCard/dashboard-metrics review-band diffs (commit fba5369)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/06-css-loop-dashboard-metrics/run-09-token-hardening — Dashboard metrics validation artifacts
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/styles/app-tokens.css — Shared variables for surfaces


## 2026-04-25

Step 11: Composed responsive Dashboard page checkpoint with hero, metrics, upcoming, quick actions, attention/activity, and desktop/mobile visual runs (commit dadc31b)

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/07-dashboard-page — Phase 7 visual artifacts
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.tsx — Dashboard composition


## 2026-04-25

Step 16: Consolidated Dashboard upcoming shows organism; extracted DashboardUpcomingPanel, reused show/date/status molecules, added Storybook states, and recorded review-band focused visual result 6.5581% / 29541 px (commit 7510483).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/09-dashboard-upcoming-consolidation/run-04-date-inline/dashboard/artifacts/upcoming/right_region.png — Final visual crop evidence
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/ShowTableRow.tsx — Dashboard row variant
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.tsx — DashboardUpcomingPanel extraction
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/stories/AppDashboardSections.stories.tsx — Upcoming panel stories

