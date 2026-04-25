<script setup lang="ts">
import { useAnchorsStore } from '@/stores/anchor';
import { useCassettesStore } from '@/stores/cassette';
import { useLayoutStore } from '@/stores/layout';
import type { DragChangeEvent } from '@/types/draggable/types';
import { formatDuration } from '@/utils/duration/durationHelper';

const cassetteStore = useCassettesStore()
const anchorStore = useAnchorsStore()
const layoutStore = useLayoutStore()

const props = defineProps<{
  cassetteId: string,
  sideIndex: number,
}>()

const tracksCache = ref<string[]>([])

const layout = computed(() => layoutStore.getLayoutbyCassetteAndSide(props.cassetteId, props.sideIndex))
const cassette = computed(() => cassetteStore.getCassetteById(props.cassetteId))

const tracks = computed<string[]>({
  get: () => layout.value?.trackIds ?? [],
  set: (newTracks: string[]) => {
    tracksCache.value = newTracks
  }
})

async function onChanged(event: DragChangeEvent<string>) {
  if (event.added) {
    anchorStore.anchorTrack(event.added.element, {
      cassetteId: props.cassetteId,
      sideIndex: props.sideIndex,
      position: event.added.newIndex
    })
  }
  if (event.moved) {
    anchorStore.anchorTrack(event.moved.element, {
      cassetteId: props.cassetteId,
      sideIndex: props.sideIndex,
      position: event.moved.newIndex
    })
  }

  for (const [index, id] of tracksCache.value.entries()) {
    if (anchorStore.isTrackAnchored(id)) {
      const anchor = anchorStore.anchors[id]
      if (anchor.position !== index) {
        anchorStore.updateAnchor(id, {
          ...anchor,
          position: index
        })
      }
    }
  }

  layoutStore.calculateLayout()
  tracksCache.value = []
}

const durationChipColor = computed(() => {
  if (!layout.value || !cassette?.value) return 'secondary'
  return (layout.value.durationMs ?? 0) > (cassette.value.capacityMs / 2) ? 'error' : 'secondary'
})

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.stopPropagation()
  }
}
</script>

<template>
  <v-list @keydown="onListKeydown" class="grid-column">
    <v-chip size="small" variant="tonal" :color="durationChipColor">
      {{ formatDuration(layout?.durationMs ?? 0) }} / {{ formatDuration((cassette?.capacityMs ?? 0) / 2) }}
    </v-chip>
    <v-list-subheader>
      Side {{ String.fromCharCode(65 + sideIndex) }}
    </v-list-subheader>
    <draggable v-model="tracks" group="tracks" item-key="id" animation="200" @change="onChanged" handle=".drag-handle">
      <cassette-item v-for="id in tracks" :key="id" :track-id="id" :column-index="layout!.columnIndex"/>
    </draggable>
  </v-list>
</template>

<style scoped>
.grid-column {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>