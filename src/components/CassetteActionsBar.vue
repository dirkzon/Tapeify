<script lang="ts" setup>
import { useAnchorsStore } from '@/stores/anchor';
import { useCassettesStore } from '@/stores/cassette';
import { useLayoutStore } from '@/stores/layout';
import { useProjectStore } from '@/stores/project';
import { useTracksStore } from '@/stores/tracks';

const layoutStore = useLayoutStore()
const projectStore = useProjectStore()
const cassetteStore = useCassettesStore()
const trackStore = useTracksStore()
const anchorStore = useAnchorsStore()

const selectedSortType = computed({
  get: () => layoutStore.selectedSortType,
  set: (val: string) => layoutStore.setSortType(val)
})

function addCassette() {
  cassetteStore.addCassette()
  layoutStore.calculateLayout()
}

function removeSource(sourceId: string) {
  projectStore.removeSource(sourceId)
  const removedTracks = trackStore.RemoveTracksBySource(sourceId)
  removedTracks.forEach(trackId => {
    anchorStore.removeAnchor(trackId)
  })
  layoutStore.calculateLayout()
}

const sources = computed(() => {
  return Object.entries(projectStore.sources).map(([id, source]) => ({
    id,
    name: source.name
  }))
})

</script>

<template>
  <v-app-bar class="included pa-1" flat color="transparent">
    <v-spacer />
    <v-card>
      <template v-slot:actions>

        <!-- Add items -->
        <v-btn icon="mdi-playlist-plus" size="small" variant="text" > <add-source-dialog /> </v-btn>

        <!-- Remove items -->
        <v-select :items="sources" item-value="id" item-title="name" label="Sources" chips multiple density="compact"
          variant="outlined" hide-details v-model="projectStore.selectedSources"
          @update:modelValue="layoutStore.calculateLayout" :disabled="!projectStore.hasSources">
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="item.raw.name">
              <template v-slot:prepend="{ isSelected, select }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
                </v-list-item-action>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-playlist-remove" size="small" variant="text" @click.stop="removeSource(item.raw.id)" />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <v-divider vertical />

        <v-btn icon="mdi-cassette" size="small" variant="text" @click="addCassette"
          :disabled="!projectStore.hasSources" />

        <v-divider vertical />

        <!-- Sorting select -->
        <v-select v-model="selectedSortType" :items="layoutStore.getAvailableSorters()" item-value="type"
          density="compact" label="Sorting Algorithm" item-title="name" hide-details min-width="200" variant="outlined"
          :disabled="!projectStore.hasSources">
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
          </template>
        </v-select>

        <v-divider vertical />


        <v-btn icon="mdi-import" size="small" variant="text" />
        <v-btn icon="mdi-export" size="small" variant="text" :disabled="!projectStore.hasSources" />

        <v-divider vertical />

        <v-btn size="small" variant="text" :disabled="!projectStore.hasSources">
          <v-icon icon="mdi-upload-multiple" />
          <upload-cassette-dialog />
        </v-btn>
      </template>
    </v-card>
    <v-spacer />
  </v-app-bar>
</template>
