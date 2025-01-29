/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import HomeView from '@/pages/HomeView.vue'
import CallbackView from '@/pages/CallbackView.vue'
import LoginView from '@/pages/LoginView.vue'
import CassetteView from '@/pages/CassetteView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '/HomeView',
      component: HomeView
    },
    {
      path: '/callback',
      name: '/CallbackView',
      component: CallbackView
    },
    {
      path: '/login',
      name: '/LoginView',
      component: LoginView
    },
    {
      path: '/cassette',
      name: '/CassetteView',
      component: CassetteView,
      props: (route) => ({ id: route.query.id, type: route.query.type })
    }
  ]
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
