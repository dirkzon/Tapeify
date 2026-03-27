<script lang="ts" setup>
import router from '@/router'
import { usePlaylistsStore } from '@/stores/playlists';
import type { PlaylistSearchResult } from '@/types/tapeify/models';
import debounce from 'lodash/debounce';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const playlistsStore = usePlaylistsStore()

let offset = ref(0)
let limit = ref(10)
const loading = ref(false)
const playlists = ref<PlaylistSearchResult>({
  playlists: [],
  next: false,
  previous: false
})

const TAB_NAME = 'search_playlists'
const DEBOUNCE_DELAY_MS = 200

let query = ref('')
watch(query, (newQuery) => {
  if (newQuery.length === 0) {
    playlists.value.playlists = []
    updateUrl()
    return
  }
  loading.value = true
  searchPlaylists(newQuery, limit.value, offset.value)
  loading.value = false
})

onMounted(async () => {
  const url = new URL(location.href)

  const queryParam = url.searchParams.get('query')
  const tabParam = url.searchParams.get('tab')

  if (queryParam !== null && tabParam === TAB_NAME) {
    query.value = queryParam
    playlists.value = await playlistsStore.searchPlaylists(
      query.value,
      limit.value,
      offset.value
    )
  }
})

const searchPlaylists = debounce(async (query: string, limit: number = 10, offset: number = 0) => {
  updateUrl()
  if (query === '') {
    playlists.value.playlists = []
  } else {
    loading.value = true
    offset = 0
    playlists.value = await playlistsStore.searchPlaylists(
      query,
      limit,
      offset
    ).finally(() => loading.value = false)
  }

}, DEBOUNCE_DELAY_MS)

async function LoadMorePlaylists({ side, done }: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) {
  if (query.value === '') {
    playlists.value.playlists = []
    return
  }
  updateUrl()
  offset.value += limit.value
  done('loading')
  await playlistsStore.searchPlaylists(
    query.value,
    limit.value,
    offset.value
  ).then((newPlaylists) => {
    playlists.value.playlists.push(...newPlaylists.playlists)
    if (!newPlaylists.next) {
      done('empty')
    } else {
      done('ok')
    }
  }).catch(() => done('error'))
}

function ClearSearchBar() {
  playlists.value.playlists = []
  offset.value = 0
  query.value = ''
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
    <v-text-field v-model:model-value="query" label="Search playlists on Spotify" append-inner-icon="mdi-magnify"
      :loading="loading" density="compact" hide-details @keydown.enter="searchPlaylists(query, limit, offset)" clearable
      @click:clear="ClearSearchBar" />
    <PlaylistList :playlists="playlists.playlists" :load="LoadMorePlaylists" />
  </v-card>
</template>
