import json
from datetime import date
from pathlib import Path

import httpx2
import pytest
from fastapi.testclient import TestClient

from app import tennis
from app.config import settings
from app.main import app

FIXTURES = Path(__file__).parent / "fixtures"
client = TestClient(app)


def fixture(tour: tennis.Tour) -> dict:
    return json.loads((FIXTURES / f"espn_{tour.lower()}.json").read_text())


@pytest.fixture(autouse=True)
def fake_espn(monkeypatch: pytest.MonkeyPatch):
    """Serve the recorded ESPN responses instead of calling the network."""

    async def fake_fetch(_client, tour):
        return fixture(tour)

    monkeypatch.setattr(tennis, "fetch_scoreboard", fake_fetch)
    tennis.clear_cache()
    yield
    tennis.clear_cache()


# ---------- Parsing ----------


def test_parse_keeps_only_singles() -> None:
    tournaments, matches = tennis.parse_scoreboard("WTA", fixture("WTA"))
    assert len(tournaments) == 1
    assert [d.draw for d in tournaments[0].draws] == ["womens-singles"]
    assert len(matches) == 6  # the doubles match in the fixture is dropped
    assert {m.draw for m in matches} == {"womens-singles"}


def test_parse_tournament_details_and_stats() -> None:
    (t,), _ = tennis.parse_scoreboard("WTA", fixture("WTA"))
    assert t.name == "IEB+ Argentina Open"
    assert t.location == "Buenos Aires, Argentina"
    # ESPN uses US Eastern days: 2026-11-22T05:00Z to 2026-11-30T04:59Z
    assert (t.start_date, t.end_date) == (date(2026, 11, 22), date(2026, 11, 29))
    stats = t.draws[0]
    assert (stats.completed, stats.live, stats.scheduled) == (3, 1, 2)
    assert stats.retirements == 1
    assert stats.current_round == "Round 2"
    assert stats.champion is None


def test_parse_match_details() -> None:
    _, matches = tennis.parse_scoreboard("WTA", fixture("WTA"))
    by_id = {m.id: m for m in matches}

    retired = by_id["186826"]
    assert retired.status == "completed"
    assert retired.status_detail == "Retired"
    assert sum(p.winner for p in retired.players) == 1

    qualifying = by_id["187580"]
    assert qualifying.round_order < 0 < by_id["186826"].round_order

    assert by_id["999001"].status == "live"
    assert [p.name for p in by_id["186843"].players] == ["TBD", "TBD"]

    sets = [s for m in matches for p in m.players for s in p.sets]
    assert any(s.tiebreak is not None for s in sets)
    countries = {p.country for m in matches for p in m.players if p.name != "TBD"}
    assert all(c and len(c) == 3 and c.isupper() for c in countries)


def test_tournament_without_draw_yet_is_listed() -> None:
    (t,), matches = tennis.parse_scoreboard("ATP", fixture("ATP"))
    assert t.name.startswith("Next Gen ATP Finals")
    assert [d.draw for d in t.draws] == ["mens-singles"]
    assert t.draws[0].matches == 0
    assert matches == []


def test_parse_skips_garbage() -> None:
    assert tennis.parse_scoreboard("ATP", {}) == ([], [])
    assert tennis.parse_scoreboard("ATP", {"events": [{"groupings": None}]})[1] == []


# ---------- Endpoint ----------


def test_endpoint_returns_both_tours() -> None:
    body = client.get("/api/tennis").json()
    assert {t["tour"] for t in body["tournaments"]} == {"ATP", "WTA"}
    assert len(body["matches"]) == 6
    assert body["source"] == "ESPN"
    assert body["stale"] is False


@pytest.mark.parametrize(
    ("query", "count"),
    [
        ("draw=womens-singles", 6),
        ("draw=mens-singles", 0),
        ("status=live", 1),
        ("status=completed", 3),
        ("round=final", 1),
        ("player=ERJAVEC", 1),
        ("tournament=867-2026&status=scheduled", 2),
        ("tournament=nope", 0),
    ],
)
def test_endpoint_filters_matches(query: str, count: int) -> None:
    res = client.get(f"/api/tennis?{query}")
    assert res.status_code == 200
    assert len(res.json()["matches"]) == count


def test_draw_filter_narrows_tournaments() -> None:
    body = client.get("/api/tennis?draw=mens-singles").json()
    assert [t["tour"] for t in body["tournaments"]] == ["ATP"]


def test_invalid_filter_is_rejected() -> None:
    assert client.get("/api/tennis?draw=mixed-doubles").status_code == 422


# ---------- Upstream failures ----------


def test_upstream_down_without_cache_is_502(monkeypatch: pytest.MonkeyPatch) -> None:
    async def down(_client, _tour):
        raise httpx2.ConnectError("no route")

    monkeypatch.setattr(tennis, "fetch_scoreboard", down)
    assert client.get("/api/tennis").status_code == 502


def test_upstream_down_serves_stale_copy(monkeypatch: pytest.MonkeyPatch) -> None:
    assert client.get("/api/tennis").json()["stale"] is False

    async def down(_client, _tour):
        raise httpx2.ConnectError("no route")

    monkeypatch.setattr(tennis, "fetch_scoreboard", down)
    monkeypatch.setattr(settings, "tennis_cache_seconds", 0)
    body = client.get("/api/tennis").json()
    assert body["stale"] is True
    assert len(body["matches"]) == 6
