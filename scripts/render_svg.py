#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright"]
# ///
"""Rasterize an SVG to an exact-size PNG.

The share card and icons have SVG sources; the <head> references rasters (a link scraper won't
render SVG, and iOS won't use an SVG apple-touch-icon). `make-og.sh` / `make-icons.sh` prefer
`rsvg-convert` and fall back to this — it exists because this repo already carries Playwright
(see screenshots.py) but not librsvg. Chromium has no CLI crop and screenshotting an SVG file
directly leaves a page-margin band, so here the SVG is inlined at an exact pixel size in a
zero-margin page and the screenshot is clipped to it. Icons pass --transparent.

    scripts/render_svg.py assets/og.svg   assets/og.png     1200 630
    scripts/render_svg.py assets/icon.svg assets/icon-512.png 512 512 --transparent

First run needs the browser once:  uv run --with playwright playwright install chromium
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> None:
    pos = [a for a in sys.argv[1:] if not a.startswith("--")]
    transparent = "--transparent" in sys.argv
    src, out, w, h = pos[0], pos[1], int(pos[2]), int(pos[3])
    svg = Path(src).resolve().read_text(encoding="utf-8")

    html = (
        "<!doctype html><meta charset=utf-8>"
        "<style>*{margin:0;padding:0}html,body{background:transparent}"
        f"svg{{display:block;width:{w}px;height:{h}px}}</style>" + svg
    )

    # Bare launch finds Playwright's own Chromium, same as screenshots.py. CHROME_BIN overrides it
    # when a specific build must be pointed at.
    exe = os.environ.get("CHROME_BIN")
    launch = {"executable_path": exe} if exe and Path(exe).exists() else {}

    with sync_playwright() as p:
        browser = p.chromium.launch(**launch)
        page = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        page.set_content(html, wait_until="load")
        page.screenshot(path=out, clip={"x": 0, "y": 0, "width": w, "height": h},
                        omit_background=transparent)
        browser.close()
    print(f"wrote {out} ({w}x{h})")


if __name__ == "__main__":
    main()
