<script setup lang="ts">
import type { Album } from '@/types/tapeify/models'
import type {
  InfiniteScrollSide,
  InfiniteScrollStatus,
} from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs'
import { VInfiniteScroll } from 'vuetify/components'
import { useProjectStore } from '@/stores/project'


const projectStore = useProjectStore()


const props = defineProps<{
  albums: Album[]
  load: (options: {
    side: InfiniteScrollSide
    done: (status: InfiniteScrollStatus) => void
  }) => void
}>()

const infiniteScrollRef = useTemplateRef<InstanceType<typeof VInfiniteScroll>>(
  'albumsScroll',
)

function isSelected(id: string) {
  return projectStore.selectedSourceIds.includes(id)
}

function reset() {
  infiniteScrollRef.value?.reset('end')
}
</script>

<template>
  <v-alert v-if="!props.albums.length" class="ma-4" type="info" variant="tonal" text="No albums found" />

  <v-list v-else class="pa-2" lines="two" density="comfortable">
    <v-infinite-scroll ref="albumsScroll" height="500" @load="props.load">
      <v-list-item v-for="(album, index) in props.albums" :key="album.id" :title="album.name"
        :subtitle="album.artists.toString()" rounded="lg" class="album-item my-1"
        @click="projectStore.selectSource(album.id, album.name)">
        <template #prepend>
          <v-avatar size="48" rounded="lg" color="surface-variant">
            <v-img v-if="album.image" :src="album.image.toString()" :alt="`${album.name} cover`" cover />

            <v-icon v-else icon="mdi-album" size="24" />
          </v-avatar>
        </template>

        <template #append>
          <v-icon :icon="isSelected(album.id)
            ? 'mdi-check-circle'
            : 'mdi-plus-circle-outline'
            " :color="isSelected(album.id) ? 'primary' : undefined" />
        </template>

        <v-divider v-if="index < props.albums.length - 1" class="mt-2" />
      </v-list-item>

      <template #empty>
        <v-alert class="ma-2" type="success" variant="tonal" text="No more albums to load." />
      </template>

      <template #error>
        <v-alert class="ma-2" type="error" variant="tonal" title="Unable to load albums"
          text="Try loading the albums again.">
          <template #append>
            <v-btn icon="mdi-refresh" variant="text" size="small" aria-label="Retry loading albums" @click="reset" />
          </template>
        </v-alert>
      </template>
    </v-infinite-scroll>
  </v-list>
</template>

<style scoped>
.album-item {
  transition: background-color 0.2s ease;
}

.album-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.06);
}
</style>
