import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC10_api_solicitarRecuperacion.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC10_api_solicitarRecuperacion', async ({ request, account, confirmedAccount: _confirmed, mailToken }) => {
  await test.step('1. El cliente solicita la recuperación de la contraseña', async () => {
    const response = await request.post('auth/forgot-password', { data: { email: account.email } })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toEqual({ message: expect.any(String) })
  })
  await test.step('2. El cliente comprueba que el correo recibido contiene un token de recuperación válido', async () => {
    expect(await mailToken(data.expected.mailToken)).toMatch(new RegExp(data.expected.pattern))
  })
})
