# Database

Database relazionale PostgreSQL.

## Tabella `roles`
- Descrizione: ruoli di accesso del sistema.
- Campi:
  - `id` integer, PK
  - `name` varchar(50), unique, not null
- Relazioni: un ruolo ha molti utenti.

## Tabella `users`
- Descrizione: utenti del sistema.
- Campi:
  - `id` integer, PK
  - `first_name` varchar(100), not null
  - `last_name` varchar(100), not null
  - `email` varchar(255), unique, indexed, not null
  - `password_hash` varchar(255), not null
  - `is_active` boolean, not null, default true
  - `created_at` timestamptz, default now
  - `role_id` integer, FK verso `roles.id`, not null
- Relazioni:
  - molti utenti appartengono a un ruolo
  - un utente ha molte prenotazioni
  - un utente ha molti feedback

## Tabella `categories`
- Descrizione: categorie del catalogo.
- Campi:
  - `id` integer, PK
  - `name` varchar(120), unique, not null
  - `description` text, nullable
- Relazioni: una categoria ha molte opere.

## Tabella `works`
- Descrizione: opere del catalogo.
- Campi:
  - `id` integer, PK
  - `title` varchar(200), not null
  - `author` varchar(200), nullable
  - `description` text, nullable
  - `image_url` varchar(500), nullable
  - `status` varchar(30), not null, default `active`
  - `category_id` integer, FK verso `categories.id`, not null
- Relazioni: ogni opera appartiene a una categoria.

## Tabella `events`
- Descrizione: eventi, mostre o visite guidate.
- Campi:
  - `id` integer, PK
  - `title` varchar(200), not null
  - `description` text, nullable
  - `location` varchar(255), not null
  - `starts_at` timestamptz, not null
  - `ends_at` timestamptz, not null
  - `capacity` integer, not null
  - `status` varchar(30), not null, default `draft`
- Relazioni: un evento ha molte prenotazioni e molti feedback.

## Tabella `bookings`
- Descrizione: prenotazioni degli eventi.
- Campi:
  - `id` integer, PK
  - `user_id` integer, FK verso `users.id`, not null
  - `event_id` integer, FK verso `events.id`, not null
  - `seats` integer, not null, default 1
  - `status` varchar(30), not null, default `pending`
  - `created_at` timestamptz, default now
- Relazioni: ogni prenotazione appartiene a un utente e a un evento.

## Tabella `feedback`
- Descrizione: feedback inviati dagli utenti.
- Campi:
  - `id` integer, PK
  - `user_id` integer, FK verso `users.id`, not null
  - `event_id` integer, FK verso `events.id`, nullable
  - `booking_id` integer, FK verso `bookings.id`, nullable
  - `rating` integer, not null
  - `comment` text, not null
  - `moderation_status` varchar(30), not null, default `pending`
  - `created_at` timestamptz, default now
- Vincolo logico: il feedback deve riferirsi a un evento oppure a una prenotazione, non a entrambi.

## Stati e vincoli applicativi

- `works.status`: `active` o `archived`.
- `events.status`: `draft`, `published`, `cancelled`, `completed`.
- `bookings.status`: `pending`, `confirmed`, `cancelled`, `rejected`.
- `feedback.moderation_status`: `pending`, `approved`, `rejected`.
- Solo prenotazioni `pending` e `confirmed` occupano capienza.
- Un utente non può avere più di una prenotazione attiva per evento tramite il service.
- La capienza viene verificata sotto lock PostgreSQL sulla riga dell’evento.
- Un feedback riferito a una prenotazione deve appartenere all’utente autenticato.

Questi ultimi vincoli sono principalmente applicativi; non tutti sono espressi come
constraint PostgreSQL dedicati.
