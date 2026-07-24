#!/usr/bin/env python3
"""Turn a raw snapshot into a month skeleton plus an interview.

Reads data/raw/<month>.json and writes two files:

  data/months/<month>.js       facts filled in, every narrative field a TODO
  drafts/<month>-interview.md  the questions to answer before writing narrative

Nothing here writes narrative. Weeks are Monday-based and clipped to the
month, so a week straddling a month boundary appears in both months, split.

Usage:
  python3 scripts/draft_month.py --month 2026-07
  python3 scripts/draft_month.py --month 2026-07 --force   # overwrite an existing draft
"""
from __future__ import annotations

import argparse
import calendar
import json
import re
import sys
from collections import defaultdict
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

TODO = "TODO"
MAX_EVIDENCE = 6            # evidence links shown on the page
MAX_INTERVIEW_COMMITS = 25  # commits listed per repo per week in the interview
BAR_WIDTH = 24              # widest per-day bar in the interview charts

# Commit subjects that describe upkeep rather than a decision worth narrating.
NOISE = re.compile(
    r"^(merge |bump |chore|typo|fix typo|wip\b|revert |update readme|formatting|lint\b|whitespace)",
    re.IGNORECASE,
)


def month_bounds(month: str) -> tuple[date, date]:
    year, mon = (int(part) for part in month.split("-", 1))
    return date(year, mon, 1), date(year, mon, calendar.monthrange(year, mon)[1])


def iso_weeks(first: date, last: date) -> list[tuple[date, date]]:
    """Monday-based weeks covering [first, last], clipped to the month."""
    weeks = []
    cursor = first - timedelta(days=first.weekday())
    while cursor <= last:
        week_end = cursor + timedelta(days=6)
        weeks.append((max(cursor, first), min(week_end, last)))
        cursor = week_end + timedelta(days=1)
    return weeks


def label(start: date, end: date) -> str:
    if start == end:
        return start.strftime("%b %-d")
    if start.month == end.month:
        return f"{start.strftime('%b %-d')}–{end.day}"
    return f"{start.strftime('%b %-d')}–{end.strftime('%b %-d')}"


def js(value: Any, indent: int = 0) -> str:
    """Render a Python value as readable JavaScript source."""
    pad, inner = "  " * indent, "  " * (indent + 1)
    if isinstance(value, str):
        return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'
    if isinstance(value, bool):
        return "true" if value else "false"
    if value is None:
        return "null"
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, list):
        if not value:
            return "[]"
        items = ",\n".join(inner + js(v, indent + 1) for v in value)
        return "[\n" + items + "\n" + pad + "]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        items = ",\n".join(f"{inner}{k}: {js(v, indent + 1)}" for k, v in value.items())
        return "{\n" + items + "\n" + pad + "}"
    raise TypeError(f"cannot render {type(value)}")


def intensity(commits: int, busiest: int) -> int:
    if not commits:
        return 0
    if busiest <= 1:
        return 3
    return max(1, min(5, round(1 + 4 * (commits / busiest))))


