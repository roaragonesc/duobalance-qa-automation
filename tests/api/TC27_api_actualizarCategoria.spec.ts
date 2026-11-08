import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC27_api_actualizarCategoria.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC27_api_actualizarCategoria', async ({ household }) => {
  await test.step('1. El usuario A actualiza su categoría personal', async () => {
    const response = await send(household.a, 'patch', `categories/${household.categoryId}`, {
      name: data.inputs.name,
      icon: data.inputs.icon,
      color: data.inputs.color,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).category).toMatchObject({ _id: household.categoryId, name: data.expected.name })
  })
})
