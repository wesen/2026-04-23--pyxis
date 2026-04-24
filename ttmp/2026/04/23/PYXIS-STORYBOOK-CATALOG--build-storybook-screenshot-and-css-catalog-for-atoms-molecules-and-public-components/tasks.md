# Tasks

## TODO

- [ ] Add tasks here

- [x] Read css-visual-diff story config authoring guidance and inspect current Storybook story inventory
- [x] Generate co-located or ticket-managed css-visual-diff configs for Storybook catalog extraction
- [ ] Extract PNG/CSS/HTML/inspect bundles for atoms, molecules, organisms, and public components
- [ ] Publish a browsable manifest for the catalog and document how to rerun it
- [x] Add prototype baseline catalog configs for Pyxis Public Site and Full App foundations
- [x] Export public prototype catalog globals and validate component-level baseline samples
- [x] Add standalone Full App HTML pages for non-foundations screens
- [x] Generate css-visual-diff configs for non-foundations Full App screens
- [x] Run targeted Full App baseline sample and visually inspect representative PNGs
- [x] Run Full App-only baseline extraction into prototype-design/baseline/artifacts/full-app
- [x] Update baseline index/manifest and ticket diary/changelog for Full App export
- [x] Phase 1 — Audit current pyxis-components Storybook inventory from storybook-static/index.json and classify stories by atoms, molecules, organisms, public components, fixtures, and missing coverage
- [x] Phase 1 — Define canonical Storybook catalog output layout next to prototype-design/baseline, e.g. prototype-design/storybook-catalog/{manifest.json,index.html,index.md,artifacts/}
- [x] Phase 1 — Add Storybook design-system config generator under prototype-design/visual-diff/scripts that emits css-visual-diff inspect configs for pyxis-components Storybook stories
- [x] Phase 1 — Add Storybook design-system sample/full/index/serve scripts with targeted sample mode before full extraction
- [ ] Phase 2 — Capture first Storybook component-system sample for AtomDiffFixture, Button, Badge, Tag, Input, Select, Textarea, Avatar, Icon, Card, Field, Stat, Table, Empty, LogRow, Modal, Sidebar, TopBar, and NavItem
- [ ] Phase 2 — Visually inspect the Storybook component-system sample PNGs with read image tool and verify CSS imports, #storybook-root crops, and component-focus crops are correct
- [ ] Phase 2 — Run full Storybook component-system extraction for atoms, molecules, and organisms only, excluding public-site components until primitives are validated
- [x] Phase 2 — Build and serve browsable Storybook component-system catalog index with per-story screenshot counts and artifact links
- [ ] Phase 3 — Gap-audit atoms/molecules/organisms against prototype Full App foundations and identify missing Storybook stories or states
- [ ] Phase 3 — Add missing atom stories for required variants and states: Button variants/states, Badge variants, Tag variants, Icon/IconButton states, Input/Search/Error, Select states, Textarea states, Avatar sizes/fallbacks
- [ ] Phase 3 — Add missing molecule stories for Card variants, Field help/error states, Stat trend states, Table dense/action/status variants, Empty CTA states, and LogRow severity/action variants
- [ ] Phase 3 — Add missing organism stories for Sidebar active sections, TopBar action/search states, NavItem variants, and Modal form/confirmation/danger states
- [x] Phase 3 — Rebuild pyxis-components Storybook and rerun Storybook component-system catalog after story additions
- [ ] Phase 4 — Map prototype Full App foundations/card-level probes to corresponding Storybook atom/molecule/organism stories for future parity comparisons
- [ ] Phase 4 — Create initial prototype-foundations-vs-storybook comparison configs for high-value primitives and cards, starting with buttons, badges/tags, form fields, stats, navigation, log rows, and empty state
- [ ] Phase 5 — Audit current public component Storybook inventory and compare it to prototype-design/Pyxis Public Site.html public components: nav, footer, poster/show tile, page header, show grid, detail layout, archive, booking form, about/ethos blocks
- [ ] Phase 5 — Add or expand public component stories for prototype-equivalent states: PubNav desktop/mobile, PubFooter desktop/mobile, show tiles/posters, page headers, show grid, show detail ticket card, archive stats/year groups, booking form, space info, about hero/ethos/CTA
- [x] Phase 5 — Capture Storybook public component catalog into prototype-design/storybook-catalog/artifacts/public after component-system primitives are validated
- [ ] Phase 6 — Refocus on prototype-design/Pyxis Public Site.html by mapping each prototype public baseline config to a Storybook public component or user-site page story
- [ ] Phase 6 — Create prototype-public-vs-storybook comparison configs for public nav/footer/page-header/show-grid/show-tile before full page comparisons
- [ ] Phase 6 — Add page-level Storybook comparison configs for public Shows, Show Detail, Archive, Book, and About desktop/mobile after component-level public parity is inspectable
- [ ] Phase 7 — Keep a detailed diary after each Storybook capture/story-expansion phase, including commands, failures, screenshot paths inspected, artifact counts, and commit hashes
- [x] Intermediate Phase — Document and implement canonical Storybook capture selector contract using data-pyxis-component/data-pyxis-part before broad Storybook extraction
- [x] Intermediate Phase — Replace ad hoc atom data-part attributes with canonical namespaced component/part attributes and update atom CSS selectors
- [x] Intermediate Phase — Update Storybook config generator to emit capture-target probes based on data-pyxis-component roots instead of broad component-focus wrappers
- [x] Intermediate Phase — Validate focused Storybook extraction for representative atoms with read image screenshots, especially Badge, Button, Tag, Input, Avatar/Icon
