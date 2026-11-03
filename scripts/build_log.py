#!/usr/bin/env python3
"""Build the build log: hands-on hours, sessions, and costs, by project and local day.

    python3 scripts/build_log.py                   # interview notes for the current month
    python3 scripts/build_log.py --month 2026-09
    python3 scripts/build_log.py --no-ask          # never prompt; undecided projects stay "Other"

Reads the ai-log index (~/Dropbox/Code/ai-log/logs/index, or $AI_LOG_DIR), the Swarm and
Modal caches under private/, and the GitHub snapshots under data/raw/. Writes:

  data/buildlog.js          days × projects, for the month pages and the build log
  data/buildlog-detail.js   commits, sessions, and time of day, for the build log only
  drafts/<month>-sessions.md    the interview's AI-session section: counts, named projects only
  private/<month>-sessions.md   the same with session titles and everything unnamed

Facts only — it never writes narrative, so update.py can run it unattended.

**What may be named.** Public repos and the private repos in PRIVATE_REPOS appear under
their repo name. A private GitHub repo not in PRIVATE_REPOS is always "Other". Work that
is not on GitHub is "Other" until the owner says otherwise; from a terminal this asks
once per folder, and the answer is kept in private/projects.json (gitignored, because it
names the hidden ones). Session titles and prompt text never leave private/.

**Hands-on time** is ai-log's model: the union of a 15-minute window after each prompt.
Where windows from two projects overlap, the overlap is split evenly between them, so a
day's projects add up to that day's hands-on total.

**Cost** is API-equivalent: session tokens priced at list rates (scripts/prices.json).
Modal is the real bill. Neither is what a subscription costs.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from localtime import Clock  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CODE = Path.home() / "Dropbox" / "Code"
WINDOW = 15 * 60
OTHER = "Other"
DECISIONS = ROOT / "private" / "projects.json"


# ------------------------------------------------------------------ inputs

def read_jsonl(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as f:
        return [json.loads(line) for line in f if line.strip()]


def parse_ts(value: str) -> float:
    return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()


def env_value(key: str) -> str:
    if os.environ.get(key):
        return os.environ[key]
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            k, _, v = line.partition("=")
            if k.strip() == key:
                return v.strip().strip("'\"")
    return ""


def review_months() -> list[str]:
    text = (ROOT / "data" / "index.js").read_text(encoding="utf-8")
    return sorted(set(re.findall(r'id:\s*"(\d{4}-\d{2})"', text)))


def load_decisions() -> dict:
    if DECISIONS.exists():
        return json.loads(DECISIONS.read_text(encoding="utf-8"))
    return {"projects": {}, "artifacts": {}}


def save_decisions(decisions: dict) -> None:
    DECISIONS.parent.mkdir(parents=True, exist_ok=True)
    DECISIONS.write_text(json.dumps(decisions, indent=2) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- projects

def github_repo(path: Path) -> str | None:
    out = subprocess.run(["git", "-C", str(path), "remote", "get-url", "origin"],
                         capture_output=True, text=True).stdout.strip()
    match = re.search(r"github\.com[:/][^/]+/([^/\s]+?)(?:\.git)?$", out)
    return match.group(1) if match else None


class Projects:
    """Maps an ai-log project (a folder) to what the page may call it."""

    def __init__(self, decisions: dict):
        self.decisions = decisions
        self.public = set(json.loads((ROOT / "data" / "raw" / "repos.json").read_text())["public"]) \
            if (ROOT / "data" / "raw" / "repos.json").exists() else set()
        for path in (ROOT / "data" / "raw").glob("2*.json"):
            for repo in json.loads(path.read_text(encoding="utf-8"))["repositories"]:
                if not repo.get("private"):
                    self.public.add(repo["name"])
        self.listed = {n.strip() for n in env_value("PRIVATE_REPOS").split(",") if n.strip()}
        self.user = "jsundram"
        self.cache: dict[str | None, dict] = {}

    def remote(self, folder: str) -> str | None:
        path = CODE / folder
        if (path / ".git").exists():
            return github_repo(path)
        # A folder that holds exactly one GitHub repo (composer_birthdays/daily-composers) is that repo.
        inner = [github_repo(c) for c in path.iterdir() if (c / ".git").exists()] if path.is_dir() else []
        inner = [r for r in inner if r]
        return inner[0] if len(inner) == 1 else None

    def resolve(self, project: str | None) -> dict:
        if project in self.cache:
            return self.cache[project]
        info: dict
        if not project or project in ("~", "?"):
            info = {"label": OTHER, "kind": "other"}
        else:
            repo = None if project.startswith("~") else self.remote(project)
            if repo and repo in self.public:
                info = {"label": repo, "kind": "github", "url": f"https://github.com/{self.user}/{repo}"}
            elif repo and repo in self.listed:
                info = {"label": repo, "kind": "private", "url": f"https://github.com/{self.user}/{repo}"}
            elif repo:
                info = {"label": OTHER, "kind": "other", "why": "private repo not in PRIVATE_REPOS"}
            else:
                answer = self.decisions["projects"].get(project)
                label = (answer or {}).get("label") or project
                if answer and answer.get("show") and label in self.public | self.listed:
                    # Named after a repo (an old or renamed folder): it is that repo.
                    kind = "github" if label in self.public else "private"
                    info = {"label": label, "kind": kind, "url": f"https://github.com/{self.user}/{label}"}
                elif answer and answer.get("show"):
                    info = {"label": label, "kind": "local"}
                else:
                    info = {"label": OTHER, "kind": "other",
                            "why": "hidden" if answer else "undecided", "folder": project}
        self.cache[project] = info
        return info

    def forget(self, project: str) -> None:
        self.cache.pop(project, None)


def local_commits(decisions: dict, projects: Projects, start: date, clock, commit_session: dict) -> list[dict]:
    """Commits from a git repo off GitHub that I chose to name. No link: there is nowhere to point."""
    out = []
    for folder, answer in decisions["projects"].items():
        if not answer.get("show") or projects.resolve(folder)["kind"] != "local":
            continue
        path = Path(folder).expanduser() if folder.startswith("~") else CODE / folder
        if not (path / ".git").exists():
            continue
        log = subprocess.run(["git", "-C", str(path), "log", "--no-merges", f"--since={start.isoformat()}",
                              "--format=%H%x1f%aI%x1f%s"], capture_output=True, text=True).stdout
        for line in log.splitlines():
            sha, when, subject = line.split("\x1f", 2)
            local = clock.local(parse_ts(when))
            out.append({"t": local.strftime("%Y-%m-%d %H:%M"), "p": projects.resolve(folder)["label"],
                        "msg": subject[:140], "via": commit_session.get(sha[:7], "")})
    return out


# ------------------------------------------------------------------- hours

def split_hours(prompts: list[tuple[float, str]], clock: Clock):
    """Even split of overlapping 15-minute windows, by label and local day.

    Returns ({day: {label: seconds}}, {(month, label): [48 half-hour slots of seconds]}).
    """
    events: list[tuple[float, int, str]] = []
    for t, label in prompts:
        events.append((t, 1, label))
        events.append((t + WINDOW, -1, label))
    events.sort()
    active: Counter = Counter()
    by_day: dict[str, Counter] = defaultdict(Counter)
    slots: dict[tuple[str, str], list[float]] = defaultdict(lambda: [0.0] * 48)
    prev = None
    for t, delta, label in events:
        if prev is not None and t > prev:
            labels = [l for l, n in active.items() if n > 0]
            if labels:
                seg_start = prev
                while seg_start < t:
                    local = clock.local(seg_start)
                    # cut at the next half-hour so each piece has one day and one slot
                    minute = local.hour * 60 + local.minute
                    next_slot = (minute // 30 + 1) * 30
                    edge = seg_start + (next_slot - minute) * 60 - local.second - local.microsecond / 1e6
                    seg_end = min(t, edge)
                    share = (seg_end - seg_start) / len(labels)
                    day = local.date().isoformat()
                    slot = minute // 30
                    for l in labels:
                        by_day[day][l] += share
                        slots[(day[:7], l)][slot] += share
                    seg_start = seg_end
        active[label] += delta
        prev = t
    return by_day, slots


# -------------------------------------------------------------------- cost

class Prices:
    def __init__(self):
        table = json.loads((ROOT / "scripts" / "prices.json").read_text(encoding="utf-8"))
        self.claude, self.openai = table["claude"], table["openai"]

    def _claude(self, model: str):
        return next((p for name, p in self.claude.items() if model.startswith(name)), None)

    def session(self, s: dict) -> tuple[str, float | None]:
        tokens = s.get("tokens") or {}
        models = s.get("models") or []
        if s["app"] == "codex":
            price = next((self.openai[m] for m in models if m in self.openai), None)
            if not tokens or not price:
                return "codex", None
            cached = tokens.get("cacheRead", 0)
            fresh = max(0, tokens.get("input", 0) - cached)
            usd = (fresh * price["input"] + cached * price["cachedInput"] + tokens.get("output", 0) * price["output"]) / 1e6
            return "codex", usd
        if s["app"] == "claude":
            price = next((self._claude(m) for m in models if self._claude(m)), None)
            if not tokens or not price:
                return "claude", None
            usd = (tokens.get("input", 0) * price["input"] + tokens.get("output", 0) * price["output"]
                   + tokens.get("cacheRead", 0) * price["cacheRead"]
                   + tokens.get("cacheWrite", 0) * price["cacheWrite"]) / 1e6
            return "claude", usd
        return s["app"], None


# ------------------------------------------------------------------ output

def js_file(name: str, payload: dict) -> str:
    """One top-level key per block, one array item per line: small diffs, still readable."""
    parts = []
    for key, value in payload.items():
        if isinstance(value, list):
            body = "[\n" + ",\n".join("    " + json.dumps(v, separators=(",", ":"), ensure_ascii=False)
                                      for v in value) + "\n  ]" if value else "[]"
        else:
            body = json.dumps(value, separators=(",", ":"), ensure_ascii=False)
        parts.append(f"  {json.dumps(key)}: {body}")
    return (f"/* Generated by scripts/build_log.py — do not edit. */\n"
            f"window.{name} = {{\n" + ",\n".join(parts) + "\n};\n")


def fmt_h(seconds: float) -> str:
    return f"{seconds / 3600:.1f}"


def ask(question: str, choices: str) -> str:
    while True:
        answer = input(f"  {question} [{choices}] ").strip().lower()[:1]
        if answer and answer in choices.replace("/", ""):
            return answer
        if not answer:
            return "l"


def month_weeks(month: str) -> list[tuple[date, date]]:
    year, mon = map(int, month.split("-"))
    first = date(year, mon, 1)
    last = date(year + mon // 12, mon % 12 + 1, 1) - timedelta(days=1)
    weeks, cursor = [], first - timedelta(days=first.weekday())
    while cursor <= last:
        weeks.append((max(cursor, first), min(cursor + timedelta(days=6), last)))
        cursor += timedelta(days=7)
    return weeks


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", default=date.today().strftime("%Y-%m"), help="YYYY-MM for the interview notes")
    parser.add_argument("--no-ask", action="store_true", help="Never prompt; undecided folders stay Other")
    args = parser.parse_args()

    ai_log = Path(os.environ.get("AI_LOG_DIR") or CODE / "ai-log") / "logs" / "index"
    if not (ai_log / "sessions.jsonl").exists():
        print(f"error: no ai-log index at {ai_log}; run `python3 index.py` in ai-log", file=sys.stderr)
        return 1

    months = review_months()
    start = date.fromisoformat(months[0] + "-01")
    end = date.today()
    start_epoch = datetime(start.year, start.month, start.day, tzinfo=timezone.utc).timestamp() - 86400
    clock = Clock.load()
    decisions = load_decisions()
    decisions.setdefault("projects", {})
    decisions.setdefault("artifacts", {})
    projects = Projects(decisions)
    prices = Prices()

    raw_sessions = [s for s in read_jsonl(ai_log / "sessions.jsonl")
                    if s.get("start") and parse_ts(s["start"]) >= start_epoch]
    raw_prompts = [p for p in read_jsonl(ai_log / "prompts.jsonl") if parse_ts(p["time"]) >= start_epoch]

    # ------------------------------------------------ settle undecided folders
    undecided = Counter()
    for p in raw_prompts:
        info = projects.resolve(p.get("project"))
        if info.get("why") == "undecided":
            undecided[info["folder"]] += 1
    interactive = sys.stdin.isatty() and not args.no_ask
    if undecided and interactive:
        print("\nWork that is not on GitHub. Name it on the page, or keep it under \"Other\"?")
        print("  y = name it   n = keep it Other   l = ask later (Enter)")
        for folder, n in undecided.most_common():
            if n < 2:
                continue
            answer = ask(f"{folder} ({n} prompts)", "y/n/l")
            if answer == "l":
                continue
            entry = {"show": answer == "y"}
            if answer == "y":
                label = input(f"    label (Enter for {folder!r}): ").strip()
                if label:
                    entry["label"] = label
            decisions["projects"][folder] = entry
            projects.forget(folder)
            save_decisions(decisions)      # each answer at once, so quitting midway keeps the rest

    # ----------------------------------------------------------------- hours
    prompts = [(parse_ts(p["time"]), projects.resolve(p.get("project"))["label"]) for p in raw_prompts]
    by_day, slots = split_hours(prompts, clock)
    prompt_days: dict[str, Counter] = defaultdict(Counter)
    for t, label in prompts:
        prompt_days[clock.local(t).date().isoformat()][label] += 1

    # -------------------------------------------------------------- sessions
    parents = {s["id"]: s for s in raw_sessions if s["kind"] == "main"}
    usd_by_session: dict[str, float] = defaultdict(float)
    provider_of: dict[str, str] = {}
    unpriced = Counter()
    for s in raw_sessions:
        provider, usd = prices.session(s)
        owner = s["id"] if s["kind"] == "main" or s.get("parent") not in parents else s["parent"]
        provider_of.setdefault(owner, provider)
        if usd is None:
            if s.get("tokens"):
                unpriced[", ".join(s.get("models") or ["?"])] += 1
            continue
        usd_by_session[owner] += usd

    commit_session: dict[str, str] = {}
    for s in raw_sessions:
        for g in s.get("git") or []:
            sha = (g.get("commit") or {}).get("sha")
            if sha:
                commit_session[sha[:7]] = "cloud" if s["machine"] == "cloud" else "laptop"

    sessions_out, cost_days = [], defaultdict(lambda: defaultdict(float))
    session_rows = []          # for the interview notes, titles included (private only)
    for s in sorted(parents.values(), key=lambda s: s["start"]):
        info = projects.resolve(s.get("project"))
        local = clock.local(parse_ts(s["start"]))
        usd = usd_by_session.get(s["id"])
        provider = provider_of.get(s["id"], s["app"])
        day = local.date().isoformat()
        if usd:
            cost_days[day][provider] += usd
        via = "cloud" if s["machine"] == "cloud" else "chat" if s["app"] == "claude.ai" else "laptop"
        commits = sum(1 for g in s.get("git") or [] if "commit" in g)
        row = {"t": local.strftime("%Y-%m-%d %H:%M"), "p": info["label"], "app": s["app"], "via": via,
               "prompts": s.get("prompts") or 0, "min": s.get("handsOnMinutes") or 0,
               "commits": commits, "usd": round(usd, 2) if usd else None}
        session_rows.append({**row, "title": s.get("title"), "folder": s.get("project"),
                             "artifacts": [a for a in s.get("artifacts") or [] if a.get("url")]})
        if info["label"] != OTHER:
            sessions_out.append(row)

    modal_days: dict[str, float] = defaultdict(float)
    for path in (ROOT / "private" / "modal").glob("*.json"):
        for r in json.loads(path.read_text(encoding="utf-8"))["rows"]:
            modal_days[r["day"]] += r["cost"]

    # --------------------------------------------------------------- commits
    commits_out = []
    for path in sorted((ROOT / "data" / "raw").glob("2*.json")):
        for repo in json.loads(path.read_text(encoding="utf-8"))["repositories"]:
            for c in repo["commits"]:
                local = clock.local(parse_ts(c["date"]))
                commits_out.append({"t": local.strftime("%Y-%m-%d %H:%M"), "p": repo["name"],
                                    "msg": c["message"][:140], "url": c["url"],
                                    "via": commit_session.get(c["sha"][:7], "")})
    commits_out += local_commits(decisions, projects, start, clock, commit_session)
    commits_out.sort(key=lambda c: c["t"])
    seen, deduped = set(), []
    for c in commits_out:            # a boundary week can be in two snapshots
        key = c.get("url") or (c["p"], c["t"], c["msg"])
        if key not in seen:
            seen.add(key)
            deduped.append(c)
    commits_out = deduped

    # -------------------------------------------------------------- artifacts
    artifacts_out = []
    for row in session_rows:
        for a in row["artifacts"]:
            answer = decisions["artifacts"].get(a["url"])
            if answer and answer.get("show"):
                artifacts_out.append({"t": row["t"], "p": projects.resolve(row["folder"])["label"],
                                      "title": answer.get("title") or a.get("title") or "Artifact",
                                      "url": answer.get("url")})
    artifacts_out = list({a["title"] + a["p"]: a for a in artifacts_out}.values())

    # ------------------------------------------------------------------ days
    places = clock.places(start, end)
    days_out = []
    day = start
    while day <= end:
        iso = day.isoformat()
        noon = datetime(day.year, day.month, day.day, 12, tzinfo=timezone.utc).timestamp()
        hours = {l: round(s / 3600, 2) for l, s in sorted(by_day.get(iso, {}).items(), key=lambda kv: -kv[1])
                 if s >= 18}
        cost = {k: round(v, 2) for k, v in cost_days.get(iso, {}).items() if v >= 0.005}
        if modal_days.get(iso):
            cost["modal"] = round(modal_days[iso], 2)
        entry = {"d": iso, "tz": clock.offset(noon), "h": hours}
        if places.get(iso):
            entry["place"], entry["region"] = places[iso]
        if cost:
            entry["cost"] = cost
        if prompt_days.get(iso):
            entry["prompts"] = sum(prompt_days[iso].values())
        days_out.append(entry)
        day += timedelta(days=1)

    totals = Counter()
    first_seen: dict[str, str] = {}
    last_seen: dict[str, str] = {}
    for d in days_out:
        for label, h in d["h"].items():
            totals[label] += h
            first_seen.setdefault(label, d["d"])
            last_seen[label] = d["d"]
    meta = {}
    for info in projects.cache.values():
        if info["label"] != OTHER:
            meta[info["label"]] = info
    for repo in {c["p"] for c in commits_out}:
        meta.setdefault(repo, {"label": repo, "kind": "github", "url": f"https://github.com/jsundram/{repo}"})
    project_rows = []
    for label in sorted(set(totals) | {c["p"] for c in commits_out}, key=lambda l: (l == OTHER, -totals[l])):
        info = meta.get(label, {"kind": "other"})
        row = {"id": label, "kind": info["kind"], "hours": round(totals[label], 1),
               "first": first_seen.get(label), "last": last_seen.get(label),
               "commits": sum(1 for c in commits_out if c["p"] == label)}
        if info.get("url"):
            row["url"] = info["url"]
        project_rows.append(row)

    chats = [s["start"] for s in read_jsonl(ai_log / "sessions.jsonl") if s["app"] == "claude.ai" and s.get("start")]
    summary = {
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "range": {"start": start.isoformat(), "end": end.isoformat()},
        "coverage": {"chatsThrough": max(chats)[:10] if chats else None,
                     "swarm": bool(clock.checkins), "modal": bool(modal_days)},
        "projects": project_rows,
        "days": days_out,
    }
    tod: dict[str, dict[str, list[float]]] = defaultdict(dict)       # minutes, by month and project
    for (month, label), values in sorted(slots.items()):
        tod[month][label] = [round(x / 60, 1) for x in values]
    detail = {
        "commits": commits_out,
        "sessions": sessions_out,
        "artifacts": artifacts_out,
        "tod": tod,
    }
    (ROOT / "data" / "buildlog.js").write_text(js_file("REVIEW_BUILDLOG", summary), encoding="utf-8")
    (ROOT / "data" / "buildlog-detail.js").write_text(js_file("REVIEW_BUILDLOG_DETAIL", detail), encoding="utf-8")

    # ------------------------------------------------------- interview notes
    write_notes(args.month, days_out, session_rows, commits_out, projects, decisions,
                summary["coverage"], unpriced, interactive)

    hours = sum(totals.values())
    print(f"Wrote data/buildlog.js: {len(days_out)} days, {hours:.0f} hands-on hours, "
          f"{len(project_rows)} projects")
    print(f"Wrote data/buildlog-detail.js: {len(commits_out)} commits, {len(sessions_out)} named sessions")
    left = [f for f, n in undecided.items() if f not in decisions["projects"] and n >= 2]
    if left:
        print(f"  {len(left)} folder(s) not on GitHub are still undecided and shown as Other; "
              f"see private/{args.month}-sessions.md")
    return 0


def write_notes(month, days, session_rows, commits, projects, decisions, coverage, unpriced, interactive):
    weeks = month_weeks(month)
    in_month = [d for d in days if d["d"].startswith(month)]
    if not in_month:
        return
    month_sessions = [s for s in session_rows if s["t"].startswith(month)]
    month_commits = [c for c in commits if c["t"].startswith(month)]

    def week_lines(private: bool) -> list[str]:
        lines = []
        for i, (a, b) in enumerate(weeks, start=1):
            span = [d for d in in_month if a.isoformat() <= d["d"] <= b.isoformat()]
            hours = Counter()
            for d in span:
                hours.update(d["h"])
            total = sum(hours.values())
            places = sorted({d["place"] for d in span if d.get("place")})
            lines.append(f"### Week {i:02d} — {a:%b %-d}–{b:%b %-d}")
            lines.append("")
            lines.append(f"{total:.1f} hands-on hours" + (f" · away: {', '.join(places)}" if places else ""))
            lines.append("")
            if hours:
                lines += ["| project | hours |", "| --- | ---: |"]
                lines += [f"| {l} | {h:.1f} |" for l, h in hours.most_common()]
                lines.append("")
            peak = max((sum(d["h"].values()) for d in in_month), default=0) or 1
            lines.append("```")
            for d in span:
                h = sum(d["h"].values())
                bar = "█" * max(1, round(24 * h / peak)) if h >= 0.05 else "·"
                where = f"  {d['place']}" if d.get("place") else ""
                lines.append(f"{date.fromisoformat(d['d']):%a %b %d}  {bar} {h:.1f}h{where}".rstrip())
            lines.append("```")
            lines.append("")
            quiet = [s for s in month_sessions if a.isoformat() <= s["t"][:10] <= b.isoformat()
                     and s["commits"] == 0 and s["min"] >= 30 and (private or s["p"] != OTHER)]
            if quiet:
                lines.append("Sessions of 30+ minutes with no commit — finished elsewhere, abandoned, or just talk?")
                lines.append("")
                for s in quiet:
                    title = f" — {s['title']}" if private and s.get("title") else ""
                    folder = f" ({s['folder']})" if private and s["p"] == OTHER else ""
                    lines.append(f"- `{s['t']}` {s['p']}{folder}, {s['min']} min, {s['prompts']} prompts{title}")
                lines.append("")
        return lines

    def body(private: bool) -> list[str]:
        hours = Counter()
        for d in in_month:
            hours.update(d["h"])
        cost = Counter()
        for d in in_month:
            cost.update(d.get("cost", {}))
        lines = [
            f"# AI sessions — {month}",
            "",
            "Generated by `scripts/build_log.py`; rerun rather than edit. "
            + ("**Private copy: titles and unnamed folders. Never commit or quote from it without the owner's say-so.**"
               if private else "Counts only. Titles and unnamed folders are in `private/`, which is gitignored."),
            "",
            "Hands-on hours are a model — a 15-minute window after each prompt, overlaps split evenly "
            "between projects. Days are local, from Swarm check-ins.",
            "",
            "**Before reading:** fetch this month's cloud sessions "
            f"(`python3 cloud.py --month {month}` in ai-log; `./update.sh` does it) and rebuild its index. "
            f"claude.ai chats are covered through {coverage.get('chatsThrough') or 'no export'}; "
            "import a newer export if the month runs past that.",
            "",
            "## The month",
            "",
            f"{sum(hours.values()):.1f} hands-on hours · {len(month_sessions)} sessions · "
            f"{len(month_commits)} commits on GitHub",
            "",
            "| project | hours | sessions | commits |",
            "| --- | ---: | ---: | ---: |",
        ]
        for label, h in hours.most_common():
            n = sum(1 for s in month_sessions if s["p"] == label)
            c = sum(1 for x in month_commits if x["p"] == label)
            lines.append(f"| {label} | {h:.1f} | {n} | {c} |")
        lines.append("")
        if cost:
            lines.append("API-equivalent cost: " + ", ".join(f"{k} ${v:,.0f}" for k, v in cost.most_common())
                         + " (Modal is the real bill).")
            if unpriced:
                lines.append(f"Unpriced across the whole log (model not in scripts/prices.json): "
                             + ", ".join(f"{m} ×{n}" for m, n in unpriced.most_common()))
            lines.append("")
        no_sessions = sorted({c["p"] for c in month_commits} - {s["p"] for s in month_sessions})
        if no_sessions:
            lines.append("Commits with no AI session in the same project: " + ", ".join(f"`{p}`" for p in no_sessions)
                         + ". By hand, a cloud session not yet fetched, or a folder named differently?")
            lines.append("")
        lines += [
            "**Questions**",
            "",
            "1. Do the hours match how the month felt? A model this simple overstates scattered "
            "prompting and understates long reading or testing between prompts.",
            "2. The no-commit sessions below are where loose threads hide. Which were abandoned, and why?",
            "3. The away days come from Swarm. Are they right, and may the cities appear on the page?",
            "",
        ]
        if private:
            other = Counter()
            for s in month_sessions:
                if s["p"] == OTHER:
                    other[s["folder"] or "(claude.ai chat)"] += s["min"]
            if other:
                lines += ["## Under \"Other\" (private)", "", "| folder | minutes | why |", "| --- | ---: | --- |"]
                for folder, minutes in other.most_common():
                    why = projects.resolve(None if folder == "(claude.ai chat)" else folder).get("why", "")
                    lines.append(f"| `{folder}` | {minutes} | {why} |")
                lines += ["", "Record a decision in `private/projects.json` (`\"show\": true`, optional "
                          "`\"label\"`), or run `./update.sh` in a terminal to be asked.", ""]
            arts = [(s, a) for s in month_sessions for a in s["artifacts"]]
            pending = {a["url"]: (s, a) for s, a in arts if a["url"] not in decisions["artifacts"]}
            if pending:
                lines += ["## Artifacts awaiting a decision (private)", "",
                          "Add each to `artifacts` in `private/projects.json` as "
                          "`{\"show\": true, \"title\": \"…\", \"url\": \"public link, if shared\"}` "
                          "or `{\"show\": false}`.", ""]
                for url, (s, a) in pending.items():
                    lines.append(f"- `{s['t']}` {s['p']} — {a.get('title') or 'untitled'} — {url}")
                lines.append("")
        lines += ["---", "", "## The weeks", ""]
        lines += week_lines(private)
        return lines

    (ROOT / "drafts" / f"{month}-sessions.md").write_text("\n".join(body(False)), encoding="utf-8")
    private_path = ROOT / "private" / f"{month}-sessions.md"
    private_path.parent.mkdir(parents=True, exist_ok=True)
    private_path.write_text("\n".join(body(True)), encoding="utf-8")
    print(f"Wrote drafts/{month}-sessions.md and private/{month}-sessions.md")


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
