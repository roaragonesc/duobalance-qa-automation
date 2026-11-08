import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC26_api_crearCategoria', async ({ actors }) => {
  await test.step('TC84_postCategories', async () => {
    const response = await send(actors.a, 'post', 'categories', {
      name: 'Personal nueva',
      icon: 'food',
      color: '#00704A',
    })
    expect(response.status()).toBe(201)
    expect((await response.json()).category).toMatchObject({ name: 'Personal nueva', icon: 'food', color: '#00704A' })
  })
})
