#!/usr/bin/env python3
"""Fetch one month of Modal billing, by day and app.

    python3 scripts/fetch_modal.py --month 2026-10

Runs `modal billing report --json -r d` (signed-in `modal` CLI needed) and writes
private/modal/<month>.json. App names can name private work, so the file is
gitignored; build_log.py publishes only daily totals.

This is real billed spend, unlike the token-priced estimates for Claude and Codex.

Exit codes: 0 fetched, 3 skipped (no `modal` CLI), 1 error.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", required=True, help="YYYY-MM")
    args = parser.parse_args()

    if not shutil.which("modal"):
        print("  no `modal` CLI on PATH; skipped Modal billing", file=sys.stderr)
        return 3

    year, mon = (int(p) for p in args.month.split("-"))
    start = date(year, mon, 1)
    end = date(year + mon // 12, mon % 12 + 1, 1)          # exclusive, and reports stay under 31 days
    today = date.today()
    if start > today:
        print(f"  {args.month} has not started; nothing to fetch", file=sys.stderr)
        return 3
    cmd = ["modal", "billing", "report", "--start", start.isoformat(), "--json", "-r", "d"]
    if end <= today:
        cmd += ["--end", end.isoformat()]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode:
        print(f"error: {' '.join(cmd)} failed:\n{result.stderr.strip() or result.stdout.strip()}", file=sys.stderr)
        return 1
    rows = json.loads(result.stdout or "[]")

    out = ROOT / "private" / "modal" / f"{args.month}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({
        "month": args.month,
        "fetched": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "rows": [{"day": r["interval_start"][:10], "app": r.get("description"), "cost": float(r["cost"])}
                 for r in rows],
    }, indent=1) + "\n", encoding="utf-8")
    total = sum(float(r["cost"]) for r in rows)
    print(f"Wrote {out.relative_to(ROOT)}: {len(rows)} rows, ${total:.2f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
