<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { VInfiniteScroll } from 'vuetify/components'
import { useProjectStore } from '@/stores/project'
import type { Playlist } from '@/types/tapeify/models'
import type {
  InfiniteScrollSide,
  InfiniteScrollStatus,
} from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs'

const projectStore = useProjectStore()

const props = defineProps<{
  playlists: Playlist[]
  load: (options: {
    side: InfiniteScrollSide
    done: (status: InfiniteScrollStatus) => void
  }) => void
}>()

function isSelected(id: string) {
  return projectStore.selectedSourceIds.includes(id)
}


const playlistScroll = useTemplateRef<InstanceType<typeof VInfiniteScroll>>(
  'playlistScroll',
)

function reset() {
  playlistScroll.value?.reset('end')
}
</script>

<template>
  <v-alert v-if="!props.playlists.length" class="ma-4" type="info" variant="tonal" text="No playlists found" />

  <v-list v-else v-model="projectStore.selectedSources" class="pa-2" lines="two" density="comfortable">
    <v-infinite-scroll ref="playlistScroll" height="500" @load="props.load">
      <v-list-item v-for="(playlist, index) in props.playlists" :key="playlist.id" :title="playlist.name"
        :subtitle="playlist.owner" rounded="lg" class="playlist-item my-1"
        @click="projectStore.selectSource(playlist.id, playlist.name)">
        <template #prepend>
          <v-avatar size="48" rounded="lg" color="surface-variant">
            <v-img v-if="playlist.image" :src="playlist.image.toString()" :alt="`${playlist.name} cover`" cover />

            <v-icon v-else icon="mdi-playlist-music" size="24" />
          </v-avatar>
        </template>

        <template #append>
          <v-icon :icon="isSelected(playlist.id)
            ? 'mdi-check-circle'
            : 'mdi-plus-circle-outline'
            " :color="isSelected(playlist.id) ? 'primary' : undefined" />
        </template>

        <v-divider v-if="index < props.playlists.length - 1" class="mt-2" />
      </v-list-item>

      <template #empty>
        <v-alert class="ma-2" type="success" variant="tonal" text="No more playlists to load." />
      </template>

      <template #error>
        <v-alert class="ma-2" type="error" variant="tonal" title="Unable to load playlists"
          text="Try loading the playlists again.">
          <template #append>
            <v-btn icon="mdi-refresh" variant="text" size="small" aria-label="Retry loading playlists" @click="reset" />
          </template>
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-list>
</template>

<style scoped>
.playlist-item {
  transition: background-color 0.2s ease;
}

.playlist-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>
