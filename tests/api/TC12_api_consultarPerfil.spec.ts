import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC12_api_consultarPerfil', async ({ actors }) => {
  await test.step('1. El usuario A consulta su perfil', async () => {
    const response = await actors.a.api.get('users/me')
    expect(response.status()).toBe(200)
    expect((await response.json()).user).toMatchObject({ id: actors.a.id, name: actors.a.name, email: actors.a.email })
  })
})
