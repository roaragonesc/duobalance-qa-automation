import { test } from '../../src/fixtures'
import { DashboardPage } from '../../src/pages/DashboardPage'
import { ExpensesPage } from '../../src/pages/ExpensesPage'
import { LoginPage } from '../../src/pages/LoginPage'
import { ProfilePage } from '../../src/pages/ProfilePage'

test('TC46_web_cerrarAmbasSesionesYExigirAutenticacion', async ({
  couple: _couple, page, partnerPage,
}) => {
  for (const actor of [page, partnerPage]) {
    const login = new LoginPage(actor)
    await new DashboardPage(actor).visit()
    await new ProfilePage(actor).signOut()
    await login.expectOpen()
    await new ExpensesPage(actor).visit()
    await login.expectOpen()
  }
})
