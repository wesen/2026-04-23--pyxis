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


## 2026-04-25

Step 17: Consolidated Dashboard quick actions; extracted DashboardQuickActionsPanel, reused Button/Icon props, matched side-column width, and recorded review-band focused visual result 9.8313% / 5946 px (commit 12cc17c).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/10-dashboard-quick-actions-consolidation/run-03-column-width/dashboard/artifacts/quick-actions/right_region.png — Final visual crop evidence
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx — Quick action button content
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.css — Dashboard side-column layout
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.tsx — DashboardQuickActionsPanel extraction


## 2026-04-25

Step 18: Consolidated Dashboard shell/header organisms and lightened the shared app canvas tokens; sidebar 6.3630% review, topbar 8.4701% review, desktop page checkpoint 11.4830% tune-required (commit 80661fc).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/specs/app.pages.desktop.visual.yml — Added sidebar/topbar focused specs
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/shell/AppShell.css — Shell/header/menu layout and responsive behavior
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/shell/AppShell.tsx — Extracted shell/header organisms
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/styles/app-tokens.css — Whiter canvas/surface token update


## 2026-04-25

Step 19: Added and validated spec-aware nested visual inspection for Dashboard Hero; button/date typography can now be inspected directly, but Hero remains tune-required at 18.0894% / 25862 px (commit ed55e40).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/screens/auth-dash.jsx — prototype Dashboard Hero data-element hooks
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/lib/styles.js — expanded typography/layout presets
- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/verbs/pyxis-pages.js — inspect-spec verb for nested element inspection
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-06-button-date-inspect/dashboard/artifacts/hero/right_region.png — Final Hero crop evidence for WIP checkpoint
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx — React Dashboard Hero data-element hooks and button/date tuning


## 2026-04-25

Step 20: Stopped Dashboard Hero work at a targeted title-typography checkpoint; hero-artist typography now has no inspect-spec style diffs and focused Hero improved to 11.2501% / 15432 px, still tune-required for non-title drift (commit b2fd3dc).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/various/14-dashboard-hero-consolidation/run-07-title-typography/dashboard/artifacts/hero/right_region.png — React Hero crop after title typography checkpoint
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.css — Dashboard Hero title margin and letter-spacing parity


## 2026-04-25

Step 21: Added standalone Dashboard organism Storybook files for Hero, MetricsGrid, Upcoming, QuickActions, Activity, and Attention; extracted DashboardMetricsGrid and DashboardAttentionPanel for direct no-scroll story targets (commit b1180ae).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardSections.tsx — DashboardMetricsGrid and typed attention item/content extraction
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.tsx — DashboardAttentionPanel organism wrapper and DashboardOverview reuse
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/stories/DashboardAttentionPanel.stories.tsx — Direct attention organism story target
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/stories/DashboardMetricsGrid.stories.tsx — Direct metrics organism story target


## 2026-04-25

Step 22: Refocused Shows tuning around extracted organisms and row atoms; confirmed panel reached review band and archived content now matches prototype (commits 4020ea8, b1d3c0b, f980631).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/Rows.css — Shows typography token consolidation
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/ShowsSections.tsx — Shows organism extraction


## 2026-04-25

Step 23: Tuned Bookings awaiting-review and recently-processed organisms; processed reached review band with matching text, queue now matches structure but remains tune-required (commit caeefa4).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/specs/app.components.visual.yml — Bookings focused visual targets
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/BookingCard.tsx — Bookings card/table tuning


## 2026-04-25

Step 24: Tuned Calendar month and agenda organisms; desktop Calendar page checkpoint reached review band across page/month/agenda (commit f3295d5).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.css — Calendar layout and agenda styling
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Phase8Sections.tsx — Calendar organism composition


## 2026-04-25

Step 25: Added Phase 8A and split pyxis-app CSS ownership after the Bookings Inbox Rows.css empty-module regression; typecheck passed and Bookings queue returned to its prior tuned state (commit 8ab1a74).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/BookingCard.css — Booking card CSS ownership split
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panels.css — Generic panel CSS trimmed after split


## 2026-04-25

Step 26: Continued Phase 8B widget folder architecture; atoms, molecules, Phase 8 organisms, Dashboard/Shows/Panel organisms now follow folder-per-widget pattern with compatibility barrels (commits 7463325, 2a686d9, 19c4872).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/BookingsInboxPanel/BookingsInboxPanel.tsx — BookingsInboxPanel widget folder
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardHero/DashboardHero.tsx — DashboardHero widget folder
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panel/Panel.tsx — Panel widget folder


## 2026-04-25

Step 27: Colocated pyxis-app Storybook stories with widget/page folders and removed the top-level stories folder while preserving visual-diff story IDs (commit df94c8e).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/MetricCard/MetricCard.stories.tsx — Colocated MetricCard story
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/BookingsInboxPanel/BookingsInboxPanel.stories.tsx — Colocated Bookings Inbox story


## 2026-04-25

