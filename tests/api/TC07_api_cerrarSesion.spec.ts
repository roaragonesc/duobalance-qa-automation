import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC07_api_cerrarSesion', async ({ request, authenticatedAccount }) => {
  await test.step('TC65_postAuthLogout', async () => {
    const response = await request.post('auth/logout', {
      data: {},
      headers: { 'X-CSRF-Token': authenticatedAccount.csrf },
    })
    expect(response.status()).toBe(204)
    expect((await request.get('auth/me')).status()).toBe(401)
  })
})
