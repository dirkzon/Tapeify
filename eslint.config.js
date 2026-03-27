/**
 * .eslint.js
 *
 * ESLint configuration file.
 */
import vue from 'eslint-plugin-vue'
import vuetify from 'eslint-plugin-vuetify'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    plugins: {
      vue,
      vuetify,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { sourceType: 'module' },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...vue.configs['flat/base'],
  ...vuetify.configs['flat/base'],
]

