import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC08_api_consultarSesion', async ({ request, account, authenticatedAccount: _session }) => {
  await test.step('1. El cliente consulta la sesión actual y comprueba los datos del usuario', async () => {
    const response = await request.get('auth/me')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.user).toMatchObject({ name: account.name, email: account.email, confirmed: true })
    expect(body.user).not.toHaveProperty('passwordHash')
  })
})
