import { test, expect, send, today } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC30_api_crearGasto.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC30_api_crearGasto', async ({ household }) => {
  await test.step('1. El usuario A crea un gasto compartido', async () => {
    const response = await send(household.a, 'post', 'expenses', {
      spaceId: household.spaceId,
      categoryId: household.categoryId,
      description: data.inputs.description,
      amountCents: data.inputs.amountCents,
      date: today(),
      kind: data.inputs.kind,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).expense).toMatchObject({
      amountCents: data.expected.amountCents,
      ownerBasisPoints: data.expected.ownerBasisPoints,
      createdBy: household.a.id,
    })
  })
})
