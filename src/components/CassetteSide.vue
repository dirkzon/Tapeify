<script setup lang="ts">
import { useCassetteStore } from '@/stores/cassette'
import { useSortingStore } from '@/stores/sorting'
import { UseTracksStore } from '@/stores/tracks'

const sortStore = useSortingStore()
const cassetteStore = useCassetteStore()
const trackStore = UseTracksStore()

const { getSides } = toRefs(cassetteStore)

const props = defineProps<{
    index: number
}>()

const prettySideDuration = computed({
    get() {
        const ms = getSides.value[props.index].duration_ms
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((ms % (1000 * 60)) / 1000)

        if (hours >= 1) {
            return `${hours} hr ${minutes} min`
        } else {
            return `${minutes} min ${seconds} sec`
        }
    },
    set(_) {}
})

const tracks = computed({
  get() {
    return getSides.value[props.index].tracks
  },
  set() {}
})

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
    for (var track of tracks.value) {
        if (track.anchored) {
            trackStore.UnAnchorTrack(track.id)
        }
    }

    cassetteStore.DeleteSide(props.index)
    sortStore.sortTracksInSides()
}
</script>

<template>
    <v-card flat class="mx-auto" max-width="700"> 
        <v-toolbar flat>
        <v-toolbar-title class="text-grey">
            {{ String.fromCharCode(97 + props.index).toUpperCase() }}
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
        <v-card-subtitle>{{ prettySideDuration }}</v-card-subtitle>
        <v-list lines="two" density="compact"> 
            <draggable 
                group="sides" 
                v-model="tracks"
                @change="AnchorTrack"
                @end="sortStore.sortTracksInSides()"
                >
                <track-item
                    v-for="(track, index) in tracks"
                    :key="track.id"
                    :track="track"
                    :side_index="props.index"
                    :track_index="index"
                    >
                </track-item>
            </draggable>
        </v-list>
    </v-card>
</template>