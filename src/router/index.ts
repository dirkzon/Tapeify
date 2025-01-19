import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CallbackView from '../views/CallbackView.vue'
import LoginView from '../views/LoginView.vue'
import { useCookies } from "vue3-cookies";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/callback',
      name: 'callback',
      component: CallbackView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

router.beforeEach((to) => {
  const { cookies } = useCookies()
  const publicPages = ['/callback', '/login']
  const authRequired = publicPages.includes(to.path);
  const accessTokenExists = cookies.isKey('access_token')
  if (authRequired && accessTokenExists) {
    router.push({path: '/'})
  }
})

export default router
