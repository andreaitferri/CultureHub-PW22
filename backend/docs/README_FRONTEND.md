# README Frontend

## Architettura
Il frontend è una SPA in React con:
- routing dichiarativo tramite React Router
- chiamate HTTP tramite Axios
- stato autenticazione centralizzato in Context API
- pagine pubbliche e aree protette per ruolo

## Componenti
Componenti realmente presenti:
- layout pubblici e admin
- logo condiviso
- auth form
- protected route
- card riutilizzabili per opere, eventi, prenotazioni e feedback
- componenti UI base: button, card, input, select, textarea, loading, error state, section title

## Routing
Il routing principale è definito in:
- `src/routes/AppRoutes.tsx`

Pagine mappate:
- `/`
- `/login`
- `/registrazione`
- `/catalogo`
- `/catalogo/:id`
- `/eventi`
- `/eventi/:id`
- `/prenotazione/:eventId`
- `/feedback/:eventId`
- `/dashboard/visitatore`
- `/dashboard/admin`
- `/admin/catalogo`
- `/admin/eventi`
- `/admin/prenotazioni`
- `/admin/utenti`
- `/admin/feedback`

## Gestione autenticazione
- token JWT salvato in `localStorage`
- bootstrap sessione con `GET /api/v1/auth/me`
- protezione rotte con `ProtectedRoute`
- autorizzazione basata sul ruolo dell’utente

## Configurazione
File `.env` frontend:
- `VITE_API_BASE_URL=http://localhost:8000/api/v1`

Se la variabile non è presente, Axios usa lo stesso valore come fallback. I token
JWT vengono aggiunti dall’interceptor Axios alle richieste autenticabili; le GET
pubbliche di catalogo, eventi e categorie non richiedono login.

## Build
Script disponibili:
- `npm run dev`
- `npm run build`
- `npm run preview`
