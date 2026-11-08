# AGENTS.md

Guia para agentes de IA en este repositorio (Playwright + TypeScript, demo publicada de DuoBalance).

- Agente principal: `.github/agents/qa-web-playwright.agent.md`.
- Flujo de trabajo: `docs/AI_AGENT_WORKFLOW.md`.
- Inventario de componentes: `docs/COMPONENT_INVENTORY.md`.
- Comandos, decisiones y alcance: `README.md`.
- Instrucciones generales de Copilot: `.github/copilot-instructions.md`.

Estructura: `src/` (pages, components, fixtures, data, config, utils) y `tests/` (solo suites, hoy `web/`). Valida con `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`; no ejecutes Playwright salvo peticion expresa.
