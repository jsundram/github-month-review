#!/usr/bin/env python3
"""Fetch one month of Swarm check-ins, for time zones and travel days.

    python3 scripts/fetch_swarm.py --month 2026-10
    python3 scripts/fetch_swarm.py --month 2026-10 --no-refresh   # never prompt

Check-ins carry the local UTC offset and a city, which is what turns UTC prompt and
commit times into local days. Only date, offset, and place are kept — never the venue —
and the file goes to private/swarm/<month>.json, which is gitignored. build_log.py
decides what, if anything, reaches the page.

The token is Swarm's own web-session token, not an OAuth app, so it expires. It is read
from .env (SWARM_USERID, SWARM_WSID, SWARM_OAUTH_TOKEN), falling back to
~/Dropbox/Code/swarm/config.json. When it has expired and this is run from a terminal,
it asks for a fresh one: on swarmapp.com/history, open the network tab, pick a month,
right-click the `historysearch` request, "Copy as cURL", and paste. Enter skips.
A refreshed token is written to .env.

Exit codes: 0 fetched, 3 skipped (no usable token), 1 error.
"""
from __future__ import annotations

import argparse
import http.client
import calendar
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV = ROOT / ".env"
LEGACY_CONFIG = Path.home() / "Dropbox" / "Code" / "swarm" / "config.json"
KEYS = {"userid": "SWARM_USERID", "wsid": "SWARM_WSID", "oauth_token": "SWARM_OAUTH_TOKEN"}
PAGE = 100          # the endpoint returns at most 100 per call, whatever `limit` says
SKIPPED = 3


class Expired(Exception):
    pass


def read_env() -> dict[str, str]:
    values: dict[str, str] = {}
    if ENV.exists():
        for line in ENV.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                values[key.strip()] = value.strip().strip("'\"")
    return values


def load_config() -> dict[str, str] | None:
    env = {**read_env(), **os.environ}
    if all(env.get(k) for k in KEYS.values()):
        return {name: env[k] for name, k in KEYS.items()}
    if LEGACY_CONFIG.exists():
        config = json.loads(LEGACY_CONFIG.read_text(encoding="utf-8"))
        if all(config.get(name) for name in KEYS):
            return {name: config[name] for name in KEYS}
    return None


def save_config(config: dict[str, str]) -> None:
    """Replace the three SWARM_ lines in .env, or append them; nothing else changes."""
    lines = ENV.read_text(encoding="utf-8").splitlines() if ENV.exists() else []
    lines = [l for l in lines if l.split("=", 1)[0].strip() not in KEYS.values()]
    lines += [f"{KEYS[name]}={config[name]}" for name in KEYS]
    ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_curl(text: str) -> dict[str, str] | None:
    userid = re.search(r"/users/(\d+)/historysearch", text)
    wsid = re.search(r"[?&]wsid=([^&'\"\s\\]+)", text)
    token = re.search(r"[?&]oauth_token=([^&'\"\s\\]+)", text)
    if not (userid and wsid and token):
        return None
    return {"userid": userid.group(1), "wsid": urllib.parse.unquote(wsid.group(1)),
            "oauth_token": urllib.parse.unquote(token.group(1))}


def ask_for_token() -> dict[str, str] | None:
    print("\nThe Swarm token has expired. To refresh it:", file=sys.stderr)
    print("  1. open https://swarmapp.com/history, then the browser's network tab (filter: Fetch/XHR)", file=sys.stderr)
    print("  2. pick a month; right-click the `historysearch` request → Copy → Copy as cURL", file=sys.stderr)
    print("  3. paste it here and press Enter on an empty line. Or just press Enter to skip.", file=sys.stderr)
    while True:
        lines = []
        for line in sys.stdin:
            if not line.strip():
                break
            lines.append(line)
        if not lines:
            return None
        config = parse_curl("".join(lines))
        if config:
            return config
        print("  That doesn't contain /users/<id>/historysearch, wsid and oauth_token. "
              "Paste again, or Enter to skip.", file=sys.stderr)


