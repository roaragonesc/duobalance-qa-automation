# DuoBalance QA Automation

Framework independiente Playwright + TypeScript contra
<https://roaragonesc.github.io/duobalance/>.
El modo Pages no arranca React, Vite, Node backend ni MongoDB.
Los modos locales API y web conectado a API son independientes y si arrancan
servicios aislados; no necesitan un backend publico.

## Ejecutar

Requiere Node.js 24 LTS.

```powershell
npm ci
npx playwright install chromium
npm run typecheck
npx playwright test --list
npx playwright test --project=chromium
npm run report
```

`BASE_URL` permite cambiar el frontend. Se normaliza la barra final; las rutas
usan `./#/login`, etc., para conservar `/duobalance/`. La prueba TC05 verifica
HTTP 200, URL completa (origen, subdirectorio y hash) y navegacion al registro.

```powershell
$env:BASE_URL = 'https://roaragonesc.github.io/duobalance/'
npm run test:ui
```

Las variables se leen del entorno, **no se carga `.env` automaticamente**.
[.env.example](.env.example) es una referencia, no contiene secretos.

## Como esta construido el framework y por que

### Objetivo

Demostrar un framework de automatizacion que una empresa pueda mantener y
ampliar: UI, API REST y e2e con dos usuarios reales, con reglas
de arquitectura comprobadas por maquina y diagnostico claro de fallos. Prueba
tres entornos, cada uno con su configuracion, informe y pipeline:

| Modo | Contra que corre | Comando | Por que existe |
| --- | --- | --- | --- |
| Pages (`chromium`) | Demo publicada en GitHub Pages (mock, solo frontend) | `npm run test:ui` | Rapido y sin infraestructura; valida UI y flujos de una cuenta |
| API local | Backend real con MongoDB efimero | `npm run test:api:local` | Valida REST, permisos y seed sin tocar datos ajenos |
| Web e2e local | Frontend + backend aislados, dos navegadores independientes | `npm run test:e2e:local` | Unico modo donde se puede probar de verdad "dos usuarios comparten datos" |

### Estructura

```text
src/
  pages/        una Page Object por pantalla de la aplicacion
  components/   Blocks reutilizables (navegacion lateral, panel mock)
  fixtures/     Pages por fixture + preparacion de escenarios
  data/         datos ficticios (usuarios, gastos)
  config/       entorno tipado y validado
  integration/  arranque/teardown de backend y frontend locales
  utils/        utilidades pequenas y checkArchitecture (lint:arch)
tests/
  web/          TC<n>_web_<nombre>.spec.ts  (+ TC<n>_web_e2e_ para API real)
  api/          TC<n>_api_<nombre>.spec.ts
docs/           guia de agentes e inventario de componentes
```

Flujo de dependencias permitido: `spec -> fixtures -> pages -> components / utils / config / data`.
Un spec solo cuenta el escenario y sus expectativas; nunca contiene locators.

### Decisiones y motivos

