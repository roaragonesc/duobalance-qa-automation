import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC06_api_iniciarSesion', async ({ request, account, confirmedAccount: _confirmed }) => {
  await test.step('1. El cliente inicia sesión con una cuenta confirmada', async () => {
    const response = await request.post('auth/login', { data: { email: account.email, password: account.password } })
    expect(response.status()).toBe(200)
    expect(response.headers()['set-cookie']).toContain('HttpOnly')
    expect(await response.json()).toMatchObject({
      user: { email: account.email, confirmed: true },
      csrfToken: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
  })
})
