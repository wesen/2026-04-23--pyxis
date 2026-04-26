# Changelog

## 2026-04-26

- Initial workspace created


## 2026-04-26

Created public-site component taxonomy cleanup ticket with design guide, diary, tasks, and initial audit script.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/design-doc/01-public-site-component-taxonomy-and-folder-layout-refactor-guide.md — Primary taxonomy and folder layout refactor guide.
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/reference/01-investigation-diary.md — Initial investigation diary and playbook discovery notes.
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/scripts/audit-public-component-taxonomy.mjs — Initial audit helper for public component classification.
- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/tasks.md — Phased implementation checklist.


## 2026-04-26

Uploaded taxonomy guide to reMarkable and completed pilot public molecule move for LineupRow, ShowMetaStrip, ShowDetailHeader, ArchiveShowRow, and ArchiveShowList.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/02-pyxis-components-storybook-ids-after-pilot.md — Captured component Storybook IDs after pilot move.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/index.ts — Updated stable barrel exports to new public molecule paths.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/PublicDiffFixture.stories.tsx — Updated fixture imports to moved public molecule paths.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ArchiveShowList — Moved ArchiveShowList into public molecule taxonomy folder.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ArchiveShowRow — Moved ArchiveShowRow into public molecule taxonomy folder.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/LineupRow — Moved LineupRow into public molecule taxonomy folder.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ShowDetailHeader — Moved ShowDetailHeader into public molecule taxonomy folder.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ShowMetaStrip — Moved ShowMetaStrip into public molecule taxonomy folder.


## 2026-04-26

Completed shows/detail taxonomy cluster and aligned ShowTile/ShowGrid props with generated Show protobuf data, preserving show IDs through click callbacks.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/04-pyxis-components-storybook-ids-after-shows-detail.md — Captured Storybook IDs after shows/detail taxonomy move.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/Poster — Moved Poster to public molecules.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/PubShowRow — Moved PubShowRow to public molecules.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ReserveTicketCard — Moved ReserveTicketCard to public molecules.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ShowTile — Moved ShowTile to public molecules and changed ShowTileShow to extend generated Show with UI hints.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/TicketStub — Moved TicketStub to public molecules.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/ShowGrid — Moved ShowGrid to public organisms and preserved show identity through onShowClick.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-user-site/src/pages/Shows.tsx — Simplified navigation to use show.id from ShowGrid callback.


## 2026-04-26

Completed archive taxonomy cluster: moved ArchiveSearchFilters, ArchiveStats, and YearGroup to public molecules and validated archive page/component stories.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/05-pyxis-components-storybook-ids-after-archive.md — Captured Storybook IDs after archive cluster.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ArchiveSearchFilters — Moved archive search/filter molecule.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/ArchiveStats — Moved protobuf-backed archive stats molecule.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/molecules/YearGroup — Moved archive year grouping molecule.


## 2026-04-26

Completed booking taxonomy cluster: moved booking workflow components to public organisms and validated component plus route-page stories.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/06-pyxis-components-storybook-ids-after-booking.md — Captured Storybook IDs after booking cluster.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/BookingForm — Moved protobuf-backed booking form organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/BookingRules — Moved booking rules organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/BookingSpaceAside — Moved booking space aside organism and exported props type.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/BookingSuccess — Moved booking success organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/SaferSpaceAgreement — Moved safer-space agreement organism and exported props type.


## 2026-04-26

Completed about content taxonomy cluster: moved about page content blocks to public organisms and validated component plus about page stories.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/07-pyxis-components-storybook-ids-after-about.md — Captured Storybook IDs after about cluster.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/AboutHero — Moved about hero organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/AboutIntro — Moved about intro organism and exported props type.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/CollectiveList — Moved collective list organism and exported props type.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/EthosGrid — Moved ethos grid organism and exported props type.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/FindUsBlock — Moved find-us block organism and exported props type.


## 2026-04-26

Completed shell/home/venue taxonomy cluster: moved public layout and venue CTA components to organisms, fixed Storybook preview CSS imports, and validated page stories.

### Related Files

- /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/26/PYXIS-PUBLIC-COMPONENT-TAXONOMY--clean-public-site-component-taxonomy-and-folder-layout/sources/08-pyxis-components-storybook-ids-after-shell-home-venue.md — Captured Storybook IDs after shell/home/venue cluster.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/EthosStrip — Moved public ethos strip organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/MailingListCTA — Moved public mailing list CTA organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/PubFooter — Moved public footer shell organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/PubHero — Moved public home/show hero organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/PubNav — Moved public navigation shell organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/SpaceInfo — Moved public space info organism.
- /home/manuel/code/wesen/2026-04-23--pyxis/web/packages/pyxis-components/src/public/organisms/VenueCard — Moved public venue card organism.

