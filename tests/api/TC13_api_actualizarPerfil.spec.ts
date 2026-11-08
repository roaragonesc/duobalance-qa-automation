import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC13_api_actualizarPerfil.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC13_api_actualizarPerfil', async ({ actors }) => {
  await test.step('1. El usuario A actualiza su nombre de perfil', async () => {
    const response = await send(actors.a, 'patch', 'users/me', { name: data.inputs.name })
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).user.name).toBe(data.expected.toBe)
  })
  await test.step('2. El usuario B comprueba que su perfil no ha cambiado', async () => {
    expect((await (await actors.b.api.get('users/me')).json()).user.name).toBe(actors.b.name)
  })
})
