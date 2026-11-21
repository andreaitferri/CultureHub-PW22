# Limiti del prototipo

- Nessuna persistenza di file immagine oltre al riferimento URL lato modello.
- Nessun sistema di notifiche email o push.
- Nessun pagamento online.
- Nessun refresh token dedicato.
- Nessun sistema di audit log.
- Nessuna paginazione server-side sui listati.
- Nessuna ricerca avanzata o filtri complessi nel frontend.
- Sono presenti test automatici backend e collaudi Playwright; i risultati dipendono
  da un database PostgreSQL di test e da un ambiente locale configurato.
- Non è presente una suite frontend versionata con un runner npm dedicato.