def request(config: dict[str, str], after: int, before: int, offset: int) -> dict:
    params = {
        "locale": "en", "v": "20240216", "m": "swarm", "clusters": "false", "sort": "oldestfirst",
        "limit": PAGE, "offset": offset, "afterTimestamp": after, "beforeTimestamp": before,
        "wsid": config["wsid"], "oauth_token": config["oauth_token"],
    }
    url = (f"https://api.foursquare.com/v2/users/{config['userid']}/historysearch?"
           + urllib.parse.urlencode(params))
    req = urllib.request.Request(url, headers={
        "origin": "https://swarmapp.com", "referer": "https://swarmapp.com/",
        "accept": "application/json", "user-agent": "Mozilla/5.0 (github-month-review)"})
    try:
        for attempt in range(3):
            try:
                with urllib.request.urlopen(req, timeout=30) as response:
                    payload = json.load(response)
                break
            except http.client.IncompleteRead:       # it drops long responses now and then
                if attempt == 2:
                    raise
                time.sleep(2)
    except urllib.error.HTTPError as exc:
        if exc.code in (401, 403):
            raise Expired(str(exc.code)) from exc
        try:
            payload = json.load(exc)
        except Exception:
            raise RuntimeError(f"Swarm returned {exc.code}") from exc
    meta = payload.get("meta", {})
    if meta.get("code") in (401, 403) or meta.get("errorType") in ("invalid_auth", "not_authorized"):
        raise Expired(meta.get("errorType") or str(meta.get("code")))
    if meta.get("code") != 200:
        raise RuntimeError(f"Swarm returned {meta}")
    return payload["response"]["checkins"]


def fetch(config: dict[str, str], after: int, before: int) -> list[dict]:
    items, offset = [], 0
    while True:
        page = request(config, after, before, offset)["items"]
        items += page
        if len(page) < PAGE:
            return items
        offset += PAGE
        time.sleep(0.5)


def slim(checkin: dict) -> dict:
    loc = checkin.get("venue", {}).get("location", {})
    return {
        "t": checkin["createdAt"],
        "offset": checkin.get("timeZoneOffset"),
        "city": loc.get("city"), "state": loc.get("state"),
        "country": loc.get("country"), "cc": loc.get("cc"),
        "lat": loc.get("lat"), "lng": loc.get("lng"),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--month", required=True, help="YYYY-MM")
    parser.add_argument("--no-refresh", action="store_true",
                        help="If the token has expired, skip instead of asking for a new one")
    args = parser.parse_args()

    year, mon = (int(p) for p in args.month.split("-"))
    # A day either side, so the zone at each end of the month is known.
    first = datetime(year, mon, 1, tzinfo=timezone.utc) - timedelta(days=1)
    last = datetime(year, mon, calendar.monthrange(year, mon)[1], tzinfo=timezone.utc) + timedelta(days=2)
    now = datetime.now(timezone.utc)
    after, before = int(first.timestamp()), int(min(last, now).timestamp())

    config = load_config()
    can_ask = sys.stdin.isatty() and not args.no_refresh
    if not config:
        print("  no Swarm token in .env or ~/Dropbox/Code/swarm/config.json", file=sys.stderr)
        config = ask_for_token() if can_ask else None
        if not config:
            print("  skipped Swarm; days stay in New York time", file=sys.stderr)
            return SKIPPED
        save_config(config)

    while True:
        try:
            items = fetch(config, after, before)
            break
        except Expired:
            fresh = ask_for_token() if can_ask else None
            if not fresh:
                print("  Swarm token expired; skipped. Rerun from a terminal to refresh it, "
                      "or keep the cached check-ins.", file=sys.stderr)
                return SKIPPED
            config = fresh
            save_config(config)
            print("  saved the new token to .env", file=sys.stderr)

    out = ROOT / "private" / "swarm" / f"{args.month}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    rows = sorted((slim(c) for c in items), key=lambda r: r["t"])
    out.write_text(json.dumps({"month": args.month, "fetched": now.isoformat(timespec="seconds"),
                               "checkins": rows}, indent=1) + "\n", encoding="utf-8")
    print(f"Wrote {out.relative_to(ROOT)}: {len(rows)} check-ins")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
    except RuntimeError as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(1)
