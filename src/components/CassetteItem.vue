<script lang="ts" setup>
import { useAnchorsStore } from '@/stores/anchor';
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const props = defineProps<{
  trackId: string,
  rowIndex: number,
  colIndex: number
}>()

const tracksStore = useTracksStore()
const anchorStore = useAnchorsStore()
const sortStore = useSortingStore()

const track = computed(() => tracksStore.GetTrackById(props.trackId))
const isAnchored = computed(() => anchorStore.isTrackAnchored(props.trackId))
const anchorIcon = computed(() => anchorStore.isTrackAnchored(props.trackId) ? "mdi-lock" : "mdi-lock-open")

function selectTrack(e: MouseEvent | KeyboardEvent) {
  if (e.shiftKey) {
    if (!tracksStore.lastSelectedTrackId) return;
    const bulk = sortStore.getTracksRange(tracksStore.lastSelectedTrackId, props.trackId);
    tracksStore.selectedTracks = Array.from(new Set([...tracksStore.selectedTracks, ...bulk]));
  } else if (e.ctrlKey || e.metaKey) {
    if (!tracksStore.selectedTracks.includes(props.trackId)) {
      tracksStore.selectedTracks.push(props.trackId);
    }
  } else {
    tracksStore.selectedTracks = [props.trackId];
  }
  tracksStore.lastSelectedTrackId = props.trackId;
}

function toggleAnchor(anchored: boolean) {
  const trackLayout = sortStore.getTrackLayout(props.trackId)
  if (!trackLayout) return

  if (anchored) {
    anchorStore.removeAnchor(props.trackId)
  } else {
    anchorStore.anchorTrack(props.trackId, {
      cassetteId: trackLayout.cassetteId,
      sideIndex: trackLayout.sideIndex,
      position: trackLayout.position
    })
  }

  sortStore.sortTracks()

  const trackSelected = tracksStore.selectedTracks.includes(props.trackId)
  tracksStore.ClearSelectedTracks()
  if (trackSelected) {
    tracksStore.selectedTracks.push(props.trackId)
  }
}
</script>

<template>
  <v-hover :key="Number(isAnchored)">
    <template v-slot:default="{ isHovering, props }">
      <v-list-item active-class="text-secondary" class="py-2 grid-item" handle=".drag-handle" v-bind="props"
        @click="selectTrack" :active="tracksStore.selectedTracks.includes(trackId)" :value="trackId" role="gridcell"
        :data-track-id="trackId" tabindex="0" :data-v-kbd-trap-row="rowIndex" :data-v-kbd-trap-col="colIndex">
        <template v-slot:prepend>
          <v-icon class="drag-handle" icon="mdi-drag-vertical" size="large" />
          <v-avatar class="rounded-sm">
            <v-img v-if="track?.image" :src="track.image.href" />
            <v-icon v-else icon="mdi-music" />
          </v-avatar>
        </template>
        <v-list-item-title :title="track?.name">{{ track?.name }}</v-list-item-title>
        <v-list-item-subtitle :title="track?.artists.join()">{{ track?.artists.join() }}</v-list-item-subtitle>
        <template v-slot:append>
          <div class="track-meta d-flex align-center">
            <v-btn v-if="isAnchored || isHovering" :icon="anchorIcon" size="small" variant="text"
              @click.stop="toggleAnchor(isAnchored)" tabindex="-1" />
            <div class="text-subtitle-1">{{ formatDuration(track?.durationMs || 0) }}</div>
          </div>
        </template>
      </v-list-item>
    </template>
  </v-hover>
</template>

<style scoped>
.grid-item {
  user-select: none;
  /* Prevent text selection */
  -webkit-user-select: none;
  /* For Safari */
  -moz-user-select: none;
  /* For Firefox */
}
</style>