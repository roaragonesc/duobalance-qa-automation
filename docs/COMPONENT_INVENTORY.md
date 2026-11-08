# Inventario de componentes

Referencia de las piezas disponibles en DuoBalance QA Automation. Consulta este inventario antes de generar o modificar codigo.
Registra las altas, bajas y cambios de nombre de Pages, componentes, fixtures, datos y utilidades.
`npm run lint:arch` detecta los archivos de `src/` que no esten incluidos.

## Pages (`src/pages/`)

Cada pantalla de DuoBalance tiene su propia Page. El constructor asigna los locators a campos `readonly`,
y sus metodos exponen acciones de usuario. Las expectativas de negocio no pertenecen a la Page;
la comprobacion admitida es `expectOpen()`.

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
| `api.ts` | Base de la suite API | `apiIsolation` habilita el entorno local y omite operaciones remotas; `account`, `mailToken` |
| `financeApi.ts` | API con espacio compartido | `actors`, `household`, `send` |
| `endpointApi.ts` | API por endpoint | `registeredAccount`, `confirmedAccount`, `authenticatedAccount`, `pendingInvitation`, `expense`, `income`, `settlementId`, `today`, `endpointCoverage` (operaciones HTTP reales extraidas por AST, sin depender del titulo de los pasos), `normalizeApiOperation` (conserva parametros de rutas) |

## Datos (`src/data/`)

Cada spec utiliza su JSON en `testData/web/` o `testData/api/`, con el mismo basename que el titulo/spec.
El archivo contiene `setup`, `inputs` y `expected`. Las fixtures web/API reciben `data.setup` mediante la
option tipada `caseData`, de modo que preparacion y recorrido utilizan la misma fuente.
Los catalogos TypeScript permanecen por compatibilidad y no se importan como fuente de datos de los specs.
Un cambio de nombre del caso exige el mismo cambio en su JSON, junto con el import y este inventario.

| Archivo | Contenido |
| --- | --- |
| `demoUsers.ts` | Usuarios del modo demo (`rocio`, `pablo`, `ines`, `mateo`, `nuevo`, `solo`) |
| `journeyUsers.ts` | Cuentas ficticias de los recorridos (`a` = Ana, `b` = Luis) |
| `expenses.ts` | Gastos de los escenarios (`e2eExpenses`, `demoExpenses`) |

## Configuracion (`src/config/`)

| Archivo | Descripcion |
| --- | --- |
| `environment.ts` | `BASE_URL` y `API_BASE_URL` validadas (`frontendURL`, `apiURL`) |
| `localEnvironment.ts` | Entorno local aislado para la suite API (puertos, base aleatoria, buzon de correo), checkout monorepo `apps/api` y `apps/web`, URLs y origen HTTP |

## Integracion local (`src/integration/`)

| Archivo | Descripcion |
| --- | --- |
| `runApiServer.ts` | Verifica puertos libres y arranca `apps/api` con MongoDB replica set efimero, sin cargar `.env` |
| `runFrontend.ts` | Arranca `apps/web` local (no se utiliza en la suite HTTP) |
| `apiTeardown.ts` | Limpia base, servicios y buzon propios |
| `backendDatabase.ts` | Acceso a la base de test con Mongoose de `apps/api` |
| `backendSeed.ts` | Seed y modelo User del backend `apps/api` |
| `runLocalApiTests.ts` | Lanzador de la suite API local |

## Utilidades (`src/utils/`)

| Archivo | Descripcion |
| --- | --- |
| `application.ts` | `appRoute`, `applicationPath` (hash router) |
| `demoScenarios.ts` | Escenarios por usuario demo |
| `networkGuard.ts` | Bloqueo de peticiones Supabase/REST/fetch |
| `sharedSpace.ts` | `registerUser`, `prepareSharedSpace` |
| `checkArchitecture.ts` | `npm run lint:arch` (arquitectura, nombres e inventario) |
| `caseData.ts` | `defineCaseData`: forma JSON inferida y guards de unions; `WebSetup`, `ApiSetup`, `UserData`, `ExpenseData`, `requiredData`; option `caseData` y datos de preparacion coherentes |