| Decision | Por que | Coste asumido |
| --- | --- | --- |
| Framework en `src/`, `tests/` solo con `web/` y `api/` | Separa lo que se prueba de como se prueba; cualquiera localiza una pieza en segundos | Rutas relativas `../../src/...` en los specs |
| Una Page Object por pantalla (`/expenses` -> `ExpensesPage`) | Un unico propietario por locator: si cambia la UI se corrige en un archivo | Mas archivos pequenos |
| Locators como campos `readonly` del constructor; sin expectativas de negocio en la Page | La Page describe como usar la pantalla; el spec decide que es correcto | El spec debe escribir sus `expect` |
| `BasePage` minima (`visit`, `reload`, `main`, `alert`, `status`, `expectOpen`) y composicion con componentes | Evita jerarquias profundas y "cajones" de metodos | Algo de repeticion deliberada |
| Preparacion de escenarios en fixtures (`couple`, `sharedExpense`, `spaceOwner`...) | Cada test arranca aislado y no repite el setup; el orden de ejecucion no importa | Hay que leer la cadena de fixtures para saber el estado |
| Un test por archivo; archivo = titulo del test | Fallos y resultados localizables por nombre, ejecucion paralela segura, diffs pequenos | Numeracion estricta (ver mantenimiento) |
| Numeracion `TC01...` independiente en web y api | Cada suite se lee de forma autonoma | Insertar un test intermedio implica renumerar |
| Tres configuraciones/jobs independientes | Pages nunca arranca servicios; API no instala Chromium; un fallo de infraestructura no oculta otro | Mas configuracion que un unico `playwright.config.ts` |
| Entorno local aislado (BD aleatoria, MongoDB efimero, puertos fijos, buzon JSON propio, teardown) | Se puede probar de forma destructiva sin riesgo y sin datos compartidos | Primera ejecucion lenta (descarga de MongoDB) |
| Bloqueos como `skipped` con motivo, nunca como aprobados | El informe no miente: se ve que no se puede probar y por que | Hay tests "en espera" de una API real |
| Sin reintentos ni `continue-on-error` | Un test intermitente es un defecto a corregir, no a esconder | Mas exigencia en la sincronizacion |
| `npm run lint:arch` en CI | Las reglas de arquitectura las comprueba una maquina, no la memoria de quien revisa | Hay que mantener el propio script |
| Inventario (`docs/COMPONENT_INVENTORY.md`) + agente de IA con flujo documentado | Un agente (o una persona nueva) encuentra todo lo existente antes de crear algo duplicado | El inventario hay que mantenerlo (lo exige `lint:arch`) |

### Reglas que se hacen cumplir automaticamente (`npm run lint:arch`)

- `tests/` contiene solo `web/` y `api/`; el resto del framework esta en `src/`.
- Un test por spec, archivo con el mismo nombre que el titulo, formato `TC<n>_web_`, `TC<n>_web_e2e_` o `TC<n>_api_`, numeracion sin huecos.
- Sin locators ni `goto` en specs; las Pages no importan fixtures; los specs web no usan fixtures de la API y los specs API no usan Pages.
- Sin `waitForTimeout`, `networkidle`, `force: true`, `test.only` ni `test.fixme`; `test.skip` solo como bloqueo de capacidad con comentario `// Requiere API real: ...`.
- Todo archivo de `src/` figura en `docs/COMPONENT_INVENTORY.md`.

### Mantenimiento

| Quiero... | Pasos |
| --- | --- |
| Anadir un test | Crea la Page/fixture que falte, anade el spec con el siguiente `TC<n>` libre de su suite (archivo = titulo) y ejecuta `npm run typecheck` y `npm run lint:arch` |
| Insertar un test en medio | Renumera los siguientes de esa suite (titulo + archivo); `lint:arch` avisa de huecos o repetidos |
| Anadir una pantalla | Crea `src/pages/<Nombre>Page.ts` extendiendo `BasePage`, registrala como fixture en `src/fixtures/index.ts` y anadela al inventario |
| Cambia un selector o texto de la UI | Corrigelo solo en la Page o componente propietario, nunca en el spec; comprueba el spec afectado y los que usan esa Page |
| Un test falla | Clasifica la causa (producto, test, Page, datos, entorno) antes de tocar nada; no se debilita la asercion ni se usa `skip` para aprobar |
| Cambiar de entorno | `BASE_URL` / `API_BASE_URL` (se validan al arrancar); GitHub Pages se rechaza como API |
| Actualizar dependencias | Sube `@playwright/test` y reinstala navegadores (`npx playwright install chromium`); despues `typecheck`, `lint:arch` y una pasada de `--project=chromium` |
| Revisar la CI | `playwright.yml` (PR, manual y 03:00 Europe/Madrid) y `local-qa.yml` (API y e2e locales); ambos ejecutan `typecheck` y `lint:arch` |

El flujo completo para personas y agentes esta en
[docs/AI_AGENT_WORKFLOW.md](docs/AI_AGENT_WORKFLOW.md).

### Limitaciones conocidas

