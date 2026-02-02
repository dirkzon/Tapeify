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

const tracks = computed(() => layout.value?.trackIds.map((id) => trackStore.GetTrackById(id)).filter(t => t !== undefined).map((t) => {
  return {
    name: t.name,
    id: t.id
  }
}))
</script>

<template>
  <v-data-table :items="tracks" hide-default-header hide-default-footer item-key="id">
    <template #body="data">
      <draggable :list="layout?.trackIds" group="tracks" item-key="id" animation="200" @change="onChanged">
        <v-data-table-row v-for="(item, index) in data.internalItems" :key="`row.${index}`" :item="item">
        </v-data-table-row>
      </draggable>
    </template>
  </v-data-table>
</template>
