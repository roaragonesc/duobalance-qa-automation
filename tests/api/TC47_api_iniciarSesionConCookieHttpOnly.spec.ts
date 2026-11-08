import { test, expect } from '../../src/fixtures/endpointApi'

test('TC47_api_iniciarSesionConCookieHttpOnly', async ({ request, account, confirmedAccount: _confirmed }) => {
  const response = await request.post('auth/login', { data: { email: account.email, password: account.password } })
  expect(response.status()).toBe(200)
  expect(response.headers()['set-cookie']).toContain('HttpOnly')
  expect(response.headers()['set-cookie']).toContain('SameSite=Lax')
  const result = await response.json()
  expect(result.user).toMatchObject({ name: account.name, email: account.email, confirmed: true })
  expect(result.user).not.toHaveProperty('passwordHash')
  expect(result.user).not.toHaveProperty('authVersion')
  expect(result.csrfToken).toMatch(/^[a-f0-9]{64}$/)
  const me = await request.get('auth/me')
  expect(me.status()).toBe(200)
  expect((await me.json()).user.email).toBe(account.email)
})
