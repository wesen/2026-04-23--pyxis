# Changelog

## 2026-04-23

- Initial workspace created


## 2026-04-23 — Evaluate css-visual-diff LLM review with Z.ai

### Added
- Added detailed guide: `design/01-css-visual-diff-llm-review-analysis-design-implementation-guide.md`.
- Added diary: `reference/02-diary.md`.
- Added Z.ai docs snapshots under `sources/`.
- Added reproducible scripts:
  - `scripts/01-run-button-primary-llm-review-zai.sh`
  - `scripts/02-run-button-primary-llm-review-gemini.sh`
  - `scripts/03-run-button-primary-ai-review-gemini.sh`
- Added config-driven ai-review smoke test config: `sources/button-primary-ai-review-gemini.yaml`.

### Tested
- Added local uncommitted profile registry at `/home/manuel/.pinocchio/config/profiles.yaml` for `z-ai-glm-5v-turbo`.
- Confirmed Z.ai profile resolution through Pinocchio/Geppetto.
- Initial Z.ai inference failed with `429 code=1113` due missing credits/resource package.
- After credits were added, reran Z.ai `button-primary` review successfully.
- Ran Gemini fallback `llm-review` successfully.
- Ran Gemini config-driven `ai-review` successfully but documented hallucination risk for tiny crops.

### Results
- Successful Z.ai review produced `various/button-primary-llm-review-zai/llm-review.md`.
- Z.ai token usage: input `485`, output `1140`, total `1625`, cached `2`, reasoning `579`, max `2048`, duration `23730 ms`.
- `css-visual-diff` now prints token usage to stdout and includes it in `llm-review.md`.

## 2026-04-23 — Parked LLM-review quality assessment

### Added
- Added `design/02-llm-review-quality-assessment-and-improvement-plan.md`.

### Summary
- Rated the current Z.ai `button-primary` review around 7.5/10.
- Documented what the review did well: border radius, sizing, typography, and action order.
- Documented weaknesses: framework speculation, imprecise shape language, and over-inferred causality.
- Proposed later improvements: project-aware prompt, DOM/bounds input, value-level winning declarations, labeled contact sheet, and structured output.
