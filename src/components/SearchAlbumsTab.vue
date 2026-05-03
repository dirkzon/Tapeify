<script lang="ts" setup>
import router from '@/router'
import { useAlbumsStore } from '@/stores/album';
import type { AlbumSearchResult } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';
import debounce from 'lodash-es/debounce'

const albumsStore = useAlbumsStore()

let offset = ref(0)
let limit = ref(10)
const loading = ref(false)
const albums = ref<AlbumSearchResult>({
  albums: [],
  next: false,
  previous: false
})
const DEBOUNCE_DELAY_MS = 200

let query = ref('')
watch(query, (newQuery) => {
  if (newQuery.length === 0) {
    albums.value.albums = []
    return
  }
  loading.value = true
  searchAlbums(newQuery, limit.value, offset.value)
  loading.value = false
})

const searchAlbums = debounce(async (query: string, limit: number = 10, offset: number = 0) => {
  {
    if (query === '') {
      albums.value.albums = []
    } else {
      offset = 0
      albums.value = await albumsStore.searchAlbums(
        query,
        limit,
        offset
      )
    }
  }
}, DEBOUNCE_DELAY_MS)

async function LoadMoreAlbums({ side, done }: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) {
  if (query.value === '') {
    albums.value.albums = []
    return
  }
  offset.value += limit.value
  done('loading')
  await albumsStore.searchAlbums(
    query.value,
    limit.value,
    offset.value
  ).then((newAlbums) => {
    albums.value.albums.push(...newAlbums.albums)
    if (!newAlbums.next) {
      done('empty')
    } else {
      done('ok')
    }
  }).catch(() => done('error'))
}

function ClearSearchBar() {
  albums.value.albums = []
  query.value = ''
  offset.value = 0
}

</script>

<template>
  <v-card flat>
    <v-text-field v-model:model-value="query" label="Search albums on Spotify" append-inner-icon="mdi-magnify"
      :loading="loading" @click:clear="ClearSearchBar" density="compact" hide-details
      @keydown.enter="searchAlbums(query, limit, offset)" clearable />
    <AlbumList :albums="albums.albums" :load="LoadMoreAlbums" />
  </v-card>
</template>
