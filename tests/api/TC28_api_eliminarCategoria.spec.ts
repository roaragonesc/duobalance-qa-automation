import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC28_api_eliminarCategoria.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC28_api_eliminarCategoria', async ({ household }) => {
  await test.step('1. El usuario A elimina su categoría personal', async () => {
    const response = await send(household.a, 'delete', `categories/${household.categoryId}`)
    expect(response.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El usuario A lista sus categorías y comprueba que ya no aparece', async () => {
    const list = await household.a.api.get('categories')
    expect((await list.json()).categories).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: household.categoryId })]),
    )
  })
})
