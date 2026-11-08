import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC48_api_exigirCSRFYRevocarLaSesionAlSalir.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC48_api_exigirCSRFYRevocarLaSesionAlSalir', async ({ request, authenticatedAccount }) => {
  await test.step('1. El cliente intenta cerrar la sesión sin token CSRF y es rechazado', async () => {
    const denied = await request.post('auth/logout', { data: {} })
    expect(denied.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El cliente cierra la sesión con su token CSRF', async () => {
    const logout = await request.post('auth/logout', {
      data: {},
      headers: { 'X-CSRF-Token': authenticatedAccount.csrf },
    })
    expect(logout.status()).toBe(data.expected.httpStatus1)
  })
  await test.step('3. El cliente comprueba que la sesión ha sido revocada', async () => {
    const me = await request.get('auth/me')
    expect(me.status()).toBe(data.expected.httpStatus2)
  })
})
