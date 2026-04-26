# Tasks

## Phase 1: Inventory and classification

- [x] Create ticket workspace.
- [x] Add public component taxonomy/folder layout design guide.
- [x] Add public component taxonomy audit script.
- [x] Locate existing decomposition and Storybook organization playbooks.
- [x] Run full taxonomy audit and save output under `sources/`.
- [ ] Manually review each `needs-review` classification.
- [ ] Finalize public atom/molecule/organism/fixture classification table.

## Phase 2: Storybook baseline

- [x] Confirm `pyxis-user-site` only exposes canonical `Public Site/Pages` route stories.
- [x] Confirm no stale `Pages/Book`, `Pages/Shows`, `Pages/Archive`, or `Pages/ShowDetail` stories exist.
- [x] Record current `storybook-static/index.json` story IDs under `sources/`.
- [x] Search active visual-diff specs for public component story IDs before moving files.

## Phase 3: Pilot move — public molecules

- [x] Create `web/packages/pyxis-components/src/public/molecules/`.
- [x] Move `LineupRow` to `public/molecules/LineupRow`.
- [x] Move `ShowMetaStrip` to `public/molecules/ShowMetaStrip`.
- [x] Move `ShowDetailHeader` to `public/molecules/ShowDetailHeader`.
- [x] Move `ArchiveShowRow` to `public/molecules/ArchiveShowRow`.
- [x] Move `ArchiveShowList` to `public/molecules/ArchiveShowList`.
- [x] Update relative imports and barrel exports.
- [x] Update Storybook titles to `Public Site/Components/Molecules/*`.
- [x] Run `cd web/packages/pyxis-components && pnpm build`.

## Phase 4: Shows/detail cluster

- [x] Create `web/packages/pyxis-components/src/public/organisms/`.
- [x] Move `ShowGrid` to `public/organisms/ShowGrid`.
- [x] Move `ReserveTicketCard`, `TicketStub`, `Poster`, `ShowTile`, `PubShowRow` according to finalized classification.
- [x] Fix `ShowGrid` click API so it preserves `show.id` directly if still needed.
- [x] Update stories and imports.
- [x] Validate `pyxis-components` and `pyxis-user-site` builds.

## Phase 5: Booking cluster

- [x] Move `BookingForm` to public organisms.
- [x] Move `BookingRules`, `BookingSpaceAside`, `SaferSpaceAgreement`, and `BookingSuccess` according to finalized classification.
- [x] Ensure booking stories remain component-level and do not duplicate route-level `Book` page stories.
- [x] Validate Storybook.

## Phase 6: Archive cluster

- [x] Move `ArchiveSearchFilters`, `ArchiveStats`, `YearGroup`, and archive list components according to finalized classification.
- [x] Ensure archive page keeps only RTK Query/search/page-state logic.
- [x] Validate archive stories and public page stories.

## Phase 7: About/venue/shell cluster

- [ ] Move `PubNav` and `PubFooter` to public organisms.
- [ ] Move `AboutHero`, `AboutIntro`, `EthosStrip`, `EthosGrid`, `CollectiveList`, `FindUsBlock`, `VenueCard`, `SpaceInfo`, and `MailingListCTA` according to finalized classification.
  - [x] Move about content components: `AboutHero`, `AboutIntro`, `EthosGrid`, `CollectiveList`, `FindUsBlock`.
  - [ ] Move remaining home/venue components: `EthosStrip`, `VenueCard`, `SpaceInfo`, `MailingListCTA`.
- [x] Validate about/public shell stories for the about content cluster.

## Phase 8: Thin public route pages

- [ ] Audit `web/packages/pyxis-user-site/src/pages/Shows.tsx` for extraction candidates.
- [ ] Audit `ShowDetail.tsx` for extraction candidates.
- [ ] Audit `Archive.tsx` for extraction candidates.
- [ ] Audit `Book.tsx` for extraction candidates.
- [ ] Audit `About.tsx` for extraction candidates.
- [ ] Ensure pages own RTK Query, routing, navigation, and loading/error/empty states only.

## Phase 9: Validation and docs

- [x] `cd web/packages/pyxis-components && pnpm build` passes.
- [x] `cd web/packages/pyxis-user-site && pnpm build` passes.
- [x] `cd web/packages/pyxis-user-site && pnpm build-storybook` passes.
- [x] `cd web && pnpm build` passes.
- [x] Storybook index contains expected page and component story IDs.
- [x] Any changed visual-diff story IDs are updated in specs or confirmed to be historical references only.
- [x] Diary updated with move batches and caveats.
- [x] Changelog updated.
- [x] `docmgr doctor --ticket PYXIS-PUBLIC-COMPONENT-TAXONOMY --stale-after 30` passes.
