import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC07_api_cerrarSesion.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC07_api_cerrarSesion', async ({ request, authenticatedAccount }) => {
  await test.step('1. El cliente cierra la sesión con su token CSRF', async () => {
    const response = await request.post('auth/logout', {
      data: {},
      headers: { 'X-CSRF-Token': authenticatedAccount.csrf },
    })
    expect(response.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El cliente comprueba que la sesión ya no está activa', async () => {
    expect((await request.get('auth/me')).status()).toBe(data.expected.httpStatus1)
  })
})
