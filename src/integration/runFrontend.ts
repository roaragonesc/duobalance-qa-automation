import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { frontendRoot } from '../config/localEnvironment'

const appRequire = createRequire(resolve(frontendRoot, 'package.json'))
process.chdir(frontendRoot)
const { createServer } = await import(pathToFileURL(appRequire.resolve('vite')).href)
const server = await createServer({
  root: frontendRoot,
  configFile: resolve(frontendRoot, 'vite.config.ts'),
  optimizeDeps: { entries: [resolve(frontendRoot, 'index.html')] },
  server: { host: '127.0.0.1', port: 4176, strictPort: true },
})
await server.listen()
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void server.close()
  })
}
