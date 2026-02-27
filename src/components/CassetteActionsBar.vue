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

           <v-tooltip text="bulk unanchor (Ctrl + U)" location="bottom">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon @click="bulkUnanchor" :disabled="!multipleSelected">
                        <v-icon>mdi-lock-open-remove</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

            <v-tooltip text="Bulk anchor (Ctrl + L)" location="bottom">
                <template #activator="{ props }">
                    <v-btn v-bind="props" icon class="ml-4" @click="bulkAnchor" :disabled="!multipleSelected">
                        <v-icon>mdi-lock-plus</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

        </template>
    </v-app-bar>
</template>