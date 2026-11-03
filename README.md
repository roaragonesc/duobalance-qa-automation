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
usan `./#/login`, etc., para conservar `/duobalance/`. La prueba TC24 verifica
HTTP 200, URL completa (origen, subdirectorio y hash) y navegacion al registro.

```powershell
$env:BASE_URL = 'https://roaragonesc.github.io/duobalance/'
npm run test:ui
```

Las variables se leen del entorno, **no se carga `.env` automaticamente**.
[.env.example](.env.example) es una referencia, no contiene secretos.

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

El seed importa modelos y MongoDB del backend original: su fuente completa
esta en [tests/preserved/seedIdempotente.spec.ts.original](tests/preserved/seedIdempotente.spec.ts.original).
El spec descubrible conserva su ID: se ejecuta en modo API local y se bloquea
en modo remoto sin cargar modulos del backend.
No se migran suites unitarias/component testing/DB que necesitan compilar o
ejecutar la aplicacion, ni launchers de servidores locales.

Se agregan TC24-TC26 para acceso publicado, calculo exacto de balances,
edicion/persistencia local y gastos privados. No sustituyen los recorridos
multiusuario originales.

| Casos web | Estado/capacidad |
| --- | --- |
| TC01-TC08 | Login valido/invalido, validaciones, registro/confirmacion, recuperacion, rutas protegidas, onboarding y creacion de espacio |
| TC20-TC22 | Panel accesible, demo movil, gasto y recarga, confirmacion y recuperacion demo |
| TC24-TC26 | URL publicada, navegacion, gastos compartidos/privados, edicion, balances exactos y persistencia en un navegador |
| TC27-TC28 | Redireccion a la ruta privada tras login y bloqueo al volver atras tras logout; tests independientes |
| TC09-TC19 | Bloqueados: necesitan estado compartido entre sesiones independientes |
| TC23 | Registro, confirmacion e inicio de sesiones: activo solo en web API local |
| TC29-TC33 | Invitaciones, gastos, privacidad, balance y sesiones: activos solo en web API local |

TC25 parte del seed de demo: 705,80 EUR compartidos. Un gasto de 80,00
produce 785,80 EUR, aportacion 392,90 EUR y deuda acumulada 314,20 EUR.
Editar ese gasto a 100,00 produce 805,80 EUR y deuda 304,20 EUR.
TC26 comprueba que 35,00 EUR privados no alteran los 705,80 EUR compartidos
ni la deuda acumulada inicial de 354,20 EUR. Son expectativas fijas del seed,
no valores calculados a partir de la respuesta observada.

Los bloqueos se muestran como **skipped con motivo**, nunca como aprobados.
No se usa `skip` para ocultar fallos de los escenarios activos.

Los antiguos pasos TC39-TC41 del recorrido TC07 se separaron en tres specs
independientes: TC07 (sin sesion), TC27 (redireccion tras login) y TC28
(volver atras tras logout). Cada caso prepara su propia sesion y no depende
del resultado ni del estado de otro test.

## API remota opcional

No se ha identificado un backend publico de testing en el despliegue.
**Nunca configurar GitHub Pages como API_BASE_URL**: la configuracion lo rechaza.

```powershell
$env:API_BASE_URL = 'https://your-testing-backend.example/api/v1/'
npm run test:api
```

Sin `API_BASE_URL`, los 58 casos API se notifican bloqueados antes de enviar
peticiones. Con un backend de testing configurado, se habilitan unicamente
TC01 (health) y TC02 (contrato OpenAPI de 45 operaciones), de solo lectura.
Sus aserciones originales no se relajan.

En modo remoto los otros 56 casos siguen bloqueados: sus fixtures necesitan
correo accesible desde el filesystem del backend, configuracion CORS de testing,
cuentas confirmadas y MongoDB aislado; TC58 requiere ademas codigo backend/seed.
**Desplegar una URL por si solo no cubre estos requisitos**. Antes de habilitarlos,
implementar un adaptador de correo de testing y aprovisionamiento/limpieza
aislados, adaptar las fixtures y verificar que no apuntan a produccion.
Los escenarios destructivos no se activan simplemente por definir API_BASE_URL.
El modo local descrito a continuacion provee la infraestructura aislada y
ejecuta los 58 casos API originales, incluido seed.

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
| API local, 58 casos REST/seed | `npm run test:api:local` | `playwright.api-local.config.ts` | `playwright-report/local-api/`, `test-results/local-api/junit.xml` |
| Web con API local | `npm run test:e2e:local` | `playwright.api-e2e.config.ts` | `playwright-report/local-api-e2e/`, `test-results/local-api-e2e/junit.xml` |

`npm run test:api:local` ejecuta cuatro shards secuenciales, cada uno con
backend y base nuevos, para respetar los limites de autenticacion originales;
fusiona HTML/JUnit y falla si falla cualquier shard. No necesita Chromium.
Para un caso concreto: `npm run test:api:local:direct -- tests/api/consultarSalud.spec.ts`.
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

El antiguo recorrido TC23 se conserva en
[tests/preserved/recorridoFinancieroApi.spec.ts.original](tests/preserved/recorridoFinancieroApi.spec.ts.original).
Sus seis escenarios se separaron en TC23 y TC29-TC33: un test por archivo,
sin `test.step` y con preparacion propia mediante fixtures UI. Conservan
las aserciones originales; ningun caso necesita que se ejecute otro antes.
Esto no implica que todos los demas recorridos heredados ya esten separados.

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

## Validacion realizada (2026-11-03)

- `npm run typecheck`: correcto.
- `npx playwright test --list`: 84 casos (26 web + 58 API).
- `npx playwright test --project=chromium`: **14 passed, 12 skipped, 0 failed**.
- Proyecto API sin backend: **58 skipped, 0 passed**; no representa validacion REST.
- Verificado el destino por defecto, el override conservando subdirectorios y
  el rechazo de GitHub Pages como API.
- Los informes locales de esta validacion se conservaron por separado:
  UI en `playwright-report/index.html` y `test-results/junit.xml`;
  API en `playwright-report/api/index.html` y `test-results/api-junit.xml`.
- La pipeline se ha creado y revisado, pero no se ha ejecutado en GitHub Actions:
  requiere publicar los cambios. No se ha hecho commit ni push.

  ### Resultados observados de las suites locales

  - API REST: **58/58 aprobados**, incluidos seed, permisos, correo JSON y base
    aleatoria; cuatro shards secuenciales y limpieza completada.
  - Web con API local: **6/6 aprobados**, con dos sesiones independientes,
    invitacion, gastos privados/compartidos, balance y persistencia.
  - TypeScript: correcto antes de la ultima sustitucion del comando de arranque
    Vite por `tests/integration/runFrontend.ts`. Esa ultima modificacion se deja
    deliberadamente sin ejecutar ni volver a validar.
  - Por peticion expresa, no se vuelven a lanzar pruebas en esta iteracion.
    Los resultados anteriores no deben interpretarse como validacion de ese
    ultimo cambio del lanzador frontend.
