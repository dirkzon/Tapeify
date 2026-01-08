<script setup lang="ts">
import router from '@/router'
import { onMounted } from 'vue'
import { ref } from 'vue'

let playlistQuery = ref('')
let albumQuery = ref('')

onMounted(async () => {
  const url = new URL(location.href)
  playlistQuery.value = url.searchParams.get('playlistQuery') ?? ''
  albumQuery.value = url.searchParams.get('albumQuery') ?? ''
})

function updateUrl(playlistQuery: string, albumQuery: string) {
  const query: Record<string, string> = {};

  if (playlistQuery.trim() !== '') {
    query.playlistQuery = playlistQuery;
  }

  if (albumQuery.trim() !== '') {
    query.albumQuery = albumQuery;
  }

  router.push({
    name: '/HomeView',
    query: query
  });
}

function onPlaylistQueryChange(newQuery: string) {
  updateUrl(newQuery, '')
}
function onAlbumQueryChange(newQuery: string) {
  updateUrl('', newQuery)
}

const tab = ref('user_playlists')
</script>

<template>
  <v-card class="cassette-card" min-width="400px" max-width="800" variant="outlined" min-height="200px">
    <v-toolbar color="pink" title="Select Playlist or Album">
      <template v-slot:extension>
        <v-tabs v-model="tab" align-tabs="center">
          <v-tab value="user_playlists">My Playlists</v-tab>
          <v-tab value="search_albums">Search Albums</v-tab>
          <v-tab value="search_playlists">Search Playlists</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-window v-model="tab" class="pa-3">
      <v-tabs-window-item value="user_playlists">
        <user-playlists-tab />
      </v-tabs-window-item>
      <v-tabs-window-item value="search_albums">
        <SearchAlbumsTab :initQuery="albumQuery" :onQueryChange="onAlbumQueryChange" />
      </v-tabs-window-item>
      <v-tabs-window-item value="search_playlists">
        <SearchPlaylistsTab :initQuery="playlistQuery" :onQueryChange="onPlaylistQueryChange" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<style scoped>
.cassette-card {
  margin: 16px auto;
  max-width: 900px;
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
