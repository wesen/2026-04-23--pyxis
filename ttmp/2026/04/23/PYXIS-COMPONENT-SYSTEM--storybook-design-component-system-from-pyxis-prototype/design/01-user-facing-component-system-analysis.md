---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: prototype-design/lib/components.jsx
      Note: Component library source
    - Path: prototype-design/lib/tokens.js
      Note: Source design tokens
    - Path: prototype-design/screens/public.jsx
      Note: Public site screens
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---




# User-Facing Component System Analysis

## Purpose

Extract a production-ready React component library from the pyxis prototype design, focusing on the **user-facing web components** for both the public site and staff dashboard. Discord bot components are explicitly out of scope.

---

## 1. Design Token System

### Current Implementation

The prototype uses `window.PX` as a global object with flat token categories:

```javascript
window.PX = {
  color: { bg, surface, surface2, line, line2, ink, ink2, ink3, ink4, accent, accentLt, accentDk, ... },
  font: { serif, sans, mono },
  radius: { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, pill: 999 },
  shadow: { sm, md, lg, xl },
  space: { 1: 4, 2: 8, ... 10: 72 }
}
```

### Proposed Extraction

Convert to CSS custom properties with semantic naming:

```css
:root {
  /* Canvas & Surfaces */
  --color-canvas: #F3F1EB;
  --color-surface: #FFFFFF;
  --color-surface-raised: #FAF8F2;
  --color-border: #EAE6DD;
  --color-border-subtle: #F0EDE4;
  
  /* Text */
  --color-text-primary: #1A1A18;
  --color-text-secondary: #555048;
  --color-text-tertiary: #8A857B;
  --color-text-disabled: #B8B2A5;
  
  /* Accent (Crimson) */
  --color-accent: #C8270D;
  --color-accent-subtle: #FCEFEB;
  --color-accent-strong: #8E1B08;
  
  /* Semantic */
  --color-success: #3C7A4F;
  --color-success-subtle: #EAF3EC;
  --color-warning: #C97A0F;
  --color-warning-subtle: #FBF1DC;
  --color-info: #2E5D9E;
  --color-info-subtle: #E6EDF7;
  --color-muted: #6B6459;
  --color-muted-subtle: #EEEAE0;
  
  /* Typography */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 56px;
  --space-10: 72px;
  
  /* Radii */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(26,24,22,.04);
  --shadow-md: 0 2px 10px rgba(26,24,22,.06);
  --shadow-lg: 0 8px 32px rgba(26,24,22,.10);
  --shadow-xl: 0 20px 60px rgba(26,24,22,.18);
}
```

### Scope: **Low complexity** — straightforward mapping, no logic changes.

---

## 2. Component Inventory

### 2.1 Atoms

#### Icon (`<PxIcon>`)
| Aspect | Detail |
|--------|--------|
| Current | 22 thin-line SVG icons, size/color props |
| Icons | home, calendar, ticket, mail, users, cog, search, chev, plus, check, x, bell, pin, door, music, discord, edit, trash, ext, archive, filter, sparkle, dot, compass, warn, copy, reset, play |
| Props | `name`, `size` (default 16), `color` (default currentColor), `stroke` (default 1.6) |
| Storybook stories | Size variants (sm/md/lg), color variants (default/accent/muted), all icons gallery |

#### Button (`<PxButton>`)
| Aspect | Detail |
|--------|--------|
| Current | 7 variants: primary, dark, outline, ghost, danger, success, discord |
| Sizes | sm (6px 12px), md (8px 16px), lg (11px 22px) |
| Props | `variant`, `size`, `icon` (left), `iconRight` (right), `disabled`, `full`, `onClick`, `children` |
| States | default, hover (filter), active (scale), disabled (opacity + cursor) |
| Storybook stories | All variants × all sizes, icon placements, disabled state, loading state |

#### Badge (`<PxBadge>`)
| Aspect | Detail |
|--------|--------|
| Current | Status-based coloring with dot indicator |
| Statuses | confirmed, pending, approved, declined, cancelled, archived, hold, blocked, live, draft, needslog, logged |
| Props | `status` |
| Storybook stories | All status variants |

#### Tag (`<PxTag>`)
| Aspect | Detail |
|--------|--------|
| Current | Simple inline tag with border |
| Props | `children`, `color` (customizable text color) |
| Storybook stories | Default, colored variants |

#### Input (`<PxInput>`)
| Aspect | Detail |
|--------|--------|
| Current | Text, number, date, email types |
| Props | `value`, `onChange`, `placeholder`, `type`, `icon` (left icon slot), `disabled` |
| States | default, focus (handled by global CSS), disabled, with icon |
| Storybook stories | All types, with/without icon, disabled, error state |

