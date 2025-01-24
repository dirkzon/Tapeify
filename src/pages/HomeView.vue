<script setup lang="ts">
import { useAlbumsStore } from '@/stores/album'
import { usePaginationStore } from '@/stores/pagination'
import { usePlaylistsStore } from '@/stores/playlists'
import { useSearchStore } from '@/stores/search'
import { onMounted, toRefs } from 'vue'

const playlistsStore = usePlaylistsStore()
const { getPlaylists } = toRefs(playlistsStore)

const albumStore = useAlbumsStore()
const { getAlbums } = toRefs(albumStore)

const searchStore = useSearchStore()

const paginationStore = usePaginationStore()
const { nextPageAvailable, previousPageAvailable, limit, offset } = toRefs(paginationStore)

// eslint-disable-next-line prefer-const
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
    <input v-model="query">
    <button
      elevation="2"
      @click="search"
    >
      search
    </button>

    <v-card max-width="400">
      <v-toolbar>
        <v-toolbar-title>Playlists</v-toolbar-title>
      </v-toolbar>

      <v-list
        lines="two"
        density="compact"
      >
        <v-list-item
          v-for="item in getPlaylists"
          :key="item.id"
          :title="item.name"
          :subtitle="item.owner"
        >
          <template #prepend>
            <v-avatar tile>
              <v-img :src="String(item.image)" />
            </v-avatar>
          </template>
          <v-divider />
        </v-list-item>
      </v-list>
    </v-card>

    {{ getAlbums }}
    <button
      elevation="2"
      :disabled="previousPageAvailable"
      @click="previous"
    >
      previous
    </button>
    <h1>{{ offset / limit }}</h1>
    <button
      elevation="2"
      :disabled="nextPageAvailable"
      @click="next"
    >
      next
    </button>
  </main>
</template>
