import { test, expect } from '../../src/fixtures/endpointApi'
import testData from '../../src/data/testData/api/TC22_api_listarInvitaciones.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC22_api_listarInvitaciones', async ({ actors, pendingInvitation }) => {
  await test.step('1. El usuario B lista sus invitaciones y comprueba la pendiente', async () => {
    const response = await actors.b.api.get('invitations')
    expect(response.status()).toBe(data.expected.httpStatus)
    expect((await response.json()).invitations).toEqual([
      expect.objectContaining({
        spaceId: pendingInvitation.spaceId,
        invitedEmail: actors.b.email,
        status: data.expected.status,
      }),
    ])
  })
})