- La demo de Pages no comparte datos entre navegadores: los tests de dos cuentas
  (34 en web) quedan omitidos con motivo; solo los 6 `web_e2e` los cubren de verdad.
  Migrar el resto a `fixtures/apiWeb.ts` es el siguiente paso natural.
- Hay escenarios casi identicos heredados de la suite original (por ejemplo TC25/TC47
  o TC29/TC51) pendientes de depurar.
- No hay ESLint ni Prettier: las reglas de arquitectura las cubre `lint:arch`, pero
  el estilo de codigo no se comprueba automaticamente.
- Falta `src/services/` para clientes API reutilizables (hoy viven en las fixtures API).
- La pipeline esta revisada pero aun no se ha ejecutado en GitHub Actions.

## Despliegue inspeccionado

La web publicada muestra el panel **Modo mock de desarrollo** y el aviso
**No se sincroniza entre dispositivos**. El build Pages de la aplicacion usa
hash router, servicios demo y `VITE_MOCK_SHARED=0`; no contiene un backend REST.
Las guardias de red solo permiten recursos del origen configurado y bloquean
fetch/XHR, Supabase y rutas API/mock. No se simulan respuestas de exito.

- Login, registro, confirmacion y recuperacion son simulaciones locales:
  no se envian correos ni se verifica autenticacion real de servidor.
- Los datos y movimientos se guardan en localStorage del contexto del navegador.
  Persisten tras recargar el mismo contexto, no tras eliminar su almacenamiento.
- Cambiar la identidad con el panel permite comprobar filtros demo, **no prueba
  autorizacion de servidor ni sincronizacion entre dos BrowserContexts/dispositivos**.
- Cada prueba tiene almacenamiento independiente y reinicia sus datos por la UI.
  No se copia ni modifica localStorage desde las pruebas.
- Solo se usan cuentas y contrasenas ficticias del modo demo.

## Migracion y cobertura

Se copiaron los 23 specs web y los 58 casos API de
`roaragonesc/duobalance`, carpeta `test-framework`, revision
`179466f3a57ac00a6b4c3bdb6dc07a688288241f`, junto con Page Objects,
componentes, fixtures, datos y helpers funcionales. El repositorio original no
se modifica. Se conservan IDs, escenarios y aserciones; solo se adaptan rutas,
esperas al hash y preparacion compatible con el despliegue.

El seed importa modelos y MongoDB del backend original: su spec (TC60) los carga
de forma dinamica, se ejecuta en modo API local y se bloquea
en modo remoto sin cargar modulos del backend.
La version original sin adaptar sigue en el repositorio de la aplicacion
(`test-framework`, revision indicada arriba).
El spec descubrible conserva su ID: se ejecuta en modo API local y se bloquea
en modo remoto sin cargar modulos del backend.
No se migran suites unitarias/component testing/DB que necesitan compilar o
ejecutar la aplicacion, ni launchers de servidores locales.

Cobertura web actual (`tests/web/`, TC01-TC83; numeracion propia de web):

| Casos web | Estado/capacidad |
| --- | --- |
| TC01, TC05-TC07, TC13-TC20, TC40-TC42, TC74-TC83 | Rutas protegidas, URL publicada, login, registro, validaciones, recuperacion y onboarding en un navegador: se ejecutan contra la demo |
| TC02, TC03, TC66-TC73 | Demo movil, confirmacion/recuperacion demo, panel accesible, gastos y balances exactos sobre el seed de demo: se ejecutan |
| TC23, TC25, TC29, TC45, TC47, TC51, TC57, TC62 | Gastos y limite de miembros con una sola cuenta (miembro de demo): se ejecutan |
| TC04, TC08-TC12 (`web_e2e`) | Dos sesiones reales con API real local: `npm run test:e2e:local` |
| Resto de tests de dos cuentas | **Bloqueados en modo mock**: requieren API real y dos sesiones con datos compartidos. Se omiten con motivo y la anotacion `bloqueado`, no se borran |

