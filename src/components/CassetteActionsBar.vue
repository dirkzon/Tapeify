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

function removeOrigin(originId: string) {
  projectStore.removeOrigin(originId)
  const removedTracks = trackStore.RemoveTracksByOrigin(originId)
  removedTracks.forEach(trackId => {
    anchorStore.removeAnchor(trackId)
  })
  layoutStore.calculateLayout()
}

const origins = computed(() => {
  return Object.entries(projectStore.origins).map(([id, origin]) => ({
    id,
    name: origin.name
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
        <v-select :items="origins" item-value="id" item-title="name" label="Origins" chips multiple density="compact"
          variant="outlined" hide-details v-model="projectStore.selectedOrigins"
          @update:modelValue="layoutStore.calculateLayout" :disabled="!projectStore.hasOrigins">
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="item.raw.name">
              <template v-slot:prepend="{ isSelected, select }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
                </v-list-item-action>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-playlist-remove" size="small" variant="text" @click.stop="removeOrigin(item.raw.id)" />
              </template>
            </v-list-item>
          </template>
        </v-select>

        <v-divider vertical />

        <v-btn icon="mdi-cassette" size="small" variant="text" @click="addCassette"
          :disabled="!projectStore.hasOrigins" />

        <v-divider vertical />

        <!-- Sorting select -->
        <v-select v-model="selectedSortType" :items="layoutStore.getAvailableSorters()" item-value="type"
          density="compact" label="Sorting Algorithm" item-title="name" hide-details min-width="200" variant="outlined"
          :disabled="!projectStore.hasOrigins">
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
          </template>
        </v-select>

        <v-divider vertical />


        <v-btn icon="mdi-import" size="small" variant="text" />
        <v-btn icon="mdi-export" size="small" variant="text" :disabled="!projectStore.hasOrigins" />

        <v-divider vertical />

        <v-btn size="small" variant="text" :disabled="!projectStore.hasOrigins">
          <v-icon icon="mdi-upload-multiple" />
          <upload-cassette-dialog />
        </v-btn>
      </template>
    </v-card>
    <v-spacer />
  </v-app-bar>
</template>
