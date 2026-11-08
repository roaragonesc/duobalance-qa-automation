# Pruebas API REST

Estos 60 casos usan Playwright `request`/`APIRequestContext`; no necesitan un
navegador ni ejecutan GitHub Pages. Se ejecutan como suite separada con
`playwright.api-local.config.ts`.

Desde la raiz del framework:

```powershell
npm run test:api:local
npm run report:api:local
```

El comando agrupa cuatro shards secuenciales. Cada shard inicia un backend
Node aislado, replica set MongoDB efimero en `127.0.0.1:27018`, y base de datos
aleatoria exclusiva. Los correos de confirmacion/recuperacion se escriben en un
buzon JSON privado de esa ejecucion. Al finalizar, el teardown borra solo la
base propia, detiene los servicios propios y elimina el buzon.

No se cargan archivos `.env`, Atlas ni credenciales reales. Requiere el checkout
de `duobalance` con `apps/api/src/server.ts` y las dependencias de `apps/api`; configurar `DUOBALANCE_APP_PATH`
si no esta en el directorio hermano predeterminado (`..\duobalance`).
Los puertos `4180` y `27018` deben estar libres; no se reutilizan servicios existentes.

El entorno se configura automaticamente: `API_BASE_URL=http://127.0.0.1:4180/api/v1/`,
`FRONTEND_ORIGIN=http://localhost:5173`, `BASE_URL=http://localhost:5173` y `NODE_ENV=test`.
Cada contexto conserva cookies de sesion y las escrituras autenticadas incluyen
`X-CSRF-Token`. No se arranca el frontend. Las fixtures crean los datos ficticios;
solo TC60 ejecuta el seed para comprobar su idempotencia en la base aislada.

No ejecutes toda la suite mediante `npm run test:api:local:direct`: el runner
de cuatro shards evita alcanzar el rate limit de autenticacion. El comando
directo sirve para depurar un spec individual, por ejemplo:

```powershell
npm run test:api:local:direct -- TC01_api_consultarSalud
```

HTML, JUnit y trazas se guardan bajo `playwright-report/local-api/` y
`test-results/local-api/`. La suite Pages esta separada y nunca arranca el
backend. Los recorridos web multiusuario siguen bloqueados en la demo.

`npm run test:api` usa la configuracion general: sin `API_BASE_URL` omite todos
los casos; con una API remota solo permite salud/OpenAPI. Las operaciones con
cuentas, correo, seed y datos destructivos permanecen bloqueadas fuera del entorno
local aislado por la fixture `apiIsolation`.
