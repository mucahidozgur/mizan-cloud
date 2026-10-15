FROM python:3.11-slim

WORKDIR /app

# Bağımlılık katmanını cache'leyebilmek için önce sadece requirements.txt kopyalanır.
# (Embedding'ler Cloudflare Workers AI'dan gelir; torch/sentence-transformers yok.)
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Render $PORT verir; lokal docker run için 8000'e düşer.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
