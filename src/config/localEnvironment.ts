import { randomUUID } from 'node:crypto'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export const frameworkRoot = fileURLToPath(new URL('../../', import.meta.url))
export const appRoot = resolve(process.env.DUOBALANCE_APP_PATH ?? resolve(frameworkRoot, '../duobalance'))
export const backendRoot = resolve(appRoot, 'apps/api')
export const frontendRoot = resolve(appRoot, 'apps/web')
export const localApiURL = 'http://127.0.0.1:4180/api/v1/'
export const localFrontendURL = 'http://127.0.0.1:4176'
export const apiOrigin = 'http://localhost:5173'
export const mongoURL = 'mongodb://127.0.0.1:27018'

export function assertDatabase(database: string | undefined): asserts database is string {
  if (!database || !/^duobalance_test_[a-f0-9]{32}$/.test(database)) {
    throw new Error('Entorno local bloqueado: falta una base aleatoria duobalance_test_<UUID>.')
  }
}

export function configureLocal(mode: 'api' | 'api-e2e') {
  if (!existsSync(resolve(backendRoot, 'src/server.ts'))) {
    throw new Error(`No existe el backend en ${appRoot}. Configura DUOBALANCE_APP_PATH con el checkout de DuoBalance.`)
  }
  process.env.DUOBALANCE_LOCAL_MODE = mode
  const database = process.env.DUOBALANCE_API_TEST_DATABASE ?? `duobalance_test_${randomUUID().replaceAll('-', '')}`
  assertDatabase(database)
  process.env.DUOBALANCE_API_TEST_DATABASE = database
  const runDirectory = resolve(frameworkRoot, 'test-results', `local-${mode}`, database)
  process.env.DUOBALANCE_TEST_MAIL_DIRECTORY = resolve(runDirectory, 'mail')
  process.env.DUOBALANCE_LOCAL_RUN_DIRECTORY = runDirectory
  process.env.API_BASE_URL = localApiURL
  process.env.BASE_URL = mode === 'api' ? apiOrigin : localFrontendURL
  process.env.NODE_ENV = 'test'
  process.env.HOST = '127.0.0.1'
  process.env.PORT = '4180'
  process.env.FRONTEND_ORIGIN = mode === 'api' ? apiOrigin : localFrontendURL
  process.env.MONGODB_URI = mongoURL
  process.env.MONGODB_DATABASE = database
  process.env.SEED_TEST_DATA = '0'
  return { database, runDirectory }
}

export function localRunDirectory(): string {
  const database = process.env.DUOBALANCE_API_TEST_DATABASE
  assertDatabase(database)
  const mode = process.env.DUOBALANCE_LOCAL_MODE
  if (mode !== 'api' && mode !== 'api-e2e') throw new Error('Falta el modo local aislado.')
  const expected = resolve(frameworkRoot, 'test-results', `local-${mode}`, database)
  if (process.env.DUOBALANCE_LOCAL_RUN_DIRECTORY !== expected)
    throw new Error('Directorio local de ejecucion invalido.')
  return expected
}

export function mailDirectory(): string {
  return resolve(localRunDirectory(), 'mail')
}
