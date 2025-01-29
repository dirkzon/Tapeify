<script setup lang="ts">
import router from '@/router'
import { useAlbumsStore } from '@/stores/album'
import { usePaginationStore } from '@/stores/pagination'
import { usePlaylistsStore } from '@/stores/playlists'
import { UseSearchStore } from '@/stores/search'
import { onMounted, toRefs } from 'vue'

const playlistsStore = usePlaylistsStore()
const { getPlaylists } = toRefs(playlistsStore)

const albumStore = useAlbumsStore()
const { getAlbums } = toRefs(albumStore)

const searchStore = UseSearchStore()

const paginationStore = usePaginationStore()
const { nextPageAvailable, previousPageAvailable, limit, offset } = toRefs(paginationStore)

let query = ''

onMounted(() => {
  paginationStore.resetPagination()
  GetItems()
})

function Previous() {
  paginationStore.setOffset(offset.value - limit.value)
  GetItems()
}

function Next() {
  paginationStore.setOffset(offset.value + limit.value)
  GetItems()
}

function Search() {
  paginationStore.resetPagination()
  GetItems()
}

function GetItems() {
  if (query) {
    searchStore.SearchPlaylistsAndAlbums(query)
  } else {
    albumStore.ClearAlbums()
    playlistsStore.FetchUsersPlayists()
  }
}

function ClearSearchBar() {
  query = ''
  Search()
}

function SelectItem(id: string, type: string) {
  router.push({
    name: 'cassette',
    query: {
      id: id,
      type: type
    }
  })
}
</script>

<template>
  <main>
    <v-card class="ma-10 pa-3" min-width="400px" max-width="800">
      <v-text-field
        v-model="query"
        label="Search playlists & albums"
        append-inner-icon="mdi-magnify"
        clear-icon="mdi-close-circle"
        clearable
        type="text"
        :loading="getAlbums.length == 0 && getPlaylists.length == 0"
        @click:clear="ClearSearchBar"
        @click:append-inner="Search"
        @keydown.enter="Search"
      />
      <v-row>
        <v-col v-if="getPlaylists.length > 0" cols="12" :md="getAlbums.length > 0 ? 6 : 12">
          <v-list lines="two" density="compact">
            <v-list-subheader v-if="query == ''">Your Playlists</v-list-subheader>
            <v-list-subheader v-else>Playlists</v-list-subheader>
            <v-list-item
              v-for="playlist in getPlaylists"
              :key="playlist.id"
              :title="playlist.name"
              :subtitle="playlist.owner"
              @click="SelectItem(playlist.id, 'playlist')"
            >
              <template #prepend>
                <v-avatar tile>
                  <v-img :src="String(playlist.image)" />
                </v-avatar>
              </template>
              <v-divider />
            </v-list-item>
          </v-list>
        </v-col>
        <v-col v-if="getAlbums.length > 0" cols="12" :md="getPlaylists.length > 0 ? 6 : 12">
          <v-list lines="two" density="compact">
            <v-list-subheader>Albums</v-list-subheader>
            <v-list-item
              v-for="album in getAlbums"
              :key="album.id"
              :title="album.name"
              :subtitle="album.artists.toString()"
              @click="SelectItem(album.id, 'album')"
            >
              <template #prepend>
                <v-avatar tile>
                  <v-img :src="String(album.image)" />
                </v-avatar>
              </template>
              <v-divider />
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
      <v-row class="ma-1" align="center" justify="center">
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
      </v-row>
    </v-card>
  </main>
</template>
