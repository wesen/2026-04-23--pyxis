---
Title: Component Organization Tasks
Ticket: PYXIS-APP-VISUAL-TUNING
Status: active
Topics:
  - frontend
  - react
  - component-organization
  - storybook
  - css
DocType: tasks
Intent: implementation
Summary: Ordered tasks for restarting pyxis-app component organization safely after rollback.
LastUpdated: 2026-04-27T11:45:00-04:00
---

# Tasks

## Phase 0: Bookkeeping and baseline

- [x] **T01 — Commit ticket guide, task list, and diary scaffold**
  - Store the detailed component organization implementation guide in the ticket.
  - Add this ordered task list.
  - Create/update the diary so future work is recoverable.
  - Commit docs/bookkeeping separately.

- [x] **T02 — Restore a useful validation baseline**
  - Fix the restored baseline's `AppTopBar.stories.tsx` Storybook typing issue by adding required default args or otherwise making the story type-correct.
  - Run `pnpm exec tsc --noEmit`.
  - Run `pnpm exec vite build`.
  - Prefer running `pnpm exec storybook build` if time permits.
  - Commit separately.

## Phase 1: Single import concept before moving files

- [x] **T03 — Add public component layer barrels and retire page use of legacy barrels**
  - Create `web/packages/pyxis-app/src/components/organisms/index.ts`.
  - Prefer existing `web/packages/pyxis-app/src/components/shell/index.ts` for page shell imports.
  - Update page imports away from:
    - `components/organisms/Panels`
    - `components/organisms/Phase8Sections`
    - `components/organisms/ShowsSections`
    - `components/shell/AppShell`
  - Use:
    - `components/organisms`
    - `components/shell`
  - Do not delete legacy barrels yet.
  - Validate and commit.

- [x] **T04 — Add/keep a relative import resolver that checks CSS imports**
  - Add a repo-local or ticket-local script that checks relative imports including `.css` side-effect imports.
  - Dry-run/check current tree.
  - Ensure it reports `unresolved: 0` before structural moves.
  - Commit separately if repo-local; otherwise include in ticket docs commit.

## Phase 2: Shell split only

- [x] **T05 — Split shell components into one component folder each**
  - Split `components/shell/AppShell.tsx` into:
    - `AppShell/`
    - `AppTopBar/`
    - `AppSidebar/`
    - `AppSidebarMenu/`
    - `AppSidebarUserFooter/`
    - `AppMobileBottomNav/`
  - Split `AppShell.css` so each component imports its own CSS.
  - Move stories into matching folders.
  - Storybook titles remain `Pyxis App/Components/Shell/<Component>`.
  - Validate with `tsc`, `vite build`, and preferably `storybook build`.
  - Commit separately.

## Phase 3: multi-export component splits

- [x] **T06 — Split `ArtistCard` and `ArtistRosterRow`**
  - Create `molecules/ArtistRosterRow/`.
  - Move row-specific code and CSS out of `ArtistCard`.
  - Add/adjust stories.
  - Update imports.
  - Validate and commit.

- [x] **T07 — Split `BookingCard` and `BookingQueueRow`**
  - Create `molecules/BookingQueueRow/`.
  - Move row-specific code and CSS out of `BookingCard`.
  - Add/adjust stories.
  - Update imports.
  - Validate and commit.

- [x] **T08 — Split `DashboardAttentionContent` and `DashboardAttentionCount`**
  - Create `organisms/DashboardAttentionCount/`.
  - Add missing `DashboardAttentionContent.stories.tsx` if needed.
  - Keep shared defaults/types colocated in an explicit helper/data file.
  - Validate and commit.

## Phase 4: optional page-grouped organisms

- [x] **T09 — Decide whether to group organisms by page**
  - Only do this after T01-T08 are stable.
  - If yes, move one page group per commit.

- [x] **T10 — Optional: move Dashboard organisms into `organisms/Dashboard/`**
  - Use `git mv`.
  - Update Storybook titles to `Pyxis App/Components/Organisms/Dashboard/<Component>`.
  - Validate with import resolver, `tsc`, `vite build`, `storybook build`.
  - Commit separately.

- [x] **T11+ — Optional: move remaining page groups one at a time**
  - [x] Shows group.
  - [x] Bookings group.
  - [x] Calendar group.
  - [x] ShowDetail group.
  - [x] Roster group.
  - [x] Settings group; shared standalone organisms intentionally left top-level.
  - One group per commit.

## Phase 5: pyxis-user-site Shows component visual tuning

- [x] **T12 — Add user-site Shows component visual-tuning tasks and diary plan**
  - Record the smaller component targets that should replace broad `shows-list` iteration as the primary tuning loop.
  - Keep poster coverage representative instead of creating one story per poster image.
  - Record the validation/commit cadence before implementing more changes.

