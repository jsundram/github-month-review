#!/usr/bin/env python3
"""Fetch a reproducible public GitHub activity snapshot for one month.

This collects facts only. It never writes narrative and never touches
data/months/. Run draft_month.py afterwards to turn a snapshot into a
month skeleton plus an interview.

Usage:
  GITHUB_TOKEN=... python3 scripts/fetch_github.py --month 2026-07
  GITHUB_TOKEN=... python3 scripts/fetch_github.py --month 2026-07 --until 2026-07-23

Without a token GitHub's unauthenticated rate limit is easy to exhaust.
Output goes to data/raw/<month>.json.
"""
from __future__ import annotations

import argparse
import calendar
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

API = "https://api.github.com"


def request_json(url: str, token: str | None) -> tuple[Any, dict[str, str]]:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "github-month-review",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            return json.load(response), {k.lower(): v for k, v in response.headers.items()}
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GitHub API returned {exc.code} for {url}: {body[:500]}") from exc


def parse_link(link: str | None) -> dict[str, str]:
    result: dict[str, str] = {}
    if not link:
        return result
    for part in link.split(","):
        url_part, *attrs = part.split(";")
        rel = next((a.split("=", 1)[1].strip(' "') for a in attrs if "rel=" in a), None)
        if rel:
            result[rel] = url_part.strip()[1:-1]
    return result


def paged(url: str, token: str | None, limit_pages: int = 20) -> list[Any]:
    output: list[Any] = []
    page = 0
    while url and page < limit_pages:
        payload, headers = request_json(url, token)
        if not isinstance(payload, list):
            raise RuntimeError(f"Expected a list from {url}")
        output.extend(payload)
        url = parse_link(headers.get("link")).get("next", "")
        page += 1
        if headers.get("x-ratelimit-remaining") == "0":
            reset = int(headers.get("x-ratelimit-reset", "0"))
            when = datetime.fromtimestamp(reset, tz=timezone.utc).isoformat() if reset else "unknown"
            raise RuntimeError(f"GitHub rate limit exhausted; resets at {when}")
        time.sleep(0.05)
    return output


def month_bounds(month: str) -> tuple[date, date]:
    try:
        year, mon = (int(part) for part in month.split("-", 1))
        return date(year, mon, 1), date(year, mon, calendar.monthrange(year, mon)[1])
    except (ValueError, calendar.IllegalMonthError) as exc:
        raise SystemExit(f"error: --month must look like 2026-07 (got {month!r})") from exc


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--user", default="jsundram")
    parser.add_argument("--month", required=True, help="YYYY-MM")
    parser.add_argument("--since", help="Override the start date (YYYY-MM-DD)")
    parser.add_argument("--until", help="Clamp the end date (YYYY-MM-DD); use for a month in progress")
    parser.add_argument("--output", help="Defaults to data/raw/<month>.json")
    args = parser.parse_args()

    first, last = month_bounds(args.month)
    start = date.fromisoformat(args.since) if args.since else first
    end = date.fromisoformat(args.until) if args.until else last
    if end < start:
        raise SystemExit("error: --until is before the start of the window")

    token = os.environ.get("GITHUB_TOKEN")
    since_iso, until_iso = f"{start}T00:00:00Z", f"{end}T23:59:59Z"

    repos_url = f"{API}/users/{urllib.parse.quote(args.user)}/repos?per_page=100&sort=pushed&type=owner"
    repos = paged(repos_url, token)

    snapshot: dict[str, Any] = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "user": args.user,
        "month": args.month,
        "coverage": {"start": start.isoformat(), "end": end.isoformat()},
        "repositories": [],
        "limitations": [
            "Only public repositories owned by the user are included.",
            "Commit author matching can miss alternate or unlinked email identities.",
            "Merge and coauthored commits are retained; interpret counts with care.",
        ],
    }

    for repo in repos:
        pushed = repo.get("pushed_at") or ""
        if pushed and pushed < since_iso:
            continue
        name = repo["name"]
        params = urllib.parse.urlencode(
            {"author": args.user, "since": since_iso, "until": until_iso, "per_page": 100}
        )
        commits = paged(f"{API}/repos/{args.user}/{urllib.parse.quote(name)}/commits?{params}", token)
        if not commits:
            continue
        snapshot["repositories"].append({
            "name": name,
            "html_url": repo["html_url"],
            "description": repo.get("description"),
            "language": repo.get("language"),
            "pushed_at": pushed,
            "commit_count": len(commits),
            "commits": [
                {
                    "sha": c["sha"],
                    "date": c["commit"]["author"]["date"],
                    "message": c["commit"]["message"].splitlines()[0],
                    "url": c["html_url"],
                }
                for c in commits
            ],
        })

    snapshot["repositories"].sort(key=lambda r: r["commit_count"], reverse=True)
    output = Path(args.output or f"data/raw/{args.month}.json")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")

    total = sum(r["commit_count"] for r in snapshot["repositories"])
    print(f"Wrote {output}: {len(snapshot['repositories'])} repos, {total} commits, {start}–{end}")
    print(f"Next: python3 scripts/draft_month.py --month {args.month}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
