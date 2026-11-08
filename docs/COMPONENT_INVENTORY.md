# Inventario de componentes

Indice de todo lo que ofrece el framework. Los agentes deben leerlo antes de generar o cambiar codigo y actualizarlo cuando anadan, borren o renombren una Page, un componente, una fixture, un dato o una utilidad. `npm run lint:arch` falla si un archivo de `src/` no aparece aqui.

## Pages (`src/pages/`)

Una Page por pantalla de la aplicacion. Locators como campos `readonly` del constructor; operaciones con intencion de usuario; sin expectativas de negocio (solo `expectOpen()`).

| Archivo | Pantalla (ruta) | API publica relevante |
| --- | --- | --- |
| `BasePage.ts` | Comportamiento comun | `visit`, `reload`, `expectOpen`, `main`, `alert`, `status` |
| `LoginPage.ts` | `/login` | `signIn`, `submit`, `openPasswordRecovery`, `visitRoot`, `emailField`, `passwordField`, `invalidCredentialsMessage` |
| `RegisterPage.ts` | `/register` | `register`, `confirm`, `openConfirmationUrl`, `confirmationLink`, `confirmEmailButton` |
| `ForgotPasswordPage.ts` | `/forgot-password` | `requestLink`, `openMockRecoveryLink`, `sendLinkButton` |
| `ResetPasswordPage.ts` | `/reset-password` | `resetPassword`, `passwordField` |
| `OnboardingPage.ts` | `/onboarding`, `/onboarding/invite` | `createSpace`, `invite`, `visitInvitation`, `invitationLink` |
| `JoinSpacePage.ts` | `/join` | `open`, `accept`, `createAccountLink` |
| `DashboardPage.ts` | `/dashboard` | `noExpensesHeading` |
| `ExpensesPage.ts` | `/expenses` | `addExpense`, `editAmount`, `row`, `cell`, `editLink`, `deleteButton`, `editUrl`, `openEditor`, `filterByType`, `filterByCategory`, `sharedTotal`, `individualTotal` |
| `IncomesPage.ts` | `/incomes` | `addIncome`, `row`, `editLink`, `deleteButton`, `ownerFilter`, `shareRegion` |
| `BalancePage.ts` | `/balance` | `debtSummary`, `monthSummary`, `ownContribution`, `monthBalance`, `noBalanceHeading` |
| `SpacePage.ts` | `/space` | `heading`, `summary`, `members`, `memberItems`, `member` |
| `ProfilePage.ts` | `/profile` | `signOut`, `nameHeading`, `emailText` (comprobar la identidad activa) |

## Componentes / Blocks (`src/components/`)

| Archivo | Descripcion |
| --- | --- |
| `AppNavigation.ts` | Navegacion lateral: `open(seccion)`, `link`, `skipLink` |
| `DemoPanel.ts` | Panel mock: `selectUser`, `resetMockData`, `hideButton`, `showButton`, `userSelect`, `resetButton` |

## Fixtures (`src/fixtures/`)

| Archivo | Uso | Contenido |
| --- | --- | --- |
| `index.ts` | Web sobre la demo publicada (mock) | Pages y componentes (`loginPage`, `expensesPage`, `balancePage`, `navigation`, `demoPanel`...), `partnerPage` (omite con motivo: requiere API real), escenarios de una cuenta (`anaAccount`, `signedInAna`, `spaceOwner`, `recoveryRequested`, `pendingAna`, `confirmedAna`, `demoMember`, `demoSharedExpense`, `demoPrivateExpense`) y de dos cuentas bloqueados en mock (`couple`, `sharedExpense`, `privateExpense`, `sharedAndPrivateExpenses`, `balancedExpenses`) |
| `pagesDemo.ts` | Specs que solo necesitan `page` en la demo estatica | Bloqueo de peticiones externas y `/__mock/` |
| `api.ts` | Base de la suite API | Aislamiento, `account`, `mailToken` |
| `financeApi.ts` | API con espacio compartido | `actors`, `household`, `send` |
| `endpointApi.ts` | API por endpoint | `registeredAccount`, `confirmedAccount`, `authenticatedAccount`, `pendingInvitation`, `expense`, `income`, `settlementId`, `today` |

## Datos (`src/data/`)

| Archivo | Contenido |
| --- | --- |
| `demoUsers.ts` | Usuarios del modo demo (`rocio`, `pablo`, `ines`, `mateo`, `nuevo`, `solo`) |
| `journeyUsers.ts` | Cuentas ficticias de los recorridos (`a` = Ana, `b` = Luis) |
| `expenses.ts` | Gastos de los escenarios (`e2eExpenses`, `demoExpenses`) |

## Configuracion (`src/config/`)

| Archivo | Descripcion |
| --- | --- |
| `environment.ts` | `BASE_URL` y `API_BASE_URL` validadas (`frontendURL`, `apiURL`) |
| `localEnvironment.ts` | Entorno local aislado para la suite API (puertos, base aleatoria, buzon de correo) |

## Integracion local (`src/integration/`)

| Archivo | Descripcion |
| --- | --- |
| `runApiServer.ts` | Arranca el backend aislado |
| `runFrontend.ts` | Arranca el frontend local |
| `apiTeardown.ts` | Limpia base, servicios y buzon propios |
| `backendDatabase.ts` | Acceso a la base de test |
| `backendSeed.ts` | Seed del backend |
| `runLocalApiTests.ts` | Lanzador de la suite API local |

## Utilidades (`src/utils/`)

| Archivo | Descripcion |
| --- | --- |
| `application.ts` | `appRoute`, `applicationPath` (hash router) |
| `demoScenarios.ts` | Escenarios por usuario demo |
| `networkGuard.ts` | Bloqueo de peticiones Supabase/REST/fetch |
| `sharedSpace.ts` | `registerUser`, `prepareSharedSpace` |
| `checkArchitecture.ts` | `npm run lint:arch` (arquitectura, nombres e inventario) |

## Tests (`tests/`)

| Suite | Archivos | Numeracion | Notas |
| --- | --- | --- | --- |
| `tests/web/` | `TC<n>_web_<nombre>.spec.ts` | TC01-TC41 | 15 recorridos se ejecutan (TC01-TC15); 26 de dos cuentas (TC16-TC41) se omiten con `// Requiere API real` |
| `tests/api/` | `TC<n>_api_<nombre>.spec.ts` | TC01-TC60 | Los 60 se omiten con `// Requiere API real` (necesitan un backend REST aislado) |

Ejemplos de referencia (recorridos con pasos `test.step('N. ...')` numerados): `tests/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.spec.ts` y, con dos identidades demo en un solo navegador, `tests/web/TC15_web_recorridoDeGastosCompartidosEIndividualesEntreRocioYPablo.spec.ts`.
