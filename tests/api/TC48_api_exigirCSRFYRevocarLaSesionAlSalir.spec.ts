import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC48_api_exigirCSRFYRevocarLaSesionAlSalir', async ({ request, authenticatedAccount }) => {
  const denied = await request.post('auth/logout', { data: {} })
  expect(denied.status()).toBe(403)
  const logout = await request.post('auth/logout', { data: {}, headers: { 'X-CSRF-Token': authenticatedAccount.csrf } })
  expect(logout.status()).toBe(204)
  const me = await request.get('auth/me')
  expect(me.status()).toBe(401)
})
