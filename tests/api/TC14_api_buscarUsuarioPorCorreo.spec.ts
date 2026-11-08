import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC14_api_buscarUsuarioPorCorreo', async ({ actors }) => {
  await test.step('1. El usuario A busca al usuario B por su correo exacto', async () => {
    const response = await actors.a.api.get('users', { params: { email: actors.b.email } })
    expect(response.status()).toBe(200)
    expect((await response.json()).users).toEqual([{ id: actors.b.id, name: actors.b.name, email: actors.b.email }])
  })
})
