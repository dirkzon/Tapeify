<script lang="ts" setup>
import { useTracksStore } from '@/stores/tracks';
import { useAnchorsStore } from '@/stores/anchor';
import { useSortingStore } from '@/stores/sorting';


const route = useRoute()

const showBar = computed(() => route.name === '/CassetteView')

const tracksStore = useTracksStore()
const anchorStore = useAnchorsStore()
const sortStore = useSortingStore()

const multipleSelected = computed(() => tracksStore.selectedTracks.length > 1)

function bulkAnchor() {
    for (const id of tracksStore.selectedTracks) {

        const trackLayout = sortStore.getTrackLayout(id)
        if (!trackLayout) {
            continue
        }
        anchorStore.anchorTrack({
            cassetteId: trackLayout.cassetteId,
            trackId: id,
            sideIndex: trackLayout.sideIndex,
            positionIndex: trackLayout.position
        })
    }
}

function bulkUnanchor() {
    for (const id of tracksStore.selectedTracks) {
        anchorStore.removeAnchor(id)
    }
}

</script>

<template>
    <v-app-bar v-if="showBar" class="included">
        <template v-slot:append>
            <v-btn icon="mdi-lock-open-remove" :disabled="!multipleSelected" @click="bulkUnanchor"></v-btn>

            <v-btn icon="mdi-lock-plus" :disabled="!multipleSelected" @click="bulkAnchor"></v-btn>

        </template>
    </v-app-bar>
</template>