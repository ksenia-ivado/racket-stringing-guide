"""Tennis tournaments and singles matches, live and past seasons, from ESPN's public API.

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
# Combined events (Grand Slams, Indian Wells, Miami, ...) appear in both feeds.
TourLabel = Literal["ATP", "WTA", "ATP/WTA"]
Draw = Literal["mens-singles", "womens-singles"]
MatchStatus = Literal["live", "completed", "scheduled"]

DRAWS: dict[str, Draw] = {"mens-singles": "mens-singles", "womens-singles": "womens-singles"}
TOURS: dict[Tour, str] = {"ATP": "atp", "WTA": "wta"}
STATES: dict[str, MatchStatus] = {"in": "live", "post": "completed", "pre": "scheduled"}
# ESPN's own "major" flag is false even for the Slams, so match on the name.
GRAND_SLAMS = {"australian open", "roland garros", "french open", "wimbledon", "us open"}
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
    tour: TourLabel
    location: str | None = None
    start_date: date
    end_date: date
    major: bool = False
    draws: list[DrawStats]


class Snapshot(BaseModel):
    # Set for a past (or the current) season's history; None for the live view.
    season: int | None = None
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
    name = str(round_.get("displayName", "")).lower()
    if "qualif" in name:
        return rid - 100  # qualifying comes before the main draw
    if "group" in name or "round robin" in name:
        return 0  # ATP/WTA Finals: group stage (id 15) comes before the semifinals
    return rid


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


def _tournament(tour: Tour, event: dict[str, Any], today: date) -> tuple[Tournament, list[Match]]:
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
    name = event.get("name") or "Unknown tournament"
    start = _eastern_date(event.get("date"), today)
    tournament = Tournament(
        id=tid,
        name=name,
        tour=tour,
        location=(event.get("venue") or {}).get("displayName"),
        start_date=start,
        end_date=_eastern_date(event.get("endDate"), start),
        major=bool(event.get("major")) or name.lower() in GRAND_SLAMS,
        draws=[_draw_stats(d, ms) for d, ms in by_draw.items()],
    )
    return tournament, [m for ms in by_draw.values() for m in ms]


def parse_scoreboards(feeds: dict[Tour, dict[str, Any]]) -> tuple[list[Tournament], list[Match]]:
    """Turn ESPN scoreboard responses into tournaments and singles matches.

    Combined ATP/WTA events are in both feeds with the same id and the same
    matches, so each event is parsed once and labelled with both tours.
    """
    tournaments: dict[str, Tournament] = {}
    matches: list[Match] = []
    today = datetime.now(UTC).date()
    for tour, data in feeds.items():
        for event in data.get("events") or []:
            tid = str(event.get("id"))
            if tid in tournaments:
                if tournaments[tid].tour != tour:
                    tournaments[tid].tour = "ATP/WTA"
                continue
            tournament, ms = _tournament(tour, event, today)
            tournaments[tid] = tournament
            matches.extend(ms)
    ordered = sorted(tournaments.values(), key=lambda t: (t.start_date, t.name))
    return ordered, matches


def parse_scoreboard(tour: Tour, data: dict[str, Any]) -> tuple[list[Tournament], list[Match]]:
    """Parse a single feed."""
    return parse_scoreboards({tour: data})


# ---------- Fetching and caching ----------

FIRST_SEASON = 2015  # earliest season ESPN has full singles results for


def current_season() -> int:
    return datetime.now(UTC).year


def published_seasons() -> list[int]:
    """The seasons offered in the UI and exported for GitHub Pages, newest first."""
    now = current_season()
    return list(range(now, now - settings.tennis_history_seasons, -1))


async def fetch_scoreboard(
    client: httpx2.AsyncClient, tour: Tour, dates: str | None = None
) -> dict[str, Any]:
    url = f"{settings.espn_base_url}/{TOURS[tour]}/scoreboard"
    # A whole season is ~20 MB per tour, so allow it more time than the live board.
    res = await client.get(
        url, params={"dates": dates} if dates else None, timeout=60 if dates else 10
    )
    res.raise_for_status()
    return res.json()


async def _fetch(dates: str | None = None) -> tuple[list[Tournament], list[Match]]:
    async with httpx2.AsyncClient(headers={"User-Agent": "racket-stringing-guide"}) as client:
        results = await asyncio.gather(*(fetch_scoreboard(client, tour, dates) for tour in TOURS))
    return parse_scoreboards(dict(zip(TOURS, results, strict=True)))


async def fetch_snapshot() -> Snapshot:
    """What is on now: ESPN's current scoreboard for both tours."""
    tournaments, matches = await _fetch()
    return Snapshot(updated_at=datetime.now(UTC), tournaments=tournaments, matches=matches)


async def fetch_season(season: int) -> Snapshot:
    """Every singles tournament and match of one season, both tours."""
    tournaments, matches = await _fetch(str(season))
    return Snapshot(
        season=season, updated_at=datetime.now(UTC), tournaments=tournaments, matches=matches
    )


class UpstreamError(Exception):
    """ESPN could not be reached and there is no cached copy to fall back on."""


_cache: dict[int | None, tuple[float, Snapshot]] = {}
_locks: dict[int | None, asyncio.Lock] = {}


async def _cached(key: int | None, ttl: float, fetch) -> Snapshot:
    """Return a cached snapshot, refreshing after `ttl` seconds; serve stale data if ESPN fails."""
    async with _locks.setdefault(key, asyncio.Lock()):
        now = time.monotonic()
        hit = _cache.get(key)
        if hit and now - hit[0] < ttl:
            return hit[1]
        try:
            snap = await fetch()
        except (httpx2.HTTPError, ValueError) as err:
            if hit:
                return hit[1].model_copy(update={"stale": True})
            raise UpstreamError(str(err)) from err
        _cache[key] = (now, snap)
        return snap


async def get_snapshot() -> Snapshot:
    """The live view, cached for `tennis_cache_seconds`."""
    return await _cached(None, settings.tennis_cache_seconds, fetch_snapshot)


async def get_season(season: int) -> Snapshot:
    """A season's history. The current season changes, so it is refreshed more often."""
    ttl = settings.tennis_history_cache_seconds if season == current_season() else 24 * 3600
    return await _cached(season, ttl, lambda: fetch_season(season))


def clear_cache() -> None:
    _cache.clear()


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
