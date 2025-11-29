<script setup lang="ts">
import { useCassetteStore } from '@/stores/anchor'
import { useSortingStore } from '@/stores/sorting'
import { UseTracksStore } from '@/stores/tracks'

const sortStore = useSortingStore()
const cassetteStore = useCassetteStore()
const trackStore = UseTracksStore()

const { getSidePrettyDurtionByIndex, getSideTracksByIndex, getSideNameByIndex } = toRefs(cassetteStore)

const props = defineProps<{
    index: number
}>()

function AnchorTrack(changeEvent: any) {
    const eventType = Object.keys(changeEvent)[0]
    let trackIndex
    let trackId

    switch(eventType) {
        case 'moved':
            trackIndex = changeEvent.moved.newIndex
            trackId = changeEvent.moved.element.id
            trackStore.AnchorTrack(props.index, trackIndex, trackId)
            break;
        case 'added':
            trackIndex = changeEvent.added.newIndex
            trackId = changeEvent.added.element.id
            trackStore.AnchorTrack(props.index, trackIndex, trackId)
            break
        case 'removed':
            break
    }
}

function DeleteSide() {
    cassetteStore.DeleteSide(props.index)
    sortStore.sortTracksInSides()
}
</script>

<template>
    <v-card flat class="mx-auto" max-width="700"> 
        <v-toolbar flat>
        <v-toolbar-title class="text-grey">
            {{ getSideNameByIndex(props.index) }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
            v-if="index != 0"
            variant="plain"
            density="comfortable"
            icon="mdi-playlist-minus"
            @click="DeleteSide"
        />
        </v-toolbar>
        <v-card-subtitle>{{ getSidePrettyDurtionByIndex(props.index) }}</v-card-subtitle>
        <v-list lines="two" density="compact"> 
            <draggable 
                class="dragArea list-group w-full"
                :list="getSideTracksByIndex(props.index)"
                group="sides" 
                @change="AnchorTrack"
                @end="sortStore.sortTracksInSides()"
                >
                <div
                    class="list-group-item"
                    v-for="(track, trackIndex) in getSideTracksByIndex(props.index)"
                    :key="track.id"
                >
                    <track-item
                        :track="track"
                        :side_index="props.index"
                        :track_index="trackIndex"
                        >
                    </track-item>
                </div>
            </draggable>
        </v-list>
    </v-card>
</template>