- [x] **T13 — Commit css-visual-diff operator guide and Shows alias verb**
  - Keep the new `compare-user-shows-section` alias and operator guide as workflow/tooling changes separate from visual CSS/component changes.
  - Validate `prototype-design/visual-diff/userland/verbs/pyxis-pages.js` with `node -c`.
  - Smoke test the alias against `shows-list`.
  - Commit docs/tooling separately.

- [x] **T14 — Add a component-level public visual spec and ergonomic component alias**
  - Create `prototype-design/visual-diff/userland/specs/public.components.visual.yml` for component-system Storybook targets on `localhost:6006`.
  - Include component targets for:
    - `public-page-header-shows`
    - `mailing-list-cta`
    - `poster-redroom` as a representative simple poster
    - `poster-graphic-set` or `poster-all-variants` as a representative multi-poster/artwork surface, if selector crop is stable
    - `show-tile-redroom`
    - `show-tile-learn`
    - `show-tile-soldout`
    - `show-grid-prototype-desktop`
  - Prefer stable `data-pyxis-component`/`data-pyxis-part` selectors on Storybook side.
  - Avoid broad full-page selectors for component tuning.
  - Regenerate JS mirrors with `prototype-design/visual-diff/userland/scripts/refresh-spec-mirrors.py`.
  - Add a compact alias verb for component targets if it reduces repeated flags enough to be useful.

- [x] **T15 — Add focused Storybook fixture data without over-splitting components**
  - Add representative `Poster` stories only where useful:
    - keep `AllVariants` as the artwork overview;
    - add at most one or two focused single-poster stories if needed for stable crops (`Redroom`, optionally one complex artwork variant).
  - Add `ShowTile` stories for semantic states rather than every poster image:
    - default/tickets (`Redroom`)
    - learn (`Monday Meet-Ups`)
    - sold out (`Moor Mother`)
    - optional placeholder-flyer fallback case if still relevant.
  - Add `ShowGrid/PrototypeDesktop` with the exact 9-show prototype-style data/order.
  - Do not extract `ShowTileInfo`, `ShowTileMeta`, or per-poster public components unless visual evidence proves the current component boundaries are insufficient.

- [x] **T16 — Tune `PublicPageHeader` component target to a reasonable threshold**
  - Compare the component-level target first, not the full Shows page.
  - Inspect `diff_only.png`, then `right_region.png`, then `left_region.png`.
  - Tune only header-specific spacing/typography/wrapper issues.
  - Target: review-band or better; accepted is nice but not required if remaining pixels are wrapper/antialiasing noise.
  - Record command, output directory, changed percent, and decision in the diary.

- [x] **T17 — Tune `MailingListCTA` component target to a reasonable threshold**
  - Compare the isolated CTA target.
  - Tune component-local CSS only if the mismatch is component-owned.
  - Target: review-band or better.
  - Record command, output directory, changed percent, and decision in the diary.

- [x] **T18 — Tune representative `Poster` target(s) to a reasonable threshold**
  - Use representative poster targets instead of one task per poster image.
  - First tune `poster-redroom`, because it is the first visible grid poster and currently has a clean isolated probe.
  - Use `AllVariants` or one complex poster target to catch systemic variant-rendering drift without turning every poster artwork into its own task.
  - If a complex variant remains far off because the current generic `Poster` markup cannot express the prototype artwork, record whether private internal poster renderers would be justified later.

- [x] **T19 — Tune representative `ShowTile` state targets to a reasonable threshold**
  - Tune ticket/default, learn, and sold-out tile states.
  - Focus on metadata formatting, title/meta/price spacing, ticket pill size, and total tile height.
  - Do not split tile internals unless selectors/parts are insufficient for diagnosis.
  - Record whether custom css-visual-diff subpart comparison helpers would make this easier.

- [x] **T20 — Tune `ShowGrid/PrototypeDesktop` as the main Shows integration target**
  - Use exact prototype-style nine-show data.
  - Validate grid width, column gap, row gap, and total height.
  - Tune grid-level CSS only after Poster and ShowTile targets are reasonable.
  - Target: substantially below the current full `shows-list` 20.50%, ideally review-band or close enough with documented reasons.

- [x] **T21 — Re-run public Shows page `shows-list` and decide whether to continue or accept**
  - Run the compact `compare-user-shows-section shows-list` alias.
  - Compare against the latest 20.50% baseline.
  - Inspect artifacts and record remaining mismatch causes.
  - If the section is still too high, decide whether the next work is component CSS, fixture/data alignment, or custom css-visual-diff functionality.

- [x] **T22 — Final validation, diary, and commit**
  - Run relevant package validation:
    - `cd web/packages/pyxis-components && pnpm exec tsc --noEmit`
    - `cd web/packages/pyxis-user-site && pnpm exec tsc --noEmit && pnpm exec vite build`
  - Run visual target aliases/specs used during tuning.
  - Update diary with commands, outputs, threshold decisions, and an assessment of whether custom css-visual-diff functionality should be introduced.
  - Commit the component stories/spec/tuning changes separately from the earlier tooling/docs commit.
