import { test, expect } from '../../src/fixtures/endpointApi'

test('TC12_api_consultarPerfil', async ({ actors }) => {
  await test.step('TC70_getUsersMe', async () => {
    const response = await actors.a.api.get('users/me')
    expect(response.status()).toBe(200)
    expect((await response.json()).user).toMatchObject({ id: actors.a.id, name: actors.a.name, email: actors.a.email })
  })
})
