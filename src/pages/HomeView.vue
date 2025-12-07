<script setup lang="ts">
import router from '@/router'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseSearchStore } from '@/stores/search'
import type { Playlist, Album } from '@/types/tapeify/models'
import { onMounted } from 'vue'
import { ref, type Ref } from 'vue'

const playlistsStore = usePlaylistsStore()
const searchStore = UseSearchStore()

let query = ref('')
let offset = ref(0)
let limit = ref(10)
const loading = ref(false)
const playlists: Ref<Playlist[]> = ref([])
const albums: Ref<Album[]> = ref([])
const nextPageAvailable = ref(false)
const previousPageAvailable = ref(false)

onMounted(async () => {
  const url = new URL(location.href)

  if (url.searchParams.get('limit')) {
    limit.value = Number(url.searchParams.get('limit'))
  }
  if (url.searchParams.get('offset')) {
    offset.value = Number(url.searchParams.get('offset'))
  }

  query.value = url.searchParams.get('query') ?? ''

  Search()
})

async function Search() {
  loading.value = true

  playlists.value = []
  albums.value = []

  if (query.value.trim() !== '') {
    const searchResults = await searchStore.SearchPlaylistsAndAlbums(
      query.value,
      limit.value,
      offset.value
    )
    playlists.value = searchResults.playlists
    albums.value = searchResults.albums
    nextPageAvailable.value = searchResults.next
    previousPageAvailable.value = searchResults.previous
    updateUrl()
  } else {
    const usersPlaylists = await playlistsStore.FetchUsersPlayists(limit.value, offset.value)
    playlists.value = usersPlaylists.playlists
    nextPageAvailable.value = usersPlaylists.next
    previousPageAvailable.value = usersPlaylists.previous
    updateUrl()
  }

  loading.value = false
}

function Next() {
  offset.value += limit.value
  Search()
}

function Previous() {
  offset.value -= limit.value
  Search()
}

function resetPaginationAndSearch() {
  offset.value = 0
  limit.value = 10
  Search()
}

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
  Search()
}
</script>

<template>
  <main>
    <v-card class="cassette-card" min-width="400px" max-width="800" variant="outlined" min-height="150px">
      <v-toolbar color="pink">
        <v-text-field v-model="query" label="Search playlists & albums" append-inner-icon="mdi-magnify"
          :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
          hide-details @click:append-inner="resetPaginationAndSearch" @keydown.enter="resetPaginationAndSearch" />
      </v-toolbar>
      <v-row>
        <v-col>
          <PlaylistList :playlists="playlists" :loading="loading" :loading-item-count="limit"/>
        </v-col>
        <v-col v-if="(albums.length > 0) || (query.length > 0 && loading)" >
          <AlbumList :albums="albums" :loading="loading" :loading-item-count="limit"/>
        </v-col>
      </v-row>
      <v-row class="ma-1" align="center" justify="center">
        <v-btn variant="plain" density="comfortable" icon="mdi-chevron-left" :disabled="!previousPageAvailable"
          @click="Previous" />
        <div class="button">
          {{ offset / limit + 1 }}
        </div>
        <v-btn variant="plain" density="comfortable" icon="mdi-chevron-right" :disabled="!nextPageAvailable"
          @click="Next" />
      </v-row>
    </v-card>
  </main>
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