#### Select (`<PxSelect>`)
| Aspect | Detail |
|--------|--------|
| Current | Native select wrapper |
| Props | `value`, `onChange`, `options` (array of strings or {value, label}), `disabled` |
| Storybook stories | Default, disabled, option variants |

#### Textarea (`<PxTextarea>`)
| Aspect | Detail |
|--------|--------|
| Current | Resizable vertical |
| Props | `value`, `onChange`, `placeholder`, `rows` (default 3), `disabled` |
| Storybook stories | Default, disabled, custom rows |

#### Avatar (`<PxAvatar>`)
| Aspect | Detail |
|--------|--------|
| Current | Initials from name, circular, customizable tone color |
| Props | `name` (for initials), `size` (default 32), `tone` (background color) |
| Storybook stories | Size variants, color variants |

### Scope: **Low complexity** — pure presentational, minimal props.

---

### 2.2 Molecules

#### Field (`<PxField>`)
| Aspect | Detail |
|--------|--------|
| Current | Label + input slot + hint |
| Props | `label`, `hint`, `children` (the input) |
| Usage | Wraps Input, Select, Textarea |
| Storybook stories | With each input type, with/without hint |

#### Card (`<PxCard>`)
| Aspect | Detail |
|--------|--------|
| Current | Surface container with border, radius, shadow, padding |
| Props | `padding` (default 22), `interactive` (cursor pointer), `style` |
| Storybook stories | Default, compact (padding-sm), interactive hover |

#### CardHead (`<PxCardHead>`)
| Aspect | Detail |
|--------|--------|
| Current | Title + subtitle + action slot |
| Props | `title`, `subtitle`, `action` |
| Storybook stories | All combinations |

#### Stat (`<PxStat>`)
| Aspect | Detail |
|--------|--------|
| Current | Metric display with accent bar |
| Props | `label`, `value`, `sub` (subtitle), `trend` (change indicator), `accent` (bar color) |
| Storybook stories | Default, without trend, accent color variants |

#### Table (`<PxTable>`)
| Aspect | Detail |
|--------|--------|
| Current | Column definitions + row data + optional click handler |
| Column def | `{ label, key, render?, width?, align? }` |
| Props | `cols`, `rows`, `rowStyle` (function), `onRowClick` |
| Storybook stories | Basic, with custom renders (badges, avatars), clickable rows, empty state |

#### LogRow (`<PxLogRow>`)
| Aspect | Detail |
|--------|--------|
| Current | Activity timeline item with colored dot |
| Props | `time`, `user`, `action`, `type` (approve/add/decline/edit/bot/archive) |
| Storybook stories | All type variants |

#### Empty (`<PxEmpty>`)
| Aspect | Detail |
|--------|--------|
| Current | Centered empty state with icon, title, sub, action |
| Props | `icon`, `title`, `sub`, `action` (ReactNode) |
| Storybook stories | All icon variants, with/without action |

### Scope: **Medium complexity** — composition of atoms, some layout logic.

---

### 2.3 Organisms

#### TopBar (`<PxTopBar>`)
| Aspect | Detail |
|--------|--------|
| Current | Page header with breadcrumb, title, subtitle, actions |
| Props | `breadcrumb`, `title`, `subtitle`, `actions` |
| Layout | flex space-between, min-width 0 for text |
| Storybook stories | Full config, minimal config |

#### Modal (`<PxModal>`)
| Aspect | Detail |
|--------|--------|
| Current | Portal overlay with title, content, footer, close button |
| Props | `title`, `subtitle`, `onClose`, `children`, `width` (default 520), `footer` |
| Layout | backdrop blur, centered content, scrollable body |
| Storybook stories | Default, with footer, narrow/wide |

#### NavItem (`<PxNavItem>`)
| Aspect | Detail |
|--------|--------|
| Current | Sidebar nav item with icon, label, active state, badge |
| Props | `icon`, `label`, `active`, `badge`, `onClick` |
| Active indicator | Left accent bar |
| Storybook stories | Default, active, with badge, disabled |

### Scope: **Medium complexity** — layout + interaction concerns.

---

### 2.4 Templates

#### Sidebar (`<PxSidebar>`)
| Aspect | Detail |
|--------|--------|
| Current | Full app nav with sections, nav items, user profile |
| Sections | Program (Dashboard, Shows, Calendar, Bookings), Roster (Artists, Post-show log), Operate (Audit log, Discord, Settings) |
| Props | `page` (active id), `onNav`, `pendingCount` |
| Elements | Logo (stack variant), NavItem groups, Eyebrow section labels, User avatar row |
| Storybook stories | All nav items, different pending counts, user states |

