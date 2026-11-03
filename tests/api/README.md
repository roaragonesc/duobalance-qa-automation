# Pruebas API REST

Estos 58 casos usan Playwright `request`/`APIRequestContext`; no necesitan un
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

No se cargan `backend/.env`, Atlas ni credenciales reales. Requiere el checkout
de `duobalance` y las dependencias de `backend`; configurar `DUOBALANCE_APP_PATH`
si no esta en el directorio hermano predeterminado.

No ejecutes toda la suite mediante `npm run test:api:local:direct`: el runner
de cuatro shards evita alcanzar el rate limit de autenticacion. El comando
directo sirve para depurar un spec individual, por ejemplo:

```powershell
npm run test:api:local:direct -- tests/api/consultarSalud.spec.ts
```

HTML, JUnit y trazas se guardan bajo `playwright-report/local-api/` y
`test-results/local-api/`. La suite Pages esta separada y nunca arranca el
backend. Web E2E conectado a la API tiene su propia configuracion y comando:
`npm run test:e2e:local`.
