import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC05_api_confirmarCorreo', async ({ request, registeredAccount: _registered, mailToken }) => {
  await test.step('TC63_postAuthConfirmEmail', async () => {
    const token = await mailToken('Confirma tu cuenta de DuoBalance')
    expect((await request.post('auth/confirm-email', { data: { token } })).status()).toBe(204)
    expect((await request.post('auth/confirm-email', { data: { token } })).status()).toBe(400)
  })
})
