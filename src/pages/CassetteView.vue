<script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseTracksStore } from '@/stores/tracks'
import { useCassetteStore } from '@/stores/cassette'
import { VueDraggableNext } from 'vue-draggable-next'
import { useSortingStore } from '@/stores/sorting'
import { SortType } from '@/helpers/sorting/trackSorter'
import { computed } from 'vue';

const playlistsStore = usePlaylistsStore()
const albumStore = useAlbumsStore()
const tracksStore = UseTracksStore()
const cassetteStore = useCassetteStore()
const sortStore = useSortingStore()
const { getSortingTypes, getSelectedSortType } = toRefs(sortStore)
const { getSides } = toRefs(cassetteStore)

const sortType = computed({
  get() { 
    return getSelectedSortType.value
  },
  set(val: SortType) {
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
        await albumStore.SetAlbumTracks(id)
        break
      case 'playlist':
        await playlistsStore.SetPlaylistTracks(id)
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
  </main>
</template>
