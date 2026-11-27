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
- To add an endpoint, add a route to the `api` router in `backend/app/main.py` and a function in `frontend/src/api/client.ts`.
