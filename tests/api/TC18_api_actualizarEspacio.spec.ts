import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC18_api_actualizarEspacio.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC18_api_actualizarEspacio', async ({ household }) => {
  await test.step('1. El usuario A actualiza el nombre y el método de reparto del espacio', async () => {
    const response = await send(household.a, 'patch', `spaces/${household.spaceId}`, {
      name: data.inputs.name,
      splitMethod: data.inputs.splitMethod,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).space).toMatchObject({
      name: data.expected.name,
      splitMethod: data.expected.splitMethod,
    })
  })
})
