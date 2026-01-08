<script lang="ts" setup>
import { usePlaylistsStore } from '@/stores/playlists';
import type { PlaylistSearchResult } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const playlistsStore = usePlaylistsStore()

let offset = ref(0)
let limit = ref(10)

const playlists = ref<PlaylistSearchResult>({
    playlists: [],
    next: false,
    previous: false
})

onMounted(async () => {
    playlists.value = await playlistsStore.FetchUsersPlayists(
        limit.value,
        offset.value
    )
})

async function LoadMorePlaylists({ side, done }: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) {
    offset.value += limit.value
    const newPlaylists = await playlistsStore.FetchUsersPlayists(
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
</script>

<template>
    <v-card flat>
        <PlaylistList :playlists="playlists.playlists" :load="LoadMorePlaylists" />
    </v-card>
</template>