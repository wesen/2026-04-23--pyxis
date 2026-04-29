# Changelog

- 2026-04-29: Created archive visual redesign ticket, analyzed current public archive page/component/API/Storybook structure, wrote detailed intern-ready implementation guide, and uploaded the guide bundle to reMarkable.
- 2026-04-29: Added second backend-first staff Post-show log guide and clarified that the new PostShowLog component has no standalone prototype HTML; Storybook-approved screenshots should be its first visual baseline.
- 2026-04-29: Updated the Post-show log guide for first-slice componentization, added MSW/RTK Query tasks, and created a deferred staff UI unification guide.
- 2026-04-29: Started Post-show log implementation with molecule primitives, Pyxis App/Components/Molecules Storybook entries, and temporary RTK Query/MSW show-log scaffolding.
- 2026-04-29: Added first PostShowLogEntryCard and PostShowLogPanel organisms with Storybook stories and TypeScript validation.
- 2026-04-29: Pivoted PostShowLogPanel to a ShowsConfirmedPanel-like table with expandable detail rows and an edit modal, then moved the family under `organisms/ShowLog/`.
- 2026-04-29: Captured ShowsConfirmedPanel with css-visual-diff as a visual reference and simplified ShowLogPanel to a compact Panel/table default state.
- 2026-04-29: Split PostShowLogEditorModal into its own ShowLog organism and tuned its form layout using css-visual-diff screenshots plus image review feedback.
- 2026-04-29: Added reusable Storybook-first component runbook covering css-visual-diff screenshot capture, image inspection with `read` or `understand_image`, evidence storage, diary updates, and commit rhythm.
- 2026-04-29: Added first backend ShowLog API handlers and switched the staff `/attendance` route to `useGetShowLogQuery()` plus `PostShowLogPanel`.
- 2026-04-29: Added ShowLog modal reference redesign report with copied screenshot evidence, current Storybook capture, image analysis, and concrete CSS/TSX implementation plan.
- 2026-04-29: Uploaded the ShowLog modal redesign report to reMarkable under `/ai/2026/04/29/PYXIS-ARCHIVE-VISUAL-REDESIGN/`.
- 2026-04-29: Implemented the reference-inspired ShowLog editor modal: xl width, two-column layout, pre-show callout, quick highlight, draw/door fields, incident sidebar, privacy banner, counters, and updated Storybook states.
