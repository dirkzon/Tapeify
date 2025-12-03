<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()

onMounted(async () => {
  const code = new URL(location.href).searchParams.get('code')

  await authStore.requestAccessToken(String(code))

  profileStore.FetchProfile()
  router.push({ name: '/HomeView' })
})
</script>

<template>
  <main>
    <a>a</a>
  </main>
</template>
