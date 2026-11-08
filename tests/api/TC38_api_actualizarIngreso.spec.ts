import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC38_api_actualizarIngreso.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC38_api_actualizarIngreso', async ({ household, income }) => {
  await test.step('1. El usuario A actualiza el importe de su ingreso', async () => {
    const response = await send(household.a, 'patch', `incomes/${income.id}`, {
      ...income.input,
      amountCents: data.inputs.amountCents,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).income).toMatchObject({ _id: income.id, amountCents: data.expected.amountCents })
  })
})
