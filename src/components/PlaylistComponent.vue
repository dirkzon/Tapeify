<script setup lang="ts">
defineProps({
  playlist: {
    required: true
  }
})
</script>

<template>
  <div class="container">
    {{ playlist }}
  </div>
</template>
