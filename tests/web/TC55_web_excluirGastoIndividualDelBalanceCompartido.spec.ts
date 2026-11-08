import { expect, test } from '../../src/fixtures'

test('TC55_web_excluirGastoIndividualDelBalanceCompartido', async ({
  demoPrivateExpense: _expense,
  navigation,
  balancePage,
}) => {
  await navigation.open('Balance')
  await expect(balancePage.monthSummary).toContainText('705,80')
  await expect(balancePage.monthBalance).toContainText('227,10')
  await expect(balancePage.debtSummary).toContainText('354,20')
})
