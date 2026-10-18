# Release GitHub su Telegram

Legge l'ultima release di un repository GitHub pubblico e la invia a una chat Telegram quando lo esegui.

Versione: 1.0.0 · n8n >=1.60.0 · Rischio: medium

## Nodi

- Avvio manuale (n8n-nodes-base.manualTrigger)
- Leggi release GitHub (n8n-nodes-base.httpRequest)
- Invia su Telegram (n8n-nodes-base.telegram)

## Credenziali

- **Telegram Bot** (telegramApi): Crea un bot Telegram, registra il token come credenziale Telegram API in n8n e scegli una chat autorizzata.

## Installazione

1. Importa workflow.json dal menu del workflow in n8n.
2. Apri il nodo Leggi release GitHub e sostituisci n8n-io/n8n nell'URL con il repository pubblico che vuoi seguire.
3. Apri il nodo Invia su Telegram, collega la tua credenziale Telegram API e sostituisci INSERISCI_CHAT_ID con l'ID della chat.
4. Esegui manualmente il workflow e controlla il messaggio prima di aggiungere una pianificazione.

## Azioni e rischi

Azioni dichiarate: read, send. L'esecuzione invia un messaggio alla chat Telegram configurata. La chiamata GitHub legge dati pubblici.

Il file JSON e distribuito disattivato. Verifica nodi, parametri e destinatari prima di attivarlo.

[Importazione di workflow in n8n](https://docs.n8n.io/build/manage-workflows/export-and-import/)
