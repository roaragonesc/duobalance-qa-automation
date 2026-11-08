import { test, expect, today } from '../../src/fixtures/endpointApi'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC40_api_listarIngresosDelEspacio', async ({ household, income }) => {
  await test.step('1. El usuario A lista los ingresos del espacio y comprueba los totales', async () => {
    const response = await household.a.api.get(`spaces/${household.spaceId}/incomes`, {
      params: { month: today().slice(0, 7) },
    })
    expect(response.status()).toBe(200)
    expect(await response.json()).toMatchObject({
      incomes: [expect.objectContaining({ id: income.id })],
      totalCents: 90000,
      myCents: 90000,
      partnerCents: 0,
    })
  })
})
