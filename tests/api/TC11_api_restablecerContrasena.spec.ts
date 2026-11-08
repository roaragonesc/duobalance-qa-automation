import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC11_api_restablecerContrasena', async ({ request, account, confirmedAccount: _confirmed, mailToken }) => {
  let token = ''
  await test.step('1. El cliente solicita la recuperación de la contraseña', async () => {
    const recovery = await request.post('auth/forgot-password', { data: { email: account.email } })
    expect(recovery.status()).toBe(202)
  })
  await test.step('2. El cliente obtiene el token del correo de recuperación', async () => {
    token = await mailToken('Recupera tu contraseña de DuoBalance')
  })
  await test.step('3. El cliente restablece la contraseña con el token', async () => {
    const response = await request.post('auth/reset-password', { data: { token, password: 'Renovada123!' } })
    expect(response.status()).toBe(204)
  })
  await test.step('4. El cliente inicia sesión con la contraseña nueva', async () => {
    expect(
      (await request.post('auth/login', { data: { email: account.email, password: 'Renovada123!' } })).status(),
    ).toBe(200)
  })
  await test.step('5. El cliente comprueba que la contraseña anterior ya no es válida', async () => {
    expect(
      (await request.post('auth/login', { data: { email: account.email, password: account.password } })).status(),
    ).toBe(401)
  })
})
