import { ArrowUpRight, Bot, GitBranch, Search } from 'lucide-react';
import type { CatalogEntry } from '../types';
import WorkflowDetail from './WorkflowDetail';

type Props = {
  entries: CatalogEntry[];
  category: string;
  query: string;
  selected: CatalogEntry | null;
  onCategoryChange: (category: string) => void;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
};

const riskLabels = { low: 'Basso', medium: 'Medio', high: 'Alto', critical: 'Critico' };

export default function CatalogView({ entries, category, query, selected, onCategoryChange, onQueryChange, onSelect }: Props) {
  const categories = ['Tutti', ...new Set(entries.flatMap((entry) => entry.manifest.categories))];
  const search = query.trim().toLocaleLowerCase('it');
  const visible = entries.filter((entry) => {
    const matchesCategory = category === 'Tutti' || entry.manifest.categories.includes(category);
    const haystack = `${entry.manifest.name} ${entry.manifest.description} ${entry.manifest.categories.join(' ')}`.toLocaleLowerCase('it');
    return matchesCategory && haystack.includes(search);
  });
  const activeEntry = visible.find((entry) => entry.manifest.id === selected?.manifest.id) ?? visible[0] ?? null;

  return (
    <main className="catalog-layout">
      <section className="catalog-pane" aria-label="Catalogo workflow">
        <div className="catalog-intro">
          <h1>Workflow pronti da usare</h1>
          <p>Automazioni n8n da esplorare, verificare e importare nella tua istanza.</p>
        </div>
        <label className="search-field">
          <Search size={19} aria-hidden="true" />
          <input type="search" aria-label="Cerca workflow" placeholder="Cerca workflow" value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <div className="category-tabs" role="group" aria-label="Filtra per categoria">
          {categories.map((item) => (
            <button key={item} type="button" className={item === category ? 'active' : ''} aria-pressed={item === category} onClick={() => onCategoryChange(item)}>{item}</button>
          ))}
        </div>
        <div className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'workflow' : 'workflow'}</div>
        <div className="workflow-list">
          {visible.length === 0 ? <p className="empty-result">Nessun workflow trovato.</p> : visible.map((entry, index) => {
            const active = activeEntry?.manifest.id === entry.manifest.id;
            const Icon = entry.manifest.categories.includes('GitHub') ? GitBranch : Bot;
            return (
              <button key={entry.manifest.id} type="button" className={`workflow-row ${active ? 'selected' : ''}`} aria-pressed={active} onClick={() => onSelect(entry.manifest.id)}>
                <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="row-icon"><Icon size={25} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="row-main">
                  <strong>{entry.manifest.name}</strong>
                  <span className="row-description">{entry.manifest.description}</span>
                  <span className="row-categories">{entry.manifest.categories.join('  ·  ')}<span className="row-risk">Rischio {riskLabels[entry.manifest.risk.level].toLowerCase()}</span></span>
                </span>
                <ArrowUpRight size={20} strokeWidth={1.8} aria-hidden="true" className="row-arrow" />
              </button>
            );
          })}
        </div>
      </section>
      <aside className="detail-pane" aria-label="Dettagli workflow">
        {activeEntry ? <WorkflowDetail key={activeEntry.manifest.id} entry={activeEntry} /> : <div className="detail-empty"><p>Seleziona un altro filtro o modifica la ricerca per vedere i dettagli.</p></div>}
      </aside>
    </main>
  );
}
