"""Uygulama ayarları: .env dosyasından okunur."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """DocuFlow AI yapılandırma değerleri."""

    DATABASE_URL: str = "postgresql+asyncpg://docuflow:docuflow@localhost:5432/docuflow"
    GROQ_API_KEY: str  # cloud için zorunlu (Render'da env olarak verilir)
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"
    LLM_MODEL: str = "qwen/qwen3.8-27b"
    OLLAMA_BASE_URL: str | None = None  # lokal geliştirme için (cloud'da kullanılmaz)
    EMBEDDING_PROVIDER: str = "local"  # "local" (sentence-transformers) | "cloudflare" (Workers AI)
    EMBEDDING_MODEL: str = "BAAI/bge-small-en-v1.5"
    EMBEDDING_DIM: int = 384
    CLOUDFLARE_ACCOUNT_ID: str = ""  # EMBEDDING_PROVIDER=cloudflare için zorunlu
    CLOUDFLARE_API_TOKEN: str = ""  # Workers AI token'ı (ücretsiz 10k neuron/gün)
    CLOUDFLARE_EMBEDDING_MODEL: str = "@cf/baai/bge-small-en-v1.5"
    JWT_SECRET: str = "changeme"
    JWT_ALG: str = "HS256"
    JWT_EXPIRE_MIN: int = 60
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://mizan.vercel.app",
        "https://mizan-*.vercel.app",  # Vercel preview/şube deployment'ları
    ]
    TEST_DATABASE_URL: str | None = None  # host'tan test DB'si (localhost)
    TEST_DATABASE_URL_DOCKER: str | None = None  # container içinden test DB'si (postgres)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Ayarları cache'leyerek döndürür (process başına tek instance)."""
    return Settings()
