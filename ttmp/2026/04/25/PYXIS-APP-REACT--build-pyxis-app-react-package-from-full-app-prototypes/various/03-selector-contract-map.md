---
Title: Selector Contract Map
Ticket: PYXIS-APP-REACT
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
DocType: reference
Intent: selector-contract
Summary: Maps prototype route/page/section selectors to the initial React pyxis-app selector contract.
---

# Selector Contract Map

## Contract rules

- Page roots use `data-page="..."`.
- Page sections use `data-section="..."`.
- Reusable component roots use `data-pyxis-component="..." data-pyxis-part="root"`.
- Reusable component internals use the same component name plus a stable part name.
- Desktop and mobile variants use the same page/section names whenever they represent the same route or section.

## Page selectors

| Page | Prototype selector target | React selector |
|---|---|---|
| Login | add `data-page="login"` to prototype login root | `main[data-page="login"]` |
| Setup | add `data-page="setup"` to setup root | `main[data-page="setup"]` |
| Dashboard | add `data-page="dashboard"` to dashboard app root | `[data-page="dashboard"]` |
| Shows | add `data-page="shows"` to shows app root | `[data-page="shows"]` |
| Calendar | add `data-page="calendar"` to calendar app root | `[data-page="calendar"]` |
| Bookings | add `data-page="bookings"` to bookings app root | `[data-page="bookings"]` |
| Artists | add `data-page="artists"` to artists app root | `[data-page="artists"]` |
| Attendance/Post-show | add `data-page="attendance"` / `data-page="post-show"` | `[data-page="attendance"]` now; post-show detail later |
| Audit log | add `data-page="audit-log"` to log app root | `[data-page="audit-log"]` |
| Discord | add `data-page="discord"` to Discord app root | `[data-page="discord"]` |
| Settings | add `data-page="settings"` to settings app root | `[data-page="settings"]` |
| New show modal | add `data-pyxis-component="new-show-modal"` to modal panel | `[data-pyxis-component="new-show-modal"]` |

## Section selectors implemented in React

| Section | React selector | Notes |
|---|---|---|
| Dashboard summary | `[data-section="dashboard-summary"]` | Wraps the whole dashboard overview. |
| Dashboard metrics | `[data-section="dashboard-metrics"]` | Metric-card grid. |
| Dashboard upcoming | `[data-section="dashboard-upcoming"]` | Upcoming show cards. |
| Dashboard activity | `[data-section="dashboard-activity"]` | Recent activity list. |
| Shows confirmed | `[data-section="shows-confirmed"]` | Confirmed show table/list. |
| Shows archived | `[data-section="shows-archived"]` | Archived show table/list. |
| Calendar month | `[data-section="calendar-month"]` | Month grid plus chips. |
| Bookings queue | `[data-section="bookings-queue"]` | Desktop table and mobile cards. |
| Artists roster | `[data-section="artists-roster"]` | Desktop table and mobile cards. |
| Attendance past shows | `[data-section="attendance-past-shows"]` | Metrics plus show log cards. |
| Audit log activity | `[data-section="audit-log-activity"]` | Activity-feed list. |
| Discord channel mapping | `[data-section="discord-channel-mapping"]` | Channel mapping rows. |
| Settings space info | `[data-section="settings-space-info"]` | Space settings and toggles. |

## Component selectors implemented in React

| Component | Selector |
|---|---|
| `StatusDot` | `[data-pyxis-component="status-dot"]` |
| `DateChip` | `[data-pyxis-component="date-chip"]` with `kicker` and `date` parts |
| `MetricCard` | `[data-pyxis-component="metric-card"]` with `label`, `value`, `caption` parts |
| `ActivityFeedItem` | `[data-pyxis-component="activity-feed-item"]` |
| `TodayShowCard` | `[data-pyxis-component="today-show-card"]` |
| `ShowTableRow` | `[data-pyxis-component="show-table-row"]` |
| `BookingCard` | `[data-pyxis-component="booking-card"]` |
| `BookingQueueRow` | `[data-pyxis-component="booking-queue-row"]` |
| `ArtistCard` | `[data-pyxis-component="artist-card"]` |
| `ArtistRosterRow` | `[data-pyxis-component="artist-roster-row"]` |
| `CalendarEventChip` | `[data-pyxis-component="calendar-event-chip"]` |
| `AttendanceStat` | `[data-pyxis-component="attendance-stat"]` |
| `DiscordChannelRow` | `[data-pyxis-component="discord-channel-row"]` |
| `SettingsToggleRow` | `[data-pyxis-component="settings-toggle-row"]` |
| `AppShell` | `[data-pyxis-component="app-shell"]` |
| `AppSidebar` | `[data-pyxis-component="app-sidebar"]` |
| `AppTopBar` | `[data-pyxis-component="app-topbar"]` |
| `AppBottomNav` | `[data-pyxis-component="app-bottom-nav"]` |
| `DashboardOverview` | `[data-pyxis-component="dashboard-overview"]` |
| `Panel` | `[data-pyxis-component="panel"]` |
| `NewShowModal` | `[data-pyxis-component="new-show-modal"]` |

## Prototype work still needed

The standalone prototype pages currently render mostly unannotated HTML. Before tuning visual diffs, add selectors to the prototype JSX sources in a selector-only pass:

- `prototype-design/screens/auth-dash.jsx`
- `prototype-design/screens/shows-bookings.jsx`
- `prototype-design/screens/roster.jsx`
- `prototype-design/screens/settings-discord.jsx`
- `prototype-design/screens/mobile.jsx`

Keep that commit separate from React implementation changes so visual-diff selector changes are easy to review.
