<script lang="ts" setup>
import router from '@/router';
import type { Playlist } from '@/types/tapeify/models';

const props = defineProps<{
    playlists: Playlist[]
}>()

function SelectItem(id: string) {
    router.push({
        name: '/CassetteView',
        query: {
            id: id,
            type: 'playlist'
        }
    })
}
</script>

<template>
    <v-list lines="two" density="compact">
        <v-list-subheader> Playlists </v-list-subheader>
        <v-list-item v-for="playlist in playlists" :key="playlist.id" :title="playlist.name"
            :subtitle="playlist.owner" @click="SelectItem(playlist.id)">
            <template #prepend>
                <v-avatar tile>
                    <v-img v-if="playlist.image" :src="playlist.image.toString()" />
                    <v-icon v-else icon="mdi-playlist-music" />
                </v-avatar>
            </template>
            <v-divider />
        </v-list-item>
    </v-list>
</template>

<style scoped></style>