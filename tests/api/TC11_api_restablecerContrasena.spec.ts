import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC11_api_restablecerContrasena.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC11_api_restablecerContrasena', async ({ request, account, confirmedAccount: _confirmed, mailToken }) => {
  let token = ''
  await test.step('1. El cliente solicita la recuperación de la contraseña', async () => {
    const recovery = await request.post('auth/forgot-password', { data: { email: account.email } })
    expect(recovery.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El cliente obtiene el token del correo de recuperación', async () => {
    token = await mailToken(data.inputs.mailToken)
  })
  await test.step('3. El cliente restablece la contraseña con el token', async () => {
    const response = await request.post('auth/reset-password', { data: { token, password: data.inputs.password } })
    expect(response.status()).toBe(data.expected.httpStatus1)
  })
  await test.step('4. El cliente inicia sesión con la contraseña nueva', async () => {
    expect(
      (await request.post('auth/login', { data: { email: account.email, password: data.inputs.password } })).status(),
    ).toBe(data.inputs.toBe)
  })
  await test.step('5. El cliente comprueba que la contraseña anterior ya no es válida', async () => {
    expect(
      (await request.post('auth/login', { data: { email: account.email, password: account.password } })).status(),
    ).toBe(data.inputs.toBe2)
  })
})