Los tests de dos cuentas conservan su codigo; solo se activarian con una API
real compartida (fixtures `apiWeb`). TC69 parte del seed de demo: 705,80 EUR
compartidos. Un gasto de 80,00 produce 785,80 EUR, aportacion 392,90 EUR y
deuda acumulada 314,20 EUR; editarlo a 100,00 produce 805,80 EUR y deuda
304,20 EUR (TC70). TC72 comprueba que 35,00 EUR privados no alteran los 705,80 EUR
compartidos ni la deuda inicial de 354,20 EUR. Son expectativas fijas del seed,
no valores calculados a partir de la respuesta observada.

Los bloqueos se muestran como **skipped con motivo**, nunca como aprobados.
No se usa `skip` para ocultar fallos de los escenarios activos.

Cada caso prepara su propia sesion y no depende del resultado ni del estado de
otro test.

## Un archivo por test y un Page Object por pantalla

Cada spec contiene un unico test y **el archivo se llama exactamente como el
titulo del test**: `TC<n>_web_<nombre>.spec.ts`, `TC<n>_web_e2e_<nombre>.spec.ts`
(web contra la API real) y `TC<n>_api_<nombre>.spec.ts`. La numeracion va de
`TC01` sin huecos y es independiente en web (TC01-TC83) y en api (TC01-TC60);
en el titulo y en el archivo se usa el mismo texto.
Los antiguos recorridos con varios `test.step` se dividieron en un archivo por
paso (por ejemplo `TC29_web_crearUnGastoIndividualDesdeLaPrimeraCuenta.spec.ts`).
Cada test prepara por si mismo el estado que antes dejaba el paso anterior.

El framework vive en `src/` y `tests/` contiene solo las suites `web/` y `api/`:

```text
src/
  components/   Blocks reutilizables (AppNavigation, DemoPanel)
  config/       entorno tipado (environment, localEnvironment)
  data/         datos ficticios (usuarios, gastos)
  fixtures/     Pages, escenarios y fixtures API
  integration/  arranque/teardown de backend y frontend locales
  pages/        una Page Object por pantalla
  utils/        utilidades (rutas, red, escenarios, checkArchitecture)
tests/
  api/          specs REST
  web/          specs UI
docs/            guia de agentes e inventario de componentes
```

Cada pantalla de la aplicacion tiene su Page Object en `src/pages`
(locators como campos `readonly` del constructor, operaciones con intencion de
usuario, sin expectativas de negocio). `BasePage` solo aporta lo comun
(`visit`, `reload`, `main`, `alert`, `status`, `expectOpen`):
`LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`,
`OnboardingPage`, `JoinSpacePage`, `DashboardPage`, `ExpensesPage`,
`IncomesPage`, `BalancePage`, `SpacePage` y `ProfilePage`. La navegacion
lateral (`AppNavigation`) y el panel mock (`DemoPanel`) son componentes en
`src/components`. Los specs no contienen locators ni `goto`.

Las fixtures de `src/fixtures/index.ts` exponen las Pages y la preparacion de
escenarios encadenada (`couple`, `sharedExpense`, `privateExpense`,
`sharedAndPrivateExpenses`, `balancedExpenses`, `spaceOwner`, `signedInAna`,
`recoveryRequested`, `demoSharedExpense`...); los datos estan en `src/data`.

`npm run lint:arch` comprueba estas reglas (`tests/` solo con `web` y `api`,
un test por spec, sin locators ni `goto` en specs, sin
`waitForTimeout`/`networkidle`/`force`/`test.only`, sin cruces entre suites y
con el inventario `docs/COMPONENT_INVENTORY.md` al dia) y
se ejecuta en CI junto a `npm run typecheck`. La guia de buenas practicas
completa esta en `.github/agents/qa-web-playwright.agent.md` y el flujo de
trabajo de los agentes en [docs/AI_AGENT_WORKFLOW.md](docs/AI_AGENT_WORKFLOW.md).
Los agentes cargan ademas `AGENTS.md` y `.github/copilot-instructions.md`, que
apuntan al agente, al workflow y al inventario.

## API remota opcional

