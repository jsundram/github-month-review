"""Local time from Swarm check-ins: what zone the owner was in at a given instant.

Shared by build_log.py and draft_month.py, so prompts and commits land on the same
local day. Each check-in carries its UTC offset; an instant takes the offset of the
latest check-in at or before it. With no check-in yet, New York time.

A day is "away" when a check-in that day is more than AWAY_KM from home, and home is
the median of every check-in's position. Days with no check-ins between two away ones
stay away. Only the city of an away day is ever published; home is never written out.
"""
from __future__ import annotations

import bisect
import json
import math
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
FALLBACK = ZoneInfo("America/New_York")
AWAY_KM = 80


def km(a: tuple[float, float], b: tuple[float, float]) -> float:
    (la1, lo1), (la2, lo2) = (tuple(map(math.radians, p)) for p in (a, b))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


US_STATES = dict(pair.replace("_", " ").split(":") for pair in (
    "AL:Alabama AK:Alaska AZ:Arizona AR:Arkansas CA:California CO:Colorado CT:Connecticut DE:Delaware "
    "DC:Washington,_DC FL:Florida GA:Georgia HI:Hawaii ID:Idaho IL:Illinois IN:Indiana IA:Iowa KS:Kansas "
    "KY:Kentucky LA:Louisiana ME:Maine MD:Maryland MA:Massachusetts MI:Michigan MN:Minnesota "
    "MS:Mississippi MO:Missouri MT:Montana NE:Nebraska NV:Nevada NH:New_Hampshire NJ:New_Jersey "
    "NM:New_Mexico NY:New_York NC:North_Carolina ND:North_Dakota OH:Ohio OK:Oklahoma OR:Oregon "
    "PA:Pennsylvania RI:Rhode_Island SC:South_Carolina SD:South_Dakota TN:Tennessee TX:Texas UT:Utah "
    "VT:Vermont VA:Virginia WA:Washington WV:West_Virginia WI:Wisconsin WY:Wyoming").split())


def place_name(c: dict) -> str:
    if c.get("cc") == "US":
        return ", ".join(x for x in (c.get("city"), c.get("state")) if x)
    return ", ".join(x for x in (c.get("city"), c.get("country")) if x)


class Clock:
    def __init__(self, checkins: list[dict]):
        rows = {c["t"]: c for c in checkins if c.get("offset") is not None}
        self.checkins = [rows[t] for t in sorted(rows)]
        self.times = [c["t"] for c in self.checkins]
        located = [c for c in self.checkins if c.get("lat") is not None]
        if located:
            lats = sorted(c["lat"] for c in located)
            lngs = sorted(c["lng"] for c in located)
            self.home = (lats[len(lats) // 2], lngs[len(lngs) // 2])
        else:
            self.home = None

    @classmethod
    def load(cls, root: Path = ROOT) -> "Clock":
        rows: list[dict] = []
        for path in sorted((root / "private" / "swarm").glob("*.json")):
            rows += json.loads(path.read_text(encoding="utf-8"))["checkins"]
        return cls(rows)

    def region(self, c: dict) -> str:
        """Country abroad, state at home; the city when still in the home state."""
        if c.get("cc") != "US":
            return c.get("country") or place_name(c)
        home_states = Counter(x.get("state") for x in self.checkins if not self.away(x))
        if c.get("state") == (home_states.most_common(1)[0][0] if home_states else None):
            return place_name(c)
        return US_STATES.get(c.get("state") or "", c.get("state") or place_name(c))

    def offset(self, epoch: float) -> int:
        """UTC offset in minutes at this instant."""
        i = bisect.bisect_right(self.times, epoch) - 1
        if i < 0:
            return int(datetime.fromtimestamp(epoch, FALLBACK).utcoffset().total_seconds() // 60)
        return self.checkins[i]["offset"]

    def local(self, when: datetime | float) -> datetime:
        epoch = when.timestamp() if isinstance(when, datetime) else when
        offset = self.offset(epoch)
        return datetime.fromtimestamp(epoch, timezone(timedelta(minutes=offset)))

    def away(self, c: dict) -> bool:
        return bool(self.home and c.get("lat") is not None and km(self.home, (c["lat"], c["lng"])) > AWAY_KM)

    def places(self, first: date, last: date) -> dict[str, tuple[str, str]]:
        """{iso date: (city, region)} for each away day in [first, last]."""
        by_day: dict[str, list[dict]] = {}
        for c in self.checkins:
            by_day.setdefault(self.local(c["t"]).date().isoformat(), []).append(c)
        out: dict[str, str] = {}
        day = first
        while day <= last:
            iso = day.isoformat()
            here = [c for c in by_day.get(iso, []) if self.away(c)]
            if here:
                top = Counter(place_name(c) for c in here).most_common(1)[0][0]
                out[iso] = (top, self.region(next(c for c in here if place_name(c) == top)))
            elif iso not in by_day:
                start = datetime(day.year, day.month, day.day, tzinfo=timezone.utc).timestamp()
                i = bisect.bisect_right(self.times, start) - 1
                before = self.checkins[i] if i >= 0 else None
                after = self.checkins[i + 1] if i + 1 < len(self.checkins) else None
                if before and after and self.away(before) and self.away(after):
                    out[iso] = (place_name(before), self.region(before))
            day += timedelta(days=1)
        return out
