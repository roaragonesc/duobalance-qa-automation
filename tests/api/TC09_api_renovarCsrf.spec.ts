import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC09_api_renovarCsrf', async ({ request, authenticatedAccount }) => {
  let csrfToken = ''
  await test.step('1. El cliente renueva el token CSRF y comprueba que es distinto del anterior', async () => {
    const response = await request.get('auth/csrf')
    expect(response.status()).toBe(200)
    csrfToken = (await response.json()).csrfToken
    expect(csrfToken).toMatch(/^[a-f0-9]{64}$/)
    expect(csrfToken).not.toBe(authenticatedAccount.csrf)
  })
  await test.step('2. El cliente intenta cerrar la sesión con el token CSRF anterior y es rechazado', async () => {
    expect(
      (
        await request.post('auth/logout', { data: {}, headers: { 'X-CSRF-Token': authenticatedAccount.csrf } })
      ).status(),
    ).toBe(403)
  })
  await test.step('3. El cliente cierra la sesión con el token CSRF renovado', async () => {
    expect((await request.post('auth/logout', { data: {}, headers: { 'X-CSRF-Token': csrfToken } })).status()).toBe(204)
  })
})
