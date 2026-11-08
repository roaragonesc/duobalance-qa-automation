export const e2eExpenses = {
  supermarket: { description: 'Supermercado E2E', amount: '80,00' },
  hairdresser: { description: 'Peluquería E2E', amount: '35,00', individual: true },
  fuel: { description: 'Gasolina E2E', amount: '40,00' },
} as const

export const demoExpenses = {
  shared: { description: 'Compra compartida Pages', amount: '80,00' },
  private: { description: 'Gasto privado Pages', amount: '35,00', individual: true },
  partnerShared: { description: 'Gasolina compartida Pages', amount: '40,00' },
  partnerPrivate: { description: 'Gasto privado de Pablo Pages', amount: '25,00', individual: true },
} as const

// Nombre visible de la categoria que selecciona ExpensesPage.addExpense.
export const foodCategoryName = 'Alimentación'
