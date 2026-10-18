import { ArrowUpRight } from 'lucide-react';

export default function DocsView() {
  return <main className="utility-page docs-page">
    <div className="utility-intro"><h1>Come funziona</h1><p>Dal catalogo alla tua istanza n8n in pochi passaggi verificabili.</p></div>
    <div className="docs-steps">
      <section><span>01</span><div><h2>Esplora</h2><p>Apri una scheda e leggi nodi, credenziali, compatibilità dichiarata e azioni esterne.</p></div></section>
      <section><span>02</span><div><h2>Scarica e importa</h2><p>Il pulsante di installazione scarica un JSON disattivato. Nell'editor n8n scegli “Import from File” dal menu del workflow.</p></div></section>
      <section><span>03</span><div><h2>Configura e prova</h2><p>Collega le tue credenziali in n8n, modifica i parametri indicati nella scheda ed esegui una prova prima di attivarlo.</p></div></section>
    </div>
    <a className="docs-external" href="https://docs.n8n.io/build/manage-workflows/export-and-import/" target="_blank" rel="noreferrer">Apri la guida ufficiale all'importazione <ArrowUpRight size={18} aria-hidden="true" /></a>
  </main>;
}
