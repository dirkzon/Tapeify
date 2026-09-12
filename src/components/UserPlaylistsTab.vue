<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePlaylistsStore } from '@/stores/playlists'
import type { PlaylistSearchResult } from '@/types/tapeify/models'
import type {
    InfiniteScrollSide,
    InfiniteScrollStatus,
} from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs'

const playlistsStore = usePlaylistsStore()

const offset = ref(0)
const limit = ref(10)
const error = ref(false)

const playlists = ref<PlaylistSearchResult>({
    playlists: [],
    next: false,
    previous: false,
})

async function fetchInitialPlaylists() {
    error.value = false

    try {
        playlists.value = await playlistsStore.FetchUsersPlayists(
            limit.value,
            offset.value,
        )
    } catch {
        error.value = true
    }
}

async function loadMorePlaylists({
    done,
}: {
    side: InfiniteScrollSide
    done: (status: InfiniteScrollStatus) => void
}) {
    if (!playlists.value.next) {
        done('empty')
        return
    }

    try {
        offset.value += limit.value

        const newPlaylists = await playlistsStore.FetchUsersPlayists(
            limit.value,
            offset.value,
        )

        playlists.value.playlists.push(...newPlaylists.playlists)
        playlists.value.next = newPlaylists.next

        done(newPlaylists.next ? 'ok' : 'empty')
    } catch {
        done('error')
    }
}

onMounted(fetchInitialPlaylists)
</script>

<template>
    <div>
        <v-alert v-if="error" class="ma-4" type="error" variant="tonal" title="Unable to load playlists"
            text="Please try again." closable @click:close="fetchInitialPlaylists" />

        <PlaylistList v-else :playlists="playlists.playlists" :has-more="playlists.next" :load="loadMorePlaylists" />
    </div>
</template>
