import { test, expect } from '../../src/fixtures/endpointApi'

test('TC08_api_consultarSesion', async ({ request, account, authenticatedAccount: _session }) => {
  await test.step('TC66_getAuthMe', async () => {
    const response = await request.get('auth/me')
    expect(response.status()).toBe(200)
    const body = await response.json()
    expect(body.user).toMatchObject({ name: account.name, email: account.email, confirmed: true })
    expect(body.user).not.toHaveProperty('passwordHash')
  })
})
