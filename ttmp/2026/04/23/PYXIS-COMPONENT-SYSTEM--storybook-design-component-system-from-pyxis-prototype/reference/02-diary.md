---
Title: ""
Ticket: ""
Status: ""
Topics: []
DocType: ""
Intent: ""
Owners: []
RelatedFiles:
    - Path: prototype-design
      Note: Full prototype source directory
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---


# Investigation Diary — Pyxis Component System

## Session Start

**Goal:** Analyze the pyxis prototype design to extract a Storybook-ready React component system. Focus on web-facing components only (Discord bot parts out of scope).

## Files Examined

### Prototype Structure
```
prototype-design/
├── lib/
│   ├── tokens.js      # Design tokens (colors, fonts, radii, shadows, spacing)
│   ├── components.jsx # Atomic components + molecules
│   └── data.js        # Sample data (shows, artists, submissions, log)
├── screens/
│   ├── auth-dash.jsx      # Login, Setup wizard, Dashboard
│   ├── shows-bookings.jsx # Shows list, Bookings queue, Audit log
│   ├── public.jsx         # Public site (shows, archive, book, about)
│   ├── roster.jsx          # Artists, Calendar, Post-show log
│   ├── settings-discord.jsx # Discord settings, general settings, modals
│   └── mobile.jsx          # Mobile iPhone screens (all pages)
├── uploads/
│   └── showspace-dashboard*.jsx # Upload screens
├── design-canvas.jsx  # Figma-like design canvas (drag reorder, focus mode)
├── ios-frame.jsx      # iOS device frame wrapper
└── *.html             # Standalone HTML previews
```

## Key Findings

### Design Token System (tokens.js)
- **Colors:** Warm paper palette (#F3F1EB canvas), crimson accent (#C8270D), semantic colors (green, blue, amber, mute)
- **Fonts:** Fraunces (serif display), Inter (body), JetBrains Mono (code)
- **Radii:** xs(4) sm(6) md(8) lg(12) xl(16) pill(999)
- **Shadows:** sm, md, lg, xl
- **Spacing:** 1-10 scale (4px-72px)

### Atomic Components Identified
1. **Icons** — 22 custom thin-line SVG icons
2. **Logo** — PyxisMark (compass rose), PyxisLogo (mark + name)
3. **Typography** — DisplayH, SectionH, Eyebrow, Muted
4. **Badges/Tags** — Badge (status), Tag (genre)
5. **Buttons** — Btn (variants: primary, dark, outline, ghost, danger, success, discord), IconBtn
6. **Cards** — Card, CardHead, Stat
7. **Fields** — Field, Input, Select, Textarea (with fldBase)
8. **Data display** — Avatar, Table
9. **Navigation** — NavItem, Sidebar, TopBar
10. **Shell** — Full app shell (Sidebar + TopBar + main)
11. **Overlay** — Modal
12. **Activity** — LogRow
13. **Empty state** — Empty

### Compound/Molecular Components
- **Sidebar** — Full nav with sections (Program, Roster, Operate), user avatar
- **TopBar** — Title/subtitle + actions slot
- **Shell** — Complete app layout wrapper
- **DesignCanvas** — Figma-like viewport with pan/zoom/drag

### Page-Level Patterns
- Dashboard: Hero strip, stats grid, two-column layout, bot health, attention items
- Shows list: Filter chips, table with draw bars
- Bookings: Submission cards with action buttons, decline templates
- Calendar: Month grid, event dots, day detail panel
- Artists: Card grid + table
- Audit log: Two-column with filters + timeline
- Public shows: Hero marquee, show rows, mailing list CTA
- Public detail: Ticket stub visual, venue card, lineup
- Public archive: Year-grouped, search, stats strip
- Public book: Form + space info sidebar
- Mobile: iOS-style grouped rows, bottom tab bar

## What's Reusable vs. Not

### Highly Reusable (Atoms)
- Design tokens (CSS variables)
- Icon library
- Button variants
- Badge/Tag
- Input, Select, Textarea
- Card primitive
- Avatar
- Typography components

### Reusable with Adaptation (Molecules)
- Sidebar navigation (needs auth context)
- TopBar (needs props)
- Modal (needs content slot)
- Table (generic enough)
- Shell (needs routing context)

### Page-Specific (Organisms/Templates)
- Dashboard hero/stats/attention panels
- Shows table with draw bars
- Bookings submission cards
- Calendar month grid
- Public hero marquee
- Ticket stub component
- iOS device frame (mobile only)

### Not Reusable / Out of Scope
- Discord bot integration code
- Design canvas (internal tool)
- iOS frame wrapper (prototype artifact)
- HTML preview files

## Complexity Assessment

### Low Complexity
- Design tokens extraction
- Button, Badge, Tag atoms
- Input, Select, Textarea
- Avatar
- Card primitive
- Icon library

### Medium Complexity
- Sidebar navigation (needs state/routing)
- Table component (needs column definitions)
- Modal (needs portal/transitions)
- Shell layout
- Form patterns

### High Complexity
- Calendar grid (month view logic)
- Public hero marquee (responsive)
- iOS mobile patterns (separate system?)
- Table with inline states (draw bars, badges)

## Decisions Made

1. **Focus on desktop first** — mobile is separate consideration
2. **Discord bot parts excluded** — focus on web design system
3. **CSS variables approach** — tokens as CSS custom properties
4. **No Tailwind** — pure CSS with data-part selectors (per skill)
5. **Storybook stories** — default, themed, unstyled variants
6. **Backend out of scope for phase 1** — separate analysis document

## Work Done — 2026-04-23

### Session Complete

1. ✅ **Analyzed all prototype files** — tokens, components, screens, sql-api
2. ✅ **Created ticket** `PYXIS-COMPONENT-SYSTEM` in docmgr
3. ✅ **Created 2 analysis documents**:
   - `analysis/01-user-facing-component-system-analysis.md` — Component inventory, token system, proposed structure
   - `analysis/02-backend-functionality-analysis.md` — API design, DB schema, Discord integration, RTK Query
4. ✅ **Related source files** to both docs via `docmgr doc relate`
5. ✅ **Uploaded to reMarkable**:
   - `PYXIS Component System Analysis.pdf` (bundled)
   - `PYXIS Investigation Diary.pdf`

### What's In Scope (Web Design)
- Design token system extraction → CSS + TypeScript
- Atomic components (Icon, Button, Badge, Tag, Input, Select, Textarea, Avatar)
- Molecule components (Field, Card, CardHead, Stat, Table, LogRow, Empty)
- Organism components (TopBar, Modal, NavItem, Sidebar, Shell)
- Page patterns (Dashboard, Shows, Bookings, Calendar, Artists, Audit, Public site)
- Storybook integration

### What's Out of Scope
- Discord bot implementation (separate service)
- Design canvas (internal prototype tool)
- iOS mobile screens (different interaction paradigm)
- Backend implementation (separate concern)

## Next Steps
1. Start implementation: Phase 1 Foundation (tokens + atoms)
2. Create Storybook project scaffold
3. Extract design tokens to CSS + TypeScript
4. Build atomic components with Storybook stories
5. Progress to molecule → organism → page patterns

---
*Last updated: 2026-04-23*
