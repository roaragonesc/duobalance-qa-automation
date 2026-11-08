import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { appRoot } from '../config/localEnvironment'

const appRequire = createRequire(resolve(appRoot, 'package.json'))
process.chdir(appRoot)
const { createServer } = await import(pathToFileURL(appRequire.resolve('vite')).href)
const server = await createServer({
  root: appRoot,
  configFile: resolve(appRoot, 'vite.config.ts'),
  optimizeDeps: { entries: [resolve(appRoot, 'index.html')] },
  server: { host: '127.0.0.1', port: 4176, strictPort: true },
})
await server.listen()
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => { void server.close() })
}
