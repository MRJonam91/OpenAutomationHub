# Chat AI locale con Ollama

Una chat n8n che risponde usando un modello Ollama nella tua infrastruttura.

Versione: 1.0.0 · n8n >=1.60.0 · Rischio: medium

## Nodi

- Chat Trigger (@n8n/n8n-nodes-langchain.chatTrigger)
- Basic LLM Chain (@n8n/n8n-nodes-langchain.chainLlm)
- Ollama Chat Model (@n8n/n8n-nodes-langchain.lmChatOllama)

## Credenziali

- **Ollama** (ollamaApi): Crea una credenziale Ollama in n8n e indica l'URL della tua istanza Ollama.

## Installazione

1. Importa workflow.json dal menu del workflow in n8n.
2. Apri il nodo Ollama Chat Model e collega la tua credenziale Ollama.
3. Verifica che il modello llama3.2 sia disponibile oppure selezionane uno installato.
4. Prova la chat nell'editor prima di attivare il workflow.

## Azioni e rischi

Azioni dichiarate: send. Il testo della chat viene inviato all'istanza Ollama configurata nella credenziale.

Il file JSON e distribuito disattivato. Verifica nodi, parametri e destinatari prima di attivarlo.

[Importazione di workflow in n8n](https://docs.n8n.io/build/manage-workflows/export-and-import/)
