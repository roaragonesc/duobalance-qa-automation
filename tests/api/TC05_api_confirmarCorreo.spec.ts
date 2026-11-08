import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC05_api_confirmarCorreo', async ({ request, registeredAccount: _registered, mailToken }) => {
  let token = ''
  await test.step('1. El cliente obtiene el token del correo de confirmación', async () => {
    token = await mailToken('Confirma tu cuenta de DuoBalance')
  })
  await test.step('2. El cliente confirma el correo con el token', async () => {
    expect((await request.post('auth/confirm-email', { data: { token } })).status()).toBe(204)
  })
  await test.step('3. El cliente intenta reutilizar el mismo token y es rechazado', async () => {
    expect((await request.post('auth/confirm-email', { data: { token } })).status()).toBe(400)
  })
})
