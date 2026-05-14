// vitest.config.ts
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
})