#### Shell (`<PxShell>`)
| Aspect | Detail |
|--------|--------|
| Current | Complete app layout: Sidebar + TopBar + scrollable main |
| Props | `page`, `onNav`, `title`, `subtitle`, `breadcrumb`, `actions`, `pendingCount`, `children` |
| Layout | flex row, Sidebar fixed width (220px), main flex-1 |
| Dimensions | Default 1240×760 (for prototype), responsive in production |
| Storybook stories | Each page variants, with/without breadcrumb, various action slots |

### Scope: **High complexity** — full page layouts, routing integration needed.

---

## 3. Page-Level Component Patterns

### 3.1 Dashboard Pattern

**Components needed:**
- `<DashboardHero>` — Dark background, large artist name, info row, action buttons
- `<StatsGrid>` — 4-column responsive grid of Stat components
- `<TwoColumnLayout>` — Main content (table/card) + sidebar (quick actions, activity)
- `<BotHealthCard>` — Discord bot status with connection details
- `<AttentionList>` — Action items with icons and warnings

**Storybook stories:**
- Hero with next show data
- Stats grid with all filled/partial states
- Two-column with table + sidebar
- With bot health panel
- Full dashboard layout

### 3.2 Shows List Pattern

**Components needed:**
- `<FilterChips>` — Horizontal scrollable pill filters
- `<ShowsTable>` — Enhanced table with draw progress bars, status badges, pin indicators
- `<DrawBar>` — Percentage bar inside table cell
- `<ArchivedSection>` — Collapsible past shows section with archive icon

**Storybook stories:**
- Filter chip states (selected, unselected)
- Table with all column types
- Draw bar variants (low/mid/high capacity)
- Pinned vs unpinned rows
- Empty state

### 3.3 Bookings Queue Pattern

**Components needed:**
- `<SubmissionCard>` — Artist info, date, genre, links, action buttons
- `<SubmissionList>` — Stack of SubmissionCards
- `<InsightsPanel>` — Submission chart + response time stats
- `<DeclineTemplates>` — Clickable template list

**Storybook stories:**
- SubmissionCard states (pending, approved, declined)
- With long/short artist names
- Empty queue state
- Insights with chart data

### 3.4 Calendar Pattern

**Components needed:**
- `<CalendarGrid>` — Month view with day cells
- `<CalendarCell>` — Day with event dots/bars
- `<CalendarHeader>` — Month/year + navigation
- `<DayLegend>` — Status color key
- `<DayDetail>` — Side panel for selected day

**Storybook stories:**
- Month with various event distributions
- Today highlighting
- Single/multi event days
- Empty days
- Navigation between months

### 3.5 Public Site Patterns

#### Shows List
- `<PubHero>` — Dark hero with next show marquee, date display, CTA
- `<ShowsGrid>` — List of show rows with date/artist/info/CTA columns
- `<MailingListCTA>` — Email capture section
- `<ShowBadge>` — SOLD OUT / FREE / ticket CTA variants

#### Show Detail
- `<TicketStub>` — Decorative ticket visual with stub holes
- `<LineupRow>` — Artist name, role, time
- `<VenueCard>` — Address, map placeholder, parking info
- `<CapacityWarning>` — "Heads up" callout for popular shows

#### Archive
- `<ArchiveStats>` — 4-column stats strip (total shows, attendance, years, artists)
- `<YearGroup>` — Year header + show list
- `<ArchiveSearch>` — Searchable show list

#### Book Form
- `<BookingForm>` — Artist, genre, date, draw, links, tech, message fields
- `<SpaceInfo>` — Dark card with venue specs
- `<BookingRules>` — Numbered list of booking guidelines
- `<BookingSuccess>` — Confirmation screen

#### About
- `<AboutHero>` — Large serif statement
- `<EthosStrip>` — 3-column principles with numbers
- `<VenueInfo>` — Address/contact table

### Scope: **High complexity** — page-specific, need to be extracted as reusable templates.

---

## 4. Proposed Component Structure

