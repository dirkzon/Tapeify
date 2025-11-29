<!-- <script setup lang="ts">
import { useCassettesStore } from '@/stores/cassette'
import { useSortingStore } from '@/stores/sorting'
import { UseTracksStore } from '@/stores/tracks'

const sortStore = useSortingStore()
const cassetteStore = useCassettesStore()
const trackStore = UseTracksStore()

const { getSidePrettyDurtionByIndex, getSideTracksByIndex, getSideNameByIndex } = toRefs(cassetteStore)

const props = defineProps<{
    index: number
}>()

function AnchorTrack(changeEvent: any) {
    const eventType = Object.keys(changeEvent)[0]
    let trackIndex
    let trackId

    switch(eventType) {
        case 'moved':
            trackIndex = changeEvent.moved.newIndex
            trackId = changeEvent.moved.element.id
            trackStore.AnchorTrack(props.index, trackIndex, trackId)
            break;
        case 'added':
            trackIndex = changeEvent.added.newIndex
            trackId = changeEvent.added.element.id
            trackStore.AnchorTrack(props.index, trackIndex, trackId)
            break
        case 'removed':
            break
    }
}

function DeleteSide() {
    cassetteStore.DeleteSide(props.index)
    sortStore.sortTracksInSides()
}
</script>

<template>
    <v-card flat class="mx-auto" max-width="700"> 
        <v-toolbar flat>
        <v-toolbar-title class="text-grey">
            {{ getSideNameByIndex(props.index) }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
            v-if="index != 0"
            variant="plain"
            density="comfortable"
            icon="mdi-playlist-minus"
            @click="DeleteSide"
        />
        </v-toolbar>
        <v-card-subtitle>{{ getSidePrettyDurtionByIndex(props.index) }}</v-card-subtitle>
        <v-list lines="two" density="compact"> 
            <draggable 
                class="dragArea list-group w-full"
                :list="getSideTracksByIndex(props.index)"
                group="sides" 
                @change="AnchorTrack"
                @end="sortStore.sortTracksInSides()"
                >
                <div
                    class="list-group-item"
                    v-for="(track, trackIndex) in getSideTracksByIndex(props.index)"
                    :key="track.id"
                >
                    <track-item
                        :track="track"
                        :side_index="props.index"
                        :track_index="trackIndex"
                        >
                    </track-item>
                </div>
            </draggable>
        </v-list>
    </v-card>
</template> -->

<script setup lang="ts">
import { useCassettesStore } from '@/stores/cassette';
import { useSortingStore } from '@/stores/sorting';
import { UseTracksStore } from '@/stores/tracks';

const cassetteStore = useCassettesStore()
const tracksStore = UseTracksStore()

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
  <v-card class="mx-auto" max-width="500">
    <v-toolbar color="pink">
      <v-toolbar-title>{{ layout?.sideIndex}}</v-toolbar-title>
      <!-- <v-btn
          v-if="index != 0"
          density="comfortable"
          icon="mdi-playlist-minus"
          @click="DeleteSide"
      />
    <v-btn
          density="comfortable"
          icon="mdi-playlist-plus"
          @click="AddSide"
      /> -->
    </v-toolbar>
    <v-card-subtitle>{{ layout?.durationMs / 60000 }} | {{ cassette?.totalDurationMs / 120000 }}</v-card-subtitle>
    <v-list 
      select-strategy="leaf"
    >
      <draggable 
        :list="layout?.tracks" 
        group="tracks" 
        item-key="id" 
        animation="200"
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
  </v-card>
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