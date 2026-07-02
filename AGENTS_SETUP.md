Enabling AI agents (Anthropic Claude)
=====================================

The agents service reads the Anthropic API key from `process.env.ANTHROPIC_API_KEY`.
You can enable AI features in any of these ways:

1) Add a local `.env` file in `apps/agents` with:

```
ANTHROPIC_API_KEY=sk-...
```

2) In GitHub Codespaces, add a Codespaces secret named `CODESPACES_ANTHROPIC_API_KEY` via the repository settings (Codespaces > Secrets).

3) Add a repository secret (used by Codespaces as well) via the GitHub CLI:

```
gh secret set ANTHROPIC_API_KEY -R developingdev/Code-Craft
```

After adding the key, restart the dev server. The agents service will log `AI agent service connected to Anthropic Claude` when enabled.
