const OFFICIAL_PREFIXES = ['n8n-nodes-base.', '@n8n/n8n-nodes-langchain.'];
const CREDENTIAL_TYPES = new Map([
  ['n8n-nodes-base.telegram', 'telegramApi'],
  ['n8n-nodes-base.github', 'githubApi'],
  ['n8n-nodes-base.gmail', 'gmailOAuth2'],
  ['@n8n/n8n-nodes-langchain.lmChatOllama', 'ollamaApi'],
  ['@n8n/n8n-nodes-langchain.lmChatOpenAi', 'openAiApi'],
]);

const RISKY_TYPES = new Map([
  ['n8n-nodes-base.code', ['code-execution', 'Il nodo Code puo eseguire codice.']],
  ['n8n-nodes-base.executeCommand', ['command-execution', 'Il nodo Execute Command puo eseguire comandi sul server.']],
  ['n8n-nodes-base.function', ['code-execution', 'Il nodo Function puo eseguire codice.']],
  ['n8n-nodes-base.ssh', ['remote-execution', 'Il nodo SSH puo eseguire comandi remoti.']],
  ['n8n-nodes-base.readWriteFile', ['file-access', 'Il nodo puo leggere o modificare file.']],
  ['n8n-nodes-base.webhook', ['public-endpoint', 'Il nodo Webhook espone un endpoint quando il workflow e attivo.']],
  ['n8n-nodes-base.httpRequest', ['http-request', 'Il nodo HTTP Request puo inviare dati a un servizio esterno.']],
]);

const finding = (severity, code, message, nodeName) => ({
  severity, code, message, ...(nodeName ? { nodeName } : {}),
});

const summarize = (findings) => ({
  errors: findings.filter((item) => item.severity === 'error').length,
  warnings: findings.filter((item) => item.severity === 'warning').length,
  info: findings.filter((item) => item.severity === 'info').length,
});

const parseVersion = (version) => {
  const match = String(version ?? '').replace(/^>=\s*/, '').match(/^(\d+)\.(\d+)\.(\d+)$/);
  return match ? match.slice(1).map(Number) : null;
};

const isOlder = (target, minimum) => {
  const actual = parseVersion(target);
  const required = parseVersion(minimum);
  if (!actual || !required) return false;
  for (let index = 0; index < 3; index += 1) {
    if (actual[index] !== required[index]) return actual[index] < required[index];
  }
  return false;
};

const containsInlineSecret = (value, key = '') => {
  if (Array.isArray(value)) return value.some((item) => containsInlineSecret(item, key));
  if (!value || typeof value !== 'object') {
    if (typeof value !== 'string' || !value.trim() || value.includes('{{')) return false;
    return /^(authorization|api[_-]?key|access[_-]?token|password|client[_-]?secret|secret)$/i.test(key)
      && /^(Bearer\s+\S{8,}|Basic\s+\S{8,}|sk-[A-Za-z0-9_-]{8,}|[A-Za-z0-9_\-.]{16,})$/i.test(value.trim());
  }
  if (value.name && value.value && /^(authorization|x-api-key|api-key)$/i.test(value.name)) {
    return containsInlineSecret(value.value, 'authorization');
  }
  return Object.entries(value).some(([childKey, childValue]) => containsInlineSecret(childValue, childKey));
};

