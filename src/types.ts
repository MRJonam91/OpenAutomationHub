export type Credential = {
  service: string;
  type: string;
  required: boolean;
  instructions: string;
};

export type Manifest = {
  schemaVersion: string;
  id: string;
  name: string;
  description: string;
  platform: 'n8n';
  version: string;
  categories: string[];
  compatibility: { platformVersion: string };
  credentials: Credential[];
  risk: { level: 'low' | 'medium' | 'high' | 'critical'; actions: string[]; notes?: string };
  install: string[];
};

export type N8nNode = {
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
  credentials?: Record<string, unknown>;
};

export type N8nWorkflow = {
  name: string;
  active: boolean;
  nodes: N8nNode[];
  connections: Record<string, unknown>;
  settings?: Record<string, unknown>;
  meta?: { openAutomationHub?: { minN8nVersion?: string } };
};

export type CatalogEntry = { manifest: Manifest; workflow: N8nWorkflow };

export type Finding = { severity: 'error' | 'warning' | 'info'; code: string; message: string; nodeName?: string };
