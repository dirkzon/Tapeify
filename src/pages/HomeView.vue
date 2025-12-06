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
let offset = 0
let limit = 10

const loading = ref(false)

const playlists: Ref<Playlist[]> = ref([])
const albums: Ref<Album[]> = ref([])

onMounted(async () => {
  const url = new URL(location.href)

  offset = Number(url.searchParams.get('offset')) ?? 0
  limit = Number(url.searchParams.get('limit')) ?? 10
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
      limit,
      offset
    )
    playlists.value = searchResults.playlists
    albums.value = searchResults.albums
    updateUrl()
  } else {
    playlists.value = await playlistsStore.FetchUsersPlayists(limit, offset)
  }

  loading.value = false
}


function Previous() {

}

function Next() {

}

function updateUrl() {
  router.push({
    name: '/HomeView',
    query: {
      offset: offset,
      limit: limit,
      query: query.value
    }
  })
}

function ClearSearchBar() {
  query = ref<string>('')
  Search()
}
</script>

<template>
  <main>
    <v-card class="cassette-card" min-width="400px" max-width="800" variant="outlined" min-height="80px">
        <v-toolbar color="pink">
        <v-text-field v-model="query" label="Search playlists & albums" append-inner-icon="mdi-magnify"
          :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense hide-details
          @click:append-inner="Search" @keydown.enter="Search" />
        </v-toolbar>
        <v-row>
          <v-col v-if="playlists.length > 0">
            <PlaylistList :playlists="playlists" />
          </v-col>
          <v-col v-if="albums.length > 0">
            <AlbumList :albums="albums" />
          </v-col>
        </v-row>
        <!-- <v-row class="ma-1" align="center" justify="center">
        <v-btn
          variant="plain"
          density="comfortable"
          icon="mdi-chevron-left"
          :disabled="!previousPageAvailable"
          @click="Previous"
        />
        <div class="button">
          {{ offset / limit + 1 }}
        </div>
        <v-btn
          variant="plain"
          density="comfortable"
          icon="mdi-chevron-right"
          :disabled="!nextPageAvailable"
          @click="Next"
        />
      </v-row> -->
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
