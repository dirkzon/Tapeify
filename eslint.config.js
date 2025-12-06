/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

import vue from 'eslint-plugin-vue'
import vuetify from 'eslint-plugin-vuetify'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...vue.configs['flat/base'],
  ...vuetify.configs['flat/base'],

  {
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      'vue/multi-word-component-names': 'off',
    }
  }
]
