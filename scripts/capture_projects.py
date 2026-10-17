#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright"]
# ///
"""Capture one screenshot per project into assets/projects/<repo>.jpg.

    uv run scripts/capture_projects.py                       # every project
    uv run scripts/capture_projects.py --only mbta-glx AKM   # just these
    uv run scripts/capture_projects.py --list

The images are generated, never hand-edited: change PROJECTS below and rerun.
Each run also rewrites scripts/project_images.json ({repo: {src, alt}}), which is
what the month files' `image` fields are copied from.

They are current screenshots, not period ones — a project shown in June looks the
way it does on the day this last ran. That is deliberate: they give a flavour of
the work, and are not evidence of what existed when.

A project's source is one of:
  url       a live page, captured at 1200x750
  files     images from a repo (raw URLs), stacked and fitted into the frame
  lilypond  a page of an engraved score, built locally from a (possibly private)
            repo; needs `lilypond` on PATH and a GITHUB_TOKEN that can read it

First run needs the browser once:  uv run --with playwright playwright install chromium
"""
from __future__ import annotations

import argparse
import html
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "projects"
MAPPING = ROOT / "scripts" / "project_images.json"
W, H = 1200, 750          # 16:10, matches the card's reserved box
# A "narrow" page is a centred, phone-width app: shot at half the width and twice the
# pixel density, so its content fills the frame instead of floating in it.
QUALITY = 72              # JPEG; keeps a busy page near 100 KB
RAW = "https://raw.githubusercontent.com/jsundram"
PAGES = "https://jsundram.github.io"

PROJECTS: dict[str, dict] = {
    "AKM": {
        "url": f"{PAGES}/AKM/",
        "narrow": True,
        "click": "#whox",         # close the "Who are you?" roster picker, which lists real names
        "alt": "The AlpenKammerMusik daily briefing for Monday 29 June, opening with the day's forecast and temperature curve.",
    },
    "boccherini-haydn-timeline": {
        "files": [f"{RAW}/boccherini-haydn-timeline/HEAD/output/timeline.png"],
        "alt": "\"Two Lives in Quartets\": Haydn's quartets on the left and Boccherini's on the right, one bar per opus on a shared timeline from 1760 to 1805.",
    },
    "boccherini-opus-48": {
        # The repo is private and the edition unpublished; the owner chose this screenshot of
        # the review page over an engraved page. Source kept beside the output; see src/.
        "files": ["assets/projects/src/boccherini-opus-48.jpg"],
        "crop_top": True,
        "alt": "The edition's review page for Op. 48 No. 5, Larghetto: each part's manuscript above the engraving, bar line under bar line, under a map of the movement's open CHECKs.",
    },
    "boccherini-sampler": {
        "url": f"{PAGES}/boccherini-sampler/",
        "narrow": True,
        "alt": "The Boccherini Sampler: a reading-party page that bundles each group's parts into one PDF per instrument.",
    },
    "github-month-review": {
        "url": f"{PAGES}/github-month-review/",
        "alt": "This review's August 2026 page: the month in large type above its lede.",
    },
    "haydn-info-card": {
        "url": f"{PAGES}/haydn-info-card/",
        "alt": "Joseph Haydn — The 68 String Quartets: a grid of cards, one per quartet, giving its key, in rows by opus.",
    },
    "haydn-lowdn": {
        "url": f"{PAGES}/haydn-lowdn/",
        "alt": "Haydn String Quartets — Pitch Extremes by Movement: a coloured bar per part spanning each movement's lowest to highest note.",
    },
    "haydnenthusiasts.org": {
        "url": "https://haydnenthusiasts.org/",
        "alt": "The Haydn Enthusiasts concerts page: a strip of past concerts above a listing for a Haydn birthday concert on March 31, 2025.",
    },
    "lissajous-tuner": {
        "url": f"{PAGES}/lissajous-tuner/",
        "narrow": True,
        "alt": "The Lissajous Tuner before it starts listening: Violin, Viola and Cello tabs, a Start listening button, and string pins for G3, D4, A4 and E5.",
    },
    "lobsters-and-lighthouses": {
        "url": "https://lobsters-lighthouses.netlify.app/",
        "narrow": True,
        "alt": "Lobsters & Lighthouses: the June 22 day trip from Somerville up the coast to Cape Elizabeth and home — 10 stops, 255 miles, 5:50 of driving.",
    },
    "maestoso-127": {
        "url": f"{PAGES}/maestoso-127/viz/",
        "alt": "Opus 127: Maestoso — the opening bars in score above semicircles comparing recorded performances' timings.",
    },
    "manuscript-labeler": {
        "files": [f"{RAW}/manuscript-labeler/HEAD/static/models/img/{name}.jpg" for name in (
            "detectron2-khm-0", "detectron2-parisa-3", "detectron2-parisb-0",
            "detectron2-khm-5", "detectron2-parisb-5")],
        "alt": "Five strips of handwritten manuscript staves, each bar line found by a detector marked with its confidence.",
    },
    "mbta-glx": {
        "url": f"{PAGES}/mbta-glx/",
        "narrow": True,
        "alt": "The Magoun Square board, headed by two notices of upcoming Green Line suspensions.",
    },
    "nh_tax_map": {
        "url": f"{PAGES}/nh_tax_map/",
        "alt": "New Hampshire Property Tax Rates: a map of the state's towns shaded green by tax rate, for 2025.",
    },
    "pwa-starter": {
        "url": f"{PAGES}/pwa-starter/",
        "narrow": True,
        "alt": "pwa-starter's placeholder shell: an APP header and a box asking to be replaced.",
    },
    "quartet-chooser": {
        "url": "https://quartetroulette.com/",
        "quality": 55,            # dense portraits; 72 comes out near 150 KB
        "alt": "Quartet Roulette's home page: a grid of illustrated composer portraits.",
    },
    "quartet-composers": {
        "url": f"{PAGES}/quartet-composers/",
        "alt": "String Quartet Composers, Fame view: a histogram of Wikipedia readership above a scatter of 790 composers.",
    },
    "quartet-log": {
        "url": "https://log.quartetroulette.com/",
        "narrow": True,
        "alt": "Quartet Log's setup screen, asking for the URL of a published Google Sheet.",
    },
    "quartets.boccherini.org": {
        "url": "https://quartets.boccherini.org/",
        "alt": "Luigi Boccherini (1743–1805) – 91 String Quartets: a grid of cards, one per quartet, giving its key, in rows by opus.",
    },
    "somerville-typemap": {
        "files": [f"{RAW}/somerville-typemap/HEAD/experiments/warp/sheet.svg"],
        "alt": "Somerville neighbourhood names warped to fill the shapes of their areas — Ball Square, Davis Square, Magoun Square and others.",
    },
    "spotify-tile": {
        "files": [f"{RAW}/spotify-tile/HEAD/references/processed/renders/{name}.png" for name in (
            "holocene", "judas", "bohemian-rhapsody")],
        "layout": "row",
        "alt": "Three Spotify Tile renders: abstract geometric tiles, each generated from one song.",
    },
}
# Not captured: boccherini-quartet-data and boccherini-sources have no page and no
# image that shows what they are.


