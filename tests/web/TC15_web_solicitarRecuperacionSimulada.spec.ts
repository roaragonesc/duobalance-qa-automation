import { expect, test } from '../../src/fixtures'
import { journeyUsers } from '../../src/data/journeyUsers'

const ana = journeyUsers.a

test('TC15_web_solicitarRecuperacionSimulada', async ({
  anaAccount: _ana, loginPage, forgotPasswordPage,
}) => {
  await loginPage.openPasswordRecovery()
  await forgotPasswordPage.requestLink(ana.email)
  await expect(forgotPasswordPage.status).toContainText('Si existe una cuenta con ese correo')
})
