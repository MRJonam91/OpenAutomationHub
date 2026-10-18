import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = path.join(process.cwd(), 'workflows', 'n8n');
const directories = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory());

for (const directory of directories) {
  const folder = path.join(root, directory.name);
  const manifest = JSON.parse(await readFile(path.join(folder, 'manifest.json'), 'utf8'));
  const workflow = JSON.parse(await readFile(path.join(folder, 'workflow.json'), 'utf8'));
  const credentials = manifest.credentials.length
    ? manifest.credentials.map((credential) => `- **${credential.service}** (${credential.type}): ${credential.instructions}`).join('\n')
    : 'Nessuna.';
  const steps = manifest.install.map((step, index) => `${index + 1}. ${step}`).join('\n');
  const nodes = workflow.nodes.map((node) => `- ${node.name} (${node.type})`).join('\n');
  const readme = `# ${manifest.name}\n\n${manifest.description}\n\nVersione: ${manifest.version} · n8n ${manifest.compatibility.platformVersion} · Rischio: ${manifest.risk.level}\n\n## Nodi\n\n${nodes}\n\n## Credenziali\n\n${credentials}\n\n## Installazione\n\n${steps}\n\n## Azioni e rischi\n\nAzioni dichiarate: ${manifest.risk.actions.join(', ') || 'nessuna'}. ${manifest.risk.notes ?? ''}\n\nIl file JSON e distribuito disattivato. Verifica nodi, parametri e destinatari prima di attivarlo.\n\n[Importazione di workflow in n8n](https://docs.n8n.io/build/manage-workflows/export-and-import/)\n`;
  await writeFile(path.join(folder, 'README.md'), readme, 'utf8');
  console.log(`Generato ${directory.name}/README.md`);
}
