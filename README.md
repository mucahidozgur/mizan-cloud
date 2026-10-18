# Mizan Cloud

Avukatlar için AI doküman asistanı — cloud versiyonu (tamamen ücretsiz yığın).

Frontend: Vercel | Backend: Render (free) | DB: Neon (Postgres+pgvector) | Embedding: Cloudflare Workers AI | LLM: Groq

## Yapı

```
mizan-cloud/
├── backend/      # FastAPI + LangGraph RAG (Render'a deploy)
├── frontend/     # Next.js (Vercel'e deploy, keepalive cron'u dahil)
├── scripts/      # seed_data.py (avukat dokümanları için uyarlanacak)
├── render.yaml   # Render Blueprint (backend deploy konfigürasyonu)
└── .env.example  # Ortam değişkenleri şablonu
```

## Lokal geliştirme

```bash
# Backend (backend/ dizininde, .env ile)
# EMBEDDING_PROVIDER=local için sentence-transformers gerekir (requirements.txt yorum satırları)
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (frontend/ dizininde)
npm install
npm run dev   # NEXT_PUBLIC_API_URL yoksa http://localhost:8000 kullanılır
```

## Deploy

- **Render (backend)**: Dashboard → New → Blueprint → `mizan-cloud` reposu → Apply.
  Sırlar (`DATABASE_URL`, `GROQ_API_KEY`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`) Dashboard'da girilir.
- **Neon (DB)**: Free tier, pgvector hazır. İlk deploy'dan sonra lokalden `alembic upgrade head` çalıştırılır.
- **Vercel (frontend)**: `frontend/` root olarak bağlanır; `NEXT_PUBLIC_API_URL=https://mizan-backend-rtl5.onrender.com`.
  Render'ın uyumamasını `.github/workflows/keepalive.yml` sağlar (her 10 dk'da bir `/health` ping'i).
  Vercel cron'u kullanılmıyor: Hobby planı cron'ları günde 1 ile sınırlıyor.

# Not: keepalive GitHub Actions cronu (keepalive.yml) best-effort calisir; gecikmeler olabilir.
