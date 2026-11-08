# DuoBalance QA Automation

[![DuoBalance QA](https://github.com/roaragonesc/duobalance-qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/roaragonesc/duobalance-qa-automation/actions/workflows/playwright.yml)

Framework Playwright + TypeScript que prueba la demo publicada de DuoBalance
(<https://roaragonesc.github.io/duobalance/>): una app de gastos compartidos en pareja.
No arranca React, Vite ni ningun backend: solo ejecuta navegador contra la URL publicada.

## Ejecutar

Requiere Node.js 24 LTS.

```powershell
npm ci
npx playwright install chromium
npm run typecheck
npm run lint
npm run format:check
npm run lint:arch
npx playwright test
npm run report
```

`BASE_URL` permite cambiar el frontend (por defecto la demo en GitHub Pages). Se normaliza la barra final y las
rutas usan `./#/login`, etc., para conservar el subdirectorio `/duobalance/` y el hash router.

```powershell
$env:BASE_URL = 'https://roaragonesc.github.io/duobalance/'
npx playwright test
```

Las variables se leen del entorno; **no se carga `.env` automaticamente**. [.env.example](.env.example) es una
referencia sin secretos.

| Comando                | Para que                                                      |
| ---------------------- | ------------------------------------------------------------- |
| `npm run test:web`     | Ejecuta la suite web contra la demo (chromium)                |
| `npm run test:api`     | Proyecto API: todos omitidos con motivo (sin backend)         |
| `npm run test:list`    | Lista los tests sin ejecutarlos                               |
| `npm run typecheck`    | Tipos TypeScript                                              |
| `npm run lint`         | ESLint (TypeScript + reglas de Playwright)                    |
| `npm run format:check` | Prettier (`npm run format` aplica el formato)                 |
| `npm run lint:arch`    | Arquitectura, nombres, numeracion e inventario de componentes |
| `npm run report`       | Abre el informe HTML de la ultima ejecucion                   |

## Como esta construido el framework y por que

### Objetivo

Mostrar un framework de automatizacion que una empresa pueda mantener y ampliar: Page Objects por pantalla,
escenarios preparados por fixtures, reglas de arquitectura comprobadas por maquina y diagnostico claro de fallos.

### Estructura

```text
src/
  pages/        una Page Object por pantalla de la aplicacion
  components/   Blocks reutilizables (navegacion lateral, panel mock)
  fixtures/     Pages por fixture + preparacion de escenarios
  data/         catalogos ficticios y JSON propios de cada caso
    testData/
      web/      TC<n>_web_<nombre>.json (41 casos)
      api/      TC<n>_api_<nombre>.json (60 casos)
  config/       entorno tipado y validado
  utils/        utilidades pequenas y checkArchitecture (lint:arch)
tests/
  web/          TC<n>_web_<nombre>.spec.ts
  api/          TC<n>_api_<nombre>.spec.ts
docs/           guia de agentes e inventario de componentes
```

Las dependencias siguen `spec -> fixtures -> pages -> components / utils / config / data`.
El spec describe el escenario y decide sus resultados esperados, sin definir locators.

### Decisiones y motivos

| Decision                                                                           | Por que                                                                                      | Coste asumido                                           |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Framework en `src/`, `tests/` solo con suites                                      | Separa lo que se prueba de como se prueba; cualquiera localiza una pieza en segundos          | Rutas relativas `../../src/...` en los specs            |
| Una Page Object por pantalla (`/expenses` -> `ExpensesPage`)                       | Un unico propietario por locator: si cambia la UI se corrige en un archivo                   | Mas archivos pequenos                                   |
| Locators como campos `readonly` del constructor; sin expectativas de negocio       | La Page describe como usar la pantalla; el spec decide que es correcto                       | El spec escribe sus `expect`                            |
| `BasePage` minima y composicion con componentes                                    | Evita jerarquias profundas y "cajones" de metodos                                            | Algo de repeticion deliberada                           |
| Preparacion de escenarios en fixtures (`demoMember`, `signedInAna`, `spaceOwner`...) | Cada test arranca aislado y no repite el setup; el orden de ejecucion no importa             | Hay que leer la cadena de fixtures para conocer el estado |
| Un test por archivo; archivo = titulo del test                                     | Fallos localizables por nombre, ejecucion paralela segura, diffs pequenos                    | Numeracion estricta (ver mantenimiento)                 |
| Bloqueos como `skipped` con motivo y comentario, nunca como aprobados              | El informe no miente: se ve que no se puede probar y por que                                 | 26 tests en espera de una API real compartida           |
| Sin reintentos ni `continue-on-error`                                              | Un test intermitente es un defecto a corregir, no a esconder                                 | Mas exigencia en la sincronizacion                      |
| ESLint + Prettier + `lint:arch` en CI                                              | Estilo y arquitectura los comprueba una maquina, no la memoria de quien revisa               | Mantener la configuracion                               |
| Inventario (`docs/COMPONENT_INVENTORY.md`) y agente de IA con flujo documentado    | Una persona nueva o un agente encuentra lo existente antes de crear algo duplicado           | El inventario hay que mantenerlo (lo exige `lint:arch`) |

### Reglas que se hacen cumplir automaticamente

- `npm run lint`: ESLint con `typescript-eslint` y `eslint-plugin-playwright` (sin variables sin usar, aserciones
  presentes, sin esperas fijas...).
- `npm run format:check`: Prettier (sin punto y coma, comillas simples, 120 columnas).
- `npm run lint:arch`: `tests/` solo con `web/` y `api/`; un test por spec; todo test con pasos `test.step('N. ...')`; specs web sin logica
  numerados desde 1; archivo con el mismo nombre
  que el titulo; formato `TC<n>_web_<nombre>` o `TC<n>_api_<nombre>` con numeracion desde TC01 sin huecos por suite; sin locators ni `goto` en specs;
  las Pages no importan fixtures; sin `waitForTimeout`, `networkidle`, `force: true`, `test.only` ni `test.fixme`;
  `test.skip` solo como bloqueo de capacidad con comentario `// Requiere API real: ...`; todo archivo de `src/`
  figura en el inventario.
- Cada spec importa y consume su JSON homonimo en `src/data/testData/<suite>/`, sin JSON huerfanos
  ni datos/asserts de negocio literales. El analisis AST distingue imports, claves, strings, opciones y ternarios;
  todos los archivos de datos, no solo TypeScript, deben estar inventariados.

### Buenas practicas

**Organizacion**

- Delimita la cobertura UI/API, el entorno, los datos y la evidencia necesaria para investigar un fallo.
  Parte de una solucion pequena y anade capas solo cuando resuelvan una necesidad real.
- En DuoBalance, el spec declara escenario y expectativas; la Page opera una pantalla; el Block agrupa una
  seccion reutilizable; la fixture proporciona dependencias; los datos contienen las entradas.
- Cada locator y comportamiento tiene un propietario. Antes de reutilizarlo, verifica ese propietario, su
  comportamiento y sus consumidores. Un selector coincidente no demuestra que el contrato sea el mismo.
- Utiliza composicion antes que herencia. `BasePage` queda limitado a lo comun, sin operaciones de una pantalla.
- Aloja el framework en `src/` y reserva `tests/` a las suites `web/` y `api/`.

**Page Objects**

- Cada pantalla o pestana necesita su propia Page.
- Los metodos describen lo que quiere hacer el usuario (`addExpense`, `signOut`), no el control que pulsa (`clickBlueButton`).
- Asigna los locators estables a campos `readonly` en el constructor. Ofrece filas y enlaces por texto mediante
  metodos parametrizados; identifica filas y tarjetas por contenido, nunca por posicion.
- Selecciona por `getByRole`, `getByLabel`, `getByPlaceholder`, texto visible estable y despues `data-testid`
  acordado con desarrollo. Evita XPath, CSS fragil e indices DOM.
- La Page solo comprueba su navegacion con `expectOpen()`. Los resultados de negocio se comprueban en el spec.
- La interaccion de UI se implementa en Pages o componentes, no en locators, `goto` o funciones auxiliares del spec.

**Fixtures y datos**

- Entrega las dependencias por fixture y aisla cada test para que funcione en cualquier orden y en paralelo.
- Agrupa el setup repetido en una fixture con dependencias explicitas. No ocultes acciones criticas del escenario.
- Cada caso obtiene datos y resultados esperados de su JSON, segun el contrato siguiente.
  No incrustes credenciales, tokens ni URLs fijas en specs o Pages. Usa el mecanismo seguro de CI para secretos;
  centraliza la configuracion de entorno y validala al iniciar.

### Datos JSON por test

Hay **101 pares spec + JSON**: 41 web y 60 API, incluidos los casos bloqueados. El basename del JSON coincide
exactamente con el titulo y el spec, por ejemplo:

```text
tests/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.spec.ts
src/data/testData/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.json
```

Los tres objetos del JSON cumplen responsabilidades distintas:

- `setup` proporciona usuarios, gastos y espacios a la preparacion y/o al recorrido.
  `test.use` entrega `data.setup` a la option tipada `caseData`; las fixtures no deben preparar nombres o
  importes de otro catalogo. Para API, tambien contiene los status HTTP esperados al preparar el caso.
- `inputs` recoge las entradas de las acciones: contrasenas ficticias, importes nuevos, conceptos, categorias,
  tipos, destinatarios, parametros y, cuando corresponda, opciones del dispositivo.
- `expected` define mensajes, importes/saldos, cantidades, status HTTP, valores de respuesta y patrones.
  Conserva todas las aserciones: modificar datos no permite hacer menos exigente el resultado esperado.

Carga el import por defecto del JSON con `defineCaseData`, definido en `src/utils/caseData.ts`.
`resolveJsonModule` mantiene la forma inferida; el guard comprueba y acota las unions `demoUser`, `expenseType`,
`section`, `splitMethod` y `kind`, sin `as any` ni dobles casts `as unknown`.
`WebSetup` y `ApiSetup` tipan la option de fixtures. `requiredData` informa con la ruta JSON cuando falta una
precondicion. Los catalogos `.ts` se mantienen por referencia y compatibilidad, pero no suministran los datos
de los specs migrados.

**Valores tecnicos y dinamicos que no se trasladan como datos fijos:**

- Titulos, pasos numerados y motivos de `skip` se mantienen como literales.
- Rutas relativas/hash, endpoints, claves de respuesta/cabeceras/atributos, teclas, opciones Mongo,
  encoding y paths de modulos son parte del contrato del framework.
- Obten tokens, CSRF, IDs, enlaces recibidos, fechas/mes actual y URLs de entorno en runtime.
  Cada cuenta API deriva un email unico con UUID desde el email ficticio del JSON y lo compara con el realmente
  preparado. La conexion Mongo toma `mongoURL` de configuracion.
- Los matchers estructurales (`expect.any(String)`, visibilidad, foco y ausencia de propiedades secretas)
  no fijan un resultado de negocio. `expected` conserva los patrones de tokens/hashes ya comprobados;
  los de router, inspeccion OpenAPI y guardias de entorno permanecen como contratos tecnicos.
- Reinicia el seed demo mediante la UI y comprueba identidad y balance con expected JSON.
  No ajustes la aplicacion para obtener un aprobado ni simules sincronizacion de servidor.

**Escribir tests**

- Define un escenario por test y un test por archivo. Archivo y titulo coinciden; cada suite mantiene su
  numeracion `TC01...` sin saltos. Renumera al borrar o insertar.
- El nombre identifica el proposito. Organiza todo test con `test.step('1. El usuario anade un gasto', ...)`:
  una accion y sus `expect` por paso, nombres `N. Sujeto + accion` y numeros consecutivos desde 1.
  Prioriza recorridos completos, como TC15 con Rocio y Pablo en un navegador y el panel mock, frente a repetir
  inicios en varios tests. No mezcles escenarios de negocio distintos.
- Presenta acciones explicitas en los specs, sin `for`, `while`, `if`, `switch`, `try`, ternarios,
  `Promise.all` ni `.forEach`. La logica corresponde a Pages o fixtures.
  Cada persona empieza abriendo su perfil y comprobando `ProfilePage.nameHeading` y `emailText`.
  Completa primero el bloque de Ana y despues el de Luis; Rocio y Pablo pueden alternar con el panel mock.
  Expresa cada bloque sin bucles, aunque requiera repetir codigo.
- No elimines ni hagas menos exigentes las aserciones para conseguir un aprobado.
- La falta de capacidad para ejecutar un caso no justifica borrarlo. Conserva `// Requiere API real: ...`
  y `test.skip` con motivo. Un caso omitido no se contabiliza como aprobado.
- `test.only`, `test.fixme` y `test.skip` no son soluciones para ocultar defectos.

**Esperas y estabilidad**

- Espera estados observables mediante aserciones web-first (`toBeVisible`, `toHaveURL`, `toHaveText`...).
- Excluye `waitForTimeout`, `networkidle` como espera generica, `force: true` y acceso directo al DOM.
- Cuando la accion dependa de una respuesta concreta, establece su espera antes de ejecutarla.
- Investiga la causa de los fallos intermitentes. No uses reintentos globales ni `continue-on-error`.

**Diagnostico y reportes**

- Conserva informes HTML y JUnit, con screenshot y trace solo en fallos y sin datos sensibles.
- Diferencia aprobado, fallido, omitido con motivo y no ejecutado.
- Antes de corregir, determina si el origen es producto, test, Page, datos o entorno.

**Calidad y CI**

- Aplica `typecheck`, `lint`, `format:check` y `lint:arch` tanto en local como en CI.
- Usa `lint:arch` para comprobar las reglas de arquitectura, ademas de su revision documental.
- Manten separados calidad/tests en push/PR y la ejecucion nocturna sobre la demo.
- Los workflows utilizan permisos de solo lectura y retencion limitada de artefactos.
- Evalua las abstracciones por su utilidad para DuoBalance: tests que explican intencion, UI con propietarios
  identificados y fallos faciles de investigar. El numero de carpetas o clases no acredita mantenibilidad.

**Trabajo con agentes de IA**

- `Playwright SDET` (`.github/agents/playwright-sdet.agent.md`) aplica el procedimiento de `docs/AI_AGENT_WORKFLOW.md`:
  Entender → Planificar → Implementar → Verificar → Corregir → Reportar.
- Consulta `docs/COMPONENT_INVENTORY.md` antes de crear piezas y lo actualiza si cambia `src/`, como exige `lint:arch`.
- Comprueba `typecheck`, `lint`, `format:check` y `lint:arch`; no ejecuta suites de Playwright sin peticion expresa.
- Commit y push tambien requieren peticion expresa.
### Mantenimiento

| Quiero...                          | Pasos                                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Anadir un test                     | Crea la Page/fixture que falte, crea su JSON en `src/data/testData/<suite>/`, importa/consume entradas y expected, pasa `data.setup` a `caseData`, registra el JSON en el inventario y ejecuta los cuatro checks |
| Insertar o renombrar un test        | Renumera/renombra titulo, spec y JSON como un par; actualiza el import y el inventario. `lint:arch` detecta huecos, repetidos, JSON faltantes/huerfanos o decorativos |
| Anadir una pantalla                | Crea `src/pages/<Nombre>Page.ts` extendiendo `BasePage`, registrala como fixture en `src/fixtures/index.ts` y anadela al inventario   |
| Cambia un selector o texto de la UI | Corrigelo solo en la Page o componente propietario, nunca en el spec; comprueba el spec afectado y los que usan esa Page              |
| Un test falla                      | Clasifica la causa (producto, test, Page, datos, entorno) antes de tocar nada; no se debilita la asercion ni se usa `skip` para aprobar |
| Cambiar de entorno                 | `BASE_URL` (se valida al arrancar)                                                                                                     |
| Actualizar dependencias            | Sube `@playwright/test` y reinstala navegadores (`npx playwright install chromium`); despues `typecheck`, `lint`, `format:check`, `lint:arch` y una pasada de tests |

El flujo completo para personas y agentes esta en [docs/AI_AGENT_WORKFLOW.md](docs/AI_AGENT_WORKFLOW.md). Los agentes
cargan ademas `AGENTS.md` y `.github/copilot-instructions.md`.

## Alcance y cobertura

La web publicada muestra el panel **Modo mock de desarrollo** y el aviso **No se sincroniza entre dispositivos**. El
build de Pages usa hash router y servicios demo; no contiene un backend REST. Las guardias de red solo permiten
recursos del origen configurado y bloquean fetch/XHR, Supabase y rutas API/mock.

- Login, registro, confirmacion y recuperacion son simulaciones locales: no se envian correos ni se verifica
  autenticacion real de servidor.
- Los datos se guardan en `localStorage` del contexto del navegador; persisten tras recargar, no entre navegadores.
- Cada prueba tiene almacenamiento independiente y reinicia sus datos por la UI. No se manipula `localStorage` desde
  los tests. Solo se usan cuentas ficticias.

La suite web tiene **41 tests** (`tests/web/TC01...TC41`) y la de API **60** (`tests/api/TC01...TC60`):

Cada uno conserva su JSON propio, datos consumidos, pasos e identidades; migrar los datos no activa skips
ni cambia la capacidad real de la demo. La validacion de esta estructura es estatica y no ejecuta Playwright.

| Estado                | Tests | Contenido                                                                                                                              |
| --------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Se ejecutan           | 15    | Recorridos largos con `test.step`: acceso protegido, login, registro, recuperacion, onboarding hasta la invitacion, gastos y balances exactos sobre el seed de demo, panel mock, demo movil y Rocio con Pablo |
| Omitidos con motivo (web) | 26 | Escenarios de dos cuentas: requieren API real y datos compartidos entre sesiones; no se pueden probar en modo mock |
| Omitidos con motivo (API) | 60 | Suite REST completa: necesita un backend aislado, que queda fuera de este repositorio |

Los omitidos conservan su codigo y llevan `// Requiere API real: ...` + `test.skip(true, '...')`. Los balances de
los tests sobre el seed son expectativas fijas (por ejemplo 705,80 EUR compartidos; un gasto de 80,00 produce 785,80
EUR y una deuda de 314,20 EUR), no valores calculados a partir de la respuesta observada.

## GitHub Actions

Dos workflows independientes:

- [Calidad y tests](.github/workflows/playwright.yml): push a `main`, pull requests y ejecucion manual. Job `quality`
  (`typecheck`, `lint`, `format:check`, `lint:arch`) y job `ui` (Chromium contra `vars.BASE_URL`, por defecto Pages).
- [Nightly](.github/workflows/nightly.yml): **todos los dias a las 03:00 Europe/Madrid** (y a mano). Ejecuta
  `--project=chromium`, es decir, los tests web que dependen solo de la demo publicada; los que requieren API real
  estan omitidos con motivo y no forman parte de esta ejecucion. Usa dos candidatos UTC (01:00 y 02:00) y un filtro de
  hora local para respetar el cambio de horario. GitHub puede retrasar o descartar ejecuciones programadas y solo las
  lanza desde la rama predeterminada.
- Informe HTML, screenshots y traces en fallos como artifact durante 14 dias. Sin reintentos ni `continue-on-error`;
  permisos de solo lectura y sin credenciales.
## Limitaciones conocidas

- La demo de Pages no comparte datos entre navegadores: los 26 tests de dos cuentas quedan omitidos. Para ejecutarlos
  haria falta una API real con datos compartidos, que queda fuera de este repositorio.
- No hay `src/services/` ni suite de API: este repositorio se centra en la UI publicada.
