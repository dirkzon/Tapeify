<script setup lang="ts">
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists';

import Cassette from '@/components/Cassette.vue';
import { useCassettesStore } from '@/stores/cassette';

const sortStore = useSortingStore()
const tracksStore = useTracksStore()
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
        sortStore.setSortType('keep-order')
        break
      case 'playlist':
        await playlistsStore.FetchPlaylistTracks(id)
        sortStore.setSortType('greedy')
        break
    }
  }
  sortStore.sortTracks()
})
</script>

<template>
  <v-layout>
    <v-main class="d-flex align-center justify-center">
      <v-row justify="center" class="pa-15">
        <v-col v-for="cassette in cassetteStore.cassettes" :key="cassette.id" cols="12" sm="6">
          <cassette :cassetteId="cassette.id" />
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>
