import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC32_api_actualizarGasto.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC32_api_actualizarGasto', async ({ household, expense }) => {
  await test.step('1. El usuario A actualiza el importe de su gasto', async () => {
    const response = await send(household.a, 'patch', `expenses/${expense.id}`, {
      ...expense.input,
      amountCents: data.inputs.amountCents,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).expense).toMatchObject({
      _id: expense.id,
      amountCents: data.expected.amountCents,
      ownerBasisPoints: data.expected.ownerBasisPoints,
    })
  })
})
