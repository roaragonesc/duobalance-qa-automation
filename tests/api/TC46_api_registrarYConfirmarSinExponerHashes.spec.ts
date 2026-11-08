import { test, expect } from '../../src/fixtures/api'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC46_api_registrarYConfirmarSinExponerHashes', async ({ request, account, mailToken }) => {
  let confirmationToken = ''
  await test.step('1. El cliente registra una cuenta nueva', async () => {
    const registration = await request.post('auth/register', { data: account })
    expect(registration.status()).toBe(202)
  })
  await test.step('2. El cliente obtiene el token del correo de confirmación', async () => {
    confirmationToken = await mailToken('Confirma tu cuenta de DuoBalance')
  })
  await test.step('3. El cliente confirma el correo con el token', async () => {
    const confirmation = await request.post('auth/confirm-email', { data: { token: confirmationToken } })
    expect(confirmation.status()).toBe(204)
  })
  await test.step('4. El cliente intenta reutilizar el token y es rechazado', async () => {
    const reused = await request.post('auth/confirm-email', { data: { token: confirmationToken } })
    expect(reused.status()).toBe(400)
  })
})