def token() -> str | None:
    if os.environ.get("GITHUB_TOKEN"):
        return os.environ["GITHUB_TOKEN"]
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if line.startswith("GITHUB_TOKEN="):
                return line.split("=", 1)[1].strip().strip("'\"")
    return None


def curl(url: str, dest: Path, auth: bool = False) -> None:
    """curl, not urllib: urllib responses were truncated behind a filtering proxy.
    The token goes in on stdin as a curl config line, never on the command line."""
    config = ""
    if auth:
        tok = token()
        if not tok:
            raise RuntimeError("needs GITHUB_TOKEN (in the environment or .env)")
        config = f'header = "Authorization: Bearer {tok}"\n'
    subprocess.run(["curl", "-sSfL", "-K", "-", "-o", str(dest), url],
                   input=config, text=True, check=True)


def frame(page, images: list[Path], dest: Path, layout: str = "column", crop_top: bool = False) -> None:
    """Fit local images into a WxH frame and screenshot it."""
    fit = "width:100%;height:auto" if crop_top else "max-width:100%;max-height:100%;object-fit:contain;min-height:0"
    direction = "row" if layout == "row" else "column"
    tags = "".join(f'<img src="{html.escape(p.name)}" style="{fit};flex:1 1 0;min-width:0">' for p in images)
    doc = images[0].parent / "frame.html"
    doc.write_text(f"""<!doctype html><meta charset="utf-8">
<style>html,body{{margin:0;background:#f4f1ea}}
.f{{width:{W}px;height:{H}px;display:flex;flex-direction:{direction};gap:14px;padding:{0 if crop_top else 24}px;
box-sizing:border-box;align-items:center;justify-content:{'flex-start' if crop_top else 'center'};overflow:hidden}}</style>
<div class="f">{tags}</div>""", encoding="utf-8")
    page.goto(doc.as_uri())
    page.wait_for_load_state("load")
    page.screenshot(path=str(dest), type="jpeg", quality=QUALITY, clip={"x": 0, "y": 0, "width": W, "height": H})