```
packages/
└── pyxis-components/
    ├── src/
    │   ├── tokens/
    │   │   ├── tokens.css          # CSS custom properties
    │   │   ├── tokens.ts           # TypeScript constants
    │   │   └── fonts.ts           # Font loading
    │   ├── atoms/
    │   │   ├── Icon/
    │   │   │   ├── Icon.tsx
    │   │   │   ├── Icon.stories.tsx
    │   │   │   └── icons.ts        # SVG path data
    │   │   ├── Button/
    │   │   ├── Badge/
    │   │   ├── Tag/
    │   │   ├── Input/
    │   │   ├── Select/
    │   │   ├── Textarea/
    │   │   └── Avatar/
    │   ├── molecules/
    │   │   ├── Field/
    │   │   ├── Card/
    │   │   ├── CardHead/
    │   │   ├── Stat/
    │   │   ├── Table/
    │   │   ├── LogRow/
    │   │   └── Empty/
    │   ├── organisms/
    │   │   ├── TopBar/
    │   │   ├── Modal/
    │   │   ├── NavItem/
    │   │   ├── Sidebar/
    │   │   └── Shell/
    │   ├── patterns/               # Page-level patterns
    │   │   ├── Dashboard/
    │   │   ├── ShowsList/
    │   │   ├── BookingsQueue/
    │   │   ├── Calendar/
    │   │   ├── ArtistsDirectory/
    │   │   ├── AuditLog/
    │   │   ├── PostShowLog/
    │   │   └── Settings/
    │   ├── public/                 # Public site components
    │   │   ├── PubNav/
    │   │   ├── PubFooter/
    │   │   ├── PubHero/
    │   │   ├── PubShowRow/
    │   │   ├── TicketStub/
    │   │   ├── LineupRow/
    │   │   ├── VenueCard/
    │   │   ├── MailingListCTA/
    │   │   ├── ArchiveStats/
    │   │   ├── BookingForm/
    │   │   ├── BookingSuccess/
    │   │   └── AboutHero/
    │   ├── index.ts                # Main exports
    │   └── theme.ts               # Theme context/hooks
    └── package.json
```

---

## 5. Theming Approach

Following the [React Modular Themable Storybook skill](../react-modular-themable-storybook/SKILL.md):

1. **CSS Variables for Tokens** — All tokens as CSS custom properties
2. **data-part Selectors** — Stable part API:
   ```css
   [data-part="root"] { /* base styles */ }
   [data-part="label"] { /* label styles */ }
   [data-part="input"] { /* input styles */ }
   ```
3. **Theme Override API** — CSS variable overrides per theme
4. **Unstyled Mode** — `unstyled` prop removes base CSS, keeps functionality
5. **Slots/Render Props** — Structural customization without CSS changes

---

## 6. Storybook Configuration

### Stories per Component
1. **Default** — Standard usage
2. **All Variants** — Grid of variant combinations
3. **States** — Loading, disabled, error, empty
4. **Themed** — With dark/high-contrast themes
5. **Unstyled** — Minimal styling to verify structure
6. **Composed** — Used within parent components

### Global Configuration
- **Decorators** — Theme provider, centering, viewport
- **Parameters** — Backgrounds, docs page
- **Addons** — Controls, actions, docs, viewport, a11y

---

## 7. Implementation Phases

### Phase 1: Foundation
- [ ] Extract tokens to CSS + TypeScript
- [ ] Build atom components with Storybook
- [ ] Build molecule components
- [ ] Build organism components

### Phase 2: Patterns
- [ ] Dashboard patterns
- [ ] Shows list patterns
- [ ] Bookings queue patterns
- [ ] Calendar patterns

### Phase 3: Public Site
- [ ] Navigation patterns
- [ ] Shows display patterns
- [ ] Booking form patterns
- [ ] Archive patterns

### Phase 4: Polish
- [ ] Mobile responsive variants
- [ ] Dark theme support
- [ ] Accessibility audit
- [ ] Documentation

---

## 8. Key Decisions

| Decision | Rationale |
|----------|-----------|
| CSS variables over JS tokens | Runtime theming, Storybook controls, no JS dependency |
| data-part selectors | Stable API, CSS-in-JS agnostic, refactor-safe |
| Compound components | Sidebar/NavItem together, consistent composition |
| Page patterns as exports | Don't reinvent layouts, compose from atoms |
| Mobile separate | Different interaction patterns (iOS-style vs web) |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Prototype uses inline styles | Refactor to CSS modules + CSS variables progressively |
| Icons hardcoded in JSX | Extract to icons.ts data file, generate components |
| No TypeScript | Add incrementally, strict mode from start |
| Complex calendar logic | Extract month grid to utility, test edge cases |
| Mobile different paradigm | Consider separate mobile component library |

---

## 10. Success Criteria

- All atom/molecule components have Storybook stories with Controls
- At least one page pattern demonstrates full composition
- Theme can be switched via Storybook toolbar
- No console errors in Storybook
- TypeScript strict mode passes
- Accessibility: a11y addon shows no violations
