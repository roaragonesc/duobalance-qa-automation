import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC19_api_eliminarEspacioVacio.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC19_api_eliminarEspacioVacio', async ({ actors, pendingInvitation }) => {
  await test.step('1. El usuario A elimina el espacio sin otros miembros', async () => {
    const response = await send(actors.a, 'delete', `spaces/${pendingInvitation.spaceId}`)
    expect(response.status()).toBe(data.expected.httpStatus)
  })
  await test.step('2. El usuario A comprueba que el espacio ya no existe', async () => {
    expect((await actors.a.api.get(`spaces/${pendingInvitation.spaceId}`)).status()).toBe(data.expected.httpStatus1)
  })
})
