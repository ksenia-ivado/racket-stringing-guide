from typing import Annotated

from fastapi import APIRouter, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app import tennis
from app.config import settings

app = FastAPI(title="Racket Stringing API", version=settings.version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


class Health(BaseModel):
    status: str
    version: str


@api.get("/health")
def health() -> Health:
    return Health(status="ok", version=settings.version)


@api.get("/tennis", response_model_exclude_none=True)
async def tennis_snapshot(
    draw: Annotated[tennis.Draw | None, Query(description="mens-singles or womens-singles")] = None,
    status: Annotated[tennis.MatchStatus | None, Query()] = None,
    tournament: Annotated[str | None, Query(description="Tournament id")] = None,
    round: Annotated[str | None, Query(description='Round name, e.g. "Quarterfinal"')] = None,
    player: Annotated[str | None, Query(description="Part of a player's name")] = None,
) -> tennis.Snapshot:
    """Current ATP and WTA tournaments with men's and women's singles matches."""
    try:
        snap = await tennis.get_snapshot()
    except tennis.UpstreamError as err:
        raise HTTPException(502, f"Tennis data source unavailable: {err}") from err
    return tennis.filter_snapshot(
        snap, draw=draw, status=status, tournament=tournament, round_=round, player=player
    )


app.include_router(api)
