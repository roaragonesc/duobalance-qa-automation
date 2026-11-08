# Guia de workflow para agentes de IA

Como deben navegar, entender y ampliar este framework los agentes (Copilot, planificador, generador, sanador). El agente base es `.github/agents/qa-web-playwright.agent.md`; este documento define el flujo.

---

## 1. Entender el framework antes de actuar

1. Lee `docs/COMPONENT_INVENTORY.md`: Pages, componentes, fixtures, datos, utilidades y suite existentes.
2. Lee `README.md` (entorno, comandos, decisiones, alcance) y `.github/agents/qa-web-playwright.agent.md` (reglas obligatorias).
3. Lee `src/fixtures/index.ts` para saber que Pages y escenarios existen como fixture.
4. Lee `src/config/environment.ts` para el entorno vigente (`BASE_URL`).
5. Si la tarea toca una pantalla real, comprueba su interfaz real en la demo desplegada. Nunca inventes labels ni mensajes.

Flujo de dependencias permitido: `tests (specs) -> src/fixtures -> src/pages -> src/components / src/utils / src/config / src/data`.

---

## 2. Reglas de arquitectura para cualquier cambio

- Un spec usa solo fixtures y la API publica de las Pages. Sin locators, sin `goto`, sin acceder a componentes internos de una Page.
- Una Page por pantalla de la aplicacion; cada locator y cada comportamiento tienen un unico propietario. Selectores iguales no demuestran un mismo contrato: verifica propietario, comportamiento y consumidores antes de reutilizar.
- `tests/` contiene solo `web/` (y `api/` si se anade); todo el codigo del framework vive en `src/`.
- Las Pages no importan fixtures.
- Informa `PASS`, `FAIL`, `BLOCKED` y `NOT_RUN` por separado. Un test omitido no es un aprobado.
- Verificacion por defecto: `npm run typecheck`, `npm run lint`, `npm run format:check` y `npm run lint:arch` (incluye la sincronizacion del inventario). **No ejecutes Playwright salvo que el usuario lo pida**; si se pide, empieza por el spec afectado.
- No edites reglas ni configuracion de lint para silenciar un hallazgo; corrige la causa.

---

## 3. Como planificar tests

1. Identifica las Pages implicadas en `docs/COMPONENT_INVENTORY.md`.
2. Identifica la fixture que ya prepara el estado (`demoMember`, `signedInAna`, `spaceOwner`...). Una capacidad que no existe se lista como faltante y se crea primero (Page o fixture), nunca se improvisa en el spec.
3. Si el escenario necesita dos cuentas con datos compartidos, no se puede probar en modo mock: se deja con `// Requiere API real` + `test.skip`.
4. Elige los datos de `src/data/` (`journeyUsers`, `demoUsers`, `expenses`).
5. Decide el nombre y el numero: siguiente `TC<n>` libre; el archivo se llama igual que el titulo.
6. Indica por escenario: precondicion (fixture), accion y resultado esperado.

---

## 4. Como generar tests

1. Importa `test` y `expect` desde la fixture adecuada con ruta relativa (`../../src/fixtures`, `../../src/fixtures/pagesDemo`).
2. Un test por archivo. Titulo `TC<n>_web_<nombre>`; archivo `<titulo>.spec.ts`; numeracion sin huecos.
3. Pide las Pages y la preparacion por fixture. Si varios tests repiten una preparacion, crea una fixture en `src/fixtures/index.ts`.
4. Usa solo metodos y localizadores publicos de las Pages; las expectativas van en el spec.
5. Usa `src/data/` para entradas; nunca credenciales reales ni URLs fijas.
6. No definas funciones auxiliares en el spec: la logica de UI va en la Page o el componente.

Plantilla:

```ts
import { expect, test } from '../../src/fixtures'

test('TC23_web_crearUnGastoIndividualDesdeLaPrimeraCuenta', async ({ demoMember: _member, expensesPage }) => {
  await expensesPage.visit()
  await expensesPage.addExpense({ description: 'Peluquería E2E', amount: '35,00', individual: true })
  await expect(expensesPage.row('Peluquería E2E')).toContainText('Individual')
})
```

---

## 5. Como anadir una Page

1. Crea `src/pages/<Nombre>Page.ts` extendiendo `BasePage` con `protected readonly path`.
2. Declara los locators como campos `readonly` asignados en el constructor (`getByRole`/`getByLabel` primero, comprobados en la interfaz real).
3. Anade metodos con intencion de usuario; sin expectativas de negocio.
4. Registrala como fixture en `src/fixtures/index.ts`.
5. Actualiza `docs/COMPONENT_INVENTORY.md`.
6. Si una seccion tiene comportamiento propio o se comparte, extraela a `src/components/`.

---

## 6. Como sanar un test que falla

1. Clasifica la causa: producto, test, Page/componente, datos o entorno.
2. Inspecciona la interfaz real y localiza el locator o mensaje nuevo.
3. Corrige en el propietario (Page, componente, fixture o dato), no en el spec ni copiando codigo de otra Page.
4. Comprueba el spec afectado y despues sus consumidores, solo si el usuario autoriza la ejecucion.
5. Si el cambio es un defecto del producto, informa `FAIL` con evidencia: no debilites la asercion ni uses `skip`/`fixme` para aprobar.

---

## 7. Archivos clave

| Proposito | Archivo |
| --- | --- |
| Instrucciones automaticas de Copilot / otros agentes | `.github/copilot-instructions.md`, `AGENTS.md` |
| Ver todos los componentes | `docs/COMPONENT_INVENTORY.md` |
| Reglas del agente | `.github/agents/qa-web-playwright.agent.md` |
| Comandos, decisiones y alcance | `README.md` |
| Fixtures | `src/fixtures/index.ts`, `src/fixtures/pagesDemo.ts` |
| Entorno | `src/config/environment.ts` |
| Datos | `src/data/` |
| Reglas automaticas | `src/utils/checkArchitecture.ts`, `eslint.config.mjs`, `.prettierrc.json` |
| Test de ejemplo | `tests/web/TC23_web_crearUnGastoIndividualDesdeLaPrimeraCuenta.spec.ts` |

---

## 8. Restricciones para agentes

- No hardcodees credenciales, URLs ni contrasenas en specs o Pages.
- No definas funciones o closures auxiliares dentro de specs.
- No pongas selectores en specs.
- No accedas a componentes internos de una Page desde un spec.
- No borres `BasePage.ts`, utilidades de `src/utils/` ni workflows de `.github/workflows/`.
- Actualiza `docs/COMPONENT_INVENTORY.md` tras anadir, borrar o renombrar una Page, componente, fixture, dato o utilidad.
- No uses `waitForTimeout`, `networkidle`, `force: true`, `test.only` ni `test.fixme`; usa aserciones web-first.
- No hagas commit ni push automaticamente salvo peticion expresa del usuario.
