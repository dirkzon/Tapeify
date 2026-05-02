<script lang="ts" setup>
import { usePlayerStore } from '@/stores/player';
import { useTracksStore } from '@/stores/tracks';

const playerStore = usePlayerStore();
const trackStore = useTracksStore();

onMounted(async () => {
    await playerStore.fetchAvailableDevices()
    await playerStore.fetchPlaybackState()
})

async function pause() {
    await playerStore.pausePlayback()
    await playerStore.fetchPlaybackState()
}

// async function play() {
//     await playerStore.pausePlayback()
//     await playerStore.fetchPlaybackState() 
// }
</script>

<template>
    <v-app-bar location="bottom" v-if="playerStore.spotify_playback_state">
        <v-spacer />
        <v-btn v-if="playerStore.spotify_playback_state.is_playing" icon="mdi-pause" @click="pause" />
        <v-btn v-else icon="mdi-play" />
        <v-spacer />

        <template v-slot:append>
            <v-select :items="playerStore.available_devices" v-model="playerStore.selected_device" item-value="id"
                @update:modelValue="playerStore.transferPlayback" :menu-icon="null">
                <template #item="{ props, item }">
                    <v-list-item v-bind="props" :prepend-icon="item.raw.icon" :title="item.raw.name"
                        active-color="primary" />
                </template>
                <template #selection="{ item }">
                    <v-icon>{{ item.raw.icon }}</v-icon>
                </template>
            </v-select>
        </template>
    </v-app-bar>
</template>