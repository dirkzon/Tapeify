<script lang="ts" setup>
import { useTracksStore } from '@/stores/tracks';
import { useUnusedTracksStore } from '@/stores/unused-tracks';
import type { Track } from '@/types/tapeify/models';

const unusedTracksStore = useUnusedTracksStore()
const tracksStore = useTracksStore()

const unusedTracks: ComputedRef<Track[]> = computed(() => {
    return unusedTracksStore.trackIds.map((id: string) => tracksStore.GetTrackById(id)).filter((track): track is Track => track !== undefined)
})

function onChanged(changeEvent: any) {
    const eventType = Object.keys(changeEvent)[0]
    switch (eventType) {
        case 'moved':
            break;
        case 'added':
            unusedTracksStore.addUnusedTrack(changeEvent.added.element)
            break
        case 'removed':
            unusedTracksStore.addUnusedTrack(changeEvent.added.element)
            break
    }
}
</script>

<template>
    <v-list select-strategy="leaf" v-model:selected="unusedTracks">
        <v-list-subheader>
            Unused Tracks
        </v-list-subheader>
        <draggable :list="unusedTracks" group="tracks" item-key="id" animation="200" @change="onChanged">
            <v-list-item v-for="track in unusedTracks" :key="track.id" :value="track.id" active-class="text-secondary">
                {{ track.name }}
            </v-list-item>
        </draggable>
    </v-list>
</template>