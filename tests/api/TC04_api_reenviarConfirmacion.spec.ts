import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC04_api_reenviarConfirmacion', async ({ request, account, registeredAccount: _registered, mailToken }) => {
  await test.step('1. El cliente solicita el reenvío del correo de confirmación', async () => {
    const response = await request.post('auth/resend-confirmation', { data: { email: account.email } })
    expect(response.status()).toBe(202)
    expect(await response.json()).toEqual({ message: expect.any(String) })
  })
  await test.step('2. El cliente comprueba que el correo recibido contiene un token de confirmación válido', async () => {
    expect(await mailToken('Confirma tu cuenta de DuoBalance')).toMatch(/^[a-f0-9]{64}$/)
  })
})
