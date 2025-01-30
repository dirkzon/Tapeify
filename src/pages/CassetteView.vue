<script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseTracksStore } from '@/stores/tracks'

const playlistsStore = usePlaylistsStore()
const albumStore = useAlbumsStore()
const tracksStore = UseTracksStore()
const { getTracks } = toRefs(tracksStore)

onMounted(async () => {
  tracksStore.ClearTracks()
  const url = new URL(location.href)
  const id = url.searchParams.get('id')
  const type = url.searchParams.get('type')

  if (id) {
    switch (type) {
      case 'album':
        await albumStore.FetchAlbumTracks(id)
        break
      case 'playlist':
        await playlistsStore.SetPlaylistTracks(id)
        break
    }
  }
})
</script>

<template>
  <main>
    {{ getTracks }}
  </main>
</template>
