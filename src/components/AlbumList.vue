<script lang="ts" setup>
import router from '@/router';
import type { Album } from '@/types/tapeify/models';

const props = defineProps<{
    albums: Album[]
    loading: boolean
    loadingItemCount?: number
}>()

const itemCount = computed(() => props.loadingItemCount ?? 5);

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
        <v-list-subheader> Albums </v-list-subheader>

        <template v-if="loading">
            <v-list-item v-for="(_, i) in Array.from({ length: itemCount })" :key="i" class="w-100 m-0 pt-0 pb-0">
                <template #prepend>
                    <v-avatar tile>
                        <v-skeleton-loader type="image" width="40" height="40" />
                    </v-avatar>
                </template>

                <template #title>
                    <v-skeleton-loader type="list-item-two-line" />
                </template>
            </v-list-item>
        </template>
        <template v-else>
            <v-list-item v-for="album in albums" :key="album.id" :title="album.name"
                :subtitle="album.artists.toString()" @click="SelectItem(album.id)">
                <template #prepend>
                    <v-avatar tile>
                        <v-img v-if="album.image" :src="album.image.toString()" />
                        <v-icon v-else icon="mdi-album" />
                    </v-avatar>
                </template>
            </v-list-item>
        </template>
    </v-list>
</template>

<style scoped></style>
