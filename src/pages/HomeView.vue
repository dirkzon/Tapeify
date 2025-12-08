<script setup lang="ts">
import router from '@/router'
import { useAlbumsStore } from '@/stores/album'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseSearchStore } from '@/stores/search'
import type { AlbumSearchResult, PlaylistSearchResult } from '@/types/tapeify/models'
import { onMounted } from 'vue'
import { ref } from 'vue'

const playlistsStore = usePlaylistsStore()
const albumsStore = useAlbumsStore()

let query = ref('')
let offset = ref(0)
let limit = ref(10)
const loading = ref(false)

const searchPlaylistResults = ref<PlaylistSearchResult>({
  playlists: [],
  next: false,
  previous: false
})

const userPlaylistsResults = ref<PlaylistSearchResult>({
  playlists: [],
  next: false,
  previous: false
})

const searchAlbumsResponse = ref<AlbumSearchResult>({
  albums: [],
  next: false,
  previous: false
})

onMounted(async () => {
  const url = new URL(location.href)

  if (url.searchParams.get('limit')) {
    limit.value = Number(url.searchParams.get('limit'))
  }
  if (url.searchParams.get('offset')) {
    offset.value = Number(url.searchParams.get('offset'))
  }

  query.value = url.searchParams.get('query') ?? ''

  await fetchUserPlaylists()
})

async function searchPlaylists() {
  loading.value = true

  searchPlaylistResults.value = await playlistsStore.searchPlaylists(
    query.value,
    limit.value,
    offset.value
  )

  loading.value = false
}

async function searchAlbums() {
  loading.value = true

  searchAlbumsResponse.value = await albumsStore.searchAlbums(
    query.value,
    limit.value,
    offset.value
  )

  loading.value = false
}

async function fetchUserPlaylists() {
  loading.value = true

  userPlaylistsResults.value = await playlistsStore.FetchUsersPlayists(
    limit.value,
    offset.value
  )

  loading.value = false
}

// function Next() {
//   offset.value += limit.value
//   Search()
// }

// function Previous() {
//   offset.value -= limit.value
//   Search()
// }

// function resetPaginationAndSearch() {
//   offset.value = 0
//   limit.value = 10
//   Search()
// }

function updateUrl() {
  router.push({
    name: '/HomeView',
    query: {
      offset: offset.value,
      limit: limit.value,
      ...(query.value.trim() !== '' ? { query: query.value } : {})
    }
  })
}

function ClearSearchBar() {
  query = ref<string>('')
  offset.value = 0
  limit.value = 10
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
        <v-card flat>
          <v-text-field v-model="query" label="Search your playlists" append-inner-icon="mdi-magnify"
            :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
            hide-details @click:append-inner="" @keydown.enter="" />
          <PlaylistList :playlists="userPlaylistsResults.playlists" :loading="loading" :loading-item-count="limit" />
        </v-card> </v-tabs-window-item>
      <v-tabs-window-item value="search_albums">
        <v-card flat>
          <v-text-field v-model="query" label="Search albums on Spotify" append-inner-icon="mdi-magnify"
            :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
            hide-details @click:append-inner="searchAlbums" @keydown.enter="searchAlbums" />
          <AlbumList :albums="searchAlbumsResponse.albums" :loading="loading" :loading-item-count="limit" />
        </v-card> </v-tabs-window-item>
      <v-tabs-window-item value="search_playlists">
        <v-card flat>
           <v-text-field v-model="query" label="Search playlists on Spotify" append-inner-icon="mdi-magnify"
            :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
            hide-details @click:append-inner="searchPlaylists" @keydown.enter="searchPlaylists" />
          <PlaylistList :playlists="searchPlaylistResults.playlists" :loading="loading" :loading-item-count="limit" />
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
    <!-- <v-toolbar color="pink">
        <v-text-field v-model="query" label="Search playlists & albums" append-inner-icon="mdi-magnify"
          :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
          hide-details @click:append-inner="resetPaginationAndSearch" @keydown.enter="resetPaginationAndSearch" />
      </v-toolbar>
      <v-row>
        <v-col>
          <PlaylistList :playlists="searchResults.playlists" :loading="loading" :loading-item-count="limit"/>
        </v-col>
        <v-col v-if="(searchResults.albums.length > 0) || (query.length > 0 && loading)" >
          <AlbumList :albums="searchResults.albums" :loading="loading" :loading-item-count="limit"/>
        </v-col>
      </v-row>
      <v-row class="ma-1" align="center" justify="center">
        <v-btn variant="plain" density="comfortable" icon="mdi-chevron-left" :disabled="!searchResults.previous"
          @click="Previous" />
        <div class="button">
          {{ offset / limit + 1 }}
        </div>
        <v-btn variant="plain" density="comfortable" icon="mdi-chevron-right" :disabled="!searchResults.next"
          @click="Next" />
      </v-row> -->
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
