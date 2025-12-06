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
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
//
</script>
