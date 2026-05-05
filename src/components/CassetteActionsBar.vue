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
  layoutStore.calculateLayoutDebounced()
}

function removeSource(sourceId: string) {
  projectStore.removeSource(sourceId)
  const removedTracks = trackStore.RemoveTracksBySource(sourceId)
  removedTracks.forEach(trackId => {
    anchorStore.removeAnchor(trackId)
  })
  layoutStore.calculateLayoutDebounced()
}

const sources = computed(() => {
  return Object.entries(projectStore.sources).map(([id, source]) => ({
    id,
    name: source.name,
    icon: source.type === "playlist" ? "mdi-playlist-music" : source.type === "album" ? "mdi-album" : "mdi-file",
  }))
})

const menuIcon = computed(() => projectStore.drawerOpen ? "mdi-menu-close" : "mdi-menu-open")
const menuBadgeContent = computed(() => trackStore.unavailableTrackIds.length > 0 ? trackStore.unavailableTrackIds.length : undefined)
</script>

<template>
  <v-app-bar class="included pa-1" flat color="transparent">
    <!-- Open side menu button -->
    <template v-slot:append>
      <v-btn @click="projectStore.drawerOpen = !projectStore.drawerOpen" stacked>
        <v-badge v-if="menuBadgeContent" color="secondary" :content="menuBadgeContent" location="top left"
          :offset-x="-5">
          <v-icon :icon="menuIcon" />
        </v-badge>
        <v-icon v-else :icon="menuIcon" />
      </v-btn>

    </template>

    <v-spacer />
    <v-card>
      <template v-slot:actions>

        <!-- Add items -->
        <add-source-dialog />

        <!-- Sources -->
        <v-select :items="sources" item-value="id" item-title="name" label="Sources" chips multiple density="compact"
          variant="outlined" hide-details v-model="projectStore.selectedSources"
          @update:modelValue="layoutStore.calculateLayoutDebounced" :disabled="!projectStore.hasSources"
          min-width="200">
          <template v-slot:chip="{ props: itemProps, item }">
            <v-chip v-bind="itemProps" :title="item.raw.name" size="small" class="text-truncate"
              :prepend-icon="item.raw.icon" max-width="100" />
          </template>
          <template v-slot:item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps" :title="item.raw.name">
              <template v-slot:prepend="{ isSelected, select }">
                <v-list-item-action start>
                  <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
                </v-list-item-action>
              </template>
              <template v-slot:append>
                <v-btn icon="mdi-trash-can-outline" size="small" variant="text" @click.stop="removeSource(item.raw.id)" />
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
        <upload-cassette-dialog />
      </template>
    </v-card>
    <v-spacer />
  </v-app-bar>
</template>
