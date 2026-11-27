"""Current tennis tournaments and singles matches, from ESPN's public scoreboard API.

ESPN's site API is free and needs no key, but it is undocumented, so parsing is
defensive: anything unexpected is skipped rather than failing the whole response.
"""

import asyncio
import time
from datetime import UTC, date, datetime
from typing import Any, Literal
from zoneinfo import ZoneInfo

import httpx2
from pydantic import BaseModel

from app.config import settings

Tour = Literal["ATP", "WTA"]
Draw = Literal["mens-singles", "womens-singles"]
MatchStatus = Literal["live", "completed", "scheduled"]

DRAWS: dict[str, Draw] = {"mens-singles": "mens-singles", "womens-singles": "womens-singles"}
TOURS: dict[Tour, str] = {"ATP": "atp", "WTA": "wta"}
STATES: dict[str, MatchStatus] = {"in": "live", "post": "completed", "pre": "scheduled"}
# ESPN dates tournaments in US Eastern time (a tournament "day" starts at 05:00Z).
EASTERN = ZoneInfo("America/New_York")


class SetScore(BaseModel):
    games: int
    tiebreak: int | None = None
    won: bool


class Player(BaseModel):
    name: str
    short_name: str
    country: str | None = None
    seed: int | None = None
    winner: bool = False
    sets: list[SetScore] = []


class Match(BaseModel):
    id: str
    tournament_id: str
    draw: Draw
    round: str
    # Sort key: qualifying rounds are negative, then Round 1 ... Final.
    round_order: int
    status: MatchStatus
    status_detail: str
    start: datetime | None = None
    players: list[Player]
    summary: str | None = None


class DrawStats(BaseModel):
    draw: Draw
    matches: int
    completed: int
    live: int
    scheduled: int
    retirements: int
    # Lowest round that still has matches to play; None once the draw is finished.
    current_round: str | None = None
    champion: str | None = None


class Tournament(BaseModel):
    id: str
    name: str
    tour: Tour
    location: str | None = None
    start_date: date
    end_date: date
    major: bool = False
    draws: list[DrawStats]


class Snapshot(BaseModel):
    updated_at: datetime
    source: str = "ESPN"
    # True when ESPN could not be reached and this is the last good copy.
    stale: bool = False
    tournaments: list[Tournament]
    matches: list[Match]


# ---------- Parsing ----------


