import vueParser from 'vue-eslint-parser'
import vue from 'eslint-plugin-vue'
import vuetify from 'eslint-plugin-vuetify'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  ...vue.configs['flat/base'],
  ...vuetify.configs['flat/base'],

  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,jsx,ts,mjs,mts,tsx,vue}'],
    plugins: {
      vue,
      vuetify,
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
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
]
