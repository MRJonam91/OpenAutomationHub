# Open Automation Hub: alfa n8n

## Obiettivo

L'alfa permette a una persona con un'istanza n8n di trovare un workflow, valutarne prerequisiti e rischi, scaricare il JSON e importarlo in n8n. Permette inoltre di caricare un proprio JSON per un controllo statico prima dell'importazione. La selezione dell'utente e `catalogo web n8n-first`.

## Ambito

L'app e un sito statico React + Vite in italiano. Il catalogo legge i manifest e i JSON versionati nel repository; nessun account o backend e richiesto. Ogni scheda mostra descrizione, categorie, versione, credenziali richieste, nodi, rischio e istruzioni. Il comando `Installa questo workflow` scarica il JSON e apre una guida di importazione e configurazione. Non invia workflow o credenziali a un'istanza esterna.

La pagina `Valida un file` legge il file localmente nel browser e riusa le stesse regole della CLI usata in CI. Il validatore controlla struttura, nomi e riferimenti dei nodi, connessioni, credenziali dichiarate o mancanti, compatibilita dichiarata quando e nota la versione di destinazione, nodi non standard, nodi che possono eseguire codice o comandi, scritture, eliminazioni, richieste HTTP, webhook e possibili segreti incorporati. Il risultato distingue errori, avvisi e informazioni. Il controllo e statico ed euristico; non certifica sicurezza o comportamento in esecuzione.

## Workflow iniziali

Il catalogo contiene almeno due workflow n8n importabili, con manifest, README e file JSON: un esempio AI basato su Chat Trigger + LLM Chain + Ollama Chat Model, e un esempio di integrazione GitHub/Telegram. Si aggiungono altri workflow solo quando la definizione JSON e verificabile. I workflow vengono distribuiti disattivati e senza ID o nomi di credenziali reali. Ogni manifest specifica le credenziali da collegare dopo l'importazione.

## Contratto dei dati

Ogni directory `workflows/n8n/<slug>/` contiene `manifest.json`, `workflow.json` e `README.md`. Il manifest segue uno schema JSON versionato e contiene ID, nome, descrizione, versione semantica, piattaforma, compatibilita minima, categorie, credenziali, rischio, azioni esterne e passi di installazione. L'interfaccia e la CLI leggono questi stessi file. Un ID e unico nel catalogo; lo slug coincide con l'ID.

## Interfaccia

Il riferimento visivo e `docs/design/catalog-concept.png`: griglia editoriale, sfondo bianco, accento blu, elenco numerato e pannello dettagli. La scheda selezionata resta leggibile su desktop; su mobile l'elenco precede il dettaglio. Ricerca e filtri per categoria aggiornano l'elenco. La pagina di validazione presenta un'area di caricamento, un campo facoltativo per la versione n8n di destinazione e un report ordinato per gravita. Stati vuoti, errore di parsing e file troppo grande hanno messaggi espliciti. Tutti i controlli sono accessibili da tastiera.

## Limiti dell'alfa

Il pulsante d'installazione non usa l'API n8n: il download e il flusso guidato sono la procedura affidabile per utenti Cloud e self-hosted. Le credenziali vengono aggiunte dall'utente nell'editor n8n. Il validatore non esegue il workflow, non contatta n8n e non prova la disponibilita di nodi in una specifica istanza. La versione minima e una dichiarazione del maintainer, non una prova di compatibilita runtime.

## Verifica

- `npm test`: casi di struttura valida/invalida, connessioni rotte, credenziali, rischi e compatibilita.
- `npm run validate:catalog`: manifest e JSON del catalogo validi, nessun segreto evidente o ID di credenziali esportati.
- `npm run build`: build statica riuscita.
- Verifica browser: ricerca, filtro, dettaglio, download, guida d'importazione, upload JSON, errore di parsing e layout mobile.
