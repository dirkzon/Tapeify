<script setup lang="ts">
import { useProfileStore } from '@/stores/profile';
import { onMounted } from 'vue';

const profileStore = useProfileStore()

onMounted(async () => {
  profileStore.getProfile()
})

</script>

<template>
  <main>
    {{ profileStore.getUser }}
  </main>
</template>
