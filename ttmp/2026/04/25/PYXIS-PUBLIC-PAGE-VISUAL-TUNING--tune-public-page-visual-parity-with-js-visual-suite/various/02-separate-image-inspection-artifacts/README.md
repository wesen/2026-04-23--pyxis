# 02 — Separate image inspection artifacts

This folder preserves the intermediate css-visual-diff artifacts used when switching from the combined triptych (`diff_comparison.png`) to separate raw crop analysis.

The most useful files are:

```text
shows-artifacts/shows/artifacts/header/left_region.png
shows-artifacts/shows/artifacts/header/right_region.png
shows-artifacts/shows/artifacts/shows-list/left_region.png
shows-artifacts/shows/artifacts/shows-list/right_region.png
shows-artifacts/shows/artifacts/mailing-list/left_region.png
shows-artifacts/shows/artifacts/mailing-list/right_region.png
```

Takeaway:

- Header mismatch is mostly page gutter/top-spacing/header-padding/color ownership.
- Shows-list mismatch is primarily data/fixture mismatch: prototype has 9 varied shows; React story has 6 mostly default redroom posters.
- Mailing-list component is close; its large y delta is caused by the shorter React shows list above it.

These are historical/debug artifacts for retracing the tuning process; they are not active workflow inputs.
