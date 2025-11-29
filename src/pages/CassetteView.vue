<!-- <script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseTracksStore } from '@/stores/tracks'
import { useSortingStore } from '@/stores/sorting'
import { computed } from 'vue';
import { useCassettesStore } from '@/stores/cassette'

const playlistsStore = usePlaylistsStore()
const albumStore = useAlbumsStore()
const tracksStore = UseTracksStore()
const cassetteStore = useCassettesStore()
const sortStore = useSortingStore()
const { getSides } = toRefs(cassetteStore)

const sortType = computed({
  get() { 
    return getSelectedSortType.value
  },
  set(val) {
    sortStore.setSelectedSortType(val)
    sortStore.sortTracksInSides()
  }
})

onMounted(async () => {
  tracksStore.ClearTracks()
  cassetteStore.ResetSides()
  const url = new URL(location.href)
  const id = url.searchParams.get('id')
  const type = url.searchParams.get('type')

  if (id && type) {
    switch (type) {
      case 'album':
        sortStore.setSelectedSortType(SortType.KeepOrder)
        await albumStore.FetchAlbumTracks(id)
        break
      case 'playlist':
        await playlistsStore.FetchPlaylistTracks(id)
        break
    }
  }
  sortStore.sortTracksInSides()
})

function AddSide() {
  cassetteStore.AddEmptySide()
  sortStore.sortTracksInSides()
}
</script>

<template>
  <main>
    <v-select
      v-model="sortType"
      label="Sorting Style"
      :items="getSortingTypes"
      return-object
      single-line
    />
    <v-row>
      <v-col v-for="(_, index) in getSides" :key="index">
        <cassette-side :index="index"></cassette-side>
      </v-col>
    </v-row>
    <v-btn append-icon="mdi-playlist-plus" @click="AddSide"> Add side </v-btn>
    <v-btn @click="cassetteStore.UploadCassette"> Save cassette </v-btn>
  </main>
</template> -->

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
</script>
<template>
  <cassette v-for="cassette in cassetteStore.cassettes" :key="cassette.id" :cassetteId="cassette.id" />
</template>