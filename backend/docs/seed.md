# Seed

Il seed realmente implementato inserisce:
- 3 ruoli:
  - `Admin`
  - `Operatore`
  - `Visitatore`
- 1 utente amministratore:
  - email: `admin@culturehub.local`
  - password: configurata nell’ambiente locale, non documentata nel repository
- 1 categoria:
  - `Pittura`
- 1 opera demo:
  - `Opera Campione`
- 1 evento demo:
  - `Mostra inaugurale`

Il seed non inserisce prenotazioni né feedback iniziali.

## Dataset dimostrativo di test

`scripts/seed_demo_test.py` è lo script destinato esclusivamente a `culturehub_test`.

Richiede tramite variabili d’ambiente:

```text
CULTUREHUB_TEST_DATABASE_URL=<URL del solo database di test>
CULTUREHUB_DEMO_PASSWORD=<password demo non salvata nel repository>
CULTUREHUB_DEMO_EMAIL_DOMAIN=example.invalid
```

Lo script verifica che il database corrente si chiami `culturehub_test`, verifica la
presenza dello schema e rifiuta ogni altro database. Non esegue migrazioni, non crea
lo schema e non cancella né sovrascrive dati esistenti.

Il dataset demo contiene categorie, opere, eventi, utenti, prenotazioni e feedback
coerenti con le relazioni ORM. Le esecuzioni successive sono idempotenti sui record
identificabili.