No se ha identificado un backend publico de testing en el despliegue.
**Nunca configurar GitHub Pages como API_BASE_URL**: la configuracion lo rechaza.

```powershell
$env:API_BASE_URL = 'https://your-testing-backend.example/api/v1/'
npm run test:api
```

Sin `API_BASE_URL`, los 60 tests API se notifican bloqueados antes de enviar
peticiones. Con un backend de testing configurado, se habilitan unicamente
TC01 (health) y TC02 (contrato OpenAPI de 45 operaciones), de solo lectura.
Sus aserciones originales no se relajan.

En modo remoto los otros 58 casos siguen bloqueados: sus fixtures necesitan
correo accesible desde el filesystem del backend, configuracion CORS de testing,
cuentas confirmadas y MongoDB aislado; TC58 requiere ademas codigo backend/seed.
**Desplegar una URL por si solo no cubre estos requisitos**. Antes de habilitarlos,
implementar un adaptador de correo de testing y aprovisionamiento/limpieza
aislados, adaptar las fixtures y verificar que no apuntan a produccion.
Los escenarios destructivos no se activan simplemente por definir API_BASE_URL.
El modo local descrito a continuacion provee la infraestructura aislada y
ejecuta los 60 tests API (los 58 casos originales con TC46 dividido en TC104-TC106), incluido seed.

## API local y web API local: suites separadas

Requieren un checkout de `roaragonesc/duobalance` con las dependencias del backend
instaladas. El modo web necesita ademas las dependencias frontend. No se usa
el antiguo `test-framework` para lanzar servicios ni ejecutar pruebas.

Por defecto se busca el checkout hermano `../duobalance`. Para otra ubicacion:

```powershell
$env:DUOBALANCE_APP_PATH = 'D:\Ro\Music\duobalance'
```

Instala las dependencias una vez en cada checkout (o cuando cambien sus
manifiestos):

```powershell
npm ci
npm --prefix "$env:DUOBALANCE_APP_PATH\backend" ci
# Solo para web API local:
npm --prefix "$env:DUOBALANCE_APP_PATH" ci
npx playwright install chromium
```

| Suite | Comando | Configuracion | Informes |
| --- | --- | --- | --- |
| Web Pages | `npm run test:ui` | `playwright.config.ts`, chromium | `playwright-report/published/`, `test-results/published/junit.xml` |
| API remota, solo lectura | `npm run test:api` | `playwright.config.ts`, api | `playwright-report/published/`, `test-results/published/junit.xml` |
| API local, 60 tests REST/seed | `npm run test:api:local` | `playwright.api-local.config.ts` | `playwright-report/local-api/`, `test-results/local-api/junit.xml` |
| Web con API local | `npm run test:e2e:local` | `playwright.api-e2e.config.ts` | `playwright-report/local-api-e2e/`, `test-results/local-api-e2e/junit.xml` |

`npm run test:api:local` ejecuta cuatro shards secuenciales, cada uno con
backend y base nuevos, para respetar los limites de autenticacion originales;
fusiona HTML/JUnit y falla si falla cualquier shard. No necesita Chromium.
Para un caso concreto: `npm run test:api:local:direct -- tests/api/TC01_api_consultarSalud.spec.ts`.
No ejecutar toda la suite mediante el comando directo: acumularia los limites
de autenticacion en un solo servidor.

El backend se enlaza a `127.0.0.1:4180` con `NODE_ENV=test`, sin cargar
`backend/.env`; MongoDB replica set efimero en `127.0.0.1:27018`, base
`duobalance_test_<UUID>` nueva por ejecucion/shard. El buzon JSON se crea bajo
el directorio de esa ejecucion. El teardown elimina solo la base validada,
detiene backend y MongoDB y elimina ese buzon. No se usa Atlas ni produccion.
MongoDB Memory Server puede descargar el binario de MongoDB en la primera ejecucion.

Web API local arranca Vite en `127.0.0.1:4176` con `VITE_DATA_MODE=api` y
proxy al backend aislado. Usa rutas normales, no hash, y permite REST solo a
ese origen local; Pages mantiene su guardia sin REST y su hash router.
Los dos usuarios tienen BrowserContexts independientes y correo ficticio.

