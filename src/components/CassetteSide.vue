<script setup lang="ts">
import { useAnchorsStore } from '@/stores/anchor';
import { useCassettesStore } from '@/stores/cassette';
import { useSortingStore } from '@/stores/sorting';
import { UseTracksStore } from '@/stores/tracks';

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
    switch(eventType) {
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
</script>

<template>
    <v-list 
      select-strategy="leaf"
    >
      <draggable 
        :list="layout?.tracks" 
        group="tracks" 
        item-key="id" 
        animation="200"
        @change="onChanged"
      >
          <v-list-item
              v-for="track in tracks"
              :key="track.id"
              :value="track.id"
              active-class="text-pink"
              class="py-3"
              handle=".drag-handle"
          >
            <template v-slot:prepend>
              <v-icon
                class="drag-handle"
                icon="mdi-drag-vertical" 
                size="large">
            </v-icon>
            <v-avatar tile>
                <v-img v-if="track.image" :src="track.image.href" />
                <v-icon v-else icon="mdi-music" />
            </v-avatar>
            </template>
            <v-list-item-title :title="track.name">{{ track.name }}</v-list-item-title>
            <v-list-item-subtitle :title="track.artists.join()">{{ track.artists.join() }}</v-list-item-subtitle>
            <template v-slot:append="{ isSelected }">
              <v-list-item-action class="flex-column align-end">
                  <v-spacer></v-spacer>

                  <v-icon v-if="isSelected" size="x-small">mdi-lock</v-icon>
                  <v-icon v-else class="opacity-30" size="x-small">mdi-lock-open-variant</v-icon>
              </v-list-item-action>
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
</style>