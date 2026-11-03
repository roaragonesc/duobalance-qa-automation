import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { appRoot } from './localEnvironment'

const backendRequire = createRequire(resolve(appRoot, 'backend/package.json'))
export const database: typeof import('mongoose').default = backendRequire('mongoose')
