import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC18_api_actualizarEspacio', async ({ household }) => {
  await test.step('TC76_patchSpacesId', async () => {
    const response = await send(household.a, 'patch', `spaces/${household.spaceId}`, {
      name: 'Reparto cambiado',
      splitMethod: 'proportional',
    })
    expect(response.status()).toBe(200)
    expect((await response.json()).space).toMatchObject({ name: 'Reparto cambiado', splitMethod: 'proportional' })
  })
})
