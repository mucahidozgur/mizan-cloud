FROM python:3.11-slim

WORKDIR /app

# torch'un çalışması için GNU OpenMP runtime gerekli (python:3.11-slim'de yok)
RUN apt-get update \
    && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Bağımlılık katmanını cache'leyebilmek için önce sadece requirements.txt kopyalanır.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Railway $PORT verir; lokal docker run için 8000'e düşer.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
