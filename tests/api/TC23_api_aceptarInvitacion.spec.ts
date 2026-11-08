import { test, expect, send } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

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
