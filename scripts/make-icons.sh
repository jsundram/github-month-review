#!/usr/bin/env bash
# Rasterize assets/icon.svg -> the home-screen / favicon PNGs. icon.svg is the SINGLE SOURCE OF
# TRUTH: edit the SVG, rerun this, never hand-edit the PNGs. RUN THIS on a fresh clone — the <head>
# references icon-180.png (apple-touch-icon) and icon-192.png (favicon PNG fallback).
#   180 = apple-touch-icon   192/512 = large PNG fallbacks
#
# Adopted from jsundram/pwa-starter (scripts/make-icons.sh). Prefers rsvg-convert (librsvg); with no
# rsvg on PATH it delegates to render_svg.py (Playwright) — see that file.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
cd "$here/../assets"
for s in 180 192 512; do
  if command -v rsvg-convert >/dev/null; then
    rsvg-convert -w "$s" -h "$s" icon.svg -o "icon-$s.png"
  else
    uv run "$here/render_svg.py" icon.svg "icon-$s.png" "$s" "$s" --transparent
  fi
done
echo "wrote assets/icon-{180,192,512}.png"
