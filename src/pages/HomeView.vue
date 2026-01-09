<script setup lang="ts">
import router from '@/router'
import { onMounted } from 'vue'
import { ref } from 'vue'

const selectedTab = ref('user_playlists')
const initAlbumQuery = ref('')
const initPlaylistQuery = ref('')

onMounted(async () => {
  const url = new URL(location.href)

  const queryParam = url.searchParams.get('query')
  const tabParam = url.searchParams.get('tab')

  if (queryParam !== null && tabParam !== null) {
    selectedTab.value = tabParam
    if (tabParam === 'search_albums') {
      initAlbumQuery.value = queryParam
    }
    if (tabParam === 'search_playlists') {
      initPlaylistQuery.value = queryParam
    }
  }
})

function updateUrl(query: string) {
  if (query === '') {
    router.push({
      name: '/HomeView',
    });
  } else {
    router.push({
      name: '/HomeView',
      query: {
        query: query,
        tab: selectedTab.value
      }
    });
  }
}
</script>

<template>
  <v-card class="cassette-card" min-width="400px" max-width="800" variant="outlined" min-height="200px">
    <v-toolbar color="pink" title="Select Playlist or Album">
      <template v-slot:extension>
        <v-tabs v-model="selectedTab" align-tabs="center">
          <v-tab value="user_playlists">My Playlists</v-tab>
          <v-tab value="search_albums">Search Albums</v-tab>
          <v-tab value="search_playlists">Search Playlists</v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-window v-model="selectedTab" class="pa-3">
      <v-tabs-window-item value="user_playlists">
        <user-playlists-tab />
      </v-tabs-window-item>
      <v-tabs-window-item value="search_albums">
        <SearchAlbumsTab :initQuery="initAlbumQuery" :onQueryChange="updateUrl" />
      </v-tabs-window-item>
      <v-tabs-window-item value="search_playlists">
        <SearchPlaylistsTab :initQuery="initPlaylistQuery" :onQueryChange="updateUrl" />
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
