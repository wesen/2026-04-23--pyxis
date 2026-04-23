# Tasks

## TODO

- [x] Add tasks here

- [x] Phase 1 — Project Setup: Create web/ directory, initialize pnpm workspace, configure Vite for both packages, set up TypeScript, ESLint, Prettier, GitHub Actions CI
- [x] Phase 2 — Design Tokens: Create tokens.css with all CSS custom properties, create tokens.ts TypeScript constants, set up font loading (Fraunces, Inter, JetBrains Mono), set up Storybook with token decorator
- [x] Phase 3 — Atoms (Part 1): Build Icon component with all 28 SVG icons, create Button component with all 6 variants and 3 sizes, add Badge component with all 12 statuses
- [x] Phase 3 — Atoms (Part 2): Build Tag, Input, Select, Textarea, Avatar components, write comprehensive Storybook stories for all atoms with MSW mocks
- [x] Phase 4 — Molecules: Build Card, CardHead, Stat, Field, Table, Empty, LogRow components with Storybook stories
- [x] Phase 5 — Organisms: Build TopBar, Modal, NavItem, Sidebar components with Storybook stories
- [x] Phase 6 — Public Site Components: Build PubNav, PubFooter, PubHero, PubShowRow, TicketStub, LineupRow, VenueCard components
- [x] Phase 6 — Public Site Components (Part 2): Build MailingListCTA, BookingForm, BookingSuccess, ArchiveStats, YearGroup, SpaceInfo, BookingRules, AboutHero, EthosStrip, write Storybook stories for all public components
- [x] Phase 7 — API Integration: Set up API client with RTK Query, define TypeScript types, create React Query hooks, implement MSW handlers for mock data, add error handling and loading states
- [x] Phase 8 — Pages (Part 1): Build Layout component with PubNav/PubFooter, build Shows page (/), build ShowDetail page (/shows/:id)
- [x] Phase 8 — Pages (Part 2): Build Archive page (/archive), Book page (/book), BookSuccess page (/book/success), About page (/about), 404/error page
- [x] Phase 9 — Polish: Add meta tags/SEO, favicon, sitemap.xml, robots.txt, performance optimization, accessibility audit, cross-browser testing
- [x] Phase 10 — Deployment: Set up preview deployments (Vercel/Netlify), configure production environment variables, set up custom domain, enable analytics, set up Sentry error tracking

## Prototype-parity Storybook and visual repair pass

Goal: before wiring the real backend, every public Pyxis page from `prototype-design/Pyxis Public Site.html` / `PPXDesktop` / `PPXMobile` should be represented in Storybook with deterministic mock data and stable selectors, then compared against the prototype with `css-visual-diff` until page-level differences are explainable and small.

### Phase 11 — Storybook infrastructure for the user site

- [x] 11.1 Create/restore `pyxis-user-site` Storybook config (`.storybook/main.ts`, `.storybook/preview.tsx`) so page stories under `web/packages/pyxis-user-site/stories/` are actually indexed and runnable.
- [x] 11.2 Add Storybook decorators for `QueryClientProvider`, `MemoryRouter`, Pyxis global CSS, component tokens, and MSW handlers.
- [x] 11.3 Add viewport parameters for exact prototype sizes: desktop `920px` content shell / `1200px` viewport and mobile `390x844`.
- [ ] 11.4 Add a deterministic mock-data layer that matches prototype page content and poster ordering, not generic seed data.
- [x] 11.5 Add stable page-level selectors (`data-page`, `data-region`, `data-section`) to layout/page roots so visual diff configs do not rely on brittle DOM selectors.

### Phase 12 — Atom parity before page repair

