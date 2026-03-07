<script setup lang="ts">
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists';

import Cassette from '@/components/Cassette.vue';
import { useCassettesStore } from '@/stores/cassette';
import { useHotkey } from 'vuetify/dist/vuetify.js';
import { useAnchorsStore } from '@/stores/anchor';

const sortStore = useSortingStore()
const tracksStore = useTracksStore()
const albumStore = useAlbumsStore()
const playlistsStore = usePlaylistsStore()
const cassetteStore = useCassettesStore()
const anchorStore = useAnchorsStore()

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

function checkAndAchorTrack(trackId: string) {
  if (!anchorStore.isTrackAnchored(trackId)) {
    const trackLayout = sortStore.getTrackLayout(trackId)
    if (!trackLayout) return
    anchorStore.anchorTrack(
      trackId,
      {
        cassetteId: trackLayout.cassetteId,
        sideIndex: trackLayout.sideIndex,
        position: trackLayout.position
      })
  }
}

useHotkey('arrowup', () => {
  const selectedTrackId = tracksStore.lastSelectedTrackId
  if (!selectedTrackId) return
  checkAndAchorTrack(selectedTrackId)

  anchorStore.moveAnchorUp(selectedTrackId)

  sortStore.sortTracks()
})

useHotkey('arrowdown', () => {
  const selectedTrackId = tracksStore.lastSelectedTrackId
  if (!selectedTrackId) return
  checkAndAchorTrack(selectedTrackId)
  const trackLayout = sortStore.getTrackLayout(selectedTrackId)
  if (!trackLayout) return
  const layout = sortStore.getLayoutbyCassetteAndSide(trackLayout.cassetteId, trackLayout.sideIndex)
  if (!layout) return
  const maxPosition = layout.trackIds.length - 1

  anchorStore.moveAnchorDown(selectedTrackId, maxPosition)

  sortStore.sortTracks()
})

useHotkey('arrowleft', () => {
  const selectedTrackId = tracksStore.lastSelectedTrackId
  if (!selectedTrackId) return
  checkAndAchorTrack(selectedTrackId)
  const trackLayout = sortStore.getTrackLayout(selectedTrackId)
  if (!trackLayout) return
  const layout = sortStore.getLayoutbyCassetteAndSide(trackLayout.cassetteId, trackLayout.sideIndex)
  if (!layout) return
  const maxPosition = layout.trackIds.length - 1
  if (trackLayout.sideIndex === 0) return

  anchorStore.moveAnchorToOtherSide(selectedTrackId, trackLayout.sideIndex - 1, maxPosition)
  sortStore.sortTracks()
})

useHotkey('arrowright', () => {
  const selectedTrackId = tracksStore.lastSelectedTrackId
  if (!selectedTrackId) return
  checkAndAchorTrack(selectedTrackId)
  const trackLayout = sortStore.getTrackLayout(selectedTrackId)
  if (!trackLayout) return
  const layout = sortStore.getLayoutbyCassetteAndSide(trackLayout.cassetteId, trackLayout.sideIndex)
  if (!layout) return
  const maxPosition = layout.trackIds.length - 1
  if (trackLayout.sideIndex === 1) return

  anchorStore.moveAnchorToOtherSide(selectedTrackId, trackLayout.sideIndex + 1, maxPosition)
  sortStore.sortTracks()
})

onMounted(async () => {
  cassetteStore.initAlerts()
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
  <v-layout>
    <v-main class="d-flex align-center justify-center">
      <v-row justify="center" class="pa-15">
        <v-col v-for="cassette in cassetteStore.cassettes" :key="cassette.id" cols="12" sm="6">
          <cassette :cassetteId="cassette.id" class="included" />
        </v-col>
      </v-row>
    </v-main>
  </v-layout>
</template>
