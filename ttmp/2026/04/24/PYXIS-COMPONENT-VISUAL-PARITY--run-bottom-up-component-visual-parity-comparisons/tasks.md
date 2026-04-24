# Tasks

## TODO

- [x] Public standalone page batch A — add shared `PublicPageHeader` and detail-page molecules (`ReserveTicketCard`, `ShowDetailHeader`, `ShowMetaStrip`, `SafetyNote`) with Storybook and parity coverage
- [x] Public standalone page batch B — add archive molecules/organisms (`ArchiveSearchFilters`, `ArchiveShowRow`, `ArchiveShowList`) with Storybook and parity coverage
- [x] Public standalone page batch C — add book-page molecules/organisms (`ShowTypeChips`, `BookingSpaceAside`, `SaferSpaceAgreement`) with Storybook and parity coverage
- [x] Public standalone page batch D — add about-page molecules/organisms (`AboutIntro`, `EthosGrid`, `CollectiveList`, `FindUsBlock`) with Storybook and parity coverage
- [x] Update public parity map, diary, and changelog after each batch; commit at stable checkpoints

- [x] Create component parity map for first atom batch: button-primary, badge-confirmed, tag-default, input-default, select-status
- [x] Author and inspect first atom comparison config for Button primary before running full comparison modes
- [x] Run css-visual-diff capture/cssdiff/matched-styles/pixeldiff/html-report for first atom comparison and record issues
- [x] Use CSS diff and pixel diff artifacts to tune React/Button implementation, then rerun comparison
- [x] Promote working atom comparison pattern to Badge, Tag, Input, and Select
- [x] Iteration 1 — Run Button primary prototype-vs-Storybook comparison end-to-end and update the playbook with any workflow corrections
- [x] Iteration 2 — Run Badge confirmed or Tag default comparison end-to-end using the refined workflow
- [x] After two atom iterations, update the parity guide with validated command sequence, known css-visual-diff limitations, and next batch recommendations
- [x] Add and run remaining available atom comparisons from AtomDiffFixture: avatar-md, icon-calendar, and icon-button
- [x] Decide how to add Textarea parity coverage, either by extending prototype/Storybook atom fixture or by creating a dedicated baseline/story pair
