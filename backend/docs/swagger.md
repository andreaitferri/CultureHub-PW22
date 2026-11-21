# Swagger

La documentazione interattiva è disponibile tramite FastAPI:
- Swagger UI: `/docs`
- Redoc: `/redoc`

## Utilizzo
1. Aprire il browser sull’indirizzo del backend.
2. Accedere alla sezione `/docs`.
3. Espandere l’endpoint desiderato.
4. Cliccare su `Try it out`.
5. Compilare il body, se richiesto.
6. Eseguire la richiesta.

## Autenticazione in Swagger
Per gli endpoint protetti:
1. eseguire il login con `POST /api/v1/auth/login`
2. copiare il token JWT restituito
3. usare il pulsante `Authorize`
4. inserire `Bearer <token>`

## Note
- Gli endpoint sono documentati automaticamente da FastAPI.
- I modelli request/response derivano dagli schemi Pydantic.

