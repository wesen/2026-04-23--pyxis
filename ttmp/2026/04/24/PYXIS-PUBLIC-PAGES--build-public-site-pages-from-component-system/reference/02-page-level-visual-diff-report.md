---
Title: Page-level visual diff validation report
Ticket: PYXIS-PUBLIC-PAGES
Status: active
Topics:
  - frontend
  - react
  - storybook
  - visual-diff
  - pyxis
DocType: reference
Intent: long-term
Summary: First-pass page-level visual-diff results for public site pages composed from canonical public components.
LastUpdated: 2026-04-24T00:00:00Z
---

# Page-Level Visual Diff Validation Report

## Scope

This report records the first full page-level pass for the public site pages rendered through `pyxis-user-site` Storybook on port `6007` and compared against standalone prototype pages under `prototype-design/standalone/public`.

The page work intentionally prioritizes canonical component composition over pixel-perfect tuning. Residual diffs are expected and should guide the next tuning pass.

## Validation commands

```bash
cd web && pnpm -r typecheck
cd web && pnpm --filter pyxis-user-site build
cd web && pnpm --filter pyxis-user-site build-storybook
css-visual-diff run --config-dir prototype-design/visual-diff/comparisons/public-pages
```

All commands completed successfully.

## Configs now covered

```text
prototype-design/visual-diff/comparisons/public-pages/shows-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/show-detail-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/archive-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/book-desktop.css-visual-diff.yml
prototype-design/visual-diff/comparisons/public-pages/about-desktop.css-visual-diff.yml
```

## Pixel diff summary

| Page | Section | Changed % | Notes |
| --- | --- | ---: | --- |
| Shows | shows-list | 66.8566% | Highest residual. Needs tuning and possibly prototype-specific poster data/order mapping. |
| Shows | mailing-list | 51.2191% | Large page-position/layout delta. |
| Shows | header | 51.0775% | Header exists but not tuned to standalone baseline. |
| Shows | page | 50.5245% | First composition pass only. |
| Shows | content | 49.0940% | First composition pass only. |
| Show detail | content | 24.4647% | Moderate residual after canonical component composition. |
| Show detail | page | 18.5282% | Needs detail header/aside spacing tuning. |
| Archive | content | 7.1281% | Strong first-pass result. |
| Archive | page | 6.6511% | Closest page so far. |
| Book | content | 14.5896% | Moderate residual; layout/forms need tuning. |
| Book | page | 12.1006% | Moderate residual. |
| About | content | 20.4334% | Moderate residual; image/section spacing and copy layout need tuning. |
| About | page | 18.2795% | Moderate residual. |

## Component taxonomy cleanup status

Current page composition reduces use of deferred components:

- `Shows.tsx`: no longer uses `PubShowRow`; uses `ShowGrid` / `ShowTile`.
- `Archive.tsx`: no longer uses local `ArchiveRow`; uses `ArchiveShowList` / `ArchiveShowRow`.
- `Book.tsx`: no longer uses `SpaceInfo`; uses `BookingSpaceAside`.
- `About.tsx`: no longer uses `EthosStrip`; uses `EthosGrid`, `AboutIntro`, `CollectiveList`, and `FindUsBlock`.

`VenueCard` remains in `ShowDetail.tsx` intentionally as the compact show-detail venue card.

## Remaining inline style classification

The page rewrite moved main page layout into page CSS files for Shows, ShowDetail, Archive, Book, and About. Remaining inline styles may still exist in other app pages or story wrappers and should be classified in the next cleanup pass with:

```bash
rg "style=\{\{" web/packages/pyxis-user-site/src/pages -g'*.tsx'
```

## Recommendations

1. Tune `Shows` first. It is the largest diff and likely needs better prototype data mapping and poster-grid spacing.
2. Tune `Archive` next only if aiming for quick acceptance; it is already relatively close.
3. Add mobile configs after desktop page selector scopes are stable.
4. Add page-specific visual sections beyond `page/content` once the first-pass layouts settle.
5. Consider source-of-truth fixture mapping for page prototype data so `ShowGrid` renders the same poster kinds/order as `shows.html`.
