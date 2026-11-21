# Documentazione API

Tutte le route backend sono esposte con prefisso `/api/v1`, eccetto `/health`.

## AUTH

### `POST /api/v1/auth/login`
- Permessi: pubblico
- Body:
```json
{ "email": "<demo-email>", "password": "<demo-password>" }
```
- Response: token JWT
- Codici HTTP: `200`, `401`, `422`
- Esempio request: credenziali utente
- Esempio response:
```json
{ "access_token": "jwt-token", "token_type": "bearer" }
```

### `POST /api/v1/auth/register`
- Permessi: pubblico
- Body:
```json
{
  "first_name": "Mario",
  "last_name": "Rossi",
  "email": "mario@example.com",
  "password": "password123"
}
```
- Il backend assegna sempre il ruolo `Visitatore`.
- `role_id` non fa parte del contratto pubblico; eventuali tentativi di inviarlo non assegnano privilegi.
- La creazione di Admin e Operatore è riservata a `POST /api/v1/users`.
- Response: utente creato
- Codici HTTP: `201`, `400`, `422`

### `GET /api/v1/auth/me`
- Permessi: utente autenticato
- Body: nessuno
- Response: utente corrente con ruolo
- Codici HTTP: `200`, `401`

## USERS

### `GET /api/v1/users`
- Permessi: Admin
- Body: nessuno
- Response: elenco utenti
- Codici HTTP: `200`, `401`, `403`

### `GET /api/v1/users/{user_id}`
- Permessi: Admin
- Response: singolo utente
- Codici HTTP: `200`, `401`, `403`, `404`

### `POST /api/v1/users`
- Permessi: Admin
- Body: dati utente con password
- Response: utente creato
- Codici HTTP: `201`, `400`, `401`, `403`, `422`

### `PUT /api/v1/users/{user_id}`
- Permessi: Admin
- Body: dati aggiornamento utente
- Response: utente aggiornato
- Codici HTTP: `200`, `400`, `401`, `403`, `404`, `422`

### `DELETE /api/v1/users/{user_id}`
- Permessi: Admin
- Response: nessuno
- Codici HTTP: `204`, `401`, `403`, `404`

## CATEGORIES

### `GET /api/v1/categories`
- Permessi: pubblico
- Response: elenco categorie

### `GET /api/v1/categories/{category_id}`
- Permessi: pubblico
- Response: dettaglio categoria

### `POST /api/v1/categories`
- Permessi: Admin, Operatore
- Body: nome e descrizione

### `PUT /api/v1/categories/{category_id}`
- Permessi: Admin, Operatore

### `DELETE /api/v1/categories/{category_id}`
- Permessi: Admin

## CATALOG

### `GET /api/v1/catalog`
- Permessi: pubblico oppure utente autenticato
- Response: elenco opere con categoria
- Anonimi e Visitatori vedono solo opere `active`; Admin e Operatore vedono anche `archived`.

### `GET /api/v1/catalog/{work_id}`
- Permessi: pubblico oppure utente autenticato
- Le opere `archived` non sono visibili ad anonimi e Visitatori.

### `POST /api/v1/catalog`
- Permessi: Admin, Operatore

### `PUT /api/v1/catalog/{work_id}`
- Permessi: Admin, Operatore

### `DELETE /api/v1/catalog/{work_id}`
- Permessi: Admin

## EVENTS

### `GET /api/v1/events`
- Permessi: pubblico oppure utente autenticato
- Anonimi e Visitatori vedono solo eventi `published`; Admin e Operatore vedono tutti gli stati gestionali.

### `GET /api/v1/events/{event_id}`
- Permessi: pubblico oppure utente autenticato
- Eventi non `published` non sono visibili ad anonimi e Visitatori.

### `POST /api/v1/events`
- Permessi: Admin, Operatore

### `PUT /api/v1/events/{event_id}`
- Permessi: Admin, Operatore

### `DELETE /api/v1/events/{event_id}`
- Permessi: Admin

## BOOKINGS

### `GET /api/v1/bookings`
- Permessi: Admin, Operatore

### `GET /api/v1/bookings/me`
- Permessi: Admin, Operatore, Visitatore

### `GET /api/v1/bookings/{booking_id}`
- Permessi: Admin, Operatore

### `POST /api/v1/bookings`
- Permessi: Admin, Operatore, Visitatore
- Body:
```json
{ "event_id": 1, "seats": 2, "status": "pending" }
```

### `PUT /api/v1/bookings/{booking_id}`
- Permessi: Admin, Operatore

### `DELETE /api/v1/bookings/{booking_id}`
- Permessi: Admin, Operatore

## FEEDBACK

### `GET /api/v1/feedback`
- Permessi: Admin, Operatore

### `GET /api/v1/feedback/me`
- Permessi: Admin, Operatore, Visitatore

### `GET /api/v1/feedback/{feedback_id}`
- Permessi: Admin, Operatore

### `POST /api/v1/feedback`
- Permessi: Admin, Operatore, Visitatore
- Body:
```json
{ "event_id": 1, "rating": 5, "comment": "Ottima esperienza" }
```

### `PUT /api/v1/feedback/{feedback_id}`
- Permessi: Admin, Operatore

### `PATCH /api/v1/feedback/{feedback_id}/moderation`
- Permessi: Admin, Operatore
- Body:
```json
{ "moderation_status": "approved" }
```

### `DELETE /api/v1/feedback/{feedback_id}`
- Permessi: Admin, Operatore

## DASHBOARD

### `GET /api/v1/dashboard/summary`
- Permessi: Admin
- Response: conteggi di utenti, categorie, opere, eventi, prenotazioni, feedback

## HEALTH

### `GET /health`
- Permessi: pubblico
- Response: `{"status":"ok"}`
