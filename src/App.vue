<script lang="ts" setup>
import { useHotkey } from 'vuetify'
import { useTracksStore } from './stores/tracks'
import { useLayoutStore } from './stores/layout'
import { useAnchorsStore } from './stores/anchor'

const trackStore = useTracksStore()
const layoutStore = useLayoutStore()
const anchorStore = useAnchorsStore()

function onGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return
  if (target.closest('.included')) return
  trackStore.ClearSelectedTracks()
  trackStore.lastSelectedTrackId = undefined
}

onMounted(() => document.addEventListener('click', onGlobalClick))
onBeforeUnmount(() => document.removeEventListener('click', onGlobalClick))

useHotkey('ctrl+a', () => {
  const lastSelectedTrackId = trackStore.lastSelectedTrackId
  if (!lastSelectedTrackId) return
  const trackLayout = layoutStore.getTrackLayout(lastSelectedTrackId)
  if (!trackLayout) return
  const trackIdsOnSameSide = layoutStore.getLayoutbyCassetteAndSide(trackLayout.cassetteId, trackLayout.sideIndex)
  if (!trackIdsOnSameSide) return
  for (const trackId of trackIdsOnSameSide.trackIds) {
    trackStore.selectedTracks.push(trackId)
  }
})

useHotkey('ctrl+l', anchor)
useHotkey('ctrl+u', unanchor)

function anchor() {
  for (const id of trackStore.selectedTracks) {

    const trackLayout = layoutStore.getTrackLayout(id)
    if (!trackLayout) {
      continue
    }
    anchorStore.anchorTrack(id, {
      cassetteId: trackLayout.cassetteId,
      sideIndex: trackLayout.sideIndex,
      position: trackLayout.position
    })
  }
  layoutStore.calculateLayout()
  if (trackStore.lastSelectedTrackId) {
    trackStore.selectedTracks = [trackStore.lastSelectedTrackId]
  }
}

function unanchor() {
  for (const id of trackStore.selectedTracks) {
    anchorStore.removeAnchor(id)
  }
  layoutStore.calculateLayout()
  if (trackStore.lastSelectedTrackId) {
    trackStore.selectedTracks = [trackStore.lastSelectedTrackId]
  }
}
</script>

<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <app-footer />
  </v-app>
</template>
