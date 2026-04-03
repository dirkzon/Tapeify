<route>
{
  "meta": {
    "layout": "cassetteControls"
  }
}
</route>

<script setup lang="ts">
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists';

import Cassette from '@/components/Cassette.vue';
import { useCassettesStore } from '@/stores/cassette';
import { useHotkey } from 'vuetify/dist/vuetify.js';
import { useKeyboardTrapFactory } from '@pdanpdan/vue-keyboard-trap'

const gridRef = ref<HTMLElement | null>(null)
const useKeyboardTrap = useKeyboardTrapFactory({})
useKeyboardTrap(gridRef, { roving: true, grid: true }, true)

const sortStore = useSortingStore()
const tracksStore = useTracksStore()
const albumStore = useAlbumsStore()
const playlistsStore = usePlaylistsStore()
const cassetteStore = useCassettesStore()

useHotkey('ctrl+a', () => {
  const lastSelectedTrackId = tracksStore.lastSelectedTrackId
  if (lastSelectedTrackId) {
    const lastSelectedTrackLayout = sortStore.getTrackLayout(lastSelectedTrackId)
    if (lastSelectedTrackLayout) {
      const trackIdsOnSameSide = sortStore.getLayoutbyCassetteAndSide(lastSelectedTrackLayout.cassetteId, lastSelectedTrackLayout.sideIndex)
      if (trackIdsOnSameSide) {
        for (const trackId of trackIdsOnSameSide.trackIds) {
          tracksStore.selectedTracks.push(trackId)
        }
      }
    }
  }
})

onMounted(async () => {
  cassetteStore.initAlerts()
  tracksStore.ClearTracks()
  const url = new URL(location.href)

  const route = useRoute()

  const params = route.params
  const id = params.spotify_id
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

function onGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('.included')) return
  tracksStore.ClearSelectedTracks()
  tracksStore.lastSelectedTrackId = undefined
}

onMounted(() => document.addEventListener('click', onGlobalClick))
onBeforeUnmount(() => document.removeEventListener('click', onGlobalClick))
</script>

<template>
  <div ref="gridRef" v-kbd-trap.roving.grid aria-label="Prototype item grid" class="grid-shell">
    <v-row justify="center">
      <v-col v-for="(cassette, index) in cassetteStore.cassettes" :key="cassette.id" cols="12" sm="6">
        <cassette :cassetteId="cassette.id" :cassetteIndex="index" class="included" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.grid-shell {
  display: flex;
}
</style>
