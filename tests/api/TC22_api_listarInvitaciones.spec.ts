import { test, expect } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC22_api_listarInvitaciones', async ({ actors, pendingInvitation }) => {
  await test.step('TC80_getInvitations', async () => {
    const response = await actors.b.api.get('invitations')
    expect(response.status()).toBe(200)
    expect((await response.json()).invitations).toEqual([
      expect.objectContaining({
        spaceId: pendingInvitation.spaceId,
        invitedEmail: actors.b.email,
        status: 'pending',
      }),
    ])
  })
})