Step 28: Updated colocated Storybook titles so the sidebar mirrors src folder structure, updated app visual spec story IDs, and reran component smoke checks (commit bd637d9).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/prototype-design/visual-diff/userland/specs/app.components.visual.yml — Story IDs updated after sidebar hierarchy change
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/BookingsInboxPanel/BookingsInboxPanel.stories.tsx — Story title mirrors widget folder


## 2026-04-25

Step 29: Added reusable React widget folder/CSS/Storybook organization guide and linked it from the visual parity playbooks (commit 27919aa).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/06-react-widget-folder-storybook-css-organization.md — Canonical React widget organization guide


## 2026-04-25

Step 30: Added detailed React application decomposition and pyxis-components reuse guide plus Phase 8C task plan for props/stories/RTK readiness (commit bfad5f8).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/07-react-application-decomposition-and-component-reuse.md — Detailed decomposition and reuse guide
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/25/PYXIS-APP-REACT--build-pyxis-app-react-package-from-full-app-prototypes/tasks.md — Phase 8C props/reuse/story plan


## 2026-04-25

Step 31: Started Phase 8C by adding named app atom prop types, richer atom stories, and a css-visual-diff guard loop for refactors (commit 40f1932).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/docs/playbooks/07-react-application-decomposition-and-component-reuse.md — Phase 8C visual guard loop
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/atoms/AgeBadge/AgeBadge.tsx — Named atom props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/atoms/StatusPill/StatusPill.tsx — Named atom props


## 2026-04-25

Step 32: Added named prop types and richer stories for core reusable molecules; metric-card visual guard remained stable and today-show-card spec issue was identified (commit c8f2537).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/ActivityFeedItem/ActivityFeedItem.tsx — Named molecule props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/CalendarEventChip/CalendarEventChip.tsx — Named molecule props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/MetricCard/MetricCard.tsx — Named molecule props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/TodayShowCard/TodayShowCard.tsx — Named molecule props


## 2026-04-25

Step 33: Added named props/stories for domain molecules, added BookingCard action callbacks, and reused pyxis-components Avatar in ArtistCard (commit 14e63b7).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/ArtistCard/ArtistCard.tsx — Artist card props and shared Avatar reuse
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/BookingCard/BookingCard.tsx — Booking molecule props and callbacks
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/ShowTableRow/ShowTableRow.tsx — Show row props


## 2026-04-25

Step 34: Added named props, callback forwarding, empty states, and richer stories for booking/show organisms (commit 78135d7).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/BookingsInboxPanel/BookingsInboxPanel.tsx — Booking callbacks forwarded to cards
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/Panel/Panel.tsx — PanelProps and stories
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/ShowsTable/ShowsTable.tsx — ShowsTableProps and stories


## 2026-04-25

Step 35: Added named props, callbacks, derived count handling, and richer stories for calendar organisms (commit 4b773b9).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/CalendarAgenda/CalendarAgenda.tsx — Calendar agenda props and callbacks
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/CalendarBoard/CalendarBoard.tsx — Calendar board props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/CalendarMonthPanel/CalendarMonthPanel.tsx — Calendar month panel props


## 2026-04-25

Step 36: Added named props, callbacks, mobile copy/header props, and richer stories for dashboard organisms (commit 104edbc).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardHero/DashboardHero.tsx — Dashboard hero props and callbacks
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardOverview/DashboardOverview.tsx — Dashboard overview props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/DashboardQuickActionsContent/DashboardQuickActionsContent.tsx — Dashboard quick action callbacks


## 2026-04-25

Step 37: Added named props, empty states, booking callbacks, and stories for route-support organisms (commit 2109537).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/ArtistRoster/ArtistRoster.tsx — Route support organism props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/BookingQueue/BookingQueue.tsx — Booking queue callbacks
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/SettingsPanel/SettingsPanel.tsx — Settings organism props


## 2026-04-26

Step 38: Added named props, callbacks, injectable copy, and richer stories for detail/review organisms and NewShowModal (commit a8c21fd).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/BookingReviewHero/BookingReviewHero.tsx — Review organism props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/NewShowModal/NewShowModal.tsx — Modal callback props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/organisms/ShowDetailHero/ShowDetailHero.tsx — Detail organism props


## 2026-04-26

Step 39: Added named props/types for AppShell/AppTopBar and AttendanceStat, expanded stories, and confirmed shell visual guards remain in review band (commit 8f41a51).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/AttendanceStat/AttendanceStat.tsx — Named AttendanceStat props
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/shell/AppShell.tsx — Shell props and typed nav/icon data


## 2026-04-26

Step 40: Started dedicated reuse by adding AppEmptyState around pyxis-components Empty and replacing duplicated app empty-state markup (commit 9bfa799).

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-app/src/components/molecules/AppEmptyState/AppEmptyState.tsx — App wrapper reusing pyxis-components Empty
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/molecules/Empty/Empty.tsx — Shared Empty accepts className for app wrappers

