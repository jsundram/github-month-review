#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright"]
# ///
"""Capture the page with Playwright, so layout can be checked without a browser open.

    uv run scripts/screenshots.py                 # every shot, into shots/
    uv run scripts/screenshots.py --only july-full
    uv run scripts/screenshots.py --list

First run needs the browser once:  uv run --with playwright playwright install chromium

Shots cover the states that are easy to break and impossible to see in the render
test: quiet weeks, a fully quiet month, the open month menu, expanded evidence,
and mobile. The quiet month is injected at runtime — it is not real data and is
not written to disk.
"""
from __future__ import annotations

import argparse
import functools
import http.server
import socket
import socketserver
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "shots"

DESKTOP = {"width": 1440, "height": 950}
MOBILE = {"width": 390, "height": 844}

# There is no real quiet month yet, so one is served by intercepting the two data
# requests. app.js copies the month list into a closure at startup, so appending to
# window.REVIEW_INDEX afterwards does nothing — the index has to arrive already
# containing the month. Nothing here is written to disk.
QUIET_MONTH_JS = """
window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};
window.REVIEW_MONTHS["2026-05"] = {
  id: "2026-05", label: "May 2026", status: "quiet",
  coverage: { start: "2026-05-01", end: "2026-05-31" },
  lede: "Nothing landed publicly this month.",
  quietNote: "Rehearsals and touring, and a week of not looking at a screen. No public commits, and nothing here worth padding into a page.",
  metrics: [], weeks: []
};
"""

QUIET_MONTH_ENTRY = """
window.REVIEW_INDEX.months.push({
  id: "2026-05", label: "May 2026", file: "data/months/2026-05.js",
  status: "quiet", blurb: "Touring. Nothing public."
});
"""


def stub_quiet_month(page) -> None:
    index_js = (ROOT / "data" / "index.js").read_text(encoding="utf-8")
    page.route("**/data/index.js", lambda route: route.fulfill(
        content_type="application/javascript", body=index_js + QUIET_MONTH_ENTRY))
    page.route("**/data/months/2026-05.js", lambda route: route.fulfill(
        content_type="application/javascript", body=QUIET_MONTH_JS))


def serve(directory: Path) -> tuple[str, socketserver.TCPServer]:
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(directory))
    handler.log_message = lambda *a, **k: None  # type: ignore[method-assign]
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        port = probe.getsockname()[1]
    httpd = socketserver.TCPServer(("127.0.0.1", port), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{port}", httpd


# Week ids start with a digit ("2026-07-w3"), which is a valid HTML id but an
# invalid CSS selector. Address them as [id="..."], never as #....
def settle(page) -> None:
    page.wait_for_function("document.querySelector('#weekList').children.length > 0")
    page.wait_for_timeout(350)          # reveal + collapse transitions


def main() -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("error: playwright is missing. Run with: uv run scripts/screenshots.py", file=sys.stderr)
        return 1

    shots = {
        "july-full": "July 2026, full page",
        "july-evidence": "July with evidence expanded",
        "july-menu": "July with the month menu open",
        "june-full": "June 2026, full page (two uncovered weeks)",
        "june-quiet-weeks": "June's quiet-week rows, close up",
        "quiet-month": "A month with no activity at all",
        "july-mobile": "July on a phone",
        "july-print": "July as it prints",
    }

    parser = argparse.ArgumentParser()
    parser.add_argument("--only", action="append", choices=sorted(shots), help="Capture just this shot")
    parser.add_argument("--list", action="store_true", help="List the shots and exit")
    args = parser.parse_args()

    if args.list:
        for name, desc in shots.items():
            print(f"  {name:<18} {desc}")
        return 0

    wanted = args.only or list(shots)
    OUT.mkdir(exist_ok=True)
    base, httpd = serve(ROOT)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch()

            def new_page(viewport=DESKTOP, quiet_month=False):
                page = browser.new_page(viewport=viewport, device_scale_factor=2)
                if quiet_month:
                    stub_quiet_month(page)
                return page

            if "july-full" in wanted:
                page = new_page()
                page.goto(f"{base}/#2026-07")
                settle(page)
                page.screenshot(path=OUT / "july-full.png", full_page=True)
                page.close()

            if "july-evidence" in wanted:
                page = new_page()
                page.goto(f"{base}/#2026-07")
                settle(page)
                page.click("#evidenceToggle")
                page.wait_for_timeout(500)
                page.locator('[id="2026-07-w3"]').scroll_into_view_if_needed()
                page.wait_for_timeout(400)
                page.screenshot(path=OUT / "july-evidence.png")
                page.close()

            if "july-menu" in wanted:
                page = new_page()
                page.goto(f"{base}/#2026-07")
                settle(page)
                page.click("#monthCurrent")
                page.wait_for_timeout(250)
                page.screenshot(path=OUT / "july-menu.png", clip={"x": 0, "y": 0, "width": 1440, "height": 460})
                page.close()

            if "june-full" in wanted:
                page = new_page()
                page.goto(f"{base}/#2026-06")
                settle(page)
                page.screenshot(path=OUT / "june-full.png", full_page=True)
                page.close()

            if "june-quiet-weeks" in wanted:
                page = new_page()
                page.goto(f"{base}/#2026-06")
                settle(page)
                page.locator('[id="2026-06-w1"]').scroll_into_view_if_needed()
                page.wait_for_timeout(400)
                page.screenshot(path=OUT / "june-quiet-weeks.png")
                page.close()

            if "quiet-month" in wanted:
                page = new_page(quiet_month=True)
                page.goto(f"{base}/#2026-05")
                page.wait_for_function("/May/.test(document.querySelector('#heroTitle').textContent)")
                page.wait_for_timeout(400)
                page.screenshot(path=OUT / "quiet-month.png", full_page=True)
                page.close()

            if "july-mobile" in wanted:
                page = new_page(viewport=MOBILE)
                page.goto(f"{base}/#2026-07")
                settle(page)
                page.screenshot(path=OUT / "july-mobile.png", full_page=True)
                page.close()

            if "july-print" in wanted:
                page = new_page()
                page.goto(f"{base}/#2026-07")
                settle(page)
                page.emulate_media(media="print")
                page.wait_for_timeout(250)
                page.screenshot(path=OUT / "july-print.png", full_page=True)
                page.close()

            browser.close()
    finally:
        httpd.shutdown()

    for name in wanted:
        path = OUT / f"{name}.png"
        mark = "ok  " if path.exists() else "MISS"
        print(f"  {mark} shots/{name}.png")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
