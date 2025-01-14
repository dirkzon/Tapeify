<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

function AuthorizeUser() {
  window.location.href = authStore.userAuthorizationUrl
}
</script>

<template>
  <main>
    <h2>hello!</h2>
    <button elevation="2" @click="AuthorizeUser">log in with Spotify</button>
  </main>
</template>
