import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC03_api_registrarUsuario.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC03_api_registrarUsuario', async ({ request, account }) => {
  await test.step('1. El cliente registra una cuenta nueva', async () => {
    const response = await request.post('auth/register', { data: account })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toEqual({ message: expect.any(String) })
  })
  await test.step('2. El cliente comprueba que no queda ninguna sesión iniciada', async () => {
    expect((await request.get('auth/me')).status()).toBe(data.expected.httpStatus1)
  })
})
