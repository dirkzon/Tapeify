<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile';

const authStore = useAuthStore()
const profileStore = useProfileStore()
const { cookies } = useCookies()
const router = useRouter()

onMounted(async () => {
  const code = new URL(location.href).searchParams.get('code')
  
  const { access_token, refresh_token } = await authStore.requestAccessToken(String(code))
  console.log(refresh_token)
  cookies.set('access_token', access_token, 3600)
  cookies.set("refresh_token", refresh_token, '1d')

  console.log(cookies.get('access_token'))
  console.log(cookies.get('refresh_token'))

  profileStore.getProfile()
  router.push({path: '/'})
})
</script>

<template>
  <main></main>
</template>
