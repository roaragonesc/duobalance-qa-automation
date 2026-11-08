# Copilot en DuoBalance QA Automation

Las tareas de pruebas de este framework Playwright + TypeScript se realizan con **Playwright SDET** (`.github/agents/playwright-sdet.agent.md`). Utiliza su procedimiento para trabajar sobre la demo publicada de DuoBalance.

Antes de editar, consulta estas referencias en este orden:

1. `docs/AI_AGENT_WORKFLOW.md`: Entender → Planificar → Implementar → Verificar → Corregir → Reportar.
2. `docs/COMPONENT_INVENTORY.md`: Pages, componentes, fixtures, datos y utilidades que puedes reutilizar.
3. `README.md`: ejecucion, entorno, decisiones y alcance de la cobertura.

Obligaciones que deben conservarse en cada cambio:

- Reserva `tests/` a `web/` y `api/`. El codigo del framework pertenece a `src/`.
- Define un test por archivo, con titulo y nombre de archivo `TC<n>_<suite>_<nombre>`. Cada suite mantiene su propia secuencia desde TC01, sin huecos.
- Cada pantalla tiene su Page en `src/pages/`. El spec no define locators, llamadas a `goto` ni funciones auxiliares.
- Prepara los escenarios en `src/fixtures/` y almacena los datos en `src/data/`.
- Importa y utiliza el JSON homonimo de cada spec, situado en `src/data/testData/web/` o `api/`. Sus objetos
  son `setup`, `inputs` y `expected`. Cargalo con `defineCaseData` y entrega la preparacion mediante
  `test.use({ caseData: data.setup })`; fixtures y test deben compartir esta fuente. No escribas datos ni
  aserciones de negocio con valores hardcodeados, ni anadas JSON sin uso. Conserva pasos numerados y
  comprueba la identidad antes de las acciones de cada persona. Los specs web no contienen logica auxiliar.
- Un cambio de nombre o numero afecta a titulo, spec, JSON, import e inventario. `lint:arch` verifica
  la correspondencia, el consumo mediante AST, los JSON huerfanos y el inventario de todos los archivos de datos.
  Valida las unions con guards, sin `as any` ni dobles casts `as unknown`. Protocolos y selectores son contratos
  del framework; tokens, IDs, fechas y URLs se obtienen en runtime.
- Ejecuta `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch` para validar. No ejecutes Playwright sin peticion del usuario.
- Refleja en `docs/COMPONENT_INVENTORY.md` cualquier alta, baja o cambio de nombre de un archivo de `src/`.
- Commit y push requieren una peticion expresa; no los realices automaticamente.
