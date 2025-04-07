<script setup lang="ts">
import { type Track } from '@stores/tracks'
import { UseTracksStore } from '@/stores/tracks'
import { useSortingStore } from '@/stores/sorting'

const trackStore = UseTracksStore()
const sortStore = useSortingStore()

const props = defineProps<{
    track: Track
    side_index: number
    track_index: number
}>()

function getPrettyTrackDuration(): string {
  const ms = props.track.duration_ms
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)

  const pad = (num: number) => num.toString().padStart(2, '0')

  return `${pad(minutes)}:${pad(seconds)}`
}

function SetAnchor() {
    if (props.track.anchored) {       
        trackStore.UnAnchorTrack(props.track.id)
    } else {
        trackStore.AnchorTrack(props.side_index, props.track_index, props.track.id)
    }
    sortStore.sortTracksInSides()
}
</script>

<template>
    <v-hover v-slot:default="{ isHovering: trackHovering, props: trackHoverProps }">
        <v-list-item v-bind="trackHoverProps" :title="track.name" :subtitle="track.artists.join()">
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
                            getPrettyTrackDuration()
                        }}</small>
                    </v-list-item-action>
                    <v-list-item-action>
                        <v-icon v-if="track.explicit" icon="mdi-alpha-e-box" size="small" />
                        <v-hover v-slot:default="{ isHovering: lockHovering, props: lockHoverProps }">
                            <v-btn
                                v-bind="lockHoverProps"
                                @click="SetAnchor()"
                                v-if="trackHovering || track.anchored" 
                                flat size="x-small">
                                <v-icon v-if="track.anchored" :icon="lockHovering ? 'mdi-lock-open-variant' : 'mdi-lock'" size="medium"></v-icon>
                                <v-icon v-else :icon="lockHovering ? 'mdi-lock' : 'mdi-lock-open-variant'" size="medium"></v-icon>
                            </v-btn>
                        </v-hover>
                    </v-list-item-action>
                </v-list>
            </template>
            <v-divider />
        </v-list-item>
    </v-hover>
</template>