<script lang="ts" setup>
import { useHotkey } from 'vuetify';

const releaseTag = (import.meta.env.VITE_RELEASE_TAG as string) || '';
const releaseUrl = `https://github.com/dirkzon/Tapeify/releases/tag/${releaseTag}`;

const dialog = ref(false);
useHotkey('shift+?', () => dialog.value = true);
</script>

<template>
  <v-footer class="d-flex align-end justify-end pa-4">
    <div>
      <v-btn class="me-2 text-none" prepend-icon="mdi-help-circle-outline" density="comfortable" variant="plain">
        <span class="mt-auto">shortcuts</span>
      </v-btn>

      <v-dialog activator="parent" max-width="420" transition="dialog-bottom-transition" v-model="dialog">
        <template v-slot:default>
          <v-card elevation="6">
            <v-card-title class="text-h6">
              Shortcuts
            </v-card-title>
            <v-list density="compact" lines="one">

              <v-list-item>
                <template #title>Open shortcuts</template>
                <template #append>
                  <v-chip size="small" variant="tonal">Ctrl+?</v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template #title>Select all tracks on side</template>
                <template #append>
                  <v-chip size="small" variant="tonal">Ctrl+a</v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template #title>Lock selected track(s)</template>
                <template #append>
                  <v-chip size="small" variant="tonal">Ctrl+l</v-chip>
                </template>
              </v-list-item>

              <v-list-item>
                <template #title>Unlock selected track(s)</template>
                <template #append>
                  <v-chip size="small" variant="tonal">Ctrl+u</v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </template>
      </v-dialog>
    </div>

    <v-btn class="me-2 text-none" prepend-icon="mdi-github" density="comfortable" variant="plain"
      href="https://github.com/dirkzon/Tapeify" target="_blank">
      <span class="mt-auto">github</span>
    </v-btn>

    <v-btn v-if="releaseTag" class="me-2 text-none" prepend-icon="mdi-tag-outline" density="comfortable" variant="plain"
      :href="releaseUrl" target="_blank">
      <span class="mt-auto">{{ releaseTag }}</span>
    </v-btn>
  </v-footer>
</template>
