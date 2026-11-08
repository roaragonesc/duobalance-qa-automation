import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC23_api_aceptarInvitacion.json'
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC23_api_aceptarInvitacion', async ({ actors, pendingInvitation }) => {
  await test.step('1. El usuario B acepta la invitación', async () => {
    const response = await send(actors.b, 'post', `invitations/${pendingInvitation.token}/accept`, {})
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toEqual({ spaceId: pendingInvitation.spaceId })
  })
  await test.step('2. El usuario B consulta el espacio y comprueba que es miembro', async () => {
    const space = await actors.b.api.get(`spaces/${pendingInvitation.spaceId}`)
    expect(space.status()).toBe(data.expected.httpStatus)
    expect((await space.json()).space.members).toContain(actors.b.id)
  })
})
