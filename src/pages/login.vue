<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

async function AuthorizeUser() {
  const authUrl = await authStore.generateUserAuthorizationUrl()
  window.location.href = authUrl.toString()
}
</script>

<template>
  <main>
    <h2>hello!</h2>
    <button elevation="2" @click="AuthorizeUser">log in with Spotify</button>
  </main>
</template>
