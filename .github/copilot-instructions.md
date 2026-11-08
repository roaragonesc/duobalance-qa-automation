# Instrucciones para Copilot en este repositorio

Este repositorio es el framework de automatizacion Playwright + TypeScript que prueba la demo publicada de DuoBalance. Para cualquier tarea de pruebas usa el agente **Playwright SDET** (`.github/agents/playwright-sdet.agent.md`) y sigue su flujo.

Orden de lectura antes de cambiar nada:

1. `docs/AI_AGENT_WORKFLOW.md`: flujo (entender, planificar, implementar, verificar, sanar, reportar).
2. `docs/COMPONENT_INVENTORY.md`: Pages, componentes, fixtures, datos y utilidades existentes.
3. `README.md`: entorno, comandos, decisiones y alcance.

Reglas imprescindibles:

- `tests/` solo contiene suites (`web/`, `api/`); todo el codigo del framework esta en `src/`.
- Un test por archivo; archivo y titulo siguen `TC<n>_<suite>_<nombre>`. Numeracion desde TC01 sin huecos por suite.
- Una Page por pantalla en `src/pages/`; los specs no llevan locators, `goto` ni funciones auxiliares.
- La preparacion de escenarios va en fixtures (`src/fixtures/`), los datos en `src/data/`.
- Cada spec importa y consume su JSON homonimo en `src/data/testData/web/` o `api/`, con `setup`, `inputs`
  y `expected`. Usa `defineCaseData` y `test.use({ caseData: data.setup })`: fixtures y test leen la misma
  fuente, sin datos/asserts de negocio hardcodeados ni JSON decorativos. Mantiene pasos numerados y
  comprobacion de identidad antes de las acciones por persona; los specs web no llevan logica.
- Renombrar/renumerar implica titulo, spec, JSON, import e inventario. `lint:arch` comprueba los pares,
  consumo AST, JSON huerfanos y todos los archivos de datos. Uniones tipadas con guards, sin `as any`
  ni dobles casts `as unknown`; protocolos/selectores son del framework y tokens/IDs/fechas/URLs son runtime.
- Valida con `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`. No ejecutes Playwright salvo que el usuario lo pida.
- Si anades, borras o renombras un archivo de `src/`, actualiza `docs/COMPONENT_INVENTORY.md`.
- No hagas commit ni push automaticamente salvo peticion expresa.
