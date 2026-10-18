import { FileJson2, ShieldCheck, Upload } from 'lucide-react';
import { useMemo, useState } from 'react';
import { validateWorkflow } from '../lib/validate-workflow.js';
import type { Finding, N8nWorkflow } from '../types';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
type UploadState = { name: string; workflow?: N8nWorkflow; error?: string };

export default function ValidatorView() {
  const [upload, setUpload] = useState<UploadState | null>(null);
  const [targetVersion, setTargetVersion] = useState('');
  const result = useMemo(() => upload?.workflow ? validateWorkflow(upload.workflow, {
    targetVersion,
    minimumVersion: upload.workflow.meta?.openAutomationHub?.minN8nVersion,
  }) : null, [upload, targetVersion]);

  const readFile = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setUpload({ name: file.name, error: 'Il file supera il limite di 2 MB.' });
      return;
    }
    try {
      const workflow = JSON.parse(await file.text()) as N8nWorkflow;
      setUpload({ name: file.name, workflow });
    } catch {
      setUpload({ name: file.name, error: 'Il file non contiene JSON valido.' });
    }
  };

  return (
    <main className="utility-page validator-page">
      <div className="utility-intro"><h1>Valida un workflow</h1><p>Carica un export JSON di n8n. L'analisi avviene nel browser: il file non viene inviato a un server.</p></div>
      <div className="validator-grid">
        <section className="validator-input">
          <label className="upload-field" htmlFor="workflow-file"><Upload size={27} strokeWidth={1.6} aria-hidden="true" /><strong>Seleziona un file JSON</strong><span>Dimensione massima: 2 MB</span></label>
          <input id="workflow-file" type="file" accept=".json,application/json" aria-label="File JSON del workflow" onChange={(event) => void readFile(event.target.files?.[0])} />
          <label className="version-field" htmlFor="target-version">Versione n8n di destinazione <span>(facoltativa)</span></label>
          <input id="target-version" type="text" inputMode="decimal" placeholder="es. 1.120.0" value={targetVersion} onChange={(event) => setTargetVersion(event.target.value)} />
          <p className="small-note">Il confronto di versione è possibile solo quando il file dichiara una versione minima Open Automation Hub.</p>
        </section>
        <section className="validator-report" aria-live="polite">
          {!upload ? <div className="report-empty"><FileJson2 size={33} strokeWidth={1.4} aria-hidden="true" /><h2>Pronto per il controllo</h2><p>Seleziona un workflow per vedere struttura, dipendenze e segnali di rischio.</p></div> : null}
          {upload?.error ? <div role="alert" className="report-error"><h2>Impossibile analizzare {upload.name}</h2><p>{upload.error}</p></div> : null}
          {result ? <>
            <div className="report-title"><div><span>Report di validazione</span><h2>{upload?.name}</h2></div><ShieldCheck size={27} strokeWidth={1.5} aria-hidden="true" /></div>
            <div className="report-counts"><strong>{result.summary.errors} errori</strong><strong>{result.summary.warnings} avvisi</strong><strong>{result.summary.info} note</strong></div>
            {result.findings.length === 0 ? <p className="report-clear">Nessun problema rilevato dai controlli statici.</p> : <ul className="findings-list">{(result.findings as Finding[]).map((item, index) => <li key={`${item.code}-${index}`} className={`finding-${item.severity}`}><strong>{item.severity === 'error' ? 'Errore' : item.severity === 'warning' ? 'Avviso' : 'Nota'}</strong><span>{item.message}</span>{item.nodeName ? <small>Nodo: {item.nodeName}</small> : null}</li>)}</ul>}
            <p className="small-note">Il controllo è statico e non prova che il workflow sia sicuro o che funzioni nella tua istanza.</p>
          </> : null}
        </section>
      </div>
    </main>
  );
}
