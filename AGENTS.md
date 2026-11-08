# AGENTS.md

Guia para agentes de IA en este repositorio (Playwright + TypeScript, DuoBalance).

- Agente principal: `.github/agents/qa-web-playwright.agent.md`.
- Flujo de trabajo: `docs/AI_AGENT_WORKFLOW.md`.
- Inventario de componentes: `docs/COMPONENT_INVENTORY.md`.
- Comandos y limites de cada suite: `README.md`.
- Instrucciones generales de Copilot: `.github/copilot-instructions.md`.

Estructura: `src/` (pages, components, fixtures, data, config, integration, utils) y `tests/` (solo `web/` y `api/`). Valida con `npm run typecheck` y `npm run lint:arch`; no ejecutes Playwright salvo peticion expresa.
