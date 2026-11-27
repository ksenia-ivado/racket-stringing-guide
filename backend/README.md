# Backend

FastAPI app, managed with [uv](https://docs.astral.sh/uv/).

```sh
uv sync                                   # install deps (incl. dev)
uv run uvicorn app.main:app --reload      # http://localhost:8000, docs at /docs
uv run pytest                             # tests
uv run ruff check . && uv run ruff format .
```

All routes live under `/api`. Settings are read from `APP_*` env vars or `.env` (see `app/config.py`).
