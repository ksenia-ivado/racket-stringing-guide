# String Your Racket

A step-by-step guide to stringing a tennis racket.

- **frontend/**: React + TypeScript (Vite). The guide itself; step content lives in `src/data/steps.ts`.
- **backend/**: Python + FastAPI (uv). `GET /api/health`, and `GET /api/tennis` for current ATP/WTA tournaments with men's and women's singles matches (see below).

## Requirements

- Node 20+
- [uv](https://docs.astral.sh/uv/) (installs Python 3.12 for you)

## Getting started

```sh
make install   # install backend and frontend deps
make dev       # backend on :8000, frontend on :5173
```

Open http://localhost:5173. In development, Vite proxies `/api/*` to the backend, so the frontend calls relative URLs. The API status dot in the header shows whether the backend is reachable.

Other commands: `make test`, `make lint`, `make build`.

## Notes

- Dark theme is the default. The toggle in the header switches to light, and the choice is saved in the browser.
- Progress (current step and steps marked done) is saved in `localStorage`.
- Pages use hash routes so links work on GitHub Pages: `#/` is the guide, `#/knots` the knots & techniques page, `#/knots/<id>` jumps to one entry. Knots and techniques live in `src/data/techniques.ts`; a step's `related` field links to them. Each entry lists its `sources`, shown as a small collapsed "Sources" line under it.
- Write measurements in content as `{{metric|imperial}}`, e.g. `about {{6 m|20 ft}}`. The Metric/Imperial toggle in the header picks one (defaulting from the browser locale) and the animations follow it.
- Each step and technique has a looping pixel animation (`src/animations/`): scenes are drawn on a 96x54 grid at 3x detail, one scene per id in `scenes.ts` and `techniqueScenes.ts`.
- To add an endpoint, add a route to the `api` router in `backend/app/main.py` and a function in `frontend/src/api/client.ts`.

## Live tennis data

The **Live tennis** page (`tennis.html`, linked from the header; old `#/tennis` links redirect there) shows current ATP and WTA tournaments, singles only, with per-draw stats and a filterable match list (draw, status, tournament, round, player).

- **Source:** ESPN's public scoreboard API (`site.api.espn.com/.../tennis/{atp,wta}/scoreboard`). Free and keyless, but unofficial and undocumented, so it may change without notice. Parsing lives in `backend/app/tennis.py` and skips anything it does not recognise.
- **API:** `GET /api/tennis` takes optional filters: `draw` (`mens-singles` | `womens-singles`), `status` (`live` | `completed` | `scheduled`), `tournament` (id), `round` (e.g. `Quarterfinal`) and `player` (part of a name). Responses are cached for 5 minutes (`APP_TENNIS_CACHE_SECONDS`); if ESPN is down, the last good copy is served with `"stale": true`.
- **On GitHub Pages** there is no server, so the deploy workflow runs `python -m app.export_tennis` every 30 minutes and publishes the snapshot as `data/tennis.json`. The frontend reads that file when no backend is configured, and filters it in the browser. GitHub pauses scheduled workflows after 60 days without repository activity; re-enable it from the Actions tab if that happens.
