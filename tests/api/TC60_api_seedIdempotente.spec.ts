import { test, expect } from '../../src/fixtures/api'

// Requiere API real: necesita un backend REST de testing aislado y no se puede probar en modo mock (demo de GitHub Pages).
test.skip(true, 'Requiere API real: no se puede probar en modo mock (demo de GitHub Pages).')

test('TC60_api_seedIdempotente', async () => {
  const { database: mongoose } = await import('../../src/integration/backendDatabase')
  const { seed, seedUsers } = await import('../../src/integration/backendSeed')
  const User = await seedUsers()
  const database = process.env.DUOBALANCE_API_TEST_DATABASE
  const previous = process.env.NODE_ENV
  let first: unknown
  let before: unknown
  try {
    await test.step('1. El cliente valida la base de datos de pruebas y activa el entorno de test', async () => {
      if (!database || !/^duobalance_test_[a-f0-9]{32}$/.test(database)) throw new Error('Base seed de test no valida.')
      process.env.NODE_ENV = 'test'
    })
    await test.step('2. El cliente conecta con la base de datos de pruebas', async () => {
      await mongoose.connect('mongodb://127.0.0.1:27018', { dbName: database })
    })
    await test.step('3. El cliente ejecuta la siembra por primera vez y guarda el usuario sembrado', async () => {
      first = await seed('SeedPruebas123!')
      before = await User.findOne({ email: 'rocio@duobalance.test' }).select('+passwordHash').lean()
    })
    await test.step('4. El cliente ejecuta la siembra por segunda vez y comprueba que el resultado es idéntico', async () => {
      const second = await seed('SeedPruebas123!')
      expect(second).toEqual(first)
    })
    await test.step('5. El cliente comprueba que el usuario sembrado no ha cambiado', async () => {
      const after = await User.findOne({ email: 'rocio@duobalance.test' }).select('+passwordHash').lean()
      expect(after).toEqual(before)
    })
    await test.step('6. El cliente cuenta los documentos sembrados de cada colección', async () => {
      const seededCounts: Record<string, number> = {}
      for (const name of ['spaces', 'expenses', 'incomes', 'categories', 'settlements']) {
        seededCounts[name] = await mongoose.connection.collection(name).countDocuments({ seedKey: { $exists: true } })
      }
      expect(seededCounts).toEqual({ spaces: 2, expenses: 14, incomes: 6, categories: 7, settlements: 1 })
    })
    await test.step('7. El cliente lista las colecciones y comprueba que existen las esperadas', async () => {
      const collections = await mongoose.connection.db?.listCollections({}, { nameOnly: true }).toArray()
      expect(collections?.map((item) => item.name)).toEqual(
        expect.arrayContaining(['users', 'spaces', 'expenses', 'incomes', 'categories', 'invitations', 'settlements']),
      )
    })
    await test.step('8. El cliente consulta los usuarios sembrados y comprueba sus nombres y hashes', async () => {
      const users = await User.find({
        email: {
          $in: [
            'nuevo@duobalance.test',
            'solo@duobalance.test',
            'rocio@duobalance.test',
            'pablo@duobalance.test',
            'ines@duobalance.test',
            'mateo@duobalance.test',
          ],
        },
      }).select('+passwordHash')
      expect(users.map((item) => item.name).sort()).toEqual(
        ['Curro', 'Isabel', 'Juan', 'Maria', 'Pablo', 'Rocío'].sort(),
      )
      for (const user of users) expect(user.passwordHash).toMatch(/^\$argon2id\$/)
    })
  } finally {
    await mongoose.disconnect()
    if (previous === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = previous
  }
})
