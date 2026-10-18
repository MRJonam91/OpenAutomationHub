# Carta del progetto

## Problema

I workflow di automazione vengono spesso distribuiti come JSON isolati: non dichiarano dipendenze, credenziali, compatibilita, rischi o modalita di verifica. L'importazione diventa quindi fragile e difficile da fidare.

## Proposta

Open Automation Hub fornisce un catalogo di workflow con un manifesto indipendente dalla piattaforma. Il manifesto consente al catalogo, al validatore, alla documentazione e al futuro installatore di lavorare sugli stessi dati.

## Utenti iniziali

- utenti di n8n e Make che vogliono automazioni riusabili;
- maintainer che pubblicano workflow e vogliono verificarli in CI;
- team che valutano un workflow prima di dargli accesso a servizi esterni.

## MVP: incluso

1. Repository di workflow per n8n, Make e Node-RED.
2. Manifest versionato, schemi e convenzioni di directory.
3. Validazione statica: file richiesti, nodi/dipendenze dichiarati, credenziali, compatibilita e segnali di rischio.
4. Generazione di una pagina README standardizzata dal manifest.
5. Interfaccia catalogo e primo flusso "Installa questo workflow" per n8n.

## MVP: escluso

- esecuzione remota o hosting delle automazioni;
- conservazione o sincronizzazione di segreti;
- certificazione di sicurezza o garanzia dell'effetto dei workflow;
- marketplace a pagamento: la directory premium resta una fase successiva.

## Metriche di successo iniziali

- un workflow importabile e validabile in meno di 10 minuti;
- 100% dei workflow nel catalogo con manifest valido e documentazione minima;
- nessun segreto rilevato nel repository;
- ogni azione distruttiva etichettata prima dell'installazione.

## Decisioni da prendere nella fase di design

- naming pubblico: Open Automation Hub oppure OpenFlowHub;
- formato e UI del catalogo;
- motore e linguaggio del validatore;
- modello di compatibilita per le versioni delle piattaforme;
- livello di isolamento necessario per i test dei workflow;
- criteri e governance per la futura directory premium.
