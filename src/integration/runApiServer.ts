import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'node:net'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import { backendRoot, assertDatabase, localRunDirectory, mailDirectory, mongoURL } from '../config/localEnvironment'
import { database } from './backendDatabase'
import { seed } from './backendSeed'

async function main() {
  assertDatabase(process.env.MONGODB_DATABASE)
  if (process.env.MONGODB_DATABASE !== process.env.DUOBALANCE_API_TEST_DATABASE || process.env.MONGODB_URI !== mongoURL)
    throw new Error('El backend local solo puede utilizar la base y MongoDB propios de esta ejecucion.')
  for (const port of [4180, 27018]) {
    await new Promise<void>((done, fail) => {
      const probe = createServer()
      probe.once('error', fail)
      probe.listen(port, '127.0.0.1', () => probe.close((error) => (error ? fail(error) : done())))
    })
  }
  const runDirectory = localRunDirectory()
  await mkdir(mailDirectory(), { recursive: true })
  let mongo: MongoMemoryReplSet
  try {
    mongo = await MongoMemoryReplSet.create({
      instanceOpts: [{ port: 27018, launchTimeout: 60_000 }],
      replSet: { count: 1, storageEngine: 'wiredTiger' },
      binary: { version: '8.0.17' },
    })
  } catch (error) {
    await rm(runDirectory, { recursive: true })
    throw error
  }
  let backend: ReturnType<typeof spawn> | undefined
  let stopping: Promise<void> | undefined
  let watcher: NodeJS.Timeout | undefined
  const stop = () =>
    (stopping ??= (async () => {
      if (watcher) clearInterval(watcher)
      if (backend && backend.exitCode === null && backend.signalCode === null) {
        const exited = new Promise<void>((done) => backend!.once('exit', () => done()))
        backend.kill('SIGTERM')
        await exited
      }
      await mongo.stop()
      await writeFile(resolve(runDirectory, 'stopped'), '')
    })())
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      void stop().catch((error) => {
        console.error(error)
        process.exitCode = 1
      })
    })
  }
  try {
    if (process.env.SEED_TEST_DATA === '1') {
      await database.connect(mongoURL, { dbName: process.env.MONGODB_DATABASE })
      try {
        await seed('SeedPruebas123!')
      } finally {
        await database.disconnect()
      }
    }
    // Bypass backend .env and watch mode; only the explicit test environment is used.
    backend = spawn(process.execPath, ['--import', import.meta.resolve('tsx'), resolve(backendRoot, 'src/server.ts')], {
      cwd: backendRoot,
      env: { ...process.env, MAIL_DIRECTORY: mailDirectory() },
      stdio: 'inherit',
    })
    backend.on('error', (error) => {
      console.error('No se pudo iniciar el backend aislado.', error)
      process.exitCode = 1
      void stop()
    })
    backend.on('exit', (code) => {
      if (!stopping) {
        console.error(`El backend aislado termino inesperadamente: ${code}.`)
        process.exitCode = 1
        void stop()
      }
    })
    watcher = setInterval(() => {
      if (existsSync(resolve(runDirectory, 'stop'))) {
        void stop().catch((error) => {
          console.error(error)
          process.exitCode = 1
        })
      }
    }, 100)
  } catch (error) {
    await stop()
    throw error
  }
}

main().catch((error: unknown) => {
  console.error('No se pudo iniciar el entorno local aislado.', error)
  process.exitCode = 1
})
