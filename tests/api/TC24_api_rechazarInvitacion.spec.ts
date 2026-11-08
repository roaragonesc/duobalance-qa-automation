import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC24_api_rechazarInvitacion.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC24_api_rechazarInvitacion', async ({ actors, pendingInvitation }) => {
  await test.step('1. El usuario B rechaza la invitación', async () => {
    const response = await send(actors.b, 'post', `invitations/${pendingInvitation.token}/reject`, {})
    expect(response.status()).toBe(data.expected.httpStatus)
    expect(await response.json()).toEqual({ spaceId: pendingInvitation.spaceId })
  })
  await test.step('2. El usuario B lista sus invitaciones y comprueba que consta como rechazada', async () => {
    const list = await actors.b.api.get('invitations')
    expect((await list.json()).invitations).toEqual([expect.objectContaining({ status: data.expected.status })])
  })
  await test.step('3. El usuario B comprueba que no tiene acceso al espacio', async () => {
    expect((await actors.b.api.get(`spaces/${pendingInvitation.spaceId}`)).status()).toBe(data.expected.httpStatus1)
  })
})
