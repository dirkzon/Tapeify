<script setup lang="ts">
import { useAlbumsStore } from '@/stores/album'
import { usePaginationStore } from '@/stores/pagination'
import { usePlaylistsStore } from '@/stores/playlists'
import { useSearchStore } from '@/stores/search'
import { onMounted, toRefs } from 'vue'
import PlaylistComponent from '../components/PlaylistComponent.vue'

const playlistsStore = usePlaylistsStore()
const { getPlaylists } = toRefs(playlistsStore)

const albumStore = useAlbumsStore()
const { getAlbums } = toRefs(albumStore)

const searchStore = useSearchStore()

const paginationStore = usePaginationStore()
const { nextPageAvailable, previousPageAvailable, limit, offset } = toRefs(paginationStore)

let query = ''

onMounted(() => {
  search()
})

function previous() {
  paginationStore.setOffset(offset.value - limit.value)
  search()
}

function next() {
  paginationStore.setOffset(offset.value + limit.value)
  search()
}

function search() {
  if (query) {
    searchStore.SearchPlaylistsAndAlbums(query)
  } else {
    albumStore.ClearAlbums()
    playlistsStore.FetchUsersPlayists()
  }
}
</script>

<template>
  <main>
    <input v-model="query" />
    <button elevation="2" @click="search">search</button>
    <li v-for="(playlist, index) in getPlaylists" :key="index">
      <PlaylistComponent :playlist="playlist"> </PlaylistComponent>
    </li>

    {{ getAlbums }}
    <button elevation="2" @click="previous" :disabled="previousPageAvailable">previous</button>
    <h1>{{ offset / limit }}</h1>
    <button elevation="2" @click="next" :disabled="nextPageAvailable">next</button>
  </main>
</template>
