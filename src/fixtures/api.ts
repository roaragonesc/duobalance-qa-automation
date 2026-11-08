import { randomUUID } from 'node:crypto'
import { readdir, readFile, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test as base, expect } from '@playwright/test'
import { apiURL } from '../config/environment'
import { assertDatabase, localApiURL, mailDirectory } from '../config/localEnvironment'

export const test = base.extend<{
  apiIsolation: void
  account: { email: string; name: string; password: string }
  mailToken: (subject: string) => Promise<string>
}>({
  apiIsolation: [
    async ({ baseURL }, provideFixtures, testInfo) => {
      if (process.env.DUOBALANCE_LOCAL_MODE === 'api') {
        assertDatabase(process.env.DUOBALANCE_API_TEST_DATABASE)
        if (baseURL !== localApiURL) throw new Error('La suite local solo puede utilizar el backend aislado en 4180.')
      } else {
        base.skip(!apiURL, 'Bloqueado: falta API_BASE_URL de un backend publico de testing.')
        base.skip(
          !/_api_consultar(Salud|OpenApi)\.spec\.ts$/.test(testInfo.file),
          'Bloqueado: requiere correo local/fixtures y base aislada del backend original; no ejecutar operaciones destructivas remotas.',
        )
        if (baseURL !== apiURL) throw new Error('El proyecto API no utiliza API_BASE_URL.')
      }
      await provideFixtures()
    },
    { auto: true },
  ],
  account: async ({ request: _request }, provideFixtures) => {
    await provideFixtures({
      email: `api-${randomUUID()}@duobalance.test`,
      name: 'Cuenta API',
      password: 'Pruebas1234!',
    })
  },
  mailToken: async ({ account }, provideFixtures) => {
    const directory = mailDirectory()
    const ownedFiles = new Set<string>()
    await provideFixtures(async (subject) => {
      for (const filename of await readdir(directory)) {
        const path = resolve(directory, filename)
        const mail: unknown = JSON.parse(await readFile(path, 'utf8'))
        if (
          typeof mail === 'object' &&
          mail !== null &&
          'to' in mail &&
          mail.to === account.email &&
          'subject' in mail &&
          mail.subject === subject &&
          'text' in mail &&
          typeof mail.text === 'string'
        ) {
          ownedFiles.add(path)
          const value = mail.text.match(/[a-f0-9]{64}/)?.[0]
          if (value) return value
        }
      }
      throw new Error('No se ha encontrado el correo local esperado para este test.')
    })
    for (const path of ownedFiles) await unlink(path)
  },
})

export { expect }
