<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()

onMounted(() => {
  const code = new URL(location.href).searchParams.get('code')
  if (code == undefined){
    alert("Code is undifined")
  }
  authStore.requestAccessToken(String(code))
})
</script>

<template>
  <main>
  </main>
</template>
