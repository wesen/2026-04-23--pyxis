# css-visual-diff Compare Report

## Inputs

- URL 1: http://localhost:8792/original-prepared.html
- Selector 1: `[data-comp='button-primary'] button`
- URL 2: http://localhost:8792/react-prepared.html
- Selector 2: `[data-comp='button-primary'] button`
- Viewport: 1200x1200
- Pixel threshold: 30

## Artifacts

- URL1 full: /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/url1_full.png
- URL2 full: /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/url2_full.png
- URL1 element: /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/url1_screenshot.png
- URL2 element: /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/url2_screenshot.png
- Diff comparison: /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/diff_comparison.png
- Diff only: /home/manuel/code/wesen/2026-04-23--pyxis/ttmp/2026/04/23/PYXIS-CSS-VD-LLM-REVIEW--evaluate-css-visual-diff-llm-review-with-z-ai-glm-5v/various/button-primary-llm-review-zai/diff_only.png

## Pixel Diff Stats

- Total pixels: 4920
- Changed pixels: 1642
- Changed percent: 33.3740%
- Normalized size: 123x40

## Computed Style Diffs

| Property | URL1 | URL2 |
| --- | --- | --- |
| height | 33.5938px | 40px |
| width | 117.422px | 123.141px |
| padding-top | 8px | 7px |
| padding-bottom | 8px | 7px |
| font-size | 13px | 14px |
| font-weight | 500 | 400 |
| line-height | 15.6px | 16.8px |
| border-radius | 8px | 0px |

## Winner Diffs (Matched Styles)

| Property | URL1 Winner | URL2 Winner |
| --- | --- | --- |
| height | none | style attribute (40px; origin=inline; spec=1,0,0) |
| width | style attribute (auto; origin=inline; spec=1,0,0) | none |
| padding-top | style attribute (8px; origin=inline; spec=1,0,0) | style attribute (7px; origin=inline; spec=1,0,0) |
| padding-right | style attribute (16px; origin=inline; spec=1,0,0) | style attribute (16px; origin=inline; spec=1,0,0) |
| padding-bottom | style attribute (8px; origin=inline; spec=1,0,0) | style attribute (7px; origin=inline; spec=1,0,0) |
| padding-left | style attribute (16px; origin=inline; spec=1,0,0) | style attribute (16px; origin=inline; spec=1,0,0) |
| font-size | style attribute (13px; origin=inline; spec=1,0,0) | style attribute (0.875rem; origin=inline; spec=1,0,0) |
| font-weight | style attribute (500; origin=inline; spec=1,0,0) | style attribute (var(--weight-medium); origin=inline; spec=1,0,0) |
| line-height | style attribute (1.2; origin=inline; spec=1,0,0) | style attribute (1.2; origin=inline; spec=1,0,0) |
| color | style attribute (rgb(255, 255, 255); origin=inline; spec=1,0,0) | style attribute (rgb(255, 255, 255); origin=inline; spec=1,0,0) |
| background-color | style attribute (rgb(200, 39, 13); origin=inline; spec=1,0,0) | style attribute (rgb(200, 39, 13); origin=inline; spec=1,0,0) |
| border-radius | style attribute (8px; origin=inline; spec=1,0,0) | style attribute (var(--radius-md); origin=inline; spec=1,0,0) |
| border-top-width | style attribute (1px; origin=inline; spec=1,0,0) | style attribute (1px; origin=inline; spec=1,0,0) |
| border-top-color | style attribute (rgb(200, 39, 13); origin=inline; spec=1,0,0) | style attribute (rgb(200, 39, 13); origin=inline; spec=1,0,0) |
| gap | style attribute (7px; origin=inline; spec=1,0,0) | style attribute (7px; origin=inline; spec=1,0,0) |
| display | style attribute (inline-flex; origin=inline; spec=1,0,0) | style attribute (inline-flex; origin=inline; spec=1,0,0) |
| align-items | style attribute (center; origin=inline; spec=1,0,0) | style attribute (center; origin=inline; spec=1,0,0) |

