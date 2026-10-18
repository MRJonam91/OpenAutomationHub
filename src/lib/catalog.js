const manifests = import.meta.glob('../../workflows/n8n/*/manifest.json', { eager: true, import: 'default' });
const workflows = import.meta.glob('../../workflows/n8n/*/workflow.json', { eager: true, import: 'default' });

export const catalog = Object.entries(manifests)
  .map(([path, manifest]) => ({
    manifest,
    workflow: workflows[path.replace('/manifest.json', '/workflow.json')],
  }))
  .filter((entry) => entry.workflow)
  .sort((left, right) => left.manifest.name.localeCompare(right.manifest.name, 'it'));