## Tests (`tests/`)

| Suite | Archivos | Numeracion | Notas |
| --- | --- | --- | --- |
| `tests/web/` | `TC<n>_web_<nombre>.spec.ts` | TC01-TC41 | 15 recorridos se ejecutan (TC01-TC15); 26 de dos cuentas (TC16-TC41) se omiten con `// Requiere API real` |
| `tests/api/` | `TC<n>_api_<nombre>.spec.ts` | TC01-TC60 | 60 casos habilitados solo en API local aislada; sin backend se omiten, API remota solo salud/OpenAPI |

Para consultar la organizacion en pasos `test.step('N. ...')` numerados, utiliza `tests/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.spec.ts`.
El recorrido `tests/web/TC15_web_recorridoDeGastosCompartidosEIndividualesEntreRocioYPablo.spec.ts` muestra dos identidades demo en un mismo navegador.

## JSON propios por caso

La relacion siguiente contiene los 41 JSON web y los 60 API. Cada uno tiene import y consumo en su caso,
sin cambios en las aserciones, pasos, identidades u omisiones.
El AST de `lint:arch` comprueba correspondencia, consumo, option `caseData`, numeracion y ausencia de datos
hardcodeados. Tambien detecta JSON sin spec y exige que todos los archivos de datos figuren en el inventario.

<!-- BEGIN TEST DATA INVENTORY -->
### web

| Archivo | Caso |
| --- | --- |
| `src/data/testData/web/TC01_web_recorridoDeAccesoProtegidoYCierreDeSesion.json` | TC01 |
| `src/data/testData/web/TC02_web_accederAlFrontendPublicadoConservandoLaRutaBase.json` | TC02 |
| `src/data/testData/web/TC03_web_usarLaDemoEstaticaDesdeMovilSinBackend.json` | TC03 |
| `src/data/testData/web/TC04_web_recorridoDeValidacionDelLogin.json` | TC04 |
| `src/data/testData/web/TC05_web_recorridoDeLoginIncorrecto.json` | TC05 |
| `src/data/testData/web/TC06_web_recorridoDeValidacionDelRegistro.json` | TC06 |
| `src/data/testData/web/TC07_web_recorridoDeAltaDeCuentaNueva.json` | TC07 |
| `src/data/testData/web/TC08_web_recorridoDeRecuperacionDeContrasena.json` | TC08 |
| `src/data/testData/web/TC09_web_confirmarYRecuperarUnaCuentaEnLaDemoEstatica.json` | TC09 |
| `src/data/testData/web/TC10_web_recorridoDeCuentaNuevaHastaLaInvitacion.json` | TC10 |
| `src/data/testData/web/TC11_web_intentarInvitarAUnaTerceraPersona.json` | TC11 |
| `src/data/testData/web/TC12_web_recorridoDeGastoCompartidoYBalanceEnLaDemo.json` | TC12 |
| `src/data/testData/web/TC13_web_recorridoDeGastoIndividualYPrivacidadEnLaDemo.json` | TC13 |
| `src/data/testData/web/TC14_web_recorridoDelPanelMockConTeclado.json` | TC14 |
| `src/data/testData/web/TC15_web_recorridoDeGastosCompartidosEIndividualesEntreRocioYPablo.json` | TC15 |
| `src/data/testData/web/TC16_web_consultarElMismoEspacioEnAmbosContextos.json` | TC16 |
| `src/data/testData/web/TC17_web_recargarAmbasSesionesIndependientes.json` | TC17 |
| `src/data/testData/web/TC18_web_confirmarQueSoloPermanecenElPrimerUsuarioYElSegundoUsuario.json` | TC18 |
| `src/data/testData/web/TC19_web_consultarLosMismosDatosSinDuplicadosDesdeLaSegundaCuenta.json` | TC19 |
| `src/data/testData/web/TC20_web_consultarEspacioYRepartoDeAmbosMiembros.json` | TC20 |
| `src/data/testData/web/TC21_web_recargarYComprobarPersistencia.json` | TC21 |
| `src/data/testData/web/TC22_web_ocultarElGastoPrivadoEnGastosYResumenesDeLaSegundaCuenta.json` | TC22 |
| `src/data/testData/web/TC23_web_elGastoNoGeneraBalanceParaNinguno.json` | TC23 |
| `src/data/testData/web/TC24_web_denegarAccesoDirectoAlGastoPrivadoDesdeLaSegundaCuenta.json` | TC24 |
| `src/data/testData/web/TC25_web_conservarElGastoPropioSinRevelarloMedianteFiltrosALaOtraCuenta.json` | TC25 |
| `src/data/testData/web/TC26_web_registrarPagoDe80EurosDesdeLaPrimeraCuenta.json` | TC26 |
| `src/data/testData/web/TC27_web_registrarPagoDe40EurosDesdeLaSegundaCuenta.json` | TC27 |
| `src/data/testData/web/TC28_web_verificarSaldoNetoYPersistenciaDesdeAmbasPerspectivas.json` | TC28 |
| `src/data/testData/web/TC29_web_crearGastoCompartidoYVerloDesdeElSegundoUsuario.json` | TC29 |
| `src/data/testData/web/TC30_web_abrirLaEdicionPorTecladoYModificarElGastoPropio.json` | TC30 |
| `src/data/testData/web/TC31_web_persistirImporteYSaldoActualizado.json` | TC31 |
| `src/data/testData/web/TC32_web_abrirInvitacionEnLaSegundaSesionYRegistrarAlSegundoUsuario.json` | TC32 |
| `src/data/testData/web/TC33_web_ambosConservanElMismoEspacioYNoPuedenCrearOtro.json` | TC33 |
| `src/data/testData/web/TC34_web_cerrarAmbasSesionesYExigirAutenticacion.json` | TC34 |
| `src/data/testData/web/TC35_web_confirmarEspacioCompartidoEIdentidadesDistintas.json` | TC35 |
| `src/data/testData/web/TC36_web_consultarSoloElGastoComunYCrearOtroDesdeLaSegundaCuenta.json` | TC36 |
| `src/data/testData/web/TC37_web_actualizarAmbasVistasSinDuplicadosNiFiltraciones.json` | TC37 |
| `src/data/testData/web/TC38_web_cerrarLaSegundaSesionSinAfectarALaPrimera.json` | TC38 |
| `src/data/testData/web/TC39_web_mostrarSoloElGastoCompartidoSinAccionesAjenasEnLaSegundaCuenta.json` | TC39 |
| `src/data/testData/web/TC40_web_denegarEdicionDirectaDeAmbosGastos.json` | TC40 |
| `src/data/testData/web/TC41_web_recargarYComprobarQueNoHuboCambiosNoAutorizados.json` | TC41 |

