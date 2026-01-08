<script lang="ts" setup>
import { usePlaylistsStore } from '@/stores/playlists';
import type { PlaylistSearchResult } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const playlistsStore = usePlaylistsStore()

let offset = ref(0)
let limit = ref(10)
let query = ref('')
const loading = ref(false)
const playlists = ref<PlaylistSearchResult>({
    playlists: [],
    next: false,
    previous: false
})

const props = defineProps<{
    initQuery: string
    onQueryChange?: (newQuery: string) => void
}>()

onMounted(async () => {
    if (props.initQuery === '') {
        return
    }
    query.value = props.initQuery
    playlists.value = await playlistsStore.searchPlaylists(
        props.initQuery,
        limit.value,
        offset.value
    )
})

async function searchPlaylists() {
    loading.value = true
    offset.value = 0
    limit.value = 10
    props.onQueryChange?.(query.value)
    playlists.value = await playlistsStore.searchPlaylists(
        query.value,
        limit.value,
        offset.value
    )
    loading.value = false
}

async function LoadMorePlaylists({ side, done }: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) {
    offset.value += limit.value
    const newPlaylists = await playlistsStore.searchPlaylists(
        props.initQuery,
        limit.value,
        offset.value
    )
    playlists.value.playlists.push(...newPlaylists.playlists)
    if (!newPlaylists.next) {
        done('empty')
    } else {
        done('ok')
    }
}

function ClearSearchBar() {
  query.value = ''
  playlists.value.playlists = []
  offset.value = 0
  limit.value = 10
}
</script>

<template>
    <v-card flat>
        <v-text-field v-model="query" label="Search playlists on Spotify" append-inner-icon="mdi-magnify"
            :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
            hide-details @click:append-inner="searchPlaylists" @keydown.enter="searchPlaylists" />
        <PlaylistList :playlists="playlists.playlists" :load="LoadMorePlaylists" />
    </v-card>
</template>