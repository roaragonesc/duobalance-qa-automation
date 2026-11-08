import { test, expect } from '../../src/fixtures/endpointApi'

test('TC22_api_listarInvitaciones', async ({ actors, pendingInvitation }) => {
  await test.step('TC80_getInvitations', async () => {
    const response = await actors.b.api.get('invitations')
    expect(response.status()).toBe(200)
    expect((await response.json()).invitations).toEqual([expect.objectContaining({
      spaceId: pendingInvitation.spaceId, invitedEmail: actors.b.email, status: 'pending',
    })])
  })
})
