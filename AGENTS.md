# AGENTS.md

Punto de entrada para trabajar con agentes de IA en DuoBalance QA Automation. El framework utiliza Playwright y TypeScript para comprobar la demo publicada de DuoBalance.

- Agente principal: **Playwright SDET** (`.github/agents/playwright-sdet.agent.md`).
- Procedimiento de trabajo: `docs/AI_AGENT_WORKFLOW.md`.
- Referencia de los elementos disponibles: `docs/COMPONENT_INVENTORY.md`.
- Uso del proyecto, decisiones y cobertura: `README.md`.
- Instrucciones aplicables a Copilot: `.github/copilot-instructions.md`.

El codigo reutilizable se aloja en `src/` (pages, components, fixtures, data, config, utils). `tests/` queda reservado a las suites `web/` y `api/`. Comprueba los cambios con `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`. La ejecucion de Playwright requiere una peticion expresa.

El JSON de cada caso es `src/data/testData/<suite>/<titulo>.json` y tiene el mismo basename que su spec.
Sus entradas y resultados esperados de negocio deben consumirse desde el JSON, no escribirse como literales en el spec.
`defineCaseData` valida las unions; `test.use({ caseData: data.setup })` proporciona a las fixtures los mismos datos
que utiliza el recorrido. Conserva las aserciones, los skips y los pasos numerados. Comprueba la identidad de cada
persona antes de sus acciones y manten los specs web sin logica auxiliar.
Cuando cambie el nombre o numero de un caso, actualiza conjuntamente spec, JSON, import e inventario.
Cada JSON debe tener un consumidor real: no se admiten archivos decorativos ni huerfanos.
Las claves tecnicas y los valores obtenidos en runtime permanecen en la capa responsable; no los sustituyas por valores fijos.
