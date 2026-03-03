<script lang="ts" setup>
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';

const props = defineProps<{
  trackId: string,
}>()

const tracksStore = useTracksStore()
const sortingStore = useSortingStore()

const track = computed(() => tracksStore.GetTrackById(props.trackId))

function makeTrackAvailable() {
  tracksStore.MarkTrackAsAvailable(props.trackId)
  sortingStore.sortTracks()
}
</script>

<template>
  <v-list-item class="pa-1">
    <template v-slot:prepend>
      <v-icon class="drag-handle" icon="mdi-drag-vertical" size="large" />
      <v-avatar class="rounded-sm">
        <v-img v-if="track?.image" :src="track.image.href" />
        <v-icon v-else icon="mdi-music" />
      </v-avatar>
    </template>
    <v-list-item-title :title="track?.name">{{ track?.name }}</v-list-item-title>
    <v-list-item-subtitle :title="track?.artists.join()">{{ track?.artists.join()
    }}</v-list-item-subtitle>
    <template v-slot:append>
      <v-btn icon="mdi-refresh" variant="text" @click.stop="makeTrackAvailable" />
    </template>
  </v-list-item>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
  margin-right: 10px;;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.no-select {
  user-select: none;
  /* Prevent text selection */
  -webkit-user-select: none;
  /* For Safari */
  -moz-user-select: none;
  /* For Firefox */
}
</style>
