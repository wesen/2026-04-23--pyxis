---
Title: Route and Section Inventory
Ticket: PYXIS-APP-REACT
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - pyxis
DocType: reference
Intent: route-section-inventory
Summary: Maps desktop full-app and mobile prototype baselines to one responsive pyxis-app route/page model and records initial section/component candidates.
---

# Route and Section Inventory

Generated with `scripts/02-inventory-prototype-routes.mjs` plus manual review of the prototype routes and source modules.

## Route model

| React route/page | Desktop prototype baseline | Mobile prototype baseline | Root selector | Key sections |
|---|---|---|---|---|
| `LoginPage` | `standalone/full-app/login.html` | `standalone/mobile/login.html` | `data-page="login"` | `login-card`, `login-action` |
| `SetupPage` | `standalone/full-app/setup.html` | N/A | `data-page="setup"` | `setup-discord-map`, `setup-actions` |
| `DashboardPage` | `standalone/full-app/dashboard.html` | `standalone/mobile/home.html` | `data-page="dashboard"` | `dashboard-summary`, `dashboard-metrics`, `dashboard-upcoming`, `dashboard-activity` |
| `ShowsPage` | `standalone/full-app/shows.html` | `standalone/mobile/shows.html` | `data-page="shows"` | `shows-confirmed`, `shows-archived`, `shows-list` |
| `ShowDetailPage` | N/A | `standalone/mobile/show-detail.html` | `data-page="show-detail"` | `show-detail-header`, `show-detail-meta`, `show-detail-actions` |
| `CalendarPage` | `standalone/full-app/calendar.html` | `standalone/mobile/calendar.html` | `data-page="calendar"` | `calendar-month`, `calendar-agenda`, `calendar-today` |
| `BookingsPage` | `standalone/full-app/bookings.html` | `standalone/mobile/bookings.html` | `data-page="bookings"` | `bookings-queue`, `bookings-processed`, `bookings-rhythm` |
| `BookingReviewPage` | N/A | `standalone/mobile/booking-review.html` | `data-page="booking-review"` | `booking-review-summary`, `booking-review-actions` |
| `ArtistsPage` | `standalone/full-app/artists.html` | `standalone/mobile/artists.html` | `data-page="artists"` | `artists-roster`, `artists-search` |
| `ArtistDetailPage` | N/A | `standalone/mobile/artist-detail.html` | `data-page="artist-detail"` | `artist-detail-header`, `artist-detail-history`, `artist-detail-notes` |
| `AttendancePage` / `PostShowPage` | `standalone/full-app/attendance.html` | `standalone/mobile/post-show.html` | `data-page="attendance"` / `data-page="post-show"` | `attendance-past-shows`, `attendance-stats`, `post-show-form` |
| `AuditLogPage` | `standalone/full-app/log.html` | N/A | `data-page="audit-log"` | `audit-log-activity` |
| `DiscordPage` | `standalone/full-app/discord.html` | N/A | `data-page="discord"` | `discord-server`, `discord-channel-mapping`, `discord-bot-actions` |
| `SettingsPage` | `standalone/full-app/settings.html` | `standalone/mobile/settings.html` | `data-page="settings"` | `settings-space-info`, `settings-staff`, `settings-danger-zone` |
| `NewShowModal` | `standalone/full-app/modal.html` | N/A | `data-pyxis-component="new-show-modal"` | `modal-header`, `modal-form`, `modal-footer` |

## Repeated component candidates

- `MetricCard` for dashboard counts and post-show stats.
- `StatusDot` for show, booking, calendar, activity, and Discord status.
- `DateChip` for show rows/cards and mobile list cards.
- `ActivityFeedItem` for dashboard and audit log.
- `TodayShowCard` for dashboard upcoming shows.
- `ShowTableRow` with responsive card/list fallback.
- `BookingQueueRow` / `BookingCard` for desktop table and mobile queue.
- `ArtistRosterRow` / `ArtistCard` for desktop roster and mobile cards.
- `CalendarEventChip` for month grid and mobile agenda.
- `AttendanceStat` for post-show summary metrics.
- `DiscordChannelRow` and `SettingsToggleRow` for configuration surfaces.
- Shell organisms: `AppShell`, `AppSidebar`, `AppTopBar`, and `AppBottomNav`.

## Desktop/mobile layout decisions

- The React implementation should keep one page component per route and use CSS media queries for the 390px mobile baseline.
- The app shell is the main intentional desktop/mobile shell split: desktop uses a fixed sidebar, mobile uses bottom navigation.
- Tables become cards or horizontally scrollable tables depending on information density. Booking and artist lists already have explicit card variants because the mobile baselines are card-first.
- Detail-only mobile baselines (`show-detail`, `artist-detail`, `booking-review`, `post-show`) remain route requirements for later phases; Phase 6 created shared rows/cards/panels that these pages can reuse.

## Selector gaps in prototypes

The current generated standalone full-app and mobile pages do not expose stable `data-page` / `data-section` selectors on their rendered app surfaces. The React package now emits the intended selector contract. Prototype selector enrichment should be a separate selector-only commit before serious visual tuning.

Raw route DOM snapshot: `various/02-route-section-dom-snapshot.json`.
