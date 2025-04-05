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

function UnAnchorTrack(track_id: string) {
    trackStore.UnAnchorTrack(track_id)
    sortStore.sortTracksInSides()
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

function getPrettyTrackDuration(ms: number): string {
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)

  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(minutes)}:${pad(seconds)}`
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
            <v-list-item
                v-for="track in tracks"
                :key="track.id"
                :title="track.name"
                :subtitle="track.artists.join()"
                >
                <template #prepend>
                    <v-avatar tile>
                        <v-img v-if="track.image" :src="track.image.href" />
                        <v-icon v-else icon="mdi-music" />
                    </v-avatar>
                </template>
                <template #append>
                    <v-list>
                        <v-list-item-action class="flex-column align-end">
                        <small class="text-high-emphasis opacity-60">{{
                            getPrettyTrackDuration(track.duration_ms)
                        }}</small>
                        </v-list-item-action>
                        <v-list-item-action>
                            <v-icon v-if="track.explicit" icon="mdi-alpha-e-box" size="small" />

                            <v-hover v-slot:default="{ isHovering, props }">
                                <v-btn 
                                 v-bind="props"
                                    @click="UnAnchorTrack(track.id)" 
                                    v-if="track.anchored" 
                                    flat size="x-small">
                                    <v-icon :icon="isHovering? 'mdi-lock-open-variant' : 'mdi-lock'" size="medium"></v-icon>
                                </v-btn>
                            </v-hover>
                        </v-list-item-action>
                    </v-list>
                </template>
                <v-divider />
            </v-list-item>
        </draggable>
        </v-list>
        <v-card />
    </v-card>
</template>