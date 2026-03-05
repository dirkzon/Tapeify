<script lang="ts" setup>
import router from '@/router'
import { useAlbumsStore } from '@/stores/album';
import type { AlbumSearchResult } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';
import debounce from "lodash/debounce"

const albumsStore = useAlbumsStore()

let offset = ref(0)
let limit = ref(10)
const loading = ref(false)
const albums = ref<AlbumSearchResult>({
  albums: [],
  next: false,
  previous: false
})
const TAB_NAME = 'search_albums'
const DEBOUNCE_DELAY_MS = 200

let query = ref('')
watch(query, (newQuery) => {
  if (newQuery.length === 0) {
    albums.value.albums = []
    updateUrl()
    return
  }
  loading.value = true
  searchAlbums(newQuery, limit.value, offset.value)
  loading.value = false
})

onMounted(async () => {
  const url = new URL(location.href)

  const queryParam = url.searchParams.get('query')
  const tabParam = url.searchParams.get('tab')

  if (queryParam !== null && tabParam === TAB_NAME) {
    query.value = queryParam
    albums.value = await albumsStore.searchAlbums(
      query.value,
      limit.value,
      offset.value
    )
  }
})

const searchAlbums = debounce(async (query: string, limit: number = 10, offset: number = 0) => {
  {
    updateUrl()
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
  updateUrl()
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
  updateUrl()
}

function updateUrl() {
  if (query.value === '') {
    router.push({
      name: '/HomeView',
    });
  } else {
    router.push({
      name: '/HomeView',
      query: {
        query: query.value,
        tab: TAB_NAME
      }
    });
  }
}

</script>

<template>
  <v-card flat>
    <v-text-field v-model:model-value="query" label="Search albums on Spotify" append-inner-icon="mdi-magnify"
      :loading="loading" @click:clear="ClearSearchBar" dense hide-details
      @keydown.enter="searchAlbums(query, limit, offset)" clearable />
    <AlbumList :albums="albums.albums" :load="LoadMoreAlbums" />
  </v-card>
</template>
