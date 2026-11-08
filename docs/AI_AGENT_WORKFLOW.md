# Procedimiento de trabajo en DuoBalance QA Automation

Este documento explica como abordar un cambio del framework con **Playwright SDET** (`.github/agents/playwright-sdet.agent.md`).
Se aplica al trabajo de Copilot y a las tareas de planificacion, generacion y correccion.
El recorrido de trabajo se mantiene: **Entender → Planificar → Implementar → Verificar → Corregir → Reportar**.

---

## 1. Entender: localizar el contrato que afecta al cambio

1. Consulta `docs/COMPONENT_INVENTORY.md` para localizar Pages, componentes, fixtures, datos, utilidades y suites disponibles.
2. Revisa el entorno, los comandos, las decisiones y el alcance en `README.md`, y las obligaciones del agente en `.github/agents/playwright-sdet.agent.md`.
3. Examina `src/fixtures/index.ts` para identificar las Pages y los escenarios que el test puede solicitar como fixture.
4. Comprueba `src/config/environment.ts` y el valor de entorno `BASE_URL`.
5. Cuando el cambio afecte a una pantalla, verifica su interfaz en la demo desplegada. Los labels y mensajes deben proceder de esa interfaz, no de una suposicion.

Las dependencias conservan este sentido: `tests (specs) -> src/fixtures -> src/pages -> src/components / src/utils / src/config / src/data`.

---

## 2. Limites que debe respetar la solucion

- El spec trabaja con fixtures y la API publica de las Pages. No incluye locators ni `goto`, ni recorre los componentes internos de una Page.
- Cada pantalla dispone de una Page y cada locator o comportamiento tiene un propietario unico. Antes de reutilizar una pieza, comprueba quien la mantiene, que hace y quienes la consumen; compartir selector no basta para compartir contrato.
- `tests/` contiene exclusivamente `web/` y `api/`; el framework se implementa en `src/`. No borres pruebas por no poder ejecutarlas: conserva `// Requiere API real` y `test.skip`. Ante altas o bajas, manten la numeracion de cada suite desde TC01 sin saltos.
- La dependencia desde Pages hacia fixtures no esta permitida: una Page no importa fixtures.
- Separa `PASS`, `FAIL`, `BLOCKED` y `NOT_RUN` en la entrega. Una omision no demuestra que el caso pase.
- Los controles habituales son `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`; este ultimo incluye el inventario. **Playwright solo se ejecuta por peticion del usuario**, empezando por el spec afectado.
- Resuelve la causa de un hallazgo de lint. No alteres sus reglas ni su configuracion para dejar de detectarlo.

---

## 3. Planificar: relacionar escenario, preparacion y datos

1. Localiza en `docs/COMPONENT_INVENTORY.md` las Pages que intervienen.
2. Busca la fixture que proporciona la precondicion, como `demoMember`, `signedInAna` o `spaceOwner`. Si falta una Page o fixture, identifica esa carencia y resuelvela antes del spec; no implementes la capacidad dentro del test.
3. Un escenario de dos cuentas con datos compartidos necesita una capacidad ausente del modo mock. Mantenlo con `// Requiere API real` y `test.skip`.
4. Consulta o crea `src/data/testData/<suite>/<titulo>.json` con `setup`, `inputs` y `expected`.
   La option tipada `caseData` suministra a las fixtures esta misma fuente, no un catalogo alternativo.
5. Asigna el siguiente `TC<n>` libre y el mismo nombre al titulo y al archivo.
6. Explicita la precondicion aportada por fixture, la accion y el resultado esperado del escenario.

---

## 4. Implementar: conectar la Page, la fixture, los datos y el spec

El orden de implementacion es **Page/componente -> fixture -> datos -> spec**.

1. Utiliza imports relativos de `test` y `expect` desde la fixture apropiada (`../../src/fixtures`, `../../src/fixtures/pagesDemo`).
2. Manten un test por archivo, titulo `TC<n>_web_<nombre>`, archivo `<titulo>.spec.ts` y numeracion sin huecos.
   Divide el test en `test.step('1. Sujeto + accion', ...)`: cada paso agrupa una accion y sus `expect`, y los numeros avanzan desde 1.
   El spec web no contiene `for`, `while`, `if`, `switch`, `try`, ternarios, `Promise.all` ni `.forEach`.
   En los casos de dos personas, abre el perfil y comprueba `profilePage.nameHeading` y `emailText` antes de las acciones de cada una.
   Expresa primero el bloque de Ana y despues el de Luis, con acciones explicitas en vez de bucles.
3. Solicita las Pages y la preparacion como fixtures. Cuando la misma preparacion aparezca en varios tests, extraela a `src/fixtures/index.ts`.
4. Interactua mediante metodos y localizadores publicos de las Pages. Escribe las expectativas en el spec.
5. Importa el JSON homonimo y cargalo con `defineCaseData`. Del JSON proceden los nombres, emails ficticios,
   importes, categorias, tipos, mensajes, conteos y status API que actuan como entradas o expected de negocio.
   No anadas JSON decorativos ni conviertas unions con `as any`/`as unknown`: el guard mantiene la forma inferida
   y valida `demoUser`, `expenseType`, `section`, `splitMethod` y `kind`.
