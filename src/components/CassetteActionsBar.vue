<script lang="ts" setup>
import { useTracksStore } from '@/stores/tracks';
import { useAnchorsStore } from '@/stores/anchor';
import { useHotkey } from 'vuetify/dist/vuetify.js';
import { useLayoutStore } from '@/stores/layout';

const tracksStore = useTracksStore()
const anchorStore = useAnchorsStore()
const layoutStore = useLayoutStore()

const atLeastOneTrackSelected = computed(() => tracksStore.selectedTracks.length > 0)

useHotkey('ctrl+l', anchor)
useHotkey('ctrl+u', unanchor)

function anchor() {
  for (const id of tracksStore.selectedTracks) {

    const trackLayout = layoutStore.getTrackLayout(id)
    if (!trackLayout) {
      continue
    }
    anchorStore.anchorTrack(id, {
      cassetteId: trackLayout.cassetteId,
      sideIndex: trackLayout.sideIndex,
      position: trackLayout.position
    })
  }
  layoutStore.calculateLayout()
  if (tracksStore.lastSelectedTrackId) {
    tracksStore.selectedTracks = [tracksStore.lastSelectedTrackId]
  }
}

function unanchor() {
  for (const id of tracksStore.selectedTracks) {
    anchorStore.removeAnchor(id)
  }
  layoutStore.calculateLayout()
  if (tracksStore.lastSelectedTrackId) {
    tracksStore.selectedTracks = [tracksStore.lastSelectedTrackId]
  }
}
const selectedSortType = computed({
  get: () => layoutStore.selectedSortType,
  set: (val: string) => layoutStore.setSortType(val)
})
</script>

<template>
  <v-app-bar class="included pa-1">
    <template v-slot:prepend>
      <v-select v-model="selectedSortType" :items="layoutStore.getAvailableSorters()" item-value="type" density="compact"
        label="Sorting Algorithm" item-title="name" hide-details min-width="200" variant="outlined">
        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
        </template>
      </v-select>

      <v-tooltip text="Unanchor Track(s) [Ctrl + U]" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon @click="unanchor" :disabled="!atLeastOneTrackSelected" size="small">
            <v-icon>mdi-lock-open-remove</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-tooltip text="Anchor Track(s) [Ctrl + L]" location="bottom">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon class="ml-4" @click="anchor" :disabled="!atLeastOneTrackSelected" size="small">
            <v-icon>mdi-lock-plus</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>

    <template v-slot:append>
      <v-btn block variant="outlined">
        Upload Cassette
        <upload-cassette-dialog />
      </v-btn>

    </template>
  </v-app-bar>
</template>
