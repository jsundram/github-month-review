#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = []
# ///
"""One entry point for refreshing the review. Safe to schedule.

    uv run update.py                     # refresh the current month
    uv run update.py --month 2026-06     # a specific month
    uv run update.py --new               # draft a month that has no file yet
    uv run update.py --check             # just run the render test
    uv run update.py --shots             # also capture screenshots

The one rule this script enforces: **it never overwrites narrative.** If a month
already has a hand-written file, a refresh only re-fetches the snapshot and
reports what has landed since the narrative was written. Rewriting a month that
already has prose requires --new --force, which says so out loud.

A GITHUB_TOKEN raises the API rate limit from 60 to 5,000 requests/hour. Put it
in a .env file next to this script (gitignored) as GITHUB_TOKEN=..., or export
it. A fine-grained token with "Public repositories (read-only)" access is enough.

Scheduling (weekly, Monday 08:00):

    0 8 * * 1  cd /path/to/repo && /opt/homebrew/bin/uv run update.py >> update.log 2>&1

Exit codes: 0 nothing to do or work reported, 1 error, 2 stale (--fail-on-stale).
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PY = sys.executable


def sh(*args: str, quiet: bool = False) -> subprocess.CompletedProcess:
    result = subprocess.run(args, cwd=ROOT, capture_output=True, text=True)
    if not quiet and result.stdout.strip():
        print("\n".join(f"  {line}" for line in result.stdout.strip().splitlines()))
    if result.returncode and result.stderr.strip():
        print("\n".join(f"  {line}" for line in result.stderr.strip().splitlines()), file=sys.stderr)
    return result


def step(title: str) -> None:
    print(f"\n\033[1m{title}\033[0m" if sys.stdout.isatty() else f"\n{title}")


def current_month() -> str:
    return date.today().strftime("%Y-%m")


def load_dotenv() -> None:
    """Read KEY=VALUE lines from .env into the environment (real env vars win)."""
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def snapshot_provenance(snapshot: dict) -> dict:
    commits = [c for r in snapshot.get("repositories", []) for c in r["commits"]]
    return {
        "commit_count": len(commits),
        "last_commit": max((c["date"] for c in commits), default=None),
        "repos": {r["name"]: r["commit_count"] for r in snapshot.get("repositories", [])},
        "shas": sorted(c["sha"] for c in commits),
        "by_sha": {c["sha"]: c for r in snapshot.get("repositories", []) for c in r["commits"]},
    }


def report_drift(month: str, snapshot: dict, prior: dict) -> list[dict]:
    """Commits present in the fresh snapshot but not in the drafted-against one."""
    fresh = snapshot_provenance(snapshot)
    known = set(prior.get("shas", []))
    new = [fresh["by_sha"][sha] for sha in fresh["shas"] if sha not in known]
    new.sort(key=lambda c: c["date"])
    return new


def write_pending(month: str, new_commits: list[dict], snapshot: dict) -> Path:
    by_repo: dict[str, list[dict]] = {}
    for repo in snapshot.get("repositories", []):
        for commit in repo["commits"]:
            if any(commit["sha"] == c["sha"] for c in new_commits):
                by_repo.setdefault(repo["name"], []).append(commit)

    lines = [
        f"# Pending — {month}",
        "",
        f"{len(new_commits)} commit(s) have landed since the narrative for this month was written.",
        "The month file was **not** modified. Decide what, if anything, belongs in the prose,",
        "edit `data/months/" + month + ".js` by hand, then re-run `uv run update.py` to clear this.",
        "",
    ]
    for name, commits in sorted(by_repo.items(), key=lambda kv: -len(kv[1])):
        lines.append(f"## {name} ({len(commits)})")
        lines.append("")
        for commit in sorted(commits, key=lambda c: c["date"]):
            lines.append(f"- `{commit['date'][:10]}` {commit['message']} — {commit['url']}")
        lines.append("")

    path = ROOT / "drafts" / f"{month}-pending.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")
    return path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Refresh the GitHub month review.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Scheduling")[1] if "Scheduling" in __doc__ else None,
    )
    parser.add_argument("--month", default=None, help="YYYY-MM (default: the current month)")
    parser.add_argument("--user", default="jsundram")
    parser.add_argument("--new", action="store_true",
                        help="Draft a skeleton and interview for a month that has no file yet")
    parser.add_argument("--force", action="store_true",
                        help="With --new: regenerate a month file that already exists, DISCARDING its narrative")
    parser.add_argument("--no-fetch", action="store_true", help="Use the snapshot already on disk")
    parser.add_argument("--check", action="store_true", help="Run the render test and stop")
    parser.add_argument("--no-check", action="store_true", help="Skip the render test")
    parser.add_argument("--shots", action="store_true", help="Capture screenshots when done")
    parser.add_argument("--fail-on-stale", action="store_true",
                        help="Exit 2 if a month's narrative is behind its snapshot (for CI)")
    args = parser.parse_args()
    load_dotenv()

    if args.check:
        step("Render test")
        return 0 if sh("node", "scripts/smoke_test.js").returncode == 0 else 1

    month = args.month or current_month()
    today = date.today().isoformat()
    month_file = ROOT / "data" / "months" / f"{month}.js"
    raw_file = ROOT / "data" / "raw" / f"{month}.json"
    prov_file = ROOT / "drafts" / f"{month}-provenance.json"
    stale = False

    print(f"Month {month} · user {args.user}")

    # ---------------------------------------------------------------- fetch
    if args.no_fetch:
        if not raw_file.exists():
            print(f"error: --no-fetch but {raw_file} does not exist", file=sys.stderr)
            return 1
        print(f"\nUsing existing snapshot {raw_file.relative_to(ROOT)}")
    else:
        step("Fetching snapshot")
        if not os.environ.get("GITHUB_TOKEN"):
            print("  note: GITHUB_TOKEN is unset; the unauthenticated rate limit is low")
        fetch = [PY, "scripts/fetch_github.py", "--month", month, "--user", args.user]
        if month == current_month():
            fetch += ["--until", today]          # do not ask for days that have not happened
        if sh(*fetch).returncode != 0:
            return 1

    snapshot = json.loads(raw_file.read_text(encoding="utf-8"))

    # ------------------------------------------------------- draft or diff
    if not month_file.exists() or (args.new and args.force):
        if not args.new:
            print(f"\n{month_file.relative_to(ROOT)} does not exist yet.")
            print(f"Draft it with:  uv run update.py --month {month} --new")
            return 0
        if args.force and month_file.exists():
            print(f"\n  WARNING: --force will discard the narrative in {month_file.relative_to(ROOT)}")
        step("Drafting skeleton and interview")
        draft = [PY, "scripts/draft_month.py", "--month", month]
        if args.force:
            draft.append("--force")
        if sh(*draft).returncode != 0:
            return 1
        print(f"\n  Next: answer drafts/{month}-interview.md, then write the narrative.")
    else:
        step("Checking the narrative against the snapshot")
        if not prov_file.exists():
            print(f"  No {prov_file.relative_to(ROOT)} — this month predates provenance tracking.")
            print("  Cannot tell what is new. Skipping the drift check.")
        else:
            prior = json.loads(prov_file.read_text(encoding="utf-8"))
            new_commits = report_drift(month, snapshot, prior)
            if not new_commits:
                print(f"  Up to date — no commits since the narrative was written "
                      f"({prior.get('commit_count', 0)} commits).")
            else:
                stale = True
                pending = write_pending(month, new_commits, snapshot)
                print(f"  {len(new_commits)} new commit(s) since the narrative was written.")
                print(f"  Wrote {pending.relative_to(ROOT)} — the month file was not touched.")
                for commit in new_commits[-5:]:
                    print(f"    {commit['date'][:10]}  {commit['message'][:68]}")

    # ---------------------------------------------------------------- check
    if not args.no_check:
        step("Render test")
        if sh("node", "scripts/smoke_test.js", quiet=True).returncode != 0:
            print("  FAILED — run `node scripts/smoke_test.js` for detail")
            return 1
        print("  passed")

    if args.shots:
        step("Screenshots")
        if sh("uv", "run", "scripts/screenshots.py").returncode != 0:
            return 1

    return 2 if (stale and args.fail_on_stale) else 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except KeyboardInterrupt:
        raise SystemExit(130)
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
