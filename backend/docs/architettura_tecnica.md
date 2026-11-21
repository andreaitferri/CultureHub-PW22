# Architettura tecnica e flusso di prenotazione

## Modello client-server

Il browser esegue la SPA React. Axios invia richieste HTTP JSON al backend FastAPI.
FastAPI espone API REST versionate sotto `/api/v1`, valida i payload con Pydantic,
applica autenticazione e ruoli, quindi delega la logica ai service.

I repository eseguono query SQLAlchemy verso PostgreSQL. Le risposte vengono
serializzate in JSON e restituite al frontend.

## Autenticazione e autorizzazione

Il login restituisce un JWT firmato con `SECRET_KEY`. Il frontend conserva il token
nella sessione locale e l’interceptor Axios aggiunge:

```text
Authorization: Bearer <token>
```

Le dipendenze FastAPI distinguono:

- utente autenticato;
- utente opzionale per le GET pubbliche;
- ruoli autorizzati per le scritture e le aree riservate.

## Flusso completo di una prenotazione

1. Il browser apre il dettaglio di un evento pubblicato.
2. Il Visitatore autenticato invia `POST /api/v1/bookings` con `event_id` e `seats`.
3. FastAPI valida `BookingCreate` con Pydantic.
4. `get_current_user` ricava l’utente dal JWT.
5. `BookingService` blocca la riga dell’evento con `SELECT FOR UPDATE`.
6. Il service verifica che l’evento sia `published`.
7. Viene cercata una prenotazione attiva dello stesso utente per l’evento.
8. Vengono sommati i posti `pending` e `confirmed`.
9. Se la capienza è sufficiente, la prenotazione viene inserita e la transazione viene committata.
10. In caso di duplicato o capienza insufficiente viene restituito `400`.
11. Un update verso `cancelled` o `rejected` libera i posti perché tali stati non vengono
    conteggiati.

Il lock sulla riga evento serializza le prenotazioni concorrenti per lo stesso evento.
Il database reale non viene modificato dai test: la concorrenza è verificata su
`culturehub_test`.

## Validazione ed errori

Pydantic controlla formati, lunghezze, intervalli numerici, stati e date. Le eccezioni
di dominio producono codici HTTP `400`, `401`, `403` o `404`; gli errori interni sono
restituiti senza dettagli sensibili.
