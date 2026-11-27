"""Write the current tennis snapshot to a JSON file.

GitHub Pages can only serve static files, so the deploy workflow runs this on a
schedule and publishes the result next to the frontend as data/tennis.json.

    uv run python -m app.export_tennis ../frontend/public/data/tennis.json
"""

import asyncio
import sys
from pathlib import Path

from app.tennis import fetch_snapshot


def main(path: str) -> None:
    snap = asyncio.run(fetch_snapshot())
    out = Path(path)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(snap.model_dump_json(exclude_none=True))
    singles = len(snap.matches)
    print(f"Wrote {out}: {len(snap.tournaments)} tournaments, {singles} singles matches")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python -m app.export_tennis OUTPUT.json")
    main(sys.argv[1])
