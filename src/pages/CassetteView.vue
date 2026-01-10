<script setup lang="ts">
import { useSortingStore } from '@/stores/sorting';
import { UseTracksStore } from '@/stores/tracks';
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists';

import Cassette from '@/components/Cassette.vue';
import { useCassettesStore } from '@/stores/cassette';

const sortStore = useSortingStore()
const tracksStore = UseTracksStore()
const albumStore = useAlbumsStore()
const playlistsStore = usePlaylistsStore()
const cassetteStore = useCassettesStore()

onMounted(async () => {
  tracksStore.ClearTracks()
  const url = new URL(location.href)
  const id = url.searchParams.get('id')
  const type = url.searchParams.get('type')

  if (id && type) {
    switch (type) {
      case 'album':
        await albumStore.FetchAlbumTracks(id)
        break
      case 'playlist':
        await playlistsStore.FetchPlaylistTracks(id)
        break
    }
  }
  sortStore.sortTracks()
})


const sortingStore = useSortingStore();

const availableSorters = sortingStore.getAvailableSorters()
const selectedSortType = computed({
  get: () => sortingStore.selectedSortType,
  set: (val: string) => sortingStore.setSortType(val),
})
</script>

<template>
  <v-col>
    <v-row>
      <v-select v-model="selectedSortType" :items="availableSorters" item-value="type" label="Track Sorter"
        item-title="name">
        <template v-slot:item="{ props: itemProps, item }">
          <v-list-item v-bind="itemProps" :subtitle="item.raw.description" :title="item.raw.name" />
        </template>
      </v-select>
    </v-row>
    <v-row justify="center" class="pa-15">
      <v-col v-for="cassette in cassetteStore.cassettes" :key="cassette.id" cols="12" sm="6">
        <cassette :cassetteId="cassette.id" />
      </v-col>
    </v-row>
  </v-col>
</template>
