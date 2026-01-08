<script lang="ts" setup>
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

const props = defineProps<{
    initQuery: string
    onQueryChange?: (newQuery: string) => void
}>()

onMounted(async () => {
    if (props.initQuery === '') {
        return
    }
    query.value = props.initQuery
    albums.value = await albumsStore.searchAlbums(
        props.initQuery,
        limit.value,
        offset.value
    )
})

async function searchAlbums() {
    loading.value = true
    offset.value = 0
    limit.value = 10
    props.onQueryChange?.(query.value)
    albums.value = await albumsStore.searchAlbums(
        query.value,
        limit.value,
        offset.value
    )
    loading.value = false
}

async function LoadMoreAlbums({ side, done }: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) {
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
    query.value = ''
    albums.value.albums = []
    offset.value = 0
    limit.value = 10
}

</script>

<template>
    <v-card flat>
        <v-text-field v-model="query" label="Search albums on Spotify" append-inner-icon="mdi-magnify"
            :loading="loading" clear-icon="mdi-close-circle" clearable type="text" @click:clear="ClearSearchBar" dense
            hide-details @click:append-inner="searchAlbums" @keydown.enter="searchAlbums" />
        <AlbumList :albums="albums.albums" :load="LoadMoreAlbums" />
    </v-card>
</template>