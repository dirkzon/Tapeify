<script lang="ts" setup>
import { useAnchorsStore } from '@/stores/anchor';
import { useLayoutStore } from '@/stores/layout';
import { useTracksStore } from '@/stores/tracks';

const tracksStore = useTracksStore()
const anchorsStore = useAnchorsStore()
const layoutStore = useLayoutStore()

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

function clearUnavailableTracks() {
    if (tracksStore.unavailableTrackIds.length === 0) {
        return;
    }
    for (const trackId of tracksStore.unavailableTrackIds) {
        tracksStore.MarkTrackAsAvailable(trackId)
    }
    layoutStore.calculateLayoutDebounced()
}
</script>

<template>
    <v-card class="ma-5" style="border-radius: 12px;" subtitle="Drag unwanted tracks here">
        <template v-slot:title>
            <span class="font-weight-black">Unused Tracks</span>
        </template>
        <v-divider class="mb-2" />
        <v-list select-strategy="leaf" v-model:selected="tracksStore.unavailableTracks" color="secondary">
            <draggable :list="tracksStore.unavailableTrackIds" group="tracks" item-key="id" animation="200"
                @change="onChanged" :sort="false" class="drag-container">
                <unavailable-cassette-item v-for="trackId in tracksStore.unavailableTrackIds" :key="trackId"
                    :track-id="trackId" />
            </draggable>
        </v-list>

        <template v-slot:actions>
            <v-btn variant="text" @click="clearUnavailableTracks" :disabled="tracksStore.unavailableTrackIds.length === 0">Clear List</v-btn>
        </template>
    </v-card>
</template>

<style scoped>
.drag-container {
    min-height: 200px;
}
</style>
