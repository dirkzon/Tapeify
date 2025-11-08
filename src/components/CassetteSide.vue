<!-- <script setup lang="ts">
import { useCassetteStore } from '@/stores/cassette'
import { useSortingStore } from '@/stores/sorting'
import { UseTracksStore } from '@/stores/tracks'
import type { DragChangeEvent } from '@/types/draggable/draggable'
import type { Track } from '@/types/tapeify/models'
import { shallowRef } from 'vue'

const sortStore = useSortingStore()
const cassetteStore = useCassetteStore()
const trackStore = UseTracksStore()

const { getSidePrettyDurtionByIndex, getSideTracksByIndex, getSideNameByIndex } = toRefs(cassetteStore)

const selected = shallowRef([2])

const props = defineProps<{
    index: number
}>()

const anchored = computed({
  get() { 
    [2]
  },
  set(val) {
    console.log(val)
  }
})

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
        <v-list lines="two" density="compact" v-model:selected="anchored" select-strategy="leaf" :items='getSideTracksByIndex(props.index)'> 
            <div class="drag-container">
                <draggable
                    :list="getSideTracksByIndex(props.index)" 
                    group="sides" 
                    @change="($event: DragChangeEvent<Track>) => {
                        trackStore.onCassetteChange($event, props.index)
                    }"
                    item-key="id"
                    @end="sortStore.sortTracksInSides()"
                    animation="200"
                    handle=".drag-handle"
                    >
                        <div
                            class="list-group-item"
                            v-for="(track) in getSideTracksByIndex(props.index)"
                            :key="track.id"
                        >
                            <v-list-item active-class="text-pink">
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
                                <v-list-item-action class="flex-column">
                                    {{ isSelected }}
                                    <v-icon v-if="isSelected" color="opacity-80" size="x-small">mdi-lock</v-icon>
                                    <v-icon v-else class="opacity-80" size="x-small">mdi-lock-open-variant</v-icon>
                                </v-list-item-action>
                                </template>
                            </v-list-item>
                            <v-divider />
                        </div>
                </draggable>
            </div>
        </v-list>
    </v-card>
</template>
-->

<script setup lang="ts">

import { useCassetteStore } from '@/stores/cassette'
import { useSortingStore } from '@/stores/sorting'
import { UseTracksStore } from '@/stores/tracks'
import type { DragChangeEvent } from '@/types/draggable/draggable'
import type { Track } from '@/types/tapeify/models'
import { shallowRef, toRefs } from 'vue'

const sortStore = useSortingStore()
const cassetteStore = useCassetteStore()
const trackStore = UseTracksStore()

const { getSidePrettyDurtionByIndex, getSideTracksByIndex, getSideNameByIndex } = toRefs(cassetteStore)

const props = defineProps<{
  index: number
}>()

const anchored = shallowRef(cassetteStore.getLockedTracks(props.index).map(t => t.id))

function DeleteSide() {
    cassetteStore.DeleteSide(props.index)
    sortStore.sortTracksInSides()
}

function AddSide() {
  cassetteStore.AddEmptySide()
  sortStore.sortTracksInSides()
}

function onUpdateModel(value: any) {
  console.log(value)
}
</script>

<template>
  <v-card class="mx-auto" max-width="500">
    <v-toolbar color="pink">
      <v-toolbar-title>Side {{ getSideNameByIndex(props.index) }}</v-toolbar-title>
      <v-btn
          v-if="index != 0"
          density="comfortable"
          icon="mdi-playlist-minus"
          @click="DeleteSide"
      />
    <v-btn
          density="comfortable"
          icon="mdi-playlist-plus"
          @click="AddSide"
      />
    </v-toolbar>
    <v-card-subtitle>{{ getSidePrettyDurtionByIndex(props.index) }}</v-card-subtitle>
    <v-list 
      v-model:selected="anchored"
      select-strategy="leaf"
      @update:selected="onUpdateModel"
    >
      <draggable 
        :list="getSideTracksByIndex(props.index)" 
        group="tracks" 
        item-key="id" 
        animation="200"
        @change="($event: DragChangeEvent<Track>) => {
            trackStore.onCassetteChange($event, props.index)
        }"
        @end="sortStore.sortTracksInSides()"
      >
          <v-list-item
              v-for="track in getSideTracksByIndex(props.index)"
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