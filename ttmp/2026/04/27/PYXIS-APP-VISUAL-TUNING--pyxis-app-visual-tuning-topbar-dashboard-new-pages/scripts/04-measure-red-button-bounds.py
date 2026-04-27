#!/usr/bin/env python3
"""Measure red/accent-colored connected regions in visual-diff screenshots.

This diagnostic helper was used during TopBar tuning to compare approximate
button/action bounds in css-visual-diff artifacts. It does not replace
css-visual-diff; it only summarizes red accent regions in already-captured
images such as `left_region.png`, `right_region.png`, or `diff_only.png`.

Why connected components?
    Anti-aliased dark text may contain isolated red subpixels. Reporting only
    sufficiently large connected components makes the output more useful for
    button-sized red/accent shapes.

Example:

    python3 04-measure-red-button-bounds.py \
      /tmp/pyxis-topbar-after-actions/app-topbar-dashboard/artifacts/component/left_region.png \
      /tmp/pyxis-topbar-after-actions/app-topbar-dashboard/artifacts/component/right_region.png

Output fields:
- image path
- image size
- component index
- component pixel count
- bounding box: min_x,min_y,max_x,max_y

Treat results as approximate visual debugging evidence.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover - operator-facing script
    raise SystemExit("Pillow is required: python3 -m pip install Pillow") from exc


def is_accent_red(pixel: tuple[int, int, int]) -> bool:
    """Return True for Pyxis accent-like red/orange pixels.

    Keep this intentionally conservative so anti-aliased black text does not
    dominate the measurement.
    """
    r, g, b = pixel
    return r >= 175 and 15 <= g <= 85 and b <= 65 and (r - g) >= 90 and (r - b) >= 110


def connected_components(mask: set[tuple[int, int]]) -> list[list[tuple[int, int]]]:
    remaining = set(mask)
    components: list[list[tuple[int, int]]] = []

    while remaining:
        start = remaining.pop()
        queue: deque[tuple[int, int]] = deque([start])
        component = [start]

        while queue:
            x, y = queue.popleft()
            for neighbor in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if neighbor in remaining:
                    remaining.remove(neighbor)
                    queue.append(neighbor)
                    component.append(neighbor)

        components.append(component)

    components.sort(key=len, reverse=True)
    return components


def measure(path: Path, min_area: int) -> list[dict[str, object]]:
    image = Image.open(path).convert("RGB")
    mask: set[tuple[int, int]] = set()

    for y in range(image.height):
        for x in range(image.width):
            if is_accent_red(image.getpixel((x, y))):
                mask.add((x, y))

    rows: list[dict[str, object]] = []
    for index, component in enumerate(connected_components(mask), start=1):
        if len(component) < min_area:
            continue
        xs = [p[0] for p in component]
        ys = [p[1] for p in component]
        rows.append(
            {
                "path": str(path),
                "size": f"{image.width}x{image.height}",
                "component": index,
                "pixels": len(component),
                "bbox": f"{min(xs)},{min(ys)},{max(xs)},{max(ys)}",
                "bbox_width": max(xs) - min(xs) + 1,
                "bbox_height": max(ys) - min(ys) + 1,
            }
        )
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("images", nargs="+", type=Path, help="PNG/JPEG images to inspect")
    parser.add_argument("--min-area", type=int, default=80, help="Minimum connected red pixels to report")
    args = parser.parse_args()

    missing = [path for path in args.images if not path.exists()]
    if missing:
        raise SystemExit("Missing image(s): " + ", ".join(str(path) for path in missing))

    any_rows = False
    for path in args.images:
        rows = measure(path, args.min_area)
        if not rows:
            print(f"{path}\tno components >= {args.min_area} pixels")
            continue
        any_rows = True
        for row in rows:
            print(
                f"{row['path']}\t"
                f"size={row['size']}\t"
                f"component={row['component']}\t"
                f"pixels={row['pixels']}\t"
                f"bbox={row['bbox']}\t"
                f"bbox_width={row['bbox_width']}\t"
                f"bbox_height={row['bbox_height']}"
            )

    if not any_rows:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
