import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'
import { BalancePage } from '../../src/pages/BalancePage'
import { ProfilePage } from '../../src/pages/ProfilePage'
import { SpacePage } from '../../src/pages/SpacePage'

// Requiere API real: necesita dos sesiones con datos compartidos y no se puede probar en modo mock.
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC20_web_consultarEspacioYRepartoDeAmbosMiembros', async ({ sharedExpense: _shared, page, partnerPage }) => {
  const anaProfile = new ProfilePage(page)
  const anaSpace = new SpacePage(page)
  const anaBalance = new BalancePage(page)
  const luisProfile = new ProfilePage(partnerPage)
  const luisSpace = new SpacePage(partnerPage)
  const luisBalance = new BalancePage(partnerPage)

  await test.step('1. Ana abre su perfil y comprueba que es Ana', async () => {
    await anaProfile.visit()
    await expect(anaProfile.nameHeading(journeyUsers.a.name)).toBeVisible()
    await expect(anaProfile.emailText(journeyUsers.a.email)).toBeVisible()
  })

  await test.step('2. Ana consulta el espacio y su reparto 50 % / 50 %', async () => {
    await anaSpace.visit()
    await expect(anaSpace.heading('Hogar E2E')).toBeVisible()
    await expect(anaSpace.summary).toContainText('50 % / 50 %')
  })

  await test.step('3. Ana consulta su aportación en el balance', async () => {
    await anaBalance.visit()
    await expect(anaBalance.ownContribution).toContainText('40,00')
    await expect(anaBalance.ownContribution).toContainText('50')
  })

  await test.step('4. Luis abre su perfil y comprueba que es Luis', async () => {
    await luisProfile.visit()
    await expect(luisProfile.nameHeading(journeyUsers.b.name)).toBeVisible()
    await expect(luisProfile.emailText(journeyUsers.b.email)).toBeVisible()
  })

  await test.step('5. Luis consulta el espacio y su reparto 50 % / 50 %', async () => {
    await luisSpace.visit()
    await expect(luisSpace.heading('Hogar E2E')).toBeVisible()
    await expect(luisSpace.summary).toContainText('50 % / 50 %')
  })

  await test.step('6. Luis consulta su aportación en el balance', async () => {
    await luisBalance.visit()
    await expect(luisBalance.ownContribution).toContainText('40,00')
    await expect(luisBalance.ownContribution).toContainText('50')
  })
})
