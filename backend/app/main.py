from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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


# Add new routers/endpoints to `api` here as the backend grows.

app.include_router(api)
