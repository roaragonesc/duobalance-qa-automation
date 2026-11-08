import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC08_api_consultarSesion.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC08_api_consultarSesion', async ({ request, account, authenticatedAccount: _session }) => {
  await test.step('1. El cliente consulta la sesión actual y comprueba los datos del usuario', async () => {
    const response = await request.get('auth/me')
    expect(response.status()).toBe(data.expected.httpStatus)
    const body = await response.json()
    expect(body.user).toMatchObject({ name: account.name, email: account.email, confirmed: data.expected.confirmed })
    expect(body.user).not.toHaveProperty('passwordHash')
  })
})
