import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC33_api_eliminarGasto.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC33_api_eliminarGasto', async ({ household, expense }) => {
  await test.step('1. El usuario A elimina su gasto', async () => {
    const response = await send(household.a, 'delete', `expenses/${expense.id}`)
    expect(response.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El usuario A comprueba que el gasto ya no existe', async () => {
    expect((await household.a.api.get(`expenses/${expense.id}`)).status()).toBe(data.expected.httpStatus1)
  })
})
