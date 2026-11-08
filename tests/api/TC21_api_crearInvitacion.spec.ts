import { test, expect, send } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC21_api_crearInvitacion.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC21_api_crearInvitacion', async ({ actors }) => {
  let spaceId = ''
  await test.step('1. El usuario A crea un espacio para invitar', async () => {
    const created = await send(actors.a, 'post', 'spaces', {
      name: data.inputs.name,
      splitMethod: data.inputs.splitMethod,
    })
    expect(created.status()).toBe(data.expected.httpStatus)
    spaceId = (await created.json()).space._id
  })
  await test.step('2. El usuario A invita al usuario B por correo', async () => {
    const response = await send(actors.a, 'post', `spaces/${spaceId}/invitations`, { email: actors.b.email })
    expect(response.status()).toBe(data.expected.httpStatus)
    const body = await response.json()
    expect(body.invitation).toMatchObject({ spaceId, invitedEmail: actors.b.email, status: data.expected.status })
    expect(body.invitation).not.toHaveProperty('tokenHash')
    expect(body.token).toMatch(new RegExp(data.expected.pattern))
  })
})
