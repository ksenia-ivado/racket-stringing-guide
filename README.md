# String Your Racket

A step-by-step guide to stringing a tennis racket.

- **frontend/**: React + TypeScript (Vite). The guide itself; step content lives in `src/data/steps.ts`.
- **backend/**: Python + FastAPI (uv). Minimal for now: just `GET /api/health`.

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
- Pages use hash routes so links work on GitHub Pages: `#/` is the guide, `#/knots` the knots & techniques page, `#/knots/<id>` jumps to one entry. Knots and techniques live in `src/data/techniques.ts`; a step's `related` field links to them.
- Write measurements in content as `{{metric|imperial}}`, e.g. `about {{6 m|20 ft}}`. The Metric/Imperial toggle in the header picks one (defaulting from the browser locale) and the animations follow it.
- Each step and technique has a looping pixel animation (`src/animations/`): scenes are drawn on a 96x54 grid at 3x detail, one scene per id in `scenes.ts` and `techniqueScenes.ts`.
- To add an endpoint, add a route to the `api` router in `backend/app/main.py` and a function in `frontend/src/api/client.ts`.
