<script lang="ts" setup>
import router from '@/router'
import { useAlbumsStore } from '@/stores/album';
import type { AlbumSearchResult } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const albumsStore = useAlbumsStore()

let offset = ref(0)
let limit = ref(10)
let query = ref('')
const loading = ref(false)
const albums = ref<AlbumSearchResult>({
    albums: [],
    next: false,
    previous: false
})
const tab = 'search_albums'

onMounted(async () => {
    const url = new URL(location.href)

    const queryParam = url.searchParams.get('query')
    const tabParam = url.searchParams.get('tab')

    if (queryParam !== null && tabParam === tab) {
        query.value = queryParam
        albums.value = await albumsStore.searchAlbums(
            query.value,
            limit.value,
            offset.value
        )
    }
})

async function searchAlbums() {
    updateUrl()
    if (query.value === '') {
        albums.value.albums = []
    } else {
        loading.value = true
        offset.value = 0
        albums.value = await albumsStore.searchAlbums(
            query.value,
            limit.value,
            offset.value
        ).finally(() => loading.value = false)
    }
}

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
                tab: tab
            }
        });
    }
}

</script>

<template>
    <v-card flat>
        <v-text-field v-model:model-value="query" label="Search albums on Spotify" append-inner-icon="mdi-magnify"
            :loading="loading" @click:clear="ClearSearchBar" dense hide-details @update:model-value="searchAlbums"
            @click:append-inner="searchAlbums" @keydown.enter="searchAlbums" clearable />
        <AlbumList :albums="albums.albums" :load="LoadMoreAlbums" />
    </v-card>
</template>