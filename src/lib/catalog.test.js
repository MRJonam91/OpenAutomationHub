import { describe, expect, it } from 'vitest';
import { catalog } from './catalog.js';
import { validateManifest, validateWorkflow } from './validate-workflow.js';

describe('catalog', () => {
  it('contains importable entries with distinct IDs and matching names', () => {
    expect(catalog.length).toBeGreaterThanOrEqual(2);
    expect(new Set(catalog.map((entry) => entry.manifest.id)).size).toBe(catalog.length);
    for (const entry of catalog) {
      expect(entry.manifest.name).toBe(entry.workflow.name);
      expect(validateManifest(entry.manifest, entry.workflow)).toEqual([]);
      expect(validateWorkflow(entry.workflow, { catalogMode: true }).summary.errors).toBe(0);
    }
  });
});
