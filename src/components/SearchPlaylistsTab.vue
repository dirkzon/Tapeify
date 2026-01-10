<script lang="ts" setup>
import router from '@/router'
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
const tab = 'search_playlists'


onMounted(async () => {
    const url = new URL(location.href)

    const queryParam = url.searchParams.get('query')
    const tabParam = url.searchParams.get('tab')

    if (queryParam !== null && tabParam === tab) {
        query.value = queryParam
        playlists.value = await playlistsStore.searchPlaylists(
            query.value,
            limit.value,
            offset.value
        )
    }
})

async function searchPlaylists() {
    updateUrl()
    if (query.value === '') {
        playlists.value.playlists = []
    } else {
        loading.value = true
        offset.value = 0
        playlists.value = await playlistsStore.searchPlaylists(
            query.value,
            limit.value,
            offset.value
        ).finally(() => loading.value = false)
    }
}

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
                tab: tab
            }
        });
    }
}
</script>

<template>
    <v-card flat>
        <v-text-field v-model:model-value="query" label="Search playlists on Spotify" append-inner-icon="mdi-magnify"
            :loading="loading" dense hide-details @keydown.enter="searchPlaylists" @update:model-value="searchPlaylists"
            @click:clear="ClearSearchBar" :clearable="true"/>
        <PlaylistList :playlists="playlists.playlists" :load="LoadMorePlaylists" />
    </v-card>
</template>