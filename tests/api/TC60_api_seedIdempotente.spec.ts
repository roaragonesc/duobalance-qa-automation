import { test, expect } from '../../src/fixtures/api'
import testData from '../../src/data/testData/api/TC60_api_seedIdempotente.json' with { type: 'json' }
import { defineCaseData } from '../../src/utils/caseData'
import { mongoURL } from '../../src/config/localEnvironment'

const data = defineCaseData(testData)
test.use({ caseData: data.setup })

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
      if (!database || !/^duobalance_test_[a-f0-9]{32}$/.test(database)) throw new Error(data.inputs.value)
      process.env.NODE_ENV = 'test'
    })
    await test.step('2. El cliente conecta con la base de datos de pruebas', async () => {
      await mongoose.connect(mongoURL, { dbName: database })
    })
    await test.step('3. El cliente ejecuta la siembra por primera vez y guarda el usuario sembrado', async () => {
      first = await seed(data.inputs.seed)
      before = await User.findOne({ email: data.inputs.email }).select('+passwordHash').lean()
    })
    await test.step('4. El cliente ejecuta la siembra por segunda vez y comprueba que el resultado es idéntico', async () => {
      const second = await seed(data.inputs.seed)
      expect(second).toEqual(first)
    })
    await test.step('5. El cliente comprueba que el usuario sembrado no ha cambiado', async () => {
      const after = await User.findOne({ email: data.inputs.email }).select('+passwordHash').lean()
      expect(after).toEqual(before)
    })
    await test.step('6. El cliente cuenta los documentos sembrados de cada colección', async () => {
      const seededCounts: Record<string, number> = {}
      for (const name of [
        data.inputs.value3,
        data.inputs.value4,
        data.inputs.value5,
        data.inputs.value6,
        data.inputs.value7,
      ]) {
        seededCounts[name] = await mongoose.connection.collection(name).countDocuments({ seedKey: { $exists: true } })
      }
      expect(seededCounts).toEqual({
        spaces: data.expected.spaces,
        expenses: data.expected.expenses,
        incomes: data.expected.incomes,
        categories: data.expected.categories,
        settlements: data.expected.settlements,
      })
    })
    await test.step('7. El cliente lista las colecciones y comprueba que existen las esperadas', async () => {
      const collections = await mongoose.connection.db?.listCollections({}, { nameOnly: true }).toArray()
      expect(collections?.map((item) => item.name)).toEqual(
        expect.arrayContaining([
          data.expected.arrayContaining,
          data.expected.arrayContaining8,
          data.expected.arrayContaining9,
          data.expected.arrayContaining10,
          data.expected.arrayContaining11,
          data.expected.arrayContaining12,
          data.expected.arrayContaining13,
        ]),
      )
    })
    await test.step('8. El cliente consulta los usuarios sembrados y comprueba sus nombres y hashes', async () => {
      const users = await User.find({
        email: {
          $in: [
            data.inputs.find,
            data.inputs.find14,
            data.inputs.find15,
            data.inputs.find16,
            data.inputs.find17,
            data.inputs.find18,
          ],
        },
      }).select('+passwordHash')
      expect(users.map((item) => item.name).sort()).toEqual(
        [
          data.expected.sort,
          data.expected.sort19,
          data.expected.sort20,
          data.expected.sort21,
          data.expected.sort22,
          data.expected.sort23,
        ].sort(),
      )
      for (const user of users) expect(user.passwordHash).toMatch(new RegExp(data.expected.pattern))
    })
  } finally {
    await mongoose.disconnect()
    if (previous === undefined) delete process.env.NODE_ENV
    else process.env.NODE_ENV = previous
  }
})
