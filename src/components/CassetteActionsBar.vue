<script lang="ts" setup>
import { useTracksStore } from '@/stores/tracks';
import { useAnchorsStore } from '@/stores/anchor';
import { useSortingStore } from '@/stores/sorting';
import { useHotkey } from 'vuetify/dist/vuetify.js';

const route = useRoute()

const showBar = computed(() => route.name === '/CassetteView')

const tracksStore = useTracksStore()
const anchorStore = useAnchorsStore()
const sortStore = useSortingStore()

const multipleSelected = computed(() => tracksStore.selectedTracks.length > 1)

useHotkey('ctrl+l', bulkAnchor)
useHotkey('ctrl+u', bulkUnanchor)

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
    sortStore.sortTracks()
    tracksStore.ClearSelectedTracks()
}

function bulkUnanchor() {
    for (const id of tracksStore.selectedTracks) {
        anchorStore.removeAnchor(id)
    }
    sortStore.sortTracks()
    tracksStore.ClearSelectedTracks()
}

</script>

<template>
    <v-app-bar v-if="showBar" class="included">
        <template v-slot:append>
            <v-btn icon @click="bulkUnanchor" :disabled="!multipleSelected">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-lock-open-remove</v-icon>
                    </template>
                    <span>Unanchor (Ctrl + U)</span>
                </v-tooltip>
            </v-btn>

            <v-btn icon @click="bulkAnchor" :disabled="!multipleSelected" class="ml-4">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon v-on="on">mdi-lock-plus</v-icon>
                    </template>
                    <span>Anchor (Ctrl + L)</span>
                </v-tooltip>
            </v-btn>
        </template>
    </v-app-bar>
</template>