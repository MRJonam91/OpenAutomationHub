import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import Ajv2020 from 'ajv/dist/2020.js';
import { validateManifest, validateWorkflow } from '../src/lib/validate-workflow.js';

const root = process.cwd();
const workflowsPath = path.join(root, 'workflows', 'n8n');
const schema = JSON.parse(await readFile(path.join(root, 'schemas', 'workflow-manifest.schema.json'), 'utf8'));
const ajv = new Ajv2020({ allErrors: true });
const checkSchema = ajv.compile(schema);
const directories = (await readdir(workflowsPath, { withFileTypes: true })).filter((entry) => entry.isDirectory());
const ids = new Set();
let errorCount = 0;
let warningCount = 0;

for (const directory of directories) {
  const label = directory.name;
  let manifest;
  let workflow;
  try {
    manifest = JSON.parse(await readFile(path.join(workflowsPath, label, 'manifest.json'), 'utf8'));
    workflow = JSON.parse(await readFile(path.join(workflowsPath, label, 'workflow.json'), 'utf8'));
  } catch (error) {
    console.error(`${label}: impossibile leggere manifest.json e workflow.json: ${error.message}`);
    errorCount += 1;
    continue;
  }
  if (!checkSchema(manifest)) {
    for (const error of checkSchema.errors ?? []) {
      console.error(`${label}: schema ${error.instancePath || '/'} ${error.message}`);
      errorCount += 1;
    }
  }
  if (manifest.id !== label || ids.has(manifest.id)) {
    console.error(`${label}: ID non unico o diverso dal nome della directory.`);
    errorCount += 1;
  }
  ids.add(manifest.id);

  const findings = [
    ...validateManifest(manifest, workflow),
    ...validateWorkflow(workflow, { catalogMode: true }).findings,
  ];
  for (const item of findings) {
    const message = `${label}: ${item.severity.toUpperCase()} ${item.code}: ${item.message}`;
    if (item.severity === 'error') {
      console.error(message);
      errorCount += 1;
    } else if (item.severity === 'warning') {
      console.warn(message);
      warningCount += 1;
    } else {
      console.info(message);
    }
  }
}

if (directories.length === 0) {
  console.error('Nessun workflow nel catalogo.');
  errorCount += 1;
}
console.log(`${directories.length} workflow, ${errorCount} errori, ${warningCount} avvisi.`);
if (errorCount > 0) process.exitCode = 1;
