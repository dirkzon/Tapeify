<script lang="ts" setup>
const releaseTag = (import.meta.env.VITE_RELEASE_TAG as string) || '';
const releaseUrl = `https://github.com/dirkzon/Tapeify/releases/tag/${releaseTag}`
</script>

<template>
  <v-app>
    <v-container fill-height fluid>
      <v-row align="center" justify="center">
        <router-view />
      </v-row>
    </v-container>
    <v-footer class="text-center d-flex flex-column ga-2 py-4 ">
      <div class="d-flex h-100 align-end justify-center">
        <v-btn class="me-2 text-none" prepend-icon="mdi-github" density="comfortable" variant="plain"
          href="https://github.com/dirkzon/Tapeify" target="_blank">
          <span class="mt-auto">github</span>
        </v-btn>

        <v-btn v-if="releaseTag"  class="me-2 text-none" prepend-icon="mdi-tag-outline" density="comfortable" variant="plain"
          :href="releaseUrl" target="_blank">
          <span class="mt-auto">{{ releaseTag }}</span>
        </v-btn>
      </div>
    </v-footer>
  </v-app>
</template>
