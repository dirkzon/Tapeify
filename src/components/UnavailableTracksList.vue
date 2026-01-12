<script lang="ts" setup>
import { useTracksStore } from '@/stores/tracks';

const tracksStore = useTracksStore()

function onChanged(changeEvent: any) {
    const eventType = Object.keys(changeEvent)[0]
    switch (eventType) {
        case 'moved':
            break;
        case 'added':
            console.log(changeEvent.added.element)
            tracksStore.MarkTrackAsUnavailable(changeEvent.added.element)
            break
        case 'removed':
            tracksStore.MarkTrackAsAvailable(changeEvent.removed.element)
            break
    }
}
</script>

<template>
    <v-list select-strategy="leaf" v-model:selected="tracksStore.unavailableTracks">
        <v-list-subheader>
            Unused Tracks
        </v-list-subheader>
        <draggable :list="tracksStore.unavailableTrackIds" group="tracks" item-key="id" animation="200" @change="onChanged">
            <v-list-item v-for="track in tracksStore.unavailableTracks" :key="track.id" :value="track.id" active-class="text-secondary">
                {{ track.name }}
            </v-list-item>
        </draggable>
    </v-list>
</template>