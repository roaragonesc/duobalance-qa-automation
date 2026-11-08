import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { backendRoot } from '../config/localEnvironment'

const backendRequire = createRequire(resolve(backendRoot, 'package.json'))
export const database: typeof import('mongoose').default = backendRequire('mongoose')
