import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC06_api_iniciarSesion.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC06_api_iniciarSesion', async ({ request, account, confirmedAccount: _confirmed }) => {
  await test.step('1. El cliente inicia sesión con una cuenta confirmada', async () => {
    const response = await request.post('auth/login', { data: { email: account.email, password: account.password } })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(response.headers()['set-cookie']).toContain(data.expected.toContain)
    expect(await response.json()).toMatchObject({
      user: { email: account.email, confirmed: data.expected.confirmed },
      csrfToken: expect.stringMatching(new RegExp(data.expected.pattern)),
    })
  })
})
