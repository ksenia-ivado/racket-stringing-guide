.PHONY: install dev frontend backend test lint build

install:
	cd backend && uv sync
	cd frontend && npm install

# Runs both servers. Ctrl+C stops both.
dev:
	$(MAKE) -j2 backend frontend

backend:
	cd backend && uv run uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

test:
	cd backend && uv run pytest

lint:
	cd backend && uv run ruff check . && uv run ruff format --check .
	cd frontend && npm run lint

build:
	cd frontend && npm run build
