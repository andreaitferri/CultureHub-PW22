# CultureHub

## Descrizione progetto
CultureHub è una piattaforma web per la digitalizzazione dei processi di una fondazione culturale simulata. Il sistema permette di gestire catalogo opere, categorie, eventi, prenotazioni, feedback e dashboard amministrative, con accesso differenziato per ruoli.

## Obiettivi
- Centralizzare i contenuti culturali in un unico sistema.
- Consentire autenticazione sicura e accesso profilato.
- Gestire catalogo, eventi, prenotazioni e feedback.
- Fornire un’interfaccia amministrativa per il monitoraggio operativo.

## Tecnologie utilizzate
- Frontend: React, Vite, TypeScript
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: PostgreSQL
- Autenticazione: JWT
- Comunicazione: REST API
- Documentazione API: Swagger/OpenAPI
- UI utilities: Axios, react-hot-toast, lucide-react

## Struttura repository
- [`/Users/andreaferri/Documents/workspace-python/culturehub-be`](/Users/andreaferri/Documents/workspace-python/culturehub-be): backend
- [`/Users/andreaferri/Documents/workspace-js/culturehub-fe`](/Users/andreaferri/Documents/workspace-js/culturehub-fe): frontend
- [`/Users/andreaferri/Documents/workspace-python/culturehub-be/docs`](/Users/andreaferri/Documents/workspace-python/culturehub-be/docs): documentazione del progetto

## Requisiti software
- Python 3.13 o compatibile
- Node.js 20 o compatibile
- PostgreSQL 16 o compatibile
- npm

## Installazione
Vedere [Installazione completa](./installazione_completa.md).

## Avvio
Vedere i README dedicati:
- [README Backend](./README_BACKEND.md)
- [README Frontend](./README_FRONTEND.md)

## Configurazione
- Backend: file `.env` con `DATABASE_URL`, `SECRET_KEY` e parametri JWT/CORS.
- Frontend: file `.env` con `VITE_API_BASE_URL=http://localhost:8000/api/v1`.

## Credenziali demo

Le credenziali demo del seed sono destinate esclusivamente allo sviluppo locale.
Non inserire credenziali personali o file `.env` reali nel pacchetto di consegna.

## Screenshot disponibili e da completare
Gli screenshot E2E disponibili nella copia di lavoro sono in
`/Users/andreaferri/Documents/workspace-js/culturehub-fe/test-artifacts/e2e/`.
I principali scenari da documentare sono:
- Home
- Login
- Registrazione
- Catalogo
- Dettaglio opera
- Eventi
- Dettaglio evento
- Prenotazione
- Feedback
- Dashboard visitatore
- Dashboard admin
- Gestione catalogo
- Gestione eventi
- Gestione prenotazioni
- Gestione utenti
- Gestione feedback

## Licenza
Progetto accademico a uso didattico. Nessuna licenza open source esplicita è stata aggiunta al repository.

## Documentazione PW 22

- Processi organizzativi e digitalizzazione: `processi_pw22.md`
- Architettura tecnica e prenotazioni: `architettura_tecnica.md`
- API: `api.md`
- Database: `database.md`, `diagramma-er.md`
- UML: `uml.md`
- Test e risultati: `test_funzionali.md`
