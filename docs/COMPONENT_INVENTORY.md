# Inventario de componentes

Indice de todo lo que ofrece el framework. Los agentes deben leerlo antes de generar o cambiar codigo y actualizarlo cuando anadan, borren o renombren una Page, un componente, una fixture, un dato o una utilidad. `npm run lint:arch` falla si un archivo de `src/` no aparece aqui (comprobacion de sincronizacion).

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
| `ProfilePage.ts` | `/profile` | `signOut` |

## Componentes / Blocks (`src/components/`)

| Archivo | Descripcion |
| --- | --- |
| `AppNavigation.ts` | Navegacion lateral: `open(seccion)`, `link`, `skipLink` |
| `DemoPanel.ts` | Panel mock: `selectUser`, `resetMockData`, `hideButton`, `showButton`, `userSelect`, `resetButton` |

## Fixtures (`src/fixtures/`)

| Archivo | Uso | Contenido |
| --- | --- | --- |
| `index.ts` | Web sobre la demo publicada (mock, `chromium`) | Pages y componentes (`loginPage`, `expensesPage`, `balancePage`, `navigation`, `demoPanel`...), `partnerPage` (omite con motivo: requiere API real), escenarios de una cuenta (`anaAccount`, `signedInAna`, `spaceOwner`, `recoveryRequested`, `pendingAna`, `confirmedAna`, `demoMember`, `demoSharedExpense`, `demoPrivateExpense`) y de dos cuentas bloqueados en mock (`couple`, `sharedExpense`, `privateExpense`, `sharedAndPrivateExpenses`, `balancedExpenses`) |
| `pagesDemo.ts` | Specs que solo necesitan `page` en la demo estatica | Bloqueo de peticiones externas y `/__mock/` |
| `apiWeb.ts` | Web e2e contra la API real local (`*_web_e2e_*`) | `partnerPage` real, `users`, `confirmationUrl`, `registeredPair`, `apiCouple`, `apiExpenses`, `apiBalanced` |
| `api.ts` | Base API | Aislamiento, `account`, `mailToken` |
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
| `environment.ts` | `BASE_URL`/`API_BASE_URL` validados (`frontendURL`, `apiURL`) |
| `localEnvironment.ts` | Entorno local aislado (puertos, base aleatoria, buzon de correo) |

## Integracion local (`src/integration/`)

| Archivo | Descripcion |
| --- | --- |
| `runApiServer.ts` | Arranca el backend aislado (4180) |
| `runFrontend.ts` | Arranca el frontend (4176) |
| `apiTeardown.ts` | Limpia base, servicios y buzon propios |
| `backendDatabase.ts` | Acceso a la base de test |
| `backendSeed.ts` | Seed del backend |
| `runLocalApiTests.ts` | Lanzador de la suite API local en 4 shards |

## Utilidades (`src/utils/`)

| Archivo | Descripcion |
| --- | --- |
| `application.ts` | `appRoute`, `applicationPath` (hash router) |
| `demoScenarios.ts` | Escenarios por usuario demo |
| `networkGuard.ts` | Bloqueo de peticiones Supabase |
| `sharedSpace.ts` | `registerUser`, `prepareSharedSpace` |
| `checkArchitecture.ts` | `npm run lint:arch` (arquitectura, nombres e inventario) |

## Tests (`tests/`)

| Suite | Archivos | Numeracion | Notas |
| --- | --- | --- | --- |
| `tests/web/` | `TC<n>_web_<nombre>.spec.ts` | TC01-TC83 | `TC04`, `TC08`-`TC12` son `web_e2e` (API real local) |
| `tests/api/` | `TC<n>_api_<nombre>.spec.ts` | TC01-TC60 | Solo TC01 y TC02 corren contra un backend remoto de testing |

Ejemplo de referencia: `tests/web/TC29_web_crearUnGastoIndividualDesdeLaPrimeraCuenta.spec.ts` (web) y `tests/api/TC47_api_iniciarSesionConCookieHttpOnly.spec.ts` (api).
