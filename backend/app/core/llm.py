"""LLM ve embedding soyutlama katmanı."""

from functools import lru_cache

import httpx
from langchain_openai import ChatOpenAI

from app.core.config import get_settings

settings = get_settings()


@lru_cache
def get_llm() -> ChatOpenAI:
    """Groq üzerindeki chat modelini cache'leyerek döndürür."""
    return ChatOpenAI(
        base_url=settings.GROQ_BASE_URL,
        api_key=settings.GROQ_API_KEY,
        model=settings.LLM_MODEL,
        temperature=0,
        streaming=True,
    )


class CloudflareEmbeddings:
    """Cloudflare Workers AI üzerinden embedding üretir (ücretsiz katman, 384 dim)."""

    def __init__(self) -> None:
        self._client = httpx.Client(
            base_url="https://api.cloudflare.com/client/v4",
            headers={"Authorization": f"Bearer {settings.CLOUDFLARE_API_TOKEN}"},
            timeout=30.0,
        )

    def _embed(self, texts: list[str]) -> list[list[float]]:
        """Workers AI REST API'sine batch gönderir, vektörleri normalize eder."""
        url = (
            f"/accounts/{settings.CLOUDFLARE_ACCOUNT_ID}"
            f"/ai/run/{settings.CLOUDFLARE_EMBEDDING_MODEL}"
        )
        response = self._client.post(url, json={"text": texts})
        response.raise_for_status()
        return response.json()["result"]["data"]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Doküman listesini embedding vektörlerine çevirir."""
        return self._embed(texts)

    def embed_query(self, text: str) -> list[float]:
        """Tek bir sorgu metnini embedding vektörüne çevirir."""
        return self._embed([text])[0]


class LocalEmbeddings:
    """Yerel sentence-transformers modeliyle embedding üretir (lokal geliştirme)."""

    @property
    @lru_cache  # noqa: B019 (spec: property üzerinde lru_cache; tek instance üzerinden çağrılır)
    def _model(self):
        """Modeli bir kez yükler ve cache'ler (torch import'u yalnız burada)."""
        from sentence_transformers import SentenceTransformer

        return SentenceTransformer(settings.EMBEDDING_MODEL)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        """Doküman listesini normalize embedding vektörlerine çevirir."""
        return self._model.encode(texts, normalize_embeddings=True).tolist()

    def embed_query(self, text: str) -> list[float]:
        """Tek bir sorgu metnini embedding vektörüne çevirir."""
        return self.embed_documents([text])[0]


@lru_cache
def get_embeddings():
    """EMBEDDING_PROVIDER'a göre embedding sağlayıcısını döndürür."""
    if settings.EMBEDDING_PROVIDER == "cloudflare":
        return CloudflareEmbeddings()
    return LocalEmbeddings()
