import { test, expect, send } from '../../src/fixtures/endpointApi'

test('TC19_api_eliminarEspacioVacio', async ({ actors, pendingInvitation }) => {
  await test.step('TC77_deleteSpacesId', async () => {
    const response = await send(actors.a, 'delete', `spaces/${pendingInvitation.spaceId}`)
    expect(response.status()).toBe(204)
    expect((await actors.a.api.get(`spaces/${pendingInvitation.spaceId}`)).status()).toBe(404)
  })
})
