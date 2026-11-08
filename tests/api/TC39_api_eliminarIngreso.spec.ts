import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC39_api_eliminarIngreso.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC39_api_eliminarIngreso', async ({ household, income }) => {
  await test.step('1. El usuario A elimina su ingreso', async () => {
    const response = await send(household.a, 'delete', `incomes/${income.id}`)
    expect(response.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El usuario A comprueba que el ingreso ya no existe', async () => {
    expect((await household.a.api.get(`incomes/${income.id}`)).status()).toBe(data.expected.httpStatus1)
  })
})