def build(snapshot: dict, month: str) -> tuple[dict, list[dict], list[dict]]:
    first, last = month_bounds(month)
    coverage = snapshot.get("coverage", {})
    cov_start = date.fromisoformat(coverage.get("start", first.isoformat()))
    cov_end = date.fromisoformat(coverage.get("end", last.isoformat()))

    # Bucket every commit by the day it was authored.
    by_day: dict[date, list[dict]] = defaultdict(list)
    for repo in snapshot.get("repositories", []):
        for commit in repo["commits"]:
            day = datetime.fromisoformat(commit["date"].replace("Z", "+00:00")).date()
            by_day[day].append({**commit, "repo": repo["name"], "repo_url": repo["html_url"],
                                "repo_desc": repo.get("description")})

    buckets = []
    for start, end in iso_weeks(first, last):
        commits: list[dict] = []
        day = start
        while day <= end:
            commits.extend(by_day.get(day, []))
            day += timedelta(days=1)
        commits.sort(key=lambda c: c["date"])
        buckets.append({"start": start, "end": end, "commits": commits})

    busiest = max((len(b["commits"]) for b in buckets), default=0)
    weeks: list[dict] = []
    for i, bucket in enumerate(buckets, start=1):
        start, end, commits = bucket["start"], bucket["end"], bucket["commits"]
        covered = not (end < cov_start or start > cov_end)
        week: dict[str, Any] = {
            "id": f"w{i}",
            "number": f"{i:02d}",
            "range": label(start, end),
            "dates": {"start": start.isoformat(), "end": end.isoformat()},
        }

        if not commits:
            week["status"] = "nodata" if not covered else "quiet"
            week["note"] = (
                f"{TODO}: outside the snapshot window, or a real break? One line either way."
                if not covered
                else f"{TODO}: nothing committed publicly this week. Say why, briefly."
            )
            weeks.append(week)
            continue

        repos: dict[str, list[dict]] = defaultdict(list)
        for commit in commits:
            repos[commit["repo"]].append(commit)
        ranked = sorted(repos.items(), key=lambda kv: len(kv[1]), reverse=True)

        signal = [c for c in commits if not NOISE.match(c["message"])] or commits
        signal.sort(key=lambda c: c["date"])

        week.update({
            "status": "active",
            "intensity": intensity(len(commits), busiest),
            "title": f"{TODO}: a plain title, ideally under six words.",
            "summary": f"{TODO}: what the week's work was, in two to four sentences. "
                       f"Repos touched: {', '.join(name for name, _ in ranked)}. "
                       f"{len(commits)} commit{'s' if len(commits) != 1 else ''}.",
            "note": f"{TODO} (optional): one honest aside, or delete this field.",
            "themes": [f"{TODO}"],
            "projects": [
                {
                    "name": name,
                    "repo": name,
                    "desc": (commit_list[0].get("repo_desc")
                             or f"{TODO}: what this repo is, in one line.").strip(),
                    "url": commit_list[0]["repo_url"],
                }
                for name, commit_list in ranked
            ],
            "evidence": [
                {"text": c["message"], "url": c["url"]}
                for c in signal[:MAX_EVIDENCE]
            ],
        })
        weeks.append(week)

    active = [w for w in weeks if w["status"] == "active"]
    repo_names = sorted({c["repo"] for b in buckets for c in b["commits"]})
    total = sum(len(b["commits"]) for b in buckets)

    month_data: dict[str, Any] = {
        "id": month,
        "label": first.strftime("%B %Y"),
        "status": "active" if active else "quiet",
        "coverage": {"start": cov_start.isoformat(), "end": cov_end.isoformat()},
        "lede": f"{TODO}: one or two sentences on what the month was mostly about.",
        "metrics": [
            {"value": str(len(repo_names)), "label": "public repos touched",
             "note": f"Counted from commits, {label(cov_start, cov_end)}"},
            {"value": str(total), "label": "public commits",
             "note": f"{TODO}: keep, reword, or delete — raw commit counts flatter merge mechanics."},
        ],
        "weeks": weeks,
    }
    if cov_end < last:
        month_data["inProgress"] = True
    if not active:
        month_data["quietNote"] = f"{TODO}: why the month was quiet, in one or two sentences."

    return month_data, weeks, buckets


def provenance(snapshot: dict, month: str) -> dict:
    """A record of the facts the narrative was written against.

    update.py diffs a fresh snapshot against this to tell whether a hand-written
    month has gone stale, without ever having to parse or touch the .js file.
    """
    commits = [c for r in snapshot.get("repositories", []) for c in r["commits"]]
    return {
        "month": month,
        "snapshot_generated_at": snapshot.get("generated_at"),
        "coverage": snapshot.get("coverage", {}),
        "commit_count": len(commits),
        "last_commit": max((c["date"] for c in commits), default=None),
        "repos": {r["name"]: r["commit_count"] for r in snapshot.get("repositories", [])},
        "shas": sorted(c["sha"] for c in commits),
    }


def render_month_js(month: str, data: dict) -> str:
    return (
        "window.REVIEW_MONTHS = window.REVIEW_MONTHS || {};\n"
        f'window.REVIEW_MONTHS["{month}"] = {js(data)};\n'
    )


def day_strip(commits: list[dict], start: date, end: date, peak: int | None = None) -> list[str]:
    """A per-day bar chart, so 'where did the time go' is answerable at a glance.

    `peak` must be the month's busiest day, not the week's, or every week draws its
    own maximum full-width and a 7-commit week looks identical to a 28-commit one.
    """
    per_day: dict[date, int] = defaultdict(int)
    for commit in commits:
        per_day[datetime.fromisoformat(commit["date"].replace("Z", "+00:00")).date()] += 1
    peak = peak or max(per_day.values(), default=0)
    rows = ["```"]
    day = start
    while day <= end:
        n = per_day.get(day, 0)
        bar = "█" * max(1, round(BAR_WIDTH * n / peak)) if n else "·"
        rows.append(f"{day.strftime('%a %b %d')}  {bar} {n or ''}".rstrip())
        day += timedelta(days=1)
    rows.append("```")
    return rows


