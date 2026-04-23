# Tasks

## TODO

- [x] Add tasks here

## css-visual-diff prepare + PNG export implementation

- [x] Phase 1 — Config schema: Add `PrepareSpec` to `internal/cssvisualdiff/config/config.go`, add `Target.Prepare`, add `Target.RootSelector`, add validation for `script` and `direct-react-global` prepare modes, and add config tests for valid/invalid prepare blocks.

- [x] Phase 2 — Driver helpers: Add browser/page helpers needed by prepare hooks, including `WaitForFunction(expr, timeout)`, optional `Eval(script)`, optional `OuterHTML(selector)`, and enough logging to diagnose missing globals or selector failures.

- [x] Phase 3 — Minimal prepare hook: Implement `internal/cssvisualdiff/modes/prepare.go` with `prepareTarget(page, target)`, supporting `prepare.type: script`, `script_file`, `wait_for`, `wait_for_timeout_ms`, and `after_wait_ms`.

- [x] Phase 4 — Pyxis direct-react-global prepare: Add `prepare.type: direct-react-global`, generating JavaScript that clears the page, creates `#capture-root`, sets width/background/min-height, and renders `React.createElement(window[component], props)`.

- [x] Phase 5 — Wire prepare into modes: Call `prepareTarget` in `capture.go`, `cssdiff.go`, and `matched_styles.go` immediately after navigation/wait and before selector capture/CSS extraction.

- [x] Phase 6 — Root PNG export: Update capture mode so target `root_selector` or `prepare.root_selector` can be used for the full screenshot instead of always using `FullScreenshot`, preventing tool/browser chrome from leaking into baselines.

- [x] Phase 7 — Prepared artifact export: Add output options for `write_prepared_html` and `write_inspect_json`; implement prepared root HTML export and recursive inspect-tree JSON export for original and React targets.

- [x] Phase 8 — DOM validation: Add optional section text expectations (`includes`/`excludes`) so the tool can catch failures like original screenshots containing `01 · Desktop` or missing footer text before trusting PNG outputs.

- [ ] Phase 9 — PNG validation (partially complete: stats/color/dimension checks implemented; blank image detection still missing): Add PNG stats and validation (`width`, `height`, top/bottom strip average colors, blank image detection), write validation results to JSON/Markdown, and add tests with synthetic PNG fixtures.

- [x] Phase 10 — Visual review workflow: Add documentation and optional report hooks that encourage `understand_image` or human visual inspection of generated comparison sheets; explicitly avoid Tesseract as the first-line visual correctness tool.

- [x] Phase 11 — Pyxis example config: Create a concrete `pyxis-public-shows.yaml` showing original `direct-react-global` prepare, Storybook iframe target, sections (full/header/nav/heading/grid/footer), style props, validation expectations, and output options.

- [ ] Phase 12 — Storybook readiness: Add or update Pyxis Storybook page stories at exact prototype widths (`920px` desktop, `390px` mobile), ensure fonts/tokens/MSW data are deterministic, and add stable `data-region`/`data-part` selectors for comparison.

- [ ] Phase 13 — First end-to-end run (blocked by pre-existing CLI config decoding issue observed during smoke test): Run `css-visual-diff run --config pyxis-public-shows.yaml --modes capture,cssdiff,matched-styles,pixeldiff`, verify original starts with real `ppxis` header, verify footer exists, inspect diff PNGs, and record findings.

- [ ] Phase 14 — Report UX (partially complete: capture Markdown now includes validation summary; HTML/contact-sheet report still missing): Add an HTML or Markdown review report that links/embeds original screenshot, React screenshot, diff image, computed CSS diffs, matched-style winner diffs, and validation failures per section.

- [x] Phase 15 — Documentation and intern handoff: Update `css-visual-diff` README with prepare examples, add troubleshooting notes for DesignCanvas/pan-zoom prototypes, and link the implementation guide from the ticket.
