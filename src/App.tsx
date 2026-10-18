import { useState } from 'react';
import { catalog as rawCatalog } from './lib/catalog.js';
import CatalogView from './components/CatalogView';
import DocsView from './components/DocsView';
import ValidatorView from './components/ValidatorView';
import type { CatalogEntry } from './types';
import './styles.css';

const catalog = rawCatalog as CatalogEntry[];
type View = 'catalog' | 'validator' | 'docs';

export default function App() {
  const [view, setView] = useState<View>('catalog');
  const [category, setCategory] = useState('Tutti');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(catalog[0]?.manifest.id ?? '');
  const selected = catalog.find((entry) => entry.manifest.id === selectedId) ?? null;

  return <div className="app-shell">
    <header className="app-header">
      <button type="button" className="brand" onClick={() => setView('catalog')} aria-label="Open Automation Hub, torna al catalogo">Open Automation <span>Hub</span></button>
      <nav className="primary-nav" aria-label="Navigazione principale">
        <button type="button" className={view === 'catalog' ? 'current' : ''} aria-current={view === 'catalog' ? 'page' : undefined} onClick={() => setView('catalog')}>Catalogo</button>
        <button type="button" className={view === 'validator' ? 'current' : ''} aria-current={view === 'validator' ? 'page' : undefined} onClick={() => setView('validator')}>Valida un file</button>
        <button type="button" className={view === 'docs' ? 'current' : ''} aria-current={view === 'docs' ? 'page' : undefined} onClick={() => setView('docs')}>Documentazione</button>
      </nav>
      <span className="header-platform">n8n · alfa</span>
    </header>
    {view === 'catalog' ? <CatalogView entries={catalog} category={category} query={query} selected={selected} onCategoryChange={setCategory} onQueryChange={setQuery} onSelect={setSelectedId} /> : null}
    {view === 'validator' ? <ValidatorView /> : null}
    {view === 'docs' ? <DocsView /> : null}
  </div>;
}
