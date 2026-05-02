<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

async function AuthorizeUser() {
    const authUrl = await authStore.generateUserAuthorizationUrl()
    window.location.href = authUrl.toString()
}
</script>

<template>
    <v-btn color="primary" @click="AuthorizeUser" prepend-icon="mdi-spotify" size="large">Login with Spotify</v-btn>
</template>