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

const searchStore = UseSearchStore()

const paginationStore = usePaginationStore()
const { nextPageAvailable, previousPageAvailable, limit, offset } = toRefs(paginationStore)

let query = ''

onMounted(() => {
  const url = new URL(location.href)

  if (url.searchParams.has('offset') && url.searchParams.has('limit')) {
    const offset = Number(url.searchParams.get('offset'))
    paginationStore.setOffset(offset)

    const limit = Number(url.searchParams.get('limit'))
    paginationStore.setLimit(limit)
  } else {
    paginationStore.setLimit(10)
    paginationStore.resetPagination()
  }

  if (url.searchParams.has('q')) {
    query = String(url.searchParams.get('q'))
  }

  GetItems()
})

const albums = computed(() => albumStore.albums)

function Previous() {
  paginationStore.setOffset(offset.value - limit.value)
  updateUrl()
  GetItems()
}

function Next() {
  paginationStore.setOffset(offset.value + limit.value)
  updateUrl()
  GetItems()
}

function Search() {
  paginationStore.resetPagination()
  updateUrl()
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

function updateUrl() {
  router.push({
    name: '/HomeView',
    query: {
      offset: offset.value,
      limit: limit.value,
      ...(query == '' ? {} : { q: query })
    }
  })
}

function ClearSearchBar() {
  query = ''
  Search()
}

function SelectItem(id: string, type: string) {
  router.push({
    name: '/CassetteView',
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
        :loading="albums.length == 0 && getPlaylists.length == 0"
        @click:clear="ClearSearchBar"
        @click:append-inner="Search"
        @keydown.enter="Search"
      />
      <v-row>
        <v-col v-if="getPlaylists.length > 0" cols="12" :md="albums.length > 0 ? 6 : 12">
          <v-list lines="two" density="compact">
            <v-list-subheader v-if="query == ''"> Your Playlists </v-list-subheader>
            <v-list-subheader v-else> Playlists </v-list-subheader>
            <v-list-item
              v-for="playlist in getPlaylists"
              :key="playlist.id"
              :title="playlist.name"
              :subtitle="playlist.owner"
              @click="SelectItem(playlist.id, 'playlist')"
            >
              <template #prepend>
                <v-avatar tile>
                  <v-img v-if="playlist.image" :src="playlist.image.href" />
                  <v-icon v-else icon="mdi-playlist-music" />
                </v-avatar>
              </template>
              <v-divider />
            </v-list-item>
          </v-list>
        </v-col>
        <v-col v-if="albums.length > 0" cols="12" :md="getPlaylists.length > 0 ? 6 : 12">
          <v-list lines="two" density="compact">
            <v-list-subheader>Albums</v-list-subheader>
            <v-list-item
              v-for="album in albums"
              :key="album.id"
              :title="album.name"
              :subtitle="album.artists.toString()"
              @click="SelectItem(album.id, 'album')"
            >
              <template #prepend>
                <v-avatar tile>
                  <v-img v-if="album.image" :src="album.image.href" />
                  <v-icon v-else icon="mdi-album" />
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
