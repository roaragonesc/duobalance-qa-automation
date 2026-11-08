import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC13_api_actualizarPerfil', async ({ actors }) => {
  await test.step('TC71_patchUsersMe', async () => {
    const response = await send(actors.a, 'patch', 'users/me', { name: 'Perfil cambiado' })
    expect(response.status()).toBe(200)
    expect((await response.json()).user.name).toBe('Perfil cambiado')
    expect((await (await actors.b.api.get('users/me')).json()).user.name).toBe(actors.b.name)
  })
})
