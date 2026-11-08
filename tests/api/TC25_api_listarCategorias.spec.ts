import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC25_api_listarCategorias', async ({ household }) => {
  await test.step('1. El usuario A lista sus categorías', async () => {
    const response = await household.a.api.get('categories')
    expect(response.status()).toBe(200)
    expect((await response.json()).categories).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: household.categoryId })]),
    )
  })
})
