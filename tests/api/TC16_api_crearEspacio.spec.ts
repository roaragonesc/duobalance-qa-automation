import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC16_api_crearEspacio.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC16_api_crearEspacio', async ({ actors }) => {
  await test.step('1. El usuario A crea un espacio nuevo', async () => {
    const response = await send(actors.a, 'post', 'spaces', {
      name: data.inputs.name,
      splitMethod: data.inputs.splitMethod,
    })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).space).toMatchObject({
      name: data.expected.name,
      createdBy: actors.a.id,
      members: [actors.a.id],
      splitMethod: data.expected.splitMethod,
    })
  })
})
