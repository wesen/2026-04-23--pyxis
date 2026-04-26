# Tasks

## Phase 1: Inventory and classification

- [x] Create ticket workspace.
- [x] Add public component taxonomy/folder layout design guide.
- [x] Add public component taxonomy audit script.
- [x] Locate existing decomposition and Storybook organization playbooks.
- [ ] Run full taxonomy audit and save output under `sources/`.
- [ ] Manually review each `needs-review` classification.
- [ ] Finalize public atom/molecule/organism/fixture classification table.

## Phase 2: Storybook baseline

- [ ] Confirm `pyxis-user-site` only exposes canonical `Public Site/Pages` route stories.
- [ ] Confirm no stale `Pages/Book`, `Pages/Shows`, `Pages/Archive`, or `Pages/ShowDetail` stories exist.
- [ ] Record current `storybook-static/index.json` story IDs under `sources/`.
- [ ] Search active visual-diff specs for public component story IDs before moving files.

## Phase 3: Pilot move — public molecules

- [ ] Create `web/packages/pyxis-components/src/public/molecules/`.
- [ ] Move `LineupRow` to `public/molecules/LineupRow`.
- [ ] Move `ShowMetaStrip` to `public/molecules/ShowMetaStrip`.
- [ ] Move `ShowDetailHeader` to `public/molecules/ShowDetailHeader`.
- [ ] Move `ArchiveShowRow` to `public/molecules/ArchiveShowRow`.
- [ ] Move `ArchiveShowList` to `public/molecules/ArchiveShowList`.
- [ ] Update relative imports and barrel exports.
- [ ] Update Storybook titles to `Public Site/Components/Molecules/*`.
- [ ] Run `cd web/packages/pyxis-components && pnpm build`.

## Phase 4: Shows/detail cluster

- [ ] Create `web/packages/pyxis-components/src/public/organisms/`.
- [ ] Move `ShowGrid` to `public/organisms/ShowGrid`.
- [ ] Move `ReserveTicketCard`, `TicketStub`, `Poster`, `ShowTile`, `PubShowRow` according to finalized classification.
- [ ] Fix `ShowGrid` click API so it preserves `show.id` directly if still needed.
- [ ] Update stories and imports.
- [ ] Validate `pyxis-components` and `pyxis-user-site` builds.

## Phase 5: Booking cluster

- [ ] Move `BookingForm` to public organisms.
- [ ] Move `BookingRules`, `BookingSpaceAside`, `SaferSpaceAgreement`, and `BookingSuccess` according to finalized classification.
- [ ] Ensure booking stories remain component-level and do not duplicate route-level `Book` page stories.
- [ ] Validate Storybook.

## Phase 6: Archive cluster

- [ ] Move `ArchiveSearchFilters`, `ArchiveStats`, `YearGroup`, and archive list components according to finalized classification.
- [ ] Ensure archive page keeps only RTK Query/search/page-state logic.
- [ ] Validate archive stories and public page stories.

## Phase 7: About/venue/shell cluster

- [ ] Move `PubNav` and `PubFooter` to public organisms.
- [ ] Move `AboutHero`, `AboutIntro`, `EthosStrip`, `EthosGrid`, `CollectiveList`, `FindUsBlock`, `VenueCard`, `SpaceInfo`, and `MailingListCTA` according to finalized classification.
- [ ] Validate about/public shell stories.

## Phase 8: Thin public route pages

- [ ] Audit `web/packages/pyxis-user-site/src/pages/Shows.tsx` for extraction candidates.
- [ ] Audit `ShowDetail.tsx` for extraction candidates.
- [ ] Audit `Archive.tsx` for extraction candidates.
- [ ] Audit `Book.tsx` for extraction candidates.
- [ ] Audit `About.tsx` for extraction candidates.
- [ ] Ensure pages own RTK Query, routing, navigation, and loading/error/empty states only.

## Phase 9: Validation and docs

- [ ] `cd web/packages/pyxis-components && pnpm build` passes.
- [ ] `cd web/packages/pyxis-user-site && pnpm build` passes.
- [ ] `cd web/packages/pyxis-user-site && pnpm build-storybook` passes.
- [ ] `cd web && pnpm build` passes.
- [ ] Storybook index contains expected page and component story IDs.
- [ ] Any changed visual-diff story IDs are updated in specs.
- [ ] Diary updated with move batches and caveats.
- [ ] Changelog updated.
- [ ] `docmgr doctor --ticket PYXIS-PUBLIC-COMPONENT-TAXONOMY --stale-after 30` passes.