export function validateWorkflow(workflow, options = {}) {
  const findings = [];
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow)
    || !Array.isArray(workflow.nodes) || !workflow.connections || typeof workflow.connections !== 'object'
    || Array.isArray(workflow.connections) || typeof workflow.name !== 'string') {
    findings.push(finding('error', 'invalid-workflow', 'Il file non ha la struttura di un workflow n8n.'));
    return { findings, summary: summarize(findings) };
  }

  if (workflow.nodes.length === 0) findings.push(finding('error', 'empty-workflow', 'Il workflow non contiene nodi.'));
  if (options.catalogMode && workflow.active !== false) {
    findings.push(finding('error', 'active-template', 'Un workflow del catalogo deve essere disattivato.'));
  }

  const names = new Set();
  for (const node of workflow.nodes) {
    if (!node || typeof node.name !== 'string' || !node.name.trim() || typeof node.type !== 'string') {
      findings.push(finding('error', 'invalid-node', 'Un nodo non ha nome o tipo valido.'));
      continue;
    }
    if (names.has(node.name)) findings.push(finding('error', 'duplicate-node', `Nome duplicato: ${node.name}.`, node.name));
    names.add(node.name);

    if (!OFFICIAL_PREFIXES.some((prefix) => node.type.startsWith(prefix))) {
      findings.push(finding('warning', 'unknown-node-package', `Il pacchetto del nodo ${node.name} potrebbe non essere installato.`, node.name));
    }
    const risk = RISKY_TYPES.get(node.type);
    if (risk) findings.push(finding(risk[0] === 'http-request' ? 'info' : 'warning', risk[0], risk[1], node.name));
    const requiredCredential = CREDENTIAL_TYPES.get(node.type);
    if (!options.catalogMode && requiredCredential && !node.credentials?.[requiredCredential]) {
      findings.push(finding('warning', 'missing-credential', `Il nodo ${node.name} richiede la credenziale ${requiredCredential}.`, node.name));
    }
    if (node.type === 'n8n-nodes-base.httpRequest' && String(node.parameters?.method ?? '').toUpperCase() === 'DELETE') {
      findings.push(finding('warning', 'destructive-action', `Il nodo ${node.name} usa una richiesta DELETE.`, node.name));
    }
    if (options.catalogMode && node.credentials && Object.keys(node.credentials).length > 0) {
      findings.push(finding('error', 'bound-credential', 'Rimuovi ID e nomi delle credenziali dal file pubblicato.', node.name));
    }
    if (containsInlineSecret(node.parameters)) {
      findings.push(finding('error', 'inline-secret', 'Possibile segreto scritto nei parametri del nodo.', node.name));
    }
  }

  for (const [sourceName, outputs] of Object.entries(workflow.connections)) {
    if (!names.has(sourceName)) findings.push(finding('error', 'missing-source', `La connessione parte dal nodo mancante ${sourceName}.`));
    if (!outputs || typeof outputs !== 'object') {
      findings.push(finding('error', 'invalid-connection', `Connessioni non valide per ${sourceName}.`));
      continue;
    }
    for (const branches of Object.values(outputs)) {
      if (!Array.isArray(branches)) {
        findings.push(finding('error', 'invalid-connection', `Connessioni non valide per ${sourceName}.`));
        continue;
      }
      for (const links of branches) {
        if (!Array.isArray(links)) {
          findings.push(finding('error', 'invalid-connection', `Connessioni non valide per ${sourceName}.`));
          continue;
        }
        for (const link of links) {
          if (!link || typeof link.node !== 'string' || !names.has(link.node)) {
            findings.push(finding('error', 'missing-target', `La connessione da ${sourceName} punta a un nodo mancante.`));
          }
        }
      }
    }
  }

  if (options.minimumVersion && options.targetVersion && isOlder(options.targetVersion, options.minimumVersion)) {
    findings.push(finding('error', 'incompatible-version', `La versione n8n ${options.targetVersion} e precedente alla minima ${options.minimumVersion}.`));
  }
  return { findings, summary: summarize(findings) };
}

export function validateManifest(manifest, workflow) {
  const findings = [];
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    return [finding('error', 'invalid-manifest', 'Manifest mancante o non valido.')];
  }
  const validText = (value) => typeof value === 'string' && value.trim().length > 0;
  if (manifest.schemaVersion !== '1.0' || manifest.platform !== 'n8n'
    || !validText(manifest.id) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.id)
    || !validText(manifest.name) || !validText(manifest.description)
    || !parseVersion(manifest.version) || !parseVersion(manifest.compatibility?.platformVersion)
    || !Array.isArray(manifest.categories) || manifest.categories.length === 0
    || !Array.isArray(manifest.credentials) || !manifest.risk
    || !['low', 'medium', 'high', 'critical'].includes(manifest.risk.level)
    || !Array.isArray(manifest.risk.actions) || !Array.isArray(manifest.install) || manifest.install.length === 0) {
    findings.push(finding('error', 'invalid-manifest', 'Il manifest non soddisfa il contratto minimo del catalogo.'));
    return findings;
  }
  if (workflow && manifest.name !== workflow.name) {
    findings.push(finding('error', 'name-mismatch', 'Il nome del manifest non coincide con quello del workflow.'));
  }
  const declaredTypes = new Set(manifest.credentials.map((credential) => credential.type));
  for (const node of workflow?.nodes ?? []) {
    const expected = CREDENTIAL_TYPES.get(node.type)
      ?? (node.type === 'n8n-nodes-base.httpRequest' && node.parameters?.authentication === 'genericCredentialType'
        ? node.parameters.nodeCredentialType : null);
    if (expected && !declaredTypes.has(expected)) {
      findings.push(finding('error', 'undeclared-credential', `La credenziale ${expected} usata da ${node.name} non e dichiarata.`, node.name));
    }
  }
  return findings;
}