def commit_lines(commits: list[dict]) -> list[str]:
    """Commits grouped by repo, routine ones separated out rather than dropped."""
    repos: dict[str, list[dict]] = defaultdict(list)
    for commit in commits:
        repos[commit["repo"]].append(commit)

    lines: list[str] = []
    for name, group in sorted(repos.items(), key=lambda kv: -len(kv[1])):
        signal = [c for c in group if not NOISE.match(c["message"])]
        routine = [c for c in group if NOISE.match(c["message"])]
        lines += [f"**`{name}`** — {len(group)} commit{'s' if len(group) != 1 else ''}", ""]

        shown = signal[:MAX_INTERVIEW_COMMITS]
        if not signal:
            lines.append("- <sub>routine commits only — nothing worth narrating</sub>")
        for commit in shown:
            lines.append(f"- `{commit['date'][:10]}` [{commit['message']}]({commit['url']})")
        if len(signal) > len(shown):
            lines.append(f"- …and {len(signal) - len(shown)} more in this repo")
        if routine:
            lines.append(f"- <sub>plus {len(routine)} merge/chore/typo commit"
                         f"{'s' if len(routine) != 1 else ''}, not listed</sub>")
        lines.append("")
    return lines


def render_interview(month: str, data: dict, weeks: list[dict], buckets: list[dict]) -> str:
    all_commits = [c for b in buckets for c in b["commits"]]
    repos: dict[str, list[dict]] = defaultdict(list)
    for commit in all_commits:
        repos[commit["repo"]].append(commit)
    ranked = sorted(repos.items(), key=lambda kv: -len(kv[1]))
    total = len(all_commits)
    per_day_month: dict[date, int] = defaultdict(int)
    for commit in all_commits:
        per_day_month[datetime.fromisoformat(commit["date"].replace("Z", "+00:00")).date()] += 1
    month_peak = max(per_day_month.values(), default=0)
    top = ranked[0][0] if ranked else None
    top_share = round(100 * len(ranked[0][1]) / total) if total else 0

    lines = [
        f"# Interview — {data['label']}",
        "",
        "Every question comes with the commits behind it, because the point of this page",
        "is to work out where the time went — not to test recall. Read the context, then",
        "answer. Short answers are fine; fragments are fine.",
        "",
        "**Voice for the eventual prose:** neutral third person, plain, concrete. No second",
        "person, no 'not merely', no claims about leverage or inflection points. A dull week",
        "reads as dull.",
        "",
        "---",
        "",
        "## What the snapshot shows",
        "",
        f"`{data['coverage']['start']}` to `{data['coverage']['end']}` · "
        f"{total} commit{'s' if total != 1 else ''} across {len(ranked)} repo{'s' if len(ranked) != 1 else ''}",
        "",
    ]

    if ranked:
        lines += ["| repo | commits | first | last |", "| --- | ---: | --- | --- |"]
        for name, group in ranked:
            dates = sorted(c["date"][:10] for c in group)
            lines.append(f"| `{name}` | {len(group)} | {dates[0]} | {dates[-1]} |")
        lines.append("")

        first_day = date.fromisoformat(data["coverage"]["start"])
        last_day = date.fromisoformat(data["coverage"]["end"])
        lines += ["Commits per day across the month:", ""]
        lines += day_strip(all_commits, first_day, last_day, month_peak)
        lines.append("")

    lines += ["## The month", ""]
    month_questions = [
        "In one sentence, what was this month mostly about?",
        "What went wrong, stalled, or got thrown away? Nothing in a commit log admits to a "
        "dead end, so if this is left blank the page will imply everything worked.",
        "Is there work that belongs in the record but is not on public GitHub? How should it "
        "be referred to, if at all?",
        "Any context — travel, a deadline, a performance, an outage — that explains the shape "
        "of the month? Look at the per-day chart above: the gaps and the spikes are the question.",
    ]
    if top and top_share >= 40:
        month_questions.append(
            f"`{top}` is {top_share}% of the month's commits. Was that the intent, or did it "
            "crowd out something you meant to do?"
        )
    month_questions.append(
        "The draft metrics are "
        + ", ".join(f"**{m['value']}** {m['label']}" for m in data.get("metrics", []))
        + ". Is any of those misleading or beside the point? What would you put there instead?"
    )
    lines += [f"{i}. {q}" for i, q in enumerate(month_questions, start=1)]
    lines += ["", "---", "", "## The weeks", ""]

    for week, bucket in zip(weeks, buckets):
        lines.append(f"### Week {week['number']} — {week['range']}")
        lines.append("")

        if week["status"] == "active":
            commits = bucket["commits"]
            lines.append(f"{len(commits)} commit{'s' if len(commits) != 1 else ''} · "
                         f"intensity guessed at {week['intensity']}/5")
            lines.append("")
            lines += day_strip(commits, bucket["start"], bucket["end"], month_peak)
            lines.append("")
            lines += commit_lines(commits)
            lines += [
                "**Questions**",
                "",
                "- Reading those commits back: what were you actually trying to do?",
                "- Which of them mattered, and which are noise dressed up as progress?",
                "- Anything here that took far longer than the commit count suggests, or far less?",
                f"- Intensity is guessed at {week['intensity']}/5 from commit counts alone. "
                "What did the week actually feel like?",
                "",
            ]
        elif week["status"] == "nodata":
            lines += [
                "Outside the snapshot window — nothing was collected for these days.",
                "",
                "- Is that right, or should the fetch be re-run with a wider window?",
                "- If the month is simply still in progress, the default note is fine as written.",
                "",
            ]
        else:
            lines += [
                "Covered by the snapshot, but no commits landed.",
                "",
                "- Travel, other work, a real break, or work that happened somewhere else?",
                "- A dull week is allowed to read as dull. Do not inflate it.",
                "",
            ]

    lines += [
        "---",
        "",
        "## After the answers",
        "",
        f"1. Rewrite every `{TODO}` in `data/months/{month}.js`.",
        "2. Delete any `note` field that has nothing honest to say.",
        "3. Add the month to `data/index.js` (newest first) with a one-sentence `blurb`.",
        f"4. Open `index.html#{month}` and read it end to end.",
        "5. Keep this file. It is the provenance for prose that is otherwise unfalsifiable.",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", required=True, help="YYYY-MM")
    parser.add_argument("--input", help="Defaults to data/raw/<month>.json")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing month file")
    args = parser.parse_args()

    source = Path(args.input or f"data/raw/{args.month}.json")
    if not source.exists():
        raise SystemExit(
            f"error: {source} not found. Run:\n"
            f"  python3 scripts/fetch_github.py --month {args.month}"
        )

    snapshot = json.loads(source.read_text(encoding="utf-8"))
    data, weeks, buckets = build(snapshot, args.month)

    month_path = Path(f"data/months/{args.month}.js")
    if month_path.exists() and not args.force:
        raise SystemExit(
            f"error: {month_path} already exists. Edit it directly, or pass --force to "
            "regenerate the skeleton (this discards any narrative in it)."
        )
    month_path.parent.mkdir(parents=True, exist_ok=True)
    month_path.write_text(render_month_js(args.month, data), encoding="utf-8")

    interview_path = Path(f"drafts/{args.month}-interview.md")
    interview_path.parent.mkdir(parents=True, exist_ok=True)
    if interview_path.exists() and not args.force:
        print(f"Kept {interview_path} (already exists; --force overwrites)")
    else:
        interview_path.write_text(render_interview(args.month, data, weeks, buckets), encoding="utf-8")
        print(f"Wrote {interview_path}")

    prov_path = Path(f"drafts/{args.month}-provenance.json")
    prov_path.write_text(json.dumps(provenance(snapshot, args.month), indent=2) + "\n", encoding="utf-8")

    todos = render_month_js(args.month, data).count(TODO)
    print(f"Wrote {month_path} ({todos} TODOs to resolve)")
    print(f"Wrote {prov_path}")
    print(f"\nAdd this to the top of the months array in data/index.js:\n")
    print(f'    {{ id: "{args.month}", label: "{data["label"]}", file: "data/months/{args.month}.js",')
    print(f'      status: "{data["status"]}", blurb: "TODO: one sentence." }},')
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit:
        raise
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
