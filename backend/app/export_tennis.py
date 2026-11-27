"""Write the live tennis snapshot and recent seasons' history as static JSON.

GitHub Pages can only serve static files, so the deploy workflow runs this on a
schedule and publishes the output next to the frontend:

    data/tennis.json              what is on now
    data/history/index.json       {"seasons": [2026, 2025, ...]}
    data/history/<season>.json    one season's singles tournaments and matches

    uv run python -m app.export_tennis ../frontend/public/data
"""

import asyncio
import json
import sys
from pathlib import Path

from app.tennis import Snapshot, fetch_season, fetch_snapshot, published_seasons


def write(path: Path, snap: Snapshot) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(snap.model_dump_json(exclude_none=True))
    kb = path.stat().st_size // 1024
    print(
        f"Wrote {path}: {len(snap.tournaments)} tournaments, {len(snap.matches)} matches, {kb} KB"
    )


async def export(out: Path) -> None:
    write(out / "tennis.json", await fetch_snapshot())
    seasons = published_seasons()
    # One season at a time: each is ~45 MB from ESPN.
    for season in seasons:
        write(out / "history" / f"{season}.json", await fetch_season(season))
    (out / "history" / "index.json").write_text(json.dumps({"seasons": seasons}))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python -m app.export_tennis OUTPUT_DIR")
    asyncio.run(export(Path(sys.argv[1])))
