import mongoose from 'mongoose'
import { existsSync } from 'node:fs'
import { rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { assertDatabase, localRunDirectory, mongoURL } from '../config/localEnvironment'

export default async function teardown() {
  const database = process.env.DUOBALANCE_API_TEST_DATABASE
  assertDatabase(database)
  const directory = localRunDirectory()
  try {
    const connection = await mongoose.createConnection(mongoURL, {
      dbName: database, serverSelectionTimeoutMS: 10_000,
    }).asPromise()
    try { await connection.dropDatabase() } finally { await connection.close() }
  } finally {
    await writeFile(resolve(directory, 'stop'), '')
    const deadline = Date.now() + 30_000
    while (!existsSync(resolve(directory, 'stopped'))) {
      if (Date.now() > deadline) throw new Error('No se confirmo la parada del backend y MongoDB efimero.')
      await setTimeout(100)
    }
    await rm(directory, { recursive: true })
  }
}
