from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """App settings, read from environment variables or a .env file."""

    model_config = SettingsConfigDict(env_file=".env", env_prefix="APP_")

    version: str = "0.1.0"
    # Origins allowed to call the API directly (the Vite dev server proxies, so this
    # only matters when the frontend is served from a different origin).
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
