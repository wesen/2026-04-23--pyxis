---
Title: CSS extraction validation and cleanup report
Ticket: PYXIS-RTK-TYPES-MIGRATION
Status: active
Topics:
  - frontend
  - css
  - storybook
  - visual-diff
  - pyxis
DocType: reference
Intent: long-term
Summary: B7 validation notes for public component CSS extraction, including typecheck, visual-diff reruns, and remaining inline style/color classifications.
LastUpdated: 2026-04-24T00:00:00Z
---

# CSS extraction validation and cleanup report

## Commands run

```bash
cd web && pnpm --filter pyxis-components typecheck
cd web && pnpm -r typecheck
rg "style=\{\{" web/packages/pyxis-components/src/public -g'*.tsx'
rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.tsx'
rg "#[0-9A-Fa-f]{3,6}|rgba?\(" web/packages/pyxis-components/src/public -g'*.css'
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/molecules
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/organisms
```

## Typecheck result

Both checks passed:

```text
pnpm --filter pyxis-components typecheck
pnpm -r typecheck
```

The recursive workspace typecheck covered both `pyxis-components` and `pyxis-user-site`.

## Storybook smoke result

The live Storybook server on port 6006 served representative public component theme stories successfully:

```bash
curl -fsS 'http://localhost:6006/iframe.html?id=public-organisms-pubhero--theme-override&viewMode=story'
curl -fsS 'http://localhost:6006/iframe.html?id=public-organisms-mailinglistcta--theme-override&viewMode=story'
```

Both requests returned HTML.

## Visual diff result

Both public config-dir runs completed successfully:

```bash
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/molecules
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/component-system/public/organisms
```

The generated output remains under `prototype-design/visual-comparisons/` and should stay uncommitted unless explicitly requested.

## Remaining inline-style classification

The inline-style scan still reports many occurrences, but almost all are in Storybook stories or the public diff fixture. These are acceptable because they set story wrapper widths, demo layout, or theme variables.

Remaining component TSX inline styles are intentionally dynamic:

- `ShowMetaStrip.tsx`
  - `gridTemplateColumns` depends on `items.length`.
- `ShowTile.tsx`
  - root inline style sets ticket-pill CSS variables from the show kind.
- `Poster.tsx`
  - root inline style sets poster artwork CSS variables from the poster kind and ratio.

The remaining fixture/story inline styles are acceptable for now:

- `PublicDiffFixture.stories.tsx`
  - capture wrapper widths and fixture layout.
- `*.stories.tsx`
  - story wrapper widths and theme override variables.

## Remaining TSX hardcoded color classification

Remaining hardcoded colors in TSX are limited to:

- `Poster.tsx`
  - poster artwork palettes; these are content/art direction data rather than structural CSS.
  - The values are passed into component-local CSS variables.
- `ShowTile.tsx`
  - ticket-pill semantic variant values; these are currently passed into component-local CSS variables.
  - Future cleanup could move them into CSS state selectors or named constants using global tokens.
- `PublicDiffFixture.stories.tsx` and `Poster.stories.tsx`
  - fixture/story backgrounds and theme override examples.

No large static JSX style blocks remain in canonical public component implementations after B2-B5, except the dynamic CSS-variable cases above.

## Remaining CSS hardcoded color classification

The CSS scan still reports hardcoded fallback values in component-local CSS variables. This is expected after the first extraction pass.

Examples:

```css
--pyxis-ticket-stub-border-color: #EAE7E0;
--pyxis-booking-space-bg: #1F1E1C;
--pyxis-ethos-body: #4A463E;
```

These are now at least centralized in CSS and overrideable. Future token-hardening should replace as many as possible with global tokens such as:

```css
var(--color-border)
var(--color-text-primary)
var(--color-text-secondary)
var(--color-text-tertiary)
var(--color-surface-raised)
var(--color-ink)
```

Do not treat this first extraction pass as final token purity. It is an architecture step from inline JSX to CSS with part selectors and component variables.

## Parity map update

Updated:

```text
prototype-design/visual-diff/comparisons/component-system/component-parity-map.json
```

The public entries touched by B2-B5 now include a `styleArchitecture` object with:

- `cssExtraction`,
- `cssFile`,
- `selectorContract`,
- `storybookThemeCoverage`,
- `validated`.

`PubShowRow` is marked as deferred pending taxonomy decision.

## Follow-up recommendations

1. Token-hardening pass: replace CSS hex fallback values with global tokens where exact visual parity allows.
2. Taxonomy ADRs:
   - `EthosGrid` vs `EthosStrip`,
   - `BookingSpaceAside` vs `VenueCard`,
   - `FindUsBlock` vs `SpaceInfo`,
   - `ShowTile`/`ShowGrid` vs `PubShowRow`,
   - `ArchiveShowRow` vs `PubShowRow`.
3. Visual tuning pass for higher-diff components.
4. Optional future `unstyled` API only if a concrete consumer needs it.
