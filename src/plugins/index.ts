/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '../stores'
import router from '../router'

// Types
import type { App } from 'vue'
import VueKeyboardTrapDirectivePlugin from '@pdanpdan/vue-keyboard-trap'

export function registerPlugins(app: App) {
  app.use(vuetify).use(pinia).use(router)
  app.use(VueKeyboardTrapDirectivePlugin, {})
}
