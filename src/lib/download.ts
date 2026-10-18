import type { CatalogEntry } from '../types';

export function downloadWorkflow(entry: CatalogEntry) {
  const content = JSON.stringify(entry.workflow, null, 2);
  const objectUrl = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `${entry.manifest.id}-v${entry.manifest.version}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
