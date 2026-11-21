# Processi organizzativi e digitalizzazione — PW 22

## Organizzazione simulata

CultureHub rappresenta una fondazione o impresa culturale simulata che gestisce un
patrimonio di opere, categorie, eventi e attività rivolte a visitatori e operatori.
Il progetto non descrive un’organizzazione reale e non utilizza dati personali reali.

## Problema organizzativo

In uno scenario non digitalizzato, catalogo, calendario eventi, prenotazioni e feedback
possono essere distribuiti tra fogli di calcolo, documenti, comunicazioni manuali e
archivi separati. Questo rende più difficile mantenere dati aggiornati, controllare
la disponibilità dei posti, coordinare gli operatori e produrre una vista sintetica
dell’attività.

## Processo AS-IS simulato

1. L’organizzazione registra opere e categorie in archivi separati.
2. Gli eventi vengono comunicati attraverso canali non centralizzati.
3. Le prenotazioni vengono raccolte e verificate manualmente.
4. La disponibilità residua viene aggiornata dagli operatori.
5. I feedback vengono raccolti separatamente e moderati senza una vista unica.
6. Il controllo dell’andamento richiede ricostruzioni manuali.

Questo è uno scenario progettuale simulato, non il risultato di un’analisi misurata
su un’impresa reale.

## Processo TO-BE

1. Admin e Operatore gestiscono categorie, opere ed eventi tramite interfaccia web.
2. Il pubblico consulta solo contenuti pubblicabili.
3. Il Visitatore si registra e accede con JWT.
4. La prenotazione viene validata dal backend e persistita in PostgreSQL.
5. Il locking dell’evento serializza le richieste concorrenti.
6. Le prenotazioni duplicate attive e l’overbooking vengono rifiutati.
7. Il feedback viene associato all’utente e moderato dagli operatori autorizzati.
8. La dashboard Admin aggrega KPI, stati e liste operative.

## Benefici organizzativi attesi

- centralizzazione dei dati culturali e operativi;
- riduzione delle attività manuali ripetitive;
- maggiore tracciabilità delle prenotazioni;
- controllo coerente della capienza;
- separazione delle responsabilità tramite ruoli;
- visione sintetica attraverso KPI e dashboard;
- accesso pubblico più semplice ai contenuti pubblicabili.

I benefici sono attesi e progettuali: non sono stati misurati tempi, costi, percentuali
di risparmio o incrementi economici.
