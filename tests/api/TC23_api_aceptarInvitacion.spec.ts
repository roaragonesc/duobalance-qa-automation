import { test, expect, send } from '../../src/fixtures/endpointApi'

test('TC23_api_aceptarInvitacion', async ({ actors, pendingInvitation }) => {
  await test.step('TC81_postInvitationsTokenAccept', async () => {
    const response = await send(actors.b, 'post', `invitations/${pendingInvitation.token}/accept`, {})
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ spaceId: pendingInvitation.spaceId })
    const space = await actors.b.api.get(`spaces/${pendingInvitation.spaceId}`)
    expect(space.status()).toBe(200)
    expect((await space.json()).space.members).toContain(actors.b.id)
  })
})
