# Instrucciones para Copilot en este repositorio

Este repositorio es el framework de automatizacion Playwright + TypeScript de DuoBalance. Para cualquier tarea de pruebas usa el agente **QA Web Playwright** (`.github/agents/qa-web-playwright.agent.md`) y sigue su flujo.

Orden de lectura antes de cambiar nada:

1. `docs/AI_AGENT_WORKFLOW.md`: flujo (entender, planificar, implementar, verificar, sanar, reportar).
2. `docs/COMPONENT_INVENTORY.md`: Pages, componentes, fixtures, datos y utilidades existentes.
3. `README.md`: entornos, comandos y limites de cada suite.

Reglas imprescindibles:

- `tests/` solo contiene `web/` y `api/`; todo el codigo del framework esta en `src/`.
- Un test por archivo; el archivo se llama igual que el titulo: `TC<n>_web_<nombre>`, `TC<n>_web_e2e_<nombre>` o `TC<n>_api_<nombre>`. Numeracion desde TC01 sin huecos, separada por suite.
- Una Page por pantalla en `src/pages/`; los specs no llevan locators, `goto` ni funciones auxiliares.
- La preparacion de escenarios va en fixtures (`src/fixtures/`), los datos en `src/data/`.
- Valida con `npm run typecheck` y `npm run lint:arch`. No ejecutes Playwright salvo que el usuario lo pida.
- Si anades, borras o renombras un archivo de `src/`, actualiza `docs/COMPONENT_INVENTORY.md`.
- No hagas commit ni push automaticamente.
