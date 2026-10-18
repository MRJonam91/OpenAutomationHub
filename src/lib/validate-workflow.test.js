import { describe, expect, it } from 'vitest';
import { validateManifest, validateWorkflow } from './validate-workflow.js';

const workflow = () => ({
  name: 'Example',
  active: false,
  nodes: [
    { name: 'Start', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, parameters: {}, position: [0, 0] },
    { name: 'Output', type: 'n8n-nodes-base.set', typeVersion: 3, parameters: {}, position: [200, 0] },
  ],
  connections: { Start: { main: [[{ node: 'Output', type: 'main', index: 0 }]] } },
  settings: { executionOrder: 'v1' },
});

const codes = (result) => result.findings.map((finding) => finding.code);

describe('validateWorkflow', () => {
  it('accepts a connected inactive n8n workflow', () => {
    const result = validateWorkflow(workflow());
    expect(result.summary.errors).toBe(0);
    expect(result.findings).toEqual([]);
  });

  it('rejects malformed workflow data', () => {
    expect(codes(validateWorkflow({ nodes: 'not-an-array' }))).toContain('invalid-workflow');
  });

  it('finds duplicate names and a connection to a missing node', () => {
    const value = workflow();
    value.nodes.push({ ...value.nodes[1] });
    value.connections.Start.main[0][0].node = 'Missing';
    expect(codes(validateWorkflow(value))).toEqual(expect.arrayContaining(['duplicate-node', 'missing-target']));
  });

  it('rejects published credential bindings and an inline authorization token', () => {
    const value = workflow();
    value.nodes[1].credentials = { httpHeaderAuth: { id: '123', name: 'Production API' } };
    value.nodes[1].parameters.headers = { Authorization: 'Bearer example-test-token-123' };
    expect(codes(validateWorkflow(value, { catalogMode: true }))).toEqual(expect.arrayContaining(['bound-credential', 'inline-secret']));
  });

  it('reports an unknown package and dangerous code execution', () => {
    const value = workflow();
    value.nodes[1].type = 'community.example';
    value.nodes.push({ name: 'Code', type: 'n8n-nodes-base.code', typeVersion: 2, parameters: {}, position: [400, 0] });
    expect(codes(validateWorkflow(value))).toEqual(expect.arrayContaining(['unknown-node-package', 'code-execution']));
  });

  it('checks the target version against the declared minimum', () => {
    const result = validateWorkflow(workflow(), { minimumVersion: '1.20.0', targetVersion: '1.19.9' });
    expect(codes(result)).toContain('incompatible-version');
  });

  it('warns when a required node credential is not configured in an uploaded workflow', () => {
    const value = workflow();
    value.nodes[1].type = 'n8n-nodes-base.telegram';
    expect(codes(validateWorkflow(value))).toContain('missing-credential');
  });

  it('warns about destructive operations', () => {
    const value = workflow();
    value.nodes[1].type = 'n8n-nodes-base.httpRequest';
    value.nodes[1].parameters.method = 'DELETE';
    expect(codes(validateWorkflow(value))).toContain('destructive-action');
  });
});

describe('validateManifest', () => {
  it('rejects a missing credential declaration for a credentialed node', () => {
    const value = workflow();
    value.nodes[1].type = 'n8n-nodes-base.telegram';
    const manifest = {
      schemaVersion: '1.0', id: 'example', name: 'Example', description: 'Example workflow', platform: 'n8n',
      version: '1.0.0', categories: ['telegram'], compatibility: { platformVersion: '>=1.0.0' },
      credentials: [], risk: { level: 'medium', actions: ['send'] }, install: ['Importa il file.'],
    };
    expect(validateManifest(manifest, value).map((finding) => finding.code)).toContain('undeclared-credential');
  });
});
