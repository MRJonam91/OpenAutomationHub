import { ArrowRight, Bot, Download, GitBranch, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { downloadWorkflow } from '../lib/download';
import type { CatalogEntry } from '../types';

const riskLabels = { low: 'Basso', medium: 'Medio', high: 'Alto', critical: 'Critico' };

export default function WorkflowDetail({ entry }: { entry: CatalogEntry }) {
  const [installOpen, setInstallOpen] = useState(false);
  const { manifest, workflow } = entry;
  const Icon = manifest.categories.includes('GitHub') ? GitBranch : Bot;

  const startInstallation = () => {
    downloadWorkflow(entry);
    setInstallOpen(true);
  };

  return (
    <div className="detail-content">
      <div className="detail-heading">
        <span className="detail-icon"><Icon size={27} strokeWidth={1.7} aria-hidden="true" /></span>
        <div>
          <h2>{manifest.name}</h2>
          <p>{manifest.description}</p>
        </div>
      </div>
      <dl className="metadata-grid">
        <div><dt>Versione</dt><dd>{manifest.version}</dd></div>
        <div><dt>Compatibilità n8n</dt><dd>{manifest.compatibility.platformVersion}</dd></div>
        <div><dt>Livello di rischio</dt><dd><span className={`risk-dot ${manifest.risk.level}`} />{riskLabels[manifest.risk.level]}</dd></div>
      </dl>
      <section className="detail-section">
        <h3>Credenziali richieste</h3>
        {manifest.credentials.length === 0 ? <p className="muted">Nessuna credenziale richiesta.</p> : (
          <ul className="credential-list">{manifest.credentials.map((credential) => (
            <li key={credential.type}><div><strong>{credential.service}</strong><span>{credential.instructions}</span></div><small>{credential.required ? 'Obbligatoria' : 'Facoltativa'}</small></li>
          ))}</ul>
        )}
      </section>
      <section className="detail-section">
        <h3>Nodi del workflow</h3>
        <div className="node-flow" aria-label="Elenco nodi del workflow">
          {workflow.nodes.map((node, index) => <span className="flow-item" key={node.name}><span className="flow-node">{node.name}</span>{index < workflow.nodes.length - 1 ? <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /> : null}</span>)}
        </div>
      </section>
      <section className="detail-section risk-section">
        <h3><ShieldAlert size={18} aria-hidden="true" /> Prima di eseguire</h3>
        <p>{manifest.risk.notes}</p>
        <p className="muted">Azioni dichiarate: {manifest.risk.actions.join(', ') || 'nessuna'}.</p>
      </section>
      <div className="detail-actions">
        <button type="button" className="primary-button" onClick={startInstallation}><Download size={18} aria-hidden="true" />Installa questo workflow</button>
        <button type="button" className="secondary-button" onClick={() => downloadWorkflow(entry)}>Scarica JSON</button>
      </div>
      {installOpen ? (
        <section className="install-guide" aria-live="polite">
          <h3>Guida all'importazione</h3>
          <p>Il JSON è stato scaricato. Completa questi passi nella tua istanza n8n:</p>
          <ol>{manifest.install.map((step) => <li key={step}>{step}</li>)}</ol>
          <a href="https://docs.n8n.io/build/manage-workflows/export-and-import/" target="_blank" rel="noreferrer">Guida ufficiale n8n <ArrowRight size={15} aria-hidden="true" /></a>
        </section>
      ) : null}
    </div>
  );
}
