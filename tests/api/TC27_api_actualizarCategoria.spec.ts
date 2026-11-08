import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC27_api_actualizarCategoria', async ({ household }) => {
  await test.step('1. El usuario A actualiza su categoría personal', async () => {
    const response = await send(household.a, 'patch', `categories/${household.categoryId}`, {
      name: 'Personal editada',
      icon: 'food',
      color: '#00704A',
    })
    expect(response.status()).toBe(200)
    expect((await response.json()).category).toMatchObject({ _id: household.categoryId, name: 'Personal editada' })
  })
})
