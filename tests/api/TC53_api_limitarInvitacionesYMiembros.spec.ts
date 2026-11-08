import { test, expect, send } from '../../src/fixtures/financeApi'
import testData from '../../src/data/testData/api/TC53_api_limitarInvitacionesYMiembros.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).

test('TC53_api_limitarInvitacionesYMiembros', async ({ actors }) => {
  const { a, b, outsider } = actors
  let id = ''
  let token = ''
  await test.step('1. El usuario A crea un espacio nuevo', async () => {
    const created = await send(a, 'post', 'spaces', { name: data.inputs.name, splitMethod: data.inputs.splitMethod })
    expect(created.status()).toBe(data.expected.httpStatus)
    id = (await created.json()).space._id
  })
  await test.step('2. El usuario A invita al usuario B sin exponer el hash del token', async () => {
    const invitation = await send(a, 'post', `spaces/${id}/invitations`, { email: b.email })
    expect(invitation.status()).toBe(data.expected.httpStatus)
    const { token: invitationToken, invitation: body } = await invitation.json()
    token = invitationToken
    expect(body).not.toHaveProperty('tokenHash')
  })
  await test.step('3. Un usuario ajeno intenta aceptar la invitación y no la encuentra', async () => {
    expect((await send(outsider, 'post', `invitations/${token}/accept`, {})).status()).toBe(data.expected.httpStatus1)
  })
  await test.step('4. El usuario B acepta la invitación', async () => {
    expect((await send(b, 'post', `invitations/${token}/accept`, {})).status()).toBe(data.expected.httpStatus2)
  })
  await test.step('5. El usuario B intenta reutilizar la invitación y no la encuentra', async () => {
    expect((await send(b, 'post', `invitations/${token}/accept`, {})).status()).toBe(data.expected.httpStatus1)
  })
  await test.step('6. El usuario A consulta los miembros y comprueba que hay dos', async () => {
    const members = await a.api.get(`spaces/${id}/members`)
    expect((await members.json()).members).toHaveLength(data.expected.toHaveLength)
  })
  await test.step('7. El usuario A intenta invitar a un tercer usuario y es rechazado', async () => {
    expect((await send(a, 'post', `spaces/${id}/invitations`, { email: outsider.email })).status()).toBe(
      data.expected.httpStatus3,
    )
  })
})
