# Instrucciones para Copilot en este repositorio

Este repositorio es el framework de automatizacion Playwright + TypeScript que prueba la demo publicada de DuoBalance. Para cualquier tarea de pruebas usa el agente **QA Web Playwright** (`.github/agents/qa-web-playwright.agent.md`) y sigue su flujo.

Orden de lectura antes de cambiar nada:

1. `docs/AI_AGENT_WORKFLOW.md`: flujo (entender, planificar, implementar, verificar, sanar, reportar).
2. `docs/COMPONENT_INVENTORY.md`: Pages, componentes, fixtures, datos y utilidades existentes.
3. `README.md`: entorno, comandos, decisiones y alcance.

Reglas imprescindibles:

- `tests/` solo contiene suites (hoy `web/`); todo el codigo del framework esta en `src/`.
- Un test por archivo; el archivo se llama igual que el titulo: `TC<n>_web_<nombre>`. Numeracion desde TC01 sin huecos.
- Una Page por pantalla en `src/pages/`; los specs no llevan locators, `goto` ni funciones auxiliares.
- La preparacion de escenarios va en fixtures (`src/fixtures/`), los datos en `src/data/`.
- Valida con `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`. No ejecutes Playwright salvo que el usuario lo pida.
- Si anades, borras o renombras un archivo de `src/`, actualiza `docs/COMPONENT_INVENTORY.md`.
- No hagas commit ni push automaticamente salvo peticion expresa.
