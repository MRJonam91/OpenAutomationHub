# OpenAutomationHub

An n8n workflow catalog with local validation, clear credential setup and downloadable templates.

![Catalog concept](docs/design/catalog-concept.png)

**Status:** usable local alpha. The web app lists two inactive n8n templates, lets you inspect their steps and risks, download their JSON, and validate an uploaded workflow locally. It does not execute workflows or store credentials.

## Run locally

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For a production build, run `npm run build` and then `npm run preview`.

## Verify

```sh
npm test
npm run validate:catalog
npm run build
```

The catalog validator checks structure, duplicate and broken node references, credential bindings, obvious inline secrets and declared manifests. Warnings flag selected risky node types; this is static review, not proof that a workflow is safe. Inspect the JSON, recipients, permissions and target n8n instance before importing or activating it.

## Included templates

- [Local Ollama chat](workflows/n8n/chat-ai-locale/README.md)
- [GitHub release to Telegram](workflows/n8n/github-release-telegram/README.md)

Workflow manifests follow [the versioned schema](schemas/workflow-manifest.schema.json). See [the workflow contract](docs/workflow-contract.md) to add a template. The current alpha covers n8n; Make and Node-RED remain future work.

## License and support

Code: [AGPL-3.0-only](LICENSE). See [licensing and third-party notes](LICENSING.md), [security reporting](SECURITY.md) and [commercial licensing](COMMERCIAL-LICENSE.md). Contributions follow [the guide](CONTRIBUTING.md) and [CLA](CLA.md).

Support development through [GitHub Sponsors](https://github.com/sponsors/MRJonam91), [Ko-fi](https://ko-fi.com/mrjonam), [Buy Me a Coffee](https://buymeacoffee.com/mrjonam) or [PayPal](https://paypal.me/manorollo).

Italian documentation: [README.it.md](README.it.md).
