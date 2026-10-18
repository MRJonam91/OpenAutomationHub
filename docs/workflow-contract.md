# Contratto di un workflow

Ogni workflow e una directory sotto `workflows/<piattaforma>/<slug>/` e contiene:

- il file esportato dalla piattaforma (`workflow.json`, `blueprint.json` o equivalente);
- `workflow.yaml`, manifesto conforme allo schema;
- `README.md`, documentazione rivolta all'utente;
- facoltativamente `assets/` per screenshot e immagini di demo;
- facoltativamente `tests/` per fixture e controlli specifici.

Il manifesto non contiene valori reali di credenziali. Può indicare il tipo di credenziale, il servizio e se e obbligatoria. Le azioni che scrivono, eliminano, inviano o pubblicano dati devono essere dichiarate in `risk.actions`.

Il validatore dovra fallire se mancano file obbligatori, una credenziale necessaria non e descritta, la compatibilita e assente oppure il livello di rischio non e specificato.
