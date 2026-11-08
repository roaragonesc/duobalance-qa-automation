import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC09_api_renovarCsrf.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC09_api_renovarCsrf', async ({ request, authenticatedAccount }) => {
  let csrfToken = ''
  await test.step('1. El cliente renueva el token CSRF y comprueba que es distinto del anterior', async () => {
    const response = await request.get('auth/csrf')
    expect(response.status()).toBe(data.expected.httpStatus)
    csrfToken = (await response.json()).csrfToken
    expect(csrfToken).toMatch(new RegExp(data.expected.pattern))
    expect(csrfToken).not.toBe(authenticatedAccount.csrf)
  })
  await test.step('2. El cliente intenta cerrar la sesión con el token CSRF anterior y es rechazado', async () => {
    expect(
      (
        await request.post('auth/logout', { data: {}, headers: { 'X-CSRF-Token': authenticatedAccount.csrf } })
      ).status(),
    ).toBe(data.inputs.toBe)
  })
  await test.step('3. El cliente cierra la sesión con el token CSRF renovado', async () => {
    expect((await request.post('auth/logout', { data: {}, headers: { 'X-CSRF-Token': csrfToken } })).status()).toBe(
      data.expected.httpStatus1,
    )
  })
})
