import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC16_api_crearEspacio', async ({ actors }) => {
  await test.step('1. El usuario A crea un espacio nuevo', async () => {
    const response = await send(actors.a, 'post', 'spaces', { name: 'Espacio nuevo', splitMethod: 'equal' })
    expect(response.status()).toBe(201)
    expect((await response.json()).space).toMatchObject({
      name: 'Espacio nuevo',
      createdBy: actors.a.id,
      members: [actors.a.id],
      splitMethod: 'equal',
    })
  })
})
