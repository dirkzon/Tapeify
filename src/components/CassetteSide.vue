<script setup lang="ts">
import { useAnchorsStore } from '@/stores/anchor';
import { useCassettesStore } from '@/stores/cassette';
import { useSortingStore } from '@/stores/sorting';
import { UseTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const cassetteStore = useCassettesStore()
const tracksStore = UseTracksStore()
const anchorStore = useAnchorsStore()

const props = defineProps<{
  cassetteId: string,
  sideIndex: number
}>()

const sortStore = useSortingStore()

const layout = computed(() => {
  return sortStore.getLayoutbyCassetteAndSide(props.cassetteId, props.sideIndex)
})

const cassette = computed(() => {
  return cassetteStore.getCassetteById(props.cassetteId)
})

function onChanged(changeEvent: any) {
  const eventType = Object.keys(changeEvent)[0]
  switch (eventType) {
    case 'moved':
      anchorStore.anchorTrack({
        cassetteId: props.cassetteId,
        trackId: changeEvent.moved.element,
        sideIndex: props.sideIndex,
        positionIndex: changeEvent.moved.newIndex
      })
      break;
    case 'added':
      anchorStore.anchorTrack({
        cassetteId: props.cassetteId,
        trackId: changeEvent.added.element,
        sideIndex: props.sideIndex,
        positionIndex: changeEvent.added.newIndex
      })
      break
    case 'removed':
      break
  }

  sortStore.sortTracks()
}

const selectedTracks = computed({
  get: () => {
    return anchorStore.anchors
      .filter(a => a.cassetteId === props.cassetteId && a.sideIndex === props.sideIndex)
      .map(a => a.trackId)
  },
  set: (_val: string[]) => {
  }
})

function toggleAnchor(trackId: string) {
  const existing = anchorStore.anchors.find(
    a => a.cassetteId === props.cassetteId &&
      a.sideIndex === props.sideIndex &&
      a.trackId === trackId
  )

  if (existing) {
    anchorStore.anchors = anchorStore.anchors.filter(a => a !== existing)
  } else {
    anchorStore.anchorTrack({
      cassetteId: props.cassetteId,
      trackId,
      sideIndex: props.sideIndex,
      positionIndex: layout.value?.tracks.indexOf(trackId) ?? 0
    })
  }

  sortStore.sortTracks()
}

const tracks = computed(() => {
  const output = []
  for (const trackId of layout.value?.tracks || []) {
    if (trackId) {
      const track = tracksStore.GetTrackById(trackId)
      if (track) {
        output.push(track)
      }
    }
  }
  return output
})

const durationChipColor = computed(() => {
  if (!layout.value || !cassette?.value) return 'secondary'
  return (layout.value.durationMs ?? 0) > (cassette.value.capacityMs / 2) ? 'error' : 'secondary'
})
</script>

<template>
  <v-list select-strategy="leaf" v-model:selected="selectedTracks">
    <v-chip small outlined :color="durationChipColor">
      {{ formatDuration(layout?.durationMs ?? 0) }} / {{ formatDuration((cassette?.capacityMs ?? 0) / 2) }}
    </v-chip>
    <v-list-subheader>
      Side {{ String.fromCharCode(65 + sideIndex) }}
    </v-list-subheader>
    <draggable :list="layout?.tracks" group="tracks" item-key="id" animation="200" @change="onChanged">
      <v-list-item v-for="track in tracks" :key="track.id" :value="track.id" active-class="text-secondary" class="py-2"
        handle=".drag-handle" @click="toggleAnchor(track.id)">
        <template v-slot:prepend>
          <v-icon class="drag-handle" icon="mdi-drag-vertical" size="large">
          </v-icon>
          <v-avatar tile>
            <v-img v-if="track.image" :src="track.image.href" />
            <v-icon v-else icon="mdi-music" />
          </v-avatar>
        </template>
        <v-list-item-title :title="track.name">{{ track.name }}</v-list-item-title>
        <v-list-item-subtitle :title="track.artists.join()">{{ track.artists.join() }}</v-list-item-subtitle>
        <template v-slot:append="{ isSelected }">
          <div class="track-meta d-flex align-center">
            <v-icon v-if="isSelected" size="16">mdi-lock</v-icon>
            <div class="text-subtitle-1">{{ formatDuration(track.durationMs) }}</div>
          </div>
        </template>
      </v-list-item>
    </draggable>
  </v-list>
</template>

<style scoped>
.item-with-handle {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.drag-handle {
  cursor: grab;
  margin-right: 10px;
  color: #999;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.item-content {
  flex: 1;
}

.track-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
