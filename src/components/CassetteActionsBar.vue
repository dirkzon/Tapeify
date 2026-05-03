<script lang="ts" setup>
import { useCassettesStore } from '@/stores/cassette';
import { useLayoutStore } from '@/stores/layout';
import { useProjectStore } from '@/stores/project';
import { useTracksStore } from '@/stores/tracks';

const layoutStore = useLayoutStore()
const projectStore = useProjectStore()
const cassetteStore = useCassettesStore()
const trackStore = useTracksStore()

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
  trackStore.RemoveTracksByOrigin(originId)
  layoutStore.calculateLayout()
}

const selectedTab = ref('user_playlists')

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
        <v-dialog max-width="800">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" icon="mdi-playlist-plus" size="small" variant="text" />
          </template>

          <template v-slot:default>
            <v-card class="cassette-card">
              <v-toolbar color="primary" title="Select Playlist or Album">
                <template v-slot:extension>
                  <v-tabs v-model="selectedTab" align-tabs="center">
                    <v-tab value="user_playlists">My Playlists</v-tab>
                    <v-tab value="search_albums">Search Albums</v-tab>
                    <v-tab value="search_playlists">Search Playlists</v-tab>
                  </v-tabs>
                </template>
              </v-toolbar>
              <v-tabs-window v-model="selectedTab" class="pa-3">
                <v-tabs-window-item value="user_playlists">
                  <user-playlists-tab />
                </v-tabs-window-item>
                <v-tabs-window-item value="search_albums">
                  <SearchAlbumsTab />
                </v-tabs-window-item>
                <v-tabs-window-item value="search_playlists">
                  <SearchPlaylistsTab />
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </template>
        </v-dialog>

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

        <v-btn icon="mdi-cassette" size="small" variant="text" @click="addCassette" />

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
        <v-btn icon="mdi-export" size="small" variant="text" />

        <v-divider vertical />

        <v-btn size="small" variant="text">
          <v-icon icon="mdi-upload-multiple" />
          <upload-cassette-dialog />
        </v-btn>
      </template>
    </v-card>
    <v-spacer />
  </v-app-bar>
</template>
