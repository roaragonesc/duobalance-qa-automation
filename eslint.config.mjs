import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import playwright from 'eslint-plugin-playwright'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_' },
      ],
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.spec.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Los bloqueos de capacidad se declaran con test.skip y comentario "Requiere API real" (lint:arch los valida).
      'playwright/no-skipped-test': 'off',
      // expectOpen() de las Pages encapsula la comprobacion de navegacion del contrato de la pagina.
      'playwright/expect-expect': ['warn', { assertFunctionNames: ['expect', 'expectOpen'] }],
    },
  },
)