El antiguo recorrido financiero con API se conserva en el repositorio de la aplicacion
(`test-framework`).
Sus seis escenarios son hoy los tests `TC04_web_e2e_` y `TC08_web_e2e_` a
`TC12_web_e2e_`: un test por archivo, sin `test.step` y con preparacion propia
mediante fixtures UI. Conservan las aserciones originales; ningun caso necesita
que se ejecute otro antes.

Usa `npm run report:api:local` y `npm run report:e2e:local` para abrir los
informes locales sin mezclarlos con el informe publicado.

No ejecutar API local y web API local a la vez en la misma maquina:
comparten puertos. Si estan ocupados, la ejecucion falla, sin reutilizar ni
detener servicios ajenos. Los puertos deben quedar libres al finalizar.

## GitHub Actions

[Pipeline independiente](.github/workflows/playwright.yml):

- PRs a cualquier rama y ejecucion manual.
- Diario a las **03:00 Europe/Madrid**: dos candidatos UTC (01:00 y 02:00);
  un filtro de hora local habilita solo el correspondiente al horario de
  verano/invierno. GitHub puede retrasar o descartar ejecuciones programadas;
  no es un servicio con garantia de puntualidad.
- Instala Node 24, dependencias y Chromium con dependencias del sistema.
- Ejecuta typecheck y UI sobre `vars.BASE_URL` (por defecto Pages).
- Job API solo cuando exista la variable de repositorio `API_BASE_URL`.
  Se mantienen los bloqueos descritos para correo/DB/seed.
- HTML y JUnit, screenshots y traces en fallos, artifacts durante 14 dias.
  Sin reintentos, `continue-on-error` ni conversiones de fallos a exito.
- Permisos de solo lectura, sin credenciales reales ni base de produccion.

Configurar las variables en Settings > Secrets and variables > Actions >
Variables del repositorio. La programacion empieza cuando el workflow este
en la rama predeterminada. No se hace commit ni push automaticamente.

[Workflow local independiente](.github/workflows/local-qa.yml), manual:
elige `api`, `web-api` o `both` y la revision de la aplicacion. Cada suite usa
su propio job/runner y artifacts distintos; API no instala Chromium ni frontend.
Se descargan ambos repositorios, pero las pruebas y la orquestacion pertenecen
solo a este framework. El workflow Pages sigue separado y no arranca servicios.

Los resultados locales se generan en `playwright-report/` y `test-results/`;
no se versionan. Cada ejecucion reemplaza el informe local anterior.

## Estado de validacion

Los resultados siguientes son **historicos** (2026-11-03, antes de reorganizar
el framework en `src/`, dividir los tests y renumerarlos). Tras esa
reorganizacion solo se han comprobado `npm run typecheck`, `npm run lint:arch` y
`npx playwright test --list` (137 tests en `chromium` + `api`: 77 web + 60 API; 6 e2e
adicionales con `playwright.api-e2e.config.ts`); los tests no se han vuelto a
ejecutar, asi que conviene una pasada completa antes de publicar.

- Resultados de entonces con `--project=chromium`: 14 passed, 12 skipped, 0 failed.
- Proyecto API sin backend: todos skipped; no representa validacion REST.
- Verificado el destino por defecto, el override conservando subdirectorios y
  el rechazo de GitHub Pages como API.
- La pipeline se ha creado y revisado, pero no se ha ejecutado en GitHub Actions:
  requiere publicar los cambios. No se ha hecho commit ni push.

### Resultados observados de las suites locales (historicos)

- API REST: 58/58 aprobados, incluidos seed, permisos, correo JSON y base
  aleatoria; cuatro shards secuenciales y limpieza completada.
- Web con API local: 6/6 aprobados, con dos sesiones independientes,
  invitacion, gastos privados/compartidos, balance y persistencia.
- Despues de esas ejecuciones se cambio el arranque de Vite a
  `src/integration/runFrontend.ts` sin volver a validarlo.
