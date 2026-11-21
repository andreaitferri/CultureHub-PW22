# Scenario d’uso

## Registrazione
Il visitatore accede alla pagina di registrazione, inserisce nome, cognome, email e password. Il frontend invia i dati a `POST /api/v1/auth/register`; il backend assegna sempre il ruolo `Visitatore`. Se il record viene creato, l’utente viene reindirizzato al login.

## Login
L’utente inserisce email e password nella schermata di login. Il frontend chiama `POST /api/v1/auth/login`, salva il token e richiama `GET /api/v1/auth/me` per recuperare il profilo.

## Consultazione catalogo
Il visitatore anonimo apre il catalogo e il frontend chiama `GET /api/v1/catalog`; il backend restituisce solo opere `active`. Dal dettaglio opera viene chiamato `GET /api/v1/catalog/{work_id}`.

## Prenotazione
Dal dettaglio di un evento pubblicato, il visitatore autenticato apre la pagina di prenotazione. Il frontend invia `POST /api/v1/bookings` con numero posti ed evento selezionato; il backend verifica autenticazione, stato pubblicato, capienza e duplicati attivi.

## Feedback
Dal dettaglio dell’evento, il visitatore invia un feedback con rating e commento. Il frontend usa `POST /api/v1/feedback`.

## Dashboard amministratore
L’admin accede alla dashboard e il frontend chiama `GET /api/v1/dashboard/summary`. Le sezioni operative permettono la gestione di catalogo, eventi, prenotazioni, utenti e feedback.