6. La logica de UI pertenece a su Page o componente. El spec no define funciones auxiliares.

Conexion de datos e identidad en el recorrido de gasto individual de DuoBalance:

```ts
import { expect, test } from '../../src/fixtures'
import testData from '../../src/data/testData/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

test('TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo', async ({ demoMember: _member, profilePage, expensesPage }) => {
  await test.step('1. Rocío abre su perfil y comprueba que es Rocío', async () => {
    await profilePage.visit()
    await expect(profilePage.nameHeading(data.setup.demoUsers.rocio.name)).toBeVisible()
    await expect(profilePage.emailText(data.setup.demoUsers.rocio.email)).toBeVisible()
  })
  await test.step('2. Rocío añade un gasto individual', async () => {
    await expensesPage.visit()
    await expensesPage.addExpense(data.setup.demoExpenses.private)
    await expect(expensesPage.row(data.setup.demoExpenses.private.description)).toContainText(data.expected.toContainText1)
  })
})
```

Este fragmento ilustra la carga y el inicio del caso; no sustituye el recorrido completo.
Pueden permanecer como literales los titulos, pasos, metadata de skip y claves de protocolos o selectores.
Tokens, IDs, enlaces, fechas y URLs de entorno se obtienen dinamicamente. Las rutas hash, endpoints, teclas,
encoding, indices de fechas y matchers estructurales describen el contrato tecnico, no el expected de negocio.
Los emails API se generan con UUID a partir del JSON y se contrastan con el usuario runtime.
Restablece el seed demo desde la UI y no alteres sus resultados.
Al cambiar nombre o numero, conserva la correspondencia spec + JSON y actualiza import e inventario.
El analisis AST de `lint:arch` exige import y consumo efectivo, setup compartido, datos de negocio sin hardcode,
numeracion y datos inventariados. Tambien identifica JSON huerfanos.

---

### Incorporar una pantalla al framework

1. Implementa `src/pages/<Nombre>Page.ts` sobre `BasePage`, con `protected readonly path`.
2. Asigna en el constructor los campos `readonly` de los locators. Prioriza `getByRole`/`getByLabel` y confirma sus valores en la interfaz real.
3. Ofrece acciones de usuario mediante metodos; no introduzcas expectativas de negocio.
4. Publica la Page como fixture en `src/fixtures/index.ts`.
5. Incluyela en `docs/COMPONENT_INVENTORY.md`.
6. Cuando una seccion tenga comportamiento independiente o compartido, implementala en `src/components/`.

---

## 5. Verificar: comprobar sin ampliar la ejecucion por defecto

Ejecuta `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch`.
Si el usuario solicita Playwright, comienza por el spec afectado. Las mismas restricciones de ejecucion
y la obligacion de corregir la causa, en lugar de modificar lint, se mantienen durante esta fase.

## 6. Corregir: localizar el origen antes de editar

1. Determina si la causa pertenece al producto, al test, a una Page/componente, a los datos o al entorno.
2. Verifica la interfaz real para identificar el locator o mensaje que haya cambiado.
3. Repara la Page, componente, fixture o dato responsable. No traslades la correccion al spec ni copies implementaciones de otra Page.
4. Con autorizacion de ejecucion, comprueba primero el spec afectado y despues sus consumidores.
5. Un defecto del producto se entrega como `FAIL` con evidencia. No reduzcas la exigencia de la asercion ni uses `skip`/`fixme` para convertirlo en aprobado.

---

## 7. Reportar: dejar resultados y referencias comprobables

Indica `PASS`, `FAIL`, `BLOCKED` y `NOT_RUN` de forma separada, sin contabilizar las omisiones como aprobaciones.
Actualiza el inventario cuando se anada, borre o renombre una Page, componente, fixture, dato o utilidad.
Las referencias de consulta siguen siendo:

| Proposito | Archivo |
| --- | --- |
| Instrucciones automaticas de Copilot / otros agentes | `.github/copilot-instructions.md`, `AGENTS.md` |
| Ver todos los componentes | `docs/COMPONENT_INVENTORY.md` |
| Reglas del agente | `.github/agents/playwright-sdet.agent.md` |
| Comandos, decisiones y alcance | `README.md` |
| Fixtures | `src/fixtures/index.ts`, `src/fixtures/pagesDemo.ts` |
| Entorno | `src/config/environment.ts` |
| Datos | `src/data/` |
| Reglas automaticas | `src/utils/checkArchitecture.ts`, `eslint.config.mjs`, `.prettierrc.json` |
| Test de ejemplo | `tests/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.spec.ts` |

---

## 8. Acciones excluidas del trabajo del agente

- No incrustes credenciales, URLs ni contrasenas en specs o Pages.
- No introduzcas funciones o closures auxiliares, selectores ni acceso a componentes internos de una Page dentro del spec.
- No elimines `BasePage.ts`, las utilidades de `src/utils/` ni los workflows de `.github/workflows/`.
- Manten `docs/COMPONENT_INVENTORY.md` actualizado ante altas, bajas o renombrados de Pages, componentes, fixtures, datos o utilidades.
- Utiliza aserciones web-first; quedan excluidos `waitForTimeout`, `networkidle`, `force: true`, `test.only` y `test.fixme`.
- No realices commit ni push automaticamente: ambos requieren peticion expresa del usuario.
