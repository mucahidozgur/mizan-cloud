# Mizan Cloud

Avukatlar için AI doküman asistanı — cloud versiyonu.

Frontend: Vercel | Backend: Railway | DB: Postgres+pgvector | LLM: Groq

## Yapı

```
mizan-cloud/
├── backend/      # FastAPI + LangGraph RAG (Railway'e deploy)
├── frontend/     # Next.js (Vercel'e deploy)
├── scripts/      # seed_data.py (avukat dokümanları için uyarlanacak)
├── railway.json  # Railway deploy konfigürasyonu
└── .env.example  # Ortam değişkenleri şablonu
```

## Lokal geliştirme

```bash
# Backend (backend/ dizininde, .env ile)
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (frontend/ dizininde)
npm install
npm run dev   # NEXT_PUBLIC_API_URL yoksa http://localhost:8000 kullanılır
```

## Deploy

- **Railway**: kök dizinde `railway.json` ile Dockerfile build; `DATABASE_URL` ve `GROQ_API_KEY` Railway'de env olarak tanımlanır.
- **Vercel**: `frontend/` dizini root olarak bağlanır; `NEXT_PUBLIC_API_URL=https://mizan-api.up.railway.app` build sırasında `.env.production.local`'dan okunur.
