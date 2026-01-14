<script lang="ts" setup>
import { useAnchorsStore } from '@/stores/anchor';
import { useSortingStore } from '@/stores/sorting';
import { useTracksStore } from '@/stores/tracks';

const tracksStore = useTracksStore()
const sortingStore = useSortingStore()
const anchorsStore = useAnchorsStore()

function onChanged(changeEvent: any) {
    const eventType = Object.keys(changeEvent)[0]
    switch (eventType) {
        case 'moved':
            break;
        case 'added':
            const trackId = changeEvent.added.element
            if (anchorsStore.isTrackAnchored(trackId)) {
                anchorsStore.removeAnchor(trackId)
            }
            tracksStore.MarkTrackAsUnavailable(changeEvent.added.element)
            break
        case 'removed':
            tracksStore.MarkTrackAsAvailable(changeEvent.removed.element)
            break
    }
}

const unavailableTracks = computed({
    get: () => tracksStore.unavailableTracks,
    set: () => { }
})

function trackClicked(trackId: string) {
    tracksStore.MarkTrackAsAvailable(trackId)
    sortingStore.sortTracks()
}
</script>

<template>
    <v-sheet color="secondary":rounded="true" class="pa-1">
        <v-list select-strategy="leaf" v-model:selected="tracksStore.unavailableTracks" color="secondary">
            <v-list-subheader class="text-subtitle-1" style="color: inherit">
                Unused Tracks
            </v-list-subheader>
            <draggable :list="tracksStore.unavailableTrackIds" group="tracks" item-key="id" animation="200"
                @change="onChanged" :sort="false" class="drag-container">
                <v-list-item v-for="track in unavailableTracks" :key="track.id" :value="track.id"
                    v-on:click="trackClicked(track.id)" class="pa-1">
                    <template v-slot:prepend>
                        <v-icon class="drag-handle" icon="mdi-drag-vertical" />
                        <v-avatar tile>
                            <v-img v-if="track.image" :src="track.image.href" />
                            <v-icon v-else icon="mdi-music" />
                        </v-avatar>
                    </template>
                    <v-list-item-title :title="track.name">{{ track.name }}</v-list-item-title>
                    <v-list-item-subtitle :title="track.artists.join()">{{ track.artists.join()
                        }}</v-list-item-subtitle>
                    <template v-slot:append>
                        <v-icon icon="mdi-restore" />
                    </template>
                </v-list-item>
            </draggable>
        </v-list>
    </v-sheet>
</template>

<style scoped>
.drag-container {
    min-height: 200px;
}
</style>