<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { cookies } = useCookies()
const router = useRouter()

onMounted(async () => {
  const code = new URL(location.href).searchParams.get('code')
  
  const { access_token, refresh_token } = await authStore.requestAccessToken(String(code))
  cookies.set('access_token', access_token)
  cookies.set("refresh_token", refresh_token)
  router.push({path: '/'})
})
</script>

<template>
  <main></main>
</template>
