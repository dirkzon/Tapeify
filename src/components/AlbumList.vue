<script lang="ts" setup>
import router from '@/router';
import type { Album } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const props = defineProps<{
    albums: Album[]
    load: (options: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) => void

}>()

function SelectItem(id: string) {
    router.push({
        name: '/CassetteView',
        query: {
            id: id,
            type: 'album'
        }
    })
}
</script>

<template>
    <v-list lines="two" density="compact" class="w-100 pa-3">
        <v-infinite-scroll height="500" @load="load" v-if="albums.length > 0">
            <v-list-item v-for="album in albums" :key="album.id" :title="album.name"
                :subtitle="album.artists.toString()" @click="SelectItem(album.id)">
                <template #prepend>
                    <v-avatar tile>
                        <v-img v-if="album.image" :src="album.image.toString()" />
                        <v-icon v-else icon="mdi-album" />
                    </v-avatar>
                </template>
            </v-list-item>
        </v-infinite-scroll>
    </v-list>
</template>

<style scoped></style>
