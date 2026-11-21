# Test funzionali e risultati

## Ambiente di collaudo

I test E2E sono stati eseguiti il **12 novembre 2026** su un ambiente locale isolato:

- backend test: `http://127.0.0.1:8001`;
- frontend test: `http://127.0.0.1:5174`;
- database: `culturehub_test`;
- browser: Playwright 1.64.0 con Chromium;
- database reale `culturehub`: non utilizzato per scritture.

I test Playwright sui servizi test hanno utilizzato record identificabili e non hanno
interrotto i servizi di sviluppo sulle porte 8000 e 5173.

## Risultati automatici

| Suite | Risultato |
|---|---|
| `npm run build` | PASS |
| Suite backend `unittest` | 16 PASS, 0 FAIL, 1 SKIP |
| Test concorrente PostgreSQL isolato | PASS, eseguito separatamente |
| Playwright headless | 19 PASS, 0 FAIL |
| Dimostrazione Playwright headed | PASS |
| Risposte HTTP 5xx inattese | 0 |
| Errori JavaScript inattesi | 0 |

Il test SKIP della suite generale è il test PostgreSQL concorrente quando
`CULTUREHUB_TEST_DATABASE_URL` non è esportata nel processo. Lo stesso test è stato
eseguito separatamente contro `culturehub_test` e ha verificato che una sola tra due
prenotazioni concorrenti sull’ultimo posto venga accettata.

## Scenari verificati

### Utente anonimo

- apertura homepage;
- statistiche reali;
- catalogo pubblico;
- dettaglio opera;
- eventi pubblicati;
- dettaglio evento;
- esclusione opere `archived`;
- esclusione eventi `draft` e non pubblicati;
- redirect delle rotte protette;
- responsive mobile.

### Autenticazione e ruoli

- registrazione senza `role_id`;
- assegnazione forzata del ruolo `Visitatore`;
- login Admin, Operatore e Visitatore;
- credenziali errate con risposta `401`;
- persistenza sessione dopo refresh;
- logout;
- divieto Operatore su dashboard Admin e utenti;
- divieto Visitatore sulle funzioni amministrative.

### Catalogo ed eventi

- creazione e modifica categoria;
- creazione opera e associazione categoria;
- modifica e archiviazione opera;
- creazione evento;
- modifica luogo e capienza;
- pubblicazione evento;
- aggiornamento liste.

### Prenotazioni

- prenotazione valida;
- persistenza nella dashboard personale;
- blocco prenotazione attiva duplicata;
- rifiuto per capienza esaurita;
- annullamento Admin;
- rilascio del posto;
- nuova prenotazione dopo il rilascio.

### Feedback e dashboard

- creazione feedback;
- visualizzazione Admin;
- moderazione a `approved`;
- aggiornamento dashboard con eventi, prenotazioni e feedback.

## Limiti dei risultati

Il database `culturehub_test` contiene anche dati provenienti da precedenti sessioni
di collaudo. I risultati funzionali sono quindi validi, ma i conteggi del dataset non
rappresentano un database vuoto e riproducibile.
