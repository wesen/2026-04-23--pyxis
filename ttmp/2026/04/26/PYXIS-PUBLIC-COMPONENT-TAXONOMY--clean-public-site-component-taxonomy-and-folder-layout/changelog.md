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

