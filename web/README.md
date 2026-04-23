# Pyxis Web

pnpm workspace containing the Pyxis component library and user-facing website.

```
web/
├── packages/
│   ├── pyxis-components/   ← Reusable component library + Storybook
│   └── pyxis-user-site/   ← Public-facing React SPA
├── pnpm-workspace.yaml
└── package.json           ← Root workspace scripts
```

## Getting started

```bash
# Install all packages
pnpm install

# Build all packages
pnpm build

# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run all tests
pnpm test
```

## pyxis-components (Storybook)

```bash
pnpm --filter pyxis-components storybook
# → http://localhost:6006
```

Stories use [MSW](https://mswjs.io/) to intercept API requests in the browser.
All mock data lives in `packages/pyxis-components/src/mocks/handlers.ts`.

## pyxis-user-site (Vite dev server)

```bash
pnpm --filter pyxis-user-site dev
# → http://localhost:5173
```

The site calls `/api/*` endpoints. Set `VITE_API_URL` in `.env` to point at the
backend (defaults to `http://localhost:8080` for local development).

```bash
cp packages/pyxis-user-site/.env.example packages/pyxis-user-site/.env
# Edit .env and set VITE_API_URL
```

## Deployment

No deployment target is configured yet. The user-site is a Vite SPA and should be deployed according to the backend/hosting plan chosen later.

Required environment variable for any production deployment:
- `VITE_API_URL` — production API base URL

## Adding new components

1. Add to `packages/pyxis-components/src/atoms/` (or molecules/organisms/public/)
2. Export from `packages/pyxis-components/src/index.ts`
3. Add Storybook stories next to the component
4. If the component uses API data, add MSW handlers to `src/mocks/handlers.ts`
5. Import and use in `packages/pyxis-user-site/src/pages/`

## Architecture

- **Tokens** — CSS custom properties in `src/tokens/tokens.css`, TS constants in `src/tokens/tokens.ts`
- **Icons** — Inline SVG, no external dependencies. 30+ icons in `src/atoms/Icon/`
- **Data fetching** — TanStack Query (`@tanstack/react-query`) via React Router loaders
- **Theming** — CSS custom properties, no JS theme switching required
- **Styling** — Plain CSS with `data-part` selectors for stable component APIs
