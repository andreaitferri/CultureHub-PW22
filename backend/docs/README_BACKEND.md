# README Backend

## Architettura
Il backend segue un’impostazione modulare con:
- layer API con router FastAPI
- layer service per la logica applicativa
- layer repository per l’accesso ai dati
- layer models SQLAlchemy
- layer schemas Pydantic
- layer core per configurazione, sicurezza ed eccezioni

## Cartelle
- `app/api/v1/endpoints`: router REST
- `app/core`: configurazione, sicurezza, dipendenze, eccezioni
- `app/db`: engine e sessione SQLAlchemy
- `app/models`: modelli ORM
- `app/repositories`: query e accesso ai dati
- `app/schemas`: schemi request/response
- `app/services`: business logic
- `app/middleware`: middleware custom
- `scripts`: seed del database
- `sql`: script SQL di creazione schema

## Configurazione
File `.env` richiesto:
- `APP_NAME`
- `APP_ENV`
- `APP_DEBUG`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `ALGORITHM`
- `DATABASE_URL`
- `CORS_ORIGINS`

## Database
PostgreSQL con creazione schema tramite `sql/init.sql`.

SQLAlchemy gestisce engine, sessioni, modelli e repository. In sviluppo lo startup
usa `Base.metadata.create_all`; il repository non contiene una storia di migration
Alembic versionate.

## JWT
- autenticazione tramite Bearer token
- endpoint `POST /api/v1/auth/login`
- endpoint `GET /api/v1/auth/me`
- i token vengono firmati con `SECRET_KEY` e algoritmo `HS256`

Le GET di catalogo, eventi e categorie sono pubbliche. Il backend filtra le risposte
pubbliche su `active` per le opere e `published` per gli eventi; Admin e Operatore
possono invece consultare gli stati gestionali. Le operazioni di scrittura restano
protette dai ruoli.

## API
Endpoint realmente implementati:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/me`
- `GET /api/v1/users`
- `GET /api/v1/users/{user_id}`
- `POST /api/v1/users`
- `PUT /api/v1/users/{user_id}`
- `DELETE /api/v1/users/{user_id}`
- `GET /api/v1/categories`
- `GET /api/v1/categories/{category_id}`
- `POST /api/v1/categories`
- `PUT /api/v1/categories/{category_id}`
- `DELETE /api/v1/categories/{category_id}`
- `GET /api/v1/catalog`
- `GET /api/v1/catalog/{work_id}`
- `POST /api/v1/catalog`
- `PUT /api/v1/catalog/{work_id}`
- `DELETE /api/v1/catalog/{work_id}`
- `GET /api/v1/events`
- `GET /api/v1/events/{event_id}`
- `POST /api/v1/events`
- `PUT /api/v1/events/{event_id}`
- `DELETE /api/v1/events/{event_id}`
- `GET /api/v1/bookings`
- `GET /api/v1/bookings/me`
- `GET /api/v1/bookings/{booking_id}`
- `POST /api/v1/bookings`
- `PUT /api/v1/bookings/{booking_id}`
- `DELETE /api/v1/bookings/{booking_id}`
- `GET /api/v1/feedback`
- `GET /api/v1/feedback/me`
- `GET /api/v1/feedback/{feedback_id}`
- `POST /api/v1/feedback`
- `PUT /api/v1/feedback/{feedback_id}`
- `PATCH /api/v1/feedback/{feedback_id}/moderation`
- `DELETE /api/v1/feedback/{feedback_id}`
- `GET /api/v1/dashboard/summary`
- `GET /health`

## Avvio
Da cartella backend:
```bash
python scripts/seed_db.py
uvicorn app.main:app --reload
```
