import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'storybook-static']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Strict typing (constitution, Principle II).
      'no-restricted-syntax': [
        'error',
        { selector: 'TSAsExpression', message: 'Do not use "as". Narrow or validate the value instead.' },
        { selector: 'TSTypeAssertion', message: 'Do not use type assertions. Narrow or validate the value instead.' },
        { selector: 'TSNonNullExpression', message: 'Do not use "!". Handle the empty case instead.' },
        { selector: 'TSAnyKeyword', message: 'Do not use "any". Write the real type.' },
        { selector: 'TSUnknownKeyword', message: 'Do not use "unknown". Write the real type.' },
        { selector: 'TSNeverKeyword', message: 'Do not use "never". Write the real type.' },
      ],
    },
  },
])
