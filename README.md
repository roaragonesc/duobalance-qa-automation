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
  data/         datos ficticios (usuarios, gastos)
  config/       entorno tipado y validado
  utils/        utilidades pequenas y checkArchitecture (lint:arch)
tests/
  web/          TC<n>_web_<nombre>.spec.ts
docs/           guia de agentes e inventario de componentes
```

Flujo de dependencias permitido: `spec -> fixtures -> pages -> components / utils / config / data`. Un spec solo
cuenta el escenario y sus expectativas; nunca contiene locators.

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

### Buenas practicas

**Organizacion**

- Define primero el proposito y los limites: que se prueba (UI, API), en que entornos, con que datos y que evidencias
  necesita quien diagnostica un fallo. Empieza pequeno y anade una capa solo cuando haya una necesidad real.
- Separa responsabilidades: el spec cuenta el escenario y sus expectativas; la Page ofrece operaciones de una
  pantalla; el Block encapsula una seccion reutilizable; la fixture prepara dependencias; los datos describen entradas.
- Un solo propietario por locator y comportamiento. Selectores iguales no demuestran el mismo contrato: verifica
  propietario, comportamiento y consumidores antes de reutilizar.
- Composicion antes que herencia. `BasePage` solo contiene lo realmente comun; nada especifico de una pantalla.
- `tests/` solo contiene suites (`web/` y `api/`); todo el codigo del framework vive en `src/`.

**Page Objects**

- Una Page por pantalla de la aplicacion; una pestana nueva implica una Page nueva.
- Los metodos expresan intencion de usuario (`addExpense`, `signOut`), no mecanica (`clickBlueButton`).
- Locators estables como campos `readonly` del constructor; los dinamicos (filas, enlaces por texto) son metodos con
  parametros. Las filas y tarjetas se identifican por su contenido, nunca por posicion.
- Prioridad de locators: `getByRole`, `getByLabel`, `getByPlaceholder`, texto visible estable y, si se acuerda con
  desarrollo, `data-testid`. Sin XPath, CSS fragil ni indices DOM.
- Las expectativas de negocio viven en el spec; la Page solo ofrece `expectOpen()` como comprobacion de navegacion.
- Los specs no contienen locators, `goto` ni funciones auxiliares; la logica de UI va en la Page o el componente.

**Fixtures y datos**

- Cada test recibe lo que necesita por fixture y arranca aislado: funciona en cualquier orden y en paralelo.
- La preparacion repetida se extrae a una fixture encadenada y explicita; no oculta pasos criticos del escenario.
- Datos ficticios centralizados en `src/data/`. Nunca credenciales, tokens ni URLs fijas en specs o Pages; los secretos
  van en el mecanismo seguro de CI. La configuracion por entorno vive en un solo sitio y se valida al arrancar.

**Escribir tests**

- Un escenario por test, un test por archivo, archivo con el mismo nombre que el titulo y numeracion `TC01...` sin
  saltos, independiente por suite. Al borrar o insertar se renumera.
- Nombre que comunica el proposito. Todo test se divide en pasos numerados (`test.step('1. El usuario anade un gasto', ...)`):
  cada paso es una accion con sus `expect` dentro y el nombre sigue `N. Sujeto + accion`, con numeracion consecutiva desde 1.
  Los recorridos completos (por ejemplo TC15, Rocio y Pablo en un unico navegador con el panel mock) se prefieren a varios
  tests que repiten los mismos pasos iniciales, pero nunca se agrupan escenarios de negocio distintos.
- Sin logica en los specs (ni `for`, `while`, `if`, `switch`, `try`, ternarios, `Promise.all` o `.forEach`): los
  specs se leen de arriba abajo y la logica va a Pages o fixtures. En tests con dos personas, cada una empieza con un
  paso que abre su perfil y comprueba que es ella (`ProfilePage.nameHeading` y `emailText`); primero actua Ana con todo
  lo suyo y despues Luis (o Rocio y Pablo alternando con el panel mock), repitiendo el codigo en vez de usar bucles.
- Nunca se elimina ni se debilita una asercion para hacer pasar un test.
- Los tests no se borran porque no se puedan ejecutar: se conservan con `// Requiere API real: ...` y `test.skip`.
  Un omitido nunca cuenta como aprobado y siempre lleva motivo.
- No se usa `test.only`, `test.fixme` ni `test.skip` para esconder defectos.

**Esperas y estabilidad**

- Sincroniza con condiciones, no con pausas: aserciones web-first (`toBeVisible`, `toHaveURL`, `toHaveText`...).
- Sin `waitForTimeout`, `networkidle` como espera generica, `force: true` ni acceso directo al DOM.
- Si una accion depende de una respuesta concreta, se prepara la espera antes de lanzarla.
- Un test intermitente es un defecto: se investiga la causa. Sin reintentos globales ni `continue-on-error`.

**Diagnostico y reportes**

- Informe HTML y JUnit; screenshot y trace solo en fallos, sin datos sensibles.
- Resultados clasificados en aprobado, fallido, omitido con motivo y no ejecutado.
- Ante un fallo se clasifica primero la causa (producto, test, Page, datos, entorno) antes de tocar nada.

**Calidad y CI**

- Los mismos controles en local y en CI: `typecheck`, `lint`, `format:check` y `lint:arch`.
- Las reglas de arquitectura las comprueba una maquina (`lint:arch`), no la memoria de quien revisa.
- Pipeline separada: calidad y tests en push/PR; ejecucion nocturna independiente sobre la demo.
- Permisos de solo lectura en los workflows y artefactos con retencion limitada.
- Revisa periodicamente si cada abstraccion simplifica el mantenimiento: un buen framework no se mide por carpetas o
  clases, sino porque los tests expresan intencion, la UI tiene propietarios claros y los fallos se diagnostican rapido.

**Trabajo con agentes de IA**

- El agente `QA Web Playwright` sigue el flujo de `docs/AI_AGENT_WORKFLOW.md`: entender, planificar, implementar,
  verificar, sanar y reportar.
- Antes de crear nada consulta `docs/COMPONENT_INVENTORY.md`; si cambia algo en `src/`, lo actualiza (lo exige `lint:arch`).
- No ejecuta suites de Playwright salvo peticion expresa; verifica con `typecheck`, `lint`, `format:check` y `lint:arch`.
- Sin commit ni push automaticos salvo peticion expresa.
### Mantenimiento

| Quiero...                          | Pasos                                                                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Anadir un test                     | Crea la Page/fixture que falte, anade el spec con el siguiente `TC<n>` libre (archivo = titulo) y ejecuta `typecheck`, `lint` y `lint:arch` |
| Insertar un test en medio          | Renumera los siguientes (titulo + archivo); `lint:arch` avisa de huecos o repetidos                                                    |
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
