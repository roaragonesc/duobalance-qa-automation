import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC03_api_registrarUsuario', async ({ request, account }) => {
  await test.step('TC61_postAuthRegister', async () => {
    const response = await request.post('auth/register', { data: account })
    expect(response.status()).toBe(202)
    expect(await response.json()).toEqual({ message: expect.any(String) })
    expect((await request.get('auth/me')).status()).toBe(401)
  })
})