- [x] 12.1 Fix `Button` parity against prototype: md size `8px 16px`, `13px`, no forced `40px` height, `500` weight, `8px` radius, correct icon sizing.
- [x] 12.2 Re-run `11-run-pyxis-atom-diff.sh`; record top remaining button diffs and commit.
- [x] 12.3 Fix `Badge` parity: `11px`, `500`, `2px 9px`, `line-height: 1.6`, dot size and gap.
- [x] 12.4 Fix `Tag` parity: `11px`, `2px 8px`, `R.xs`, surface/border colors, inline vs inline-block behavior.
- [x] 12.5 Fix `Input` parity: field label typography, `8px 11px`, icon left offset `32px`, `13px`, `R.sm`, surface color.
- [x] 12.6 Fix `Select` parity: same field base as input, select-specific chevron behavior, padding parity.
- [x] 12.7 Fix `Icon` / `IconButton` parity: SVG display, stroke, size, button dimensions, radius.
- [x] 12.8 Fix `Avatar` parity: initials, size mapping, color, font weight/size.
- [ ] 12.9 Re-run atom diff and Z.ai/Gemini `llm-review` selectively for the worst remaining atom diffs; record findings.

### Phase 13 — Page Storybook coverage for every public prototype page

- [x] 13.1 Shows desktop story: `PPXDesktop({ page: 'shows' })` equivalent at 920px, poster grid, nav, footer, deterministic shows.
- [x] 13.2 Shows mobile story: `PPXMobile({ page: 'shows' })` equivalent at 390x844.
- [x] 13.3 Show detail desktop story: `page: 'detail'` equivalent, event hero/detail content, ticket CTA, related/meta sections.
- [x] 13.4 Show detail mobile story.
- [x] 13.5 Archive desktop story: `page: 'archive'` equivalent, year groups and archived shows.
- [x] 13.6 Archive mobile story.
- [x] 13.7 Book desktop story: `page: 'book'` equivalent, booking form/rules/space info.
- [x] 13.8 Book mobile story.
- [x] 13.9 About desktop story: `page: 'about'` equivalent, about hero, ethos strip, space info.
- [x] 13.10 About mobile story.
- [x] 13.11 Add error/loading/empty state stories for each route where API state can affect layout.

### Phase 14 — Page-level css-visual-diff configs and scripts

- [x] 14.1 Add css-visual-diff config for Storybook Shows desktop vs prototype Shows desktop.
- [ ] 14.2 Add config for Shows mobile.
- [ ] 14.3 Add config for Show detail desktop/mobile.
- [ ] 14.4 Add config for Archive desktop/mobile.
- [ ] 14.5 Add config for Book desktop/mobile.
- [ ] 14.6 Add config for About desktop/mobile.
- [ ] 14.7 Add numbered ticket scripts to run all page diffs and serve reports.
- [ ] 14.8 Ensure each report writes `test.html`, PNGs, prepared HTML, inspect JSON, validation, CSS diffs, and pixel diffs.

### Phase 15 — Page visual repair loop

- [ ] 15.1 Repair global shell differences: body/canvas color, 920px shell width, white page background, nav spacing, footer spacing.
- [ ] 15.2 Repair Shows page grid, poster tiles, row metadata, ticket buttons, responsive/mobile layout.
- [ ] 15.3 Repair Show detail page layout and CTA hierarchy.
- [ ] 15.4 Repair Archive page typography, grouping, spacing, and mobile behavior.
- [ ] 15.5 Repair Book page form/rules layout and mobile behavior.
- [ ] 15.6 Repair About page hero/ethos/location content and mobile behavior.
- [ ] 15.7 Re-run full Storybook page diffs after each page repair and commit focused changes.

### Phase 16 — Backend-readiness handoff

- [ ] 16.1 Verify all public page stories run entirely from MSW/mock data and do not require the real backend.
- [ ] 16.2 Document required API payload shapes discovered during Storybook parity work.
- [ ] 16.3 Add a final Storybook coverage checklist and screenshots/report links to the ticket diary.
- [ ] 16.4 Mark pages ready for real backend wiring only after Storybook parity and mock API behavior are stable.