def capture(page, repo: str, spec: dict, dest: Path, work: Path) -> None:
    if "url" in spec:
        try:
            page.goto(spec["url"], wait_until="networkidle", timeout=30_000)
        except Exception:
            page.goto(spec["url"], wait_until="load", timeout=30_000)
        page.wait_for_timeout(spec.get("settle", 1500))
        if "click" in spec:
            page.click(spec["click"])
            page.wait_for_timeout(500)
        vp = page.viewport_size
        page.screenshot(path=str(dest), type="jpeg", quality=spec.get("quality", QUALITY),
                        clip={"x": 0, "y": 0, "width": vp["width"], "height": vp["height"]})
    elif "files" in spec:
        local = []
        for i, url in enumerate(spec["files"]):
            path = work / f"{i}{Path(url).suffix}"
            if url.startswith("https://"):
                curl(url, path)
            else:                                   # a source committed in this repo
                shutil.copyfile(ROOT / url, path)
            local.append(path)
        frame(page, local, dest, spec.get("layout", "column"), crop_top=spec.get("crop_top", False))
    elif "lilypond" in spec:
        ly = spec["lilypond"]
        if not shutil.which("lilypond"):
            raise RuntimeError("lilypond is not on PATH")
        tgz = work / "src.tgz"
        curl(f"https://api.github.com/repos/jsundram/{ly['repo']}/tarball/HEAD", tgz, auth=True)
        with tarfile.open(tgz) as tar:
            tar.extractall(work, filter="data")
        src = next(p for p in work.iterdir() if p.is_dir())
        # A4 at 145 dpi is ~1200 px wide.
        cmd = ["lilypond", "--loglevel=ERROR", "--png", "-dresolution=145"]
        for inc in ly.get("include", []):
            cmd += ["-I", str(src / inc)]
        cmd += ["-o", str(work / "score"), ly["score"]]
        subprocess.run(cmd, cwd=src, check=True)
        frame(page, [work / f"score-page{ly.get('page', 1)}.png"], dest, crop_top=True)
    else:
        raise RuntimeError("no url, files, or lilypond source")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("--only", nargs="+", metavar="REPO", help="capture just these repos")
    parser.add_argument("--list", action="store_true", help="print the table and stop")
    parser.add_argument("--mapping", action="store_true",
                        help="rewrite project_images.json from the table and the images on disk, capturing nothing")
    args = parser.parse_args()

    if args.list:
        for repo, spec in PROJECTS.items():
            kind = next(k for k in ("url", "files", "lilypond") if k in spec)
            print(f"{repo:28} {kind:9} {spec[kind] if kind == 'url' else ''}")
        return 0

    if args.mapping:
        return write_mapping()

    wanted = args.only or list(PROJECTS)
    unknown = [r for r in wanted if r not in PROJECTS]
    if unknown:
        print(f"error: not in PROJECTS: {', '.join(unknown)}", file=sys.stderr)
        return 1

    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    failed = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        context = browser.new_context(viewport={"width": W, "height": H}, device_scale_factor=1,
                                      color_scheme="light")
        narrow = browser.new_context(viewport={"width": W // 2, "height": H // 2}, device_scale_factor=2,
                                     color_scheme="light")
        for repo in wanted:
            page = (narrow if PROJECTS[repo].get("narrow") else context).new_page()
            dest = OUT / f"{repo}.jpg"
            with tempfile.TemporaryDirectory() as tmp:
                try:
                    capture(page, repo, PROJECTS[repo], dest, Path(tmp))
                    print(f"  {repo:28} {dest.stat().st_size // 1024:4} KB")
                except Exception as exc:
                    failed.append(repo)
                    print(f"  {repo:28} FAILED: {str(exc).splitlines()[0][:100]}", file=sys.stderr)
            page.close()
        browser.close()

    write_mapping()
    return 1 if failed else 0


def write_mapping() -> int:
    mapping = {repo: {"src": f"assets/projects/{repo}.jpg", "alt": spec["alt"]}
               for repo, spec in PROJECTS.items() if (OUT / f"{repo}.jpg").exists()}
    MAPPING.write_text(json.dumps(mapping, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {MAPPING.relative_to(ROOT)} ({len(mapping)} projects)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
