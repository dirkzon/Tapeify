<script lang="ts" setup>
const releaseTag = (import.meta.env.VITE_RELEASE_TAG as string) || '';
const releaseUrl = `https://github.com/dirkzon/Tapeify/releases/tag/${releaseTag}`
</script>

<template>
  <v-app-bar density="compact" height="48" location="bottom" flat>
    <template v-slot:append>
      <v-btn class="me-2 text-none" prepend-icon="mdi-github" density="comfortable" variant="plain"
        href="https://github.com/dirkzon/Tapeify" target="_blank">
        <span class="mt-auto">github</span>
      </v-btn>

      <v-btn v-if="releaseTag" class="me-2 text-none" prepend-icon="mdi-tag-outline" density="comfortable"
        variant="plain" :href="releaseUrl" target="_blank">
        <span class="mt-auto">{{ releaseTag }}</span>
      </v-btn>
    </template>
  </v-app-bar>
</template>
