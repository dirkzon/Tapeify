<route>
{
  "meta": {
    "layout": "cassetteControls"
  }
}
</route>

<script setup lang="ts">
import { useTracksStore } from '@/stores/tracks';
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists';
import { useCassettesStore } from '@/stores/cassette';
import { useHotkey } from 'vuetify/dist/vuetify.js';
import { useKeyboardTrapFactory } from '@pdanpdan/vue-keyboard-trap'
import { useLayoutStore } from '@/stores/layout';
import { resetStores } from '@/utils/reset.stores';

const gridRef = ref<HTMLElement | null>(null)
const useKeyboardTrap = useKeyboardTrapFactory({})
useKeyboardTrap(gridRef, { roving: true, grid: true }, true)

const layoutStore = useLayoutStore()
const tracksStore = useTracksStore()
const albumStore = useAlbumsStore()
const playlistsStore = usePlaylistsStore()
const cassetteStore = useCassettesStore()

useHotkey('ctrl+a', () => {
  const lastSelectedTrackId = tracksStore.lastSelectedTrackId
  if (lastSelectedTrackId) {
    const lastSelectedTrackLayout = layoutStore.getTrackLayout(lastSelectedTrackId)
    if (lastSelectedTrackLayout) {
      const trackIdsOnSameSide = layoutStore.getLayoutbyCassetteAndSide(lastSelectedTrackLayout.cassetteId, lastSelectedTrackLayout.sideIndex)
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
        layoutStore.setSortType('keep-order')
        break
      case 'playlist':
        await playlistsStore.FetchPlaylistTracks(id)
        layoutStore.setSortType('greedy')
        break
    }
  }

  layoutStore.calculateLayout()
})

onUnmounted(() => resetStores())

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
  <div ref="gridRef" v-kbd-trap.roving.grid aria-label="item grid" class="grid-shell">
    <v-row justify="center">
      <v-col v-for="cassette in cassetteStore.cassettes" :key="cassette.id" cols="12" sm="6">
        <cassette :cassetteId="cassette.id" class="included" />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.grid-shell {
  display: flex;
}
</style>
