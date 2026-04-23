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
      Note: Component library source (atoms
    - Path: prototype-design/lib/tokens.js
      Note: Source design tokens (colors
    - Path: prototype-design/screens/public.jsx
      Note: Public site screens (Shows
    - Path: prototype-design/sql-api.md
      Note: API endpoint definitions (public endpoints)
ExternalSources: []
Summary: ""
LastUpdated: 0001-01-01T00:00:00Z
WhatFor: ""
WhenToUse: ""
---





# Pyxis User-Facing Site: Design & Implementation Guide

**For:** New developers joining the project  
**Purpose:** Complete reference for understanding, building, and extending the pyxis user-facing website  
**Status:** Design complete, implementation pending

---

## Table of Contents

1. [What Is Pyxis?](#1-what-is-pyxis)
2. [System Architecture](#2-system-architecture)
3. [Package Structure (pnpm workspace)](#3-package-structure-pnpm-workspace)
4. [The Component System (`pyxis-components`)](#4-the-component-system-pyxis-components)
5. [The User Site (`pyxis-user-site`)](#5-the-user-site-pyxis-user-site)
6. [Design Tokens](#6-design-tokens)
7. [Component Inventory](#7-component-inventory)
8. [Page Designs](#8-page-designs)
9. [API Integration](#9-api-integration)
10. [Storybook Setup](#10-storybook-setup)
11. [Implementation Checklist](#11-implementation-checklist)

---

## 1. What Is Pyxis?

Pyxis is a small music venue and artist space in Providence, Rhode Island. This repository contains the **user-facing website** for Pyxis — the public pages that visitors see when they want to find out about upcoming shows, browse past shows, or submit a booking inquiry.

### 1.1 The Venue

- **Location:** 25 Manton Ave, Providence, RI 02909
- **Capacity:** ~150 standing
- **Founded:** 2021
- **Genre focus:** Underground and experimental — darkwave, noise, techno, ambient, EBM, industrial, experimental
- **Mission:** "A room where the weird shows happen"

### 1.2 The Website's Purpose

The pyxis user-facing website serves three main audiences:

1. **Visitors** — People looking for upcoming shows, wanting to buy tickets, or learning about the space
2. **Artists** — Musicians considering submitting a booking inquiry
3. **Potential staff** — People interested in the venue's ethos (reached via the About page)

### 1.3 What This Project Is NOT

This repository contains **only the user-facing public pages**. It does NOT include:

- The **staff dashboard** — A separate internal tool for venue staff to manage shows, bookings, and calendar
- The **Discord bot** — A separate service that handles Discord posts, pins, and artist DMs
- The **backend API** — A separate service that stores data, handles authentication, and coordinates with Discord

### 1.4 Design Philosophy

The Pyxis design language is characterized by:

- **Warm paper aesthetic** — A cream/ivory background (#F3F1EB) evokes printed show bills and concert posters
- **Fraunces serif** — Used for display text, headlines, and artist names; evokes print typography
- **Single crimson accent** — A restrained use of #C8270D for calls-to-action and highlights
- **Restrained palette** — Mostly neutrals with semantic colors (green for success, amber for warnings)
- **Ink on paper metaphor** — Dark text (#1A1A18) on light backgrounds, dark backgrounds for hero sections

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER'S BROWSER                               │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    pyxis-user-site                          │   │
│   │                  (Next.js / Vite SPA)                        │   │
│   │                                                               │   │
│   │   Pages: /shows, /archive, /book, /about, /shows/[id]      │   │
│   │                                                               │   │
│   │   Components from: pyxis-components                          │   │
│   │   └── atoms, molecules, organisms, public/                  │   │
│   │                                                               │   │
│   │   Data fetching: React Query (TanStack Query)                │   │
│   │   └── useUpcomingShows(), useShow(id), useArchive()        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              │ REST/JSON                           │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                    pyxis-api (separate repo)                 │   │
│   │                     (Go + PostgreSQL)                        │   │
│   │                                                               │   │
│   │   Public endpoints:                                          │   │
│   │   ├── GET /public/shows         — upcoming confirmed shows   │   │
│   │   ├── GET /public/shows/:id    — single show detail         │   │
│   │   ├── GET /public/shows/:id/flyer — flyer image            │   │
│   │   ├── GET /public/archive      — past archived shows        │   │
│   │   └── POST /public/submissions — booking form submission     │   │
│   │                                                               │   │
│   │   (Staff endpoints omitted — require authentication)        │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                              │                                      │
│                              │                                      │
│                              ▼                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                   Other services (separate)                  │   │
│   │                                                               │   │
│   │   ├── pyxis-staff-dashboard (React) — internal admin tool  │   │
│   │   ├── pyxis-discord-bot (Go) — Discord automation          │   │
│   │   └── pyxis-api (Go) — REST API                            │   │
│   └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Repository Structure

```
pyxis/                                  # Root repository
├── web/                                # THIS PROJECT
│   ├── pnpm-workspace.yaml             # pnpm workspace config
│   ├── pnpm-lock.yaml                 # Lock file
│   ├── package.json                   # Workspace root (scripts only)
│   │
│   ├── packages/
│   │   ├── pyxis-components/          # Reusable component library
│   │   │   ├── package.json
│   │   │   ├── src/
│   │   │   │   ├── tokens/            # Design tokens
│   │   │   │   ├── atoms/             # Atomic components
│   │   │   │   ├── molecules/         # Molecular components
│   │   │   │   ├── organisms/         # Organism components
│   │   │   │   ├── patterns/          # Page-level patterns
│   │   │   │   └── public/            # Public site components
│   │   │   └── stories/               # Storybook stories
│   │   │
│   │   └── pyxis-user-site/           # User-facing website
│   │       ├── package.json
│   │       ├── vite.config.ts          # Vite config
│   │       ├── src/
│   │       │   ├── main.tsx            # Entry point
│   │       │   ├── App.tsx             # Root component
│   │       │   ├── pages/              # Route pages
│   │       │   │   ├── Shows.tsx
│   │       │   │   ├── ShowDetail.tsx
│   │       │   │   ├── Archive.tsx
│   │       │   │   ├── Book.tsx
│   │       │   │   └── About.tsx
│   │       │   ├── api/                # API client & hooks
│   │       │   │   ├── client.ts
│   │       │   │   └── hooks.ts
│   │       │   └── styles/            # Global styles
│   │       └── index.html
│   │
│   └── turbo.json                     # Turborepo config (optional)
│
├── pyxis-api/                         # Separate repository
├── pyxis-staff-dashboard/             # Separate repository
└── pyxis-discord-bot/                 # Separate repository
```

### 2.3 Why This Split Matters

The separation into `pyxis-components` and `pyxis-user-site` serves several purposes:

1. **Reusability** — The component library can be used by other projects (e.g., the staff dashboard, future mobile apps)
2. **Isolation** — Component logic is separate from page routing and business logic
3. **Storybook** — The component library can be developed and tested in isolation via Storybook
4. **Team boundaries** — Designers can work on components while developers build pages
5. **Versioning** — The component library can be versioned independently

---

## 3. Package Structure (pnpm workspace)

### 3.1 Why pnpm?

We use **pnpm** ( performant npm) for this project because:

- **Faster installs** — pnpm is significantly faster than npm or yarn
- **Disk efficient** — Packages are stored in a global store and linked, not copied
- **Strict mode** — Prevents accidental access to undeclared dependencies
- **Workspaces** — First-class support for monorepos

### 3.2 Workspace Configuration

**File: `web/pnpm-workspace.yaml`**
```yaml
packages:
  - 'packages/*'
```

**File: `web/package.json`**
```json
{
  "name": "pyxis",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter pyxis-user-site dev",
    "build": "pnpm --filter pyxis-user-site build",
    "storybook": "pnpm --filter pyxis-components storybook",
    "build:components": "pnpm --filter pyxis-components build",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test",
    "typecheck": "pnpm -r typecheck"
  },
  "devDependencies": {
    "typescript": "^5.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

### 3.3 Package Interdependencies

```
pnpm-workspace.yaml
      │
      ▼
┌─────────────────────────────────────────────────────┐
│                    Root package.json                  │
│              (scripts, devDependencies)              │
└─────────────────────────────────────────────────────┘
      │
      ├──────────────────┬──────────────────┐
      ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ pyxis-       │  │ pyxis-user-  │  │ (future:     │
│ components   │  │ site         │  │  pyxis-staff │
│              │  │              │  │  -dashboard) │
│ Dependencies:│  │ Dependencies:│  │              │
│ - React      │  │ - React      │  │ Dependencies:│
│ - Storybook  │  │ - React      │  │ - pyxis-     │
│ - Vite       │  │   Router     │  │   components │
│              │  │ - pyxis-     │  │ - React      │
│ DevDeps:     │  │   components │  │ - ...        │
│ - Storybook  │  │ - API types  │  │              │
│ - TypeScript │  │              │  │              │
│              │  │ DevDeps:     │  │              │
│              │  │ - Vite       │  │              │
│              │  │ - TypeScript │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 3.4 Key Commands

| Command | What it does |
|---------|-------------|
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start the user site dev server |
| `pnpm storybook` | Start Storybook for component development |
| `pnpm build:components` | Build the component library |
| `pnpm build` | Build the user site (includes building components first) |
| `pnpm -r build` | Build all packages |
| `pnpm --filter pyxis-components build` | Build only pyxis-components |

---

## 4. The Component System (`pyxis-components`)

### 4.1 Overview

The `pyxis-components` package is a **design system** — a collection of reusable UI components that implement the Pyxis design language. It is framework-agnostic in its styling (CSS custom properties) but React-specific in its implementation.

### 4.2 Design Principles

1. **Token-driven** — All visual decisions (colors, spacing, typography) come from design tokens
2. **Composition-first** — Components are built by composing smaller components
3. **Accessible by default** — ARIA attributes, keyboard navigation, focus management
4. **Themeable** — Components can be restyled via CSS variable overrides
5. **Documented** — Every component has Storybook stories showing all variants and states

### 4.3 Atomic Design in Practice

We follow Brad Frost's **Atomic Design** methodology:

| Level | Definition | Examples |
|-------|------------|----------|
| **Atoms** | Smallest units, can't be broken down further | Button, Input, Badge, Icon |
| **Molecules** | Simple groups of atoms | Field (label + input), Card (container), Table row |
| **Organisms** | Complex UI sections | Sidebar, Modal, TopBar |
| **Templates** | Page-level layouts | Shows list layout, Archive layout |
| **Pages** | Actual route pages | `/shows`, `/archive`, `/book` |

**Note:** Templates and Pages live in `pyxis-user-site`, not in the component library.

### 4.4 Component File Structure

Each component follows a consistent file structure:

```
src/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx          # Component implementation
│   │   ├── Button.css          # Component styles
│   │   ├── Button.stories.tsx  # Storybook stories
│   │   ├── Button.test.tsx     # Unit tests
│   │   └── index.ts            # Public exports
│   │
│   ├── Badge/
│   │   └── ...
│   │
│   └── Icon/
│       ├── Icon.tsx
│       ├── Icon.css
│       ├── Icon.stories.tsx
│       ├── icons.ts            # SVG path data
│       └── index.ts
│
├── molecules/
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── Card.css
│   │   ├── Card.stories.tsx
│   │   └── index.ts
│   │
│   ├── Field/
│   │   └── ...
│   │
│   └── Table/
│       └── ...
│
├── organisms/
│   ├── TopBar/
│   │   ├── TopBar.tsx
│   │   ├── TopBar.css
│   │   ├── TopBar.stories.tsx
│   │   └── index.ts
│   │
│   └── Modal/
│       └── ...
│
├── public/                     # Public site specific
│   ├── PubNav/
│   │   ├── PubNav.tsx
│   │   ├── PubNav.css
│   │   ├── PubNav.stories.tsx
│   │   └── index.ts
│   │
│   ├── PubFooter/
│   │   └── ...
│   │
│   ├── PubHero/
│   │   └── ...
│   │
│   ├── PubShowRow/
│   │   └── ...
│   │
│   ├── TicketStub/
│   │   └── ...
│   │
│   ├── LineupRow/
│   │   └── ...
│   │
│   ├── VenueCard/
│   │   └── ...
│   │
│   ├── MailingListCTA/
│   │   └── ...
│   │
│   └── BookingForm/
│       └── ...
│
├── tokens/
│   ├── tokens.css              # All CSS custom properties
│   ├── tokens.ts               # TypeScript constants
│   ├── fonts.ts               # Font loading
│   └── index.ts
│
├── patterns/                    # Page-level patterns
│   ├── ShowsLayout/
│   │   ├── ShowsLayout.tsx
│   │   ├── ShowsLayout.css
│   │   ├── ShowsLayout.stories.tsx
│   │   └── index.ts
│   │
│   └── ...
│
├── theme/
│   ├── ThemeProvider.tsx       # React context for theme
│   ├── useTheme.ts            # Hook for theme access
│   └── index.ts
│
└── index.ts                    # Package root exports
```

### 4.5 The Package Entry Point

**File: `packages/pyxis-components/src/index.ts`**

```typescript
// Atoms
export { Button } from './atoms/Button';
export { Badge } from './atoms/Badge';
export { Tag } from './atoms/Tag';
export { Input } from './atoms/Input';
export { Select } from './atoms/Select';
export { Textarea } from './atoms/Textarea';
export { Avatar } from './atoms/Avatar';
export { Icon } from './atoms/Icon';

// Molecules
export { Card } from './molecules/Card';
export { CardHead } from './molecules/CardHead';
export { Stat } from './molecules/Stat';
export { Field } from './molecules/Field';
export { Table } from './molecules/Table';
export { LogRow } from './molecules/LogRow';
export { Empty } from './molecules/Empty';

// Organisms
export { TopBar } from './organisms/TopBar';
export { Modal } from './organisms/Modal';
export { NavItem } from './organisms/NavItem';

// Public site components
export { PubNav } from './public/PubNav';
export { PubFooter } from './public/PubFooter';
export { PubHero } from './public/PubHero';
export { PubShowRow } from './public/PubShowRow';
export { TicketStub } from './public/TicketStub';
export { LineupRow } from './public/LineupRow';
export { VenueCard } from './public/VenueCard';
export { MailingListCTA } from './public/MailingListCTA';
export { BookingForm } from './public/BookingForm';
export { BookingSuccess } from './public/BookingSuccess';
export { ArchiveStats } from './public/ArchiveStats';
export { YearGroup } from './public/YearGroup';
export { SpaceInfo } from './public/SpaceInfo';
export { BookingRules } from './public/BookingRules';
export { AboutHero } from './public/AboutHero';
export { EthosStrip } from './public/EthosStrip';

// Tokens
export { tokens } from './tokens';
export { ThemeProvider, useTheme } from './theme';
```

### 4.6 Component API Patterns

Components follow consistent patterns for their props:

```typescript
// Variant props use string unions
type ButtonVariant = 'primary' | 'dark' | 'outline' | 'ghost' | 'danger' | 'success';
type BadgeStatus = 'confirmed' | 'pending' | 'approved' | 'declined' | 'cancelled' | 'archived' | 'hold' | 'blocked' | 'live' | 'draft' | 'needslog' | 'logged';
type ButtonSize = 'sm' | 'md' | 'lg';

// Components are forwardRef for DOM access
const Button = forwardRef<HTMLButtonElement, ButtonProps>(/* ... */);

// Components use slot props for extensibility
interface CardProps {
  children: React.ReactNode;
  header?: React.ReactNode;  // Slot
  footer?: React.ReactNode;   // Slot
  padding?: 'sm' | 'md' | 'lg';
}

// Boolean props use explicit names, not abbreviations
// Good: isLoading, isDisabled, hasError
// Bad: loading, disabled, error (unless it's a status)
```

---

## 5. The User Site (`pyxis-user-site`)

### 5.1 Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | React 18 + TypeScript | Type safety, component model |
| Routing | React Router v6 | Standard React routing |
| Data fetching | TanStack Query (React Query) | Caching, loading states, mutations |
| Styling | CSS Modules + CSS Variables | Scoped styles, token-driven design |
| Build | Vite | Fast dev server, optimized builds |
| Testing | Vitest + React Testing Library | Fast tests, good DX |
| Linting | ESLint + Prettier | Code quality |

### 5.2 File Structure

```
pyxis-user-site/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
│
├── src/
│   ├── main.tsx              # Entry point, renders App
│   ├── App.tsx               # Root component with router
│   │
│   ├── pages/                # Route page components
│   │   ├── Shows.tsx         # /shows — upcoming shows list
│   │   ├── ShowDetail.tsx    # /shows/:id — single show
│   │   ├── Archive.tsx       # /archive — past shows
│   │   ├── Book.tsx          # /book — booking form
│   │   ├── BookSuccess.tsx   # /book/success — confirmation
│   │   └── About.tsx         # /about — about the venue
│   │
│   ├── api/                  # API client and hooks
│   │   ├── client.ts         # Base fetch wrapper
│   │   ├── types.ts          # API response types
│   │   ├── hooks.ts          # React Query hooks
│   │   └── endpoints.ts      # API endpoint constants
│   │
│   ├── components/           # Page-specific components
│   │   └── layout/           # Layout components
│   │       ├── Layout.tsx     # Main layout wrapper
│   │       └── Layout.css
│   │
│   ├── styles/               # Global styles
│   │   ├── global.css        # Reset, fonts, global styles
│   │   └── variables.css     # Runtime variable overrides
│   │
│   └── utils/                # Utility functions
│       ├── dates.ts           # Date formatting
│       └── format.ts          # String/number formatting
│
└── public/
    └── favicon.svg           # SVG favicon
```

### 5.3 Routing Setup

**File: `pyxis-user-site/src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'pyxis-components';
import { Layout } from './components/layout/Layout';
import { Shows } from './pages/Shows';
import { ShowDetail } from './pages/ShowDetail';
import { Archive } from './pages/Archive';
import { Book } from './pages/Book';
import { BookSuccess } from './pages/BookSuccess';
import { About } from './pages/About';

// Create a client outside the component to avoid recreation on re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      gcTime: 1000 * 60 * 30,    // 30 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Shows />} />
              <Route path="shows" element={<Shows />} />
              <Route path="shows/:id" element={<ShowDetail />} />
              <Route path="archive" element={<Archive />} />
              <Route path="book" element={<Book />} />
              <Route path="book/success" element={<BookSuccess />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### 5.4 Page Component Pattern

Each page follows a consistent pattern:

```tsx
// Example: Shows.tsx
import { useUpcomingShows } from '../api/hooks';
import { PubHero, PubShowRow, MailingListCTA } from 'pyxis-components';

export function Shows() {
  // Data fetching
  const { data: shows, isLoading, error } = useUpcomingShows();
  
  // The "hero" show (next upcoming) is shown in a special hero section
  const [heroShow, ...restShows] = shows ?? [];
  
  if (isLoading) {
    return <ShowsSkeleton />;
  }
  
  if (error || !shows) {
    return <ShowsError error={error} />;
  }
  
  return (
    <div className="shows-page">
      {/* Hero section for next big show */}
      {heroShow && <PubHero show={heroShow} />}
      
      {/* Show list */}
      <div className="shows-list">
        {restShows.map(show => (
          <PubShowRow key={show.id} show={show} />
        ))}
      </div>
      
      {/* Mailing list signup */}
      <MailingListCTA />
    </div>
  );
}
```

---

## 6. Design Tokens

### 6.1 What Are Design Tokens?

Design tokens are **named design decisions** — visual design primitives like colors, spacing, and typography stored as variables. They are the "source of truth" for the visual design.

Instead of:
```css
.button { background: #C8270D; color: white; }
```

We use:
```css
.button { background: var(--color-accent); color: var(--color-text-inverse); }
```

This allows:
- **Consistency** — The same color is used everywhere
- **Theming** — Changing a token changes all usages
- **Storybook controls** — Expose tokens as controls for rapid iteration

### 6.2 Token Categories

#### Colors

```css
:root {
  /* Canvas — the page background */
  --color-canvas: #F3F1EB;
  
  /* Surfaces — cards, panels, elevated elements */
  --color-surface: #FFFFFF;
  --color-surface-raised: #FAF8F2;  /* slightly warm, for inputs */
  
  /* Borders */
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
  
  /* Inverse (for dark backgrounds) */
  --color-text-inverse: #FFFFFF;
  --color-text-inverse-muted: rgba(255, 255, 255, 0.7);
}
```

#### Typography

```css
:root {
  /* Font families */
  --font-display: "Fraunces", Georgia, "Times New Roman", serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "IBM Plex Mono", "SF Mono", ui-monospace, monospace;
  
  /* Font sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.8125rem;  /* 13px */
  --text-base: 0.875rem; /* 14px */
  --text-lg: 1rem;       /* 16px */
  --text-xl: 1.125rem;  /* 18px */
  --text-2xl: 1.25rem;  /* 20px */
  --text-3xl: 1.5rem;   /* 24px */
  --text-4xl: 1.875rem; /* 30px */
  --text-5xl: 2.25rem;  /* 36px */
  --text-6xl: 3rem;     /* 48px */
  --text-7xl: 3.75rem;  /* 60px */
  --text-8xl: 4.5rem;   /* 72px */
  
  /* Line heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* Letter spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
  --tracking-wider: 0.04em;
}
```

#### Spacing

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-7: 2rem;     /* 32px */
  --space-8: 2.5rem;   /* 40px */
  --space-9: 3.5rem;   /* 56px */
  --space-10: 4.5rem;  /* 72px */
  --space-11: 6rem;    /* 96px */
  --space-12: 8rem;    /* 128px */
}
```

#### Radii

```css
:root {
  --radius-xs: 0.25rem;   /* 4px */
  --radius-sm: 0.375rem;   /* 6px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;   /* 24px */
  --radius-full: 9999px;   /* Pills, circular elements */
}
```

#### Shadows

```css
:root {
  --shadow-xs: 0 1px 2px rgba(26, 24, 22, 0.04);
  --shadow-sm: 0 1px 3px rgba(26, 24, 22, 0.06), 0 1px 2px rgba(26, 24, 22, 0.04);
  --shadow-md: 0 2px 10px rgba(26, 24, 22, 0.06), 0 1px 3px rgba(26, 24, 22, 0.04);
  --shadow-lg: 0 8px 32px rgba(26, 24, 22, 0.10), 0 2px 8px rgba(26, 24, 22, 0.06);
  --shadow-xl: 0 20px 60px rgba(26, 24, 22, 0.18), 0 8px 24px rgba(26, 24, 22, 0.10);
}
```

### 6.3 Token TypeScript Constants

**File: `packages/pyxis-components/src/tokens/tokens.ts`**

```typescript
// TypeScript constants for use in code
// (CSS custom properties are used in styles)

export const tokens = {
  color: {
    canvas: '#F3F1EB',
    surface: '#FFFFFF',
    surfaceRaised: '#FAF8F2',
    border: '#EAE6DD',
    borderSubtle: '#F0EDE4',
    textPrimary: '#1A1A18',
    textSecondary: '#555048',
    textTertiary: '#8A857B',
    textDisabled: '#B8B2A5',
    accent: '#C8270D',
    accentSubtle: '#FCEFEB',
    accentStrong: '#8E1B08',
    success: '#3C7A4F',
    successSubtle: '#EAF3EC',
    warning: '#C97A0F',
    warningSubtle: '#FBF1DC',
    info: '#2E5D9E',
    infoSubtle: '#E6EDF7',
    muted: '#6B6459',
    mutedSubtle: '#EEEAE0',
  },
  font: {
    display: '"Fraunces", Georgia, "Times New Roman", serif',
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "IBM Plex Mono", "SF Mono", ui-monospace, monospace',
  },
  radius: {
    xs: '0.25rem',
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadow: {
    xs: '0 1px 2px rgba(26, 24, 22, 0.04)',
    sm: '0 1px 3px rgba(26, 24, 22, 0.06), 0 1px 2px rgba(26, 24, 22, 0.04)',
    md: '0 2px 10px rgba(26, 24, 22, 0.06), 0 1px 3px rgba(26, 24, 22, 0.04)',
    lg: '0 8px 32px rgba(26, 24, 22, 0.10), 0 2px 8px rgba(26, 24, 22, 0.06)',
    xl: '0 20px 60px rgba(26, 24, 22, 0.18), 0 8px 24px rgba(26, 24, 22, 0.10)',
  },
  space: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '2rem',
    8: '2.5rem',
    9: '3.5rem',
    10: '4.5rem',
    11: '6rem',
    12: '8rem',
  },
} as const;

export type TokenColor = keyof typeof tokens.color;
export type TokenRadius = keyof typeof tokens.radius;
```

### 6.4 Using Tokens in Components

**In CSS (preferred for styles):**
```css
.my-component {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}
```

**In React (for dynamic values):**
```tsx
// tokens.ts export for runtime use
import { tokens } from 'pyxis-components';

// For dynamic styles
<div style={{ 
  backgroundColor: tokens.color.surface,
  padding: tokens.space[4]
}}>
  Content
</div>
```

---

## 7. Component Inventory

### 7.1 Atoms

#### Button

A clickable element that triggers an action.

**Variants:**
| Variant | Usage | Appearance |
|---------|-------|------------|
| `primary` | Main CTAs | Crimson background, white text |
| `dark` | Secondary CTAs on light | Dark background, white text |
| `outline` | Tertiary actions | Transparent, border, dark text |
| `ghost` | Subtle actions | Transparent, no border |
| `danger` | Destructive actions | Transparent, red text/border |
| `success` | Confirm actions | Green background |

**Sizes:** `sm` (32px height), `md` (40px height), `lg` (48px height)

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;      // Icon to show on the left
  iconRight?: IconName; // Icon to show on the right
  isLoading?: boolean;
  fullWidth?: boolean;
}
```

**Example usage:**
```tsx
<Button variant="primary" icon="chevron-right" iconRight>
  Get tickets
</Button>

<Button variant="outline" size="sm">
  Add to calendar
</Button>

<Button variant="danger" isLoading={isDeleting}>
  Delete show
</Button>
```

#### Badge

A small status indicator.

**Statuses:**
- `confirmed` — Green, show is confirmed
- `pending` — Amber, awaiting review
- `approved` — Green, submission approved
- `declined` — Red, submission declined
- `cancelled` — Red, show cancelled
- `archived` — Gray, past show
- `hold` — Blue, date on hold
- `blocked` — Gray, date blocked
- `live` — Green, active/online
- `draft` — Gray, not published
- `needslog` — Amber, needs post-show log
- `logged` — Green, post-show logged

**Props:**
```typescript
interface BadgeProps {
  status: BadgeStatus;
  children?: React.ReactNode;
}
```

#### Tag

A small label for categories, genres, etc.

**Props:**
```typescript
interface TagProps {
  children: React.ReactNode;
  color?: string;  // Optional custom color override
}
```

#### Input

A text input field.

**Types:** text, email, number, date, password, search

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
}
```

#### Select

A dropdown selection.

**Props:**
```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: Option[];  // { value: string; label: string }[]
}

type Option = { value: string; label: string } | string;
```

#### Textarea

A multi-line text input.

**Props:**
```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
}
```

#### Avatar

A user/entity representation using initials.

**Props:**
```typescript
interface AvatarProps {
  name: string;         // Used to generate initials
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;       // Background color, defaults to ink color
}
```

#### Icon

A thin-line SVG icon.

**Available icons:** home, calendar, ticket, mail, users, cog, search, chevron, plus, check, x, bell, pin, door, music, discord, edit, trash, external, archive, filter, sparkle, dot, compass, warning, copy, reset, play

**Props:**
```typescript
interface IconProps {
  name: IconName;
  size?: number;        // Pixel size, default 16
  color?: string;        // Stroke color, default currentColor
  strokeWidth?: number; // Default 1.6
}
```

### 7.2 Molecules

#### Card

A surface container with optional header and footer.

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;  // Adds hover effect
}
```

#### CardHead

A header section for cards with title, subtitle, and actions.

**Props:**
```typescript
interface CardHeadProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
```

#### Stat

A metric display with label, value, and trend.

**Props:**
```typescript
interface StatProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  accentColor?: string;
}
```

#### Field

A form field wrapper with label, input, and hint.

**Props:**
```typescript
interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;  // The actual input
}
```

#### Table

A data table with column definitions and rows.

**Props:**
```typescript
interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
}

interface Column<T> {
  key: string;
  label?: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}
```

#### Empty

A centered empty state with icon and message.

**Props:**
```typescript
interface EmptyProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```

### 7.3 Organisms

#### TopBar

A page header with breadcrumb, title, subtitle, and actions.

**Props:**
```typescript
interface TopBarProps {
  breadcrumb?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

#### Modal

A dialog overlay with title, content, and footer.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

### 7.4 Public Site Components

#### PubNav

The public site navigation bar.

**Props:**
```typescript
interface PubNavProps {
  currentPage: 'shows' | 'archive' | 'book' | 'about';
  onNavigate: (page: string) => void;
}
```

#### PubHero

The large hero section for the next upcoming show.

**Props:**
```typescript
interface PubHeroProps {
  show: Show;
  onShowClick: (show: Show) => void;
}
```

#### PubShowRow

A row in the shows list.

**Props:**
```typescript
interface PubShowRowProps {
  show: Show;
  onClick?: (show: Show) => void;
}
```

#### TicketStub

A decorative ticket visual for show detail pages.

**Props:**
```typescript
interface TicketStubProps {
  show: Show;
}
```

#### VenueCard

A card showing venue information.

**Props:**
```typescript
interface VenueCardProps {
  address?: string;
  capacity?: number;
  mapPlaceholder?: boolean;
}
```

#### BookingForm

The artist booking inquiry form.

**Props:**
```typescript
interface BookingFormProps {
  onSubmit: (data: BookingFormData) => Promise<void>;
  isSubmitting?: boolean;
}
```

#### BookingSuccess

The confirmation screen after successful booking submission.

**Props:**
```typescript
interface BookingSuccessProps {
  artistName: string;
  onSubmitAnother?: () => void;
}
```

#### MailingListCTA

An email capture section.

**Props:**
```typescript
interface MailingListCTAProps {
  onSubscribe?: (email: string) => Promise<void>;
}
```

---

## 8. Page Designs

### 8.1 Shows Page (`/` and `/shows`)

**Purpose:** Display all upcoming confirmed shows, with the next show featured prominently.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  PubNav                                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PUB HERO (dark background)                              │  │
│  │                                                           │  │
│  │  Date      │ Artist name (large Fraunces)                │  │
│  │  block     │ Description text                            │  │
│  │  (large    │ Doors · Age · Price · Genre                │  │
│  │   number)  │                                            │  │
│  │            │           [ Get tickets → ]                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ── Upcoming shows ─────────────────────────────  6 shows ──   │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Date  │ Artist          │ Info        │ Status / CTA     │  │
│  │ block │ Name            │ Genre       │                  │  │
│  │        │ Description     │ Doors       │                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│  (repeats for each show)                                       │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Mailing list signup CTA                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  PubFooter                                                     │
└────────────────────────────────────────────────────────────────┘
```

**Data required:**
```typescript
interface ShowsPageData {
  shows: Show[];
}
```

### 8.2 Show Detail Page (`/shows/:id`)

**Purpose:** Display full details for a single show, including artist info, ticket options, and venue details.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  PubNav                                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  SHOW DETAIL HERO (dark background)                        │  │
│  │                                                           │  │
│  │  ← All shows        Date: Friday, May 2, 2025             │  │
│  │                                                           │  │
│  │  ARTIST NAME                                             │  │
│  │  (very large, Fraunces)                                   │  │
│  │  Genre, italic                                            │  │
│  │                                                           │  │
│  │                    ┌─────────────────────────────────┐   │  │
│  │                    │  TICKET STUB (paper aesthetic)   │   │  │
│  │                    │  Admit one · Artist              │   │  │
│  │                    │  Doors · Price · Age · #          │   │
│  │                    │  ════════════════════════════════ │   │  │
│  │                    └─────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌─────────────────────────────┐  ┌────────────────────────┐  │
│  │  About the show             │  │  Venue                 │  │
│  │  ─────────────────          │  │  ─────────────         │  │
│  │                             │  │  Pyxis                  │  │
│  │  Full description text      │  │  25 Manton Ave         │  │
│  │  in Fraunces serif.         │  │  Providence, RI        │  │
│  │                             │  │                         │  │
│  │  [ Get tickets — $12 ]      │  │  ┌─────────────────┐   │  │
│  │  [ Add to calendar ]        │  │  │ map placeholder │   │  │
│  │                             │  │  └─────────────────┘   │  │
│  │  ─────────────────          │  │                        │  │
│  │  Lineup                     │  │  Parking info...       │  │
│  │  ─────────────────          │  │                        │  │
│  │  Artist         Headliner   │  └────────────────────────┘  │
│  │  Support TBA    Opening    │                               │
│  └─────────────────────────────┘                               │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ⚠️ Heads up: capacity is 150. We always sell out...    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  PubFooter                                                     │
└────────────────────────────────────────────────────────────────┘
```

**Data required:**
```typescript
interface ShowDetailPageData {
  show: Show & {
    description: string;
    lineup: LineupEntry[];
    flyerUrl?: string;
  };
}

interface LineupEntry {
  artist: string;
  role: 'headline' | 'support' | 'dj';
  startTime: string;
}
```

### 8.3 Archive Page (`/archive`)

**Purpose:** Browse past shows, searchable by artist or genre.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  PubNav                                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────┐ ┌──────────────┐ │
│  │  Archive                                 │ │ 🔍 Search    │ │
│  │  Every show since day one.               │ │ input...    │ │
│  │                                          │ │              │ │
│  │  (very large)                           │ │ 247 of 247   │ │
│  └──────────────────────────────────────────┘ └──────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  STATS STRIP                                            │  │
│  │  247      18,400       4           132                  │  │
│  │  Shows    Through      Years        Unique               │  │
│  │           the door                  Artists               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ── 2025 ─────────────────────────────── 8 shows ──           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Date    │ Artist              │ Genre      │ Attended  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ── 2024 ─────────────────────────────── 24 shows ──          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Date    │ Artist              │ Genre      │ Attended  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  PubFooter                                                     │
└────────────────────────────────────────────────────────────────┘
```

**Data required:**
```typescript
interface ArchivePageData {
  shows: ArchivedShow[];
  stats: {
    totalShows: number;
    totalAttendance: number;
    yearsRunning: number;
    uniqueArtists: number;
  };
}
```

### 8.4 Book Page (`/book`)

**Purpose:** Allow artists to submit booking inquiries.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  PubNav                                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────┐  ┌───────────────────────┐ │
│  │  Book us                       │  │  THE SPACE            │ │
│  │  (very large)                  │  │  (dark card)          │ │
│  │                                │  │                        │ │
│  │  Description text about        │  │  Capacity: ~150        │ │
│  │  what we book, ethos, etc.     │  │  Address: ...         │ │
│  │                                │  │  Ages: Varies          │ │
│  │  ┌──────────────────────────┐ │  └───────────────────────┘ │
│  │  │ Artist / project *       │ │                            │ │
│  │  ├──────────────────────────┤ │  ┌───────────────────────┐ │
│  │  │ Genre                   │ │  │  WHAT TO KNOW         │ │
│  │  ├──────────────────────────┤ │  │  01 We book 4-8 wks   │ │
│  │  │ Preferred date          │ │  │  02 Live, DJ, hybrid │ │
│  │  ├──────────────────────────┤ │  │  03 Door split or...  │ │
│  │  │ Expected draw           │ │  │  04 Soft holds...     │ │
│  │  ├──────────────────────────┤ │  └───────────────────────┘ │
│  │  │ Links *                 │ │                            │
│  │  ├──────────────────────────┤ │                            │
│  │  │ Tech rider              │ │                            │
│  │  ├──────────────────────────┤ │                            │
│  │  │ Anything else           │ │                            │
│  │  │ (textarea)              │ │                            │
│  │  └──────────────────────────┘ │                            │
│  │                                │                            │
│  │  [ Send inquiry → ]            │                            │
│  │  * required                    │                            │
│  └────────────────────────────────┘                            │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  PubFooter                                                     │
└────────────────────────────────────────────────────────────────┘
```

**Data required:** None (form submission only)

**Form fields:**
```typescript
interface BookingFormData {
  artistName: string;      // required
  genre?: string;
  preferredDate?: string;
  expectedDraw?: number;
  links: string;            // required
  techRider?: string;
  message?: string;
}
```

### 8.5 About Page (`/about`)

**Purpose:** Tell visitors about the venue, its mission, and how to find it.

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  PubNav                                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Providence, Rhode Island · since 2021                          │
│                                                                │
│  A room where the                                           │
│  weird shows happen.                                         │
│                                                                │
│  Description paragraphs about the venue...                     │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  [ HERO IMAGE PLACEHOLDER — 980 x 340 ]                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌────────────────────────┐  ┌─────────────────────────────┐  │
│  │  WHAT WE DO            │  │  VISIT                      │  │
│  │  ──────────────────── │  │  ─────────────────────────  │  │
│  │  Paragraphs about      │  │  Address: ...               │  │
│  │  what we do...         │  │  Capacity: ...              │  │
│  │                        │  │  Email: ...                │  │
│  └────────────────────────┘  └─────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ETHOS STRIP (dark background)                           │  │
│  │                                                           │  │
│  │  01          02           03                            │  │
│  │  Artists     Room for     All ages                       │  │
│  │  first       risk         when we can                    │  │
│  │                                                           │  │
│  │  Description  Description  Description                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  [ Book the space → ]                                         │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  PubFooter                                                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 9. API Integration

### 9.1 API Client

**File: `pyxis-user-site/src/api/client.ts`**

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pyxis.xyz';

interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: { code: 'UNKNOWN_ERROR', message: 'An unknown error occurred' }
    }));
    throw error;
  }

  return response.json();
}
```

### 9.2 API Types

**File: `pyxis-user-site/src/api/types.ts`**

```typescript
export interface Show {
  id: number;
  artist: string;
  date: string;           // YYYY-MM-DD
  doors_time: string;      // "8:00 PM"
  age: '21+' | '18+' | 'All Ages';
  price: string;           // "$12 adv / $15 door"
  genre: string;
  description?: string;   // Show detail only
  lineup?: LineupEntry[]; // Show detail only
  flyer_url?: string;     // Show detail only
  status: 'confirmed' | 'cancelled' | 'archived';
  submission_id?: number;
  artist_id?: number;
  created_at: string;
  updated_at: string;
}

export interface LineupEntry {
  artist: string;
  role: 'headline' | 'support' | 'dj';
  start_time: string;
}

export interface ArchivedShow {
  id: number;
  artist: string;
  date: string;
  genre: string;
  draw: number;           // Attendance count
}

export interface BookingFormData {
  artist_name: string;
  genre?: string;
  preferred_date?: string;
  expected_draw?: number;
  links: string;
  tech_rider?: string;
  message?: string;
}

export interface BookingConfirmation {
  success: boolean;
  submission_id?: number;
}

export interface ArchiveStats {
  total_shows: number;
  total_attendance: number;
  years_running: number;
  unique_artists: number;
}
```

### 9.3 API Endpoints

**File: `pyxis-user-site/src/api/endpoints.ts`**

```typescript
export const endpoints = {
  // Public endpoints
  shows: '/public/shows',
  show: (id: number) => `/public/shows/${id}`,
  showFlyer: (id: number) => `/public/shows/${id}/flyer`,
  archive: '/public/archive',
  archiveStats: '/public/archive/stats',
  submissions: '/public/submissions',
} as const;
```

### 9.4 React Query Hooks

**File: `pyxis-user-site/src/api/hooks.ts`**

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from './client';
import { endpoints } from './endpoints';
import type { Show, ArchivedShow, BookingFormData, ArchiveStats } from './types';

// ─── Queries ───────────────────────────────────────────────────

export function useUpcomingShows() {
  return useQuery({
    queryKey: ['shows', 'upcoming'],
    queryFn: () => apiFetch<Show[]>(endpoints.shows),
  });
}

export function useShow(id: number) {
  return useQuery({
    queryKey: ['shows', id],
    queryFn: () => apiFetch<Show>(endpoints.show(id)),
    enabled: !!id,
  });
}

export function useArchive(query?: string) {
  return useQuery({
    queryKey: ['archive', query],
    queryFn: () => apiFetch<ArchivedShow[]>(
      query ? `${endpoints.archive}?search=${encodeURIComponent(query)}` : endpoints.archive
    ),
  });
}

export function useArchiveStats() {
  return useQuery({
    queryKey: ['archive', 'stats'],
    queryFn: () => apiFetch<ArchiveStats>(endpoints.archiveStats),
    staleTime: Infinity, // Stats don't change often
  });
}

// ─── Mutations ─────────────────────────────────────────────────

export function useSubmitBooking() {
  return useMutation({
    mutationFn: (data: BookingFormData) =>
      apiFetch<{ success: boolean; submission_id: number }>(endpoints.submissions, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}
```

### 9.5 Using Hooks in Components

```tsx
import { useUpcomingShows, useShow, useArchive, useSubmitBooking } from '../api/hooks';

// In a page component:
function ShowsPage() {
  const { data: shows, isLoading, error } = useUpcomingShows();
  
  if (isLoading) return <ShowsSkeleton />;
  if (error) return <ShowsError error={error} />;
  
  return (
    <div>
      {shows?.map(show => (
        <PubShowRow key={show.id} show={show} />
      ))}
    </div>
  );
}

// In a detail page:
function ShowDetailPage({ id }: { id: number }) {
  const { data: show, isLoading } = useShow(id);
  
  if (isLoading) return <ShowDetailSkeleton />;
  
  return (
    <div>
      <h1>{show.artist}</h1>
      <TicketStub show={show} />
    </div>
  );
}

// In the booking form:
function BookingForm() {
  const submitBooking = useSubmitBooking();
  
  const handleSubmit = async (data: BookingFormData) => {
    await submitBooking.mutateAsync(data);
    navigate('/book/success');
  };
  
  return (
    <BookingFormComponent
      onSubmit={handleSubmit}
      isSubmitting={submitBooking.isPending}
    />
  );
}
```

---

## 10. Storybook Setup

### 10.1 Why Storybook?

Storybook is a tool for developing UI components in isolation. For this project, it serves several purposes:

1. **Visual testing** — See components in all states without running the full app
2. **Documentation** — Every component is documented with its props and variants
3. **Design iteration** — Rapidly try different token values via controls
4. **Collaboration** — Designers can review components without running code
5. **Regression testing** — Catch visual regressions before they reach production

### 10.2 Storybook Configuration

**File: `packages/pyxis-components/.storybook/main.ts`**

```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',  // Controls, actions, docs, etc.
    '@storybook/addon-a11y',         // Accessibility testing
    '@storybook/addon-themes',       // Theme switching
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

### 10.3 Global Configuration

**File: `packages/pyxis-components/.storybook/preview.tsx`**

```tsx
import type { Preview } from '@storybook/react';
import '../src/tokens/tokens.css';  // Load design tokens

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '24px',
        backgroundColor: 'var(--color-canvas)',
        minHeight: '100vh',
      }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'canvas',
      values: [
        { name: 'canvas', value: '#F3F1EB' },
        { name: 'surface', value: '#FFFFFF' },
        { name: 'ink', value: '#1A1A18' },
      ],
    },
  },
};

export default preview;
```

### 10.4 Story Template

Every component should have stories covering:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';

// ─── Component Meta ─────────────────────────────────────────────

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A clickable element for triggering actions. Supports multiple variants and sizes.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'dark', 'outline', 'ghost', 'danger', 'success'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    isLoading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────

// Default story — shows the component in its most common usage
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};

// All variants — shows every possible variant in a grid
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="dark">Dark</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
    </div>
  ),
};

// With icon — shows icon placement
export const WithIcon: Story = {
  args: {
    children: 'Get tickets',
    icon: 'chevron-right',
    iconRight: true,
    variant: 'primary',
  },
};

// Loading state — shows loading spinner
export const Loading: Story = {
  args: {
    children: 'Submitting...',
    variant: 'primary',
    isLoading: true,
  },
};

// Sizes — shows all size options
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Playground — allows exploring all combinations
export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};
```

### 10.5 Running Storybook

```bash
# From the workspace root:
pnpm storybook

# Or from the components package:
cd packages/pyxis-components
pnpm storybook
```

Storybook will start at `http://localhost:6006`.

---

## 11. Implementation Checklist

### Phase 1: Project Setup

- [ ] Create `web/` directory at repo root
- [ ] Initialize pnpm workspace
- [ ] Create `packages/pyxis-components/`
- [ ] Create `packages/pyxis-user-site/`
- [ ] Configure Vite for both packages
- [ ] Set up TypeScript configuration
- [ ] Configure ESLint and Prettier
- [ ] Add GitHub Actions CI workflow

### Phase 2: Design Tokens

- [ ] Create `tokens.css` with all CSS custom properties
- [ ] Create `tokens.ts` with TypeScript constants
- [ ] Create font loading setup (Fraunces, Inter, JetBrains Mono)
- [ ] Set up Storybook with token decorator
- [ ] Create global styles in user site

### Phase 3: Atoms (Component Library)

- [ ] Icon component (all 28 icons)
- [ ] Button component (all variants, sizes, states)
- [ ] Badge component (all statuses)
- [ ] Tag component
- [ ] Input component (with Field wrapper)
- [ ] Select component
- [ ] Textarea component
- [ ] Avatar component
- [ ] Write Storybook stories for all atoms

### Phase 4: Molecules (Component Library)

- [ ] Card component
- [ ] CardHead component
- [ ] Stat component
- [ ] Field component
- [ ] Table component
- [ ] Empty component
- [ ] LogRow component
- [ ] Write Storybook stories for all molecules

### Phase 5: Organisms (Component Library)

- [ ] TopBar component
- [ ] Modal component
- [ ] NavItem component
- [ ] Sidebar component (for potential future use)
- [ ] Write Storybook stories for all organisms

### Phase 6: Public Site Components

- [ ] PubNav component
- [ ] PubFooter component
- [ ] PubHero component
- [ ] PubShowRow component
- [ ] TicketStub component
- [ ] LineupRow component
- [ ] VenueCard component
- [ ] MailingListCTA component
- [ ] BookingForm component
- [ ] BookingSuccess component
- [ ] ArchiveStats component
- [ ] YearGroup component
- [ ] SpaceInfo component
- [ ] BookingRules component
- [ ] AboutHero component
- [ ] EthosStrip component
- [ ] Write Storybook stories for all public components

### Phase 7: API Integration (User Site)

- [ ] Set up API client
- [ ] Define TypeScript types
- [ ] Create React Query hooks
- [ ] Implement error handling
- [ ] Add loading states

### Phase 8: Pages (User Site)

- [ ] Layout component with PubNav and PubFooter
- [ ] Shows page (/)
- [ ] Show detail page (/shows/:id)
- [ ] Archive page (/archive)
- [ ] Book page (/book)
- [ ] Book success page (/book/success)
- [ ] About page (/about)
- [ ] 404 / error page

### Phase 9: Polish

- [ ] Add meta tags and SEO
- [ ] Add favicon and app icons
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing

### Phase 10: Deployment

- [ ] Set up preview deployments (Vercel/Netlify)
- [ ] Configure production environment variables
- [ ] Set up custom domain
- [ ] Enable analytics (optional)
- [ ] Set up error tracking (Sentry)

---

## Appendix A: Environment Variables

| Variable | Description | Example |
|---------|-------------|---------|
| `VITE_API_URL` | Base URL for the API | `https://api.pyxis.xyz` |
| `VITE_SITE_URL` | Public URL of this site | `https://pyxis.xyz` |

## Appendix B: File Naming Conventions

| Pattern | Usage | Example |
|---------|-------|---------|
| `PascalCase.tsx` | React components | `PubHero.tsx` |
| `camelCase.ts` | Utilities, hooks | `useShows.ts` |
| `kebab-case.css` | CSS files | `pub-hero.css` |
| `*.stories.tsx` | Storybook stories | `PubHero.stories.tsx` |
| `*.test.tsx` | Test files | `PubHero.test.tsx` |

## Appendix C: Import Aliases

Configure in `tsconfig.json` and `vite.config.ts`:

```json
{
  "compilerOptions": {
    "paths": {
      "@pyxis-components": ["./packages/pyxis-components/src"],
      "@pyxis-components/*": ["./packages/pyxis-components/src/*"],
      "@/*": ["./packages/pyxis-user-site/src/*"]
    }
  }
}
```

## Appendix D: Git Branch Strategy

```
main ──────────────────────────────── Production-ready code
   │
   ├── feature/component-library ─── Building components
   │   ├── feat/button
   │   ├── feat/icon-system
   │   └── ...
   │
   ├── feature/user-site ──────────── Building pages
   │   ├── feat/shows-page
   │   ├── feat/archive-page
   │   └── ...
   │
   └── chore/infrastructure ───────── Setup and tooling
```

## Appendix E: Testing Strategy

| Type | Tool | Location |
|------|------|----------|
| Unit tests | Vitest + RTL | `*.test.tsx` next to component |
| Storybook interactions | @storybook/test | `*.stories.tsx` |
| Visual regression | Chromatic (optional) | CI |
| E2E tests | Playwright (optional) | `e2e/` directory |

---

*This guide is a living document. Update as the project evolves.*
