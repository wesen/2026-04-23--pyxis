---
Title: Built-in compare-region Archive content artifact
Ticket: PYXIS-CSSVD-JS-WORKFLOW
Status: active
Topics:
  - frontend
  - visual-diff
  - storybook
  - automation
  - pyxis
DocType: reference
Intent: short-term
Summary: Generated css-visual-diff built-in compare-region Markdown report for Archive content.
---

# css-visual-diff Compare Report

## Inputs

- URL 1: http://localhost:7070/standalone/public/archive.html
- Selector 1: `#root > *`
- URL 2: http://localhost:6007/iframe.html?id=public-site-pages--archive-desktop&viewMode=story
- Selector 2: `[data-page='archive']`
- Viewport: 920x1460
- Pixel threshold: 30

## Artifacts

- URL1 full: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/url1_full.png
- URL2 full: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/url2_full.png
- URL1 element: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/url1_screenshot.png
- URL2 element: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/url2_screenshot.png
- Diff comparison: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/diff_comparison.png
- Diff only: ttmp/2026/04/25/PYXIS-CSSVD-JS-WORKFLOW--explore-css-visual-diff-javascript-scripting-workflow/various/03-built-in-compare-region/archive-content/diff_only.png

## Pixel Diff Stats

- Total pixels: 1433360
- Changed pixels: 102172
- Changed percent: 7.1281%
- Normalized size: 920x1558

## Computed Style Diffs

| Property | URL1 | URL2 |
| --- | --- | --- |
| font-family | Inter, sans-serif | Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif |
| font-size | 16px | 14px |
| line-height | normal | 21px |
| padding-bottom | 0px | 72px |
| color | rgb(31, 30, 28) | rgb(26, 26, 24) |

## Winner Diffs (Matched Styles)

| Property | URL1 Winner | URL2 Winner |
| --- | --- | --- |
| font-family | style attribute (Inter, sans-serif; origin=inline; spec=1,0,0) | none |
| font-size | none | none |
| font-weight | none | none |
| line-height | none | none |
| padding-top | none | none |
| padding-right | none | none |
| padding-bottom | none | .pyxis-archive-page (72px; origin=author; spec=0,1,0) |
| padding-left | none | none |
| border-radius | none | none |
| color | style attribute (rgb(31, 30, 28); origin=inline; spec=1,0,0) | none |
| background-color | style attribute (rgb(255, 255, 255); origin=inline; spec=1,0,0) | .pyxis-public-page (rgb(255, 255, 255); origin=author; spec=0,1,0) |
| box-shadow | none | none |