### api

| Archivo | Caso |
| --- | --- |
| `src/data/testData/api/TC01_api_consultarSalud.json` | TC01 |
| `src/data/testData/api/TC02_api_consultarOpenApi.json` | TC02 |
| `src/data/testData/api/TC03_api_registrarUsuario.json` | TC03 |
| `src/data/testData/api/TC04_api_reenviarConfirmacion.json` | TC04 |
| `src/data/testData/api/TC05_api_confirmarCorreo.json` | TC05 |
| `src/data/testData/api/TC06_api_iniciarSesion.json` | TC06 |
| `src/data/testData/api/TC07_api_cerrarSesion.json` | TC07 |
| `src/data/testData/api/TC08_api_consultarSesion.json` | TC08 |
| `src/data/testData/api/TC09_api_renovarCsrf.json` | TC09 |
| `src/data/testData/api/TC10_api_solicitarRecuperacion.json` | TC10 |
| `src/data/testData/api/TC11_api_restablecerContrasena.json` | TC11 |
| `src/data/testData/api/TC12_api_consultarPerfil.json` | TC12 |
| `src/data/testData/api/TC13_api_actualizarPerfil.json` | TC13 |
| `src/data/testData/api/TC14_api_buscarUsuarioPorCorreo.json` | TC14 |
| `src/data/testData/api/TC15_api_listarEspacios.json` | TC15 |
| `src/data/testData/api/TC16_api_crearEspacio.json` | TC16 |
| `src/data/testData/api/TC17_api_consultarEspacio.json` | TC17 |
| `src/data/testData/api/TC18_api_actualizarEspacio.json` | TC18 |
| `src/data/testData/api/TC19_api_eliminarEspacioVacio.json` | TC19 |
| `src/data/testData/api/TC20_api_listarMiembros.json` | TC20 |
| `src/data/testData/api/TC21_api_crearInvitacion.json` | TC21 |
| `src/data/testData/api/TC22_api_listarInvitaciones.json` | TC22 |
| `src/data/testData/api/TC23_api_aceptarInvitacion.json` | TC23 |
| `src/data/testData/api/TC24_api_rechazarInvitacion.json` | TC24 |
| `src/data/testData/api/TC25_api_listarCategorias.json` | TC25 |
| `src/data/testData/api/TC26_api_crearCategoria.json` | TC26 |
| `src/data/testData/api/TC27_api_actualizarCategoria.json` | TC27 |
| `src/data/testData/api/TC28_api_eliminarCategoria.json` | TC28 |
| `src/data/testData/api/TC29_api_listarGastos.json` | TC29 |
| `src/data/testData/api/TC30_api_crearGasto.json` | TC30 |
| `src/data/testData/api/TC31_api_consultarGasto.json` | TC31 |
| `src/data/testData/api/TC32_api_actualizarGasto.json` | TC32 |
| `src/data/testData/api/TC33_api_eliminarGasto.json` | TC33 |
| `src/data/testData/api/TC34_api_listarGastosDelEspacio.json` | TC34 |
| `src/data/testData/api/TC35_api_listarIngresos.json` | TC35 |
| `src/data/testData/api/TC36_api_crearIngreso.json` | TC36 |
| `src/data/testData/api/TC37_api_consultarIngreso.json` | TC37 |
| `src/data/testData/api/TC38_api_actualizarIngreso.json` | TC38 |
| `src/data/testData/api/TC39_api_eliminarIngreso.json` | TC39 |
| `src/data/testData/api/TC40_api_listarIngresosDelEspacio.json` | TC40 |
| `src/data/testData/api/TC41_api_consultarBalance.json` | TC41 |
| `src/data/testData/api/TC42_api_consultarResumen.json` | TC42 |
| `src/data/testData/api/TC43_api_listarLiquidaciones.json` | TC43 |
| `src/data/testData/api/TC44_api_crearLiquidacionParcial.json` | TC44 |
| `src/data/testData/api/TC45_api_consultarLiquidacion.json` | TC45 |
| `src/data/testData/api/TC46_api_registrarYConfirmarSinExponerHashes.json` | TC46 |
| `src/data/testData/api/TC47_api_iniciarSesionConCookieHttpOnly.json` | TC47 |
| `src/data/testData/api/TC48_api_exigirCSRFYRevocarLaSesionAlSalir.json` | TC48 |
| `src/data/testData/api/TC49_api_rechazarEntradasYOrigenInvalidos.json` | TC49 |
| `src/data/testData/api/TC50_api_recuperarClaveYRevocarSesiones.json` | TC50 |
| `src/data/testData/api/TC51_api_protegerPerfilYBusquedaExacta.json` | TC51 |
| `src/data/testData/api/TC52_api_protegerGestionDeEspacios.json` | TC52 |
| `src/data/testData/api/TC53_api_limitarInvitacionesYMiembros.json` | TC53 |
| `src/data/testData/api/TC54_api_protegerCategoriasPersonales.json` | TC54 |
| `src/data/testData/api/TC55_api_protegerPrivacidadYPermisosDeGastos.json` | TC55 |
| `src/data/testData/api/TC56_api_protegerIngresosPropios.json` | TC56 |
| `src/data/testData/api/TC57_api_conservarRepartoHistorico.json` | TC57 |
| `src/data/testData/api/TC58_api_limitarLiquidacionesConcurrentesYConservarHistorial.json` | TC58 |
| `src/data/testData/api/TC59_api_persistirRecorridoMultiusuario.json` | TC59 |
| `src/data/testData/api/TC60_api_seedIdempotente.json` | TC60 |

<!-- END TEST DATA INVENTORY -->