def _parse_dt(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def _eastern_date(value: Any, fallback: date) -> date:
    dt = _parse_dt(value)
    return dt.astimezone(EASTERN).date() if dt else fallback


def _round_order(round_: dict[str, Any]) -> int:
    try:
        rid = int(round_.get("id", 0))
    except (TypeError, ValueError):
        rid = 0
    return rid - 100 if "qualif" in str(round_.get("displayName", "")).lower() else rid


def _country(athlete: dict[str, Any]) -> str | None:
    flag = athlete.get("flag") or {}
    href = flag.get("href") or ""
    code = href.rsplit("/", 1)[-1].split(".", 1)[0]
    return code.upper() if len(code) == 3 else flag.get("alt")


def _player(c: dict[str, Any]) -> Player:
    athlete = c.get("athlete") or {}
    seed = (c.get("curatedRank") or {}).get("current")
    return Player(
        name=athlete.get("displayName") or "TBD",
        short_name=athlete.get("shortName") or athlete.get("displayName") or "TBD",
        country=_country(athlete),
        seed=seed if isinstance(seed, int) and 0 < seed < 99 else None,
        winner=bool(c.get("winner")),
        sets=[
            SetScore(
                games=int(ls["value"]), tiebreak=ls.get("tiebreak"), won=bool(ls.get("winner"))
            )
            for ls in c.get("linescores") or []
            if isinstance(ls.get("value"), int | float)
        ],
    )


def _match(c: dict[str, Any], tournament_id: str, draw: Draw) -> Match:
    status = (c.get("status") or {}).get("type") or {}
    round_ = c.get("round") or {}
    competitors = sorted(c.get("competitors") or [], key=lambda p: p.get("order", 0))
    notes = [n.get("text") for n in c.get("notes") or [] if n.get("text")]
    return Match(
        id=str(c.get("id")),
        tournament_id=tournament_id,
        draw=draw,
        round=round_.get("displayName") or "",
        round_order=_round_order(round_),
        status=STATES.get(status.get("state", ""), "scheduled"),
        status_detail=status.get("shortDetail") or status.get("description") or "",
        start=_parse_dt(c.get("date")) if c.get("timeValid", True) else None,
        players=[_player(p) for p in competitors],
        summary=notes[0] if notes else None,
    )


def _draw_stats(draw: Draw, matches: list[Match]) -> DrawStats:
    remaining = [m for m in matches if m.status != "completed"]
    final = next((m for m in matches if m.round == "Final" and m.status == "completed"), None)
    champion = next((p.name for p in final.players if p.winner), None) if final else None
    return DrawStats(
        draw=draw,
        matches=len(matches),
        completed=sum(m.status == "completed" for m in matches),
        live=sum(m.status == "live" for m in matches),
        scheduled=sum(m.status == "scheduled" for m in matches),
        retirements=sum("retired" in m.status_detail.lower() for m in matches),
        current_round=min(remaining, key=lambda m: m.round_order).round if remaining else None,
        champion=champion,
    )


def parse_scoreboard(tour: Tour, data: dict[str, Any]) -> tuple[list[Tournament], list[Match]]:
    """Turn one ESPN scoreboard response into tournaments and singles matches."""
    tournaments: list[Tournament] = []
    matches: list[Match] = []
    today = datetime.now(UTC).date()
    for event in data.get("events") or []:
        tid = str(event.get("id"))
        by_draw: dict[Draw, list[Match]] = {}
        for grouping in event.get("groupings") or []:
            draw = DRAWS.get((grouping.get("grouping") or {}).get("slug", ""))
            if draw is None:
                continue  # doubles, mixed, juniors, ...
            for c in grouping.get("competitions") or []:
                by_draw.setdefault(draw, []).append(_match(c, tid, draw))
        # A tournament announced without a draw yet still belongs to its tour's singles.
        if not by_draw:
            by_draw = {"mens-singles" if tour == "ATP" else "womens-singles": []}
        start = _eastern_date(event.get("date"), today)
        tournaments.append(
            Tournament(
                id=tid,
                name=event.get("name") or "Unknown tournament",
                tour=tour,
                location=(event.get("venue") or {}).get("displayName"),
                start_date=start,
                end_date=_eastern_date(event.get("endDate"), start),
                major=bool(event.get("major")),
                draws=[_draw_stats(d, ms) for d, ms in by_draw.items()],
            )
        )
        for ms in by_draw.values():
            matches.extend(ms)
    return tournaments, matches


# ---------- Fetching and caching ----------


async def fetch_scoreboard(client: httpx2.AsyncClient, tour: Tour) -> dict[str, Any]:
    url = f"{settings.espn_base_url}/{TOURS[tour]}/scoreboard"
    res = await client.get(url, timeout=10)
    res.raise_for_status()
    return res.json()


async def fetch_snapshot() -> Snapshot:
    async with httpx2.AsyncClient(headers={"User-Agent": "racket-stringing-guide"}) as client:
        results = await asyncio.gather(*(fetch_scoreboard(client, tour) for tour in TOURS))
    tournaments: list[Tournament] = []
    matches: list[Match] = []
    for tour, data in zip(TOURS, results, strict=True):
        ts, ms = parse_scoreboard(tour, data)
        tournaments.extend(ts)
        matches.extend(ms)
    tournaments.sort(key=lambda t: (t.start_date, t.name))
    return Snapshot(updated_at=datetime.now(UTC), tournaments=tournaments, matches=matches)


class UpstreamError(Exception):
    """ESPN could not be reached and there is no cached copy to fall back on."""


_cache: tuple[float, Snapshot] | None = None
_lock = asyncio.Lock()


async def get_snapshot() -> Snapshot:
    """Cached snapshot; refreshed after `tennis_cache_seconds`. Serves stale data if ESPN fails."""
    global _cache
    async with _lock:
        now = time.monotonic()
        if _cache and now - _cache[0] < settings.tennis_cache_seconds:
            return _cache[1]
        try:
            snap = await fetch_snapshot()
        except (httpx2.HTTPError, ValueError) as err:
            if _cache:
                return _cache[1].model_copy(update={"stale": True})
            raise UpstreamError(str(err)) from err
        _cache = (now, snap)
        return snap


def clear_cache() -> None:
    global _cache
    _cache = None


# ---------- Filtering ----------


def filter_snapshot(
    snap: Snapshot,
    *,
    draw: Draw | None = None,
    status: MatchStatus | None = None,
    tournament: str | None = None,
    round_: str | None = None,
    player: str | None = None,
) -> Snapshot:
    """Narrow a snapshot. Tournament stats always describe the whole draw, not the filtered view."""
    needle = player.strip().lower() if player else ""

    def keep(m: Match) -> bool:
        return (
            (draw is None or m.draw == draw)
            and (status is None or m.status == status)
            and (tournament is None or m.tournament_id == tournament)
            and (round_ is None or m.round.lower() == round_.lower())
            and (not needle or any(needle in p.name.lower() for p in m.players))
        )

    tournaments = []
    for t in snap.tournaments:
        if tournament is not None and t.id != tournament:
            continue
        draws = [d for d in t.draws if draw is None or d.draw == draw]
        if draws:
            tournaments.append(t.model_copy(update={"draws": draws}))
    return snap.model_copy(
        update={"tournaments": tournaments, "matches": [m for m in snap.matches if keep(m)]}
    )
