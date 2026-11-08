import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC28_api_eliminarCategoria', async ({ household }) => {
  await test.step('TC86_deleteCategoriesId', async () => {
    const response = await send(household.a, 'delete', `categories/${household.categoryId}`)
    expect(response.status()).toBe(204)
    const list = await household.a.api.get('categories')
    expect((await list.json()).categories).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: household.categoryId })]),
    )
  })
})
