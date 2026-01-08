<script lang="ts" setup>
import router from '@/router';
import type { Album } from '@/types/tapeify/models';
import type { InfiniteScrollSide, InfiniteScrollStatus } from 'vuetify/lib/components/VInfiniteScroll/VInfiniteScroll.mjs';

const props = defineProps<{
    albums: Album[]
    load: (options: { side: InfiniteScrollSide; done: (status: InfiniteScrollStatus) => void }) => void
}>()

const infiniteScrollRef = useTemplateRef('albumsScroll')

function SelectItem(id: string) {
    router.push({
        name: '/CassetteView',
        query: {
            id: id,
            type: 'album'
        }
    })
}

function reset() {
    infiniteScrollRef.value?.reset('end')
}
</script>

<template>
    <v-list lines="two" density="compact" class="w-100 pa-3">
        <v-infinite-scroll height="500" @load="load" v-if="albums.length > 0" ref="albumsScroll">
            <v-list-item v-for="album in albums" :key="album.id" :title="album.name"
                :subtitle="album.artists.toString()" @click="SelectItem(album.id)">
                <template #prepend>
                    <v-avatar tile>
                        <v-img v-if="album.image" :src="album.image.toString()" />
                        <v-icon v-else icon="mdi-album" />
                    </v-avatar>
                </template>
            </v-list-item>
            <template v-slot:empty>
                <v-alert type="warning" title="No more albums" variant="outlined"></v-alert>
            </template>
            <template v-slot:error>
                <v-alert type="error" title="Error on fetching new albums" text="close this message to try again"
                    closable variant="outlined" @click:close="reset">
                </v-alert>
            </template>
        </v-infinite-scroll>
    </v-list>
</template>

<style scoped></style>
