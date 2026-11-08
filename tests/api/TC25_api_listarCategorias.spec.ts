import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC25_api_listarCategorias.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC25_api_listarCategorias', async ({ household }) => {
  await test.step('1. El usuario A lista sus categorías', async () => {
    const response = await household.a.api.get('categories')
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).categories).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: household.categoryId })]),
    )
  })
})
