<script lang="ts" setup>
import router from '@/router';
import type { Album } from '@/types/tapeify/models';

const props = defineProps<{
    albums: Album[]
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
    <v-list lines="two" density="compact">
        <v-list-subheader> Albums </v-list-subheader>
        <v-list-item v-for="album in albums" :key="album.id" :title="album.name" :subtitle="album.artists.toString()"
            @click="SelectItem(album.id)">
            <template #prepend>
                <v-avatar tile>
                    <v-img v-if="album.image" :src="album.image.toString()" />
                    <v-icon v-else icon="mdi-album" />
                </v-avatar>
            </template>
            <v-divider />
        </v-list-item>
    </v-list>
</template>

<style scoped></style>
