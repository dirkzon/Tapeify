<script setup lang="ts">
import { usePlaylistsStore } from '@/stores/playlists';
import { onMounted, toRefs } from 'vue';

const playlistsStore = usePlaylistsStore()
const { getPlaylists, previousPageAvailable, nextPageAvailable } = toRefs(playlistsStore)

let offset = 0
const limit = 10

onMounted(() => {
  playlistsStore.FetchUsersPlayists(limit, offset)
})

function previous() {
  offset = offset - limit
  playlistsStore.FetchUsersPlayists(limit, offset)
}

function next() {
  offset = offset + limit
  playlistsStore.FetchUsersPlayists(limit, offset)
}
</script>

<template>
  <main>
    {{ getPlaylists }}
    <button elevation="2" @click="previous" :disabled="previousPageAvailable">previous</button>
    <h1> {{ offset / limit }} </h1>
    <button elevation="2" @click="next" :disabled="nextPageAvailable">next</button>
  </main>
</template>
