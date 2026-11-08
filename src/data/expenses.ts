export const e2eExpenses = {
  supermarket: { description: 'Supermercado E2E', amount: '80,00' },
  hairdresser: { description: 'Peluquería E2E', amount: '35,00', individual: true },
  fuel: { description: 'Gasolina E2E', amount: '40,00' },
} as const

export const demoExpenses = {
  shared: { description: 'Compra compartida Pages', amount: '80,00' },
  private: { description: 'Gasto privado Pages', amount: '35,00', individual: true },
} as const
