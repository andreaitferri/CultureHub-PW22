# Installazione completa

## Python
- Installare Python 3.13 o compatibile.
- Verificare con:
```bash
python --version
```

## Node
- Installare Node.js 20 o compatibile.
- Verificare con:
```bash
node --version
npm --version
```

## PostgreSQL
- Installare PostgreSQL 16 o compatibile.
- Verificare che il server sia attivo.

## Creazione database
Dal terminale:
```bash
psql -U andreaferri -d postgres
CREATE DATABASE culturehub;
\q
```

## Import schema
Dal backend:
```bash
psql -U andreaferri -d culturehub -f /Users/andreaferri/Documents/workspace-python/culturehub-be/sql/init.sql
```

## Seed
Dal backend:
```bash
cd /Users/andreaferri/Documents/workspace-python/culturehub-be
python scripts/seed_db.py
```

## Configurazione `.env`
Backend:
```env
DATABASE_URL=postgresql+psycopg2://andreaferri@/culturehub?host=/tmp
SECRET_KEY=super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
APP_NAME=CultureHub API
APP_ENV=development
APP_DEBUG=true
CORS_ORIGINS=http://localhost:5173
```

Per collaudi locali su più origini usare una lista separata da virgole, ad esempio:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174
```

Frontend:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Avvio backend
```bash
cd /Users/andreaferri/Documents/workspace-python/culturehub-be
uvicorn app.main:app --reload
```

## Avvio frontend
```bash
cd /Users/andreaferri/Documents/workspace-js/culturehub-fe
npm run dev
```
