<script setup lang="ts">
import { useAnchorsStore } from '@/stores/anchor';
import { useCassettesStore } from '@/stores/cassette';
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';
import { formatDuration } from '@/utils/duration/durationHelper';

const cassetteStore = useCassettesStore()
const anchorStore = useAnchorsStore()
const sortStore = useSortingStore()
const trackStore = useTracksStore()

const props = defineProps<{
  cassetteId: string,
  sideIndex: number
}>()

const layout = computed(() => sortStore.getLayoutbyCassetteAndSide(props.cassetteId, props.sideIndex))
const cassette = computed(() => cassetteStore.getCassetteById(props.cassetteId))

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

function toggleAnchor(trackId: string, anchored: boolean) {
  if (anchored) {
    anchorStore.removeAnchor(trackId)
  } else {
    anchorStore.anchorTrack({
      cassetteId: props.cassetteId,
      trackId,
      sideIndex: props.sideIndex,
      positionIndex: layout.value?.trackIds.indexOf(trackId) ?? 0
    })
  }

  sortStore.sortTracks()
}

const durationChipColor = computed(() => {
  if (!layout.value || !cassette?.value) return 'secondary'
  return (layout.value.durationMs ?? 0) > (cassette.value.capacityMs / 2) ? 'error' : 'secondary'
})
</script>

<template>
  <v-list :select-strategy="undefined" v-model:selected="trackStore.selectedTracks">
    <v-chip small variant="tonal" :color="durationChipColor">
      {{ formatDuration(layout?.durationMs ?? 0) }} / {{ formatDuration((cassette?.capacityMs ?? 0) / 2) }}
    </v-chip>
    <v-list-subheader>
      Side {{ String.fromCharCode(65 + sideIndex) }}
    </v-list-subheader>
    <draggable :list="layout?.trackIds" group="tracks" item-key="id" animation="200" @change="onChanged"
      handle=".drag-handle">
      <cassette-item v-for="id in layout?.trackIds" :key="id" :track-id="id"
        :onLockClick="(anchored) => toggleAnchor(id, anchored)"/>
    </draggable>
  </v-list>
</template>
