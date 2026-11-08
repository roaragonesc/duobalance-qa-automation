# AGENTS.md

Guia para agentes de IA en este repositorio (Playwright + TypeScript, demo publicada de DuoBalance).

- Agente principal: **Playwright SDET** (`.github/agents/playwright-sdet.agent.md`).
- Flujo de trabajo: `docs/AI_AGENT_WORKFLOW.md`.
- Inventario de componentes: `docs/COMPONENT_INVENTORY.md`.
- Comandos, decisiones y alcance: `README.md`.
- Instrucciones generales de Copilot: `.github/copilot-instructions.md`.

Estructura: `src/` (pages, components, fixtures, data, config, utils) y `tests/` (suites `web/` y `api/`). Valida con `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`; no ejecutes Playwright salvo peticion expresa.

Cada spec consume su JSON propio `src/data/testData/<suite>/<titulo>.json` (mismo basename).
Entradas y expected de negocio van en JSON, no literales en specs; `defineCaseData` valida unions y
`test.use({ caseData: data.setup })` alinea la preparacion de fixtures con la misma fuente.
Preserva aserciones, skips, pasos numerados e identidad antes de acciones por persona, sin logica web.
Renombra/renumera siempre el par spec + JSON, su import y el inventario; no dejes JSON decorativos ni huerfanos.
Los valores runtime y claves tecnicas siguen en su propietario, no se simulan con datos fijos.
